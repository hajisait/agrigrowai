import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { useI18n } from "@/lib/i18n";
import { Calculator, RotateCcw, Copy, Check } from "lucide-react";

export const Route = createFileRoute("/calculator")({
  head: () => ({
    meta: [
      { title: "Crop Profit Calculator — AgriAI Assist" },
      { name: "description", content: "Estimate crop revenue, costs and net profit before you sow." },
      { property: "og:title", content: "Crop Profit Calculator — AgriAI Assist" },
      { property: "og:description", content: "Estimate crop revenue, costs and net profit." },
    ],
  }),
  component: CalculatorPage,
});

const PRESET_CROPS = ["Rice", "Wheat", "Tomato", "Cotton", "Onion", "Potato", "Maize", "Sugarcane", "Brinjal", "Chilli", "Banana", "Groundnut", "Soybean", "Mango", "Grapes"];

function fmtMoney(n: number) {
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

export function CalculatorPage() {
  const { t } = useI18n();
  const [crop, setCrop] = useState("Rice");
  const [area, setArea] = useState<number | "">(1);
  const [yieldPerAcre, setYieldPerAcre] = useState<number | "">(20);
  const [price, setPrice] = useState<number | "">(2500);
  const [costs, setCosts] = useState({ seeds: 2500, fertilizer: 4000, labor: 3000, irrigation: 1500, pesticides: 1200, other: 1000 });
  const [copied, setCopied] = useState(false);

  const areaNum = typeof area === "number" ? area : 0;
  const yieldNum = typeof yieldPerAcre === "number" ? yieldPerAcre : 0;
  const priceNum = typeof price === "number" ? price : 0;

  const totalRevenue = useMemo(() => areaNum * yieldNum * priceNum, [areaNum, yieldNum, priceNum]);
  const totalCost = useMemo(() => Object.values(costs).reduce((a, b) => a + b, 0) * areaNum, [costs, areaNum]);
  const netProfit = totalRevenue - totalCost;
  const profitPerAcre = areaNum > 0 ? netProfit / areaNum : 0;

  function updateCost(key: keyof typeof costs, value: number | "") {
    setCosts((prev) => ({ ...prev, [key]: value === "" ? 0 : value }));
  }

  function reset() {
    setCrop("Rice");
    setArea(1);
    setYieldPerAcre(20);
    setPrice(2500);
    setCosts({ seeds: 2500, fertilizer: 4000, labor: 3000, irrigation: 1500, pesticides: 1200, other: 1000 });
    setCopied(false);
  }

  async function copySummary() {
    const summary = `${t("page.calculator.title")}\n${t("calculator.crop")}: ${crop}\n${t("calculator.area")}: ${areaNum} acre(s)\n${t("calculator.yield")}: ${yieldNum} quintal/acre\n${t("calculator.price")}: ${fmtMoney(priceNum)}\n\n${t("calculator.revenue")}: ${fmtMoney(totalRevenue)}\n${t("calculator.cost")}: ${fmtMoney(totalCost)}\n${t("calculator.profit")}: ${fmtMoney(netProfit)}\n${t("calculator.perAcre")}: ${fmtMoney(profitPerAcre)}`;
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  return (
    <>
      <Nav />
      <main className="max-w-5xl mx-auto px-4 md:px-6 pt-10 pb-16">
        <div className="text-center mb-8 animate-fade-up">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter">{t("page.calculator.title")}</h1>
          <p className="text-foreground/60 mt-2">{t("page.calculator.subtitle")}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-5">
          {/* Inputs */}
          <div className="glass-panel rounded-[2rem] p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="size-12 rounded-2xl bg-primary/10 text-primary grid place-items-center">
                <Calculator className="size-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Plan your crop</h2>
                <p className="text-xs text-foreground/50">Enter expected values below</p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="text-[11px] uppercase font-bold tracking-widest text-foreground/50">{t("calculator.crop")}</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {PRESET_CROPS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCrop(c)}
                      className={`rounded-full px-3 py-1.5 text-xs font-bold border transition ${crop === c ? "bg-primary text-primary-foreground border-primary" : "bg-white/70 border-white/80 text-foreground/70 hover:bg-white"}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                <input
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                  placeholder="Or type your crop"
                  maxLength={40}
                  className="w-full mt-3 bg-white/70 border border-white/80 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/50 focus:bg-white"
                />
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <NumberField
                  label={t("calculator.area")}
                  value={area}
                  onChange={setArea}
                  min={0}
                  step={0.5}
                />
                <NumberField
                  label={t("calculator.yield")}
                  value={yieldPerAcre}
                  onChange={setYieldPerAcre}
                  min={0}
                  step={1}
                />
                <NumberField
                  label={t("calculator.price")}
                  value={price}
                  onChange={setPrice}
                  min={0}
                  step={100}
                />
              </div>

              <div>
                <label className="text-[11px] uppercase font-bold tracking-widest text-foreground/50">{t("calculator.cost")} per acre</label>
                <div className="mt-2 grid sm:grid-cols-2 gap-3">
                  {([
                    ["seeds", t("calculator.seeds")],
                    ["fertilizer", t("calculator.fertilizer")],
                    ["labor", t("calculator.labor")],
                    ["irrigation", t("calculator.irrigation")],
                    ["pesticides", t("calculator.pesticides")],
                    ["other", t("calculator.other")],
                  ] as [keyof typeof costs, string][]).map(([key, label]) => (
                    <NumberField
                      key={key}
                      label={label}
                      value={costs[key]}
                      onChange={(v) => updateCost(key, v)}
                      min={0}
                      step={100}
                    />
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={reset}
                className="flex items-center gap-2 text-xs font-bold text-foreground/55 hover:text-primary transition"
              >
                <RotateCcw className="size-3.5" /> {t("calculator.reset")}
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-5">
            <div className="glass-panel rounded-[2rem] p-6 md:p-8">
              <h2 className="text-xl font-bold mb-6">Estimated Returns</h2>
              <div className="space-y-4">
                <ResultRow label={t("calculator.revenue")} value={fmtMoney(totalRevenue)} />
                <ResultRow label={t("calculator.cost")} value={fmtMoney(totalCost)} />
                <div className="pt-4 border-t border-foreground/10">
                  <ResultRow
                    label={t("calculator.profit")}
                    value={fmtMoney(netProfit)}
                    valueClass={netProfit >= 0 ? "text-emerald-600" : "text-red-500"}
                    large
                  />
                  <ResultRow label={t("calculator.perAcre")} value={fmtMoney(profitPerAcre)} />
                </div>
              </div>

              <button
                type="button"
                onClick={copySummary}
                className="mt-8 w-full flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground py-3 text-sm font-bold shadow-[var(--shadow-glow-primary)] hover:scale-[1.02] transition"
              >
                {copied ? <><Check className="size-4" /> {t("calculator.copied")}</> : <><Copy className="size-4" /> {t("calculator.copy")}</>}
              </button>
            </div>

            <div className="glass-panel rounded-[2rem] p-6">
              <h3 className="font-bold mb-2">How it works</h3>
              <p className="text-sm text-foreground/60 leading-relaxed">
                Total revenue = area × yield × price. Total cost = sum of per-acre expenses × area. Net profit = revenue minus cost. This is a planning estimate; actual prices and yields vary by mandi, weather, and season.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function NumberField({
  label,
  value,
  onChange,
  min,
  step,
}: {
  label: string;
  value: number | "";
  onChange: (v: number | "") => void;
  min?: number;
  step?: number;
}) {
  return (
    <div>
      <label className="text-[10px] uppercase font-bold tracking-widest text-foreground/50">{label}</label>
      <input
        type="number"
        min={min}
        step={step}
        value={value}
        onChange={(e) => {
          const v = e.target.value;
          onChange(v === "" ? "" : Math.max(min ?? 0, Number(v)));
        }}
        className="w-full mt-1 bg-white/70 border border-white/80 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/50 focus:bg-white"
      />
    </div>
  );
}

function ResultRow({
  label,
  value,
  valueClass,
  large,
}: {
  label: string;
  value: string;
  valueClass?: string;
  large?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-semibold text-foreground/70">{label}</span>
      <span className={`font-mono font-bold ${large ? "text-2xl" : "text-lg"} ${valueClass ?? ""}`}>{value}</span>
    </div>
  );
}
