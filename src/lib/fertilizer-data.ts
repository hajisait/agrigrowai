// ICAR-based NPK recommendations (kg per hectare) for major Indian crops.
// Source: ICAR Handbook of Agriculture. Values are typical mid-range dosages.
export type CropNutrient = {
  crop: string;
  season: "Kharif" | "Rabi" | "Zaid" | "Perennial";
  N: number; // kg/ha
  P: number; // kg P2O5/ha
  K: number; // kg K2O/ha
  splits: string[]; // dose schedule notes
  pests: string[]; // common pests / diseases
  sprayCalendar: string[]; // pesticide/spray schedule
};

export const FERTILIZER_DATA: CropNutrient[] = [
  {
    crop: "Rice (Paddy)",
    season: "Kharif",
    N: 120, P: 60, K: 60,
    splits: [
      "Basal at transplanting: 50% N + 100% P + 50% K",
      "Tillering (25 DAT): 25% N",
      "Panicle initiation (55 DAT): 25% N + 50% K",
    ],
    pests: ["Stem borer", "Brown planthopper", "Blast", "Sheath blight"],
    sprayCalendar: [
      "20 DAT: Cartap hydrochloride 4G @ 25 kg/ha (stem borer)",
      "45 DAT: Imidacloprid 17.8% SL @ 125 ml/ha (BPH)",
      "60 DAT: Tricyclazole 75% WP @ 300 g/ha (blast)",
    ],
  },
  {
    crop: "Wheat",
    season: "Rabi",
    N: 120, P: 60, K: 40,
    splits: [
      "Basal: 50% N + 100% P + 100% K at sowing",
      "First irrigation (21 DAS): 25% N",
      "Second irrigation (45 DAS): 25% N",
    ],
    pests: ["Aphids", "Termites", "Rust (yellow/brown)", "Karnal bunt"],
    sprayCalendar: [
      "Seed treatment: Chlorpyrifos 20 EC @ 4 ml/kg seed (termites)",
      "60 DAS: Propiconazole 25 EC @ 500 ml/ha (rust)",
      "80 DAS: Imidacloprid 17.8% SL @ 100 ml/ha (aphids)",
    ],
  },
  {
    crop: "Maize",
    season: "Kharif",
    N: 150, P: 75, K: 60,
    splits: [
      "Basal: 30% N + 100% P + 100% K",
      "Knee-high stage (30 DAS): 40% N",
      "Tasseling (55 DAS): 30% N",
    ],
    pests: ["Fall armyworm", "Stem borer", "Turcicum leaf blight"],
    sprayCalendar: [
      "15 DAS: Emamectin benzoate 5% SG @ 200 g/ha (fall armyworm)",
      "40 DAS: Mancozeb 75% WP @ 2 kg/ha (leaf blight)",
    ],
  },
  {
    crop: "Cotton",
    season: "Kharif",
    N: 150, P: 75, K: 75,
    splits: [
      "Basal: 25% N + 100% P + 50% K",
      "Squaring (40 DAS): 25% N + 25% K",
      "Flowering (70 DAS): 25% N + 25% K",
      "Boll development (100 DAS): 25% N",
    ],
    pests: ["Pink bollworm", "Whitefly", "Aphids", "Jassids"],
    sprayCalendar: [
      "45 DAS: Acetamiprid 20% SP @ 100 g/ha (sucking pests)",
      "70 DAS: Emamectin benzoate 5% SG @ 220 g/ha (bollworm)",
      "90 DAS: Neem oil 3% + soap 0.5% (whitefly)",
    ],
  },
  {
    crop: "Sugarcane",
    season: "Perennial",
    N: 250, P: 100, K: 100,
    splits: [
      "Basal: 25% N + 100% P + 50% K",
      "45 DAP: 25% N",
      "90 DAP: 25% N + 50% K",
      "135 DAP: 25% N (earthing up)",
    ],
    pests: ["Early shoot borer", "Top borer", "Pyrilla", "Red rot"],
    sprayCalendar: [
      "60 DAP: Chlorantraniliprole 18.5% SC @ 375 ml/ha (borers)",
      "Setts treatment: Carbendazim 0.1% dip (red rot)",
    ],
  },
  {
    crop: "Tomato",
    season: "Rabi",
    N: 100, P: 60, K: 60,
    splits: [
      "Basal: 50% N + 100% P + 50% K at transplanting",
      "30 DAT: 25% N + 25% K",
      "60 DAT: 25% N + 25% K (fruit set)",
    ],
    pests: ["Fruit borer", "Whitefly", "Early blight", "Late blight"],
    sprayCalendar: [
      "20 DAT: Imidacloprid 17.8% SL @ 100 ml/ha (whitefly)",
      "40 DAT: Mancozeb 75% WP @ 2 kg/ha (blight)",
      "60 DAT: Emamectin benzoate 5% SG @ 200 g/ha (fruit borer)",
    ],
  },
  {
    crop: "Potato",
    season: "Rabi",
    N: 180, P: 80, K: 100,
    splits: [
      "Basal: 50% N + 100% P + 100% K at planting",
      "Earthing up (30 DAP): 50% N",
    ],
    pests: ["Late blight", "Early blight", "Aphids", "Cutworms"],
    sprayCalendar: [
      "40 DAP: Mancozeb 75% WP @ 2 kg/ha (blight)",
      "60 DAP: Metalaxyl + Mancozeb @ 2.5 kg/ha (late blight)",
      "As needed: Imidacloprid @ 125 ml/ha (aphids)",
    ],
  },
  {
    crop: "Onion",
    season: "Rabi",
    N: 100, P: 50, K: 50,
    splits: [
      "Basal: 50% N + 100% P + 100% K at transplanting",
      "30 DAT: 25% N",
      "45 DAT: 25% N",
    ],
    pests: ["Thrips", "Purple blotch", "Downy mildew"],
    sprayCalendar: [
      "30 DAT: Fipronil 5% SC @ 1 L/ha (thrips)",
      "45 DAT: Mancozeb 75% WP @ 2.5 kg/ha (purple blotch)",
    ],
  },
  {
    crop: "Chilli",
    season: "Kharif",
    N: 120, P: 60, K: 60,
    splits: [
      "Basal: 50% N + 100% P + 50% K at transplanting",
      "30 DAT: 25% N",
      "60 DAT: 25% N + 50% K",
    ],
    pests: ["Thrips", "Mites", "Fruit borer", "Anthracnose"],
    sprayCalendar: [
      "30 DAT: Spinosad 45% SC @ 200 ml/ha (thrips)",
      "45 DAT: Propargite 57% EC @ 1 L/ha (mites)",
      "60 DAT: Carbendazim 50% WP @ 500 g/ha (anthracnose)",
    ],
  },
  {
    crop: "Groundnut",
    season: "Kharif",
    N: 25, P: 50, K: 75,
    splits: ["Basal: 100% N + 100% P + 100% K at sowing (legume: low N)"],
    pests: ["Leaf miner", "Tikka leaf spot", "Rust"],
    sprayCalendar: [
      "30 DAS: Mancozeb 75% WP @ 2 kg/ha (leaf spot)",
      "60 DAS: Hexaconazole 5% EC @ 1 L/ha (rust)",
    ],
  },
  {
    crop: "Soybean",
    season: "Kharif",
    N: 30, P: 60, K: 40,
    splits: ["Basal: 100% at sowing (Rhizobium inoculation recommended)"],
    pests: ["Girdle beetle", "Semilooper", "Rust"],
    sprayCalendar: [
      "35 DAS: Chlorantraniliprole 18.5% SC @ 150 ml/ha (semilooper)",
      "60 DAS: Hexaconazole 5% EC @ 1 L/ha (rust)",
    ],
  },
  {
    crop: "Mustard",
    season: "Rabi",
    N: 80, P: 40, K: 40,
    splits: [
      "Basal: 50% N + 100% P + 100% K",
      "First irrigation (30 DAS): 50% N",
    ],
    pests: ["Aphids", "Painted bug", "Alternaria blight"],
    sprayCalendar: [
      "45 DAS: Imidacloprid 17.8% SL @ 100 ml/ha (aphids)",
      "60 DAS: Mancozeb 75% WP @ 2 kg/ha (blight)",
    ],
  },
  {
    crop: "Sunflower",
    season: "Rabi",
    N: 60, P: 90, K: 60,
    splits: [
      "Basal: 50% N + 100% P + 100% K",
      "30 DAS: 50% N",
    ],
    pests: ["Head borer", "Necrosis virus"],
    sprayCalendar: [
      "50 DAS: Emamectin benzoate 5% SG @ 200 g/ha (head borer)",
    ],
  },
  {
    crop: "Chickpea (Gram)",
    season: "Rabi",
    N: 20, P: 40, K: 20,
    splits: ["Basal: 100% at sowing"],
    pests: ["Pod borer", "Wilt"],
    sprayCalendar: [
      "50 DAS: Emamectin benzoate 5% SG @ 220 g/ha (pod borer)",
      "Seed treatment: Trichoderma viride @ 4 g/kg seed (wilt)",
    ],
  },
  {
    crop: "Pigeon pea (Arhar)",
    season: "Kharif",
    N: 25, P: 50, K: 25,
    splits: ["Basal: 100% at sowing"],
    pests: ["Pod borer", "Pod fly", "Wilt"],
    sprayCalendar: [
      "60 DAS: Chlorantraniliprole 18.5% SC @ 150 ml/ha (pod borer)",
      "90 DAS: Repeat if pod damage > 5%",
    ],
  },
  {
    crop: "Banana",
    season: "Perennial",
    N: 200, P: 60, K: 300,
    splits: [
      "Split into 6 doses every 45 days",
      "Heavy K required during bunch development",
    ],
    pests: ["Sigatoka leaf spot", "Bunchy top virus", "Nematodes"],
    sprayCalendar: [
      "Monthly: Propiconazole 25 EC @ 1 ml/L (Sigatoka)",
      "Use tissue-culture virus-free plants (bunchy top)",
    ],
  },
  {
    crop: "Turmeric",
    season: "Kharif",
    N: 60, P: 60, K: 120,
    splits: [
      "Basal: 100% P + 50% K",
      "45 DAP: 50% N + 25% K",
      "90 DAP: 50% N + 25% K",
    ],
    pests: ["Rhizome rot", "Leaf blotch", "Shoot borer"],
    sprayCalendar: [
      "60 DAP: Mancozeb 75% WP @ 2.5 kg/ha (leaf blotch)",
      "Seed treatment: Trichoderma @ 4 g/kg (rhizome rot)",
    ],
  },
];

export const SOIL_ADJUSTMENTS: Record<string, { N: number; P: number; K: number }> = {
  alluvial: { N: 1.0, P: 1.0, K: 1.0 },
  black: { N: 0.9, P: 1.1, K: 0.8 },
  red: { N: 1.1, P: 1.2, K: 1.1 },
  laterite: { N: 1.2, P: 1.3, K: 1.2 },
  sandy: { N: 1.15, P: 1.1, K: 1.15 },
  clayey: { N: 0.95, P: 1.0, K: 0.9 },
};

export const AREA_UNITS = { acre: 0.4047, hectare: 1.0, bigha: 0.2529 } as const;
