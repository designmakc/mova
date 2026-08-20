// mova:engine
/**
 * The frame every GENERATED dashboard shares — the palette, the chrome, and the nav.
 *
 * WHY THIS EXISTS. The token block lived in three places and was about to reach four: the
 * teaching-page frame (visual-shell.mjs), the hub, the deck, and a profile page the moment
 * one was proposed. visual-shell.mjs's own docstring already paid for the argument and
 * states it plainly — a frame with one definition cannot drift, a frame that is copied
 * always will — and it was written after two live pages were measured carrying the audio
 * player's CSS two and three times over. Ported from limba, 2026-08-19 (PORT-022).
 *
 * SO THIS FILE DOES NOT REDECLARE A PALETTE. It imports the pinned theme from
 * visual-shell.mjs — which reads docs/visual/starter.html, the one definition — and adds
 * only what a dashboard needs that a teaching page does not: --solid/--shaky (the
 * taught-versus-retained fills) and --t1..--t5 (the memory ladder). The extras are declared
 * in all four theme scopes, the same contract visualcheck's check 7 holds any page to.
 *
 * TWO CSS EXPORTS, TWO AUDIENCES. `CHROME` is what any dashboard uses — panels, tiles,
 * bars, cards, sparklines, tables, drawers. `BOARD` is one surface's own furniture: the
 * unit board, the queue meter, the deck gateway, the what-next band. The hub composes both;
 * a page with no board takes CHROME alone rather than shipping the board's CSS for nothing.
 *
 * Read-only, no I/O of its own, one local dependency.
 */
import { tokens } from "./visual-shell.mjs";

/** What a dashboard adds to the teaching-page palette, in all four theme scopes.
 *
 *  The ladder runs at-risk → secure. That axis is the information, not decoration: t1 is a
 *  row that failed recently and t5 is cold storage, so the colour carries the direction or
 *  the bar is just a stack of pretty segments.
 *
 *  --solid/--shaky are FILLS and deliberately not --ok/--bad, which are TEXT colours. Side
 *  by side as fills, two dark saturated blocks of equal weight fight each other and the
 *  boundary between them disappears (limba learner, 2026-08-10). Shaky is amber, not red:
 *  tier 1–2 is work outstanding rather than a failure, and green-against-amber survives
 *  colour-blindness where green-against-red does not. */
const DASH_EXTRA = `  :root {
    --solid:oklch(66% 0.10 130); --shaky:oklch(75% 0.13 75);
    --t1:oklch(52% 0.17 27); --t2:oklch(58% 0.15 55); --t3:oklch(62% 0.12 90);
    --t4:oklch(62% 0.12 135); --t5:oklch(52% 0.13 155);
  }
  @media (prefers-color-scheme:dark) {
    :root {
      --solid:oklch(70% 0.11 135); --shaky:oklch(76% 0.12 80);
      --t1:oklch(74% 0.14 25); --t2:oklch(78% 0.12 55); --t3:oklch(80% 0.11 85);
      --t4:oklch(80% 0.12 135); --t5:oklch(78% 0.13 155);
    }
  }
  :root[data-theme="dark"] {
    --solid:oklch(70% 0.11 135); --shaky:oklch(76% 0.12 80);
    --t1:oklch(74% 0.14 25); --t2:oklch(78% 0.12 55); --t3:oklch(80% 0.11 85);
    --t4:oklch(80% 0.12 135); --t5:oklch(78% 0.13 155);
  }
  :root[data-theme="light"] {
    --solid:oklch(66% 0.10 130); --shaky:oklch(75% 0.13 75);
    --t1:oklch(52% 0.17 27); --t2:oklch(58% 0.15 55); --t3:oklch(62% 0.12 90);
    --t4:oklch(62% 0.12 135); --t5:oklch(52% 0.13 155);
  }`;

/** Every dashboard token: the pinned teaching-page palette plus the dashboard extras. */
export const DASH_TOKENS = () => `${tokens()}\n${DASH_EXTRA}`;

/**
 * How many characters of a description survive the card's clamp.
 *
 * A CAP IS SET TO THE CLAMP, NOT TO TASTE (limba PORT-026). `.teaches` shows three lines
 * and at the card's width three lines is about this many characters — so a looser cap would
 * pass its own test and still cut the sentence off mid-word on the page. The gate would be
 * green and the artifact broken. docs/visuals.index.test.ts imports this number rather than
 * restating it, which is what keeps the rule and the rendering the same fact.
 */
export const TEACHES_MAX = 120;

/** The chrome any generated dashboard uses. */
export const CHROME = `  * { box-sizing:border-box; }
  body {
    margin:0; background:var(--bg); color:var(--fg);
    font:16px/1.6 var(--font-body); -webkit-text-size-adjust:100%;
  }
  a:focus-visible, .lnk:focus-visible, button:focus-visible {
    outline:2px solid var(--l2); outline-offset:3px; border-radius:3px; }
  .wrap { max-width:1080px; margin:0 auto; padding:28px 20px 72px; }
  header.top { display:flex; flex-wrap:wrap; align-items:baseline; gap:12px; margin-bottom:6px; }
  header.top h1 { font:700 26px/1.2 var(--font-display); margin:0; letter-spacing:-.01em; }
  header.top .sub { color:var(--muted); font-size:14px; }
  .stamp { color:var(--muted); font-size:13px; margin-bottom:26px; }
  h2 { font-size:13px; text-transform:uppercase; letter-spacing:.09em; color:var(--muted);
       margin:34px 0 12px; font-weight:600; }
  .panel { background:var(--card); border:1px solid var(--line); border-radius:12px; padding:18px; }
  .tiles { display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:12px; }
  .tile { background:var(--card); border:1px solid var(--line); border-radius:12px;
          padding:14px 16px; position:relative; }
  .tile-v { font-size:26px; font-weight:650; letter-spacing:-.02em; font-variant-numeric:tabular-nums; }
  .tile-l { font-size:12px; text-transform:uppercase; letter-spacing:.06em; color:var(--muted); margin-top:2px; }
  .tile-s { font-size:13px; color:var(--muted); margin-top:6px; }
  /* State reads before the number does. */
  .tile.attention { border-color:var(--hi); background:var(--hiBg); }
  .tile.attention .tile-v { color:var(--hi); }
  .tile.clear .tile-v { color:var(--ok); }
  /* ANYTHING CLICKABLE SAYS SO, and says it before the pointer arrives. The arrow is always
     visible rather than shown on hover: a hover-only cue tells the reader nothing until they
     are already on top of it, which is after the moment it was needed (limba PORT-027). */
  a.tile { text-decoration:none; color:inherit; display:block; }
  a.tile:hover { border-color:var(--l2); }
  .go::after { content:"↗"; position:absolute; top:11px; right:12px; font-size:13px;
               color:var(--muted); line-height:1; }
  a.tile:hover .tile-l, a.tile:hover.go::after { color:var(--l2); }
  .grid2 { display:grid; grid-template-columns:repeat(auto-fit,minmax(320px,1fr)); gap:14px; }
  .bar-row + .bar-row { margin-top:11px; }
  .bar-head { display:flex; justify-content:space-between; font-size:13.5px; margin-bottom:4px; gap:10px; }
  .bar-head span:last-child { font-variant-numeric:tabular-nums; }
  .bar { height:8px; background:var(--line); border-radius:99px; overflow:hidden; display:flex; gap:2px; }
  .bar-fill { height:100%; background:var(--l2); border-radius:99px; }
  /* Retained is one bar carrying two facts, so the halves separate at a glance. The 2px gap
     is the seam; the colours are fills, never the text tokens (see DASH_EXTRA). */
  .bar-fill.ok { background:var(--solid); border-radius:99px 0 0 99px; }
  .bar-fill.no { background:var(--shaky); border-radius:0 99px 99px 0; }
  /* Delivery is not a state to feel anything about, so the taught bar is deliberately
     neutral. Left at --l2 it read as a full alarm bar beside the green of the retained one
     — the opposite of what "15 of 15 taught" means. */
  .bar-fill.tt { background:var(--muted); }
  .bar.none { background:transparent; border:1px dashed var(--line); }
  .lbl { font-size:11.5px; text-transform:uppercase; letter-spacing:.07em; color:var(--muted); }
  .r-solid { color:var(--ok); } .r-shaky { color:var(--hi); }
  /* Untouched is not "barely started". A dashed track says "not begun", not "0% done". */
  .bar-row.untouched .bar { background:transparent; border:1px dashed var(--line); height:7px; }
  .bar-row.untouched .bar-head { color:var(--muted); }
  .muted { color:var(--muted); }
  .tierbar { display:flex; height:26px; border-radius:8px; overflow:hidden; margin-top:4px; }
  .seg { display:flex; align-items:center; justify-content:center; font-size:12px;
         color:var(--bg); min-width:22px; }
  .seg-1{background:var(--t1)} .seg-2{background:var(--t2)} .seg-3{background:var(--t3)}
  .seg-4{background:var(--t4)} .seg-5{background:var(--t5)}
  .legend { display:flex; flex-wrap:wrap; gap:12px; margin-top:9px; font-size:12.5px; color:var(--muted); }
  .legend i { display:inline-block; width:9px; height:9px; border-radius:2px; margin-right:5px; }
  /* The band is the calibration target from session_format.md — the bars are only readable
     against it, so it is drawn rather than captioned. The fill sits behind the bars; the
     ceiling line is drawn IN FRONT, or a bar that clears the target hides the very
     reference it beat. */
  .spark { display:flex; align-items:flex-end; gap:7px; height:86px; margin-top:22px; position:relative; }
  .spark::before { content:""; position:absolute; left:0; right:0; bottom:60%; height:10%;
                   background:var(--ok); opacity:.12; pointer-events:none; z-index:0; }
  .spark::after { content:""; position:absolute; left:0; right:0; bottom:70%; height:0;
                  border-top:1px dashed var(--ok); opacity:.55; pointer-events:none; z-index:3; }
  .spark div { flex:1; background:var(--l2); border-radius:4px 4px 0 0; min-height:3px;
               position:relative; opacity:.5; z-index:1; }
  .spark div:last-child { opacity:1; }
  .spark-cap { font-size:11.5px; color:var(--muted); margin-top:8px; }
  .spark span { position:absolute; top:-17px; left:0; right:0; text-align:center;
                font-size:11px; color:var(--muted); font-variant-numeric:tabular-nums; }
  .spark-x { display:flex; gap:7px; font-size:11px; color:var(--muted); margin-top:5px; }
  .spark-x div { flex:1; text-align:center; }
  table.k { width:100%; border-collapse:collapse; font-size:14px; }
  table.k td { padding:5px 0; border-bottom:1px solid var(--line); }
  table.k tr:last-child td { border-bottom:0; }
  table.k td:last-child { text-align:right; color:var(--muted); font-variant-numeric:tabular-nums; }
  table.k.wide td, table.k.wide th { padding:7px 14px 7px 0; vertical-align:top; }
  table.k.wide th { font-size:11px; text-transform:uppercase; letter-spacing:.06em;
                    color:var(--muted); font-weight:600; text-align:left;
                    border-bottom:1px solid var(--line); }
  table.k.wide td:last-child, table.k.wide th:last-child { text-align:left; color:inherit; }
  table.k.wide td:first-child { white-space:nowrap; color:var(--muted); }
  table.k.wide tr.now td { background:var(--hiBg); }
  table.k.wide tr.now td:first-child { color:var(--hi); font-weight:650; }
  code { background:var(--hiBg); color:var(--hi); padding:1px 5px; border-radius:4px;
         font:13px/1.4 var(--font-mono); }
  time { font-variant-numeric:tabular-nums; }
  .cmd { display:grid; grid-template-columns:minmax(120px,auto) 1fr; gap:8px 16px; font-size:14px; }
  .cmd dt code { white-space:nowrap; }
  .cmd dd { margin:0; color:var(--muted); }
  .ecode { display:block; font:12px/1.4 var(--font-mono); color:var(--muted); letter-spacing:.02em; }
  .ezone { display:block; font-size:14px; color:var(--fg); }
  .cards { display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:14px; }
  .card { background:var(--card); border:1px solid var(--line); border-radius:12px;
          padding:15px 16px; display:flex; flex-direction:column; position:relative; }
  .card:hover { border-color:var(--l2); }
  /* Superseded pages are dimmed AND labelled. Opacity alone is a signal nobody can read. */
  .card.superseded { opacity:.62; }
  .card.superseded:hover { opacity:1; }
  /* Stretched link: the whole card is the target. */
  .card-link { color:inherit; text-decoration:none; }
  .card-link::after { content:""; position:absolute; inset:0; border-radius:12px; z-index:1; }
  .card-link:focus-visible::after { outline:2px solid var(--l2); outline-offset:2px; }
  .card-top { display:flex; justify-content:space-between; align-items:flex-start; gap:10px; }
  /* TWO LINES RESERVED FOR THE TITLE, three for the body, so every card in a row is the
     same height — which is what turns a grid into a list you can scan down (PORT-026). */
  .card-top h3 { margin:0; font-size:16px; min-height:2.5em; display:-webkit-box;
                 -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
  .pills { display:flex; gap:6px; flex-wrap:wrap; justify-content:flex-end; }
  .pill { font-size:11px; color:var(--muted); border:1px solid var(--line);
          border-radius:99px; padding:2px 9px; white-space:nowrap; }
  .pill.old { color:var(--hi); border-color:var(--hi); background:var(--hiBg); }
  .pill.built { border-style:dashed; }
  .pill.practice { color:var(--new); border-color:var(--new); background:var(--newBg); }
  .pill.repair { color:var(--bad); border-color:var(--bad); }
  /* Reference: a cheat sheet reprints tables the units below already taught, so it reads as
     neither new teaching nor a repair. limba tints this pill with its morpheme colour; mova
     has no such token, and a dotted edge says "not a lesson" without inventing one. */
  .pill.reference { border-style:dotted; color:var(--muted); border-color:var(--muted); }
  .nodate { font-style:italic; }
  /* Clamped to three lines — and TEACHES_MAX above is derived from this number, not
     guessed alongside it. */
  .teaches { font-size:13.5px; color:var(--muted); margin:9px 0 14px; flex:1;
             display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical;
             overflow:hidden; }
  .card-foot { display:flex; justify-content:space-between; align-items:center;
               font-size:12.5px; color:var(--muted); gap:10px; flex-wrap:wrap; }
  .card .go::after { top:auto; bottom:13px; right:14px; }
  .links { display:flex; gap:10px; align-items:center; }
  .lnk { color:var(--l2); text-decoration:none; font-weight:550; }
  .lnk:hover { text-decoration:underline; }
  .lnk.dim { color:var(--muted); font-weight:400; cursor:help; }
  .note { font-size:13px; color:var(--muted); margin-top:10px; }
  .next { background:var(--hiBg); border-left:3px solid var(--l2);
          border-radius:0 8px 8px 0; padding:11px 14px; font-size:14px; margin-top:12px; }
  .overflow { overflow-x:auto; }
  .drawer { margin-top:38px; border-top:1px solid var(--line); padding-top:16px; }
  .drawer summary { cursor:pointer; font-size:13px; text-transform:uppercase;
                    letter-spacing:.09em; color:var(--muted); font-weight:600; }
  .drawer summary:hover { color:var(--fg); }
  .drawer summary:focus-visible { outline:2px solid var(--l2); outline-offset:3px; border-radius:3px; }
  .drawer + .drawer { margin-top:14px; border-top:0; padding-top:0; }
  .howto h4 { font-size:14px; margin:26px 0 6px; }
  .howto h4:first-child { margin-top:0; }
  .howto p { margin:0 0 12px; font-size:14px; color:var(--muted); max-width:68ch; }
  .howto-note { border-left:2px solid var(--line); padding-left:12px; }
  .howto-src { font-size:12.5px !important; border-bottom:1px solid var(--line);
               padding-bottom:14px; margin-bottom:22px !important; }
  /* FOLD A LIST WHOSE TAIL DOES NOT EARN ITS HEIGHT (PORT-026). A settled fact nobody
     scrolls to cannot be contested, which is the only reason half these sections exist. */
  .fold > summary { cursor:pointer; font-size:12.5px; color:var(--muted); list-style:none; }
  .fold > summary::-webkit-details-marker { display:none; }
  .fold > summary::before { content:"›"; display:inline-block; margin-right:6px;
                            transition:transform .15s var(--ease-out); }
  .fold[open] > summary::before { transform:rotate(90deg); }
  .fold > summary:hover { color:var(--fg); }
  /* A link that lands on a collapsed row has to open it — see openTarget() below. */
  :target { scroll-margin-top:16px; }`;

/**
 * The hub's own furniture — the queue meter, the deck gateway, the what-next band and the
 * unit board. Not shared: a page with no board must not ship the board's CSS, which is the
 * whole reason this is a second export rather than more of CHROME.
 */
export const BOARD = `  /* The queue against its box. The tick is the threshold that decides lesson vs drill, so
     it is drawn on the same axis as the fill — a number alone cannot be compared to it. */
  .qm { margin-top:9px; }
  .qm-track { position:relative; height:6px; background:var(--line); border-radius:99px; }
  .qm-fill { height:6px; background:var(--ok); border-radius:99px; }
  .qm-fill.over { background:var(--hi); }
  /* The tick has to stay legible ON TOP of the fill — that is the whole case where it
     matters — so it carries a halo in the tile's own background rather than an opacity. */
  .qm-mark { position:absolute; top:-4px; width:2px; height:14px; background:var(--fg);
             border-radius:2px; box-shadow:0 0 0 1.5px var(--card); }
  .qm-cap { font-size:12px; color:var(--muted); margin-top:5px; }

  /* The one thing the page is for: what to do when you open it. */
  /* The deck is the only page here the learner opens on their own initiative, so it gets a
     gateway of its own rather than a line of prose inside another panel. */
  .deck { display:grid; grid-template-columns:auto 1fr; gap:0 20px; align-items:center;
          background:var(--card); border:1px solid var(--line); border-radius:12px;
          padding:16px 18px; margin-top:14px; text-decoration:none; color:inherit; }
  .deck:hover { border-color:var(--l2); }
  .deck-n { font-size:34px; font-weight:650; letter-spacing:-.02em; line-height:1.05;
            font-variant-numeric:tabular-nums; text-align:center; }
  .deck-nl { font-size:11px; text-transform:uppercase; letter-spacing:.07em;
             color:var(--muted); text-align:center; margin-top:3px; }
  .deck-h { font-size:17px; font-weight:650; }
  .deck-h b { color:var(--l2); font-weight:650; }
  .deck-s { font-size:13.5px; color:var(--muted); margin-top:3px; }
  .deck-foot { font-size:12.5px; color:var(--muted); margin-top:6px; }
  .whatnow { background:var(--card); border:1px solid var(--line); border-left:3px solid var(--l2);
             border-radius:4px 12px 12px 4px; padding:15px 18px; margin-top:14px; }
  .whatnow-h { font-size:12px; text-transform:uppercase; letter-spacing:.08em;
               color:var(--l2); font-weight:650; margin-bottom:6px; }
  .whatnow p { margin:0; font-size:14.5px; }
  .whatnow p + p { margin-top:9px; }
  /* The verdict leads the panel and is the only line set at emphasis weight — the mix chips,
     the queue line and the pointer quote are its evidence, not competing instructions. */
  .whatnow-do { font-size:15.5px; font-weight:600; }
  .whatnow-q { font-size:13.5px; margin-top:9px; }
  .pace { display:flex; flex-wrap:wrap; gap:8px; margin:11px 0 2px; }
  .pace-i { display:flex; align-items:baseline; gap:6px; font-size:13px; padding:5px 11px;
            border:1px solid var(--line); border-radius:999px; background:var(--bg); }
  .pace-i b { font-size:14.5px; font-variant-numeric:tabular-nums; }
  .pace-i.over  { border-color:var(--bad); color:var(--bad); }
  .pace-i.under { border-color:var(--hi); color:var(--hi); }
  .whatnow-next { color:var(--muted); font-size:13.5px; }

  /* ---- the unit board ---- */
  .sortbar { display:flex; align-items:center; gap:8px; margin-bottom:12px; flex-wrap:wrap; }
  .grow { flex:1; }
  .sortb { font:inherit; font-size:12.5px; padding:3px 11px; border-radius:99px; cursor:pointer;
           background:transparent; color:var(--muted); border:1px solid var(--line); }
  .sortb:hover { color:var(--fg); border-color:var(--muted); }
  .sortb.on { color:var(--l2); border-color:var(--l2); }
  .sortb:focus-visible { outline:2px solid var(--l2); outline-offset:2px; }
  .key { font-size:12px; color:var(--muted); display:flex; align-items:center; gap:6px; }
  /* One swatch class for one concept: the board legend and the per-unit counts read the
     same bar, so they carry the same two fills — not the text tokens. */
  .sw { display:inline-block; width:14px; height:6px; border-radius:99px; margin-right:4px; }
  .sw.ok { background:var(--solid); } .sw.no { background:var(--shaky); }
  .unit { background:var(--card); border:1px solid var(--line); border-radius:12px; margin-bottom:9px; }
  .unit[open] { border-color:var(--muted); }
  .ustrip { cursor:pointer; padding:13px 15px; list-style:none; display:block; }
  .ustrip::-webkit-details-marker { display:none; }
  .ustrip:focus-visible { outline:2px solid var(--l2); outline-offset:2px; border-radius:12px; }
  .uhead { display:flex; align-items:baseline; gap:10px; flex-wrap:wrap; }
  .uid { font:13px/1.4 ui-monospace,SFMono-Regular,Menlo,monospace; color:var(--muted); }
  .utitle { font-size:15.5px; }
  .upill { margin-left:auto; font-size:11.5px; color:var(--muted); border:1px solid var(--line);
           border-radius:99px; padding:2px 9px; white-space:nowrap; }
  /* The chevron is the only affordance saying a row opens — details' native marker is off. */
  .uhead::after { content:"›"; color:var(--muted); font-size:17px; line-height:1;
                  transform:rotate(90deg); transition:transform .15s; }
  .unit[open] .uhead::after { transform:rotate(270deg); }
  .ubars { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-top:10px; }
  .ubars .bar-head { font-size:12.5px; }
  .upanel { padding:0 15px 15px; }
  .ucols { display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:18px;
           border-top:1px solid var(--line); padding-top:13px; }
  .upanel h4 { font-size:12px; text-transform:uppercase; letter-spacing:.07em; color:var(--muted);
               margin:0 0 8px; font-weight:600; }
  .asp { display:flex; justify-content:space-between; gap:12px; font-size:13.5px; padding:3px 0; }
  .asp.pending { color:var(--muted); }
  .asp-r { color:var(--muted); font-size:11.5px; white-space:nowrap; letter-spacing:.06em; }
  .chips { display:flex; flex-wrap:wrap; gap:5px; margin-top:9px; }
  .chip { font-size:12.5px; padding:2px 9px; border-radius:99px; border:1px solid var(--line); }
  .chip.t1 { color:var(--t1); border-color:var(--t1); }
  .chip.t2 { color:var(--t2); border-color:var(--t2); }
  .chip.more { color:var(--muted); }
  .upages { margin-top:16px; border-top:1px solid var(--line); padding-top:13px; }
  .pgroup + .pgroup { margin-top:16px; }
  .pg-l { font-size:12px; text-transform:uppercase; letter-spacing:.07em; color:var(--muted);
          font-weight:600; margin-bottom:9px; }`;

/* --------------------------------------------------------------------- the nav */

export const NAV_CSS = `  .nav { display:flex; gap:4px; margin-bottom:20px; flex-wrap:wrap;
         border-bottom:1px solid var(--line); }
  .nav a { font-size:13.5px; padding:7px 13px; text-decoration:none; color:var(--muted);
           border-bottom:2px solid transparent; margin-bottom:-1px; }
  .nav a:hover { color:var(--fg); }
  /* THE PAGE YOU ARE ON CARRIES THE COLOUR (PORT-026). It rendered muted while the two you
     could still take rendered coloured, so the state read as the affordance and the
     affordances read as state. Exactly backwards. */
  .nav a.here { color:var(--l2); border-bottom-color:var(--l2); font-weight:600; }`;

/** Every generated page, in the order a learner meets them. Adding one here puts it in the
 *  nav of all the others — which is the point of the list being here and not in each page. */
const PAGES = [
  { file: "index.html", label: "Hub" },
  { file: "deck.html", label: "The deck" },
  { file: "profile.html", label: "Profile & stats" },
];

/**
 * The nav, with the hub's own entry carrying `tohub`.
 *
 * That class is visualcheck's check 5 — "every page carries the hub link, relative, exactly
 * index.html". A generated page with a nav satisfies it by construction rather than by also
 * shipping a separate back-link: two elements pointing at the same place is how one of them
 * ends up stale. The rule stays real; the nav is what keeps it.
 */
export const nav = (here) =>
  `<nav class="nav">${PAGES.map((p) => {
    const cls = [p.file === here ? "here" : "", p.file === "index.html" ? "tohub" : ""]
      .filter(Boolean).join(" ");
    return `<a class="${cls}" href="${p.file}">${p.label}</a>`;
  }).join("")}</nav>`;

/* ------------------------------------------------------- anchors between pages */

/**
 * Every linkable section of a generated page, declared in one place.
 *
 * ANYTHING WITH A BIGGER REPRESENTATION ELSEWHERE LINKS TO IT, ANCHORED TO THE SECTION
 * (limba PORT-027). A hub tile showing one headline number is a summary of something, and
 * where that something is unpacked at length the tile is the way in. Anchored to the
 * section, never to the top of the page: landing on a 6,000px page and hunting for the
 * thing you clicked is a hint, not a link.
 *
 * It replaced the other approach, which was to copy a shortened version of the fuller view
 * onto the hub — four bars taken off a thirteen-bar ranking, too few to rank anything by
 * and too many to skim past, on the page you act from rather than the page you look back
 * from. **A summary that is a truncated copy is worth less than a link.** The number was
 * already on the tile; only the way through was missing.
 *
 * ANCHORS ARE DECLARED, NOT DERIVED, AND A MISSING ONE THROWS. Deriving the id from the
 * heading means editing a heading silently breaks a link on another page. So the mapping is
 * written down once and `anchorOf` refuses a section it has no anchor for — a link that
 * quietly stops working is worse than a build that stops loudly. Same reasoning as `must()`:
 * the failure that matters is the silent one.
 */
export const ANCHOR = {
  /* the hub's own */
  board: "board",
  shelf: "shelf",
  /* the profile page's */
  claims: "claims",
  coverage: "coverage",
  ladder: "ladder",
  history: "history",
  rhythm: "rhythm",
  pace: "pace",
  mistakes: "mistakes",
  sets: "sets",
  snapshots: "snapshots",
};

/** The id for a declared section, or a build failure naming the section that has none. */
export function anchorOf(key) {
  if (!ANCHOR[key]) {
    throw new Error(
      `page-shell: no anchor declared for section "${key}". Add it to ANCHOR in ` +
        `scripts/page-shell.mjs — ids are declared so that renaming a heading cannot ` +
        `silently break a link on another page.`,
    );
  }
  return ANCHOR[key];
}

/** `href` into another generated page's section — the only way a cross-page link is built. */
export const linkTo = (page, key) => `${page}#${anchorOf(key)}`;

/**
 * A LINK INTO A COLLAPSED DISCLOSURE HAS TO OPEN IT, or the jump lands on a closed row and
 * reads as nothing having happened (limba PORT-027).
 *
 * It runs on load AND on hashchange, because clicking the same anchor twice fires only the
 * second — the first click sets the hash, and every click after that is a no-op unless
 * something listens for it.
 */
export const OPEN_TARGET_JS = `
  (function () {
    function openTarget() {
      var id = location.hash.slice(1);
      if (!id) return;
      var el = document.getElementById(id);
      while (el) {
        if (el.tagName === "DETAILS") el.open = true;
        el = el.parentElement;
      }
      var t = document.getElementById(id);
      if (t) t.scrollIntoView();
    }
    window.addEventListener("hashchange", openTarget);
    openTarget();
  })();`;
