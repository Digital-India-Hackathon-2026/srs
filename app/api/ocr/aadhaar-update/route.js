import { extractStructuredFields } from "../../../../lib/ocr/extractDocumentText";
import { parseAadhaarStructured, parseAadhaarFields } from "../../../../lib/ocr/parseAadhaarFields";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const aadhaarFile = formData.get("existingAadhaar");
    const updateTypes = formData.getAll("updateType");

    if (!aadhaarFile) {
      return Response.json({ success: false, error: "No Aadhaar file uploaded.", extractedFields: {}, sources: {}, confidence: {} });
    }

    const buffer = Buffer.from(await aadhaarFile.arrayBuffer());
    const mimeType = aadhaarFile.type || "image/jpeg";
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
      const parsed = parseAadhaarFields ? parseAadhaarFields(result.raw) : { fields: {} };
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
      updateTypes: updateTypes.length > 0 ? updateTypes : null,
      error: Object.keys(fields).length === 0 ? "Could not extract details from Aadhaar card. Please enter manually." : null,
    });
  } catch (err) {
    console.error("[Aadhaar Update OCR Error]:", err.message);
    return Response.json({ success: false, error: "OCR processing failed. Please try again or enter details manually.", extractedFields: {}, sources: {}, confidence: {}, ocrMethod: "error" });
  }
}
