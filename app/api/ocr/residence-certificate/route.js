/**
 * OCR API for Residence Certificate Draft Generator
 * Extracts details from Aadhaar, Ration Card, Utility Bill / Address Proof.
 * Source: meeseva.telangana.gov.in
 * Never returns hardcoded data — each upload produces fresh extraction.
 */

import { extractStructuredFields } from "../../../../lib/ocr/extractDocumentText";
import { parseAadhaarStructured, parseAadhaarFields } from "../../../../lib/ocr/parseAadhaarFields";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const aadhaarFile = formData.get("aadhaar");
    const residenceProofFile = formData.get("residenceProof");
    const rationCardFile = formData.get("rationCard");

    if (!aadhaarFile && !residenceProofFile && !rationCardFile) {
      return Response.json({ success: false, error: "No documents uploaded.", extractedFields: {}, sources: {}, confidence: {}, progress: [] });
    }

    const fields = {};
    const sources = {};
    const confidence = {};
    let ocrMethod = "none";
    const progress = [];

    // Process Aadhaar — primary source
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
      if (af.address) { fields.address = af.address; sources.address = "Aadhaar"; confidence.address = 0.82; }
      if (af.houseNumber) { fields.houseNumber = af.houseNumber; sources.houseNumber = "Aadhaar"; confidence.houseNumber = 0.8; }
      if (af.street) { fields.street = af.street; sources.street = "Aadhaar"; confidence.street = 0.78; }
      if (af.locality) { fields.locality = af.locality; sources.locality = "Aadhaar"; confidence.locality = 0.78; }
      if (af.city) { fields.city = af.city; sources.city = "Aadhaar"; confidence.city = 0.82; }
      if (af.district) { fields.district = af.district; sources.district = "Aadhaar"; confidence.district = 0.84; }
      if (af.state) { fields.state = af.state; sources.state = "Aadhaar"; confidence.state = 0.86; }
      if (af.pinCode) { fields.pinCode = af.pinCode; sources.pinCode = "Aadhaar"; confidence.pinCode = 0.9; }
      if (af.fatherName) { fields.fatherName = af.fatherName; sources.fatherName = "Aadhaar"; confidence.fatherName = 0.75; }
      progress.push("Aadhaar details extracted.");
    }

    // Process Residence Proof (utility bill / electricity bill / rent agreement)
    if (residenceProofFile) {
      progress.push("Reading residence proof...");
      const buffer = Buffer.from(await residenceProofFile.arrayBuffer());
      const mimeType = residenceProofFile.type || "image/jpeg";
      const result = await extractStructuredFields(buffer, mimeType, "generic");
      if (!ocrMethod || ocrMethod === "none") ocrMethod = result.method;
      const raw = result.raw || "";
      if (raw.length > 10) {
        // Consumer/account number from utility bill
        const acctMatch = raw.match(/(?:Consumer\s*No|Account\s*No|Bill\s*No)\s*[:\-]?\s*([A-Z0-9\-\/]{5,20})/i);
        if (acctMatch) { fields.utilityAccountNumber = acctMatch[1]; sources.utilityAccountNumber = "Residence Proof"; confidence.utilityAccountNumber = 0.7; }
        // Address confirmation
        if (!fields.address) {
          const addrMatch = raw.match(/(?:Address|Service Address|Installation Address)\s*[:\-]?\s*([A-Za-z0-9\s,\-\/]{10,120})/i);
          if (addrMatch) { fields.address = addrMatch[1].trim(); sources.address = "Residence Proof"; confidence.address = 0.65; }
        }
        // Date on bill (to verify it's within 1 year)
        const dateMatch = raw.match(/\b(\d{2}[\/\-]\d{2}[\/\-]\d{4})\b/);
        if (dateMatch) { fields.documentDate = dateMatch[1].replace(/-/g, "/"); sources.documentDate = "Residence Proof"; confidence.documentDate = 0.7; }
        progress.push("Residence proof details extracted.");
      } else { progress.push("Could not read residence proof clearly."); }
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
        progress.push("Ration card details extracted.");
      } else { progress.push("Could not read ration card clearly."); }
    }

    progress.push(`Extraction complete. ${Object.keys(fields).length} fields populated.`);
    const success = Object.keys(fields).length > 0;
    return Response.json({
      success, extractedFields: fields, sources, confidence, ocrMethod, progress,
      error: success ? null : "Could not extract details. Please enter manually.",
    });
  } catch (err) {
    console.error("[Residence Cert OCR]:", err.message);
    return Response.json({ success: false, error: "Processing failed. Please enter details manually.", extractedFields: {}, sources: {}, confidence: {}, ocrMethod: "error", progress: [] });
  }
}
