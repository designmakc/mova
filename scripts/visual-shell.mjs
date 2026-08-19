// mova:engine
/**
 * The canonical frame of a teaching page — derived from docs/visual/starter.html.
 *
 * WHY THIS EXISTS. An authored visual is ~50 KB of HTML (the audio is generated, not
 * written), and ~9 KB of that is frame: the token block, the base layout, the theme and
 * reveal scripts. It was retyped or hand-copied for every page, which costs ~2,500 output
 * tokens a lesson and, worse, drifts. Measured in limba, 2026-08-15: two live pages carry
 * the TTS player's CSS two and three times over, because an agent building a page copied a
 * <style> block wholesale from an older page. `visualcheck` check 2 catches a duplicated
 * player SCRIPT and has no opinion about a duplicated STYLE, so nothing saw it. A frame
 * with one definition cannot drift; a frame that is copied always will.
 *
 * WHY IT READS starter.html INSTEAD OF HOLDING ITS OWN COPY. limba's shell hardcodes the
 * frame, because limba has no separate reference page. mova already ships one, and
 * docs/visual/SPEC.md points every author at it. Pasting that CSS into this module would
 * create a second definition — the exact failure this file exists to prevent, one level up.
 * So starter.html stays the single definition and this module is a reader of it. Re-craft
 * the theme in docs/visual/tokens.css, paste it into starter.html once, and every page
 * generated afterwards carries it.
 *
 * TWO CONTRACTS THIS FILE MUST KEEP, both asserted by scripts/visual-shell.test.ts:
 *
 *   The tokens satisfy check 7 by construction — every name in visualcheck's CORE_TOKENS
 *   is defined in all three theme blocks (bare :root, prefers-color-scheme, and both
 *   [data-theme] overrides). The test derives its expectation FROM that array, so adding a
 *   token to the gate fails here until the frame defines it.
 *
 *   The frame ships NO audio player: no unscoped `.tts-row` grid, no `.tts-play`
 *   definition, no player script. scripts/tts-embed.mjs owns those and injects them behind
 *   its own marker. Scoped overrides (`.vocab td.au .tts-row`) and the shared focus ring
 *   are allowed and necessary — they need the player to exist, they do not define it. That
 *   distinction is the whole rule.
 *
 * Nothing here is loaded over a network: check 6 forbids any external URL, because the rule
 * has always been that a page renders offline forever. The frame is inlined at BUILD time
 * by scripts/newvisual.mjs, never linked at runtime.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
export const STARTER = "docs/visual/starter.html";

/**
 * Split the reference page into the frame's two halves.
 *
 * `head` is everything from <!doctype> through the opening <body> and its .wrap — tokens,
 * base CSS, the scoped drill-surface CSS. `tail` is the trailing <script> blocks plus the
 * closing tags. Between them goes the page's own content, and nothing else.
 */
export function frame(starterHtml = readFileSync(join(ROOT, STARTER), "utf8")) {
  const bodyOpen = starterHtml.indexOf("<body>");
  if (bodyOpen === -1) throw new Error(`${STARTER}: no <body> — the reference page is malformed.`);
  const head = starterHtml.slice(0, bodyOpen + "<body>".length);

  // The scripts are the behaviour half of the frame: theme switcher, drill-surface modes,
  // per-item reveal. Taken as a block from the first <script> after the last content, so a
  // new frame script is picked up here without editing this file.
  const scripts = [...starterHtml.matchAll(/<script>[\s\S]*?<\/script>/g)].map((m) => m[0]);
  return { head, scripts };
}

/**
 * Just the token block — the pinned theme, with no layout attached.
 *
 * A GENERATED DASHBOARD NEEDS THE PALETTE AND NONE OF THE PAGE. The hub, the deck and the
 * profile page each lay themselves out; what they must share is the theme, or the workspace
 * stops reading as one set of pages. Before this export the token block lived in four
 * places — here, hub.mjs, deck.mjs, and a fourth the moment a profile page was proposed —
 * which is the drift this module was written to end, one level up (limba PORT-022).
 *
 * The slice is delimited by the two banner comments starter.html already carries, so the
 * theme stays editable as CSS in the file a human looks at. Both banners missing is a
 * malformed reference page and throws: silently returning an empty palette would ship a
 * dashboard with no colours and no error.
 */
export function tokens(starterHtml = readFileSync(join(ROOT, STARTER), "utf8")) {
  const from = starterHtml.indexOf("/* ============ TOKEN BLOCK");
  const to = starterHtml.indexOf("/* ============ COMPONENTS");
  if (from === -1 || to === -1 || to <= from) {
    throw new Error(
      `${STARTER}: the TOKEN BLOCK / COMPONENTS banner comments delimit the palette — ` +
        `one of them is missing or out of order, so no theme can be extracted.`,
    );
  }
  return starterHtml.slice(from, to).trimEnd();
}

/** Strip the reference page's own identity so a generated page carries its own. */
function retitle(head, { title, marker }) {
  return head
    .replace(/<!-- mova:engine -->/, `<!-- ${marker} -->`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
    // The reference page's long "how to copy this file" comment is instructions for a
    // human copying by hand. A generated page has already had them applied.
    .replace(/<!--\s*\n\s*docs\/visual\/starter\.html[\s\S]*?-->\n/, "")
    // starter.html links up and out of docs/visual/; a page in work/visuals/ sits beside
    // the hub, and check 5 requires exactly index.html there.
    .replace(/(<a class="tohub" href=")[^"]*(")/, "$1index.html$2");
}

/**
 * Assemble a complete page: frame + content.
 *
 * `vocab: true` keeps the drill-surface skeleton; otherwise the page is prose and tables
 * only. The scoped `.vocab` CSS stays either way — it is scoped, it costs ~1 KB, and
 * removing it is how a page later grows a hand-written second copy.
 */
export function page({ title, sub = "", body, vocab = false, marker = "mova:instance" }) {
  const { head, scripts } = frame();
  return [
    retitle(head, { title, marker }),
    `<div class="wrap">`,
    `<a class="tohub" href="index.html">← hub</a>`,
    `<h1>${title}</h1>`,
    sub ? `<p class="sub">${sub}</p>` : "",
    body,
    vocab ? VOCAB_SKELETON : "",
    `</div>`,
    ...scripts,
    `<!-- No player script here: tts-embed.mjs appends it once, behind its own marker. -->`,
    `</body>`,
    `</html>`,
    ``,
  ].filter(Boolean).join("\n");
}

/**
 * The two-layer drill surface, empty. Three modes, because a test mode that hides only one
 * row type leaks the rest through the others (limba u01-deck defect, 2026-08-10).
 */
export const VOCAB_SKELETON = `
<h2><span class="n">7</span> The words</h2>
<div class="vocab m-browse" id="vocab">
  <div class="modes">
    <button class="on" data-m="m-browse">browse</button>
    <button data-m="m-l2l1">target → support</button>
    <button data-m="m-l1l2">support → target</button>
  </div>
  <div class="scroll">
    <table>
      <tr><th class="au"></th><th>target</th><th>support</th><th>note</th></tr>
      <tr class="row">
        <td class="au"><!-- <div class="tts" data-text="…"></div> --></td>
        <td class="l2-side"><span class="val">—</span><span class="cover">•••</span></td>
        <td class="l1-side"><span class="val">—</span><span class="cover">•••</span></td>
        <td class="ans-side"><span class="val">—</span><span class="cover">•••</span></td>
      </tr>
    </table>
  </div>
</div>`;
