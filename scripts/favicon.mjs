// mova:engine
/**
 * The workspace favicon — one mark, on every page, embedded.
 *
 * Why it exists: a learner keeps the hub bookmarked and study pages open in tabs for
 * months. Untitled-looking tabs with a blank sheet-of-paper icon are how a workspace gets
 * lost among thirty other tabs, and the hub is meant to be the ONE bookmark
 * (docs/mechanics/media.md → Delivering a visual). A mark that reads at 16px is what makes
 * a tab findable at a glance.
 *
 * Why a data: URI and not a file: pages are self-contained and offline forever
 * (docs/visual/SPEC.md §1). A sibling favicon.png would break the moment a page is opened
 * from somewhere else, and a hosted one breaks the no-external-request rule outright. The
 * whole icon is 300-odd bytes of SVG inlined into the <link>.
 *
 * Why it is ENGINE-FIXED and not part of the pinned theme: the theme is re-crafted per
 * instance at setup (SPEC §2), but a favicon is identity, not styling — and the icon
 * renders outside the page, where the token block does not reach, so its colours have to
 * be literal sRGB anyway. Holding it fixed means one canonical string that every surface
 * can be checked against, byte for byte, instead of four copies that drift apart.
 * The two colours are the shipped theme's accent and paper (`--hi`, `--bg` of
 * docs/visual/tokens.css, light theme) flattened from OKLCH to sRGB.
 *
 * Consumers: scripts/hub.mjs and scripts/deck.mjs import FAVICON_LINK; docs/visual/
 * starter.html and gallery.html carry it as a literal line (every authored page inherits
 * it by copying the starter). scripts/visualcheck.mjs fails a page without one, and
 * docs/visuals.content.test.ts asserts the literal copies still match this file.
 *
 * Known limitation: Safari ignores data: URI favicons and shows its generic icon instead.
 * Chrome, Edge, Firefox and Arc all render this from disk. There is no fix that keeps a
 * page single-file, so the tab stays plain there rather than the page reaching out.
 *
 * Zero dependencies; no I/O.
 */

/** The accent square, `--hi` light (oklch(52% 0.12 70)) flattened to sRGB. */
export const FAVICON_ACCENT = "#945a00";
/** The letter, `--bg` light (oklch(97% 0.008 85)) flattened — warm paper, never pure white. */
export const FAVICON_INK = "#f8f5ef";

/**
 * The mark: a lowercase serif `m` on a rounded accent square — mova's initial in the
 * display face the pages set their headings in (`--font-display`). Candidates that lost:
 * a two-bar mark (taught/retained) read as a hamburger menu at 16px, and a stepped ladder
 * read as a generic analytics chip.
 *
 * Single-quoted attributes on purpose — the whole string is percent-encoded into a
 * double-quoted HTML attribute below.
 */
export const FAVICON_SVG =
  "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'>" +
  `<rect width='32' height='32' rx='7' fill='${FAVICON_ACCENT}'/>` +
  "<text x='16' y='16.5' text-anchor='middle' dominant-baseline='central' " +
  "font-family=\"Georgia,'Iowan Old Style',Palatino,serif\" font-size='22' font-weight='700' " +
  `fill='${FAVICON_INK}'>m</text></svg>`;

/**
 * Percent-encoding, minimal on purpose: `#`, `<`, `>` and spaces must not sit raw in an
 * HTML attribute, everything else stays legible so a reader can see it is an SVG.
 * Double quotes are encoded too, so the result is safe inside href="…".
 */
const encode = (svg) =>
  svg
    .replace(/%/g, "%25")
    .replace(/#/g, "%23")
    .replace(/</g, "%3C")
    .replace(/>/g, "%3E")
    .replace(/"/g, "%22")
    .replace(/ /g, "%20");

/** The href value: the icon itself, no request. */
export const FAVICON_HREF = `data:image/svg+xml,${encode(FAVICON_SVG)}`;

/** The line every page carries, in <head>. This exact string is what the gate compares. */
export const FAVICON_LINK = `<link rel="icon" href="${FAVICON_HREF}">`;

/* Print the line, for pasting into a static page: node scripts/favicon.mjs */
if (process.argv[1]?.endsWith("favicon.mjs")) console.log(FAVICON_LINK);
