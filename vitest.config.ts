// mova:engine
/**
 * Vitest config — one job: keep `npm test` measuring THIS tree.
 *
 * CONTRACT. Vitest's default `exclude` covers `node_modules` and build output, and nothing
 * else. Agents that work in git worktrees put a full second checkout under the repo root
 * (Claude Code uses `.claude/worktrees/<name>/`), so every `*.test.ts` inside one gets
 * collected and run beside the real suite.
 *
 * That is not a duplicate run, it is a WRONG run. Every contract test in this repo resolves
 * its data relative to its own file — a worktree's copy reads the WORKTREE's `state/`,
 * `docs/` and `work/visuals/`. So `npm test` reports failures about files the session
 * standing in this directory cannot see, edit or fix, and the two readings of a red test —
 * "my mistake" and "a sibling mid-edit" — become indistinguishable. That is the property
 * that makes a test useless rather than merely noisy.
 *
 * It costs an instance more than it costs the template: the human on the other side of an
 * instance is a learner, not a developer, and an unfixable red test at close-out has no
 * correct action available to them. Deleting the other tree is forbidden by the
 * session-hygiene rule in AGENTS.md, and it belongs to a session that may still be running.
 *
 * Derived from limba, 2026-08-17 (PORT-017), where it was reported twice and left unowned
 * before it blocked a close-out. A worktree still runs its own `npm test` from inside
 * itself, which is the run that should gate its own work.
 */
import { defineConfig, configDefaults } from "vitest/config";

export default defineConfig({
  test: {
    exclude: [...configDefaults.exclude, "**/.claude/worktrees/**", "**/.worktrees/**"],
  },
});
