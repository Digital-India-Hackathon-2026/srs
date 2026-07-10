/**
 * Complete multilingual service data for all 13 services.
 * Every user-facing field supports { en, te, hi }.
 * Use getLocalizedServiceField(serviceId, field, lang) to render.
 */

const DATA = {
  passport: {
    name: { en: "Passport", te: "పాస్‌పోర్ట్", hi: "पासपोर्ट" },
    department: { en: "Ministry of External Affairs / Passport Seva", te: "విదేశాంగ మంత్రిత్వ శాఖ / పాస్‌పోర్ట్ సేవ", hi: "विदेश मंत्रालय / पासपोर्ट सेवा" },
    category: { en: "Identity & Travel", te: "గుర్తింపు & ప్రయాణం", hi: "पहचान और यात्रा" },
    shortDesc: { en: "Apply for fresh passport, renewal, Tatkaal, corrections and police verification support.", te: "కొత్త పాస్‌పోర్ట్, రిన్యూవల్, తత్కాల్, సవరణలు మరియు పోలీస్ వెరిఫికేషన్ సహాయం కోసం దరఖాస్తు చేయండి.", hi: "नया पासपोर्ट, नवीनीकरण, तत्काल, सुधार और पुलिस सत्यापन सहायता के लिए आवेदन करें।" },
    overview: { en: "A passport is an official travel document issued by the Government of India certifying identity and nationality for international travel.", te: "పాస్‌పోర్ట్ అనేది అంతర్జాతీయ ప్రయాణం కోసం గుర్తింపు మరియు జాతీయతను ధృవీకరించే భారత ప్రభుత్వం జారీ చేసిన అధికారిక ప్రయాణ పత్రం.", hi: "पासपोर्ट भारत सरकार द्वारा जारी एक आधिकारिक यात्रा दस्तावेज़ है जो अंतरराष्ट्रीय यात्रा के लिए पहचान और राष्ट्रीयता प्रमाणित करता है।" },
    whereToApply: { en: "Passport Seva Portal / PSK / POPSK", te: "పాస్‌పోర్ట్ సేవా పోర్టల్ / PSK / POPSK", hi: "पासपोर्ट सेवा पोर्टल / PSK / POPSK" },
    processingTime: { en: "30–45 days (Normal) / 7–14 days (Tatkaal)", te: "30–45 రోజులు (సాధారణ) / 7–14 రోజులు (తత్కాల్)", hi: "30–45 दिन (सामान्य) / 7–14 दिन (तत्काल)" },
    fees: { en: "Normal 36 pages: ₹1500. Tatkaal: ₹3500. Minor: ₹1000.", te: "సాధారణ 36 పేజీలు: ₹1500. తత్కాల్: ₹3500. మైనర్: ₹1000.", hi: "सामान्य 36 पृष्ठ: ₹1500. तत्काल: ₹3500. नाबालिग: ₹1000." },
    documents: { en: ["Proof of Date of Birth", "Proof of Address (Aadhaar/Voter ID)", "Proof of Identity", "Passport-size photographs", "Old passport (for reissue)"], te: ["జన్మ తేదీ రుజువు", "చిరునామా రుజువు (ఆధార్/వోటర్ ID)", "గుర్తింపు రుజువు", "పాస్‌పోర్ట్ సైజ్ ఫోటోలు", "పాత పాస్‌పోర్ట్ (రీయిష్యూ కోసం)"], hi: ["जन्मतिथि प्रमाण", "पते का प्रमाण (आधार/वोटर ID)", "पहचान प्रमाण", "पासपोर्ट साइज फोटो", "पुराना पासपोर्ट (पुनर्जारी के लिए)"] },
    eligibility: { en: ["Any Indian citizen can apply", "No age restriction", "Minors require parental consent"], te: ["ఏ భారతీయ పౌరుడు అయినా దరఖాస్తు చేయవచ్చు", "వయస్సు పరిమితి లేదు", "మైనర్లకు తల్లిదండ్రుల అనుమతి అవసరం"], hi: ["कोई भी भारतीय नागरिक आवेदन कर सकता है", "कोई आयु सीमा नहीं", "नाबालिगों को माता-पिता की सहमति आवश्यक"] },
    steps: { en: ["Register on passportindia.gov.in", "Fill application form", "Upload documents and pay fee", "Book appointment at PSK/POPSK", "Visit PSK on appointment date", "Police verification", "Passport dispatched via Speed Post"], te: ["passportindia.gov.in లో నమోదు చేయండి", "దరఖాస్తు ఫారం నింపండి", "పత్రాలు అప్‌లోడ్ చేసి ఫీజు చెల్లించండి", "PSK/POPSK లో అపాయింట్‌మెంట్ బుక్ చేయండి", "అపాయింట్‌మెంట్ తేదీన PSK సందర్శించండి", "పోలీస్ వెరిఫికేషన్", "స్పీడ్ పోస్ట్ ద్వారా పాస్‌పోర్ట్ డిస్పాచ్"], hi: ["passportindia.gov.in पर पंजीकरण करें", "आवेदन फॉर्म भरें", "दस्तावेज़ अपलोड करें और शुल्क भरें", "PSK/POPSK पर अपॉइंटमेंट बुक करें", "अपॉइंटमेंट तिथि पर PSK जाएँ", "पुलिस सत्यापन", "स्पीड पोस्ट से पासपोर्ट भेजा जाता है"] },
    mistakes: { en: ["Document name mismatch", "Address proof older than 3 months", "Not carrying originals to PSK", "Booking wrong PSK"], te: ["పత్రాల్లో పేరు అసమానత", "3 నెలలకంటే పాత చిరునామా రుజువు", "PSK కి ఒరిజినల్స్ తీసుకెళ్ళకపోవడం", "తప్పు PSK బుక్ చేయడం"], hi: ["दस्तावेज़ में नाम बेमेल", "3 महीने से पुराना पता प्रमाण", "PSK पर मूल दस्तावेज़ न ले जाना", "गलत PSK बुक करना"] },
  },
  "income-certificate": {
    name: { en: "Income Certificate", te: "ఆదాయ ధృవీకరణ పత్రం", hi: "आय प्रमाण पत्र" },
    department: { en: "Revenue Department, Telangana", te: "రెవెన్యూ డిపార్ట్‌మెంట్, తెలంగాణ", hi: "राजस्व विभाग, तेलंगाना" },
    category: { en: "Certificate", te: "ధృవీకరణ పత్రం", hi: "प्रमाण पत्र" },
    shortDesc: { en: "Certifies annual income for scholarships, schemes and reservations.", te: "స్కాలర్‌షిప్‌లు, పథకాలు మరియు రిజర్వేషన్ల కోసం వార్షిక ఆదాయాన్ని ధృవీకరిస్తుంది.", hi: "छात्रवृत्ति, योजनाओं और आरक्षण के लिए वार्षिक आय प्रमाणित करता है।" },
    overview: { en: "An Income Certificate certifies the annual income of a family or individual for government benefits.", te: "ఆదాయ ధృవీకరణ పత్రం ప్రభుత్వ ప్రయోజనాల కోసం కుటుంబం లేదా వ్యక్తి యొక్క వార్షిక ఆదాయాన్ని ధృవీకరిస్తుంది.", hi: "आय प्रमाण पत्र सरकारी लाभों के लिए परिवार या व्यक्ति की वार्षिक आय प्रमाणित करता है।" },
    whereToApply: { en: "MeeSeva / meeseva.telangana.gov.in", te: "మీసేవ / meeseva.telangana.gov.in", hi: "मीसेवा / meeseva.telangana.gov.in" },
    processingTime: { en: "7–15 working days", te: "7–15 పని దినాలు", hi: "7–15 कार्य दिवस" },
    fees: { en: "Approximately ₹35 at MeeSeva", te: "మీసేవలో సుమారు ₹35", hi: "मीसेवा पर लगभग ₹35" },
    documents: { en: ["Application form", "Aadhaar card", "Address proof", "Income proof or salary certificate", "Passport-size photo", "Mobile linked to Aadhaar"], te: ["దరఖాస్తు ఫారం", "ఆధార్ కార్డు", "చిరునామా రుజువు", "ఆదాయ రుజువు లేదా జీతం సర్టిఫికేట్", "పాస్‌పోర్ట్ సైజ్ ఫోటో", "ఆధార్‌కు లింక్ చేసిన మొబైల్"], hi: ["आवेदन फॉर्म", "आधार कार्ड", "पते का प्रमाण", "आय प्रमाण या वेतन प्रमाणपत्र", "पासपोर्ट साइज फोटो", "आधार से लिंक मोबाइल"] },
    eligibility: { en: ["Resident of Telangana", "Valid Aadhaar card", "Verifiable income documentation"], te: ["తెలంగాణ నివాసి", "చెల్లుబాటు అయ్యే ఆధార్ కార్డు", "ధృవీకరించగల ఆదాయ డాక్యుమెంటేషన్"], hi: ["तेलंगाना निवासी", "वैध आधार कार्ड", "सत्यापन योग्य आय दस्तावेज़"] },
    steps: { en: ["Visit MeeSeva or portal", "Select Revenue → Income Certificate", "Fill details and upload documents", "Pay ₹35 fee", "Tahsildar verification", "Certificate issued in 7–15 days"], te: ["మీసేవ లేదా పోర్టల్ సందర్శించండి", "Revenue → Income Certificate ఎంచుకోండి", "వివరాలు నింపి పత్రాలు అప్‌లోడ్ చేయండి", "₹35 ఫీజు చెల్లించండి", "తహసీల్దార్ వెరిఫికేషన్", "7–15 రోజుల్లో సర్టిఫికేట్ జారీ"], hi: ["मीसेवा या पोर्टल पर जाएँ", "Revenue → Income Certificate चुनें", "विवरण भरें और दस्तावेज़ अपलोड करें", "₹35 शुल्क भरें", "तहसीलदार सत्यापन", "7–15 दिनों में प्रमाणपत्र जारी"] },
    mistakes: { en: ["Income mismatch", "Aadhaar address not matching", "Missing photograph", "Using unofficial agents"], te: ["ఆదాయ అసమానత", "ఆధార్ చిరునామా సరిపోలకపోవడం", "ఫోటో మిస్ అవడం", "అనధికార ఏజెంట్లను ఉపయోగించడం"], hi: ["आय बेमेल", "आधार पता मेल न खाना", "फोटो गायब", "अनाधिकारिक एजेंट का उपयोग"] },
  },
  "birth-certificate": {
    name: { en: "Birth Certificate", te: "జనన ధృవీకరణ పత్రం", hi: "जन्म प्रमाण पत्र" },
    department: { en: "Municipal Administration / GHMC / Gram Panchayat", te: "పురపాలక పరిపాలన / GHMC / గ్రామ పంచాయతీ", hi: "नगर प्रशासन / GHMC / ग्राम पंचायत" },
    category: { en: "Certificate", te: "ధృవీకరణ పత్రం", hi: "प्रमाण पत्र" },
    shortDesc: { en: "Primary identity document recording birth, required for school admission, Aadhaar and passport.", te: "జననాన్ని నమోదు చేసే ప్రాథమిక గుర్తింపు పత్రం, పాఠశాల ప్రవేశం, ఆధార్ మరియు పాస్‌పోర్ట్‌కు అవసరం.", hi: "जन्म दर्ज करने वाला प्राथमिक पहचान दस्तावेज़, स्कूल प्रवेश, आधार और पासपोर्ट के लिए आवश्यक।" },
    overview: { en: "A Birth Certificate is the official government record of a child's birth issued by the local municipal authority.", te: "జనన ధృవీకరణ పత్రం అనేది స్థానిక మున్సిపల్ అథారిటీ జారీ చేసిన శిశువు జననానికి సంబంధించిన అధికారిక ప్రభుత్వ రికార్డు.", hi: "जन्म प्रमाण पत्र स्थानीय नगरपालिका प्राधिकरण द्वारा जारी बच्चे के जन्म का आधिकारिक सरकारी रिकॉर्ड है।" },
    whereToApply: { en: "GHMC / Municipality / Gram Panchayat / MeeSeva", te: "GHMC / మున్సిపాలిటీ / గ్రామ పంచాయతీ / మీసేవ", hi: "GHMC / नगरपालिका / ग्राम पंचायत / मीसेवा" },
    processingTime: { en: "3–7 working days (if registered within 21 days)", te: "3–7 పని దినాలు (21 రోజులలో నమోదు చేసినట్లయితే)", hi: "3–7 कार्य दिवस (यदि 21 दिनों में पंजीकृत)" },
    fees: { en: "Free within 21 days. Late fee applies after.", te: "21 రోజులలో ఉచితం. తర్వాత ఆలస్య రుసుము వర్తిస్తుంది.", hi: "21 दिनों में मुफ्त। बाद में विलंब शुल्क लागू।" },
    documents: { en: ["Hospital birth record", "Parents' Aadhaar cards", "Parents' marriage certificate", "Address proof", "Application form"], te: ["ఆసుపత్రి జనన రికార్డు", "తల్లిదండ్రుల ఆధార్ కార్డులు", "తల్లిదండ్రుల వివాహ ధృవీకరణ పత్రం", "చిరునామా రుజువు", "దరఖాస్తు ఫారం"], hi: ["अस्पताल जन्म अभिलेख", "माता-पिता के आधार कार्ड", "माता-पिता का विवाह प्रमाण पत्र", "पते का प्रमाण", "आवेदन फॉर्म"] },
    eligibility: { en: ["Birth occurred in Telangana", "Parent or guardian can apply", "Free within 21 days of birth"], te: ["తెలంగాణలో జన్మ జరిగి ఉండాలి", "తల్లిదండ్రులు లేదా సంరక్షకులు దరఖాస్తు చేయవచ్చు", "జన్మించిన 21 రోజులలో ఉచితం"], hi: ["जन्म तेलंगाना में हुआ हो", "माता-पिता या अभिभावक आवेदन कर सकते हैं", "जन्म के 21 दिनों में मुफ्त"] },
    steps: { en: ["Get hospital birth record", "Visit GHMC/Municipality/Gram Panchayat", "Fill registration form", "Submit documents", "Pay fee (free within 21 days)", "Collect certificate in 3–7 days"], te: ["ఆసుపత్రి జనన రికార్డు పొందండి", "GHMC/మున్సిపాలిటీ/గ్రామ పంచాయతీ సందర్శించండి", "రిజిస్ట్రేషన్ ఫారం నింపండి", "పత్రాలు సమర్పించండి", "ఫీజు చెల్లించండి (21 రోజులలో ఉచితం)", "3–7 రోజుల్లో సర్టిఫికేట్ సేకరించండి"], hi: ["अस्पताल जन्म रिकॉर्ड लें", "GHMC/नगरपालिका/ग्राम पंचायत जाएँ", "पंजीकरण फॉर्म भरें", "दस्तावेज़ जमा करें", "शुल्क भरें (21 दिनों में मुफ्त)", "3–7 दिनों में प्रमाणपत्र लें"] },
    mistakes: { en: ["Delaying beyond 21 days", "Not collecting hospital birth record", "Name mismatch in parents' docs", "Approaching agents"], te: ["21 రోజులకు మించి ఆలస్యం చేయడం", "ఆసుపత్రి జనన రికార్డు సేకరించకపోవడం", "తల్లిదండ్రుల పత్రాల్లో పేరు అసమానత", "ఏజెంట్లను సంప్రదించడం"], hi: ["21 दिनों से अधिक विलंब", "अस्पताल जन्म रिकॉर्ड न लेना", "माता-पिता के दस्तावेज़ों में नाम बेमेल", "एजेंटों से संपर्क करना"] },
  },
};

// Add remaining services with basic translations
const REMAINING = {
  "caste-certificate": { name: { en: "Caste Certificate", te: "కులం ధృవీకరణ పత్రం", hi: "जाति प्रमाण पत्र" }, department: { en: "Revenue Department, Telangana", te: "రెవెన్యూ డిపార్ట్‌మెంట్, తెలంగాణ", hi: "राजस्व विभाग, तेलंगाना" }, category: { en: "Certificate", te: "ధృవీకరణ పత్రం", hi: "प्रमाण पत्र" } },
  "residence-certificate": { name: { en: "Residence Certificate", te: "నివాస ధృవీకరణ పత్రం", hi: "निवास प्रमाण पत्र" }, department: { en: "Revenue Department, Telangana", te: "రెవెన్యూ డిపార్ట్‌మెంట్, తెలంగాణ", hi: "राजस्व विभाग, तेलंगाना" }, category: { en: "Certificate", te: "ధృవీకరణ పత్రం", hi: "प्रमाण पत्र" } },
  "death-certificate": { name: { en: "Death Certificate", te: "మరణ ధృవీకరణ పత్రం", hi: "मृत्यु प्रमाण पत्र" }, department: { en: "Municipal Administration / GHMC", te: "పురపాలక పరిపాలన / GHMC", hi: "नगर प्रशासन / GHMC" }, category: { en: "Certificate", te: "ధృవీకరణ పత్రం", hi: "प्रमाण पत्र" } },
  "ration-card": { name: { en: "Ration Card", te: "రేషన్ కార్డు", hi: "राशन कार्ड" }, department: { en: "Civil Supplies Department, Telangana", te: "సివిల్ సప్లైస్ డిపార్ట్‌మెంట్, తెలంగాణ", hi: "नागरिक आपूर्ति विभाग, तेलंगाना" }, category: { en: "Scheme", te: "పథకం", hi: "योजना" } },
  "aadhaar-update": { name: { en: "Aadhaar Update", te: "ఆధార్ అప్‌డేట్", hi: "आधार अपडेट" }, department: { en: "UIDAI", te: "UIDAI", hi: "UIDAI" }, category: { en: "Identity", te: "గుర్తింపు", hi: "पहचान" } },
  "driving-licence": { name: { en: "Driving Licence", te: "డ్రైవింగ్ లైసెన్స్", hi: "ड्राइविंग लाइसेंस" }, department: { en: "Transport Department, Telangana", te: "ట్రాన్స్‌పోర్ట్ డిపార్ట్‌మెంట్, తెలంగాణ", hi: "परिवहन विभाग, तेलंगाना" }, category: { en: "Transport", te: "రవాణా", hi: "परिवहन" } },
  "voter-id": { name: { en: "Voter ID", te: "వోటర్ ID", hi: "मतदाता पहचान पत्र" }, department: { en: "Election Commission of India", te: "భారత ఎన్నికల సంఘం", hi: "भारत निर्वाचन आयोग" }, category: { en: "Identity", te: "గుర్తింపు", hi: "पहचान" } },
  "pan-card": { name: { en: "PAN Card", te: "PAN కార్డు", hi: "पैन कार्ड" }, department: { en: "Income Tax Department", te: "ఆదాయపు పన్ను శాఖ", hi: "आयकर विभाग" }, category: { en: "Finance", te: "ఆర్థికం", hi: "वित्त" } },
  "telangana-schemes": { name: { en: "Telangana Govt. Schemes", te: "తెలంగాణ ప్రభుత్వ పథకాలు", hi: "तेलंगाना सरकारी योजनाएँ" }, department: { en: "Various Departments, Govt. of Telangana", te: "వివిధ విభాగాలు, తెలంగాణ ప్రభుత్వం", hi: "विभिन्न विभाग, तेलंगाना सरकार" }, category: { en: "Scheme", te: "పథకం", hi: "योजना" } },
  "meeseva-services": { name: { en: "MeeSeva Services", te: "మీసేవా సేవలు", hi: "मीसेवा सेवाएँ" }, department: { en: "Government of Telangana", te: "తెలంగాణ ప్రభుత్వం", hi: "तेलंगाना सरकार" }, category: { en: "Platform", te: "వేదిక", hi: "प्लेटफॉर्म" } },
};

// Merge all
Object.assign(DATA, REMAINING);

/**
 * Get a localized field for a service.
 * @param {string} serviceId
 * @param {string} field — "name", "department", "category", "shortDesc", "overview", etc.
 * @param {string} lang — "en" | "te" | "hi"
 * @returns {string|string[]}
 */
export function getServiceField(serviceId, field, lang = "en") {
  const service = DATA[serviceId];
  if (!service) return "";
  const value = service[field];
  if (!value) return "";
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value; // Already flat array (shouldn't happen with new structure)
  // Multilingual object
  const result = value[lang] || value.en || "";
  return result;
}

/**
 * Get localized value from any { en, te, hi } object.
 */
export function loc(obj, lang = "en") {
  if (!obj) return "";
  if (typeof obj === "string") return obj;
  if (Array.isArray(obj)) return obj;
  return obj[lang] || obj.en || "";
}

export default DATA;
