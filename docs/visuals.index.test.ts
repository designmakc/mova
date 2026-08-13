// mova:engine
/**
 * Completeness contract for the work/visuals/ index.
 *
 * media.md's governing principle is that a resource shown but not recorded is the same
 * failure as an unlogged session — and the index is where visuals get recorded. The rule
 * ("every visual gets an index row in the same session that creates it") existed as prose
 * and was already skipped: in the reference instance (limba, 2026-08-07) a visual sat on
 * disk, in no index, invisible to every future session. An earlier instance of the same gap
 * ended with a draft visual being overwritten unread.
 *
 * What is enforced:
 *   - every **git-tracked** visual in work/visuals/ has a row in work/visuals/README.md;
 *   - every file the index links to actually exists.
 *
 * Why *tracked* and not *all* files: an untracked visual is, by definition, work in flight
 * — a session that has not reached its close-out yet. The close-out ritual is what indexes
 * and commits it (session_format.md), so the invariant is "a committed visual is an
 * indexed visual", and this test is precisely that. A session that commits without indexing
 * gets a red CI; a session still working gets left alone.
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
  CONTRACT.extensions.some((e) => f.endsWith(e)) && !CONTRACT.exclude.includes(f as never);

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
        `Add a row in the session that created the file — an unindexed visual is invisible ` +
        `to every future session (media.md → "Keeping: the preservation map").`,
    ).toEqual([]);
  });

  it("every index row points at a file that exists", () => {
    const dangling = linkedFiles().filter((f) => !existsSync(join(visualsDir, f)));
    expect(
      dangling,
      `index rows linking to missing files:\n  ${dangling.join("\n  ")}`,
    ).toEqual([]);
  });
});
