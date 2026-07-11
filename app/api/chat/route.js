/**
 * SevaSetu AI Chat API — Multilingual RAG Government Service Assistant
 * ─────────────────────────────────────────────────────────────────────────────
 * FIXED Pipeline:
 *   1. Detect language (EN/TE/HI)
 *   2. Detect service FROM the current question — UI tab is fallback ONLY
 *   3. Detect intent/topic
 *   4. Retrieve knowledge filtered strictly to detected service
 *   5. Validate: reject retrieval if source service ≠ detected service
 *   6. Build a FRESH prompt per request — sanitised history (no stale RAG)
 *   7. OpenAI → Gemini → local fallback
 *
 * ROOT CAUSE FIXED: previously `serviceId` (UI tab) unconditionally overrode
 * service detection, so Passport tab + Aadhaar question → Passport answer.
 * History also carried raw assistant messages with previous retrieved context.
 */

import { detectService }  from "../../../lib/intent/detectService";
import { detectIntent }   from "../../../lib/intent/detectIntent";
import { retrieveKnowledge } from "../../../lib/retriever/retrieveKnowledge";
import { buildChatPrompt, buildLocalAnswer } from "../../../lib/prompts/buildChatPrompt";
import { searchServices } from "../../../lib/retriever/serviceSearch";
import { detectLanguage, FALLBACK_MESSAGES } from "../../../lib/i18n/languageDetector";
import { detectMultilingualService, detectMultilingualTopic } from "../../../lib/i18n/multilingualAliases";
import { wrapWithLocalizedHeaders } from "../../../lib/i18n/responseTemplates";
import { getTranslatedResponse } from "../../../lib/i18n/serviceTranslatedResponses";

const isDev = process.env.NODE_ENV === "development";
function dbg(label, value) { if (isDev) console.log(`[SevaSetu:chat] ${label}:`, value); }

// ── Greeting patterns & responses ────────────────────────────────────────────
const GREETINGS = [
  {
    patterns: [/^(hi|hello|hey|hii+|helo|hola)\b/i, /^(good\s*(morning|afternoon|evening|night))/i, /^(namaste|namaskar|namaskaram)\b/i, /^(నమస్కారం|నమస్తే|హలో|హాయ్)/i, /^(नमस्ते|नमस्कार|हेलो|हाय)/i],
    response: {
      en: "Hello! 👋 I'm SevaSetu AI — your guide for Telangana Government Services. I can help with Passport, Aadhaar, Driving Licence, Income Certificate, PAN Card, Voter ID, Ration Card, MeeSeva, and more.\n\nWhat service do you need help with?",
      te: "నమస్కారం! 👋 నేను సేవాసేతు AI — తెలంగాణ ప్రభుత్వ సేవల గైడ్. పాస్‌పోర్ట్, ఆధార్, డ్రైవింగ్ లైసెన్స్, ఇన్‌కమ్ సర్టిఫికేట్, పాన్ కార్డ్, వోటర్ ఐడి, రేషన్ కార్డ్, మీసేవ మొదలైన సేవల్లో సహాయం చేయగలను.\n\nమీకు ఏ సేవ గురించి సహాయం కావాలి?",
      hi: "नमस्ते! 👋 मैं सेवासेतु AI — तेलंगाना सरकारी सेवाओं का गाइड हूँ। पासपोर्ट, आधार, ड्राइविंग लाइसेंस, इनकम सर्टिफिकेट, पैन कार्ड, वोटर आईडी, राशन कार्ड, मीसेवा और अन्य सेवाओं में मदद कर सकता हूँ।\n\nआपको किस सेवा में मदद चाहिए?",
    },
  },
  {
    patterns: [/^(how are you|how r u|howdy|sup|what's up|whats up)/i, /^(ఎలా ఉన్నారు|ఎలా ఉన్నావు|బాగున్నారా)/i, /^(कैसे हो|कैसे हैं|क्या हाल)/i],
    response: {
      en: "I'm doing great, thank you! 😊 I'm SevaSetu AI — ready to help you with Telangana government services.\n\nAsk me about documents, fees, steps, eligibility for any service like Passport, Aadhaar, Driving Licence, Income Certificate, etc.",
      te: "బాగున్నాను, ధన్యవాదాలు! 😊 నేను సేవాసేతు AI — తెలంగాణ ప్రభుత్వ సేవల్లో మీకు సహాయం చేయడానికి సిద్ధంగా ఉన్నాను.",
      hi: "मैं अच्छा हूँ, धन्यवाद! 😊 मैं सेवासेतु AI — तेलंगाना सरकारी सेवाओं में आपकी मदद के लिए तैयार हूँ।",
    },
  },
  {
    patterns: [/^(thanks|thank you|thanku|tq|ty|dhanyavaad|dhanyawad)\b/i, /^(ధన్యవాదాలు|థాంక్స్|థాంక్యూ)/i, /^(धन्यवाद|शुक्रिया|थैंक्स)/i],
    response: {
      en: "You're welcome! 🙏 Happy to help. Ask me anything else about government services.",
      te: "మీకు స్వాగతం! 🙏 సహాయం చేయడం సంతోషం. ప్రభుత్వ సేవల గురించి ఇంకేదైనా అడగండి.",
      hi: "आपका स्वागत है! 🙏 मदद करके खुशी हुई। सरकारी सेवाओं के बारे में कुछ और पूछें।",
    },
  },
  {
    patterns: [/^(who are you|what are you|what can you do|what do you do)\b/i, /^(నీవు ఎవరు|నువ్వు ఎవరు|ఏం చేయగలవు)/i, /^(तुम कौन हो|आप कौन हो|क्या कर सकते हो)/i],
    response: {
      en: "I'm SevaSetu AI 🤖 — a multilingual government service assistant for Telangana. Ask me about Passport, Aadhaar, PAN Card, Voter ID, Income/Caste/Birth/Death Certificates, Driving Licence, Ration Card, and more!",
      te: "నేను సేవాసేతు AI 🤖 — తెలంగాణ ప్రభుత్వ సేవల కోసం బహుభాషా సహాయకుడిని. పాస్‌పోర్ట్, ఆధార్, పాన్, ఓటర్ ఐడి, డ్రైవింగ్ లైసెన్స్ గురించి అడగండి!",
      hi: "मैं सेवासेतु AI 🤖 — तेलंगाना सरकारी सेवाओं के लिए बहुभाषी सहायक हूँ। पासपोर्ट, आधार, पैन, वोटर आईडी, ड्राइविंग लाइसेंस के बारे में पूछें!",
    },
  },
];

function handleGreeting(text) {
  const trimmed = text.trim();
  for (const greet of GREETINGS) {
    for (const pattern of greet.patterns) {
      if (pattern.test(trimmed)) return greet.response;
    }
  }
  return null;
}

// ── Normalise service IDs ─────────────────────────────────────────────────────
// Maps alternate UI IDs → knowledge-base filenames
const SERVICE_ID_NORMALISE = { "pan-card": "pan", "pan card": "pan" };
function normaliseServiceId(id) {
  if (!id) return id;
  return SERVICE_ID_NORMALISE[id.toLowerCase()] || id;
}

/**
 * detectServiceFromQuery
 * ─────────────────────────────────────────────────────────────────────────────
 * Detects the service the user is CURRENTLY asking about.
 * The UI tab (uiTabService) is used ONLY when the question contains zero
 * service signals — it NEVER overrides an explicit mention.
 *
 * Priority:
 *   1. Multilingual alias (aadhaar/ఆధార్/आधार) — highest confidence
 *   2. English keyword regex
 *   3. Semantic/fuzzy search
 *   4. UI tab (last resort)
 *   5. "general"
 */
function detectServiceFromQuery(question, uiTabService) {
  // 1. Multilingual alias — handles Telugu/Hindi scripts and romanised names
  const fromAlias = detectMultilingualService(question);
  if (fromAlias) {
    dbg("serviceSource", "multilingual-alias");
    return fromAlias;
  }

  // 2. English regex (pass null — never use uiTab at this stage)
  const fromRegex = detectService(question, null);
  if (fromRegex && fromRegex !== "general") {
    dbg("serviceSource", "regex");
    return fromRegex;
  }

  // 3. Semantic/fuzzy
  const fromSearch = searchServices(question);
  if (fromSearch) {
    dbg("serviceSource", "semantic-search");
    return fromSearch;
  }

  // 4. UI tab — only when question has NO service signal at all
  if (uiTabService && uiTabService !== "general") {
    dbg("serviceSource", "ui-tab-fallback");
    return normaliseServiceId(uiTabService);
  }

  dbg("serviceSource", "general");
  return "general";
}

/**
 * validateRetrieval
 * ─────────────────────────────────────────────────────────────────────────────
 * Compares the service in the loaded knowledge file against the service we
 * detected from the user's question.  Rejects mismatches.
 */
function validateRetrieval(retrieval, detectedService) {
  if (!retrieval || !retrieval.found) return false;
  if (!retrieval.source) return true;

  // source format: "<serviceId>.json" or "<serviceId>.json#faq:…"
  const sourceService = retrieval.source.split(".json")[0];
  const normDetected  = normaliseServiceId(detectedService);
  const normSource    = normaliseServiceId(sourceService);

  if (normDetected === "general") return true;

  if (normSource !== normDetected) {
    dbg("VALIDATION", `FAIL — detected=${normDetected} retrieved=${normSource}`);
    return false;
  }
  dbg("VALIDATION", `PASS — service=${normDetected}`);
  return true;
}

/**
 * sanitiseHistory
 * ─────────────────────────────────────────────────────────────────────────────
 * Strips stale retrieved-knowledge contamination from conversation history.
 * Rules:
 *   - Keep last 4 Q&A pairs (8 messages).
 *   - User messages: kept verbatim (for follow-up reference).
 *   - Assistant messages: truncated to 150 chars — enough for follow-up
 *     context but not enough to leak full RAG documents into the new request.
 */
function sanitiseHistory(history) {
  if (!history || history.length === 0) return [];
  return history
    .slice(-8)
    .map(msg => {
      if (msg.role === "user") return { role: "user", content: msg.content };
      if (msg.role === "assistant") {
        const cleaned = (msg.content || "")
          .replace(/INTERNAL CONTEXT[\s\S]*?USER QUESTION/gi, "")
          .replace(/Official portal:\s*https?:\/\/\S+/gim, "")
          .trim();
        return { role: "assistant", content: cleaned.slice(0, 150) + (cleaned.length > 150 ? "…" : "") };
      }
      return null;
    })
    .filter(Boolean);
}

// ── Not-found messages per language ──────────────────────────────────────────
const NOT_FOUND_MSG = {
  en: "I could not find verified information for this request. Please use the official service portal or try rephrasing your question.",
  te: "ఈ అభ్యర్థనకు ధృవీకరించిన సమాచారం కనుగొనలేకపోయాను. దయచేసి అధికారిక సేవా పోర్టల్ ఉపయోగించండి లేదా మీ ప్రశ్నను మరో విధంగా అడగండి.",
  hi: "इस अनुरोध के लिए सत्यापित जानकारी नहीं मिली। कृपया आधिकारिक सेवा पोर्टल का उपयोग करें या अपना प्रश्न दोबारा पूछें।",
};

export async function POST(req) {
  const start = Date.now();
  try {
    const body = await req.json();
    const { message, serviceId, lang: clientLang, history = [], selectedLanguage, previousLanguage } = body;

    if (!message?.trim()) {
      return Response.json({ answer: "Please type a question.", metadata: {} });
    }

    const q = message.trim();

    // ── 0. Handle pure greetings ─────────────────────────────────────────────
    if (history.length === 0) {
      const greetingResponse = handleGreeting(q);
      if (greetingResponse) {
        const hasServiceContent = !!(detectMultilingualService(q) || detectService(q, null));
        if (!hasServiceContent) {
          const lang = detectLanguage(q, selectedLanguage || clientLang || null, previousLanguage || null);
          return Response.json({
            answer: greetingResponse[lang] || greetingResponse.en,
            metadata: { service: "general", intent: "greeting", officialSource: "", detectedLanguage: lang },
          });
        }
      }
    }

    // ── 1. Detect language ───────────────────────────────────────────────────
    const detectedLang = detectLanguage(q, selectedLanguage || clientLang || null, previousLanguage || null);
    dbg("query", q);
    dbg("lang", detectedLang);

    // ── 2. Detect service FROM the current question (UI tab = fallback only) ─
    const uiTab = normaliseServiceId(serviceId || null);
    const detectedService = detectServiceFromQuery(q, uiTab);
    dbg("uiTab", uiTab);
    dbg("detectedService", detectedService);

    // ── 3. Detect intent ─────────────────────────────────────────────────────
    let intent = detectMultilingualTopic(q);
    if (!intent) intent = detectIntent(q);
    dbg("intent", intent);

    // ── 4. Retrieve knowledge — always keyed to detectedService ─────────────
    let retrieval = retrieveKnowledge(detectedService, intent, q);
    dbg("retrieval.source", retrieval.source);
    dbg("retrieval.found", retrieval.found);

    // ── 5. Validate — reject cross-service contamination ────────────────────
    if (!validateRetrieval(retrieval, detectedService)) {
      // Retry once with strict service
      retrieval = retrieveKnowledge(detectedService, intent, q);
      if (!validateRetrieval(retrieval, detectedService) || !retrieval.found) {
        dbg("result", "validation-failed-not-found");
        return Response.json({
          answer: NOT_FOUND_MSG[detectedLang] || NOT_FOUND_MSG.en,
          metadata: { service: detectedService, intent, officialSource: "", detectedLanguage: detectedLang },
        });
      }
    }

    const metadata = {
      service:          retrieval.serviceName || detectedService,
      intent:           intent.replace(/_/g, " "),
      officialSource:   retrieval.officialPortal || "",
      detectedLanguage: detectedLang,
    };

    if (!retrieval.found) {
      const fallback = FALLBACK_MESSAGES[detectedLang] || FALLBACK_MESSAGES.en;
      dbg("ms", Date.now() - start);
      return Response.json({ answer: fallback, metadata });
    }

    // ── 6. Build context (English knowledge) ─────────────────────────────────
    const context = buildLocalAnswer(retrieval, intent);
    dbg("contextLen", context.length);

    // ── 7. Sanitise history — no stale RAG context leaks ────────────────────
    const cleanHistory = sanitiseHistory(history);
    dbg("cleanHistoryLen", cleanHistory.length);

    // ── 8a. OpenAI ───────────────────────────────────────────────────────────
    if (process.env.OPENAI_API_KEY) {
      try {
        const { messages } = buildChatPrompt(intent, context, q, detectedLang, cleanHistory, detectedService);
        const { OpenAI } = await import("openai");
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const completion = await openai.chat.completions.create({
          model: process.env.OPENAI_MODEL || "gpt-4o-mini",
          messages,
          max_tokens: 600,
          temperature: 0.1,
        });
        const answer = completion.choices[0]?.message?.content?.trim();
        dbg("model", "openai"); dbg("ms", Date.now() - start);
        if (answer) return Response.json({ answer, metadata });
      } catch (e) { dbg("OpenAI err", e.message); }
    }

    // ── 8b. Gemini ───────────────────────────────────────────────────────────
    if (process.env.GEMINI_API_KEY) {
      try {
        const { messages } = buildChatPrompt(intent, context, q, detectedLang, cleanHistory, detectedService);
        const { GoogleGenerativeAI } = await import("@google/generative-ai");
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        let model;
        try { model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }); }
        catch { model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" }); }
        const prompt = `${messages[0].content}\n\n${messages[messages.length - 1].content}`;
        const result = await model.generateContent(prompt);
        const answer = result.response.text()?.trim();
        dbg("model", "gemini"); dbg("ms", Date.now() - start);
        if (answer) return Response.json({ answer, metadata });
      } catch (e) { dbg("Gemini err", e.message); }
    }

    // ── 8c. Local fallback ───────────────────────────────────────────────────
    dbg("model", "local");
    const translatedAnswer = getTranslatedResponse(detectedService, intent, detectedLang);
    if (translatedAnswer) { dbg("ms", Date.now() - start); return Response.json({ answer: translatedAnswer, metadata }); }

    const localizedAnswer = wrapWithLocalizedHeaders(context, intent, detectedLang, retrieval.officialPortal || "");
    dbg("ms", Date.now() - start);
    return Response.json({ answer: localizedAnswer, metadata });

  } catch (err) {
    dbg("route err", err.message);
    return Response.json({ answer: FALLBACK_MESSAGES.en, metadata: { detectedLanguage: "en" } });
  }
}
