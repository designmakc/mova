// mova:engine
/**
 * Adapter contract for the configured agent — the shims exist, and hold nothing.
 *
 * AGENTS.md promises: "Per-agent command shims are generated at setup and contain only
 * pointers to these playbooks." Both halves are load-bearing. If a shim is missing, the
 * agent loses auto-invocation for that verb; if a shim CONTAINS anything — a tier rule, a
 * close-out step — that copy is free to drift from the playbook, and a drifted shim is
 * worse than none. This suite enforces both against the instance's configured `agent`.
 *
 * ACTIVE verbs (the set that must have adapters):
 *   - a playbook is active when its frontmatter `scenarios:` includes `all` or the
 *     profile's focus mode (`focus:` config key, default `full` —
 *     setup/scenarios/focus_modes.md; the frontmatter is the authority);
 *   - `maintainer: true` playbooks (e.g. sync-upstream) are NEVER active in an instance —
 *     adapters must not exist for them;
 *   - a playbook whose `requires:` names goal.md §Tuition (tutor-prep) is active only
 *     when docs/reference/goal.md actually has a `## Tuition` section.
 *
 * Adapter locations per agent (see agents/<agent>/README.md):
 *   claude-code → .claude/skills/mova-<verb>/SKILL.md
 *   opencode    → .opencode/command/mova-<verb>.md
 *   codex / antigravity / other → AGENTS.md itself is the adapter: its verb table must
 *   link every active playbook (no generated files to check).
 *
 * Leak heuristic: outside its frontmatter, a shim may not contain a line matching
 * /tier|ledger|close-out|SRS/i unless that line is the pointer (contains `playbooks/`).
 * Crude on purpose — it cannot catch every leaked rule, but it catches the words the
 * rules are made of, and it keeps the honest shims honest.
 *
 * TEMPLATE MODE: no profile ⇒ no configured agent ⇒ the suite skips.
 */

import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { loadProfile } from "../scripts/profile.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const profile = loadProfile();
const active = profile !== null;

const CONTRACT = {
  maxLines: 20,
  leakRe: /tier|ledger|close-out|SRS/i,
  pointerRe: /playbooks\//,
  tuitionHeading: /^## Tuition\s*$/m,
} as const;

interface Playbook {
  file: string;
  verb: string;
  summary: string;
  scenarios: string[];
  maintainer: boolean;
  requiresTuition: boolean;
}

function parsePlaybook(file: string): Playbook | null {
  const text = readFileSync(join(root, "playbooks", file), "utf8");
  const grab = (key: string) => new RegExp(`^${key}:\\s*(.+)$`, "m").exec(text)?.[1].trim();
  const verb = grab("verb");
  if (!verb) return null;
  return {
    file,
    verb,
    summary: grab("summary") ?? "",
    scenarios: (grab("scenarios") ?? "").split(/[,\s]+/).filter(Boolean),
    maintainer: grab("maintainer") === "true",
    requiresTuition: /tuition/i.test(grab("requires") ?? ""),
  };
}

const playbooks: Playbook[] = active
  ? readdirSync(join(root, "playbooks"))
      .filter((f) => f.endsWith(".md"))
      .map(parsePlaybook)
      .filter((p): p is Playbook => p !== null)
  : [];

/** The focus mode a playbook's `scenarios:` list is matched against (default `full`). */
const focus: string = active ? (profile!.get("focus", "full") as string) : "";

const goalText = existsSync(join(root, "docs/reference/goal.md"))
  ? readFileSync(join(root, "docs/reference/goal.md"), "utf8")
  : "";
const hasTuition = CONTRACT.tuitionHeading.test(goalText);

function isActive(p: Playbook): boolean {
  if (p.maintainer) return false; // maintainer playbooks are never active in an instance
  if (p.scenarios.includes("none")) return false;
  const scenarioHit = p.scenarios.includes("all") || p.scenarios.includes(focus);
  if (!scenarioHit) return false;
  if (p.requiresTuition && !hasTuition) return false;
  return true;
}

const agent = active ? profile!.require("agent") : "";
const activeVerbs = playbooks.filter(isActive).map((p) => p.verb);
const inactiveVerbs = playbooks.filter((p) => !isActive(p)).map((p) => p.verb);

/** Repo-relative adapter path for a verb, or null when AGENTS.md itself is the adapter. */
function adapterPath(verb: string): string | null {
  if (agent === "claude-code") return `.claude/skills/mova-${verb}/SKILL.md`;
  if (agent === "opencode") return `.opencode/command/mova-${verb}.md`;
  return null; // codex / antigravity / other: AGENTS.md-driven
}

/** Shim lines outside the frontmatter block (between the first two `---` lines). */
function bodyLines(text: string): string[] {
  const lines = text.split("\n");
  if (lines[0]?.trim() !== "---") return lines;
  const close = lines.slice(1).findIndex((l) => l.trim() === "---");
  return close === -1 ? lines : lines.slice(close + 2);
}

describe.skipIf(!active)("agent adapters (docs/agents.test.ts)", () => {
  it("every playbook has single-line verb and summary frontmatter", () => {
    for (const p of playbooks) {
      expect(p.verb, `${p.file}: verb`).toMatch(/^[a-z][a-z0-9-]*$/);
      expect(p.summary.length, `${p.file}: summary missing — the hub renders it`).toBeGreaterThan(0);
    }
  });

  it(`the configured agent (${agent}) has an adapter for every active verb`, () => {
    expect(activeVerbs.length, "no active playbooks parsed — playbooks/ or frontmatter shape changed").toBeGreaterThan(0);
    for (const verb of activeVerbs) {
      const rel = adapterPath(verb);
      if (rel === null) {
        // AGENTS.md-driven agents: the verb table is the adapter.
        expect(
          readFileSync(join(root, "AGENTS.md"), "utf8").includes(`playbooks/${verb}.md`),
          `AGENTS.md verb table does not link playbooks/${verb}.md — for agent "${agent}" that table IS the adapter`,
        ).toBe(true);
      } else {
        expect(existsSync(join(root, rel)), `missing adapter ${rel} for active verb "${verb}" — regenerate the shims`).toBe(true);
      }
    }
  });

  it("no adapter exists for maintainer or inactive verbs", () => {
    for (const verb of inactiveVerbs) {
      const rel = adapterPath(verb);
      if (rel === null) continue;
      expect(
        existsSync(join(root, rel)),
        `${rel} exists but "${verb}" is not active for this instance — a shim for a dead verb invites invoking it`,
      ).toBe(false);
    }
  });

  it(`every adapter file is ≤ ${CONTRACT.maxLines} lines and leaks no rule text`, () => {
    for (const verb of activeVerbs) {
      const rel = adapterPath(verb);
      if (rel === null) continue;
      const text = readFileSync(join(root, rel), "utf8");
      const lines = text.replace(/\n+$/, "").split("\n");
      expect(
        lines.length,
        `${rel} is ${lines.length} lines (max ${CONTRACT.maxLines}) — a shim that long is carrying rules`,
      ).toBeLessThanOrEqual(CONTRACT.maxLines);
      for (const line of bodyLines(text)) {
        if (!CONTRACT.leakRe.test(line)) continue;
        expect(
          CONTRACT.pointerRe.test(line),
          `${rel} leaks rule text: "${line.trim()}" — shims hold pointers only; the rules live in the playbook and docs/mechanics/`,
        ).toBe(true);
      }
    }
  });
});
