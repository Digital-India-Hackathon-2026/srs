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

export async function POST(req) {
  const start = Date.now();
  try {
    const body = await req.json();
    const { message, serviceId, lang: clientLang, history = [], selectedLanguage, previousLanguage } = body;

    if (!message?.trim()) {
      return Response.json({ answer: "Please type a question.", metadata: {} });
    }

    const q = message.trim();

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
