<!-- mova:engine -->
# docs/visual/SPEC.md — the visual system

> Engine-owned rules for **any agent about to build a page**. Read this, copy
> [starter.html](starter.html), consult [gallery.html](gallery.html) for component usage,
> finish with `node scripts/visualcheck.mjs <file>`. The instance's own index and
> retired-claims table live in `work/visuals/README.md` (generated from
> `setup/templates/visuals-readme.template.md`). Rules here carry the incident that
> priced them, attributed "(limba, date)" — the reference implementation this system
> was extracted from — or "(found in the first generated lesson pages, 2026-08-15)", the
> day two real instances each built a first page from this spec and produced the same four
> defects: leaked answers, an open word list, no verification markers, and a script the
> learner does not read.

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
- **Every page carries the mark** — `<link rel="icon">` with the icon embedded as a
  `data:` URI, from [scripts/favicon.mjs](../../scripts/favicon.mjs). The hub is the one
  bookmark and study pages sit in tabs for months; a blank tab icon is how a workspace gets
  lost among thirty others. It is **engine-fixed, not part of the pinned theme** — the icon
  renders outside the page, where the token block does not reach, so its two colours are
  literal sRGB (the shipped `--hi` and `--bg`). It arrives with the starter and needs no
  authoring step; `visualcheck` fails a page without it, holds the two `docs/visual/` pages
  to the canonical string byte for byte, and lets an instance re-tint its own copies as
  long as they stay embedded. Safari ignores `data:` favicons and shows its generic icon —
  the alternative was a sibling file that dies when a page travels, so the tab stays plain
  there rather than the page reaching out.
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
  **`visualcheck` now fails the open list**, and the line it draws is: a table whose rows
  pair **one** target-language form with its translation is a word list and gets the
  surface; a **paradigm** table — the same word in two or more forms across the row — is
  reference material and stays open, because its job is to make a pattern visible at a
  glance (`docs/mechanics/teaching.md` → "Mark what changes"). The first generated German
  page opened with a fully-printed ten-row copy of its own drill list, and that open table
  is what handed away all three of its guided-attempt answers (found in the first generated
  lesson pages, 2026-08-15).
- **The answers behind the reveals are printed nowhere else on the page.** Not a promise
  in the page's prose — a gate: `visualcheck` runs `scripts/leakcheck.mjs` over the page in
  visual mode and **fails on HIGH**. Two first-ever generated pages shipped `3 of 3` and
  `5 of 5 items give their answer away` while `visualcheck` printed `✓`, because leakcheck
  was a second command that no authoring document named (found in the first generated
  lesson pages, 2026-08-15). One page, one gate. An item whose answer sits in a table above
  it is a worked example wearing an attempt's clothes — ask it over a novel word instead
  (`teaching.md` → the dulap pattern). A page must never *tell* the learner its answers
  appear nowhere else; the German page printed that sentence over three leaking items.
- **Every asserted language fact carries its verification state**
  (`docs/mechanics/verification.md`, AGENTS.md invariant 6). Dictionary-verified,
  tutor-confirmed, or visibly marked unverified — no fourth state, and "the agent is sure"
  is state 3. On a page: the `?` marker (`span.unv`) sits on the form itself, and a `.src`
  note at the foot carries the trail — what attested these facts, and when. When the active
  pack ships **no dictionary adapter**, state 1 is unreachable, so the note becomes the
  **unverified banner** and `visualcheck` fails the page without it. The first generated
  Romanian page asserted ~60 facts and the German page ten phrases — under a pack with no
  dictionary at all — with zero markers and no trail (2026-08-15).
- **Only the scripts the instance uses reach the page.** The target language, the meta
  language, the learner's own languages, and shared punctuation — nothing else.
  `visualcheck` derives the allowed set from the profile and the pack and flags the rest;
  U+FFFD always fails, because the bytes behind a replacement character are already lost.
  A generated German page printed `formal场合` in a learner-facing table cell, twice, and
  the same run wrote a mojibake into the instance's error taxonomy (2026-08-15). Stray
  script in a learner-facing string is a generation artifact, never language.
- **Every inflection table marks the changing morpheme** — `prieten<b class="mk">i</b>`,
  with stem shifts in `b.st` — marked segments lining up down the column so the pattern is
  visible without reading. In force **when the active pack declares `inflection: true`**;
  a no-inflection pack's pages carry no morpheme tokens at all. Full rule and stem-change
  caveat: `docs/mechanics/teaching.md` → "Mark what changes".
- **Chat teaches, the page keeps** — the chat/visual split per
  `docs/mechanics/teaching.md`. Concealed answers live on pages, not in chat (chat renders
  `<details>` as raw tags). Every visual is surfaced inline, handed over as a
  **clickable `file://` link**, *and* named by repo path in the response that delivers it,
  and gets its index row in `work/visuals/README.md` — plus a hub rebuild — as soon as it
  passes the gate, so it is reachable from the one bookmark before it is taught. A path the
  learner has to go find is not a delivery (`docs/mechanics/media.md` → Delivering a
  visual).

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
| `.rev` / `.ans` | guided-attempt reveal | strictly 1:1; answers appear nowhere else on the page — `visualcheck` runs `leakcheck` and fails on HIGH |
| `.tts` | audio placeholder | authored in the row it voices; embed script does the rest |
| `.vocab` | two-layer drill surface | modes + per-row reveal; everything naming the answer conceals with it; two clips per row. Required for **every** word list, teach-page included |
| `.unv` | the unverified `?` marker | sits on the form it doubts, inside the cell that carries it (`verification.md`) |
| `.src` | the page's verification trail | at the foot: what attested these facts and when — or the unverified banner on a pack with no dictionary |
| `.stripe` | the divider | between teach half and drill half; one per page |

## 5. Authoring checklist

1. Check the index in `work/visuals/README.md` first — improve or supersede an existing
   page; don't fork near-duplicates (`docs/mechanics/media.md`).
2. **Run `node scripts/newvisual.mjs <slug> [--vocab]`.** It writes
   `work/visuals/YYYY-MM-DD_slug.html` with the frame already correct — tokens, three
   themes, ownership marker, hub href, reveal machinery, all eight beats scaffolded — and
   the skeleton passes every `visualcheck` gate before you write a word. It refuses to
   overwrite an existing page, because a page that exists is prepared material or a
   sibling session's work in flight. Copying `starter.html` by hand still works and is
   what the generator does for you; it is also how two limba pages ended up carrying the
   audio player's CSS two and three times over.
3. Fill **every one of the eight teaching beats** the starter scaffolds (§7). Replace
   `{{TARGET}}`/`{{META}}` placeholders; delete a beat only when it genuinely does not
   apply to this material.
4. Verify every fact per `docs/mechanics/verification.md`, then keep the `.src` note that
   matches this pack's dictionary situation and put `?` markers on what nothing attested.
5. Author `.tts` placeholders in the rows they voice; when generating rows in bulk,
   assert the clip↔row pairing in the generator — nothing at runtime notices drift
   (limba, 2026-08-10).
6. Run `node scripts/tts-embed.mjs <file>` — and never touch the player it appends.
7. **`node scripts/visualcheck.mjs <file>`** — must pass before the page reaches the
   learner. `npm test` re-runs the same checks in CI.
   **This is the only gate, and it is the whole gate.** It runs the answer-leak check
   (`scripts/leakcheck.mjs`, visual mode) over the page itself and fails on HIGH; it fails
   an open teach-page word list; it fails a fact-carrying page with no verification trail;
   it fails characters from scripts this instance does not use. Nothing here is a
   "consider also running" — two pages passed the old gate and reached learners with every
   one of those defects (found in the first generated lesson pages, 2026-08-15). If a check
   is wrong about your page, fix the check with the incident written down; do not route
   around it.
8. **Add the index row in `work/visuals/README.md`, then run `node scripts/hub.mjs`** —
   the moment the gate passes, not at close-out. A visual the learner cannot reopen does
   not exist, and the hub is what they reopen it from (`docs/mechanics/media.md` →
   Delivering a visual, rule 3). Date the row only if you are handing the page over now;
   otherwise `—` plus `Built —` opening the Teaches cell.

## 6. Start from the generator, which starts from starter.html

An agent building a visual **runs `node scripts/newvisual.mjs <slug>` and figures out
nothing**: the token block, the three themes, the switcher, every component class, the
reveal machinery, the audio placeholders and **all eight teaching beats** arrive already
scaffolded. Build by filling what the page needs and deleting only what it genuinely
doesn't. A page written from scratch is a review burden and a drift risk — don't.

[starter.html](starter.html) remains the single definition of that frame — the generator
reads it rather than holding a second copy, so this file, the reference page and every
generated page cannot disagree. Read the starter to understand a component; run the
generator to begin a page.

Because agents take the starter literally, **the starter is a rule surface, not a sample**.
Its four exemplar sections used to scaffold four sections in the same circled-numeral
typography as the beat table in `docs/mechanics/teaching.md`; the first two generated pages
read those numerals as the beat list and shipped missing beats — ③ and ⑥ on one page, ④ and
⑥ on the other (2026-08-15). Anything the starter shows, a page will contain; anything it
omits, a page will omit. Add a slot before you add a rule.

## 7. The page's numbered sections are the eight beats

`docs/mechanics/teaching.md` owns the beats and their order; this section says what that
means for the markup, so the two cannot drift apart again.

| Beat | Section in the page | Lives where |
| --- | --- | --- |
| ① Placement | the coverage table — topic · this section · coverage · deferred · serves | chat **and** page |
| ② The whole system | the complete inventory, marked per "Mark what changes" | **page is canonical** — chat names it and links, never re-prints it |
| ③ The load | what to memorise, as a number, and what derives | chat **and** page |
| ④ The delta | the contrast, `.anchor` + `.warn` | chat **and** page |
| ⑤ Worked examples | `.big` lines, run forwards | all on the page, 1–2 in chat |
| ⑥ First contact only | named-but-not-taught, each with its return unit | chat **and** page |
| ⑦ Guided attempt | `.rev`/`.ans` items | **page only** — reveal buttons need real HTML |
| ⑧ The compressed rule | `.rule`, one line | chat **and** page |

No beat is chat-only, so every beat has a slot in the starter. The word list is **not** a
beat — it is the 10–20 vocabulary items `teaching.md` puts in the visual, it sits after the
`.stripe`, and it takes the two-layer surface. It carries no numeral, so the numerals on a
page mean one thing only.

Beat ⑥ is the one that gets dropped, and both first-generated pages dropped it. It is not
padding: it is what makes `complete` believable everywhere else, because a learner who can
see the named gaps can trust the unnamed absences.
