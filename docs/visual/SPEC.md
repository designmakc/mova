<!-- mova:engine -->
# docs/visual/SPEC.md — the visual system

> Engine-owned rules for **any agent about to build a page**. Read this, copy
> [starter.html](starter.html), consult [gallery.html](gallery.html) for component usage,
> finish with `node scripts/visualcheck.mjs <file>`. The instance's own index and
> retired-claims table live in `work/visuals/README.md` (generated from
> `setup/templates/visuals-readme.template.md`). Rules here carry the incident that
> priced them, attributed "(limba, date)" — the reference implementation this system
> was extracted from.

## 1. Hard constraints

These are not style preferences; each one was paid for.

- **Self-contained, single-file, offline forever.** Inline CSS/JS, no CDN, no external
  fonts, no external requests of any kind — a page must render identically from disk in
  2030. System font stacks only. `visualcheck` fails any external `src`/`href`.
- **Three themes, always.** `prefers-color-scheme` plus explicit
  `[data-theme="dark"]` / `[data-theme="light"]` overrides — the exact block structure in
  [tokens.css](tokens.css). Pages carry a small theme switcher (starter has it).
- **Every page carries the hub link** — `<a class="tohub">`, first thing inside the
  wrapper, **relative href**, in `work/visuals/` exactly `href="index.html"`. A visual
  reached from a chat message or bookmark was a dead end, and the way back was the
  terminal (limba, 2026-08-10). Deploying the folder whole made the sibling link correct
  from disk and from the site — never a hosted URL, never a runtime rewrite
  (limba, 2026-08-13).
- **Audio lives in the row it voices — never in a parallel list** (limba, 2026-08-10:
  *"why is there a need to have two tables?"*). Author `<div class="tts" data-text="…"
  data-en="…"></div>` placeholders inside the cell they voice; `node scripts/tts-embed.mjs
  <file>` inlines the clips and appends the shared player **once**. **Never author the
  player script** — a hand-copied second player gives every button two handlers that
  cancel each other: every clip valid, total silence (limba, 2026-08-12, caught by the
  learner, not CI). A standalone `.tts-row` stack is correct only where the page prints
  nothing to attach to.
- **Practice surfaces use the two-layer reveal** (limba, 2026-08-10): a page-wide mode
  filter (browse / L2→L1 / L1→L2) **plus** a per-item reveal. Concealment covers
  **everything that names the answer** — translation, gender, plural, and the note; a mode
  that hides only one row type leaks the rest (limba u01-deck defect). This applies to
  every drill surface **and every teach-page word list** — a table that can only be read
  is a table the learner re-drills somewhere else. Audio must not out-speak the
  concealment: two clips per row (prompt alone / full pair), swapped by state, and
  playback stops on every state change. Guided attempts (`.rev`/`.ans`) stay inline
  reveals; the two-layer rule is about word lists.
- **Every inflection table marks the changing morpheme** — `prieten<b class="mk">i</b>`,
  with stem shifts in `b.st` — marked segments lining up down the column so the pattern is
  visible without reading. In force **when the active pack declares `inflection: true`**;
  a no-inflection pack's pages carry no morpheme tokens at all. Full rule and stem-change
  caveat: `docs/mechanics/teaching.md` → "Mark what changes".
- **Chat teaches, the page keeps** — the chat/visual split per
  `docs/mechanics/teaching.md`. Concealed answers live on pages, not in chat (chat renders
  `<details>` as raw tags). Every visual is surfaced inline *and* named by repo path in
  the response that delivers it, and gets its index row in `work/visuals/README.md` in the
  same session.

## 2. The style layer: Hallmark, applied once at setup

[Hallmark](https://www.usehallmark.com) (`nutlope/hallmark`, **MIT license, © Together
AI** — attribution here covers every derived token and rule in this folder) is an
anti-generic design skill: OKLCH palette construction, real type pairing, named spacing
scales, exponential easing, and a slop-test that bans the clichés (purple gradients,
centered heroes, zero-chroma greys, italic display type).

mova uses it as **build-time guidance, never a page dependency**:

- **At setup (the one styling moment):** the setup interview takes the learner's vibe and
  crafts the instance theme per Hallmark's custom-theme protocol — anchor accent first
  (chroma 0.12–0.20), paper tinted toward the anchor (chroma 0.005–0.020, never pure
  white/black), inks and greys stepped and tinted, dark theme as a lightness-band remap.
  The result is pinned as **values** in [tokens.css](tokens.css). The **keys** never
  change — they are the contract every component and script speaks.
- **At page build (optional):** an agent may apply Hallmark's craft rules *within* the
  pinned tokens — hierarchy, spacing rhythm, restraint — and may run `hallmark audit` as
  an optional style gate. It must not re-derive colors, import fonts, or restructure the
  shared components.
- **The consistency override, stated plainly:** Hallmark's "never repeat a layout"
  instinct is deliberately **overridden**. A learning workspace is one system the learner
  re-reads for months; navigation memory is part of the product, so pages must read as one
  site, not a portfolio of one-offs. Layout variety is allowed only **within a page
  kind**: `teach` pages may vary macrostructure; `drill` and deck surfaces are strictly
  uniform.

## 3. The token contract

Keys are the contract; values are the pinned theme. Full commented reference:
[tokens.css](tokens.css). Every page inlines the whole block.

| Layer | Keys | Present |
| --- | --- | --- |
| CORE | `--bg --fg --muted --line --card --ok --bad --hi --hiBg` | always — `visualcheck` fails a page missing any |
| LANGUAGE | `--l1 --l1Bg` (support) · `--l2 --l2Bg` (target) · `--new --newBg` | always |
| MORPHEME | `--mk --mkBg` (changing ending) · `--st --stBg` (shifted stem) | only when pack declares `inflection: true` |
| GENDER | `--g-<label> --g-<label>Bg` per pack gender (ro: `--g-m --g-f --g-n`) | only pack-declared labels; zero-gender packs omit; 3+ noun classes take hues from the sequence documented in tokens.css |
| TYPE | `--font-display --font-body --font-mono` | always — system stacks only |
| SPACE | `--space-1` … `--space-7` (4 8 12 16 24 40 64 px) | always |
| MOTION | `--ease-out --ease-in --ease-in-out --dur-1 --dur-2` | always |

## 4. Component inventory

Live examples with usage notes: [gallery.html](gallery.html). Summary:

| Component | What it is | Rules |
| --- | --- | --- |
| `.wrap` | the page column (max-width 900px) | everything sits inside it; hub link first |
| `.tohub` | the hub link | relative; `index.html` inside `work/visuals/`; never `data-hub`, never absolute |
| `.card` (+ `.scroll`) | one idea per card | tables always inside `.card.scroll` — the table scrolls, never the page |
| `.key` | legend of the page's marks | only marks the page actually uses |
| `.l2` / `.l1` | target-language / support-language strings | every target word is `.l2`; never colour meta prose |
| `b.mk` / `b.st` | changing ending / shifted stem | mandatory in inflection tables (pack-gated); segments align down the column |
| `.tag.g-<label>` | gender chip | labels ⊆ pack's declared set (`visualcheck` enforces) |
| `.lede` `.rule` `.warn` `.anchor` | callouts: the point · the carry-away · the trap · the L1 parallel | four fixed voices — never repurposed for emphasis |
| `.big` `.cnt` `code` | worked example line · counted fact · repo paths/literals | `code` never wraps target-language words |
| `.rev` / `.ans` | guided-attempt reveal | strictly 1:1; answers appear nowhere else on the page |
| `.tts` | audio placeholder | authored in the row it voices; embed script does the rest |
| `.vocab` | two-layer drill surface | modes + per-row reveal; everything naming the answer conceals with it; two clips per row |
| `.stripe` | the divider | between teach half and drill half; one per page |

## 5. Authoring checklist

1. Check the index in `work/visuals/README.md` first — improve or supersede an existing
   page; don't fork near-duplicates (`docs/mechanics/media.md`).
2. Copy `docs/visual/starter.html` → `work/visuals/YYYY-MM-DD_slug.html`. Change the
   ownership marker to `<!-- mova:instance -->`, the hub href to `index.html`.
3. Replace `{{TARGET}}`/`{{META}}` placeholders; delete unused exemplar sections. Verify
   every fact per `docs/mechanics/verification.md`.
4. Author `.tts` placeholders in the rows they voice; when generating rows in bulk,
   assert the clip↔row pairing in the generator — nothing at runtime notices drift
   (limba, 2026-08-10).
5. Run `node scripts/tts-embed.mjs <file>` — and never touch the player it appends.
6. Add the index row in `work/visuals/README.md` (same session — a visual the learner
   cannot reopen does not exist).
7. **`node scripts/visualcheck.mjs <file>`** — must pass before the page reaches the
   learner. `npm test` re-runs the same checks in CI.

## 6. Start from starter.html

An agent building a visual **starts from [starter.html](starter.html) and figures out
nothing**: the token block, the three themes, the switcher, every component class, the
reveal machinery and the audio placeholders are already correct there. Build by deleting
what the page doesn't need and filling what it does. A page written from scratch is a
review burden and a drift risk — don't.
