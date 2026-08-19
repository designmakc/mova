// mova:engine
/**
 * Contract for the readers every generated page shares.
 *
 * TWO KINDS OF CHECK, and the split matters. The pure functions — `must`, `when`,
 * `unitState`, `BUILT_RE` — are checked against fixtures and hold in the template repo, where
 * there is no learner. The readers that touch instance files are checked against the live
 * tree and SKIP in template mode: `docs/curriculum.md` and the ledgers' rows do not exist
 * until setup runs, and a test that demanded them would fail this repo forever.
 *
 * What this file exists to stop is the failure sources.mjs was extracted to prevent: a second
 * copy of a parser, drifting. Anything asserted here is asserted once for every page.
 */
import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
// @ts-expect-error — plain JS on purpose; the generators are CLIs that share this module.
import {
  must, when, skipped, unitState, BUILT_RE, stripBuilt, weekStart, gradedScore,
  intervals, pace, rows, section,
} from "./sources.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const isInstance = existsSync(join(root, "docs/reference/profile.md"));

describe("must() and when() — the two rules about an empty parse", () => {
  it("must() throws on zero rows, naming the section", () => {
    expect(() => must("the pacing table", [])).toThrow(/the pacing table/);
  });

  it("must() passes a non-empty list straight through", () => {
    const list = [["1", "a"]];
    expect(must("x", list)).toBe(list);
  });

  it("when() renders nothing on zero rows and records the skip", () => {
    const before = skipped().length;
    expect(when("the error tally", [], () => "<p>never</p>")).toBe("");
    expect(skipped().slice(before)).toEqual(["the error tally"]);
  });

  it("when() renders and records nothing when the record has rows", () => {
    const before = skipped().length;
    expect(when("sessions", [1, 2], (d: number[]) => `<p>${d.length}</p>`)).toBe("<p>2</p>");
    expect(skipped().slice(before)).toEqual([]);
  });

  it("when() treats a bare falsy value as no record, not as an error", () => {
    expect(when("a single object", null, () => "x")).toBe("");
    expect(when("a single object", { a: 1 }, () => "x")).toBe("x");
  });
});

describe("unitState() — one value, five states", () => {
  const asp = (...statuses: string[]) => statuses.map((status, i) => ({ id: `T-${i}`, status }));
  const page = (date: string) => ({ date: date || null });
  const unit = (aspects: unknown[], pages: unknown[]) => unitState({}, aspects, pages);

  it("every aspect covered is `taught`", () => {
    expect(unit(asp("covered 2026-08-01", "covered 2026-08-02"), []).state).toBe("taught");
  });

  it("some but not all covered is `part-taught`", () => {
    expect(unit(asp("covered 2026-08-01", "pending"), []).state).toBe("part-taught");
  });

  it("nothing covered but a page with no delivery date is `staged`", () => {
    // The bug this whole function exists for: a finished page on disk while the unit's own
    // row read "not opened", because three surfaces each derived the answer from half the
    // data and none could see the registry's flag.
    expect(unit(asp("pending"), [page("")]).state).toBe("staged");
  });

  it("nothing covered and every page delivered is `not-opened`", () => {
    expect(unit(asp("pending"), [page("2026-08-01")]).state).toBe("not-opened");
  });

  it("no aspects at all is `unmapped`, never a division by zero", () => {
    const u = unit([], []);
    expect(u.state).toBe("unmapped");
    expect(u.total).toBe(0);
  });

  it("reports staged pages on a unit whose state is not `staged`", () => {
    // `staged` comes back ALONGSIDE the state because the two are orthogonal: a part-taught
    // unit can also have material built for its second half, and a surface must be able to
    // ask that of any unit whatever its state.
    const u = unit(asp("covered 2026-08-01", "pending"), [page("2026-08-01"), page("")]);
    expect(u.state).toBe("part-taught");
    expect(u.staged).toHaveLength(1);
  });
});

describe("BUILT_RE — one definition, three readers", () => {
  it("matches the marker in both the bold and plain forms the registry uses", () => {
    expect(BUILT_RE.test("Built — the present tense finished")).toBe(true);
    expect(BUILT_RE.test("**Built —** **the present tense finished**")).toBe(true);
  });

  it("does not match a delivered row that merely mentions building", () => {
    // The dash is part of the marker on purpose: a page whose description opens with the
    // word "Built" must not be read as undelivered.
    expect(BUILT_RE.test("Building sentences from the six pronouns")).toBe(false);
  });

  it("stripBuilt removes the marker and leaves the description's own emphasis alone", () => {
    // The marker's closing `**` goes; the `**` that opens the description does not. It is
    // the description's markup, and md() renders it — eating it would silently unbold every
    // staged row's first phrase.
    expect(stripBuilt("**Built —** **the present tense**")).toBe("**the present tense**");
    expect(stripBuilt("Built — the present tense")).toBe("the present tense");
  });
});

describe("weekStart() — a calendar week, not a rolling one", () => {
  it("Monday maps to itself", () => {
    expect(weekStart("2026-08-17")).toBe("2026-08-17");
  });

  it("mid-week maps back to that Monday", () => {
    expect(weekStart("2026-08-19")).toBe("2026-08-17");
  });

  it("Sunday belongs to the week that opened it, not the one about to start", () => {
    // Monday to Sunday, not Monday to Friday: a working-week window silently drops every
    // weekend session, and upstream ran 6 of its first 23 at a weekend.
    expect(weekStart("2026-08-23")).toBe("2026-08-17");
    expect(weekStart("2026-08-24")).toBe("2026-08-24");
  });
});

describe("rows() and section() — the table readers", () => {
  it("rows() drops the header structurally, not by matching column names", () => {
    // The list-of-known-headers version emitted an unlisted header as a data row.
    const md = "| Where | What |\n| --- | --- |\n| a | b |\n| c | d |\n";
    expect(rows(md, 2)).toEqual([["a", "b"], ["c", "d"]]);
  });

  it("rows() ignores tables of another width", () => {
    expect(rows("| a | b | c |\n", 2)).toEqual([]);
  });

  it("section() stops at the next heading of the same level or above", () => {
    const md = "## One\nkeep\n### Deeper\nalso keep\n## Two\ndrop\n";
    expect(section(md, /^One/).trim()).toBe("keep\n### Deeper\nalso keep");
  });
});

describe("gradedScore() — percentages, and only for a lesson", () => {
  it("refuses anything that is not a lesson", () => {
    expect(gradedScore("- **Score.** grammar 9/10 = 90%\n\n", "drill", "2099-01-01").grammar).toBeNull();
    expect(gradedScore("- **Score.** grammar 9/10 = 90%\n\n", "review", "2099-01-01").grammar).toBeNull();
  });

  it("scopes to the Score bullet, not to the whole entry's prose", () => {
    const entry = "- **Score.** grammar 6/10 = 60%\n\n- **Covered.** the 8/10 rule for plurals\n\n";
    expect(gradedScore(entry, "lesson", "2099-01-01").grammar).toBe(60);
  });
});

describe.skipIf(!isInstance)("the readers, against the live tree", () => {
  it("intervals() defines a day count for every tier", () => {
    const int = intervals();
    expect(Object.keys(int).length).toBeGreaterThan(0);
    for (const [tier, days] of Object.entries(int)) {
      expect(Number.isInteger(Number(tier)), `tier ${tier}`).toBe(true);
      expect(Number.isFinite(days as number), `tier ${tier} days`).toBe(true);
    }
  });

  it("pace() reads all five cost constants as numbers", () => {
    const p = pace();
    for (const k of ["recognise", "bare", "full", "perBlock", "box"]) {
      expect(Number.isFinite(p[k]), `${k} came back ${p[k]}`).toBe(true);
    }
  });
});
