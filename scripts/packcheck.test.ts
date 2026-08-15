// mova:engine
/**
 * CI runner for scripts/packcheck.mjs — every shipped pack passes its own contract, and
 * the checks that catch a HOLLOW pack are themselves proven to fire.
 *
 * Two halves:
 *
 *   1. Every packs/<code>/ carrying a pack.md runs the exported check(). `_template` is
 *      the authoring skeleton, not a pack — excluded. Entirely offline: packcheck
 *      instantiates a declared dictionary adapter but never calls lookup().
 *      If this fails, fix the pack (or its goldens' provenance) — not the test.
 *
 *   2. Negative tests. The first agent-generated pack (German, 2026-08-15) passed
 *      packcheck while shipping a normalizer that folded nothing, an `inflection: false`
 *      flag contradicted by its own goldens, an unjustified empty manifest key, and
 *      error-taxonomy rows whose "wrong" and "corrected" forms were identical. A check
 *      that has never been seen to fail is a check nobody can trust, so each of those
 *      now has a test that BREAKS a copy of packs/ro and asserts packcheck says so.
 *      The copies live in a temp dir; packs/ro itself is never touched.
 */
import { describe, it, expect, afterAll } from "vitest";
import { readdirSync, existsSync, readFileSync, writeFileSync, mkdtempSync, cpSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
// @ts-expect-error — untyped engine module
import { check, lintTaxonomyRows } from "./packcheck.mjs";

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

// ── The hollow-pack checks, proven to fire ────────────────────────────────────

const scratch: string[] = [];
afterAll(() => {
  for (const dir of scratch) rmSync(dir, { recursive: true, force: true });
});

/** A throwaway repo root holding a copy of packs/ro, mutated by `breakIt`. */
function brokenPack(breakIt: (dir: string) => void): string {
  const tmp = mkdtempSync(join(tmpdir(), "packcheck-"));
  scratch.push(tmp);
  const dir = join(tmp, "packs", "ro");
  cpSync(join(packsDir, "ro"), dir, { recursive: true });
  breakIt(dir);
  return tmp;
}

const rewrite = (path: string, fn: (s: string) => string) =>
  writeFileSync(path, fn(readFileSync(path, "utf8")));

const matched = (errors: string[], re: RegExp) => errors.filter((e) => re.test(e));

describe("packcheck catches a hollow pack", () => {
  it("rejects a look-alike map whose entries all map a letter to itself", async () => {
    const repo = brokenPack((dir) =>
      rewrite(join(dir, "normalize.mjs"), (s) =>
        s.replace(/export const LOOKALIKES = \{[\s\S]*?\};/, 'export const LOOKALIKES = { "ă": "ă", "ș": "ș" };'),
      ),
    );
    const { ok, errors } = await check("ro", repo);
    expect(ok).toBe(false);
    expect(matched(errors, /identity entr/)).toHaveLength(1);
    expect(matched(errors, /ALL 2 entries are identity/)).toHaveLength(1);
  });

  it("rejects a fold the prose advertises and normalize() does not perform", async () => {
    const repo = brokenPack((dir) =>
      rewrite(join(dir, "pack.md"), (s) =>
        s.replace("- **Normalization** —", "- **Normalization** — look-alike folding (ae→ă, sh→ș).\n- **Normalization** —"),
      ),
    );
    const { errors } = await check("ro", repo);
    expect(matched(errors, /prose claims the fold "ae → ă"/)).toHaveLength(1);
    expect(matched(errors, /prose claims the fold "sh → ș"/)).toHaveLength(1);
  });

  it("rejects a normalize fixture set that would pass against `s => s`", async () => {
    const repo = brokenPack((dir) =>
      writeFileSync(
        join(dir, "golden", "normalize.json"),
        JSON.stringify([
          { input: "înțeleg", expected: "înțeleg", note: "already canonical" },
          { input: "adresa", expected: "adresa", note: "missing diacritic — never folded" },
        ]),
      ),
    );
    const { ok, errors } = await check("ro", repo);
    expect(ok).toBe(false);
    expect(matched(errors, /every fixture is an identity case/)).toHaveLength(1);
    expect(matched(errors, /no NFD-input fixture/)).toHaveLength(1);
  });

  it("names the missing NFD fixture even when folding is otherwise proven", async () => {
    const repo = brokenPack((dir) =>
      writeFileSync(
        join(dir, "golden", "normalize.json"),
        JSON.stringify([{ input: "fǎrǎ", expected: "fără", note: "caron → breve" }]),
      ),
    );
    const { errors } = await check("ro", repo);
    expect(matched(errors, /every fixture is an identity case/)).toHaveLength(0);
    expect(matched(errors, /no NFD-input fixture/)).toHaveLength(1);
  });

  it("cross-examines `inflection: false` against the pack's own data", async () => {
    const repo = brokenPack((dir) =>
      rewrite(join(dir, "pack.md"), (s) => s.replace("inflection: true", "inflection: false")),
    );
    const { ok, errors, warnings } = await check("ro", repo);
    expect(ok).toBe(false);
    // endings is dead code under the flag …
    expect(matched(errors, /inflection: false but endings lists/)).toHaveLength(1);
    // … and the goldens' own second forms say the language inflects after all.
    expect(matched(errors, /inflection: false, but \d+ tagged golden rows/)).toHaveLength(1);
    // The asymmetry is announced, not silent: this flag deletes a required fixture.
    expect(warnings.some((w: string) => /waives golden\/pairs\.json/.test(w))).toBe(true);
  });

  it("rejects an empty manifest key the prose never names", async () => {
    const repo = brokenPack((dir) =>
      rewrite(join(dir, "pack.md"), (s) =>
        s.replace(/required_fact:.*$/m, "required_fact:").replace(/\beu-form\b/g, "the 1sg"),
      ),
    );
    const { ok, errors } = await check("ro", repo);
    expect(ok).toBe(false);
    expect(matched(errors, /"required_fact:" is empty and the prose never mentions it/)).toHaveLength(1);
  });

  it("accepts an empty manifest key the prose names and justifies", async () => {
    const repo = brokenPack((dir) => {
      rewrite(join(dir, "pack.md"), (s) =>
        s
          .replace(/required_fact:.*$/m, "required_fact:")
          .replace(/\beu-form\b/g, "the 1sg")
          .replace("```mova-config", "No required_fact: this pack asks no per-row fact yet.\n\n```mova-config"),
      );
      rewrite(join(dir, "pos-tables.mjs"), (s) => s.replace(/requiredFact: \{[\s\S]*?\},/, ""));
    });
    const { errors } = await check("ro", repo);
    expect(matched(errors, /required_fact/)).toEqual([]);
  });

  it("rejects a TABLES.requiredFact the manifest never armed", async () => {
    const repo = brokenPack((dir) =>
      rewrite(join(dir, "pack.md"), (s) =>
        s
          .replace(/required_fact:.*$/m, "required_fact:   # none yet — the required fact is undecided")
          .replace(/\beu-form\b/g, "the 1sg"),
      ),
    );
    const { errors } = await check("ro", repo);
    expect(matched(errors, /TABLES\.requiredFact but the manifest's required_fact: is empty/)).toHaveLength(1);
  });

  it("rejects a golden set that leaves a deck facet unexercised", async () => {
    const repo = brokenPack((dir) => {
      const words = JSON.parse(readFileSync(join(dir, "golden", "words.json"), "utf8"));
      writeFileSync(
        join(dir, "golden", "words.json"),
        JSON.stringify(words.filter((w: { expected: string | null }) => w.expected !== "interog")),
      );
    });
    const { ok, errors } = await check("ro", repo);
    expect(ok).toBe(false);
    expect(matched(errors, /no fixture classifies to "interog"/)).toHaveLength(1);
  });

  it("rejects broken error-taxonomy rows in the pack's notes.md", async () => {
    const repo = brokenPack((dir) =>
      rewrite(join(dir, "notes.md"), (s) =>
        s.replace(
          "| ART-DEF |",
          "| VRB-SEPA | separable prefix | ✗ *am citit carte* → am citit carte |\n| ART-DEF |",
        ),
      ),
    );
    const { ok, errors } = await check("ro", repo);
    expect(ok).toBe(false);
    expect(matched(errors, /the wrong form and the correction are the same string/)).toHaveLength(1);
  });
});

describe("lintTaxonomyRows", () => {
  const row = (example: string) => `| CODE | zone | ${example} |`;

  it("passes a row that shows a real contrast", () => {
    expect(lintTaxonomyRows(row("✗ *am citit carte* → cartea"))).toEqual([]);
    expect(lintTaxonomyRows(row("✗ *fara* → fără (graded error, not a typo)"))).toEqual([]);
    expect(lintTaxonomyRows(row("✗ *scaulă* for **scaun**, ✗ *o bură* for **un birou**"))).toEqual([]);
  });

  it("catches an identical wrong-and-corrected pair", () => {
    const [msg] = lintTaxonomyRows(row("✗ *Ich komme spät an* → Ich komme spät an (an-kommen)"));
    expect(msg).toMatch(/same string/);
  });

  it("catches the same form on both sides of the contrast", () => {
    const [msg] = lintTaxonomyRows(row('✗ *aktuell* (current) confused with *aktuell* (not "actual")'));
    expect(msg).toMatch(/appears on both sides/);
  });

  it("catches a ✗ sitting on the form the row calls correct", () => {
    const [msg] = lintTaxonomyRows(row("✗ *mit dem Mann* (correct dative) vs *mit der Mann*"));
    expect(msg).toMatch(/calls correct/);
  });

  // The fourth rule: a false-friend row must correct into the target language, not into
  // the held-language partner. Gated on the zone, so look-alike sides stay legal elsewhere.
  const ffRow = (example: string) => `| LEX-FF | false friend | ${example} |`;

  it("catches → pointing at the false friend instead of the repair", () => {
    const [msg] = lintTaxonomyRows(ffRow("✗ *aktuell* (current) → actual (assumed)"));
    expect(msg).toMatch(/look-alike pair this row is ABOUT/);
    expect(msg).toMatch(/target-language form/);
  });

  it("passes a false-friend row that corrects into the target language", () => {
    expect(lintTaxonomyRows(ffRow('✗ *aktuell* meant as "actual" → tatsächlich'))).toEqual([]);
    expect(lintTaxonomyRows(ffRow('✗ *bekommen* meant as "become" → werden'))).toEqual([]);
    expect(lintTaxonomyRows(ffRow('✗ *prost* meant as "simple"; also *a locui* / *a lucra*'))).toEqual([]);
  });

  it("leaves look-alike corrections alone outside a false-friend row", () => {
    // The whole reason the rule is gated: repairing orthography SHOULD look near-identical.
    expect(lintTaxonomyRows(row("✗ *fara* → fără"))).toEqual([]);
    expect(lintTaxonomyRows(row("✗ *ingener* → inginer"))).toEqual([]);
    expect(lintTaxonomyRows("| LEX-END | final vowel | ✗ *peret* → perete |")).toEqual([]);
  });

  it("does not fire on multi-word forms, which are not lexemes", () => {
    expect(lintTaxonomyRows(ffRow("✗ *ich bin sensibel* → ich bin vernünftig"))).toEqual([]);
  });

  it("reports the file and line so the fix is findable", () => {
    const text = `# notes\n\n| Code | Zone | Example |\n| --- | --- | --- |\n${row("✗ *x* → x")}\n`;
    expect(lintTaxonomyRows(text, "docs/mechanics/error_taxonomy.md")[0]).toMatch(
      /^docs\/mechanics\/error_taxonomy\.md:5:/,
    );
  });

  it("ignores prose outside a table row", () => {
    expect(lintTaxonomyRows("- ✗ *ceva* → ceva is discussed here, not tabled")).toEqual([]);
  });
});
