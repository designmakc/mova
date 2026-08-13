// mova:engine
/**
 * The first test over generated-page code, added by limba's 2026-08-12 housekeeping pass.
 *
 * Why it exists: the visuals content checks deliberately skip generated files because
 * they are "rebuilt by scripts and checked at their source" — and there was no test at the
 * source. `md()` matched bold as `\*\*([^*]+)\*\*`, a class that excludes the asterisk, so
 * bold could never contain an italic. One hub card rendered with literal asterisks and an
 * `<em>` that stayed open to the end of the card. It shipped, and the learner caught it in a
 * screenshot. Two learner-caught rendering defects in three days, both in output no test
 * opened (limba, 2026-08-09).
 *
 * Every case below is a shape that appears in the reference repo's own prose. The Romanian
 * strings are examples from that reference implementation, not rules — the quote and
 * diacritic cases exercise Unicode handling that any pack relies on.
 */

import { describe, it, expect } from "vitest";
import { esc, md } from "./inline-md.mjs";

describe("esc", () => {
  it("escapes the four HTML-significant characters", () => {
    expect(esc(`<a href="x">&</a>`)).toBe("&lt;a href=&quot;x&quot;&gt;&amp;&lt;/a&gt;");
  });

  it("runs on non-strings without throwing", () => {
    expect(esc(3)).toBe("3");
  });
});

describe("md", () => {
  it("renders bold and italic separately", () => {
    expect(md("**bold** and *italic*")).toBe("<strong>bold</strong> and <em>italic</em>");
  });

  it("admits an italic span inside a bold one — the 2026-08-09 hub defect", () => {
    expect(md("**bold *inner* tail**")).toBe("<strong>bold <em>inner</em> tail</strong>");
  });

  it("keeps two bold spans on one line apart, rather than swallowing the gap", () => {
    expect(md("**a** and **b**")).toBe("<strong>a</strong> and <strong>b</strong>");
  });

  it("closes `**a *b***` without leaving a stray asterisk or crossing tags", () => {
    const out = md("**a *b***");
    expect(out).toBe("<strong>a <em>b</em></strong>");
    expect(out).not.toContain("*");
  });

  it("collapses a link to its text", () => {
    expect(md("see [srs.md](../mechanics/srs.md) first")).toBe("see srs.md first");
  });

  it("renders code spans", () => {
    expect(md("`queue.mjs`")).toBe("<code>queue.mjs</code>");
  });

  // Both closing forms occur in the reference repo's state/: „mă numesc" with a straight
  // quote, „de” with a curly one. The straight one only reaches this rule as &quot;,
  // because esc() runs first — the reason the rule was dead code until 2026-08-12.
  it("italicises a low-9-quoted span, straight closing quote", () => {
    expect(md('„mă numesc"')).toBe("<em>mă numesc</em>");
  });

  it("italicises a low-9-quoted span, curly closing quote", () => {
    expect(md("„de”")).toBe("<em>de</em>");
  });

  it("keeps two quoted spans on one line apart", () => {
    expect(md('„nu" and „de”')).toBe("<em>nu</em> and <em>de</em>");
  });

  it("escapes before any markdown rule fires, so input cannot inject markup", () => {
    expect(md("**<script>**")).toBe("<strong>&lt;script&gt;</strong>");
  });

  it("leaves diacritics untouched", () => {
    expect(md("**ferestre · cuțit · în**")).toBe("<strong>ferestre · cuțit · în</strong>");
  });

  it("emits no unbalanced tag for any shape used in repo prose", () => {
    const samples = [
      "**a**", "*a*", "**a *b* c**", "a ** b", "***a***", "**a** *b* `c`",
      "[x](y) **z**", "no markup at all",
    ];
    for (const s of samples) {
      const out = md(s);
      expect(out.match(/<strong>/g)?.length ?? 0, s).toBe(out.match(/<\/strong>/g)?.length ?? 0);
      expect(out.match(/<em>/g)?.length ?? 0, s).toBe(out.match(/<\/em>/g)?.length ?? 0);
    }
  });
});
