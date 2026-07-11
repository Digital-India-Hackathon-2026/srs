import { extractStructuredFields } from "../../../../lib/ocr/extractDocumentText";
import { parseAadhaarStructured, parseAadhaarFields } from "../../../../lib/ocr/parseAadhaarFields";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const headAadhaarFile = formData.get("headAadhaar");

    if (!headAadhaarFile) {
      return Response.json({ success: false, error: "No Aadhaar file uploaded.", extractedFields: {}, sources: {}, confidence: {} });
    }

    const buffer = Buffer.from(await headAadhaarFile.arrayBuffer());
    const mimeType = headAadhaarFile.type || "image/jpeg";
    const result = await extractStructuredFields(buffer, mimeType, "aadhaar");

    let fields = {};
    let sources = {};
    let confidence = {};
    let ocrMethod = result.method || "none";

    if (result.fields) {
      const parsed = parseAadhaarStructured(result.fields);
      fields = parsed.fields || {};
      confidence = parsed.confidence || {};
      for (const k of Object.keys(fields)) sources[k] = "Aadhaar Card";
    } else if (result.raw && result.raw.length > 10) {
      const parsed = parseAadhaarFields(result.raw);
      fields = parsed.fields || {};
      confidence = parsed.confidence || {};
      for (const k of Object.keys(fields)) sources[k] = "Aadhaar Card";
    }

    return Response.json({
      success: Object.keys(fields).length > 0,
      extractedFields: fields,
      sources,
      confidence,
      ocrMethod,
      error: Object.keys(fields).length === 0 ? "Could not extract details from Aadhaar card. Please enter manually." : null,
    });
  } catch (err) {
    console.error("[Ration Card OCR Error]:", err.message);
    return Response.json({ success: false, error: "OCR processing failed. Please try again or enter details manually.", extractedFields: {}, sources: {}, confidence: {}, ocrMethod: "error" });
  }
}
