/**
 * SevaSetu AI Chat API
 * ─────────────────────────────────────────────────────────────────────────────
 * Returns: { answer, metadata: { service, intent, officialSource } }
 * Never exposes: JSON file names, matched FAQ IDs, raw context, debug info
 */

import { detectService } from "../../../lib/intent/detectService";
import { detectIntent } from "../../../lib/intent/detectIntent";
import { retrieveKnowledge } from "../../../lib/retriever/retrieveKnowledge";
import { buildChatPrompt, buildLocalAnswer } from "../../../lib/prompts/buildChatPrompt";

const isDev = process.env.NODE_ENV === "development";
function log(label, value) { if (isDev) console.log(`[SevaSetu] ${label}:`, value); }

const FALLBACK_ANSWER = "I don't have verified information for this yet. Please check the official portal or contact the nearest MeeSeva centre.";

export async function POST(req) {
  const start = Date.now();

  try {
    const { message, serviceId, lang = "en" } = await req.json();

    if (!message?.trim()) {
      return Response.json({ answer: "Please type a question.", metadata: {} });
    }

    // 1. Detect service & intent
    const service = detectService(message, serviceId || null);
    const intent = detectIntent(message);
    log("service", service);
    log("intent", intent);

    // 2. Retrieve knowledge
    const retrieval = retrieveKnowledge(service, intent, message);
    log("found", retrieval.found);
    log("sectionKey", retrieval.sectionKey);

    // Build clean metadata (user-facing — no file names or internal IDs)
    const metadata = {
      service: retrieval.serviceName || service,
      intent: intent.replace(/_/g, " "),
      officialSource: retrieval.officialPortal || "",
    };

    // If retrieval fails
    if (!retrieval.found) {
      log("ms", Date.now() - start);
      return Response.json({ answer: FALLBACK_ANSWER, metadata });
    }

    // 3. Build internal context (never sent to frontend)
    const internalContext = buildLocalAnswer(retrieval, intent);
    log("contextLength", internalContext.length);

    // 4. Try OpenAI
    if (process.env.OPENAI_API_KEY) {
      try {
        const { messages } = buildChatPrompt(intent, internalContext, message, lang);
        const { OpenAI } = await import("openai");
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        const completion = await openai.chat.completions.create({
          model: process.env.OPENAI_MODEL || "gpt-4o-mini",
          messages,
          max_tokens: 400,
          temperature: 0.15,
        });

        const answer = completion.choices[0]?.message?.content?.trim();
        log("ms", Date.now() - start);

        if (answer) {
          return Response.json({ answer, metadata });
        }
      } catch (e) {
        log("OpenAI error", e.message);
      }
    }

    // 5. Try Gemini
    if (process.env.GEMINI_API_KEY) {
      try {
        const { messages } = buildChatPrompt(intent, internalContext, message, lang);
        const { GoogleGenerativeAI } = await import("@google/generative-ai");
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent(`${messages[0].content}\n\n${messages[1].content}`);
        const answer = result.response.text()?.trim();
        log("ms", Date.now() - start);

        if (answer) {
          return Response.json({ answer, metadata });
        }
      } catch (e) {
        log("Gemini error", e.message);
      }
    }

    // 6. Local fallback — use the clean formatted answer
    log("ms", Date.now() - start);
    return Response.json({ answer: internalContext, metadata });

  } catch (err) {
    log("route error", err.message);
    return Response.json({ answer: FALLBACK_ANSWER, metadata: {} });
  }
}
