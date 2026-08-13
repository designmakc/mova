// mova:engine
/**
 * Answer-leak check — run before any scored set is shown to the learner.
 *
 * A test measures retrieval only if its answers are not already on the page. In the
 * reference instance (limba, 2026-08-09) a 16-item register drill printed 14 of its own 16
 * answers inside other items' prompts; the two it did not print were the only two the
 * learner got wrong, and the session reported 88% for a zone that had produced nothing but
 * errors for six days. The rule against this already existed one paragraph away in
 * session_format.md — scoped to a single item — and was obeyed item by item while the set
 * as a whole leaked. A prohibition that depends on the author noticing has now failed once,
 * so this is the mechanical version.
 *
 * Three leak shapes, all detected here:
 *
 *   MIRROR      item N's prompt is item M's answer — symmetric pairs are the usual
 *               cause, because a tidy table and a valid test pull in opposite directions
 *   DISPLAY     a classify/recognise item over a form an earlier item printed with its
 *               label attached ("Tu **ești** …" answers "which register is ești?")
 *   REUSE       a production item whose answer already appeared as scaffolding, a
 *               translation, or an example in the same message
 *
 * Scope is ONE MESSAGE, by the learner's decision (limba, 2026-08-09). A target-language
 * prompt is NOT a leak — the constraint is answer-overlap, so target→meta items stay fully
 * available unless some other item in the same message asks for one of those same words.
 *
 * The folding below strips diacritics via NFD on purpose — `cati` in a prompt gives away
 * `câți`. NFD + combining-mark removal is universal across scripts; nothing here is
 * language-specific except the examples, which come from the reference implementation.
 *
 * `--prior` is advisory and never fails. Re-asking after a key is re-exposure, and
 * re-exposure teaches. What it may not do is carry a score: limba SES-007's 43% → 63% → 86%
 * was a re-reading of two answer keys reported as repair (2026-08-09 audit in
 * work/feedback/).
 *
 * Usage:
 *   node scripts/leakcheck.mjs set.json
 *   node scripts/leakcheck.mjs set.json --prior key.md   # flag re-exposure, exit unchanged
 *   node scripts/leakcheck.mjs work/visuals/<page>.html  # visual mode (limba, 2026-08-10):
 *       every concealed .ans block is an answer, the rest of the page is one shared
 *       prompt — HIGH means a reveal's answer is printed in the open elsewhere on the
 *       same page. MED is expected noise on a teaching page (the page teaches the words)
 *       and is advisory there; only HIGH indicates a dead guided attempt.
 *
 * set.json — one of two shapes:
 *   { "title": "TEST 1",
 *     "items": [ { "id": "A1", "ask": "<prompt exactly as shown>", "answer": "sunteți" } ] }
 *   { "title": "TEST 1", "set": "<the whole rendered set>", "answers": ["sunteți", "…"] }
 *
 * Exit 0 clean, 1 on any HIGH finding. Read-only, zero dependencies.
 */
import { readFileSync } from "node:fs";

const args = process.argv.slice(2);
const setPath = args.find((a) => !a.startsWith("--"));
const priorIdx = args.indexOf("--prior");
const priorPath = priorIdx === -1 ? null : args[priorIdx + 1];

if (!setPath) {
  console.error("usage: node scripts/leakcheck.mjs <set.json> [--prior <key file>]");
  process.exit(2);
}

/** Fold to a comparable form: NFC, lowercase, diacritics stripped, markdown removed.
 *  Diacritics are folded on purpose — `cati` in a prompt gives away `câți`. */
const fold = (s) =>
  s
    .normalize("NFD")
    .replace(/[̀-̧̦ͯ]/g, "")
    .toLowerCase()
    .replace(/[*_`>#|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/** Words worth reporting on their own. Short function words match everywhere and
 *  would bury the signal — but they are still checked as part of a full answer.
 *  The list is the pack's (TABLES.trivial); without a profile/pack, only the
 *  length filter below applies — stricter, never looser. */
let TRIVIAL = new Set();
let PACK_CODE = null;
try {
  const { loadPack } = await import("./pack.mjs");
  const pack = await loadPack();
  PACK_CODE = pack.code;
  TRIVIAL = new Set(pack.tables.trivial ?? []);
} catch {
  /* template mode or standalone use — proceed with the universal filters */
}

/** HTML → text, for visual mode: no styles, no scripts, no base64 payloads, no tags. */
const stripTags = (s) =>
  s
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/src="data:[^"]*"/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");

let raw;
if (setPath.endsWith(".html")) {
  // Visual mode: the page's concealed .ans blocks are the answers; everything else on
  // the page is visible before any reveal is pressed, so all of it is one shared prompt.
  // The retrieval target inside a block is its TARGET-LANGUAGE content — the `.l2` spans
  // of docs/visual/SPEC.md, or spans lang-tagged with the active pack's code — checked
  // sentence by sentence, so that meta-language commentary sharing the block
  // ("— feminine form, no article") never dilutes a verbatim leak into a MED.
  const html = readFileSync(setPath, "utf8");
  const answers = [];
  const langAttr = PACK_CODE ? `lang="${PACK_CODE}"|` : "";
  const targetSpanRe = new RegExp(
    `<(b|span)[^>]*(?:${langAttr}class="l2")[^>]*>([\\s\\S]*?)<\\/\\1>`,
    "g",
  );
  const rest = html.replace(/<div class="ans"[^>]*>([\s\S]*?)<\/div>/g, (_, inner) => {
    const target = [...inner.matchAll(targetSpanRe)]
      .map((m) => stripTags(m[2]).replace(/\s+/g, " ").trim());
    const source = target.length ? target : [stripTags(inner).replace(/\s+/g, " ").trim()];
    for (const frag of source) {
      for (const sentence of frag.split(/(?<=[.?!])\s+/)) {
        const clean = sentence.replace(/[.?!]+$/, "").trim();
        if (clean.length >= 4) answers.push(clean);
      }
    }
    return " ";
  });
  if (!answers.length) {
    console.log(`\nLEAK CHECK — ${setPath}   (no concealed answers on this page)\n`);
    process.exit(0);
  }
  raw = { title: setPath, set: stripTags(rest), answers };
} else {
  raw = JSON.parse(readFileSync(setPath, "utf8"));
}
const title = raw.title ?? setPath;

let items;
if (Array.isArray(raw.items)) {
  items = raw.items.map((it, n) => ({
    id: it.id ?? String(n + 1),
    ask: it.ask ?? "",
    answer: it.answer ?? "",
  }));
} else if (raw.set && Array.isArray(raw.answers)) {
  items = raw.answers.map((answer, n) => ({ id: String(n + 1), ask: "", answer }));
  items.sharedAsk = raw.set;
} else {
  console.error("set.json needs either `items` or both `set` and `answers`");
  process.exit(2);
}

const askOf = (it) => (items.sharedAsk ?? "") + " " + it.ask;
const allAsks = items.map((it) => ({ id: it.id, text: fold(askOf(it)) }));
const priorText = priorPath ? fold(readFileSync(priorPath, "utf8")) : null;

const findings = [];

for (const it of items) {
  const answer = fold(it.answer);
  if (!answer) continue;

  // HIGH — the whole answer sits in some prompt, its own included.
  // Word-bounded: `ai` inside `Ce mai ___` is not a leak, and matching on raw substrings
  // reported exactly that. Folding has already stripped diacritics, so \b is safe here.
  const answerRe = new RegExp(`\\b${answer.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`);
  for (const other of allAsks) {
    if (answerRe.test(other.text)) {
      findings.push({
        level: "HIGH",
        shape: other.id === it.id ? "SELF" : "MIRROR/DISPLAY",
        item: it.id,
        answer: it.answer,
        where: other.id === it.id ? `its own prompt` : `the prompt of ${other.id}`,
      });
    }
  }

  // MEDIUM — a content word of a multi-word answer is visible.
  const words = answer.split(" ").filter((w) => w.length > 1 && !TRIVIAL.has(w));
  if (words.length > 1) {
    for (const w of words) {
      const wEsc = w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      for (const other of allAsks) {
        if (other.id !== it.id && new RegExp(`\\b${wEsc}\\b`).test(other.text)) {
          findings.push({
            level: "MED",
            shape: "REUSE",
            item: it.id,
            answer: it.answer,
            where: `"${w}" appears in the prompt of ${other.id}`,
          });
        }
      }
    }
  }

  // MEDIUM — one answer contains another. Getting one hands over the other.
  // Two items sharing an identical answer is a repeat, not a leak — skip those.
  for (const other of items) {
    if (other.id === it.id) continue;
    const oa = fold(other.answer);
    if (oa && oa !== answer && oa.length > 2 && answer.includes(oa)) {
      findings.push({
        level: "MED",
        shape: "NESTED",
        item: it.id,
        answer: it.answer,
        where: `contains the answer to ${other.id} ("${other.answer}")`,
      });
    }
  }

  // ADVISORY — published in an earlier key this sitting. Not a failure: re-asking after a
  // key is re-exposure, and re-exposure teaches. What it may not do is carry a score. See
  // session_format.md → Re-exposure.
  if (priorText && priorText.includes(answer)) {
    findings.push({
      level: "INFO",
      shape: "RE-EXPOSURE",
      item: it.id,
      answer: it.answer,
      where: `already published in ${priorPath}`,
    });
  }
}

const high = findings.filter((f) => f.level === "HIGH");
const med = findings.filter((f) => f.level === "MED");
const info = findings.filter((f) => f.level === "INFO");

console.log(`\nLEAK CHECK — ${title}   (${items.length} items)\n`);

if (!findings.length) {
  console.log("  clean — no answer appears in any prompt\n");
  process.exit(0);
}

/** One line per item, not per hit — a mirror-paired set produces hundreds of hits and
 *  a wall of them reads as noise, which is how the original rule got skimmed past. */
const show = (list, label) => {
  if (!list.length) return;
  console.log(`  ${label}`);
  const byItem = new Map();
  for (const f of list) {
    if (!byItem.has(f.item)) byItem.set(f.item, []);
    byItem.get(f.item).push(f);
  }
  for (const [id, hits] of byItem) {
    const first = hits[0];
    const extra = hits.length > 1 ? `  (+${hits.length - 1} more)` : "";
    console.log(
      `    ${id.padEnd(5)} ${first.shape.padEnd(15)} "${first.answer}" — ${first.where}${extra}`,
    );
  }
  console.log("");
};

show(high, "HIGH — the answer is on the page. Rewrite the item or drop it.");
show(med, "MED — partial give-away. Judgement call; say so in the marking if you keep it.");
show(info, "RE-EXPOSURE — fine to ask, not fine to score. Label it same-day, post-key.");

const dead = new Set(high.map((f) => f.item));
const valid = items.length - dead.size;
console.log(
  `  ${dead.size} of ${items.length} items give their answer away.\n` +
    `  This set measures retrieval on ${valid} item${valid === 1 ? "" : "s"}.`,
);
if (info.length) {
  const n = new Set(info.map((f) => f.item)).size;
  console.log(
    `  ${n} item${n === 1 ? " was" : "s were"} answered in the prior key — re-exposure, ` +
      `not a cold measurement. Do not promote a tier on it.`,
  );
}
console.log("");

process.exit(high.length ? 1 : 0);
