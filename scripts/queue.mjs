// mova:engine
/**
 * Derives today's SRS due queue from state/vocab.md and state/grammar.md.
 *
 * Due-ness is computed, never stored: due when (today − last) ≥ interval(tier).
 * docs/mechanics/srs.md is the canonical home of the interval table — keep in sync.
 *
 * Usage:
 *   node scripts/queue.mjs            # full queue, oldest `last` first, capped
 *   node scripts/queue.mjs --counts   # one summary line only
 *
 * The counts line reports `reviewed today` beside `due`, because those two overlap and the
 * overlap decides what the session can measure. Tier 1 has a zero-day interval, so a row
 * answered an hour ago is due again immediately: in the reference instance a second session
 * opened to `due: 42 vocab · 5 grammar` where all 47 rows carried that day's date and had
 * been answered two hours earlier (limba, 2026-08-12). The number was not wrong and was not
 * usable either. So the counts line does not stop at the overlap: it names the **verdict for
 * part 1** of a lesson, because that decision has exactly these inputs and was being made from
 * memory instead. The rule is session_format.md, "Part 1 runs only when it can produce
 * something"; the same-day half of it is srs.md, "Due when the row was already reviewed today".
 *
 * THE VERDICT NAMES ROWS THE SESSION CAN ACTUALLY SEE (ported from limba, 2026-08-19).
 * "The rows dated today are the queue's tail — stop where it starts" is true of the QUEUE
 * and false of the LISTING whenever the backlog runs past the cap: the queue is oldest-first,
 * so today's rows are its tail, and a tail past row 55 is a tail nobody is looking at. limba
 * printed the same claim under a 141-row queue about 10 rows none of which were on screen,
 * and the session re-derived the truth by reading every displayed date by eye. A surface that
 * makes a session check it by hand is the failure the verdict was added to remove. So the
 * verdict takes what is shown as an argument and branches on three cases: all of them
 * visible, none of them visible, or a split.
 *
 * Requires no profile — the queue must work in any instance the moment the ledgers exist,
 * and the ledgers ship with the template. Read-only, zero dependencies, always exits 0.
 * Malformed rows are skipped here — state/ledgers.test.ts is the strict gate that fails CI
 * on them.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

// days — sync with docs/mechanics/srs.md AND state/ledgers.test.ts (validTiers).
// All three copies move together; the ladder is a measured default (limba, learner #1)
// and recalibration edits every copy in the same commit.
const INTERVALS = { 1: 0, 2: 3, 3: 7, 4: 21, 5: 60 };
const CAP = 55; // backlog after a break is eaten over several sessions, not one

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function parseLedger(path) {
  const rows = [];
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const t = line.trim();
    if (!t.startsWith("|") || !t.endsWith("|")) continue;
    const cells = t.slice(1, -1).split("|").map((c) => c.trim());
    if (cells.length !== 8) continue;
    if (cells[0] === "id" || cells[0].startsWith("---")) continue;
    rows.push({
      id: cells[0],
      target: cells[1],
      translation: cells[2],
      tier: Number(cells[3]),
      last: cells[5],
    });
  }
  return rows;
}

function daysSince(iso, todayUTC) {
  const [y, m, d] = iso.split("-").map(Number);
  return Math.round((todayUTC - Date.UTC(y, m - 1, d)) / 86_400_000);
}

const now = new Date();
const todayUTC = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());

const vocab = parseLedger(join(root, "state", "vocab.md"));
const grammar = parseLedger(join(root, "state", "grammar.md"));

const due = [...vocab, ...grammar]
  .filter((r) => INTERVALS[r.tier] !== undefined && daysSince(r.last, todayUTC) >= INTERVALS[r.tier])
  .sort((a, b) => (a.last === b.last ? (a.id < b.id ? -1 : 1) : a.last < b.last ? -1 : 1));

const dueV = due.filter((r) => r.id.startsWith("V-")).length;
const dueG = due.length - dueV;

const todayISO = new Date(todayUTC).toISOString().slice(0, 10);
const seenToday = due.filter((r) => r.last === todayISO).length;

/**
 * The part-1 verdict — session_format.md, "Part 1 runs only when it can produce something".
 * Part 1's two products are a retention number and a tier move; a row already answered today
 * can yield neither (srs.md: one tier move per calendar day). So the block runs on the rows
 * NOT dated today, and when there are none it does not run at all. The queue sorts oldest
 * `last` first, which is exactly why today's rows are its tail.
 */
function part1Verdict(shown = null) {
  const fresh = due.length - seenToday;
  if (due.length === 0) return "part 1: nothing due — the block does not run";
  if (fresh === 0) {
    return (
      `part 1: all ${due.length} due rows were reviewed today — the block does not run` +
      ` (no tier can move, no score is valid); a short unscored sweep is OFFERED, not assumed`
    );
  }
  if (seenToday > 0) {
    const tail = seenToday === 1 ? "1 row dated today is" : `${seenToday} rows dated today are`;
    // With no listing to speak of (--counts), the queue's own shape is all there is to say.
    if (shown === null) {
      return (
        `part 1: runs on the ${fresh} not seen today; the ${tail} the queue's tail` +
        ` — stop where it starts`
      );
    }
    const here = shown.filter((r) => r.last === todayISO).length;
    const where =
      here === 0
        ? `the ${tail} past today's cap — every row above is fair game`
        : here === seenToday
          ? `the ${tail} the tail of the list above — stop where it starts`
          : `${here} of the rows above are dated today (${seenToday} in the whole queue)` +
            ` — stop where they start`;
    return `part 1: runs on the ${fresh} not seen today; ${where}`;
  }
  return `part 1: runs — ${due.length} rows to review, oldest first`;
}

if (process.argv.includes("--counts")) {
  const seen = seenToday
    ? ` · ${seenToday} of those reviewed today (re-exposure only — srs.md)`
    : "";
  console.log(
    `due: ${dueV} vocab · ${dueG} grammar${seen}` +
      ` (tracked: ${vocab.length} vocab, ${grammar.length} grammar)`,
  );
  /**
   * THE SAME SPLIT THE HUB PRINTS. One total blends two populations that mean opposite
   * things: tier 1 has a zero-day interval, so it falls due again every morning and can
   * never be cleared, while tier 2+ genuinely comes around and genuinely reaches zero.
   * Reported as one number, a healthy queue reads as an unpayable debt. Triage and the
   * dashboard must say the same thing, or the learner arbitrates between two surfaces.
   */
  const fresh = due.filter((r) => r.last !== todayISO);
  const sched = fresh.filter((r) => r.tier >= 2).length;
  const recycling = fresh.filter((r) => r.tier === 1).length;
  console.log(
    `  ⇒ ${sched} came around on schedule · ${recycling} in the daily recognition pool` +
      ` (tier 1 recycles every morning by design — a rotation, not a backlog)`,
  );
  console.log(`  ⇒ ${part1Verdict()}`);
} else {
  const shown = due.slice(0, CAP);
  const overflow = due.length - shown.length;

  const section = (title, rows) => {
    console.log(`\n${title} (${rows.length})`);
    if (rows.length === 0) console.log("  — nothing due —");
    for (const r of rows) {
      console.log(`  ${r.id}  [t${r.tier}, last ${r.last}]  ${r.target}  —  ${r.translation}`);
    }
  };

  section("VOCAB DUE", shown.filter((r) => r.id.startsWith("V-")));
  section("GRAMMAR DUE", shown.filter((r) => r.id.startsWith("G-")));
  console.log(`\n  ⇒ ${part1Verdict(shown)}`);
  if (overflow > 0) {
    console.log(`\n  +${overflow} more due beyond today's cap of ${CAP} — they surface next session.`);
  }
}
