// mova:engine
/**
 * What kind of word is this row, and what are its forms.
 *
 * One classifier, two consumers: `scripts/deck.mjs` renders with it, `state/ledgers.test.ts`
 * fails CI with it. That is deliberate — a classifier that lives only in the renderer
 * silently drops a mistagged row into an "other" bucket, and nobody ever finds out. The
 * doctrine survives the limba → mova split unchanged; what moved is the DATA. Everything
 * Romanian in limba's pos.mjs (the tag grammar, the endings list, the "leading `a ` means
 * verb" heuristic, the count articles) now arrives through the `tables` argument, loaded
 * from the active pack by `scripts/pack.mjs`.
 *
 * ── The tables shape — THIS IS THE PACK CONTRACT (packs/SPEC.md mirrors it) ──────
 *
 *   TABLES = {
 *     types:        [{ key, label }]     Facet order on the deck; `label` is the plural
 *                                        chip text ("nouns"). Must include "phrase" and
 *                                        "pattern" — the engine assigns those two itself —
 *                                        plus every facet `tags` maps to.
 *     typeLabel:    { key: label }       Singular chip text per types key ("noun").
 *     tags:         { tag: key }         Tags accepted in the parenthetical's first slot,
 *                                        and the facet each maps to (ro: m/f/n → noun,
 *                                        v → verb, prep → word, …).
 *     genders:      ["m", "f", "n"]      The tags that are gender letters. [] when the
 *                                        language has no grammatical gender. Must agree
 *                                        with the pack manifest's `genders:` line.
 *     endings:      ["uri", "ele", …]    Inflection endings this level actually teaches,
 *                                        LONGEST FIRST — the list decides where a form is
 *                                        cut, so `lucru → lucr+u` and `lucruri → lucr+uri`
 *                                        land on the same stem and the pair shows one clean
 *                                        ending swap instead of a fake stem change. May be
 *                                        [] when the manifest says `inflection: false`.
 *     article:      { g: { sg, pl } }    Count-article pair per gender, spoken by speech()
 *                                        (ro: un/doi, o/două). {} when articles don't exist.
 *     verbHeadword: RegExp | null        An UNTAGGED headword matching this is a verb
 *                                        (ro: /^a\s+\S/ — the infinitive marker). null when
 *                                        the language has no such marker; verbs then need
 *                                        an explicit tag.
 *     other:        key | null           The residue facet — where the deck files rows the
 *                                        classifier returns null for. packcheck.mjs keeps
 *                                        the golden set's null+other rate under 20%: a pack
 *                                        whose words mostly land in the residue has empty
 *                                        tables, not a permissive language.
 *     requiredFact: { rowPattern,        OPTIONAL — the manifest's `required_fact:` made
 *                     factPattern,       checkable: rows whose target matches rowPattern
 *                     hint } | absent    must carry factPattern in notes (ro: verbs carry
 *                                        their eu-form). state/ledgers.test.ts enforces it;
 *                                        absent ⇒ that check is inert.
 *     trivial:      [words] | absent     OPTIONAL — function words leakcheck.mjs won't
 *                                        report as solo leaks (still checked inside full
 *                                        answers). Absent ⇒ only a length filter applies.
 *   }
 *
 * ── Where the answer comes from ────────────────────────────────────────────────
 * The `target` cell, and nothing else. The ledger already carries the essentials in a
 * parenthetical (docs/mechanics/srs.md) — in the reference pack, `prieten (m, prieteni)`
 * says noun by saying gender, `a vorbi` says verb by carrying the infinitive marker,
 * `prost (adj, …)` says adjective outright. What was missing was the residue — bare
 * function words which said nothing at all and could not be told from a one-word phrase.
 * Those carry a tag in the same slot (limba, 2026-08-10): `din (prep)`, `cine (interog)`.
 * No new column, no second file — the dedupe key, the audio cache key and every reader
 * already cut at " (".
 *
 * ── Marking what changes ───────────────────────────────────────────────────────
 * `markPair` produces the two-colour treatment that docs/mechanics/teaching.md requires
 * of every inflection shown to the learner: `mk` on the ending that is added, `st` on a
 * stem that shifts underneath it — never one colour for both, because `oraș→orașe` is one
 * change and `carte→cărți` is two. It works in two steps: strip a known ending off each
 * form, then diff the remaining stems. A zero ending stays unmarked and two identical
 * forms (`ochi`, `nume`) are marked nowhere at all — there is nothing to see.
 */

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** `prieten (m, prieteni)` → { word: "prieten", parts: ["m", "prieteni"] }. */
function splitSegment(text) {
  const m = /^(.*?)\s*\(([^)]*)\)\s*$/.exec(text.trim());
  if (!m) return { word: text.trim(), parts: [] };
  return { word: m[1].trim(), parts: m[2].split(",").map((p) => p.trim()).filter(Boolean) };
}

/** Character-level diff, adjacent differences merged into one segment: [{eq}|{a,b}]. */
function diff(a, b) {
  const n = a.length, m = b.length;
  const L = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--)
    for (let j = m - 1; j >= 0; j--)
      L[i][j] = a[i] === b[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);

  const out = [];
  const push = (seg) => {
    const last = out[out.length - 1];
    if (last && ("eq" in last) === ("eq" in seg)) {
      if ("eq" in seg) last.eq += seg.eq;
      else { last.a += seg.a; last.b += seg.b; }
    } else out.push(seg);
  };
  let i = 0, j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) { push({ eq: a[i] }); i++; j++; }
    else if (L[i + 1][j] >= L[i][j + 1]) { push({ a: a[i], b: "" }); i++; }
    else { push({ a: "", b: b[j] }); j++; }
  }
  if (i < n) push({ a: a.slice(i), b: "" });
  if (j < m) push({ a: "", b: b.slice(j) });
  return out;
}

/**
 * A pure insertion in the middle of a word reads better as the vowel it grew out of:
 * `calculato|r` → `calculato(a)r` is true but invisible, `calculat(o)r` → `calculat(oa)r`
 * is the o→oa alternation the learner is being taught. Pull one letter left when one side
 * of the change is empty and the change is medial.
 */
function widenMedial(segs) {
  for (let k = 1; k < segs.length - 1; k++) {
    const s = segs[k];
    if ("eq" in s) continue;
    if (s.a && s.b) continue;
    const before = segs[k - 1], after = segs[k + 1];
    if (!("eq" in before) || !("eq" in after) || before.eq.length < 1) continue;
    const c = before.eq.slice(-1);
    before.eq = before.eq.slice(0, -1);
    s.a = c + s.a;
    s.b = c + s.b;
  }
  return segs.filter((s) => !("eq" in s) || s.eq.length);
}

/** Ledger shorthand a voice cannot read: quotes, arrows, slashes, a leading suffix hyphen. */
const clean = (s) =>
  s
    .replace(/[„“”"]/g, "")
    .replace(/\s*→\s*/g, ", ")
    .replace(/\s*\/\s*/g, ", ")
    .replace(/(^|[\s(])-(?=\p{L})/gu, "$1")
    .replace(/\s+/g, " ")
    .trim();

/**
 * The classifier, bound to one pack's tables. Returns the exact API limba's pos.mjs
 * exported — TYPES, TYPE_LABEL, ARTICLE, classify, markPair, speech, parse — so both
 * consumers port with only the injection changing:
 *
 *   const pack = await loadPack();
 *   const { classify, markPair, parse, speech, TYPES, TYPE_LABEL, ARTICLE } =
 *     createClassifier(pack.tables);
 */
export function createClassifier(tables) {
  /** Facet order on the deck, and the word the learner reads on the chip. */
  const TYPES = tables.types;
  /** Singular chip text — a row's own badge says "noun", not "nouns". */
  const TYPE_LABEL = tables.typeLabel;
  /** Tags accepted in the parenthetical's first slot, and the facet each maps to. */
  const TAGS = tables.tags;
  const GENDERS = new Set(tables.genders ?? []);
  const ENDINGS = tables.endings ?? [];
  /** Count-article pair per gender — the count is how gender is tested (ro: un/doi). */
  const ARTICLE = tables.article ?? {};
  const VERB_RE = tables.verbHeadword ?? null;

  /**
   * The row's part of speech, or null when the ledger has not said.
   * Null is a CI failure, not a display fallback — see state/ledgers.test.ts.
   */
  function classify(target, id = "") {
    if (id.startsWith("G-")) return "pattern";
    const segments = target.split(" · ").map(splitSegment);
    // The tag holds the first slot, so `câți (interog, m)` is a question word and not a noun.
    const tag = segments[0].parts[0];
    if (tag && TAGS[tag]) return TAGS[tag];
    if (VERB_RE && VERB_RE.test(segments[0].word)) return "verb";
    if (/\s/.test(segments[0].word)) return "phrase";
    return null;
  }

  /** Longest ending in ENDINGS that `w` ends with, leaving at least two stem letters. */
  function endingOf(w) {
    for (const e of ENDINGS) if (w.length - e.length >= 2 && w.endsWith(e)) return e;
    return "";
  }

  /**
   * Two forms of one word, each as HTML with its changing parts marked.
   * In the reference pack, `markPair("masă", "mese")` → `m<b class="st">a</b>s<b class="mk">ă</b>`
   * and `m<b class="st">e</b>s<b class="mk">e</b>`.
   */
  function markPair(sg, pl) {
    if (!pl || sg === pl) return { sg: esc(sg), pl: esc(pl || "") };
    const se = endingOf(sg), pe = endingOf(pl);
    const sStem = sg.slice(0, sg.length - se.length), pStem = pl.slice(0, pl.length - pe.length);
    const segs = widenMedial(diff(sStem, pStem));
    const side = (key, ending) =>
      segs
        .map((s) => ("eq" in s ? esc(s.eq) : s[key] ? `<b class="st">${esc(s[key])}</b>` : ""))
        .join("") + (ending ? `<b class="mk">${esc(ending)}</b>` : "");
    return { sg: side("a", se), pl: side("b", pe) };
  }

  /**
   * What the row's play button should say out loud.
   *
   * It says what the row SHOWS, which for a noun is the article-counted pair
   * (`un prieten, doi prieteni` — limba, 2026-08-10). Speaking the headword alone left the
   * plural silent, and the plural is the half that cannot be reasoned out: in Romanian the
   * final `-i` is a softening and not a syllable, so `medici` is two syllables and `pereți`
   * is not what an EN or UA reader expects (limba G-0021). A grammar row speaks its
   * micro-example rather than its pattern name — but only when there is exactly one
   * parenthetical, otherwise the cell is read whole.
   */
  function speech(target, id = "") {
    const item = parse(target, id);
    if (item.type === "pattern") {
      const groups = target.match(/\(([^)]*)\)/g) ?? [];
      return clean(groups.length === 1 ? groups[0].slice(1, -1) : target);
    }
    if (item.type === "noun") {
      return clean(
        item.segments
          .map((s) => {
            if (!s.plural) return s.word;
            const a = ARTICLE[s.gender] ?? { sg: "", pl: "" };
            return `${a.sg} ${s.word}, ${a.pl} ${s.plural}`;
          })
          .join(", "),
      );
    }
    if (item.type === "adj") {
      const s = item.segments[0];
      return clean([s.word, ...s.forms.map((f) => f.form)].join(", "));
    }
    return clean(item.segments.map((s) => s.word).join(", "));
  }

  /**
   * Everything the deck needs to draw one row's target-language side.
   *
   *   { type, gender, segments: [{ word, gender, sg, pl, note }] }
   *
   * `sg`/`pl` are marked HTML and only present for a noun with a plural; `note` carries a
   * leftover parenthetical that is not a tag, e.g. a verb's governed case `(+ dat.)`.
   */
  function parse(target, id = "") {
    const type = classify(target, id);
    // A grammar row's target cell is a pattern name plus its own micro-example. It has no
    // segments to take apart — print it as written.
    if (type === "pattern") return { type, gender: null, segments: [{ word: target }] };

    const segments = target.split(" · ").map((raw) => {
      const { word, parts } = splitSegment(raw);
      const seg = { word, gender: parts.find((p) => GENDERS.has(p)) ?? null, note: null };

      if (type === "noun") {
        // Anything past the gender that is not itself a tag is the plural. Absent for a
        // proper noun — `România (f)` takes no article and has no count form.
        const plural = parts.slice(1).find((p) => !TAGS[p]) ?? null;
        if (plural) Object.assign(seg, markPair(word, plural), { plural });
        return seg;
      }
      if (type === "adj") {
        // prost (adj, proastă, proști, proaste) — every form marked against the base form.
        seg.forms = parts.slice(1).map((f) => ({ form: f, html: markPair(word, f).pl }));
        return seg;
      }
      const extra = parts.filter((p) => !TAGS[p]);
      if (extra.length) seg.note = extra.join(", ");
      return seg;
    });
    return { type, gender: segments[0].gender, segments };
  }

  return { TYPES, TYPE_LABEL, ARTICLE, classify, markPair, speech, parse };
}
