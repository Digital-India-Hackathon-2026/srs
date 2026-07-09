/**
 * detectIntent(question)
 * ─────────────────────────────────────────────────────────────────────────────
 * Detects what the user wants to know about a service.
 *
 * Supported intents:
 *   purpose, eligibility, documents, fees, processing_time, steps,
 *   appointment, renewal, rejection, full_guide, general
 *
 * Examples:
 *   "What is the use of income certificate?"   → purpose
 *   "age limit for driving licence"            → eligibility
 *   "documents for passport"                   → documents
 *   "how to apply income certificate"          → steps
 *   "tell me everything about passport"        → full_guide
 *   "what is the fee?"                         → fees
 *   "how many days does it take?"              → processing_time
 *   "my passport was rejected"                 → rejection
 *   "how to renew driving licence"             → renewal
 *   "book passport appointment"                → appointment
 */

// Order matters — more specific patterns must come before broader ones.
const INTENT_RULES = [
  // appointment reschedule — most specific, check FIRST
  {
    intent: "appointment_reschedule",
    patterns: [
      /everything about.*reschedul/i,
      /reschedul/i,
      /cannot attend/i,
      /can't attend/i,
      /how many times.*reschedul/i,
      /missed.*appointment/i,
      /miss.*appointment/i,
      /what if.*miss/i,
    ],
  },

  // full_guide — check after specific intents
  {
    intent: "full_guide",
    patterns: [
      /tell me everything/i,
      /full guide/i,
      /complete (guide|info|details)/i,
      /all (details|info)/i,
      /explain everything/i,
      /everything about/i,
    ],
  },

  // rejection / mistakes — before eligibility (to catch "can go wrong")
  {
    intent: "rejection",
    patterns: [
      /what can go wrong/i,
      /can go wrong/i,
      /reject/i,
      /denied/i,
      /refused/i,
      /mistake/i,
      /common error/i,
      /avoid/i,
      /why.*fail/i,
      /fail/i,
      /problem/i,
    ],
  },

  // purpose / use
  {
    intent: "purpose",
    patterns: [
      /what is (the )?use/i,
      /why (do|should|would) (i|we) need/i,
      /purpose of/i,
      /what (is it )?for/i,
      /used for/i,
      /why is it (needed|required|important)/i,
      /what does .* (certificate|card|licence)/i,
      /what is (an? )?(income|caste|residence|birth|death|driving|voter|ration|aadhaar|pan|passport)/i,
      /^what is (a )?passport/i,
    ],
  },

  // eligibility
  {
    intent: "eligibility",
    patterns: [
      /am i eligible/i,
      /who (is eligible|can apply)/i,
      /eligibilit/i,
      /criteria/i,
      /age (limit|requirement|restrict)/i,
      /age for/i,
      /qualification/i,
      /who qualifies/i,
      /\bcan i (get|apply|qualify)\b/i,
      /minimum age/i,
    ],
  },

  // documents
  {
    intent: "documents",
    patterns: [
      /what documents/i,
      /which documents/i,
      /documents (required|needed|to carry|to bring|for)/i,
      /what (to|do i) (bring|carry|need|submit)/i,
      /list of documents/i,
      /papers (required|needed)/i,
      /\bdocs\b/i,
      /\bdocuments\b/i,
    ],
  },

  // fees
  {
    intent: "fees",
    patterns: [
      /\bfee\b/i,
      /\bfees\b/i,
      /\bcharge\b/i,
      /\bcost\b/i,
      /how much/i,
      /\bprice\b/i,
      /is it free/i,
      /how much.*pay/i,
      /payment/i,
    ],
  },

  // processing_time
  {
    intent: "processing_time",
    patterns: [
      /how long/i,
      /how many days/i,
      /how much time/i,
      /processing time/i,
      /how soon/i,
      /when will/i,
      /timeline/i,
      /duration/i,
      /\bdays\b/i,
      /\bweeks\b/i,
    ],
  },

  // appointment (generic booking)
  {
    intent: "appointment",
    patterns: [
      /appointment/i,
      /book.*slot/i,
      /schedule/i,
    ],
  },

  // renewal
  {
    intent: "renewal",
    patterns: [
      /renew/i,
      /renewal/i,
      /reissue/i,
      /expir/i,
      /expired/i,
    ],
  },

  // portal / where to apply — must come BEFORE steps
  {
    intent: "portal",
    patterns: [
      /where (should|do|can) i apply/i,
      /where (to|do i|can i) apply/i,
      /where.*submit/i,
      /where.*go\b/i,
      /official (portal|website|link)/i,
      /online.*apply/i,
      /\bwebsite\b/i,
      /\bportal\b/i,
      /nearest office/i,
      /which office/i,
    ],
  },

  // steps / how to apply
  {
    intent: "steps",
    patterns: [
      /how (to|do i) apply/i,
      /how (to|do i) get/i,
      /how (can|should) i (apply|get|obtain)/i,
      /application process/i,
      /steps (to|for)/i,
      /process (for|to)/i,
      /procedure/i,
      /how to obtain/i,
      /apply for/i,
    ],
  },
];

/**
 * @param {string} question — the user's message
 * @returns {string} — one of the supported intent strings
 */
export function detectIntent(question) {
  const q = question.toLowerCase();

  for (const rule of INTENT_RULES) {
    for (const pattern of rule.patterns) {
      if (pattern.test(q)) return rule.intent;
    }
  }

  return "general";
}
