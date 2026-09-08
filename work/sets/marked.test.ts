// mova:engine
/**
 * A marked sheet says what stands behind its marks — docs/mechanics/verification.md
 * § Marking time.
 *
 * WHAT A SHEET IS. The per-item record of every scored set, saved to work/sets/ at close-out
 * (session_format.md, close-out step 6) and read back cold by the learner. A ❌ or 🟡 on it is
 * a claim about the language: the agent's reading against the learner's. verification.md
 * allows three states for a claim and no fourth — attested through the pack's dictionary
 * adapter, tutor-confirmed, or visibly marked `?` — so a sheet that scores something wrong has
 * to say which: `?` after the glyph on the marks nothing attested, and a `Source:` line at the
 * foot saying what attested the rest and when, or that the marks are the agent's word.
 *
 * WHY A TEST AND NOT ONLY A RULE. The rule existed for ledgers and pages, and its "when checks
 * run" list did not name marking. The first study session ever to run to completion (a Turkish
 * instance on the null adapter, 2026-08-24) scored a correct reading of a time clause as wrong,
 * built the repair lesson on its own wrong rule, and reversed itself on the learner's word —
 * with no `?` anywhere and no source until the learner objected. The learner left.
 * docs/mechanics/why/verification.md has the story.
 *
 * WHAT IS CHECKABLE. Not whether a mark is right — whether the sheet says what stands behind
 * it. This is the marked-sheet twin of scripts/visualcheck.mjs check 10: a surface that asserts
 * carries a marker or a trail. Deliberately crude, like that check: it cannot tell a
 * grammar-meaning mark from a spelling mark, so it asks for the sheet-level trail whenever
 * anything is marked wrong, and for the per-mark `?` it trusts the rule. The trail key is
 * structural — `Source:` opening a line, bold or italic allowed — never a wording, because
 * sheets are written in the learner's meta-language and a pinned English phrase would fail
 * every instance not taught in English. (visualcheck's null-adapter branch still pins one;
 * that is open there.) The dispute sentence the rule asks for is prose and is not checked.
 *
 * NULL ADAPTER. When the active pack declares no dictionary, no mark can reach state 1, so a
 * `?` alone does not tell the learner why. The `Source:` line is required.
 *
 * TEMPLATE MODE: work/sets/ ships empty, so this passes vacuously. Without a profile there is
 * no active pack, and the ordinary branch runs.
 *
 * If this fails, fix the sheet — not the test.
 */

import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { loadProfile } from "../../scripts/profile.mjs";
import { loadPack } from "../../scripts/pack.mjs";
import { canVerify } from "../../scripts/dictionary.mjs";

const setsDir = dirname(fileURLToPath(import.meta.url));

/** Sheets are named `YYYY-MM-DD_<slug>-marked.md` (session_format.md, close-out step 6);
 *  `_marked.md` is accepted too — the first instance to write one used it, and
 *  scripts/sources.mjs counts both. */
const sheets = readdirSync(setsDir)
  .filter((f) => /marked\.md$/.test(f))
  .sort();

const profile = loadProfile();
const pack = profile ? await loadPack() : null;
/** No dictionary ⇒ state 1 is unreachable for every mark on every sheet. */
const unattested = pack ? !canVerify(pack.dictionary) : false;

/** The glyphs session_format.md's marked-sheet table defines. ✅ claims nothing against the
 *  learner and is not counted. */
const WRONG = /[❌🟡]/gu;
/** `?` right after the glyph — `❌?` / `🟡?` — is verification.md's marker on a sheet. */
const MARKER = /[❌🟡]\s?\?/u;
/** `Source:` opening a line — optionally **bold** or _italic_; `Sources:` accepted. */
const TRAIL = /^\s*(?:\*\*|__|\*|_)?Sources?(?:\*\*|__|\*|_)?\s*:/imu;

describe("work/sets — a marked sheet says what stands behind its marks", () => {
  const scored = sheets
    .map((file) => {
      const text = readFileSync(join(setsDir, file), "utf8");
      return { file, text, wrong: (text.match(WRONG) || []).length };
    })
    .filter((s) => s.wrong > 0);

  // A file with no `it` fails vitest outright, and work/sets/ ships empty — so the scan itself
  // is the one test that always exists, and it says what it saw.
  it(`scanned ${sheets.length} sheet(s); ${scored.length} mark something wrong or half-right`, () => {
    console.info(
      `  marked sheets: ${sheets.length} found, ${scored.length} with marks against the learner` +
        (pack ? ` (pack "${pack.code}", ${unattested ? "no dictionary — trail required" : "dictionary adapter"})` : " (template mode)"),
    );
    expect(scored.length).toBeLessThanOrEqual(sheets.length);
  });

  for (const { file, text, wrong } of scored) {
    it(`${file}: ${wrong} mark(s) against the learner carry a trail`, () => {
      const hasMarker = MARKER.test(text);
      const hasTrail = TRAIL.test(text);

      if (unattested) {
        expect(
          hasTrail,
          `${file}: pack "${pack?.code}" declares no dictionary, so no mark on this sheet can reach ` +
            `verification state 1 — every ❌ and 🟡 is the agent's word until a tutor confirms it ` +
            `(docs/mechanics/verification.md → "the null adapter — honest, never silent"). The sheet ` +
            `must say so. Add a line at its foot such as\n` +
            `    Source: the agent's word — unverified; a tutor can confirm or overturn any ? mark\n` +
            `and put ? after each mark nothing attested (❌? / 🟡?). Dropping the markers because ` +
            `nothing checks them is the one thing a null-adapter instance may never do.`,
        ).toBe(true);
        return;
      }

      expect(
        hasMarker || hasTrail,
        `${file}: marks ${wrong} answer(s) wrong or half-right and carries no verification trail — ` +
          `no ? after a glyph (❌? / 🟡?) and no Source: line. docs/mechanics/verification.md ` +
          `§ Marking time allows three states and no fourth: attested through the pack's ` +
          `dictionary adapter (name the source and date on a Source: line), tutor-confirmed ` +
          `(same), or ? so the learner can see it is the agent's reading. For a sheet written ` +
          `before this check existed, add at its foot:\n` +
          `    Source: the agent's word — unverified`,
      ).toBe(true);
    });
  }
});
