#!/usr/bin/env bash
# mova:engine
# Speak the target language aloud with the best available voice.
#
#   scripts/speak.sh "Bună ziua!"          # neural voice (network), system-voice fallback
#   scripts/speak.sh "fata. fată." --slow  # ~25% slower for new sounds
#
# Primary: Microsoft Edge neural TTS via edge-tts (uv tool). The voice comes from the
# active pack's manifest (`tts_edge:` in packs/<code>/pack.md, the pack resolved from the
# profile's `pack:` line) — set MOVA_VOICE to override. Generated audio is cached in
# .tts-cache/ keyed by voice+rate+text, so repeated phrases replay instantly and offline.
# Fallback when offline / edge-tts missing: the macOS system voice named by the pack's
# `tts_say:`. Rules for when TTS is appropriate at all: docs/mechanics/media.md.
#
# Shell can't import scripts/pack.mjs, so the two manifest lines are read with sed — one
# pass per fact, first match wins. If nothing resolves, this degrades to edge-tts's own
# default voice with a loud warning rather than dying: a session mid-lesson needs sound
# more than it needs configuration hygiene.
set -euo pipefail
export PATH="$HOME/.local/bin:$PATH"

TEXT="" ; SLOW=0
for a in "$@"; do
  case "$a" in
    --slow) SLOW=1 ;;
    *) TEXT="$a" ;;
  esac
done
[ -n "$TEXT" ] || { echo "usage: speak.sh \"text\" [--slow]"; exit 1; }

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CACHE="$ROOT/.tts-cache"
PROFILE="$ROOT/docs/reference/profile.md"

VOICE="${MOVA_VOICE:-}"
SAY_VOICE=""
if [ -f "$PROFILE" ]; then
  PACK="$(sed -n 's/^pack:[[:space:]]*//p' "$PROFILE" | sed 's/[[:space:]]*#.*$//;s/[[:space:]]*$//' | head -1)"
  MANIFEST="$ROOT/packs/${PACK:-none}/pack.md"
  if [ -n "$PACK" ] && [ -f "$MANIFEST" ]; then
    [ -n "$VOICE" ] || VOICE="$(sed -n 's/^tts_edge:[[:space:]]*//p' "$MANIFEST" | sed 's/[[:space:]]*#.*$//;s/[[:space:]]*$//' | head -1)"
    SAY_VOICE="$(sed -n 's/^tts_say:[[:space:]]*//p' "$MANIFEST" | sed 's/[[:space:]]*#.*$//;s/[[:space:]]*$//' | head -1)"
  fi
fi
if [ -z "$VOICE" ]; then
  echo "speak.sh: no voice resolved (profile pack: → packs/<code>/pack.md tts_edge:, or set MOVA_VOICE)" >&2
  echo "          falling back to edge-tts's default voice — probably the WRONG language." >&2
fi

if command -v edge-tts >/dev/null 2>&1; then
  mkdir -p "$CACHE"
  # shasum (not md5): /usr/bin-resident, and macOS bash 3.2 + set -u forbids the
  # empty-array trick — hence the plain if/else below (bit limba 2026-07-30).
  KEY="$(printf '%s|%s|%s' "${VOICE:-default}" "$SLOW" "$TEXT" | shasum | cut -c1-32)"
  MP3="$CACHE/$KEY.mp3"
  if [ ! -s "$MP3" ]; then
    if [ -n "$VOICE" ]; then
      if [ "$SLOW" = 1 ]; then
        edge-tts --voice "$VOICE" --rate=-25% --text "$TEXT" --write-media "$MP3" 2>/dev/null || rm -f "$MP3"
      else
        edge-tts --voice "$VOICE" --text "$TEXT" --write-media "$MP3" 2>/dev/null || rm -f "$MP3"
      fi
    else
      if [ "$SLOW" = 1 ]; then
        edge-tts --rate=-25% --text "$TEXT" --write-media "$MP3" 2>/dev/null || rm -f "$MP3"
      else
        edge-tts --text "$TEXT" --write-media "$MP3" 2>/dev/null || rm -f "$MP3"
      fi
    fi
  fi
  if [ -s "$MP3" ]; then
    afplay "$MP3"
    exit 0
  fi
fi

# Offline / failure fallback: the compact macOS system voice from the pack manifest.
if [ -n "$SAY_VOICE" ]; then
  if [ "$SLOW" = 1 ]; then say -v "$SAY_VOICE" -r 140 "$TEXT"; else say -v "$SAY_VOICE" "$TEXT"; fi
else
  echo "speak.sh: no tts_say voice in the pack manifest — using the system default voice." >&2
  if [ "$SLOW" = 1 ]; then say -r 140 "$TEXT"; else say "$TEXT"; fi
fi
