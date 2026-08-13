// mova:engine
/**
 * Unit contract for docs/curriculum.md.
 *
 * The curriculum is the ordered map the lesson playbook walks: unit numbers route sessions,
 * and each unit's single `status:` line is how "where am I?" gets answered months in.
 * A renumbered unit or a second status line makes that answer ambiguous — so it's CI.
 *
 * What is enforced:
 *   - every `## U…` heading matches `## UNN — <title> (<level>)` exactly, where <level>
 *     is one of the active pack's level scale (packs/<code>/pack.md `level_scale:`);
 *   - unit numbers are unique and strictly ascending down the file;
 *   - the number of units matches the profile's `units:` count, when declared;
 *   - each unit section carries exactly ONE status line, `status: pending` or
 *     `status: covered YYYY-MM-DD` (real date, not future).
 *
 * If this fails, fix curriculum.md — not the test. Units are renamed, never renumbered;
 * retired units keep their number and get a `covered` status with a note.
 *
 * TEMPLATE MODE: the curriculum and the profile are generated at setup; the suite skips
 * until both exist. The level bands and unit count are parameters, not constants — limba
 * hard-coded `(A1|A2|B1)` and this file reads the same fact from the pack manifest.
 */

import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { loadProfile } from "../scripts/profile.mjs";
import { loadPack } from "../scripts/pack.mjs";

const docsDir = dirname(fileURLToPath(import.meta.url));
const curriculumPath = join(docsDir, "curriculum.md");

// Template mode: no profile → no pack, no curriculum. Skip cleanly.
const profile = loadProfile();
const active = profile !== null && existsSync(curriculumPath);
const pack = active ? await loadPack() : null;

/** The only project-specific configuration — level bands come from the pack, the unit
 *  count from the profile. Everything else below is generic. */
const CONTRACT = {
  file: "curriculum.md",
  headingRe: active
    ? new RegExp(`^## U(\\d{2,}) — .+ \\((${pack!.levelScale.join("|")})\\)$`)
    : /^$/,
  statusRe: /^status: (pending|covered (\d{4}-\d{2}-\d{2}))$/,
  /** Declared unit count, or null when the profile leaves pacing open. */
  unitCount: active ? Number(profile!.get("units", "")) || null : null,
} as const;

const lines = active ? readFileSync(curriculumPath, "utf8").split("\n") : [];

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

interface Unit {
  lineNo: number;
  num: number;
  statusLines: { lineNo: number; text: string }[];
}

const units: Unit[] = [];
const malformed: string[] = [];
let current: Unit | null = null;

lines.forEach((line, i) => {
  if (line.startsWith("## ")) {
    current = null; // any ## heading closes the previous unit section
    if (!/^## U/.test(line)) return; // phase headers etc. are fine
    const m = line.match(CONTRACT.headingRe);
    if (!m) {
      malformed.push(`curriculum.md:${i + 1} "${line}"`);
      return;
    }
    current = { lineNo: i + 1, num: Number(m[1]), statusLines: [] };
    units.push(current);
    return;
  }
  if (current && /^status:/.test(line)) {
    current.statusLines.push({ lineNo: i + 1, text: line });
  }
});

describe.skipIf(!active)("docs/curriculum.md units", () => {
  it("has units, and every ## U heading matches `## UNN — <title> (<pack level>)`", () => {
    expect(malformed, `malformed unit headings:\n  ${malformed.join("\n  ")}`).toEqual([]);
    expect(units.length).toBeGreaterThan(0);
  });

  it("unit numbers are unique and strictly ascending", () => {
    for (let i = 1; i < units.length; i++) {
      expect(
        units[i].num > units[i - 1].num,
        `curriculum.md:${units[i].lineNo} U${units[i].num} follows U${units[i - 1].num} — units are never renumbered or reordered`,
      ).toBe(true);
    }
  });

  it.skipIf(CONTRACT.unitCount === null)(
    "defines exactly the number of units the profile declares",
    () => {
      // The profile's `units:` is what pacing math (reviews, deadline projection) runs on.
      // A curriculum that grew or shrank without the profile noticing breaks that quietly.
      expect(
        units.length,
        `curriculum.md defines ${units.length} units; the profile declares units: ${CONTRACT.unitCount} — change both together`,
      ).toBe(CONTRACT.unitCount);
    },
  );

  it.each(units.map((u) => [u.num, u] as const))(
    "U%i has exactly one well-formed status line",
    (_num, unit) => {
      expect(
        unit.statusLines.length,
        `curriculum.md:${unit.lineNo}: expected exactly 1 status line, found ${unit.statusLines.length}`,
      ).toBe(1);
      const s = unit.statusLines[0];
      const m = s.text.match(CONTRACT.statusRe);
      expect(m, `curriculum.md:${s.lineNo} "${s.text}" — must be \`status: pending\` or \`status: covered YYYY-MM-DD\``).not.toBeNull();
      const covered = m?.[2];
      if (covered) {
        expect(isRealDate(covered), `curriculum.md:${s.lineNo} covered date "${covered}"`).toBe(true);
        expect(covered <= todayISO(), `curriculum.md:${s.lineNo} covered date ${covered} is in the future`).toBe(true);
      }
    },
  );
});
