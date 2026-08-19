// mova:engine
/**
 * Completeness contract for the work/visuals/ index.
 *
 * media.md's governing principle is that a resource shown but not recorded is the same
 * failure as an unlogged session — and the index is where visuals get recorded. The rule
 * ("every visual gets an index row, and a hub rebuild, the moment it passes the gate")
 * existed as prose and was already skipped: in the reference instance (limba, 2026-08-07) a
 * visual sat on disk, in no index, invisible to every future session. An earlier instance of
 * the same gap ended with a draft visual being overwritten unread.
 *
 * What is enforced:
 *   - every **git-tracked** visual in work/visuals/ has a row in work/visuals/README.md;
 *   - every file the index links to actually exists;
 *   - no row claims a delivery it did not make (below).
 *
 * Why *tracked* and not *all* files: an untracked visual is a page whose session has not
 * committed yet, and the index row now goes in earlier than the commit — at build time, so
 * the page is reachable from the hub while the session runs on (media.md → Delivering a
 * visual, rule 3). The invariant this test can still check is "a committed visual is an
 * indexed visual". A session that commits without indexing gets a red CI; a session still
 * working gets left alone. The *dangling* direction is checked over every row, tracked or
 * not: indexing early means a page can be indexed and then deleted, and the row has to go
 * with the file.
 *
 * THE DELIVERY DATE IS A CLAIM, so it is checked. The index's Date column records the day
 * the page reached the learner, and the ledgers and the pacing read it as evidence — which
 * is why a page built but never taught leaves it empty and opens its Teaches cell with
 * `Built —` instead of guessing a date. Both first generated lesson pages ended in exactly
 * that state with no way to say so, and one of them wrote the build date into the delivered
 * column (found in the first generated lesson pages, 2026-08-15). The check is deliberately narrow: it cannot know whether a page reached
 * anyone, so it only refuses the two shapes that are self-contradictory — a `Built —` row
 * carrying a date, and a row carrying neither a date nor the marker.
 *
 * The generated hub (work/visuals/index.html, from scripts/hub.mjs) is not a teaching
 * visual and is excluded — it renders the index rather than appearing in it.
 *
 * TEMPLATE MODE: work/visuals/README.md is generated at setup (from
 * setup/templates/visuals-readme.template.md); the suite skips until it exists.
 */

import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join, basename } from "node:path";
import { FIXTURE_DATE } from "../scripts/visualcheck.mjs";
// @ts-expect-error — plain JS on purpose; the generators are CLIs that share this module.
import { TEACHES_MAX } from "../scripts/page-shell.mjs";
// @ts-expect-error — same.
import { BUILT_RE } from "../scripts/sources.mjs";

const CONTRACT = {
  dir: "work/visuals",
  index: "work/visuals/README.md",
  extensions: [".html", ".svg"],
  /** Generated, not authored, so none of them is a teaching page with a row of its own:
   *  index.html renders this index rather than appearing in it, deck.html is the ledger
   *  drill surface from scripts/deck.mjs, and profile.html is the learner's own record from
   *  scripts/profilepage.mjs. All three are rebuilt at every close-out. */
  exclude: ["index.html", "deck.html", "profile.html"],
  /**
   * THE TEACHES CELL IS A CARD, AND A CARD HAS TO FIT ON A CARD.
   *
   * The hub renders this cell verbatim as the page's description, so its length **is** the
   * card's length. Upstream's inflated 25× in three weeks — 133 characters in July, 3,786
   * in August — until one card in a unit's grid ran several screens tall and the board
   * around it could not be read. Nothing had capped it because nothing had noticed the cell
   * doing two jobs: a learner-facing description and an agent-facing build report.
   *
   * THE NUMBER IS IMPORTED, NOT RESTATED. It is the card's clamp — `.teaches` shows three
   * lines and three lines is about that many characters at the card's width — and a cap
   * looser than the clamp would pass this test while the card still cut the sentence off
   * mid-word. Green gate, broken artifact. page-shell.mjs owns the clamp, so it owns the
   * cap; changing one without the other is not possible from here.
   *
   * NOT DATED, unlike the log-facing rules in docs/logs.entries.test.ts and visualcheck's
   * GATED_FROM. Those exempt earlier work because a log is append-only and a delivered page
   * is an artifact, and neither can be edited to satisfy a rule written after it. An index
   * is neither. It is a mutable registry: every row is rewritten to the cap in the same pass
   * that adopts it, and a date gate would exempt all of them and enforce nothing.
   *
   * The long form is not lost — it moves to the "Build notes" section below the table, which
   * nothing renders and which a later session reads to decide whether to reuse a page,
   * improve it in place, or supersede it.
   */
  teachesMax: TEACHES_MAX,
} as const;

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const visualsDir = join(root, CONTRACT.dir);
const indexPath = join(root, CONTRACT.index);

const active = existsSync(indexPath) && existsSync(visualsDir);
const indexText = active ? readFileSync(indexPath, "utf8") : "";

const isVisual = (f: string) =>
  CONTRACT.extensions.some((e) => f.endsWith(e)) &&
  !CONTRACT.exclude.includes(f as never) &&
  // A test fixture mid-flight is not a learner's page — see FIXTURE_DATE in visualcheck.mjs.
  !f.startsWith(FIXTURE_DATE);

/** Tracked files only — untracked means a session still has it open. */
function trackedVisuals(): string[] {
  try {
    return execFileSync("git", ["ls-files", "--", CONTRACT.dir], { cwd: root, encoding: "utf8" })
      .split("\n")
      .map((p) => p.trim())
      .filter(Boolean)
      .map((p) => basename(p))
      .filter(isVisual);
  } catch {
    // No git (tarball, CI without history): fall back to every file on disk. Stricter,
    // never laxer — a missing index row must not pass just because git is unavailable.
    return readdirSync(visualsDir).filter(isVisual);
  }
}

/** Data rows of the index table, read positionally exactly as scripts/hub.mjs reads it:
 *  five cells, `| Date | Page | Teaches | Units | Kind |`. The header is identified
 *  structurally — it is the row a `|---|` separator follows — so renaming a column cannot
 *  turn it into data. Tables of any other width (the retired-claims table) are skipped. */
function indexRows(): { cells: string[]; lineNo: number }[] {
  const out: { cells: string[]; lineNo: number }[] = [];
  let pending: { cells: string[]; lineNo: number } | null = null;
  const flush = () => {
    if (pending) out.push(pending);
    pending = null;
  };
  indexText.split("\n").forEach((line, i) => {
    const t = line.trim();
    if (!t.startsWith("|") || !t.endsWith("|")) return flush();
    const cells = t.slice(1, -1).split("|").map((c) => c.trim());
    if (cells.every((c) => /^:?-{2,}:?$/.test(c))) {
      pending = null; // the row above was a header
      return;
    }
    if (cells.length !== 5) return flush();
    flush();
    pending = { cells, lineNo: i + 1 };
  });
  flush();
  return out;
}

/** `Built —` opens the Teaches cell of a page prepared but not taught. The dash is part of
 *  the marker on purpose: a delivered page whose description merely starts with the word
 *  "Built" must not be read as undelivered.
 *
 *  IMPORTED, NOT RESTATED. The registry, both generated pages and this test all have to
 *  agree on the shape, and they did not: this file's own copy refused the bold form
 *  (`**Built —**`) that rows are actually written in, so a correctly staged page failed CI
 *  here while `unitState()` read it as staged. One definition, in scripts/sources.mjs. */
const BUILT_MARKER = BUILT_RE;
const DELIVERED_DATE = /^\d{4}-\d{2}-\d{2}$/;
const NO_DATE = /^[—–-]?$/;

/**
 * Files the index links to, from `[name](file.html)` in any row.
 *
 * HTML COMMENTS ARE STRIPPED FIRST — a commented-out example is discussion, not a row. The
 * README's own authoring guidance shows the row's shape (`[name](<date>_<slug>.html)`), and
 * that shape is a link like any other to a regex. It ships verbatim into every instance
 * (setup step 9 copies the template as-is), so without this every freshly generated
 * workspace failed the dangling check on a filename that was never meant to be a file.
 * Same discipline as the tally's backtick rule: writing *about* a token must not declare one.
 */
function linkedFiles(): string[] {
  const prose = indexText.replace(/<!--[\s\S]*?-->/g, "");
  return [...prose.matchAll(/\]\(([^)]+\.(?:html|svg))\)/g)].map((m) => m[1]);
}

describe.skipIf(!active)("work/visuals index", () => {
  it("every committed visual has an index row", () => {
    const linked = new Set(linkedFiles());
    const missing = trackedVisuals().filter((f) => !linked.has(f));
    expect(
      missing,
      `visuals committed with no row in ${CONTRACT.index}:\n  ${missing.join("\n  ")}\n` +
        `Add the row when the page passes visualcheck, and rebuild the hub — an unindexed ` +
        `visual is invisible to every future session and unreachable from the learner's one ` +
        `bookmark (media.md → "Keeping: the preservation map").`,
    ).toEqual([]);
  });

  it("no row claims a delivery it did not make", () => {
    const dishonest = indexRows().flatMap(({ cells, lineNo }) => {
      const [date, page, teaches] = cells;
      const built = BUILT_MARKER.test(teaches);
      const where = `${CONTRACT.index}:${lineNo} ${page}`;
      if (built && !NO_DATE.test(date))
        return [`${where} — marked "Built —" and still carries a Date ("${date}"): a page that was ` +
          `only built has no delivery to date. Clear the cell, or drop the marker if it was taught.`];
      if (!built && !DELIVERED_DATE.test(date))
        return [`${where} — Date is "${date}", which is neither YYYY-MM-DD nor empty. A page ` +
          `already taught is dated; one only built opens its Teaches cell with "Built —".`];
      return [];
    });
    expect(
      dishonest,
      `index rows whose Date and status contradict each other:\n  ${dishonest.join("\n  ")}\n` +
        `The Date column means the day the page reached the learner — the ledgers and the ` +
        `pacing read it as evidence (media.md → "Delivering a visual"; session_format.md → ` +
        `the materials-prepared exit).`,
    ).toEqual([]);
  });

  /** The hub renders this cell as the card body, so its length IS the card's length. */
  it(`no Teaches cell exceeds ${CONTRACT.teachesMax} characters`, () => {
    const over = indexRows()
      .filter((r) => r.cells[2].length > CONTRACT.teachesMax)
      .map((r) => `${CONTRACT.index}:${r.lineNo} ${r.cells[1].slice(0, 48)} — ${r.cells[2].length} chars`);
    expect(
      over,
      `the Teaches cell is the card's description on the hub: one sentence saying what the\n` +
        `page gives the learner, ${CONTRACT.teachesMax} characters. The cap is the card's clamp — a longer\n` +
        `cell is cut off mid-word on the page. Put the long form in "Build notes" below the\n` +
        `table (media.md → Delivering a visual, rule 3).\nover:\n  ${over.join("\n  ")}`,
    ).toEqual([]);
  });

  it("every Teaches cell still says something", () => {
    // A silent zero on the parser would let this file pass forever, so the floor is checked
    // in the same pass as the ceiling.
    const empty = indexRows()
      .filter((r) => r.cells[2].replace(BUILT_MARKER, "").trim().length < 20)
      .map((r) => `${CONTRACT.index}:${r.lineNo}`);
    expect(empty, `a Teaches cell under 20 characters is not a description`).toEqual([]);
  });

  it("every index row points at a file that exists", () => {
    const dangling = linkedFiles().filter((f) => !existsSync(join(visualsDir, f)));
    expect(
      dangling,
      `index rows linking to missing files:\n  ${dangling.join("\n  ")}\n` +
        `Rows go in at build time, so a page abandoned or renamed after that leaves its row ` +
        `behind. Delete the row with the file (session_format.md → close-out step 7).`,
    ).toEqual([]);
  });
});
