import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

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

const MARKET_SEED: MarketCrop[] = [
  { name: "Basmati Rice", emoji: "🌾", grade: "Grade A Premium", price: 4200, change: 2.4, spark: [38, 42, 40, 45, 48, 47, 52], state: "Punjab", mandi: "Karnal" },
  { name: "Wheat", emoji: "🌾", grade: "Sharbati", price: 2480, change: 1.2, spark: [22, 23, 22, 24, 25, 25, 26], state: "Madhya Pradesh", mandi: "Indore" },
  { name: "Yellow Maize", emoji: "🌽", grade: "Common Grade", price: 2150, change: -0.8, spark: [24, 23, 22, 21, 22, 21, 21], state: "Karnataka", mandi: "Davangere" },
  { name: "Tomato", emoji: "🍅", grade: "Hybrid F1", price: 1840, change: 5.1, spark: [12, 14, 13, 16, 17, 19, 21], state: "Maharashtra", mandi: "Nashik" },
  { name: "Cotton", emoji: "🤍", grade: "Long Staple", price: 7250, change: -1.4, spark: [78, 77, 76, 75, 74, 73, 72], state: "Gujarat", mandi: "Rajkot" },
  { name: "Onion", emoji: "🧅", grade: "Nashik Red", price: 1620, change: 3.2, spark: [14, 14, 15, 16, 17, 17, 18], state: "Maharashtra", mandi: "Lasalgaon" },
  { name: "Potato", emoji: "🥔", grade: "Jyoti", price: 1280, change: -2.1, spark: [15, 15, 14, 13, 13, 12, 12], state: "Uttar Pradesh", mandi: "Agra" },
  { name: "Soybean", emoji: "🫘", grade: "Yellow", price: 4480, change: 0.9, spark: [44, 44, 45, 44, 45, 45, 45], state: "Madhya Pradesh", mandi: "Ujjain" },
  { name: "Sugarcane", emoji: "🎋", grade: "Co-0238", price: 340, change: 0.4, spark: [33, 33, 34, 34, 34, 34, 34], state: "Uttar Pradesh", mandi: "Muzaffarnagar" },
  { name: "Groundnut", emoji: "🥜", grade: "Bold", price: 6320, change: 1.8, spark: [60, 61, 62, 61, 62, 63, 63], state: "Gujarat", mandi: "Junagadh" },
  { name: "Chilli", emoji: "🌶️", grade: "Teja S17", price: 18500, change: 4.3, spark: [170, 172, 175, 178, 181, 183, 185], state: "Andhra Pradesh", mandi: "Guntur" },
  { name: "Turmeric", emoji: "🟡", grade: "Finger", price: 14200, change: -1.1, spark: [145, 144, 143, 142, 142, 141, 142], state: "Tamil Nadu", mandi: "Erode" },
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

const marketInput = z.object({
  query: z.string().max(80).optional().default(""),
  state: z.string().max(50).optional().default("All"),
  sort: z.enum(["name", "price", "change"]).optional().default("change"),
  nonce: z.number().int().min(0).max(10_000).optional().default(0),
});

const schemesInput = z.object({
  query: z.string().max(80).optional().default(""),
  category: z.string().max(50).optional().default("All"),
});

export const getMarketPrices = createServerFn({ method: "GET" })
  .inputValidator((data) => marketInput.parse(data ?? {}))
  .handler(async ({ data }) => {
    const states = ["All", ...Array.from(new Set(MARKET_SEED.map((c) => c.state))).sort()];
    const q = data.query.trim().toLowerCase();
    const crops = MARKET_SEED.map((c, i) => {
      const seed = (data.nonce * 7 + i * 11) % 17;
      const delta = (seed - 8) / 100;
      return { ...c, price: Math.max(50, Math.round(c.price * (1 + delta * 0.02))), change: +(c.change + delta).toFixed(2) };
    })
      .filter((c) => {
        const matchQ = !q || c.name.toLowerCase().includes(q) || c.mandi.toLowerCase().includes(q) || c.grade.toLowerCase().includes(q);
        const matchS = data.state === "All" || c.state === data.state;
        return matchQ && matchS;
      })
      .sort((a, b) => {
        if (data.sort === "name") return a.name.localeCompare(b.name);
        if (data.sort === "price") return b.price - a.price;
        return b.change - a.change;
      });

    return { crops, states, updatedAt: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) };
  });

export const getSchemes = createServerFn({ method: "GET" })
  .inputValidator((data) => schemesInput.parse(data ?? {}))
  .handler(async ({ data }) => {
    const categories = ["All", ...Array.from(new Set(SCHEMES.map((s) => s.tag)))];
    const q = data.query.trim().toLowerCase();
    const schemes = SCHEMES.filter((s) => {
      const matchQ = !q || s.title.toLowerCase().includes(q) || s.body.toLowerCase().includes(q) || s.tag.toLowerCase().includes(q);
      const matchC = data.category === "All" || s.tag === data.category;
      return matchQ && matchC;
    });
    return { schemes, categories };
  });