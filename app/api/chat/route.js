import { GoogleGenerativeAI } from "@google/generative-ai";
import { getServiceById } from "../../../lib/telanganaServices";

const NOT_VERIFIED = "This information is not verified yet. Please check the official Telangana portal or visit nearest MeeSeva center.";

function buildContext(service) {
  return `
SERVICE: ${service.name}
DEPARTMENT: ${service.department}
WHERE_TO_APPLY: ${service.applyAt}
OVERVIEW: ${service.overview}
DOCUMENTS_REQUIRED: ${service.documents.join("; ")}
ELIGIBILITY: ${service.eligibility.join("; ")}
APPLICATION_STEPS: ${service.steps.join(" | ")}
PROCESSING_TIME: ${service.processingTime}
FEES: ${service.fees}
COMMON_MISTAKES: ${service.mistakes.join("; ")}
OFFICIAL_SOURCE: ${service.officialLink}
LAST_VERIFIED: ${service.lastVerified}
`.trim();
}

export async function POST(req) {
  try {
    const { message, serviceId = "income-certificate", lang = "en" } = await req.json();

    const service = getServiceById(serviceId);

    if (!service || service.status === "coming-soon") {
      return Response.json({ answer: NOT_VERIFIED });
    }

    const context = buildContext(service);

    // Fallback when no API key
    if (!process.env.GEMINI_API_KEY) {
      return Response.json({
        answer: `${service.name} — ${service.department}\n\nDocuments Required:\n${service.documents.map((d, i) => `${i + 1}. ${d}`).join("\n")}\n\nApplication Steps:\n${service.steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}\n\nProcessing Time: ${service.processingTime}\n\nOfficial Source: ${service.officialLink}\n(Last verified: ${service.lastVerified})`,
      });
    }

    const systemPrompt = `You are SevaSetu Help Desk, an official government service guidance assistant for Telangana, India.
Your role is to help Telangana citizens understand government services clearly and accurately.

STRICT RULES:
1. Answer ONLY using the CONTEXT provided. Do not add any outside information.
2. If the answer cannot be found in the CONTEXT, respond with exactly: "${NOT_VERIFIED}"
3. Always mention the official source and last verified date at the end of your response.
4. Keep answers practical, step-by-step and easy to understand.
5. Respond in the same language the user wrote in (English, Telugu, or Hindi).
6. Format lists clearly with numbered steps or bullet points.
7. Do not speculate or add fees/rules not present in the CONTEXT.`;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(
      `${systemPrompt}\n\nCONTEXT:\n${context}\n\nCITIZEN QUESTION:\n${message}`
    );

    return Response.json({ answer: result.response.text() });
  } catch {
    return Response.json({ answer: NOT_VERIFIED });
  }
}
