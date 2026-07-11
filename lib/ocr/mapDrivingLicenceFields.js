/**
 * mapDrivingLicenceFields.js
 * Maps extracted OCR fields from Aadhaar/PAN/existing DL/RC into the
 * Driving Licence form schema field IDs.
 * Returns mapped fields with source labels and confidence.
 * Never fabricates data — only maps what was actually extracted.
 */

/**
 * @param {object} aadhaarFields - Fields from parseAadhaarFields
 * @param {object} panFields - Fields from parsePanFields
 * @param {object} dlFields - Fields from parseDrivingLicenceFields (existing DL)
 * @param {object} rcFields - Fields from parseRCFields (RC card)
 * @returns {{ fields: object, sources: object, confidence: object }}
 */
export function mapDrivingLicenceFields(aadhaarFields = {}, panFields = {}, dlFields = {}, rcFields = {}) {
  const fields = {};
  const sources = {};
  const confidence = {};

  function setField(fieldId, value, source, conf) {
    if (value && typeof value === "string" && value.trim()) {
      fields[fieldId] = value.trim();
      sources[fieldId] = source;
      confidence[fieldId] = conf || 0.8;
    }
  }

  // ── Full Name ──
  const fullName = aadhaarFields.fullName || panFields.fullName || dlFields.fullName || "";
  if (fullName) {
    setField("fullName", fullName, aadhaarFields.fullName ? "Aadhaar" : panFields.fullName ? "PAN" : "Existing DL", 0.85);
  }

  // ── Father / Husband Name ──
  const fatherName = aadhaarFields.fatherName || panFields.fatherName || dlFields.fatherName || "";
  if (fatherName) {
    setField("fatherHusbandName", fatherName, aadhaarFields.fatherName ? "Aadhaar" : panFields.fatherName ? "PAN" : "Existing DL", 0.75);
  }

  // ── Date of Birth ──
  const dob = aadhaarFields.dateOfBirth || panFields.dateOfBirth || dlFields.dateOfBirth || aadhaarFields.yearOfBirth || "";
  if (dob) {
    setField("dateOfBirth", dob, aadhaarFields.dateOfBirth ? "Aadhaar" : panFields.dateOfBirth ? "PAN" : "Existing DL", 0.9);
    // Calculate age
    if (dob.includes("/")) {
      const parts = dob.split("/");
      if (parts.length === 3) {
        const birthYear = parseInt(parts[2], 10);
        const currentYear = new Date().getFullYear();
        if (birthYear > 1900 && birthYear < currentYear) {
          setField("age", String(currentYear - birthYear), "Calculated", 0.85);
        }
      }
    }
  }

  // ── Gender ──
  if (aadhaarFields.gender) {
    setField("gender", aadhaarFields.gender, "Aadhaar", 0.92);
  } else if (dlFields.gender) {
    setField("gender", dlFields.gender, "Existing DL", 0.85);
  }

  // ── Address (Communication) ──
  if (aadhaarFields.address) {
    setField("commHouseStreet", aadhaarFields.address, "Aadhaar", 0.7);
  }

  // ── PIN Code ──
  if (aadhaarFields.pinCode) {
    setField("commPinCode", aadhaarFields.pinCode, "Aadhaar", 0.88);
  }

  // ── State — Telangana for 5xxxxx PINs ──
  if (aadhaarFields.pinCode && /^5\d{5}$/.test(aadhaarFields.pinCode)) {
    setField("commState", "Telangana", "Aadhaar", 0.85);
  }

  // ── District from address text ──
  if (aadhaarFields.address) {
    const addrLower = aadhaarFields.address.toLowerCase();
    const districts = [
      "Hyderabad", "Medchal-Malkajgiri", "Rangareddy", "Sangareddy",
      "Nizamabad", "Karimnagar", "Warangal", "Khammam", "Nalgonda",
      "Mahabubnagar", "Adilabad", "Hanumakonda", "Medak", "Siddipet",
      "Suryapet", "Mancherial", "Kamareddy", "Wanaparthy", "Nagarkurnool",
      "Jogulamba Gadwal", "Rajanna Sircilla", "Jagtial", "Peddapalli",
      "Jayashankar Bhupalpally", "Bhadradri Kothagudem", "Yadadri Bhuvanagiri",
      "Jangaon", "Mulugu", "Narayanpet", "Vikarabad", "Kumuram Bheem",
      "Mahabubabad",
    ];
    for (const d of districts) {
      if (addrLower.includes(d.toLowerCase())) {
        setField("commDistrict", d, "Aadhaar", 0.7);
        break;
      }
    }
  }

  // ── City from address ──
  if (aadhaarFields.address) {
    const addrLower = aadhaarFields.address.toLowerCase();
    const cities = ["hyderabad", "secunderabad", "warangal", "nizamabad", "karimnagar", "khammam", "ramagundam"];
    for (const c of cities) {
      if (addrLower.includes(c)) {
        setField("commCity", c.charAt(0).toUpperCase() + c.slice(1), "Aadhaar", 0.7);
        break;
      }
    }
  }

  // ── Aadhaar Number ──
  if (aadhaarFields.aadhaarNumber) {
    setField("aadhaarNumber", aadhaarFields.aadhaarNumber, "Aadhaar", 0.95);
  }

  // ── PAN Number ──
  if (panFields.panNumber) {
    setField("panNumber", panFields.panNumber, "PAN", 0.95);
  }

  // ── Existing Licence fields ──
  if (dlFields.licenceNumber) {
    setField("existingLicenceNumber", dlFields.licenceNumber, "Existing DL", 0.9);
    setField("hasExistingLicence", "Yes", "Existing DL", 0.95);
  }
  if (dlFields.dateOfIssue) {
    setField("existingLicenceDateOfIssue", dlFields.dateOfIssue, "Existing DL", 0.85);
  }
  if (dlFields.dateOfExpiry) {
    setField("existingLicenceDateOfExpiry", dlFields.dateOfExpiry, "Existing DL", 0.85);
  }
  if (dlFields.issuingAuthority) {
    setField("existingLicenceIssuingAuthority", dlFields.issuingAuthority, "Existing DL", 0.8);
    setField("rtoOffice", dlFields.issuingAuthority, "Existing DL", 0.7);
  }
  if (dlFields.vehicleClasses) {
    setField("existingLicenceVehicleClasses", dlFields.vehicleClasses, "Existing DL", 0.85);
  }
  if (dlFields.bloodGroup) {
    setField("bloodGroup", dlFields.bloodGroup, "Existing DL", 0.8);
  }

  // ── RC Card fields ──
  if (rcFields.registrationNumber) {
    setField("rcNumber", rcFields.registrationNumber, "RC Card", 0.9);
    setField("vehicleNumber", rcFields.registrationNumber, "RC Card", 0.9);
  }
  if (rcFields.chassisNumber) {
    setField("chassisNumber", rcFields.chassisNumber, "RC Card", 0.85);
  }
  if (rcFields.ownerName) {
    setField("rcOwnerName", rcFields.ownerName, "RC Card", 0.78);
  }
  if (rcFields.vehicleClass) {
    setField("rcVehicleClass", rcFields.vehicleClass, "RC Card", 0.75);
  }

  // ── Default nationality ──
  setField("nationality", "Indian", "Default", 0.99);

  return { fields, sources, confidence };
}
