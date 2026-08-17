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

const CONTRACT = {
  dir: "work/visuals",
  index: "work/visuals/README.md",
  extensions: [".html", ".svg"],
  /** Generated, not authored — index.html renders the index instead of being listed in
   *  it; deck.html is the ledger drill surface, rebuilt on demand by scripts/deck.mjs. */
  exclude: ["index.html", "deck.html"],
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
 *  "Built" must not be read as undelivered. */
const BUILT_MARKER = /^built\s*[—–-]/i;
const DELIVERED_DATE = /^\d{4}-\d{2}-\d{2}$/;
const NO_DATE = /^[—–-]?$/;

/** Files the index links to, from `[name](file.html)` in any row. */
function linkedFiles(): string[] {
  return [...indexText.matchAll(/\]\(([^)]+\.(?:html|svg))\)/g)].map((m) => m[1]);
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
