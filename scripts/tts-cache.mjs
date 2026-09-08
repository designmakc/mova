// mova:engine
/**
 * Whether this instance's TTS cache is in play — decided once, for every script that reads
 * or fills it.
 *
 * The cache (`.tts-cache/`, mp3 clips keyed by sha1 of voice + rate + text) holds edge-voice
 * clips only. deck.mjs embeds from it, tts-warm.mjs and tts-embed.mjs fill it, and
 * closeout.mjs decides whether to fill it before the deck is rebuilt. A `tts: say` profile
 * has nothing to warm and nothing to embed — speak.sh speaks the system voice live, never
 * through the cache — and a `tts: none` profile has no voice at all. `audio: false` turns
 * the cache off whatever the voice: the deck would not embed what a warmer produced.
 *
 * WHY ONE FUNCTION. Four scripts each carried their own copy of this comparison, and two of
 * them disagreed. closeout.mjs ran the warmer for "any voice but none"; tts-warm.mjs refused
 * "any voice but edge" with exit 1; and the close-out treats the warmer as a required step.
 * So on a `tts: say` instance — a value setup writes (setup/templates/profile.template.md:
 * `edge | say | none`) — no session that added a word could close. The first real instance
 * to finish a session hit it (Turkish, ChatGPT Codex, 2026-08-24) and ran the regeneration
 * chain by hand. scripts/tts-cache.test.ts holds all four scripts to this function and
 * checks the verdict against every documented value.
 *
 * `why` is the one line a script prints when it skips the cache: the profile value, and
 * what the learner still has. It is null when the cache is on.
 */

/** The `tts:` values setup can write. The test reads the same list off the profile template. */
export const TTS_VALUES = ["edge", "say", "none"];

export function ttsCache(profile) {
  const tts = profile.get("tts", "none");
  const audio = profile.get("audio", "false") === "true";
  const on = audio && tts === "edge";
  let why = null;
  if (!audio) {
    why = `audio: false in the profile — no local playback, so no TTS cache to warm; the deck ships without embedded sound.`;
  } else if (tts === "say") {
    why = `tts: say — the TTS cache holds edge-voice clips only, so there is nothing to warm; the deck ships without embedded sound, and speak.sh still speaks inline through the system voice.`;
  } else if (tts === "none") {
    why = `tts: none — this instance has no voice, so no TTS cache to warm; the deck ships without embedded sound.`;
  } else if (!on) {
    why = `tts: ${tts} is not a value setup writes (${TTS_VALUES.join(" | ")}) — treated as none: nothing to warm, and the deck ships without embedded sound. Set tts: edge in the profile if the neural voice is installed.`;
  }
  return { on, tts, audio, why };
}
