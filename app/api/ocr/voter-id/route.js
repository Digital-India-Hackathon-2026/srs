/**
 * OCR API for Voter ID Draft Generator
 * Extracts fields from Aadhaar card to auto-fill voter registration form.
 * Uses: Gemini Vision → OpenAI Vision → fallback error
 */

import { extractStructuredFields } from "../../../../lib/ocr/extractDocumentText";
import { parseAadhaarStructured } from "../../../../lib/ocr/parseAadhaarFields";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("document");
    const docType = formData.get("docType") || "aadhaar";

    if (!file) {
      return Response.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const mimeType = file.type || "image/jpeg";

    // Extract structured fields using Vision AI
    const extracted = await extractStructuredFields(buffer, mimeType, docType);

    if (!extracted || extracted.error) {
      return Response.json({
        success: false,
        error: "Could not read your document automatically. Please enter the details manually.",
        fields: {},
      });
    }

    // Map to voter-id form fields
    const fields = {};

    if (docType === "aadhaar") {
      const parsed = typeof extracted === "string" ? parseAadhaarStructured(extracted) : extracted;

      if (parsed.fullName) {
        const nameParts = parsed.fullName.trim().split(/\s+/);
        fields.firstName = nameParts[0] || "";
        fields.lastName = nameParts.slice(1).join(" ") || "";
      }
      if (parsed.fatherName) fields.relativeName = parsed.fatherName;
      if (parsed.dateOfBirth) {
        // Convert DD/MM/YYYY to YYYY-MM-DD for input[type=date]
        const parts = parsed.dateOfBirth.split("/");
        if (parts.length === 3) {
          fields.dob = `${parts[2]}-${parts[1].padStart(2,"0")}-${parts[0].padStart(2,"0")}`;
        }
      }
      if (parsed.gender) fields.gender = parsed.gender;
      if (parsed.houseNumber) fields.houseNo = parsed.houseNumber;
      if (parsed.street || parsed.locality) fields.street = [parsed.street, parsed.locality].filter(Boolean).join(", ");
      if (parsed.city) fields.town = parsed.city;
      if (parsed.district) fields.district = parsed.district;
      if (parsed.state) fields.state = parsed.state;
      if (parsed.pinCode) fields.pinCode = parsed.pinCode;
      // Also fill India address fields for Form 6A
      if (parsed.houseNumber) fields.indiaHouseNo = parsed.houseNumber;
      if (parsed.street || parsed.locality) fields.indiaStreet = [parsed.street, parsed.locality].filter(Boolean).join(", ");
      if (parsed.city) fields.indiaTown = parsed.city;
      if (parsed.district) fields.indiaDistrict = parsed.district;
      if (parsed.pinCode) fields.indiaPinCode = parsed.pinCode;
    }

    return Response.json({
      success: true,
      fields,
      rawExtracted: extracted,
    });
  } catch (err) {
    console.error("[OCR voter-id]", err.message);
    return Response.json({ error: "OCR processing failed: " + err.message, fields: {} });
  }
}
