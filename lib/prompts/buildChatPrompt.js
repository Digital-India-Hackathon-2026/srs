/**
 * SevaSetu Prompt Builder
 * ─────────────────────────────────────────────────────────────────────────────
 * Builds prompts for OpenAI/Gemini and clean fallback answers for local mode.
 */

const SYSTEM_BASE = `You are SevaSetu AI, a government service help desk assistant for Telangana, India.

STRICT RULES — follow all without exception:
1. Answer ONLY from the CONTEXT provided. Never use outside knowledge.
2. Never invent fees, timelines, procedures, or government rules.
3. If context is insufficient, reply exactly: "I don't have verified information for this. Please check the official portal or visit the nearest MeeSeva centre."
4. Respond in the SAME language the user wrote in (English, Telugu, or Hindi).
5. End with the official portal link when available in context.
6. Keep tone simple, direct, and helpful — like a knowledgeable government official.
7. Never mention knowledge bases, JSON files, or internal systems.
8. Format your answer using relevant emoji headers from this set where appropriate:
   📄 Service  🏛 Department  👤 Eligibility  📑 Required Documents
   💰 Fee  ⏳ Processing Time  📝 Steps  ⚠ Common Mistakes
   🔗 Official Portal  📍 MeeSeva / Office  ☎ Helpline
   Use these ONLY when giving a multi-section answer. For single-field answers (e.g. just the fee), answer directly without headers.`;

const INTENT_FOCUS = {
  purpose:
    "User asks WHAT this service is and WHERE it is used. Give a 2–3 sentence explanation then list 3–5 use cases as bullets. No documents or steps.",
  eligibility:
    "User asks WHO can apply. List eligibility criteria as clear bullets. No documents or steps.",
  documents:
    "User asks about DOCUMENTS REQUIRED. List all mandatory documents numbered. Mention optional documents separately. No steps or fees.",
  fees:
    "User asks about FEES. State the fee directly in one line. Then mention if anything is free.",
  processing_time:
    "User asks about TIME/DURATION. State processing time directly. Include validity if relevant.",
  steps:
    "User asks HOW TO APPLY. Give numbered steps (max 9). Mention where to apply at the end.",
  appointment:
    "User asks about APPOINTMENT booking. Explain the booking process step by step.",
  appointment_reschedule:
    "User asks about RESCHEDULING or missed appointment. Give specific next steps: portal first → helpline → office visit.",
  renewal:
    "User asks about RENEWAL. Explain renewal process, eligibility, and fees concisely.",
  rejection:
    "User asks about REJECTION or MISTAKES. List what can go wrong and how to avoid each.",
  lost_document:
    "User has LOST their document. Explain the duplicate/replacement process with steps.",
  name_change:
    "User asks about NAME CHANGE. Explain the process, required documents, and fee.",
  address_change:
    "User asks about ADDRESS CHANGE or UPDATE. Explain the update process and documents needed.",
  tracking:
    "User asks how to TRACK their application. Give the tracking methods: online → SMS → helpline.",
  portal:
    "User wants the OFFICIAL PORTAL or WEBSITE. Give the direct link and a one-line description.",
  full_guide:
    "User wants a COMPLETE GUIDE. Use emoji headers: 📄 Service → 👤 Eligibility → 📑 Documents → 📝 Steps → 💰 Fee → ⏳ Time → ⚠ Mistakes → 🔗 Portal. Keep each section brief.",
  general:
    "Answer only what the user asked. Be direct and practical. Under 100 words unless more detail is needed.",
};

/**
 * Build OpenAI/Gemini messages array with conversation history support.
 */
export function buildChatPrompt(intent, context, userMessage, lang = "en", history = []) {
  const focus = INTENT_FOCUS[intent] || INTENT_FOCUS.general;
  const langLabel = lang === "te" ? "Telugu" : lang === "hi" ? "Hindi" : "English";

  const systemContent = `${SYSTEM_BASE}\n\nFOCUS FOR THIS QUERY: ${focus}\nRespond in: ${langLabel}.`;

  const messages = [{ role: "system", content: systemContent }];

  // Include last 4 Q&A pairs for conversational context
  for (const h of history.slice(-8)) {
    messages.push({ role: h.role, content: h.content });
  }

  messages.push({
    role: "user",
    content: `INTERNAL CONTEXT (do not expose to user):\n${context}\n\nUSER QUESTION:\n${userMessage}`,
  });

  return { messages };
}

/**
 * Build a clean fallback answer from retrieved knowledge (no LLM needed).
 * Used when no API key is configured or when both LLMs fail.
 */
export function buildLocalAnswer(retrieval, intent) {
  if (!retrieval.found || !retrieval.section) {
    return "I don't have verified information for this yet. Please check the official portal or contact the nearest MeeSeva centre.";
  }

  const { section, officialPortal } = retrieval;
  const parts = [];

  if (typeof section === "string") {
    parts.push(formatString(section, intent));
  } else if (Array.isArray(section)) {
    parts.push(formatArray(section, intent));
  } else if (typeof section === "object" && section !== null) {
    parts.push(formatObject(section, intent));
  }

  if (officialPortal) parts.push(`\nOfficial portal: ${officialPortal}`);

  return parts.join("\n").trim();
}

function formatString(text, intent) {
  let cleaned = text.replace(/\(\d+\)\s*/g, "\n• ").trim();
  if (intent !== "full_guide" && cleaned.length > 700) {
    cleaned = cleaned.split(/\.\s+/).slice(0, 5).join(". ") + ".";
  }
  return cleaned;
}

function formatArray(arr, intent) {
  return arr.slice(0, intent === "full_guide" ? 20 : 10).map((item, i) => {
    if (typeof item === "string") return `${i + 1}. ${item.replace(/^Step \d+\s*[—–-]\s*/i, "")}`;
    if (item.title && item.recommendedNextStep) return `• ${item.title}: ${item.recommendedNextStep.slice(0, 200)}`;
    if (item.question && item.answer) return `• ${item.answer}`;
    return `${i + 1}. ${item.situation || item.overview || ""}`;
  }).join("\n");
}

function formatObject(obj, intent) {
  const parts = [];
  if (obj.overview) parts.push(obj.overview);

  if (intent !== "full_guide") {
    const directKeys = ["whatIfMissedAppointment", "whatIfCannotAttend", "maxReschedules", "whatIfFails"];
    for (const key of directKeys) {
      if (obj[key] && typeof obj[key] === "string") { parts.push(obj[key]); break; }
    }
    if (parts.length <= 1) {
      for (const key of ["howToReschedule", "steps", "process", "immediateSteps", "methods"]) {
        if (Array.isArray(obj[key]) && obj[key].length > 0) {
          parts.push(obj[key].slice(0, 5).map((s, i) => `${i + 1}. ${s}`).join("\n"));
          break;
        }
      }
    }
    return parts.join("\n\n").slice(0, 900);
  }

  for (const [key, val] of Object.entries(obj)) {
    if (key === "overview") continue;
    if (typeof val === "string" && val && parts.length < 7) parts.push(val);
    else if (Array.isArray(val) && val.length > 0 && parts.length < 7) {
      parts.push(val.slice(0, 7).map((s, i) => typeof s === "string" ? `${i + 1}. ${s}` : "").filter(Boolean).join("\n"));
    }
  }
  return parts.join("\n\n").slice(0, 2000);
}
