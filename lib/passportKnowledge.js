export const passportKnowledge = {
  id: "passport",
  name: "Passport",
  officialLink: "https://www.passportindia.gov.in/",
  helpline: "1800-258-1800",
  lastVerified: "2026-07-01",

  overview: `A passport is an official travel document issued by the Government of India through the Ministry of External Affairs via Passport Seva Kendras (PSK), Post Office Passport Seva Kendras (POPSK), and Regional Passport Offices (RPO). Applications are submitted through the Passport Seva Online Portal.`,

  types: {
    fresh: {
      label: "Fresh Passport",
      description: "For first-time applicants who have never held an Indian passport.",
      documents: [
        "Proof of Date of Birth: Birth certificate / School leaving certificate / Matriculation certificate",
        "Proof of Address: Aadhaar card / Voter ID / Electricity/water bill / Bank passbook",
        "Proof of Identity: Aadhaar card / Voter ID / PAN card / Driving licence",
        "Recent passport-size photographs (white background)",
        "Self-attested copies of all documents",
      ],
      steps: [
        "Register on passportindia.gov.in",
        "Fill fresh passport application form (Form 1)",
        "Upload documents and pay fee online",
        "Book appointment at nearest PSK or POPSK",
        "Visit PSK/POPSK on appointment date with originals + self-attested copies",
        "Biometrics and photo captured at PSK",
        "Police verification (Normal channel — post-issuance or pre-issuance depending on case)",
        "Passport dispatched to registered address via Speed Post",
      ],
      processingTime: "Normal: 30–45 days. Tatkaal: 7–14 days.",
      fees: "Normal (36 pages): ₹1500. Tatkaal (36 pages): ₹3500. Normal (60 pages): ₹2000. Tatkaal (60 pages): ₹4000.",
    },

    renewal: {
      label: "Passport Renewal / Reissue",
      description: "For holders whose passport has expired or is expiring within 1 year, or lost/damaged passport.",
      documents: [
        "Original old passport",
        "Self-attested copy of first two and last two pages of old passport",
        "Proof of Address (if changed)",
        "Proof of Date of Birth",
        "Recent passport-size photographs",
      ],
      steps: [
        "Login to passportindia.gov.in",
        "Select 'Reissue of Passport'",
        "Fill application form with updated details",
        "Pay fee and book appointment",
        "Visit PSK/POPSK with old passport and documents",
        "Passport dispatched after processing",
      ],
      processingTime: "Normal: 30–45 days. Tatkaal: 7–14 days.",
    },

    minor: {
      label: "Minor Passport (Below 18 years)",
      description: "Passport for applicants below 18 years of age.",
      documents: [
        "Birth certificate of minor",
        "Aadhaar card of minor (if available)",
        "Parents' passports (if available)",
        "Parents' Aadhaar cards",
        "Parent's proof of address",
        "Annexure H (if only one parent is applying)",
        "Declaration by parents",
      ],
      validity: "5 years or until age 18, whichever is earlier.",
      notes: "Both parents must give consent or submit Annexure H. Minor passports are not eligible for Tatkaal.",
    },
  },

  scenarios: {
    appointmentReschedule: {
      question: "How many times can I reschedule my passport appointment?",
      answer: `The Passport Seva portal generally allows a limited number of reschedules per application (typically up to 2–3 times depending on portal rules, which may change). After exhausting reschedule attempts:

1. Check the Passport Seva portal first — sometimes a fresh reschedule window opens.
2. If portal shows no reschedule option, call the Passport Seva helpline: 1800-258-1800 (toll-free).
3. You may visit or write to the concerned Regional Passport Office (RPO) with:
   - Appointment receipt / printout
   - File number / Application Reference Number (ARN)
   - Valid photo ID proof
   - Written reason explaining why you cannot attend
   - Supporting proof (medical certificate, travel emergency, etc.)
4. RPO officers review on case-by-case basis. There is no guaranteed extension.
5. In some cases the application may need to be re-submitted after the appointment window expires.

Official portal: https://www.passportindia.gov.in/
Helpline: 1800-258-1800`,
    },

    missedAppointment: {
      question: "What if I miss my passport appointment?",
      answer: `If you miss your appointment:
1. Log in to the Passport Seva portal immediately.
2. Check if rescheduling is available for your application.
3. If yes, reschedule to the earliest available slot.
4. If no reschedule option is available, call helpline: 1800-258-1800.
5. In urgent cases, you may visit the RPO directly with your ARN, appointment receipt, and ID proof.
6. Note: Repeated no-shows may affect your ability to rebook.`,
    },

    cannotAttendFinalDate: {
      question: "I have already rescheduled multiple times and cannot attend the final given date. What should I do?",
      answer: `This is a critical situation. Here is what you should do step by step:

1. First, check the Passport Seva portal (passportindia.gov.in) — sometimes a final reschedule is still possible even after multiple attempts.
2. If the portal does not allow rescheduling, call the Passport Seva helpline immediately: 1800-258-1800 (toll-free, 8AM–10PM).
3. Explain your situation clearly. Note down the agent's name and call reference if provided.
4. If helpline cannot resolve, visit or write to the Regional Passport Office (RPO) for your jurisdiction.
5. When visiting RPO, carry:
   - Appointment receipt (printed or screenshot)
   - Application Reference Number (ARN) / File Number
   - Original photo ID proof (Aadhaar / Voter ID / PAN)
   - A written application explaining your reason
   - Supporting documents (medical certificate, emergency travel proof, etc.)
6. RPO officers may allow a fresh appointment OR advise re-submission depending on application status and validity.
7. Do not pay anyone outside the official portal to "fix" this — there are no unofficial agents for passport appointments.
8. If the application window has expired, you may need to submit a fresh application with fresh fee.

Official portal: https://www.passportindia.gov.in/
Helpline: 1800-258-1800`,
    },

    missingDocumentAtPSK: {
      question: "What if I forget a document at PSK?",
      answer: `If you arrive at PSK without a required document:
1. The PSK officer may reject your application on that visit.
2. You will need to reschedule for a fresh appointment.
3. Ensure you carry originals + self-attested photocopies of ALL required documents.
4. Standard documents needed: Proof of DOB, Address Proof, Identity Proof, passport-size photographs.
5. Check the document checklist on passportindia.gov.in before visiting.`,
    },

    addressProofRejected: {
      question: "What if my address proof is not accepted at PSK?",
      answer: `Accepted address proof documents include:
- Aadhaar card (most reliable)
- Voter ID
- Bank passbook with photo (last 1 year entries)
- Electricity / water / telephone bill (not older than 1 year)
- Driving licence (with address)
- Rent agreement (notarised)
- Employer's letter on company letterhead

If your address proof is rejected:
1. Ask the PSK officer specifically why it was rejected.
2. Reschedule with a valid alternative document.
3. Aadhaar card is the safest and most widely accepted address proof.
4. Ensure the address on proof matches exactly with the application form.`,
    },

    policeVerification: {
      question: "What is police verification for passport and what if it fails?",
      answer: `Police verification is a background check conducted by local police at your registered address.

Types:
- Pre-issuance verification: Done before passport is issued (fresh applicants, address change cases).
- Post-issuance verification: Done after passport dispatch (Tatkaal and some renewal cases).

If police verification fails or is delayed:
1. Police verification failure can result in passport being put on hold or cancelled.
2. You may appeal to the RPO with documentary evidence if verification was incorrectly done.
3. Ensure your address proof is accurate and up to date.
4. Stay reachable at your registered address when police visit.
5. If police do not visit within expected time, you may contact the RPO or use the online tracking.

Track status: passportindia.gov.in → Track Application Status → Enter File Number`,
    },

    holdStatus: {
      question: "My passport application shows HOLD status. What should I do?",
      answer: `HOLD status means your application requires additional review. Common reasons:
- Pending police verification
- Document discrepancy
- Identity mismatch
- Court order / legal matter

Steps to resolve:
1. Track your application at passportindia.gov.in using your File Number.
2. If hold is due to documents: respond to any communication from RPO.
3. Call helpline 1800-258-1800 to understand the specific reason for hold.
4. Visit the RPO with original documents and a written request for status update.
5. For police verification hold: contact local police station and ask for update.
6. Do NOT approach any middlemen or agents — all communication must be through official channels.`,
    },

    tatkaal: {
      question: "What is Tatkaal passport and how to apply?",
      answer: `Tatkaal is an expedited passport service for urgent travel needs.

Key points:
- Processed within 1–3 days at PSK (dispatched in 7–14 days typically).
- Higher fee: ₹3500 (36 pages), ₹4000 (60 pages).
- Requires same documents as normal passport PLUS Annex F (self-declaration).
- Some cases require a verification certificate from a Gazetted Officer or Annexure E/F.
- Not available for minor passports.
- Pre-issuance police verification NOT done for Tatkaal (post-issuance instead).
- If discrepancy found after issuance, passport can be impounded.

Apply on: passportindia.gov.in → Select Tatkaal during application.`,
    },

    pskVsPopskVsRpo: {
      question: "What is the difference between PSK, POPSK, and RPO?",
      answer: `PSK (Passport Seva Kendra):
- Main centres operated by TCS on behalf of MEA.
- Handle full range of passport services.
- Located in major cities.

POPSK (Post Office Passport Seva Kendra):
- Operated through India Post offices.
- Handles passport applications, especially in smaller towns.
- Same services as PSK.

RPO (Regional Passport Office):
- Senior government office (under MEA).
- Handles escalations, corrections, grievances, HOLD cases, rejection appeals.
- Does NOT typically handle new applications directly.
- If PSK/POPSK cannot resolve your issue, RPO is the next authority.
- You can visit RPO walk-in for urgent matters with proper documents.

Hyderabad RPO address: Regional Passport Office, 6-3-337, Navbharat Chambers, Durga Nagar, Punjagutta, Hyderabad – 500082.
RPO Hyderabad helpline: Check passportindia.gov.in for latest contact.`,
    },

    rejectedApplication: {
      question: "My passport application was rejected. What should I do?",
      answer: `If your application is rejected:
1. You will receive a rejection notice with the reason.
2. Common rejection reasons:
   - Document mismatch (name, DOB, address)
   - Incomplete application
   - Suspicious identity documents
   - Adverse police verification report
   - Court order / legal issues
3. You may appeal to the RPO within the stipulated time.
4. Carry rejection notice, original documents, and a written appeal letter.
5. For document mismatch: get documents corrected (gazette notification for name change, court affidavit for DOB correction).
6. For adverse police report: provide clarification to RPO with supporting documents.`,
    },

    fileNumberTracking: {
      question: "How do I track my passport application using file number?",
      answer: `To track your passport application:
1. Visit passportindia.gov.in
2. Click "Track Application Status"
3. Select Application Type: "Passport"
4. Enter your File Number (format: HYD/XXXXXXXXX/YYYY) and Date of Birth
5. Click "Track Status"

You can also track via SMS:
- SMS "STATUS <file_number>" to 9704100100

Application stages:
- Application Received
- Police Verification Initiated / Completed
- Passport Printed
- Passport Dispatched (with Speed Post tracking number)`,
    },

    nameDobChange: {
      question: "How to change name or date of birth in passport?",
      answer: `For name change:
- Submit reissue application with: Marriage certificate (for name change after marriage), or Gazette notification (for other name changes), or Court order.
- Both old name and new name documents required.

For DOB correction:
- Submit reissue application with correct DOB proof: Birth certificate (most reliable), School leaving/Matriculation certificate.
- Affidavit + supporting documents may be required.
- This can take longer as additional scrutiny applies.

Apply via: passportindia.gov.in → Reissue of Passport → Select reason for reissue.`,
    },

    documents: {
      fresh: [
        "Proof of Date of Birth (Birth certificate / 10th marksheet)",
        "Proof of Address (Aadhaar / Voter ID / Electricity bill — not older than 1 year)",
        "Proof of Identity (Aadhaar / Voter ID / PAN)",
        "Passport-size photographs (white background, recent)",
        "Self-attested photocopies of all documents",
      ],
      renewal: [
        "Original old passport",
        "Self-attested copy of first 2 and last 2 pages of old passport",
        "Updated address proof (if address has changed)",
        "Recent passport-size photographs",
      ],
      minor: [
        "Birth certificate of child",
        "Parents' Aadhaar cards",
        "Parents' passports (if available)",
        "Annexure H (if one parent applying alone)",
        "School ID card of minor",
      ],
    },

    commonMistakes: [
      "Uploading blurry, low-quality document scans",
      "Mismatch between name in application and identity proof",
      "Using address proof older than 1 year",
      "Not carrying originals on PSK visit day",
      "Wrong form selected (fresh vs reissue)",
      "Booking appointment at wrong PSK (different city)",
      "Not printing appointment receipt before PSK visit",
      "Paying agents or touts for appointment bookings — this is unnecessary and risky",
    ],
  },
};
