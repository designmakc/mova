// mova:engine
/**
 * Completeness contract for docs/projects/ and the Projects Index in plan.md.
 *
 * Enforces the docs/projects/ conventions (AGENTS.md → document map):
 *   - Project filenames are status-free (no `--idea/--in-progress/--done` suffix).
 *   - Every file in docs/projects/ has frontmatter with a valid `status`.
 *   - Every index row names its project as a clickable markdown link to the file.
 *   - Every file appears as exactly one row in the plan.md Projects Index.
 *   - The status shown in the index matches the file's frontmatter (no drift).
 *   - Every file has a valid `kind`, and its row sits under the matching `### ` sub-header.
 *
 * If this fails, fix the docs — not the test. Status lives in frontmatter
 * (canonical) and is mirrored in the index table; the filename never carries it.
 *
 * TEMPLATE MODE: docs/plan.md is generated at setup. Until it exists there is no index to
 * check, so the whole suite skips — `npm test` stays green on the bare template and turns
 * strict the moment an instance is generated.
 *
 * ── To adapt this to your project, edit the CONTRACT block below. Everything else
 *    (frontmatter parsing, table parsing, link parsing, the checks) is generic. ──
 */

import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

/** The only project-specific configuration. Edit this, not the logic below. */
const CONTRACT = {
  /** Allowed `status:` frontmatter values (also the forbidden filename suffixes). */
  validStatuses: ["idea", "in-progress", "done"],
  /** Allowed `kind:` frontmatter values. */
  validKinds: ["track", "exam", "infra"],
  /**
   * Each Projects-index `### ` sub-header label → the `kind` it groups. The labels
   * here must match the `### ` headers in plan.md's Projects Index section exactly.
   */
  kindByHeader: {
    "Skill tracks": "track",
    "Exam & assessment": "exam",
    "Workspace infrastructure": "infra",
  } as Record<string, string>,
  /** The `## ` heading the Projects Index lives under, in plan.md. */
  indexSectionTitle: "Projects index",
  /** Subdirectory (and link-path prefix) that project files live in: [name](projects/name.md). */
  projectsDir: "projects",
} as const;

const docsDir = dirname(fileURLToPath(import.meta.url));
const projectsDir = join(docsDir, CONTRACT.projectsDir);
const planPath = join(docsDir, "plan.md");

// Template mode: no plan.md until setup generates one — nothing to check yet.
const active = existsSync(planPath) && existsSync(projectsDir);

const statusSuffixRe = new RegExp(`--(${CONTRACT.validStatuses.join("|")})\\.md$`);
const indexSectionRe = new RegExp(
  `##\\s+${CONTRACT.indexSectionTitle}([\\s\\S]*?)(?:\\n---|\\n## )`,
);
const linkCellRe = new RegExp(`^\\[[^\\]]+\\]\\(${CONTRACT.projectsDir}/([^)]+)\\)$`);

/** Pull a scalar field out of a project file's YAML frontmatter. */
function frontmatterField(md: string, field: string): string | null {
  const fm = md.match(/^---\n([\s\S]*?)\n---/);
  if (!fm) return null;
  const line = fm[1].split("\n").find((l) => l.trim().startsWith(`${field}:`));
  return line ? line.slice(line.indexOf(":") + 1).trim() : null;
}

const frontmatterStatus = (md: string) => frontmatterField(md, "status");
const frontmatterKind = (md: string) => frontmatterField(md, "kind");

interface IndexRow {
  nameCell: string; // raw text of the first ("Project") cell
  status: string; // text of the second ("Status") cell
  file: string | null; // link target filename, if the name cell is a markdown link
  kind: string | null; // kind of the `### ` sub-header this row sits under
}

/** Parse every data row of the Projects Index table. */
function parseIndex(plan: string): IndexRow[] {
  const section = plan.match(indexSectionRe);
  if (!section) {
    throw new Error(`No '## ${CONTRACT.indexSectionTitle}' section found in plan.md`);
  }

  const rows: IndexRow[] = [];
  let kind: string | null = null; // most recent `### ` sub-header's mapped kind
  for (const line of section[1].split("\n")) {
    const trimmed = line.trim();
    const header = trimmed.match(/^###\s+(.*)$/);
    if (header) {
      kind = CONTRACT.kindByHeader[header[1].trim()] ?? null;
      continue;
    }
    if (!trimmed.startsWith("|")) continue; // not a table line
    const cells = trimmed.slice(1, -1).split("|").map((c) => c.trim());
    const [nameCell, status] = cells;
    if (!nameCell || nameCell.startsWith("---")) continue; // separator
    if (nameCell === "Project") continue; // header
    const link = nameCell.match(linkCellRe);
    rows.push({ nameCell, status, file: link ? link[1] : null, kind });
  }
  return rows;
}

const projectFiles = active
  ? readdirSync(projectsDir).filter((f) => f.endsWith(".md"))
  : [];
const indexRows = active ? parseIndex(readFileSync(planPath, "utf8")) : [];

/** filename → status, for the rows whose name cell is a proper link. */
const linkedByFile = new Map(
  indexRows.filter((r) => r.file).map((r) => [r.file!, r.status]),
);

/** filename → grouping kind (the `### ` sub-header its row sits under). */
const kindByFile = new Map(
  indexRows.filter((r) => r.file).map((r) => [r.file!, r.kind]),
);

describe.skipIf(!active)("docs/projects/ ↔ plan.md Projects Index", () => {
  it("has at least one project file and a populated index", () => {
    expect(projectFiles.length).toBeGreaterThan(0);
    expect(indexRows.length).toBeGreaterThan(0);
  });

  it.each(projectFiles)("%s has no status suffix in its filename", (file) => {
    expect(file).not.toMatch(statusSuffixRe);
  });

  it.each(projectFiles)("%s has valid frontmatter status", (file) => {
    const status = frontmatterStatus(readFileSync(join(projectsDir, file), "utf8"));
    expect(CONTRACT.validStatuses, `${file}: status "${status}"`).toContain(status);
  });

  // The names must always be clickable links to the file — not bare text.
  it("every index row names its project as a markdown link", () => {
    const bareRows = indexRows.filter((r) => !r.file).map((r) => r.nameCell);
    expect(
      bareRows,
      `These Projects Index rows must be markdown links like [name](${CONTRACT.projectsDir}/name.md): ${bareRows.join(", ")}`,
    ).toEqual([]);
  });

  it("index lists exactly the files in docs/projects/ (no missing, no stale)", () => {
    expect([...linkedByFile.keys()].sort()).toEqual([...projectFiles].sort());
  });

  it.each(projectFiles)("%s index status matches its frontmatter", (file) => {
    const fmStatus = frontmatterStatus(readFileSync(join(projectsDir, file), "utf8"));
    expect(linkedByFile.get(file)).toBe(fmStatus);
  });

  it.each(projectFiles)("%s has valid frontmatter kind", (file) => {
    const kind = frontmatterKind(readFileSync(join(projectsDir, file), "utf8"));
    expect(CONTRACT.validKinds, `${file}: kind "${kind}"`).toContain(kind);
  });

  it.each(projectFiles)("%s sits under the index sub-header matching its kind", (file) => {
    const fmKind = frontmatterKind(readFileSync(join(projectsDir, file), "utf8"));
    expect(
      kindByFile.get(file),
      `${file}: frontmatter kind "${fmKind}" but grouped under "${kindByFile.get(file)}" in the index`,
    ).toBe(fmKind);
  });
});
