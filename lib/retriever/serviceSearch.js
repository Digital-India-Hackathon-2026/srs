/**
 * SevaSetu Semantic Service Search
 * ─────────────────────────────────────────────────────────────────────────────
 * Performs keyword + fuzzy matching across all known government services.
 * Returns the best matching service ID, or null if no good match found.
 *
 * Architecture:
 *   - Pure JS, no external deps
 *   - Extensible: add new service in SERVICE_INDEX
 *   - Supports typo tolerance via character similarity scoring
 *   - Supports Telugu transliteration (common romanisations)
 */

const SERVICE_INDEX = [
  {
    id: "passport",
    keywords: [
      "passport", "psk", "popsk", "rpo", "tatkaal", "tatkal",
      "police verification", "visa", "international travel",
      "travel document", "ekinet", "passportindia", "speed post",
    ],
    aliases: ["pass port", "pasport", "paasport"],
  },
  {
    id: "aadhaar",
    keywords: [
      "aadhaar", "aadhar", "uid", "uidai", "unique id",
      "biometric", "e-aadhaar", "eaadhaar", "pvc card",
      "aadhaar update", "aadhaar correction", "aadhaar enrollment",
      "enrol aadhaar", "new aadhaar",
      // Telugu romanisations
      "aadhar card", "adhar", "adhaar",
    ],
    aliases: ["adhar", "adhaar", "aadhar"],
  },
  {
    id: "income-certificate",
    keywords: [
      "income certificate", "income cert", "aay praman", "income proof",
      "salary certificate", "annual income", "income limit", "scholarship income",
      "ews certificate", "income for scholarship", "family income",
      // Telugu romanisations
      "aadayam", "aadaya praman",
    ],
    aliases: ["incomecer", "income-cert", "incomecert"],
  },
  {
    id: "caste-certificate",
    keywords: [
      "caste certificate", "caste cert", "community certificate",
      "sc certificate", "st certificate", "obc certificate", "bc certificate",
      "jati praman", "kula dharuvikaran", "reservation certificate",
      "backward class", "scheduled caste", "scheduled tribe",
    ],
    aliases: ["castecert", "caste-cert"],
  },
  {
    id: "residence-certificate",
    keywords: [
      "residence certificate", "domicile", "nivaas", "resident proof",
      "domicile certificate", "residence proof", "permanent residence",
      "local residence",
    ],
    aliases: ["residencecert", "domicilecert"],
  },
  {
    id: "birth-certificate",
    keywords: [
      "birth certificate", "birth cert", "janma praman", "born certificate",
      "birth registration", "birth record", "newborn registration",
      "child birth certificate",
    ],
    aliases: ["birthcert", "birth-cert"],
  },
  {
    id: "death-certificate",
    keywords: [
      "death certificate", "death cert", "death registration",
      "deceased certificate", "mrityu praman",
    ],
    aliases: ["deathcert"],
  },
  {
    id: "driving-licence",
    keywords: [
      "driving licence", "driving license", "dl", "learner licence",
      "learner license", "ll test", "rto", "sarathi", "motor vehicle",
      "vehicle licence", "two wheeler licence", "car licence",
      "hgmv", "lmv", "mcwg",
    ],
    aliases: ["drivinglicence", "driving-license", "drivinglicense"],
  },
  {
    id: "pan",
    keywords: [
      "pan card", "pan number", "permanent account number", "pan",
      "income tax card", "nsdl pan", "uti pan", "e-pan", "epan",
      "instant pan", "pan aadhaar link",
    ],
    aliases: ["pancard", "pan-card"],
  },
  {
    id: "voter-id",
    keywords: [
      "voter id", "voter card", "epic", "election card", "voting card",
      "electoral roll", "voter registration", "e-epic", "eepic",
      "booth level officer", "blo", "ero",
    ],
    aliases: ["voterid", "voter-id", "votercard"],
  },
  {
    id: "ration-card",
    keywords: [
      "ration card", "pds", "public distribution", "fair price shop",
      "food card", "ration shop", "bpl card", "apl card",
      "subsidised food", "free rice", "ration",
    ],
    aliases: ["rationcard", "ration-card"],
  },
  {
    id: "meeseva",
    keywords: [
      "meeseva", "mee seva", "mee-seva", "meeseva centre",
      "telangana portal", "tg.meeseva", "government services",
      "citizen services", "service centre",
    ],
    aliases: ["meeseva", "meseeva", "meesewa"],
  },
  {
    id: "death-certificate",
    keywords: [
      "death certificate", "death cert", "death registration",
      "deceased certificate", "mrityu praman", "death record",
    ],
    aliases: ["deathcert", "death-cert"],
  },
  {
    id: "telangana-schemes",
    keywords: [
      "telangana scheme", "government scheme", "welfare scheme",
      "rythu bandhu", "kalyana lakshmi", "aasara pension",
      "ts scheme", "state scheme", "ts welfare", "telangana welfare",
    ],
    aliases: ["tsschemes", "telangana-schemes"],
  },
];

/**
 * Calculate simple character-level similarity (Dice coefficient) between two strings.
 * Returns 0.0 to 1.0.
 */
function similarity(a, b) {
  if (!a || !b) return 0;
  const s1 = a.toLowerCase();
  const s2 = b.toLowerCase();
  if (s1 === s2) return 1;

  const bigrams1 = new Set();
  for (let i = 0; i < s1.length - 1; i++) bigrams1.add(s1.slice(i, i + 2));
  const bigrams2 = new Set();
  for (let i = 0; i < s2.length - 1; i++) bigrams2.add(s2.slice(i, i + 2));

  let intersection = 0;
  for (const bg of bigrams1) {
    if (bigrams2.has(bg)) intersection++;
  }

  return (2 * intersection) / (bigrams1.size + bigrams2.size);
}

/**
 * Search for the best matching service given a user query.
 *
 * Scoring:
 *   - Exact keyword match: 10 pts
 *   - Alias match: 8 pts
 *   - Partial keyword match (query contains keyword word): 5 pts
 *   - Fuzzy similarity ≥ 0.7: 3 pts
 *
 * @param {string} query — user message
 * @returns {string|null} — service ID, or null if no good match
 */
export function searchServices(query) {
  const q = query.toLowerCase().trim();
  const qWords = q.split(/\s+/).filter((w) => w.length > 2);

  let bestId = null;
  let bestScore = 0;

  for (const service of SERVICE_INDEX) {
    let score = 0;

    // Exact keyword match
    for (const kw of service.keywords) {
      if (q.includes(kw)) {
        score += kw.split(" ").length > 1 ? 12 : 10; // multi-word match scored higher
      }
    }

    // Alias match
    for (const alias of service.aliases || []) {
      if (q.includes(alias)) score += 8;
    }

    // Partial / word-level match
    for (const kw of service.keywords) {
      const kwWords = kw.split(" ");
      for (const kwWord of kwWords) {
        if (kwWord.length > 3 && qWords.some((qw) => qw.includes(kwWord) || kwWord.includes(qw))) {
          score += 4;
        }
      }
    }

    // Fuzzy similarity for short query words against keywords
    if (score === 0) {
      for (const qWord of qWords) {
        for (const kw of service.keywords) {
          if (similarity(qWord, kw) >= 0.75) {
            score += 3;
          }
        }
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestId = service.id;
    }
  }

  // Require minimum score of 4 to avoid false positives
  return bestScore >= 4 ? bestId : null;
}

/**
 * Get all services that match a query (for search suggestions).
 * Returns array of { id, score } sorted by score descending.
 */
export function searchAllServices(query) {
  const q = query.toLowerCase().trim();

  return SERVICE_INDEX
    .map((service) => {
      let score = 0;
      for (const kw of service.keywords) {
        if (q.includes(kw)) score += 10;
        else if (kw.split(" ").some((w) => q.includes(w) && w.length > 3)) score += 5;
      }
      return { id: service.id, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);
}
