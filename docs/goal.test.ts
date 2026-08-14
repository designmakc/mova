// mova:engine
/**
 * Structure contract for docs/reference/goal.md — the goal contract, the file AGENTS.md
 * calls "the one principle that governs everything".
 *
 * Every scope decision in an instance tie-breaks against the goal contract's one marked
 * spec sentence; the assessment section names the instrument mocks are built from; the
 * deadline section owns the date math (or states the no-deadline rule). A goal contract
 * missing any of that is mis-generated, and the mis-generation must fail loudly at setup
 * time — not surface months later as an unanswerable scope argument.
 *
 * What is enforced:
 *   - the H1 is exactly `# Goal contract`;
 *   - the H2s appear in exactly this order: `## The spec`, `## Deadline`, `## Assessment`,
 *     `## Non-goals`, then optionally `## Tuition` (present only in the tuition scenario —
 *     its presence is what activates playbooks/tutor-prep.md);
 *   - `## The spec` contains exactly ONE bolded spec sentence matching
 *     `**The … is the spec.**` — one tie-breaker, not zero, not a committee.
 *
 * If this fails, fix goal.md (or the setup step that generated it) — not the test.
 *
 * TEMPLATE MODE: goal.md is generated at setup; the suite skips until it exists.
 */

import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const goalPath = join(dirname(fileURLToPath(import.meta.url)), "reference/goal.md");
const active = existsSync(goalPath);

const CONTRACT = {
  file: "docs/reference/goal.md",
  h1: "# Goal contract",
  h2s: ["The spec", "Deadline", "Assessment", "Non-goals"],
  optionalTail: "Tuition",
  specRe: /\*\*The .+ is the spec\.\*\*/,
} as const;

const text = active ? readFileSync(goalPath, "utf8") : "";
const lines = text.split("\n");

/** Body of one H2 section, up to the next `## ` or EOF. */
function sectionBody(title: string): string {
  const start = lines.findIndex((l) => l.trim() === `## ${title}`);
  if (start === -1) return "";
  const rest = lines.slice(start + 1);
  const end = rest.findIndex((l) => l.startsWith("## "));
  return (end === -1 ? rest : rest.slice(0, end)).join("\n");
}

describe.skipIf(!active)("docs/reference/goal.md", () => {
  it(`the H1 is exactly "${CONTRACT.h1}"`, () => {
    const h1s = lines.filter((l) => /^# /.test(l));
    expect(h1s, `${CONTRACT.file} must have exactly one H1`).toHaveLength(1);
    expect(h1s[0].trim()).toBe(CONTRACT.h1);
  });

  it("the H2s are The spec, Deadline, Assessment, Non-goals — in order, optional Tuition last", () => {
    const h2s = lines.filter((l) => /^## /.test(l)).map((l) => l.slice(3).trim());
    const allowed =
      h2s.length === CONTRACT.h2s.length + 1
        ? [...CONTRACT.h2s, CONTRACT.optionalTail]
        : [...CONTRACT.h2s];
    expect(
      h2s,
      `${CONTRACT.file} sections must be exactly [${allowed.join(", ")}] in this order — ` +
        `an extra section is scope creep's front door; a missing one is a mis-generation`,
    ).toEqual(allowed);
  });

  it("§The spec holds exactly ONE bolded spec sentence — the tie-breaker", () => {
    const body = sectionBody("The spec");
    const marked = body
      .split("\n")
      .filter((l) => CONTRACT.specRe.test(l));
    expect(
      marked,
      `${CONTRACT.file} §The spec must contain exactly one line matching ${CONTRACT.specRe} — ` +
        `found ${marked.length}. One sentence is the spec; zero is rudderless, two is a committee.`,
    ).toHaveLength(1);
  });
});
