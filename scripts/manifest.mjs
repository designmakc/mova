// mova:engine
/**
 * Writes upstream/manifest.json — the engine-file hash manifest an instance's /update
 * playbook diffs against.
 *
 * The problem it solves: an instance is a fork of this template plus personal content,
 * and "what did the template change since I forked" has to be answerable mechanically.
 * The update playbook compares the instance's stored manifest against the template's
 * current one; a path whose hash moved is an engine change to pull, a path missing here
 * was never the engine's to touch.
 *
 * What counts as an engine file: any tracked-extension file whose FIRST line carries the
 * `mova:engine` marker (second line when the first is a shebang — .sh keeps its shebang
 * first). JSON cannot carry a comment, so markerless engine files live on an explicit
 * include list instead. A file without the marker is instance/pack content and is
 * deliberately absent: hashing it would make /update flag the learner's own edits.
 *
 * Usage:  node scripts/manifest.mjs        (run before every release; CI may re-run it)
 *
 * Output shape:
 *   { "generated": "YYYY-MM-DD", "template_version": "<VERSION>",
 *     "files": { "<repo-relative path>": "<sha256>" } }
 *
 * Read-only except for its one output. Zero dependencies (node:crypto).
 */
import { readFileSync, readdirSync, writeFileSync, existsSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(root, "upstream", "manifest.json");

/** Extensions scanned for the first-line marker. */
const EXTS = new Set([".md", ".mjs", ".ts", ".sh", ".css", ".html", ".json"]);

/** Engine files that cannot carry a marker (JSON/YAML config) — maintained by hand. */
const INCLUDE = [
  "agents/claude-code/launch.json",
  "package.json",
  "tsconfig.json",
  ".github/workflows/ci.yml",
  ".vscode/settings.json",
];

/** Never descend into these: heavy, untracked, or generated-per-instance. */
const SKIP_DIRS = new Set([
  "node_modules",
  ".git",
  ".tts-cache",
  ".obsidian",
  "materials", // untracked copyrighted study material
]);

const ext = (name) => {
  const i = name.lastIndexOf(".");
  return i === -1 ? "" : name.slice(i);
};

/** Marker on line 1, or line 2 when line 1 is a shebang. Reads only the head of the file. */
function hasMarker(path) {
  let head;
  try {
    head = readFileSync(path, "utf8").split("\n", 2);
  } catch {
    return false;
  }
  if (!head.length) return false;
  if (head[0].includes("mova:engine")) return true;
  return head[0].startsWith("#!") && (head[1] || "").includes("mova:engine");
}

function* walk(dir) {
  for (const name of readdirSync(dir).sort()) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) {
      if (!SKIP_DIRS.has(name)) yield* walk(full);
    } else if (st.isFile()) {
      yield full;
    }
  }
}

const files = {};
const sha256 = (path) => createHash("sha256").update(readFileSync(path)).digest("hex");

for (const full of walk(root)) {
  const rel = relative(root, full).split("\\").join("/");
  if (rel === "upstream/manifest.json") continue; // never hashes itself
  if (!EXTS.has(ext(full))) continue;
  if (ext(full) === ".json") continue; // JSON is include-list only, below
  if (hasMarker(full)) files[rel] = sha256(full);
}
for (const rel of INCLUDE) {
  const full = join(root, rel);
  if (existsSync(full)) files[rel] = sha256(full);
}

const sorted = Object.fromEntries(Object.entries(files).sort(([a], [b]) => (a < b ? -1 : 1)));

const n = new Date();
const p = (x) => String(x).padStart(2, "0");
const manifest = {
  generated: `${n.getFullYear()}-${p(n.getMonth() + 1)}-${p(n.getDate())}`,
  template_version: readFileSync(join(root, "VERSION"), "utf8").trim(),
  files: sorted,
};

writeFileSync(OUT, JSON.stringify(manifest, null, 2) + "\n");
console.log(
  `upstream/manifest.json — ${Object.keys(sorted).length} engine files ` +
    `(template ${manifest.template_version}, ${manifest.generated})`,
);
