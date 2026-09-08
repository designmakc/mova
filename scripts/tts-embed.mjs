// mova:engine
/**
 * Fills audio placeholders in a generated visual with playable neural TTS.
 *
 * Visuals must be self-contained (docs/mechanics/media.md), and the learner must never
 * need a terminal to hear the target language — so audio is inlined as base64 data URIs
 * rather than linked. Generation goes through the pack's edge voice and the same cache as
 * scripts/speak.sh (identical key: sha1 of "voice|slow|text", first 32 hex chars), so a
 * phrase spoken in a session is already cached for embedding, and vice versa.
 *
 * Usage:
 *   node scripts/tts-embed.mjs work/visuals/2026-07-30_sounds.html
 *
 * Author the visual with empty placeholders; this fills them in place:
 *   <div class="tts" data-text="Bună ziua!" data-en="Good day!"></div>
 *   <div class="tts" data-text="fată. fata." data-en="a girl. the girl." data-slow></div>
 *
 * (`data-en` is the support-language gloss — the attribute name is part of the page
 * contract and predates the rename, so it stays.)
 *
 * Already-filled placeholders are left alone, so re-running after adding new ones is safe.
 * Requires edge-tts (uv tool) and a profile with `tts: edge`; exits non-zero otherwise —
 * a visual that silently ships without audio is worse than one that fails loudly
 * (limba, 2026-08-12: a page with dead audio reached the learner).
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import { loadProfile } from "./profile.mjs";
import { loadPack } from "./pack.mjs";
import { ttsCache } from "./tts-cache.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CACHE = join(ROOT, ".tts-cache");
const EDGE = `${process.env.HOME}/.local/bin/edge-tts`;

const profile = loadProfile();
if (!profile) {
  console.error("tts-embed: no docs/reference/profile.md — this is template mode. Run setup first.");
  process.exit(1);
}
// Same verdict as deck.mjs and tts-warm.mjs (tts-cache.mjs). Unlike the warmer this stays an
// exit 1: a page authored with audio placeholders that ships mute is the failure named above.
const cache = ttsCache(profile);
if (!cache.on) {
  console.error(
    `tts-embed: ${cache.why}\n` +
      `           Embedding needs the cache. Set tts: edge in the profile, or author the page mute.`,
  );
  process.exit(1);
}
const pack = await loadPack();
const VOICE = process.env.MOVA_VOICE || pack.manifest.tts_edge;
if (!VOICE) {
  console.error(`tts-embed: packs/${pack.code}/pack.md declares no tts_edge voice and MOVA_VOICE is unset.`);
  process.exit(1);
}

const target = process.argv[2];
if (!target) {
  console.error("usage: node scripts/tts-embed.mjs <visual.html>");
  process.exit(1);
}
if (!existsSync(EDGE)) {
  console.error(`edge-tts not found at ${EDGE} — install it (uv tool install edge-tts) or the visual ships mute`);
  process.exit(1);
}

const file = resolve(target);
let html = readFileSync(file, "utf8");
mkdirSync(CACHE, { recursive: true });

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function base64For(text, slow) {
  const key = createHash("sha1").update(`${VOICE}|${slow ? 1 : 0}|${text}`).digest("hex").slice(0, 32);
  const mp3 = join(CACHE, `${key}.mp3`);
  if (!existsSync(mp3)) {
    const args = ["--voice", VOICE, "--text", text, "--write-media", mp3];
    if (slow) args.splice(2, 0, "--rate=-25%");
    execFileSync(EDGE, args, { stdio: "ignore" });
  }
  return readFileSync(mp3).toString("base64");
}

const attr = (attrs, name) => attrs.match(new RegExp(`${name}="([^"]*)"`))?.[1];

// Continue numbering after the highest existing ttsN — filling a new placeholder in an
// already-embedded file must never mint a duplicate id (getElementById returns the first
// match, silently wiring the new button to the wrong audio; found live in limba,
// 2026-08-10).
let n = Math.max(-1, ...[...html.matchAll(/\bid="tts(\d+)"/g)].map((m) => Number(m[1]))) + 1;
const first = n; // so "how many were filled THIS run" survives re-runs (limba counted from 0)
html = html.replace(/<div class="tts"([^>]*)><\/div>/g, (_m, attrs) => {
  const text = attr(attrs, "data-text");
  if (!text) throw new Error("a .tts placeholder has no data-text");
  const en = attr(attrs, "data-en") || "";
  // data-text is spoken; data-en is printed. A data-text carrying its own translation
  // makes the voice read the answer aloud — through the one channel a reveal cannot
  // conceal — and browse mode plays exactly that clip by default. Found on ten of twenty
  // rows of a generated German page, voicing "Guten Morgen. Good morning." (2026-08-15).
  // Compared on words, so an incidental shared token (a name, a loanword, a number)
  // does not trip it; three consecutive gloss words inside the spoken text does.
  if (en) {
    const words = (s) => s.toLowerCase().match(/\p{L}+/gu) ?? [];
    const spoken = words(text).join(" ");
    const gloss = words(en);
    for (let i = 0; i + 2 < gloss.length; i++) {
      const run = gloss.slice(i, i + 3).join(" ");
      if (spoken.includes(run)) {
        throw new Error(
          `a .tts placeholder speaks its own translation:\n` +
            `  data-text="${text}"\n  data-en="${en}"\n` +
            `data-text is the TARGET LANGUAGE ONLY — the gloss belongs in data-en, which ` +
            `is printed and never voiced (docs/visual/SPEC.md).`,
        );
      }
    }
  }
  const slow = /\bdata-slow\b/.test(attrs);
  const id = `tts${n++}`;
  return `<div class="tts-row">
        <button class="tts-play" data-a="${id}" aria-label="Play">▶</button>
        <div class="tts-label"><b lang="${esc(pack.code)}">${esc(text)}</b>${en ? `<div class="tts-en">${esc(en)}</div>` : ""}</div>
        <audio id="${id}" preload="none" src="data:audio/mpeg;base64,${base64For(text, slow)}"></audio>
      </div>`;
});

const filled = n - first;
if (filled === 0) {
  console.log("no unfilled .tts placeholders — nothing to do");
  process.exit(0);
}

// Shared player CSS + JS, injected once per file.
if (!html.includes("<!--tts-player-->")) {
  html = html.replace(
    "</body>",
    `<!--tts-player-->
<style>
  .tts-row{display:grid;grid-template-columns:2.4rem 1fr;gap:.8rem;align-items:center;
    padding:.55rem 0;border-bottom:1px solid var(--line)}
  .tts-row:last-of-type{border-bottom:0}
  .tts-play{width:2.4rem;height:2.4rem;border-radius:50%;border:1px solid var(--line);
    background:var(--bg);color:var(--fg);font-size:.85rem;cursor:pointer;line-height:1;flex:none}
  .tts-play:hover{background:var(--hiBg);border-color:var(--hi)}
  .tts-play.on{background:var(--hi);color:var(--bg);border-color:var(--hi)}
  .tts-label b{font-weight:600}
  .tts-en{color:var(--muted);font-size:.86rem}
</style>
<script>
  document.querySelectorAll('.tts-play').forEach(function(b){
    var el=document.getElementById(b.dataset.a);
    b.addEventListener('click',function(){
      document.querySelectorAll('audio').forEach(function(o){if(o!==el){o.pause();o.currentTime=0;}});
      document.querySelectorAll('.tts-play').forEach(function(o){if(o!==b){o.classList.remove('on');o.textContent='▶';}});
      if(el.paused){el.play();b.classList.add('on');b.textContent='❚❚';}
      else{el.pause();el.currentTime=0;b.classList.remove('on');b.textContent='▶';}
    });
    el.addEventListener('ended',function(){b.classList.remove('on');b.textContent='▶';});
  });
</script>
</body>`,
  );
}

writeFileSync(file, html);
console.log(`embedded ${filled} clip${filled === 1 ? "" : "s"} (${VOICE}) → ${(Buffer.byteLength(html) / 1024).toFixed(0)} KB`);
