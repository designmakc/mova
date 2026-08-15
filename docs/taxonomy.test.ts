// mova:engine
/**
 * The instance's error taxonomy must not teach a correction that corrects nothing.
 *
 * `docs/mechanics/error_taxonomy.md` is generated at setup from the pack's notes plus the
 * generating agent's knowledge of the language pair. `scripts/packcheck.mjs` lints the PACK
 * side of that pipeline; this test lints the INSTANCE side, using the same exported linter,
 * because the pipeline is real and partly lossy: the first agent-generated pack shipped four
 * rows whose wrong form equalled its own correction (`✗ *Ich komme spät an* → Ich komme spät
 * an`), and two of them reached the generated instance unchanged while a third was silently
 * fixed on the way (2026-08-15). A row that shows no contrast teaches the learner nothing and
 * quietly asserts that correct German is an error.
 *
 * Skips in template mode — the file is instance-owned and does not exist until setup runs.
 */
import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { lintTaxonomyRows } from "../scripts/packcheck.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const REL = "docs/mechanics/error_taxonomy.md";
const path = join(root, REL);

describe.skipIf(!existsSync(path))("error taxonomy example rows (docs/taxonomy.test.ts)", () => {
  it("every ✗ example differs from its own correction", () => {
    const problems = lintTaxonomyRows(readFileSync(path, "utf8"), REL);
    expect(
      problems,
      `broken example rows — a correction must show a contrast:\n  ${problems.join("\n  ")}\n` +
        `Fix the row: the wrong form and the corrected form must differ, and the ✗ never ` +
        `marks a form the row itself calls correct.`,
    ).toEqual([]);
  });
});
