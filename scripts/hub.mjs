// mova:engine
/**
 * Generates work/visuals/index.html — the learner's one bookmark.
 *
 * A DASHBOARD of where the learner stands, then a BOARD of the units — each one an
 * aggregate over the topic aspects assigned to it, holding every study page ever built
 * for it. Plus the command list, because a handful of verbs is more than anyone remembers.
 *
 * The board replaced a flat library of visuals grouped by unit (limba, 2026-08-09). The
 * library could say what had been made; it could not say what any of it was worth. A unit
 * now carries two separate numbers — how much of it has been TAUGHT (aspect statuses) and
 * how much is RETAINED (the tier spread of the items filed under those aspects) — because
 * the gap between them is the finding. They are never averaged into one figure.
 *
 * Why generated and not hand-written: a hand-authored dashboard is stale the day after it
 * is written. limba's U01 deck proved that — its tier tags were baked into the HTML and
 * started lying within 24 hours. Every number here is READ FROM the file that owns it, at
 * generation time:
 *
 *   work/visuals/README.md       the visual index — file, units and kind
 *   state/vocab.md, grammar.md   tiers, due-ness
 *   docs/mechanics/srs.md        the interval table + cost model (canonical — never re-copied)
 *   docs/reference/topics.md     topic coverage
 *   docs/curriculum.md           unit status
 *   docs/logs/*.md               session history, score trend, error tally
 *   docs/reference/profile.md    the config block — goal date, languages, capabilities
 *   docs/plan.md                 the current phase
 *   playbooks/*.md               the command list, from each playbook's frontmatter
 *   AGENTS.md                    the shell command list
 *
 * Run TWICE per session that builds a page: once the moment the page passes visualcheck and
 * gets its index row (docs/mechanics/media.md → Delivering a visual, rule 3), so the learner
 * can open it from their one bookmark straight away, and again at close-out
 * (docs/mechanics/session_format.md) over the ledgers the session moved. It is cheap,
 * read-only except for its one output, and overwrites — so an extra run can only make the
 * page fresher. Zero dependencies.
 */
import { readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { loadProfile } from "./profile.mjs";
import { loadPack } from "./pack.mjs";
import { canVerify } from "./dictionary.mjs";
import { FAVICON_LINK } from "./favicon.mjs";
import {
  DASH_TOKENS, CHROME, BOARD, NAV_CSS, nav, OPEN_TARGET_JS, anchorOf, linkTo,
} from "./page-shell.mjs";
import {
  root, read, readMaybe, todayISO, daysBetween, must, when, skipped,
  intervals, pace, ledger, visuals, topics, units, sessions, errorTally, currentPhase,
  lessonParts, teachingBeats, pacing, calibration, weeklyTarget, paceWeek, unitState,
  commands,
} from "./sources.mjs";

const OUT = "work/visuals/index.html";

const profile = loadProfile();
if (!profile) {
  console.error("hub: no docs/reference/profile.md — this is template mode. Run setup first.");
  process.exit(1);
}
const pack = await loadPack();
// Imported after the template-mode gate so the gate works before sibling scripts exist.
const { tally, zones } = await import("./tally.mjs");
const { esc, md } = await import("./inline-md.mjs");

const T = profile.require("target_language");
const M = profile.require("meta_language");
const goalKind = profile.get("goal_kind", "goal");
/** The goal phrase the learner reads — e.g. "B1 exam". Falls back to the goal kind. */
const goalLabel = profile.get("goal_label", goalKind);

/**
 * The newest session's Next pointer, item (1) — quoted ONCE and attributed, never a headline
 * plus the same sentence again lower down. It is a quote, so it never carries this panel's
 * verdict: item (1) says what LEADS the block (session_format.md → "Which block to run").
 *
 * Hub-only, unlike everything in sources.mjs: this is not a reader of a file, it is one
 * surface's editorial rule about how much of a pointer to show.
 *
 * Legacy guard: pointers written before the rule in docs/logs/README.md may state a queue
 * count frozen at their close-out, while this panel states the live one a few lines above.
 * Drop the measured clause rather than print two totals for one queue — the gate in
 * docs/logs.entries.test.ts bars new ones, so this only has to age out.
 */
function nextBlock(all) {
  const raw = all[0] && all[0].next;
  if (!raw) return null;
  const one = /\(1\)\s*([\s\S]*?)(?=\*\*\(2\)|\(2\)|$)/.exec(raw);
  const text = (one ? one[1] : raw)
    .replace(/\*\*/g, "")
    // The clause body may not contain another connector, so the SMALLEST clause carrying the
    // count is the one dropped — "… due today and the queue is now 87 vocab" loses the half
    // after "and", not the half before it.
    .replace(
      /\s*(?:,|;|—|\band\b)\s*(?:the\s+)?(?:(?!\band\b)[^.;—])*?\b\d+\s*(?:vocab|grammar|due|items?|rows?)\b[^.;—]*/gi,
      "",
    )
    .replace(/\s+([.;,])/g, "$1")
    .trim()
    .replace(/[\s,;]+$/, "");
  return text ? text.slice(0, 260) : null;
}

/* --------------------------------------------------------------- assembling */

const today = todayISO();
const INT = intervals();
const vocab = ledger("state/vocab.md");
const grammar = ledger("state/grammar.md");
const all = [...vocab, ...grammar];
const due = all.filter((r) => INT[r.tier] !== undefined && daysBetween(r.last, today) >= INT[r.tier]);
/**
 * A row reviewed today is still "due" — tier 1 is a zero-day interval — but part 1 cannot
 * score it again (srs.md). `queue.mjs` drops those as the queue's tail and reports what
 * remains, so **every figure on this page counts `unseen`**: two surfaces printing a
 * different size for one queue is what made this panel unreadable (derived from limba,
 * 2026-08-17, where the page said 108 and the orient command said 90). The skipped rows are
 * named in the tile, never silently dropped.
 */
const seenToday = due.filter((r) => r.last === today).length;
const unseen = due
  .filter((r) => r.last !== today)
  .sort((a, b) => (a.last === b.last ? (a.id < b.id ? -1 : 1) : a.last < b.last ? -1 : 1));

/**
 * A METRIC THAT CANNOT REACH ZERO MUST NOT BE RENDERED AS A BACKLOG (limba PORT-024).
 *
 * Tier 1 has a zero-day interval, so a tier-1 row falls due again every morning however
 * often it is answered — it is a rotation, not a debt, and it can never be cleared. Blended
 * into one total and printed in the attention colour, a healthy queue reads as an unpayable
 * one: upstream's tile said 79 due and "past the 10′" when 64 of those were the pool and the
 * other 15 were a single day past a three-day interval. Nothing was behind, and the page was
 * shouting it beside a verdict that said to run a lesson.
 *
 * So the two populations are named apart. `scheduled` genuinely came around, genuinely
 * reaches zero, and is the only half that earns an alarm. `pool` is sized in minutes and
 * never as a count to clear. Any SRS with a zero-interval bottom rung has this shape.
 */
const scheduled = unseen.filter((r) => r.tier >= 2);
const pool = unseen.filter((r) => r.tier === 1);
/** What the deck actually holds — scripts/deck.mjs drops tier 0, seeded but never taught. */
const deck = { words: vocab.filter((r) => r.tier >= 1).length, patterns: grammar.filter((r) => r.tier >= 1).length };
deck.total = deck.words + deck.patterns;

/**
 * The queue's real size, in minutes rather than items — and whether it still fits the slot
 * a lesson gives it.
 *
 * A count alone cannot answer "lesson or drill first": 30 mature items are a 90-second
 * sweep and 30 tier-1 items are ten minutes of production. Past the box the queue stops
 * being part 1 of a lesson and becomes the session — on a drill nothing competes with it
 * (session_format.md). That is the threshold the tile draws.
 */
const PACE = pace();
/** The recognition pool sized the way it should be reported — in minutes, never as a count
 *  to clear. srs.md's own rate; no per-block cost, because the pool is a sweep inside a
 *  block that is being charged for anyway. */
const poolMinutes = (pool.length * PACE.recognise) / 60;
/** ~10 items is one round trip in chat — the unit the per-block fixed cost is charged against. */
const BLOCK_ITEMS = 10;
const queue = {
  recognise: unseen.filter((r) => r.tier === 1 || r.tier >= 4).length,
  bare: unseen.filter((r) => r.tier === 2).length,
  full: unseen.filter((r) => r.tier === 3).length,
  box: PACE.box,
};
queue.produce = queue.bare + queue.full;
queue.items = queue.recognise + queue.bare + queue.full;
queue.blocks = Math.ceil(queue.items / BLOCK_ITEMS);
queue.minutes =
  (queue.recognise * PACE.recognise + queue.bare * PACE.bare + queue.full * PACE.full) / 60 +
  queue.blocks * PACE.perBlock;
queue.over = queue.minutes > queue.box;
/**
 * How far into the queue part 1 actually reaches — the oldest items whose running cost still
 * fits the box, by the same model. A panel that prints the queue's size and part 1's box and
 * leaves the subtraction to the learner is why a long queue reads as a job to finish today.
 */
queue.fits = (() => {
  const cost = (r) => (r.tier === 2 ? PACE.bare : r.tier === 3 ? PACE.full : PACE.recognise);
  let items = 0;
  let secs = 0;
  for (const r of unseen) {
    const next = secs + cost(r);
    if (next / 60 + Math.ceil((items + 1) / BLOCK_ITEMS) * PACE.perBlock > queue.box) break;
    secs = next;
    items += 1;
  }
  return items;
})();
queue.rest = unseen.length - queue.fits;

/** The queue drawn against its box: the tick is the threshold, the fill is today. */
function queueMeter() {
  const span = Math.max(queue.minutes, queue.box) * 1.15;
  const round = (m) => (m < 1 ? "<1" : Math.round(m));
  return `
        <div class="qm" title="Tier 1 is recognition and tiers 4–5 sweep (≈${PACE.recognise}s an item); tier 2 is bare production (≈${PACE.bare}s); tier 3 asks the full package (≈${PACE.full}s). Plus ≈${PACE.perBlock} min per block of composing, marking and publishing — ${queue.blocks} block(s) here. The tick is the ${queue.box} minutes a lesson gives its review block.">
          <div class="qm-track">
            <div class="qm-fill${queue.over ? " over" : ""}" style="width:${(queue.minutes / span) * 100}%"></div>
            <div class="qm-mark" style="left:${(queue.box / span) * 100}%"></div>
          </div>
          <div class="qm-cap">≈ ${round(queue.minutes)} min · ${
            queue.over
              ? `<b>past</b> the ${queue.box}′ a lesson gives review — the oldest ${queue.fits} fit, the rest waits`
              : queue.minutes >= queue.box * 0.85
                ? `fills the ${queue.box}′ a lesson gives review`
                : `inside the ${queue.box}′ a lesson gives review`
          }</div>
        </div>`;
}

const tierCounts = {};
for (const t of Object.keys(INT)) tierCounts[t] = all.filter((r) => r.tier === Number(t)).length;

const tp = topics();
const tpCovered = tp.filter((t) => /^covered/i.test(t.status)).length;
const un = units();
const unCovered = un.filter((u) => /^covered/i.test(u.status)).length;
const vis = visuals();
/* ------------------------------------------------------------ the unit board
 *
 * One row per unit, each an aggregate over the ASPECTS the topic map assigns to it —
 * never over the unit itself. The difference is the whole point: a unit is a delivery
 * schedule, so "U01 is covered" can be true while a session is still drilling one of its
 * aspects and rolling an item back a tier (limba SES-011). Aspects move whenever anything
 * touches them, from any session, in any unit, and every unit that owns the aspect moves
 * with it.
 *
 * Two numbers, never blended. `taught` is delivery, from the aspect statuses; `retained`
 * is the tier spread of the items filed under those aspects. Their DIVERGENCE is the
 * finding — limba's U03 came out four aspects of five taught and one item of twenty-five
 * above tier 2, which a single averaged figure would have reported as roughly sixty
 * percent.
 *
 * Tier 0 is excluded from `retained`: it means seeded and not yet taught, so counting it
 * as un-retained would punish a unit for material it has not been given.
 */
const board = un.map((u) => {
  const asps = tp.filter((t) => t.unit === u.id);
  const ids = new Set(asps.map((a) => a.id));
  const items = all.filter((i) => ids.has(i.topic));
  const live = items.filter((i) => i.tier >= 1);
  const dates = asps
    .filter((a) => /^covered/i.test(a.status))
    .map((a) => a.status.replace(/^covered\s+/i, ""))
    .sort();
  const pages = vis
    .filter((v) => v.units.includes(u.id))
    // Chronological, and an undated page sorts LAST: no delivery date means built and not
    // yet taught, which makes it the newest thing in the unit, not the oldest.
    .sort((x, y) => (x.date || "9999").localeCompare(y.date || "9999"));
  const st = unitState(u, asps, pages);
  /**
   * A FREE AUDIT FALLS OUT OF HAVING ONE STATE (limba PORT-023). curriculum.md's `status:`
   * line and the aspect statuses are two authored claims about the same thing, and they
   * diverge exactly when a close-out flipped one and forgot the other. Shown, not thrown:
   * `must()` is for a table that changed shape, and a disagreement between two files a
   * human writes is a finding the learner should see, not a build failure.
   */
  const claimed = /^covered/i.test(u.status);
  return {
    ...u,
    asps,
    pages,
    ...st,
    disagrees: claimed !== (st.state === "taught"),
    first: dates[0] || null,
    last: dates[dates.length - 1] || null,
    live,
    solid: live.filter((i) => i.tier >= 3).length,
    shaky: live.filter((i) => i.tier <= 2),
    seeded: items.filter((i) => i.tier === 0).length,
  };
});


/**
 * The unit to open next, from the ONE state rather than from curriculum.md's status line.
 * A unit whose material is already built and waiting outranks the next untouched one:
 * that page exists precisely so the next session does not start from nothing.
 */
const nextUnit =
  board.find((b) => b.state === "part-taught") ||
  board.find((b) => b.state === "staged") ||
  board.find((b) => b.state !== "taught") ||
  null;
const ses = sessions();
const scored = ses.filter((s) => s.score !== null).slice(0, 8).reverse();
const errs = errorTally();
const goalDate = profile.get("goal_date", null);
const daysToGoal = goalDate ? daysBetween(today, goalDate) : null;
/** No deadline ⇒ no countdown or pace UI. What IS computable there: volume and recency. */
const last7 = ses.filter((s) => daysBetween(s.date, today) < 7).length;
const phase = currentPhase();
const { verbs, shell, focus } = commands(profile.get("focus", "full"));
const pacingRows = pacing();
const target = weeklyTarget(phase);
const week = paceWeek(ses, today);
const nextOne = nextBlock(ses);
const partRows = lessonParts();
const beatRows = teachingBeats();
const calibRows = calibration();
const last = ses[0];

/**
 * ONE verdict: the block to run, and the arithmetic that picked it.
 *
 * This panel used to print three signals side by side and leave the learner to arbitrate —
 * the pointer's "run it first", a pace line reading "do a lesson, not a drill", and a queue
 * meter reading "a drill takes the whole hour" (limba, 2026-08-17). session_format.md →
 * "Which block to run" ranks them; this only renders the ranking:
 *
 *   the MIX decides    — whichever side of plan.md's weekly load is further behind its share;
 *   the QUEUE does not — it sizes part 1, and breaks a tie only toward a drill;
 *   the POINTER does not — it says what leads the block, quoted below.
 *
 * A verb this focus mode has switched off is never recommended (verbs.mjs) — 0.7.1's rule
 * that the hub does not advertise what the workspace refuses.
 */
/** Does this focus mode answer to this verb at all? (verbs.mjs owns the rule.) */
const live = (name) => verbs.some((v) => v.name === name);
function blockVerdict() {
  // A phase whose load names no lesson count — a mock cycle, a plan with no second side — has
  // no mix to compare and therefore no verdict. The panel falls back to the pointer quote.
  if (!target) return null;
  // A mode with no lesson has no mix to weigh: whatever it runs, it runs every time.
  if (!live("lesson")) return null;
  const n = (x, w) => `${x} ${w}${x === 1 ? "" : "s"}`;
  const owedL = target.lessons - week.lessons;
  // A later phase may trade the drill for a write, or have no second side at all — read the
  // label off the plan rather than assuming the pair.
  const label = target.capLabel;
  const owedB = target.capN === null || !live(label) ? null : target.capN - week.drills;
  const lesson =
    owedB === null || owedL > owedB || (owedL === owedB && !(label === "drill" && queue.over));

  const standing = [];
  const side = (owed, word) => {
    if (owed > 0) standing.push(`${n(owed, word)} short`);
    else if (owed < 0) standing.push(`${n(-owed, word)} over`);
  };
  side(owedL, "lesson");
  if (owedB !== null) side(owedB, label);
  const why = standing.length ? standing.join(", ") : "the week's mix is met";

  /**
   * A drill IS the queue (playbooks/drill.md: review only, no new material), so an empty
   * queue leaves it with nothing to run — the mix can owe a drill that cannot happen. Say
   * that, rather than naming a block whose whole content is missing. Found while verifying
   * this panel against a seeded instance, 2026-08-17; limba's own verdict has the same shape
   * and the statement for it is in upstream/backports/.
   */
  if (!lesson && label === "drill" && !unseen.length) {
    return {
      cmd: "lesson",
      why: `${why}, but nothing is due and a drill is only the queue`,
      opens: `Part 1 does not run — straight to ${nextUnit ? esc(nextUnit.id) : "the next unit"}.`,
    };
  }

  if (lesson) {
    return {
      cmd: "lesson",
      why,
      opens: unseen.length
        ? `The queue leads part 1, then ${nextUnit ? esc(nextUnit.id) : "the next unit"}.`
        : `Nothing is due, so part 1 does not run — straight to ${
            nextUnit ? esc(nextUnit.id) : "the next unit"
          }.`,
    };
  }
  return {
    cmd: label,
    why,
    opens:
      label === "drill"
        ? "The queue is the whole session — repair only, no new material."
        : "A composition against the goal contract, no new material.",
  };
}
const verdict = blockVerdict();

/**
 * ONE BAND, TWO FACES, NEVER BOTH (limba PORT-023).
 *
 * *In progress* and *what to do next* are the same slot. When a unit is in flight the band
 * offers to continue it and carries what the board row cannot — the can-do line, the parts
 * still open, and the material as direct links. When the week's mix points somewhere else
 * the VERDICT WINS and the band stays *what to do next*, with the unit surviving as one
 * clause inside the folded arithmetic.
 *
 * This is the same rule that collapsed three competing signals into one verdict: a page
 * offering two answers makes the reader arbitrate, which is the job the page was supposed
 * to do. session_format.md already ranks these signals; the band only renders the ranking.
 */
const inFlight = nextUnit && nextUnit.state === "part-taught" ? nextUnit : null;
const continuing = inFlight && (!verdict || verdict.cmd === "lesson") ? inFlight : null;

/**
 * What the queue DOES inside today's block. This replaced a hardcoded "a drill clears the
 * queue in 10–15 minutes", which was a predicted duration (narration.md § 1 bars those) and
 * measured 68 minutes wrong upstream. Every figure here comes from srs.md's cost model.
 */
const queueLine = (() => {
  if (!unseen.length) return null;
  const mins = Math.round(queue.minutes);
  const head = `<strong>${unseen.length} unseen, ≈${mins}′.</strong>`;
  // session_format.md: past 100 items the budget is agreed out loud, before the first set.
  const budget = unseen.length >= 100 ? " Agree a block budget before the first set." : "";
  if (!queue.over) return `${head} Part 1 clears it inside its ${queue.box}′.${budget}`;
  const rest =
    ` Part 1's ${queue.box}′ reaches the oldest ${queue.fits}; the other ${queue.rest}` +
    ` keep their place in line — the queue is oldest-first, so the tail can wait.`;
  const drillIsTheBlock = (verdict && verdict.cmd === "drill") || !live("lesson");
  const alt = drillIsTheBlock
    ? ` The block is ≈${mins}′ over ${queue.blocks} blocks, most of it the ≈${PACE.perBlock}′ fixed per block.`
    : ` A drill instead spends ≈${mins}′ on the same rows and teaches nothing new.`;
  return `${head}${rest}${alt}${budget}`;
})();

const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);

/* ----------------------------------------------------- the confidence panel
 *
 * Every line answers "how much should the learner trust this workspace" — and every line
 * is either read from a real record or says plainly that no record exists. "Not yet
 * measured" is a valid render; an invented number here would be the panel refuting itself.
 */

/** Contract-test standing. HONEST LIMITATION: vitest leaves no artifact this hub could
 *  read for "last run + pass/fail" without either shelling out to a full test run at
 *  every close-out (too slow for a dashboard regenerator) or inventing a status file no
 *  tool maintains. So the panel renders what IS knowable — how many contract test files
 *  the repo carries and whether enforcement mode is on — and tells the learner the
 *  command that answers the rest. If a `.test-status.json` convention ever lands (written
 *  by a test wrapper, not by hand), teach this function to read it. */
function testFileCount() {
  const SKIP = new Set(["node_modules", ".git", "materials", ".tts-cache", ".obsidian"]);
  let n = 0;
  const walk = (dir) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      if (e.isDirectory()) { if (!SKIP.has(e.name)) walk(join(dir, e.name)); }
      else if (e.name.endsWith(".test.ts")) n++;
    }
  };
  walk(root);
  return n;
}

/** The last factcheck sweep, if one was recorded (scripts/factcheck.mjs --out). */
function factcheck() {
  const raw = readMaybe("work/.factcheck.json");
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

/** Provenance-marker tally over docs/mechanics/*.md — a cheap grep, counted as markers,
 *  never as "rules" (one rule can carry one marker; unmarked rules are assumed by the
 *  README's own convention). README.md is excluded: it defines the markers and would
 *  count its own legend. */
function provenance() {
  const text = readdirSync(join(root, "docs/mechanics"))
    .filter((f) => f.endsWith(".md") && f !== "README.md")
    .map((f) => read("docs/mechanics/" + f))
    .join("\n");
  const count = (re) => (text.match(re) || []).length;
  return {
    measured: count(/\(measured(?! on limba)/g),
    derived: count(/derived from SES-/g),
    defaults: count(/measured on limba['’]s learner/g),
    assumed: count(/\(assumed/g),
  };
}

const conf = {
  tests: testFileCount(),
  mode: profile.get("mode", "unenforced"),
  fc: factcheck(),
  prov: provenance(),
  dict: canVerify(pack.dictionary) ? pack.dictionary.source : null,
};

/** The facts-verified cell — the three honest states, worst news first. */
function factsCell() {
  const { fc, dict } = conf;
  if (!dict) {
    return `<b>runs unattested</b> — the ${esc(pack.code)} pack declares no dictionary, so every
      fact is tutor-confirmed or carries the <code>?</code> marker (verification.md)`;
  }
  if (!fc) {
    return `not yet measured — run <code>node scripts/factcheck.mjs --out work/.factcheck.json</code>
      and regenerate the hub`;
  }
  if (!fc.verifiable) return `cannot verify — ${esc(fc.reason)} (recorded ${esc(fc.generated || "?")})`;
  return `${fc.verified} of ${fc.rows} ledger rows attested by ${esc(fc.source)} ·
    ${fc.unverified} unverified${fc.contradicted ? ` · <b style="color:var(--bad)">${fc.contradicted} contradicted — fix before they are drilled</b>` : " · 0 contradicted"}
    — swept ${esc(fc.generated || "date not recorded")}`;
}

/* ---------------------------------------------------------------- rendering */

/**
 * One headline number.
 *
 * `href` makes the whole tile the way through to wherever that number is unpacked — see
 * page-shell.mjs's ANCHOR map for why the target is a section and not a page. A linked tile
 * carries a corner arrow: anything clickable says so, and says it before the pointer
 * arrives.
 */
const tile = (value, label, sub = "", state = "", extra = "", href = null) => {
  const cls = `tile${state ? " " + state : ""}${href ? " go" : ""}`;
  const inner = `
        <div class="tile-v">${esc(value)}</div>
        <div class="tile-l">${esc(label)}</div>
        ${sub ? `<div class="tile-s">${md(sub)}</div>` : ""}
        ${extra}`;
  return href
    ? `\n      <a class="${cls}" href="${href}">${inner}\n      </a>`
    : `\n      <div class="${cls}">${inner}\n      </div>`;
};

const bar = (label, done, total) => `
      <div class="bar-row${done === 0 ? " untouched" : ""}">
        <div class="bar-head"><span>${esc(label)}</span><span class="muted">${done}/${total}</span></div>
        <div class="bar"><div class="bar-fill" style="width:${pct(done, total)}%"></div></div>
      </div>`;

// Topic coverage per system, worst-covered first — that ordering IS the information.
const topicSections = [...new Set(tp.map((t) => t.section))]
  .map((s) => {
    const inS = tp.filter((t) => t.section === s);
    return { s, done: inS.filter((t) => /^covered/i.test(t.status)).length, total: inS.length };
  })
  .sort((a, b) => pct(a.done, a.total) - pct(b.done, b.total));

const tierBar = Object.keys(INT).map((t) => {
  const n = tierCounts[t];
  return n ? `<div class="seg seg-${t}" style="flex:${n}" title="tier ${t}: ${n} items">${n}</div>` : "";
}).join("");

/** Kind is read from the index, not inferred from the filename. The filename heuristic
 *  ("deck" or "drill" ⇒ practice) could not see the difference between a drill surface and
 *  a repair sheet built to fix one specific failure — which is the distinction a unit's
 *  history is actually made of. */
const KIND_LABEL = { teach: "explainer", drill: "practice", repair: "repair" };
const kindOf = (v) => KIND_LABEL[v.kind] || v.kind;

const card = (v) => `
        <article class="card${v.superseded ? " superseded" : ""}">
          <div class="card-top">
            <h3><a class="card-link" href="${esc(v.file || "#")}">${esc(v.name)}</a></h3>
            <span class="pills">
              ${v.superseded ? `<span class="pill old" title="replaced by a later page — kept for the record">superseded</span>` : ""}
              ${v.built && !v.superseded ? `<span class="pill built" title="ready to open — no session has taught it yet">not taught yet</span>` : ""}
              <span class="pill ${kindOf(v)}">${kindOf(v)}</span>
            </span>
          </div>
          <p class="teaches">${md(v.teaches)}</p>
          <div class="card-foot">
            ${v.built ? `<span class="nodate">built, waiting for a session</span>` : `<time>${esc(v.date)}</time>`}
          </div>
        </article>`;

/** Weakest first, the same doctrine as the topic-coverage panel: worst-covered leads
 *  because that ordering IS the information. Units holding nothing measurable trail —
 *  they are not doing well, they are simply not yet answerable. */
const weakKey = (b) => (b.live.length ? pct(b.solid, b.live.length) : 1000 + Number(b.id.slice(1)));

const aspectLine = (a) => {
  const done = /^covered/i.test(a.status);
  return `<div class="asp${done ? "" : " pending"}">
            <span>${md(a.aspect)}</span>
            <span class="asp-r">${esc(a.exam)}${done ? "" : " · pending"}</span>
          </div>`;
};

/* The pages live inside the unit that owns them rather than in a separate library, so a
   unit's explainer, its drill surface and the sheet built to repair it are read together —
   which is the order they were used in. A page listed under two units is the same page,
   deliberately shown twice. */
const KIND_NOTE = {
  teach: "Taught by",
  drill: "Drilled by",
  repair: "Repaired by — built after something failed",
};
const pageGroup = (b, kind) => {
  const list = b.pages.filter((p) => p.kind === kind);
  if (!list.length) return "";
  return `<div class="pgroup">
            <div class="pg-l">${esc(KIND_NOTE[kind] || kind)}</div>
            <div class="cards">${list.map(card).join("")}</div>
          </div>`;
};

const SHOW_SHAKY = 10;
/** Five aspects is the point past which the list stops being read and starts being
 *  scrolled. The number is this board's; the rule that produced it is the portable half. */
const SHOW_ASPECTS = 5;

/** The five states of unitState(), in the learner's words. One derived value, one label
 *  table — the pill, the open attribute and `nextUnit` can no longer disagree. */
const STATE_LABEL = {
  taught: "taught in full",
  "part-taught": "part-taught",
  staged: "material waiting",
  "not-opened": "not opened",
  unmapped: "no aspects mapped",
};

const unitRow = (b) => {
  const r = b.live.length ? pct(b.solid, b.live.length) : null;
  const shaky = b.shaky.slice(0, SHOW_SHAKY);
  const rest = b.shaky.length - shaky.length;
  const span = b.first ? (b.first === b.last ? b.first : `${b.first} → ${b.last}`) : null;
  return `
      <details class="unit" data-weak="${weakKey(b)}"${b.state === "part-taught" ? " open" : ""}>
        <summary class="ustrip">
          <div class="uhead">
            <span class="uid">${esc(b.id)}</span>
            <span class="utitle">${esc(b.title.replace(/\s*\([^)]*\)\s*$/, ""))}</span>
            <span class="upill">${esc(STATE_LABEL[b.state])}</span>
            ${b.staged.length && b.state !== "staged" ? `<span class="upill" title="a page for this unit is built and no session has taught it yet">${b.staged.length} waiting</span>` : ""}
          </div>
          <div class="ubars">
            <div>
              <div class="bar-head"><span class="lbl">taught</span><span>${b.covered}/${b.asps.length} aspects</span></div>
              <div class="bar${b.covered ? "" : " none"}"><div class="bar-fill tt" style="width:${pct(b.covered, b.asps.length)}%"></div></div>
            </div>
            <div>
              <div class="bar-head"><span class="lbl">retained</span><span class="${
                r === null ? "muted" : r >= 50 ? "r-solid" : "r-shaky"
              }">${r === null ? (b.seeded ? `${b.seeded} seeded` : "—") : r + "%"}</span></div>
              <div class="bar${b.live.length ? "" : " none"}">
                <div class="bar-fill ok" style="width:${pct(b.solid, b.live.length)}%"></div>
                <div class="bar-fill no" style="width:${pct(b.shaky.length, b.live.length)}%"></div>
              </div>
            </div>
          </div>
        </summary>
        <div class="upanel">
          <div class="ucols">
            <div>
              <h4>What this unit owns</h4>
              ${b.asps.length
                ? b.asps.slice(0, SHOW_ASPECTS).map(aspectLine).join("") +
                  // FOLD A LIST WHOSE TAIL DOES NOT EARN ITS HEIGHT (PORT-026). One unit
                  // upstream owned fifteen aspects and ran 491px open, on a board whose
                  // job is to be scanned.
                  (b.asps.length > SHOW_ASPECTS
                    ? `<details class="fold"><summary>${b.asps.length - SHOW_ASPECTS} more</summary>
                       ${b.asps.slice(SHOW_ASPECTS).map(aspectLine).join("")}</details>`
                    : "")
                : `<div class="note">No aspects assigned yet in the topic map.</div>`}
              ${span ? `<div class="note" style="margin-top:8px">Taught ${esc(span)}.</div>` : ""}
              ${b.disagrees ? `<div class="note" style="margin-top:8px;color:var(--hi)">
                <strong>These two disagree.</strong> The curriculum's own line says
                <code>${esc(b.status)}</code>, the aspects say ${esc(STATE_LABEL[b.state])}. One of
                the two was flipped at a close-out and the other was not — fix the file that
                is wrong, not this page.</div>` : ""}
            </div>
            <div>
              <h4>${b.live.length ? `${b.live.length} things to remember` : "Nothing tracked yet"}</h4>
              ${b.live.length ? `
                <div class="note"><i class="sw ok"></i>${b.solid} solid · <i class="sw no"></i>${
                  b.shaky.length} still shaky${
                  b.seeded ? ` · ${b.seeded} seeded, not yet taught` : ""}</div>
                ${b.shaky.length ? `<div class="chips">${shaky
                  .map((i) => `<span class="chip t${i.tier}">${esc(i.target.split(" (")[0])}</span>`).join("")}${
                  rest ? `<span class="chip more">+${rest} more</span>` : ""}</div>` : ""}`
              : b.seeded ? `<div class="note">${b.seeded} item seeded against this unit's material and held out of review until the unit delivers it.</div>`
              : `<div class="note">No word or pattern is filed under this unit yet. It arrives when the unit opens.</div>`}
            </div>
          </div>
          ${b.pages.length ? `<div class="upages">
            ${pageGroup(b, "teach")}${pageGroup(b, "drill")}${pageGroup(b, "repair")}
          </div>` : ""}
        </div>
      </details>`;
};

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
${FAVICON_LINK}
<title>${esc(T)} — hub</title>
<style>
${DASH_TOKENS()}
  /* ============ CHROME — the frame every generated dashboard shares =============== */
${CHROME}
${NAV_CSS}
  /* ============ BOARD — this page's own furniture ================================= */
${BOARD}
</style>
</head>
<body>
<div class="wrap">
  ${nav("index.html")}

  <header class="top">
    <h1>${esc(T)}</h1>
    <span class="sub">${esc(goalLabel)} — the workspace hub</span>
  </header>
  <div class="stamp">Generated ${esc(today)} by <code>scripts/hub.mjs</code>${
    phase ? ` · ${esc(phase)}` : ""
  }. Every number is read from the file that owns it — nothing here is hand-maintained.</div>

  <h2>Where things stand</h2>
  <div class="tiles">
    ${daysToGoal !== null ? tile(daysToGoal, goalKind === "exam" ? "days to exam" : "days to goal",
        `${goalDate} — the working target`, "", "", linkTo("profile.html", "pace")) : ""}
    ${un.length ? tile(`${unCovered}/${un.length}`, "units done", nextUnit
        ? `next up: **${nextUnit.id}** — ${nextUnit.title.replace(/\s*\([^)]*\)\s*$/, "")}`
        : "all units covered", "", "", `#${anchorOf("board")}`) : ""}
    ${tp.length ? tile(`${tpCovered}/${tp.length}`, "grammar taught",
        `individual points fully covered, out of everything ${goalLabel} needs`,
        "", "", linkTo("profile.html", "coverage")) : ""}
    ${tile(all.length, "things to remember", `${vocab.length} words · ${grammar.length} grammar patterns`,
        "", "", linkTo("profile.html", "ladder"))}
    ${tile(scheduled.length, "came around today", scheduled.length || pool.length
        ? `${pool.length ? `plus a **${Math.round(poolMinutes)}′** recognition pool that recycles daily` : "nothing recycling today"}${
            seenToday ? ` · ${seenToday} already answered today` : ""
          }`
        : seenToday
          ? `all ${seenToday} due rows were reviewed today — part 1 does not run`
          : "nothing is scheduled — you are caught up",
      scheduled.length ? (queue.over ? "attention" : "") : "clear",
      unseen.length ? queueMeter() : "")}
    ${tile(ses.length, "study sessions", last
        ? daysToGoal !== null
          ? `most recent was ${esc(last.date)}`
          : `most recent was ${esc(last.date)} · ${last7} in the last 7 days`
        : "", "", "", linkTo("profile.html", "history"))}
    ${target ? tile(
        `${week.lessons}/${target.lessons}`,
        "lessons this week",
        week.lessons >= target.lessons
          ? `on the plan's pace — **${esc(target.load)}**`
          : `**${target.lessons - week.lessons} short** of the plan's **${esc(target.load)}**`,
        week.lessons >= target.lessons ? "clear" : "attention",
        "", linkTo("profile.html", "rhythm"),
      ) : ""}
  </div>

  <a class="deck" href="deck.html">
    <div>
      <div class="deck-n">${deck.total}</div>
      <div class="deck-nl">items in it</div>
    </div>
    <div>
      <div class="deck-h">The deck <b>→</b></div>
      <div class="deck-s">${deck.words} words · ${deck.patterns} grammar patterns${
        unseen.length ? ` · ${unseen.length} of them due today` : ""
      } — each with its notes and, where it exists, its audio.</div>
      <div class="deck-s">Filter by unit, tier or part of speech and sort the same three ways;
        hide one side (${esc(T)} → ${esc(M)} or ${esc(M)} → ${esc(T)}) and reveal a row at a time.</div>
    </div>
  </a>
  <div class="deck-foot">
    <span class="deck-local">Opens <code>deck.html</code> next to this page — rebuilt from
      the ledgers at every close-out, so it is current.</span>${
      all.length - deck.total > 0
        ? ` <span>${all.length - deck.total} of the ${all.length} tracked items are not in it: they are
           seeded against a unit that has not taught them yet.</span>`
        : ""
    }</div>

  ${last || unseen.length ? `
  <div class="whatnow">
    <div class="whatnow-h">${continuing ? `In progress — ${esc(continuing.id)}` : "What to do next"}</div>
    ${continuing ? `
    <p class="whatnow-do">Carry on with <strong>${esc(continuing.title.replace(/\s*\([^)]*\)\s*$/, ""))}</strong>${
      continuing.cando ? ` — so you can ${esc(continuing.cando.replace(/\.$/, ""))}` : ""
    }.</p>
    ${continuing.pages.length ? `<p class="whatnow-q">Material already built:
      ${continuing.pages.map((v) => `<a class="lnk" href="${esc(v.file || "#")}">${esc(v.name)}</a>${
        v.built ? " <span class=\"muted\">(not taught yet)</span>" : ""
      }`).join(" · ")}</p>` : ""}`
    : verdict ? `<p class="whatnow-do">Run <code>${esc(verdict.cmd)}</code> — ${esc(verdict.why)}.
      ${verdict.opens}${
        // The unit in flight survives as ONE clause. It has not stopped being open; it has
        // stopped being what to do first, and a band that drops it entirely reads as if the
        // unit were finished.
        inFlight && (!verdict || verdict.cmd !== "lesson")
          ? ` <span class="muted">${esc(inFlight.id)} stays open underneath.</span>`
          : ""
      }</p>` : ""}
    ${target ? `
    <div class="pace" title="The week's mix decides the block: whichever side is further behind its share. docs/plan.md's pacing table owns the load — ${esc(target.load)}.">
      ${live("lesson") ? `<span class="pace-i ${week.lessons < target.lessons ? "under" : ""}">
        <b>${week.lessons}/${target.lessons}</b> lessons</span>` : ""}
      ${target.capN !== null && live(target.capLabel) ? `<span class="pace-i ${week.drills > target.capN ? "over" : ""}">
        <b>${week.drills}/${target.capN}</b> ${esc(target.capLabel)}s</span>` : ""}
      ${week.other ? `<span class="pace-i"><b>${week.other}</b> other</span>` : ""}
      <span class="pace-i muted">week of ${esc(week.from)}, ${week.left} ${week.left === 1 ? "day" : "days"} left</span>
    </div>` : ""}
    ${queueLine || inFlight || (nextOne && last) ? `
    <details class="fold" style="margin-top:11px"><summary>What is still open, and the arithmetic behind this</summary>
      ${inFlight ? `<p class="whatnow-q"><strong>${esc(inFlight.id)}</strong> —
        ${inFlight.total - inFlight.covered} of its ${inFlight.total} parts are still open:
        ${inFlight.asps.filter((a) => !/^covered/i.test(a.status)).map((a) => md(a.aspect)).join(" · ")}.</p>` : ""}
      ${continuing && verdict ? `<p class="whatnow-q">The week's mix would otherwise pick
        <code>${esc(verdict.cmd)}</code> — ${esc(verdict.why)}.</p>` : ""}
      ${queueLine ? `<p class="whatnow-q">${queueLine}</p>` : ""}
      ${nextOne && last ? `<p class="whatnow-next"><strong>${esc(last.id)} left:</strong> ${md(nextOne)}</p>` : ""}
    </details>` : ""}
  </div>` : ""}

  <div class="grid2" style="margin-top:14px">
    <div class="panel">
      <strong>Topic coverage</strong>
      <div class="note" style="margin-top:2px">Least-covered system first — that ordering is the point.</div>
      <div style="margin-top:12px">
        ${topicSections.length
          ? topicSections.map((t) => bar(t.s, t.done, t.total)).join("")
          : `<div class="note">No topic map yet — it is generated at setup and grows with the curriculum.</div>`}
      </div>
    </div>

    <div class="panel">
      <strong>Memory ladder</strong> —
        <a class="lnk" href="${linkTo("profile.html", "ladder")}">the full spread →</a>
      <div class="note" style="margin-top:2px">Where the ${all.length} tracked items sit. Tier 1 is shaky, tier 5 is cold storage.</div>
      <div class="tierbar">${tierBar}</div>
      <div class="legend">
        ${Object.keys(INT).map((t) => `<span><i class="seg-${t}" style="background:var(--t${t})"></i>tier ${t} · ${INT[t]}d</span>`).join("")}
      </div>
      ${scored.length ? `
      <div style="margin-top:22px"><strong>End-of-lesson test scores</strong></div>
      <div class="note" style="margin-top:2px">
        Each lesson ends with a short test on that day's new grammar.
        <strong>Landing inside the green band is the goal, not beating it</strong> — 60–70%
        means the material was pitched right. Consistently above 80% means it was too easy and
        the pace should go up; below 50% means slow down.
      </div>
      <div class="spark">
        ${scored.map((x) => `<div style="height:${Math.max(4, x.score)}%" title="${esc(x.id)} — ${esc(x.date)}"><span>${x.score}%</span></div>`).join("")}
      </div>
      <div class="spark-x">${scored.map((x) => `<div>${esc(x.date.slice(5))}</div>`).join("")}</div>
      <div class="spark-cap">
        One bar per lesson, oldest first; the newest is highlighted. Bars are
        <strong>percentages</strong>, not marks — a test of ten and a test of twenty-one are
        otherwise plotted as if they were the same scale. Only the grammar half is graded
        against the band. Drills, reviews and mocks have no end-of-lesson test, so they leave
        no bar — the gaps are not missed sessions.
      </div>` : ""}
    </div>
  </div>

  <div class="grid2" style="margin-top:14px">
    <div class="panel">
      <strong>Mistakes worth drilling</strong>
      <div class="note" style="margin-top:2px">
        Errors that recurred often enough to be logged, each counted against its
        <strong>root cause</strong> rather than how it showed up, and weighted by how many
        times it actually happened. Anything since re-tested clean drops off this list — it is
        what is still open, not everything that ever went wrong.
      </div>
      <div class="overflow" style="margin-top:12px">
        <table class="k">
          ${errs.rows.length ? errs.rows.map((e) => `<tr>
            <td><span class="ecode">${esc(e.code)}</span>${e.zone ? `<span class="ezone">${md(e.zone)}</span>` : ""}</td>
            <td>${e.n}×</td></tr>`).join("")
            : `<tr><td class="muted">nothing has recurred often enough to log yet</td><td></td></tr>`}
        </table>
      </div>
      ${errs.measured.length ? `<div class="note" style="margin-top:10px">
        <strong>Already re-tested:</strong>
        ${errs.measured.map((m) => `${esc(m.zone || m.code)} — ${m.n} earlier
          ${m.n === 1 ? "mistake" : "mistakes"} answered by a ${m.score}% retest on
          ${esc(m.date)}`).join("; ")}. Those stay in the record and are not counted above.
      </div>` : ""}
      ${errs.moved.length ? `<div class="note" style="margin-top:10px">
        Counted against the <em>cause</em>, not the symptom:
        ${errs.moved.map((m) => `${esc(m.from)} → ${esc(m.to)}`).join(", ")}. A written mistake
        that turns out to be a sound you don't yet make is one problem, not two.
      </div>` : ""}
    </div>

    <div class="panel">
      <strong>Recent sessions</strong>
      <div class="note" style="margin-top:2px">The last few study blocks and what each one was.</div>
      <div class="overflow" style="margin-top:12px">
        <table class="k">
          ${ses.length ? ses.slice(0, 6).map((s) => `<tr>
            <td><span class="ecode">${esc(s.date)}</span><span class="ezone">${md(s.type)}</span></td>
            <td>${s.score !== null ? esc(s.score) + "%" : "—"}</td></tr>`).join("")
            : `<tr><td class="muted">no sessions logged yet</td><td></td></tr>`}
        </table>
      </div>
    </div>
  </div>

  ${un.length ? `
  <h2>The ${un.length} units — what each one has given you</h2>
  <div class="note" style="margin-bottom:14px">
    <strong>Click any unit to open it.</strong> Two bars, and they measure different things:
    <strong>taught</strong> is how much of the unit's material has been delivered,
    <strong>retained</strong> is how much of it you currently hold. They come apart — a unit can
    be finished and still be shaky, which is the case the plain "covered" label could never show.
    Every study page ever built for you sits inside the unit it belongs to.
  </div>
  <div class="sortbar">
    <span class="lbl">order</span>
    <button type="button" class="sortb on" data-sort="unit">by unit</button>
    <button type="button" class="sortb" data-sort="weak">weakest first</button>
    <span class="grow"></span>
    <span class="key"><i class="sw ok"></i>solid <i class="sw no"></i>shaky</span>
  </div>
  <div id="${anchorOf("board")}">${board.map(unitRow).join("")}</div>` : `
  <h2>The units</h2>
  <div class="panel"><div class="note" style="margin-top:0">No curriculum yet — the unit board
  appears once <code>docs/curriculum.md</code> has its units. Setup generates it; the review
  playbook grows it.</div></div>`}

  <h2>Confidence</h2>
  ${conf.mode !== "enforced" ? `
  <div class="next" style="border-left-color:var(--bad); margin:0 0 14px">
    <strong>Unenforced mode.</strong> The contract tests are not running on this machine
    (node/git missing at setup), so every convention on this page rests on the agent's
    discipline alone — nothing below has been mechanically checked.
  </div>` : ""}
  <div class="panel">
    <table class="k">
      <tr><td>Contract tests (<code>npm test</code>)</td>
        <td>${conf.tests} test files · last run not recorded — run <code>npm test</code> for a verdict</td></tr>
      <tr><td>Enforcement</td><td>${esc(conf.mode)}</td></tr>
      <tr><td>Language facts</td><td>${factsCell()}</td></tr>
      <tr><td>Rule provenance (<code>docs/mechanics/</code>)</td>
        <td>${conf.prov.measured} measured · ${conf.prov.derived} derived ·
            ${conf.prov.defaults} defaults from the reference learner (recalibrate) ·
            ${conf.prov.assumed} marked assumed</td></tr>
      <tr><td>Language pack</td>
        <td>${esc(pack.code)} (${esc(pack.manifest.language || "?")}) · dictionary:
            ${conf.dict ? esc(conf.dict) : "none"}</td></tr>
    </table>
    <div class="note">How much to trust what this page claims — every line above is read
    from a record, or says plainly that none exists. ${
      conf.mode === "enforced"
        ? "Conventions here are checked by CI, not by promises."
        : "Unenforced mode: conventions rest on discipline alone."
    } Provenance counts are marker occurrences, not rules — an unmarked rule counts as
    assumed by <code>docs/mechanics/README.md</code>'s own convention.</div>
  </div>

  <details class="drawer">
    <summary>How the learning works — the shape of a session, and of the whole run</summary>
    <div class="panel howto" style="margin-top:12px">
      <p class="howto-src">The tables below are read straight out of the files that define
      these rules — the phase plan from the plan, the five parts from the session mechanic,
      the teaching beats from the teaching contract. They keep their working voice, file
      references and all, because a friendlier paraphrase here would be a second copy free to
      drift from the rules actually in force. Change a rule in its own file and this drawer
      changes with it.</p>

      <h4>1 · The run — ${un.length ? `${un.length} units, ` : ""}in phases</h4>
      <p>Every unit is a themed block of grammar and vocabulary. Phases group them and each
      ends with an assessment that gates the next one.
      ${phase ? `Right now you are in <strong>${md(phase)}</strong>${
        pacingRows.some((r) => phase.startsWith("Phase " + r[0]))
          ? " — highlighted below."
          : ", which comes before the teaching phases below: it is setup and calibration, not units."
      }` : ""}</p>
      ${pacingRows.length ? `<div class="overflow"><table class="k wide">
        <tr><th>Phase</th><th>Units</th><th>Weeks</th><th>Ends</th><th>Weekly load</th></tr>
        ${pacingRows.map((r) => `<tr class="${phase && phase.startsWith("Phase " + r[0]) ? "now" : ""}">
          ${r.map((c) => `<td>${md(c)}</td>`).join("")}</tr>`).join("")}
      </table></div>` : ""}

      <h4>2 · The week — which session type, how often</h4>
      <p>Lessons carry new material; drills keep the old material warm without adding any;
      the weekly review checks pace against the plan and changes the plan when reality
      disagrees with it. Those three carry an ordinary week. Everything else you can say —
      capture, writing, mocks, tutor prep, updates — is listed once, in
      <strong>Commands</strong> at the foot of this page.</p>

      <h4>3 · One lesson — five parts, in this order</h4>
      <p>The order is deliberate: the graded check comes <em>before</em> applied practice, so
      the check measures what the teaching alone landed, and practice becomes targeted repair
      of whatever it just missed.</p>
      <div class="overflow"><table class="k wide">
        <tr><th>#</th><th>Part</th><th>Time</th><th>What happens</th></tr>
        ${partRows.map((r) => `<tr>${r.map((c) => `<td>${md(c)}</td>`).join("")}</tr>`).join("")}
      </table></div>
      <p>What happens when a part scores badly depends on <em>which</em> part — a bad SRS
      review and a bad graded check mean opposite things:</p>
      <div class="overflow"><table class="k wide">
        <tr><th>Where it failed</th><th>What it means</th><th>What to do</th></tr>
        ${calibRows.map((r) => `<tr>${r.map((c) => `<td>${md(c)}</td>`).join("")}</tr>`).join("")}
      </table></div>
      <p class="howto-note">When something is genuinely broken, the fix is the
      <strong>repair loop</strong>: test → show the answers → work out <em>why</em> each miss
      happened → build the material that was missing → retest on new items covering the same
      ground. Up to three rounds. It is the shape the reference learner invented mid-session,
      where it took a score from 43% to 86% in one sitting (limba SES-007).</p>

      <h4>4 · One teaching block — ${beatRows.length} beats, every time</h4>
      <p>How the new-material half of a lesson is built. The rule behind the order: the whole
      system first, the contrast with the languages you already hold second — the opposite
      order is efficient only for someone who already holds the map.</p>
      <div class="overflow"><table class="k wide">
        <tr><th>#</th><th>Beat</th><th>What it does</th></tr>
        ${beatRows.map((r) => `<tr>${r.map((c) => `<td>${md(c)}</td>`).join("")}</tr>`).join("")}
      </table></div>

      <h4>Underneath all of it — the memory ladder</h4>
      <p>Every word and grammar pattern sits on the tier ladder shown above. Anything you
      recall cleanly moves up a rung and comes back later; anything you miss drops one and
      comes back sooner. Each rung asks a harder question than the one below it: tier 1 only
      asks what a ${esc(T)} word means, tier 2 asks you to produce the bare word from
      ${esc(M)}, and tier 3 asks the full package — every form and fact the ledger row
      carries — which is the goal-shaped question and the gate into "owned". Tiers 4 and 5
      are a fast recognition sweep that keeps it warm. Nothing is ever retired.</p>

    </div>
  </details>

  <details class="drawer">
    <summary>Commands — what to say to start a session</summary>
    <div class="panel" style="margin-top:12px">
      ${focus !== "full" ? `<div class="note" style="margin-top:0">This workspace is
        <strong>${esc(focus)}</strong>-focused, so this is the whole list — the other verbs are
        switched off and will say so if you try them. Say <code>review</code> to widen it.</div>` : ""}
      <dl class="cmd">
        ${verbs.map((s) => `<dt><code>${esc(s.name)}</code></dt><dd>${esc(s.desc)}</dd>`).join("")}
      </dl>
      ${shell.length ? `<div style="margin-top:20px"><strong style="font-size:14px">In the terminal</strong></div>
      <dl class="cmd" style="margin-top:8px">
        ${shell.map((s) => `<dt><code>${esc(s.cmd)}</code></dt><dd>${esc(s.desc)}</dd>`).join("")}
      </dl>` : ""}
    </div>
  </details>

</div>
<script>
${OPEN_TARGET_JS}

  /* Reordering, not filtering — every unit stays on the page in both orders. "Weakest
     first" ranks by the retained bar, so the units carrying the most shaky material lead;
     units with nothing measurable yet trail, because they are not doing badly, they are
     simply not yet answerable. Sorted once up front and re-appended, so neither order can
     drift as the other is used. */
  (function () {
    var board = document.getElementById("board");
    if (!board) return;
    var byUnit = [].slice.call(board.children);
    var byWeak = byUnit.slice().sort(function (a, b) {
      return Number(a.getAttribute("data-weak")) - Number(b.getAttribute("data-weak"));
    });
    var btns = [].slice.call(document.querySelectorAll(".sortb"));
    btns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        btns.forEach(function (b) { b.classList.remove("on"); });
        btn.classList.add("on");
        (btn.getAttribute("data-sort") === "weak" ? byWeak : byUnit).forEach(function (el) {
          board.appendChild(el);
        });
      });
    });
  })();

</script>
</body>
</html>
`;

writeFileSync(join(root, OUT), html);
console.log(
  `hub → ${OUT}  (${vis.length} visuals · ${all.length} items · ` +
    `${unseen.length} unseen of ${due.length} due · ` +
    `${unCovered}/${un.length} units · ${tpCovered}/${tp.length} aspects` +
    (daysToGoal !== null ? ` · ${daysToGoal}d to ${goalKind})` : ")"),
);
/** A section missing from the page AND from this line is the bug — see `when()`. */
const gone = skipped();
if (gone.length) console.log(`  sections skipped (no record yet): ${gone.join(", ")}`);

// --stripped <path>: same page without the <!doctype>/<html>/<head>/<body> wrapper, which
// is what an artifact-publishing platform expects. Capability-gated on the profile's
// `publishing:` — local files are the base case; the repo file above stays standalone and
// offline-openable. This copy is scratch, never committed.
const si = process.argv.indexOf("--stripped");
if (si !== -1 && process.argv[si + 1]) {
  const body = /<body>([\s\S]*)<\/body>/.exec(html)[1];
  const style = /<style>[\s\S]*?<\/style>/.exec(html)[0];
  writeFileSync(process.argv[si + 1], `<title>${esc(T)} — hub</title>\n${style}\n${body}\n`);
  console.log(`stripped copy → ${process.argv[si + 1]}`);
}
