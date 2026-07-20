// Simplified 12-month crop calendars for major Indian crops.
// Month indices: 0=Jan, 11=Dec. Adjust regionally as needed.
export type CalendarEntry = {
  month: number;
  activity: string;
  detail: string;
};

export type CropCalendar = {
  crop: string;
  season: "Kharif" | "Rabi" | "Zaid" | "Perennial";
  states: string[]; // primary growing states
  timeline: CalendarEntry[];
};

export const CROP_CALENDARS: CropCalendar[] = [
  {
    crop: "Rice (Paddy)",
    season: "Kharif",
    states: ["West Bengal", "Uttar Pradesh", "Punjab", "Andhra Pradesh", "Telangana", "Tamil Nadu", "Odisha", "Bihar"],
    timeline: [
      { month: 5, activity: "Nursery preparation", detail: "Sow paddy nursery on raised beds. 20 kg seed / acre." },
      { month: 6, activity: "Transplanting", detail: "Transplant 25–30 day seedlings, 2 per hill, 20×15 cm spacing." },
      { month: 6, activity: "Basal fertilizer", detail: "Apply 50% N + full P + 50% K at puddling." },
      { month: 7, activity: "Tillering top-dress", detail: "Apply 25% N; maintain 5 cm standing water." },
      { month: 8, activity: "Panicle initiation", detail: "Final 25% N + 50% K; monitor for stem borer." },
      { month: 9, activity: "Flowering & grain fill", detail: "Ensure water availability; spray for BPH if needed." },
      { month: 10, activity: "Harvest", detail: "Harvest when 80% grains turn straw-yellow; moisture ~20%." },
      { month: 11, activity: "Threshing & storage", detail: "Dry to 14% moisture before storing." },
    ],
  },
  {
    crop: "Wheat",
    season: "Rabi",
    states: ["Uttar Pradesh", "Punjab", "Haryana", "Madhya Pradesh", "Rajasthan", "Bihar"],
    timeline: [
      { month: 10, activity: "Field preparation", detail: "Deep ploughing, 2–3 harrowings; incorporate FYM 10 t/ha." },
      { month: 10, activity: "Sowing", detail: "Nov 1–15 optimum. 100 kg seed/ha, 22 cm row spacing." },
      { month: 11, activity: "Crown root irrigation", detail: "First irrigation at 20–25 DAS; apply 25% N." },
      { month: 0, activity: "Tillering", detail: "Second irrigation at 40–45 DAS; watch for aphids." },
      { month: 1, activity: "Jointing & flowering", detail: "Third irrigation; spray fungicide for rust if humid." },
      { month: 2, activity: "Grain filling", detail: "Fourth irrigation; avoid water stress." },
      { month: 3, activity: "Harvest", detail: "Harvest at physiological maturity, moisture 14%." },
    ],
  },
  {
    crop: "Cotton",
    season: "Kharif",
    states: ["Gujarat", "Maharashtra", "Telangana", "Andhra Pradesh", "Punjab", "Haryana"],
    timeline: [
      { month: 4, activity: "Field prep", detail: "Summer ploughing, ridge & furrow layout." },
      { month: 5, activity: "Sowing (irrigated)", detail: "Bt cotton: 90×60 cm spacing; treat seeds with Imidacloprid." },
      { month: 6, activity: "Sowing (rainfed)", detail: "With monsoon arrival; dibble 1–2 seeds/hole." },
      { month: 7, activity: "Squaring stage", detail: "First top-dress N; weed control critical." },
      { month: 8, activity: "Flowering", detail: "Monitor pink bollworm pheromone traps; spray on ETL." },
      { month: 9, activity: "Boll development", detail: "Final N top-dress; foliar K for boll weight." },
      { month: 10, activity: "First picking", detail: "Pick clean, dry cotton every 15 days." },
      { month: 11, activity: "Subsequent pickings", detail: "Continue until crop terminated." },
    ],
  },
  {
    crop: "Maize",
    season: "Kharif",
    states: ["Karnataka", "Madhya Pradesh", "Bihar", "Tamil Nadu", "Andhra Pradesh", "Rajasthan"],
    timeline: [
      { month: 5, activity: "Sowing", detail: "Sow before monsoon; 60×20 cm spacing; 20 kg seed/ha." },
      { month: 6, activity: "Weeding & basal N", detail: "First weeding at 20 DAS; earth up if needed." },
      { month: 7, activity: "Knee-high top-dress", detail: "40% N; monitor for fall armyworm on whorls." },
      { month: 8, activity: "Tasseling & silking", detail: "Ensure adequate moisture; final 30% N." },
      { month: 9, activity: "Grain filling", detail: "Water-critical stage; avoid stress." },
      { month: 10, activity: "Harvest", detail: "Harvest when husks turn brown, grain moisture 20%." },
    ],
  },
  {
    crop: "Sugarcane",
    season: "Perennial",
    states: ["Uttar Pradesh", "Maharashtra", "Karnataka", "Tamil Nadu", "Gujarat"],
    timeline: [
      { month: 1, activity: "Spring planting", detail: "Feb 15 – Mar 15. Use 2-bud setts, 90 cm rows." },
      { month: 3, activity: "Germination & tillering", detail: "Ensure moisture; apply 25% N basal + full P + 50% K." },
      { month: 5, activity: "Grand growth phase", detail: "Peak water and nutrient demand; second N application." },
      { month: 7, activity: "Earthing up", detail: "Deep earthing; final N + 50% K; propping to prevent lodging." },
      { month: 10, activity: "Maturity monitoring", detail: "Check brix > 18°; plan harvest with mill." },
      { month: 11, activity: "Harvest begins", detail: "Cut at ground level; deliver to mill within 24 hours." },
    ],
  },
  {
    crop: "Tomato",
    season: "Rabi",
    states: ["Andhra Pradesh", "Karnataka", "Maharashtra", "Odisha", "Madhya Pradesh"],
    timeline: [
      { month: 8, activity: "Nursery sowing", detail: "Raise seedlings in trays; 200 g seed/ha." },
      { month: 9, activity: "Transplanting", detail: "25–30 day seedlings; 60×45 cm spacing." },
      { month: 10, activity: "Staking & first top-dress", detail: "Stake plants; apply 25% N + K." },
      { month: 11, activity: "Flowering", detail: "Foliar spray of Ca + B to prevent blossom-end rot." },
      { month: 0, activity: "Fruit set & harvest begins", detail: "First harvest at ~70 DAT; pick every 3–4 days." },
      { month: 1, activity: "Peak harvest", detail: "Continue picking; watch for late blight in cool weather." },
      { month: 2, activity: "Final picking", detail: "Terminate when fruit quality declines." },
    ],
  },
  {
    crop: "Potato",
    season: "Rabi",
    states: ["Uttar Pradesh", "West Bengal", "Bihar", "Gujarat", "Madhya Pradesh", "Punjab"],
    timeline: [
      { month: 9, activity: "Field prep", detail: "Fine tilth; ridge & furrow 60 cm apart." },
      { month: 10, activity: "Planting", detail: "Oct 15 – Nov 15; 25 cm spacing; treated seed tubers 30–40 g." },
      { month: 11, activity: "Emergence & first irrigation", detail: "Light irrigation; watch for cutworms." },
      { month: 0, activity: "Earthing up + top-dress", detail: "Earth up ridges; apply 50% N." },
      { month: 1, activity: "Tuber bulking", detail: "Critical water & spray for late blight if humid." },
      { month: 2, activity: "Haulm cutting", detail: "Cut haulms 10 days before harvest for skin set." },
      { month: 2, activity: "Harvest", detail: "Dig tubers carefully; cure in shade for 10 days." },
    ],
  },
  {
    crop: "Chickpea (Gram)",
    season: "Rabi",
    states: ["Madhya Pradesh", "Rajasthan", "Maharashtra", "Uttar Pradesh", "Karnataka"],
    timeline: [
      { month: 9, activity: "Field prep", detail: "One deep ploughing; conserve moisture." },
      { month: 10, activity: "Sowing", detail: "Oct 15 – Nov 15. 80 kg seed/ha; treat with Trichoderma." },
      { month: 11, activity: "Vegetative growth", detail: "One light irrigation if soil moisture low." },
      { month: 0, activity: "Flowering", detail: "Second irrigation; watch for pod borer moths." },
      { month: 1, activity: "Pod filling", detail: "Spray Ha-NPV or Emamectin for pod borer." },
      { month: 2, activity: "Maturity", detail: "Leaves yellow; pods rattle when shaken." },
      { month: 3, activity: "Harvest & threshing", detail: "Cut early morning to avoid seed shattering." },
    ],
  },
];
