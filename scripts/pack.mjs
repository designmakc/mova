// mova:engine
/**
 * The single import point for the active language pack.
 *
 * A pack lives in `packs/<code>/`:
 *   pack.md         manifest — prose + one ```mova-config block (same parser as the profile)
 *   pos-tables.mjs  exports TABLES: the language's POS tag grammar + inflection endings
 *   normalize.mjs   exports normalize(s): input look-alike folding (keyboard dead-keys etc.)
 *   dictionary.mjs  OPTIONAL — exports createAdapter() per scripts/dictionary.mjs
 *   notes.md        prose language facts feeding setup's transfer/taxonomy generation
 *   golden/         fixtures packcheck.mjs runs in CI
 *
 * Manifest keys (pack.md):
 *   language: Romanian        code: ro
 *   genders: m f n            # empty line ⇒ no grammatical gender; drives --g-* tokens
 *   inflection: true          # false ⇒ no morpheme-marking machinery anywhere
 *   level_scale: A1 A2 B1 B2 C1 C2
 *   tts_edge: ro-RO-EmilNeural
 *   tts_say: Ioana
 *   stt_lang: ro              # whisper language flag, when speech-to-text is available
 *   required_fact: eu-form    # the one unpredictable fact a ledger row must carry, or blank
 *   dictionary: dexonline     # blank ⇒ null adapter, facts need tutor/unverified marking
 *
 * loadPack() resolves the code from the profile (`pack:`), or takes it explicitly —
 * packcheck.mjs validates packs that no profile points at yet. Everything downstream
 * (deck.mjs, ledgers.test.ts, factcheck.mjs, visualcheck.mjs) imports THIS module and
 * never a pack file directly: the pack layout may evolve; this seam is the contract.
 */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";
import { loadProfile } from "./profile.mjs";
import { nullAdapter } from "./dictionary.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function parseConfigBlock(path, text) {
  const m = /```mova-config\n([\s\S]*?)```/.exec(text);
  if (!m) throw new Error(`${path}: no \`\`\`mova-config block found.`);
  const config = {};
  for (const rawLine of m[1].split("\n")) {
    const line = rawLine.replace(/#.*$/, "").trim();
    if (!line) continue;
    const kv = /^([a-z][a-z0-9_]*):\s*(.*)$/.exec(line);
    if (!kv) throw new Error(`${path}: unparseable config line "${rawLine.trim()}"`);
    config[kv[1]] = kv[2].trim();
  }
  return config;
}

export async function loadPack(code = undefined, repoRoot = root) {
  if (!code) {
    const profile = loadProfile(repoRoot);
    if (!profile) {
      throw new Error(
        "loadPack: no pack code given and no profile exists — template mode has no active " +
          "pack. Pass a code explicitly (packcheck does) or run setup first.",
      );
    }
    code = profile.require("pack");
  }
  const dir = join(repoRoot, "packs", code);
  const manifestPath = join(dir, "pack.md");
  if (!existsSync(manifestPath)) {
    throw new Error(`loadPack: packs/${code}/pack.md not found.`);
  }
  const manifest = parseConfigBlock(`packs/${code}/pack.md`, readFileSync(manifestPath, "utf8"));

  const tablesMod = await import(pathToFileURL(join(dir, "pos-tables.mjs")).href);
  const normalizeMod = await import(pathToFileURL(join(dir, "normalize.mjs")).href);

  let dictionary = nullAdapter();
  const dictPath = join(dir, "dictionary.mjs");
  if (existsSync(dictPath)) {
    const dictMod = await import(pathToFileURL(dictPath).href);
    dictionary = dictMod.createAdapter();
  }

  const genders = (manifest.genders || "").split(/[,\s]+/).filter(Boolean);
  return {
    code,
    dir,
    manifest,
    genders,
    inflection: manifest.inflection === "true",
    levelScale: (manifest.level_scale || "A1 A2 B1 B2 C1 C2").split(/[,\s]+/).filter(Boolean),
    requiredFact: manifest.required_fact || null,
    tables: tablesMod.TABLES,
    normalize: normalizeMod.normalize,
    dictionary,
  };
}
