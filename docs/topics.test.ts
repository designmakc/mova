// mova:engine
/**
 * Coverage contract for docs/reference/topics.md.
 *
 * The topic map is what every teaching block's Placement statement is derived from
 * (docs/mechanics/teaching.md ①). If it drifts from the curriculum — a unit reference that
 * no longer exists, a unit nobody mapped — then "this covers 1 of 7, the rest arrives in
 * U13" becomes a sentence the workspace can no longer stand behind. That claim is the
 * learner's only defence against not knowing what they don't know, so it's CI.
 *
 * What is enforced:
 *   - every topic section (`## …`) holds a well-formed 5-column table with ≥1 row;
 *   - every `id` is a unique `T-NNNN` — the state/ ledgers address aspects by it, so an id
 *     is a permanent handle and must never be reused or renumbered;
 *   - every `unit` cell is exactly one `UNN` that exists as a heading in curriculum.md;
 *   - every `exam` cell is a space-separated subset of the goal's section letters
 *     (profile config `sections:` — limba hard-coded R W L S);
 *   - every `status` cell is `pending` or `covered YYYY-MM-DD` (real date, not future);
 *   - every unit in curriculum.md appears at least once — no unit whose contribution to a
 *     topic nobody can state.
 *
 * If this fails, fix topics.md — not the test.
 *
 * TEMPLATE MODE: topics.md and the profile are generated at setup; the suite skips until
 * both exist.
 */

import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { loadProfile } from "../scripts/profile.mjs";

const docsDir = dirname(fileURLToPath(import.meta.url));
const topicsPath = join(docsDir, "reference/topics.md");
const curriculumPath = join(docsDir, "curriculum.md");

const profile = loadProfile();
const active = profile !== null && existsSync(topicsPath) && existsSync(curriculumPath);

/** The goal's section letters, from the one machine-readable profile block. */
const sections: string[] = active ? profile!.list("sections") : [];
const SECTION = `(?:${sections.map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`;

const CONTRACT = {
  file: "reference/topics.md",
  curriculum: "curriculum.md",
  header: ["ID", "Aspect", "Unit", "Exam", "Status"],
  idRe: /^T-\d{4}$/,
  unitRe: /^U(\d{2,})$/,
  examRe: active ? new RegExp(`^${SECTION}(?: ${SECTION})*$`) : /^$/,
  statusRe: /^(pending|covered (\d{4}-\d{2}-\d{2}))$/,
} as const;

const lines = active ? readFileSync(topicsPath, "utf8").split("\n") : [];

function isRealDate(iso: string): boolean {
  const [y, m, d] = iso.split("-").map(Number);
  const t = new Date(Date.UTC(y, m - 1, d));
  return t.getUTCFullYear() === y && t.getUTCMonth() === m - 1 && t.getUTCDate() === d;
}

function todayISO(): string {
  const n = new Date();
  const p = (x: number) => String(x).padStart(2, "0");
  return `${n.getFullYear()}-${p(n.getMonth() + 1)}-${p(n.getDate())}`;
}

/** Units the curriculum actually defines — the authority this map is checked against. */
const curriculumUnits = new Set<string>(
  (active ? readFileSync(curriculumPath, "utf8").split("\n") : [])
    .map((l) => l.match(/^## (U\d{2,}) — /)?.[1])
    .filter((u): u is string => Boolean(u)),
);

interface Row {
  lineNo: number;
  topic: string;
  cells: string[];
}
interface Topic {
  lineNo: number;
  title: string;
  rows: Row[];
  headers: string[][];
}

const topics: Topic[] = [];
let current: Topic | null = null;

lines.forEach((line, i) => {
  if (line.startsWith("## ")) {
    current = { lineNo: i + 1, title: line.slice(3).trim(), rows: [], headers: [] };
    topics.push(current);
    return;
  }
  if (!current) return; // preamble / blockquote
  const t = line.trim();
  if (!t.startsWith("|") || !t.endsWith("|")) return;
  const cells = t.slice(1, -1).split("|").map((c) => c.trim());
  if (cells.every((c) => /^-{2,}$/.test(c))) return; // separator
  if (cells[0] === CONTRACT.header[0]) {
    current.headers.push(cells);
    return;
  }
  current.rows.push({ lineNo: i + 1, topic: current.title, cells });
});

const allRows = topics.flatMap((t) => t.rows);

describe.skipIf(!active)("docs/reference/topics.md", () => {
  it("has topic sections, each with one well-formed header and at least one row", () => {
    expect(topics.length).toBeGreaterThan(0);
    for (const t of topics) {
      expect(
        t.headers.length,
        `topics.md:${t.lineNo} "${t.title}" — expected exactly 1 header row, found ${t.headers.length}`,
      ).toBe(1);
      expect(
        t.headers[0],
        `topics.md:${t.lineNo} "${t.title}" — header must be ${CONTRACT.header.join(" | ")}`,
      ).toEqual([...CONTRACT.header]);
      expect(t.rows.length, `topics.md:${t.lineNo} "${t.title}" has no rows`).toBeGreaterThan(0);
    }
  });

  it("every row has exactly 5 cells, none empty", () => {
    for (const r of allRows) {
      expect(r.cells.length, `topics.md:${r.lineNo} "${r.cells.join(" | ")}"`).toBe(5);
      expect(
        r.cells.every((c) => c.length > 0),
        `topics.md:${r.lineNo} has an empty cell — every aspect states its unit, goal sections, and status`,
      ).toBe(true);
    }
  });

  it("ids match T-NNNN and are unique — the ledgers address aspects by id", () => {
    const ids = allRows.map((r) => r.cells[0]);
    for (const r of allRows) {
      expect(
        CONTRACT.idRe.test(r.cells[0]),
        `topics.md:${r.lineNo} id "${r.cells[0]}" — must be T-NNNN`,
      ).toBe(true);
    }
    const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
    expect(dupes, `duplicate topic ids: ${dupes.join(", ")} — ids are permanent addresses`).toEqual([]);
  });

  it("every unit reference is a single UNN that exists in the curriculum", () => {
    for (const r of allRows) {
      const unit = r.cells[2];
      expect(
        CONTRACT.unitRe.test(unit),
        `topics.md:${r.lineNo} unit "${unit}" — must be exactly one UNN (split multi-unit aspects into separate rows)`,
      ).toBe(true);
      expect(
        curriculumUnits.has(unit),
        `topics.md:${r.lineNo} references ${unit}, which has no heading in curriculum.md`,
      ).toBe(true);
    }
  });

  it(`every exam cell is a subset of the goal's sections (${sections.join(" ")})`, () => {
    expect(
      sections.length,
      "profile config `sections:` is empty — the goal contract must name its sections",
    ).toBeGreaterThan(0);
    for (const r of allRows) {
      expect(
        CONTRACT.examRe.test(r.cells[3]),
        `topics.md:${r.lineNo} exam "${r.cells[3]}" — space-separated letters from ${sections.join(" ")}`,
      ).toBe(true);
    }
  });

  it("every status is `pending` or `covered YYYY-MM-DD`, with a real, non-future date", () => {
    for (const r of allRows) {
      const m = r.cells[4].match(CONTRACT.statusRe);
      expect(m, `topics.md:${r.lineNo} status "${r.cells[4]}"`).not.toBeNull();
      const covered = m?.[2];
      if (covered) {
        expect(isRealDate(covered), `topics.md:${r.lineNo} covered date "${covered}"`).toBe(true);
        expect(
          covered <= todayISO(),
          `topics.md:${r.lineNo} covered date ${covered} is in the future`,
        ).toBe(true);
      }
    }
  });

  it("every curriculum unit is mapped to at least one topic", () => {
    const mapped = new Set(allRows.map((r) => r.cells[2]));
    const orphans = [...curriculumUnits].filter((u) => !mapped.has(u)).sort();
    expect(
      orphans,
      `units in curriculum.md with no row in topics.md: ${orphans.join(", ")} — every unit's contribution must be stateable`,
    ).toEqual([]);
  });
});
