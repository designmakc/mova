// mova:engine
/**
 * The single reader of the learner profile's config block.
 *
 * docs/reference/profile.md (generated at setup) is prose for the agent — except ONE
 * fenced block that scripts and test CONTRACT blocks read:
 *
 *   ```mova-config
 *   pack: ro
 *   target_language: Romanian
 *   meta_language: English
 *   native_languages: uk, ru
 *   contrast_ranking: uk > ru > en > de
 *   goal_kind: exam            # exam | level | functional | ledger
 *   goal_label: Romanian B1 exam    # short display phrase (the hub's subtitle)
 *   goal_date: 2027-02-01      # OMIT the line when the goal has no date
 *   sections: R W L S
 *   units: 30
 *   focus: full                # full | drill | vocab | writing — gates which verbs are live
 *   mode: enforced             # enforced | unenforced (node/git missing)
 *   agent: claude-code         # claude-code | opencode | codex | antigravity | other
 *   audio: true
 *   tts: edge                  # edge | say | none
 *   publishing: none           # none | claude-artifacts
 *   template_version: 0.2.0
 *   template_source: <url>     # optional — where /update fetches from; accretes on first update
 *   ```
 *
 * The canonical key list lives in setup/templates/profile.template.md; this block is a
 * worked example of it. The level scale is the PACK's (`level_scale:` in pack.md), not a
 * profile key — the target language decides which scale exists, not the learner.
 *
 * WHY ONE BLOCK. limba kept the learner profile as four partially-circular prose copies
 * plus exactly one machine-read line (the exam date, regex-parsed out of exam.md by
 * hub.mjs). Every new script grew its own regex against its own file. Here every personal
 * parameter a script needs has one owner, one parser, and prose stays prose.
 *
 * Contract: keys are `snake_case`, values are trimmed strings, `#` starts a comment,
 * unknown keys are preserved (forward compatibility — an older engine reads a newer
 * profile). Consumers split lists themselves via list().
 *
 * loadProfile() returns null when profile.md does not exist — that is TEMPLATE MODE
 * (this repo before setup, or the template repo itself). Content tests skip in template
 * mode; scripts that need a learner refuse with a "run setup first" message.
 */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

export const PROFILE_PATH = "docs/reference/profile.md";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

export function loadProfile(repoRoot = root) {
  const path = join(repoRoot, PROFILE_PATH);
  if (!existsSync(path)) return null;
  const text = readFileSync(path, "utf8");
  const m = /```mova-config\n([\s\S]*?)```/.exec(text);
  if (!m) {
    throw new Error(
      `${PROFILE_PATH} exists but has no \`\`\`mova-config block — ` +
        `the profile is mis-generated; re-run the setup step that writes it.`,
    );
  }
  const config = {};
  for (const rawLine of m[1].split("\n")) {
    const line = rawLine.replace(/#.*$/, "").trim();
    if (!line) continue;
    const kv = /^([a-z][a-z0-9_]*):\s*(.*)$/.exec(line);
    if (!kv) {
      throw new Error(
        `${PROFILE_PATH}: unparseable config line "${rawLine.trim()}" — ` +
          `keys are snake_case, one \`key: value\` per line.`,
      );
    }
    config[kv[1]] = kv[2].trim();
  }
  return {
    config,
    /** Required key — throws with the key name so mis-generation fails loudly. */
    require(key) {
      const v = config[key];
      if (v === undefined || v === "") {
        throw new Error(`${PROFILE_PATH}: required config key "${key}" is missing or empty.`);
      }
      return v;
    },
    /** Optional key. */
    get(key, fallback = undefined) {
      return config[key] === undefined || config[key] === "" ? fallback : config[key];
    },
    /** Space- or comma-separated list value. */
    list(key) {
      const v = config[key];
      if (!v) return [];
      return v.split(/[,\s]+/).filter(Boolean);
    },
  };
}
