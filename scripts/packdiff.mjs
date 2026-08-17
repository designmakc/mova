// mova:engine
/**
 * packdiff — what would change if this workspace swapped its language pack?
 *
 *   node scripts/packdiff.mjs <candidate-repo-root> [--code <pack>]
 *
 * Exit 0 when the swap is safe, 1 when it would break rows the learner has already
 * captured. `playbooks/update.md` § 6b runs it before offering a pack, and shows its
 * output to the human; nothing else may decide a swap.
 *
 * ── WHY THIS EXISTS ──────────────────────────────────────────────────────────────
 *
 * `/update` diffs engine files through `upstream/manifest.json`, and pack files are
 * deliberately absent from it: hashing them would make every update flag the learner's own
 * corrections to their language facts. The consequence nobody designed is that **a pack can
 * never reach an existing instance.** A learner who set up before their language shipped got
 * a pack generated live at setup — by the same playbook that once produced a pack advertising
 * an accent fold it had not implemented, a false inflection flag, and a silently disabled
 * ledger guard — and no later update will ever mention that a verified one now exists.
 *
 * So a pack swap has to be *offered*, and an offer needs a truthful answer to "what breaks".
 *
 * ── WHY THE CHECK IS EMPIRICAL ───────────────────────────────────────────────────
 *
 * Comparing two manifests tells you the packs differ. It does not tell you whether THIS
 * learner is affected, and that is the only question worth asking two lessons in or two
 * hundred. So the check runs both classifiers over the rows actually in `state/`, and
 * counts what moves.
 *
 * The breaking case is precise and already enforced elsewhere: `state/ledgers.test.ts` fails
 * on any row the active pack's classifier returns `null` for. So a swap that makes one
 * captured row unclassifiable turns the learner's CI red on work they entered correctly —
 * which is exactly the outcome a silent pack update would produce and nobody would connect
 * to the update.
 */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { loadPack } from "./pack.mjs";
import { createClassifier } from "./pos.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/** The manifest keys whose change a learner can actually feel. */
const WATCHED = [
  ["genders", "gender letters a noun row may carry"],
  ["inflection", "whether form-marking machinery runs at all"],
  ["required_fact", "the fact every flagged row must carry"],
  ["level_scale", "the rungs the curriculum's headings use"],
  ["dictionary", "the source that attests a fact before it is taught"],
  ["tts_edge", "the neural voice — a change re-warms the audio cache"],
  ["tts_say", "the offline voice"],
];

/** Ledger rows: `| id | target | translation | tier | added | last | topic | notes |`. */
export function readLedgerRows(repoRoot = root) {
  const out = [];
  for (const file of ["state/vocab.md", "state/grammar.md"]) {
    const path = join(repoRoot, file);
    if (!existsSync(path)) continue;
    readFileSync(path, "utf8").split("\n").forEach((line, i) => {
      if (!/^\s*\|/.test(line)) return;
      const cells = line.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
      if (cells.length < 8) return;
      if (!/^[VG]-\d+$/.test(cells[0])) return; // header and separator drop out here
      out.push({ file, lineNo: i + 1, id: cells[0], target: cells[1], notes: cells[7] });
    });
  }
  return out;
}

/** Manifest keys that moved, in the learner's terms. Pure. */
export function diffManifests(from, to) {
  const changes = [];
  for (const [key, why] of WATCHED) {
    const a = (from.manifest?.[key] ?? "").trim();
    const b = (to.manifest?.[key] ?? "").trim();
    if (a !== b) changes.push({ key, why, from: a || "(empty)", to: b || "(empty)" });
  }
  return changes;
}

/**
 * What the candidate's tables do to rows already captured. Pure — takes tables and rows, so
 * it is testable without an instance on disk.
 *
 * `unclassifiable` is the breaking set: those rows fail `state/ledgers.test.ts` the moment
 * the swap lands. `reclassified` is advisory — the row still works, it files under a
 * different facet on the deck. `owesFact` is breaking for the same reason as the first.
 */
export function diffRows(fromTables, toTables, rows) {
  const before = createClassifier(fromTables);
  const after = createClassifier(toTables);
  const unclassifiable = [];
  const reclassified = [];
  const owesFact = [];
  const need = toTables.requiredFact ?? null;

  for (const row of rows) {
    const a = before.classify(row.target, row.id);
    const b = after.classify(row.target, row.id);
    if (b === null && a !== null) unclassifiable.push({ ...row, was: a });
    else if (a !== b) reclassified.push({ ...row, was: a, now: b });
    if (need && need.rowPattern.test(row.target) && !need.factPattern.test(row.notes ?? "")) {
      owesFact.push({ ...row, hint: need.hint ?? "" });
    }
  }
  return { unclassifiable, reclassified, owesFact };
}

/** Level rungs the curriculum names that the candidate's scale does not define. */
export function orphanedLevels(curriculumText, levelScale) {
  const used = new Set([...curriculumText.matchAll(/\b([ABC][12])\b/g)].map((m) => m[1]));
  return [...used].filter((l) => !levelScale.includes(l)).sort();
}

/** The whole report. `safe` is the only thing a caller should branch on. */
export async function packDiff({ candidateRoot, instanceRoot = root, code } = {}) {
  const active = await loadPack(code, instanceRoot);
  const candidate = await loadPack(active.code, candidateRoot);
  const rows = readLedgerRows(instanceRoot);
  const manifest = diffManifests(active, candidate);
  const { unclassifiable, reclassified, owesFact } = diffRows(active.tables, candidate.tables, rows);

  const curriculumPath = join(instanceRoot, "docs/curriculum.md");
  const levels = existsSync(curriculumPath)
    ? orphanedLevels(readFileSync(curriculumPath, "utf8"), candidate.levelScale)
    : [];

  const losesInflection = active.inflection && !candidate.inflection;
  return {
    code: active.code,
    rowsChecked: rows.length,
    manifest,
    unclassifiable,
    reclassified,
    owesFact,
    orphanedLevels: levels,
    losesInflection,
    safe: unclassifiable.length === 0 && owesFact.length === 0 && !losesInflection,
  };
}

/** Plain-language render — this is what the learner reads, so no codes and no paths. */
export function render(r) {
  const out = [];
  out.push(`Pack "${r.code}" — checked against ${r.rowsChecked} row(s) you have already saved.`);
  if (r.manifest.length) {
    out.push("", "What differs:");
    for (const c of r.manifest) out.push(`  · ${c.why}: ${c.from} → ${c.to}`);
  } else {
    out.push("", "Nothing differs in what the pack declares.");
  }
  if (r.safe) {
    out.push("", "Nothing you have saved would break.");
  } else {
    out.push("", "THIS WOULD BREAK WORK YOU HAVE ALREADY DONE:");
    if (r.losesInflection) {
      out.push("  · the new pack switches off form-marking, so plurals and their marking stop being shown");
    }
    for (const x of r.unclassifiable.slice(0, 10)) {
      out.push(`  · ${x.target} — the new pack cannot tell what kind of word this is (it was a ${x.was})`);
    }
    if (r.unclassifiable.length > 10) out.push(`  · …and ${r.unclassifiable.length - 10} more like it`);
    for (const x of r.owesFact.slice(0, 10)) {
      out.push(`  · ${x.target} — the new pack requires a fact this row does not carry. ${x.hint}`);
    }
    if (r.owesFact.length > 10) out.push(`  · …and ${r.owesFact.length - 10} more like it`);
  }
  if (r.reclassified.length) {
    out.push("", `${r.reclassified.length} row(s) would be filed differently on the deck — nothing lost:`);
    for (const x of r.reclassified.slice(0, 5)) out.push(`  · ${x.target}: ${x.was} → ${x.now}`);
  }
  if (r.orphanedLevels.length) {
    out.push("", `Your curriculum names level(s) the new pack does not define: ${r.orphanedLevels.join(", ")}`);
  }
  return out.join("\n");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const candidateRoot = args.find((a) => !a.startsWith("--"));
  const codeAt = args.indexOf("--code");
  if (!candidateRoot) {
    console.error("usage: node scripts/packdiff.mjs <candidate-repo-root> [--code <pack>]");
    process.exit(2);
  }
  const report = await packDiff({
    candidateRoot,
    code: codeAt >= 0 ? args[codeAt + 1] : undefined,
  });
  console.log(render(report));
  process.exit(report.safe ? 0 : 1);
}
