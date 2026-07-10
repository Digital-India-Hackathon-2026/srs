/**
 * OCR API for Birth Certificate Draft Generator
 * Extracts details from Hospital Birth Record, Parents' Aadhaar, Marriage Certificate.
 * Never returns hardcoded data — each upload produces fresh extraction.
 */

import { extractStructuredFields } from "../../../../lib/ocr/extractDocumentText";
import { parseAadhaarStructured, parseAadhaarFields } from "../../../../lib/ocr/parseAadhaarFields";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const hospitalRecordFile = formData.get("hospitalRecord");
    const parentAadhaarFile = formData.get("parentAadhaar");
    const fatherAadhaarFile = formData.get("fatherAadhaar");
    const marriageCertFile = formData.get("marriageCert");

    if (!hospitalRecordFile && !parentAadhaarFile && !fatherAadhaarFile) {
      return Response.json({ success: false, error: "No documents uploaded.", extractedFields: {}, sources: {}, confidence: {}, progress: [] });
    }

    const fields = {};
    const sources = {};
    const confidence = {};
    let ocrMethod = "none";
    const progress = [];

    // Process Hospital Birth Record
    if (hospitalRecordFile) {
      progress.push("Reading hospital birth record...");
      const buffer = Buffer.from(await hospitalRecordFile.arrayBuffer());
      const mimeType = hospitalRecordFile.type || "image/jpeg";
      const result = await extractStructuredFields(buffer, mimeType, "generic");
      ocrMethod = result.method;
      const raw = result.raw || "";
      if (raw.length > 10) {
        progress.push("Extracting birth details...");
        // Extract child name
        const nameMatch = raw.match(/(?:Child|Baby|Name of Child|Name)\s*[:\-]?\s*([A-Za-z\s]{2,50})/i);
        if (nameMatch) { fields.childName = nameMatch[1].trim(); sources.childName = "Birth Record"; confidence.childName = 0.75; }
        // DOB
        const dobMatch = raw.match(/\b(\d{2}[\/\-]\d{2}[\/\-]\d{4})\b/);
        if (dobMatch) { fields.dateOfBirth = dobMatch[1].replace(/-/g, "/"); sources.dateOfBirth = "Birth Record"; confidence.dateOfBirth = 0.85; }
        // Time of birth
        const timeMatch = raw.match(/(?:Time|Time of Birth)\s*[:\-]?\s*(\d{1,2}[:\.]?\d{2}\s*(?:AM|PM|am|pm)?)/i);
        if (timeMatch) { fields.timeOfBirth = timeMatch[1].trim(); sources.timeOfBirth = "Birth Record"; confidence.timeOfBirth = 0.7; }
        // Gender
        const genderMatch = raw.match(/\b(Male|Female|Boy|Girl)\b/i);
        if (genderMatch) { const g = genderMatch[1]; fields.gender = (g.toLowerCase() === "boy" ? "Male" : g.toLowerCase() === "girl" ? "Female" : g.charAt(0).toUpperCase() + g.slice(1).toLowerCase()); sources.gender = "Birth Record"; confidence.gender = 0.8; }
        // Hospital
        const hospMatch = raw.match(/(?:Hospital|Place of Birth|Institution)\s*[:\-]?\s*([A-Za-z\s\.\,]{3,60})/i);
        if (hospMatch) { fields.placeOfBirth = hospMatch[1].trim(); sources.placeOfBirth = "Birth Record"; confidence.placeOfBirth = 0.7; }
        // Mother name
        const motherMatch = raw.match(/(?:Mother|Mother'?s?\s*Name)\s*[:\-]?\s*([A-Za-z\s]{3,50})/i);
        if (motherMatch) { fields.motherName = motherMatch[1].trim(); sources.motherName = "Birth Record"; confidence.motherName = 0.75; }
        // Father name
        const fatherMatch = raw.match(/(?:Father|Father'?s?\s*Name)\s*[:\-]?\s*([A-Za-z\s]{3,50})/i);
        if (fatherMatch) { fields.fatherName = fatherMatch[1].trim(); sources.fatherName = "Birth Record"; confidence.fatherName = 0.75; }
      } else { progress.push("Could not read birth record clearly."); }
    }

    // Process Mother's Aadhaar
    if (parentAadhaarFile) {
      progress.push("Reading mother's Aadhaar...");
      const buffer = Buffer.from(await parentAadhaarFile.arrayBuffer());
      const mimeType = parentAadhaarFile.type || "image/jpeg";
      const result = await extractStructuredFields(buffer, mimeType, "aadhaar");
      if (!ocrMethod || ocrMethod === "none") ocrMethod = result.method;
      let parsed = { fields: {} };
      if (result.fields) { parsed = parseAadhaarStructured(result.fields); }
      else if (result.raw && result.raw.length > 10) { parsed = parseAadhaarFields(result.raw); }
      if (parsed.fields.fullName && !fields.motherName) { fields.motherName = parsed.fields.fullName; sources.motherName = "Mother Aadhaar"; confidence.motherName = 0.85; }
      if (parsed.fields.address) { fields.permanentAddress = parsed.fields.address; sources.permanentAddress = "Mother Aadhaar"; confidence.permanentAddress = 0.8; }
      if (parsed.fields.pinCode) { fields.pinCode = parsed.fields.pinCode; sources.pinCode = "Mother Aadhaar"; confidence.pinCode = 0.88; }
      if (parsed.fields.district) { fields.district = parsed.fields.district; sources.district = "Mother Aadhaar"; confidence.district = 0.82; }
      if (parsed.fields.state) { fields.state = parsed.fields.state; sources.state = "Mother Aadhaar"; confidence.state = 0.85; }
      if (parsed.fields.city) { fields.city = parsed.fields.city; sources.city = "Mother Aadhaar"; confidence.city = 0.8; }
      progress.push("Mother's details extracted.");
    }

    // Process Father's Aadhaar
    if (fatherAadhaarFile) {
      progress.push("Reading father's Aadhaar...");
      const buffer = Buffer.from(await fatherAadhaarFile.arrayBuffer());
      const mimeType = fatherAadhaarFile.type || "image/jpeg";
      const result = await extractStructuredFields(buffer, mimeType, "aadhaar");
      if (!ocrMethod || ocrMethod === "none") ocrMethod = result.method;
      let parsed = { fields: {} };
      if (result.fields) { parsed = parseAadhaarStructured(result.fields); }
      else if (result.raw && result.raw.length > 10) { parsed = parseAadhaarFields(result.raw); }
      if (parsed.fields.fullName && !fields.fatherName) { fields.fatherName = parsed.fields.fullName; sources.fatherName = "Father Aadhaar"; confidence.fatherName = 0.85; }
      if (parsed.fields.address && !fields.permanentAddress) { fields.permanentAddress = parsed.fields.address; sources.permanentAddress = "Father Aadhaar"; confidence.permanentAddress = 0.75; }
      progress.push("Father's details extracted.");
    }

    // Process Marriage Certificate
    if (marriageCertFile) {
      progress.push("Reading marriage certificate...");
      const buffer = Buffer.from(await marriageCertFile.arrayBuffer());
      const mimeType = marriageCertFile.type || "image/jpeg";
      const result = await extractStructuredFields(buffer, mimeType, "generic");
      if (!ocrMethod || ocrMethod === "none") ocrMethod = result.method;
      const raw = result.raw || "";
      if (raw.length > 10) {
        const dateMatch = raw.match(/\b(\d{2}[\/\-]\d{2}[\/\-]\d{4})\b/);
        if (dateMatch) { fields.marriageDate = dateMatch[1].replace(/-/g, "/"); sources.marriageDate = "Marriage Cert"; confidence.marriageDate = 0.7; }
      }
      progress.push("Marriage certificate processed.");
    }

    progress.push(`Extraction complete. ${Object.keys(fields).length} fields populated.`);
    const success = Object.keys(fields).length > 0;

    return Response.json({
      success, extractedFields: fields, sources, confidence, ocrMethod, progress,
      error: success ? null : "Could not extract details. Please upload clearer images or enter manually.",
    });
  } catch (err) {
    console.error("[Birth Cert OCR Error]:", err.message);
    return Response.json({ success: false, error: "Processing failed. Please try again or enter details manually.", extractedFields: {}, sources: {}, confidence: {}, ocrMethod: "error", progress: [] });
  }
}
