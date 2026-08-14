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
 *   4. hub link        — <a class="tohub">, relative href; inside work/visuals/ it must
 *                        be exactly index.html; docs/visual/ pages may point anywhere
 *                        relative (they live outside the deployed folder).
 *   5. self-contained  — no external URL in any src/href, no protocol-sniffing rewrite.
 *                        Subsumes limba's "no hosted copy" check: the only allowed refs
 *                        are same-repo relative paths and data: URIs.
 *   6. token block     — all CORE token keys defined; all three themes present.
 *   7. pack tokens     — gender tokens ⊆ the active pack's declared labels; morpheme
 *                        tokens only when the pack declares inflection. Skipped
 *                        gracefully in template mode (no profile ⇒ no active pack).
 *   8. retired claims  — regex table read from work/visuals/README.md when present;
 *                        wordings the workspace has corrected must not survive in pages.
 *
 * Exit 1 on any violation. Zero dependencies.
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, basename, resolve, sep } from "node:path";

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

/* --------------------------------------------------------------------- 4. hub link */

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

/* --------------------------------------------------------------- 5. self-contained */

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

/* ------------------------------------------------------------------ 6. token block */

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

/* ------------------------------------------------------------------ 7. pack tokens */

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

/* --------------------------------------------------------------- 8. retired claims */

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

/* ----------------------------------------------------------------------- one file */

/**
 * All checks over one file. `pack` may be null (template mode). `retired` is the parsed
 * rule table (readRetiredClaims). Returns offence strings, empty when the page is clean.
 */
export function checkFile(path, { pack = null, retired = [] } = {}) {
  const html = readFileSync(path, "utf8");
  const engineDir = resolve(path).split(sep).join("/").includes("docs/visual/");
  return [
    ...checkAudioWiring(html),
    ...checkPlayerCount(html),
    ...checkRevealPairing(html),
    ...checkHubLink(html, { engineDir }),
    ...checkSelfContained(html),
    ...checkTokenBlock(html),
    ...checkPackTokens(html, pack),
    ...checkRetiredClaims(html, retired),
  ];
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
  const retired = readRetiredClaims(join(root, "work/visuals/README.md"));

  let bad = 0;
  for (const file of files) {
    const offences = checkFile(file, { pack, retired });
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
