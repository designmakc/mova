// mova:engine
/**
 * Every reader a generated page shares — the parsers, the date helpers, and the two gates
 * that decide whether a section renders at all.
 *
 * WHY THIS EXISTS. A second dashboard (the profile page) would have been the second copy of
 * every parser in hub.mjs, and the argument against that is already written and already
 * paid for in visual-shell.mjs's own docstring: a definition that is copied always drifts.
 * Upstream measured it — two live pages carrying the audio player's CSS two and three times
 * over, because a page was built by copying an older page (limba, 2026-08-15).
 *
 * NOTHING HERE KNOWS ABOUT THE LEARNER. No profile, no pack, no top-level await: these are
 * readers of files, and the caller supplies anything personal (see `commands`). That keeps
 * the module importable from a contract test, which is how `gradedScore` ends up checked
 * against the very template that produces the entries it parses.
 *
 * THE TWO GATES, AND WHY THE CHOICE IS NEVER A PREFERENCE:
 *
 *   `must()` is for a SPECIFICATION — the interval table, the five parts, the teaching
 *   beats, the pacing table. A specification is true on day one, so zero rows means a
 *   heading was renamed and the parser is now silently reading nothing. It throws.
 *
 *   `when()` is for a RECORD — sessions, mistakes, snapshots, marked sets. A record
 *   accumulates, so zero rows means a young workspace, not a broken one. It renders
 *   nothing and remembers the skip.
 *
 * The SOURCE decides which one applies, never the author's taste. Without that rule the
 * question "should this section render when empty?" gets answered once per section by
 * whoever writes it, and a fresh instance inherits the empty outline of someone else's
 * history. Ported from limba, 2026-08-19 (PORT-022).
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { liveVerbs } from "./verbs.mjs";
import { tally, zones } from "./tally.mjs";

export const root = join(dirname(fileURLToPath(import.meta.url)), "..");
export const read = (rel) => readFileSync(join(root, rel), "utf8");
/** Absent is legal for instance-owned files — the template repo has none of them. */
export const readMaybe = (rel) => (existsSync(join(root, rel)) ? read(rel) : null);

/* ------------------------------------------------------------------ helpers */

/** Markdown table rows with exactly `n` cells, header and separator dropped.
 *
 *  A header is identified structurally — it is the row immediately followed by the
 *  `|---|---|` separator — not by matching its first cell against a list of known
 *  column names. The list version silently emitted "Where it failed | What it means"
 *  as a data row the first time a table used unlisted headers, which is exactly the
 *  failure mode a hardcoded list guarantees eventually (limba). */
export function rows(text, n) {
  const out = [];
  let pending = null; // last candidate row, held until we know if a separator follows
  const flush = () => { if (pending) out.push(pending); pending = null; };

  for (const line of text.split("\n")) {
    const t = line.trim();
    if (!t.startsWith("|") || !t.endsWith("|")) { flush(); continue; }
    const cells = t.slice(1, -1).split("|").map((c) => c.trim());
    if (cells.every((c) => /^:?-{2,}:?$/.test(c))) { pending = null; continue; } // header above
    if (cells.length !== n) { flush(); continue; }
    flush();
    pending = cells;
  }
  flush();
  return out;
}

/** Body of one `##`/`###` section, up to the next heading at the same level or above.
 *  Lets a table be read from the file that owns it without matching lookalike tables. */
export function section(text, headingRe) {
  const lines = text.split("\n");
  let start = -1, level = 0;
  for (let i = 0; i < lines.length; i++) {
    const m = /^(#{2,4})\s+(.+)$/.exec(lines[i]);
    if (!m) continue;
    if (start === -1) {
      if (headingRe.test(m[2])) { start = i + 1; level = m[1].length; }
      continue;
    }
    if (m[1].length <= level) return lines.slice(start, i).join("\n");
  }
  return start === -1 ? "" : lines.slice(start).join("\n");
}

export const todayISO = () => {
  const n = new Date();
  const p = (x) => String(x).padStart(2, "0");
  return `${n.getFullYear()}-${p(n.getMonth() + 1)}-${p(n.getDate())}`;
};

export const daysBetween = (aISO, bISO) => {
  const u = (s) => {
    const [y, m, d] = s.split("-").map(Number);
    return Date.UTC(y, m - 1, d);
  };
  return Math.round((u(bISO) - u(aISO)) / 86_400_000);
};

/* -------------------------------------------------------------- the two gates */

/** A heading rename must break loudly. In limba, renaming a beats heading silently
 *  emptied this table once — the page still rendered, just with nothing in it,
 *  which is the worst failure mode a generated dashboard has. */
export function must(label, list) {
  if (!list.length) {
    throw new Error(
      `sources: parsed 0 rows for "${label}" — a heading or table shape changed. ` +
        `Fix the pattern in scripts/sources.mjs rather than shipping an empty section.`,
    );
  }
  return list;
}

/** Sections a `when()` declined to render this run, in call order. */
const SKIPPED = [];

/**
 * Render `render(data)` when the record has anything in it; otherwise render nothing and
 * remember why.
 *
 * A fresh instance must not be handed the outline of someone else's history — an empty
 * "mistakes worth drilling" box teaches nothing and reads as a broken page. But a section
 * that CAN disappear can also disappear by accident, when a parser breaks on a mature
 * workspace, and that failure is silent by construction. So every skip is recorded and
 * every caller prints `skipped()`: a section missing from the page AND from that line is
 * the bug.
 */
export function when(label, data, render) {
  const n = Array.isArray(data) ? data.length : data ? 1 : 0;
  if (!n) { SKIPPED.push(label); return ""; }
  return render(data);
}

export const skipped = () => SKIPPED.slice();

/* ------------------------------------------------------------------ parsers */

/** Interval table from srs.md — canonical. Never re-declare these numbers here. */
export function intervals() {
  const map = {};
  for (const c of rows(read("docs/mechanics/srs.md"), 4)) {
    const tier = Number(c[0]);
    const days = /(\d+)\s*days?/.exec(c[2]);
    if (Number.isInteger(tier) && days) map[tier] = Number(days[1]);
  }
  if (!Object.keys(map).length) throw new Error("sources: could not read the tier table from srs.md");
  return map;
}

/**
 * What a review costs and how long there is for it — all of it from srs.md, which owns them.
 *
 * The ladder charges a different rate per rung: tier 1 is recognition, tier 2 is bare
 * production, tier 3 is the full package, tiers 4–5 sweep. On top of the per-item rates
 * there is a fixed cost **per block** — composing the set, leakcheck, the learner reading
 * and typing, marking, publishing the sheet, the grouped diagnosis. The per-item-only
 * model this replaced under-predicted a real drill by ~5× (limba, 2026-08-12).
 *
 * All five numbers are read from the prose that states them, and this throws rather than
 * guessing: a silently-wrong estimate is printed on the learner's own bookmark.
 */
export function pace() {
  const src = read("docs/mechanics/srs.md").replace(/\s+/g, " ");
  const grab = (re, what) => {
    const m = re.exec(src);
    if (!m) {
      throw new Error(
        `sources: could not read ${what} from srs.md — the "What a review block costs" cost-model ` +
          `paragraph must still state it in the shape this regex expects: ${re}`,
      );
    }
    return Number(m[1]);
  };
  return {
    recognise: grab(/recognition ~(\d+) s per item/, "the recognition rate"),
    bare: grab(/bare production ~(\d+) s per item/, "the bare-production rate"),
    full: grab(/the full package ~(\d+) s per item/, "the full-package rate"),
    perBlock: grab(/~(\d+) minutes fixed per block/, "the per-block fixed cost"),
    box: grab(/review block (\d+) minutes/, "the review box"),
  };
}

/**
 * The 8-cell count is a silent contract: a wrong count matches nothing and renders a page
 * reporting zero tracked items with no error. Empty IS legal — a fresh instance has ledgers
 * with only their header — so the guard here is the header shape, not the row count.
 *
 * THE SHAPE IS NOT ASSERTED HERE. It used to be: `must()` on the 8-cell rows, which made a
 * page ungeneratable on a fresh install because the ledgers legitimately have none. The
 * requirement belongs to the CONSUMER that has it — the hub cannot say anything without a
 * ledger and asserts so itself, the profile page gates and grows — and the shape is checked
 * where shape belongs, in state/ledgers.test.ts (limba PORT-022).
 */
export function ledger(rel) {
  const text = read(rel);
  const out = rows(text, 8).map((c) => ({
    id: c[0], target: c[1], en: c[2], tier: Number(c[3]), added: c[4], last: c[5],
    topic: c[6], notes: c[7],
  }));
  if (!out.length && !/^\|\s*id\s*\|/m.test(text)) {
    throw new Error(`sources: ${rel} has neither data rows nor the schema header — the ledger shape changed.`);
  }
  return out;
}

/** The `Built —` marker that opens a staged page's Teaches cell. Declared here so the
 *  registry, both generated pages and docs/visuals.index.test.ts read one definition. */
export const BUILT_RE = /^\s*(\*\*)?Built(\*\*)?\s*[—-]/;

/** Remove the marker so the description can start with what the page teaches.
 *
 *  Separate from BUILT_RE on purpose: BUILT_RE is the DETECTION contract, shared with
 *  docs/visuals.index.test.ts, and widening it to swallow trailing markup would loosen the
 *  check that a row cannot claim a delivery it did not make. Rows in the wild are bold on
 *  both halves — `**Built —** **the present tense finished**` — so the strip has to take
 *  the emphasis that opens the sentence after it, which detection must not. */
export const stripBuilt = (cell) =>
  cell.replace(/^\s*(\*\*)?Built(\*\*)?\s*[—-]\s*(\*\*)?\s*/, "").trim();

/** `Units` is space-separated so one page can belong to every unit it touches, and `Kind`
 *  is declared rather than guessed (limba, 2026-08-09). Empty is legal — a fresh instance
 *  has built no pages yet. */
export function visuals() {
  const text = readMaybe("work/visuals/README.md");
  if (!text) return [];
  return rows(text, 5).map((c) => {
    const file = /\(([^)]+\.(?:html|svg))\)/.exec(c[1]);
    const name = /\[([^\]]+)\]/.exec(c[1]);
    const dated = /^\d{4}-\d{2}-\d{2}$/.test(c[0]);
    return {
      /** null when the page is built and not yet taught — the registry's own flag. */
      date: dated ? c[0] : null,
      name: name ? name[1] : c[1],
      file: file ? file[1] : null,
      teaches: stripBuilt(c[2]),
      units: c[3].split(/\s+/).filter(Boolean),
      kind: c[4],
      superseded: /superseded/i.test(c[2]),
      /** No delivery date = prepared, not taught yet. Pages are indexed the moment they
       *  pass the gate (media.md → Delivering a visual, rule 3), so this is the state most
       *  rows start in — the card has to say so, or the learner reads unfinished material
       *  as this session's lesson. */
      built: !dated,
    };
  });
}

export function topics() {
  const text = readMaybe("docs/reference/topics.md");
  if (!text) return [];
  const out = [];
  let sectionName = "—";
  for (const line of text.split("\n")) {
    const h = /^## (.+)$/.exec(line.trim());
    if (h) { sectionName = h[1]; continue; }
    const t = line.trim();
    if (!t.startsWith("|") || !t.endsWith("|")) continue;
    const c = t.slice(1, -1).split("|").map((x) => x.trim());
    if (c.length !== 5 || /^-{2,}$/.test(c[0]) || c[0] === "ID") continue;
    out.push({ section: sectionName, id: c[0], aspect: c[1], unit: c[2], exam: c[3], status: c[4] });
  }
  return out;
}

export function units() {
  const text = readMaybe("docs/curriculum.md");
  if (!text) return [];
  const lines = text.split("\n");
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const h = /^## (U\d+)\s+—\s+(.+)$/.exec(lines[i]);
    if (!h) continue;
    const s = /^status:\s*(.+)$/.exec((lines[i + 1] || "").trim());
    // The can-do line, from the unit's own body up to the next unit heading. It is what the
    // unit is FOR, in the learner's words, and the only sentence a surface can use to say
    // why continuing this unit is worth doing rather than just which one is open.
    const body = lines.slice(i + 1, lines.findIndex((l, j) => j > i && /^## U\d+\s+—/.test(l)) + 1 || undefined);
    const cando = /^[-*]?\s*\*{0,2}Can-do:?\*{0,2}\s*(.+)$/im.exec(body.join("\n"));
    out.push({
      id: h[1], title: h[2], status: s ? s[1] : "pending",
      cando: cando ? cando[1].replace(/\*\*/g, "").trim() : null,
    });
  }
  return out;
}

/* -------------------------------------------------------- the graded check
 *
 * ONE READER, USED BY THE PAGE AND BY CI. The close-out template asks for a score and a
 * contract test holds every lesson to it; if the two ends of that pipeline disagree, the
 * chart goes dark and nothing notices. Upstream's did, for twelve days: the template said
 * `N/M = P%`, the parser demanded a literal `/10`, and only four entries in the whole log
 * ever matched (limba PORT-024). docs/logs.entries.test.ts imports this function, so a
 * parser change that breaks the chart breaks CI in the same run.
 *
 * It returns PERCENTAGES, never raw marks. A mark out of 10 and a mark out of 21 are not
 * comparable and the chart plotted them as if they were.
 *
 * Three shapes are read, newest first:
 *   1. `grammar 8.5/10 = 85% · vocabulary 0/4` — the current instrument, two numbers.
 *   2. `graded check 9/16 = 56%`               — one number, any denominator.
 *   3. `graded check 7.7/10 = 77%`             — the original shape, so old bars survive.
 *
 * Shapes 2 and 3 stay anchored on the words "graded check" deliberately: a bare `\d+/\d+`
 * also matches a drill's item counts, and it once plotted "Verbs 4/8 → 8/10" as a graded
 * score for a session that ran no graded check at all. A dashboard that invents a data
 * point is worse than one that omits it.
 */
const pctOf = (m) => (m ? Math.round((Number(m[1]) / Number(m[2])) * 1000) / 10 : null);

/** The `**Score.**` bullet of one entry, up to the next top-level bullet. Scoping to it
 *  matters: entries discuss grammar and quote fractions all through their prose, and a
 *  pattern loose enough to catch every score shape is loose enough to catch those. */
const scoreBullet = (block) => {
  // The label's own markup varies — `**Score.**`, `**Scores.**`, and `- **Score. Graded
  // check 7.7/10 = 77%**` with the number INSIDE the bold. So the anchor is the word, not
  // the closing marker, and the bullet runs to the next top-level one.
  const m = /-\s*\*{0,2}Scores?\b([\s\S]*?)(?:\n\n|\n- \*\*|$)/.exec(block);
  return m ? m[1] : "";
};

/**
 * The date the two-number instrument starts — the day after the release that shipped it.
 *
 * DATED, and not retroactive, for the reason every dated rule over a log is: the log is
 * append-only, so an entry written before the rule cannot be edited to satisfy it. It also
 * prevents a false reading — an older entry may use "grammar" and "vocabulary" as ordinary
 * words beside ordinary fractions (a first-exposure baseline, `grammar 0/5, vocabulary
 * 0/2`), and reading those as scores invents data points. Entries written on the release
 * day itself are already under the old template, which is why this is the day after.
 */
export const SPLIT_FROM = "2026-08-20";

export function gradedScore(block, type = "", date = "") {
  // A DRILL HAS NO GRADED CHECK, by rule (session_format.md: the band is fitted to ten
  // questions on the day's NEW material; a drill measures retention of old material, where
  // the same number means the opposite thing). Its block scores are real numbers that
  // belong nowhere near this series, so they are refused at the source, not filtered later.
  if (!/^lesson/i.test(type)) return { grammar: null, vocabulary: null, split: false };
  const line = scoreBullet(block);
  const grammar = /\bgrammar\b[^\n%]{0,24}?(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)/i.exec(line);
  const vocab = /\bvocabular(?:y|ies)\b[^\n%]{0,24}?(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)/i.exec(line);
  if (grammar && date >= SPLIT_FROM) {
    return { grammar: pctOf(grammar), vocabulary: pctOf(vocab), split: true };
  }
  const one = /graded check[^\n]{0,40}?(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)/i.exec(line)
    || /(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)[^\n]{0,30}?on the graded check/i.exec(line);
  return { grammar: pctOf(one), vocabulary: null, split: false };
}

export function sessions() {
  const text = readMaybe("docs/logs/session_log.md");
  if (!text) return [];
  const parts = text.split(/^## /m).slice(1);
  return parts.map((block) => {
    const head = /^(\d{4}-\d{2}-\d{2}) — (SES-\d+)/.exec(block);
    if (!head) return null;
    const type = /\*\*Type\.\*\*\s*([^.—\n]+)/.exec(block);
    const score = gradedScore(block, type ? type[1].trim() : "", head[1]);
    // Stop at the next top-level bullet as well as at a blank line: a long pointer running
    // straight into "- **Open questions.**" used to swallow it and print it as the action.
    const next = /\*\*Next\.\*\*\s*([\s\S]*?)(?:\n\n|\n- \*\*|$)/.exec(block);
    return {
      date: head[1], id: head[2],
      type: type ? type[1].trim() : "—",
      /** Percent, not a mark out of ten. */
      score: score.grammar,
      scores: score,
      next: next ? next[1].replace(/\s+/g, " ").trim() : null,
    };
  }).filter(Boolean);
}

/** The ROOT tally, from scripts/tally.mjs — the same list the drill playbook acts on.
 *  Imported rather than recomputed: a dashboard showing a different ranking from the one
 *  driving practice is worse than no dashboard. */
export function errorTally() {
  const { live: counts, root: allTime, surface, moved, measured, banked, span } = tally();
  const z = zones();
  return {
    rows: counts.map(([code, n]) => ({ code, n, zone: z[code] || "", ...(span[code] || {}) })),
    moved,
    differs: JSON.stringify(counts) !== JSON.stringify(surface),
    // What a later clean measurement has answered — shown, not hidden, so the learner can see
    // why a zone they remember failing is missing from the list.
    measured: measured.map((m) => ({
      ...m,
      n: banked.filter((b) => b.code === m.code).reduce((a, b) => a + b.n, 0),
      zone: z[m.code] || "",
    })),
    allTime,
  };
}

/** The `(current)` marker on a plan.md phase heading. The old pattern was `[^\n(]+?`, which
 *  stops at the FIRST `(` — so it matched a bare title and returned null the moment a phase
 *  carried its own parenthetical, which is the normal shape. Null renders as an empty
 *  string: the page still draws, it just silently stops saying which phase the learner is
 *  in. That is exactly the failure `must()` exists to prevent, so this throws.
 *
 *  No plan.md at all is a different case and stays legal — maintainer mode, or an instance
 *  before setup finishes. Absent means "nothing to say"; present-but-unmarked means someone
 *  broke the contract. */
export function currentPhase() {
  const text = readMaybe("docs/plan.md");
  if (!text) return null;
  const marked = [...text.matchAll(/^## (Phase \d+ — .+?)\s*\(current\)\s*$/gm)];
  if (marked.length !== 1) {
    throw new Error(
      `sources: found ${marked.length} plan.md phase headings marked "(current)", expected exactly 1. ` +
        `Mark the open phase in docs/plan.md rather than shipping a dashboard with no phase.`,
    );
  }
  return marked[0][1].trim();
}

/* The learning design, read from the files that define it. Retyping any of it here would
   make a generated page another place these rules live. */
export const lessonParts = () =>
  must("the five parts", rows(section(read("docs/mechanics/session_format.md"), /^The five parts/), 4));
export const teachingBeats = () =>
  must("the beats", rows(section(read("docs/mechanics/teaching.md"), /beats — in order/), 3));
/** The pacing table is instance content inside plan.md — absent is legal (a no-deadline
 *  instance may plan without one), so this one degrades instead of throwing. */
export const pacing = () => {
  const text = readMaybe("docs/plan.md");
  return text ? rows(section(text, /^Pacing table/), 5) : [];
};
export const calibration = () =>
  must("difficulty calibration", rows(section(read("docs/mechanics/session_format.md"), /^Difficulty calibration/), 3));

/* ------------------------------------------------- the weekly pace instruction
 * The weekly load is NOT retyped here — it is read out of the current phase's own row
 * in plan.md's pacing table, which is where the plan states it. Change the plan and
 * this surface changes with it; that is the whole point.
 *
 * Ported from limba, 2026-08-15. Its weekly review found 11 sessions in 7 days — 3
 * lessons and 8 drills against a planned 4 + 2 — and no unit closed for five days,
 * because the second half of a unit is the half a drill displaces without anything
 * looking skipped. Every one of those numbers was in the log the whole time and nothing
 * added them up. A rule nobody can see the score against is a preference, not a rule. */
export function weeklyTarget(phaseName) {
  const n = /Phase (\d+)/.exec(phaseName || "");
  if (!n) return null;
  const row = pacing().find((r) => r[0].trim() === n[1]);
  if (!row) return null;
  const load = row[4] || "";
  const lessons = /(\d+)\s*lessons?/i.exec(load);
  // A late phase may trade drills for writes, or have neither — read the label off the
  // plan rather than assuming the pair. An unparseable cell degrades to "no target".
  const second = /(\d+)\s*(drills?|writes?)/i.exec(load);
  if (!lessons) return null;
  return {
    lessons: Number(lessons[1]),
    capN: second ? Number(second[1]) : null,
    capLabel: second ? second[2].replace(/s$/, "") : null,
    load: load.trim(),
  };
}

/**
 * The Monday of the calendar week containing `iso`.
 *
 * THE WEEK IS A CALENDAR WEEK, NOT A ROLLING SEVEN DAYS (limba PORT-024). A rolling window
 * never resets, so "this week" means something different every morning and the plan's
 * per-week load has nothing to be scored against. Upstream measured the gap on 2026-08-19:
 * the rolling read gave 3 lessons and 3 drills by reaching back into the previous Saturday,
 * while the calendar week the learner was actually in held 2 and 1.
 *
 * MONDAY TO SUNDAY, not Monday to Friday. 6 of upstream's first 23 sessions ran at a
 * weekend, so a working-week window would silently drop a quarter of the record. That ratio
 * is upstream's learner, not a universal — an instance whose own record disagrees should
 * re-derive it rather than inherit this choice.
 */
export function weekStart(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  const t = Date.UTC(y, m - 1, d);
  const dow = new Date(t).getUTCDay(); // 0 = Sunday
  const back = dow === 0 ? 6 : dow - 1;
  return new Date(t - back * 86_400_000).toISOString().slice(0, 10);
}

const addDays = (iso, n) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d) + n * 86_400_000).toISOString().slice(0, 10);
};

/** Sessions in the CALENDAR week containing `today`, split by what they actually were.
 *  `sessions()` already parses the Type line; this only classifies it. Anything that is
 *  neither a lesson nor a drill (a review, a mock) is counted separately and held OUT of
 *  both scores — a review is not a study block and must not flatter the lesson count. */
export function paceWeek(all, today) {
  const from = weekStart(today);
  const to = addDays(from, 6);
  const recent = all.filter((x) => x.date >= from && x.date <= to);
  const is = (x, re) => re.test(x.type);
  return {
    from, to,
    /** Days left in the week, today included — what the mix still has time to fix. */
    left: daysBetween(today, to) + 1,
    days: 7,
    lessons: recent.filter((x) => is(x, /^lesson/i)).length,
    drills: recent.filter((x) => is(x, /^drill/i)).length,
    other: recent.filter((x) => !is(x, /^lesson/i) && !is(x, /^drill/i)).length,
    total: recent.length,
  };
}

/* --------------------------------------------------------- the unit's state
 *
 * ONE value, computed once, read by every surface that states where a unit stands.
 *
 * Before this existed the hub derived the same thing three separate times — the board pill,
 * the `<details open>` attribute, and `nextUnit` — and none of the three could see the
 * registry's staged flag. That is how a finished page for a unit sat on disk while the same
 * unit's row read "not opened" (limba, 2026-08-19): two files each held half the answer and
 * nothing put them together.
 */

/**
 * Where a unit stands, as one of five values.
 *
 * `staged` is returned ALONGSIDE the state rather than only as one of its values, because
 * the two are orthogonal: a part-taught unit can also have a page built for its second
 * half, and a surface that wants to flag "material is waiting" must be able to ask that of
 * any unit, whatever its state.
 *
 * Nothing here is hand-maintained. A staged page is one whose registry Date cell is empty,
 * and docs/visuals.index.test.ts already ENFORCES that a row carries either a date or the
 * `Built —` marker and never both — so an empty date means staged by contract, not by
 * convention.
 */
export function unitState(unit, aspects, pages) {
  const total = aspects.length;
  const covered = aspects.filter((a) => /^covered/i.test(a.status)).length;
  const staged = pages.filter((p) => !p.date);
  // A unit with no aspects mapped to it cannot be scored — guard the division and say so
  // rather than reporting 0/0 as either finished or untouched.
  const state = total === 0 ? "unmapped"
    : covered === total ? "taught"
    : covered > 0 ? "part-taught"
    : staged.length ? "staged"
    : "not-opened";
  return { state, covered, total, staged };
}

/* ----------------------------------------------- readers the profile page adds */

/**
 * Top-level `- **Claim.** body` bullets of one section, split into a claim, a date and a body.
 *
 * The profile's operational section and its "Measured, not assumed" findings are both
 * written this way, and both answer "how does this workspace see me" — which the learner
 * should be able to read and contest, not something only an agent ever sees.
 *
 * The date is the parenthesised one a bullet carries once it has been measured; the
 * evidence chip is the first SES/ERR id or dated snapshot link, which is how a claim here
 * gets checked.
 */
export function claims(text, headingRe) {
  const body = section(text, headingRe);
  const out = [];
  for (const raw of body.split(/\n(?=- )/)) {
    const b = raw.trim();
    if (!b.startsWith("- ")) continue;
    const t = b.slice(2).replace(/\s+/g, " ").trim();
    // Most bullets open `**Claim.** body`; a few open with an inline-bolded phrase instead,
    // where the sentence IS the claim. Both are handled, and in both the body is what comes
    // AFTER the claim — a claim repeated verbatim as its own explanation reads as a
    // rendering bug, which is what it was.
    const bold = /^\*\*(.+?)\*\*/.exec(t);
    const first = t.split(/(?<=[.!?])\s+(?=[A-Z(])/)[0];
    const claim = bold ? bold[1].replace(/[.,;:]$/, "") : first;
    const date = /\((\d{4}-\d{2}-\d{2})/.exec(t);
    const ev = /\b(SES-\d+|ERR-\d+)\b/.exec(t)
      || /\]\((?:[^)]*\/)?(\d{4}-\d{2}-\d{2})_[^)]*\.md\)/.exec(t);
    out.push({
      claim,
      date: date ? date[1] : null,
      evidence: ev ? ev[1] : null,
      body: (bold ? t.slice(bold[0].length) : t.slice(first.length)).replace(/^[\s.—-]+/, ""),
    });
  }
  return out;
}

/**
 * The marking sheets in work/sets/, counted by their marks rather than their tables.
 *
 * These are the only per-item record the workspace keeps and nothing had ever parsed them.
 * The tables differ between sheets — five columns here, six there, different headers — so
 * the tables are not the stable thing. The GLYPHS are: ✅ clean, 🟡 half, ❌ wrong. 🟡 is the
 * engine's own distinction, "right rule, wrong letters", which is why the split is worth
 * more than the total: a session can score the same twice and mean two different things
 * about what is broken.
 *
 * A sheet with no glyphs is skipped and NAMED by the caller, never counted as a zero — a
 * silent zero would read as a session that got everything wrong.
 */
export function markedSets() {
  const dir = join(root, "work/sets");
  if (!existsSync(dir)) return [];
  const out = [];
  for (const f of readdirSync(dir).filter((n) => n.endsWith("-marked.md")).sort()) {
    const text = readFileSync(join(dir, f), "utf8");
    const count = (re) => (text.match(re) || []).length;
    const ok = count(/✅/g), half = count(/🟡/g), bad = count(/❌/g);
    const date = (/^(\d{4}-\d{2}-\d{2})/.exec(f) || [])[1] || null;
    out.push({ file: f, date, ok, half, bad, total: ok + half + bad });
  }
  return out;
}

/** The snapshots registry — the table in the README, not the files. Same reasoning as the
 *  visuals index: the registry is the authored claim about what exists. */
export function snapshots() {
  const rel = "docs/snapshots/README.md";
  const text = readMaybe(rel);
  if (!text) return [];
  return rows(text, 3)
    .map((c) => ({ date: c[0], name: c[1], hook: c[2] }))
    .filter((r) => /^\d{4}-\d{2}-\d{2}$/.test(r.date));
}

/** The verb list, from playbooks/*.md frontmatter — the agent-neutral home of what limba
 *  kept in .claude/skills/, narrowed to the verbs THIS instance answers to
 *  ([verbs.mjs](verbs.mjs): focus mode, plus the goal contract for tutor-prep). The shell
 *  command list comes from AGENTS.md's ## Commands block, when it has one.
 *
 *  `focus` is passed in rather than read here — this module knows nothing about a learner. */
export function commands(focus = "full") {
  const verbs = liveVerbs({
    root,
    focus,
    // `tutor-prep` is live only when the goal contract has a Tuition section — that section
    // existing IS the tuition scenario (playbooks/tutor-prep.md § Activation rule).
    tuition: /^##\s+Tuition\b/m.test(readMaybe("docs/reference/goal.md") || ""),
  });

  const agentsMd = readMaybe("AGENTS.md") || "";
  const block = /## Commands\s*```([\s\S]*?)```/.exec(agentsMd);
  const shell = block
    ? block[1].split("\n").map((l) => l.trim()).filter(Boolean).map((l) => {
        const i = l.indexOf("#");
        return i > 0 ? { cmd: l.slice(0, i).trim(), desc: l.slice(i + 1).trim() } : { cmd: l, desc: "" };
      })
    : [];
  return { verbs, shell, focus };
}
