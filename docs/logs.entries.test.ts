// mova:engine
/**
 * Ordering contract for docs/logs/ (session_log.md, error_log.md).
 *
 * The logs are append-only evidence: the error tally that decides what gets drilled
 * greps them, and "newest first" is what makes the recent past readable at the top.
 * A renumbered ID or an entry appended to the bottom corrupts both quietly — so the
 * ordering is CI, not goodwill.
 *
 * What is enforced:
 *   - every `## ` heading matches `## YYYY-MM-DD — <PREFIX>-NNN` exactly;
 *   - IDs are unique and strictly DESCENDING down the file (newest first);
 *   - dates are real, non-increasing down the file, and never in the future.
 *
 * Both logs may legitimately be empty: the template ships them with intros and zero
 * entries, and a fresh instance has no sessions yet. (limba required at least one session
 * entry — its scaffold session; an instance may tighten `allowEmpty` once it has history.)
 *
 * If this fails, fix the log — but never by editing old entries: move your NEW entry to
 * the top with the next ID. Old entries are immutable. Append via
 * `scripts/log-append.mjs`, which assigns the ID under a lock.
 */

import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

/** The only project-specific configuration. */
const CONTRACT = {
  logs: [
    // allowEmpty true on BOTH: a fresh mova instance has no sessions yet.
    { file: "logs/session_log.md", idPrefix: "SES", allowEmpty: true },
    { file: "logs/error_log.md", idPrefix: "ERR", allowEmpty: true },
  ],
} as const;

const docsDir = dirname(fileURLToPath(import.meta.url));

// The logs ship with the template; treat their absence as template-repo surgery in
// progress rather than a failure of THIS contract.
const active = existsSync(join(docsDir, "logs/session_log.md"));

const ISO_RE = /^\d{4}-\d{2}-\d{2}$/;

function isRealDate(iso: string): boolean {
  if (!ISO_RE.test(iso)) return false;
  const [y, m, d] = iso.split("-").map(Number);
  const t = new Date(Date.UTC(y, m - 1, d));
  return t.getUTCFullYear() === y && t.getUTCMonth() === m - 1 && t.getUTCDate() === d;
}

function todayISO(): string {
  const n = new Date();
  const p = (x: number) => String(x).padStart(2, "0");
  return `${n.getFullYear()}-${p(n.getMonth() + 1)}-${p(n.getDate())}`;
}

interface Entry {
  lineNo: number;
  date: string;
  num: number;
}

for (const log of CONTRACT.logs) {
  const path = join(docsDir, log.file);
  const lines = active && existsSync(path) ? readFileSync(path, "utf8").split("\n") : [];
  const headingRe = new RegExp(`^## (\\d{4}-\\d{2}-\\d{2}) — ${log.idPrefix}-(\\d{3,})$`);

  const entries: Entry[] = [];
  const malformed: string[] = [];
  lines.forEach((line, i) => {
    if (!line.startsWith("## ")) return;
    const m = line.match(headingRe);
    if (m) entries.push({ lineNo: i + 1, date: m[1], num: Number(m[2]) });
    else malformed.push(`${log.file}:${i + 1} "${line}"`);
  });

  describe.skipIf(!active)(`docs/${log.file}`, () => {
    it("exists beside session_log.md", () => {
      expect(existsSync(path), `${log.file} is missing`).toBe(true);
    });

    it(`every ## heading matches \`## YYYY-MM-DD — ${log.idPrefix}-NNN\``, () => {
      expect(malformed, `malformed entry headings:\n  ${malformed.join("\n  ")}`).toEqual([]);
    });

    if (!log.allowEmpty) {
      it("has at least one entry", () => {
        expect(entries.length).toBeGreaterThan(0);
      });
    }

    it("IDs are unique and strictly descending (newest first)", () => {
      for (let i = 1; i < entries.length; i++) {
        expect(
          entries[i].num < entries[i - 1].num,
          `${log.file}:${entries[i].lineNo} ${log.idPrefix}-${entries[i].num} appears below ` +
            `${log.idPrefix}-${entries[i - 1].num} — new entries go at the TOP with the next ID`,
        ).toBe(true);
      }
    });

    it("dates are real, non-increasing down the file, never in the future", () => {
      const today = todayISO();
      for (const e of entries) {
        expect(isRealDate(e.date), `${log.file}:${e.lineNo} date "${e.date}"`).toBe(true);
        expect(e.date <= today, `${log.file}:${e.lineNo} date ${e.date} is in the future`).toBe(true);
      }
      for (let i = 1; i < entries.length; i++) {
        expect(
          entries[i].date <= entries[i - 1].date,
          `${log.file}:${entries[i].lineNo} date ${entries[i].date} is newer than the entry above it`,
        ).toBe(true);
      }
    });
  });
}

/* ------------------------------------------------------- session entry word budget */

/**
 * A session-log entry POINTS at the record; it does not restate it.
 *
 * THE MEASUREMENT (limba, 2026-08-15). session_format.md asks a session entry for seven
 * fields — type, covered, SRS counts, score, duration, next, open questions. Real entries
 * ran 794–1,544 words. The difference is retelling: that log names 48 distinct `ERR-NNN`
 * IDs, and every one already has its own entry in error_log.md averaging 262 words. The
 * same goes for a curriculum decision that also lives in curriculum.md. The session entry
 * is routinely the third copy of a story that is already greppable twice.
 *
 * That costs twice. It is written at close-out, which measured 31% of a session's agent
 * time; and it is read forever after, because every session's orient reads the newest
 * entry. At ~1,000 words a session a year of study reaches ~90,000 words. At ~300 it
 * reaches ~40,000, with nothing lost — the removed sentences all exist in a file that
 * owns them.
 *
 * WHY A TEST AND NOT ADVICE. This exact drift was advice for sixteen days upstream and grew
 * the whole time. A budget forces the choice a target never does.
 *
 * THE ESCAPE HATCH IS THE POINT. A session that genuinely needs the words says so in the
 * entry and keeps them. What the budget removes is drifting past it by default, not the
 * option of a long entry. The failure message says *point, do not retell* rather than
 * quoting the number, because pressure on a word count otherwise produces denser jargon
 * instead of relocation.
 *
 * NOT RETROACTIVE. The logs are append-only and old entries are immutable — an entry cannot
 * be edited to satisfy a rule written after it. So the budget starts on a date, the same
 * shape scripts/visualcheck.mjs uses for its own late-arriving gates.
 */
const BUDGET = {
  /** Entries dated on or after this are held to the budget. Before it, they are history. */
  effectiveFrom: "2026-08-16",
  /** Word counts of the entry body, heading excluded. */
  warnAt: 350,
  failAt: 450,
  /**
   * Types the budget applies to, read from the entry's opening `**Type.**` line.
   * A review or a mock is a synthesis across many sessions and is meant to be long — those
   * are the entries where the retelling is the product rather than a duplicate.
   */
  applies: /^(lesson|drill|write|vocab)/i,
  /** An entry carrying this keeps its length, on purpose and on the record. */
  override: /<!--\s*long-entry:\s*\S/,
} as const;

describe("session_log.md entry budget", () => {
  const raw = readFileSync(join(docsDir, "logs/session_log.md"), "utf8").split("\n");

  /** Split the file into entries: heading line, its date, and every line until the next. */
  const parsed: { id: string; date: string; line: number; body: string[] }[] = [];
  raw.forEach((line, i) => {
    const m = line.match(/^## (\d{4}-\d{2}-\d{2}) — (SES-\d{3,})$/);
    if (m) parsed.push({ id: m[2], date: m[1], line: i + 1, body: [] });
    else if (parsed.length) parsed[parsed.length - 1].body.push(line);
  });

  const words = (lines: string[]) => lines.join(" ").split(/\s+/).filter(Boolean).length;
  const typeOf = (body: string[]) =>
    body.join("\n").match(/\*\*Type\.\*\*\s*([A-Za-z ]+)/)?.[1].trim() ?? "";

  const governed = parsed.filter(
    (e) =>
      e.date >= BUDGET.effectiveFrom &&
      BUDGET.applies.test(typeOf(e.body)) &&
      !BUDGET.override.test(e.body.join("\n")),
  );

  /**
   * A fresh instance has no sessions — that is legal here (unlike upstream, where the log
   * is never empty), so this asserts the PARSER rather than the content: if there are
   * headings, each one got a body. A silent zero from a broken regex would otherwise pass
   * this file forever.
   */
  it("parses every entry it finds", () => {
    expect(parsed.every((e) => e.body.length > 0)).toBe(true);
    const headings = raw.filter((l) => /^## \d{4}-\d{2}-\d{2} — SES-\d{3,}$/.test(l)).length;
    expect(parsed.length).toBe(headings);
  });

  it(`no lesson/drill/write/vocab entry exceeds ${BUDGET.failAt} words`, () => {
    const over = governed
      .map((e) => ({ ...e, n: words(e.body) }))
      .filter((e) => e.n > BUDGET.failAt)
      .map(
        (e) =>
          `session_log.md:${e.line} ${e.id} is ${e.n} words (budget ${BUDGET.failAt}).\n` +
          `      Point, do not retell: name the ERR-NNN and stop. Each already has its own\n` +
          `      entry, and the tally greps those, not this one.\n` +
          `      If this entry genuinely needs the length, keep it and say why:\n` +
          `      <!-- long-entry: the U04 ordering decision needs its full reasoning here -->`,
      );
    expect(over, `over budget:\n  ${over.join("\n  ")}`).toEqual([]);
  });

  it(`warns before it bites (soft target ${BUDGET.warnAt})`, () => {
    const near = governed
      .map((e) => ({ ...e, n: words(e.body) }))
      .filter((e) => e.n > BUDGET.warnAt && e.n <= BUDGET.failAt);
    for (const e of near) {
      console.warn(
        `  ⚠ ${e.id} is ${e.n} words — over the ${BUDGET.warnAt}-word target, ` +
          `under the ${BUDGET.failAt} limit. Trim the retelling before it fails.`,
      );
    }
    expect(true).toBe(true); // a warning, never a failure — that is what warnAt means
  });
});

/* --------------------------------------------- the Next pointer states work, never counts */

/**
 * A pointer's counts freeze; every surface that quotes it recomputes its own.
 *
 * WHY A TEST. The `Next` field is the one line the next session is guaranteed to read, and it
 * is read verbatim — by the orient ritual and by `scripts/hub.mjs`, which quotes it in the
 * "What to do next" panel. Upstream, a close-out wrote `the queue is now 87 vocab · 17
 * grammar` into item (1). The next morning the queue was 108, the panel printed its own live
 * count a few lines below the quoted one, and the learner read the two as contradicting
 * instructions and stopped to arbitrate. The cost is not the wrong number — it is that the
 * surface whose whole job is "what do I do now" became something to double-check
 * (`docs/mechanics/session_format.md` → *Which block to run*).
 *
 * WHAT IS BARRED: a measurement of the queue — `87 vocab`, `17 grammar`, `59 due`, `12 items`,
 * `4 rows`, or an `N · N` pair. What stays legal is NAMING a set: "the 14 city words", "the
 * five unrehearsed adjectives". A name is an identity and stays true; a count is a measurement,
 * and `queue.mjs` owns it, recomputed per run.
 *
 * NOT RETROACTIVE — same reason and same dated shape as the budget above: the logs are
 * append-only, so a rule written today cannot reach the entries below it.
 */
const POINTER = {
  /**
   * Entries dated on or after this are held to the rule. It is the date the rule shipped in
   * the template — **an instance that adopts it later should move this forward to its own
   * adoption date**, so pointers written before it are read as history rather than failures.
   */
  effectiveFrom: "2026-08-18",
  /** A number bound to a queue noun, or a `N · N` count pair. */
  counts: /\b\d+\s*(?:vocab|grammar|due|items?|rows?)\b|\b\d+\s*·\s*\d+\b/gi,
} as const;

describe.skipIf(!active)("session_log.md Next pointer", () => {
  const raw = readFileSync(join(docsDir, "logs/session_log.md"), "utf8").split("\n");
  const parsed: { id: string; date: string; line: number; body: string[] }[] = [];
  raw.forEach((line, i) => {
    const m = line.match(/^## (\d{4}-\d{2}-\d{2}) — (SES-\d{3,})$/);
    if (m) parsed.push({ id: m[2], date: m[1], line: i + 1, body: [] });
    else if (parsed.length) parsed[parsed.length - 1].body.push(line);
  });

  /** The pointer runs to the next top-level bullet — the same bound hub.mjs parses with. */
  const pointerOf = (body: string[]) =>
    body.join("\n").match(/\*\*Next\.\*\*([\s\S]*?)(?:\n\n|\n- \*\*|$)/)?.[1] ?? "";

  it("states work, never a count of the queue", () => {
    const offenders = parsed
      .filter((e) => e.date >= POINTER.effectiveFrom)
      .map((e) => ({ e, hits: pointerOf(e.body).match(POINTER.counts) ?? [] }))
      .filter((x) => x.hits.length)
      .map(
        (x) =>
          `session_log.md:${x.e.line} ${x.e.id} pointer measures the queue: ` +
          `${x.hits.map((h) => `"${h.trim()}"`).join(", ")}\n` +
          `      Name the set, not its size — "the 14 city words", not "87 vocab · 17 grammar".\n` +
          `      queue.mjs owns live counts; a frozen one reappears in the hub panel tomorrow\n` +
          `      beside the real one (session_format.md, close-out step 4).`,
      );
    expect(offenders, `pointer counts:\n  ${offenders.join("\n  ")}`).toEqual([]);
  });

  /**
   * A fresh instance has no sessions, so this asserts the PARSER on whatever exists rather
   * than requiring content: if there are entries, the newest one has a pointer to find. A
   * silent empty from a broken regex would otherwise pass this file forever.
   */
  it("finds a pointer in the newest entry, when there is one", () => {
    if (!parsed.length) return;
    expect(pointerOf(parsed[0].body).trim().length).toBeGreaterThan(0);
  });
});
