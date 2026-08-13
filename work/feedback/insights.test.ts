// mova:engine
/**
 * Structural contract over the retro intake, added by limba's 2026-08-12 housekeeping pass.
 *
 * WHY. The intake was the one append-only surface in the reference repo with no test, and
 * on 2026-08-12 it lost three ids. `scripts/feedback.sh` numbers from the HIGHEST id
 * present — deliberately, so that a count cannot reuse an id after a removal — and two blocks
 * had written their own guessed `## FB-NNN` heading INSIDE the body. That inflated the ceiling,
 * so the next real append was assigned `FB-011`: **FB-008, FB-009 and FB-010 do not exist and
 * never will.** Minutes later the same blocks read back under different numbers, because the
 * body headings were demoted and the following headers renumbered by a direct file write after
 * they had already been committed. Nothing was lost, but an id stopped being a stable address
 * while four other places were citing `FB-004` by number.
 *
 * The script now rejects a body containing `^## FB-`. That guard only sees blocks that arrive
 * THROUGH the script; an editor write bypasses it entirely, and an editor write is also the
 * unlocked write the file header warns silently drops whichever block landed second. This test
 * is the half that catches what the script cannot.
 *
 * Ids are allowed to be non-contiguous — burned ids are a fact of the record, and the header
 * documents them. What is not allowed is a duplicate, a body heading, or an id that goes
 * backwards, because each of those makes a citation ambiguous.
 */

import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));

/** The open intake plus every closed cycle beside it — the same rules apply to both. */
const files = readdirSync(here).filter((f) => f.endsWith(".md") && f !== "PROMPT.md");

for (const file of files) {
  const text = readFileSync(join(here, file), "utf8");
  const lines = text.split("\n");

  // Only headings the script itself writes: id, source label, trailing timestamp.
  const assigned = /^## (FB-\d{3}) — (.+) — (\d{4}-\d{2}-\d{2}) \d{2}:\d{2}$/;

  const blocks: { id: number; line: number; source: string }[] = [];
  const malformed: string[] = [];
  lines.forEach((line, i) => {
    if (!line.startsWith("## FB-")) return;
    const m = assigned.exec(line);
    if (m) blocks.push({ id: Number(m[1].slice(3)), line: i + 1, source: m[2] });
    else malformed.push(`${file}:${i + 1} "${line}"`);
  });

  describe(`work/feedback/${file}`, () => {
    it("every '## FB-' heading is one the append script wrote", () => {
      // A body heading lands here. It is the exact shape that burned FB-008..010: a session
      // whose insight IS the finding reaches for `## FB-NNN — <claim>` naturally.
      expect(
        malformed,
        `not '## FB-NNN — <source> — YYYY-MM-DD HH:MM'. A block's own sub-headings use '###':\n  ${malformed.join("\n  ")}`,
      ).toEqual([]);
    });

    it("ids are unique", () => {
      const seen = new Map<number, number>();
      const dupes: string[] = [];
      for (const b of blocks) {
        if (seen.has(b.id)) dupes.push(`FB-${String(b.id).padStart(3, "0")} at lines ${seen.get(b.id)} and ${b.line}`);
        else seen.set(b.id, b.line);
      }
      expect(dupes, `duplicate ids — every citation to one of these is ambiguous:\n  ${dupes.join("\n  ")}`).toEqual([]);
    });

    it("ids increase down the file (oldest first — gaps are allowed, going backwards is not)", () => {
      const back: string[] = [];
      for (let i = 1; i < blocks.length; i++) {
        if (blocks[i].id <= blocks[i - 1].id) {
          back.push(`line ${blocks[i].line}: FB-${blocks[i].id} follows FB-${blocks[i - 1].id}`);
        }
      }
      expect(back, `ids go backwards, so the file was renumbered or hand-edited:\n  ${back.join("\n  ")}`).toEqual([]);
    });

    it("every block names its source", () => {
      const anon = blocks.filter((b) => b.source.trim().length < 3).map((b) => `line ${b.line}`);
      expect(
        anon,
        `blocks with no usable source label — several land in the same minute and the label is all triage has to tell them apart:\n  ${anon.join("\n  ")}`,
      ).toEqual([]);
    });
  });
}

describe("work/feedback/", () => {
  it("has an open intake to append to", () => {
    expect(files).toContain("insights.md");
  });
});
