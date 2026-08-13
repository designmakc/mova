// mova:engine
/**
 * Ordering contract for docs/logs/ (session_log.md, error_log.md).
 *
 * The logs are append-only evidence: the error tally that decides what gets drilled
 * greps them, and "newest first" is what makes the recent past readable at the top.
 * A renumbered ID or an entry appended to the bottom corrupts both quietly — so the
 * ordering is CI, not goodwill.
 *
 * What is enforced:
 *   - every `## ` heading matches `## YYYY-MM-DD — <PREFIX>-NNN` exactly;
 *   - IDs are unique and strictly DESCENDING down the file (newest first);
 *   - dates are real, non-increasing down the file, and never in the future.
 *
 * Both logs may legitimately be empty: the template ships them with intros and zero
 * entries, and a fresh instance has no sessions yet. (limba required at least one session
 * entry — its scaffold session; an instance may tighten `allowEmpty` once it has history.)
 *
 * If this fails, fix the log — but never by editing old entries: move your NEW entry to
 * the top with the next ID. Old entries are immutable. Append via
 * `scripts/log-append.mjs`, which assigns the ID under a lock.
 */

import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

/** The only project-specific configuration. */
const CONTRACT = {
  logs: [
    // allowEmpty true on BOTH: a fresh mova instance has no sessions yet.
    { file: "logs/session_log.md", idPrefix: "SES", allowEmpty: true },
    { file: "logs/error_log.md", idPrefix: "ERR", allowEmpty: true },
  ],
} as const;

const docsDir = dirname(fileURLToPath(import.meta.url));

// The logs ship with the template; treat their absence as template-repo surgery in
// progress rather than a failure of THIS contract.
const active = existsSync(join(docsDir, "logs/session_log.md"));

const ISO_RE = /^\d{4}-\d{2}-\d{2}$/;

function isRealDate(iso: string): boolean {
  if (!ISO_RE.test(iso)) return false;
  const [y, m, d] = iso.split("-").map(Number);
  const t = new Date(Date.UTC(y, m - 1, d));
  return t.getUTCFullYear() === y && t.getUTCMonth() === m - 1 && t.getUTCDate() === d;
}

function todayISO(): string {
  const n = new Date();
  const p = (x: number) => String(x).padStart(2, "0");
  return `${n.getFullYear()}-${p(n.getMonth() + 1)}-${p(n.getDate())}`;
}

interface Entry {
  lineNo: number;
  date: string;
  num: number;
}

for (const log of CONTRACT.logs) {
  const path = join(docsDir, log.file);
  const lines = active && existsSync(path) ? readFileSync(path, "utf8").split("\n") : [];
  const headingRe = new RegExp(`^## (\\d{4}-\\d{2}-\\d{2}) — ${log.idPrefix}-(\\d{3,})$`);

  const entries: Entry[] = [];
  const malformed: string[] = [];
  lines.forEach((line, i) => {
    if (!line.startsWith("## ")) return;
    const m = line.match(headingRe);
    if (m) entries.push({ lineNo: i + 1, date: m[1], num: Number(m[2]) });
    else malformed.push(`${log.file}:${i + 1} "${line}"`);
  });

  describe.skipIf(!active)(`docs/${log.file}`, () => {
    it("exists beside session_log.md", () => {
      expect(existsSync(path), `${log.file} is missing`).toBe(true);
    });

    it(`every ## heading matches \`## YYYY-MM-DD — ${log.idPrefix}-NNN\``, () => {
      expect(malformed, `malformed entry headings:\n  ${malformed.join("\n  ")}`).toEqual([]);
    });

    if (!log.allowEmpty) {
      it("has at least one entry", () => {
        expect(entries.length).toBeGreaterThan(0);
      });
    }

    it("IDs are unique and strictly descending (newest first)", () => {
      for (let i = 1; i < entries.length; i++) {
        expect(
          entries[i].num < entries[i - 1].num,
          `${log.file}:${entries[i].lineNo} ${log.idPrefix}-${entries[i].num} appears below ` +
            `${log.idPrefix}-${entries[i - 1].num} — new entries go at the TOP with the next ID`,
        ).toBe(true);
      }
    });

    it("dates are real, non-increasing down the file, never in the future", () => {
      const today = todayISO();
      for (const e of entries) {
        expect(isRealDate(e.date), `${log.file}:${e.lineNo} date "${e.date}"`).toBe(true);
        expect(e.date <= today, `${log.file}:${e.lineNo} date ${e.date} is in the future`).toBe(true);
      }
      for (let i = 1; i < entries.length; i++) {
        expect(
          entries[i].date <= entries[i - 1].date,
          `${log.file}:${entries[i].lineNo} date ${entries[i].date} is newer than the entry above it`,
        ).toBe(true);
      }
    });
  });
}
