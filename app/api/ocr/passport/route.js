/**
 * OCR API for Passport Draft Generator
 * Accepts uploaded document images, runs OCR (Gemini → OpenAI → Tesseract → fail),
 * extracts and parses fields based on document type.
 * Never returns hardcoded data.
 */

import { extractDocumentText } from "../../../../lib/ocr/extractDocumentText";
import { parseAadhaarFields } from "../../../../lib/ocr/parseAadhaarFields";
import { parsePanFields } from "../../../../lib/ocr/parsePanFields";
import { mapPassportFields } from "../../../../lib/ocr/mapPassportFields";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const aadhaarFile = formData.get("aadhaar");
    const panFile = formData.get("pan");

    if (!aadhaarFile && !panFile) {
      return Response.json({
        success: false,
        error: "No documents uploaded.",
        extractedFields: {},
        sources: {},
        confidence: {},
        missingFields: [],
      });
    }

    let aadhaarParsed = { fields: {}, confidence: {} };
    let panParsed = { fields: {}, confidence: {} };
    let ocrMethod = "none";
    const progress = [];

    // Process Aadhaar
    if (aadhaarFile) {
      progress.push("Reading Aadhaar...");
      const buffer = Buffer.from(await aadhaarFile.arrayBuffer());
      const mimeType = aadhaarFile.type || "image/jpeg";

      const { text, method } = await extractDocumentText(buffer, mimeType);
      ocrMethod = method;

      if (text && text.length > 10) {
        progress.push("Parsing Aadhaar details...");
        const result = parseAadhaarFields(text);
        aadhaarParsed = { fields: result.fields, confidence: result.confidence };
      } else {
        progress.push("Could not read Aadhaar clearly.");
      }
    }

    // Process PAN
    if (panFile) {
      progress.push("Reading PAN card...");
      const buffer = Buffer.from(await panFile.arrayBuffer());
      const mimeType = panFile.type || "image/jpeg";

      const { text, method } = await extractDocumentText(buffer, mimeType);
      if (!ocrMethod || ocrMethod === "none") ocrMethod = method;

      if (text && text.length > 10) {
        progress.push("Parsing PAN details...");
        const result = parsePanFields(text);
        panParsed = { fields: result.fields, confidence: result.confidence };
      } else {
        progress.push("Could not read PAN clearly.");
      }
    }

    // Map to passport schema fields
    progress.push("Mapping details to Passport form...");
    const { fields, sources, confidence } = mapPassportFields(
      aadhaarParsed.fields,
      panParsed.fields
    );

    // Identify missing required fields
    progress.push("Identifying missing information...");
    const requiredFields = [
      "surname", "givenName", "dateOfBirth", "gender", "placeOfBirth",
      "maritalStatus", "employmentType", "educationalQualification",
      "houseStreet", "pinCode", "mobileNumber", "emailId",
      "fatherGivenName", "fatherSurname", "motherGivenName", "motherSurname",
      "emergencyName", "emergencyMobile",
      "applyingFor", "typeOfApplication", "bookletType",
    ];
    const missingFields = requiredFields.filter(f => !fields[f]);

    progress.push("Preparing application draft...");

    const success = Object.keys(fields).length > 0;

    return Response.json({
      success,
      extractedFields: fields,
      sources,
      confidence,
      missingFields,
      ocrMethod,
      progress,
      error: success ? null : "Could not extract details from the uploaded documents. Please upload clearer images or enter details manually.",
    });

  } catch (err) {
    console.error("[OCR API Error]:", err.message);
    return Response.json({
      success: false,
      error: "Processing failed. Please try again or enter details manually.",
      extractedFields: {},
      sources: {},
      confidence: {},
      missingFields: [],
      ocrMethod: "error",
      progress: [],
    });
  }
}
