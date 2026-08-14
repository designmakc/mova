// mova:engine
/**
 * Batch fact verification for the vocabulary ledger, via the pack's dictionary adapter.
 *
 *   node scripts/factcheck.mjs                          human report
 *   node scripts/factcheck.mjs --json                   machine output on stdout
 *   node scripts/factcheck.mjs --out work/.factcheck.json   also write the machine output
 *                                                       to a file — what the hub's
 *                                                       confidence panel reads
 *
 * docs/mechanics/verification.md wants every taught fact dictionary-verified,
 * tutor-confirmed, or visibly marked unverified. Per-word checks happen at capture; this
 * is the sweep — every `state/vocab.md` row's target cell against the adapter, reporting
 * rows the source cannot find (unverified) and rows where the source's gender or forms
 * CONTRADICT what the ledger claims (the dangerous case: a wrong fact being drilled).
 *
 * A contradiction only exists where both sides state a value: the ledger's parenthetical
 * gender vs the adapter's, the ledger's recorded forms vs the adapter's attested ones
 * (compared only when the adapter returned any). Multi-segment rows (`… · …`) are checked
 * on their first segment. Exit 0 on a completed run — this is a report, not a gate; the
 * numbers land on the hub. Exit 1 only when the source becomes unreachable mid-run.
 *
 * NETWORK-TOUCHING — one dictionary request per row, sequentially, with a polite delay.
 * NEVER run this in CI: it would hammer a free public dictionary on every push and fail
 * on every offline runner. Offline gates live in packcheck.mjs and the ledger tests.
 *
 * Template mode (no profile) and packless-dictionary languages (null adapter) exit 0
 * with a clear "nothing to verify" — a missing dictionary is honest, never an error.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { loadPack } from "./pack.mjs";
import { canVerify } from "./dictionary.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const DELAY_MS = 250;

const json = process.argv.includes("--json");
const outIdx = process.argv.indexOf("--out");
const outPath = outIdx !== -1 ? process.argv[outIdx + 1] : null;
const out = (msg) => console.log(msg);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const todayISO = () => {
  const n = new Date();
  const p = (x) => String(x).padStart(2, "0");
  return `${n.getFullYear()}-${p(n.getMonth() + 1)}-${p(n.getDate())}`;
};

/** With --out, the payload (plus its date) also lands in a file the hub reads. */
function writeOut(payload) {
  if (!outPath) return;
  writeFileSync(outPath, JSON.stringify({ generated: todayISO(), ...payload }, null, 2) + "\n");
  out(`sweep result → ${outPath}`);
}

function bail(reason) {
  const payload = { verifiable: false, reason };
  if (json) out(JSON.stringify(payload));
  else out(`nothing to verify — ${reason}`);
  writeOut(payload);
  process.exit(0);
}

let pack;
try {
  pack = await loadPack();
} catch {
  bail("template mode (no profile, no active pack)");
}
if (!canVerify(pack.dictionary)) {
  bail(`pack "${pack.code}" declares no dictionary; facts need tutor confirmation or the unverified marker`);
}

const ledgerPath = join(root, "state", "vocab.md");
if (!existsSync(ledgerPath)) bail("state/vocab.md does not exist yet");

/** Data rows of the ledger table: [{ lineNo, id, target }]. */
const rows = readFileSync(ledgerPath, "utf8")
  .split("\n")
  .map((line, i) => ({ lineNo: i + 1, t: line.trim() }))
  .filter(({ t }) => t.startsWith("|") && t.endsWith("|"))
  .map(({ lineNo, t }) => ({ lineNo, cells: t.slice(1, -1).split("|").map((c) => c.trim()) }))
  .filter(({ cells }) => /^[A-Z]-\d{4}$/.test(cells[0] ?? ""))
  .map(({ lineNo, cells }) => ({ lineNo, id: cells[0], target: cells[1] ?? "" }));

if (!rows.length) bail("the ledger has no data rows");

/** First segment of the target cell: headword + parenthetical parts. */
function firstSegment(target) {
  const seg = target.split(" · ")[0].trim();
  const m = /^(.*?)\s*\(([^)]*)\)\s*$/.exec(seg);
  if (!m) return { word: seg, parts: [] };
  return { word: m[1].trim(), parts: m[2].split(",").map((p) => p.trim()).filter(Boolean) };
}

const genders = new Set(pack.genders);
const tags = pack.tables.tags ?? {};
const results = [];
let verified = 0, unverified = 0, contradicted = 0, ran = 0;

for (const row of rows) {
  const { word, parts } = firstSegment(row.target);
  const declaredGender = parts.find((p) => genders.has(p)) ?? null;
  const declaredForms = parts.filter((p) => !tags[p]);

  let r;
  try {
    r = await pack.dictionary.lookup(row.target);
  } catch (e) {
    console.error(
      `${pack.dictionary.source} unreachable at ${row.id} (${e.message}) — ran ${ran} of ${rows.length} rows; verify manually or retry later`,
    );
    process.exit(1);
  }
  ran++;

  const problems = [];
  if (!r.found) {
    unverified++;
    problems.push(`no ${r.source} entry for "${word}" — check the headword or mark the row unverified`);
  } else {
    if (declaredGender && r.gender && declaredGender !== r.gender) {
      problems.push(`gender: ledger says "${declaredGender}", ${r.source} says "${r.gender}"`);
    }
    if (declaredForms.length && r.forms.length && !declaredForms.some((f) => r.forms.includes(f))) {
      problems.push(
        `forms: ledger says ${declaredForms.map((f) => `"${f}"`).join(", ")}, ${r.source} attests ${r.forms.map((f) => `"${f}"`).join(", ")}`,
      );
    }
    if (r.found && problems.length) contradicted++;
    else verified++;
  }

  const status = !r.found ? "unverified" : problems.length ? "contradicted" : "verified";
  results.push({ id: row.id, target: row.target, status, problems, url: r.url });
  if (!json && problems.length) {
    out(`  ${status === "contradicted" ? "✗" : "?"} ${row.id} ${row.target}`);
    for (const p of problems) out(`      ${p}${r.url ? `  (${r.url})` : ""}`);
  }
  await sleep(DELAY_MS);
}

const payload = {
  verifiable: true,
  pack: pack.code,
  source: pack.dictionary.source,
  rows: rows.length,
  verified,
  unverified,
  contradicted,
  findings: results.filter((r) => r.status !== "verified"),
};
if (json) {
  out(JSON.stringify(payload, null, 2));
} else {
  out(
    `\n${rows.length} rows against ${pack.dictionary.source}: ${verified} verified, ` +
      `${unverified} unverified, ${contradicted} contradicted`,
  );
  if (contradicted) out("fix contradicted rows before they are drilled — the ledger is what gets taught");
}
writeOut(payload);
