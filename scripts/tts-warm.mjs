// mova:engine
/**
 * Fills the TTS cache for every drillable ledger row, so the deck ships with sound on
 * all of them instead of on whichever words a past session happened to speak aloud.
 *
 * This is the network-touching sibling of `scripts/deck.mjs`. That split is the point:
 * deck.mjs is safe to run mid-session and offline because it only ever READS the cache,
 * and it stays that way. Anything that has to reach the neural voice service lives here
 * and is run deliberately — normally once after new vocabulary is added, before the
 * close-out regenerates the deck:
 *
 *   node scripts/tts-warm.mjs && node scripts/deck.mjs
 *
 * Usage:
 *   node scripts/tts-warm.mjs          # generate every missing clip
 *   node scripts/tts-warm.mjs --dry    # list what is missing, generate nothing
 *
 * Same voice, same cache, same sha1 key as speak.sh and tts-embed.mjs, and the same
 * sentence-per-row as the deck (the pack classifier's `speech`), so a clip warmed here is
 * the clip the deck embeds and the one `speak.sh` replays instantly.
 *
 * Tier 0 rows are seeded-not-taught and never drilled, so they are not spoken either.
 * Read-only except for the cache. Zero dependencies.
 */
import { readFileSync, existsSync, mkdirSync, statSync, rmSync } from "node:fs";
import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { loadProfile } from "./profile.mjs";
import { loadPack } from "./pack.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const CACHE = join(root, ".tts-cache");
const EDGE = `${process.env.HOME}/.local/bin/edge-tts`;
/** Polite with the service and still under a minute for a whole ledger. */
const LANES = 4;

const profile = loadProfile();
if (!profile) {
  console.error("tts-warm: no docs/reference/profile.md — this is template mode. Run setup first.");
  process.exit(1);
}
if (profile.get("tts", "none") !== "edge") {
  console.error(
    `tts-warm: profile says tts: ${profile.get("tts", "none")} — the cache holds edge-voice ` +
      `clips only, so there is nothing to warm. Set tts: edge in the profile to enable deck audio.`,
  );
  process.exit(1);
}
const pack = await loadPack();
const { createClassifier } = await import("./pos.mjs");
const { speech } = createClassifier(pack.tables);
const VOICE = process.env.MOVA_VOICE || pack.manifest.tts_edge;
if (!VOICE) {
  console.error(`tts-warm: packs/${pack.code}/pack.md declares no tts_edge voice and MOVA_VOICE is unset.`);
  process.exit(1);
}

const dry = process.argv.includes("--dry");

function ledgerRows(file) {
  const out = [];
  for (const line of readFileSync(join(root, "state", file), "utf8").split("\n")) {
    const t = line.trim();
    if (!t.startsWith("|") || !t.endsWith("|")) continue;
    const c = t.slice(1, -1).split("|").map((x) => x.trim());
    if (c.length !== 8 || c[0] === "id" || c[0].startsWith("---")) continue;
    if (Number(c[3]) < 1) continue;
    out.push({ id: c[0], target: c[1], text: speech(c[1], c[0]) });
  }
  return out;
}

const rows = [...ledgerRows("vocab.md"), ...ledgerRows("grammar.md")];
for (const r of rows) {
  r.key = createHash("sha1").update(`${VOICE}|0|${r.text}`).digest("hex").slice(0, 32);
  r.mp3 = join(CACHE, `${r.key}.mp3`);
}

// Two rows can legitimately want the same sentence; generate it once.
const missing = [];
const seen = new Set();
for (const r of rows) {
  if (seen.has(r.key)) continue;
  seen.add(r.key);
  if (existsSync(r.mp3) && statSync(r.mp3).size > 0) continue;
  missing.push(r);
}

console.log(
  `${rows.length} drillable rows · ${rows.length - missing.length} already voiced · ${missing.length} to generate` +
    ` (voice ${VOICE})`,
);
if (dry) {
  for (const r of missing) console.log(`  ${r.id}  ${r.text}`);
  process.exit(0);
}
if (!missing.length) process.exit(0);

if (!existsSync(EDGE)) {
  console.error(
    `edge-tts not found at ${EDGE} — install it (uv tool install edge-tts). ` +
      `Without it the deck ships with sound on only the rows a session happened to speak.`,
  );
  process.exit(1);
}
mkdirSync(CACHE, { recursive: true });

const run = (r) =>
  new Promise((resolve) => {
    execFile(EDGE, ["--voice", VOICE, "--text", r.text, "--write-media", r.mp3], (err) => {
      // A half-written file is worse than none: the deck would embed silence and the cache
      // would never retry it.
      const ok = !err && existsSync(r.mp3) && statSync(r.mp3).size > 0;
      if (!ok && existsSync(r.mp3)) rmSync(r.mp3);
      resolve({ r, ok });
    });
  });

let next = 0, done = 0;
const failed = [];
async function lane() {
  while (next < missing.length) {
    const r = missing[next++];
    const { ok } = await run(r);
    done++;
    if (!ok) failed.push(r);
    // Only when someone is watching — piped into a log, the carriage returns are noise.
    if (process.stdout.isTTY) process.stdout.write(`\r  ${done}/${missing.length} …`);
  }
}
await Promise.all(Array.from({ length: Math.min(LANES, missing.length) }, lane));
if (process.stdout.isTTY) process.stdout.write("\r");

console.log(`generated ${done - failed.length} clip(s) into .tts-cache/`);
if (failed.length) {
  console.error(`FAILED ${failed.length}:\n  ` + failed.map((r) => `${r.id} ${r.text}`).join("\n  "));
  process.exit(1);
}
console.log("now run: node scripts/deck.mjs");
