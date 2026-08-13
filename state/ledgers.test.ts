// mova:engine
/**
 * Integrity contract for the state/ SRS ledgers (vocab.md, grammar.md).
 *
 * The ledgers are the workspace's memory: `scripts/queue.mjs` derives the daily review
 * queue from them, so a malformed row doesn't just look bad — it silently drops an item
 * out of rotation. The queue script is deliberately lenient (skips bad rows); this test
 * is the strict gate that fails CI instead.
 *
 * What is enforced (schema canonical in docs/mechanics/srs.md):
 *   - exact 8-column header and exactly 8 cells per data row (a stray `|` inside a cell
 *     shows up as a wrong cell count);
 *   - `topic` is a `T-NNNN` that exists in docs/reference/topics.md. Added in the reference
 *     instance (limba, 2026-08-09): without it the ledgers could say how solid an item was
 *     but not what system it belonged to, so nothing could distinguish "the noun system was
 *     taught" from "the noun system is known". An unknown id is worse than none — it
 *     silently drops the item out of every aggregate.
 *   - every vocab row resolves to a part of speech (the pack-driven classifier from
 *     scripts/pos.mjs — the same one the deck renders with). Added limba 2026-08-10: an
 *     untyped row is silently filed under "other words" on the deck and can never be
 *     filtered as what it actually is.
 *   - every row that the pack says must carry a fact carries it — the pack manifest's
 *     `required_fact` (limba: a verb's eu-form; conjugation class is to a verb what gender
 *     is to a noun — not derivable from the citation form, needed for every production,
 *     free to store. limba SES-007 scored 4/4 on the two verbs taught as full paradigms
 *     and 0/4 on three stored as bare infinitives).
 *   - id format `V-NNNN` / `G-NNNN`, matching the ledger's prefix, unique;
 *   - tier ∈ {0,1,2,3,4,5};
 *   - `added` / `last` are real ISO dates with `added ≤ last ≤ today`;
 *   - no duplicate headwords after NFC normalization — macOS paste often produces NFD,
 *     so a word can exist twice while looking identical; normalization makes the dupe
 *     detectable.
 *   - no look-alike characters: the pack's `normalize()` folds letters from neighbouring
 *     alphabets/keyboards that render almost identically to the target language's own
 *     (limba ERR-002: Czech ǎ and Turkish ş/ţ for Romanian ă, ș, ț). Look-alikes are
 *     NFC-stable, so the normalization check above sails straight past them — and two
 *     rows that differ only by one are invisible duplicates that both silently sit in
 *     the queue. A cell the pack's normalize() would change contains one.
 *
 * If this fails, fix the ledger — not the test.
 *
 * TEMPLATE MODE: the ledgers ship header-only, and the structural checks run on whatever
 * rows exist (zero included). The pack-dependent checks — POS, required fact, look-alikes
 * — skip until a profile names an active pack.
 */

import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";
import { loadProfile } from "../scripts/profile.mjs";
import { loadPack } from "../scripts/pack.mjs";

const stateDir = dirname(fileURLToPath(import.meta.url));
const root = join(stateDir, "..");

/** The only project-specific configuration. Keep tiers in sync with docs/mechanics/srs.md
 *  AND scripts/queue.mjs (INTERVALS) — third copy of the ladder; all three move together. */
const CONTRACT = {
  ledgers: [
    { file: "vocab.md", idPrefix: "V" },
    { file: "grammar.md", idPrefix: "G" },
  ],
  header: ["id", "target", "translation", "tier", "added", "last", "topic", "notes"],
  /** Aspect ids live in docs/reference/topics.md; that file is the authority. */
  topics: "../docs/reference/topics.md",
  topicRe: /^T-\d{4}$/,
  /** 0 = seeded, not yet taught, never due. */
  validTiers: ["0", "1", "2", "3", "4", "5"],
} as const;

// Pack-dependent machinery, absent in template mode. The classifier comes from
// scripts/pos.mjs — createClassifier(pack.tables) exposes the same API limba's pos.mjs
// did, with the language tables injected instead of hard-coded.
const profile = loadProfile();
const pack = profile ? await loadPack() : null;
const posPath = join(root, "scripts/pos.mjs");
const classifier =
  pack && existsSync(posPath)
    ? (await import(/* @vite-ignore */ pathToFileURL(posPath).href)).createClassifier(pack.tables)
    : null;
// INTERFACE (reconcile with packs/<code>/pos-tables.mjs): the mechanical form of the
// manifest's `required_fact:` lives in TABLES.requiredFact =
//   { rowPattern: RegExp on the target cell (which rows owe the fact),
//     factPattern: RegExp on the notes cell (what counts as carrying it),
//     hint: string (how to write it, shown in the failure message) }.
// limba's constants were rowPattern /^a\s+\S/ and factPattern /\beu\s+\S/.
const requiredFact =
  pack?.requiredFact && (pack.tables as any)?.requiredFact
    ? (pack.tables as any).requiredFact
    : null;

/** Every aspect id the topic map defines — the ledgers may only point at these. */
const topicsPath = join(stateDir, CONTRACT.topics);
const topicIds = new Set<string>(
  (existsSync(topicsPath) ? readFileSync(topicsPath, "utf8").split("\n") : [])
    .map((l) => l.trim().match(/^\|\s*(T-\d{4})\s*\|/)?.[1])
    .filter((id): id is string => Boolean(id)),
);

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

/** The dedupe key: NFC-normalized, lowercased headword without the parenthetical. */
function headword(target: string): string {
  return target.normalize("NFC").toLowerCase().split(" (")[0].trim();
}

interface TableLine {
  lineNo: number;
  cells: string[];
}

/** Every `|`-line in the file, split into trimmed cells; unclosed rows reported separately. */
function tableLines(md: string): { rows: TableLine[]; unclosed: string[] } {
  const rows: TableLine[] = [];
  const unclosed: string[] = [];
  md.split("\n").forEach((line, i) => {
    const t = line.trim();
    if (!t.startsWith("|")) return;
    if (!t.endsWith("|")) {
      unclosed.push(`line ${i + 1}: "${t}"`);
      return;
    }
    rows.push({ lineNo: i + 1, cells: t.slice(1, -1).split("|").map((c) => c.trim()) });
  });
  return { rows, unclosed };
}

for (const ledger of CONTRACT.ledgers) {
  const path = join(stateDir, ledger.file);
  const { rows: all, unclosed } = tableLines(readFileSync(path, "utf8"));
  const [header, separator, ...data] = all;
  const idRe = new RegExp(`^${ledger.idPrefix}-\\d{4}$`);

  describe(`state/${ledger.file}`, () => {
    it("has the exact 8-column header, a separator, and no unclosed rows", () => {
      expect(unclosed, `table rows missing their closing |:\n  ${unclosed.join("\n  ")}`).toEqual([]);
      expect(header?.cells).toEqual([...CONTRACT.header]);
      expect(separator?.cells.every((c) => c.startsWith("---"))).toBe(true);
      // The template ships the ledgers header-only; zero data rows is a valid state.
    });

    it("every data row has exactly 8 cells (no stray | inside cells)", () => {
      for (const row of data) {
        expect(
          row.cells.length,
          `${ledger.file}:${row.lineNo} has ${row.cells.length} cells: | ${row.cells.join(" | ")} |`,
        ).toBe(CONTRACT.header.length);
      }
    });

    it(`ids match ${ledger.idPrefix}-NNNN and are unique`, () => {
      const ids = data.map((r) => r.cells[0]);
      for (const id of ids) expect(id, `bad id "${id}"`).toMatch(idRe);
      expect(new Set(ids).size, "duplicate ids").toBe(ids.length);
    });

    it("tiers are valid", () => {
      for (const row of data) {
        expect(
          CONTRACT.validTiers as readonly string[],
          `${row.cells[0]}: tier "${row.cells[3]}"`,
        ).toContain(row.cells[3]);
      }
    });

    if (ledger.idPrefix === "V") {
      it.skipIf(!requiredFact)("every row the pack marks must carry its required fact", () => {
        const missing = data
          .filter((r) => requiredFact.rowPattern.test(r.cells[1]))
          .filter((r) => !requiredFact.factPattern.test(r.cells[7]))
          .map((r) => `${ledger.file}:${r.lineNo} ${r.cells[0]} ${r.cells[1]}`);
        expect(
          missing,
          `rows missing the pack's required fact (${pack!.requiredFact}) in notes:\n  ${missing.join("\n  ")}\n` +
            `${requiredFact.hint ?? "See docs/mechanics/srs.md and the pack manifest."}`,
        ).toEqual([]);
      });

      it.skipIf(!classifier)("every row says what kind of word it is", () => {
        // Added with the deck's type filter (limba, 2026-08-10). Most rows already answer
        // this — a gender says noun, an infinitive-marked form says verb — but a bare
        // function word answered nothing and was indistinguishable from a one-word phrase.
        // An untyped row does not fail loudly; it lands in "other words" and is never
        // drilled as what it is. The tag goes in the target cell's parenthetical.
        const untyped = data
          .filter((r) => classifier.classify(r.cells[1], r.cells[0]) === null)
          .map((r) => `${ledger.file}:${r.lineNo} ${r.cells[0]} ${r.cells[1]}`);
        expect(
          untyped,
          `rows with no part of speech:\n  ${untyped.join("\n  ")}\n` +
            `Tag the target cell with one of the pack's POS tags or gender labels — ` +
            `see docs/mechanics/srs.md and packs/${pack!.code}/pos-tables.mjs.`,
        ).toEqual([]);
      });
    }

    it("every topic is a T-NNNN that exists in topics.md", () => {
      // Vacuous on an empty ledger. The moment a row exists, the instance must also have
      // its topic map — a row pointing into a missing topics.md is exactly the silent
      // aggregate-dropping this check exists to catch.
      const bad = data
        .filter((r) => !CONTRACT.topicRe.test(r.cells[6]) || !topicIds.has(r.cells[6]))
        .map((r) => `${ledger.file}:${r.lineNo} ${r.cells[0]} — topic "${r.cells[6]}"`);
      expect(
        bad,
        `rows whose topic is not a known aspect id:\n  ${bad.join("\n  ")}\n` +
          `Pick the aspect the item is scored under from docs/reference/topics.md. ` +
          `Where the item is *repaired* can be a different unit — that link is topics.md's job, not this one.`,
      ).toEqual([]);
    });

    it("added ≤ last ≤ today, all real ISO dates", () => {
      const today = todayISO();
      for (const row of data) {
        const [, , , , added, last] = row.cells;
        expect(isRealDate(added), `${row.cells[0]}: added "${added}"`).toBe(true);
        expect(isRealDate(last), `${row.cells[0]}: last "${last}"`).toBe(true);
        expect(added <= last, `${row.cells[0]}: added ${added} > last ${last}`).toBe(true);
        expect(last <= today, `${row.cells[0]}: last ${last} is in the future`).toBe(true);
      }
    });

    it.skipIf(!pack)("no look-alike characters the pack's normalize() would fold", () => {
      const offences: string[] = [];
      for (const row of data) {
        for (const cell of row.cells) {
          const folded = pack!.normalize(cell);
          if (folded !== cell) {
            offences.push(
              `${ledger.file}:${row.lineNo} ${row.cells[0]} — "${cell}" normalizes to "${folded}"`,
            );
          }
        }
      }
      expect(
        offences,
        `look-alike letters from another alphabet or keyboard layout:\n  ${offences.join("\n  ")}\n` +
          `These render almost identically but are different characters — they create invisible duplicate rows.`,
      ).toEqual([]);
    });

    it("no duplicate headwords (NFC-normalized)", () => {
      const seen = new Map<string, string>();
      for (const row of data) {
        const key = headword(row.cells[1]);
        expect(
          seen.has(key),
          `${row.cells[0]} duplicates ${seen.get(key)}: headword "${key}" — update the existing row's notes instead`,
        ).toBe(false);
        seen.set(key, row.cells[0]);
      }
    });
  });
}
