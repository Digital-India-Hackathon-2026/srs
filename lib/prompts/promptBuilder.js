/**
 * SevaSetu Prompt Builder
 * ─────────────────────────────────────────────────────────────────────────────
 * Assembles the final prompt sent to OpenAI (or any LLM) from three parts:
 *   1. System prompt   — who the AI is and hard rules
 *   2. Context block   — retrieved knowledge (intent-specific section only)
 *   3. User question   — original message from the citizen
 *
 * Architecture note:
 *   - System prompt is intentionally strict to prevent hallucination.
 *   - Intent-specific instructions keep the answer focused.
 *   - Adding a new intent = adding one entry to INTENT_INSTRUCTIONS.
 *   - Prompt is returned as an array of OpenAI-compatible message objects.
 */

// ─── Base system prompt ───────────────────────────────────────────────────────
export const BASE_SYSTEM_PROMPT = `You are SevaSetu AI, a government service assistant for Telangana, India.

STRICT RULES — follow all of them without exception:
1. Answer ONLY from the CONTEXT block provided. Never use outside knowledge.
2. Never invent government procedures, fee amounts, timelines, or rules.
3. If the context does not contain the answer, respond exactly:
   "I don't have verified information for this yet. Please check the official portal or contact the nearest MeeSeva centre."
4. Respond in the same language the user wrote in (English, Telugu, or Hindi).
5. Always end your response with the official portal link if one is available in the context.
6. Keep the tone simple, direct, and helpful — like a helpful government official.
7. Never mention that you are using a knowledge base or JSON files.`;

// ─── Intent-specific focus instructions ──────────────────────────────────────
const INTENT_INSTRUCTIONS = {
  purpose:
    "The user wants to know WHAT this service/document is and WHERE it is used. Give a clear explanation of its purpose and list the common use cases. Do NOT include documents or steps.",

  eligibility:
    "The user wants to know WHO is eligible. List eligibility criteria clearly. Do NOT include documents or steps.",

  documents:
    "The user wants the DOCUMENTS REQUIRED list only. List all mandatory documents clearly numbered. Mention optional documents separately if available. Do NOT include steps.",

  fees:
    "The user wants to know the FEE or COST. State it directly. Mention if anything is free.",

  processing_time:
    "The user wants to know HOW LONG it takes. State the processing time directly. Include validity period if available.",

  steps:
    "The user wants the APPLICATION STEPS. Give a numbered step-by-step process. Mention where to apply at the end.",

  appointment:
    "The user wants to know about booking an APPOINTMENT. Explain the booking process step by step.",

  appointment_reschedule:
    "The user wants to know about RESCHEDULING an appointment or what to do if they cannot attend. Be very specific. Mention portal options first, then helpline, then RPO visit as the last option.",

  tracking:
    "The user wants to TRACK their application. Explain how to check status using file number or reference number.",

  renewal:
    "The user wants to know about RENEWAL. Explain the renewal process, eligibility, and any fees.",

  lost_document:
    "The user has LOST their document. Explain the duplicate / replacement process.",

  name_change:
    "The user wants to change their NAME on a document. Explain the name change process and required documents.",

  address_change:
    "The user wants to change their ADDRESS on a document. Explain the address change process.",

  rejection:
    "The user wants to know about REJECTION or COMMON MISTAKES. List what can go wrong and how to avoid it.",

  office:
    "The user wants to know WHERE to go or apply. Tell them the office or centre to visit. Keep it short.",

  portal:
    "The user wants the OFFICIAL PORTAL or WEBSITE. Give them the link directly.",

  faq:
    "The user has a general FAQ-type question. Answer it directly from the context.",

  edge_case:
    "The user has an unusual or specific situation. Address their exact case from the edge cases in the context. If not available, say it is not yet verified.",

  full_guide:
    "The user wants a COMPLETE GUIDE. Structure your answer clearly: Purpose → Eligibility → Documents → Steps → Fees → Processing Time → Common Mistakes. Use clear headers.",

  general:
    "Answer only what the user is asking. Do not give the full guide. Be direct and practical.",
};

// ─── Main builder ─────────────────────────────────────────────────────────────

/**
 * Build the full prompt for OpenAI Chat Completions.
 *
 * @param {{
 *   intent: string,
 *   formattedContext: string,
 *   userMessage: string,
 *   lang?: string
 * }} params
 * @returns {{ systemMessage: string, userContent: string, messages: Array }}
 */
export function buildPrompt({ intent, formattedContext, userMessage, lang = "en" }) {
  const intentInstruction = INTENT_INSTRUCTIONS[intent] ?? INTENT_INSTRUCTIONS.general;

  const systemMessage = `${BASE_SYSTEM_PROMPT}

FOCUS INSTRUCTION FOR THIS QUERY:
${intentInstruction}

Respond in language: ${lang === "te" ? "Telugu" : lang === "hi" ? "Hindi" : "English"}.`;

  const userContent = `CONTEXT:
${formattedContext}

CITIZEN QUESTION:
${userMessage}`;

  return {
    systemMessage,
    userContent,
    // OpenAI messages array format
    messages: [
      { role: "system", content: systemMessage },
      { role: "user",   content: userContent   },
    ],
  };
}

/**
 * Build a fallback response from retrieved context (no LLM needed).
 * Used when OpenAI key is missing or API fails.
 *
 * @param {string} formattedContext
 * @param {string} serviceName
 * @param {string} intent
 * @param {string} officialPortal
 * @returns {string}
 */
export function buildFallbackResponse(formattedContext, serviceName, intent, officialPortal) {
  if (!formattedContext || formattedContext.startsWith("No verified knowledge")) {
    return "I couldn't find verified information for this question. Please check the official portal or visit your nearest MeeSeva centre.";
  }

  return `${serviceName ? `${serviceName}\n\n` : ""}${formattedContext}${officialPortal ? `\n\nOfficial portal: ${officialPortal}` : ""}`;
}
