/**
 * extractDocumentText.js
 * Unified document text extraction using available OCR provider.
 * Priority: Gemini Vision → OpenAI Vision → Tesseract.js → Manual fallback
 */

/**
 * Extract text from a document image buffer.
 * @param {Buffer} buffer - Image buffer
 * @param {string} mimeType - e.g. "image/jpeg"
 * @returns {{ text: string, method: string }}
 */
export async function extractDocumentText(buffer, mimeType = "image/jpeg") {
  // Try Gemini Vision first
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    try {
      const result = await extractWithGemini(buffer, mimeType, geminiKey);
      if (result && result.length > 20) {
        return { text: result, method: "gemini-vision" };
      }
    } catch (e) {
      console.error("[OCR] Gemini Vision failed:", e.message);
    }
  }

  // Try OpenAI Vision
  const openaiKey = process.env.OPENAI_API_KEY;
  if (openaiKey) {
    try {
      const result = await extractWithOpenAI(buffer, mimeType, openaiKey);
      if (result && result.length > 20) {
        return { text: result, method: "openai-vision" };
      }
    } catch (e) {
      console.error("[OCR] OpenAI Vision failed:", e.message);
    }
  }

  // Fallback to Tesseract.js
  try {
    const result = await extractWithTesseract(buffer);
    if (result && result.length > 10) {
      return { text: result, method: "tesseract" };
    }
  } catch (e) {
    console.error("[OCR] Tesseract failed:", e.message);
  }

  return { text: "", method: "failed" };
}

async function extractWithGemini(buffer, mimeType, apiKey) {
  const base64 = buffer.toString("base64");
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [
            {
              inlineData: { mimeType, data: base64 },
            },
            {
              text: `Extract ALL text visible in this document image. This is an Indian identity document (Aadhaar card or PAN card). Return the complete raw text exactly as printed, preserving the layout. Include:
- All names (in English)
- All numbers (Aadhaar number, dates, PIN codes)
- Complete address
- Gender
- Date of birth
- Any other visible text
Do not add any commentary. Return only the extracted text.`,
            },
          ],
        }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 1000 },
      }),
    }
  );
  if (!res.ok) throw new Error(`Gemini API ${res.status}`);
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

async function extractWithOpenAI(buffer, mimeType, apiKey) {
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
          { type: "text", text: "Extract ALL text from this Indian identity document (Aadhaar or PAN card). Return only the raw text as printed. Include all names, numbers, addresses, dates, and gender." },
        ],
      }],
      max_tokens: 1000,
      temperature: 0.1,
    }),
  });
  if (!res.ok) throw new Error(`OpenAI API ${res.status}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

async function extractWithTesseract(buffer) {
  const Tesseract = await import("tesseract.js");
  const worker = await Tesseract.createWorker("eng");
  const { data } = await worker.recognize(buffer);
  await worker.terminate();
  return data.text || "";
}
