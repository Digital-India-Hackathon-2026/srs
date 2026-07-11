/**
 * SevaSetu Prompt Builder
 * ─────────────────────────────────────────────────────────────────────────────
 * Builds prompts for OpenAI/Gemini and clean fallback answers for local mode.
 */

const SYSTEM_BASE = `You are SevaSetu AI, a multilingual Telangana government-services guidance assistant.

Your task is to answer users only from the supplied verified service context.

Supported languages: English, Telugu, Hindi.

STRICT LANGUAGE RULES — follow without exception:
1. Detect the language used by the user.
2. Answer ENTIRELY in the same language the user wrote in.
3. If the user writes Telugu, answer FULLY in Telugu.
4. If the user writes Hindi, answer FULLY in Hindi.
5. If the user writes English, answer in English.
6. If the message is mixed-language, use the dominant language.
7. Do NOT switch to English unless the user explicitly asks for English.
8. Preserve official names, URLs, document names, and abbreviations when translation would cause confusion (e.g., keep "Aadhaar Seva Kendra", "PSK", "MeeSeva" as-is).
9. Do NOT say information is unavailable merely because the question is not in English.
10. The context is always provided in English — translate it naturally into the user's language.

ACCURACY RULES:
- Use ONLY the provided verified knowledge context.
- Do NOT invent fees, timelines, eligibility rules, documents, or URLs.
- Clearly distinguish mandatory and optional documents.
- If the context truly does not contain the answer, say so in the USER'S language.
- Do NOT provide generic English refusal messages for Telugu or Hindi queries.

RESPONSE RULES:
- Keep answers structured and readable.
- Answer the exact question first.
- Use numbered steps for procedures.
- Use bullet points for documents and eligibility.
- End with the official source when available.
- Format using emoji headers when giving multi-section answers:
  📄 Service  👤 Eligibility  📑 Documents  💰 Fee  ⏳ Time  📝 Steps  ⚠ Mistakes  🔗 Portal`;

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
 * Build OpenAI/Gemini messages array.
 *
 * CRITICAL CHANGES:
 *  - detectedService is now injected as a separate system message so the LLM
 *    knows exactly which service to answer about — prevents cross-service drift.
 *  - history is sanitised before reaching here (no stale RAG content).
 *  - Context and user question are separated clearly.
 */
export function buildChatPrompt(intent, context, userMessage, lang = "en", history = [], detectedService = null) {
  const focus = INTENT_FOCUS[intent] || INTENT_FOCUS.general;
  const langLabel = lang === "te" ? "Telugu" : lang === "hi" ? "Hindi" : "English";
  const langInstruction = lang === "te"
    ? "CRITICAL: The user is writing in Telugu. You MUST answer ENTIRELY in Telugu (తెలుగు). Do NOT answer in English."
    : lang === "hi"
    ? "CRITICAL: The user is writing in Hindi. You MUST answer ENTIRELY in Hindi (हिंदी). Do NOT answer in English."
    : "Respond in English.";

  const serviceLabel = detectedService && detectedService !== "general"
    ? detectedService.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())
    : null;

  const systemContent = `${SYSTEM_BASE}\n\nFOCUS FOR THIS QUERY: ${focus}\n\nLanguage: ${langLabel}.\n${langInstruction}`;

  const messages = [{ role: "system", content: systemContent }];

  // Explicit service binding — prevents the model from drifting to a different service
  if (serviceLabel) {
    messages.push({
      role: "system",
      content: `CURRENT SERVICE: ${serviceLabel}\nAnswer ONLY about ${serviceLabel}. Do NOT mix information from any other service.`,
    });
  }

  // Verified knowledge context — always fresh, never reused from previous turns
  messages.push({
    role: "system",
    content: `CURRENT VERIFIED KNOWLEDGE (for ${serviceLabel || "this service"}):\n${context}`,
  });

  // Sanitised conversation history (user turns only for follow-up awareness)
  for (const h of history) {
    messages.push({ role: h.role, content: h.content });
  }

  // Current user question — separated cleanly from context
  messages.push({
    role: "user",
    content: `Answer the following question in ${langLabel} using ONLY the verified knowledge above.\nDo NOT use information from previous conversation topics.\n\nQuestion: ${userMessage}`,
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
