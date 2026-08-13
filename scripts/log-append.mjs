// mova:engine
/**
 * Append one entry to an append-only log, safe under concurrent writers.
 *
 *   node scripts/log-append.mjs error   --file body.md          # → docs/logs/error_log.md
 *   node scripts/log-append.mjs session --file body.md          # → docs/logs/session_log.md
 *   node scripts/log-append.mjs error --file body.md --date 2026-08-12   # default: today
 *   node scripts/log-append.mjs error --file body.md --dry     # print the heading, write nothing
 *
 * WHY THIS EXISTS. In the reference instance (limba, 2026-08-12) two sessions took
 * `ERR-033` and `ERR-034` in the seconds between one of them reading the log and writing to
 * it; `npm test` caught the duplicate and it was renumbered by hand. What made that
 * recoverable was luck: docs/logs.entries.test.ts checks IDs are unique and descending, so
 * a DUPLICATE is caught — but the failure mode it cannot see is a read-modify-write where
 * the second writer re-serialises a snapshot taken before the first writer's append, and
 * the first entry vanishes with nothing left to test. `scripts/feedback.sh` grew a lock for
 * exactly this reason; the logs are the same problem with worse consequences, because the
 * error tally decides what gets drilled.
 *
 * The lock is the same shape as feedback.sh's: atomic mkdir(2), re-read INSIDE the lock,
 * derive the ID there, insert, release. The body never carries its own heading — this script
 * owns the ID, so the ID cannot be computed from a stale read.
 *
 * The LOGS map holds the two logs every instance has. (limba carries a third, its porting
 * log — that one is upstream plumbing and deliberately not part of the template.)
 *
 * Zero dependencies. Writes exactly one file.
 */
import { readFileSync, writeFileSync, mkdirSync, rmdirSync, statSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const LOGS = {
  error: { file: "docs/logs/error_log.md", prefix: "ERR" },
  session: { file: "docs/logs/session_log.md", prefix: "SES" },
};

const argv = process.argv.slice(2);
const flag = (name) => {
  const i = argv.indexOf(`--${name}`);
  return i > -1 ? argv[i + 1] : undefined;
};
const which = argv.find((a) => !a.startsWith("--") && LOGS[a]);
const bodyFile = flag("file");
const dry = argv.includes("--dry");

if (!which || !bodyFile) {
  console.error("usage: log-append.mjs <error|session> --file BODY.md [--date YYYY-MM-DD] [--dry]");
  process.exit(1);
}

const todayISO = () => {
  const n = new Date();
  const p = (x) => String(x).padStart(2, "0");
  return `${n.getFullYear()}-${p(n.getMonth() + 1)}-${p(n.getDate())}`;
};
const date = flag("date") || todayISO();
if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
  console.error(`log-append: --date must be YYYY-MM-DD, got "${date}"`);
  process.exit(1);
}

// Read the body outside the lock, so a slow read never holds another session off.
const body = readFileSync(bodyFile, "utf8").trimEnd();
if (!body) {
  console.error(`log-append: "${bodyFile}" is empty, nothing appended`);
  process.exit(1);
}
// Same guard feedback.sh needed: a body that writes its own heading both duplicates the
// header and, worse, hands the next writer an ID this script never assigned.
if (/^## /m.test(body)) {
  console.error("log-append: the body contains a '## ' heading — this script assigns date and ID.");
  console.error("            Start with the entry's first bullet; use '###' for any sub-heading.");
  process.exit(1);
}

const { file, prefix } = LOGS[which];
const path = join(root, file);
const lock = `${path}.lock`;

/** Atomic mkdir: exactly one waiter wins. ~60s of patience, then break a lock older than
 *  120s — that is a crashed writer, not a live one. */
function takeLock() {
  for (let i = 0; i < 300; i++) {
    try {
      mkdirSync(lock);
      return true;
    } catch {
      if (i > 30 && existsSync(lock)) {
        try {
          if (Date.now() - statSync(lock).mtimeMs > 120_000) rmdirSync(lock);
        } catch { /* another waiter got there first */ }
      }
      // Busy-wait rather than pull in a sleep dependency; the window is milliseconds in practice.
      const until = Date.now() + 200;
      while (Date.now() < until);
    }
  }
  return false;
}

if (!dry && !takeLock()) {
  console.error(`log-append: could not take ${lock} after 60s — if no writer is running, rmdir it`);
  process.exit(1);
}

try {
  /* --- critical section: nobody else can be mid-append on this file --- */
  const text = readFileSync(path, "utf8");
  const headingRe = new RegExp(`^## (\\d{4}-\\d{2}-\\d{2}) — ${prefix}-(\\d{3,})$`, "gm");

  let max = 0;
  let newestDate = null;
  for (const m of text.matchAll(headingRe)) {
    max = Math.max(max, Number(m[2]));
    if (newestDate === null) newestDate = m[1]; // first match is the newest entry
  }
  const id = `${prefix}-${String(max + 1).padStart(3, "0")}`;
  const heading = `## ${date} — ${id}`;

  // logs.entries.test.ts requires dates non-increasing down the file. A back-dated entry
  // would land at the top and break that, so refuse it here rather than in CI.
  if (newestDate && date < newestDate) {
    throw new Error(
      `log-append: --date ${date} is older than the newest entry (${newestDate}). ` +
        `The log is newest-first, so this entry cannot go at the top.`,
    );
  }

  if (dry) {
    console.log(`${heading}   (dry run — nothing written)`);
  } else {
    // Insert directly above the first entry, i.e. below the intro blockquote.
    const at = text.search(/^## /m);
    const out =
      at === -1
        ? `${text.trimEnd()}\n\n${heading}\n\n${body}\n`
        : `${text.slice(0, at)}${heading}\n\n${body}\n\n${text.slice(at)}`;
    writeFileSync(path, out);
    console.log(`appended ${id} (${date}) → ${file}`);
  }
} finally {
  if (!dry) { try { rmdirSync(lock); } catch { /* already gone */ } }
}
