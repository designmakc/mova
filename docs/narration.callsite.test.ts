// mova:engine
/**
 * The one mechanism narration.md has.
 *
 * WHY THIS EXISTS. Every other mechanic leaves an artifact a test can read: the ledgers are
 * files, the pages are gated by `visualcheck.mjs`, the logs are checked by
 * `logs.entries.test.ts`, the shims by `agents.test.ts`. Narration leaves nothing — whether
 * the agent actually said the thing is not recoverable from the repo afterwards. Upstream
 * (limba PORT-019, 2026-08-17) that gap cost a real learner fifteen minutes of unexplained
 * silence five hours after the rule landed, because the rule reached the mechanic and never
 * reached the verb that runs the slow command. The only narration instruction the agent read
 * at run time was the *other* half of the rule: say nothing.
 *
 * WHAT IS ACTUALLY CHECKABLE. Not the speech — the *documents*. "Announce before you run X"
 * is unenforceable at run time, but "the step that runs X carries the announcement" is a
 * static property of this repo. That is the whole trick here, and it is what turns an
 * unenforceable behavioural rule into a gate.
 *
 * CRUDE ON PURPOSE, like the shim leak heuristic in `agents.test.ts`. A pointer 16 lines away
 * satisfies this test without being an announcement. It cannot catch a bad announcement; it
 * catches the failure that actually happened, which is *no* announcement anywhere near the
 * command.
 */

import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (rel: string) => readFileSync(join(root, rel), "utf8");

const RULE = "docs/mechanics/narration.md";

/**
 * The stretches narration.md § 2 governs, keyed by what an agent can actually see itself
 * about to do. A duration is not on this list and must never be: the agent has no clock, so
 * "a stretch over ~2 minutes" is a description of a situation, not a condition it can
 * evaluate. That was limba's first cause.
 */
const SLOW = [
  { cmd: "tts-embed.mjs", why: "one network TTS call per clip in a page build" },
  { cmd: "tts-warm.mjs", why: "one network TTS call per uncached ledger row at close-out" },
];

/**
 * Lines that name a slow command without being a step that runs it. Each needs a reason,
 * and the reason has to be that the learner is not waiting on it *here*.
 */
const NOT_A_CALL_SITE = [
  {
    file: "playbooks/update.md",
    match: "re-warms on the next session",
    why: "states when the cache refills; the warm itself runs in a later close-out, which announces it",
  },
];

/** Files that describe or run the flows. The rule file itself and `why/` are excluded. */
function flowFiles(): string[] {
  const out: string[] = [];
  for (const dir of ["playbooks", "docs/mechanics", "setup"]) {
    for (const f of readdirSync(join(root, dir))) {
      if (!f.endsWith(".md")) continue;
      const rel = `${dir}/${f}`;
      if (rel === RULE) continue;
      out.push(rel);
    }
  }
  out.push("AGENTS.md");
  return out.filter((rel) => existsSync(join(root, rel)));
}

const WINDOW = 16;

describe("narration § 2 — the trigger is a command, not a duration", () => {
  it("§ 2 names every slow command", () => {
    const section = /^## 2 [\s\S]*?(?=^## 3 )/m.exec(read(RULE))?.[0] ?? "";
    expect(section, `${RULE} has no "## 2 ·" section`).not.toEqual("");
    for (const { cmd, why } of SLOW) {
      expect(
        section.includes(cmd),
        `${RULE} § 2 does not name \`${cmd}\` (${why}).\n` +
          `      § 2's trigger has to be something the agent can check against its own next\n` +
          `      action. If this command stopped being slow, drop it from SLOW in this test\n` +
          `      and from § 2 together — never from only one of them.`,
      ).toBe(true);
    }
  });

  it("§ 2 does not fall back to a duration trigger", () => {
    const section = /^## 2 [\s\S]*?(?=^## 3 )/m.exec(read(RULE))?.[0] ?? "";
    const durationTrigger = /(any|a) stretch (over|longer than) ~?\s*\d/i;
    expect(
      durationTrigger.test(section),
      `${RULE} § 2 triggers on a duration again.\n` +
        `      The agent has no clock. limba shipped exactly this wording on 2026-08-17 and it\n` +
        `      fired on nothing: a 73-clip page built in fifteen minutes of silence five hours\n` +
        `      later. Trigger on the command instead (docs/mechanics/why/narration.md).`,
    ).toBe(false);
  });

  it("every step that runs a slow command carries its announcement", () => {
    const misses: string[] = [];
    for (const rel of flowFiles()) {
      const lines = read(rel).split("\n");
      lines.forEach((line, i) => {
        const hit = SLOW.find(({ cmd }) => line.includes(cmd));
        if (!hit) return;
        if (NOT_A_CALL_SITE.some((x) => x.file === rel && line.includes(x.match))) return;
        const window = lines.slice(Math.max(0, i - WINDOW), i + WINDOW + 1).join("\n");
        if (/narration\.md/.test(window) && /§\s*2/.test(window)) return;
        misses.push(`${rel}:${i + 1}  ${line.trim().slice(0, 88)}`);
      });
    }
    expect(
      misses,
      `a slow command runs with no announcement instruction within ${WINDOW} lines:\n  ` +
        misses.join("\n  ") +
        `\n      Each of these is a stretch the learner waits through with nothing to do.\n` +
        `      Add the announcement AT the step — pointing at docs/mechanics/narration.md § 2 —\n` +
        `      or, if the learner is not waiting here, add the line to NOT_A_CALL_SITE with a\n` +
        `      reason. A rule that lands in a mechanic and not in the verb has not landed.`,
    ).toEqual([]);
  });
});

/**
 * The general form of limba's second cause: a rule can live in a mechanic that no verb ever
 * carries, and nothing notices. This is the weakest useful version — one citation anywhere is
 * enough — and it still caught § 6, which no flow file mentioned when this test was written.
 */
describe("narration — every rule reaches a verb", () => {
  it("every section of the mechanic is cited by at least one flow", () => {
    const sections = [...read(RULE).matchAll(/^## (\d+) · (.+)$/gm)].map((m) => ({
      n: m[1],
      title: m[2],
    }));
    expect(sections.length, `${RULE} has no numbered sections`).toBeGreaterThan(0);

    const cited = new Set<string>();
    for (const rel of flowFiles()) {
      const text = read(rel);
      for (const m of text.matchAll(/narration\.md/g)) {
        const after = text.slice(m.index! + "narration.md".length, m.index! + 200);
        for (const n of after.matchAll(/§\s*(\d+)/g)) cited.add(n[1]);
      }
    }

    const orphans = sections.filter((s) => !cited.has(s.n)).map((s) => `§ ${s.n} · ${s.title}`);
    expect(
      orphans,
      `narration rules no playbook or mechanic points at:\n  ${orphans.join("\n  ")}\n` +
        `      Every session reads the verb; only setup and retro read the whole mechanic. A\n` +
        `      rule nothing cites is a rule the agent meets once, out of context, and drops.\n` +
        `      Cite it from the step where it applies, or retire it.`,
    ).toEqual([]);
  });
});
