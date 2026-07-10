/**
 * extractDocumentText.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Production-quality document extraction pipeline for SevaSetu.
 * Priority: Gemini Vision → OpenAI Vision → Tesseract.js → fail with reason.
 *
 * Two modes:
 *   1. extractDocumentText(buffer, mimeType) — raw text extraction (legacy)
 *   2. extractStructuredFields(buffer, mimeType, docType) — structured JSON extraction
 *
 * The structured mode sends document-type-specific prompts that return JSON
 * directly from the Vision AI, eliminating fragile regex parsing.
 */

const isDev = process.env.NODE_ENV === "development";
const log = (msg, detail) => { if (isDev) console.log(`[OCR] ${msg}`, detail || ""); };

// ── Structured extraction prompts per document type ──────────────────────────

const AADHAAR_PROMPT = `You are an OCR extraction engine. Extract ONLY information that is visibly present on this Indian Aadhaar card image.
Return ONLY valid JSON with no markdown formatting, no code fences, no explanation.
Do not guess or invent any values. If a field is not clearly readable, return an empty string for that field.

Required JSON schema:
{
  "fullName": "",
  "dateOfBirth": "",
  "yearOfBirth": "",
  "gender": "",
  "aadhaarNumber": "",
  "address": "",
  "houseNumber": "",
  "street": "",
  "locality": "",
  "city": "",
  "district": "",
  "state": "",
  "pinCode": "",
  "fatherName": ""
}

Rules:
- fullName: The person's name in English only
- dateOfBirth: Format DD/MM/YYYY if visible
- yearOfBirth: Only if full DOB is not visible, extract just the year
- gender: Male, Female, or Transgender
- aadhaarNumber: All 12 digits if visible (format: XXXX XXXX XXXX)
- address: Complete address as one string
- houseNumber, street, locality, city, district, state, pinCode: Break address into parts
- fatherName: From S/O, D/O, W/O, or C/O field
- Return empty string "" for any field you cannot clearly read
- NEVER invent or guess values`;

const PAN_PROMPT = `You are an OCR extraction engine. Extract ONLY information that is visibly present on this Indian PAN card image.
Return ONLY valid JSON with no markdown formatting, no code fences, no explanation.
Do not guess or invent any values. If a field is not clearly readable, return an empty string for that field.

Required JSON schema:
{
  "fullName": "",
  "fatherName": "",
  "dateOfBirth": "",
  "panNumber": ""
}

Rules:
- fullName: Cardholder's name in English
- fatherName: Father's name if visible
- dateOfBirth: Format DD/MM/YYYY
- panNumber: 10-character PAN (format: ABCDE1234F)
- Return empty string "" for any field you cannot clearly read
- NEVER invent or guess values`;

const GENERIC_PROMPT = `Extract ALL text visible in this document image. This is an Indian identity or address proof document.
Return the complete raw text exactly as printed, preserving the layout. Include all names, numbers, addresses, dates.
Do not add any commentary. Return only the extracted text.`;

const DL_PROMPT = `You are an OCR extraction engine. Extract ONLY information that is visibly present on this Indian Driving Licence card image.
Return ONLY valid JSON with no markdown formatting, no code fences, no explanation.
Do not guess or invent any values. If a field is not clearly readable, return an empty string for that field.

Required JSON schema:
{
  "licenceNumber": "",
  "fullName": "",
  "fatherName": "",
  "dateOfBirth": "",
  "gender": "",
  "address": "",
  "bloodGroup": "",
  "dateOfIssue": "",
  "dateOfExpiry": "",
  "issuingAuthority": "",
  "vehicleClasses": ""
}

Rules:
- licenceNumber: The DL number (e.g., TS0120200012345)
- fullName: Licence holder name in English
- dateOfBirth: Format DD/MM/YYYY
- vehicleClasses: All vehicle classes listed (e.g., MCWG, LMV)
- bloodGroup: If visible (e.g., O+, B+)
- Return empty string "" for any field you cannot clearly read
- NEVER invent or guess values`;

const RC_PROMPT = `You are an OCR extraction engine. Extract ONLY information that is visibly present on this Indian Vehicle Registration Certificate (RC Book / RC Card) image.
Return ONLY valid JSON with no markdown formatting, no code fences, no explanation.
Do not guess or invent any values. If a field is not clearly readable, return an empty string for that field.

Required JSON schema:
{
  "registrationNumber": "",
  "ownerName": "",
  "fatherHusbandName": "",
  "address": "",
  "vehicleClass": "",
  "manufacturer": "",
  "model": "",
  "fuelType": "",
  "chassisNumber": "",
  "engineNumber": "",
  "registrationDate": "",
  "registrationValidUpto": "",
  "insuranceValidUpto": "",
  "fitnessValidUpto": ""
}

Rules:
- registrationNumber: Vehicle number (e.g., TS09EA1234)
- chassisNumber: 17-character alphanumeric
- engineNumber: Engine serial number
- vehicleClass: e.g., LMV, MCWG, HMV
- registrationDate: Format DD/MM/YYYY
- Return empty string "" for any field you cannot clearly read
- NEVER invent or guess values`;

// ── Structured extraction (primary method) ───────────────────────────────────

/**
 * Extract structured fields from a document using Vision AI.
 * Returns parsed JSON fields directly — no regex step needed.
 * @param {Buffer} buffer - Image buffer
 * @param {string} mimeType - e.g. "image/jpeg"
 * @param {"aadhaar"|"pan"|"generic"} docType - Document type for prompt selection
 * @returns {{ fields: object|null, raw: string, method: string, error: string|null }}
 */
export async function extractStructuredFields(buffer, mimeType = "image/jpeg", docType = "aadhaar") {
  const prompt = docType === "aadhaar" ? AADHAAR_PROMPT
    : docType === "pan" ? PAN_PROMPT
    : docType === "dl" ? DL_PROMPT
    : docType === "rc" ? RC_PROMPT
    : GENERIC_PROMPT;

  // Try Gemini Vision (structured)
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    try {
      log("Trying Gemini Vision (structured)...", docType);
      const result = await callGeminiVision(buffer, mimeType, geminiKey, prompt);
      if (result && result.length > 5) {
        const parsed = parseJsonResponse(result);
        if (parsed) {
          log("Gemini structured extraction successful", Object.keys(parsed));
          return { fields: parsed, raw: result, method: "gemini-vision", error: null };
        }
        // If JSON parse failed, return raw for regex fallback
        log("Gemini returned text but JSON parse failed, using as raw");
        return { fields: null, raw: result, method: "gemini-vision-raw", error: null };
      }
    } catch (e) {
      log("Gemini Vision failed:", e.message);
    }
  } else {
    log("No GEMINI_API_KEY configured");
  }

  // Try OpenAI Vision (structured)
  const openaiKey = process.env.OPENAI_API_KEY;
  if (openaiKey) {
    try {
      log("Trying OpenAI Vision (structured)...", docType);
      const result = await callOpenAIVision(buffer, mimeType, openaiKey, prompt);
      if (result && result.length > 5) {
        const parsed = parseJsonResponse(result);
        if (parsed) {
          log("OpenAI structured extraction successful", Object.keys(parsed));
          return { fields: parsed, raw: result, method: "openai-vision", error: null };
        }
        log("OpenAI returned text but JSON parse failed, using as raw");
        return { fields: null, raw: result, method: "openai-vision-raw", error: null };
      }
    } catch (e) {
      log("OpenAI Vision failed:", e.message);
    }
  } else {
    log("No OPENAI_API_KEY configured");
  }

  // Fallback to Tesseract.js (raw text only)
  try {
    log("Falling back to Tesseract.js...");
    const tesseractPromise = extractWithTesseract(buffer);
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Tesseract timeout (20s)")), 20000)
    );
    const result = await Promise.race([tesseractPromise, timeoutPromise]);
    if (result && result.length > 10) {
      log("Tesseract extraction successful, length:", result.length);
      return { fields: null, raw: result, method: "tesseract", error: null };
    }
    return { fields: null, raw: "", method: "tesseract", error: "No readable text detected by Tesseract" };
  } catch (e) {
    log("Tesseract failed:", e.message);
    return { fields: null, raw: "", method: "failed", error: `Tesseract error: ${e.message}` };
  }
}

// ── Legacy raw text extraction (backward compatible) ─────────────────────────

/**
 * Extract raw text from a document image buffer (legacy interface).
 * @param {Buffer} buffer - Image buffer
 * @param {string} mimeType - e.g. "image/jpeg"
 * @returns {{ text: string, method: string }}
 */
export async function extractDocumentText(buffer, mimeType = "image/jpeg") {
  const result = await extractStructuredFields(buffer, mimeType, "generic");
  return { text: result.raw || "", method: result.method };
}

// ── Vision AI Callers ────────────────────────────────────────────────────────

async function callGeminiVision(buffer, mimeType, apiKey, prompt) {
  const base64 = buffer.toString("base64");
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [
            { inlineData: { mimeType, data: base64 } },
            { text: prompt },
          ],
        }],
        generationConfig: { temperature: 0.0, maxOutputTokens: 1500 },
      }),
    }
  );
  if (!res.ok) {
    const errBody = await res.text().catch(() => "");
    throw new Error(`Gemini API ${res.status}: ${errBody.substring(0, 200)}`);
  }
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

async function callOpenAIVision(buffer, mimeType, apiKey, prompt) {
  const base64 = buffer.toString("base64");
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{
        role: "user",
        content: [
          { type: "image_url", image_url: { url: `data:${mimeType};base64,${base64}` } },
          { type: "text", text: prompt },
        ],
      }],
      max_tokens: 1500,
      temperature: 0.0,
    }),
  });
  if (!res.ok) {
    const errBody = await res.text().catch(() => "");
    throw new Error(`OpenAI API ${res.status}: ${errBody.substring(0, 200)}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

async function extractWithTesseract(buffer) {
  try {
    const Tesseract = await import("tesseract.js");
    const worker = await Tesseract.createWorker("eng", 1, {
      logger: () => {},
    });
    const { data } = await worker.recognize(buffer);
    await worker.terminate();
    return data.text || "";
  } catch (e) {
    // tesseract.js not installed — skip gracefully
    throw new Error("Tesseract.js is not available: " + e.message);
  }
}

// ── JSON Response Parser ─────────────────────────────────────────────────────

/**
 * Parse JSON from Vision AI response, handling markdown fences and edge cases.
 * @param {string} text - Raw response text from Vision AI
 * @returns {object|null} - Parsed object or null if invalid
 */
function parseJsonResponse(text) {
  if (!text || typeof text !== "string") return null;

  // Strip markdown code fences if present
  let cleaned = text.trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "");
  cleaned = cleaned.trim();

  // Try direct JSON parse
  try {
    const obj = JSON.parse(cleaned);
    if (obj && typeof obj === "object" && !Array.isArray(obj)) {
      return obj;
    }
  } catch (e) {
    // Try to find JSON object in response
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const obj = JSON.parse(jsonMatch[0]);
        if (obj && typeof obj === "object") return obj;
      } catch (e2) {
        // JSON extraction failed
      }
    }
  }
  return null;
}
