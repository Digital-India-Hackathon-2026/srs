/**
 * Application Success Tips — per service
 * ─────────────────────────────────────────────────────────────────────────────
 * Practical tips shown at the bottom of every service detail page.
 * Falls back to DEFAULT_TIPS if no service-specific tips are configured.
 */

export const DEFAULT_TIPS = [
  "Carry original documents along with self-attested photocopies.",
  "Ensure your name is spelled exactly the same across all uploaded documents.",
  "Check all spellings and details carefully before final submission.",
  "Keep 4-6 recent passport-size photographs ready.",
  "Reach the office at least 15 minutes before your appointment.",
  "Save your application/acknowledgement number immediately after submission.",
  "Keep your registered mobile number active — OTPs and updates are sent to it.",
  "Ensure all uploaded scanned documents are clear, fully visible, and not blurry.",
];

export const SERVICE_TIPS = {
  passport: [
    "Book your appointment on the Passport Seva portal well in advance — walk-in slots are limited.",
    "Ensure your Aadhaar address matches your passport address proof exactly.",
    "Carry original documents along with self-attested photocopies for every document.",
    "The name on your Aadhaar, PAN, and birth certificate must match exactly.",
    "For Tatkaal applications, original documents are verified more strictly.",
    "Check that your photograph meets all Passport Seva specifications (white background, no glasses).",
    "Save your appointment confirmation number and carry it to the PSK.",
    "Keep your registered mobile active — OTPs are sent for e-Passport status.",
  ],
  "driving-licence": [
    "Clear the learner's licence online test before visiting the RTO.",
    "Carry original documents and self-attested photocopies to the RTO.",
    "Ensure your Aadhaar address matches your current residence address.",
    "If applying for a permanent licence, wait at least 30 days after your learner's licence is issued.",
    "Medical certificate (Form 1A) is mandatory if you are 40 years or older.",
    "Reach the RTO early — queues are long after 10:00 AM.",
    "Download the mParivahan app to check application and licence status.",
    "Take a printout of your appointment confirmation if booking online.",
  ],
  "income-certificate": [
    "Ensure income details in your salary slip/IT return match what you declare.",
    "Tahsildar offices process income certificates — verify your jurisdiction before visiting.",
    "Ration card must match your current address for faster processing.",
    "Self-declared income is accepted in MeeSeva — carry a ₹20 stamp paper if required.",
    "Carry original documents and photocopies.",
    "Processing typically takes 7–15 working days via MeeSeva.",
    "Keep your acknowledgement receipt safely.",
    "Name on all documents must match exactly.",
  ],
  "caste-certificate": [
    "Father's caste certificate is the strongest supporting document — carry it.",
    "School TC must clearly mention caste/community — verify before submitting.",
    "Certificate is issued by the Tahsildar of your residential jurisdiction.",
    "Name on all documents must be consistent — Aadhaar, school records, and ration card.",
    "Carry original documents and photocopies.",
    "Processing may take 15–30 days; plan accordingly.",
    "Caste certificate issued in one state may require re-verification if used in another state.",
    "Save the application number for status tracking.",
  ],
  "birth-certificate": [
    "Register the birth within 21 days to avoid additional documentation.",
    "Hospital birth record is the primary document — keep the original safe.",
    "Both parents' Aadhaar details are required for complete registration.",
    "Child's name can be added within 1 year of birth even if initially unnamed.",
    "Ensure hospital record spelling matches what you want on the certificate.",
    "CRS registration is free — do not pay any unofficial fee.",
    "Keep the hospital discharge summary and birth record stored safely.",
    "Online registration is available on crsorgi.gov.in or through GHMC.",
  ],
  "death-certificate": [
    "Register the death within 21 days to avoid affidavit requirements.",
    "Hospital death record (Medical Certificate of Cause of Death) is mandatory.",
    "Applicant must be a family member or designated informant — bring relationship proof.",
    "Certificate is required for insurance, property transfer, and pension claims — apply promptly.",
    "Ensure the deceased's name is spelled correctly on all supporting documents.",
    "Registration is free — do not pay agents for a process that is cost-free.",
    "Keep multiple certified copies of the death certificate for different purposes.",
    "Online registration available on crsorgi.gov.in or your municipal corporation.",
  ],
  "residence-certificate": [
    "Ensure your utility bills show your name and current address.",
    "Tahsildar of your area issues residence certificates — confirm your jurisdiction.",
    "You may need to prove at least 7 years of residence in Telangana.",
    "Carry original documents and photocopies for verification.",
    "Name on all documents must be consistent — especially Aadhaar and ration card.",
    "Residence certificate is valid for 1 year — renew when needed.",
    "Processing typically takes 10–20 working days.",
    "Save your application number for status tracking.",
  ],
  "voter-id": [
    "Register as a voter at least 90 days before the election for your name to appear.",
    "Ensure your Aadhaar address matches your voter registration address.",
    "Download e-EPIC from voters.eci.gov.in as a backup to the physical card.",
    "BLO (Booth Level Officer) will visit your address — be available at home.",
    "Check your name in the electoral roll at voters.eci.gov.in after registration.",
    "Ensure all document spellings are consistent — name, DOB, and address.",
    "Registration is completely free — do not pay any agent.",
    "Keep your Voter ID and e-EPIC updated when you move to a new address.",
  ],
  "aadhaar-update": [
    "Online address update is available for 14 types of valid address proofs.",
    "Name change requires a gazette notification or marriage certificate.",
    "DOB correction is allowed only once on Aadhaar — ensure accuracy.",
    "Update is free at myaadhaar.uidai.gov.in for most changes.",
    "Biometric updates require a visit to an Aadhaar Seva Kendra.",
    "Keep your registered mobile number active — OTPs are sent for every update.",
    "Processing typically takes 10–30 days for the update to reflect.",
    "Download the updated Aadhaar from UIDAI portal after confirmation.",
  ],
};

/**
 * Get tips for a service.
 * @param {string} serviceId
 * @returns {string[]}
 */
export function getServiceTips(serviceId) {
  return SERVICE_TIPS[serviceId] || DEFAULT_TIPS;
}
