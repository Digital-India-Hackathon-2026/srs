/**
 * OCR API for Passport Draft Generator
 * Accepts uploaded Aadhaar/PAN image, runs Tesseract.js OCR, extracts fields.
 * Never returns hardcoded data. Returns only what is actually found in the document.
 */

import { parseAadhaarFields } from "../../../../lib/ocr/parseAadhaarFields";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const documentType = formData.get("documentType") || "aadhaar";

    if (!file) {
      return Response.json({ success: false, error: "No file uploaded", extractedFields: {} });
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let rawText = "";
    let ocrMethod = "none";

    // Try Tesseract.js OCR
    try {
      const Tesseract = await import("tesseract.js");
      const worker = await Tesseract.createWorker("eng");
      const { data } = await worker.recognize(buffer);
      rawText = data.text || "";
      ocrMethod = "tesseract";
      await worker.terminate();
    } catch (ocrErr) {
      console.error("[OCR] Tesseract failed:", ocrErr.message);
      // If Tesseract fails, return empty — never fake data
      return Response.json({
        success: false,
        error: "OCR extraction failed. Please upload a clearer image or enter details manually.",
        extractedFields: {},
        confidence: {},
        rawText: "",
        ocrMethod: "failed",
      });
    }

    // Parse extracted text based on document type
    if (documentType === "aadhaar") {
      const result = parseAadhaarFields(rawText);
      return Response.json({
        success: result.success,
        documentType: "aadhaar",
        extractedFields: result.fields,
        confidence: result.confidence,
        rawText: rawText.substring(0, 500), // Truncate for privacy
        ocrMethod,
      });
    }

    // For PAN or other documents — return raw text only
    return Response.json({
      success: rawText.length > 10,
      documentType,
      extractedFields: {},
      confidence: {},
      rawText: rawText.substring(0, 500),
      ocrMethod,
    });

  } catch (err) {
    console.error("[OCR API Error]:", err.message);
    return Response.json({
      success: false,
      error: "Processing failed. Please try again.",
      extractedFields: {},
      confidence: {},
      rawText: "",
      ocrMethod: "error",
    });
  }
}
