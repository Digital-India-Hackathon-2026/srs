export function parsePanFields(rawText) {
  if (!rawText || typeof rawText !== "string" || rawText.trim().length < 10) {
    return { success: false, fields: {}, confidence: {} };
  }

  const text = rawText.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const fields = {};
  const confidence = {};

  const panPatterns = [
    /(?:Permanent\s*Account\s*Number|PAN|PAN\s*(?:No|Number|#)|Income\s*Tax)\s*[:\-]?\s*([A-Z]{3}[ABCFGHLJPTF][A-Z]\d{4}[A-Z])/i,
    /\b([A-Z]{3}[ABCFGHLJPTF][A-Z]\d{4}[A-Z])\b/,
  ];
  for (const pattern of panPatterns) {
    const match = text.match(pattern);
    if (match) {
      fields.panNumber = match[1].toUpperCase();
      confidence.panNumber = 0.85;
      break;
    }
  }

  const namePatterns = [
    /(?:Name|Applicant|Holder|Cardholder|Candidate|Applicant's Name)\s*[:\-]?\s*([A-Za-z\s]{3,60})/i,
  ];
  for (const pattern of namePatterns) {
    const match = text.match(pattern);
    if (match && match[1].trim().length >= 3) {
      fields.fullName = match[1].trim();
      confidence.fullName = 0.78;
      break;
    }
  }

  const fatherPatterns = [
    /(?:S\/O|D\/O|W\/O|Father|Husband|Father's Name|Parents)\s*[:\-]?\s*([A-Za-z\s]{3,50})/i,
  ];
  for (const pattern of fatherPatterns) {
    const match = text.match(pattern);
    if (match && match[1].trim().length >= 3) {
      fields.fatherName = match[1].trim();
      confidence.fatherName = 0.7;
      break;
    }
  }

  const dobMatch = text.match(/(?:DOB|Date\s*of\s*Birth|Birth\s*Date|Date of Birth)\s*[:\-]?\s*(\d{2}[\/\-]\d{2}[\/\-]\d{4})/i);
  if (dobMatch) {
    fields.dateOfBirth = dobMatch[1].replace(/-/g, "/");
    confidence.dateOfBirth = 0.85;
  }

  const addrMatch = text.match(/(?:Address|Communication Address|Residence)\s*[:\-]?\s*([\s\S]{10,120}?)(?:\n\n|\b\d{6}\b)/i);
  if (addrMatch) {
    fields.address = addrMatch[1].replace(/\n/g, ", ").trim();
    confidence.address = 0.6;
  }

  const pinMatches = text.match(/\b(\d{6})\b/g);
  if (pinMatches) {
    const validPins = pinMatches.filter(p => /^[1-9]\d{5}$/.test(p));
    if (validPins.length > 0) {
      fields.pinCode = validPins[validPins.length - 1];
      confidence.pinCode = 0.8;
    }
  }

  const success = Object.keys(fields).length > 0;
  return { success, fields, confidence };
}
