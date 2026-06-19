const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type GeoResult = { name: string; country: string; admin1?: string; latitude: number; longitude: number };
type MarketCrop = { name: string; emoji: string; grade: string; price: number; change: number; spark: number[]; state: string; mandi: string };
type Scheme = { tag: string; tone: "primary" | "sky" | "amber"; title: string; body: string; eligibility: string; benefits: string; url: string };

const FALLBACK_PLACES: GeoResult[] = [
  { name: "New Delhi", admin1: "Delhi", country: "India", latitude: 28.6139, longitude: 77.209 },
  { name: "Ludhiana", admin1: "Punjab", country: "India", latitude: 30.901, longitude: 75.8573 },
  { name: "Coimbatore", admin1: "Tamil Nadu", country: "India", latitude: 11.0168, longitude: 76.9558 },
  { name: "Hyderabad", admin1: "Telangana", country: "India", latitude: 17.385, longitude: 78.4867 },
  { name: "Kochi", admin1: "Kerala", country: "India", latitude: 9.9312, longitude: 76.2673 },
  { name: "Nashik", admin1: "Maharashtra", country: "India", latitude: 19.9975, longitude: 73.7898 },
  { name: "Indore", admin1: "Madhya Pradesh", country: "India", latitude: 22.7196, longitude: 75.8577 },
  { name: "Guntur", admin1: "Andhra Pradesh", country: "India", latitude: 16.3067, longitude: 80.4365 },
];

const MARKET_SEED: MarketCrop[] = [
  { name: "Basmati Rice", emoji: "🌾", grade: "Grade A Premium", price: 4200, change: 2.4, spark: [38, 42, 40, 45, 48, 47, 52], state: "Punjab", mandi: "Karnal" },
  { name: "Paddy (Common)", emoji: "🌾", grade: "Common", price: 2320, change: 0.6, spark: [22, 22, 23, 23, 23, 23, 24], state: "West Bengal", mandi: "Burdwan" },
  { name: "Wheat (Sharbati)", emoji: "🌾", grade: "Sharbati", price: 2480, change: 1.2, spark: [22, 23, 22, 24, 25, 25, 26], state: "Madhya Pradesh", mandi: "Indore" },
  { name: "Wheat (Lokwan)", emoji: "🌾", grade: "Lokwan", price: 2560, change: 1.5, spark: [23, 23, 24, 24, 25, 25, 26], state: "Haryana", mandi: "Karnal" },
  { name: "Yellow Maize", emoji: "🌽", grade: "Common Grade", price: 2150, change: -0.8, spark: [24, 23, 22, 21, 22, 21, 21], state: "Karnataka", mandi: "Davangere" },
  { name: "Bajra", emoji: "🌾", grade: "Hybrid", price: 2380, change: 0.9, spark: [22, 23, 23, 23, 24, 24, 24], state: "Rajasthan", mandi: "Jodhpur" },
  { name: "Jowar", emoji: "🌾", grade: "Maldandi", price: 3120, change: 1.1, spark: [29, 30, 30, 31, 31, 31, 31], state: "Karnataka", mandi: "Bijapur" },
  { name: "Ragi", emoji: "🌾", grade: "Bold", price: 3680, change: 1.4, spark: [34, 35, 35, 36, 36, 37, 37], state: "Karnataka", mandi: "Bangalore" },
  { name: "Makhana", emoji: "🌰", grade: "Lawa", price: 9800, change: 2.0, spark: [94, 95, 96, 97, 97, 98, 98], state: "Bihar", mandi: "Darbhanga" },
  { name: "Tomato", emoji: "🍅", grade: "Hybrid F1", price: 1840, change: 5.1, spark: [12, 14, 13, 16, 17, 19, 21], state: "Maharashtra", mandi: "Nashik" },
  { name: "Tomato (Local)", emoji: "🍅", grade: "Local", price: 1620, change: 4.2, spark: [12, 13, 14, 14, 15, 16, 17], state: "Karnataka", mandi: "Kolar" },
  { name: "Cotton", emoji: "🤍", grade: "Long Staple", price: 7250, change: -1.4, spark: [78, 77, 76, 75, 74, 73, 72], state: "Gujarat", mandi: "Rajkot" },
  { name: "Cotton (Medium)", emoji: "🤍", grade: "Medium Staple", price: 6980, change: -1.1, spark: [74, 73, 73, 72, 71, 70, 70], state: "Telangana", mandi: "Warangal" },
  { name: "Onion", emoji: "🧅", grade: "Nashik Red", price: 1620, change: 3.2, spark: [14, 14, 15, 16, 17, 17, 18], state: "Maharashtra", mandi: "Lasalgaon" },
  { name: "Potato", emoji: "🥔", grade: "Jyoti", price: 1280, change: -2.1, spark: [15, 15, 14, 13, 13, 12, 12], state: "Uttar Pradesh", mandi: "Agra" },
  { name: "Potato (Chandramukhi)", emoji: "🥔", grade: "Chandramukhi", price: 1340, change: -1.6, spark: [15, 14, 14, 13, 13, 13, 13], state: "West Bengal", mandi: "Hooghly" },
  { name: "Soybean", emoji: "🫘", grade: "Yellow", price: 4480, change: 0.9, spark: [44, 44, 45, 44, 45, 45, 45], state: "Madhya Pradesh", mandi: "Ujjain" },
  { name: "Sugarcane", emoji: "🎋", grade: "Co-0238", price: 340, change: 0.4, spark: [33, 33, 34, 34, 34, 34, 34], state: "Uttar Pradesh", mandi: "Muzaffarnagar" },
  { name: "Sugarcane (Co-86032)", emoji: "🎋", grade: "Co-86032", price: 355, change: 0.7, spark: [34, 34, 34, 35, 35, 35, 36], state: "Bihar", mandi: "Gopalganj" },
  { name: "Groundnut", emoji: "🥜", grade: "Bold", price: 6320, change: 1.8, spark: [60, 61, 62, 61, 62, 63, 63], state: "Gujarat", mandi: "Junagadh" },
  { name: "Groundnut (Java)", emoji: "🥜", grade: "Java", price: 6180, change: 1.3, spark: [59, 60, 60, 61, 61, 61, 62], state: "Andhra Pradesh", mandi: "Anantapur" },
  { name: "Mustard", emoji: "🌼", grade: "Lohi Black", price: 5680, change: 1.6, spark: [54, 55, 55, 56, 56, 57, 57], state: "Rajasthan", mandi: "Sri Ganganagar" },
  { name: "Sunflower", emoji: "🌻", grade: "Hybrid", price: 6420, change: 0.5, spark: [62, 63, 63, 64, 64, 64, 64], state: "Karnataka", mandi: "Raichur" },
  { name: "Chilli", emoji: "🌶️", grade: "Teja S17", price: 18500, change: 4.3, spark: [170, 172, 175, 178, 181, 183, 185], state: "Andhra Pradesh", mandi: "Guntur" },
  { name: "Chilli (Byadgi)", emoji: "🌶️", grade: "Byadgi Dabbi", price: 22400, change: 5.1, spark: [205, 210, 213, 218, 222, 224, 226], state: "Karnataka", mandi: "Byadgi" },
  { name: "Turmeric", emoji: "🟡", grade: "Finger", price: 14200, change: -1.1, spark: [145, 144, 143, 142, 142, 141, 142], state: "Tamil Nadu", mandi: "Erode" },
  { name: "Turmeric (Nizamabad)", emoji: "🟡", grade: "Bulb", price: 13600, change: -0.8, spark: [138, 137, 137, 136, 136, 135, 136], state: "Telangana", mandi: "Nizamabad" },
  { name: "Coriander", emoji: "🌿", grade: "Eagle", price: 7240, change: 2.2, spark: [68, 69, 70, 71, 71, 72, 72], state: "Rajasthan", mandi: "Kota" },
  { name: "Cumin (Jeera)", emoji: "🌱", grade: "NCDEX", price: 28500, change: 3.6, spark: [265, 270, 273, 278, 281, 283, 285], state: "Gujarat", mandi: "Unjha" },
  { name: "Cardamom", emoji: "🟢", grade: "AGEB", price: 215000, change: -0.6, spark: [2170, 2165, 2160, 2160, 2155, 2150, 2150], state: "Kerala", mandi: "Bodinayakanur" },
  { name: "Black Pepper", emoji: "⚫", grade: "Garbled", price: 64500, change: 1.8, spark: [625, 628, 632, 638, 640, 644, 645], state: "Kerala", mandi: "Kochi" },
  { name: "Saffron", emoji: "🌺", grade: "Mongra", price: 285000, change: 1.2, spark: [2820, 2830, 2840, 2845, 2850, 2850, 2855], state: "Jammu & Kashmir", mandi: "Pampore" },
  { name: "Apple", emoji: "🍎", grade: "Royal Delicious", price: 8400, change: 2.1, spark: [80, 81, 82, 83, 83, 84, 84], state: "Himachal Pradesh", mandi: "Shimla" },
  { name: "Mango (Alphonso)", emoji: "🥭", grade: "Alphonso", price: 12500, change: 3.4, spark: [115, 118, 121, 122, 123, 124, 125], state: "Maharashtra", mandi: "Ratnagiri" },
  { name: "Banana", emoji: "🍌", grade: "Robusta", price: 1820, change: 1.0, spark: [17, 17, 18, 18, 18, 18, 18], state: "Tamil Nadu", mandi: "Theni" },
  { name: "Grapes", emoji: "🍇", grade: "Thompson Seedless", price: 6240, change: 2.6, spark: [58, 59, 60, 61, 61, 62, 62], state: "Maharashtra", mandi: "Sangli" },
  { name: "Pomegranate", emoji: "🔴", grade: "Bhagwa", price: 8950, change: 1.7, spark: [85, 86, 87, 88, 88, 89, 89], state: "Maharashtra", mandi: "Solapur" },
  { name: "Coconut", emoji: "🥥", grade: "Husked", price: 3650, change: 0.9, spark: [35, 35, 35, 36, 36, 36, 36], state: "Tamil Nadu", mandi: "Pollachi" },
  { name: "Rubber", emoji: "🟤", grade: "RSS-4", price: 18250, change: 1.2, spark: [178, 179, 180, 181, 182, 182, 182], state: "Kerala", mandi: "Kottayam" },
  { name: "Tea", emoji: "🍵", grade: "CTC Leaf", price: 22800, change: 0.7, spark: [225, 226, 227, 227, 228, 228, 228], state: "Assam", mandi: "Guwahati" },
  { name: "Jute", emoji: "🟫", grade: "TD-5", price: 5180, change: -0.5, spark: [52, 52, 52, 51, 51, 51, 51], state: "West Bengal", mandi: "Kolkata" },
  { name: "Tur Dal (Arhar)", emoji: "🫘", grade: "FAQ", price: 9650, change: 1.4, spark: [92, 93, 94, 95, 95, 96, 96], state: "Maharashtra", mandi: "Latur" },
  { name: "Urad Dal", emoji: "🫘", grade: "FAQ", price: 8480, change: 0.8, spark: [82, 83, 83, 84, 84, 84, 84], state: "Madhya Pradesh", mandi: "Indore" },
  { name: "Chana (Gram)", emoji: "🫘", grade: "Desi", price: 5380, change: -0.4, spark: [54, 54, 54, 53, 53, 53, 53], state: "Rajasthan", mandi: "Bikaner" },
  { name: "Litchi", emoji: "🔴", grade: "Shahi", price: 7250, change: 3.1, spark: [68, 69, 70, 71, 72, 72, 72], state: "Bihar", mandi: "Muzaffarpur" },
  { name: "Cashew", emoji: "🌰", grade: "W320", price: 78500, change: 0.6, spark: [780, 781, 783, 784, 785, 785, 785], state: "Odisha", mandi: "Jeypore" },
  { name: "Niger Seed", emoji: "🌻", grade: "Bold", price: 7820, change: 1.1, spark: [76, 77, 77, 78, 78, 78, 78], state: "Jharkhand", mandi: "Ranchi" },
  { name: "Mahua", emoji: "🌼", grade: "Dry", price: 3450, change: 0.4, spark: [33, 34, 34, 34, 34, 34, 34], state: "Chhattisgarh", mandi: "Raipur" },
  { name: "Walnut", emoji: "🌰", grade: "Kagzi", price: 9800, change: 1.5, spark: [94, 95, 96, 97, 97, 98, 98], state: "Uttarakhand", mandi: "Dehradun" },
  { name: "Tobacco", emoji: "🍂", grade: "FCV Bright", price: 18200, change: 0.9, spark: [178, 179, 180, 181, 181, 182, 182], state: "Andhra Pradesh", mandi: "Mysore" },
];

const SCHEMES: Scheme[] = [
  { tag: "Direct Benefit", tone: "primary", title: "PM-KISAN Nidhi", body: "Income support of ₹6,000 per year for all landholding farmers' families, paid in three equal installments.", eligibility: "All landholding farmer families with valid land records.", benefits: "₹2,000 every 4 months directly to bank account.", url: "https://pmkisan.gov.in/" },
  { tag: "Crop Insurance", tone: "sky", title: "Pradhan Mantri Fasal Bima Yojana", body: "Comprehensive crop insurance against natural calamities, pests and diseases.", eligibility: "All farmers growing notified crops in notified areas.", benefits: "Low premium with full sum insured on eligible loss.", url: "https://pmfby.gov.in/" },
  { tag: "Credit", tone: "amber", title: "Kisan Credit Card (KCC)", body: "Short-term credit at subsidized interest rates for cultivation, post-harvest and household needs.", eligibility: "Farmers, tenants, sharecroppers and SHGs.", benefits: "Loans up to ₹3 lakh at subsidized rates.", url: "https://www.myscheme.gov.in/schemes/kcc" },
  { tag: "Modernization", tone: "primary", title: "Sub-Mission on Agricultural Mechanization", body: "Subsidies on tractors, harvesters, and modern farm machinery for farmers and FPOs.", eligibility: "Individual farmers and Farmer Producer Organisations.", benefits: "40%–80% subsidy on eligible equipment.", url: "https://agrimachinery.nic.in/" },
  { tag: "Irrigation", tone: "sky", title: "PM Krishi Sinchayee Yojana", body: "Micro-irrigation and water-conservation infrastructure to ensure Har Khet Ko Pani.", eligibility: "All farmers with usable land.", benefits: "Up to 55% subsidy for small and marginal farmers.", url: "https://pmksy.gov.in/" },
  { tag: "Aerial", tone: "amber", title: "Drone Subsidy Scheme", body: "Financial assistance for purchase of agri-drones for spraying and crop monitoring.", eligibility: "FPOs, custom hiring centres and agri-graduates.", benefits: "Up to 75% subsidy, capped as per scheme rules.", url: "https://agriwelfare.gov.in/en/Major" },
  { tag: "Soil Health", tone: "primary", title: "Soil Health Card Scheme", body: "Free soil testing and customized nutrient recommendations for every farm holding.", eligibility: "All farmers across India.", benefits: "Free soil card with 12 parameters every 3 years.", url: "https://soilhealth.dac.gov.in/" },
  { tag: "Organic", tone: "sky", title: "Paramparagat Krishi Vikas Yojana", body: "Cluster-based promotion of organic farming with certification and marketing support.", eligibility: "Farmer groups of 20+ in a 20-hectare cluster.", benefits: "Financial support over 3 years for organic conversion.", url: "https://pgsindia-ncof.gov.in/pkvy/index.aspx" },
  { tag: "Marketing", tone: "amber", title: "e-NAM", body: "Pan-India electronic trading portal that networks agricultural mandis for a unified national market.", eligibility: "Registered farmers and traders.", benefits: "Better price discovery and transparent auctions.", url: "https://www.enam.gov.in/" },
];

const AI_GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MAX_HISTORY_MESSAGES = 16;
const MAX_TEXT_CHARS = 4000;
const MAX_IMAGE_DATA_URL_CHARS = 5_500_000;
const AI_TIMEOUT_MS = 42_000;

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}

function sanitizeUserText(input: string) {
  return input
    .replace(/```+/g, "")
    .replace(/<\/?(system|user|assistant|user_input|user_symptoms)[^>]*>/gi, "")
    .replace(/\b(ignore|disregard|forget)\b[^.\n]{0,80}\b(previous|prior|above|earlier)\b[^.\n]{0,80}\b(instructions?|prompts?|rules?)\b/gi, "[redacted]")
    .replace(/\b(system\s+prompt|developer\s+message)\b/gi, "[redacted]")
    .slice(0, 500);
}

function languageName(code?: string) {
  const map: Record<string, string> = { HI: "Hindi", TA: "Tamil", TE: "Telugu", ML: "Malayalam", EN: "English" };
  const raw = String(code ?? "EN");
  if (!/^[a-zA-Z-]{2,20}$/.test(raw)) return "English";
  return map[raw.toUpperCase()] ?? "English";
}

// Simple per-IP rate limiter for the AI `ask` action (in-memory; per-isolate)
const ASK_RATE_LIMIT = 12; // requests
const ASK_RATE_WINDOW_MS = 60_000; // per minute
const askHits = new Map<string, { count: number; resetAt: number }>();
function checkAskRateLimit(ip: string) {
  const now = Date.now();
  const entry = askHits.get(ip);
  if (!entry || entry.resetAt < now) {
    askHits.set(ip, { count: 1, resetAt: now + ASK_RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= ASK_RATE_LIMIT) return false;
  entry.count++;
  return true;
}
function clientIp(req: Request) {
  const xff = req.headers.get("x-forwarded-for") ?? "";
  return xff.split(",")[0].trim() || req.headers.get("cf-connecting-ip") || req.headers.get("x-real-ip") || "unknown";
}

function nearestFallback(latitude: number, longitude: number) {
  return FALLBACK_PLACES.reduce((best, place) => {
    const bestDistance = Math.hypot(best.latitude - latitude, best.longitude - longitude);
    const nextDistance = Math.hypot(place.latitude - latitude, place.longitude - longitude);
    return nextDistance < bestDistance ? place : best;
  }, FALLBACK_PLACES[0]);
}

function fallbackPlace(query: string) {
  const q = query.toLowerCase();
  return FALLBACK_PLACES.find((p) => q.includes(p.name.toLowerCase()) || q.includes((p.admin1 ?? "").toLowerCase())) ?? null;
}

function backupWeather(latitude: number, longitude: number) {
  const today = new Date();
  const seasonalBase = latitude > 24 ? 31 : 28;
  const offset = Math.round(Math.sin((latitude + longitude) / 12) * 3);
  const rainBase = latitude < 15 ? 58 : latitude < 23 ? 36 : 24;
  return {
    source: "backup",
    current: { temperature_2m: seasonalBase + offset, apparent_temperature: seasonalBase + offset + 1, relative_humidity_2m: Math.min(88, Math.max(38, rainBase + 18)), wind_speed_10m: Math.max(6, Math.round(10 + Math.abs(offset) * 2)), weather_code: rainBase > 45 ? 51 : 2 },
    daily: Array.from({ length: 7 }).reduce((acc, _, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() + index);
      const dayOffset = Math.round(Math.sin(index + latitude / 8) * 2);
      const rain = Math.min(90, Math.max(8, rainBase + index * 4 - Math.abs(offset) * 2));
      acc.time.push(date.toISOString().slice(0, 10));
      acc.weather_code.push(rain > 60 ? 61 : rain > 40 ? 51 : 2);
      acc.temperature_2m_max.push(seasonalBase + offset + dayOffset + 5);
      acc.temperature_2m_min.push(seasonalBase + offset + dayOffset - 4);
      acc.precipitation_probability_max.push(rain);
      return acc;
    }, { time: [] as string[], temperature_2m_max: [] as number[], temperature_2m_min: [] as number[], precipitation_probability_max: [] as number[], weather_code: [] as number[] }),
  };
}

async function fetchWithTimeout(url: string) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6000);
  try { return await fetch(url, { signal: controller.signal }); } finally { clearTimeout(timer); }
}

async function fetchJsonWithTimeout(url: string, init: RequestInit, timeoutMs: number) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

function safeMessages(messages: unknown[]) {
  return messages.slice(-MAX_HISTORY_MESSAGES).map((m) => {
    const item = m as { role?: string; content?: unknown };
    return {
      role: ["user", "assistant"].includes(String(item.role)) ? String(item.role) : "user",
      content: String(item.content ?? "").slice(0, MAX_TEXT_CHARS),
    };
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const body = await req.json().catch(() => ({}));
  const action = String(body.action ?? "");

  try {
    if (action === "geocode") {
      const query = String(body.query ?? "").trim().slice(0, 80);
      if (!query) return json({ place: null });
      const r = await fetchWithTimeout(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`);
      if (r.ok) return json({ place: ((await r.json()) as { results?: GeoResult[] }).results?.[0] ?? fallbackPlace(query) });
      return json({ place: fallbackPlace(query) });
    }

    if (action === "reverseGeocode") {
      const latitude = Number(body.latitude);
      const longitude = Number(body.longitude);
      const r = await fetchWithTimeout(`https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}&longitude=${longitude}&language=en&format=json`);
      if (r.ok) return json({ place: ((await r.json()) as { results?: GeoResult[] }).results?.[0] ?? nearestFallback(latitude, longitude) });
      return json({ place: nearestFallback(latitude, longitude) });
    }

    if (action === "weather") {
      const latitude = Number(body.latitude);
      const longitude = Number(body.longitude);
      const r = await fetchWithTimeout(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&forecast_days=7`);
      if (!r.ok) return json(backupWeather(latitude, longitude));
      const payload = await r.json();
      return json({ ...payload, source: "live" });
    }

    if (action === "market") {
      const state = String(body.state ?? "All");
      const sort = ["name", "price", "change"].includes(body.sort) ? body.sort : "change";
      const nonce = Number(body.nonce ?? 0);
      const query = String(body.query ?? "").trim().toLowerCase().slice(0, 80);
      const states = ["All", ...Array.from(new Set(MARKET_SEED.map((c) => c.state))).sort()];
      const crops = MARKET_SEED.map((c, i) => {
        const seed = (nonce * 7 + i * 11) % 17;
        const delta = (seed - 8) / 100;
        return { ...c, price: Math.max(50, Math.round(c.price * (1 + delta * 0.02))), change: +(c.change + delta).toFixed(2) };
      }).filter((c) => (!query || c.name.toLowerCase().includes(query) || c.mandi.toLowerCase().includes(query) || c.grade.toLowerCase().includes(query)) && (state === "All" || c.state === state))
        .sort((a, b) => sort === "name" ? a.name.localeCompare(b.name) : sort === "price" ? b.price - a.price : b.change - a.change);
      return json({ crops, states, updatedAt: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) });
    }

    if (action === "schemes") {
      const category = String(body.category ?? "All");
      const query = String(body.query ?? "").trim().toLowerCase().slice(0, 80);
      const categories = ["All", ...Array.from(new Set(SCHEMES.map((s) => s.tag)))];
      const schemes = SCHEMES.filter((s) => (!query || s.title.toLowerCase().includes(query) || s.body.toLowerCase().includes(query) || s.tag.toLowerCase().includes(query)) && (category === "All" || s.tag === category));
      return json({ schemes, categories });
    }

    if (action === "ask") {
      if (!checkAskRateLimit(clientIp(req))) {
        return json({ reply: "Too many requests. Please wait a moment and try again.", error: "rate_limited" }, 429);
      }
      const lovableKey = Deno.env.get("LOVABLE_API_KEY");
      const geminiKey = Deno.env.get("GEMINI_API_KEY");
      if (!lovableKey && !geminiKey) return json({ reply: "AI is not configured. Please contact the administrator.", error: "missing_key" });

      const messages = Array.isArray(body.messages) ? safeMessages(body.messages) : [];
      const last = messages[messages.length - 1] ?? { role: "user", content: "" };
      const safeText = `<user_input>${sanitizeUserText(String(last.content ?? ""))}</user_input>${body.crop ? `\n<crop>${String(body.crop).slice(0, 40)}</crop>` : ""}${body.userSymptoms ? `\n<user_symptoms>${sanitizeUserText(String(body.userSymptoms))}</user_symptoms>` : ""}`;
      const imageDataUrl = typeof body.imageDataUrl === "string" && /^data:image\/(png|jpeg|jpg|webp);base64,/.test(body.imageDataUrl)
        ? body.imageDataUrl.slice(0, MAX_IMAGE_DATA_URL_CHARS)
        : undefined;

      const systemPrompt = `You are AgriAI Assist, an expert advisor for Indian farmers with deep knowledge of every Indian state, district, agro-climatic zone, soil type (alluvial, black/regur, red, laterite, desert, mountain, peaty), monsoon patterns (SW & NE), kharif/rabi/zaid seasons, irrigation systems, IPM, organic practices, post-harvest, mandi prices, MSP, and all major central + state government schemes (PM-KISAN, PMFBY, KCC, PMKSY, PKVY, Soil Health Card, e-NAM, state-level schemes like Rythu Bandhu, KALIA, Krushak Assistance, Mukhyamantri Krishi Ashirwad, etc.).

Always:
- Give region-specific, district-aware advice when location is mentioned.
- Tailor recommendations to local soil, climate, rainfall and water availability.
- Include concrete numbers: seed rate (kg/acre), fertilizer dose (NPK kg/acre), spacing, irrigation interval, expected yield, current approximate price range.
- Mention cultivar/variety names suited to the region (e.g., PB-1121 basmati in Punjab/Haryana, MTU-1010 paddy in AP/Telangana, JS-335 soybean in MP).
- For pests/diseases: name pathogen, symptoms, organic option first, then chemical with dose & PHI; note when to consult KVK/Krishi Vigyan Kendra.
- For schemes: state eligibility, benefit amount, how to apply, official portal URL.
- Use bullet points and short paragraphs. Be practical, never refuse a farming question.
- For disease photos, give the most likely diagnosis with confidence level; if low, recommend KVK confirmation before chemicals.

Reply in ${languageName(body.language)}.`;

      const chatMessages = [
        { role: "system", content: systemPrompt },
        ...messages.slice(0, -1),
        imageDataUrl
          ? { role: "user", content: [{ type: "text", text: safeText }, { type: "image_url", image_url: { url: imageDataUrl } }] }
          : { role: "user", content: safeText },
      ];

      // Try Lovable AI Gateway first
      if (lovableKey) {
        try {
          const ai = await fetchJsonWithTimeout(AI_GATEWAY_URL, {
            method: "POST",
            headers: { "Lovable-API-Key": lovableKey, "X-Lovable-AIG-SDK": "edge-function", "Content-Type": "application/json" },
            body: JSON.stringify({ model: "google/gemini-3-flash-preview", messages: chatMessages }),
          }, AI_TIMEOUT_MS);
          if (ai.ok) {
            const data = await ai.json();
            const reply = data.choices?.[0]?.message?.content?.trim();
            if (reply) return json({ reply, error: null });
          } else if (ai.status === 429 && !geminiKey) {
            return json({ reply: "Too many requests. Please try again in a moment.", error: "rate_limited" });
          } else {
            const detail = await ai.text().catch(() => "");
            console.error("Lovable AI failed", ai.status, detail.slice(0, 300), "— falling back to Gemini");
          }
        } catch (e) {
          console.error("Lovable AI threw, falling back to Gemini:", e);
        }
      }

      // Fallback: Google AI Studio Gemini API (free tier, generous quota)
      if (geminiKey) {
        try {
          const geminiContents: unknown[] = [];
          for (const m of messages.slice(0, -1)) {
            geminiContents.push({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: String(m.content) }] });
          }
          const lastParts: unknown[] = [{ text: safeText }];
          if (imageDataUrl) {
            const match = imageDataUrl.match(/^data:(image\/[a-z]+);base64,(.+)$/);
            if (match) lastParts.push({ inline_data: { mime_type: match[1], data: match[2] } });
          }
          geminiContents.push({ role: "user", parts: lastParts });

          const gr = await fetchJsonWithTimeout(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                system_instruction: { parts: [{ text: systemPrompt }] },
                contents: geminiContents,
                generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
              }),
            },
            AI_TIMEOUT_MS,
          );
          if (!gr.ok) {
            const detail = await gr.text().catch(() => "");
            console.error("Gemini fallback error", gr.status, detail.slice(0, 500));
            return json({ reply: "Sorry, the assistant is temporarily unavailable. Please try again shortly.", error: "gateway_error" });
          }
          const gd = await gr.json();
          const reply = gd?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? "").join("").trim();
          return json({ reply: reply || "I couldn't generate a response. Please try again.", error: null });
        } catch (e) {
          console.error("Gemini fallback threw:", e);
          return json({ reply: "Network error reaching the assistant.", error: "network_error" });
        }
      }

      return json({ reply: "AI usage quota exhausted. Please add credits to your workspace.", error: "payment_required" });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (error) {
    console.error(error);
    if (action === "ask") return json({ reply: "The AI backend took too long or had a network issue. Please try again.", error: "network_error" }, 200);
    return json({ error: "Request failed" }, 500);
  }
});