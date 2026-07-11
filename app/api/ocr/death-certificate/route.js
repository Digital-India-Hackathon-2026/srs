import { extractStructuredFields } from "../../../../lib/ocr/extractDocumentText";
import { parseAadhaarStructured, parseAadhaarFields } from "../../../../lib/ocr/parseAadhaarFields";

export async function POST(req) {
  const progress = [];

  try {
    const formData = await req.formData();
    const hospitalRecordFile = formData.get("hospitalRecord");
    const applicantAadhaarFile = formData.get("applicantAadhaar");
    const deceasedIdFile = formData.get("deceasedId");

    if (!hospitalRecordFile && !applicantAadhaarFile && !deceasedIdFile) {
      return Response.json({ success: false, error: "No documents uploaded.", extractedFields: {}, sources: {}, confidence: {}, progress: [] });
    }

    const fields = {};
    const sources = {};
    const confidence = {};
    let ocrMethod = "none";

    if (hospitalRecordFile) {
      try {
        progress.push("Reading hospital death record...");
        const buffer = Buffer.from(await hospitalRecordFile.arrayBuffer());
        const mimeType = hospitalRecordFile.type || "image/jpeg";
        const result = await extractStructuredFields(buffer, mimeType, "generic");
        ocrMethod = result.method;
        const raw = result.raw || "";
        if (raw.length > 10) {
          progress.push("Extracting death details...");
          const nameMatch = raw.match(/(?:Name of (?:the )?Deceased|Patient|Name)\s*[:\-]?\s*([A-Za-z\s]{2,50})/i);
          if (nameMatch) { fields.deceasedName = nameMatch[1].trim(); sources.deceasedName = "Death Record"; confidence.deceasedName = 0.78; }
          const dodMatch = raw.match(/(?:Date of Death|DOD|Died on)\s*[:\-]?\s*(\d{2}[\/\-]\d{2}[\/\-]\d{4})/i);
          if (dodMatch) { fields.dateOfDeath = dodMatch[1].replace(/-/g, "/"); sources.dateOfDeath = "Death Record"; confidence.dateOfDeath = 0.85; }
          else { const anyDate = raw.match(/\b(\d{2}[\/\-]\d{2}[\/\-]\d{4})\b/); if (anyDate) { fields.dateOfDeath = anyDate[1].replace(/-/g, "/"); sources.dateOfDeath = "Death Record"; confidence.dateOfDeath = 0.6; } }
          const timeMatch = raw.match(/(?:Time of Death|Time)\s*[:\-]?\s*(\d{1,2}[:\.]?\d{2}\s*(?:AM|PM|am|pm|hrs)?)/i);
          if (timeMatch) { fields.timeOfDeath = timeMatch[1].trim(); sources.timeOfDeath = "Death Record"; confidence.timeOfDeath = 0.7; }
          const hospMatch = raw.match(/(?:Hospital|Place of Death|Institution)\s*[:\-]?\s*([A-Za-z\s\.\,]{3,60})/i);
          if (hospMatch) { fields.placeOfDeath = hospMatch[1].trim(); sources.placeOfDeath = "Death Record"; confidence.placeOfDeath = 0.72; }
          const causeMatch = raw.match(/(?:Cause of Death|Cause|Reason)\s*[:\-]?\s*([A-Za-z\s\.\,\/]{3,80})/i);
          if (causeMatch) { fields.causeOfDeath = causeMatch[1].trim(); sources.causeOfDeath = "Death Record"; confidence.causeOfDeath = 0.65; }
          const ageMatch = raw.match(/(?:Age|Age at Death)\s*[:\-]?\s*(\d{1,3})\s*(?:years|yrs|Y)?/i);
          if (ageMatch) { fields.ageAtDeath = ageMatch[1]; sources.ageAtDeath = "Death Record"; confidence.ageAtDeath = 0.7; }
          const genderMatch = raw.match(/\b(Male|Female)\b/i);
          if (genderMatch) { fields.deceasedGender = genderMatch[1].charAt(0).toUpperCase() + genderMatch[1].slice(1).toLowerCase(); sources.deceasedGender = "Death Record"; confidence.deceasedGender = 0.75; }
        } else { progress.push("Could not read death record clearly."); }
      } catch (e) {
        progress.push("Error processing death record: " + e.message);
      }
    }

    if (applicantAadhaarFile) {
      try {
        progress.push("Reading applicant's Aadhaar...");
        const buffer = Buffer.from(await applicantAadhaarFile.arrayBuffer());
        const mimeType = applicantAadhaarFile.type || "image/jpeg";
        const result = await extractStructuredFields(buffer, mimeType, "aadhaar");
        if (!ocrMethod || ocrMethod === "none") ocrMethod = result.method;
        let parsed = { fields: {} };
        if (result.fields) { parsed = parseAadhaarStructured(result.fields); }
        else if (result.raw && result.raw.length > 10) { parsed = parseAadhaarFields(result.raw); }
        if (parsed.fields.fullName) { fields.applicantName = parsed.fields.fullName; sources.applicantName = "Applicant Aadhaar"; confidence.applicantName = 0.88; }
        if (parsed.fields.address) { fields.applicantAddress = parsed.fields.address; sources.applicantAddress = "Applicant Aadhaar"; confidence.applicantAddress = 0.8; }
        if (parsed.fields.pinCode) { fields.pinCode = parsed.fields.pinCode; sources.pinCode = "Applicant Aadhaar"; confidence.pinCode = 0.88; }
        if (parsed.fields.district) { fields.district = parsed.fields.district; sources.district = "Applicant Aadhaar"; confidence.district = 0.82; }
        if (parsed.fields.state) { fields.state = parsed.fields.state; sources.state = "Applicant Aadhaar"; confidence.state = 0.85; }
        progress.push("Applicant details extracted.");
      } catch (e) {
        progress.push("Error processing applicant Aadhaar: " + e.message);
      }
    }

    if (deceasedIdFile) {
      try {
        progress.push("Reading deceased's identity document...");
        const buffer = Buffer.from(await deceasedIdFile.arrayBuffer());
        const mimeType = deceasedIdFile.type || "image/jpeg";
        const result = await extractStructuredFields(buffer, mimeType, "generic");
        if (!ocrMethod || ocrMethod === "none") ocrMethod = result.method;
        const raw = result.raw || "";
        if (raw.length > 10) {
          if (!fields.deceasedName) {
            const nameMatch = raw.match(/(?:Name|नाम)\s*[:\-]?\s*([A-Za-z\s]{3,50})/i);
            if (nameMatch) { fields.deceasedName = nameMatch[1].trim(); sources.deceasedName = "Deceased ID"; confidence.deceasedName = 0.75; }
          }
          const dobMatch = raw.match(/\b(\d{2}[\/\-]\d{2}[\/\-]\d{4})\b/);
          if (dobMatch) { fields.deceasedDOB = dobMatch[1].replace(/-/g, "/"); sources.deceasedDOB = "Deceased ID"; confidence.deceasedDOB = 0.8; }
          const genderMatch = raw.match(/\b(Male|Female)\b/i);
          if (genderMatch && !fields.deceasedGender) { fields.deceasedGender = genderMatch[1].charAt(0).toUpperCase() + genderMatch[1].slice(1).toLowerCase(); sources.deceasedGender = "Deceased ID"; confidence.deceasedGender = 0.8; }
        }
        progress.push("Deceased identity details processed.");
      } catch (e) {
        progress.push("Error processing deceased ID: " + e.message);
      }
    }

    progress.push(`Extraction complete. ${Object.keys(fields).length} fields populated.`);
    const success = Object.keys(fields).length > 0;

    return Response.json({
      success, extractedFields: fields, sources, confidence, ocrMethod, progress,
      error: success ? null : "Could not extract details. Please upload clearer images or enter manually.",
    });
  } catch (err) {
    console.error("[Death Cert OCR Error]:", err.message);
    return Response.json({ success: false, error: "Processing failed. Please try again or enter details manually.", extractedFields: {}, sources: {}, confidence: {}, ocrMethod: "error", progress });
  }
}
