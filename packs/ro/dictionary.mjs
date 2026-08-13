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
 * Reads the definition headers (headword, inflected form, part of speech) from dexonline's
 * JSON endpoint. The full inflection table stays on the paradigm page — `url` links it.
 *
 * Etiquette (kept from limba's dex.mjs): one JSON request per lookup, an honest
 * User-Agent, a 10 s timeout, no retries. Network calls happen ONLY inside lookup() —
 * importing this module is side-effect free, and packcheck never calls lookup().
 *
 * lookup() resolves {found:false, …} for a missing entry (HTTP 404 or no definitions) and
 * THROWS when dexonline is unreachable — "offline" and "not in the dictionary" must never
 * be confused in a verification trail.
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

export function createAdapter() {
  return {
    source: "dexonline",

    async lookup(word) {
      // dexonline headwords are bare: verbs without the infinitive marker (vorbi, not
      // "a vorbi"), nouns without the parenthetical. Diacritics preferred but optional.
      const head = String(word).normalize("NFC").trim().replace(/^a\s+/, "").split(" (")[0];
      const enc = encodeURIComponent(head);
      const jsonUrl = `https://dexonline.ro/definitie/${enc}/json`;
      const url = `https://dexonline.ro/definitie/${enc}/paradigma`;

      const res = await fetch(jsonUrl, {
        signal: AbortSignal.timeout(10_000),
        headers: { "User-Agent": "mova workspace (personal study tool; packs/ro/dictionary.mjs)" },
      });
      let data;
      if (res.status === 404) data = { definitions: [] };
      else if (!res.ok) throw new Error(`dexonline HTTP ${res.status} for "${head}"`);
      else data = await res.json();

      const defs = data.definitions ?? [];

      // A definition's first line is the dictionary header: @HEADW'ORD,@ $inflected,$
      // #pos# IV. The apostrophe marks stress; strip it. Different source dictionaries
      // repeat the same facts in the same shape — read each distinct header once.
      const seen = new Set();
      let gender = null;
      const forms = [];
      let parsed = 0;
      for (const d of defs.slice(0, 6)) {
        const rep = decode(d.internalRep).replace(/\s+/g, " ");
        const m = rep.match(/^@([^@]+?),?@\s*(?:\$([^$]*?),?\$)?\s*#([^#]+?)#(\s*[IVX]+\.?)?/);
        if (!m) continue;
        const infl = (m[2] ?? "").replace(/'/g, "").trim();
        const pos = (m[3].trim() + (m[4] ? " " + m[4].trim() : "")).replace(/\s+/g, " ");
        const key = `${infl}|${pos}`;
        if (seen.has(key)) continue;
        seen.add(key);
        parsed++;
        gender ??= GENDER.find(([re]) => re.test(pos))?.[1] ?? null;
        if (infl && !forms.includes(infl)) forms.push(infl);
      }

      return { found: parsed > 0, source: "dexonline", gender, forms, url: parsed > 0 ? url : null };
    },
  };
}
