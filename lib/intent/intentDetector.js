/**
 * SevaSetu Intent Detector
 * ─────────────────────────────────────────────────────────────────────────────
 * Detects which government service and what the user intends to know.
 * Returns a structured result that the retriever and prompt builder consume.
 *
 * Architecture note:
 *   - Pure JS — no external deps, works on server and client.
 *   - All rules are pattern arrays so teams can extend without touching logic.
 *   - Confidence is heuristic (1.0 = explicit keyword, 0.7 = weak signal).
 *   - selectedService from chatbot UI always overrides auto-detection.
 */

// ─── Supported intents ────────────────────────────────────────────────────────
export const INTENTS = /** @type {const} */ ([
  "purpose",
  "eligibility",
  "documents",
  "fees",
  "processing_time",
  "steps",
  "appointment",
  "appointment_reschedule",
  "tracking",
  "renewal",
  "lost_document",
  "name_change",
  "address_change",
  "rejection",
  "office",
  "portal",
  "faq",
  "edge_case",
  "full_guide",
  "general",
]);

// ─── Service detection rules ──────────────────────────────────────────────────
const SERVICE_RULES = [
  {
    id: "passport",
    patterns: [/passport/i, /\bpsk\b/i, /\bpopsk\b/i, /\brpo\b/i, /tatkaal/i, /police verif/i],
  },
  {
    id: "driving-licence",
    patterns: [/driving licen/i, /\bdl\b/i, /learner licen/i, /\bll\b/i, /sarathi/i],
  },
  {
    id: "income-certificate",
    patterns: [/income cert/i, /aay praman/i, /earnings certificate/i],
  },
  {
    id: "birth-certificate",
    patterns: [/birth cert/i, /janma/i, /\bborn\b/i, /birth record/i],
  },
  {
    id: "caste-certificate",
    patterns: [/caste cert/i, /community cert/i, /\bsc cert\b/i, /\bst cert\b/i, /\bobc cert\b/i, /\bbc cert\b/i, /jati/i],
  },
  {
    id: "residence-certificate",
    patterns: [/residence cert/i, /domicile/i, /nivaas/i, /resident cert/i],
  },
  {
    id: "aadhaar",
    patterns: [/aadhaar/i, /aadhar/i, /\buid\b/i, /uidai/i],
  },
  {
    id: "ration-card",
    patterns: [/ration card/i, /\bpds\b/i, /food card/i, /ration shop/i],
  },
  {
    id: "voter-id",
    patterns: [/voter id/i, /voter card/i, /\bepic\b/i, /election card/i, /\bvoting card\b/i],
  },
  {
    id: "pan",
    patterns: [/\bpan card\b/i, /\bpan number\b/i, /permanent account/i],
  },
];

// ─── Intent detection rules ───────────────────────────────────────────────────
// Order matters — more specific patterns must come before broad ones.
const INTENT_RULES = [
  // Full guide — highest priority
  {
    intent: "full_guide",
    confidence: 1.0,
    patterns: [/tell me everything/i, /full guide/i, /complete guide/i, /all details/i, /explain everything/i, /everything about/i, /full details/i],
  },
  // Appointment reschedule — more specific than appointment
  {
    intent: "appointment_reschedule",
    confidence: 1.0,
    patterns: [/reschedul/i, /change.*appointment/i, /cannot attend/i, /can't attend/i, /shift.*appointment/i, /postpone.*appointment/i, /multiple.*reschedul/i],
  },
  // Appointment booking
  {
    intent: "appointment",
    confidence: 1.0,
    patterns: [/book.*appointment/i, /schedule.*appointment/i, /get.*appointment/i, /appointment.*slot/i, /how.*appointment/i],
  },
  // Tracking
  {
    intent: "tracking",
    confidence: 1.0,
    patterns: [/track/i, /file number/i, /application status/i, /check status/i, /\barn\b/i, /reference number/i, /where is my/i],
  },
  // Rejection
  {
    intent: "rejection",
    confidence: 1.0,
    patterns: [/reject/i, /denied/i, /refused/i, /what can go wrong/i, /can go wrong/i, /common mistake/i, /mistake/i, /avoid/i, /why.*fail/i, /fail.*why/i],
  },
  // Purpose / use
  {
    intent: "purpose",
    confidence: 1.0,
    patterns: [/what is.*use/i, /why.*need/i, /purpose of/i, /what for/i, /used for/i, /what does.*do/i, /what is.*cert/i, /what is.*card/i, /what is.*licence/i],
  },
  // Eligibility
  {
    intent: "eligibility",
    confidence: 1.0,
    patterns: [/am i eligible/i, /who.*eligible/i, /eligibilit/i, /who can apply/i, /criteria/i, /qualification/i, /who qualifies/i, /can i apply/i],
  },
  // Documents
  {
    intent: "documents",
    confidence: 1.0,
    patterns: [/what documents/i, /which documents/i, /documents.*required/i, /documents.*needed/i, /what.*bring/i, /what.*carry/i, /papers.*required/i, /list.*documents/i, /docs.*needed/i],
  },
  // Fees
  {
    intent: "fees",
    confidence: 1.0,
    patterns: [/\bfee\b/i, /\bcharge\b/i, /\bcost\b/i, /how much/i, /\bprice\b/i, /\bpayment\b/i, /is it free/i, /how.*pay/i],
  },
  // Processing time
  {
    intent: "processing_time",
    confidence: 1.0,
    patterns: [/how long/i, /how many days/i, /processing time/i, /how soon/i, /when will/i, /timeline/i, /duration/i, /\bdays\b/i, /\bweeks\b/i],
  },
  // Steps / process
  {
    intent: "steps",
    confidence: 1.0,
    patterns: [/how to apply/i, /how to get/i, /application process/i, /steps to/i, /steps for/i, /procedure/i, /process for/i, /how do i apply/i, /how to obtain/i],
  },
  // Renewal
  {
    intent: "renewal",
    confidence: 1.0,
    patterns: [/renew/i, /renewal/i, /reissue/i, /expir/i, /expired/i],
  },
  // Lost document
  {
    intent: "lost_document",
    confidence: 1.0,
    patterns: [/lost/i, /damage/i, /stolen/i, /misplace/i, /duplicate/i, /replacement/i],
  },
  // Name change
  {
    intent: "name_change",
    confidence: 1.0,
    patterns: [/name change/i, /change.*name/i, /name correction/i, /update.*name/i],
  },
  // Address change
  {
    intent: "address_change",
    confidence: 1.0,
    patterns: [/address change/i, /change.*address/i, /update.*address/i, /address correction/i, /new address/i],
  },
  // Office / where
  {
    intent: "office",
    confidence: 1.0,
    patterns: [/nearest office/i, /where.*apply/i, /which office/i, /meeseva centre/i, /rto office/i, /passport office/i, /where.*submit/i, /where.*go/i],
  },
  // Official portal
  {
    intent: "portal",
    confidence: 1.0,
    patterns: [/official.*portal/i, /official.*website/i, /official.*link/i, /online.*apply/i, /website/i, /portal/i],
  },
];

// ─── Main exports ─────────────────────────────────────────────────────────────

/**
 * Detect the government service from a user message.
 * @param {string} message
 * @param {string|null} selectedService  — already selected in UI (takes priority)
 * @returns {{ service: string, confidence: number }}
 */
export function detectService(message, selectedService = null) {
  // UI selection always wins
  if (selectedService) {
    return { service: selectedService, confidence: 1.0 };
  }

  const msg = message.toLowerCase();

  for (const rule of SERVICE_RULES) {
    for (const pattern of rule.patterns) {
      if (pattern.test(msg)) {
        return { service: rule.id, confidence: 1.0 };
      }
    }
  }

  return { service: "general", confidence: 0.5 };
}

/**
 * Detect the user's intent from a message.
 * @param {string} message
 * @returns {{ intent: string, confidence: number }}
 */
export function detectIntent(message) {
  const msg = message.toLowerCase();

  for (const rule of INTENT_RULES) {
    for (const pattern of rule.patterns) {
      if (pattern.test(msg)) {
        return { intent: rule.intent, confidence: rule.confidence };
      }
    }
  }

  return { intent: "general", confidence: 0.5 };
}

/**
 * Detect both service and intent in one call.
 * @param {string} message
 * @param {string|null} selectedService
 * @returns {{ service: string, intent: string, confidence: number }}
 */
export function analyze(message, selectedService = null) {
  const { service, confidence: sConf } = detectService(message, selectedService);
  const { intent, confidence: iConf }  = detectIntent(message);
  return {
    service,
    intent,
    confidence: Math.min(sConf, iConf),
  };
}
