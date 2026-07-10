/**
 * Multilingual Service and Topic Aliases
 * ─────────────────────────────────────────────────────────────────────────────
 * Maps Telugu/Hindi/Romanized names to canonical English service IDs and topics.
 * Used for language-independent intent recognition.
 */

export const SERVICE_ALIASES = [
  {
    id: "passport",
    aliases: [
      "passport", "పాస్‌పోర్ట్", "పాస్పోర్ట్", "पासपोर्ट", "passport seva",
      "pass port", "pasport", "paasport",
    ],
  },
  {
    id: "aadhaar",
    aliases: [
      "aadhaar", "aadhar", "adhar", "adhaar", "aadhaar card",
      "ఆధార్", "ఆధార్ కార్డు", "ఆధార్ కార్డ్",
      "आधार", "आधार कार्ड", "aadhar card",
    ],
  },
  {
    id: "income-certificate",
    aliases: [
      "income certificate", "income cert",
      "ఆదాయ ధృవీకరణ పత్రం", "ఇన్‌కమ్ సర్టిఫికేట్", "ఆదాయ సర్టిఫికేట్",
      "आय प्रमाण पत्र", "इनकम सर्टिफिकेट", "income certificate",
    ],
  },
  {
    id: "caste-certificate",
    aliases: [
      "caste certificate", "caste cert",
      "కుల ధృవీకరణ పత్రం", "కాస్ట్ సర్టిఫికేట్", "కులం సర్టిఫికేట్",
      "जाति प्रमाण पत्र", "कास्ट सर्टिफिकेट", "जाति सर्टिफिकेट",
    ],
  },
  {
    id: "residence-certificate",
    aliases: [
      "residence certificate", "domicile certificate",
      "నివాస ధృవీకరణ పత్రం", "రెసిడెన్స్ సర్టిఫికేట్",
      "निवास प्रमाण पत्र", "रेसिडेंस सर्टिफिकेट",
    ],
  },
  {
    id: "birth-certificate",
    aliases: [
      "birth certificate",
      "జనన ధృవీకరణ పత్రం", "బర్త్ సర్టిఫికేట్", "పుట్టిన సర్టిఫికేట్",
      "जन्म प्रमाण पत्र", "बर्थ सर्टिफिकेट",
    ],
  },
  {
    id: "death-certificate",
    aliases: [
      "death certificate",
      "మరణ ధృవీకరణ పత్రం", "డెత్ సర్టిఫికేట్",
      "मृत्यु प्रमाण पत्र", "डेथ सर्टिफिकेट",
    ],
  },
  {
    id: "driving-licence",
    aliases: [
      "driving licence", "driving license", "learner licence", "learner license",
      "డ్రైవింగ్ లైసెన్స్", "లెర్నర్ లైసెన్స్",
      "ड्राइविंग लाइसेंस", "लर्नर लाइसेंस",
    ],
  },
  {
    id: "pan",
    aliases: [
      "pan card", "pan",
      "పాన్ కార్డు", "పాన్ కార్డ్",
      "पैन कार्ड", "पैन",
    ],
  },
  {
    id: "voter-id",
    aliases: [
      "voter id", "voter card", "epic",
      "ఓటర్ ఐడి", "వోటర్ ఐడి", "ఓటర్ కార్డు",
      "वोटर आईडी", "वोटर कार्ड",
    ],
  },
  {
    id: "ration-card",
    aliases: [
      "ration card", "food security card",
      "రేషన్ కార్డు", "రేషన్ కార్డ్",
      "राशन कार्ड",
    ],
  },
  {
    id: "meeseva",
    aliases: [
      "meeseva", "mee seva", "mee-seva",
      "మీసేవ", "మీ సేవ",
      "मी सेवा", "मीसेवा",
    ],
  },
  {
    id: "telangana-schemes",
    aliases: [
      "telangana scheme", "government scheme", "welfare scheme",
      "తెలంగాణ పథకాలు", "ప్రభుత్వ పథకాలు", "సంక్షేమ పథకాలు",
      "तेलंगाना योजना", "सरकारी योजना", "कल्याण योजना",
    ],
  },
];

export const TOPIC_ALIASES = [
  {
    topic: "steps",
    aliases: [
      "how to apply", "apply", "process", "steps", "procedure",
      "ఎలా అప్లై చేయాలి", "ఎలా దరఖాస్తు చేయాలి", "ప్రక్రియ", "అప్లై ఎలా",
      "कैसे आवेदन करें", "कैसे अप्लाई करें", "प्रक्रिया", "अप्लाई कैसे",
      "कैसे बनवाएं", "कैसे बनाएं", "कैसे मिलेगा", "कैसे बनता",
      "apply cheyadam", "ela apply", "apply kaise", "kaise apply",
      "ఎలా తీసుకోవాలి", "ఎలా పొందాలి",
    ],
  },
  {
    topic: "documents",
    aliases: [
      "documents", "required documents", "what documents",
      "ఏ డాక్యుమెంట్స్ కావాలి", "పత్రాలు", "అవసరమైన పత్రాలు", "documents enti",
      "कौन से दस्तावेज", "जरूरी दस्तावेज", "डॉक्यूमेंट्स", "documents kya",
      "दस्तावेज क्या हैं", "दस्तावेज क्या चाहिए", "कागज क्या चाहिए",
      "ఏం కావాలి", "ఏ పేపర్లు కావాలి",
    ],
  },
  {
    topic: "fees",
    aliases: [
      "fee", "fees", "cost", "charges", "how much",
      "ఫీజు", "ఎంత ఖర్చు", "ఖర్చు ఎంత", "fee entha", "entha fee", "ఫీజు ఎంత",
      "शुल्क", "फीस", "कितना खर्च", "fees kitni", "kitni fees", "फीस कितनी है", "कितना लगता",
    ],
  },
  {
    topic: "processing_time",
    aliases: [
      "how many days", "how long", "processing time", "time",
      "ఎన్ని రోజులు", "ఎంత సమయం", "ఎప్పుడు వస్తుంది", "enni rojulu",
      "कितने दिन", "कितना समय", "कब मिलेगा", "kitne din", "कितने दिन लगते",
    ],
  },
  {
    topic: "eligibility",
    aliases: [
      "eligibility", "who can apply", "eligible",
      "అర్హత", "ఎవరు అప్లై చేయవచ్చు", "eligibility enti",
      "पात्रता", "कौन आवेदन कर सकता है", "eligibility kya", "कौन अप्लाई कर सकता",
    ],
  },
  {
    topic: "address_change",
    aliases: [
      "address update", "change address", "address change", "update address",
      "అడ్రస్ అప్డేట్", "చిరునామా మార్చాలి", "అడ్రస్ మార్చాలి", "address marchali",
      "అడ్రస్", "చిరునామా", "address ela",
      "पता अपडेट", "पता बदलना", "एड्रेस चेंज", "address update kaise",
      "पता कैसे बदलें", "मोबाइल नंबर कैसे अपडेट", "मोबाइल अपडेट",
      "మొబైల్ నంబర్ అప్డేట్", "మొబైల్ మార్చాలి",
    ],
  },
  {
    topic: "name_change",
    aliases: [
      "name correction", "change name", "name change", "correct name",
      "పేరు మార్చాలి", "పేరు సరిచేయాలి", "name marchali",
      "नाम सुधार", "नाम बदलना", "name change kaise", "नाम कैसे बदलें",
    ],
  },
  {
    topic: "tracking",
    aliases: [
      "track", "status", "check status", "track application",
      "స్టేటస్ చెక్", "ట్రాక్ చేయాలి", "status check cheyali",
      "स्टेटस चेक", "ट्रैक करना", "status kaise check", "स्टेटस कैसे देखें",
    ],
  },
  {
    topic: "lost_document",
    aliases: [
      "lost", "duplicate", "replacement",
      "పోయింది", "డూప్లికేట్", "మళ్ళీ తీసుకోవాలి",
      "खो गया", "डुप्लिकेट", "गुम हो गया", "खो गया है",
    ],
  },
  {
    topic: "renewal",
    aliases: [
      "renew", "renewal", "expired",
      "రెన్యువల్", "ఎక్స్‌పైర్ అయింది",
      "रिन्यूअल", "एक्सपायर हो गया", "रिन्यू कैसे",
    ],
  },
  {
    topic: "portal",
    aliases: [
      "website", "portal", "official link", "where to apply",
      "వెబ్‌సైట్", "పోర్టల్", "ఎక్కడ అప్లై",
      "वेबसाइट", "पोर्टल", "कहाँ अप्लाई", "हेल्पलाइन", "हेल्पलाइन नंबर",
      "హెల్ప్‌లైన్", "హెల్ప్‌లైన్ నంబర్",
    ],
  },
];

/**
 * Detect canonical service from any language text.
 * @param {string} text — user message (any language)
 * @returns {string|null} — service ID or null
 */
export function detectMultilingualService(text) {
  const lower = text.toLowerCase();
  for (const entry of SERVICE_ALIASES) {
    for (const alias of entry.aliases) {
      if (lower.includes(alias.toLowerCase())) {
        return entry.id;
      }
    }
  }
  // Also check original text (for Unicode scripts without toLowerCase)
  for (const entry of SERVICE_ALIASES) {
    for (const alias of entry.aliases) {
      if (text.includes(alias)) {
        return entry.id;
      }
    }
  }
  return null;
}

/**
 * Detect canonical topic from any language text.
 * @param {string} text — user message (any language)
 * @returns {string|null} — topic/intent or null
 */
export function detectMultilingualTopic(text) {
  const lower = text.toLowerCase();
  for (const entry of TOPIC_ALIASES) {
    for (const alias of entry.aliases) {
      if (lower.includes(alias.toLowerCase()) || text.includes(alias)) {
        return entry.topic;
      }
    }
  }
  return null;
}
