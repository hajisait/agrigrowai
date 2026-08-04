import { ALLOWED_CROPS } from "@/lib/agri-core";

export const INDIAN_STATES = [
  "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jammu & Kashmir", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
] as const;

export const CROP_OPTIONS = ALLOWED_CROPS;

export type Season = "Kharif" | "Rabi" | "Zaid";

export function currentSeason(date = new Date()): Season {
  const m = date.getMonth() + 1;
  if (m >= 6 && m <= 10) return "Kharif";
  if (m >= 11 || m <= 3) return "Rabi";
  return "Zaid";
}

export type Recommendation = {
  title: string;
  body: string;
  to: string;
  action: string;
  tone: "primary" | "sky" | "amber";
};

type Input = {
  fullName?: string | null;
  state?: string | null;
  district?: string | null;
  crops?: string[];
  landAcres?: number | null;
  date?: Date;
};

/** Deterministic, offline-safe personalised advisory built from the farmer profile. */
export function buildRecommendations(input: Input): Recommendation[] {
  const date = input.date ?? new Date();
  const season = currentSeason(date);
  const crops = (input.crops ?? []).filter(Boolean);
  const primaryCrop = crops[0];
  const place = [input.district, input.state].filter(Boolean).join(", ");
  const out: Recommendation[] = [];

  if (primaryCrop) {
    out.push({
      title: `${primaryCrop} plan for ${season}`,
      body: `Season-wise sowing, irrigation and harvest windows for ${primaryCrop}${place ? ` in ${place}` : ""}.`,
      to: "/calendar",
      action: "Open crop calendar",
      tone: "primary",
    });
    out.push({
      title: `${primaryCrop} nutrient dose`,
      body: `Get an exact NPK and pesticide dose for ${input.landAcres ? `${input.landAcres} acre` : "your"} ${primaryCrop} field.`,
      to: "/fertilizer",
      action: "Calculate dose",
      tone: "sky",
    });
  } else {
    out.push({
      title: `Best ${season} crops for you`,
      body: "Add your state and crops to your profile and we tailor every advisory to your field.",
      to: "/account",
      action: "Complete profile",
      tone: "primary",
    });
  }

  out.push({
    title: place ? `${place} weather outlook` : "Village-level weather",
    body: season === "Kharif"
      ? "Monsoon spells decide sowing and spraying days — check the 7-day rain window before you spray."
      : "Track night temperature and dew: cold spells and fog raise fungal risk this season.",
    to: "/weather",
    action: "Check forecast",
    tone: "sky",
  });

  if (crops.length) {
    out.push({
      title: `Today's mandi rate${crops.length > 1 ? "s" : ""}`,
      body: `Compare ${crops.slice(0, 3).join(", ")} prices${input.state ? ` in ${input.state}` : ""} before you sell.`,
      to: "/market",
      action: "View prices",
      tone: "amber",
    });
  }

  out.push({
    title: input.state ? `Schemes open in ${input.state}` : "Government schemes",
    body: "Central plus state subsidies, insurance and credit support filtered for you.",
    to: "/schemes",
    action: "See schemes",
    tone: "primary",
  });

  out.push({
    title: "Leaf looking off?",
    body: "Scan a photo for instant disease diagnosis and a treatment plan in your language.",
    to: "/disease",
    action: "Scan crop",
    tone: "sky",
  });

  return out.slice(0, 6);
}

/** Suggested reminder templates, tuned to profile + season. */
export function suggestedReminders(input: Input): { title: string; note: string; inDays: number; repeatDays: number }[] {
  const season = currentSeason(input.date ?? new Date());
  const crop = (input.crops ?? [])[0] ?? "your crop";
  return [
    { title: `Irrigate ${crop}`, note: "Skip if 10mm+ rain is forecast.", inDays: 2, repeatDays: 7 },
    { title: `Scout ${crop} for pests`, note: "Check 10 random plants for eggs and larvae.", inDays: 3, repeatDays: 7 },
    { title: `${season} fertiliser split dose`, note: "Apply the next split dose of nitrogen.", inDays: 10, repeatDays: 21 },
    { title: "Check mandi price before selling", note: "Compare 2-3 nearby mandis.", inDays: 5, repeatDays: 7 },
    { title: "Scheme / insurance deadline check", note: "Verify PM-KISAN and PMFBY enrolment status.", inDays: 14, repeatDays: 30 },
  ];
}
