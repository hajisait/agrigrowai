import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { FERTILIZER_DATA, SOIL_ADJUSTMENTS, AREA_UNITS, type CropNutrient } from "@/lib/fertilizer-data";
import { useProState } from "@/lib/pro";
import { AppLink } from "@/lib/spa-router";
import { Beaker, Sprout, Lock, Sparkles, Info } from "lucide-react";

export const Route = createFileRoute("/fertilizer")({
  head: () => ({
    meta: [
      { title: "Fertilizer & Pesticide Calculator — AgriAI Assist" },
      { name: "description", content: "Precise NPK, urea, DAP and pesticide dosage for 17+ Indian crops." },
      { property: "og:title", content: "Fertilizer Calculator — AgriAI Assist" },
      { property: "og:description", content: "ICAR-based fertilizer & pesticide schedules for Indian farmers." },
    ],
  }),
  component: FertilizerPage,
});

// Urea = 46% N, DAP = 46% P2O5 + 18% N, MOP = 60% K2O
function nutrientToBags(N: number, P: number, K: number) {
  const dap_kg = P / 0.46;                    // DAP supplies P
  const dap_N = dap_kg * 0.18;                // N contributed by DAP
  const urea_kg = Math.max(0, (N - dap_N) / 0.46);
  const mop_kg = K / 0.60;
  return {
    urea: { kg: urea_kg, bags: urea_kg / 45 },
    dap: { kg: dap_kg, bags: dap_kg / 50 },
    mop: { kg: mop_kg, bags: mop_kg / 50 },
  };
}

export function FertilizerPage() {
  const pro = useProState();
  const [cropName, setCropName] = useState<string>(FERTILIZER_DATA[0].crop);
  const [soil, setSoil] = useState<keyof typeof SOIL_ADJUSTMENTS>("alluvial");
  const [area, setArea] = useState<number>(1);
  const [unit, setUnit] = useState<keyof typeof AREA_UNITS>("acre");

  const crop = useMemo<CropNutrient>(
    () => FERTILIZER_DATA.find((c) => c.crop === cropName) || FERTILIZER_DATA[0],
    [cropName],
  );

  const hectares = area * AREA_UNITS[unit];
  const adj = SOIL_ADJUSTMENTS[soil];
  const N = crop.N * hectares * adj.N;
  const P = crop.P * hectares * adj.P;
  const K = crop.K * hectares * adj.K;
  const bags = nutrientToBags(N, P, K);

  return (
    <div className="min-h-screen">
      <Nav />
      <main className="max-w-6xl mx-auto px-3 md:px-6 py-8 md:py-12 space-y-6">
        <header className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel text-xs font-semibold text-primary">
            <Beaker className="size-3.5" /> ICAR-based dosage
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight">Fertilizer & Pesticide Calculator</h1>
          <p className="text-foreground/70 max-w-2xl">Enter crop, area and soil type — get exact NPK kg, urea/DAP/MOP bags, and a spray schedule.</p>
        </header>

        <section className="grid md:grid-cols-2 gap-4">
          <div className="glass-panel-strong rounded-2xl p-5 space-y-4">
            <div>
              <label className="text-xs font-semibold text-foreground/60 uppercase tracking-wider">Crop</label>
              <select value={cropName} onChange={(e) => setCropName(e.target.value)}
                className="mt-1 w-full glass-panel rounded-xl px-3 py-2.5 text-sm font-medium">
                {FERTILIZER_DATA.map((c) => (
                  <option key={c.crop} value={c.crop}>{c.crop} · {c.season}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-foreground/60 uppercase tracking-wider">Area</label>
                <input type="number" min={0.1} step={0.1} value={area}
                  onChange={(e) => setArea(Math.max(0.1, Number(e.target.value) || 0.1))}
                  className="mt-1 w-full glass-panel rounded-xl px-3 py-2.5 text-sm font-medium" />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground/60 uppercase tracking-wider">Unit</label>
                <select value={unit} onChange={(e) => setUnit(e.target.value as keyof typeof AREA_UNITS)}
                  className="mt-1 w-full glass-panel rounded-xl px-3 py-2.5 text-sm font-medium">
                  <option value="acre">Acre</option>
                  <option value="hectare">Hectare</option>
                  <option value="bigha">Bigha</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground/60 uppercase tracking-wider">Soil type</label>
              <div className="mt-1 flex flex-wrap gap-2">
                {(Object.keys(SOIL_ADJUSTMENTS) as (keyof typeof SOIL_ADJUSTMENTS)[]).map((s) => (
                  <button key={s} type="button" onClick={() => setSoil(s)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition ${soil === s ? "bg-primary text-primary-foreground" : "glass-panel text-foreground/70 hover:text-primary"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-start gap-2 text-xs text-foreground/60 bg-primary/5 rounded-xl p-3">
              <Info className="size-4 shrink-0 text-primary" />
              <span>Adjust by ±10–15% based on soil test values. For low OC (&lt; 0.5%), increase N by 20%.</span>
            </div>
          </div>

          <div className="glass-panel-strong rounded-2xl p-5 space-y-4">
            <h2 className="font-bold text-lg flex items-center gap-2"><Sprout className="size-5 text-primary" /> Nutrient requirement</h2>
            <div className="grid grid-cols-3 gap-2 text-center">
              {[["N", N, "chart-1"], ["P₂O₅", P, "chart-2"], ["K₂O", K, "chart-3"]].map(([label, val]) => (
                <div key={label as string} className="rounded-xl bg-primary/10 p-3">
                  <div className="text-[10px] font-bold text-primary/70 uppercase">{label}</div>
                  <div className="text-2xl font-black text-primary">{Math.round(val as number)}</div>
                  <div className="text-[10px] text-foreground/60">kg</div>
                </div>
              ))}
            </div>
            <div className="pt-2 border-t border-foreground/10 space-y-2 text-sm">
              <BagRow label="Urea (46% N)" kg={bags.urea.kg} bags={bags.urea.bags} bagKg={45} />
              <BagRow label="DAP (46% P + 18% N)" kg={bags.dap.kg} bags={bags.dap.bags} bagKg={50} />
              <BagRow label="MOP (60% K)" kg={bags.mop.kg} bags={bags.mop.bags} bagKg={50} />
            </div>
          </div>
        </section>

        <ProGate active={pro.active} label="Split-dose schedule">
          <ul className="space-y-2 text-sm">
            {crop.splits.map((s, i) => (
              <li key={i} className="flex gap-2"><span className="text-primary font-bold shrink-0">{i + 1}.</span><span>{s}</span></li>
            ))}
          </ul>
        </ProGate>

        <ProGate active={pro.active} label="Pesticide & spray calendar">
          <div className="grid md:grid-cols-2 gap-3">
            <div className="rounded-xl bg-destructive/5 p-3">
              <div className="text-xs font-bold uppercase text-destructive mb-1">Common pests / diseases</div>
              <ul className="text-sm list-disc list-inside space-y-0.5">
                {crop.pests.map((p) => <li key={p}>{p}</li>)}
              </ul>
            </div>
            <div className="rounded-xl bg-primary/5 p-3">
              <div className="text-xs font-bold uppercase text-primary mb-1">Spray schedule</div>
              <ul className="text-sm space-y-1">
                {crop.sprayCalendar.map((s, i) => <li key={i} className="text-foreground/80">• {s}</li>)}
              </ul>
            </div>
          </div>
        </ProGate>
      </main>
      <Footer />
    </div>
  );
}

function BagRow({ label, kg, bags, bagKg }: { label: string; kg: number; bags: number; bagKg: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-foreground/70">{label}</span>
      <span className="font-semibold">
        {Math.round(kg)} kg <span className="text-foreground/50 font-normal">· {bags.toFixed(1)} bags ({bagKg}kg)</span>
      </span>
    </div>
  );
}

function ProGate({ active, label, children }: { active: boolean; label: string; children: React.ReactNode }) {
  return (
    <section className="glass-panel-strong rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-lg">{label}</h3>
        {!active && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 text-[10px] font-bold uppercase">
            <Sparkles className="size-3" /> Pro
          </span>
        )}
      </div>
      {active ? children : (
        <div className="flex flex-col items-center text-center py-6 gap-2">
          <Lock className="size-8 text-foreground/40" />
          <p className="text-sm text-foreground/60 max-w-sm">Unlock full split-dose schedules and pesticide calendars with AgriAI Pro.</p>
          <AppLink to="/pricing" className="mt-2 inline-flex px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90">See Pro plans →</AppLink>
        </div>
      )}
    </section>
  );
}
