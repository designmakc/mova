// mova:engine
/**
 * Generates work/visuals/profile.html — what the workspace has settled about the learner,
 * and what the record measures.
 *
 * TWO PAGES, TWO JOBS. The hub is the page you act FROM: one verdict, today's queue, the
 * unit to open. This is the page you look back from — the claims the workspace is operating
 * on, the rhythm the log actually shows, the full coverage ranking, the whole error history.
 * Splitting them is what let the hub's lead band come down to one instruction: everything it
 * used to also say lives here, at the length it deserves, one link away.
 *
 * NAMED profilepage.mjs, not profile.mjs. `scripts/profile.mjs` is the reader of the
 * learner's config block and every script imports it; the page generator is a different
 * thing with a similar name, and the collision is resolved here rather than left to whoever
 * reads an import line next. (Upstream has no such reader and calls its generator
 * profile.mjs — see upstream/map.md.)
 *
 * EVERY SECTION IS GATED, and the gate is `when()` from sources.mjs — a record renders only
 * when it has rows, and every skip is printed. A fresh instance should grow its own page
 * rather than be handed the empty outline of someone else's history; the failure that gate
 * introduces is a broken parser silently deleting a section on a mature workspace, which is
 * why the skips are loud. A section missing from the page AND from that line is the bug.
 *
 * Every number is read from the file that owns it, at generation time. Nothing here is
 * hand-maintained. Regenerated at close-out, before the hub (scripts/closeout.mjs).
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { loadProfile } from "./profile.mjs";
import { loadPack } from "./pack.mjs";
import { FAVICON_LINK } from "./favicon.mjs";
import { DASH_TOKENS, CHROME, NAV_CSS, nav, OPEN_TARGET_JS, anchorOf } from "./page-shell.mjs";
import {
  root, readMaybe, todayISO, daysBetween, when, skipped,
  intervals, ledger, topics, units, sessions, errorTally, currentPhase, visuals,
  pacing, weeklyTarget, weekStart, claims, markedSets, snapshots, unitState,
} from "./sources.mjs";

const OUT = "work/visuals/profile.html";

const profile = loadProfile();
if (!profile) {
  console.error("profilepage: no docs/reference/profile.md — this is template mode. Run setup first.");
  process.exit(1);
}
const pack = await loadPack();
const { esc, md } = await import("./inline-md.mjs");

const T = profile.require("target_language");
const M = profile.require("meta_language");
const goalKind = profile.get("goal_kind", "goal");
const goalLabel = profile.get("goal_label", goalKind);
const goalDate = profile.get("goal_date", null);

const today = todayISO();
const INT = intervals();
const vocab = ledger("state/vocab.md");
const grammar = ledger("state/grammar.md");
const all = [...vocab, ...grammar];
const tp = topics();
const un = units();
const vis = visuals();
const ses = sessions();
const errs = errorTally();
const sets = markedSets();
const snaps = snapshots();
const phase = currentPhase();
const daysToGoal = goalDate ? daysBetween(today, goalDate) : null;

const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);

/* ------------------------------------------------------------------ sections */

/** Sessions grouped by CALENDAR week — the same window the hub scores the mix against, so
 *  the two pages cannot tell different stories about what "this week" was. */
function rhythm() {
  const byWeek = new Map();
  for (const s of ses) {
    const k = weekStart(s.date);
    if (!byWeek.has(k)) byWeek.set(k, { week: k, lessons: 0, drills: 0, other: 0 });
    const w = byWeek.get(k);
    if (/^lesson/i.test(s.type)) w.lessons++;
    else if (/^drill/i.test(s.type)) w.drills++;
    else w.other++;
  }
  return [...byWeek.values()].sort((a, b) => (a.week < b.week ? 1 : -1)).slice(0, 12).reverse();
}

/** Coverage per system, worst first — that ordering IS the information, and here it runs to
 *  every row rather than the hub's headline number. */
const topicSections = [...new Set(tp.map((t) => t.section))]
  .map((s) => {
    const inS = tp.filter((t) => t.section === s);
    return { s, done: inS.filter((t) => /^covered/i.test(t.status)).length, total: inS.length };
  })
  .sort((a, b) => pct(a.done, a.total) - pct(b.done, b.total));

const tierCounts = {};
for (const t of Object.keys(INT)) tierCounts[t] = all.filter((r) => r.tier === Number(t)).length;

/** The unit board's own state, reused rather than re-derived — one definition, two pages. */
const boardStates = un.map((u) => {
  const asps = tp.filter((t) => t.unit === u.id);
  const pages = vis.filter((v) => v.units.includes(u.id));
  return { ...u, ...unitState(u, asps, pages) };
});

const scored = ses.filter((s) => s.score !== null);

/** The learner's own file, as claims that can be read and contested. */
const profileText = readMaybe("docs/reference/profile.md") || "";
const settled = claims(profileText, /^Operational profile/);
const measured = claims(profileText, /^Measured, not assumed/);

const bar = (label, done, total) => `
      <div class="bar-row${done === 0 ? " untouched" : ""}">
        <div class="bar-head"><span>${esc(label)}</span><span class="muted">${done}/${total}</span></div>
        <div class="bar"><div class="bar-fill" style="width:${pct(done, total)}%"></div></div>
      </div>`;

/**
 * One claim. FOLDED TO THE CLAIM, ITS DATE AND ITS EVIDENCE (PORT-026): twenty of these
 * open made a 2,719px wall upstream, and a settled fact nobody scrolls to cannot be
 * contested — which is the only reason this half of the page exists.
 */
const claimRow = (c) => `
      <details class="fold claim">
        <summary><strong>${md(c.claim)}</strong>${
          c.date ? ` <span class="chipd">${esc(c.date)}</span>` : ""
        }${c.evidence ? ` <span class="chipd">${esc(c.evidence)}</span>` : ""}</summary>
        <p class="note">${md(c.body || "No detail recorded beyond the claim itself.")}</p>
      </details>`;

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
${FAVICON_LINK}
<title>${esc(T)} — profile and stats</title>
<style>
${DASH_TOKENS()}
  /* ============ CHROME — the frame every generated dashboard shares =============== */
${CHROME}
${NAV_CSS}
  /* ============ This page's own — claims, and the week strip ===================== */
  .claim { border-bottom:1px solid var(--line); padding:9px 0; }
  .claim > summary { font-size:14.5px; color:var(--fg); }
  .chipd { font-size:11.5px; color:var(--muted); border:1px solid var(--line);
           border-radius:99px; padding:1px 8px; margin-left:5px; white-space:nowrap; }
  .weeks { display:flex; gap:6px; align-items:flex-end; height:96px; margin-top:14px; }
  .wk { flex:1; display:flex; flex-direction:column; justify-content:flex-end; gap:2px; }
  .wk i { display:block; border-radius:2px 2px 0 0; }
  .wk i.l { background:var(--l2); } .wk i.d { background:var(--solid); }
  .wk i.o { background:var(--muted); }
  .wk-x { display:flex; gap:6px; font-size:10.5px; color:var(--muted); margin-top:5px; }
  .wk-x div { flex:1; text-align:center; font-variant-numeric:tabular-nums; }
</style>
</head>
<body>
<div class="wrap">
  ${nav("profile.html")}

  <header class="top">
    <h1>Profile &amp; stats</h1>
    <span class="sub">${esc(goalLabel)} — what this workspace has settled, and what the record shows</span>
  </header>
  <div class="stamp">Generated ${esc(today)} by <code>scripts/profilepage.mjs</code>${
    phase ? ` · ${esc(phase)}` : ""
  }. Every number is read from the file that owns it — nothing here is hand-maintained.</div>

  <h2 id="${anchorOf("claims")}">How this workspace sees you</h2>
  <div class="panel">
    <table class="k">
      <tr><td>Learning</td><td>${esc(T)} from ${esc(M)}</td></tr>
      <tr><td>Languages held</td><td>${esc(profile.get("contrast_ranking", profile.get("native_languages", "—")))}</td></tr>
      <tr><td>Goal</td><td>${esc(goalLabel)}${goalDate ? ` · ${esc(goalDate)}` : " · no date set"}</td></tr>
      <tr><td>Language pack</td><td>${esc(pack.code)} (${esc(pack.manifest.language || "?")})</td></tr>
    </table>
    <div class="note">Every claim below is the workspace's, not yours — <strong>read them and
    say when one is wrong</strong>. A claim nobody contests becomes a rule that quietly shapes
    every session. Each opens onto what it is based on.</div>
  </div>
  ${when("the operational profile", settled, (rowsIn) => `
  <div class="panel" style="margin-top:14px">
    <strong>Settled</strong>
    <div style="margin-top:6px">${rowsIn.map(claimRow).join("")}</div>
  </div>`)}
  ${when("measured findings", measured, (rowsIn) => `
  <div class="panel" style="margin-top:14px">
    <strong>Measured, not assumed</strong>
    <div class="note" style="margin-top:2px">Each of these was found by a session and carries
    the evidence that found it.</div>
    <div style="margin-top:6px">${rowsIn.map(claimRow).join("")}</div>
  </div>`)}

  ${when("pace against the plan", pacing(), (rowsIn) => `
  <h2 id="${anchorOf("pace")}">Pace against the plan</h2>
  <div class="panel">
    ${daysToGoal !== null ? `<p style="margin:0 0 12px"><strong>${daysToGoal} days</strong>
      to ${esc(goalKind === "exam" ? "the exam" : "the goal")} (${esc(goalDate)}).
      ${boardStates.filter((b) => b.state === "taught").length} of ${un.length} units are taught
      in full.</p>` : `<p style="margin:0 0 12px">No date is set, so there is no countdown —
      what is measurable is volume and rhythm, below.</p>`}
    <div class="overflow"><table class="k wide">
      <tr><th>Phase</th><th>Units</th><th>Weeks</th><th>Ends</th><th>Weekly load</th></tr>
      ${rowsIn.map((r) => `<tr class="${phase && phase.startsWith("Phase " + r[0]) ? "now" : ""}">
        ${r.map((c) => `<td>${md(c)}</td>`).join("")}</tr>`).join("")}
    </table></div>
    ${when("the unit board's states", boardStates, (bs) => `
    <div class="note" style="margin-top:14px">${
      ["taught", "part-taught", "staged", "not-opened", "unmapped"]
        .map((st) => ({ st, n: bs.filter((b) => b.state === st).length }))
        .filter((x) => x.n)
        .map((x) => `<strong>${x.n}</strong> ${esc(x.st.replace("-", " "))}`)
        .join(" · ")
    } — the board itself is on the <a class="lnk" href="index.html#${anchorOf("board")}">hub →</a></div>`)}
  </div>`)}

  ${when("study rhythm", rhythm(), (weeks) => {
    const top = Math.max(...weeks.map((w) => w.lessons + w.drills + w.other), 1);
    const h = (n) => (n ? `height:${Math.max(4, (n / top) * 80)}px` : "display:none");
    return `
  <h2 id="${anchorOf("rhythm")}">Study rhythm</h2>
  <div class="panel">
    <strong>Sessions per week</strong>
    <div class="note" style="margin-top:2px">Monday to Sunday, oldest first. Weeks are calendar
    weeks, not a rolling seven days — a rolling window never resets, so it can never be pointed
    at and the plan's weekly load has nothing to be scored against.</div>
    <div class="weeks">
      ${weeks.map((w) => `<div class="wk" title="week of ${esc(w.week)}: ${w.lessons} lessons, ${w.drills} drills, ${w.other} other">
        <i class="o" style="${h(w.other)}"></i><i class="d" style="${h(w.drills)}"></i><i class="l" style="${h(w.lessons)}"></i>
      </div>`).join("")}
    </div>
    <div class="wk-x">${weeks.map((w) => `<div>${esc(w.week.slice(5))}</div>`).join("")}</div>
    <div class="legend">
      <span><i style="background:var(--l2)"></i>lessons</span>
      <span><i style="background:var(--solid)"></i>drills</span>
      <span><i style="background:var(--muted)"></i>everything else</span>
    </div>
  </div>`;
  })}

  ${when("topic coverage", topicSections, (rowsIn) => `
  <h2 id="${anchorOf("coverage")}">Grammar coverage</h2>
  <div class="panel">
    <div class="note" style="margin-top:0">Least-covered system first — that ordering is the
    point. ${tp.filter((t) => /^covered/i.test(t.status)).length} of ${tp.length} individual
    points are fully covered.</div>
    <div style="margin-top:12px">${rowsIn.map((t) => bar(t.s, t.done, t.total)).join("")}</div>
  </div>`)}

  <h2 id="${anchorOf("ladder")}">The memory ladder</h2>
  <div class="panel">
    <div class="note" style="margin-top:0">Where the ${all.length} tracked items sit — ${
      vocab.length} words and ${grammar.length} grammar patterns. Tier 1 comes back tomorrow,
    tier 5 in ${INT[5] ?? "?"} days. Nothing is ever retired.</div>
    <div class="tierbar">${Object.keys(INT).map((t) => {
      const n = tierCounts[t];
      return n ? `<div class="seg seg-${t}" style="flex:${n}" title="tier ${t}: ${n} items">${n}</div>` : "";
    }).join("")}</div>
    <div class="legend">
      ${Object.keys(INT).map((t) => `<span><i class="seg-${t}" style="background:var(--t${t})"></i>tier ${t} · ${INT[t]}d</span>`).join("")}
    </div>
    <div class="overflow" style="margin-top:18px"><table class="k">
      <tr><td>Words</td><td>${vocab.length}</td></tr>
      <tr><td>Grammar patterns</td><td>${grammar.length}</td></tr>
      <tr><td>Above tier 2 — the ones you own</td><td>${all.filter((r) => r.tier >= 3).length}</td></tr>
      <tr><td>Seeded, not yet taught</td><td>${all.filter((r) => r.tier === 0).length}</td></tr>
    </table></div>
  </div>

  ${when("the graded-check history", scored, (rowsIn) => {
    const shown = rowsIn.slice(0, 20).reverse();
    return `
  <h2 id="${anchorOf("history")}">Session history</h2>
  <div class="panel">
    <strong>Every graded check on record</strong>
    <div class="note" style="margin-top:2px">Percentages, so runs of different lengths compare.
    Only the grammar half is graded against the 60–70% band, drawn behind the bars — landing
    inside it is the goal, not beating it.</div>
    <div class="spark">
      ${shown.map((x) => `<div style="height:${Math.max(4, x.score)}%" title="${esc(x.id)} — ${esc(x.date)}"><span>${x.score}%</span></div>`).join("")}
    </div>
    <div class="spark-x">${shown.map((x) => `<div>${esc(x.date.slice(5))}</div>`).join("")}</div>
  </div>
  <div class="panel" style="margin-top:14px">
    <strong>All ${ses.length} sessions</strong>
    <details class="fold" style="margin-top:8px"><summary>open the full log</summary>
      <div class="overflow" style="margin-top:10px"><table class="k">
        ${ses.map((x) => `<tr>
          <td><span class="ecode">${esc(x.date)}</span><span class="ezone">${md(x.type)}</span></td>
          <td>${x.score !== null ? esc(x.score) + "%" : "—"}${
            x.scores && x.scores.vocabulary !== null ? ` <span class="muted">· vocab ${x.scores.vocabulary}%</span>` : ""
          }</td></tr>`).join("")}
      </table></div>
    </details>
  </div>`;
  })}

  ${when("the error tally", errs.rows, (rowsIn) => `
  <h2 id="${anchorOf("mistakes")}">Mistakes, by root cause</h2>
  <div class="panel">
    <div class="note" style="margin-top:0">Each error counted against its <strong>root
    cause</strong> rather than how it showed up, and weighted by how many times it happened.
    Anything since re-tested clean drops off — this is what is still open.</div>
    <div class="overflow" style="margin-top:12px"><table class="k">
      ${rowsIn.map((e) => `<tr>
        <td><span class="ecode">${esc(e.code)}</span>${e.zone ? `<span class="ezone">${md(e.zone)}</span>` : ""}</td>
        <td>${e.n}×${e.last ? ` <span class="muted">· last ${esc(e.last)}</span>` : ""}</td></tr>`).join("")}
    </table></div>
    ${errs.measured.length ? `<div class="note" style="margin-top:10px">
      <strong>Already re-tested:</strong> ${errs.measured.map((m) => `${esc(m.zone || m.code)} —
      ${m.n} earlier ${m.n === 1 ? "mistake" : "mistakes"} answered by a ${m.score}% retest on
      ${esc(m.date)}`).join("; ")}. Those stay in the record and are not counted above.</div>` : ""}
  </div>`)}

  ${when("marked sets", sets.filter((x) => x.total), (rowsIn) => `
  <h2 id="${anchorOf("sets")}">Every item you have been marked on</h2>
  <div class="panel">
    <div class="note" style="margin-top:0">From the marking sheets in <code>work/sets/</code> —
    the only per-item record the workspace keeps. <strong>Half marks are their own column</strong>:
    "right rule, wrong letters" is a different problem from "wrong rule", and a total that
    merges them can be identical twice over and mean opposite things.</div>
    <div class="overflow" style="margin-top:12px"><table class="k wide">
      <tr><th>Date</th><th>Clean</th><th>Half</th><th>Wrong</th><th>Of</th></tr>
      ${rowsIn.slice().reverse().map((x) => `<tr>
        <td>${esc(x.date || "—")}</td><td>${x.ok}</td><td>${x.half}</td><td>${x.bad}</td>
        <td>${x.total}</td></tr>`).join("")}
    </table></div>
    ${sets.filter((x) => !x.total).length ? `<div class="note">${
      sets.filter((x) => !x.total).length} sheet(s) carry no marks and are not counted:
      ${sets.filter((x) => !x.total).map((x) => esc(x.file)).join(", ")}.</div>` : ""}
  </div>`)}

  ${when("snapshots", snaps, (rowsIn) => `
  <h2 id="${anchorOf("snapshots")}">Frozen assessments</h2>
  <div class="panel">
    <div class="note" style="margin-top:0">Each one is a point measurement kept exactly as it
    was taken, with its own "not exercised" list — what it did <em>not</em> test matters as
    much as the score.</div>
    <div class="overflow" style="margin-top:12px"><table class="k wide">
      <tr><th>Date</th><th>What</th><th>Finding</th></tr>
      ${rowsIn.map((x) => `<tr><td>${esc(x.date)}</td><td>${md(x.name)}</td><td>${md(x.hook)}</td></tr>`).join("")}
    </table></div>
  </div>`)}

</div>
<script>
${OPEN_TARGET_JS}
</script>
</body>
</html>
`;

writeFileSync(join(root, OUT), html);
console.log(
  `profile → ${OUT}  (${settled.length + measured.length} claims · ${ses.length} sessions · ` +
    `${errs.rows.length} live error codes · ${sets.length} marked sets · ${snaps.length} snapshots)`,
);
/**
 * EVERY SKIP IS NAMED. The gate's own failure mode — a broken parser silently deleting a
 * section on a mature workspace — is closed by making the skip loud rather than by removing
 * the gate. `--why` spells out what each one would have needed.
 */
const gone = skipped();
if (gone.length) {
  console.log(`  ${gone.length} section(s) skipped, no record yet: ${gone.join(", ")}`);
  if (process.argv.includes("--why")) {
    console.log("  each renders as soon as the file behind it has rows — see when() in scripts/sources.mjs");
  }
}
