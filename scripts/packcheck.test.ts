// mova:engine
/**
 * CI runner for scripts/packcheck.mjs — every shipped pack passes its own contract.
 *
 * Scans packs/<code>/ for directories carrying a pack.md and runs the exported check()
 * on each. `_template` is the authoring skeleton, not a pack — excluded. Entirely
 * offline: packcheck instantiates a declared dictionary adapter but never calls lookup().
 *
 * If this fails, fix the pack (or its goldens' provenance) — not the test.
 */
import { describe, it, expect } from "vitest";
import { readdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
// @ts-expect-error — untyped engine module
import { check } from "./packcheck.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const packsDir = join(root, "packs");

const codes = readdirSync(packsDir, { withFileTypes: true })
  .filter((d) => d.isDirectory() && d.name !== "_template")
  .filter((d) => existsSync(join(packsDir, d.name, "pack.md")))
  .map((d) => d.name);

describe("packs", () => {
  it("ships at least one pack", () => {
    expect(codes.length).toBeGreaterThan(0);
  });

  for (const code of codes) {
    it(`packs/${code} passes packcheck`, async () => {
      const result = await check(code, root);
      expect(result.errors, `packcheck errors for packs/${code}`).toEqual([]);
      expect(result.ok).toBe(true);
    });
  }
});
