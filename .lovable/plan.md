Add a standalone **Crop Profit Calculator** page so farmers can quickly estimate net income from a planned crop.

What will be built
- A new route `/calculator` with a clean input form.
- Calculates total revenue, total cost, net profit, and profit per acre based on inputs:
  - crop name (preset chips + custom text)
  - area in acres
  - expected yield per acre (kg or quintal)
  - expected market price per unit
  - cost buckets: seeds, fertilizer, labor, irrigation, pesticides, other
- A shareable summary card that can be copied as text.
- Adds the calculator to the existing landing page bento grid as a quick-access tile.
- Full i18n support for EN, HI, TA, TE, ML.

UI/UX approach
- Uses the existing glass-panel design, rounded-2xl cards, primary color accents.
- Large readable numbers with a currency formatter in `en-IN`.
- Results update live as the user types.
- Mobile-first layout: inputs stack on small screens, results sit below.

Technical outline
- Create `src/routes/calculator.tsx` as a TanStack file route.
- Add calculator strings to `src/lib/i18n.tsx` under existing language blocks.
- Insert a calculator CTA card into the landing page bento grid in `src/routes/index.tsx`.
- No backend or AI changes needed; all logic is client-side.

Out of scope
- No persistent storage of calculations.
- No PDF export or printing in this pass.