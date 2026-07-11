/**
 * detectService(question, selectedService)
 * ─────────────────────────────────────────────────────────────────────────────
 * Returns the service ID the user is asking about by matching the question text.
 *
 * NOTE: selectedService is intentionally IGNORED here.
 * Service resolution from the UI tab is handled in route.js as a last-resort
 * fallback AFTER all question-based detection methods have returned nothing.
 * This prevents the UI tab from overriding an explicit service mention in the
 * user's question (e.g. Passport tab + "How do I update my Aadhaar address?").
 */

const SERVICE_PATTERNS = [
  { id: "passport",              patterns: [/passport/i, /\bpsk\b/i, /\bpopsk\b/i, /\brpo\b/i, /tatkaal/i, /tatkal/i, /police verif/i, /visa\b/i] },
  { id: "driving-licence",       patterns: [/driving licen/i, /\bdriving\b.*licen/i, /\bdl\b/i, /learner licen/i, /\bll\b/i, /sarathi/i, /\brto\b/i, /motor vehicle/i, /\blmv\b/i, /\bmcwg\b/i] },
  { id: "income-certificate",    patterns: [/income cert/i, /income certificate/i, /aay praman/i, /income proof/i, /annual income/i] },
  { id: "death-certificate",     patterns: [/death cert/i, /\bdeath\b.*regist/i, /mrityu/i, /deceased.*cert/i] },
  { id: "birth-certificate",     patterns: [/birth cert/i, /janma/i, /birth record/i, /birth regist/i] },
  { id: "caste-certificate",     patterns: [/caste cert/i, /community cert/i, /\bsc cert/i, /\bst cert/i, /\bobc cert/i, /\bbc cert/i, /jati/i, /kula dharuvikaran/i, /backward class cert/i] },
  { id: "residence-certificate", patterns: [/residence cert/i, /domicile/i, /nivaas/i, /resident cert/i] },
  { id: "aadhaar",               patterns: [/aadhaar/i, /aadhar/i, /adhar/i, /adhaar/i, /\buid\b/i, /uidai/i, /biometric update/i, /e-aadhaar/i, /pvc.*aadhaar/i] },
  { id: "ration-card",           patterns: [/ration card/i, /\bpds\b/i, /food card/i, /ration shop/i, /fair price shop/i, /bpl card/i, /food security card/i, /\bfsc\b/i] },
  { id: "voter-id",              patterns: [/voter id/i, /voter card/i, /\bepic\b/i, /election card/i, /voting card/i, /electoral roll/i, /e-epic/i] },
  { id: "pan",                   patterns: [/\bpan card\b/i, /\bpan\b/i, /\bpan number\b/i, /permanent account/i, /\bnsdl\b/i, /e-pan/i, /epan/i] },
  { id: "meeseva",               patterns: [/meeseva/i, /mee-seva/i, /mee seva/i, /tg\.meeseva/i] },
  { id: "telangana-schemes",     patterns: [/telangana scheme/i, /government scheme/i, /welfare scheme/i, /rythu bandhu/i, /kalyana lakshmi/i, /ts scheme/i, /state scheme/i] },
];

/**
 * @param {string} question — the user's message
 * @param {string|null} [selectedService=null] — intentionally ignored (see note above)
 * @returns {string} — service id or "general"
 */
export function detectService(question, selectedService = null) {
  // selectedService is deliberately not used — see module docstring
  const q = question.toLowerCase();

  for (const rule of SERVICE_PATTERNS) {
    for (const pattern of rule.patterns) {
      if (pattern.test(q)) return rule.id;
    }
  }

  return "general";
}
