<!-- mova:engine -->
# Media — when a session plays, draws, or links instead of typing

> Some content cannot be texted. Sounds get **played**, systems get **drawn**, and
> everything shown to the learner gets **kept**. Added in limba, 2026-07-30, after its first
> unit session sent the learner to YouTube by hand — the failure this mechanic prevents.
> Incidents and Romanian examples are limba's, the reference implementation.
>
> **Capabilities gate the channels, never the principle.** The profile declares what this
> instance can do — `audio:` (local playback and the mic pipeline), `tts:` (`edge` / `say` /
> `none`), `publishing:` (`none` / `claude-artifacts`) — and the pack manifest names the
> voices (`tts_edge`, `tts_say`) and the speech-recognition language (`stt_lang`). A channel
> the profile does not declare falls back to the registry's links; it is never silently
> skipped without a fallback.

> **Rules live here; the story lives in [why/media.md](why/media.md).** This file is what a
> session reads before it teaches. The incidents, audits and measurements that bought
> each rule moved to `why/` — a retro reads both, a lesson reads only this one. New
> provenance goes to `why/`, never back into this file.

## The principle

**Hear = play or link** (authenticity matters — a sound described is a sound not learned).
**See = generate first, link second** (a tailored visual with this learner's own contrast
anchors beats anything found). **Keep = every resource shown lands in a registry, an
index, or an inventory** — a resource shown but not recorded violates the same principle
as an unlogged session.

## Decision table — content type → default channel

| Content | Channel | How |
| --- | --- | --- |
| New phonemes, minimal pairs, word stress | **Hear now** | `scripts/speak.sh "<text>"` inline during the explanation (`--slow` for first contact); add a native-pronunciation link (URL patterns in [../reference/resources.md](../reference/resources.md)) for native confirmation of the genuinely tricky items |
| Prosody, intonation, connected speech | **Native audio preferred** | native clips, podcast episodes and the registry's audio sources are the model; `speak.sh`'s neural voice is acceptable for a quick sentence-melody demo — the compact `say` voice never is |
| Listening practice & Listening mocks | **Session plays** | `afplay materials/<file>` (`audio: true`) — the session proctors: plays, pauses, takes answers (manual playback stays the fallback) |
| Morphology systems, contrasts, coverage maps, decision flows | **Generate a visual** | Self-contained HTML/SVG → `work/visuals/YYYY-MM-DD_slug.html`, built per [../visual/SPEC.md](../visual/SPEC.md), with embedded audio (below); index updated same session; **committed and surfaced** — see "Delivering a visual" below |
| Concrete culture/realia (maps, food, places) | **Link out** | Optional, rarely load-bearing — registry or a one-off link that then joins the registry |
| Learner's own pronunciation | **Round-trip check** | `scripts/pronounce.sh "<target>"` (requires the mic pipeline — `audio: true`) — records, transcribes locally in the target language (whisper.cpp, language from the pack's `stt_lang`), prints target vs heard. The session judges mismatches and codes real ones under the instance's pronunciation error code (limba: `PRON`) |

Curriculum units whose default channel isn't text carry a `- **Media:**` bullet naming it
(e.g. an audio-first first unit) — the lesson playbook honors it without being asked.

## Local audio toolbox (capability-gated)

These commands exist when the profile declares the desktop capabilities (`audio: true`,
`tts: edge` or `say`). Away from them (mobile, web, `audio: false`), the link channels in
the registry are the fallback for everything.

```
scripts/speak.sh "<text>"          # speak the target language — the pack's neural voice (manifest tts_edge; MOVA_VOICE=<voice> to switch)
scripts/speak.sh "<text>" --slow   # ~25% slower for new sounds
node scripts/tts-embed.mjs <f.html># fill a visual's audio placeholders with playable neural audio
node scripts/tts-warm.mjs          # voice every drillable ledger row into the cache, for the deck (--dry lists)
afplay materials/<file>.mp3        # play downloaded goal-source audio (Ctrl-C to stop)
open work/visuals/<file>.html      # open a generated visual in the browser
scripts/pronounce.sh "<text>" [s]  # pronunciation round-trip (mic → whisper.cpp → diff)
say -v <voice> "<text>"            # last-resort offline voice (manifest tts_say, compact quality) — speak.sh falls back to it automatically
```

**Two of these reach the network once per clip — `tts-embed.mjs` and `tts-warm.mjs` — and
both are announced before they start** ([narration.md](narration.md) § 2). They are the only
stretches in a session where the learner waits with nothing to do.

Voice quality ladder (limba, 2026-07-30, decided after its compact fallback voice
disappointed): **`speak.sh` with the pack's neural voice** for all demos — sentence melody
included, they're genuinely close to native; cached in `materials/tts-cache/` so repeats are
instant and offline. **Native recordings** (the registry's pronunciation and audio sources)
stay the ground truth for prosody and connected speech — TTS of any quality is a model of
the language, not the language. **The compact `say` voice** (manifest `tts_say`) is the
offline emergency only. Optional extra on macOS: System Settings → Accessibility → Spoken
Content → Manage Voices may offer an *Enhanced* download that upgrades the fallback itself.

**Round-trip honesty rules.** The check catches *phoneme-category* misses — it cannot grade
accent quality or prosody; the tutor and the goal's assessor stay the judges of that.
Whisper **hallucinates short phrases on near-silence** (limba verified it 2026-07-30: 2 s of
quiet room → „Suntem in fiecare") — a transcript from a take where nothing was clearly said
is noise, discard it and re-record. One mishearing = maybe model noise; the same word missed
twice = an entry in the error log. If clearly-read words keep coming back wrong, the model
is the bottleneck — upgrade `materials/models/` from ggml-small to ggml-medium before
blaming the learner. Recordings stay local (`work/speaking/recordings/`, untracked — voice
is personal data); the target|heard log travels with them.

## Finding: registry first, search last

1. **Registry** — [../reference/resources.md](../reference/resources.md): vetted links and
   per-word URL patterns. Covers most needs with zero searching.
2. **URL patterns** — per-word needs (pronunciation, definition, conjugation) are
   *derivable* links; construct them, don't search for them.
3. **Live web search** — only when the registry has nothing. Whatever is found **and shown
   to the learner is appended to the registry at close-out**, with a one-line "use it
   for". That's how the registry earns its "check here first" status.

## Keeping: the preservation map

| Resource kind | Lives in | Reachable via |
| --- | --- | --- |
| External links & channels | [../reference/resources.md](../reference/resources.md) | registry sections |
| Generated visuals | `work/visuals/` | its README index table, and the hub below |
| The hub | `work/visuals/index.html` | generated by `scripts/hub.mjs` at close-out; the learner's one bookmark — opened from disk in the base case (a `publishing:` capability adds a hosted home page) |
| Profile and stats | `work/visuals/profile.html` | generated by `scripts/profilepage.mjs` at close-out; what the workspace has settled about the learner, and what the record measures |
| Downloaded files (PDF/audio) | `materials/` (untracked) | its README inventory |
| TTS demos | nowhere — ephemeral by design | the command itself is the record; any session can re-speak any text |

**The generated pages are generated, never authored.** The hub, the deck and the profile page
each read every number from the file that owns it — the ledgers, the topic map, the
curriculum, the logs, the goal date, the visuals index. Nothing about the learner's progress
is ever typed into any of them. **A view of moving state must be regenerated, or it is
misinformation with a nice layout** ([why/media.md](why/media.md) for what broke first).

**Two rules the learner sees.** **A summary links to its fuller view, anchored to the
section** — never to the top of the page, and never as a shortened copy of it, because *a
summary that is a truncated copy is worth less than a link*. And **anything clickable says
so**, with a cue that is always visible: a hover-only affordance tells the reader nothing
until they are already on top of it.

Building or changing a generator is a different job with its own rules —
[../visual/SPEC.md](../visual/SPEC.md) → Generated pages.

## Delivering a visual — it has to actually render

Added in limba, 2026-07-31 (SES-004), after two failures in one session:

1. **Local files are the delivery — the base case has no hosting.** A visual is a
   self-contained page in `work/visuals/`, opened in the learner's browser from disk
   (`open work/visuals/<file>.html`); the hub is the one bookmark, and every page is one
   ordinary relative link from it, resolving the same for every session. Give the learner
   a **link they can click** and the repo path, send the file inline in the response, index
   it **as soon as it exists** (rule 3), and commit it at close-out — a page that was
   **sent, indexed and committed** is delivered.

   **A repo path is not a link.** Every response that builds or regenerates a page carries the
   page's **absolute `file://` URL on its own line** — `file:///…/work/visuals/<file>.html` —
   which terminals and chat clients turn into something the learner clicks. The repo path stays
   as well: it is the record, and it is what a later session greps. The rule covers every
   generated page at close-out, not only teach pages. When the profile declares `publishing:`,
   the hosted URL leads and the `file://` one follows as the offline copy. Indexed and
   committed but never sent is **built**, a real third state with its own row shape (rule 3)
   and its own exit ([session_format.md](session_format.md) → the materials-prepared exit).
   An attachment *alone* is not delivery either ([why/media.md](why/media.md)).

   **Hosted publishing is a capability branch, not the default.** Only when the profile
   declares `publishing: claude-artifacts` does a page also get a hosted copy — and then
   limba's lesson applies in full: two copies are two answers to "which one is current", and
   the hosted one is only as fresh as its last publish. Record the hosted URL in the index
   row, and republish to **that same recorded URL** every time the file changes, or the
   learner's bookmark orphans. limba retired per-page publishing (2026-08-13) for exactly
   this cost; an instance that opts in accepts the republish discipline with it.
2. **Check the markup before sending.** An unclosed `<div>` nested three worked examples inside
   each other and collapsed them into a 120px column — invisible when authoring, obvious to the
   learner. Run a tag-balance check over the file, then open it and verify the DOM (no nested
   blocks, no zero-width containers, no horizontal overflow). **Verify it yourself; never ship a
   visual whose rendering you have not seen.**

   **How, concretely** (limba, 2026-08-12 — the rule stood for twelve days with no supported
   method, and the gap is exactly how a page with dead audio reached the learner). A `file://`
   URL is refused by the preview tooling, so the folder has to be served to be seen. Serve it
   and drive the real page (the launch config is adapter-generated at setup — for Claude Code,
   `.claude/launch.json` with a static server on `work/visuals/`):

   ```
   preview_start { name: "visuals" }
   navigate      http://localhost:8791/<file>.html
   ```

   Then **assert against the DOM, not against a screenshot** — the faults that ship are the
   ones that look right. Click a play button and check the audio element actually advanced;
   toggle each reveal mode and count what is concealed; check `scrollWidth` against the
   viewport. **Do not verify with ad-hoc greps over the file** ([why/media.md](why/media.md)).
   The page in a browser is the only witness that counts; `scripts/visualcheck.mjs` runs the
   static half of these checks pre-publish.
3. **The index row and the hub go in the moment the page exists — not at close-out.** As soon
   as `node scripts/visualcheck.mjs <file>` exits 0, write the row and run
   `node scripts/hub.mjs`. Two commands, in that order, before the page is sent or taught:

   ```
   # row into work/visuals/README.md, then:
   node scripts/hub.mjs
   ```

   The row is the file link, what it teaches, its units and its kind. A page that sits in no
   index is invisible to every later session — the same failure as an unlogged one
   ([why/media.md](why/media.md)).

   **The `Teaches` cell is one sentence, capped at 120 characters, and the cap is set to the
   clamp rather than to taste** — the hub renders the cell verbatim as the card's description,
   so its length *is* the card's length, and a looser cap passes the test while cutting the
   sentence off mid-word on the page. Write what the page **gives the learner**; put the long
   form in the README's **Build notes** section, which nothing renders and which a later
   session reads to decide whether to reuse, improve or supersede the page. Unlike every other
   late rule here the cap is **not dated**: an index is a mutable registry, not an append-only
   log, so every row is rewritten in the same pass and a date gate would enforce nothing
   ([why/media.md](why/media.md)).

   **The link text is the card's title, so write a title** — a name in the meta-language. The
   slug is the address and stays in the target language.

   **The row also records the date it reached the learner.** The workspace decides what to
   build next from what it believes worked, so a later session reading a jump in the ledger has
   to be able to tell retention from a fresh page arriving. Anything that changes what the
   learner has in hand is an **event**, whether or not it took an `SES-NNN`
   ([why/media.md](why/media.md)).

   **A page built but not taught gets its row too — with the Date column left `—` and
   `Built —` opening its Teaches cell** (2026-08-15). The row records the unit the material
   is for and where the session stopped; the session that later *teaches* the page fills the
   Date in at its close-out. Until then the schema has no honest date to offer, and both
   first generated lesson pages paid for the gap: one wrote the build date into a column
   that means *delivered*, the other left the page out of the index entirely — and out of
   the hub, so the learner could not open it at all (found in the first generated lesson
   pages, 2026-08-15). **Never date a delivery that has not happened**: the ledgers
   and the pacing arithmetic read this column as evidence about what the learner has seen.
   The rest of that state — commit, hub, where you stopped — is
   [session_format.md](session_format.md) → the materials-prepared exit.
4. **Never describe a page you have not read** (limba, 2026-08-12). A session told the learner
   the hub *"still shows 9 visuals"*; it showed **8** and a stamp five days old, and the
   session had no basis for the claim at all — the learner's screenshot is what settled it.
   Read the repo file: with local delivery it is exactly what the learner opens. Two gaps
   survive that, both about *time*, not copies: this workspace can run several sessions at
   once, so another session's commit moves the state under you — and a `publishing:` instance
   re-adds the lag between commit and hosted copy. Describe the file as it stands and say so.
5. **Generated pages are overwritten, never merged.** Each is built from repo files and carries
   a `GENERATED … do not edit` banner, so a conflict has nothing to merge — regenerate, and the
   newer generation wins by construction. Full path in
   [session_format.md](session_format.md) close-out step 9.
6. **The design question is closed at setup — the theme is pinned.** Setup crafts the instance
   theme once into `docs/visual/tokens.css`; every page inherits it, plus the semantic tokens,
   components and page-building rules in [../visual/SPEC.md](../visual/SPEC.md) (begin a page with
   `node scripts/newvisual.mjs <slug>`, patterns in `docs/visual/gallery.html`). Tooling that offers a
   general design pass first (palette, typography, "avoid templated designs") has nothing to
   add here; `scripts/visualcheck.mjs` checks the result. Repo visuals **inherit those
   conventions**; say that once and move on rather than re-deriving it per page.

## Reuse rule for visuals

Before generating, check the `work/visuals/` index. If a visual for that zone exists,
**improve it in place** (same filename) or supersede it with a new dated file and mark the
old row "superseded" — don't fork near-duplicates. **A row opening `Built —` is material a
previous session prepared and never taught**: open it and teach from it, and do not build a
second page for that unit. Visuals are self-contained (inline CSS/JS, no CDN, no external
fonts) so they render offline years from now.

**Read the index table in full — never a truncated head of the file.** The README's prose
header runs long before the table starts, so a "read the first N lines" habit returns the
conventions and almost none of the rows, and the reuse rule silently does not run
([why/media.md](why/media.md)). `grep` the rows (`grep -n '| 20' work/visuals/README.md`) or
read from the `## Index` heading down.

## Audio inside visuals — the learner never needs a terminal

Author the visual with empty placeholders, then fill them:

```html
<div class="tts" data-text="Bună ziua!" data-en="Good day!"></div>
<div class="tts" data-text="fată. fata." data-en="a girl. the girl." data-slow></div>
```

```
node scripts/tts-embed.mjs work/visuals/<file>.html
```

**Announce the build before this command, not after** ([narration.md](narration.md) § 2):
one network call per clip, and once the chain starts the next chance to speak is when it
ends.

Each placeholder becomes a play button with the audio inlined as a base64 data URI —
self-contained, offline, permanent, and the same neural voice `speak.sh` uses (shared cache,
identical key, so nothing is generated twice). Already-filled placeholders are skipped, so
re-running after adding rows is safe.

**No size budget.** Embed every target-language string worth hearing — a phrase costs ~35 KB,
and hearing the material beats keeping files small.

**Concealed answers also live here.** Chat renders plain markdown only — `<details>` shows
as raw tags in the learner's client — so guided-attempt reveals belong in the visual, where
real buttons work ([teaching.md](teaching.md) ⑦).

**The visual is the canonical copy of the material**, not a supplement to chat: full
paradigms, the vocabulary table with audio on every item, and the guided attempts live here,
while chat carries the contrast and the interaction. The split is tabulated in
[teaching.md](teaching.md) → "Where each beat lives". The reason is preservation, not
aesthetics — the chat transcript dies with the session, and this directory does not.
