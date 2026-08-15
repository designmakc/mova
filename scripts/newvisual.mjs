#!/usr/bin/env node
// mova:engine
/**
 * Start a teaching page with its frame already correct.
 *
 *   node scripts/newvisual.mjs posesiv            # → work/visuals/YYYY-MM-DD_posesiv.html
 *   node scripts/newvisual.mjs posesiv --vocab    # …with the word-list drill surface
 *   node scripts/newvisual.mjs posesiv --date 2026-08-16
 *
 * WHY. The frame of a page — tokens, base CSS, hub link, theme and reveal scripts — is
 * ~9 KB that was retyped or copied for every visual, and copying drifted: two live limba
 * pages carry the audio player's CSS two and three times over (measured 2026-08-15). This
 * writes the frame from scripts/visual-shell.mjs, which reads the pinned reference page, so
 * the agent writes only the lesson.
 *
 * The skeleton this emits PASSES EVERY GATE in scripts/visualcheck.mjs before a word of
 * content is added — that is the point, and scripts/visual-shell.test.ts asserts it. A
 * skeleton that starts red teaches the agent to ignore the gate.
 *
 * Refuses to overwrite. A page that already exists is either prepared material waiting for
 * its session or a sibling's work in flight (session_format.md, orient step 3), and neither
 * is yours to replace.
 */
import { writeFileSync, existsSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { page } from "./visual-shell.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "work/visuals");

const argv = process.argv.slice(2);
const flag = (n) => { const i = argv.indexOf(`--${n}`); return i > -1 ? argv[i + 1] : undefined; };

const todayISO = () => {
  const n = new Date();
  const p = (x) => String(x).padStart(2, "0");
  return `${n.getFullYear()}-${p(n.getMonth() + 1)}-${p(n.getDate())}`;
};

const name = argv.find((a) => !a.startsWith("--") && a !== flag("date"));
if (!name) {
  console.error("usage: newvisual.mjs <slug> [--vocab] [--date YYYY-MM-DD]");
  console.error("  <slug>   lowercase, hyphenated, no date — the date is prepended for you");
  process.exit(1);
}
if (!/^[a-z0-9][a-z0-9-]*$/.test(name)) {
  console.error(`newvisual: "${name}" — slug must be lowercase letters, digits and hyphens`);
  process.exit(1);
}

const date = flag("date") || todayISO();
if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
  console.error(`newvisual: --date must be YYYY-MM-DD, got "${date}"`);
  process.exit(1);
}

const file = join(OUT, `${date}_${name}.html`);
if (existsSync(file)) {
  console.error(`newvisual: ${date}_${name}.html already exists — refusing to overwrite.`);
  console.error("  A page that exists is prepared material or a sibling session's work in flight.");
  console.error("  Open it (orient step 3). To supersede it, build under a new slug.");
  process.exit(1);
}

/**
 * The skeleton. Every placeholder is a beat of docs/mechanics/teaching.md, in order, so the
 * page opens with the shape a lesson needs rather than an empty div. The .src note is here
 * because check 10 requires a verification trail on any page that asserts language facts —
 * fill it in or delete the table, never delete the note and keep the table.
 */
const body = `<div class="lede">
  <!-- BEAT ① PLACEMENT — which unit, what this opens or closes, what the learner can do
       afterwards that they cannot now. One or two sentences. -->
</div>

<h2><span class="n">1</span> The whole system</h2>
<div class="card">
  <!-- BEAT ② — the complete paradigm, before any contrast. Tables live here, never in chat. -->
  <div class="scroll">
    <table>
      <tr><th>Form</th><th>Target</th><th>Meaning</th></tr>
      <tr><td>—</td><td class="l2">—</td><td>—</td></tr>
    </table>
  </div>
</div>

<h2><span class="n">2</span> The load</h2>
<div class="rule">
  <!-- BEAT ③ — what must be memorised, as a NUMBER, and what follows from it for free. -->
</div>

<h2><span class="n">3</span> The delta</h2>
<div class="anchor">
  <!-- BEAT ④ — the contrast, ranked per the profile's contrast_ranking and grounded in
       docs/reference/transfer.md. Never stack two anchors. -->
</div>
<div class="warn">
  <!-- The trap. One per page carries more than three. -->
</div>

<h2><span class="n">4</span> Worked examples</h2>
<div class="card">
  <!-- BEAT ⑤ — the rule run forwards on real words, every target-language string
       translated on first appearance. -->
</div>

<h2><span class="n">5</span> First contact only</h2>
<div class="card">
  <!-- BEAT ⑥ — what was NAMED but not taught, and the unit where it returns. This is what
       makes "complete" believable everywhere else on the page. -->
</div>

<h2><span class="n">6</span> Your turn</h2>
<div class="card">
  <div class="q"><!-- BEAT ⑦ — a guided attempt on a NOVEL item, pushed through the taught
       procedure. An item whose answer sits in a table above is a worked example wearing an
       attempt's clothes. --></div>
  <button class="rev">Show</button>
  <div class="ans"><!-- the answer, printed NOWHERE else on this page (check 4) --></div>
</div>

<h2><span class="n">7</span> Carry away</h2>
<div class="rule">
  <!-- BEAT ⑧ — the compressed rule. Run it over the hardest row of the table above before
       shipping: it may compress the rule, never contradict it. A line that cannot reproduce
       that row is a competing rule, and the short one is what the learner runs from memory. -->
</div>

<div class="src">
  <!-- Verification trail (check 10). Name what attested these forms and when, or mark
       unattested forms with <span class="unv">?</span> per docs/mechanics/verification.md.
       Sweep the ledger first: node scripts/factcheck.mjs -->
</div>`;

mkdirSync(OUT, { recursive: true });
writeFileSync(file, page({
  title: name.replace(/-/g, " "),
  sub: "<!-- one line: what this page is for -->",
  body,
  vocab: argv.includes("--vocab"),
}));

console.log(`wrote work/visuals/${date}_${name}.html`);
console.log("");
console.log("Next, in order:");
console.log("  1. write the content — the frame, hub link and reveal script are already correct");
console.log("  2. audio placeholders:  <div class=\"tts\" data-text=\"…\" data-en=\"…\"></div>");
console.log(`  3. node scripts/tts-embed.mjs work/visuals/${date}_${name}.html`);
console.log(`  4. node scripts/visualcheck.mjs work/visuals/${date}_${name}.html   ← the gate`);
console.log("  5. green, then add the index row in work/visuals/README.md, then send it");
