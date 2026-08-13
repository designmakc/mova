#!/usr/bin/env bash
# mova:engine
# Round-trip pronunciation check: record → transcribe in the target language → compare.
#
#   scripts/pronounce.sh "fără zahăr, vă rog" [seconds=6]
#
# macOS-ONLY: recording goes through ffmpeg's avfoundation input and playback assumptions
# match the mac mic pipeline — this is the capability docs/mechanics/media.md gates on.
# Records from the default mic (one-time macOS permission prompt on first use),
# transcribes locally with whisper.cpp (nothing leaves the machine), prints
# target vs heard, and appends the pair to work/speaking/recordings/log.psv.
# The *judgment* (which mismatches are pronunciation vs model noise, what error
# code applies) happens in the session — this script is mechanical on purpose.
#
# The transcription language comes from the active pack's manifest (`stt_lang:` in
# packs/<code>/pack.md, the pack resolved from the profile's `pack:` line). Shell can't
# import scripts/pack.mjs, so it is read with sed; unresolvable degrades to whisper's
# auto-detect with a loud warning.
#
# Model: materials/models/ggml-small.bin (untracked). Upgrade path if the model
# itself mishears too much: ggml-medium.bin from the same HF repo — see
# docs/mechanics/media.md.
set -euo pipefail

TARGET="${1:?usage: pronounce.sh \"target text\" [seconds]}"
SECS="${2:-6}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
MODEL="$ROOT/materials/models/ggml-small.bin"
REC_DIR="$ROOT/work/speaking/recordings"
PROFILE="$ROOT/docs/reference/profile.md"

STT=""
if [ -f "$PROFILE" ]; then
  PACK="$(sed -n 's/^pack:[[:space:]]*//p' "$PROFILE" | sed 's/[[:space:]]*#.*$//;s/[[:space:]]*$//' | head -1)"
  MANIFEST="$ROOT/packs/${PACK:-none}/pack.md"
  if [ -n "$PACK" ] && [ -f "$MANIFEST" ]; then
    STT="$(sed -n 's/^stt_lang:[[:space:]]*//p' "$MANIFEST" | sed 's/[[:space:]]*#.*$//;s/[[:space:]]*$//' | head -1)"
  fi
fi
if [ -z "$STT" ]; then
  echo "pronounce.sh: no stt_lang resolved from the pack manifest — whisper will auto-detect," >&2
  echo "              which mishears short phrases more often. Set stt_lang: in packs/<code>/pack.md." >&2
  STT="auto"
fi

[ -f "$MODEL" ] || { echo "model missing: $MODEL — see materials/README.md"; exit 1; }
mkdir -p "$REC_DIR"

STAMP="$(date +%Y-%m-%d_%H%M%S)"
WAV="$REC_DIR/$STAMP.wav"

echo "🎙  Target: „${TARGET}”"   # braces required: the closing „” byte would join the name
# Recording used to start the instant the prompt printed, so the first takes of a
# session were reliably silence — the learner was still reading (limba, 2026-08-03).
for i in 3 2 1; do printf "\r    starting in %d…  " "$i"; sleep 1; done
printf "\r    ● RECORDING %ss — speak now.        \n" "$SECS"
ffmpeg -hide_banner -loglevel error -f avfoundation -i ":default" \
  -t "$SECS" -ar 16000 -ac 1 "$WAV" 2>/dev/null \
  || ffmpeg -hide_banner -loglevel error -f avfoundation -i ":0" \
       -t "$SECS" -ar 16000 -ac 1 "$WAV"
echo "    ○ transcribing…"

HEARD="$(whisper-cli -m "$MODEL" -l "$STT" -np -nt -f "$WAV" 2>/dev/null \
  | tr '\n' ' ' | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')"

# Loudness gate. whisper hallucinates fluent phrases out of room tone, so a quiet
# take must be flagged mechanically — otherwise the session reads noise as a miss.
MEAN="$(ffmpeg -hide_banner -i "$WAV" -af volumedetect -f null /dev/null 2>&1 \
  | sed -n 's/.*mean_volume: \(-*[0-9.]*\) dB.*/\1/p')"

echo
echo "Target: $TARGET"
echo "Heard : ${HEARD:-(nothing — too quiet, or mic permission denied?)}"
echo "Level : ${MEAN:-?} dB mean"
VERDICT="ok"
if [ -n "$MEAN" ] && awk "BEGIN{exit !($MEAN < -45)}"; then
  VERDICT="DISCARD-room-tone"
  echo
  echo "⚠️  TOO QUIET — this is room tone, not speech (speech lands near -35 dB or louder)."
  echo "    Whatever was 'heard' above is whisper inventing text. Discard and re-record."
fi
# Log the level and the verdict, not just the transcript — a discarded take's "heard" text
# is whisper hallucination and must never be read back as a result (limba, 2026-08-03).
printf '%s|%s|%s|%s dB|%s\n' "$STAMP" "$TARGET" "$HEARD" "${MEAN:-?}" "$VERDICT" \
  >> "$REC_DIR/log.psv"
echo
echo "(recording kept: ${WAV#$ROOT/})"
