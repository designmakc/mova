// mova:engine
/**
 * CONTRACT — packdiff tells the truth about a pack swap.
 *
 * The report is the only thing standing between a learner and a silent pack replacement
 * that turns their own correctly-entered rows red (`state/ledgers.test.ts` fails on any row
 * the active pack cannot classify). A detector that under-reports is worse than no detector,
 * because `playbooks/update.md` § 6b offers the swap on its verdict.
 *
 * The pure halves are tested against REAL pack tables rather than mocks — a fabricated
 * TABLES object would prove the function runs, not that it catches what the shipped packs
 * actually do to each other.
 */
import { describe, it, expect } from "vitest";
import { readFileSync, writeFileSync, mkdtempSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { diffRows, diffManifests, orphanedLevels, readLedgerRows } from "./packdiff.mjs";
import { TABLES as ES } from "../packs/es/pos-tables.mjs";
import { TABLES as DE } from "../packs/de/pos-tables.mjs";
import { TABLES as RO } from "../packs/ro/pos-tables.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const row = (id: string, target: string, notes = "") => ({ id, target, notes, file: "state/vocab.md", lineNo: 0 });

describe("diffRows", () => {
  it("reports nothing when the tables are the same", () => {
    const r = diffRows(ES, ES, [row("V-0001", "casa (f, casas)"), row("V-0002", "hablar (v)")]);
    expect(r.unclassifiable).toEqual([]);
    expect(r.reclassified).toEqual([]);
    expect(r.owesFact).toEqual([]);
  });

  /**
   * The breaking case, and the reason this script exists: German declares three genders and
   * Spanish two, so a neuter row that is perfectly valid today classifies to null tomorrow —
   * and null is exactly what state/ledgers.test.ts fails on.
   */
  it("catches a row the candidate can no longer classify", () => {
    const r = diffRows(DE, ES, [row("V-0001", "Buch (n, Bücher)")]);
    expect(r.unclassifiable).toHaveLength(1);
    expect(r.unclassifiable[0].target).toBe("Buch (n, Bücher)");
    expect(r.unclassifiable[0].was).toBe("noun");
  });

  /**
   * Romanian marks its infinitive with a free-standing `a`, and no other pack does. Moving
   * off it does not lose the row — it files under a different facet, because a two-word
   * target with no tag is a phrase. Advisory, not breaking, and the report must say which.
   */
  it("separates a row that is merely filed differently from one that is lost", () => {
    const r = diffRows(RO, ES, [row("V-0001", "a vorbi", "eu vorbesc")]);
    expect(r.unclassifiable).toEqual([]);
    expect(r.reclassified).toHaveLength(1);
    expect(r.reclassified[0]).toMatchObject({ was: "verb", now: "phrase" });
  });

  /**
   * Moving TO a pack that declares a required fact: rows captured without it now owe it.
   * Romanian is the only shipped pack with one, which is why it is the candidate here.
   */
  it("catches rows that would owe the candidate's required fact", () => {
    const rows = [row("V-0001", "a vorbi", "eu vorbesc"), row("V-0002", "a merge", "")];
    const r = diffRows(ES, RO, rows);
    expect(r.owesFact.map((x) => x.id)).toEqual(["V-0002"]);
  });

  it("reports no owed fact when the candidate declares none", () => {
    expect(diffRows(RO, ES, [row("V-0001", "a merge", "")]).owesFact).toEqual([]);
  });
});

describe("diffManifests", () => {
  it("names only the keys a learner can feel, in both directions", () => {
    const from = { manifest: { genders: "m f", inflection: "true", dictionary: "" } };
    const to = { manifest: { genders: "m f n", inflection: "true", dictionary: "wiktionary" } };
    const keys = diffManifests(from, to).map((c) => c.key);
    expect(keys).toContain("genders");
    expect(keys).toContain("dictionary");
    expect(keys).not.toContain("inflection");
  });

  it("treats a missing key and an empty key as the same thing", () => {
    expect(diffManifests({ manifest: {} }, { manifest: { required_fact: "" } })).toEqual([]);
  });
});

describe("orphanedLevels", () => {
  it("finds curriculum rungs the candidate scale does not define", () => {
    expect(orphanedLevels("## U1 — A1 basics\n## U9 — C1 register", ["A1", "A2", "B1"]))
      .toEqual(["C1"]);
  });

  it("is quiet when every rung is covered", () => {
    expect(orphanedLevels("## U1 — A1 basics", ["A1", "A2"])).toEqual([]);
  });
});

describe("readLedgerRows", () => {
  /**
   * A parser that let the header or the `|---|` separator through would report them as
   * unclassifiable rows on every swap — a false alarm on a workspace with nothing in it.
   *
   * CHECKED AGAINST A FIXTURE, NOT THE LIVE TREE. It used to assert that this repo's own
   * ledgers came back empty, which is true of the template and false of every instance the
   * moment it learns its first word: `npm test` is required green in an instance
   * (setup/smoke.md § 1), and this went red as soon as a learner had vocabulary. The claim
   * being made is about the PARSER, so the fixture is the honest way to make it.
   */
  const fixture = mkdtempSync(join(tmpdir(), "packdiff-"));
  mkdirSync(join(fixture, "state"), { recursive: true });
  writeFileSync(
    join(fixture, "state/vocab.md"),
    "| id | target | translation | tier | added | last | topic | notes |\n" +
      "| --- | --- | --- | --- | --- | --- | --- | --- |\n",
  );

  it("returns nothing for header-only ledgers, and never the header itself", () => {
    expect(readLedgerRows(fixture)).toEqual([]);
  });

  it("reads a data row, so the emptiness above is the header being dropped", () => {
    // Without this the check above passes just as well on a parser that reads nothing at all.
    writeFileSync(
      join(fixture, "state/grammar.md"),
      "| id | target | translation | tier | added | last | topic | notes |\n" +
        "| --- | --- | --- | --- | --- | --- | --- | --- |\n" +
        "| G-0001 | a fi | to be | 2 | 2026-08-01 | 2026-08-02 | T-0002 | copula |\n",
    );
    expect(readLedgerRows(fixture)).toMatchObject([{ id: "G-0001", target: "a fi" }]);
  });

  it("the shipped ledgers still carry the schema header the parser drops", () => {
    expect(readFileSync(join(root, "state/vocab.md"), "utf8")).toContain("| id | target |");
  });
});
