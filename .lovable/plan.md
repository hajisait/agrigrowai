# Plan: monetization + 4 new features + public launch

## 1. Make it public (immediate)
- Set publish visibility to **public** so `agrigrowai.lovable.app` is open to anyone.
- Re-publish.

## 2. Payments — Freemium via Stripe (Lovable-managed)
Run the recommend → enable → products flow:
1. `recommend_payment_provider` (sanity check on product fit).
2. `enable_stripe_payments` — creates test env immediately.
3. Create 2 products with `batch_create_product`:
   - **AgriGrow Pro Monthly** — ₹99/mo
   - **AgriGrow Pro Yearly** — ₹899/yr (save ~25%)
4. Tax handling: automatic tax calculation only (`automatic_tax`) — India seller, +0.5%.

### Free tier vs Pro
| Feature | Free | Pro |
|---|---|---|
| AI Assistant | 10 queries/day | Unlimited |
| Disease scan | 3/day | Unlimited |
| Weather, Schemes, Market | Full | Full |
| **Fertilizer calculator** | Basic | Full schedules |
| **Crop calendar** | Current month | Full year + alerts |
| **Soil report reader** | ❌ | ✅ |
| **Price alerts** | ❌ | ✅ (up to 20) |
| Ads | Small banner | None |

### Gating implementation
- New table `public.subscriptions (user_id, status, plan, current_period_end)` with RLS.
- Stripe webhook at `src/routes/api/public/stripe-webhook.ts` — verifies signature, upserts subscription.
- Server fn `getMyPlan()` used by client to gate features.
- Free-tier daily counters in `localStorage` + server-side check in `agri-api` edge fn using IP+user_id.
- Requires **auth** — add email/password + Google sign-in (defaults). New `/auth` route + protected `_authenticated/pro/*` for billing portal.

## 3. New features

### A. Fertilizer & Pesticide Dosage Calculator (`/fertilizer`)
- Inputs: crop, area (acre/ha), soil type, target yield.
- Output: N-P-K kg needed, Urea/DAP/MOP bag equivalents, split-dose schedule (basal / tillering / flowering), pesticide spray calendar keyed to pest pressure.
- Data: static NPK table for ~25 major Indian crops in `src/lib/fertilizer-data.ts` (ICAR-based recommendations).
- Free = single-dose totals; Pro = full split schedule + pesticide calendar.

### B. Crop Calendar & Sowing Advisor (`/calendar`)
- Inputs: state, crop.
- Output: 12-month timeline (sowing → irrigation → fertilizer → harvest) with weather-adjusted notes from live IMD-style data.
- Data: state × crop matrix in `src/lib/crop-calendar-data.ts` (kharif/rabi/zaid mapped).
- Free = current month card; Pro = full timeline + iCal export.

### C. Soil Test Report Reader (`/soil`) — Pro only
- Upload photo/PDF of Soil Health Card.
- Server fn calls Gemini vision (already integrated) with structured prompt → extracts pH, N, P, K, OC, EC, micros.
- Returns plain-language interpretation + amendment recommendations (lime, gypsum, compost, specific micronutrients).

### D. Mandi Price Alerts + Trends (`/alerts`) — Pro only
- Save crop + state + threshold price.
- Daily cron (`pg_cron` → server route `/api/public/price-check`) fetches from existing market source, compares, emails via existing infra when threshold crossed.
- Trend chart: 30-day sparkline per saved crop (uses `recharts`, already installed).
- Table: `public.price_alerts (user_id, crop, state, threshold, direction, active)`.

## 4. UI updates
- Add nav entries: Fertilizer, Calendar, Soil, Alerts.
- Add **Upgrade to Pro** CTA card on home + assistant page for free users.
- Add `/pricing` route showing tiers + Stripe checkout button.
- Billing portal link in nav dropdown when signed in.
- Small AdSense-ready `<ins>` slot placeholder for free tier (empty until publisher ID added).

## Technical notes
- Auth via existing Supabase (email/password + Google). Need `supabase--configure_social_auth` for Google.
- All new DB tables get RLS + GRANT per project standards.
- Stripe webhook uses `STRIPE_WEBHOOK_SECRET` (added via `add_secret` after Stripe enable).
- Free-tier server-side rate limits enforced in `agri-api` edge fn (drop from 100k/min to real caps: 10 AI/day free, 3 scan/day free).

## Rollout order
1. Publish public
2. Auth + subscriptions table + Stripe enable + products + webhook + pricing page
3. Fertilizer calculator (no gating dependency)
4. Crop calendar
5. Soil reader (Pro-gated)
6. Price alerts + cron (Pro-gated)
7. Final QA on mobile

Approve to build.