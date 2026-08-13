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
 * Run at close-out (docs/mechanics/session_format.md). Read-only except for its one
 * output. Zero dependencies.
 */
import { readFileSync, readdirSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { loadProfile } from "./profile.mjs";
import { loadPack } from "./pack.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (rel) => readFileSync(join(root, rel), "utf8");
const readMaybe = (rel) => (existsSync(join(root, rel)) ? read(rel) : null);
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

/* ------------------------------------------------------------------ helpers */

/** Markdown table rows with exactly `n` cells, header and separator dropped.
 *
 *  A header is identified structurally — it is the row immediately followed by the
 *  `|---|---|` separator — not by matching its first cell against a list of known
 *  column names. The list version silently emitted "Where it failed | What it means"
 *  as a data row the first time a table used unlisted headers, which is exactly the
 *  failure mode a hardcoded list guarantees eventually (limba). */
function rows(text, n) {
  const out = [];
  let pending = null; // last candidate row, held until we know if a separator follows
  const flush = () => { if (pending) out.push(pending); pending = null; };

  for (const line of text.split("\n")) {
    const t = line.trim();
    if (!t.startsWith("|") || !t.endsWith("|")) { flush(); continue; }
    const cells = t.slice(1, -1).split("|").map((c) => c.trim());
    if (cells.every((c) => /^:?-{2,}:?$/.test(c))) { pending = null; continue; } // header above
    if (cells.length !== n) { flush(); continue; }
    flush();
    pending = cells;
  }
  flush();
  return out;
}

/** Body of one `##`/`###` section, up to the next heading at the same level or above.
 *  Lets a table be read from the file that owns it without matching lookalike tables. */
function section(text, headingRe) {
  const lines = text.split("\n");
  let start = -1, level = 0;
  for (let i = 0; i < lines.length; i++) {
    const m = /^(#{2,4})\s+(.+)$/.exec(lines[i]);
    if (!m) continue;
    if (start === -1) {
      if (headingRe.test(m[2])) { start = i + 1; level = m[1].length; }
      continue;
    }
    if (m[1].length <= level) return lines.slice(start, i).join("\n");
  }
  return start === -1 ? "" : lines.slice(start).join("\n");
}

/* esc + md live in ./inline-md.mjs — extracted (limba, 2026-08-12) so they have a test. */

const todayISO = () => {
  const n = new Date();
  const p = (x) => String(x).padStart(2, "0");
  return `${n.getFullYear()}-${p(n.getMonth() + 1)}-${p(n.getDate())}`;
};

const daysBetween = (aISO, bISO) => {
  const u = (s) => {
    const [y, m, d] = s.split("-").map(Number);
    return Date.UTC(y, m - 1, d);
  };
  return Math.round((u(bISO) - u(aISO)) / 86_400_000);
};

/* ------------------------------------------------------------------ parsers */

/** Interval table from srs.md — canonical. Never re-declare these numbers here. */
function intervals() {
  const map = {};
  for (const c of rows(read("docs/mechanics/srs.md"), 4)) {
    const tier = Number(c[0]);
    const days = /(\d+)\s*days?/.exec(c[2]);
    if (Number.isInteger(tier) && days) map[tier] = Number(days[1]);
  }
  if (!Object.keys(map).length) throw new Error("hub: could not read the tier table from srs.md");
  return map;
}

/**
 * What a review costs and how long there is for it — all of it from srs.md, which owns them.
 *
 * The ladder charges a different rate per rung: tier 1 is recognition, tier 2 is bare
 * production, tier 3 is the full package, tiers 4–5 sweep. On top of the per-item rates
 * there is a fixed cost **per block** — composing the set, leakcheck, the learner reading
 * and typing, marking, publishing the sheet, the grouped diagnosis. The per-item-only
 * model this replaced under-predicted a real drill by ~5× (limba, 2026-08-12).
 *
 * All five numbers are read from the prose that states them, and this throws rather than
 * guessing: a silently-wrong estimate is printed on the learner's own bookmark.
 */
function pace() {
  const src = read("docs/mechanics/srs.md").replace(/\s+/g, " ");
  const grab = (re, what) => {
    const m = re.exec(src);
    if (!m) {
      throw new Error(
        `hub: could not read ${what} from srs.md — the "What a review block costs" cost-model ` +
          `paragraph must still state it in the shape this regex expects: ${re}`,
      );
    }
    return Number(m[1]);
  };
  return {
    recognise: grab(/recognition ~(\d+) s per item/, "the recognition rate"),
    bare: grab(/bare production ~(\d+) s per item/, "the bare-production rate"),
    full: grab(/the full package ~(\d+) s per item/, "the full-package rate"),
    perBlock: grab(/~(\d+) minutes fixed per block/, "the per-block fixed cost"),
    box: grab(/review block (\d+) minutes/, "the review box"),
  };
}

/** The 8-cell count is a silent contract (limba widened it once and documented why): a
 *  wrong count matches nothing and renders a hub reporting zero tracked items with no
 *  error. Empty IS legal here — a fresh instance has ledgers with only their header — so
 *  the guard is the header shape, not the row count. */
function ledger(rel) {
  const text = read(rel);
  const out = rows(text, 8).map((c) => ({
    id: c[0], target: c[1], en: c[2], tier: Number(c[3]), added: c[4], last: c[5],
    topic: c[6], notes: c[7],
  }));
  if (!out.length && !/^\|\s*id\s*\|/m.test(text)) {
    throw new Error(`hub: ${rel} has neither data rows nor the schema header — the ledger shape changed.`);
  }
  return out;
}

/** `Units` is space-separated so one page can belong to every unit it touches, and `Kind`
 *  is declared rather than guessed (limba, 2026-08-09). Empty is legal — a fresh instance
 *  has built no pages yet. */
function visuals() {
  const text = readMaybe("work/visuals/README.md");
  if (!text) return [];
  return rows(text, 5).map((c) => {
    const file = /\(([^)]+\.(?:html|svg))\)/.exec(c[1]);
    const name = /\[([^\]]+)\]/.exec(c[1]);
    return {
      date: c[0],
      name: name ? name[1] : c[1],
      file: file ? file[1] : null,
      teaches: c[2],
      units: c[3].split(/\s+/).filter(Boolean),
      kind: c[4],
      superseded: /superseded/i.test(c[2]),
    };
  });
}

function topics() {
  const text = readMaybe("docs/reference/topics.md");
  if (!text) return [];
  const out = [];
  let sectionName = "—";
  for (const line of text.split("\n")) {
    const h = /^## (.+)$/.exec(line.trim());
    if (h) { sectionName = h[1]; continue; }
    const t = line.trim();
    if (!t.startsWith("|") || !t.endsWith("|")) continue;
    const c = t.slice(1, -1).split("|").map((x) => x.trim());
    if (c.length !== 5 || /^-{2,}$/.test(c[0]) || c[0] === "ID") continue;
    out.push({ section: sectionName, id: c[0], aspect: c[1], unit: c[2], exam: c[3], status: c[4] });
  }
  return out;
}

function units() {
  const text = readMaybe("docs/curriculum.md");
  if (!text) return [];
  const lines = text.split("\n");
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const h = /^## (U\d+)\s+—\s+(.+)$/.exec(lines[i]);
    if (!h) continue;
    const s = /^status:\s*(.+)$/.exec((lines[i + 1] || "").trim());
    out.push({ id: h[1], title: h[2], status: s ? s[1] : "pending" });
  }
  return out;
}

function sessions() {
  const text = readMaybe("docs/logs/session_log.md");
  if (!text) return [];
  const parts = text.split(/^## /m).slice(1);
  return parts.map((block) => {
    const head = /^(\d{4}-\d{2}-\d{2}) — (SES-\d+)/.exec(block);
    if (!head) return null;
    const type = /\*\*Type\.\*\*\s*([^.—\n]+)/.exec(block);
    // MUST be anchored to the words "graded check". A bare /\d+\/10/ also matches
    // drill item counts — in limba it once plotted a drill count as a graded score
    // for a session that had no graded check at all. A dashboard that invents a
    // data point is worse than one that omits it.
    const score = /graded check[^\n]{0,40}?(\d+(?:\.\d+)?)\s*\/\s*10/i.exec(block);
    const next = /\*\*Next\.\*\*\s*([\s\S]*?)(?:\n\n|$)/.exec(block);
    return {
      date: head[1], id: head[2],
      type: type ? type[1].trim() : "—",
      score: score ? Number(score[1]) : null,
      next: next ? next[1].replace(/\s+/g, " ").trim() : null,
    };
  }).filter(Boolean);
}

/** The ROOT tally, from scripts/tally.mjs — the same list the drill playbook acts on.
 *  Imported rather than recomputed: a dashboard showing a different ranking from the one
 *  driving practice is worse than no dashboard. */
function errorTally() {
  const { live: counts, root, surface, moved, measured, banked } = tally();
  const z = zones();
  return {
    rows: counts.map(([code, n]) => ({ code, n, zone: z[code] || "" })),
    moved,
    differs: JSON.stringify(counts) !== JSON.stringify(surface),
    // What a later clean measurement has answered — shown, not hidden, so the learner can see
    // why a zone they remember failing is missing from the list.
    measured: measured.map((m) => ({
      ...m,
      n: banked.filter((b) => b.code === m.code).reduce((a, b) => a + b.n, 0),
      zone: z[m.code] || "",
    })),
    allTime: root,
  };
}

function currentPhase() {
  const text = readMaybe("docs/plan.md");
  if (!text) return null;
  const m = /^## (Phase \d+ — [^\n(]+?)\s*\(current\)/m.exec(text);
  return m ? m[1].trim() : null;
}

/* The learning design, read from the files that define it — the parts from
   session_format.md, the beats from teaching.md, the phase plan from plan.md.
   Retyping any of it here would make the hub another place these rules live. */
/** A heading rename must break loudly. In limba, renaming a beats heading silently
 *  emptied this table once — the page still rendered, just with nothing in it,
 *  which is the worst failure mode a generated dashboard has. */
function must(label, list) {
  if (!list.length) {
    throw new Error(
      `hub: parsed 0 rows for "${label}" — a heading or table shape changed. ` +
        `Fix the pattern in scripts/hub.mjs rather than shipping an empty section.`,
    );
  }
  return list;
}

const lessonParts = () =>
  must("the five parts", rows(section(read("docs/mechanics/session_format.md"), /^The five parts/), 4));
const teachingBeats = () =>
  must("the beats", rows(section(read("docs/mechanics/teaching.md"), /beats — in order/), 3));
/** The pacing table is instance content inside plan.md — absent is legal (a no-deadline
 *  instance may plan without one), so this one degrades instead of throwing. */
const pacing = () => {
  const text = readMaybe("docs/plan.md");
  return text ? rows(section(text, /^Pacing table/), 5) : [];
};
const calibration = () =>
  must("difficulty calibration", rows(section(read("docs/mechanics/session_format.md"), /^Difficulty calibration/), 3));

/** The verb list, from playbooks/*.md frontmatter (`verb:` + `summary:`) — the
 *  agent-neutral home of what limba kept in .claude/skills/. The shell command list
 *  comes from AGENTS.md's ## Commands block, when it has one. */
function commands() {
  const dir = join(root, "playbooks");
  const verbs = existsSync(dir)
    ? readdirSync(dir).filter((f) => f.endsWith(".md")).map((f) => {
        const fm = readFileSync(join(dir, f), "utf8");
        const verb = /^verb:\s*(.+)$/m.exec(fm);
        const summary = /^summary:\s*(.+)$/m.exec(fm);
        // The summary's first clause is the useful half; the rest is trigger phrasing.
        const short = summary ? summary[1].split(/\.\s|\s-\s/)[0].trim() : "";
        return verb ? { name: verb[1].trim(), desc: short } : null;
      }).filter(Boolean)
    : [];
  verbs.sort((a, b) => a.name.localeCompare(b.name));

  const agentsMd = readMaybe("AGENTS.md") || "";
  const block = /## Commands\s*```([\s\S]*?)```/.exec(agentsMd);
  const shell = block
    ? block[1].split("\n").map((l) => l.trim()).filter(Boolean).map((l) => {
        const i = l.indexOf("#");
        return i > 0 ? { cmd: l.slice(0, i).trim(), desc: l.slice(i + 1).trim() } : { cmd: l, desc: "" };
      })
    : [];
  return { verbs, shell };
}

/* --------------------------------------------------------------- assembling */

const today = todayISO();
const INT = intervals();
const vocab = ledger("state/vocab.md");
const grammar = ledger("state/grammar.md");
const all = [...vocab, ...grammar];
const due = all.filter((r) => INT[r.tier] !== undefined && daysBetween(r.last, today) >= INT[r.tier]);
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
/** ~10 items is one round trip in chat — the unit the per-block fixed cost is charged against. */
const BLOCK_ITEMS = 10;
const queue = {
  recognise: due.filter((r) => r.tier === 1 || r.tier >= 4).length,
  bare: due.filter((r) => r.tier === 2).length,
  full: due.filter((r) => r.tier === 3).length,
  box: PACE.box,
};
queue.produce = queue.bare + queue.full;
queue.items = queue.recognise + queue.bare + queue.full;
queue.blocks = Math.ceil(queue.items / BLOCK_ITEMS);
queue.minutes =
  (queue.recognise * PACE.recognise + queue.bare * PACE.bare + queue.full * PACE.full) / 60 +
  queue.blocks * PACE.perBlock;
queue.over = queue.minutes > queue.box;

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
              ? `<b>past</b> the ${queue.box}′ a lesson gives review — a drill takes the whole hour`
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
const nextUnit = un.find((u) => !/^covered/i.test(u.status));
const ses = sessions();
const scored = ses.filter((s) => s.score !== null).slice(0, 8).reverse();
const errs = errorTally();
const goalDate = profile.get("goal_date", null);
const daysToGoal = goalDate ? daysBetween(today, goalDate) : null;
/** No deadline ⇒ no countdown or pace UI. What IS computable there: volume and recency. */
const last7 = ses.filter((s) => daysBetween(s.date, today) < 7).length;
const phase = currentPhase();
const vis = visuals();
const { verbs, shell } = commands();
const pacingRows = pacing();
const partRows = lessonParts();
const beatRows = teachingBeats();
const calibRows = calibration();
const last = ses[0];

const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);

/* ---------------------------------------------------------------- rendering */

const tile = (value, label, sub = "", state = "", extra = "") => `
      <div class="tile${state ? " " + state : ""}">
        <div class="tile-v">${esc(value)}</div>
        <div class="tile-l">${esc(label)}</div>
        ${sub ? `<div class="tile-s">${md(sub)}</div>` : ""}
        ${extra}
      </div>`;

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
              <span class="pill ${kindOf(v)}">${kindOf(v)}</span>
            </span>
          </div>
          <p class="teaches">${md(v.teaches)}</p>
          <div class="card-foot">
            <time>${esc(v.date)}</time>
          </div>
        </article>`;

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
  return {
    ...u,
    asps,
    covered: dates.length,
    first: dates[0] || null,
    last: dates[dates.length - 1] || null,
    live,
    solid: live.filter((i) => i.tier >= 3).length,
    shaky: live.filter((i) => i.tier <= 2),
    seeded: items.filter((i) => i.tier === 0).length,
    pages: vis
      .filter((v) => v.units.includes(u.id))
      .sort((a, b) => a.date.localeCompare(b.date)),
  };
});

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

const unitRow = (b) => {
  const r = b.live.length ? pct(b.solid, b.live.length) : null;
  const shaky = b.shaky.slice(0, SHOW_SHAKY);
  const rest = b.shaky.length - shaky.length;
  const span = b.first ? (b.first === b.last ? b.first : `${b.first} → ${b.last}`) : null;
  return `
      <details class="unit" data-weak="${weakKey(b)}"${b.covered && b.covered < b.asps.length ? " open" : ""}>
        <summary class="ustrip">
          <div class="uhead">
            <span class="uid">${esc(b.id)}</span>
            <span class="utitle">${esc(b.title.replace(/\s*\([^)]*\)\s*$/, ""))}</span>
            <span class="upill">${b.covered === b.asps.length && b.asps.length ? "taught in full" : b.covered ? "part-taught" : "not opened"}</span>
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
              ${b.asps.length ? b.asps.map(aspectLine).join("") : `<div class="note">No aspects assigned yet in the topic map.</div>`}
              ${span ? `<div class="note" style="margin-top:8px">Taught ${esc(span)}.</div>` : ""}
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
<title>${esc(T)} — hub</title>
<style>
  /* Tokens are the workspace's — the hub is part of the same set of pages, not a separate
     product. --ok/--bad/--hi are semantic state and stay independent of --l2/--l1, which
     mean "the target language" and "the support-language anchor". */
  :root {
    --bg:#faf9f7; --fg:#1c1a17; --muted:#6b645c; --line:#ddd7cf; --card:#fff;
    --ok:#1a7a4c; --bad:#b3261e; --hi:#8a5a00; --hiBg:#fff6e0;
    --l1:#0a58ca; --l2:#a3391c; --new:#7a1fa2; --newBg:#f6ecfb;
    --solid:#7ba05b; --shaky:#dfa63c;
    /* The ladder runs at-risk → secure. That axis is the information, not decoration. */
    --t1:#b3261e; --t2:#cc6a1a; --t3:#a8891b; --t4:#5d8a3f; --t5:#1a7a4c;
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --bg:#16151a; --fg:#eceaf0; --muted:#a09aa8; --line:#33303a; --card:#1e1d24;
      --ok:#4ad48c; --bad:#ff8a80; --hi:#ffc76b; --hiBg:#2b2413;
      --l1:#7fb0ff; --l2:#ff9d7a; --new:#d9a6f5; --newBg:#2a1d33;
      --solid:#6fae67; --shaky:#d9a441;
      --t1:#ff8a80; --t2:#ffab6b; --t3:#ffc76b; --t4:#a9d98a; --t5:#4ad48c;
    }
  }
  /* The viewer's toggle stamps data-theme on :root and must win over the media query
     in BOTH directions — hence the explicit light block too. */
  :root[data-theme="dark"] {
    --bg:#16151a; --fg:#eceaf0; --muted:#a09aa8; --line:#33303a; --card:#1e1d24;
    --ok:#4ad48c; --bad:#ff8a80; --hi:#ffc76b; --hiBg:#2b2413;
    --l1:#7fb0ff; --l2:#ff9d7a; --new:#d9a6f5; --newBg:#2a1d33;
    --solid:#6fae67; --shaky:#d9a441;
    --t1:#ff8a80; --t2:#ffab6b; --t3:#ffc76b; --t4:#a9d98a; --t5:#4ad48c;
  }
  :root[data-theme="light"] {
    --bg:#faf9f7; --fg:#1c1a17; --muted:#6b645c; --line:#ddd7cf; --card:#fff;
    --ok:#1a7a4c; --bad:#b3261e; --hi:#8a5a00; --hiBg:#fff6e0;
    --l1:#0a58ca; --l2:#a3391c; --new:#7a1fa2; --newBg:#f6ecfb;
    --solid:#7ba05b; --shaky:#dfa63c;
    --t1:#b3261e; --t2:#cc6a1a; --t3:#a8891b; --t4:#5d8a3f; --t5:#1a7a4c;
  }
  * { box-sizing:border-box; }
  body {
    margin:0; background:var(--bg); color:var(--fg);
    font:16px/1.6 ui-sans-serif,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
    -webkit-text-size-adjust:100%;
  }
  a:focus-visible, .lnk:focus-visible { outline:2px solid var(--l2); outline-offset:3px; border-radius:3px; }
  .wrap { max-width:1080px; margin:0 auto; padding:28px 20px 72px; }
  header.top { display:flex; flex-wrap:wrap; align-items:baseline; gap:12px; margin-bottom:6px; }
  header.top h1 { font-size:26px; margin:0; letter-spacing:-.01em; }
  header.top .sub { color:var(--muted); font-size:14px; }
  .stamp { color:var(--muted); font-size:13px; margin-bottom:26px; }
  h2 { font-size:13px; text-transform:uppercase; letter-spacing:.09em; color:var(--muted);
       margin:34px 0 12px; font-weight:600; }
  .panel { background:var(--card); border:1px solid var(--line); border-radius:12px; padding:18px; }
  .tiles { display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:12px; }
  .tile { background:var(--card); border:1px solid var(--line); border-radius:12px; padding:14px 16px; }
  .tile-v { font-size:26px; font-weight:650; letter-spacing:-.02em; font-variant-numeric:tabular-nums; }
  .tile-l { font-size:12px; text-transform:uppercase; letter-spacing:.06em; color:var(--muted); margin-top:2px; }
  .tile-s { font-size:13px; color:var(--muted); margin-top:6px; }
  /* The queue against its box. The tick is the threshold that decides lesson vs drill, so
     it is drawn on the same axis as the fill — a number alone cannot be compared to it. */
  .qm { margin-top:9px; }
  .qm-track { position:relative; height:6px; background:var(--line); border-radius:99px; }
  .qm-fill { height:6px; background:var(--ok); border-radius:99px; }
  .qm-fill.over { background:var(--hi); }
  /* The tick has to stay legible ON TOP of the fill — that is the whole case where it
     matters — so it carries a halo in the tile's own background rather than an opacity. */
  .qm-mark { position:absolute; top:-4px; width:2px; height:14px; background:var(--fg);
             border-radius:2px; box-shadow:0 0 0 1.5px var(--card); }
  .qm-cap { font-size:12px; color:var(--muted); margin-top:5px; }
  /* State reads before the number does. */
  .tile.attention { border-color:var(--hi); background:var(--hiBg); }
  .tile.attention .tile-v { color:var(--hi); }
  .tile.clear .tile-v { color:var(--ok); }
  .grid2 { display:grid; grid-template-columns:repeat(auto-fit,minmax(320px,1fr)); gap:14px; }
  .bar-row + .bar-row { margin-top:11px; }
  .bar-head { display:flex; justify-content:space-between; font-size:13.5px; margin-bottom:4px; gap:10px; }
  .bar-head span:last-child { font-variant-numeric:tabular-nums; }
  .bar { height:8px; background:var(--line); border-radius:99px; overflow:hidden; display:flex;
         gap:2px; }
  .bar-fill { height:100%; background:var(--l2); border-radius:99px; }
  /* Retained is one bar carrying two facts, so the two halves have to separate at a glance.
     --ok and --bad are TEXT colours: side by side as fills, two dark saturated blocks of
     equal weight fight each other and the boundary disappears (limba learner, 2026-08-10).
     These are fills — lighter, less saturated, and split by hue AND lightness. Shaky is
     amber, not red: tier 1–2 is work outstanding, not a failure, and green-against-amber
     survives colour-blindness where green-against-red does not. The 2px gap is the seam. */
  .bar-fill.ok { background:var(--solid); border-radius:99px 0 0 99px; }
  .bar-fill.no { background:var(--shaky); border-radius:0 99px 99px 0; }
  /* Delivery is not a state to feel anything about, so the taught bar is deliberately
     neutral. Left at the default --l2 it read as a full alarm bar next to the green
     of the retained one — the opposite of what "15 of 15 taught" means. */
  .bar-fill.tt { background:var(--muted); }
  .bar.none { background:transparent; border:1px dashed var(--line); }
  .lbl { font-size:11.5px; text-transform:uppercase; letter-spacing:.07em; color:var(--muted); }
  /* The percentage is text, so it keeps the darker text tokens — but it follows the bar's
     reading: below half is attention, not alarm. */
  .r-solid { color:var(--ok); } .r-shaky { color:var(--hi); }
  /* Untouched ≠ barely started. A dashed track says "not begun", not "0% done". */
  .bar-row.untouched .bar { background:transparent; border:1px dashed var(--line); height:7px; }
  .bar-row.untouched .bar-head { color:var(--muted); }
  .muted { color:var(--muted); }
  .tierbar { display:flex; height:26px; border-radius:8px; overflow:hidden; margin-top:4px; }
  .seg { display:flex; align-items:center; justify-content:center; font-size:12px; color:#fff; min-width:22px; }
  .seg-1{background:var(--t1)} .seg-2{background:var(--t2)} .seg-3{background:var(--t3)}
  .seg-4{background:var(--t4)} .seg-5{background:var(--t5)}
  .legend { display:flex; flex-wrap:wrap; gap:12px; margin-top:9px; font-size:12.5px; color:var(--muted); }
  .legend i { display:inline-block; width:9px; height:9px; border-radius:2px; margin-right:5px; }
  /* The band is the 60–70% calibration target from session_format.md — the bars are only
     readable against it, so it is drawn, not captioned. */
  .spark { display:flex; align-items:flex-end; gap:7px; height:86px; margin-top:22px;
           position:relative; }
  /* Band = the 60–70% calibration target. Fill sits behind the bars; the ceiling line is
     drawn IN FRONT, or a bar that clears the target hides the very reference it beat. */
  .spark::before { content:""; position:absolute; left:0; right:0; bottom:60%; height:10%;
                   background:var(--ok); opacity:.12; pointer-events:none; z-index:0; }
  .spark::after { content:""; position:absolute; left:0; right:0; bottom:70%; height:0;
                  border-top:1px dashed var(--ok); opacity:.55; pointer-events:none; z-index:3; }
  .spark div { flex:1; background:var(--l2); border-radius:4px 4px 0 0; min-height:3px;
               position:relative; opacity:.5; z-index:1; }
  .spark div:last-child { opacity:1; }
  .spark-cap { font-size:11.5px; color:var(--muted); margin-top:8px; }
  .spark span { position:absolute; top:-17px; left:0; right:0; text-align:center;
                font-size:11px; color:var(--muted); font-variant-numeric:tabular-nums; }
  .spark-x { display:flex; gap:7px; font-size:11px; color:var(--muted); margin-top:5px; }
  .spark-x div { flex:1; text-align:center; }
  table.k { width:100%; border-collapse:collapse; font-size:14px; }
  table.k td { padding:5px 0; border-bottom:1px solid var(--line); }
  table.k tr:last-child td { border-bottom:0; }
  table.k td:last-child { text-align:right; color:var(--muted); font-variant-numeric:tabular-nums; }
  code { background:var(--hiBg); color:var(--hi); padding:1px 5px; border-radius:4px;
         font:13px/1.4 ui-monospace,SFMono-Regular,Menlo,monospace; }
  time { font-variant-numeric:tabular-nums; }
  .cmd { display:grid; grid-template-columns:minmax(120px,auto) 1fr; gap:8px 16px; font-size:14px; }
  .cmd dt code { white-space:nowrap; }
  .cmd dd { margin:0; color:var(--muted); }
  .cards { display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:14px; }
  .card { background:var(--card); border:1px solid var(--line); border-radius:12px;
          padding:15px 16px; display:flex; flex-direction:column; position:relative; }
  .card:hover { border-color:var(--l2); }
  /* Superseded pages are dimmed AND labelled. Opacity alone is a signal nobody can read. */
  .card.superseded { opacity:.62; }
  .card.superseded:hover { opacity:1; }
  /* Stretched link: the whole card is the target. */
  .card-link { color:inherit; text-decoration:none; }
  .card-link::after { content:""; position:absolute; inset:0; border-radius:12px; z-index:1; }
  .card-link:focus-visible::after { outline:2px solid var(--l2); outline-offset:2px; }
  .card-top { display:flex; justify-content:space-between; align-items:flex-start; gap:10px; }
  .card-top h3 { margin:0; font-size:16px; }
  .pills { display:flex; gap:6px; flex-wrap:wrap; justify-content:flex-end; }
  .pill { font-size:11px; color:var(--muted); border:1px solid var(--line);
          border-radius:99px; padding:2px 9px; white-space:nowrap; }
  .pill.old { color:var(--hi); border-color:var(--hi); background:var(--hiBg); }
  .teaches { font-size:13.5px; color:var(--muted); margin:9px 0 14px; flex:1; }
  .card-foot { display:flex; justify-content:space-between; align-items:center;
               font-size:12.5px; color:var(--muted); gap:10px; flex-wrap:wrap; }
  .links { display:flex; gap:10px; align-items:center; }
  .lnk { color:var(--l2); text-decoration:none; font-weight:550; }
  .lnk:hover { text-decoration:underline; }
  .lnk.dim { color:var(--muted); font-weight:400; cursor:help; }
  .note { font-size:13px; color:var(--muted); margin-top:10px; }
  /* The one thing the page is for: what to do when you open it. */
  /* The deck is the only page here the learner opens on their own initiative, so it gets a
     gateway of its own rather than a line of prose inside another panel. */
  .deck { display:grid; grid-template-columns:auto 1fr; gap:0 20px; align-items:center;
          background:var(--card); border:1px solid var(--line); border-radius:12px;
          padding:16px 18px; margin-top:14px; text-decoration:none; color:inherit; }
  .deck:hover { border-color:var(--l2); }
  .deck-n { font-size:34px; font-weight:650; letter-spacing:-.02em; line-height:1.05;
            font-variant-numeric:tabular-nums; text-align:center; }
  .deck-nl { font-size:11px; text-transform:uppercase; letter-spacing:.07em;
             color:var(--muted); text-align:center; margin-top:3px; }
  .deck-h { font-size:17px; font-weight:650; }
  .deck-h b { color:var(--l2); font-weight:650; }
  .deck-s { font-size:13.5px; color:var(--muted); margin-top:3px; }
  .deck-foot { font-size:12.5px; color:var(--muted); margin-top:6px; }
  .whatnow { background:var(--card); border:1px solid var(--line); border-left:3px solid var(--l2);
             border-radius:4px 12px 12px 4px; padding:15px 18px; margin-top:14px; }
  .whatnow-h { font-size:12px; text-transform:uppercase; letter-spacing:.08em;
               color:var(--l2); font-weight:650; margin-bottom:6px; }
  .whatnow p { margin:0; font-size:14.5px; }
  .whatnow p + p { margin-top:9px; }
  .whatnow-next { color:var(--muted); font-size:13.5px; }
  .ecode { display:block; font:12px/1.4 ui-monospace,SFMono-Regular,Menlo,monospace;
           color:var(--muted); letter-spacing:.02em; }
  .ezone { display:block; font-size:14px; color:var(--fg); }
  .pill.practice { color:var(--new); border-color:var(--new); background:var(--newBg); }
  .pill.repair { color:var(--bad); border-color:var(--bad); }

  /* ---- the unit board ---- */
  .sortbar { display:flex; align-items:center; gap:8px; margin-bottom:12px; flex-wrap:wrap; }
  .grow { flex:1; }
  .sortb { font:inherit; font-size:12.5px; padding:3px 11px; border-radius:99px; cursor:pointer;
           background:transparent; color:var(--muted); border:1px solid var(--line); }
  .sortb:hover { color:var(--fg); border-color:var(--muted); }
  .sortb.on { color:var(--l2); border-color:var(--l2); }
  .sortb:focus-visible { outline:2px solid var(--l2); outline-offset:2px; }
  .key { font-size:12px; color:var(--muted); display:flex; align-items:center; gap:6px; }
  /* One swatch class for one concept: the board legend and the per-unit counts read the
     same bar, so they carry the same two fills — not the text tokens. */
  .sw { display:inline-block; width:14px; height:6px; border-radius:99px; margin-right:4px; }
  .sw.ok { background:var(--solid); } .sw.no { background:var(--shaky); }
  .unit { background:var(--card); border:1px solid var(--line); border-radius:12px; margin-bottom:9px; }
  .unit[open] { border-color:var(--muted); }
  .ustrip { cursor:pointer; padding:13px 15px; list-style:none; display:block; }
  .ustrip::-webkit-details-marker { display:none; }
  .ustrip:focus-visible { outline:2px solid var(--l2); outline-offset:2px; border-radius:12px; }
  .uhead { display:flex; align-items:baseline; gap:10px; flex-wrap:wrap; }
  .uid { font:13px/1.4 ui-monospace,SFMono-Regular,Menlo,monospace; color:var(--muted); }
  .utitle { font-size:15.5px; }
  .upill { margin-left:auto; font-size:11.5px; color:var(--muted); border:1px solid var(--line);
           border-radius:99px; padding:2px 9px; white-space:nowrap; }
  /* The chevron is the only affordance saying a row opens — details' native marker is off. */
  .uhead::after { content:"›"; color:var(--muted); font-size:17px; line-height:1;
                  transform:rotate(90deg); transition:transform .15s; }
  .unit[open] .uhead::after { transform:rotate(270deg); }
  .ubars { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-top:10px; }
  .ubars .bar-head { font-size:12.5px; }
  .upanel { padding:0 15px 15px; }
  .ucols { display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:18px;
           border-top:1px solid var(--line); padding-top:13px; }
  .upanel h4 { font-size:12px; text-transform:uppercase; letter-spacing:.07em; color:var(--muted);
               margin:0 0 8px; font-weight:600; }
  .asp { display:flex; justify-content:space-between; gap:12px; font-size:13.5px; padding:3px 0; }
  .asp.pending { color:var(--muted); }
  .asp-r { color:var(--muted); font-size:11.5px; white-space:nowrap; letter-spacing:.06em; }
  .chips { display:flex; flex-wrap:wrap; gap:5px; margin-top:9px; }
  .chip { font-size:12.5px; padding:2px 9px; border-radius:99px; border:1px solid var(--line); }
  .chip.t1 { color:var(--t1); border-color:var(--t1); }
  .chip.t2 { color:var(--t2); border-color:var(--t2); }
  .chip.more { color:var(--muted); }
  .upages { margin-top:16px; border-top:1px solid var(--line); padding-top:13px; }
  .pgroup + .pgroup { margin-top:16px; }
  .pg-l { font-size:12px; text-transform:uppercase; letter-spacing:.07em; color:var(--muted);
          font-weight:600; margin-bottom:9px; }
  .drawer { margin-top:38px; border-top:1px solid var(--line); padding-top:16px; }
  .drawer summary { cursor:pointer; font-size:13px; text-transform:uppercase;
                    letter-spacing:.09em; color:var(--muted); font-weight:600; }
  .drawer summary:hover { color:var(--fg); }
  .drawer summary:focus-visible { outline:2px solid var(--l2); outline-offset:3px; border-radius:3px; }
  .drawer + .drawer { margin-top:14px; border-top:0; padding-top:0; }
  .howto h4 { font-size:14px; margin:26px 0 6px; }
  .howto h4:first-child { margin-top:0; }
  .howto p { margin:0 0 12px; font-size:14px; color:var(--muted); max-width:68ch; }
  .howto-note { border-left:2px solid var(--line); padding-left:12px; }
  .howto-src { font-size:12.5px !important; border-bottom:1px solid var(--line);
               padding-bottom:14px; margin-bottom:22px !important; }
  table.k.wide td, table.k.wide th { padding:7px 14px 7px 0; vertical-align:top; }
  table.k.wide th { font-size:11px; text-transform:uppercase; letter-spacing:.06em;
                    color:var(--muted); font-weight:600; text-align:left;
                    border-bottom:1px solid var(--line); }
  table.k.wide td:last-child, table.k.wide th:last-child { text-align:left; color:inherit; }
  table.k.wide td:first-child { white-space:nowrap; color:var(--muted); }
  table.k.wide tr.now td { background:var(--hiBg); }
  table.k.wide tr.now td:first-child { color:var(--hi); font-weight:650; }
  .next { background:var(--hiBg); border-left:3px solid var(--l2);
          border-radius:0 8px 8px 0; padding:11px 14px; font-size:14px; margin-top:12px; }
  .overflow { overflow-x:auto; }
</style>
</head>
<body>
<div class="wrap">

  <header class="top">
    <h1>${esc(T)}</h1>
    <span class="sub">${esc(goalLabel)} — the workspace hub</span>
  </header>
  <div class="stamp">Generated ${esc(today)} by <code>scripts/hub.mjs</code>${
    phase ? ` · ${esc(phase)}` : ""
  }. Every number is read from the file that owns it — nothing here is hand-maintained.</div>

  <h2>Where things stand</h2>
  <div class="tiles">
    ${daysToGoal !== null ? tile(daysToGoal, goalKind === "exam" ? "days to exam" : "days to goal", `${goalDate} — the working target`) : ""}
    ${un.length ? tile(`${unCovered}/${un.length}`, "units done", nextUnit
        ? `next up: **${nextUnit.id}** — ${nextUnit.title.replace(/\s*\([^)]*\)\s*$/, "")}`
        : "all units covered") : ""}
    ${tp.length ? tile(`${tpCovered}/${tp.length}`, "grammar taught", `individual pieces of grammar fully covered, out of everything ${goalLabel} needs`) : ""}
    ${tile(all.length, "things to remember", `${vocab.length} words · ${grammar.length} grammar patterns`)}
    ${tile(due.length, "to review today", due.length
        ? `${queue.produce} to produce · ${queue.recognise} to recognise`
        : "nothing is scheduled — you are caught up",
      due.length ? (queue.over ? "attention" : "") : "clear",
      due.length ? queueMeter() : "")}
    ${tile(ses.length, "study sessions", last
        ? daysToGoal !== null
          ? `most recent was ${esc(last.date)}`
          : `most recent was ${esc(last.date)} · ${last7} in the last 7 days`
        : "")}
  </div>

  <a class="deck" href="deck.html">
    <div>
      <div class="deck-n">${deck.total}</div>
      <div class="deck-nl">items in it</div>
    </div>
    <div>
      <div class="deck-h">The deck <b>→</b></div>
      <div class="deck-s">${deck.words} words · ${deck.patterns} grammar patterns${
        due.length ? ` · ${due.length} of them due today` : ""
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

  ${last || due.length ? `
  <div class="whatnow">
    <div class="whatnow-h">What to do next</div>
    ${due.length ? `<p><strong>${due.length} items are due.</strong> A <code>drill</code> clears the
      queue in 10–15 minutes without teaching anything new; a <code>lesson</code> does the queue
      first and then moves on to ${nextUnit ? esc(nextUnit.id) : "the next unit"}.</p>` : ""}
    ${last && last.next ? `<p class="whatnow-next"><strong>Last session left this pointer:</strong> ${md(last.next)}</p>` : ""}
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
      <strong>Memory ladder</strong>
      <div class="note" style="margin-top:2px">Where the ${all.length} tracked items sit. Tier 1 is shaky, tier 5 is cold storage.</div>
      <div class="tierbar">${tierBar}</div>
      <div class="legend">
        ${Object.keys(INT).map((t) => `<span><i class="seg-${t}" style="background:var(--t${t})"></i>tier ${t} · ${INT[t]}d</span>`).join("")}
      </div>
      ${scored.length ? `
      <div style="margin-top:22px"><strong>End-of-lesson test scores</strong></div>
      <div class="note" style="margin-top:2px">
        Each lesson ends with ten questions on that day's material, marked out of 10.
        <strong>Landing inside the green band is the goal, not beating it</strong> — 6–7 out of 10
        means the material was pitched right. Consistently above 8 means it was too easy and the
        pace should go up; below 5 means slow down.
      </div>
      <div class="spark">
        ${scored.map((s) => `<div style="height:${Math.max(4, s.score * 10)}%" title="${esc(s.id)} — ${esc(s.date)}"><span>${s.score}</span></div>`).join("")}
      </div>
      <div class="spark-x">${scored.map((s) => `<div>${esc(s.date.slice(5))}</div>`).join("")}</div>
      <div class="spark-cap">
        One bar per lesson, oldest first; the newest is highlighted. Drills, reviews and mocks
        have no end-of-lesson test, so they leave no bar — the gaps are not missed sessions.
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
            <td>${s.score !== null ? esc(s.score) + "/10" : "—"}</td></tr>`).join("")
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
  <div id="board">${board.map(unitRow).join("")}</div>` : `
  <h2>The units</h2>
  <div class="panel"><div class="note" style="margin-top:0">No curriculum yet — the unit board
  appears once <code>docs/curriculum.md</code> has its units. Setup generates it; the review
  playbook grows it.</div></div>`}

  <h2>Confidence</h2>
  <div class="panel">
    <table class="k">
      <tr><td>Contract tests (<code>npm test</code>) — last run</td><td>unknown</td></tr>
      <tr><td>Language facts verified against a dictionary</td><td>n/a — factcheck ships in a later template phase</td></tr>
      <tr><td>Enforcement</td><td>${esc(profile.get("mode", "unenforced"))}</td></tr>
    </table>
    <div class="note">How much to trust what this page claims. ${
      profile.get("mode", "unenforced") === "enforced"
        ? "Conventions here are checked by CI, not by promises."
        : "Unenforced mode: node/git checks are not running, so conventions rest on discipline alone."
    } This panel grows when fact-checking lands.</div>
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
      disagrees with it.</p>
      <dl class="cmd">
        ${verbs.map((s) => `<dt><code>${esc(s.name)}</code></dt><dd>${esc(s.desc)}</dd>`).join("")}
      </dl>

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
  `hub → ${OUT}  (${vis.length} visuals · ${all.length} items · ${due.length} due · ` +
    `${unCovered}/${un.length} units · ${tpCovered}/${tp.length} aspects` +
    (daysToGoal !== null ? ` · ${daysToGoal}d to ${goalKind})` : ")"),
);

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
