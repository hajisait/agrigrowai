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
  state?: string;
};

export const ALLOWED_CROPS = ["Rice", "Wheat", "Tomato", "Cotton", "Onion", "Potato", "Maize", "Sugarcane", "Brinjal", "Chilli", "Banana", "Groundnut", "Soybean", "Mango", "Grapes"] as const;

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
  // ===== Central / National schemes =====
  { tag: "Direct Benefit", tone: "primary", title: "PM-KISAN Nidhi", body: "Income support of ₹6,000 per year for all landholding farmers' families, paid in three equal installments.", eligibility: "All landholding farmer families with valid land records.", benefits: "₹2,000 every 4 months directly to bank account.", url: "https://pmkisan.gov.in/" },
  { tag: "Crop Insurance", tone: "sky", title: "Pradhan Mantri Fasal Bima Yojana", body: "Comprehensive crop insurance against natural calamities, pests and diseases.", eligibility: "All farmers growing notified crops in notified areas.", benefits: "Low premium with full sum insured on eligible loss.", url: "https://pmfby.gov.in/" },
  { tag: "Credit", tone: "amber", title: "Kisan Credit Card (KCC)", body: "Short-term credit at subsidized interest rates for cultivation, post-harvest and household needs.", eligibility: "Farmers, tenants, sharecroppers and SHGs.", benefits: "Loans up to ₹3 lakh at subsidized rates.", url: "https://www.myscheme.gov.in/schemes/kcc" },
  { tag: "Modernization", tone: "primary", title: "Sub-Mission on Agricultural Mechanization", body: "Subsidies on tractors, harvesters, and modern farm machinery for farmers and FPOs.", eligibility: "Individual farmers and Farmer Producer Organisations.", benefits: "40%–80% subsidy on eligible equipment.", url: "https://agrimachinery.nic.in/" },
  { tag: "Irrigation", tone: "sky", title: "PM Krishi Sinchayee Yojana", body: "Micro-irrigation and water-conservation infrastructure to ensure Har Khet Ko Pani.", eligibility: "All farmers with usable land.", benefits: "Up to 55% subsidy for small and marginal farmers.", url: "https://pmksy.gov.in/" },
  { tag: "Aerial", tone: "amber", title: "Drone Subsidy Scheme (Namo Drone Didi)", body: "Financial assistance for purchase of agri-drones for spraying and crop monitoring.", eligibility: "FPOs, custom hiring centres, SHGs and agri-graduates.", benefits: "Up to 80% subsidy (max ₹8 lakh) for Women SHGs.", url: "https://agriwelfare.gov.in/en/Major" },
  { tag: "Soil Health", tone: "primary", title: "Soil Health Card Scheme", body: "Free soil testing and customized nutrient recommendations for every farm holding.", eligibility: "All farmers across India.", benefits: "Free soil card with 12 parameters every 3 years.", url: "https://soilhealth.dac.gov.in/" },
  { tag: "Organic", tone: "sky", title: "Paramparagat Krishi Vikas Yojana (PKVY)", body: "Cluster-based promotion of organic farming with certification and marketing support.", eligibility: "Farmer groups of 20+ in a 20-hectare cluster.", benefits: "₹50,000/ha over 3 years for organic conversion.", url: "https://pgsindia-ncof.gov.in/pkvy/index.aspx" },
  { tag: "Marketing", tone: "amber", title: "e-NAM", body: "Pan-India electronic trading portal that networks agricultural mandis for a unified national market.", eligibility: "Registered farmers and traders.", benefits: "Better price discovery and transparent auctions.", url: "https://www.enam.gov.in/" },
  { tag: "Pension", tone: "primary", title: "PM Kisan Maan-Dhan Yojana", body: "Voluntary pension scheme for small and marginal farmers to secure old age.", eligibility: "SMF aged 18–40 with cultivable land ≤ 2 ha.", benefits: "₹3,000/month pension after age 60.", url: "https://maandhan.in/" },
  { tag: "FPO", tone: "sky", title: "Formation of 10,000 FPOs", body: "Formation and hand-holding of 10,000 new Farmer Producer Organisations.", eligibility: "Groups of farmers forming a registered FPO.", benefits: "Equity grant up to ₹15 lakh + credit guarantee ₹2 crore.", url: "https://sfacindia.com/FPOS.aspx" },
  { tag: "Storage", tone: "amber", title: "Agriculture Infrastructure Fund (AIF)", body: "₹1 lakh-crore financing facility for post-harvest infra: warehouses, cold storage, pack-houses.", eligibility: "Farmers, FPOs, PACS, agri-entrepreneurs, start-ups.", benefits: "3% interest subvention on loans up to ₹2 crore.", url: "https://agriinfra.dac.gov.in/" },
  { tag: "Horticulture", tone: "primary", title: "Mission for Integrated Development of Horticulture (MIDH)", body: "Holistic growth of horticulture — fruits, vegetables, flowers, spices, plantation crops.", eligibility: "Horticulture farmers, FPOs, entrepreneurs.", benefits: "40–50% subsidy on planting material, protected cultivation, PHM.", url: "https://midh.gov.in/" },
  { tag: "Dairy", tone: "sky", title: "Rashtriya Gokul Mission", body: "Conservation and development of indigenous bovine breeds for higher milk productivity.", eligibility: "Dairy farmers, breeders, gaushalas.", benefits: "Subsidised AI services, breed improvement, calf rearing.", url: "https://dahd.nic.in/schemes/programmes/rashtriya_gokul_mission" },
  { tag: "Fisheries", tone: "amber", title: "PM Matsya Sampada Yojana", body: "Blue revolution scheme for sustainable and inclusive fisheries development.", eligibility: "Fishers, fish farmers, fish workers, cooperatives.", benefits: "40–60% subsidy on ponds, cages, hatcheries, cold-chain.", url: "https://pmmsy.dof.gov.in/" },
  { tag: "Beekeeping", tone: "primary", title: "National Beekeeping & Honey Mission", body: "Promotion of scientific beekeeping to double farmers' income and increase pollination.", eligibility: "Beekeepers, SHGs, FPOs, KVKs.", benefits: "Subsidy on bee boxes, colonies, honey processing units.", url: "https://nbb.gov.in/" },
  { tag: "Seeds", tone: "sky", title: "Sub-Mission on Seed & Planting Material", body: "Ensures production and supply of quality seeds of improved varieties.", eligibility: "Seed growers, SAUs, KVKs, FPOs.", benefits: "Subsidy on seed production, storage, distribution.", url: "https://seednet.gov.in/" },

  // ===== Andhra Pradesh =====
  { tag: "Direct Benefit", tone: "primary", state: "Andhra Pradesh", title: "YSR Rythu Bharosa – PM KISAN", body: "State top-up over PM-KISAN for AP farmers including tenant and tribal cultivators.", eligibility: "Landholding, ST podu and tenant farmers in AP.", benefits: "₹13,500/year (₹7,500 state + ₹6,000 centre).", url: "https://ysrrythubharosa.ap.gov.in/" },
  { tag: "Insurance", tone: "sky", state: "Andhra Pradesh", title: "YSR Free Crop Insurance", body: "Zero-premium crop insurance for notified crops; state pays farmer's share.", eligibility: "All e-crop registered farmers in AP.", benefits: "Full sum insured with zero premium.", url: "https://apagrisnet.gov.in/" },

  // ===== Telangana =====
  { tag: "Direct Benefit", tone: "amber", state: "Telangana", title: "Rythu Bandhu", body: "Investment support for every farming season (Yasangi & Vaanakalam).", eligibility: "All patta land-owning farmers in Telangana.", benefits: "₹5,000 per acre per season (₹10,000/year).", url: "https://rythubandhu.telangana.gov.in/" },
  { tag: "Insurance", tone: "primary", state: "Telangana", title: "Rythu Bima", body: "Life insurance cover for enrolled farmers, premium borne by the state.", eligibility: "Farmers aged 18–59 with pattadar passbook.", benefits: "₹5 lakh cover on death of the farmer.", url: "https://rythubima.telangana.gov.in/" },

  // ===== Karnataka =====
  { tag: "Direct Benefit", tone: "sky", state: "Karnataka", title: "Raitha Shakti", body: "Diesel subsidy to farmers for running agricultural machinery.", eligibility: "Small & marginal farmers with FRUITS ID.", benefits: "₹250 per acre (max 5 acres) as diesel subsidy.", url: "https://raitamitra.karnataka.gov.in/" },
  { tag: "Irrigation", tone: "amber", state: "Karnataka", title: "Krishi Bhagya", body: "Farm ponds and micro-irrigation for rain-fed farmers.", eligibility: "Farmers in dryland taluks of Karnataka.", benefits: "Up to 90% subsidy on farm ponds, polythene lining.", url: "https://raitamitra.karnataka.gov.in/" },

  // ===== Tamil Nadu =====
  { tag: "Insurance", tone: "primary", state: "Tamil Nadu", title: "Chief Minister's Crop Insurance (TN)", body: "State-supported crop insurance under PMFBY for notified crops.", eligibility: "Loanee and non-loanee farmers of notified crops.", benefits: "Very low premium, high claim payout.", url: "https://www.tnagrisnet.tn.gov.in/" },
  { tag: "Free Power", tone: "sky", state: "Tamil Nadu", title: "Free Electricity for Farm Pumps", body: "Free power supply for agricultural pump sets across Tamil Nadu.", eligibility: "All registered agricultural pump-set users.", benefits: "100% free electricity for irrigation pumps.", url: "https://www.tangedco.gov.in/" },
  { tag: "Insurance", tone: "amber", state: "Tamil Nadu", title: "Kalaignar Kaipidi Farmers' Scheme", body: "Assistance for farm families on natural death of the cultivator.", eligibility: "Registered farm households in TN.", benefits: "Lump-sum relief and rehabilitation support.", url: "https://www.tn.gov.in/scheme" },

  // ===== Kerala =====
  { tag: "Pension", tone: "primary", state: "Kerala", title: "Kerala Farmers' Welfare Fund Pension", body: "Monthly pension for registered farmers through the Farmers' Welfare Fund Board.", eligibility: "Members of Kerala Farmers' Welfare Fund aged 60+.", benefits: "Monthly pension + medical & family benefits.", url: "https://keralafarmer.kerala.gov.in/" },
  { tag: "Insurance", tone: "sky", state: "Kerala", title: "Kerala Crop Insurance Scheme", body: "State-run insurance for horticulture crops not covered under PMFBY.", eligibility: "Farmers cultivating notified crops in Kerala.", benefits: "Compensation for yield loss due to natural calamities.", url: "https://www.keralaagriculture.gov.in/" },

  // ===== Maharashtra =====
  { tag: "Direct Benefit", tone: "amber", state: "Maharashtra", title: "Namo Shetkari Mahasanman Nidhi", body: "State top-up of ₹6,000/year over PM-KISAN.", eligibility: "PM-KISAN beneficiaries in Maharashtra.", benefits: "Additional ₹6,000/year (total ₹12,000/year).", url: "https://nsmny.mahait.org/" },
  { tag: "Insurance", tone: "primary", state: "Maharashtra", title: "One-Rupee Crop Insurance", body: "PMFBY enrolment for Maharashtra farmers at ₹1 premium.", eligibility: "All notified-crop farmers in the state.", benefits: "Full PMFBY cover for just ₹1 premium.", url: "https://pmfby.gov.in/" },
  { tag: "Loan Waiver", tone: "sky", state: "Maharashtra", title: "Mahatma Jyotirao Phule Loan Waiver", body: "Waiver of eligible crop loans for distressed farmers.", eligibility: "Farmers with outstanding crop loans as per cutoff.", benefits: "Loan waiver up to ₹2 lakh.", url: "https://mjpsky.maharashtra.gov.in/" },

  // ===== Punjab =====
  { tag: "Insurance", tone: "amber", state: "Punjab", title: "Punjab Farmer Debt Relief", body: "Debt relief and compensation for eligible small and marginal farmers.", eligibility: "SMF as notified by state government.", benefits: "Loan waiver up to ₹2 lakh.", url: "https://agri.punjab.gov.in/" },
  { tag: "Diversification", tone: "primary", state: "Punjab", title: "Crop Diversification Programme", body: "Incentives to shift from paddy to maize, pulses, oilseeds and cotton.", eligibility: "Paddy-growing farmers switching to alternative crops.", benefits: "₹17,500/ha assistance + input support.", url: "https://agri.punjab.gov.in/" },

  // ===== Haryana =====
  { tag: "Diversification", tone: "sky", state: "Haryana", title: "Mera Pani Meri Virasat", body: "Incentive for paddy farmers to switch to less water-intensive crops.", eligibility: "Paddy farmers in notified blocks.", benefits: "₹7,000 per acre for shifting away from paddy.", url: "https://agriharyana.gov.in/" },
  { tag: "MSP", tone: "amber", state: "Haryana", title: "Bhavantar Bharpayee Yojana", body: "Price deficiency payment for vegetables when market price falls below MSP.", eligibility: "Registered farmers on 'Meri Fasal Mera Byora' portal.", benefits: "Compensation for price difference on notified crops.", url: "https://fasal.haryana.gov.in/" },

  // ===== Uttar Pradesh =====
  { tag: "Loan Waiver", tone: "primary", state: "Uttar Pradesh", title: "UP Kisan Karj Rahat Yojana", body: "One-time crop-loan relief for small and marginal farmers in UP.", eligibility: "SMF with eligible crop loans as per state cutoff.", benefits: "Loan waiver up to ₹1 lakh.", url: "https://upkisankarjrahat.upsdc.gov.in/" },
  { tag: "Free Boring", tone: "sky", state: "Uttar Pradesh", title: "Free Boring Scheme", body: "Financial assistance for shallow tube-well boring on farmer fields.", eligibility: "SC/ST, SMF and general category as per slab.", benefits: "Up to ₹10,000 for boring + pump-set subsidy.", url: "https://upagriculture.com/" },

  // ===== Rajasthan =====
  { tag: "Irrigation", tone: "amber", state: "Rajasthan", title: "Mukhyamantri Kisan Mitra Urja Yojana", body: "Subsidy on electricity bills for agricultural connections.", eligibility: "Farmers with metered farm connections in Rajasthan.", benefits: "Up to ₹1,000/month electricity subsidy.", url: "https://energy.rajasthan.gov.in/" },
  { tag: "Solar", tone: "primary", state: "Rajasthan", title: "PM-KUSUM Rajasthan Solar Pump", body: "Solar pump installation with high state + central subsidy.", eligibility: "Farmers without grid connection or on diesel pumps.", benefits: "Up to 60% subsidy on solar pump-sets.", url: "https://pmkusum.mnre.gov.in/" },

  // ===== Madhya Pradesh =====
  { tag: "Direct Benefit", tone: "sky", state: "Madhya Pradesh", title: "Mukhyamantri Kisan Kalyan Yojana", body: "State top-up over PM-KISAN for MP farmers.", eligibility: "PM-KISAN beneficiaries in MP.", benefits: "₹6,000/year additional (total ₹12,000/year).", url: "https://saara.mp.gov.in/" },
  { tag: "MSP", tone: "amber", state: "Madhya Pradesh", title: "Bhavantar Bhugtan Yojana", body: "Price difference payment when market price falls below MSP for notified crops.", eligibility: "Registered farmers selling notified crops in mandis.", benefits: "Direct DBT of price difference amount.", url: "https://mpeuparjan.nic.in/" },

  // ===== Gujarat =====
  { tag: "Insurance", tone: "primary", state: "Gujarat", title: "Mukhya Mantri Kisan Sahay Yojana", body: "State crop assistance in place of PMFBY for kharif crops.", eligibility: "Registered farmers growing kharif crops in Gujarat.", benefits: "Up to ₹25,000/ha for crop loss (>60%).", url: "https://ikhedut.gujarat.gov.in/" },
  { tag: "Horticulture", tone: "sky", state: "Gujarat", title: "iKhedut Horticulture Subsidy", body: "Umbrella portal for subsidies on drip, greenhouse, mulching and orchards.", eligibility: "Farmers registered on iKhedut portal.", benefits: "40–75% subsidy on horticulture inputs & infra.", url: "https://ikhedut.gujarat.gov.in/" },

  // ===== West Bengal =====
  { tag: "Direct Benefit", tone: "amber", state: "West Bengal", title: "Krishak Bandhu", body: "Financial assistance and life insurance for WB farmers.", eligibility: "Farmers and sharecroppers in West Bengal.", benefits: "Up to ₹10,000/year + ₹2 lakh life cover.", url: "https://krishakbandhu.net/" },
  { tag: "Bangla Shasya Bima", tone: "primary", state: "West Bengal", title: "Bangla Shasya Bima", body: "Fully state-funded crop insurance scheme for WB farmers.", eligibility: "All farmers growing notified crops in WB.", benefits: "Zero premium for farmers; full claim on loss.", url: "https://banglashasyabima.net/" },

  // ===== Bihar =====
  { tag: "Diesel Subsidy", tone: "sky", state: "Bihar", title: "Bihar Diesel Anudan Yojana", body: "Diesel subsidy for irrigation during drought/dry spells.", eligibility: "Farmers cultivating in drought-hit blocks.", benefits: "₹75 per litre subsidy for irrigation diesel.", url: "https://dbtagriculture.bihar.gov.in/" },
  { tag: "Direct Benefit", tone: "amber", state: "Bihar", title: "Bihar State Crop Assistance Scheme", body: "Assistance for crop loss due to natural calamities where PMFBY isn't implemented.", eligibility: "Registered farmers with land records in Bihar.", benefits: "Up to ₹20,000/ha for actual crop loss.", url: "https://esahkari.bihar.gov.in/" },

  // ===== Odisha =====
  { tag: "Direct Benefit", tone: "primary", state: "Odisha", title: "KALIA Yojana", body: "Livelihood and income support for small and landless farmers.", eligibility: "SMF, landless agri-labourers and sharecroppers.", benefits: "₹4,000/season + ₹12,500 for landless + life cover.", url: "https://kalia.odisha.gov.in/" },

  // ===== Chhattisgarh =====
  { tag: "Direct Benefit", tone: "sky", state: "Chhattisgarh", title: "Rajiv Gandhi Kisan Nyay Yojana", body: "Input subsidy per acre to paddy and other crop farmers.", eligibility: "Registered farmers in Chhattisgarh.", benefits: "Up to ₹9,000 per acre input subsidy.", url: "https://rgkny.cg.nic.in/" },

  // ===== Jharkhand =====
  { tag: "Direct Benefit", tone: "amber", state: "Jharkhand", title: "Mukhyamantri Krishi Ashirwad Yojana", body: "Grant for small and marginal farmers based on land holding.", eligibility: "SMF with up to 5 acres in Jharkhand.", benefits: "₹5,000 per acre per year as input grant.", url: "https://mmkay.jharkhand.gov.in/" },

  // ===== Assam / North-East =====
  { tag: "Direct Benefit", tone: "primary", state: "Assam", title: "CM Samagra Gramya Unnayan Yojana", body: "Integrated village development including agri and horticulture support.", eligibility: "Rural households and farmers in Assam.", benefits: "Input kits, machinery and infra grants.", url: "https://cmsgunyfarmers.assam.gov.in/" },
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