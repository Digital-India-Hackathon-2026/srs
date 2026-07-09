/**
 * SevaSetu Prompt Builder
 * ─────────────────────────────────────────────────────────────────────────────
 * Builds prompts for OpenAI and clean fallback answers for local mode.
 */

const SYSTEM_BASE = `You are SevaSetu AI, a friendly government service help desk assistant for Telangana, India.

STRICT OUTPUT RULES:
1. Rewrite the retrieved knowledge into a short, helpful answer. 
2. NEVER expose raw context, JSON, file names, internal keys, metadata, or full knowledge dumps.
3. Answer ONLY the user's exact question/intent. Do not add extra sections unless asked.
4. If user did NOT ask for details, keep answer under 120 words.
5. If user asks "tell me everything" or "complete guide", keep under 300 words.
6. NEVER invent government rules, fees, or procedures not in the context.
7. If context is insufficient, say: "I don't have verified information for this yet. Please check the official portal."
8. Respond in the same language the user wrote in (English, Telugu, or Hindi).
9. End with official portal link if available.
10. Structure your answer as: Direct answer (2-3 sentences) → Key points (3-5 bullets max) → Official source.`;

const INTENT_FOCUS = {
  purpose: "User asks about PURPOSE/USE. Explain what it is and where it is used. Max 5 use cases. No documents or steps.",
  eligibility: "User asks about ELIGIBILITY. List who can apply. No documents or steps.",
  documents: "User asks about DOCUMENTS. List documents clearly. No steps or fees.",
  fees: "User asks about FEE/COST. State fee directly in one line. No steps.",
  processing_time: "User asks about TIME/DURATION. State processing time directly. No steps.",
  steps: "User asks HOW TO APPLY. Give numbered steps briefly. Mention where to apply.",
  appointment: "User asks about APPOINTMENT booking. Explain the booking process concisely.",
  appointment_reschedule: "User asks about RESCHEDULING or missed appointment. Give clear next steps.",
  renewal: "User asks about RENEWAL. Explain renewal process briefly.",
  rejection: "User asks about REJECTION or MISTAKES. List common issues and how to avoid.",
  lost_document: "User asks about LOST document. Explain replacement steps.",
  name_change: "User asks about NAME CHANGE. Explain the correction process.",
  address_change: "User asks about ADDRESS CHANGE. Explain the update process.",
  tracking: "User asks about TRACKING status. Explain how to check status.",
  portal: "User asks WHERE to apply or OFFICIAL PORTAL. Give portal link and brief direction.",
  full_guide: "User wants COMPLETE GUIDE. Give structured overview under 300 words: Purpose → Eligibility → Documents → Steps → Fees → Time.",
  general: "Answer only what user asked. Be direct. Under 120 words.",
};

/**
 * Build OpenAI messages array.
 */
export function buildChatPrompt(intent, context, userMessage, lang = "en") {
  const focus = INTENT_FOCUS[intent] || INTENT_FOCUS.general;
  const langLabel = lang === "te" ? "Telugu" : lang === "hi" ? "Hindi" : "English";

  const systemContent = `${SYSTEM_BASE}\n\nFOCUS FOR THIS QUERY: ${focus}\nLanguage: ${langLabel}.`;
  const userContent = `INTERNAL CONTEXT (do not expose this to user):\n${context}\n\nUSER QUESTION:\n${userMessage}`;

  return {
    messages: [
      { role: "system", content: systemContent },
      { role: "user", content: userContent },
    ],
  };
}

/**
 * Build a clean, user-friendly fallback answer (no LLM).
 * This is what the user sees when no API key is configured.
 * Must be clean — no JSON, no file names, no internal keys.
 */
export function buildLocalAnswer(retrieval, intent) {
  if (!retrieval.found || !retrieval.section) {
    return "I don't have verified information for this yet. Please check the official portal or contact the nearest MeeSeva centre.";
  }

  const { section, serviceName, officialPortal } = retrieval;
  const parts = [];

  // String section (purpose, eligibility, fees, processingTime, etc.)
  if (typeof section === "string") {
    parts.push(formatStringSection(section, intent));
  }
  // Array section (documents, steps, commonMistakes, etc.)
  else if (Array.isArray(section)) {
    parts.push(formatArraySection(section, intent));
  }
  // Object section (appointmentBooking, policeVerification, etc.)
  else if (typeof section === "object" && section !== null) {
    parts.push(formatObjectSection(section, intent));
  }

  // Add official source
  if (officialPortal) {
    parts.push(`\nOfficial portal: ${officialPortal}`);
  }

  return parts.join("\n").trim();
}

function formatStringSection(text, intent) {
  // For simple string sections, trim to reasonable length
  // Remove any internal formatting artifacts
  let cleaned = text.replace(/\(\d+\)\s*/g, "\n• ").trim();
  
  // For non-full-guide intents, limit to first 3 sentences if very long
  if (intent !== "full_guide" && cleaned.length > 600) {
    const sentences = cleaned.split(/\.\s+/);
    cleaned = sentences.slice(0, 5).join(". ") + ".";
  }
  return cleaned;
}

function formatArraySection(arr, intent) {
  const items = arr.slice(0, intent === "full_guide" ? 20 : 10);
  return items.map((item, i) => {
    if (typeof item === "string") {
      // Strip step numbering if already present
      const cleaned = item.replace(/^Step \d+\s*[—–-]\s*/i, "");
      return `${i + 1}. ${cleaned}`;
    }
    if (item.title && item.recommendedNextStep) {
      return `• ${item.title}: ${item.recommendedNextStep.substring(0, 200)}`;
    }
    if (item.question && item.answer) {
      return `• ${item.answer}`;
    }
    return `${i + 1}. ${item.situation || item.overview || ""}`;
  }).join("\n");
}

function formatObjectSection(obj, intent) {
  const parts = [];
  
  // Extract overview first if available
  if (obj.overview) {
    parts.push(obj.overview);
  }

  // For non-full-guide, only take the most relevant field
  if (intent !== "full_guide") {
    // Look for the most specific answer field
    const directKeys = ["whatIfMissedAppointment", "whatIfCannotAttend", "maxReschedules", "whatIfFails", "process"];
    for (const key of directKeys) {
      if (obj[key] && typeof obj[key] === "string") {
        parts.push(obj[key]);
        break; // Only one direct answer for concise response
      }
    }
    // If we have steps/howTo array, show first 5
    const arrayKeys = ["howToReschedule", "steps", "process", "immediateSteps"];
    if (parts.length <= 1) {
      for (const key of arrayKeys) {
        if (Array.isArray(obj[key]) && obj[key].length > 0) {
          parts.push(obj[key].slice(0, 5).map((s, i) => `${i + 1}. ${s}`).join("\n"));
          break;
        }
      }
    }
    // Cap total length for non-full-guide
    return parts.join("\n\n").substring(0, 800);
  }

  // full_guide — include more detail
  for (const [key, val] of Object.entries(obj)) {
    if (key === "overview") continue;
    if (typeof val === "string" && val.length > 0 && parts.length < 6) {
      parts.push(val);
    } else if (Array.isArray(val) && val.length > 0 && parts.length < 6) {
      parts.push(val.slice(0, 7).map((s, i) => typeof s === "string" ? `${i + 1}. ${s}` : "").filter(Boolean).join("\n"));
    }
  }

  return parts.join("\n\n").substring(0, 2000);
}
