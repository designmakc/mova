<!-- mova:template -->
<!--
  GENERATES: docs/reference/resources.md — the vetted external-resource registry.
  RULES FOR THE GENERATING AGENT:
  - Change the marker above to `mova:instance`; delete guidance comments; fill every
    {{PLACEHOLDER}}.
  - REGISTRY-FIRST is the convention being installed: sessions look here BEFORE
    searching the web, and anything found by live search and shown to the learner gets
    appended here in the same session. Seed from packs/{{PACK_CODE}}/notes.md's
    registry section — those links were vetted on a real learner. Add nothing you have
    not verified resolves; a dead seed link teaches sessions to skip the registry.
  - Trim to the instance: drop pack entries the capability flags make useless (no
    audio → no TTS lines) and entries pointed at a different goal (another exam's
    sample tests).
-->
# Resources — the vetted registry

> Where sessions look before they search. **Living doc**: anything found by live search
> and shown to the learner gets appended here in the same session, with a one-line "use
> it for". Rules for *when* to reach for media: [../mechanics/media.md](../mechanics/media.md).

## Per-word URL patterns (derive, don't search)

<!-- From the pack's notes.md. `<word>` = bare headword, URL-encoded, diacritics where
     the site expects them. -->

| Need | Pattern | Notes |
| --- | --- | --- |
| {{NEED}} | `{{PATTERN}}` | {{NOTES}} |

## Local audio (no network)

<!-- Only when the audio capability flag is true; otherwise one line: "No audio channel
     on this machine — sound work runs through the linked resources above." -->

- `scripts/speak.sh "<text>"` (`--slow`) — the pack voice ({{TTS_VOICE}}), cached, with
  offline fallback. Native recordings still outrank any TTS for prosody.
- {{FURTHER_LOCAL_CHANNELS — pronounce.sh round-trip if stt is available, afplay for
  materials/ audio…}}

## Channels & sites

<!-- Vetted entries from the pack notes + anything the interview surfaced (the learner
     may already follow channels — those go in first, they're pre-vetted by use). -->

| Resource | Use it for |
| --- | --- |
| {{LINKED_RESOURCE}} | {{ONE_LINE_USE}} |

## Accretion rule

New entry = one table row in the right section, added in the session that used it. If a
row turns out weak (dead link, low value), mark it struck-through with a date — the
registry records verdicts, it doesn't silently forget.
