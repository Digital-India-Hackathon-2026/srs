export function parseCasteCertificateFields(rawText) {
  if (!rawText || typeof rawText !== "string" || rawText.trim().length < 10) {
    return { success: false, fields: {}, confidence: {} };
  }

  const text = rawText.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const fields = {};
  const confidence = {};

  const casteKeywords = [
    { pattern: /(?:Caste|Community|Caste\/Community|జాతి|जाति)\s*[:\-]?\s*([A-Za-z\s\/\(\)]{2,40})/i, key: "caste" },
    { pattern: /(?:Sub.?Caste|Sub.?Community|ఉపజాతి|उपजाति)\s*[:\-]?\s*([A-Za-z\s\/\(\)]{2,40})/i, key: "subCaste" },
  ];

  for (const { pattern, key } of casteKeywords) {
    const match = text.match(pattern);
    if (match && match[1].trim().length >= 2) {
      fields[key] = match[1].trim();
      confidence[key] = 0.75;
    }
  }

  const namePatterns = [
    /(?:Name|Applicant|Holder|Candidate|పేరు|नाम)\s*[:\-]?\s*([A-Za-z\s]{3,60})/i,
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
    /(?:S\/O|D\/O|W\/O|Father|Husband|తండ్రి|पिता)\s*[:\-]?\s*([A-Za-z\s]{3,50})/i,
  ];
  for (const pattern of fatherPatterns) {
    const match = text.match(pattern);
    if (match && match[1].trim().length >= 3) {
      fields.fatherName = match[1].trim();
      confidence.fatherName = 0.7;
      break;
    }
  }

  const motherPatterns = [
    /(?:Mother|తల్లి|माता)\s*[:\-]?\s*([A-Za-z\s]{3,50})/i,
  ];
  for (const pattern of motherPatterns) {
    const match = text.match(pattern);
    if (match && match[1].trim().length >= 3) {
      fields.motherName = match[1].trim();
      confidence.motherName = 0.7;
      break;
    }
  }

  const dobMatch = text.match(/(?:DOB|Date\s*of\s*Birth|పుట్టినతేదీ|जन्मतिथि)\s*[:\-]?\s*(\d{2}[\/\-]\d{2}[\/\-]\d{4})/i);
  if (dobMatch) {
    fields.dateOfBirth = dobMatch[1].replace(/-/g, "/");
    confidence.dateOfBirth = 0.85;
  }

  const certNumPatterns = [
    /(?:Certificate\s*(?:No|Number|#)|Cert\.?\s*No|సర్టిఫికెట్\s*నం|प्रमाणपत्र\s*संख्या)\s*[:\-]?\s*([A-Z0-9\/\-]{5,25})/i,
  ];
  for (const pattern of certNumPatterns) {
    const match = text.match(pattern);
    if (match) {
      fields.certificateNumber = match[1].trim();
      confidence.certificateNumber = 0.82;
      break;
    }
  }

  const addrMatch = text.match(/(?:Address|చిరునామా|पता)\s*[:\-]?\s*([\s\S]{10,120}?)(?:\n\n|\b\d{6}\b)/i);
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

  const catPatterns = [
    /(?:Category|SC|ST|BC|OBC|ఎస్సీ|ఎస్టీ|బీసీ|ओबीसी|अनुसूचित)\s*[:\-]?\s*([A-Za-z\/]{2,10})/i,
    /\b(SC|ST|BC-A|BC-B|BC-C|BC-D|BC-E|OBC)\b/i,
  ];
  for (const pattern of catPatterns) {
    const match = text.match(pattern);
    if (match) {
      const val = match[1] || match[0];
      if (["SC", "ST", "BC", "OBC", "BC-A", "BC-B", "BC-C", "BC-D", "BC-E"].includes(val.toUpperCase())) {
        fields.category = val.toUpperCase();
        confidence.category = 0.85;
      }
      break;
    }
  }

  const schoolPatterns = [
    /(?:School|College|Institution|పాఠశాల|विद्यालय)\s*[:\-]?\s*([A-Za-z\s\.]{3,60})/i,
  ];
  for (const pattern of schoolPatterns) {
    const match = text.match(pattern);
    if (match && match[1].trim().length >= 3) {
      fields.schoolName = match[1].trim();
      confidence.schoolName = 0.7;
      break;
    }
  }

  const occupationMatch = text.match(/(?:Occupation|వృత్తి|व्यवसाय)\s*[:\-]?\s*([A-Za-z\s]{3,40})/i);
  if (occupationMatch) {
    fields.occupation = occupationMatch[1].trim();
    confidence.occupation = 0.7;
  }

  const success = Object.keys(fields).length > 0;
  return { success, fields, confidence };
}
