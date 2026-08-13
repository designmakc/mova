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
 * Scope:
 *   - work/visuals/*.html, minus generated files (index.html, deck.html — rebuilt by
 *     scripts, checked at their source). Skips cleanly in template mode (none authored).
 *   - docs/visual/starter.html and gallery.html — the engine's own pages are held to the
 *     same bar, in every mode. Their hub link is relative-any (they live outside the
 *     deployed folder); pack and retired-claims checks don't apply to them — they carry
 *     labeled reference-pack (ro) examples, not claims taught to this learner.
 */
import { describe, it, expect } from "vitest";
import { existsSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { checkFile, GENERATED, readRetiredClaims } from "../scripts/visualcheck.mjs";
import { loadPack } from "../scripts/pack.mjs";

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
      const offences = checkFile(join(visualsDir, name), { pack, retired });
      expect(
        offences,
        `${name} would reach the learner broken:\n  ${offences.join("\n  ")}`,
      ).toEqual([]);
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
