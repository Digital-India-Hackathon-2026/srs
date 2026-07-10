/**
 * OCR API for Passport Draft Generator
 * ─────────────────────────────────────────────────────────────────────────────
 * Production-quality document extraction pipeline.
 *
 * Priority: Gemini Vision → OpenAI Vision → Tesseract.js → clear error message
 *
 * Pipeline:
 *   1. Receive uploaded files (Aadhaar, PAN, photo)
 *   2. For each document, extract structured fields using Vision AI
 *   3. If Vision AI unavailable, fall back to Tesseract + regex parsing
 *   4. Map extracted fields to Passport form schema
 *   5. Return extracted fields, sources, confidence, and missing fields list
 *
 * Rules:
 *   - Never use demo/hardcoded data
 *   - Never reuse previous user's data
 *   - Each upload produces fresh extraction
 *   - Only return what is actually visible in the document
 *   - Display Aadhaar as XXXX XXXX 1234 (masked)
 *   - Photo is only for preview, never OCR'd for identity fields
 */

import { extractStructuredFields } from "../../../../lib/ocr/extractDocumentText";
import { parseAadhaarStructured, parseAadhaarFields } from "../../../../lib/ocr/parseAadhaarFields";
import { parsePanFields } from "../../../../lib/ocr/parsePanFields";
import { mapPassportFields } from "../../../../lib/ocr/mapPassportFields";

const isDev = process.env.NODE_ENV === "development";

export async function POST(req) {
  const errors = [];
  const progress = [];

  try {
    const formData = await req.formData();
    const aadhaarFile = formData.get("aadhaar");
    const panFile = formData.get("pan");
    // Photo is NOT processed for field extraction — only for preview

    if (!aadhaarFile && !panFile) {
      return Response.json({
        success: false,
        error: "No documents uploaded. Please upload at least your Aadhaar card.",
        extractedFields: {},
        sources: {},
        confidence: {},
        missingFields: [],
        ocrMethod: "none",
        progress: [],
        debugErrors: isDev ? ["No files received in FormData"] : undefined,
      });
    }

    let aadhaarParsed = { fields: {}, confidence: {} };
    let panParsed = { fields: {}, confidence: {} };
    let ocrMethod = "none";

    // ─── Process Aadhaar Card ────────────────────────────────────────────────
    if (aadhaarFile) {
      progress.push("Reading Aadhaar card...");
      try {
        const buffer = Buffer.from(await aadhaarFile.arrayBuffer());
        const mimeType = aadhaarFile.type || "image/jpeg";

        // Use structured extraction (Vision AI returns JSON directly)
        const result = await extractStructuredFields(buffer, mimeType, "aadhaar");
        ocrMethod = result.method;

        if (result.fields) {
          // Vision AI returned structured JSON — validate and use
          progress.push("Aadhaar details extracted successfully (AI Vision).");
          const parsed = parseAadhaarStructured(result.fields);
          aadhaarParsed = { fields: parsed.fields, confidence: parsed.confidence };
        } else if (result.raw && result.raw.length > 10) {
          // Fell back to raw text (Tesseract) — use regex parsing
          progress.push("Parsing Aadhaar from OCR text...");
          const parsed = parseAadhaarFields(result.raw);
          aadhaarParsed = { fields: parsed.fields, confidence: parsed.confidence };
          if (!parsed.success) {
            errors.push("Aadhaar text detected but could not parse fields clearly.");
          }
        } else {
          // Total failure
          const reason = result.error || "No readable content extracted";
          errors.push(`Aadhaar extraction failed: ${reason}`);
          progress.push("Could not read Aadhaar clearly.");
        }
      } catch (e) {
        errors.push(`Aadhaar processing error: ${e.message}`);
        progress.push("Error processing Aadhaar card.");
      }
    }

    // ─── Process PAN Card ────────────────────────────────────────────────────
    if (panFile) {
      progress.push("Reading PAN card...");
      try {
        const buffer = Buffer.from(await panFile.arrayBuffer());
        const mimeType = panFile.type || "image/jpeg";

        const result = await extractStructuredFields(buffer, mimeType, "pan");
        if (!ocrMethod || ocrMethod === "none") ocrMethod = result.method;

        if (result.fields) {
          // Vision AI returned structured JSON for PAN
          progress.push("PAN details extracted successfully.");
          const validFields = {};
          const validConf = {};

          if (result.fields.panNumber && /^[A-Z]{5}\d{4}[A-Z]$/.test(result.fields.panNumber.trim())) {
            validFields.panNumber = result.fields.panNumber.trim();
            validConf.panNumber = 0.95;
          }
          if (result.fields.fullName && result.fields.fullName.trim().length >= 2) {
            validFields.fullName = result.fields.fullName.trim();
            validConf.fullName = 0.85;
          }
          if (result.fields.fatherName && result.fields.fatherName.trim().length >= 2) {
            validFields.fatherName = result.fields.fatherName.trim();
            validConf.fatherName = 0.78;
          }
          if (result.fields.dateOfBirth && /^\d{2}[\/\-]\d{2}[\/\-]\d{4}$/.test(result.fields.dateOfBirth.trim())) {
            validFields.dateOfBirth = result.fields.dateOfBirth.trim().replace(/-/g, "/");
            validConf.dateOfBirth = 0.88;
          }

          panParsed = { fields: validFields, confidence: validConf };
        } else if (result.raw && result.raw.length > 10) {
          // Regex fallback for PAN
          progress.push("Parsing PAN from OCR text...");
          const parsed = parsePanFields(result.raw);
          panParsed = { fields: parsed.fields, confidence: parsed.confidence };
        } else {
          errors.push("PAN extraction failed: No readable content");
          progress.push("Could not read PAN clearly.");
        }
      } catch (e) {
        errors.push(`PAN processing error: ${e.message}`);
        progress.push("Error processing PAN card.");
      }
    }

    // ─── Map to Passport Form Fields ─────────────────────────────────────────
    progress.push("Mapping extracted details to Passport form...");
    const { fields, sources, confidence } = mapPassportFields(
      aadhaarParsed.fields,
      panParsed.fields
    );

    // ─── Identify Missing Required Fields ────────────────────────────────────
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

    progress.push(`Extraction complete. ${Object.keys(fields).length} fields populated.`);

    const success = Object.keys(fields).length > 0;

    // Build user-facing error message if extraction partially/fully failed
    let userError = null;
    if (!success) {
      userError = "We couldn't clearly read your uploaded document. Please upload a clearer image or enter the remaining details manually.";
    } else if (errors.length > 0 && Object.keys(fields).length < 4) {
      userError = "Some fields could not be extracted clearly. Please verify the extracted data and fill in the remaining fields manually.";
    }

    return Response.json({
      success,
      extractedFields: fields,
      sources,
      confidence,
      missingFields,
      ocrMethod,
      progress,
      error: userError,
      // Dev-only: expose actual error reasons for debugging
      debugErrors: isDev ? errors : undefined,
    });

  } catch (err) {
    console.error("[OCR API Critical Error]:", err.message, err.stack);
    return Response.json({
      success: false,
      error: "We couldn't clearly read your uploaded document. Please upload a clearer image or enter the remaining details manually.",
      extractedFields: {},
      sources: {},
      confidence: {},
      missingFields: [],
      ocrMethod: "error",
      progress: ["Processing failed unexpectedly."],
      debugErrors: isDev ? [`Critical: ${err.message}`] : undefined,
    });
  }
}
