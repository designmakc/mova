// mova:pack
/**
 * dexonline adapter — verify a Romanian word's gender, plural, or conjugation before
 * teaching it. Implements the adapter contract in scripts/dictionary.mjs.
 *
 * limba's 2026-08-10 audit found that the claims which failed in the visuals were exactly
 * the unchecked ones — "-ă → feminine, no exceptions" shipped while dexonline's first line
 * for tată reads "s. m.". docs/mechanics/verification.md requires the check before any
 * completeness label or absolute claim; this adapter makes it a five-second step instead
 * of a browser trip.
 *
 * Etiquette: one JSON request per lookup, an honest User-Agent, a 10 s timeout, no
 * retries. Network calls happen ONLY inside lookup() — importing this module is
 * side-effect free.
 *
 * lookup() resolves {found:false, …} for a missing entry (HTTP 404, no definitions, or no
 * definition whose HEADWORD is the word asked about) and THROWS when dexonline is
 * unreachable — "offline" and "not in the dictionary" must never be confused in a
 * verification trail.
 *
 * ─────────────────────────────────────────────────────────────────────────────────────
 * WHAT THIS PARSER HAS TO SURVIVE, and why each rule below exists.
 *
 * dexonline aggregates dozens of source dictionaries and returns one entry per sense per
 * source — 26 for `calculator`, 184 for `ochi`. The slots are not consistent between
 * them. Measured against a real 79-row ledger, the first version of this adapter returned
 * a wrong verdict on 14 rows (2026-08-15). Every rule here is one of those four defects:
 *
 *   1. It read `definitions.slice(0, 6)`. The parseable entries can sit anywhere in the
 *      list: `obraz` has 42 definitions, and the three that carry its plural are all past
 *      index 6 — so a word squarely in the dictionary came back NOT FOUND. There is no
 *      safe window; read them all.
 *   2. It captured the headword and threw it away, so ANY definition that merely mentions
 *      the query contributed its facts. `ochi` (eye) came back with `["ochesc"]` — the
 *      conjugation of the unrelated verb *a ochi*, "to aim". Match on the headword.
 *   3. It stored the inflected slot raw. For a masculine/feminine pair dexonline prints
 *      `prieteni, -e` — the plural, then the feminine counterpart's ENDING. A correct
 *      ledger row saying `prieteni` never matched. The slot also holds syllabification
 *      (`(pri-e-)`) where a plural belongs. Take the first comma-segment, and only when
 *      it is a word.
 *   4. It trusted mis-parses. `România` has no dexonline entry at all, and the adapter
 *      answered `found: true, forms: ["#sf#"]` — markup from another slot asserted as an
 *      attested form. Rule 2 fixes this one too: a headword of `$românia$` is not
 *      `românia`, so it never contributes. `found` now means "at least one definition is
 *      ABOUT this word", which is the only honest reading.
 *
 * The offline proof for all four is `golden/dictionary.json`: recorded responses for the
 * words above, replayed by packcheck through `options.fetch`. Before it, nothing in the
 * repo called lookup() at all — packcheck instantiated the adapter and stopped there.
 */

/** Minimal entity decode — dexonline's internalRep uses numeric entities for diacritics. */
const decode = (s) =>
  s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

/** dexonline part-of-speech code → the pack's gender label. */
const GENDER = [
  [/^s\. m\./, "m"],
  [/^s\. f\./, "f"],
  [/^s\. n\./, "n"],
];

/** The dictionary header of one definition: `@HEADW'ORD,@ $inflected,$ #pos# IV.` */
const HEADER = /^@([^@]+?),?@\s*(?:\$([^$]*?),?\$)?\s*#([^#]+?)#(\s*[IVX]+\.?)?/;

/**
 * The bare headword a slot states. `PRI'ETEN, -Ă` → `prieten` (the stress apostrophe and
 * the feminine variant go); `vârstă^1` → `vârstă` (dexonline numbers homographs, and for
 * many common words the numbered forms are the ONLY ones); `prieten (prieteni)` → the
 * parenthetical is lifted out by inflOf() and dropped here.
 */
export function headOf(raw) {
  return raw
    .replace(/'/g, "")
    .split(",")[0]
    .replace(/\([^)]*\)/g, " ")
    .replace(/\^\d+/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

/** The inflected form a header states, or "" when the slot holds something else. */
export function inflOf(rawInfl, rawHead) {
  // Some sources put the plural in the headword slot instead: `prieten (prieteni)`.
  const lifted = /\(([^)]*)\)/.exec(rawHead)?.[1] ?? "";
  const first = ((rawInfl || "").trim() || lifted).replace(/'/g, "").split(",")[0].trim();
  // A real inflected form is a word. A hyphenation `(pri-e-)`, a variant stub `-e`, a
  // cross-reference `#smf#` and a tilde alternation `~ă` are all not.
  return /^\p{L}+$/u.test(first) ? first : "";
}

/** Fold for comparison: NFC, lowercase, and î≡â — the same sound, two orthographies. */
export const fold = (s) =>
  String(s).normalize("NFC").toLowerCase().replace(/î/g, "â").trim();

/**
 * Every definition whose headword IS `query`, reduced to `{head, infl, gender, pos}`.
 * Exported so the golden fixture can pin the parse, not only the aggregate.
 */
export function parseEntries(definitions, query) {
  const want = fold(headOf(String(query)));
  const seen = new Set();
  const out = [];
  for (const d of definitions ?? []) {
    const rep = decode(String(d.internalRep ?? "")).replace(/\s+/g, " ");
    const m = rep.match(HEADER);
    if (!m) continue;
    const rawHead = m[1].trim();
    // A cross-reference carries another slot's markup in the headword slot (`$prietin, ~ă$`)
    // and states nothing. NOTE: the headword match below already excludes these, since
    // `$românia$` is not `românia` — so this is a cheap backstop, not the fix for defect 4,
    // and golden/dictionary.json does NOT pin it independently. It earns its place only if
    // headOf() ever learns to strip these characters.
    if (/[$#@]/.test(rawHead)) continue;
    const head = headOf(rawHead);
    if (!head || fold(head) !== want) continue; // defect 2
    const pos = (m[3].trim() + (m[4] ? " " + m[4].trim() : "")).replace(/\s+/g, " ");
    const infl = inflOf(m[2] ?? "", rawHead); // defect 3
    const key = `${head}|${infl}|${pos}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ head, infl, pos, gender: GENDER.find(([re]) => re.test(pos))?.[1] ?? null });
  }
  return out;
}

export function createAdapter(options = {}) {
  const doFetch = options.fetch ?? globalThis.fetch;

  return {
    source: "dexonline",

    async lookup(word) {
      // dexonline headwords are bare: verbs without the infinitive marker (vorbi, not
      // "a vorbi"), nouns without the parenthetical. Diacritics preferred but optional.
      const head = String(word).normalize("NFC").trim().replace(/^a\s+/, "").split(" (")[0];
      const enc = encodeURIComponent(head);
      const url = `https://dexonline.ro/definitie/${enc}/paradigma`;

      const res = await doFetch(`https://dexonline.ro/definitie/${enc}/json`, {
        signal: AbortSignal.timeout(10_000),
        headers: { "User-Agent": "mova workspace (personal study tool; packs/ro/dictionary.mjs)" },
      });
      let data;
      if (res.status === 404) data = { definitions: [] };
      else if (!res.ok) throw new Error(`dexonline HTTP ${res.status} for "${head}"`);
      else data = await res.json();

      // Every definition, not a window (defect 1).
      const entries = parseEntries(data.definitions, head);
      const genders = [...new Set(entries.map((e) => e.gender).filter(Boolean))];
      const forms = [...new Set(entries.map((e) => e.infl).filter(Boolean))];

      return {
        found: entries.length > 0,
        source: "dexonline",
        genders,
        forms,
        url: entries.length > 0 ? url : null,
      };
    },
  };
}
