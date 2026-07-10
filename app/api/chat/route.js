/**
 * SevaSetu AI Chat API — RAG-based Government Service Assistant
 * ─────────────────────────────────────────────────────────────────────────────
 * Pipeline:
 *   1. Detect service (UI hint → keyword → semantic/fuzzy search)
 *   2. Detect intent
 *   3. Retrieve knowledge from JSON (RAG)
 *   4. Build prompt with context + conversation history
 *   5. OpenAI → Gemini → local fallback
 *
 * Returns: { answer, metadata: { service, intent, officialSource } }
 */

import { detectService } from "../../../lib/intent/detectService";
import { detectIntent }  from "../../../lib/intent/detectIntent";
import { retrieveKnowledge } from "../../../lib/retriever/retrieveKnowledge";
import { buildChatPrompt, buildLocalAnswer } from "../../../lib/prompts/buildChatPrompt";
import { searchServices } from "../../../lib/retriever/serviceSearch";

const isDev = process.env.NODE_ENV === "development";
const log   = (label, val) => { if (isDev) console.log(`[SevaSetu] ${label}:`, val); };

const FALLBACK_ANSWER =
  "I don't have verified information for this yet. Please check the official portal or contact the nearest MeeSeva centre.";

export async function POST(req) {
  const start = Date.now();
  try {
    const body = await req.json();
    const { message, serviceId, lang = "en", history = [] } = body;

    if (!message?.trim()) {
      return Response.json({ answer: "Please type a question.", metadata: {} });
    }

    const q = message.trim();

    // ── 1. Detect service ────────────────────────────────────────────────────
    let service = detectService(q, serviceId || null);

    // Semantic fallback when no direct keyword match
    if (service === "general") {
      const hit = searchServices(q);
      if (hit) { service = hit; log("semantic", service); }
    }

    // ── 2. Detect intent ─────────────────────────────────────────────────────
    const intent = detectIntent(q);
    log("service", service);
    log("intent",  intent);

    // ── 3. Retrieve knowledge (RAG) ──────────────────────────────────────────
    const retrieval = retrieveKnowledge(service, intent, q);
    log("found",      retrieval.found);
    log("sectionKey", retrieval.sectionKey);

    const metadata = {
      service:        retrieval.serviceName || service,
      intent:         intent.replace(/_/g, " "),
      officialSource: retrieval.officialPortal || "",
    };

    if (!retrieval.found) {
      log("ms", Date.now() - start);
      return Response.json({ answer: FALLBACK_ANSWER, metadata });
    }

    // ── 4. Build context string ───────────────────────────────────────────────
    const context = buildLocalAnswer(retrieval, intent);
    log("contextLen", context.length);

    // ── 5a. Try OpenAI ────────────────────────────────────────────────────────
    if (process.env.OPENAI_API_KEY) {
      try {
        const { messages } = buildChatPrompt(intent, context, q, lang, history);
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

    // ── 5b. Try Gemini ────────────────────────────────────────────────────────
    if (process.env.GEMINI_API_KEY) {
      try {
        const { messages } = buildChatPrompt(intent, context, q, lang, history);
        const { GoogleGenerativeAI } = await import("@google/generative-ai");
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        // Try flash-2 first, fall back to flash
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

    // ── 5c. Local fallback ────────────────────────────────────────────────────
    log("ms", Date.now() - start);
    return Response.json({ answer: context, metadata });

  } catch (err) {
    log("route err", err.message);
    return Response.json({ answer: FALLBACK_ANSWER, metadata: {} });
  }
}
