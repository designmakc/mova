// mova:engine
/**
 * Inline markdown → HTML, shared by the generators that render repo prose into a page.
 *
 * Extracted from scripts/hub.mjs (limba, 2026-08-12) so it can be tested. It was inline and
 * unexported before, and the visuals content checks exclude generated files on the stated
 * grounds that they are "rebuilt by scripts and checked at their source" — while no test
 * existed at the source. A bold/italic bug therefore shipped to the learner's one bookmark
 * and was caught by their screenshot (limba, 2026-08-09). The exclusion is load-bearing, so
 * the thing it points at now exists: scripts/inline-md.test.ts.
 *
 * Read-only, zero dependencies, no I/O.
 */

/** HTML-escape. Runs before every markdown rule, so no rule can emit raw input. */
export const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * Inline markdown → HTML. Links collapse to their text; this is display copy.
 *
 * The bold pattern deliberately admits *italic* spans inside it. `[^*]+` did not, so
 * `**bold *italic***` failed to match as bold, the italic rule then fired on the wreckage,
 * and one visual's card rendered with literal asterisks and italics running to the end of
 * the card (seen on the hub, limba 2026-08-09). Bold still runs before italics, so the
 * surviving inner `*…*` is picked up on the next line.
 *
 * Do not "simplify" this to a lazy `\*\*(.+?)\*\*`: on `**a *b***` it closes on the first two
 * of the three trailing asterisks, leaving a stray one that the italic pass then pairs across
 * the `</strong>`, producing crossed tags. Greedy `\*\*(.+)\*\*` is worse — it swallows
 * `**a** and **b**` into a single span. Both were tried on 2026-08-09.
 */
export const md = (s) =>
  esc(s)
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/\*\*([^*]*(?:\*[^*]+\*[^*]*)*)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*\n]+)\*/g, "<em>$1</em>")
    // Low-9 quotes: „…" as the reference repo writes them, or „…” with the curly close (both
    // occur in its state/). The closing straight quote must be matched in its ESCAPED form —
    // esc() has already run, so a literal `"` cannot be present. Written as a bare `"` until
    // 2026-08-12, which made this rule dead code: every quoted target-language span on the
    // hub rendered with literal quote marks instead of emphasis. Found by inline-md.test.ts
    // on its first run.
    .replace(/„([^”]*?)(?:&quot;|”)/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");
