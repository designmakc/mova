// mova:engine
/**
 * Routing-annotation contract for docs/plan.md.
 *
 * Enforces the "Routing legend" convention at the top of plan.md: every OPEN
 * milestone carries a `— <readiness> … · <agent>` annotation, and COMPLETED
 * (`[x]`) milestones drop it. Drift fails CI instead of relying on goodwill —
 * the same pattern docs/projects.index.test.ts uses for the index contract.
 *
 * What is enforced (the load-bearing, categorical axes):
 *   - readiness marker — one of CONTRACT.readinessMarkers
 *   - agent marker     — one of CONTRACT.agentMarkers
 * Complexity (Low/Med/High/…) is documented in the legend and kept by humans,
 * but its token form varies too much (`Med`, `Med–High`, `High (design)`, …) to
 * gate mechanically, so it is not asserted.
 *
 * Scope of "milestone":
 *   - every checkbox list item (`- [ ]` / `- [x]`) anywhere in the file, and
 *   - every top-level bullet in a "bullet backlog" section — a `## ` section
 *     whose name starts with one of CONTRACT.bulletBacklogSections (those
 *     sections use bullets, not checkboxes).
 * Prose, headings, and blockquotes (the legend) are out of scope — they are not
 * top-level list items.
 *
 * If this fails, fix plan.md — not the test.
 *
 * TEMPLATE MODE: docs/plan.md is generated at setup; the suite skips until it exists.
 *
 * ── To adapt this to your project, edit the CONTRACT block below. Everything else
 *    is generic. Keep markers as an ARRAY joined by alternation, never a character
 *    class: glyphs like ⚙️ are two code points and a char class would mis-match. ──
 */

import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

/** The only project-specific configuration. Edit this, not the logic below. */
const CONTRACT = {
  /** Readiness markers, matched by alternation (see header note). */
  readinessMarkers: ["🟢", "🟡", "🟠", "🔴"],
  /** Agent markers, matched by alternation. */
  agentMarkers: ["🧠", "⚙️", "🔧"],
  /** The character that introduces the trailing `— … annotation`. */
  annotationDelimiter: "—",
  /**
   * `## ` section-name prefixes whose plain top-level `- ` bullets count as open
   * milestones (checkbox items are milestones everywhere, regardless). Default:
   * just the unscheduled backlog. Phase sections use checkboxes, so their bullets
   * (goals, exit criteria) are intentionally NOT swept in.
   */
  bulletBacklogSections: ["Discovered"],
} as const;

const docsDir = dirname(fileURLToPath(import.meta.url));
const planPath = join(docsDir, "plan.md");

// Template mode: no plan.md until setup generates one.
const active = existsSync(planPath);

const lines = active ? readFileSync(planPath, "utf8").split("\n") : [];

const READINESS = `(?:${CONTRACT.readinessMarkers.join("|")})`;
const AGENT = `(?:${CONTRACT.agentMarkers.join("|")})`;
const DELIM = CONTRACT.annotationDelimiter;

/**
 * A well-formed annotation: the delimiter introducing a readiness marker and then,
 * within the same delimiter-bounded segment, an agent marker. The `[^DELIM]*` guards
 * keep both markers inside one trailing `— …` clause, so a delimiter used earlier in
 * the description doesn't produce a false match.
 */
const ANNOTATION = new RegExp(`${DELIM}[^${DELIM}]*${READINESS}[^${DELIM}]*${AGENT}`, "u");
const HAS_READINESS = new RegExp(READINESS, "u");

interface Item {
  lineNo: number;
  text: string;
  requireAnnotation: boolean; // open milestone → must carry an annotation
  forbidAnnotation: boolean; // completed milestone → must have dropped it
}

function collectItems(): Item[] {
  const items: Item[] = [];
  let section = "";

  lines.forEach((line, i) => {
    const lineNo = i + 1;

    const heading = line.match(/^##\s+(.*)/);
    if (heading) {
      section = heading[1].trim();
      return;
    }

    const checkbox = line.match(/^\s*-\s*\[([ xX])\]\s/);
    if (checkbox) {
      const done = checkbox[1].toLowerCase() === "x";
      items.push({ lineNo, text: line, requireAnnotation: !done, forbidAnnotation: done });
      return;
    }

    // Non-checkbox top-level bullets are milestones only in bullet-style backlog sections.
    const isBacklog = CONTRACT.bulletBacklogSections.some((p) => section.startsWith(p));
    if (isBacklog && /^-\s+\S/.test(line)) {
      items.push({ lineNo, text: line, requireAnnotation: true, forbidAnnotation: false });
    }
  });

  return items;
}

const items = collectItems();
const openItems = items.filter((it) => it.requireAnnotation);
const doneItems = items.filter((it) => it.forbidAnnotation);

describe.skipIf(!active)("docs/plan.md routing annotations", () => {
  it("finds both open and completed milestones to check", () => {
    expect(openItems.length).toBeGreaterThan(0);
    expect(doneItems.length).toBeGreaterThan(0);
  });

  it.each(openItems.map((it) => [it.lineNo, it.text] as const))(
    "open milestone (plan.md:%i) carries a readiness+agent annotation",
    (lineNo, text) => {
      expect(
        ANNOTATION.test(text),
        `plan.md:${lineNo} is an open milestone but has no \`— <readiness> … · <agent>\` annotation:\n  "${text.trim()}"`,
      ).toBe(true);
    },
  );

  it.each(doneItems.map((it) => [it.lineNo, it.text] as const))(
    "completed milestone (plan.md:%i) has dropped its annotation",
    (lineNo, text) => {
      expect(
        HAS_READINESS.test(text),
        `plan.md:${lineNo} is completed (\`[x]\`) but still carries a routing marker — drop the annotation:\n  "${text.trim()}"`,
      ).toBe(false);
    },
  );
});
