// mova:engine
/**
 * The shared Wiktionary dictionary adapter — one implementation, many packs.
 *
 * Implements the adapter contract in scripts/dictionary.mjs. A pack's own
 * `dictionary.mjs` is then four lines: name the language section and the headword
 * templates, and call this.
 *
 * WHY THIS EXISTS. The reference adapter (packs/ro, dexonline) is a scraper for one
 * site, and writing one per language is what made a new pack the longest and most
 * defect-prone step of setup. Measured 2026-08-17 over five languages: the expensive
 * half of that adapter was never the fact lookup, it was DISAMBIGUATION — filtering 184
 * senses, matching headwords, refusing markup that looked like a form. Wiktionary gives
 * that away: the `==Spanish==` section IS the disambiguation, and one shared parser read
 * gender correctly on 66 of 66 words across es/fr/de/it/pt, including every trap whose
 * ending lies about its gender (`problema` m, `mano` f, `Mädchen` n, `mapa` m).
 *
 * TWO REQUESTS, AND WHY IT IS WORTH IT.
 *
 *   1. `action=query` → the page's wikitext. The language section is sliced out of it and
 *      the headword templates are taken VERBATIM.
 *   2. `action=expandtemplates` → those templates rendered, with the word as title
 *      context, so Wiktionary's own Lua modules compute the inflected forms.
 *
 * Step 2 is the reason this adapter carries no morphology of its own. It does not know
 * that German umlauts its plurals or that Portuguese `-ão` splits three ways; it asks the
 * modules that already do. Measured on the cases that would each have needed hand-written
 * rules: `lápiz → lápices`, `cheval → chevaux`, `Buch → Bücher`, `Stadt → Städte`,
 * `Mädchen → Mädchen` (invariant), `uovo → uova f` (gender-switching plural),
 * `città` (invariable), `pão → pães`, `limão → limões`. A per-language expander was
 * budgeted for German and turned out to be unnecessary.
 *
 * The cost is one extra round trip per lookup, paid only when a headword template exists.
 * Verification is per-word at capture time, so this is two requests where dexonline took
 * one — acceptable, and stated here rather than discovered later.
 *
 * ETIQUETTE. One request per phase, honest User-Agent, 10 s timeout, NO RETRIES
 * (packs/SPEC.md). A 429 or a 5xx therefore THROWS, which is correct: rate-limited is a
 * kind of unreachable, and unreachable must never be reported as "not in the dictionary"
 * (docs/mechanics/verification.md depends on that distinction). Network traffic happens
 * only inside `lookup()`; importing this module and calling `createWiktionaryAdapter()`
 * are side-effect free.
 *
 * GENDERS AND FORMS ARE LISTS, per the contract, because a headword carries senses:
 * Spanish `mano` renders two headword lines — `mano f (plural manos)` and
 * `mano m (plural manos, feminine mana, …)` — and both are reported. `factcheck.mjs`
 * applies the rule that one attesting sense is attestation.
 *
 * OFFLINE TESTING. `options.fetch` is used when passed. packcheck injects ONE stub whose
 * body answers every call in a lookup, so a pack's `golden/dictionary.json` records the
 * two phases MERGED into a single object — legal because the real responses use disjoint
 * top-level keys (`query`, `expandtemplates`). Each fixture says so in its `why`.
 *
 * PROVENANCE OF THE FACTS. Wiktionary is crowd-sourced and is a *citable* source, not an
 * authority: it is exactly as good as `verification.md` needs — better than the agent's
 * memory, weaker than a tutor. A pack using it says so in its own prose header.
 */

const ENDPOINT = "https://en.wiktionary.org/w/api.php";
const UA = "mova/language-pack (https://github.com/; a personal language-learning workspace)";
const TIMEOUT_MS = 10_000;

/** Every `{{<prefix>|…}}` in `text`, brace-balanced, returned verbatim. */
function templates(text, prefix) {
  const out = [];
  const needle = "{{" + prefix;
  let i = 0;
  for (;;) {
    i = text.indexOf(needle, i);
    if (i < 0) return out;
    // The next char must end the name — `{{es-noun` must not match `{{es-nouns`.
    const after = text[i + needle.length];
    if (after !== "|" && after !== "}") { i += needle.length; continue; }
    let depth = 0;
    let j = i;
    while (j < text.length) {
      if (text.startsWith("{{", j)) { depth++; j += 2; continue; }
      if (text.startsWith("}}", j)) { depth--; j += 2; if (depth === 0) break; continue; }
      j++;
    }
    out.push(text.slice(i, j));
    i = j;
  }
}

/**
 * The `==Language==` section only. A shared spelling carries a dozen of them — `casa` is
 * an entry in twenty languages — and this slice is the whole disambiguation story.
 */
function languageSection(wikitext, language) {
  const re = new RegExp(`^==\\s*${language}\\s*==\\s*$([\\s\\S]*?)(?=^==\\s*[^=]|$(?![\\s\\S]))`, "m");
  const m = re.exec(wikitext);
  return m ? m[1] : "";
}

/** Rendered wikitext → plain text: links unwrapped, categories and tags dropped. */
function plain(s) {
  return String(s)
    .replace(/\[\[Category:[^\]]*\]\]/g, "")
    .replace(/\[\[:?(?:[^\]|]*\|)?([^\]]*)\]\]/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;|&#32;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .trim();
}

/**
 * Gender is read from the MARKUP, not from the rendered text.
 *
 * Wiktionary tags it semantically — `<span class="gender"><abbr title="neuter gender">n
 * </abbr></span>` — and that is the only reading that survives a non-Latin script. A Greek
 * headword renders as `βιβλίο • (vivlío) n (plural βιβλία)`: the transliteration sits
 * between the word and its gender, so a text rule anchored to "the token after the
 * headword" finds nothing. Found building the Greek pack, 2026-08-17, after the first four
 * Latin-script packs let the weaker rule look correct.
 */
const GENDER_SPAN = /<span[^>]*class="[^"]*\bgender\b[^"]*"[^>]*>([\s\S]*?)<\/span>/g;
const ABBR = /<abbr[^>]*>([^<]*)<\/abbr>/g;

/** The gender tokens a pack may legitimately report; anything else is markup noise. */
const GENDER_TOKENS = new Set(["m", "f", "n", "c", "mf", "m-p", "f-p", "n-p"]);

/**
 * A labelled form inside the parenthetical. Deliberately narrow: `plural` only by
 * default. A diminutive or an augmentative is a different lexeme, not an inflection of
 * this one, and putting it in `forms` would make factcheck accept it as this row's plural.
 */
const LABEL_RE = /\b(plural|genitive|feminine)\s+([^\s,()]+)/g;

function parseRendered(text, formLabels) {
  const genders = new Set();
  const forms = new Set();

  // Genders off the markup — one headword line per sense, each carrying its own gender
  // span (Spanish `mano` renders a feminine line and a masculine one).
  //
  // Scoped to the HEAD of each line, meaning everything before the first `<i>`. The
  // inflection parenthetical labels its entries in italics — `(<i>plural</i> …)` — and the
  // forms inside carry gender spans of their OWN: Italian `uovo m (plural uova f)` and
  // German `Stadt f (… diminutive Städtchen n)`. Reading the whole line reported `uovo` as
  // both masculine and feminine, which is a fact about its plural, not about the headword.
  // (Found extending the parser for Greek, 2026-08-17 — both regressions were caught by the
  // packs' own recorded fixtures.)
  for (const line of text.split("\n")) {
    const head = line.includes("<i>") ? line.slice(0, line.indexOf("<i>")) : line;
    GENDER_SPAN.lastIndex = 0;
    let span;
    while ((span = GENDER_SPAN.exec(head))) {
      ABBR.lastIndex = 0;
      let abbr;
      while ((abbr = ABBR.exec(span[1]))) {
        const token = abbr[1].trim();
        if (GENDER_TOKENS.has(token)) genders.add(token);
      }
    }
  }

  // Forms off the rendered text, where the label and its value sit together.
  for (const line of plain(text).split("\n")) {
    if (!line.trim()) continue;
    LABEL_RE.lastIndex = 0;
    let m;
    while ((m = LABEL_RE.exec(line))) {
      if (!formLabels.includes(m[1])) continue;
      const value = m[2].replace(/[.,;]$/, "").trim();
      // A rendered "plural" slot sometimes holds a qualifier rather than a word.
      if (value && !/^\(|^or$|^and$/.test(value)) forms.add(value);
    }
  }
  return { genders: [...genders], forms: [...forms] };
}

/**
 * Build an adapter for one language.
 *
 * @param {object} config
 * @param {string} config.code      pack code, e.g. `es` — also the template prefix
 * @param {string} config.language  the English name of the `==Section==`, e.g. `Spanish`
 * @param {string[]} [config.headwords]   template names to expand; defaults to `<code>-noun`
 * @param {string[]} [config.formLabels]  rendered labels counted as forms; defaults to `plural`
 * @param {object} [options]
 * @param {Function} [options.fetch]  injected fetch — REQUIRED for offline golden replay
 */
export function createWiktionaryAdapter(config, options = {}) {
  const { code, language } = config;
  const headwordNames = config.headwords ?? [`${code}-noun`];
  const formLabels = config.formLabels ?? ["plural"];
  const doFetch = options.fetch ?? globalThis.fetch;

  async function call(params) {
    const url = ENDPOINT + "?" + new URLSearchParams({ format: "json", formatversion: "2", ...params });
    let res;
    try {
      res = await doFetch(url, {
        headers: { "User-Agent": UA, Accept: "application/json" },
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
    } catch (cause) {
      throw new Error(`wiktionary unreachable: ${cause?.message ?? cause}`, { cause });
    }
    if (!res.ok) throw new Error(`wiktionary returned HTTP ${res.status}`);
    return res.json();
  }

  return {
    source: `wiktionary:${code}`,

    async lookup(word) {
      const url = `https://en.wiktionary.org/wiki/${encodeURIComponent(word)}#${language}`;
      const miss = { found: false, source: `wiktionary:${code}`, genders: [], forms: [], url };

      const page = await call({
        action: "query", prop: "revisions", rvprop: "content", rvslots: "main", titles: word,
      });
      const entry = page?.query?.pages?.[0];
      if (!entry || entry.missing) return miss;
      const wikitext = entry.revisions?.[0]?.slots?.main?.content ?? "";

      // No section for THIS language: the spelling exists, this word does not.
      const section = languageSection(wikitext, language);
      if (!section) return miss;

      const found = headwordNames.flatMap((name) => templates(section, name));
      if (!found.length) {
        // The entry is real and about this word; it simply carries no headword template
        // we know how to expand (a particle, an unusual layout). Attest existence only.
        return { found: true, source: `wiktionary:${code}`, genders: [], forms: [], url };
      }

      const expanded = await call({
        action: "expandtemplates", title: word, text: found.join("\n"), prop: "wikitext",
      });
      const rendered = expanded?.expandtemplates?.wikitext ?? "";
      const { genders, forms } = parseRendered(rendered, formLabels);
      return { found: true, source: `wiktionary:${code}`, genders, forms, url };
    },
  };
}
