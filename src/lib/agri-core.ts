export type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

export type GeoResult = {
  name: string;
  country: string;
  admin1?: string;
  latitude: number;
  longitude: number;
};

export type WeatherData = {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    weather_code: number;
    apparent_temperature: number;
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
    weather_code: number[];
  };
  source: "live" | "backup";
};

export type MarketCrop = {
  name: string;
  emoji: string;
  grade: string;
  price: number;
  change: number;
  spark: number[];
  state: string;
  mandi: string;
};

export type Scheme = {
  tag: string;
  tone: "primary" | "sky" | "amber";
  title: string;
  body: string;
  eligibility: string;
  benefits: string;
  url: string;
};

export const ALLOWED_CROPS = ["Rice", "Wheat", "Tomato", "Cotton", "Onion", "Potato", "Maize", "Sugarcane"] as const;

export const FALLBACK_PLACES: GeoResult[] = [
  { name: "New Delhi", admin1: "Delhi", country: "India", latitude: 28.6139, longitude: 77.209 },
  { name: "Ludhiana", admin1: "Punjab", country: "India", latitude: 30.901, longitude: 75.8573 },
  { name: "Coimbatore", admin1: "Tamil Nadu", country: "India", latitude: 11.0168, longitude: 76.9558 },
  { name: "Hyderabad", admin1: "Telangana", country: "India", latitude: 17.385, longitude: 78.4867 },
  { name: "Kochi", admin1: "Kerala", country: "India", latitude: 9.9312, longitude: 76.2673 },
  { name: "Nashik", admin1: "Maharashtra", country: "India", latitude: 19.9975, longitude: 73.7898 },
  { name: "Indore", admin1: "Madhya Pradesh", country: "India", latitude: 22.7196, longitude: 75.8577 },
  { name: "Guntur", admin1: "Andhra Pradesh", country: "India", latitude: 16.3067, longitude: 80.4365 },
];

export const MARKET_SEED: MarketCrop[] = [
  { name: "Basmati Rice", emoji: "🌾", grade: "Grade A Premium", price: 4200, change: 2.4, spark: [38, 42, 40, 45, 48, 47, 52], state: "Punjab", mandi: "Karnal" },
  { name: "Paddy (Common)", emoji: "🌾", grade: "Common", price: 2320, change: 0.6, spark: [22, 22, 23, 23, 23, 23, 24], state: "West Bengal", mandi: "Burdwan" },
  { name: "Wheat", emoji: "🌾", grade: "Sharbati", price: 2480, change: 1.2, spark: [22, 23, 22, 24, 25, 25, 26], state: "Madhya Pradesh", mandi: "Indore" },
  { name: "Wheat (Lokwan)", emoji: "🌾", grade: "Lokwan", price: 2560, change: 1.5, spark: [23, 23, 24, 24, 25, 25, 26], state: "Maharashtra", mandi: "Latur" },
  { name: "Yellow Maize", emoji: "🌽", grade: "Common Grade", price: 2150, change: -0.8, spark: [24, 23, 22, 21, 22, 21, 21], state: "Karnataka", mandi: "Davangere" },
  { name: "Bajra", emoji: "🌾", grade: "Hybrid", price: 2380, change: 0.9, spark: [22, 23, 23, 23, 24, 24, 24], state: "Rajasthan", mandi: "Jodhpur" },
  { name: "Jowar", emoji: "🌾", grade: "Maldandi", price: 3120, change: 1.1, spark: [29, 30, 30, 31, 31, 31, 31], state: "Karnataka", mandi: "Bijapur" },
  { name: "Ragi", emoji: "🌾", grade: "Bold", price: 3680, change: 1.4, spark: [34, 35, 35, 36, 36, 37, 37], state: "Karnataka", mandi: "Bangalore" },
  { name: "Tomato", emoji: "🍅", grade: "Hybrid F1", price: 1840, change: 5.1, spark: [12, 14, 13, 16, 17, 19, 21], state: "Maharashtra", mandi: "Nashik" },
  { name: "Tomato (Local)", emoji: "🍅", grade: "Local", price: 1620, change: 4.2, spark: [12, 13, 14, 14, 15, 16, 17], state: "Karnataka", mandi: "Kolar" },
  { name: "Cotton", emoji: "🤍", grade: "Long Staple", price: 7250, change: -1.4, spark: [78, 77, 76, 75, 74, 73, 72], state: "Gujarat", mandi: "Rajkot" },
  { name: "Cotton (Medium)", emoji: "🤍", grade: "Medium Staple", price: 6980, change: -1.1, spark: [74, 73, 73, 72, 71, 70, 70], state: "Telangana", mandi: "Warangal" },
  { name: "Onion", emoji: "🧅", grade: "Nashik Red", price: 1620, change: 3.2, spark: [14, 14, 15, 16, 17, 17, 18], state: "Maharashtra", mandi: "Lasalgaon" },
  { name: "Onion (Bellary)", emoji: "🧅", grade: "Bellary Red", price: 1480, change: 2.7, spark: [13, 13, 14, 14, 15, 15, 16], state: "Karnataka", mandi: "Bellary" },
  { name: "Potato", emoji: "🥔", grade: "Jyoti", price: 1280, change: -2.1, spark: [15, 15, 14, 13, 13, 12, 12], state: "Uttar Pradesh", mandi: "Agra" },
  { name: "Potato (Chandramukhi)", emoji: "🥔", grade: "Chandramukhi", price: 1340, change: -1.6, spark: [15, 14, 14, 13, 13, 13, 13], state: "West Bengal", mandi: "Hooghly" },
  { name: "Soybean", emoji: "🫘", grade: "Yellow", price: 4480, change: 0.9, spark: [44, 44, 45, 44, 45, 45, 45], state: "Madhya Pradesh", mandi: "Ujjain" },
  { name: "Sugarcane", emoji: "🎋", grade: "Co-0238", price: 340, change: 0.4, spark: [33, 33, 34, 34, 34, 34, 34], state: "Uttar Pradesh", mandi: "Muzaffarnagar" },
  { name: "Sugarcane (Co-86032)", emoji: "🎋", grade: "Co-86032", price: 355, change: 0.7, spark: [34, 34, 34, 35, 35, 35, 36], state: "Maharashtra", mandi: "Kolhapur" },
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
  { name: "Coconut", emoji: "🥥", grade: "Husked", price: 3650, change: 0.9, spark: [35, 35, 35, 36, 36, 36, 36], state: "Tamil Nadu", mandi: "Pollachi" },
  { name: "Rubber", emoji: "🟤", grade: "RSS-4", price: 18250, change: 1.2, spark: [178, 179, 180, 181, 182, 182, 182], state: "Kerala", mandi: "Kottayam" },
  { name: "Tea", emoji: "🍵", grade: "CTC Leaf", price: 22800, change: 0.7, spark: [225, 226, 227, 227, 228, 228, 228], state: "Assam", mandi: "Guwahati" },
  { name: "Jute", emoji: "🟫", grade: "TD-5", price: 5180, change: -0.5, spark: [52, 52, 52, 51, 51, 51, 51], state: "West Bengal", mandi: "Kolkata" },
  { name: "Apple", emoji: "🍎", grade: "Royal Delicious", price: 8400, change: 2.1, spark: [80, 81, 82, 83, 83, 84, 84], state: "Himachal Pradesh", mandi: "Shimla" },
  { name: "Mango", emoji: "🥭", grade: "Alphonso", price: 12500, change: 3.4, spark: [115, 118, 121, 122, 123, 124, 125], state: "Maharashtra", mandi: "Ratnagiri" },
  { name: "Banana", emoji: "🍌", grade: "Robusta", price: 1820, change: 1.0, spark: [17, 17, 18, 18, 18, 18, 18], state: "Tamil Nadu", mandi: "Theni" },
  { name: "Grapes", emoji: "🍇", grade: "Thompson Seedless", price: 6240, change: 2.6, spark: [58, 59, 60, 61, 61, 62, 62], state: "Maharashtra", mandi: "Sangli" },
  { name: "Pomegranate", emoji: "🔴", grade: "Bhagwa", price: 8950, change: 1.7, spark: [85, 86, 87, 88, 88, 89, 89], state: "Maharashtra", mandi: "Solapur" },
];

export const SCHEMES: Scheme[] = [
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

export const WMO: Record<number, string> = {
  0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast", 45: "Foggy", 48: "Rime fog",
  51: "Light drizzle", 53: "Drizzle", 55: "Heavy drizzle", 61: "Light rain", 63: "Rain", 65: "Heavy rain",
  71: "Light snow", 73: "Snow", 75: "Heavy snow", 80: "Showers", 81: "Heavy showers", 82: "Violent showers",
  95: "Thunderstorm", 96: "Thunderstorm + hail", 99: "Severe storm",
};

export function fallbackPlace(query: string) {
  const q = query.toLowerCase();
  return FALLBACK_PLACES.find((p) => q.includes(p.name.toLowerCase()) || q.includes((p.admin1 ?? "").toLowerCase())) ?? null;
}

export function nearestFallback(latitude: number, longitude: number) {
  return FALLBACK_PLACES.reduce((best, place) => {
    const bestDistance = Math.hypot(best.latitude - latitude, best.longitude - longitude);
    const nextDistance = Math.hypot(place.latitude - latitude, place.longitude - longitude);
    return nextDistance < bestDistance ? place : best;
  }, FALLBACK_PLACES[0]);
}

export function buildBackupWeather(latitude: number, longitude: number): WeatherData {
  const today = new Date();
  const seasonalBase = latitude > 24 ? 31 : 28;
  const offset = Math.round(Math.sin((latitude + longitude) / 12) * 3);
  const rainBase = latitude < 15 ? 58 : latitude < 23 ? 36 : 24;
  return {
    source: "backup",
    current: {
      temperature_2m: seasonalBase + offset,
      apparent_temperature: seasonalBase + offset + 1,
      relative_humidity_2m: Math.min(88, Math.max(38, rainBase + 18)),
      wind_speed_10m: Math.max(6, Math.round(10 + Math.abs(offset) * 2)),
      weather_code: rainBase > 45 ? 51 : 2,
    },
    daily: Array.from({ length: 7 }).reduce<WeatherData["daily"]>(
      (acc, _, index) => {
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
      },
      { time: [], temperature_2m_max: [], temperature_2m_min: [], precipitation_probability_max: [], weather_code: [] },
    ),
  };
}

export function getMarketSnapshot(input: { query?: string; state?: string; sort?: "name" | "price" | "change"; nonce?: number }) {
  const state = input.state ?? "All";
  const sort = input.sort ?? "change";
  const nonce = input.nonce ?? 0;
  const states = ["All", ...Array.from(new Set(MARKET_SEED.map((c) => c.state))).sort()];
  const q = (input.query ?? "").trim().toLowerCase();
  const crops = MARKET_SEED.map((c, i) => {
    const seed = (nonce * 7 + i * 11) % 17;
    const delta = (seed - 8) / 100;
    return { ...c, price: Math.max(50, Math.round(c.price * (1 + delta * 0.02))), change: +(c.change + delta).toFixed(2) };
  })
    .filter((c) => (!q || c.name.toLowerCase().includes(q) || c.mandi.toLowerCase().includes(q) || c.grade.toLowerCase().includes(q)) && (state === "All" || c.state === state))
    .sort((a, b) => (sort === "name" ? a.name.localeCompare(b.name) : sort === "price" ? b.price - a.price : b.change - a.change));
  return { crops, states, updatedAt: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) };
}

export function getSchemeSnapshot(input: { query?: string; category?: string }) {
  const category = input.category ?? "All";
  const categories = ["All", ...Array.from(new Set(SCHEMES.map((s) => s.tag)))];
  const q = (input.query ?? "").trim().toLowerCase();
  const schemes = SCHEMES.filter((s) => (!q || s.title.toLowerCase().includes(q) || s.body.toLowerCase().includes(q) || s.tag.toLowerCase().includes(q)) && (category === "All" || s.tag === category));
  return { schemes, categories };
}

export function languageName(code?: string): string {
  if (!code) return "English";
  return ({ HI: "Hindi", TA: "Tamil", TE: "Telugu", ML: "Malayalam", EN: "English" } as Record<string, string>)[code.toUpperCase()] ?? code;
}

export function sanitizeUserText(input: string): string {
  return input
    .replace(/```+/g, "")
    .replace(/<\/?(system|user|assistant|user_input|user_symptoms)[^>]*>/gi, "")
    .replace(/\b(ignore|disregard|forget)\b[^.\n]{0,80}\b(previous|prior|above|earlier)\b[^.\n]{0,80}\b(instructions?|prompts?|rules?)\b/gi, "[redacted]")
    .replace(/\b(system\s+prompt|developer\s+message)\b/gi, "[redacted]")
    .slice(0, 500);
}