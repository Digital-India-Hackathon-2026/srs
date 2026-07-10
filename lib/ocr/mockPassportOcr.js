/**
 * Mock Passport OCR — returns demo extracted data.
 * Replace with real OCR (Google Vision / OpenAI Vision / Tesseract) later.
 */

export async function extractPassportFields(uploadedFiles = {}) {
  // Simulate processing delay
  await new Promise((r) => setTimeout(r, 1200));

  // Mock extracted data — as if OCR read the user's documents
  const extracted = {
    givenName: "Rishika",
    surname: "Kamani",
    dateOfBirth: "2005-08-08",
    gender: "Female",
    houseStreet: "House No. 12-34, Example Colony",
    city: "Hyderabad",
    district: "Hyderabad",
    state: "Telangana",
    pinCode: "500001",
    mobileNumber: "9876543210",
    emailId: "rishika@example.com",
    panNumber: "ABCDE1234F",
    aadhaarNumber: "123456789012",
    fatherGivenName: "Ramesh",
    fatherSurname: "Kamani",
    motherGivenName: "Sunitha",
    motherSurname: "Kamani",
  };

  // Track which fields came from which document
  const sources = {
    givenName: "aadhaar",
    surname: "aadhaar",
    dateOfBirth: "aadhaar",
    gender: "aadhaar",
    houseStreet: "aadhaar",
    city: "aadhaar",
    district: "aadhaar",
    state: "aadhaar",
    pinCode: "aadhaar",
    panNumber: "pan",
    aadhaarNumber: "aadhaar",
    fatherGivenName: "aadhaar",
    fatherSurname: "aadhaar",
  };

  return { extracted, sources };
}
