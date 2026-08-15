// mova:engine
/**
 * CONTRACT — visuals content: does a teaching page work, and does it still say things
 * the workspace has retracted?
 *
 * Thin runner. Every check lives in scripts/visualcheck.mjs (one implementation, two
 * consumers: agents run it pre-publish, CI runs it here — the limba split, upstream/map.md
 * row visuals.content.test.ts). See that file for what is checked and the incidents that
 * priced each check.
 *
 * That single implementation now also carries the answer-leak gate: checkFile shells out to
 * scripts/leakcheck.mjs in visual mode and fails on HIGH, so CI and the pre-publish command
 * cannot disagree about whether a page gives its own answers away — which is exactly how
 * two first-ever generated lesson pages shipped at 3 of 3 and 5 of 5 leaked (found in the
 * first generated lesson pages, 2026-08-15). Nothing to add here; do not re-implement it.
 *
 * Scope:
 *   - work/visuals/*.html, minus generated files (index.html, deck.html — rebuilt by
 *     scripts, checked at their source). Skips cleanly in template mode (none authored).
 *   - docs/visual/starter.html and gallery.html — the engine's own pages are held to the
 *     same bar, in every mode. Their hub link is relative-any (they live outside the
 *     deployed folder); pack and retired-claims checks don't apply to them — they carry
 *     labeled reference-pack (ro) examples, not claims taught to this learner, and the
 *     script-range check gives them the permissive default set for the same reason.
 */
import { describe, it, expect } from "vitest";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  checkFile,
  GENERATED,
  instanceLanguages,
  readRetiredClaims,
} from "../scripts/visualcheck.mjs";
import { loadPack } from "../scripts/pack.mjs";
import { loadProfile } from "../scripts/profile.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const visualsDir = join(root, "work/visuals");
const engineDir = join(root, "docs/visual");

/** Active pack, or null in template mode (no profile ⇒ pack checks skip). */
let pack: Awaited<ReturnType<typeof loadPack>> | null = null;
try {
  pack = await loadPack();
} catch {
  pack = null;
}

const retired = readRetiredClaims(join(visualsDir, "README.md"));

/** Languages this instance may print, for the script-range check — null in template mode.
 *  A profile too broken to parse must not take the whole file down with it: the pack load
 *  above already degrades to null on the same failure, and this check then falls back to
 *  its permissive default set. */
let languages: string[] | null = null;
try {
  languages = instanceLanguages(loadProfile(), pack);
} catch {
  languages = null;
}

const instancePages = existsSync(visualsDir)
  ? readdirSync(visualsDir)
      .filter((f) => f.endsWith(".html") && !GENERATED.has(f))
      .sort()
  : [];

describe("authored visuals pass visualcheck", () => {
  if (instancePages.length === 0) {
    it.skip("no authored visuals yet (template mode)", () => {});
  }
  for (const name of instancePages) {
    it(`${name}: clean`, () => {
      const offences = checkFile(join(visualsDir, name), { pack, retired, languages });
      expect(
        offences,
        `${name} would reach the learner broken:\n  ${offences.join("\n  ")}`,
      ).toEqual([]);
    });
  }
});

/**
 * The two generated pages (hub, deck) cannot be run in template mode — they need a
 * profile — and visualcheck deliberately skips generated output, so the favicon on them is
 * checked at its source: both generators must interpolate the one canonical link, never a
 * second copy of the string.
 */
describe("generated pages carry the favicon", () => {
  for (const gen of ["hub.mjs", "deck.mjs"]) {
    it(`${gen}: emits FAVICON_LINK in its <head>`, () => {
      const src = readFileSync(join(root, "scripts", gen), "utf8");
      expect(src, `${gen} must import the mark from scripts/favicon.mjs`).toContain(
        'from "./favicon.mjs"',
      );
      const head = src.slice(src.indexOf("<head>"), src.indexOf("</head>"));
      expect(head, `${gen} builds a page the learner keeps in a tab — it needs the mark`)
        .toContain("${FAVICON_LINK}");
      expect(src, `${gen} must not hand-copy the icon — import it`).not.toContain(
        'rel="icon"',
      );
    });
  }
});

describe("engine pages (starter, gallery) pass visualcheck", () => {
  for (const name of ["starter.html", "gallery.html"]) {
    it(`${name}: clean`, () => {
      const offences = checkFile(join(engineDir, name), { pack: null, retired: [] });
      expect(
        offences,
        `docs/visual/${name} is the template every page starts from — it must be clean:\n  ` +
          offences.join("\n  "),
      ).toEqual([]);
    });
  }
});
