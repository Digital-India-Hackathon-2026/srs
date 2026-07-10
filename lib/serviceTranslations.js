/**
 * Multilingual translations for all service data.
 * Used by getLocalizedValue(obj, lang) to render service names,
 * descriptions, departments, categories, etc. in the selected language.
 */

export const serviceNames = {
  passport: { en: "Passport", te: "పాస్‌పోర్ట్", hi: "पासपोर्ट" },
  "income-certificate": { en: "Income Certificate", te: "ఆదాయ ధృవీకరణ పత్రం", hi: "आय प्रमाण पत्र" },
  "caste-certificate": { en: "Caste Certificate", te: "కులం ధృవీకరణ పత్రం", hi: "जाति प्रमाण पत्र" },
  "residence-certificate": { en: "Residence Certificate", te: "నివాస ధృవీకరణ పత్రం", hi: "निवास प्रमाण पत्र" },
  "birth-certificate": { en: "Birth Certificate", te: "జనన ధృవీకరణ పత్రం", hi: "जन्म प्रमाण पत्र" },
  "death-certificate": { en: "Death Certificate", te: "మరణ ధృవీకరణ పత్రం", hi: "मृत्यु प्रमाण पत्र" },
  "ration-card": { en: "Ration Card", te: "రేషన్ కార్డు", hi: "राशन कार्ड" },
  "aadhaar-update": { en: "Aadhaar Update", te: "ఆధార్ అప్‌డేట్", hi: "आधार अपडेट" },
  "driving-licence": { en: "Driving Licence", te: "డ్రైవింగ్ లైసెన్స్", hi: "ड्राइविंग लाइसेंस" },
  "voter-id": { en: "Voter ID", te: "వోటర్ ID", hi: "मतदाता पहचान पत्र" },
  "pan-card": { en: "PAN Card", te: "PAN కార్డు", hi: "पैन कार्ड" },
  "telangana-schemes": { en: "Telangana Govt. Schemes", te: "తెలంగాణ ప్రభుత్వ పథకాలు", hi: "तेलंगाना सरकारी योजनाएँ" },
  "meeseva-services": { en: "MeeSeva Services", te: "మీసేవా సేవలు", hi: "मीसेवा सेवाएँ" },
};

export const serviceDepartments = {
  passport: { en: "Ministry of External Affairs / Passport Seva", te: "విదేశాంగ మంత్రిత్వ శాఖ / పాస్‌పోర్ట్ సేవ", hi: "विदेश मंत्रालय / पासपोर्ट सेवा" },
  "income-certificate": { en: "Revenue Department, Telangana", te: "రెవెన్యూ డిపార్ట్‌మెంట్, తెలంగాణ", hi: "राजस्व विभाग, तेलंगाना" },
  "caste-certificate": { en: "Revenue Department, Telangana", te: "రెవెన్యూ డిపార్ట్‌మెంట్, తెలంగాణ", hi: "राजस्व विभाग, तेलंगाना" },
  "residence-certificate": { en: "Revenue Department, Telangana", te: "రెవెన్యూ డిపార్ట్‌మెంట్, తెలంగాణ", hi: "राजस्व विभाग, तेलंगाना" },
  "birth-certificate": { en: "Municipal Administration / GHMC", te: "మునిసిపల్ అడ్మినిస్ట్రేషన్ / GHMC", hi: "नगर प्रशासन / GHMC" },
  "death-certificate": { en: "Municipal Administration / GHMC", te: "మునిసిపల్ అడ్మినిస్ట్రేషన్ / GHMC", hi: "नगर प्रशासन / GHMC" },
  "ration-card": { en: "Civil Supplies Department, Telangana", te: "సివిల్ సప్లైస్ డిపార్ట్‌మెంట్, తెలంగాణ", hi: "नागरिक आपूर्ति विभाग, तेलंगाना" },
  "aadhaar-update": { en: "UIDAI", te: "UIDAI", hi: "UIDAI" },
  "driving-licence": { en: "Transport Department, Telangana", te: "ట్రాన్స్‌పోర్ట్ డిపార్ట్‌మెంట్, తెలంగాణ", hi: "परिवहन विभाग, तेलंगाना" },
  "voter-id": { en: "Election Commission of India", te: "భారత ఎన్నికల సంఘం", hi: "भारत निर्वाचन आयोग" },
  "pan-card": { en: "Income Tax Department", te: "ఆదాయపు పన్ను శాఖ", hi: "आयकर विभाग" },
  "telangana-schemes": { en: "Various Departments, Govt. of Telangana", te: "వివిధ విభాగాలు, తెలంగాణ ప్రభుత్వం", hi: "विभिन्न विभाग, तेलंगाना सरकार" },
  "meeseva-services": { en: "Government of Telangana", te: "తెలంగాణ ప్రభుత్వం", hi: "तेलंगाना सरकार" },
};

export const serviceCategories = {
  "Identity & Travel": { en: "Identity & Travel", te: "గుర్తింపు & ప్రయాణం", hi: "पहचान और यात्रा" },
  Certificate: { en: "Certificate", te: "ధృవీకరణ పత్రం", hi: "प्रमाण पत्र" },
  Scheme: { en: "Scheme", te: "పథకం", hi: "योजना" },
  Identity: { en: "Identity", te: "గుర్తింపు", hi: "पहचान" },
  Transport: { en: "Transport", te: "రవాణా", hi: "परिवहन" },
  Finance: { en: "Finance", te: "ఆర్థికం", hi: "वित्त" },
  Platform: { en: "Platform", te: "వేదిక", hi: "प्लेटफॉर्म" },
};

export const serviceDescriptions = {
  passport: {
    en: "Apply for fresh passport, renewal, Tatkaal, minor passport, corrections, appointment guidance and police verification support.",
    te: "కొత్త పాస్‌పోర్ట్, రిన్యూవల్, తత్కాల్, మైనర్ పాస్‌పోర్ట్, సవరణలు, అపాయింట్‌మెంట్ మార్గదర్శకం మరియు పోలీస్ వెరిఫికేషన్ సహాయం కోసం దరఖాస్తు చేయండి.",
    hi: "नया पासपोर्ट, नवीनीकरण, तत्काल, नाबालिग पासपोर्ट, सुधार, अपॉइंटमेंट मार्गदर्शन और पुलिस सत्यापन सहायता के लिए आवेदन करें।",
  },
  "income-certificate": {
    en: "Certifies annual family/individual income for scholarships, schemes, reservations and government benefits.",
    te: "స్కాలర్‌షిప్‌లు, పథకాలు, రిజర్వేషన్లు మరియు ప్రభుత్వ ప్రయోజనాల కోసం వార్షిక కుటుంబ/వ్యక్తిగత ఆదాయాన్ని ధృవీకరిస్తుంది.",
    hi: "छात्रवृत्ति, योजनाओं, आरक्षण और सरकारी लाभों के लिए वार्षिक पारिवारिक/व्यक्तिगत आय प्रमाणित करता है।",
  },
  "caste-certificate": {
    en: "Certifies SC/ST/BC/OBC community for reservation benefits in education, employment and government schemes.",
    te: "విద్య, ఉద్యోగం మరియు ప్రభుత్వ పథకాలలో రిజర్వేషన్ ప్రయోజనాల కోసం SC/ST/BC/OBC సమాజాన్ని ధృవీకరిస్తుంది.",
    hi: "शिक्षा, रोजगार और सरकारी योजनाओं में आरक्षण लाभ के लिए SC/ST/BC/OBC समुदाय प्रमाणित करता है।",
  },
  "residence-certificate": {
    en: "Confirms permanent residence in Telangana for admissions, employment and government benefits.",
    te: "అడ్మిషన్లు, ఉద్యోగం మరియు ప్రభుత్వ ప్రయోజనాల కోసం తెలంగాణలో శాశ్వత నివాసాన్ని ధృవీకరిస్తుంది.",
    hi: "प्रवेश, रोजगार और सरकारी लाभों के लिए तेलंगाना में स्थायी निवास की पुष्टि करता है।",
  },
  "birth-certificate": {
    en: "Primary identity document recording birth, required for school admission, Aadhaar and passport.",
    te: "జననాన్ని నమోదు చేసే ప్రాథమిక గుర్తింపు పత్రం, పాఠశాల ప్రవేశం, ఆధార్ మరియు పాస్‌పోర్ట్‌కు అవసరం.",
    hi: "जन्म दर्ज करने वाला प्राथमिक पहचान दस्तावेज़, स्कूल प्रवेश, आधार और पासपोर्ट के लिए आवश्यक।",
  },
  "death-certificate": {
    en: "Official record of death for legal, property, insurance and succession purposes.",
    te: "న్యాయ, ఆస్తి, బీమా మరియు వారసత్వ ప్రయోజనాల కోసం మరణం యొక్క అధికారిక రికార్డు.",
    hi: "कानूनी, संपत्ति, बीमा और उत्तराधिकार उद्देश्यों के लिए मृत्यु का आधिकारिक रिकॉर्ड।",
  },
  "ration-card": {
    en: "Provides access to subsidised food grains under Public Distribution System.",
    te: "పబ్లిక్ డిస్ట్రిబ్యూషన్ సిస్టమ్ కింద సబ్సిడీ ఆహార ధాన్యాలకు ప్రాప్తిని అందిస్తుంది.",
    hi: "सार्वजनिक वितरण प्रणाली के तहत सब्सिडी वाले खाद्यान्न तक पहुँच प्रदान करता है।",
  },
  "aadhaar-update": {
    en: "Update demographic or biometric information in Aadhaar through official UIDAI channels.",
    te: "అధికారిక UIDAI ఛానెల్స్ ద్వారా ఆధార్‌లో డెమోగ్రాఫిక్ లేదా బయోమెట్రిక్ సమాచారాన్ని అప్‌డేట్ చేయండి.",
    hi: "आधिकारिक UIDAI चैनलों के माध्यम से आधार में जनसांख्यिकीय या बायोमेट्रिक जानकारी अपडेट करें।",
  },
  "driving-licence": {
    en: "Apply for Learner Licence, permanent DL, renewal, or duplicate through Telangana RTO.",
    te: "తెలంగాణ RTO ద్వారా లర్నర్ లైసెన్స్, శాశ్వత DL, రిన్యూవల్ లేదా డూప్లికేట్ కోసం దరఖాస్తు చేయండి.",
    hi: "तेलंगाना RTO के माध्यम से लर्नर लाइसेंस, स्थायी DL, नवीनीकरण या डुप्लिकेट के लिए आवेदन करें।",
  },
  "voter-id": {
    en: "Electoral Photo Identity Card for voting and widely accepted as identity proof.",
    te: "ఓటింగ్ కోసం ఎన్నికల ఫోటో గుర్తింపు కార్డు మరియు గుర్తింపు రుజువుగా విస్తృతంగా ఆమోదించబడింది.",
    hi: "मतदान के लिए चुनावी फोटो पहचान पत्र और पहचान प्रमाण के रूप में व्यापक रूप से स्वीकृत।",
  },
  "pan-card": {
    en: "Permanent Account Number for tax filing, banking, and financial transactions.",
    te: "పన్ను దాఖలు, బ్యాంకింగ్ మరియు ఆర్థిక లావాదేవీల కోసం శాశ్వత ఖాతా సంఖ్య.",
    hi: "कर दाखिल करने, बैंकिंग और वित्तीय लेनदेन के लिए स्थायी खाता संख्या।",
  },
  "telangana-schemes": {
    en: "Overview of welfare and development schemes by the Telangana government.",
    te: "తెలంగాణ ప్రభుత్వం ద్వారా సంక్షేమ మరియు అభివృద్ధి పథకాల అవలోకనం.",
    hi: "तेलंगाना सरकार की कल्याण और विकास योजनाओं का अवलोकन।",
  },
  "meeseva-services": {
    en: "Telangana's citizen service platform with 600+ services through 3500+ centres.",
    te: "3500+ కేంద్రాల ద్వారా 600+ సేవలతో తెలంగాణ పౌర సేవా వేదిక.",
    hi: "3500+ केंद्रों के माध्यम से 600+ सेवाओं के साथ तेलंगाना नागरिक सेवा मंच।",
  },
};

/**
 * Get a localized value from an object or return fallback.
 * @param {object|string} obj — { en, te, hi } or plain string
 * @param {string} lang — "en" | "te" | "hi"
 * @returns {string}
 */
export function getLocalizedServiceValue(obj, lang = "en") {
  if (!obj) return "";
  if (typeof obj === "string") return obj;
  return obj[lang] || obj.en || "";
}
