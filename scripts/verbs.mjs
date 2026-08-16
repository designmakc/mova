// mova:engine
/**
 * Which verbs this workspace actually answers to — the one reader of the focus rule.
 *
 * A playbook's own frontmatter is the authority
 * ([setup/scenarios/focus_modes.md](../setup/scenarios/focus_modes.md): "if it ever
 * disagrees with a frontmatter line, the frontmatter wins"). `scenarios:` names the focus
 * modes a verb is live in — `all` for every mode, a space-separated list for some, `none`
 * for a flow that is not a learner verb at all (setup itself, and the maintainer sync).
 *
 * WHY IT EXISTS. hub.mjs built its command list by listing every playbook file it could
 * find, and every copy of the workspace ships every playbook whatever mode was chosen. A
 * vocabulary-only instance's hub therefore advertised `lesson` — which that workspace
 * refuses by design, politely, with a pointer. The one page a learner trusts for "what do I
 * do next" was naming words their own setup had turned off, and it listed `setup` besides,
 * a verb that runs once before the hub exists. The setup tour carries a rule against exactly
 * this failure (playbooks/setup.md § 1 · What you can say); nothing enforced it anywhere
 * else. Extracted rather than inlined so the rule is testable at its source, the same reason
 * inline-md.mjs left hub.mjs.
 *
 * Read-only. No dependencies beyond node:fs.
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

/** The verb that is gated on the goal contract rather than on the focus mode. */
export const TUITION_VERB = "tutor-prep";

/** The frontmatter block only — never the body, where the same words appear as prose. */
function frontmatter(text) {
  const m = /^(?:<!--[\s\S]*?-->\s*)?---\n([\s\S]*?)\n---/.exec(text);
  return m ? m[1] : "";
}

const field = (fm, key) => {
  const m = new RegExp(`^${key}:\\s*(.+)$`, "m").exec(fm);
  return m ? m[1].trim() : "";
};

/**
 * Is a verb live in this focus mode? `all` is every mode; `none` is no mode, which is how
 * setup and the maintainer flows stay off a learner's page without needing a name list here.
 */
export function isLive(scenarios, focus) {
  const modes = String(scenarios).split(/[,\s]+/).filter(Boolean);
  if (modes.includes("none")) return false;
  return modes.includes("all") || modes.includes(focus);
}

/**
 * The verbs a given instance answers to, sorted by name.
 *
 * `focus` comes from the profile config (`full` when a copy predates the key); `tuition` is
 * whether the goal contract has a `## Tuition` section, which is what makes `tutor-prep`
 * exist at all — `scenarios: all` is true of it, and still not sufficient.
 *
 * Returns `[{ name, desc, scenarios }]`. `desc` is the summary's first clause — the rest of
 * the line is trigger phrasing, useful to an agent and noise on a page. The clause ends at a
 * sentence stop or a dash of either kind; `update`'s summary carries an em dash and was
 * printing whole, three lines deep, in a list of one-liners.
 */
export function liveVerbs({ root, focus = "full", tuition = false } = {}) {
  const dir = join(root, "playbooks");
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const fm = frontmatter(readFileSync(join(dir, f), "utf8"));
      const name = field(fm, "verb");
      if (!name) return null;
      // Maintainer verbs run against the template repo, not an instance — a learner's hub
      // listing one would invite running it there.
      if (/^maintainer:\s*true$/m.test(fm)) return null;
      const scenarios = field(fm, "scenarios");
      if (!isLive(scenarios, focus)) return null;
      if (name === TUITION_VERB && !tuition) return null;
      const summary = field(fm, "summary");
      // A trailing stop survives the split when the summary is one sentence; strip it, so a
      // list of one-liners does not print half of them with a full stop and half without.
      const desc = summary.split(/\.\s|\s[-—]\s/)[0].trim().replace(/\.$/, "");
      return { name, desc, scenarios };
    })
    .filter(Boolean)
    .sort((a, b) => a.name.localeCompare(b.name));
}
