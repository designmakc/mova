#!/usr/bin/env bash
# mova:engine
# Append one block to the shared retro/feedback file — safe under concurrent writers.
#
#   scripts/feedback.sh "SES-007 /drill" --file /path/to/my-block.md   # preferred
#   scripts/feedback.sh "SES-007 /drill" <<'FB'                        # or stdin
#   ### Insight — ...
#   FB
#
# Why a script instead of an editor tool: several agent sessions append to the
# same file at the same time. A read-modify-write (Edit/Write) silently loses whichever
# block lands second — the writer re-serialises a snapshot taken before the other
# session's append. This takes an atomic mkdir(2) lock, re-reads the file INSIDE the
# lock, numbers the entry, appends, releases. Blocks queue; nothing is overwritten.
#
# Target defaults to the current retro file; override with MOVA_FEEDBACK_FILE.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
# The standing intake, written by the retro playbook and drained by a housekeeping pass.
# Closed cycles keep their own dated file; reach one with MOVA_FEEDBACK_FILE.
FILE="${MOVA_FEEDBACK_FILE:-$ROOT/work/feedback/insights.md}"

SOURCE="" ; BODY_FILE=""
while [ $# -gt 0 ]; do
  case "$1" in
    --file) BODY_FILE="${2:-}" ; shift 2 ;;
    -h|--help) sed -n '3,10p' "$0" ; exit 0 ;;
    *) SOURCE="$1" ; shift ;;
  esac
done
[ -n "$SOURCE" ] || { echo "usage: feedback.sh \"<source label>\" [--file PATH] (else stdin)" >&2; exit 1; }

# Read the body first — outside the lock, so a slow pipe never holds other sessions off.
TMP="$(mktemp -t mova-feedback)"
trap 'rm -f "$TMP"' EXIT
if [ -n "$BODY_FILE" ]; then
  [ -s "$BODY_FILE" ] || { echo "feedback.sh: --file \"$BODY_FILE\" is missing or empty" >&2; exit 1; }
  cat "$BODY_FILE" > "$TMP"
else
  cat > "$TMP"
fi
[ -s "$TMP" ] || { echo "feedback.sh: empty body, nothing appended" >&2; exit 1; }

# The body must not carry its own "## FB-" heading: this script owns the ID, and a body that
# writes one both duplicates the header and — before the numbering below was made max-based —
# inflated the count, mis-numbering the NEXT block and any concurrent writer's too. Three
# blocks and one other session's ID went wrong that way in the reference instance
# (limba, 2026-08-12). Sub-headings are ###.
if grep -q '^## FB-' "$TMP"; then
  echo "feedback.sh: the body contains a '## FB-' heading — this script assigns the ID." >&2
  echo "             Start your block with a '### <kind> — <title>' sub-heading instead." >&2
  exit 1
fi

LOCK="$FILE.lock"
mkdir -p "$(dirname "$FILE")"

# mkdir is atomic on the local filesystem: exactly one waiter wins. ~60s of patience at
# 0.2s intervals, then break a lock whose directory is older than 120s (a crashed writer,
# not a live one).
acquired=0
for i in $(seq 1 300); do
  if mkdir "$LOCK" 2>/dev/null; then acquired=1; break; fi
  if [ "$i" -gt 30 ] && [ -d "$LOCK" ]; then
    age=$(( $(date +%s) - $(stat -f %m "$LOCK" 2>/dev/null || date +%s) ))
    [ "$age" -gt 120 ] && rmdir "$LOCK" 2>/dev/null || true
  fi
  sleep 0.2
done
[ "$acquired" = 1 ] || { echo "feedback.sh: could not take $LOCK after 60s — is a writer stuck? rmdir it and retry" >&2; exit 1; }
trap 'rmdir "$LOCK" 2>/dev/null || true; rm -f "$TMP"' EXIT

# --- critical section: everything below sees a file no one else can be mid-appending ---
[ -f "$FILE" ] || printf '# Feedback intake\n\n' > "$FILE"

# Number from the HIGHEST id present, not from a count: a count silently reuses an id if a
# block is ever removed, and cannot survive a gap. Matches only headers this script wrote —
# id, source, and trailing timestamp — so nothing in a body can be mistaken for one.
N=$(awk '/^## FB-[0-9][0-9][0-9] — .* — [0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9] [0-9][0-9]:[0-9][0-9]$/ {
           n = substr($2, 4) + 0; if (n > m) m = n
         } END { print m + 0 }' "$FILE")
N=$(( ${N:-0} + 1 ))
ID=$(printf 'FB-%03d' "$N")
STAMP="$(date '+%Y-%m-%d %H:%M')"

{
  printf '\n## %s — %s — %s\n\n' "$ID" "$SOURCE" "$STAMP"
  cat "$TMP"
  # Exactly one trailing newline, whatever the body ended with.
  tail -c1 "$TMP" | od -An -c | grep -q '\\n' || printf '\n'
} >> "$FILE"

echo "appended $ID from \"$SOURCE\" → ${FILE#$ROOT/}"
