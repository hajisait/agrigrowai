// ============================================================
// Monetization configuration — EDIT THIS FILE to start earning.
// ------------------------------------------------------------
// Revenue only flows to YOUR account once YOU sign up for the
// ad network / affiliate program and paste YOUR IDs / links here.
// Lovable cannot receive or route money on your behalf.
//
// 1) GOOGLE ADSENSE  — display + pop-up style ads, paid per
//    impression/click to your bank account via EFT.
//    Sign up: https://www.google.com/adsense/start/
//    Approval needs a real domain (your custom domain), decent
//    content, and privacy policy. Once approved, paste your
//    publisher id (looks like "ca-pub-1234567890123456") below
//    and set ENABLE_ADSENSE = true.
//
// 2) AFFILIATE OFFERS — commission per sale/lead to your account.
//    Easiest for India: Amazon Associates India
//    (https://affiliate.amazon.in). Replace the `url` fields
//    below with your tagged affiliate links. Add/remove offers
//    freely. Each pop-up impression of a CTA you control.
// ============================================================

export const ENABLE_ADSENSE = false;
export const ADSENSE_PUBLISHER_ID = "ca-pub-XXXXXXXXXXXXXXXX"; // replace after approval
export const ADSENSE_SLOT_ID = "XXXXXXXXXX"; // ad unit slot id

export type AffiliateOffer = {
  id: string;
  tag: string;
  title: string;
  body: string;
  cta: string;
  url: string; // your affiliate link
  emoji: string;
};

// Rotate through these. Replace URLs with your affiliate-tagged links.
export const AFFILIATE_OFFERS: AffiliateOffer[] = [
  {
    id: "crop-insurance",
    tag: "Farmer Protection",
    title: "Crop Insurance from ₹5/month",
    body: "Protect your harvest against drought, flood & pest loss. Government-backed PMFBY scheme — enrol online in minutes.",
    cta: "Check eligibility",
    url: "https://pmfby.gov.in",
    emoji: "🛡️",
  },
  {
    id: "seeds",
    tag: "Sponsored",
    title: "Certified Hybrid Seeds up to 30% off",
    body: "High-yield paddy, wheat & vegetable seeds delivered to your village. Buy 1 get 1 on select packs this season.",
    cta: "Shop seeds",
    url: "https://www.amazon.in/s?k=hybrid+seeds&tag=YOUR_AFf_TAG",
    emoji: "🌱",
  },
  {
    id: "equipment",
    tag: "Deal of the week",
    title: "Power Sprayers & Tillers — EMI from ₹499",
    body: "Genuine agri equipment with doorstep service. Easy no-cost EMI on cards & UPI.",
    cta: "View equipment",
    url: "https://www.amazon.in/s?k=power+sprayer&tag=YOUR_AFf_TAG",
    emoji: "🚜",
  },
  {
    id: "soil-test",
    tag: "Lab partner",
    title: "Home Soil Testing Kit ₹299",
    body: "Know your NPK & pH before sowing. Get a mailed report with crop-specific fertilizer advice.",
    cta: "Order kit",
    url: "https://www.amazon.in/s?k=soil+testing+kit&tag=YOUR_AFf_TAG",
    emoji: "🧪",
  },
];
