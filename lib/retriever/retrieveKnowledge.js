import { readFileSync } from "fs";
import { join } from "path";

/**
 * retrieveKnowledge(serviceId, intent, userMessage)
 * ─────────────────────────────────────────────────────────────────────────────
 * 1. Loads the correct JSON file from lib/knowledge/
 * 2. Retrieves the matching section based on intent
 * 3. Searches FAQs by intent, keywords, and question text
 * 4. Returns the best match — FAQ answer if FAQ match is stronger
 *
 * Never throws. Returns { found: false } safely on any error.
 */

// Primary section keys per intent (ordered by priority)
const INTENT_TO_SECTIONS = {
  purpose:                ["purpose"],
  eligibility:            ["eligibility"],
  documents:              ["documents"],
  fees:                   ["fees"],
  processing_time:        ["processingTime", "validity"],
  steps:                  ["applicationSteps", "steps"],
  appointment:            ["appointmentBooking"],
  appointment_reschedule: ["appointmentReschedule"],
  tracking:               ["passportStatusTracking", "tracking"],
  renewal:                ["passportRenewal", "renewal"],
  lost_document:          ["lostPassport", "lostCard", "lostAadhaar", "lostDocument", "lostPan", "duplicateLicence"],
  name_change:            ["nameChange", "nameCorrection", "correction"],
  address_change:         ["addressChange", "addressUpdate"],
  rejection:              ["rejectionReasons", "commonMistakes"],
  office:                 ["officialLinks"],
  portal:                 ["officialPortal"],
  faq:                    ["faqs"],
  edge_case:              ["edgeCases"],
  general:                ["purpose"],
};

const cache = new Map();
const isDev = process.env.NODE_ENV === "development";

function loadFile(serviceId) {
  // In development, always re-read file so edits are picked up
  if (!isDev && cache.has(serviceId)) return cache.get(serviceId);
  try {
    const filePath = join(process.cwd(), "lib", "knowledge", `${serviceId}.json`);
    const raw = readFileSync(filePath, "utf-8");
    const data = JSON.parse(raw);
    if (!isDev) cache.set(serviceId, data);
    return data;
  } catch {
    return null;
  }
}

/**
 * Search FAQs for the best match.
 * Scoring: intent match = 3, keyword match = 2 per keyword, question text overlap = 1 per word.
 * Returns { faq, score } or null.
 */
function searchFaqs(faqs, intent, userMessage) {
  if (!faqs || !Array.isArray(faqs) || faqs.length === 0) return null;

  const msgWords = userMessage.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  let bestFaq = null;
  let bestScore = 0;

  for (const faq of faqs) {
    let score = 0;

    // Intent match (strong signal)
    if (faq.intent === intent) {
      score += 3;
    }

    // Keyword match
    if (faq.keywords && Array.isArray(faq.keywords)) {
      for (const kw of faq.keywords) {
        if (userMessage.toLowerCase().includes(kw.toLowerCase())) {
          score += 2;
        }
      }
    }

    // Question text overlap (word-level)
    if (faq.question) {
      const faqWords = faq.question.toLowerCase().split(/\s+/).filter(w => w.length > 2);
      for (const word of msgWords) {
        if (faqWords.includes(word)) {
          score += 1;
        }
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestFaq = faq;
    }
  }

  // Minimum threshold — require at least intent match + 1 keyword or 5 total score
  if (bestScore >= 5 && bestFaq) {
    return { faq: bestFaq, score: bestScore };
  }

  return null;
}

/**
 * @param {string} serviceId
 * @param {string} intent
 * @param {string} [userMessage=""]
 * @returns {{
 *   found: boolean,
 *   serviceName: string|null,
 *   officialPortal: string|null,
 *   lastVerified: string|null,
 *   sectionKey: string|null,
 *   section: any,
 *   matchedFaqId: string|null,
 *   source: string
 * }}
 */
export function retrieveKnowledge(serviceId, intent, userMessage = "") {
  const file = loadFile(serviceId);

  const empty = {
    found: false,
    serviceName: null,
    officialPortal: null,
    lastVerified: null,
    sectionKey: null,
    section: null,
    matchedFaqId: null,
    source: "not_found",
  };

  if (!file) return empty;

  const meta = {
    serviceName:    file.name          || null,
    officialPortal: file.officialPortal || null,
    lastVerified:   file.lastVerified  || null,
  };

  // full_guide → return all sections, skip FAQ search
  if (intent === "full_guide") {
    return { found: true, ...meta, sectionKey: "full_guide", section: file.sections || null, matchedFaqId: null, source: `${serviceId}.json` };
  }

  // portal intent → return officialPortal directly
  if (intent === "portal") {
    const portalText = file.officialPortal
      ? `Official portal: ${file.officialPortal}`
      : null;
    return { found: !!file.officialPortal, ...meta, sectionKey: "officialPortal", section: portalText, matchedFaqId: null, source: `${serviceId}.json` };
  }

  // Step 1: Get section match — try each candidate key in priority order
  const sectionKeys = INTENT_TO_SECTIONS[intent] || ["purpose"];
  let section = null;
  let sectionFound = false;
  let matchedSectionKey = null;

  if (file.sections) {
    for (const key of sectionKeys) {
      const raw = file.sections[key];
      if (raw !== undefined && raw !== null && raw !== "" && !(Array.isArray(raw) && raw.length === 0)) {
        section = raw;
        sectionFound = true;
        matchedSectionKey = key;
        break;
      }
    }
  }

  // Step 2: Search FAQs (root-level faqs array)
  const faqResult = searchFaqs(file.faqs, intent, userMessage);

  // Step 3: Decide — SECTION ALWAYS WINS if found and non-empty.
  // FAQ is used ONLY when no section matches.
  if (sectionFound) {
    return {
      found: true,
      ...meta,
      sectionKey: matchedSectionKey,
      section: section,
      matchedFaqId: null,
      source: `${serviceId}.json`,
    };
  }

  // No section found — use FAQ if available
  if (faqResult) {
    return {
      found: true,
      ...meta,
      sectionKey: "faq",
      section: faqResult.faq.answer,
      matchedFaqId: faqResult.faq.id,
      source: `${serviceId}.json#faq:${faqResult.faq.id}`,
    };
  }

  // Nothing found — try purpose as safe fallback
  if (file.sections?.purpose) {
    return { found: true, ...meta, sectionKey: "purpose", section: file.sections.purpose, matchedFaqId: null, source: `${serviceId}.json` };
  }

  return { ...empty, ...meta, source: `${serviceId}.json` };
}