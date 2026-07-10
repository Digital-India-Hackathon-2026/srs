/**
 * OCR API for Driving Licence Draft Generator
 * Accepts uploaded document images (Aadhaar, PAN, existing DL, medical cert),
 * runs OCR (Gemini → OpenAI → Tesseract → fail),
 * extracts and parses fields based on document type.
 * Never returns hardcoded data — each upload produces fresh extraction.
 */

import { extractStructuredFields } from "../../../../lib/ocr/extractDocumentText";
import { parseAadhaarStructured, parseAadhaarFields } from "../../../../lib/ocr/parseAadhaarFields";
import { parsePanFields } from "../../../../lib/ocr/parsePanFields";
import { parseDrivingLicenceFields } from "../../../../lib/ocr/parseDrivingLicenceFields";
import { mapDrivingLicenceFields } from "../../../../lib/ocr/mapDrivingLicenceFields";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const aadhaarFile = formData.get("aadhaar");
    const panFile = formData.get("pan");
    const existingDLFile = formData.get("existingDL");
    const birthCertFile = formData.get("birthCert");
    const medicalCertFile = formData.get("medicalCert");

    if (!aadhaarFile && !panFile && !existingDLFile && !birthCertFile && !medicalCertFile) {
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
    let dlParsed = { fields: {}, confidence: {} };
    let ocrMethod = "none";
    const progress = [];

    // Process Aadhaar
    if (aadhaarFile) {
      progress.push("Reading Aadhaar card...");
      const buffer = Buffer.from(await aadhaarFile.arrayBuffer());
      const mimeType = aadhaarFile.type || "image/jpeg";

      const result = await extractStructuredFields(buffer, mimeType, "aadhaar");
      ocrMethod = result.method;

      if (result.fields) {
        progress.push("Aadhaar details extracted (AI Vision).");
        const parsed = parseAadhaarStructured(result.fields);
        aadhaarParsed = { fields: parsed.fields, confidence: parsed.confidence };
      } else if (result.raw && result.raw.length > 10) {
        progress.push("Parsing Aadhaar from OCR text...");
        const parsed = parseAadhaarFields(result.raw);
        aadhaarParsed = { fields: parsed.fields, confidence: parsed.confidence };
      } else {
        progress.push("Could not read Aadhaar clearly.");
      }
    }

    // Process PAN
    if (panFile) {
      progress.push("Reading PAN card...");
      const buffer = Buffer.from(await panFile.arrayBuffer());
      const mimeType = panFile.type || "image/jpeg";

      const result = await extractStructuredFields(buffer, mimeType, "pan");
      if (!ocrMethod || ocrMethod === "none") ocrMethod = result.method;

      if (result.fields) {
        progress.push("PAN details extracted.");
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
        progress.push("Parsing PAN from OCR text...");
        const parsed = parsePanFields(result.raw);
        panParsed = { fields: parsed.fields, confidence: parsed.confidence };
      } else {
        progress.push("Could not read PAN clearly.");
      }
    }

    // Process Existing Driving Licence
    if (existingDLFile) {
      progress.push("Reading existing Driving Licence...");
      const buffer = Buffer.from(await existingDLFile.arrayBuffer());
      const mimeType = existingDLFile.type || "image/jpeg";

      const result = await extractStructuredFields(buffer, mimeType, "generic");
      if (!ocrMethod || ocrMethod === "none") ocrMethod = result.method;

      const rawText = result.raw || "";
      if (rawText.length > 10) {
        progress.push("Parsing Driving Licence details...");
        const parsed = parseDrivingLicenceFields(rawText);
        dlParsed = { fields: parsed.fields, confidence: parsed.confidence };
      } else {
        progress.push("Could not read existing licence clearly.");
      }
    }

    // Process Birth Certificate (for DOB extraction)
    if (birthCertFile) {
      progress.push("Reading Birth Certificate / SSC Memo...");
      const buffer = Buffer.from(await birthCertFile.arrayBuffer());
      const mimeType = birthCertFile.type || "image/jpeg";

      const result = await extractStructuredFields(buffer, mimeType, "generic");
      if (!ocrMethod || ocrMethod === "none") ocrMethod = result.method;

      const rawText = result.raw || "";
      if (rawText.length > 10) {
        const dobMatch = rawText.match(/\b(\d{2}[\/\-]\d{2}[\/\-]\d{4})\b/);
        if (dobMatch && !aadhaarParsed.fields.dateOfBirth) {
          aadhaarParsed.fields.dateOfBirth = dobMatch[1].replace(/-/g, "/");
          aadhaarParsed.confidence.dateOfBirth = 0.85;
          progress.push("DOB extracted from certificate.");
        }
        const nameMatch = rawText.match(/(?:Name|Child'?s?\s*Name)\s*[:\-]?\s*([A-Za-z\s]{3,50})/i);
        if (nameMatch && !aadhaarParsed.fields.fullName) {
          aadhaarParsed.fields.fullName = nameMatch[1].trim();
          aadhaarParsed.confidence.fullName = 0.7;
          progress.push("Name extracted from certificate.");
        }
        const fatherMatch = rawText.match(/(?:Father|S\/O|D\/O)\s*[:\-]?\s*([A-Za-z\s]{3,50})/i);
        if (fatherMatch && !aadhaarParsed.fields.fatherName) {
          aadhaarParsed.fields.fatherName = fatherMatch[1].trim();
          aadhaarParsed.confidence.fatherName = 0.7;
        }
      } else {
        progress.push("Could not read certificate clearly.");
      }
    }

    // Process Medical Certificate (Form 1A)
    if (medicalCertFile) {
      progress.push("Reading Medical Certificate (Form 1A)...");
      const buffer = Buffer.from(await medicalCertFile.arrayBuffer());
      const mimeType = medicalCertFile.type || "image/jpeg";

      const result = await extractStructuredFields(buffer, mimeType, "generic");
      if (!ocrMethod || ocrMethod === "none") ocrMethod = result.method;

      const rawText = result.raw || "";
      if (rawText.length > 10) {
        progress.push("Medical certificate processed.");
        const bgMatch = rawText.match(/(?:Blood\s*(?:Group|Gr|Gp)|BG)\s*[:\-]?\s*((?:A|B|AB|O)[+-])/i);
        if (bgMatch) {
          dlParsed.fields.bloodGroup = bgMatch[1].toUpperCase();
          dlParsed.confidence.bloodGroup = 0.85;
        }
      } else {
        progress.push("Could not read medical certificate clearly.");
      }
    }

    // Map to Driving Licence schema fields
    progress.push("Mapping details to Driving Licence form...");
    const { fields, sources, confidence } = mapDrivingLicenceFields(
      aadhaarParsed.fields,
      panParsed.fields,
      dlParsed.fields
    );

    // Identify missing required fields
    progress.push("Identifying missing information...");
    const requiredFields = [
      "fullName", "fatherHusbandName", "dateOfBirth", "gender",
      "bloodGroup", "qualification", "mobileNumber", "aadhaarNumber",
      "commHouseStreet", "commPinCode", "commDistrict", "commState",
      "applicationType", "rtoOffice", "emergencyContactName", "emergencyContactMobile",
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
    console.error("[DL OCR API Error]:", err.message);
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
