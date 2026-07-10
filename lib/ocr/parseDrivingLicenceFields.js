/**
 * parseDrivingLicenceFields(rawText)
 * Parses raw OCR text from an existing Driving Licence card
 * and extracts structured fields.
 * Returns ONLY fields actually found — never fabricates data.
 */

export function parseDrivingLicenceFields(rawText) {
  if (!rawText || typeof rawText !== "string" || rawText.trim().length < 10) {
    return { success: false, fields: {}, confidence: {} };
  }

  const text = rawText.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
  const fields = {};
  const confidence = {};

  // ── Extract Licence Number (format: TS01 2020 0012345 or similar state-prefix patterns) ──
  const dlPatterns = [
    /\b([A-Z]{2}\d{2}\s?\d{4}\s?\d{7})\b/,           // TS01 2020 0012345
    /\b([A-Z]{2}\d{2}\s?\d{11})\b/,                   // TS0120200012345
    /\b([A-Z]{2}-?\d{2}-?\d{4}-?\d{7})\b/,            // TS-01-2020-0012345
    /\b([A-Z]{2}\d{2}\s?[A-Z]?\d{4,})\b/,             // Broader match
  ];
  for (const pattern of dlPatterns) {
    const match = text.match(pattern);
    if (match) {
      fields.licenceNumber = match[1].replace(/\s+/g, "");
      confidence.licenceNumber = 0.85;
      break;
    }
  }

  // ── Extract Full Name ──
  const namePatterns = [
    /(?:Name|Holder'?s?\s*Name)\s*[:\-]?\s*([A-Za-z\s]{3,50})/i,
  ];
  for (const pattern of namePatterns) {
    const match = text.match(pattern);
    if (match && match[1].trim().length >= 3) {
      fields.fullName = match[1].trim();
      confidence.fullName = 0.8;
      break;
    }
  }

  // ── Extract Father/Husband Name ──
  const relPatterns = [
    /(?:S\/O|D\/O|W\/O|Father|Husband)\s*[:\-]?\s*([A-Za-z\s]{3,50})/i,
  ];
  for (const pattern of relPatterns) {
    const match = text.match(pattern);
    if (match && match[1].trim().length >= 3) {
      fields.fatherName = match[1].trim().split("\n")[0].trim();
      confidence.fatherName = 0.7;
      break;
    }
  }

  // ── Date of Birth ──
  const dobMatch = text.match(/(?:DOB|Date\s*of\s*Birth|D\.O\.B)\s*[:\-]?\s*(\d{2}[\/\-]\d{2}[\/\-]\d{4})/i);
  if (dobMatch) {
    fields.dateOfBirth = dobMatch[1].replace(/-/g, "/");
    confidence.dateOfBirth = 0.88;
  } else {
    // Try any date format in text
    const anyDateMatch = text.match(/\b(\d{2}[\/\-]\d{2}[\/\-]\d{4})\b/);
    if (anyDateMatch) {
      fields.dateOfBirth = anyDateMatch[1].replace(/-/g, "/");
      confidence.dateOfBirth = 0.6;
    }
  }

  // ── Blood Group ──
  const bgMatch = text.match(/(?:Blood\s*(?:Group|Gr|Gp)|BG)\s*[:\-]?\s*((?:A|B|AB|O)[+-])/i);
  if (bgMatch) {
    fields.bloodGroup = bgMatch[1].toUpperCase();
    confidence.bloodGroup = 0.85;
  }

  // ── Gender ──
  const genderMatch = text.match(/\b(Male|Female|MALE|FEMALE|Transgender)\b/i);
  if (genderMatch) {
    fields.gender = genderMatch[1].charAt(0).toUpperCase() + genderMatch[1].slice(1).toLowerCase();
    confidence.gender = 0.85;
  }

  // ── Date of Issue ──
  const doiMatch = text.match(/(?:Date\s*of\s*Issue|DOI|Issued?\s*[Oo]n)\s*[:\-]?\s*(\d{2}[\/\-]\d{2}[\/\-]\d{4})/i);
  if (doiMatch) {
    fields.dateOfIssue = doiMatch[1].replace(/-/g, "/");
    confidence.dateOfIssue = 0.82;
  }

  // ── Date of Expiry / Valid Till ──
  const doeMatch = text.match(/(?:Valid\s*(?:Till|Upto|To)|Expiry|DOE|Exp)\s*[:\-]?\s*(\d{2}[\/\-]\d{2}[\/\-]\d{4})/i);
  if (doeMatch) {
    fields.dateOfExpiry = doeMatch[1].replace(/-/g, "/");
    confidence.dateOfExpiry = 0.82;
  }

  // ── Issuing Authority / RTO ──
  const rtoMatch = text.match(/(?:Issuing\s*Authority|RTO|RTA|Office)\s*[:\-]?\s*([A-Za-z\s\-]{3,50})/i);
  if (rtoMatch) {
    fields.issuingAuthority = rtoMatch[1].trim();
    confidence.issuingAuthority = 0.7;
  }

  // ── Vehicle Classes (COV) ──
  const covPatterns = [
    /(?:COV|Class\s*of\s*Vehicle|Vehicle\s*Class|Category)\s*[:\-]?\s*([A-Z\s\/,\-\(\)]+)/i,
    /\b(MCWG|MCWOG|LMV|HMV|HGMV|HPMV|MC\s*50CC)\b/gi,
  ];
  const covMatch = text.match(covPatterns[0]);
  if (covMatch) {
    fields.vehicleClasses = covMatch[1].trim();
    confidence.vehicleClasses = 0.75;
  } else {
    // Find all vehicle class abbreviations
    const classes = [];
    let m;
    const regex = /\b(MCWG|MCWOG|LMV|HMV|HGMV|HPMV|LMV-NT|MC\s*50CC)\b/gi;
    while ((m = regex.exec(text)) !== null) {
      const cls = m[1].toUpperCase().replace(/\s+/g, "");
      if (!classes.includes(cls)) classes.push(cls);
    }
    if (classes.length > 0) {
      fields.vehicleClasses = classes.join(", ");
      confidence.vehicleClasses = 0.7;
    }
  }

  // ── Address (from DL) ──
  const addrMatch = text.match(/(?:Address|Addr)\s*[:\-]?\s*([\s\S]{10,120}?)(?:\n\n|\b\d{6}\b)/i);
  if (addrMatch) {
    fields.address = addrMatch[1].replace(/\n/g, ", ").trim();
    confidence.address = 0.6;
  }

  const success = Object.keys(fields).length > 0;
  return { success, fields, confidence };
}
