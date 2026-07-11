import { extractStructuredFields } from "../../../../lib/ocr/extractDocumentText";
import { parseAadhaarStructured, parseAadhaarFields } from "../../../../lib/ocr/parseAadhaarFields";
import { parsePanFields } from "../../../../lib/ocr/parsePanFields";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const aadhaarFile = formData.get("aadhaar");
    const identityProofFile = formData.get("identityProof");
    const addressProofFile = formData.get("addressProof");
    const dobProofFile = formData.get("dobProof");
    const existingPanFile = formData.get("existingPan");
    const photoFile = formData.get("photo");
    const signatureFile = formData.get("signature");

    if (!aadhaarFile && !identityProofFile && !addressProofFile && !dobProofFile && !existingPanFile) {
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
    const allFields = {};
    const allSources = {};
    const allConfidence = {};
    let ocrMethod = "none";
    const progress = [];

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

      Object.entries(aadhaarParsed.fields).forEach(([k, v]) => {
        allFields[k] = v;
        allSources[k] = "Aadhaar";
        allConfidence[k] = aadhaarParsed.confidence[k] || 0.8;
      });
    }

    const docsToProcess = [
      { file: identityProofFile, label: "Identity Proof", type: "generic", key: "identityProof" },
      { file: addressProofFile, label: "Address Proof", type: "generic", key: "addressProof" },
      { file: dobProofFile, label: "Date of Birth Proof", type: "generic", key: "dobProof" },
      { file: existingPanFile, label: "Existing PAN Card", type: "pan", key: "existingPan" },
    ];

    for (const doc of docsToProcess) {
      if (!doc.file) continue;
      progress.push(`Reading ${doc.label}...`);
      const buffer = Buffer.from(await doc.file.arrayBuffer());
      const mimeType = doc.file.type || "image/jpeg";

      const result = await extractStructuredFields(buffer, mimeType, doc.type);
      if (!ocrMethod || ocrMethod === "none") ocrMethod = result.method;

      if (result.fields && doc.type === "pan") {
        progress.push(`${doc.label} data extracted.`);
        Object.entries(result.fields).forEach(([k, v]) => {
          if (v && !allFields[k]) {
            allFields[k] = v;
            allSources[k] = doc.label;
            allConfidence[k] = 0.85;
          }
        });
      } else if (result.fields) {
        progress.push(`${doc.label} processed.`);
        Object.entries(result.fields).forEach(([k, v]) => {
          if (v && !allFields[k]) {
            allFields[k] = v;
            allSources[k] = doc.label;
            allConfidence[k] = 0.7;
          }
        });
      } else {
        const rawText = result.raw || "";
        if (rawText.length > 10) {
          progress.push(`${doc.label} processed.`);
          const parsed = parsePanFields(rawText);
          if (parsed.success) {
            Object.entries(parsed.fields).forEach(([k, v]) => {
              if (!allFields[k]) {
                allFields[k] = v;
                allSources[k] = doc.label;
                allConfidence[k] = parsed.confidence[k] || 0.7;
              }
            });
          }
        } else {
          progress.push(`Could not read ${doc.label} clearly.`);
        }
      }
    }

    progress.push("Identifying missing information...");
    const requiredFields = [
      "fullName", "fatherName", "dateOfBirth", "gender",
      "aadhaarNumber", "address", "district", "state", "pinCode",
    ];
    const missingFields = requiredFields.filter(f => !allFields[f]);

    progress.push("Preparing application draft...");

    const success = Object.keys(allFields).length > 0;

    return Response.json({
      success,
      extractedFields: allFields,
      sources: allSources,
      confidence: allConfidence,
      missingFields,
      ocrMethod,
      progress,
      error: success ? null : "Could not extract details from the uploaded documents. Please upload clearer images or enter details manually.",
    });

  } catch (err) {
    console.error("[PAN Card OCR API Error]:", err.message);
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
