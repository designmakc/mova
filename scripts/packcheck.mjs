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
 * WHAT THIS FILE LEARNED THE HARD WAY. The first agent-generated pack (German, 2026-08-15)
 * printed `packs/de: ok` while being hollow: a LOOKALIKES map whose every entry mapped a
 * letter to itself, six normalize fixtures that were all identity cases (the set passed
 * against `s => s`), `inflection: false` sitting above a words.json full of Bücher/Männer/
 * Häuser, an empty `required_fact:` that silently disabled the ledger guard, and four
 * error-taxonomy rows whose "wrong" and "corrected" forms were the same string. Every one
 * of those was already forbidden in SPEC prose and enforced by nothing. The checks below
 * exist so shape-compliance is no longer enough — a pack must now show BEHAVIOR, and a
 * pack that turns a guard off must say so out loud.
 *
 * What is enforced:
 *   - pack.md parses via loadPack(); `language`/`code`/`inflection` present, `code`
 *     matches the directory, `inflection` is literally true/false;
 *   - every manifest key SPEC allows to be empty, left empty, is NAMED in the pack prose
 *     (or in a `#` comment on its own line) — silence is not a justification;
 *   - manifest `genders:` equals TABLES.genders — one fact, two copies, they move together;
 *   - TABLES shape: typeLabel covers types, tags map into types, genders are tags,
 *     article keys are genders, `other` (if set) is a types key, "phrase"/"pattern"
 *     present, endings sorted longest-first;
 *   - `inflection: false` is cross-examined against the pack's OWN data: `endings` must be
 *     empty, and no golden row may carry a second form differing from its headword;
 *   - normalize.mjs actually folds: no identity LOOKALIKES entry, no NFD key (dead after
 *     the NFC pass), and every fold the pack.md prose CLAIMS is run through normalize();
 *   - golden/words.json: classify() matches every expectation, every facet is exercised,
 *     ids and targets are unique, and the residue rate (null + the `other` facet) stays
 *     under 20% — a pack whose words mostly land in the residue has empty tables, not a
 *     permissive language;
 *   - golden/pairs.json (required when inflection): markPair() matches exactly;
 *   - golden/normalize.json: normalize() matches exactly, AND the set proves folding —
 *     at least one `input !== expected` case and at least one NFD-input case;
 *   - notes.md exists, and its error-taxonomy example rows are self-consistent: the ✗ form
 *     must differ from the corrected form, and a false-friend row must correct into the
 *     target language rather than at the held-language look-alike (exported as
 *     lintTaxonomyRows for reuse — an instance-side test holds the generated
 *     docs/mechanics/error_taxonomy.md to the same rules);
 *   - `dictionary:` declared ⇒ dictionary.mjs exists and createAdapter() yields
 *     {source, lookup} — instantiated but NEVER called: packcheck stays off the network
 *     (factcheck.mjs is the tool that goes online).
 *
 * packcheck imports `normalize.mjs` directly (as it already does `dictionary.mjs`) to read
 * the LOOKALIKES map. That is the enforcer's privilege, not a licence for anything else:
 * every consumer still goes through loadPack().
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

/** words.json entries below this earn a warning — SPEC asks for ~30 spanning every facet. */
const WORDS_MIN = 20;

/**
 * Manifest keys SPEC marks "may be empty". Empty is honest ONLY when the prose says which
 * key is empty and why; the German pack left `required_fact:` blank and said nothing,
 * which silently disabled state/ledgers.test.ts's per-row fact guard. Aliases let the
 * prose speak human ("no edge-tts voice") instead of quoting the key.
 */
const OPTIONAL_KEYS = {
  genders: ["gender"],
  level_scale: ["level scale", "proficiency", "cefr"],
  tts_edge: ["edge-tts", "edge tts", "neural voice"],
  tts_say: ["say voice", "macos voice", "offline voice"],
  stt_lang: ["stt", "speech-to-text", "whisper"],
  required_fact: ["required fact"],
  dictionary: ["dictionary"],
};

function readJson(path, errors) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (e) {
    errors.push(`${path}: ${e.message}`);
    return null;
  }
}

const isAscii = (s) => /^[\x00-\x7F]*$/.test(s);

/** Strip markdown emphasis, code ticks and typographic quotes from a taxonomy example. */
function bareForm(s) {
  return String(s)
    .replace(/[*`_]/g, "")
    .replace(/[„“”"«»]/g, "")
    .replace(/\([^)]*\)\s*$/, "")
    .replace(/[,;.]+\s*$/, "")
    .trim();
}

/** Lowercase, diacritics folded — a shape to compare two forms by, not a normalizer. */
const skeleton = (s) => s.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "");

/** Levenshtein distance, iterative two-row. Inputs here are single words. */
function editDistance(a, b) {
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[b.length];
}

/**
 * Do two single words look alike across languages — the relation a false friend IS?
 *
 * Threshold 0.5 sits in a measured gap, not a guessed one: the broken row scores
 * aktuell/actual 0.57, while real false-friend REPAIRS score far lower (aktuell/tatsächlich
 * 0.18, bekommen/werden 0.38). Multi-word forms are excluded — a false friend is a lexeme,
 * and phrase pairs differing in one word score high for an innocent reason.
 */
const LOOK_ALIKE = 0.5;

function looksAlike(a, b) {
  if (/\s/.test(a) || /\s/.test(b)) return false;
  const [x, y] = [skeleton(a), skeleton(b)];
  const longest = Math.max(x.length, y.length);
  return longest > 0 && 1 - editDistance(x, y) / longest >= LOOK_ALIKE;
}

/**
 * Error-taxonomy row lint — an example row must show a CONTRAST.
 *
 * Four rows in the first agent-generated pack's notes.md failed this and two of them
 * propagated verbatim into the generated instance's docs/mechanics/error_taxonomy.md:
 * `✗ *Ich komme spät an* → Ich komme spät an` (identical), `✗ *aktuell* … confused with
 * *aktuell*` (same form twice), `✗ *mit dem Mann* (correct dative) vs *mit der Mann*`
 * (the ✗ on the correct form). A row that does not contrast teaches the learner nothing
 * and hands the tally a code with no worked example.
 * (found in the first agent-generated language pack, 2026-08-15)
 *
 * A fourth rule covers false-friend rows only. `✗ *aktuell* (current) → actual` survived the
 * first three — the two sides differ, so it reads as a contrast — but it points → at the
 * held-language partner of the false friend instead of at the target form the learner should
 * have written. It corrects a word into a translation. The row contradicts its own zone: if
 * the wrong form and the "correction" look alike ACROSS languages, the row is not showing a
 * repair, it is showing the confusion pair. The rule is gated to rows whose code or zone
 * names a false friend, because look-alike sides are exactly right everywhere else — the ro
 * pack's `✗ *fara* → fără` is a diacritics row and scores a perfect look-alike match.
 * (found in the generated German instance, 2026-08-15)
 *
 * Scans markdown table rows only. Exported so an instance-side test can hold the generated
 * docs/mechanics/error_taxonomy.md to the same rules with the same messages.
 *
 * @param {string} text  file contents
 * @param {string} label path shown in the message
 * @returns {string[]} one message per broken row
 */
export function lintTaxonomyRows(text, label = "notes.md") {
  const problems = [];
  const lines = String(text).split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trimStart().startsWith("|") || !line.includes("✗")) continue;
    const where = `${label}:${i + 1}`;
    // The gate for the look-alike rule below: the whole row, so the code/zone cells count.
    const falseFriendRow = /false.?friend/i.test(line) || /\bLEX-FF\b/.test(line);
    for (const cell of line.split("|")) {
      if (!cell.includes("✗")) continue;
      // The ✗ must never sit on a form the row itself calls correct.
      if (/\(\s*correct/i.test(cell)) {
        problems.push(
          `${where}: "${cell.trim()}" — the ✗ marks a form the row itself calls correct. ` +
            `✗ goes on the WRONG form; the correction follows →.`,
        );
        continue;
      }
      for (const segment of cell.split("✗").slice(1)) {
        if (segment.includes("→")) {
          const idx = segment.indexOf("→");
          const wrong = bareForm(segment.slice(0, idx));
          const right = bareForm(segment.slice(idx + 1).split("✗")[0]);
          if (wrong && wrong === right) {
            problems.push(
              `${where}: "✗ ${segment.trim()}" — the wrong form and the correction are the ` +
                `same string. An example row must show a contrast.`,
            );
          } else if (falseFriendRow && wrong && right && looksAlike(wrong, right)) {
            problems.push(
              `${where}: "✗ ${segment.trim()}" — "${wrong}" and "${right}" are the look-alike ` +
                `pair this row is ABOUT, so "${right}" is the false friend, not the repair. ` +
                `→ must point at the target-language form the learner should have written; ` +
                `put the held-language meaning in quotes on the ✗ side instead.`,
            );
          }
          continue;
        }
        const spans = [...segment.matchAll(/\*{1,2}([^*]+)\*{1,2}/g)].map((m) => bareForm(m[1]));
        const dup = spans.find((s, k) => s && spans.indexOf(s) !== k);
        if (dup) {
          problems.push(
            `${where}: "✗ ${segment.trim()}" — the form "${dup}" appears on both sides of the ` +
              `contrast. An example row must show a contrast.`,
          );
        }
      }
    }
  }
  return problems;
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

  // ── Empty manifest keys owe the prose a named reason ─────────────────────────
  // GENERATE.md step 1: "if any key is unknown, leave it empty and SAY SO in prose". The
  // German pack left required_fact: empty and said nothing, so the noun-plural guard the
  // key exists to arm never ran and nothing reported it.
  const packMdPath = join(dir, "pack.md");
  const packMdText = existsSync(packMdPath) ? readFileSync(packMdPath, "utf8") : "";
  const configBlock = /```mova-config\n([\s\S]*?)```/.exec(packMdText)?.[1] ?? "";
  const prose = packMdText.replace(/```mova-config\n[\s\S]*?```/g, "");
  for (const [key, aliases] of Object.entries(OPTIONAL_KEYS)) {
    if ((manifest[key] ?? "").trim()) continue;
    const keyRe = new RegExp(key.replace(/_/g, "[_\\s-]?"), "i");
    const commented = new RegExp(`^\\s*${key}:\\s*#|^\\s*${key}:.*#\\s*\\S`, "im").test(configBlock);
    const named = keyRe.test(prose) || aliases.some((a) => prose.toLowerCase().includes(a));
    if (!commented && !named) {
      errors.push(
        `pack.md: "${key}:" is empty and the prose never mentions it. An empty key is honest ` +
          `only when it is DECLARED empty — name "${key}" in the prose header (or in a # comment ` +
          `on its own line) and say what the pack loses by it. ` +
          `(found in the first agent-generated language pack, 2026-08-15: an empty required_fact: ` +
          `silently switched off state/ledgers.test.ts's per-row fact check)`,
      );
    }
  }

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

  // ── `inflection: false` is the one flag that deletes a required fixture ──────
  // So it gets cross-examined, not taken on trust. The German pack declared false, shipped
  // no pairs.json, and kept an eight-entry `endings` list carrying a Duden citation on rows
  // that are not German plural endings at all — a citation attached to a guess, dead under
  // the flag it declared. (found in the first agent-generated language pack, 2026-08-15)
  if (!inflection) {
    warnings.push(
      "inflection: false waives golden/pairs.json — the ONLY manifest flag that removes a " +
        "required fixture. packcheck cross-examined `endings` and the golden form column against it.",
    );
    if (endings.length) {
      errors.push(
        `pos-tables.mjs: inflection: false but endings lists ${endings.length} entr${endings.length === 1 ? "y" : "ies"} ` +
          `(${endings.slice(0, 4).map((e) => JSON.stringify(e)).join(", ")}${endings.length > 4 ? ", …" : ""}) — ` +
          `dead code under the flag the manifest set, and nothing runs it, so a wrong ending is never caught. ` +
          `Empty the list, or set inflection: true and prove the endings with golden/pairs.json.`,
      );
    }
  }

  const manifestRequiredFact = (manifest.required_fact ?? "").trim();
  if (manifestRequiredFact && !tables.requiredFact) {
    warnings.push(
      `manifest declares required_fact: "${manifestRequiredFact}" but TABLES.requiredFact is absent — ` +
        `state/ledgers.test.ts's check is inert; say so in the manifest comment (SPEC)`,
    );
  }
  if (!manifestRequiredFact && tables.requiredFact) {
    errors.push(
      "pos-tables.mjs declares TABLES.requiredFact but the manifest's required_fact: is empty — " +
        "loadPack gates the ledger check on the manifest key, so the table entry never runs",
    );
  }

  const cls = createClassifier(tables);
  const normalize = pack.normalize;

  // ── normalize.mjs: the map has to fold something ────────────────────────────
  let lookalikes = null;
  try {
    const mod = await import(pathToFileURL(join(dir, "normalize.mjs")).href);
    lookalikes = mod.LOOKALIKES ?? null;
  } catch {
    /* loadPack already surfaced a broken module */
  }
  const foldEntries = lookalikes && typeof lookalikes === "object" ? Object.entries(lookalikes) : [];
  const identityEntries = foldEntries.filter(([bad, good]) => bad === good);
  if (identityEntries.length) {
    const shown = identityEntries.slice(0, 6).map(([b, g]) => `"${b}"→"${g}"`).join(", ");
    errors.push(
      `normalize.mjs: LOOKALIKES has ${identityEntries.length} identity entr${identityEntries.length === 1 ? "y" : "ies"} ` +
        `(${shown}${identityEntries.length > 6 ? ", …" : ""}) — a letter mapped to itself folds nothing.` +
        (identityEntries.length === foldEntries.length
          ? ` ALL ${foldEntries.length} entries are identity: the map is a no-op and every folding claim the pack makes is false.`
          : "") +
        ` A look-alike entry maps a LOOK-ALIKE CODEPOINT from another alphabet (or a keyboard digraph) ` +
        `to the target letter — key and value are never the same string. ` +
        `(found in the first agent-generated language pack, 2026-08-15)`,
    );
  }
  const nfdKeys = foldEntries.filter(([bad]) => bad !== bad.normalize("NFC"));
  if (nfdKeys.length) {
    errors.push(
      `normalize.mjs: LOOKALIKES keys ${nfdKeys.map(([b]) => JSON.stringify(b)).join(", ")} are NFD — ` +
        `normalize() composes to NFC before folding, so these keys can never match. Write the key in NFC.`,
    );
  }
  // Every fold the PROSE claims gets run. Only lines that talk about folding are scanned,
  // and a claim with no diacritic on either side is prose, not a claim.
  for (const line of prose.split("\n")) {
    if (!/fold|look-?alike|normaliz/i.test(line)) continue;
    for (const m of line.matchAll(/([\p{L}]{1,4})\s*(?:→|->)\s*([\p{L}]{1,4})/gu)) {
      const [, from, to] = m;
      if (isAscii(from) && isAscii(to)) continue;
      const got = normalize(from);
      if (got !== to) {
        errors.push(
          `pack.md: the prose claims the fold "${from} → ${to}", but normalize("${from}") → "${got}". ` +
            `A pack may not advertise a fold it does not perform — implement it in LOOKALIKES (with a ` +
            `golden/normalize.json fixture) or delete the claim. ` +
            `(found in the first agent-generated language pack, 2026-08-15: pack.md advertised "ae→ä, oe→ö, ue→ü" ` +
            `above a map that folded nothing)`,
        );
      }
    }
  }

  // ── golden/words.json ───────────────────────────────────────────────────────
  const wordsPath = join(dir, "golden", "words.json");
  let words = null;
  if (!existsSync(wordsPath)) {
    errors.push("golden/words.json missing — the pack has no classification proof");
  } else {
    words = readJson(wordsPath, errors);
    if (Array.isArray(words) && words.length) {
      let residue = 0;
      const seenId = new Set();
      const seenTarget = new Set();
      for (const w of words) {
        const got = cls.classify(w.target, w.id ?? "");
        if (got !== w.expected) {
          errors.push(`words.json: classify(${JSON.stringify(w.target)}, "${w.id}") → ${JSON.stringify(got)}, expected ${JSON.stringify(w.expected)}`);
        }
        if (got === null || (tables.other != null && got === tables.other)) residue++;
        if (w.id && seenId.has(w.id)) errors.push(`words.json: duplicate id "${w.id}"`);
        if (seenTarget.has(w.target)) errors.push(`words.json: duplicate target ${JSON.stringify(w.target)}`);
        seenId.add(w.id);
        seenTarget.add(w.target);
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
      const exercised = new Set(words.map((w) => w.expected).filter((x) => x != null));
      const unexercised = [...typeKeys].filter((k) => !exercised.has(k));
      if (unexercised.length) {
        errors.push(
          `words.json: no fixture classifies to ${unexercised.map((k) => `"${k}"`).join(", ")} — ` +
            `a facet the deck shows and the goldens never exercise is an untested facet (SPEC: ~30 words spanning EVERY facet)`,
        );
      }
      if (words.length < WORDS_MIN) {
        warnings.push(`words.json: ${words.length} fixtures — SPEC asks for ~30 spanning every facet`);
      }

      // The manifest says the language does not inflect; the goldens say otherwise.
      if (!inflection) {
        const contradictions = [];
        for (const w of words) {
          const m = /^([^(]+?)\s*\(([^)]*)\)\s*$/.exec(String(w.target ?? ""));
          if (!m) continue;
          const head = m[1].trim();
          const slots = m[2].split(",").map((s) => s.trim()).filter(Boolean);
          if (slots.length < 2) continue;
          if (!(slots[0] in (tables.tags ?? {}))) continue; // not a tagged ledger row
          if (slots[1] !== head) contradictions.push(`${head} → ${slots[1]}`);
        }
        if (contradictions.length) {
          errors.push(
            `words.json: inflection: false, but ${contradictions.length} tagged golden rows carry a second ` +
              `form that differs from the headword (${contradictions.slice(0, 3).join(", ")}${contradictions.length > 3 ? ", …" : ""}) — ` +
              `the pack's own fixtures are the two-colour case the morpheme-marking machinery exists for, and ` +
              `the manifest switched it off. Set inflection: true and ship golden/pairs.json with the endings that ` +
              `produce those forms, or drop the second form from these rows. ` +
              `(found in the first agent-generated language pack, 2026-08-15)`,
          );
        }
      }

      // Residue from the reference pack — the failure mode of authoring by copying packs/ro.
      if (code !== "ro") {
        const roWords = join(repoRoot, "packs", "ro", "golden", "words.json");
        if (existsSync(roWords)) {
          const tokens = (list) =>
            new Set(
              list
                .flatMap((x) => String(x.target ?? "").toLowerCase().match(/\p{L}+/gu) ?? [])
                .filter((t) => t.length >= 5),
            );
          const ours = tokens(words);
          const theirs = tokens(JSON.parse(readFileSync(roWords, "utf8")));
          const ownVocabulary = new Set([
            ...Object.keys(tables.tags ?? {}),
            ...typeKeys,
            ...(tables.genders ?? []),
          ].map((s) => String(s).toLowerCase()));
          const shared = [...ours].filter((t) => theirs.has(t) && !ownVocabulary.has(t));
          if (shared.length) {
            warnings.push(
              `words.json shares ${shared.map((t) => `"${t}"`).join(", ")} with packs/ro/golden/words.json — ` +
                `check for reference-pack residue: a pack authored by copying packs/ro inherits its ` +
                `metalanguage. (found in the first agent-generated language pack, 2026-08-15: two German ` +
                `paradigm rows shipped the Romanian label "prezent")`,
            );
          }
        }
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
      // A fixture set of identity cases only passes against `s => s`. It proves nothing.
      const foldingClaimed = foldEntries.length > 0 || /fold/i.test(prose);
      if (foldingClaimed && !fixtures.some((f) => f.input !== f.expected)) {
        errors.push(
          `normalize.json: every fixture is an identity case (input === expected), so the whole set ` +
            `passes against \`s => s\` — it proves no folding at all, while the pack claims folding. ` +
            `SPEC requires a fixture per look-alike the pack folds: add at least one where the input is ` +
            `the look-alike and the expected value is the real letter. ` +
            `(found in the first agent-generated language pack, 2026-08-15)`,
        );
      }
      const anyNonAscii =
        foldEntries.some(([b, g]) => !isAscii(b) || !isAscii(g)) ||
        fixtures.some((f) => !isAscii(String(f.input ?? "")) || !isAscii(String(f.expected ?? "")));
      if (anyNonAscii && !fixtures.some((f) => typeof f.input === "string" && f.input !== f.input.normalize("NFC"))) {
        errors.push(
          `normalize.json: no NFD-input fixture. macOS paste delivers NFD (base letter + combining mark), ` +
            `and NFC composition is normalize()'s first job — SPEC names the NFD-composition case as a ` +
            `required fixture kind. Add one: a decomposed spelling of a real word, expected in its composed form.`,
        );
      }
      const uncovered = foldEntries.filter(([bad]) => !fixtures.some((f) => String(f.input ?? "").includes(bad)));
      if (uncovered.length) {
        warnings.push(
          `normalize.json: no fixture exercises ${uncovered.map(([b]) => JSON.stringify(b)).join(", ")} — ` +
            `SPEC asks for one fixture per look-alike in the map, uppercase included`,
        );
      }
    }
  }

  // ── notes.md ────────────────────────────────────────────────────────────────
  const notesPath = join(dir, "notes.md");
  if (!existsSync(notesPath)) {
    errors.push("notes.md missing — setup mines it for the instance's taxonomy and transfer files (SPEC layout)");
  } else {
    for (const problem of lintTaxonomyRows(readFileSync(notesPath, "utf8"), `packs/${code}/notes.md`)) {
      errors.push(problem);
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
