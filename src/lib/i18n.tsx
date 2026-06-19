import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export const LANGS = ["EN", "HI", "TA", "TE", "ML"] as const;
export type Lang = (typeof LANGS)[number];

type Dict = Record<string, string>;

const STRINGS: Record<Lang, Dict> = {
  EN: {
    "nav.assistant": "AI Assistant",
    "nav.weather": "Weather",
    "nav.disease": "Disease",
    "nav.market": "Market",
    "nav.schemes": "Schemes",
    "nav.signin": "Sign In",
    "hero.badge": "Intelligent Agriculture 2.0",
    "hero.title": "AgriAI Assist",
    "hero.titleAccent": "Smart Farmer Advisory",
    "hero.sub": "Optimize yields, diagnose diseases, and track real-time weather with your pocket-sized agronomist.",
    "cta.ask.title": "Ask AgriAI",
    "cta.ask.body": "Get instant answers about fertilizers, pests, and soil health.",
    "cta.upload.title": "Upload Crop",
    "cta.upload.body": "Snap a photo to detect diseases with AI-powered accuracy.",
    "cta.weather.title": "Check Weather",
    "cta.weather.body": "Local village-level forecasting with precision rain alerts.",
    "weather.title": "Live Climate",
    "weather.humidity": "Humidity",
    "weather.wind": "Wind",
    "weather.norain": "No rain expected in next 48h",
    "weather.rainsoon": "Rain likely in next 48h — plan accordingly",
    "weather.locating": "Detecting your location…",
    "weather.setlocation": "Set a location on the Weather page",
    "page.assistant.title": "Ask AgriAI Anything",
    "page.assistant.subtitle": "Smart AI farming advice · replies in your language",
    "page.weather.title": "Live Climate & Weather",
    "page.weather.subtitle": "Search any village or city and sync it to the dashboard",
    "page.disease.title": "Crop Disease Detection",
    "page.disease.subtitle": "Upload a clear crop photo for AI diagnosis and treatment advice.",
    "page.market.title": "Market Prices",
    "page.market.subtitle": "Live mandi trends from across India",
    "page.schemes.title": "Government Schemes",
    "page.schemes.subtitle": "Search subsidies, insurance and farmer support programs.",
  },
  HI: {
    "nav.assistant": "एआई सहायक",
    "nav.weather": "मौसम",
    "nav.disease": "रोग",
    "nav.market": "मंडी",
    "nav.schemes": "योजनाएँ",
    "nav.signin": "साइन इन",
    "hero.badge": "बुद्धिमान कृषि 2.0",
    "hero.title": "एग्रीएआई असिस्ट",
    "hero.titleAccent": "स्मार्ट किसान सलाह",
    "hero.sub": "उपज बढ़ाएँ, रोग पहचानें और रीयल-टाइम मौसम ट्रैक करें — आपके जेब में कृषि विशेषज्ञ।",
    "cta.ask.title": "एग्रीएआई से पूछें",
    "cta.ask.body": "उर्वरक, कीट और मिट्टी पर तुरंत उत्तर पाएँ।",
    "cta.upload.title": "फसल अपलोड करें",
    "cta.upload.body": "फोटो लें और रोग की एआई पहचान पाएँ।",
    "cta.weather.title": "मौसम देखें",
    "cta.weather.body": "गाँव-स्तरीय पूर्वानुमान और सटीक वर्षा अलर्ट।",
    "weather.title": "लाइव मौसम",
    "weather.humidity": "नमी",
    "weather.wind": "हवा",
    "weather.norain": "अगले 48 घंटों में वर्षा नहीं",
    "weather.rainsoon": "अगले 48 घंटों में वर्षा संभव",
    "weather.locating": "स्थान खोज रहे हैं…",
    "weather.setlocation": "मौसम पेज पर स्थान चुनें",
    "page.assistant.title": "एग्रीएआई से कुछ भी पूछें",
    "page.assistant.subtitle": "स्मार्ट एआई कृषि सलाह · आपकी भाषा में उत्तर",
    "page.weather.title": "लाइव जलवायु और मौसम",
    "page.weather.subtitle": "गाँव या शहर खोजें और डैशबोर्ड से सिंक करें",
    "page.disease.title": "फसल रोग पहचान",
    "page.disease.subtitle": "एआई निदान और उपचार सलाह के लिए साफ फसल फोटो अपलोड करें।",
    "page.market.title": "मंडी भाव",
    "page.market.subtitle": "पूरे भारत की लाइव मंडी जानकारी",
    "page.schemes.title": "सरकारी योजनाएँ",
    "page.schemes.subtitle": "सब्सिडी, बीमा और किसान सहायता योजनाएँ खोजें।",
  },
  TA: {
    "nav.assistant": "AI உதவியாளர்",
    "nav.weather": "வானிலை",
    "nav.disease": "நோய்",
    "nav.market": "சந்தை",
    "nav.schemes": "திட்டங்கள்",
    "nav.signin": "உள்நுழைய",
    "hero.badge": "புத்திசாலி விவசாயம் 2.0",
    "hero.title": "AgriAI Assist",
    "hero.titleAccent": "ஸ்மார்ட் விவசாய ஆலோசனை",
    "hero.sub": "மகசூலை அதிகரிக்கவும், நோய்களைக் கண்டறியவும், நேரடி வானிலையை கண்காணிக்கவும்.",
    "cta.ask.title": "AgriAI-ஐக் கேளுங்கள்",
    "cta.ask.body": "உரம், பூச்சி, மண் பற்றிய உடனடி பதில்கள்.",
    "cta.upload.title": "பயிரை பதிவேற்றுக",
    "cta.upload.body": "புகைப்படத்துடன் நோய்களை AI மூலம் கண்டறியுங்கள்.",
    "cta.weather.title": "வானிலை பார்க்கவும்",
    "cta.weather.body": "கிராம அளவில் துல்லியமான மழை எச்சரிக்கைகள்.",
    "weather.title": "நேரடி வானிலை",
    "weather.humidity": "ஈரப்பதம்",
    "weather.wind": "காற்று",
    "weather.norain": "அடுத்த 48 மணி நேரத்தில் மழை இல்லை",
    "weather.rainsoon": "அடுத்த 48 மணி நேரத்தில் மழை சாத்தியம்",
    "weather.locating": "இடத்தை கண்டறிகிறோம்…",
    "weather.setlocation": "வானிலை பக்கத்தில் இடத்தை அமைக்கவும்",
    "page.assistant.title": "AgriAI-ஐ எதையும் கேளுங்கள்",
    "page.assistant.subtitle": "ஸ்மார்ட் AI விவசாய ஆலோசனை · உங்கள் மொழியில் பதில்கள்",
    "page.weather.title": "நேரடி காலநிலை & வானிலை",
    "page.weather.subtitle": "ஊர் அல்லது நகரத்தை தேடி டாஷ்போர்டுடன் ஒத்திசைக்கவும்",
    "page.disease.title": "பயிர் நோய் கண்டறிதல்",
    "page.disease.subtitle": "AI நோயறிதல் மற்றும் சிகிச்சை ஆலோசனைக்கு தெளிவான பயிர் புகைப்படத்தை பதிவேற்றவும்.",
    "page.market.title": "சந்தை விலைகள்",
    "page.market.subtitle": "இந்தியா முழுவதிலும் நேரடி மண்டி விலை போக்குகள்",
    "page.schemes.title": "அரசுத் திட்டங்கள்",
    "page.schemes.subtitle": "மானியம், காப்பீடு மற்றும் விவசாயி ஆதரவு திட்டங்களை தேடுங்கள்.",
  },
  TE: {
    "nav.assistant": "AI సహాయకుడు",
    "nav.weather": "వాతావరణం",
    "nav.disease": "వ్యాధి",
    "nav.market": "మార్కెట్",
    "nav.schemes": "పథకాలు",
    "nav.signin": "సైన్ ఇన్",
    "hero.badge": "తెలివైన వ్యవసాయం 2.0",
    "hero.title": "AgriAI Assist",
    "hero.titleAccent": "స్మార్ట్ రైతు సలహా",
    "hero.sub": "దిగుబడిని పెంచండి, వ్యాధులను గుర్తించండి, రియల్-టైమ్ వాతావరణాన్ని ట్రాక్ చేయండి.",
    "cta.ask.title": "AgriAI ని అడగండి",
    "cta.ask.body": "ఎరువులు, పురుగులు, నేలపై తక్షణ సమాధానాలు.",
    "cta.upload.title": "పంటను అప్‌లోడ్ చేయండి",
    "cta.upload.body": "ఫోటో తీసి AI ద్వారా వ్యాధులను గుర్తించండి.",
    "cta.weather.title": "వాతావరణం చూడండి",
    "cta.weather.body": "గ్రామ స్థాయి ఖచ్చితమైన వర్షపు హెచ్చరికలు.",
    "weather.title": "లైవ్ వాతావరణం",
    "weather.humidity": "తేమ",
    "weather.wind": "గాలి",
    "weather.norain": "తదుపరి 48 గంటల్లో వర్షం లేదు",
    "weather.rainsoon": "తదుపరి 48 గంటల్లో వర్షం అవకాశం",
    "weather.locating": "మీ స్థానాన్ని గుర్తిస్తోంది…",
    "weather.setlocation": "వాతావరణ పేజీలో స్థానం ఎంచుకోండి",
    "page.assistant.title": "AgriAI ని ఏదైనా అడగండి",
    "page.assistant.subtitle": "స్మార్ట్ AI వ్యవసాయ సలహా · మీ భాషలో జవాబులు",
    "page.weather.title": "లైవ్ వాతావరణం & క్లైమేట్",
    "page.weather.subtitle": "గ్రామం లేదా నగరాన్ని శోధించి డాష్‌బోర్డ్‌తో సింక్ చేయండి",
    "page.disease.title": "పంట వ్యాధి గుర్తింపు",
    "page.disease.subtitle": "AI నిర్ధారణ మరియు చికిత్స సలహా కోసం స్పష్టమైన పంట ఫోటోను అప్‌లోడ్ చేయండి.",
    "page.market.title": "మార్కెట్ ధరలు",
    "page.market.subtitle": "భారతదేశం అంతటా లైవ్ మండీ ధరల ట్రెండ్లు",
    "page.schemes.title": "ప్రభుత్వ పథకాలు",
    "page.schemes.subtitle": "సబ్సిడీలు, బీమా మరియు రైతు సహాయ పథకాలను శోధించండి.",
  },
  ML: {
    "nav.assistant": "AI സഹായി",
    "nav.weather": "കാലാവസ്ഥ",
    "nav.disease": "രോഗം",
    "nav.market": "മാർക്കറ്റ്",
    "nav.schemes": "പദ്ധതികൾ",
    "nav.signin": "സൈൻ ഇൻ",
    "hero.badge": "ബുദ്ധിമാൻ കൃഷി 2.0",
    "hero.title": "AgriAI Assist",
    "hero.titleAccent": "സ്മാർട്ട് കർഷക ഉപദേശം",
    "hero.sub": "വിളവ് വർദ്ധിപ്പിക്കുക, രോഗങ്ങൾ കണ്ടെത്തുക, തത്സമയ കാലാവസ്ഥ ട്രാക്ക് ചെയ്യുക.",
    "cta.ask.title": "AgriAI യോട് ചോദിക്കുക",
    "cta.ask.body": "വളം, കീടം, മണ്ണിനെ കുറിച്ച് ഉടനടി മറുപടി.",
    "cta.upload.title": "വിള അപ്‌ലോഡ് ചെയ്യുക",
    "cta.upload.body": "ഫോട്ടോ എടുത്ത് AI വഴി രോഗം കണ്ടെത്തുക.",
    "cta.weather.title": "കാലാവസ്ഥ പരിശോധിക്കുക",
    "cta.weather.body": "ഗ്രാമതലത്തിലുള്ള കൃത്യമായ മഴ മുന്നറിയിപ്പ്.",
    "weather.title": "തത്സമയ കാലാവസ്ഥ",
    "weather.humidity": "ഈർപ്പം",
    "weather.wind": "കാറ്റ്",
    "weather.norain": "അടുത്ത 48 മണിക്കൂറിൽ മഴ പ്രതീക്ഷിക്കുന്നില്ല",
    "weather.rainsoon": "അടുത്ത 48 മണിക്കൂറിൽ മഴ സാധ്യത",
    "weather.locating": "സ്ഥാനം കണ്ടെത്തുന്നു…",
    "weather.setlocation": "കാലാവസ്ഥ പേജിൽ സ്ഥാനം സജ്ജമാക്കുക",
    "page.assistant.title": "AgriAI-യോട് എന്തും ചോദിക്കുക",
    "page.assistant.subtitle": "സ്മാർട്ട് AI കാർഷിക ഉപദേശം · നിങ്ങളുടെ ഭാഷയിൽ മറുപടി",
    "page.weather.title": "തത്സമയ കാലാവസ്ഥയും ക്ലൈമറ്റും",
    "page.weather.subtitle": "ഗ്രാമമോ നഗരമോ തിരഞ്ഞ് ഡാഷ്ബോർഡുമായി സിങ്ക് ചെയ്യുക",
    "page.disease.title": "വിള രോഗനിർണ്ണയം",
    "page.disease.subtitle": "AI നിർണ്ണയത്തിനും ചികിത്സാ ഉപദേശത്തിനും വ്യക്തമായ വിള ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക.",
    "page.market.title": "മാർക്കറ്റ് വിലകൾ",
    "page.market.subtitle": "ഇന്ത്യയിലുടനീളമുള്ള തത്സമയ മണ്ടി വില പ്രവണതകൾ",
    "page.schemes.title": "സർക്കാർ പദ്ധതികൾ",
    "page.schemes.subtitle": "സബ്സിഡി, ഇൻഷുറൻസ്, കർഷക പിന്തുണ പദ്ധതികൾ തിരയുക.",
  },
};

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (key: string) => string };
const I18nCtx = createContext<Ctx>({ lang: "EN", setLang: () => {}, t: (k) => STRINGS.EN[k] ?? k });

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("EN");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? (localStorage.getItem("agriai_lang") as Lang | null) : null;
    if (saved && LANGS.includes(saved)) setLangState(saved);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const map: Record<Lang, string> = { EN: "en", HI: "hi", TA: "ta", TE: "te", ML: "ml" };
    document.documentElement.lang = map[lang];
    document.documentElement.dataset.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("agriai_lang", l);
    } catch {}
  }, []);

  const t = useCallback((key: string) => STRINGS[lang][key] ?? STRINGS.EN[key] ?? key, [lang]);

  return <I18nCtx.Provider value={{ lang, setLang, t }}>{children}</I18nCtx.Provider>;
}

export const useI18n = () => useContext(I18nCtx);
