/**
 * OCR API for Income Certificate Draft Generator
 * Extracts details from Aadhaar, Ration Card, Salary Slip / Income Proof.
 * Source: meeseva.telangana.gov.in
 * Never returns hardcoded data — each upload produces fresh extraction.
 */

import { extractStructuredFields } from "../../../../lib/ocr/extractDocumentText";
import { parseAadhaarStructured, parseAadhaarFields } from "../../../../lib/ocr/parseAadhaarFields";
import { parsePanFields } from "../../../../lib/ocr/parsePanFields";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const aadhaarFile = formData.get("aadhaar");
    const incomeProofFile = formData.get("incomeProof");
    const rationCardFile = formData.get("rationCard");
    const panFile = formData.get("pan");

    if (!aadhaarFile && !incomeProofFile && !rationCardFile) {
      return Response.json({ success: false, error: "No documents uploaded.", extractedFields: {}, sources: {}, confidence: {}, progress: [] });
    }

    const fields = {};
    const sources = {};
    const confidence = {};
    let ocrMethod = "none";
    const progress = [];

    // Process Aadhaar
    if (aadhaarFile) {
      progress.push("Reading Aadhaar card...");
      const buffer = Buffer.from(await aadhaarFile.arrayBuffer());
      const mimeType = aadhaarFile.type || "image/jpeg";
      const result = await extractStructuredFields(buffer, mimeType, "aadhaar");
      ocrMethod = result.method;
      let parsed = { fields: {} };
      if (result.fields) { parsed = parseAadhaarStructured(result.fields); }
      else if (result.raw && result.raw.length > 10) { parsed = parseAadhaarFields(result.raw); }
      const af = parsed.fields;
      if (af.fullName) { fields.applicantName = af.fullName; sources.applicantName = "Aadhaar"; confidence.applicantName = 0.88; }
      if (af.dateOfBirth) { fields.dateOfBirth = af.dateOfBirth; sources.dateOfBirth = "Aadhaar"; confidence.dateOfBirth = 0.9; }
      if (af.gender) { fields.gender = af.gender; sources.gender = "Aadhaar"; confidence.gender = 0.92; }
      if (af.aadhaarNumber) { fields.aadhaarNumber = af.aadhaarNumber; sources.aadhaarNumber = "Aadhaar"; confidence.aadhaarNumber = 0.95; }
      if (af.address) { fields.address = af.address; sources.address = "Aadhaar"; confidence.address = 0.8; }
      if (af.city) { fields.city = af.city; sources.city = "Aadhaar"; confidence.city = 0.82; }
      if (af.district) { fields.district = af.district; sources.district = "Aadhaar"; confidence.district = 0.82; }
      if (af.state) { fields.state = af.state; sources.state = "Aadhaar"; confidence.state = 0.85; }
      if (af.pinCode) { fields.pinCode = af.pinCode; sources.pinCode = "Aadhaar"; confidence.pinCode = 0.88; }
      if (af.fatherName) { fields.fatherName = af.fatherName; sources.fatherName = "Aadhaar"; confidence.fatherName = 0.75; }
      progress.push("Aadhaar details extracted.");
    }

    // Process Income Proof (salary slip / Form 16 / self-declaration)
    if (incomeProofFile) {
      progress.push("Reading income proof...");
      const buffer = Buffer.from(await incomeProofFile.arrayBuffer());
      const mimeType = incomeProofFile.type || "image/jpeg";
      const result = await extractStructuredFields(buffer, mimeType, "generic");
      if (!ocrMethod || ocrMethod === "none") ocrMethod = result.method;
      const raw = result.raw || "";
      if (raw.length > 10) {
        // Income amount
        const incomeMatch = raw.match(/(?:Annual\s*Income|Total\s*Income|Gross\s*Salary|Income)\s*[:\-₹Rs.]?\s*([\d,]+)/i);
        if (incomeMatch) { fields.annualIncome = incomeMatch[1].replace(/,/g, ""); sources.annualIncome = "Income Proof"; confidence.annualIncome = 0.75; }
        // Employer
        const empMatch = raw.match(/(?:Employer|Company|Organisation|Firm)\s*[:\-]?\s*([A-Za-z\s&.,]{3,60})/i);
        if (empMatch) { fields.employerName = empMatch[1].trim(); sources.employerName = "Income Proof"; confidence.employerName = 0.7; }
        // Financial year
        const fyMatch = raw.match(/(?:Financial\s*Year|FY|Year)\s*[:\-]?\s*(20\d{2}[–\-\/]?\d{2,4})/i);
        if (fyMatch) { fields.financialYear = fyMatch[1]; sources.financialYear = "Income Proof"; confidence.financialYear = 0.72; }
        // Name from document if not yet extracted
        if (!fields.applicantName) {
          const nameMatch = raw.match(/(?:Name|Employee Name)\s*[:\-]?\s*([A-Za-z\s]{3,50})/i);
          if (nameMatch) { fields.applicantName = nameMatch[1].trim(); sources.applicantName = "Income Proof"; confidence.applicantName = 0.65; }
        }
        progress.push("Income details extracted.");
      } else { progress.push("Could not read income proof clearly."); }
    }

    // Process Ration Card
    if (rationCardFile) {
      progress.push("Reading ration card...");
      const buffer = Buffer.from(await rationCardFile.arrayBuffer());
      const mimeType = rationCardFile.type || "image/jpeg";
      const result = await extractStructuredFields(buffer, mimeType, "generic");
      if (!ocrMethod || ocrMethod === "none") ocrMethod = result.method;
      const raw = result.raw || "";
      if (raw.length > 10) {
        const rcMatch = raw.match(/(?:Card\s*(?:No|Number)|Ration\s*Card)\s*[:\-]?\s*([A-Z0-9\/\-]{5,20})/i);
        if (rcMatch) { fields.rationCardNumber = rcMatch[1]; sources.rationCardNumber = "Ration Card"; confidence.rationCardNumber = 0.78; }
        if (!fields.applicantName) {
          const nameMatch = raw.match(/(?:Name|Head of Family)\s*[:\-]?\s*([A-Za-z\s]{3,50})/i);
          if (nameMatch) { fields.applicantName = nameMatch[1].trim(); sources.applicantName = "Ration Card"; confidence.applicantName = 0.65; }
        }
        const membersMatch = raw.match(/(?:Members|Family Members|No\. of Members)\s*[:\-]?\s*(\d{1,2})/i);
        if (membersMatch) { fields.familyMembers = membersMatch[1]; sources.familyMembers = "Ration Card"; confidence.familyMembers = 0.7; }
        progress.push("Ration card details extracted.");
      } else { progress.push("Could not read ration card clearly."); }
    }

    // Process PAN
    if (panFile) {
      progress.push("Reading PAN card...");
      const buffer = Buffer.from(await panFile.arrayBuffer());
      const mimeType = panFile.type || "image/jpeg";
      const result = await extractStructuredFields(buffer, mimeType, "pan");
      if (!ocrMethod || ocrMethod === "none") ocrMethod = result.method;
      if (result.fields?.panNumber) { fields.panNumber = result.fields.panNumber; sources.panNumber = "PAN"; confidence.panNumber = 0.95; }
      else if (result.raw) {
        const parsed = parsePanFields(result.raw);
        if (parsed.fields.panNumber) { fields.panNumber = parsed.fields.panNumber; sources.panNumber = "PAN"; confidence.panNumber = 0.9; }
      }
      progress.push("PAN details extracted.");
    }

    progress.push(`Extraction complete. ${Object.keys(fields).length} fields populated.`);
    const success = Object.keys(fields).length > 0;
    return Response.json({
      success, extractedFields: fields, sources, confidence, ocrMethod, progress,
      error: success ? null : "Could not extract details. Please enter manually.",
    });
  } catch (err) {
    console.error("[Income Cert OCR]:", err.message);
    return Response.json({ success: false, error: "Processing failed. Please enter details manually.", extractedFields: {}, sources: {}, confidence: {}, ocrMethod: "error", progress: [] });
  }
}
