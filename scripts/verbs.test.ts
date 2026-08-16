// mova:engine
/**
 * The focus rule, checked against the three places that state it.
 *
 * The defect this arms against: the hub listed every playbook it could find, so a
 * vocabulary-only instance's one bookmark advertised `lesson` — a verb that workspace
 * refuses — and `setup`, which runs once before the hub exists. Nothing failed; the page
 * simply told the learner to say words their own setup had turned off.
 *
 * Playbook frontmatter is the authority (`setup/scenarios/focus_modes.md`: "if it ever
 * disagrees with a frontmatter line, the frontmatter wins and this table gets fixed"), and
 * two prose tables derive from it — the scenario file's own, and the learner's command
 * guide. A derived table nobody checks is a table that drifts, so both are parsed here and
 * required to agree with the frontmatter rather than with each other.
 */

import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { liveVerbs, isLive, TUITION_VERB } from "./verbs.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (rel: string) => readFileSync(join(root, rel), "utf8");

const MODES = ["full", "drill", "vocab", "writing"];

/** Verb names live in a mode, from the frontmatter, ignoring the tuition gate. */
const fromFrontmatter = (focus: string) =>
  liveVerbs({ root, focus, tuition: true })
    .map((v) => v.name)
    .filter((n) => n !== TUITION_VERB)
    .sort();

/**
 * The `| mode | verb · verb · … |` rows of a prose table, keyed by mode. The parenthetical
 * that names the tuition verb is stripped: it states a condition, not a member.
 */
function tableModes(markdown: string): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const line of markdown.split("\n")) {
    const m = /^\|\s*`(full|drill|vocab|writing)`\s*\|([^|]*)\|/.exec(line);
    if (!m) continue;
    out[m[1]] = m[2]
      .replace(/\([^)]*\)/g, "")
      .split("·")
      .map((s) => s.replace(/[`*]/g, "").trim())
      .filter(Boolean)
      .sort();
  }
  return out;
}

describe("isLive", () => {
  it("treats `all` as every mode and `none` as no mode", () => {
    expect(isLive("all", "vocab")).toBe(true);
    expect(isLive("none", "full")).toBe(false);
  });

  it("matches a named mode and only a named one", () => {
    expect(isLive("full drill vocab", "drill")).toBe(true);
    expect(isLive("full drill vocab", "writing")).toBe(false);
  });
});

describe("liveVerbs", () => {
  it("keeps lesson out of every narrow mode — the defect this file exists for", () => {
    expect(fromFrontmatter("full")).toContain("lesson");
    for (const mode of ["drill", "vocab", "writing"]) {
      expect(fromFrontmatter(mode)).not.toContain("lesson");
    }
  });

  it("never offers setup or a maintainer verb, in any mode", () => {
    for (const mode of MODES) {
      const names = fromFrontmatter(mode);
      expect(names).not.toContain("setup");
      expect(names).not.toContain("sync-upstream");
    }
  });

  it("gates tutor-prep on the goal contract, not on the focus mode", () => {
    for (const mode of MODES) {
      expect(liveVerbs({ root, focus: mode, tuition: false }).map((v) => v.name)).not.toContain(
        TUITION_VERB,
      );
      expect(liveVerbs({ root, focus: mode, tuition: true }).map((v) => v.name)).toContain(
        TUITION_VERB,
      );
    }
  });

  it("keeps the record-keeping verbs live in every mode", () => {
    for (const mode of MODES) {
      for (const verb of ["review", "vocab", "retro", "update"]) {
        expect(fromFrontmatter(mode)).toContain(verb);
      }
    }
  });

  it("defaults to `full` for a profile that predates the focus key", () => {
    expect(liveVerbs({ root }).map((v) => v.name)).toEqual(fromFrontmatter("full"));
  });

  it("carries a one-clause description for every verb it lists", () => {
    for (const v of liveVerbs({ root, tuition: true })) {
      expect(v.desc.length, `${v.name} has no summary`).toBeGreaterThan(0);
      expect(v.desc).not.toContain("\n");
    }
  });
});

describe("the derived tables still match the frontmatter", () => {
  for (const [label, path] of [
    ["setup/scenarios/focus_modes.md", "setup/scenarios/focus_modes.md"],
    ["docs/guide/commands.md", "docs/guide/commands.md"],
  ]) {
    it(`${label} lists exactly the live verbs of each mode`, () => {
      const table = tableModes(read(path));
      expect(Object.keys(table).sort(), `${label} names no focus table`).toEqual(
        [...MODES].sort(),
      );
      for (const mode of MODES) {
        expect(table[mode], `${label}, mode ${mode}`).toEqual(fromFrontmatter(mode));
      }
    });
  }
});
