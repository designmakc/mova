// mova:engine
/**
 * Deck generator — the drillable view of the ledgers, rebuilt on demand.
 *
 * The hand-authored U01 deck in the reference instance proved the artifact type (30% → 72%
 * within one session) and then demonstrated its own flaw: a dated snapshot with the state
 * hardcoded into the HTML is lying by the next session (limba, 2026-08-07 retro). This
 * script is the correct shape that insight asked for: the deck is generated FROM
 * state/vocab.md and state/grammar.md, so tiers, notes and word list are exactly the
 * ledgers' at generation time — and the page says so, with its date and one-line regen
 * command, instead of pretending currency.
 *
 * Two leak rules are structural here, not editorial: in a test mode the concealed side
 * hides for grammar rows exactly as for vocab rows (the U01 deck hid only vocab, so its
 * grammar cards printed the answers — limba, 2026-08-10 audit), and the notes, which
 * legitimately name the answer, stay behind their own fold that only exists once the row
 * is revealed.
 *
 * What the page carries beyond the rows (limba learner request, 2026-08-10):
 *   - every row is typed — the pack's part-of-speech facets — from the ledger's own
 *     `target` cell via the pack-parameterized classifier (scripts/pos.mjs);
 *   - three filters (type · unit · tier) that combine, with live counts, and four sorts
 *     (unit by default · tier · type · due first). Group headers follow the sort;
 *   - a noun is drawn in both numbers with its article where the pack declares articles —
 *     the article is how gender is stated and the count is how it is tested — with the
 *     changed ending marked, and a stem shift marked apart from it per
 *     docs/mechanics/teaching.md (marking exists only when the pack declares inflection);
 *   - notes are folded by default and open per row.
 *
 * Audio comes from the shared TTS cache (same sha1 key as speak.sh / tts-embed.mjs), and
 * only when the profile says `audio: true` and `tts: edge` — the cache is keyed by the
 * pack's edge voice, so any other tts setting would only produce a page of warnings.
 * Cached headwords are embedded; uncached ones are skipped silently — this script NEVER
 * goes to the network, so it is safe mid-session and offline.
 *
 * Usage:
 *   node scripts/deck.mjs                 # every taught row (tier ≥ 1)
 *   node scripts/deck.mjs --due          # only rows due today (queue.mjs arithmetic)
 *   node scripts/deck.mjs --topic T-0009 # one topic aspect
 *   node scripts/deck.mjs --tier 1       # one tier
 *   node scripts/deck.mjs --unit U03     # one unit (a row's unit = its topic's unit)
 *   node scripts/deck.mjs --stripped /tmp/deck-body.html   # publishing capability only
 *
 * The flags narrow what is generated; the in-page filters narrow what is shown without
 * regenerating, so the default full deck is the one worth keeping open.
 *
 * Writes work/visuals/deck.html — GENERATED, never edited, excluded from the visuals
 * index (docs/visuals.index.test.ts). Tier 0 rows are seeded-not-taught and never appear.
 * Read-only except for its one output. Zero dependencies.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { loadProfile } from "./profile.mjs";
import { loadPack } from "./pack.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const profile = loadProfile();
if (!profile) {
  console.error("deck: no docs/reference/profile.md — this is template mode. Run setup first.");
  process.exit(1);
}
const pack = await loadPack();
// Imported after the template-mode gate: pos.mjs needs pack tables to mean anything.
const { createClassifier } = await import("./pos.mjs");
const { parse, classify, speech, TYPES, TYPE_LABEL, ARTICLE } = createClassifier(pack.tables);

const T = profile.require("target_language"); // e.g. "Romanian"
const M = profile.require("meta_language"); // e.g. "English"
const audioOn = profile.get("audio", "false") === "true" && profile.get("tts", "none") === "edge";
const CACHE = join(root, ".tts-cache");
const VOICE = process.env.MOVA_VOICE || pack.manifest.tts_edge || "";
const OUT = join(root, "work", "visuals", "deck.html");

// days — sync with docs/mechanics/srs.md AND scripts/queue.mjs AND state/ledgers.test.ts
const INTERVALS = { 1: 0, 2: 3, 3: 7, 4: 21, 5: 60 };

const args = process.argv.slice(2);
const flagVal = (name) => {
  const i = args.indexOf(name);
  return i === -1 ? null : args[i + 1];
};
const onlyDue = args.includes("--due");
const onlyTopic = flagVal("--topic");
const onlyTier = flagVal("--tier") ? Number(flagVal("--tier")) : null;
const onlyUnit = flagVal("--unit");

// topic id → unit, from the topic map (| T-NNNN | aspect | UNN | section | status |).
// A row's unit is the unit of the aspect it is scored under.
const topicUnit = {};
const topicsPath = join(root, "docs", "reference", "topics.md");
if (existsSync(topicsPath)) {
  for (const line of readFileSync(topicsPath, "utf8").split("\n")) {
    const m = line.match(/^\|\s*(T-\d{4})\s*\|[^|]*\|\s*(U\d{2})\s*\|/);
    if (m) topicUnit[m[1]] = m[2];
  }
}

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
      topic: cells[6],
      notes: cells[7],
    });
  }
  return rows;
}

const now = new Date();
const todayUTC = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
const p = (x) => String(x).padStart(2, "0");
const todayISO = `${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())}`;
const daysSince = (iso) => {
  const [y, m, d] = iso.split("-").map(Number);
  return Math.round((todayUTC - Date.UTC(y, m - 1, d)) / 86_400_000);
};

let rows = [
  ...parseLedger(join(root, "state", "vocab.md")),
  ...parseLedger(join(root, "state", "grammar.md")),
].filter((r) => r.tier >= 1); // tier 0 = seeded, not taught — never drillable

for (const r of rows) {
  r.unit = topicUnit[r.topic] ?? "U??";
  r.type = classify(r.target, r.id) ?? "word";
  // Days past the review date: ≥ 0 is due, and the bigger it is the longer it has waited.
  r.over = daysSince(r.last) - (INTERVALS[r.tier] ?? 0);
}

// An unclassified row would drop into "other words" and hide there. state/ledgers.test.ts
// fails CI on exactly this, but the generator runs mid-session and must say so out loud.
const untyped = rows.filter((r) => classify(r.target, r.id) === null);
if (untyped.length) {
  console.warn(
    `⚠ ${untyped.length} row(s) carry no part of speech and are filed under "other words":\n  ` +
      untyped.map((r) => `${r.id} ${r.target}`).join("\n  ") +
      `\n  Tag them in the target cell — e.g. "din (prep)" — see docs/mechanics/srs.md.`,
  );
}

if (onlyDue) rows = rows.filter((r) => INTERVALS[r.tier] !== undefined && daysSince(r.last) >= INTERVALS[r.tier]);
if (onlyTopic) rows = rows.filter((r) => r.topic === onlyTopic);
if (onlyTier !== null) rows = rows.filter((r) => r.tier === onlyTier);
if (onlyUnit) rows = rows.filter((r) => r.unit === onlyUnit);

const typeOrder = Object.fromEntries(TYPES.map((t, i) => [t.key, i]));
// Generated in the default order (by unit), so the page is already right before any
// script runs; every later reorder goes through the same grouping code in the browser.
rows.sort(
  (a, b) =>
    a.unit !== b.unit ? (a.unit < b.unit ? -1 : 1)
    : typeOrder[a.type] !== typeOrder[b.type] ? typeOrder[a.type] - typeOrder[b.type]
    : a.target.toLowerCase() < b.target.toLowerCase() ? -1 : 1,
);

const filterLabel =
  [onlyDue ? "due today" : null, onlyTopic ? `topic ${onlyTopic}` : null, onlyTier !== null ? `tier ${onlyTier}` : null, onlyUnit ? `unit ${onlyUnit}` : null]
    .filter(Boolean)
    .join(" · ") || "every taught row";

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

let clips = 0;
/**
 * The row's clip, if the cache already holds it. The sentence is the classifier's
 * `speech`, the same one `scripts/tts-warm.mjs` generates, so warming the cache and
 * rebuilding the page agree by construction. Nothing here reaches the network.
 */
const audioFor = (target, id) => {
  const text = speech(target, id);
  const key = createHash("sha1").update(`${VOICE}|0|${text}`).digest("hex").slice(0, 32);
  const mp3 = join(CACHE, `${key}.mp3`);
  if (!existsSync(mp3)) return "";
  clips++;
  const b64 = readFileSync(mp3).toString("base64");
  return { b64 };
};

/**
 * The target-language side of one row.
 *
 * A noun is drawn in both numbers with its article where the pack declares one, because
 * that is the pair the learner is actually tested on — the article states the gender, the
 * count proves it, and the plural ending is the fact that has to be stored per word
 * (limba G-0018). A proper noun takes no article and has no count form, so it is left as
 * the bare word. A pack whose ARTICLE table is empty simply draws the two bare forms.
 */
function targetHtml(r) {
  const item = parse(r.target, r.id);
  const w = (html) => `<b class="w" lang="${esc(pack.code)}">${html}</b>`;
  const art = (x) => (x ? `<i class="art">${esc(x)}</i>` : "");

  if (item.type === "noun") {
    return item.segments
      .map((s) => {
        if (!s.plural) return `<span class="frm">${w(esc(s.word))}</span>`;
        const a = ARTICLE[s.gender] ?? { sg: "", pl: "" };
        return (
          `<span class="frm">${art(a.sg)}${w(s.sg)}` +
          `<i class="mid">·</i>${art(a.pl)}${w(s.pl)}</span>`
        );
      })
      .join("");
  }
  if (item.type === "adj") {
    const s = item.segments[0];
    return (
      `<span class="frm">${w(esc(s.word))}</span>` +
      `<span class="frm sub">${s.forms.map((f) => `<span>${f.html}</span>`).join(`<i class="mid">·</i>`)}</span>`
    );
  }
  return item.segments
    .map(
      (s) =>
        `<span class="frm">${w(esc(s.word))}${s.gender ? `<i class="gt">${s.gender}</i>` : ""}` +
        `${s.note ? `<i class="ex">${esc(s.note)}</i>` : ""}</span>`,
    )
    .join("");
}

let ttsN = 0;
const rowHtml = (r) => {
  const audio = audioOn ? audioFor(r.target, r.id) : "";
  const id = audio ? `tts${ttsN++}` : null;
  return `<div class="row" data-id="${esc(r.id)}" data-unit="${esc(r.unit)}" data-tier="${r.tier}" data-type="${r.type}" data-over="${r.over}" data-target="${esc(r.target.toLowerCase())}">
  <div class="side l2-side">${
    id
      ? `<button class="tts-play" data-a="${id}" aria-label="Play">▶</button><audio id="${id}" preload="none" src="data:audio/mpeg;base64,${audio.b64}"></audio>`
      : audioOn
        ? `<span class="noaudio"></span>`
        : ""
  }<span class="val">${targetHtml(r)}</span><span class="cover">···</span></div>
  <div class="side l1-side"><span class="val">${esc(r.translation)}</span><span class="cover">···</span></div>
  <span class="chips"><span class="ychip">${TYPE_LABEL[r.type]}</span><span class="uchip">${esc(r.unit)}</span><span class="tchip tc${Math.min(r.tier, 5)}">t${r.tier}</span>${
    r.over >= 0 ? `<span class="duedot" title="due for review">●</span>` : ""
  }${r.notes ? `<button class="nb-t" aria-expanded="false" title="what the ledger knows about this row">note</button>` : ""}</span>
  ${r.notes ? `<div class="nb-b">${esc(r.notes)}</div>` : ""}
</div>`;
};

/** One filter row: `all` plus every value present, each with its count. */
const facet = (name, label, values) =>
  `<div class="facet"><span class="fl">${label}</span><button class="fb on" data-f="${name}" data-v="">all</button>${values
    .map(
      ([v, text, n]) =>
        `<button class="fb" data-f="${name}" data-v="${esc(v)}">${esc(text)} <span class="fn">${n}</span></button>`,
    )
    .join("")}</div>`;

const count = (pred) => rows.filter(pred).length;
const units = [...new Set(rows.map((r) => r.unit))].sort();
const tiers = [1, 2, 3, 4, 5].filter((t) => rows.some((r) => r.tier === t));
const typesPresent = TYPES.filter((t) => rows.some((r) => r.type === t.key));

const tierCounts = tiers
  .map((t) => `<span class="tchip tc${t}">t${t}·${count((r) => r.tier === t)}</span>`)
  .join(" ");

const controls = [
  typesPresent.length > 1
    ? facet("type", "type", typesPresent.map((t) => [t.key, t.label, count((r) => r.type === t.key)]))
    : "",
  units.length > 1 ? facet("unit", "unit", units.map((u) => [u, u, count((r) => r.unit === u)])) : "",
  tiers.length > 1 ? facet("tier", "tier", tiers.map((t) => [String(t), `t${t}`, count((r) => r.tier === t)])) : "",
  `<div class="facet"><span class="fl">sort</span>${[
    ["unit", "by unit"],
    ["tier", "weakest first"],
    ["type", "by type"],
    ["due", "due first"],
  ]
    .map(([s, text]) => `<button class="fb sb${s === "unit" ? " on" : ""}" data-s="${s}">${text}</button>`)
    .join("")}</div>`,
].join("\n  ");

/** Server-side render of the default grouping — the page is correct before any JS runs. */
const initial = () => {
  const out = [];
  let group = null;
  for (const r of rows) {
    if (r.unit !== group) {
      group = r.unit;
      out.push(`<h2 class="grp">${esc(group)} <span class="count">${count((x) => x.unit === group)}</span></h2>`);
    }
    out.push(rowHtml(r));
  }
  return out.join("\n");
};

const vocab = rows.filter((r) => r.id.startsWith("V-"));
const grammar = rows.filter((r) => r.id.startsWith("G-"));

const html = `<!doctype html>
<!-- GENERATED by scripts/deck.mjs — do not edit; regenerate instead. -->
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(T)} — deck · ${todayISO}</title>
<style>
  :root {
    --bg:#faf9f7; --fg:#1c1a17; --muted:#6b645c; --line:#ddd7cf; --card:#fff;
    --ok:#1a7a4c; --bad:#b3261e; --hi:#8a5a00; --hiBg:#fff6e0;
    --mk:#7a1fa2; --mkBg:#f2e4fa; --st:#00666e; --stBg:#dbf1f3;
    --t1:#b3261e; --t2:#cc6a1a; --t3:#a8891b; --t4:#5d8a3f; --t5:#1a7a4c;
  }
  @media (prefers-color-scheme: dark) { :root {
    --bg:#16151a; --fg:#eceaf0; --muted:#a09aa8; --line:#33303a; --card:#1e1d24;
    --ok:#4ad48c; --bad:#ff8a80; --hi:#ffc76b; --hiBg:#2b2413;
    --mk:#e2aef8; --mkBg:#3a2148; --st:#7fe3ec; --stBg:#123033;
    --t1:#ff8a80; --t2:#ffab6b; --t3:#ffc76b; --t4:#a9d98a; --t5:#4ad48c;
  } }
  :root[data-theme="dark"] {
    --bg:#16151a; --fg:#eceaf0; --muted:#a09aa8; --line:#33303a; --card:#1e1d24;
    --ok:#4ad48c; --bad:#ff8a80; --hi:#ffc76b; --hiBg:#2b2413;
    --mk:#e2aef8; --mkBg:#3a2148; --st:#7fe3ec; --stBg:#123033;
    --t1:#ff8a80; --t2:#ffab6b; --t3:#ffc76b; --t4:#a9d98a; --t5:#4ad48c;
  }
  :root[data-theme="light"] {
    --bg:#faf9f7; --fg:#1c1a17; --muted:#6b645c; --line:#ddd7cf; --card:#fff;
    --ok:#1a7a4c; --bad:#b3261e; --hi:#8a5a00; --hiBg:#fff6e0;
    --mk:#7a1fa2; --mkBg:#f2e4fa; --st:#00666e; --stBg:#dbf1f3;
    --t1:#b3261e; --t2:#cc6a1a; --t3:#a8891b; --t4:#5d8a3f; --t5:#1a7a4c;
  }
  * { box-sizing:border-box; }
  body { margin:0; background:var(--bg); color:var(--fg);
    font:16px/1.55 ui-sans-serif,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif; }
  .wrap { max-width:920px; margin:0 auto; padding:26px 18px 70px; }
  .tohub { display:inline-block; margin:0 0 16px; padding:.15rem .62rem; border:1px solid var(--line);
    border-radius:999px; font-size:12.5px; color:var(--muted); text-decoration:none; }
  .tohub:hover { border-color:var(--fg); color:var(--fg); }
  h1 { font-size:24px; margin:0 0 2px; letter-spacing:-.01em; }
  h2.grp { font-size:12px; text-transform:uppercase; letter-spacing:.09em; color:var(--muted);
    margin:26px 0 4px; font-weight:600; }
  h2.grp .count { font-weight:400; }
  .meta { color:var(--muted); font-size:.86rem; margin-bottom:10px; }
  .meta code { font-size:.82rem; }
  .modes { display:flex; gap:8px; margin:14px 0 10px; }
  .modes button { padding:.35rem .8rem; border:1px solid var(--line); border-radius:999px;
    background:var(--card); color:var(--fg); cursor:pointer; font-size:.88rem; }
  .modes button.on { background:var(--hi); border-color:var(--hi); color:var(--bg); }
  /* Filters and sort share one control block: same chip, same row shape, so the eye reads
     "these narrow the list" once instead of learning two widgets. */
  .panel { border:1px solid var(--line); border-radius:10px; background:var(--card);
    padding:8px 12px 10px; }
  .facet { display:flex; flex-wrap:wrap; gap:6px; align-items:center; padding:4px 0; }
  .facet + .facet { border-top:1px dashed var(--line); }
  .fl { width:3.2rem; flex:none; font-size:.7rem; text-transform:uppercase; letter-spacing:.08em;
    color:var(--muted); }
  .fb { padding:.2rem .6rem; border:1px solid var(--line); border-radius:999px;
    background:transparent; color:var(--muted); cursor:pointer; font-size:.8rem; }
  .fb:hover { border-color:var(--muted); }
  .fb.on { border-color:var(--fg); color:var(--fg); font-weight:600; }
  .fb.empty { opacity:.35; }
  .fn { font-variant-numeric:tabular-nums; opacity:.7; }
  .hint { color:var(--muted); font-size:.82rem; margin:8px 0 0; min-height:1.2em; }
  .showing { color:var(--muted); font-size:.78rem; margin:2px 0 0; }
  .row { display:grid; grid-template-columns:1fr 1fr auto; gap:.3rem .9rem;
    align-items:center; padding:.5rem 0; border-bottom:1px solid var(--line); }
  .side { display:flex; align-items:center; gap:.55rem; min-height:2rem; }
  .val { display:flex; flex-direction:column; gap:.1rem; }
  .frm { display:flex; align-items:baseline; flex-wrap:wrap; gap:.28rem; }
  .frm.sub { font-size:.86rem; color:var(--muted); }
  .w { font-weight:650; }
  /* The article is the gender, said out loud — present but never louder than the noun. */
  .art { font-style:normal; color:var(--muted); font-size:.86em; }
  .mid { font-style:normal; color:var(--line); }
  .gt { font-style:normal; font-size:.7rem; color:var(--muted); border:1px solid var(--line);
    border-radius:3px; padding:0 .22rem; }
  .ex { font-style:normal; font-size:.8rem; color:var(--muted); }
  b.mk { color:var(--mk); background:var(--mkBg); padding:0 .12em; border-radius:3px; font-weight:700; }
  b.st { color:var(--st); background:var(--stBg); padding:0 .12em; border-radius:3px; font-weight:700; }
  .cover { display:none; color:var(--muted); letter-spacing:.2em; }
  .chips { display:flex; gap:.4rem; align-items:center; justify-self:end; }
  .ychip, .uchip { font-size:.7rem; color:var(--muted); }
  .duedot { color:var(--hi); font-size:.6rem; }
  .tchip { font-size:.72rem; font-weight:700; padding:.1rem .45rem; border-radius:999px;
    border:1px solid currentColor; }
  .tc1{color:var(--t1)} .tc2{color:var(--t2)} .tc3{color:var(--t3)} .tc4{color:var(--t4)} .tc5{color:var(--t5)}
  /* The note names the answer often enough that it is treated as an answer: folded by
     default everywhere, and in a test mode it does not exist until the row is revealed. */
  .nb-t { border:1px solid var(--line); background:transparent; border-radius:999px;
    padding:.05rem .4rem; cursor:pointer; font-size:.68rem; color:var(--muted);
    text-transform:uppercase; letter-spacing:.05em; }
  .nb-t::before { content:"▸"; margin-right:.15rem; }
  .row.note-open .nb-t { border-color:var(--fg); color:var(--fg); }
  .row.note-open .nb-t::before { content:"▾"; }
  .nb-b { grid-column:1 / -1; display:none; color:var(--muted); font-size:.84rem;
    padding:.15rem 0 .1rem; }
  .row.note-open .nb-b { display:block; }
  .noaudio { width:2.1rem; flex:none; }
  .tts-play { width:2.1rem; height:2.1rem; border-radius:50%; border:1px solid var(--line);
    background:var(--card); color:var(--fg); font-size:.8rem; cursor:pointer; line-height:1; flex:none; }
  .tts-play.on { background:var(--hi); color:var(--bg); border-color:var(--hi); }
  /* Test modes: the answer side — audio button included — and the note conceal together,
     for vocab AND grammar rows alike. Click the row to reveal; any change re-conceals.
     m-target shows the target language; m-meta shows the support language. */
  body.m-target .row:not(.open) .l1-side .val { display:none; }
  body.m-target .row:not(.open) .l1-side .cover { display:inline; }
  body.m-meta .row:not(.open) .l2-side .val,
  body.m-meta .row:not(.open) .l2-side .tts-play { display:none; }
  body.m-meta .row:not(.open) .l2-side .cover { display:inline; }
  body.m-target .row:not(.open) .nb-t, body.m-target .row:not(.open) .nb-b,
  body.m-meta .row:not(.open) .nb-t, body.m-meta .row:not(.open) .nb-b { display:none; }
  body.m-target .row, body.m-meta .row { cursor:pointer; }
  .empty-msg { color:var(--muted); font-size:.9rem; padding:22px 0; }
  footer { margin-top:34px; color:var(--muted); font-size:.8rem; }
  @media (max-width:620px) {
    .row { grid-template-columns:1fr auto; }
    .l1-side { grid-column:1; }
    .chips { grid-row:1; grid-column:2; }
  }
</style>
</head>
<body class="m-browse">
<div class="wrap">
  <a class="tohub" href="index.html">← hub</a>
  <h1>The deck</h1>
  <div class="meta">generated <b>${todayISO}</b> from the ledgers · ${filterLabel} · ${rows.length} rows
  (${vocab.length} words, ${grammar.length} patterns) ${tierCounts}<br>
  regenerate any time: <code>node scripts/deck.mjs${onlyDue ? " --due" : ""}${onlyTopic ? ` --topic ${onlyTopic}` : ""}${onlyTier !== null ? ` --tier ${onlyTier}` : ""}${onlyUnit ? ` --unit ${onlyUnit}` : ""}</code> — if the date above is not today, the tiers may have moved.</div>
  <div class="modes">
    <button data-m="m-browse" class="on">browse</button>
    <button data-m="m-target">${esc(T)} → ${esc(M)}</button>
    <button data-m="m-meta">${esc(M)} → ${esc(T)}</button>
  </div>
  <div class="panel">
  ${controls}
  </div>
  <div class="hint" id="hint"></div>
  <div class="showing" id="showing"></div>
  <div id="rows">
${initial()}
  </div>
  <footer>Generated by <code>scripts/deck.mjs</code> — do not edit. Notes come from the ledger rows;
  a correction there lands here on the next regeneration. Say a row's answer out loud before revealing it.${
    pack.inflection
      ? ` In an inflected form, <b class="mk">purple</b> is the ending that is added and
  <b class="st">teal</b> is the stem changing underneath it.`
      : ""
  }</footer>
</div>
<script>
  var TYPE_PLURAL =${JSON.stringify(Object.fromEntries(TYPES.map((t) => [t.key, t.label])))};
  var TYPE_ORDER = ${JSON.stringify(typeOrder)};
  var TOTAL = ${rows.length};
  var HINTS = { "m-browse":"", "m-target":${JSON.stringify(`${T} shown — say the ${M}, click the row to check.`)},
    "m-meta":${JSON.stringify(`${M} shown — say and spell the ${T}, click the row to check.`)} };

  var host = document.getElementById("rows");
  var ROWS = [].slice.call(host.querySelectorAll(".row"));
  var state = { type:"", unit:"", tier:"", sort:"unit" };

  /** Does a row pass the filters — optionally ignoring one facet, to count its own chips. */
  function passes(r, skip) {
    return (skip === "type" || !state.type || r.dataset.type === state.type)
        && (skip === "unit" || !state.unit || r.dataset.unit === state.unit)
        && (skip === "tier" || !state.tier || r.dataset.tier === state.tier);
  }

  var by = {
    unit: function(r){ return r.dataset.unit; },
    tier: function(r){ return "tier " + r.dataset.tier; },
    type: function(r){ return TYPE_PLURAL[r.dataset.type] || r.dataset.type; },
    due:  function(r){ return +r.dataset.over >= 0 ? "due now" : "not due yet"; }
  };
  var rank = {
    unit: function(r){ return [r.dataset.unit, pad(TYPE_ORDER[r.dataset.type]), r.dataset.target]; },
    tier: function(r){ return [r.dataset.tier, pad(9999 - +r.dataset.over), r.dataset.target]; },
    type: function(r){ return [pad(TYPE_ORDER[r.dataset.type]), r.dataset.unit, r.dataset.target]; },
    due:  function(r){ return [pad(9999 - +r.dataset.over), r.dataset.tier, r.dataset.target]; }
  };
  function pad(n){ return String(10000 + Number(n)); }
  function cmp(a, b){
    var x = rank[state.sort](a).join("|"), y = rank[state.sort](b).join("|");
    return x < y ? -1 : x > y ? 1 : 0;
  }

  function render() {
    var vis = ROWS.filter(function(r){ return passes(r, null); });
    vis.sort(cmp);

    while (host.firstChild) host.removeChild(host.firstChild);
    var groups = [];
    vis.forEach(function(r){
      var g = by[state.sort](r);
      if (!groups.length || groups[groups.length - 1].label !== g) groups.push({ label:g, items:[] });
      groups[groups.length - 1].items.push(r);
      r.classList.remove("open", "note-open");
      var t = r.querySelector(".nb-t");
      if (t) t.setAttribute("aria-expanded", "false");
    });
    groups.forEach(function(g){
      var h = document.createElement("h2");
      h.className = "grp";
      h.innerHTML = g.label + ' <span class="count">' + g.items.length + '</span>';
      host.appendChild(h);
      g.items.forEach(function(r){ host.appendChild(r); });
    });
    if (!vis.length) {
      var e = document.createElement("div");
      e.className = "empty-msg";
      e.textContent = "Nothing matches these filters.";
      host.appendChild(e);
    }

    // Every chip re-counts against the OTHER facets, so a chip that reads 0 is a click
    // that would empty the page — and it says so before it is clicked.
    [].forEach.call(document.querySelectorAll(".fb[data-f]"), function(b){
      var f = b.dataset.f, v = b.dataset.v;
      b.classList.toggle("on", state[f] === v);
      var n = b.querySelector(".fn");
      if (!n) return;
      var c = ROWS.filter(function(r){ return passes(r, f) && r.dataset[f] === v; }).length;
      n.textContent = c;
      b.classList.toggle("empty", c === 0);
    });
    document.getElementById("showing").textContent =
      vis.length === TOTAL ? "showing all " + TOTAL + " rows"
                           : "showing " + vis.length + " of " + TOTAL + " rows";
  }

  document.querySelectorAll(".modes button").forEach(function(b){
    b.addEventListener("click", function(){
      document.body.className = b.dataset.m;
      document.querySelectorAll(".modes button").forEach(function(o){ o.classList.toggle("on", o === b); });
      document.getElementById("hint").textContent = HINTS[b.dataset.m];
      render();
    });
  });
  document.querySelectorAll(".fb[data-f]").forEach(function(b){
    b.addEventListener("click", function(){ state[b.dataset.f] = b.dataset.v; render(); });
  });
  document.querySelectorAll(".fb[data-s]").forEach(function(b){
    b.addEventListener("click", function(){
      state.sort = b.dataset.s;
      document.querySelectorAll(".fb[data-s]").forEach(function(o){ o.classList.toggle("on", o === b); });
      render();
    });
  });
  ROWS.forEach(function(r){
    r.addEventListener("click", function(){
      if (document.body.className === "m-browse") return;
      r.classList.toggle("open");
    });
    var t = r.querySelector(".nb-t");
    if (t) t.addEventListener("click", function(ev){
      ev.stopPropagation();
      t.setAttribute("aria-expanded", r.classList.toggle("note-open") ? "true" : "false");
    });
  });
  document.querySelectorAll(".tts-play").forEach(function(b){
    var el = document.getElementById(b.dataset.a);
    b.addEventListener("click", function(ev){
      ev.stopPropagation();
      document.querySelectorAll("audio").forEach(function(o){ if(o!==el){o.pause();o.currentTime=0;} });
      document.querySelectorAll(".tts-play").forEach(function(o){ if(o!==b){o.classList.remove("on");o.textContent="▶";} });
      if (el.paused){ el.play(); b.classList.add("on"); b.textContent="❚❚"; }
      else { el.pause(); el.currentTime=0; b.classList.remove("on"); b.textContent="▶"; }
    });
    el.addEventListener("ended", function(){ b.classList.remove("on"); b.textContent="▶"; });
  });
  render();
</script>
</body>
</html>
`;

writeFileSync(OUT, html);
console.log(
  `deck.html — ${rows.length} rows (${vocab.length} vocab, ${grammar.length} grammar), ` +
    `${filterLabel}; ` +
    typesPresent.map((t) => `${count((r) => r.type === t.key)} ${t.label}`).join(", ") +
    (audioOn
      ? `; audio on ${clips} row${clips === 1 ? "" : "s"} (cache only, no network) → `
      : `; audio off (profile) → `) +
    `${(Buffer.byteLength(html) / 1024 / 1024).toFixed(1)} MB`,
);

// --stripped <path>: the page without the <!doctype>/<html>/<head>/<body> wrapper, which is
// what an artifact-publishing platform expects. Capability-gated: only meaningful when the
// profile says `publishing:` is on (docs/mechanics/media.md); local files are the base case
// and the repo file above stays standalone. This copy is scratch and never committed.
// (limba grew this flag 2026-08-12 and retired it 2026-08-13 when that instance went
// local-only; mova keeps it because publishing is a per-instance capability here.)
//
// The deck needs one thing the hub does not. Its mode buttons drive `document.body.className`
// and the page ships as `<body class="m-browse">` — but the published copy sits inside the
// platform's own body, which carries no such class, so browse mode would start unset and the
// first click would be the only thing that ever worked. The seed script below sets it.
const dsi = process.argv.indexOf("--stripped");
if (dsi !== -1 && process.argv[dsi + 1]) {
  const body = /<body class="m-browse">([\s\S]*)<\/body>/.exec(html)[1];
  const style = /<style>[\s\S]*?<\/style>/.exec(html)[0];
  writeFileSync(
    process.argv[dsi + 1],
    `<title>${esc(T)} — deck</title>\n${style}\n` +
      `<script>document.body.className = "m-browse";</script>\n${body}\n`,
  );
  console.log(`stripped copy → ${process.argv[dsi + 1]}`);
}

// A silent row is invisible on the page — it just has no play button — so it is reported
// here instead. The cache is warmed by the one script allowed to reach the network. When
// the profile has audio off there is nothing to warn about — the page is mute by design.
if (audioOn && clips < rows.length) {
  console.warn(
    `⚠ ${rows.length - clips} row(s) have no cached audio and ship mute. ` +
      `Fix with: node scripts/tts-warm.mjs && node scripts/deck.mjs`,
  );
}
