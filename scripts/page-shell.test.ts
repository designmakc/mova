// mova:engine
/**
 * Contract for the frame every generated dashboard shares.
 *
 * ONE DEFINITION, ASSERTED. page-shell.mjs exists because the token block was about to live
 * in four places; the checks below are what stop it drifting back. The palette must be the
 * pinned theme itself rather than a copy of it, every dashboard-only token must be declared
 * in all four theme scopes (the same contract visualcheck holds a teaching page to), and the
 * frame must not reach the network — a page renders offline forever or it is not a page.
 *
 * `nav()` is checked from every page, not just one: the list of generated pages lives here
 * so that adding a page puts it in the nav of all the others, and a nav that names a page
 * from some of them and not others is worse than no nav.
 */
import { describe, it, expect } from "vitest";
// @ts-expect-error — plain JS on purpose; the generators are CLIs that share this module.
import { DASH_TOKENS, CHROME, BOARD, NAV_CSS, nav, ANCHOR, anchorOf, linkTo, TEACHES_MAX } from "./page-shell.mjs";
// @ts-expect-error — same.
import { tokens } from "./visual-shell.mjs";
// @ts-expect-error — same.
import { CORE_TOKENS } from "./visualcheck.mjs";

const PAGES = ["index.html", "deck.html", "profile.html"];

describe("DASH_TOKENS is the pinned palette plus the dashboard's own", () => {
  it("contains the teaching-page theme verbatim — one definition, not a second copy", () => {
    expect(DASH_TOKENS()).toContain(tokens());
  });

  it("defines every CORE token in all four theme scopes", () => {
    // Derived from visualcheck's own array, so adding a token to the gate fails here until
    // the frame defines it — the same construction visual-shell.test.ts uses.
    for (const token of CORE_TOKENS) {
      const n = DASH_TOKENS().split(new RegExp(`${token}\\s*:`)).length - 1;
      expect(n, `${token} is defined ${n} time(s); expected 4 (bare, media query, both [data-theme])`).toBe(4);
    }
  });

  it("defines every dashboard-only token in all four theme scopes too", () => {
    for (const token of ["--solid", "--shaky", "--t1", "--t2", "--t3", "--t4", "--t5"]) {
      const n = DASH_TOKENS().split(new RegExp(`${token}\\s*:`)).length - 1;
      expect(n, `${token} is defined ${n} time(s); expected 4`).toBe(4);
    }
  });

  it("carries all three theme selectors, so the viewer's toggle wins in both directions", () => {
    const css = DASH_TOKENS();
    expect(css).toMatch(/prefers-color-scheme/);
    expect(css).toMatch(/\[data-theme="dark"\]/);
    expect(css).toMatch(/\[data-theme="light"\]/);
  });
});

describe("CHROME and BOARD are two exports for a reason", () => {
  it("CHROME holds what any dashboard uses", () => {
    for (const sel of [".panel", ".tile", ".bar", ".card", ".spark", "table.k", ".drawer"]) {
      expect(CHROME, `${sel} missing from CHROME`).toContain(sel);
    }
  });

  it("BOARD holds one page's furniture and CHROME does not carry it", () => {
    // A page with no unit board must not ship the unit board's CSS — that is the whole
    // reason this is a second export rather than more of CHROME.
    for (const sel of [".unit", ".ustrip", ".qm-track", ".deck-n", ".whatnow", ".sortb"]) {
      expect(BOARD, `${sel} missing from BOARD`).toContain(sel);
      expect(CHROME, `${sel} leaked into CHROME`).not.toContain(sel);
    }
  });

  it("the card's description is clamped, and TEACHES_MAX is set to that clamp", () => {
    // The index test imports TEACHES_MAX from here precisely so the two cannot part company:
    // a cap looser than the clamp passes its own test and still cuts the sentence mid-word.
    expect(CHROME).toMatch(/\.teaches[^}]*-webkit-line-clamp:\s*3/);
    expect(TEACHES_MAX).toBe(120);
  });
});

describe("the frame renders offline forever", () => {
  it("reaches no network host from any export", () => {
    const all = DASH_TOKENS() + CHROME + BOARD + NAV_CSS;
    expect(all).not.toMatch(/https?:\/\//);
    expect(all).not.toMatch(/@import\s+url/);
  });
});

describe("nav()", () => {
  it("names every generated page, from each of them", () => {
    for (const here of PAGES) {
      const html = nav(here);
      for (const p of PAGES) expect(html, `${p} missing from the nav on ${here}`).toContain(`href="${p}"`);
    }
  });

  it("carries the hub link visualcheck's check 5 requires, from every page", () => {
    // One element does both jobs. A nav plus a separate back-link is two elements pointing
    // at the same place, and one of them goes stale.
    for (const here of PAGES) {
      expect(nav(here), `no tohub on ${here}`).toMatch(/<a class="[^"]*\btohub\b[^"]*" href="index\.html"/);
    }
  });

  it("marks exactly the current page, so state and affordance cannot swap", () => {
    // The page you are on carries the colour. It rendered muted while the pages you could
    // still take rendered coloured, which is the state and the affordance exactly backwards.
    for (const here of PAGES) {
      const html = nav(here);
      expect((html.match(/\bhere\b/g) ?? []).length, `on ${here}`).toBe(1);
      expect(html).toMatch(new RegExp(`<a class="[^"]*\\bhere\\b[^"]*" href="${here.replace(".", "\\.")}"`));
    }
    expect(NAV_CSS).toMatch(/\.nav a\.here/);
  });
});

describe("anchors are declared, not derived", () => {
  it("anchorOf returns the declared id", () => {
    expect(anchorOf("ladder")).toBe(ANCHOR.ladder);
  });

  it("anchorOf throws on a section nobody declared", () => {
    // A link that quietly stops working is worse than a build that stops loudly — the same
    // reasoning as must(). Deriving an id from a heading means renaming the heading breaks
    // a link on another page in silence.
    expect(() => anchorOf("nothing-declared-here")).toThrow(/no anchor declared/);
  });

  it("linkTo builds a cross-page link that lands on the section, not the page top", () => {
    expect(linkTo("profile.html", "coverage")).toBe(`profile.html#${ANCHOR.coverage}`);
  });

  it("every declared id is unique — two sections cannot share an anchor", () => {
    const ids = Object.values(ANCHOR) as string[];
    expect(new Set(ids).size).toBe(ids.length);
  });
});
