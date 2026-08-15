// mova:engine
/**
 * visualcheck — does a visual teaching page work, before it reaches the learner?
 *
 * Consolidates the checks limba grew in docs/visuals.content.test.ts, plus the token and
 * pack contracts mova adds. limba's history priced every one of these: a page played the
 * WRONG audio on the two rows it existed to teach (duplicate tts ids, 2026-08-10); a
 * hand-copied player block silenced 28 perfectly-wired clips (2026-08-12, caught by the
 * learner — "I click on sound button and it doesn't even change state"); corrected claims
 * kept being taught by live pages days after the docs retracted them.
 *
 * Usable in two places on purpose (why this is a script, not only a test):
 *   pre-publish   node scripts/visualcheck.mjs work/visuals/2026-08-12_page.html
 *   whole folder  node scripts/visualcheck.mjs --all
 *   CI            docs/visuals.content.test.ts imports the check functions below.
 *
 * Checks, per file:
 *   1. audio wiring    — tts ids unique; every data-a target resolves.
 *   2. one player      — at most one player script; pages with buttons have exactly one.
 *   3. reveal pairing  — .rev buttons and .ans blocks are 1:1.
 *   4. answer leak     — scripts/leakcheck.mjs in visual mode, run as a child process and
 *                        FAILED ON HIGH. This gate is not optional and not a second
 *                        command: two first-ever generated lesson pages printed 3 of 3 and
 *                        5 of 5 guided-attempt answers in the open, and both were shipped
 *                        because visualcheck said ✓ and no authoring document named
 *                        leakcheck (found in the first generated lesson pages, 2026-08-15).
 *                        One page, one gate.
 *   5. hub link        — <a class="tohub">, relative href; inside work/visuals/ it must
 *                        be exactly index.html; docs/visual/ pages may point anywhere
 *                        relative (they live outside the deployed folder).
 *   6. self-contained  — no external URL in any src/href, no protocol-sniffing rewrite.
 *                        Subsumes limba's "no hosted copy" check: the only allowed refs
 *                        are same-repo relative paths and data: URIs.
 *   7. token block     — all CORE token keys defined; all three themes present.
 *   8. pack tokens     — gender tokens ⊆ the active pack's declared labels; morpheme
 *                        tokens only when the pack declares inflection. Skipped
 *                        gracefully in template mode (no profile ⇒ no active pack).
 *   9. open word list  — a table outside a .vocab surface that pairs target-language forms
 *                        with their translations and carries no reveal machinery. A
 *                        paradigm table stays open; a word list is a drill surface
 *                        (SPEC §1). The open list is also what feeds check 4: the German
 *                        page's ten-row open table WAS the leak (2026-08-15).
 *  10. verification    — a page that asserts language facts carries the trail
 *                        docs/mechanics/verification.md requires: `?` markers (span.unv),
 *                        or a page-level .src note. On a pack with no dictionary adapter
 *                        state 1 is unreachable, so the note must say so.
 *  11. script range    — characters outside the scripts this instance uses. Two pages
 *                        shipped `formal场合` to a German learner and a mojibake `?uer`
 *                        into a generated taxonomy, through every gate (2026-08-15).
 *                        U+FFFD always fails.
 *  12. retired claims  — regex table read from work/visuals/README.md when present;
 *                        wordings the workspace has corrected must not survive in pages.
 *  13. favicon         — the <link rel="icon"> every page carries, as an embedded data:
 *                        URI (scripts/favicon.mjs). A page opened from the hub and left in
 *                        a tab for weeks is found by its icon; a blank one is lost among
 *                        thirty tabs. Engine pages must carry the canonical mark exactly;
 *                        an instance that re-tints it only has to keep it embedded.
 *
 * Exit 1 on any violation. Zero runtime dependencies.
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join, basename, resolve, sep } from "node:path";
import { canVerify } from "./dictionary.mjs";
import { FAVICON_LINK } from "./favicon.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/** Generated files — rebuilt by scripts at close-out, checked at their source. */
export const GENERATED = new Set(["index.html", "deck.html"]);

/** The CORE layer of the token contract (docs/visual/tokens.css). */
export const CORE_TOKENS = [
  "--bg", "--fg", "--muted", "--line", "--card", "--ok", "--bad", "--hi", "--hiBg",
];

/* ------------------------------------------------------------------ text extraction */

const blankLines = (block) => block.replace(/[^\n]+/g, "");

/**
 * The teaching text of a page: markup minus <style>/<script> bodies and attributes, so a
 * CSS class name or a base64 payload never trips a wording check. Newlines are preserved
 * inside removed blocks so reported line numbers match the file.
 */
export function visibleText(html) {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, blankLines)
    .replace(/<script[\s\S]*?<\/script>/gi, blankLines)
    .replace(/<[^>]+>/g, " ")
    .split("\n");
}

/* ------------------------------------------------------------------------ 1. audio */

/**
 * getElementById returns the FIRST match, so a duplicated id silently rewires every later
 * button to the wrong recording — the learner hears audio that does not match the printed
 * text, which is worse than no audio (limba, 2026-08-10, numbers-questions).
 */
export function checkAudioWiring(html) {
  const offences = [];
  const seen = new Set();
  for (const m of html.matchAll(/\bid="(tts\d+)"/g)) {
    if (seen.has(m[1])) offences.push(`duplicate id="${m[1]}"`);
    seen.add(m[1]);
  }
  for (const m of html.matchAll(/\bdata-a="(tts\d+)"/g)) {
    if (!seen.has(m[1])) offences.push(`data-a="${m[1]}" has no matching id`);
  }
  return offences;
}

/**
 * The player is EMITTED by scripts/tts-embed.mjs, never authored. A hand-copied second
 * player gives every button two click handlers: the first calls play(), the second sees
 * el.paused already false and calls pause() — the button flips on and off inside one
 * click and nothing is heard, while every clip and every data-a stays perfectly valid
 * (limba, 2026-08-12; cost 20 minutes and was caught by the learner, not CI).
 */
export function checkPlayerCount(html) {
  const offences = [];
  const players = (html.match(/getElementById\(\s*b\.dataset\.a\s*\)/g) ?? []).length;
  const hasButtons = /class="tts-play"/.test(html);
  if (players > 1) {
    offences.push(
      `${players} audio player blocks — tts-embed.mjs injects the player itself; ` +
        `a second copy cancels the first and every button goes dead while looking perfect`,
    );
  }
  if (hasButtons && players === 0) {
    offences.push("play buttons but no player block — every button is inert");
  }
  offences.push(...checkPlayerStyle(html));
  return offences;
}

/**
 * The player's CSS has the same single owner as its script, and nothing was looking.
 *
 * This check catches what the one above cannot. tts-embed.mjs guards its own injection
 * correctly, so a duplicated player comes from an agent copying a <style> block wholesale
 * out of an older page — and a duplicated STYLE has no runtime symptom to notice. Measured
 * in limba, 2026-08-15: two live pages carried the player's CSS two and three times over,
 * one of them three copies, and both passed every gate. The script check had no opinion
 * about style, so nothing saw it for weeks.
 *
 * The distinction that makes this safe: DEFINING the player is an offence, OVERRIDING it is
 * not. `.vocab td.au .tts-row{display:block}` is a scoped override — it needs the player to
 * exist, it does not create it. So this counts only unscoped definitions: a `.tts-row` rule
 * that sets the grid, and any `.tts-play` rule that is not part of the shared focus ring.
 */
export function checkPlayerStyle(html) {
  const offences = [];
  const css = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => m[1]).join("\n");
  // A selector is a DEFINITION when .tts-row/.tts-play is the leftmost class in it.
  const grids = [...css.matchAll(/(^|[\n},])\s*\.tts-row\b[^{]*\{([^}]*)\}/g)]
    .filter((m) => /grid-template|display\s*:\s*grid/.test(m[2])).length;
  // Count the BASE rule only. One player block legitimately carries `.tts-play{}`,
  // `.tts-play:hover{}` and `.tts-play.on{}` — three rules, one definition. Counting rules
  // instead of definitions flags every correct page, which is worse than not checking.
  const plays = [...css.matchAll(/(^|[\n},])\s*\.tts-play\s*\{/g)].length;
  if (grids > 1) {
    offences.push(
      `${grids} unscoped .tts-row grid definitions — the player's CSS is emitted by ` +
        `tts-embed.mjs and has one owner. A second copy is a <style> block hand-copied ` +
        `from another page; it has no runtime symptom, which is why it survives`,
    );
  }
  if (plays > 1) {
    offences.push(
      `${plays} unscoped .tts-play definitions — same cause, same owner. Scoped overrides ` +
        `like \`.vocab td.au .tts-row\` are fine: they need the player, they do not define it`,
    );
  }
  return offences;
}

/* ----------------------------------------------------------------------- 3. reveal */

/** A reveal with no answer is a dead button; an answer with no reveal is printed in the open. */
export function checkRevealPairing(html) {
  const rev = (html.match(/class="rev"/g) ?? []).length;
  const ans = (html.match(/class="ans"/g) ?? []).length;
  if (rev !== ans) {
    return [`${rev} reveal button(s) against ${ans} answer block(s) — .rev/.ans must pair 1:1`];
  }
  return [];
}

/* ------------------------------------------------------------------- 4. answer leak */

const LEAKCHECK = join(root, "scripts/leakcheck.mjs");

/**
 * The reveal-pairing check above counts buttons. It cannot see whether the answer behind
 * the button is already printed on the page — and that is the failure that shipped.
 *
 * scripts/leakcheck.mjs has had an HTML mode since limba 2026-08-10, and on 2026-08-15 the
 * first two generated lesson pages scored `3 of 3` and `5 of 5 items give their answer
 * away` under it while visualcheck printed ✓ and exited 0. Neither page's author ran it:
 * leakcheck was named in session_format.md, srs.md and playbooks/drill.md, and in none of
 * SPEC.md, starter.html, teaching.md or playbooks/lesson.md — the four documents an agent
 * building a page actually reads. A gate nobody is told to run is not a gate.
 *
 * So visualcheck runs it. leakcheck is a CLI with no exported functions and top-level
 * `process.exit`, so this shells out rather than re-implementing the fold-and-compare — a
 * second copy of the leak algorithm would drift from the one the scored sets use, which is
 * the whole defect one level up. HIGH fails the page; MED stays advisory (a teaching page
 * teaches the words its drill uses, and MED on a teach page is expected noise).
 */
export function checkAnswerLeak(path, html) {
  if (!/class="ans"/.test(html)) return [];
  if (!existsSync(LEAKCHECK)) {
    return [
      "scripts/leakcheck.mjs is missing — the answer-leak gate cannot run, and a page with " +
        "reveals has not been checked. Restore it from the template before publishing.",
    ];
  }
  const run = spawnSync(process.execPath, [LEAKCHECK, path], { encoding: "utf8" });
  if (run.error) {
    return [`answer-leak gate could not run scripts/leakcheck.mjs: ${run.error.message}`];
  }
  if (run.status === 0) return [];
  const out = run.stdout ?? "";
  if (run.status !== 1 || !out.includes("LEAK CHECK")) {
    return [
      `scripts/leakcheck.mjs exited ${run.status} without checking this page — the ` +
        `answer-leak gate did not run: ${(run.stderr || out).trim().slice(0, 200)}`,
    ];
  }
  const hits = [];
  let inHigh = false;
  for (const line of out.split("\n")) {
    if (/^\s*HIGH —/.test(line)) {
      inHigh = true;
      continue;
    }
    if (!inHigh) continue;
    if (!line.trim()) break;
    hits.push(line.trim());
  }
  const tally = /(\d+ of \d+ items give their answer away)/.exec(out)?.[1] ?? "answers leak";
  return [
    `answer leak — ${tally}. A reveal whose answer is already printed on the page is a ` +
      `worked example wearing an attempt's clothes (teaching.md → the dulap pattern). ` +
      `Rewrite the item over a novel word, or conceal what prints it. ` +
      `Detail: node scripts/leakcheck.mjs ${basename(path)}` +
      (hits.length ? `\n      ${hits.join("\n      ")}` : ""),
  ];
}

/* --------------------------------------------------------------------- 5. hub link */

/**
 * Every page carries the way back (limba learner request, 2026-08-10 — a visual reached
 * from a chat message or a bookmark was a dead end, and the way back was the terminal).
 * The link is relative and stays relative: the folder is deployed whole, so the sibling
 * link is correct from disk and from the site (limba, 2026-08-13). `engineDir` marks the
 * two docs/visual/ pages, which live outside the deployed folder and may point at the hub
 * by any relative path.
 */
export function checkHubLink(html, { engineDir = false } = {}) {
  const offences = [];
  const tag = html.match(/<a\s+class="tohub"[^>]*>/)?.[0];
  if (!tag) return ['no <a class="tohub"> — every page carries the hub link'];
  const href = tag.match(/href="([^"]*)"/)?.[1];
  if (href === undefined) {
    offences.push("hub link has no href");
  } else if (/^(https?:)?\/\//i.test(href)) {
    offences.push(`hub link is absolute (${href}) — it must be relative`);
  } else if (!engineDir && href !== "index.html") {
    offences.push(`hub link href="${href}" — inside work/visuals/ it must be exactly "index.html"`);
  }
  if (/\bdata-hub\b/.test(tag)) {
    offences.push("data-hub is retired — the relative href is correct from disk and from the site");
  }
  return offences;
}

/* --------------------------------------------------------------- 6. self-contained */

/**
 * A page must render offline forever: no CDN, no external font, no hosted copy of
 * anything. The only legitimate refs are relative paths inside the repo and data: URIs
 * (embedded audio). This also subsumes limba's hosted-copy rule — a link to a published
 * artifact and the protocol-sniffing rewrite were the two things that kept a stale
 * second copy alive (limba, 2026-08-13: "currently a link sends me to claude hosted page").
 */
export function checkSelfContained(html) {
  const offences = [];
  for (const m of html.matchAll(/\b(src|href)="([^"]*)"/g)) {
    if (/^(https?:)?\/\//i.test(m[2])) {
      offences.push(`external ${m[1]}: ${m[2].slice(0, 90)}`);
    }
  }
  if (/location\.protocol/.test(html)) {
    offences.push("rewrites a link from location.protocol — relative hrefs already work everywhere");
  }
  return offences;
}

/* ------------------------------------------------------------------ 7. token block */

/**
 * The token keys are the contract (docs/visual/tokens.css); every page inlines the block.
 * All three themes must exist: system preference plus both explicit overrides — a page
 * missing one renders wrong the moment the learner uses the switcher.
 */
export function checkTokenBlock(html) {
  const offences = [];
  for (const key of CORE_TOKENS) {
    if (!new RegExp(`${key}\\s*:`).test(html)) {
      offences.push(`CORE token ${key} is not defined — copy the block from docs/visual/tokens.css`);
    }
  }
  if (!/prefers-color-scheme/.test(html)) offences.push("no prefers-color-scheme theme");
  if (!/\[data-theme="dark"\]/.test(html)) offences.push('no [data-theme="dark"] override');
  if (!/\[data-theme="light"\]/.test(html)) offences.push('no [data-theme="light"] override');
  return offences;
}

/* ------------------------------------------------------------------ 8. pack tokens */

/**
 * Gender and morpheme tokens are pack-scoped. A page colouring a gender the pack does not
 * declare, or marking morphemes for an uninflected language, is teaching structure the
 * language does not have. `pack` comes from scripts/pack.mjs; pass null in template mode
 * (no profile ⇒ no active pack ⇒ nothing to check against).
 */
export function checkPackTokens(html, pack) {
  if (!pack) return [];
  const offences = [];
  const declared = new Set(pack.genders ?? []);
  const seen = new Set();
  for (const m of html.matchAll(/--g-([a-zA-Z0-9]+)/g)) {
    const label = m[1].replace(/Bg$/, "");
    if (!seen.has(label) && !declared.has(label)) {
      offences.push(
        `gender token --g-${label} but the active pack declares only {${[...declared].join(" ")}}`,
      );
    }
    seen.add(label);
  }
  if (!pack.inflection && /--(mk|st)(Bg)?\s*[:)]/.test(html)) {
    offences.push(
      "morpheme tokens (--mk/--st) on a page, but the active pack declares inflection: false",
    );
  }
  return offences;
}

/* ---------------------------------------------------------------- 9. open word list */

/** The `<table>…</table>` blocks of a page, with the line each one starts on. */
function tables(html) {
  const found = [];
  for (const m of html.matchAll(/<table[\s\S]*?<\/table>/gi)) {
    found.push({ html: m[0], line: html.slice(0, m.index).split("\n").length });
  }
  return found;
}

/** The `<td>`/`<th>` cells of one row, as raw markup. */
function cells(row) {
  return [...row.matchAll(/<(td|th)\b[\s\S]*?<\/\1>/gi)].map((m) => m[0]);
}

const cellText = (cell) => cell.replace(/<[^>]+>/g, " ").replace(/&[a-z]+;/gi, " ").trim();

/** A cell that prints a target-language form: the SPEC's `.l2`, or a lang-tagged span. */
const isTargetCell = (cell) => /class="[^"]*\bl2\b[^"]*"/.test(cell) || /\blang="/.test(cell);

/** A cell of meta-language prose — the translation, the "when to use it", the note. */
const isProseCell = (cell) => !isTargetCell(cell) && /[\p{L}]{3,}/u.test(cellText(cell));

/**
 * SPEC §1: the two-layer reveal covers every drill surface AND every teach-page word list —
 * "a table that can only be read is a table the learner re-drills somewhere else".
 *
 * The German page opened with a ten-row table of phrase · translation · when-to-use, fully
 * printed, and then drilled those same ten rows in its `.vocab` surface below. That open
 * table is also what made its three guided attempts score 3 of 3 leaked: the answers were
 * sitting in section 1 (found in the first generated lesson pages, 2026-08-15).
 *
 * The distinction this check has to hold, and states in its message: a **paradigm table** is
 * reference material and SHOULD stay open — it prints the same lexeme in several forms
 * across the row (`prieten` → `prieten`+`i`), so the row teaches a pattern, and
 * teaching.md's "mark what changes" exists to make that pattern visible at a glance. A
 * **word list** pairs ONE target form with its meaning, which is exactly the self-test the
 * learner needs to do with one side hidden. So: one target-language cell plus prose in the
 * row ⇒ word-list row; two or more target cells ⇒ paradigm row, left alone.
 */
export function checkOpenWordList(html) {
  const offences = [];
  for (const t of tables(html)) {
    // Reveal machinery lives inside the table on a drill surface: `.cover`/`.val` per cell,
    // `tr.row` per row (the .vocab surface of starter.html), or an inline `.rev` button.
    const hasReveal = /class="[^"]*\b(cover|val|l2-side|l1-side|ans-side|rev)\b/.test(t.html);
    if (hasReveal) continue;
    // `</tr>` is optional in HTML and some generators omit it — falling back to a split on
    // `<tr` keeps an unclosed table from reading as one giant row and passing silently.
    const rows =
      t.html.match(/<tr[\s\S]*?<\/tr>/gi) ??
      t.html.split(/<tr\b/i).slice(1).map((r) => `<tr${r}`);
    let paired = 0;
    for (const row of rows) {
      const cs = cells(row);
      const targets = cs.filter(isTargetCell).length;
      const prose = cs.filter(isProseCell).length;
      if (targets === 1 && prose >= 1) paired += 1;
    }
    // Three rows, not one: a worked example or a single illustrative pair inside an
    // otherwise structural table is not a word list, and failing those would push agents
    // to hide reference material. Ten rows was the shipped defect.
    if (paired >= 3) {
      offences.push(
        `line ${t.line}: open word list — ${paired} rows pair one target-language form with ` +
          `its translation and the table carries no reveal machinery. A word list IS a drill ` +
          `surface (SPEC §1): wrap it in .vocab with the mode filter and per-row reveal, or ` +
          `delete it if the page already drills these words below. A PARADIGM table is the ` +
          `other thing and stays open: its rows show the same word in two or more ` +
          `target-language forms, which is reference the learner reads, not a self-test.`,
      );
    }
  }
  return offences;
}

/* -------------------------------------------------------------- 10. verification */

/**
 * docs/mechanics/verification.md: every asserted language fact is dictionary-verified,
 * tutor-confirmed, or **visibly marked unverified** — "there is no fourth state", and the
 * policy names visuals explicitly ("an unverified fact the learner cannot see is state-3 in
 * the ledger and state-4 in reality").
 *
 * Both first-generated pages asserted in bulk with nothing: the Romanian page ~60 facts (15
 * genders, 15 plurals, 30 definite forms), the German page ten phrases under a pack that
 * ships no dictionary at all, so every one of its facts was state 3 by construction. Zero
 * markers, no source trail, both green (found in the first generated lesson pages,
 * 2026-08-15).
 *
 * "Asserted fact" cannot be detected exactly. The proxy is the surface that carries facts in
 * bulk: a `.vocab` drill surface, or any table printing target-language forms. What the page
 * must then carry is one of:
 *   - `span.unv` — the `?` marker of verification.md, on the forms that are not attested;
 *   - `.src`     — the page-level source note: what attested these facts, and when.
 * A pack with NO dictionary adapter makes state 1 unreachable, so the note must SAY the
 * page runs unattested — verification.md's "honest, never silent".
 */
export function checkVerification(html, pack) {
  const asserts =
    /class="vocab\b/.test(html) ||
    tables(html).some((t) => /class="[^"]*\bl2\b/.test(t.html));
  if (!asserts) return [];
  const hasMarker = /class="[^"]*\bunv\b/.test(html);
  const notes = [...html.matchAll(/<(\w+)[^>]*class="[^"]*\bsrc\b[^"]*"[^>]*>([\s\S]*?)<\/\1>/g)]
    .map((m) => cellText(m[2]));
  const unattested = pack ? !canVerify(pack.dictionary) : false;

  if (unattested) {
    const banner = notes.some((n) => /unverified|unattested|not verified/i.test(n));
    if (!banner) {
      return [
        `pack "${pack.code}" ships no dictionary adapter, so no fact on this page can reach ` +
          `verification state 1 (docs/mechanics/verification.md → "the null adapter — ` +
          `honest, never silent"). The page must carry the unverified banner: a .src note ` +
          `saying the facts are the agent's word until a tutor confirms them, plus span.unv ` +
          `"?" markers on the forms. Dropping the markers because nothing checks them is the ` +
          `one thing a null-adapter instance may never do.`,
      ];
    }
    return [];
  }
  if (!hasMarker && notes.length === 0) {
    return [
      `this page asserts language facts (a vocabulary or paradigm table) and carries no ` +
        `verification trail — no span.unv "?" marker and no .src source note. ` +
        `docs/mechanics/verification.md allows three states and no fourth: attested via the ` +
        `pack's dictionary adapter (name the source and date in a .src note), ` +
        `tutor-confirmed (same), or marked "?" so the learner can see it is a claim.`,
    ];
  }
  return [];
}

/* -------------------------------------------------------------- 11. script range */

/** Scripts a script-range violation is reported as. Latin/Common/Inherited are the base. */
const SCRIPT_TESTS = [
  ["Cyrillic", /\p{Script=Cyrillic}/u],
  ["Greek", /\p{Script=Greek}/u],
  ["Han", /\p{Script=Han}/u],
  ["Hiragana", /\p{Script=Hiragana}/u],
  ["Katakana", /\p{Script=Katakana}/u],
  ["Hangul", /\p{Script=Hangul}/u],
  ["Arabic", /\p{Script=Arabic}/u],
  ["Hebrew", /\p{Script=Hebrew}/u],
  ["Devanagari", /\p{Script=Devanagari}/u],
  ["Thai", /\p{Script=Thai}/u],
  ["Armenian", /\p{Script=Armenian}/u],
  ["Georgian", /\p{Script=Georgian}/u],
];

/**
 * Language ⇒ non-Latin script, by ISO code and by English name (the two forms the profile
 * uses: `pack: uk`, `target_language: Ukrainian`). Anything absent is treated as Latin,
 * which is always allowed — the list only has to grow when a script is wrongly flagged.
 */
export const SCRIPT_BY_LANGUAGE = {
  ru: "Cyrillic", russian: "Cyrillic", uk: "Cyrillic", ukrainian: "Cyrillic",
  be: "Cyrillic", belarusian: "Cyrillic", bg: "Cyrillic", bulgarian: "Cyrillic",
  sr: "Cyrillic", serbian: "Cyrillic", mk: "Cyrillic", macedonian: "Cyrillic",
  kk: "Cyrillic", kazakh: "Cyrillic", ky: "Cyrillic", kyrgyz: "Cyrillic",
  mn: "Cyrillic", mongolian: "Cyrillic",
  el: "Greek", greek: "Greek",
  zh: "Han", chinese: "Han", mandarin: "Han", cantonese: "Han",
  ja: "Han Hiragana Katakana", japanese: "Han Hiragana Katakana",
  ko: "Hangul", korean: "Hangul",
  ar: "Arabic", arabic: "Arabic", fa: "Arabic", persian: "Arabic", farsi: "Arabic",
  ur: "Arabic", urdu: "Arabic",
  he: "Hebrew", hebrew: "Hebrew", yi: "Hebrew", yiddish: "Hebrew",
  hi: "Devanagari", hindi: "Devanagari", mr: "Devanagari", marathi: "Devanagari",
  ne: "Devanagari", nepali: "Devanagari", sa: "Devanagari", sanskrit: "Devanagari",
  th: "Thai", thai: "Thai",
  hy: "Armenian", armenian: "Armenian",
  ka: "Georgian", georgian: "Georgian",
};

/**
 * Without a profile there is nothing to derive from, so the default is permissive — Latin
 * plus the two scripts the engine's own reference pages print (the gallery's Ukrainian
 * anchor `мама`, and Greek for the same reason a linguistics example would use it). It is
 * permissive, not silent: it still catches CJK, Arabic, Hebrew, Devanagari and mojibake.
 */
export const DEFAULT_SCRIPTS = ["Latin", "Cyrillic", "Greek"];

/** The scripts an instance may legitimately print, from its profile languages + pack code. */
export function allowedScripts(languages) {
  const allowed = new Set(["Latin"]);
  if (!languages || languages.length === 0) {
    for (const s of DEFAULT_SCRIPTS) allowed.add(s);
    return allowed;
  }
  for (const lang of languages) {
    const scripts = SCRIPT_BY_LANGUAGE[String(lang).trim().toLowerCase()];
    if (scripts) for (const s of scripts.split(" ")) allowed.add(s);
  }
  return allowed;
}

/**
 * A character from a script this instance does not use is not a language fact — it is a
 * generation artifact, and it reaches the learner as noise in the middle of a word they are
 * trying to learn. The German page printed `formal场合` in a learner-facing table cell,
 * twice, and the same run wrote a mojibake `?uer` into the instance's error taxonomy; both
 * passed every gate (found in the first generated lesson pages, 2026-08-15).
 *
 * Deliberately permissive: `\p{Script=Common}` and `\p{Script=Inherited}` — punctuation,
 * digits, arrows, the circled numerals, the play glyph — are always fine, and an undeclared
 * language falls back to Latin rather than to a failure. U+FFFD is the one absolute: a
 * replacement character means bytes were already lost.
 *
 * `engineDir` pages (docs/visual/) carry labelled reference-pack specimens, so they get the
 * permissive default set in every instance — the gallery's Ukrainian anchor must not fail
 * inside a workspace learning Spanish.
 */
export function checkScriptRange(html, { languages = null, engineDir = false } = {}) {
  const allowed = allowedScripts(engineDir ? null : languages);
  const derived = Boolean(languages?.length) && !engineDir;
  const offences = [];
  const seen = new Set();
  const lines = visibleText(html);
  lines.forEach((line, i) => {
    for (const m of line.matchAll(/[^\x00-\x7F]/gu)) {
      const ch = m[0];
      if (seen.has(ch)) continue;
      if (ch === "�") {
        seen.add(ch);
        offences.push(
          `line ${i + 1}: U+FFFD replacement character in learner-facing text — the bytes ` +
            `behind it are already lost. Re-generate the string; never hand-patch around it.`,
        );
        continue;
      }
      if (/[\p{Script=Common}\p{Script=Inherited}]/u.test(ch)) continue;
      const script = SCRIPT_TESTS.find(([, re]) => re.test(ch))?.[0]
        ?? (/\p{Script=Latin}/u.test(ch) ? "Latin" : "unidentified script");
      if (allowed.has(script)) continue;
      seen.add(ch);
      const code = `U+${ch.codePointAt(0).toString(16).toUpperCase().padStart(4, "0")}`;
      offences.push(
        `line ${i + 1}: "${ch}" (${code}, ${script}) is outside the scripts this instance ` +
          `uses {${[...allowed].join(" ")}}${derived ? "" : " (permissive default — no profile to derive from)"} ` +
          `— in learner-facing text that is a generation artifact, not language: ` +
          `"${line.trim().slice(0, 60)}"`,
      );
    }
  });
  return offences;
}

/* -------------------------------------------------------------- 12. retired claims */

/**
 * When a claim is corrected, the correction-sweep updates the pages that taught it — and
 * this table backstops the wordings a regex can catch, because the learner re-reads pages
 * long after the transcript dies: a stale page outvotes a correct chat (limba: the "ă has
 * no anchor" claim survived in two live pages for a week after the docs corrected it).
 *
 * The table is INSTANCE-owned — work/visuals/README.md, "Retired claims" section, rows of
 * | `/pattern/flags` | what was retired | replaced by |. Rows are permanent.
 */
export function readRetiredClaims(readmePath) {
  if (!existsSync(readmePath)) return [];
  const text = readFileSync(readmePath, "utf8");
  const section = /##\s*Retired claims([\s\S]*?)(?=\n##\s|$)/i.exec(text);
  if (!section) return [];
  const rules = [];
  for (const line of section[1].split("\n")) {
    const m = /^\|\s*`\/(.+?)\/([a-z]*)`\s*\|([^|]*)\|([^|]*)\|/.exec(line.trim());
    if (!m) continue;
    rules.push({
      pattern: new RegExp(m[1], m[2]),
      what: m[3].trim(),
      replacedBy: m[4].trim(),
    });
  }
  return rules;
}

export function checkRetiredClaims(html, rules) {
  const offences = [];
  if (!rules?.length) return offences;
  const lines = visibleText(html);
  for (const { pattern, what, replacedBy } of rules) {
    lines.forEach((line, i) => {
      if (pattern.test(line)) {
        offences.push(
          `line ${i + 1}: retired claim (${what}) still taught — replaced by ${replacedBy}: ` +
            `"${line.trim().slice(0, 80)}"`,
        );
      }
    });
  }
  return offences;
}

/* -------------------------------------------------------------------- 13. favicon */

/**
 * The hub is the learner's one bookmark and study pages live in tabs for months, so every
 * page carries the mark (scripts/favicon.mjs). It must be EMBEDDED: a sibling icon file
 * dies the moment the page is opened from somewhere else, and a hosted one breaks the
 * offline rule that check 6 enforces — so the icon is a data: URI or it is nothing.
 *
 * Engine pages (docs/visual/) are held to the canonical string byte for byte: they are
 * what every authored page is copied from, so a drifting mark there spreads. An instance
 * page only has to carry an embedded icon — a re-themed workspace may re-tint its own.
 */
export function checkFavicon(html, { engineDir = false } = {}) {
  const tag = html.match(/<link\b[^>]*\brel="[^"]*\bicon\b[^"]*"[^>]*>/i)?.[0];
  if (!tag) {
    return [
      'no <link rel="icon"> — every page carries the mark, embedded. Paste the line ' +
        "printed by: node scripts/favicon.mjs",
    ];
  }
  const href = tag.match(/href="([^"]*)"/)?.[1] ?? "";
  if (!href.startsWith("data:")) {
    return [
      `favicon href is not embedded (${href.slice(0, 60)}) — a page is self-contained, so ` +
        "the icon travels inside it: node scripts/favicon.mjs",
    ];
  }
  if (engineDir && tag !== FAVICON_LINK) {
    return [
      "favicon differs from the canonical mark in scripts/favicon.mjs — engine pages are " +
        "what authored pages are copied from, so this one drifts into every page built next",
    ];
  }
  return [];
}

/* ----------------------------------------------------------------------- one file */

/**
 * All checks over one file. `pack` may be null (template mode). `retired` is the parsed
 * rule table (readRetiredClaims). `languages` is the instance's language list, for the
 * script-range check — profile languages plus the pack code, or null to take the permissive
 * default. Returns offence strings, empty when the page is clean.
 */
export function checkFile(path, { pack = null, retired = [], languages = null } = {}) {
  const html = readFileSync(path, "utf8");
  const engineDir = resolve(path).split(sep).join("/").includes("docs/visual/");
  return [
    ...checkAudioWiring(html),
    ...checkPlayerCount(html),
    ...checkRevealPairing(html),
    ...checkAnswerLeak(path, html),
    ...checkHubLink(html, { engineDir }),
    ...checkSelfContained(html),
    ...checkTokenBlock(html),
    ...checkPackTokens(html, pack),
    ...checkOpenWordList(html),
    ...checkVerification(html, pack),
    ...checkScriptRange(html, { languages, engineDir }),
    ...checkRetiredClaims(html, retired),
    ...checkFavicon(html, { engineDir }),
  ];
}

/**
 * The languages an instance legitimately prints: everything the profile names, plus the
 * pack code. Codes and English names both work (SCRIPT_BY_LANGUAGE keys both). Returns null
 * in template mode, which selects the permissive default set.
 */
export function instanceLanguages(profile, pack) {
  if (!profile) return null;
  const langs = [
    profile.get("target_language"),
    profile.get("meta_language"),
    ...profile.list("native_languages"),
    ...profile.list("contrast_ranking").filter((t) => t !== ">"),
    pack?.code,
    profile.get("pack"),
  ].filter(Boolean);
  return langs.length ? langs : null;
}

/* ----------------------------------------------------------------------------- CLI */

const isMain =
  process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  const args = process.argv.slice(2);
  let files;
  if (args.includes("--all")) {
    // Authored instance pages PLUS the engine's own reference pages — docs/visuals.content
    // .test.ts checks those two, so a `--all` that skipped them made the CLI and the CI
    // test disagree about what "everything" means, and reported a vacuous pass on a fresh
    // instance (found by the first full setup proof run, 2026-08-14).
    const dir = join(root, "work/visuals");
    const authored = existsSync(dir)
      ? readdirSync(dir)
          .filter((f) => f.endsWith(".html") && !GENERATED.has(f))
          .sort()
          .map((f) => join(dir, f))
      : [];
    const reference = ["docs/visual/starter.html", "docs/visual/gallery.html"]
      .map((p) => join(root, p))
      .filter((p) => existsSync(p));
    files = [...authored, ...reference];
    if (authored.length === 0) {
      console.log(
        `visualcheck: no authored pages in work/visuals/ yet — checking the ${reference.length} ` +
          `reference page(s) only. (A workspace before its first lesson; not an error.)`,
      );
    }
    if (files.length === 0) {
      console.error("visualcheck: nothing to check — no authored and no reference pages found.");
      process.exit(1);
    }
  } else {
    files = args.filter((a) => !a.startsWith("--"));
    if (files.length === 0) {
      console.error("usage: node scripts/visualcheck.mjs <file.html>...  |  --all");
      process.exit(1);
    }
  }

  let pack = null;
  try {
    const { loadPack } = await import("./pack.mjs");
    pack = await loadPack();
  } catch {
    console.log("visualcheck: no active pack (template mode) — pack-token checks skipped.");
  }
  let profile = null;
  try {
    const { loadProfile } = await import("./profile.mjs");
    profile = loadProfile();
  } catch {
    profile = null;
  }
  const languages = instanceLanguages(profile, pack);
  const retired = readRetiredClaims(join(root, "work/visuals/README.md"));

  let bad = 0;
  for (const file of files) {
    const offences = checkFile(file, { pack, retired, languages });
    if (offences.length) {
      bad += 1;
      console.error(`\n✗ ${basename(file)}`);
      for (const o of offences) console.error(`  - ${o}`);
    } else {
      console.log(`✓ ${basename(file)}`);
    }
  }
  process.exit(bad ? 1 : 0);
}
