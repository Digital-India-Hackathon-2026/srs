/**
 * detectService(question, selectedService)
 * ─────────────────────────────────────────────────────────────────────────────
 * Returns the service ID the user is asking about.
 *
 * Priority:
 *   1. If selectedService is provided (from chatbot UI), return it immediately.
 *   2. Otherwise, match keywords in the question to known services.
 *   3. If no match, return "general".
 */

const SERVICE_PATTERNS = [
  { id: "passport",              patterns: [/passport/i, /\bpsk\b/i, /\bpopsk\b/i, /\brpo\b/i, /tatkaal/i, /police verif/i, /visa\b/i] },
  { id: "driving-licence",       patterns: [/driving licen/i, /\bdl\b/i, /learner licen/i, /\bll\b/i, /sarathi/i, /\brto\b/i, /motor vehicle/i] },
  { id: "income-certificate",    patterns: [/income cert/i, /income certificate/i, /aay praman/i, /aadhayam/i] },
  { id: "birth-certificate",     patterns: [/birth cert/i, /janma/i, /\bborn\b/i, /birth record/i, /birth regist/i] },
  { id: "caste-certificate",     patterns: [/caste cert/i, /community cert/i, /\bsc cert/i, /\bst cert/i, /\bobc cert/i, /\bbc cert/i, /jati/i, /kula dharuvikaran/i] },
  { id: "residence-certificate", patterns: [/residence cert/i, /domicile/i, /nivaas/i, /resident cert/i] },
  { id: "aadhaar",               patterns: [/aadhaar/i, /aadhar/i, /\buid\b/i, /uidai/i] },
  { id: "ration-card",           patterns: [/ration card/i, /\bpds\b/i, /food card/i, /ration shop/i] },
  { id: "voter-id",              patterns: [/voter id/i, /voter card/i, /\bepic\b/i, /election card/i, /voting card/i] },
  { id: "pan",                   patterns: [/\bpan card\b/i, /\bpan number\b/i, /permanent account/i] },
];

/**
 * @param {string} question — the user's message
 * @param {string|null} [selectedService=null] — service already selected in chatbot UI
 * @returns {string} — service id (e.g. "passport", "income-certificate", or "general")
 */
export function detectService(question, selectedService = null) {
  if (selectedService) return selectedService;

  const q = question.toLowerCase();

  for (const rule of SERVICE_PATTERNS) {
    for (const pattern of rule.patterns) {
      if (pattern.test(q)) return rule.id;
    }
  }

  return "general";
}
