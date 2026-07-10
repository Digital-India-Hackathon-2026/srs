/**
 * SevaSetu AI Chat API — Multilingual RAG Government Service Assistant
 * ─────────────────────────────────────────────────────────────────────────────
 * Pipeline:
 *   1. Detect language (EN/TE/HI)
 *   2. Detect service (multilingual aliases → English keyword fallback → semantic)
 *   3. Detect intent/topic (multilingual aliases → English regex fallback)
 *   4. Retrieve knowledge from JSON (single English knowledge base)
 *   5. Build prompt instructing LLM to respond in detected language
 *   6. OpenAI → Gemini → local fallback
 *
 * The knowledge base is always in English. The LLM translates the answer
 * into the user's language. For local fallback (no LLM), English is returned.
 */

import { detectService }  from "../../../lib/intent/detectService";
import { detectIntent }   from "../../../lib/intent/detectIntent";
import { retrieveKnowledge } from "../../../lib/retriever/retrieveKnowledge";
import { buildChatPrompt, buildLocalAnswer } from "../../../lib/prompts/buildChatPrompt";
import { searchServices } from "../../../lib/retriever/serviceSearch";
import { detectLanguage, FALLBACK_MESSAGES } from "../../../lib/i18n/languageDetector";
import { detectMultilingualService, detectMultilingualTopic } from "../../../lib/i18n/multilingualAliases";

const isDev = process.env.NODE_ENV === "development";
const log   = (l, v) => { if (isDev) console.log(`[SevaSetu] ${l}:`, v); };

// ── Basic conversational greetings ───────────────────────────────────────────
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
      te: "బాగున్నాను, ధన్యవాదాలు! 😊 నేను సేవాసేతు AI — తెలంగాణ ప్రభుత్వ సేవల్లో మీకు సహాయం చేయడానికి సిద్ధంగా ఉన్నాను.\n\nపాస్‌పోర్ట్, ఆధార్, డ్రైవింగ్ లైసెన్స్, ఇన్‌కమ్ సర్టిఫికేట్ వంటి ఏదైనా సేవ గురించి అడగండి.",
      hi: "मैं अच्छा हूँ, धन्यवाद! 😊 मैं सेवासेतु AI — तेलंगाना सरकारी सेवाओं में आपकी मदद के लिए तैयार हूँ।\n\nपासपोर्ट, आधार, ड्राइविंग लाइसेंस, इनकम सर्टिफिकेट जैसी किसी भी सेवा के बारे में पूछें।",
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
      en: "I'm SevaSetu AI 🤖 — a multilingual government service assistant for Telangana. I can help you with:\n\n• Passport, Aadhaar, PAN Card, Voter ID\n• Income, Caste, Residence, Birth, Death Certificates\n• Driving Licence, Ration Card\n• MeeSeva Services, Telangana Government Schemes\n\nI provide verified information about documents, fees, steps, eligibility, and more. Ask me anything!",
      te: "నేను సేవాసేతు AI 🤖 — తెలంగాణ ప్రభుత్వ సేవల కోసం బహుభాషా సహాయకుడిని. నేను సహాయం చేయగలను:\n\n• పాస్‌పోర్ట్, ఆధార్, పాన్ కార్డ్, వోటర్ ఐడి\n• ఆదాయ, కుల, నివాస, జనన, మరణ ధృవీకరణ పత్రాలు\n• డ్రైవింగ్ లైసెన్స్, రేషన్ కార్డ్\n• మీసేవ, తెలంగాణ ప్రభుత్వ పథకాలు\n\nడాక్యుమెంట్స్, ఫీజులు, స్టెప్స్, అర్హత గురించి అడగండి!",
      hi: "मैं सेवासेतु AI 🤖 — तेलंगाना सरकारी सेवाओं के लिए बहुभाषी सहायक हूँ। मैं मदद कर सकता हूँ:\n\n• पासपोर्ट, आधार, पैन कार्ड, वोटर आईडी\n• आय, जाति, निवास, जन्म, मृत्यु प्रमाण पत्र\n• ड्राइविंग लाइसेंस, राशन कार्ड\n• मीसेवा सेवाएं, तेलंगाना सरकारी योजनाएं\n\nदस्तावेज, फीस, प्रक्रिया, पात्रता — कुछ भी पूछें!",
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

export async function POST(req) {
  const start = Date.now();
  try {
    const body = await req.json();
    const { message, serviceId, lang: clientLang, history = [], selectedLanguage, previousLanguage } = body;

    if (!message?.trim()) {
      return Response.json({ answer: "Please type a question.", metadata: {} });
    }

    const q = message.trim();

    // ── 0. Handle basic greetings / conversational messages ──────────────────
    const greetingResponse = handleGreeting(q);
    if (greetingResponse) {
      const lang = detectLanguage(q, selectedLanguage || clientLang || null, previousLanguage || null);
      return Response.json({
        answer: greetingResponse[lang] || greetingResponse.en,
        metadata: { service: "general", intent: "greeting", officialSource: "", detectedLanguage: lang },
      });
    }

    // ── 1. Detect language ───────────────────────────────────────────────────
    const detectedLang = detectLanguage(q, selectedLanguage || clientLang || null, previousLanguage || null);
    log("lang", detectedLang);

    // ── 2. Detect service ────────────────────────────────────────────────────
    // Try multilingual alias match first (works for Telugu/Hindi service names)
    let service = null;

    // UI-selected service always wins
    if (serviceId) {
      service = serviceId;
    } else {
      // Multilingual alias detection (supports Telugu/Hindi script)
      service = detectMultilingualService(q);

      // Fallback: English regex patterns
      if (!service) {
        service = detectService(q, null);
      }

      // Fallback: semantic/fuzzy search
      if (!service || service === "general") {
        const hit = searchServices(q);
        if (hit) service = hit;
        else if (!service) service = "general";
      }
    }
    log("service", service);

    // ── 3. Detect intent/topic ───────────────────────────────────────────────
    // Try multilingual topic aliases first
    let intent = detectMultilingualTopic(q);

    // Fallback: English regex intent detection
    if (!intent) {
      intent = detectIntent(q);
    }
    log("intent", intent);

    // ── 4. Retrieve knowledge ────────────────────────────────────────────────
    const retrieval = retrieveKnowledge(service, intent, q);
    log("found", retrieval.found);

    const metadata = {
      service:        retrieval.serviceName || service,
      intent:         intent.replace(/_/g, " "),
      officialSource: retrieval.officialPortal || "",
      detectedLanguage: detectedLang,
    };

    if (!retrieval.found) {
      const fallback = FALLBACK_MESSAGES[detectedLang] || FALLBACK_MESSAGES.en;
      log("ms", Date.now() - start);
      return Response.json({ answer: fallback, metadata });
    }

    // ── 5. Build context string (always English from knowledge base) ─────────
    const context = buildLocalAnswer(retrieval, intent);
    log("contextLen", context.length);

    // ── 6a. Try OpenAI ───────────────────────────────────────────────────────
    if (process.env.OPENAI_API_KEY) {
      try {
        const { messages } = buildChatPrompt(intent, context, q, detectedLang, history);
        const { OpenAI } = await import("openai");
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        const completion = await openai.chat.completions.create({
          model:       process.env.OPENAI_MODEL || "gpt-4o-mini",
          messages,
          max_tokens:  600,
          temperature: 0.1,
        });

        const answer = completion.choices[0]?.message?.content?.trim();
        log("ms", Date.now() - start);
        if (answer) return Response.json({ answer, metadata });
      } catch (e) { log("OpenAI err", e.message); }
    }

    // ── 6b. Try Gemini ───────────────────────────────────────────────────────
    if (process.env.GEMINI_API_KEY) {
      try {
        const { messages } = buildChatPrompt(intent, context, q, detectedLang, history);
        const { GoogleGenerativeAI } = await import("@google/generative-ai");
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        let model;
        try {
          model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        } catch {
          model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
        }

        const prompt = `${messages[0].content}\n\n${messages[messages.length - 1].content}`;
        const result = await model.generateContent(prompt);
        const answer = result.response.text()?.trim();
        log("ms", Date.now() - start);
        if (answer) return Response.json({ answer, metadata });
      } catch (e) { log("Gemini err", e.message); }
    }

    // ── 6c. Local fallback (English only — no translation without LLM) ───────
    log("ms", Date.now() - start);
    return Response.json({ answer: context, metadata });

  } catch (err) {
    log("route err", err.message);
    return Response.json({
      answer: FALLBACK_MESSAGES.en,
      metadata: { detectedLanguage: "en" },
    });
  }
}
