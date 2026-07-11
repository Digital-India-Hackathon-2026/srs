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

    const extracted = await extractStructuredFields(buffer, mimeType, docType);

    if (!extracted || extracted.error) {
      return Response.json({
        success: false,
        error: "Could not read your document automatically. Please enter the details manually.",
        fields: {},
      });
    }

    const fields = {};
    const parsedFields = extracted.fields || {};

    if (docType === "aadhaar") {
      const parsed = parseAadhaarStructured(parsedFields);
      const pf = parsed && parsed.fields ? parsed.fields : parsedFields;

      if (pf.fullName) {
        const nameParts = pf.fullName.trim().split(/\s+/);
        fields.firstName = nameParts[0] || "";
        fields.lastName = nameParts.slice(1).join(" ") || "";
      }
      if (pf.fatherName) fields.relativeName = pf.fatherName;
      if (pf.dateOfBirth) {
        const parts = pf.dateOfBirth.split("/");
        if (parts.length === 3) {
          fields.dob = `${parts[2]}-${parts[1].padStart(2,"0")}-${parts[0].padStart(2,"0")}`;
        }
      }
      if (pf.gender) fields.gender = pf.gender;
      if (pf.houseNumber) fields.houseNo = pf.houseNumber;
      if (pf.street || pf.locality) fields.street = [pf.street, pf.locality].filter(Boolean).join(", ");
      if (pf.city) fields.town = pf.city;
      if (pf.district) fields.district = pf.district;
      if (pf.state) fields.state = pf.state;
      if (pf.pinCode) fields.pinCode = pf.pinCode;
      if (pf.houseNumber) fields.indiaHouseNo = pf.houseNumber;
      if (pf.street || pf.locality) fields.indiaStreet = [pf.street, pf.locality].filter(Boolean).join(", ");
      if (pf.city) fields.indiaTown = pf.city;
      if (pf.district) fields.indiaDistrict = pf.district;
      if (pf.pinCode) fields.indiaPinCode = pf.pinCode;
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
