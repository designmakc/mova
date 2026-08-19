// mova:engine
/**
 * The error tally — what the drill playbook aims at.
 *
 * Replaces `grep -oE 'Code: …' | sort | uniq -c | sort -rn`, which could only count
 * surface codes. For three sessions in the reference instance that meant ORTH-DIA sat on
 * top of the list while every one of its `ă` entries was a manifestation of the unproduced
 * vowel underneath (PRON) — and drilling went at the spelling. limba ERR-007 said so in
 * prose; prose is not something a pipeline can read.
 *
 * Reads the tokens defined in docs/mechanics/error_taxonomy.md (generated at setup):
 *   Code: XXX ×N           this entry's surface code, and how many times it happened (N=1)
 *   Root: ERR-NNN          this entry is a manifestation of that one
 *   Reroots: ERR-A → ERR-B a later entry declaring that link retroactively
 *   Retires: ERR-NNN       that finding leaves the tally
 *   Counts: ERR-NNN ×N     a later entry setting the occurrence count of an entry that cannot be edited
 *   Siblings: ERR-A, ERR-B one mechanism in two systems — neither causes the other
 *   Measured: CODE DATE P%  that zone was re-tested and scored P% on DATE
 *
 * Code names admit any Unicode uppercase letter (with combining marks) plus dash — the
 * taxonomy is generated per language pair, and limba's codes already carried Romanian
 * diacritics (NOUN-GEN sat beside codes like ORTH-DIA with Ă in examples). An ASCII-only
 * class silently drops a code the moment a pack names one in its own alphabet.
 *
 * TWO THINGS THIS COUNTS, and they answer different questions (both limba, 2026-08-12):
 *
 *   OCCURRENCES, not entries. One entry describing nine sightings used to count 1, so the
 *   more cleanly a session diagnosed a pattern the smaller its number got — a session that
 *   logged the same nine errors as nine sloppy entries out-ranked it. `×N` fixes that.
 *
 *   WHAT IS STILL LIVE, not what has ever been counted. The gender zone held the largest
 *   historical count in the reference instance and scored 85–100% the day it was last
 *   tested, while four consecutive sessions were told by the top row to go drill it. All
 *   four disobeyed by hand. A rule every session must consciously ignore is not a rule.
 *
 *   `Measured:` is how a zone gets its count banked: occurrences dated STRICTLY BEFORE a
 *   clean measurement stop counting as live, because they have been re-tested since. Nothing
 *   is deleted — the all-time tally keeps every one, and the measurement is printed with its
 *   score so the discount can be audited. A calendar window was tried first and is the wrong
 *   instrument: it discounts by age rather than by evidence, and on a 13-day log it separates
 *   nothing at all.
 *
 *   Same-day findings survive the measurement. A defect logged on the day a rule tested clean
 *   is not explained away by it — usually it is a different aspect of the same zone.
 *
 *   node scripts/tally.mjs           # live + all-time + surface + groups + what moved
 *   node scripts/tally.mjs --codes   # LIVE tally only, "CODE count" per line — the drill input
 *   node scripts/tally.mjs --all     # all-time root tally in --codes form
 *
 * Read-only, zero dependencies.
 */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// One code-name class, used by every token that names a code. Unicode-aware on purpose —
// see the header. `u`-flagged everywhere it appears.
const CODE = "[\\p{Lu}\\p{M}-]+";

/** Also imported by scripts/hub.mjs — the dashboard must show the same list the drill
 *  playbook acts on, and two implementations would eventually disagree. */
export function tally() {
const text = readFileSync(join(root, "docs/logs/error_log.md"), "utf8");

/* ---------------------------------------------------------------- parse */

const entries = new Map(); // ERR-NNN -> { id, date, code, root, n }
const retired = new Set();
const reroots = []; // { from, to, by }
const recounts = []; // { id, n, by } — a later entry fixing an older entry's occurrence count
const siblings = []; // [ERR-A, ERR-B, …] — one mechanism, two systems
const measured = new Map(); // CODE -> { date, score, by } — latest clean re-test of that zone

for (const block of text.split(/^## /m).slice(1)) {
  const head = /^(\d{4}-\d{2}-\d{2}) — (ERR-\d+)/.exec(block);
  if (!head) continue;
  const [, date, id] = head;

  // Strip inline-code spans first. An entry that DISCUSSES a token quotes it in backticks
  // — limba ERR-012 said a correction "re-emits `Code: ORTH-DIA`" — and a naive match counts
  // that as the entry's own code. It counted the entry that existed to fix the count.
  const prose = block.replace(/`[^`]*`/g, "");
  // `Code: LEX-GAP ×9` — the count is optional and defaults to 1, so every entry written
  // before the token existed keeps counting exactly as it did. `x` is accepted beside `×`
  // because one is hard to type; the log itself should use `×`.
  const code = new RegExp(`\\bCode:\\s*(${CODE})(?:\\s*[×x]\\s*(\\d+))?`, "u").exec(prose);
  const ownRoot = /\bRoot:\s*(ERR-\d+)/.exec(prose);
  entries.set(id, {
    id, date,
    code: code ? code[1] : null,
    n: code && code[2] ? Number(code[2]) : 1,
    root: ownRoot ? ownRoot[1] : null,
  });

  // "Retires: ERR-002" and the prose form "**Retires.** … ERR-002 …" both count —
  // limba ERR-010 was written before the token existed and must not silently stop working.
  for (const line of prose.split("\n")) {
    // "Retires: ERR-004" anywhere in the line, and the prose form "**Retires.** … ERR-002 …"
    // that ERR-010 used before the token existed. Take the IDs that follow the marker only,
    // so an entry mentioning other IDs in passing doesn't retire them.
    const ret = /\*{0,2}Retires\*{0,2}[.:]?\s*(.*)$/.exec(line);
    if (ret) for (const m of ret[1].matchAll(/ERR-\d+/g)) retired.add(m[0]);

    const rr = /Reroots:?\*{0,2}\s*(ERR-\d+)\s*(?:→|->)\s*(ERR-\d+)/.exec(line);
    if (rr) reroots.push({ from: rr[1], to: rr[2], by: id });

    // `Counts: ERR-030 ×9` — invariant 3 forbids editing an old entry, so an occurrence
    // count discovered later arrives the same way a re-attribution does: as a token in a
    // new entry. Several pairs may sit on one line.
    const ct = /Counts:?\*{0,2}\s*(.*)$/.exec(line);
    if (ct) {
      for (const m of ct[1].matchAll(/(ERR-\d+)\s*[×x]\s*(\d+)/g)) {
        recounts.push({ id: m[1], n: Number(m[2]), by: id });
      }
    }

    // `Siblings: ERR-033, ERR-034` — the same failure shape in two systems, where neither
    // causes the other so `Root:` cannot express it. Grouped for ranking, never merged:
    // both codes keep their own count and the group's combined weight is shown separately.
    const sb = /Siblings:?\*{0,2}\s*(.*)$/.exec(line);
    if (sb) {
      const ids = [...sb[1].matchAll(/ERR-\d+/g)].map((m) => m[0]);
      if (ids.length > 1) siblings.push(ids);
    }

    // `Measured: NOUN-GEN 2026-08-12 85%` — the zone was re-tested and held. The latest
    // measurement per code wins, so a zone that breaks again is re-measured downward by the
    // next entry rather than needing this one undone.
    const ms = new RegExp(`Measured:?\\*{0,2}\\s*(${CODE})\\s+(\\d{4}-\\d{2}-\\d{2})\\s+(\\d+)\\s*%`, "u").exec(line);
    if (ms) {
      const prev = measured.get(ms[1]);
      if (!prev || prev.date < ms[2]) {
        measured.set(ms[1], { date: ms[2], score: Number(ms[3]), by: id });
      }
    }
  }
}

for (const { from, to } of reroots) {
  const e = entries.get(from);
  if (e) e.root = to;
}

for (const { id, n } of recounts) {
  const e = entries.get(id);
  if (e) e.n = n;
}

/* -------------------------------------------------------------- resolve */

/** Follow Root: links to the entry that actually carries the cause. */
function resolve(id, seen = new Set()) {
  const e = entries.get(id);
  if (!e || !e.root || seen.has(id)) return e;
  seen.add(id);
  return resolve(e.root, seen) || e;
}

const surface = new Map();
const rootTally = new Map();
const liveTally = new Map();
const moved = [];
const banked = [];
/**
 * CODE → { first, last } — when a zone was first and last seen, over LIVE occurrences only.
 *
 * The dates were already parsed and thrown away. They answer the question the whole
 * `Measured:` mechanism exists for and a bare count cannot: a zone at 16× that has not
 * recurred in two weeks and a zone at 16× that fired this morning are the same number and
 * opposite problems.
 *
 * Live-only on purpose — a banked occurrence has already been answered by a clean re-test,
 * and dating a zone by it would report the problem as older than it is.
 */
const span = new Map();
const seen = (code, date) => {
  const cur = span.get(code);
  if (!cur) span.set(code, { first: date, last: date });
  else {
    if (date < cur.first) cur.first = date;
    if (date > cur.last) cur.last = date;
  }
};

const add = (m, k, n) => m.set(k, (m.get(k) || 0) + n);

for (const e of entries.values()) {
  if (!e.code || retired.has(e.id)) continue;
  add(surface, e.code, e.n);

  const target = resolve(e.id);
  const code = target && target.code ? target.code : e.code;
  add(rootTally, code, e.n);

  // Banked: this zone has been re-tested since this occurrence was recorded. Strictly
  // before — a finding from the same day as the measurement is not covered by it.
  const m = measured.get(code);
  if (m && e.date < m.date) banked.push({ id: e.id, code, n: e.n, by: m });
  else { add(liveTally, code, e.n); seen(code, e.date); }

  if (code !== e.code) moved.push({ id: e.id, from: e.code, to: code, via: target.id });
}

/** Sibling links, resolved to root codes and summed. Transitive: A–B plus B–C is one group. */
function siblingGroups() {
  const groups = [];
  for (const ids of siblings) {
    const codes = new Set(
      ids.map((id) => { const t = resolve(id); return t && t.code; }).filter(Boolean),
    );
    if (codes.size < 2) continue;
    const hit = groups.find((g) => [...codes].some((c) => g.codes.has(c)));
    if (hit) codes.forEach((c) => hit.codes.add(c));
    else groups.push({ codes });
  }
  return groups
    .map((g) => ({
      codes: [...g.codes].sort(),
      total: [...g.codes].reduce((a, c) => a + (rootTally.get(c) || 0), 0),
      live: [...g.codes].reduce((a, c) => a + (liveTally.get(c) || 0), 0),
    }))
    .sort((a, b) => b.live - a.live || b.total - a.total);
}

const sorted = (m) => [...m.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  return {
    root: sorted(rootTally),
    live: sorted(liveTally),
    surface: sorted(surface),
    groups: siblingGroups(),
    moved,
    retired: [...retired].sort(),
    measured: [...measured.entries()].map(([code, m]) => ({ code, ...m })),
    banked,
    /** Per-code first/last live sighting — see `span` above. */
    span: Object.fromEntries(span),
  };
}

/** Code → plain meaning, from the taxonomy's own "Zone" column. A bare code is unreadable
 *  to whoever has to act on it. The taxonomy is generated at setup, so in template mode
 *  (no instance yet) there are no meanings to map — and no entries to need them. */
export function zones() {
  const path = join(root, "docs/mechanics/error_taxonomy.md");
  if (!existsSync(path)) return {};
  const map = {};
  const rowRe = new RegExp(`^\\|\\s*(${CODE})\\s*\\|\\s*([^|]+?)\\s*\\|`, "u");
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const m = rowRe.exec(line.trim());
    if (m) map[m[1]] = m[2];
  }
  return map;
}

/* --------------------------------------------------------------- output */

// Only print when run as a command; hub.mjs imports tally() and must stay silent.
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const { root: rootT, live: liveT, surface: surfaceT, groups, moved, retired, measured, banked } =
    tally();
  const z = zones();

  if (process.argv.includes("--codes") || process.argv.includes("--all")) {
    // --codes is the drill's input, so it prints the LIVE ranking. --all prints the
    // historical one, for a review that wants the whole record.
    for (const [code, n] of process.argv.includes("--all") ? rootT : liveT) {
      console.log(`${code} ${n}`);
    }
  } else {
    const pad = (s) => String(s).padEnd(10);
    const show = (t) => {
      if (!t.length) console.log("  — nothing logged —");
      for (const [code, n] of t) console.log(`  ${pad(code)} ${n}   ${z[code] || ""}`);
    };

    console.log("\nLIVE — drill this (occurrences not covered by a later clean measurement)");
    show(liveT);

    console.log("\nALL TIME — root-attributed, occurrence-weighted");
    show(rootT);

    console.log("\nSURFACE — raw Code: counts, not re-attributed");
    for (const [code, n] of surfaceT) console.log(`  ${pad(code)} ${n}`);

    if (groups.length) {
      console.log("\nSIBLING GROUPS — one mechanism, several systems; counted once per code");
      for (const g of groups) {
        console.log(`  ${g.codes.join(" + ")}   live ${g.live} · all time ${g.total}`);
      }
    }
    if (measured.length) {
      console.log("\nMEASURED SINCE — why a count is banked rather than live");
      for (const m of measured) {
        const n = banked.filter((b) => b.code === m.code).reduce((a, b) => a + b.n, 0);
        console.log(`  ${pad(m.code)} ${m.score}% on ${m.date} (${m.by}) — ${n} banked`);
      }
    }
    if (moved.length) {
      console.log("\nRE-ATTRIBUTED");
      for (const m of moved) console.log(`  ${m.id}  ${m.from} → ${m.to}   (cause: ${m.via})`);
    }
    if (retired.length) console.log(`\nRETIRED (excluded): ${retired.join(", ")}`);
    console.log("");
  }
}
