// mova:engine
/**
 * One verdict on the TTS cache, held across every script that touches it.
 *
 * CONTRACT. `closeout.mjs --finish` completes on every `tts:` value setup can write, and
 * runs the warmer exactly when the deck will embed what it warms. On 2026-08-24 the first
 * real instance to reach a close-out (Turkish, `tts: say`) could not: the close-out's gate
 * said "any voice but none", the warmer's said "edge only", and the warmer's exit 1 stopped
 * the ritual at a required step. The agent ran the regeneration chain by hand.
 *
 * Three things hold it:
 *
 *   1. The verdict is right for every documented value, against a fixture profile per
 *      value. The list of values is read off the profile template, so a value added there
 *      without a verdict here fails, and so does a verdict for a value setup never writes.
 *   2. Every script that reads or fills the cache takes the verdict from tts-cache.mjs and
 *      keeps no comparison of its own. Source-level, and crude the way
 *      narration.callsite.test.ts is crude: it cannot judge a gate, it catches a second one.
 *   3. In an instance, the profile's own value is a documented one, and on a profile with no
 *      cache the warmer exits 0 (`--dry`, which never reaches the network). Skips in the
 *      template repo, where there is no profile.
 */
import { describe, it, expect, afterAll } from "vitest";
import { readFileSync, existsSync, mkdirSync, mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
// @ts-expect-error — untyped engine module
import { loadProfile, PROFILE_PATH } from "./profile.mjs";
// @ts-expect-error — untyped engine module
import { ttsCache, TTS_VALUES } from "./tts-cache.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (rel: string) => readFileSync(join(root, rel), "utf8");

/** The scripts that read or fill `.tts-cache/`. A new one joins this list and imports the verdict. */
const CACHE_SCRIPTS = ["scripts/closeout.mjs", "scripts/tts-warm.mjs", "scripts/tts-embed.mjs", "scripts/deck.mjs"];

const TEMPLATE = "setup/templates/profile.template.md";

/** The values the template's own comment documents: `tts: {{TTS}}   # edge | say | none`. */
function documentedValues(): string[] {
  const m = /^tts:.*#\s*(.+)$/m.exec(read(TEMPLATE));
  expect(m, `${TEMPLATE} has no \`tts:\` line with a \`# a | b | c\` comment naming its values`).not.toBeNull();
  return m![1].split("|").map((s) => s.trim()).filter(Boolean);
}

/** A profile built from one config block, read through the real parser. */
const tmp = mkdtempSync(join(tmpdir(), "mova-tts-cache-"));
afterAll(() => rmSync(tmp, { recursive: true, force: true }));
let n = 0;
function fixture(config: Record<string, string>) {
  const dir = join(tmp, String(n++));
  mkdirSync(join(dir, dirname(PROFILE_PATH)), { recursive: true });
  const block = Object.entries(config).map(([k, v]) => `${k}: ${v}`).join("\n");
  writeFileSync(join(dir, PROFILE_PATH), `# fixture\n\n\`\`\`mova-config\n${block}\n\`\`\`\n`);
  return loadProfile(dir);
}

describe("the TTS cache verdict", () => {
  it("knows exactly the tts: values setup writes", () => {
    expect(TTS_VALUES).toEqual(documentedValues());
  });

  for (const tts of TTS_VALUES) {
    it(`decides \`tts: ${tts}\` — on only for edge, with one line saying why otherwise`, () => {
      const v = ttsCache(fixture({ pack: "ro", audio: "true", tts }));
      expect(v.on).toBe(tts === "edge");
      expect(v.tts).toBe(tts);
      if (v.on) {
        expect(v.why).toBeNull();
      } else {
        // One line: closeout prints it indented in the step-9 report, and the warmer prints
        // it as its whole output. It names the value so the learner can find it in the profile.
        expect(v.why).toContain(`tts: ${tts}`);
        expect(v.why).not.toContain("\n");
      }
    });
  }

  it("is off with audio: false whatever the voice, because the deck would embed nothing", () => {
    const v = ttsCache(fixture({ pack: "ro", audio: "false", tts: "edge" }));
    expect(v.on).toBe(false);
    expect(v.why).toContain("audio: false");
  });

  it("is off — and says so — on a value setup never writes", () => {
    const v = ttsCache(fixture({ pack: "ro", audio: "true", tts: "Edge" }));
    expect(v.on).toBe(false);
    expect(v.why).toContain("tts: Edge");
    expect(v.why).toContain(TTS_VALUES.join(" | "));
  });

  it("treats a profile with neither key as no cache, not as an error", () => {
    const v = ttsCache(fixture({ pack: "ro" }));
    expect(v.on).toBe(false);
    expect(typeof v.why).toBe("string");
  });
});

describe("every script that touches the cache takes the verdict from tts-cache.mjs", () => {
  for (const rel of CACHE_SCRIPTS) {
    it(`${rel} imports the verdict and keeps no comparison of its own`, () => {
      const src = read(rel);
      expect(src, `${rel} does not import ./tts-cache.mjs`).toMatch(/from "\.\/tts-cache\.mjs"/);
      expect(src, `${rel} never calls ttsCache(profile)`).toContain("ttsCache(profile)");
      // The second copy is the bug: two of these once disagreed and a `tts: say` close-out
      // stopped on it. `pack.manifest.tts_edge` is the voice name and is fine; a profile read
      // of `tts` or `audio`, or a literal "edge" comparison, is a gate of its own.
      const own = src.match(/profile\.(get|config)\(?"?(tts|audio)\b|[!=]==\s*"edge"|"edge"\s*[!=]==/g) ?? [];
      expect(own, `${rel} decides the cache for itself:\n  ${own.join("\n  ")}`).toEqual([]);
    });
  }
});

const profile = loadProfile(root);
describe.skipIf(!profile)("this instance's profile", () => {
  it("names a tts: value setup writes, and an audio: flag", () => {
    const tts = profile.get("tts", "none");
    expect(
      TTS_VALUES.includes(tts),
      `${PROFILE_PATH} says \`tts: ${tts}\`, which setup never writes (${TTS_VALUES.join(" | ")}).\n` +
        `      The cache scripts treat it as \`none\` and the deck ships mute. Fix the value.`,
    ).toBe(true);
    expect(["true", "false"], `${PROFILE_PATH}: audio: must be true or false`).toContain(profile.get("audio", ""));
  });

  it.skipIf(!profile || ttsCache(profile).on)("has no cache to warm, and the warmer says so with exit 0", () => {
    // execFileSync throws on a non-zero exit — the failure that stopped the close-out.
    const out = execFileSync("node", [join(root, "scripts/tts-warm.mjs"), "--dry"], { cwd: root, encoding: "utf8" });
    expect(out).toContain(ttsCache(profile).why);
  });
});
