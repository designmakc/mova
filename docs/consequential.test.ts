// mova:engine
/**
 * Consequential contract — can the numbers actually satisfy the goals?
 *
 * The other test files check *structure*: columns line up, IDs increase, links are
 * shaped right, dates parse. In the reference instance every one of them passed on the day
 * `CAP = 40` with a 21-day top interval could sustain roughly 600 items in warm rotation
 * against a stated target of 1,500–2,000 — two numbers in the same repo that could never
 * both be true, sitting there since the scaffold and found only when a review did the
 * arithmetic by hand on day five (limba, 2026-08-04).
 *
 * Structural tests cannot catch that. These three can:
 *
 *   1. the SRS throughput ceiling still clears the goal's vocabulary target;
 *   2. no date anywhere in the workspace is in the future;
 *   3. no retired tool is still named in a file a session obeys.
 *
 * Each derives its inputs from the file that owns them, so the check keeps holding as the
 *   targets move rather than freezing today's numbers into a test.
 *
 * TEMPLATE MODE: checks 2 and 3 always run over whatever exists (they are vacuous on a
 * bare template and cost nothing). Check 1 needs an instance: a profile, a goal contract
 * with a vocabulary target, and a plan stating the weekly pace — it skips until all of its
 * instance-owned inputs exist, then requires the engine-owned inputs loudly.
 */

import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { loadProfile } from "../scripts/profile.mjs";

const docsDir = dirname(fileURLToPath(import.meta.url));
const root = join(docsDir, "..");
const has = (rel: string) => existsSync(join(root, rel));
const read = (rel: string) => readFileSync(join(root, rel), "utf8");

const todayISO = (): string => {
  const n = new Date();
  const p = (x: number) => String(x).padStart(2, "0");
  return `${n.getFullYear()}-${p(n.getMonth() + 1)}-${p(n.getDate())}`;
};

/* ------------------------------------------------------- 1. throughput ceiling */

// Instance-owned inputs, each read from the file that owns it. The goal contract names the
// vocabulary target (`Target volume**: ~<low>–<high>`); the plan names the weekly pace
// (`~N study blocks`). A goal without a vocabulary target (pure level/functional goals)
// legitimately has no ceiling to check.
const profile = loadProfile();
const targetTop = profile && has("docs/reference/goal.md")
  ? Number(
      /Target volume\*\*:\s*~?[\d,]+[–-]([\d,]+)/.exec(read("docs/reference/goal.md"))?.[1]
        ?.replace(/,/g, ""),
    ) || null
  : null;
const blocksPerWeek = has("docs/plan.md")
  ? Number(/~(\d+)\s*study blocks/.exec(read("docs/plan.md"))?.[1]) || null
  : null;

const ceilingActive =
  targetTop !== null && blocksPerWeek !== null && has("docs/mechanics/srs.md");

describe.skipIf(!ceilingActive)("SRS capacity vs the vocabulary target", () => {
  // Engine-owned inputs. Once the instance inputs exist, these must parse — a moved
  // heading fails loudly rather than silently skipping.
  const cap = Number(/^const CAP = (\d+)/m.exec(read("scripts/queue.mjs"))?.[1]);
  const topInterval = Math.max(
    ...[...read("docs/mechanics/srs.md").matchAll(/^\|\s*\d+\s*\|[^|]*\|\s*[^|]*?(\d+)\s*days?[^|]*\|/gm)]
      .map((m) => Number(m[1])),
  );

  it("every input was found (a moved heading must fail loudly, not silently pass)", () => {
    for (const [k, v] of Object.entries({ cap, topInterval, blocksPerWeek, targetTop })) {
      expect(Number.isFinite(v) && (v as number) > 0, `${k} parsed as ${v}`).toBe(true);
    }
  });

  it("the sustainable ceiling clears the stated target", () => {
    // srs.md's own arithmetic: reviews/day × the top interval is how many items can be held
    // in rotation if every one of them is mature. Reproduces the figures that file publishes,
    // which is what makes it trustworthy here.
    const reviewsPerDay = (cap * blocksPerWeek!) / 7;
    const ceiling = Math.round(reviewsPerDay * topInterval);
    expect(
      ceiling >= targetTop!,
      `SRS throughput sustains ~${ceiling} items in warm rotation ` +
        `(cap ${cap} × ${blocksPerWeek} blocks/week ÷ 7 = ${reviewsPerDay.toFixed(1)} reviews/day, ` +
        `× ${topInterval}-day top interval) — below the ${targetTop} target in ` +
        `docs/reference/goal.md.\n` +
        `Raise the cap or the top interval in docs/mechanics/srs.md (and scripts/queue.mjs), ` +
        `or lower the target. Ingesting more than the ceiling silently overflows.`,
    ).toBe(true);
  });
});

/* ------------------------------------------------------------ 2. no future dates */

describe("no date in the workspace is in the future", () => {
  const today = todayISO();
  const found: { where: string; date: string }[] = [];
  const sources: string[] = [];

  const collect = (where: string, rel: string, re: RegExp) => {
    if (!has(rel)) return;
    sources.push(rel);
    for (const m of read(rel).matchAll(re)) found.push({ where, date: m[1] });
  };

  collect("topics.md", "docs/reference/topics.md", /covered (\d{4}-\d{2}-\d{2})/g);
  collect("curriculum.md", "docs/curriculum.md", /status:\s*covered (\d{4}-\d{2}-\d{2})/g);
  collect("visuals index", "work/visuals/README.md", /^\|\s*(\d{4}-\d{2}-\d{2})\s*\|/gm);

  for (const [dir, label] of [["docs/snapshots", "snapshot filename"], ["work/visuals", "visual filename"]]) {
    if (!existsSync(join(root, dir))) continue;
    for (const f of readdirSync(join(root, dir))) {
      const m = /^(\d{4}-\d{2}-\d{2})_/.exec(f);
      if (m) {
        sources.push(`${dir}/${f}`);
        found.push({ where: `${label} ${f}`, date: m[1] });
      }
    }
  }

  // In template mode none of the dated surfaces exist yet — zero findings is then a fact,
  // not pattern rot, so the tripwire only arms once there is something to check.
  it.skipIf(sources.length === 0)(
    "checked something (a silent zero would mean the patterns rotted)",
    () => {
      expect(found.length).toBeGreaterThan(0);
    },
  );

  it(`no date is later than today`, () => {
    const future = found.filter((f) => f.date > today).map((f) => `${f.where}: ${f.date}`);
    expect(
      future,
      `dates in the future (today is ${today}):\n  ${future.join("\n  ")}\n` +
        `Run \`date\` at orient — every date here is typed by a model from possibly stale context, ` +
        `and SRS due-ness, pacing and snapshot ordering all depend on them.`,
    ).toEqual([]);
  });
});

/* --------------------------------------------------------- 3. retired tooling */

describe("retired tooling is gone from the files sessions obey", () => {
  /**
   * When a tool is replaced, EVERY doc naming it has to change in the same commit — the
   * mechanics files are the ones a session actually obeys, so updating AGENTS.md alone is
   * not enough. In the reference instance a stale name in media.md once had a whole lesson
   * run on the fallback TTS voice, and the retired command got baked into a generated
   * visual where it would have outlived the conversation.
   *
   * Add a row when you retire something. For mova the list also guards the FORK: names
   * that were real in limba and are replaced by an engine seam here must not survive in
   * any file an instance session obeys. (upstream/map.md quotes them legitimately — it is
   * the porting contract, not a file sessions obey, and is not scanned.)
   */
  const RETIRED: { pattern: RegExp; what: string; replacedBy: string }[] = [
    {
      pattern: /grep -oE '?Code:/,
      what: "the grep-based error tally",
      replacedBy: "node scripts/tally.mjs — it resolves Root:/Reroots: causation",
    },
    {
      pattern: /`\/limba-(lesson|drill|write|mock|review|vocab|retro)`/,
      what: "limba's per-agent skill names",
      replacedBy: "playbooks/<verb>.md via the AGENTS.md verb table",
    },
    {
      pattern: /\bdex\.mjs\b/,
      what: "the Romanian-only dictionary script",
      replacedBy: "the adapter seam: scripts/dictionary.mjs + packs/<code>/dictionary.mjs",
    },
    {
      pattern: /LIMBA_FEEDBACK_FILE/,
      what: "limba's feedback-target env var",
      replacedBy: "MOVA_FEEDBACK_FILE (scripts/feedback.sh)",
    },
  ];

  /** Files a session reads as instruction, or that get shown to the learner. Historical
   *  records — logs, snapshots, the feedback intake, upstream/ — legitimately quote
   *  retired things. */
  const LIVE: string[] = ["AGENTS.md", "README.md", "CLAUDE.md"];
  for (const dir of ["docs/mechanics", "docs/reference", "docs/projects", "playbooks", "setup/templates"]) {
    const abs = join(root, dir);
    if (!existsSync(abs)) continue;
    for (const entry of readdirSync(abs, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        for (const f of readdirSync(join(abs, entry.name))) {
          if (f.endsWith(".md")) LIVE.push(`${dir}/${entry.name}/${f}`);
        }
      } else if (entry.name.endsWith(".md")) {
        LIVE.push(`${dir}/${entry.name}`);
      }
    }
  }
  LIVE.push("docs/plan.md", "docs/curriculum.md");

  for (const { pattern, what, replacedBy } of RETIRED) {
    it(`${what} is not named anywhere live`, () => {
      const hits: string[] = [];
      for (const rel of LIVE) {
        if (!existsSync(join(root, rel))) continue;
        read(rel).split("\n").forEach((line, i) => {
          if (pattern.test(line)) hits.push(`${rel}:${i + 1}  ${line.trim().slice(0, 90)}`);
        });
      }
      expect(hits, `${what} still appears — replaced by ${replacedBy}:\n  ${hits.join("\n  ")}`).toEqual([]);
    });
  }
});
