// mova:engine
/**
 * Pack validator — structure checks plus the golden-fixture run, entirely offline.
 *
 *   node scripts/packcheck.mjs <code>        exit 0 clean, 1 on any failure
 *
 * A pack states language facts that will be TAUGHT, so the bar is the one packs/SPEC.md
 * sets: manifest complete and self-consistent, tables in the documented shape, and every
 * golden fixture reproducing the expected behavior through the same seam the workspace
 * uses (`loadPack()` → `createClassifier()`). The goldens are the pack's behavior proof —
 * for packs/ro they encode limba's actual classifier output, so this check is also the
 * engine split's behavior-identity proof.
 *
 * What is enforced:
 *   - pack.md parses via loadPack(); `language`/`code`/`inflection` present, `code`
 *     matches the directory, `inflection` is literally true/false;
 *   - manifest `genders:` equals TABLES.genders — one fact, two copies, they move together;
 *   - TABLES shape: typeLabel covers types, tags map into types, genders are tags,
 *     article keys are genders, `other` (if set) is a types key, "phrase"/"pattern"
 *     present, endings sorted longest-first;
 *   - golden/words.json: classify() matches every expectation, and the residue rate
 *     (null + the `other` facet) stays under 20% — a pack whose words mostly land in the
 *     residue has empty tables, not a permissive language;
 *   - golden/pairs.json (required when inflection): markPair() matches exactly;
 *   - golden/normalize.json: normalize() matches exactly;
 *   - `dictionary:` declared ⇒ dictionary.mjs exists and createAdapter() yields
 *     {source, lookup} — instantiated but NEVER called: packcheck stays off the network
 *     (factcheck.mjs is the tool that goes online).
 *
 * scripts/packcheck.test.ts runs check() for every packs/<code>/ with a pack.md
 * (template excluded), so CI holds every shipped pack to this contract.
 */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";
import { loadPack } from "./pack.mjs";
import { createClassifier } from "./pos.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/** Residue ceiling: the fraction of words.json allowed to classify to null or `other`. */
const OTHER_MAX = 0.2;

function readJson(path, errors) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (e) {
    errors.push(`${path}: ${e.message}`);
    return null;
  }
}

export async function check(code, repoRoot = root) {
  const errors = [];
  const warnings = [];
  const dir = join(repoRoot, "packs", code);

  let pack;
  try {
    pack = await loadPack(code, repoRoot);
  } catch (e) {
    return { ok: false, errors: [`loadPack failed: ${e.message}`], warnings };
  }
  const { manifest, tables } = pack;

  // ── Manifest ────────────────────────────────────────────────────────────────
  for (const key of ["language", "code", "inflection"]) {
    if (!manifest[key]) errors.push(`pack.md: required manifest key "${key}" is missing or empty`);
  }
  if (manifest.code && manifest.code !== code) {
    errors.push(`pack.md: code "${manifest.code}" does not match directory "packs/${code}/"`);
  }
  if (manifest.inflection && !["true", "false"].includes(manifest.inflection)) {
    errors.push(`pack.md: inflection must be "true" or "false", got "${manifest.inflection}"`);
  }
  const inflection = manifest.inflection === "true";

  // ── Tables shape ────────────────────────────────────────────────────────────
  if (!Array.isArray(tables?.types) || tables.types.length === 0) {
    errors.push("pos-tables.mjs: TABLES.types must be a non-empty array of {key, label}");
    return { ok: false, errors, warnings };
  }
  const typeKeys = new Set(tables.types.map((t) => t.key));
  for (const t of tables.types) {
    if (!t.key || !t.label) errors.push(`types: entry ${JSON.stringify(t)} needs key and label`);
    if (!tables.typeLabel?.[t.key]) errors.push(`typeLabel: no singular label for "${t.key}"`);
  }
  for (const engineFacet of ["phrase", "pattern"]) {
    if (!typeKeys.has(engineFacet)) {
      errors.push(`types: must include "${engineFacet}" — the engine assigns it itself`);
    }
  }
  for (const [tag, facet] of Object.entries(tables.tags ?? {})) {
    if (!typeKeys.has(facet)) errors.push(`tags: "${tag}" maps to unknown facet "${facet}"`);
  }
  const tableGenders = tables.genders ?? [];
  for (const g of tableGenders) {
    if (!(g in (tables.tags ?? {}))) errors.push(`genders: "${g}" is not a key of tags`);
  }
  const manifestGenders = (manifest.genders ?? "").split(/[,\s]+/).filter(Boolean);
  if (manifestGenders.join(" ") !== tableGenders.join(" ")) {
    errors.push(
      `manifest genders "${manifestGenders.join(" ")}" != TABLES.genders "${tableGenders.join(" ")}" — one fact, two copies, they move together`,
    );
  }
  for (const g of Object.keys(tables.article ?? {})) {
    if (!tableGenders.includes(g)) errors.push(`article: key "${g}" is not a declared gender`);
  }
  if (tables.other != null && !typeKeys.has(tables.other)) {
    errors.push(`other: "${tables.other}" is not a types key`);
  }
  const endings = tables.endings ?? [];
  for (let i = 1; i < endings.length; i++) {
    if (endings[i].length > endings[i - 1].length) {
      errors.push(`endings: "${endings[i]}" after shorter "${endings[i - 1]}" — list must be longest-first`);
      break;
    }
  }
  if (inflection && endings.length === 0) {
    warnings.push("inflection: true but endings is empty — markPair will mark pure stem diffs only");
  }

  const cls = createClassifier(tables);
  const normalize = pack.normalize;

  // ── golden/words.json ───────────────────────────────────────────────────────
  const wordsPath = join(dir, "golden", "words.json");
  if (!existsSync(wordsPath)) {
    errors.push("golden/words.json missing — the pack has no classification proof");
  } else {
    const words = readJson(wordsPath, errors);
    if (Array.isArray(words) && words.length) {
      let residue = 0;
      for (const w of words) {
        const got = cls.classify(w.target, w.id ?? "");
        if (got !== w.expected) {
          errors.push(`words.json: classify(${JSON.stringify(w.target)}, "${w.id}") → ${JSON.stringify(got)}, expected ${JSON.stringify(w.expected)}`);
        }
        if (got === null || (tables.other != null && got === tables.other)) residue++;
      }
      const rate = residue / words.length;
      if (rate >= OTHER_MAX) {
        errors.push(
          `words.json: ${residue}/${words.length} words land in the residue (null or "${tables.other}") — ` +
            `≥${OTHER_MAX * 100}%; the tag grammar is too sparse to teach with (SPEC rule 4)`,
        );
      }
      if (!words.some((w) => w.expected === null)) {
        warnings.push("words.json: no null-expectation fixture — the CI-failure case is unproven");
      }
    } else if (Array.isArray(words)) {
      errors.push("golden/words.json is empty");
    }
  }

  // ── golden/pairs.json ───────────────────────────────────────────────────────
  const pairsPath = join(dir, "golden", "pairs.json");
  if (!existsSync(pairsPath)) {
    if (inflection) errors.push("golden/pairs.json missing — required while inflection: true");
  } else {
    const pairs = readJson(pairsPath, errors);
    if (Array.isArray(pairs)) {
      for (const p of pairs) {
        const got = cls.markPair(p.sg, p.pl);
        if (got.sg !== p.expected?.sg || got.pl !== p.expected?.pl) {
          errors.push(
            `pairs.json: markPair("${p.sg}", "${p.pl}") → ${JSON.stringify(got)}, expected ${JSON.stringify(p.expected)}`,
          );
        }
      }
    }
  }

  // ── golden/normalize.json ───────────────────────────────────────────────────
  const normPath = join(dir, "golden", "normalize.json");
  if (!existsSync(normPath)) {
    errors.push("golden/normalize.json missing — the folding map has no proof");
  } else {
    const fixtures = readJson(normPath, errors);
    if (Array.isArray(fixtures)) {
      for (const f of fixtures) {
        const got = normalize(f.input);
        if (got !== f.expected) {
          errors.push(
            `normalize.json: normalize(${JSON.stringify(f.input)}) → ${JSON.stringify(got)}, expected ${JSON.stringify(f.expected)}${f.note ? ` (${f.note})` : ""}`,
          );
        }
      }
    }
  }

  // ── dictionary declaration ──────────────────────────────────────────────────
  const dictDeclared = Boolean(manifest.dictionary);
  const dictPath = join(dir, "dictionary.mjs");
  if (dictDeclared && !existsSync(dictPath)) {
    errors.push(`manifest declares dictionary "${manifest.dictionary}" but dictionary.mjs does not exist`);
  } else if (dictDeclared) {
    try {
      const mod = await import(pathToFileURL(dictPath).href);
      const adapter = mod.createAdapter();
      if (typeof adapter?.source !== "string" || !adapter.source || adapter.source === "none") {
        errors.push("dictionary.mjs: adapter.source must be a non-empty name (and not \"none\")");
      }
      if (typeof adapter?.lookup !== "function") {
        errors.push("dictionary.mjs: adapter.lookup must be a function");
      }
      // Never call lookup() here — packcheck stays off the network.
    } catch (e) {
      errors.push(`dictionary.mjs: createAdapter() failed: ${e.message}`);
    }
  } else if (existsSync(dictPath)) {
    warnings.push("dictionary.mjs exists but the manifest's dictionary: key is empty — declare it");
  }

  return { ok: errors.length === 0, errors, warnings };
}

// ── CLI ───────────────────────────────────────────────────────────────────────
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const code = process.argv[2];
  if (!code || code.startsWith("--")) {
    console.error("usage: node scripts/packcheck.mjs <code>");
    process.exit(2);
  }
  const { ok, errors, warnings } = await check(code);
  for (const w of warnings) console.warn(`  ⚠ ${w}`);
  if (!ok) {
    console.error(`packs/${code}: FAIL`);
    for (const e of errors) console.error(`  ✗ ${e}`);
    process.exit(1);
  }
  console.log(`packs/${code}: ok${warnings.length ? ` (${warnings.length} warning${warnings.length === 1 ? "" : "s"})` : ""}`);
}
