#!/usr/bin/env node
// mova:engine
/**
 * closeout — the mechanical half of the close-out ritual, in three commands instead of ~25.
 *
 * WHY THIS EXISTS. Measured in limba across 31 session transcripts, 2026-08-15: a lesson or
 * drill runs ~42 minutes of agent-active time, and ~13 of those (31%) are the close-out.
 * That time is not the scripts — `npm test` is ~1 s and `visualcheck.mjs` is ~0.1 s. It is
 * ~60 serial tool calls at a median 11 s each, and a call-by-call trace of one session showed
 * roughly a third of them were the agent re-reading a document to recall a FORMAT: the
 * visuals-index row, the set-file JSON, the session-log fields. Look up a template, write one
 * row, look up the next template. Every one of those turns costs the learner a full model
 * round-trip and teaches them nothing.
 *
 * So the formats come to the agent instead:
 *
 *   node scripts/closeout.mjs --start     # AT ORIENT: the work/ audit, and the tree snapshot
 *   node scripts/closeout.mjs --brief     # START of close-out: the audit + every template
 *   node scripts/closeout.mjs --finish    # END: regenerate, gate, test, print the commit
 *
 * WHY --start EXISTS AND WHY IT IS AT ORIENT. The commit at step 11 must name paths, never
 * `git add -A`, because the tree is shared with sibling retros. To name only this session's
 * paths, something has to know which files were already dirty before the session touched
 * anything — and the only moment that is true is orient. Recording it at close-out instead
 * captures the session's OWN work as "someone else's" and disowns it, which is worse than
 * not checking. --start also answers orient step 3, so it costs no extra turn.
 *
 * TWO THINGS THIS DELIBERATELY DOES NOT DO.
 *
 *   It never commits. It PRINTS a path-named `git add`/`git commit` line for the agent to
 *   run. AGENTS.md forbids `git add -A` because the tree is shared with sibling retros, and
 *   a script that commits is a script that will eventually sweep someone else's unfinished
 *   work into a session commit. Printing keeps a human-readable decision in the loop.
 *
 *   It never writes a log. scripts/log-append.mjs owns the logs, with an atomic mkdir(2)
 *   lock and the ID derived INSIDE that lock — the fix for two limba sessions taking
 *   `ERR-033` in the same seconds. This script emits the entry BODY; the agent fills it in
 *   and calls log-append.mjs. Anything else re-opens that race.
 *
 * Zero dependencies. --start and --brief are read-only. --finish writes only through the
 * generators it calls (deck.mjs, profilepage.mjs, hub.mjs), each of which owns its output.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join, basename } from "node:path";
import { tmpdir } from "node:os";
import { createHash } from "node:crypto";
import { loadProfile } from "./profile.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const profile = loadProfile();
if (!profile) {
  console.error("closeout: no docs/reference/profile.md — this is template mode. Run setup first.");
  process.exit(1);
}

/**
 * The only workspace-specific configuration — everything below reads from this.
 * Kept as one block so a change of convention re-points it without reading the logic.
 */
const CONTRACT = {
  /**
   * A change under any of these is an ENGINE file. In an instance that is not a routine
   * edit: `/update` reconciles against upstream/manifest.json hashes, so a local engine
   * change becomes a conflict at the next update. Worth a warning, never a block — the
   * learner owns their workspace.
   */
  engine: [/^docs\/mechanics\//, /^scripts\//, /\.test\.ts$/, /^docs\/visual\//, /^playbooks\//],
  /** Ledger whose new rows decide whether the TTS cache needs warming. */
  vocabLedger: "state/vocab.md",
  visualsDir: "work/visuals",
  visualsIndex: "work/visuals/README.md",
  /** Generated pages: rebuilt every close-out, never hand-indexed. */
  generated: new Set(["index.html", "deck.html", "profile.html"]),
  /**
   * Session-scoped scratch. Deliberately OUTSIDE the repo: a state directory inside the
   * tree shows up as an untracked path in the very `git status` this script reads, so it
   * would list itself as a sibling session's work in flight. Keyed by repo path so two
   * checkouts never share a snapshot.
   */
  scratch: join(tmpdir(), `mova-closeout-${createHash("sha1").update(ROOT).digest("hex").slice(0, 12)}`),
};

/** Audio is capability-gated: an instance with `tts: none` has no cache to warm. */
const HAS_TTS = (profile.config.tts || "none") !== "none" && profile.config.audio !== "false";

const sh = (cmd) => execSync(cmd, { cwd: ROOT, encoding: "utf8" }).trim();
const shSoft = (cmd) => { try { return sh(cmd); } catch { return ""; } };

/**
 * `git status --porcelain`, parsed into paths.
 *
 * NEVER trim the whole output first. Porcelain lines are `XY<space>path`, and an unstaged
 * modification is ` M path` — leading space. Trimming the buffer eats that space on the
 * FIRST line only, so a `.slice(3)` then removes one character too many and `.claude/…`
 * silently becomes `claude/…`. That is a path that does not exist, printed into a `git add`
 * line as though it did; found on this script's own first --finish run in limba.
 */
function porcelain(pathspec = "") {
  let out;
  try {
    out = execSync(`git status --porcelain --${pathspec ? ` ${pathspec}` : ""}`, { cwd: ROOT, encoding: "utf8" });
  } catch { return []; }
  return out.split("\n").filter((l) => l.length > 3).map((l) => {
    const p = l.slice(3);
    return p.includes(" -> ") ? p.split(" -> ")[1] : p; // renames report both sides
  });
}
const rule = (t) => `\n${"─".repeat(78)}\n${t}\n${"─".repeat(78)}`;
const todayISO = () => {
  const n = new Date();
  const p = (x) => String(x).padStart(2, "0");
  return `${n.getFullYear()}-${p(n.getMonth() + 1)}-${p(n.getDate())}`;
};

/* ------------------------------------------------------------------ the work/ audit */

/**
 * Orient step 3's three cases, computed rather than eyeballed. The distinction is
 * load-bearing: reading prepared material as residue rebuilds a page that already exists
 * and teaches the same unit twice; reading residue as nothing at all overwrote a draft
 * visual unread in limba, 2026-08-03. A row can legitimately exist before its file is
 * committed — a page is indexed the moment it passes the gate, not at close-out.
 */
function auditVisuals() {
  const indexPath = join(ROOT, CONTRACT.visualsIndex);
  const indexed = new Set(
    existsSync(indexPath)
      ? [...readFileSync(indexPath, "utf8").matchAll(/\]\(([^)]+\.(?:html|svg))\)/g)].map((m) => basename(m[1]))
      : [],
  );
  const tracked = new Set(shSoft(`git ls-files ${CONTRACT.visualsDir}`).split("\n").filter(Boolean).map((p) => basename(p)));
  const onDisk = shSoft(`ls ${CONTRACT.visualsDir}`).split("\n").filter((f) => /\.(html|svg)$/.test(f));
  const dirty = new Set(porcelain(CONTRACT.visualsDir).map((p) => basename(p)));

  const rows = [];
  for (const f of onDisk) {
    if (CONTRACT.generated.has(f)) continue;
    const t = tracked.has(f), i = indexed.has(f), d = dirty.has(f);
    let state, note;
    if (t && i && !d) { state = "ok"; note = "committed and indexed"; }
    else if (t && i && d) { state = "changed"; note = "indexed, modified this session — re-gate and commit"; }
    else if (!t && i) { state = "in-flight"; note = "INDEXED BUT UNCOMMITTED — may be a sibling session's page. Read it, reuse it, never overwrite it."; }
    else if (t && !i) { state = "CI-RED"; note = "committed with NO index row — docs/visuals.index.test.ts will fail"; }
    else { state = "residue"; note = "untracked and in no index — a session that reached no exit left this. Read before writing near it."; }
    rows.push({ f, state, note });
  }
  // Only real pages, never the index itself and never the generated ones — `dirty` is a
  // raw git listing and contains README.md, which is not a page and has no gate to pass.
  const dirtyPages = rows.filter((r) => dirty.has(r.f)).map((r) => r.f);
  return { rows, dirtyPages };
}

/* ------------------------------------------------------------------ change detection */

const changedPaths = () => porcelain();
const touchesEngine = (paths) => paths.filter((p) => CONTRACT.engine.some((re) => re.test(p)));

/**
 * What was ALREADY dirty when the SESSION began — written by --start at orient.
 *
 * Without this the printed `git add` line is every dirty path, which is `git add -A` with
 * extra steps and sweeps a sibling retro's in-flight work into a session commit. --start
 * records the set at orient; --finish subtracts it, so what remains is this session's own
 * work. Recording it at close-out instead would be actively wrong: by then the session's own
 * edits are dirty too, and they would be disowned as a sibling's. A close-out with no
 * snapshot falls back to naming everything and says so, rather than pretending it knows.
 */
const SNAPSHOT = join(CONTRACT.scratch, "dirty-at-orient.json");
function writeSnapshot(paths) {
  try {
    mkdirSync(CONTRACT.scratch, { recursive: true });
    writeFileSync(SNAPSHOT, JSON.stringify({ at: new Date().toISOString(), paths }, null, 2));
    return true;
  } catch { return false; }
}
function readSnapshot() {
  if (!existsSync(SNAPSHOT)) return null;
  try { return JSON.parse(readFileSync(SNAPSHOT, "utf8")).paths; } catch { return null; }
}

/** Added ledger rows decide whether tts-warm has anything to fetch. */
function newVocabRows() {
  const stat = shSoft(`git diff HEAD --numstat -- ${CONTRACT.vocabLedger}`);
  if (!stat) return 0;
  return Number(stat.split("\t")[0]) || 0;
}

/* ------------------------------------------------------------------------- templates */

const T = {
  visualRow: (file) =>
    `| ${todayISO()} | [${basename(file).replace(/^\d{4}-\d{2}-\d{2}_/, "").replace(/\.\w+$/, "")}](${basename(file)}) | ` +
    `<what it teaches — the system, the load, the traps, the drill surface, N audio clips> | U<NN> | teach |\n` +
    `  (a page BUILT but not yet taught: leave Date empty and open Teaches with \`Built —\`)`,

  session: () =>
    [
      "- **Type.** <lesson | drill | write | mock | review> — <unit, or the focus>",
      "- **Covered.** <what was taught or reviewed; which topics.md aspects flipped to covered>",
      "- **SRS.** <N due · N reviewed · N promoted · N demoted · N new rows —",
      "  or `skipped — <reason>` when part 1 did not run (session_format.md); a skip and a",
      "  collapse both leave no score and mean opposite things>",
      "- **Score.** grammar <N/M = P%> · vocabulary <N/M = P%>",
      "  (TWO numbers, not one, and only the grammar half is graded against the 60-70% band —",
      "   session_format.md, \"What the graded check must sample\". Grammar and vocabulary answer",
      "   different questions and a single blended headline can read `pace down` while the clean",
      "   grammar sub-block inside it reads `pace up`. Write `vocabulary none` when the check",
      "   sampled no words, and name any contamination in the same line. A lesson entry with no",
      "   parseable grammar number fails docs/logs.entries.test.ts; a lesson that genuinely ran",
      "   no check says so with `<!-- no-graded-check: <reason> -->`.)",
      "- **Duration.** <N minutes, learner-facing wall clock>",
      "- **Next.** <what the next session should DO>",
      "- **Open questions.** <a question put to the learner and left unanswered, or `none`>",
    ].join("\n"),

  error: () =>
    [
      "- **Error.** <what was produced against what was asked>",
      "  Code: <CODE> ×<N>",
      "- **<The cause, stated as a claim.>** <the evidence that makes it more than a guess>",
    ].join("\n"),
};

/* ----------------------------------------------------------------------------- start */

/** Orient step 3, plus the snapshot that lets the close-out commit name paths. */
function start() {
  const today = todayISO();
  const paths = changedPaths();
  const { rows } = auditVisuals();

  console.log(rule(`ORIENT — ${today}`));
  console.log("Today's date is above; it is read from the clock, never from context (orient step 2).\n");

  console.log(rule("work/ — prepared material, residue, or a sibling's page in flight (step 3)"));
  const settled = rows.filter((r) => r.state === "ok");
  const attention = rows.filter((r) => r.state !== "ok");
  console.log(`  ${settled.length} page(s) committed and indexed.`);
  for (const r of attention) {
    const mark = { changed: "  ~", "in-flight": "  !", "CI-RED": "  ✗", residue: "  ?" }[r.state];
    console.log(`${mark} ${r.f.padEnd(38)} ${r.note}`);
  }

  console.log(rule("Queue and the newest log entry (step 4)"));
  console.log(shSoft("node scripts/queue.mjs --counts") || "  (queue.mjs failed)");
  const newest = shSoft(`grep -n "^## " docs/logs/session_log.md | head -1`);
  console.log(`  newest session_log entry (by structure): ${newest || "none"}`);
  console.log(`  HEAD commit (independent check):         ${shSoft("git log --oneline -1")}`);
  console.log("  If those two disagree, an entry landed since the last commit — trust the file.");

  const saved = writeSnapshot(paths);
  console.log(rule("Tree snapshot for the close-out commit"));
  if (!saved) {
    console.log("  ! could not write the snapshot — the close-out will name every dirty path.");
  } else if (paths.length) {
    console.log("  Dirty BEFORE this session touched anything — a sibling's work in flight.");
    console.log("  Recorded, and excluded from the commit line the close-out prints:");
    paths.forEach((p) => console.log(`    ${p}`));
    console.log("\n  Never stash, reset or restore these. They are not a mess to clean.");
  } else {
    console.log("  Clean tree. Everything dirty from here on is this session's.");
  }
}

/* ----------------------------------------------------------------------------- brief */

function brief() {
  const today = todayISO();
  const paths = changedPaths();
  const { rows } = auditVisuals();
  const engine = touchesEngine(paths);

  console.log(rule(`CLOSE-OUT BRIEF — ${today}`));
  console.log("Every template this ritual needs is below. Do not go looking them up.\n");

  console.log(rule("1. work/ — every artifact accounted for (ritual step 8)"));
  // Exceptions only. A settled page needs no line — printing all of them buries the one
  // that matters under the ones that do not, which is the failure this audit prevents.
  const settled = rows.filter((r) => r.state === "ok");
  const attention = rows.filter((r) => r.state !== "ok");
  if (!rows.length) console.log("  no visuals on disk");
  else console.log(`  ${settled.length} page(s) committed and indexed — nothing owed.`);
  for (const r of attention) {
    const mark = { changed: "  ~", "in-flight": "  !", "CI-RED": "  ✗", residue: "  ?" }[r.state];
    console.log(`${mark} ${r.f.padEnd(38)} ${r.note}`);
  }
  const otherWork = paths.filter((p) => p.startsWith("work/") && !p.startsWith(CONTRACT.visualsDir));
  if (otherWork.length) {
    console.log("\n  other work/ files touched (each is indexed-and-committed, or deleted):");
    otherWork.forEach((p) => console.log(`    ${p}`));
  }

  console.log(rule("2. Counts — queue, and the live error tally"));
  console.log(shSoft("node scripts/queue.mjs --counts") || "  (queue.mjs failed)");
  // --codes, not the full tally: the close-out needs the live head to write the Next
  // pointer, and the full report is 60 lines that only the drill and review playbooks
  // actually read. Run `node scripts/tally.mjs` for the whole picture.
  const codes = shSoft("node scripts/tally.mjs --codes").split("\n").filter(Boolean).slice(0, 6);
  console.log(`live tally (top ${codes.length}, \`tally.mjs\` for the rest): ${codes.join(" · ")}`);

  console.log(rule("3. state/ rows this session touched"));
  const stateDiff = shSoft("git diff HEAD --unified=0 -- state/ | grep '^+|' | cut -c1-150");
  console.log(stateDiff || "  no ledger rows changed yet");

  console.log(rule("4. Before you write the entry — check every causal claim (ritual step 3)"));
  console.log([
    "  For each claim you are about to write, name the file that would falsify it — and OPEN it.",
    "    a claim about words      → state/vocab.md",
    "    a claim about coverage   → docs/reference/topics.md",
    "    a claim about a session  → docs/logs/session_log.md",
    "  A limba session's headline finding — that the three surviving words were the three with a",
    "  transfer anchor — reached the log, a repair page and the learner before one grep showed all",
    "  sixteen rows already carried a hook. A wrong score gets re-measured; a wrong explanation",
    "  gets built on.",
  ].join("\n"));

  console.log(rule("5. Session log body — the seven fields (step 4)"));
  console.log(T.session());
  console.log([
    "",
    "  POINT, DO NOT RETELL. An ERR-NNN entry averages 262 words and is already greppable;",
    "  naming the ID is the whole job. The same goes for a curriculum decision that also lives",
    "  in curriculum.md. Lesson/drill/write/vocab entries are budgeted — see docs/logs.entries.test.ts.",
  ].join("\n"));

  console.log(rule("6. Error log body (step 5)"));
  console.log(T.error());
  console.log("\n  Append with:  node scripts/log-append.mjs error --file <body>.md");
  console.log("  The script owns the ID and takes the lock. Never hand-number an entry.");

  if (engine.length) {
    console.log(rule("7. ⚠ Engine files changed this session"));
    engine.forEach((p) => console.log(`    ${p}`));
    console.log([
      "",
      "  These are template-owned. `/update` reconciles them against upstream/manifest.json,",
      "  so a local edit here becomes a merge conflict at the next update rather than a silent",
      "  loss — but it is still a fork. If the change is a real improvement, say so in the",
      "  session entry so it can be reported upstream instead of re-solved by every instance.",
    ].join("\n"));
  }

  // Only pages with no row yet. A page is indexed the moment it passes the gate, so a
  // dirty-but-indexed page already has its row and offering a second one invites a duplicate.
  const needRow = rows.filter((r) => r.state === "residue" || r.state === "CI-RED").map((r) => r.f);
  if (needRow.length) {
    console.log(rule("8. Visuals index row template — these pages have NO row yet"));
    needRow.forEach((f) => console.log(T.visualRow(f) + "\n"));
  }

  if (readSnapshot() === null) {
    console.log(rule("9. No orient snapshot"));
    console.log("  `--start` was not run at orient, so --finish cannot tell your paths from a");
    console.log("  sibling session's and will name every dirty file. Read its commit line closely.");
  }

  console.log(rule("When the writing is done:  node scripts/closeout.mjs --finish"));
}

/* ---------------------------------------------------------------------------- finish */

function run(label, cmd, { optional = false } = {}) {
  process.stdout.write(`  ${label} … `);
  try {
    const out = execSync(cmd, { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
    console.log("ok");
    return { ok: true, out };
  } catch (e) {
    console.log("FAILED");
    const detail = `${e.stdout || ""}${e.stderr || ""}`.trim().split("\n").slice(-14).join("\n");
    console.error(`\n${detail}\n`);
    if (!optional) {
      console.error(`✗ close-out stopped at "${label}". Fix it, then re-run --finish.`);
      process.exit(1);
    }
    return { ok: false, out: detail };
  }
}

function finish() {
  console.log(rule(`CLOSE-OUT FINISH — ${todayISO()}`));

  const added = newVocabRows();
  console.log("Regenerating the learner's surfaces (step 9):");
  if (!HAS_TTS) {
    console.log("  audio is off in the profile — no TTS cache to warm.");
  } else if (added > 0) {
    console.log(`  ${added} line(s) added to ${CONTRACT.vocabLedger} — warming the TTS cache first,`);
    console.log("  or the new rows ship mute.");
    run("tts-warm.mjs", "node scripts/tts-warm.mjs");
  } else {
    console.log(`  no new rows in ${CONTRACT.vocabLedger} — skipping tts-warm.mjs (it is the only`);
    console.log("  script that reaches the network; running it with nothing to fetch is pure latency).");
  }
  run("deck.mjs", "node scripts/deck.mjs");
  // Before the hub, so a run that dies mid-chain leaves the two record surfaces consistent
  // with each other rather than one of them a session behind.
  run("profilepage.mjs", "node scripts/profilepage.mjs");
  run("hub.mjs", "node scripts/hub.mjs");

  const { dirtyPages: gate } = auditVisuals();
  console.log("\nPublish gate on visuals this session touched:");
  if (!gate.length) console.log("  none touched");
  for (const f of gate) run(f, `node scripts/visualcheck.mjs ${CONTRACT.visualsDir}/${f}`);

  console.log("\nContract tests (step 10):");
  run("npm test", "npm test");

  const paths = changedPaths();
  const before = readSnapshot();
  // The generated pages are always ours to commit: --finish just rebuilt them, and a conflict
  // in either is settled by regeneration, never by merge.
  const regenerated = [
    `${CONTRACT.visualsDir}/deck.html`,
    `${CONTRACT.visualsDir}/profile.html`,
    `${CONTRACT.visualsDir}/index.html`,
  ];
  const mine = before === null
    ? paths
    : paths.filter((p) => !before.includes(p) || regenerated.includes(p));
  const theirs = paths.filter((p) => !mine.includes(p));

  console.log(rule("Green. Commit — NAMING PATHS (step 11)"));
  if (before === null) {
    console.log("  ! No orient snapshot (--start never ran): cannot tell your changes from a sibling's.");
    console.log("  ! The line below names EVERY dirty path. Read it before you run it.\n");
  } else {
    console.log("  The tree is shared. `git add -A` sweeps a sibling retro's unfinished work into");
    console.log("  your commit, so this names only what changed since --start ran at orient:\n");
  }
  console.log(`  git add ${mine.join(" ") || "<nothing changed>"}`);
  console.log(`  git commit -m "SES-NNN: <one-line summary>"`);
  if (theirs.length) {
    console.log("\n  Left out — dirty before this close-out began, so not yours:");
    theirs.forEach((p) => console.log(`    ${p}`));
    console.log("  If one of these IS yours, add it by name. Never stash or restore them.");
  }
  if (touchesEngine(mine).length) {
    console.log("\n  ! Engine files are in this commit — see the brief's section 7 before you run it.");
  }
  console.log(rule("Then step 12: say it plainly. No codes, no paths, no SES-NNN — what the"));
  console.log("learner can now do that they could not this morning, what broke, what is next.");
}

/* ------------------------------------------------------------------------------- cli */

const mode = process.argv[2];
if (mode === "--start") start();
else if (mode === "--brief") brief();
else if (mode === "--finish") finish();
else {
  console.error("usage: closeout.mjs --start | --brief | --finish");
  console.error("  --start   at ORIENT: the work/ audit, the queue, and the tree snapshot");
  console.error("  --brief   at the START of close-out: the audit, counts, and every template");
  console.error("  --finish  at the END: regenerate, gate, test, print the path-named commit line");
  process.exit(1);
}
