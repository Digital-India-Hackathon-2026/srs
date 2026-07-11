import { extractStructuredFields } from "../../../../lib/ocr/extractDocumentText";
import { parseAadhaarStructured, parseAadhaarFields } from "../../../../lib/ocr/parseAadhaarFields";
import { parseDrivingLicenceFields } from "../../../../lib/ocr/parseDrivingLicenceFields";
import { parseRCFields } from "../../../../lib/ocr/parseRCFields";
import { mapDrivingLicenceFields } from "../../../../lib/ocr/mapDrivingLicenceFields";

export async function POST(req) {
  const progress = [];

  try {
    const formData = await req.formData();
    const aadhaarFile = formData.get("aadhaar");
    const learnerLicenceFile = formData.get("learnerLicence");
    const medicalCertFile = formData.get("medicalCert");
    const rcCardFile = formData.get("rcCard");
    const existingDLFile = formData.get("existingDL");

    if (!aadhaarFile && !learnerLicenceFile && !medicalCertFile && !rcCardFile && !existingDLFile) {
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
    let dlParsed = { fields: {}, confidence: {} };
    let rcParsed = { fields: {}, confidence: {} };
    let medicalFields = {};
    let medicalConf = {};
    let llFields = {};
    let llConf = {};
    let ocrMethod = "none";

    if (aadhaarFile) {
      try {
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
      } catch (e) {
        progress.push("Error processing Aadhaar: " + e.message);
      }
    }

    if (learnerLicenceFile) {
      try {
        progress.push("Reading Learner's Licence...");
        const buffer = Buffer.from(await learnerLicenceFile.arrayBuffer());
        const mimeType = learnerLicenceFile.type || "image/jpeg";

        const result = await extractStructuredFields(buffer, mimeType, "generic");
        if (!ocrMethod || ocrMethod === "none") ocrMethod = result.method;

        const rawText = result.raw || "";
        if (rawText.length > 10) {
          progress.push("Parsing Learner's Licence details...");
          const parsed = parseDrivingLicenceFields(rawText);
          llFields = parsed.fields;
          llConf = parsed.confidence;
        } else {
          progress.push("Could not read Learner's Licence clearly.");
        }
      } catch (e) {
        progress.push("Error processing Learner's Licence: " + e.message);
      }
    }

    if (existingDLFile) {
      try {
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
      } catch (e) {
        progress.push("Error processing existing DL: " + e.message);
      }
    }

    if (rcCardFile) {
      try {
        progress.push("Reading RC Card...");
        const buffer = Buffer.from(await rcCardFile.arrayBuffer());
        const mimeType = rcCardFile.type || "image/jpeg";

        const result = await extractStructuredFields(buffer, mimeType, "rc");
        if (!ocrMethod || ocrMethod === "none") ocrMethod = result.method;

        if (result.fields) {
          progress.push("RC Card details extracted (AI Vision).");
          const parsed = parseRCFields(result.raw || JSON.stringify(result.fields));
          if (parsed.success) {
            rcParsed = { fields: parsed.fields, confidence: parsed.confidence };
          } else {
            rcParsed.fields = result.fields;
            rcParsed.confidence = {};
            Object.keys(result.fields).forEach(k => { rcParsed.confidence[k] = 0.85; });
          }
        } else if (result.raw && result.raw.length > 10) {
          progress.push("Parsing RC Card from OCR text...");
          const parsed = parseRCFields(result.raw);
          rcParsed = { fields: parsed.fields, confidence: parsed.confidence };
        } else {
          progress.push("Could not read RC Card clearly.");
        }
      } catch (e) {
        progress.push("Error processing RC Card: " + e.message);
      }
    }

    if (medicalCertFile) {
      try {
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
            medicalFields.bloodGroup = bgMatch[1].toUpperCase();
            medicalConf.bloodGroup = 0.85;
          }
        } else {
          progress.push("Could not read medical certificate clearly.");
        }
      } catch (e) {
        progress.push("Error processing medical certificate: " + e.message);
      }
    }

    progress.push("Mapping details to Driving Licence form...");
    const { fields, sources, confidence } = mapDrivingLicenceFields(
      aadhaarParsed.fields,
      {},
      dlParsed.fields,
      rcParsed.fields
    );

    if (medicalFields.bloodGroup && !fields.bloodGroup) {
      fields.bloodGroup = medicalFields.bloodGroup;
      sources.bloodGroup = "Medical Certificate";
      confidence.bloodGroup = medicalConf.bloodGroup;
    }

    if (llFields.licenceNumber && !fields.learnerLicenceNumber) {
      fields.learnerLicenceNumber = llFields.licenceNumber;
      sources.learnerLicenceNumber = "Learner's Licence";
      confidence.learnerLicenceNumber = llConf.licenceNumber || 0.8;
    }

    progress.push("Identifying missing information...");
    const requiredFields = [
      "fullName", "fatherHusbandName", "dateOfBirth", "gender",
      "bloodGroup", "mobileNumber", "aadhaarNumber",
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
      progress,
    });
  }
}
