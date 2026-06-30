import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { useI18n } from "@/lib/i18n";
import {
  Calculator,
  RotateCcw,
  Copy,
  Check,
  Minus,
  Plus,
  Share2,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Wallet,
  Wheat,
} from "lucide-react";

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

type CostKey = "seeds" | "fertilizer" | "labor" | "irrigation" | "pesticides" | "other";
type Costs = Record<CostKey, number>;

const PRESET_CROPS = [
  { name: "Rice", yield: 22, price: 2200 },
  { name: "Wheat", yield: 18, price: 2400 },
  { name: "Tomato", yield: 250, price: 1500 },
  { name: "Cotton", yield: 8, price: 7000 },
  { name: "Onion", yield: 120, price: 1800 },
  { name: "Potato", yield: 100, price: 1200 },
  { name: "Maize", yield: 25, price: 2100 },
  { name: "Sugarcane", yield: 350, price: 320 },
  { name: "Chilli", yield: 15, price: 12000 },
  { name: "Groundnut", yield: 14, price: 6000 },
];

const AREA_PRESETS = [0.5, 1, 2, 5, 10];

const COST_TEMPLATES: Record<"low" | "medium" | "high", Costs> = {
  low: { seeds: 1500, fertilizer: 2500, labor: 2000, irrigation: 800, pesticides: 700, other: 500 },
  medium: { seeds: 2500, fertilizer: 4000, labor: 3000, irrigation: 1500, pesticides: 1200, other: 1000 },
  high: { seeds: 4000, fertilizer: 6500, labor: 5000, irrigation: 2500, pesticides: 2000, other: 2000 },
};

function fmtMoney(n: number) {
  const abs = Math.abs(Math.round(n));
  return `${n < 0 ? "-" : ""}₹${abs.toLocaleString("en-IN")}`;
}

function useAnimatedNumber(target: number, duration = 450) {
  const [value, setValue] = useState(target);
  const fromRef = useRef(target);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    fromRef.current = value;
    startRef.current = null;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const tick = (ts: number) => {
      if (startRef.current === null) startRef.current = ts;
      const t = Math.min(1, (ts - startRef.current) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(fromRef.current + (target - fromRef.current) * eased);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return value;
}

export function CalculatorPage() {
  const { t } = useI18n();
  const [crop, setCrop] = useState("Rice");
  const [area, setArea] = useState(1);
  const [yieldPerAcre, setYieldPerAcre] = useState(22);
  const [price, setPrice] = useState(2200);
  const [costs, setCosts] = useState<Costs>(COST_TEMPLATES.medium);
  const [activeTemplate, setActiveTemplate] = useState<"low" | "medium" | "high" | null>("medium");
  const [copied, setCopied] = useState(false);

  const totalRevenue = useMemo(() => area * yieldPerAcre * price, [area, yieldPerAcre, price]);
  const perAcreCost = useMemo(() => Object.values(costs).reduce((a, b) => a + b, 0), [costs]);
  const totalCost = useMemo(() => perAcreCost * area, [perAcreCost, area]);
  const netProfit = totalRevenue - totalCost;
  const profitPerAcre = area > 0 ? netProfit / area : 0;
  const margin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
  const isProfit = netProfit >= 0;

  const animProfit = useAnimatedNumber(netProfit);
  const animRevenue = useAnimatedNumber(totalRevenue);
  const animCost = useAnimatedNumber(totalCost);

  function applyCrop(name: string) {
    setCrop(name);
    const preset = PRESET_CROPS.find((p) => p.name === name);
    if (preset) {
      setYieldPerAcre(preset.yield);
      setPrice(preset.price);
    }
  }

  function applyTemplate(key: "low" | "medium" | "high") {
    setCosts(COST_TEMPLATES[key]);
    setActiveTemplate(key);
  }

  function updateCost(key: CostKey, value: number) {
    setCosts((prev) => ({ ...prev, [key]: Math.max(0, value) }));
    setActiveTemplate(null);
  }

  function reset() {
    setCrop("Rice");
    setArea(1);
    setYieldPerAcre(22);
    setPrice(2200);
    setCosts(COST_TEMPLATES.medium);
    setActiveTemplate("medium");
    setCopied(false);
  }

  const summaryText = useMemo(
    () =>
      `${t("page.calculator.title")}\n${crop} · ${area} acre(s)\nYield: ${yieldPerAcre} q/ac @ ${fmtMoney(price)}\n\nRevenue: ${fmtMoney(totalRevenue)}\nCost: ${fmtMoney(totalCost)}\nProfit: ${fmtMoney(netProfit)} (${margin.toFixed(1)}%)\nPer acre: ${fmtMoney(profitPerAcre)}`,
    [t, crop, area, yieldPerAcre, price, totalRevenue, totalCost, netProfit, margin, profitPerAcre],
  );

  async function copySummary() {
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  }

  async function shareSummary() {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await (navigator as Navigator & { share: (d: ShareData) => Promise<void> }).share({
          title: t("page.calculator.title"),
          text: summaryText,
        });
        return;
      } catch {
        /* fall back */
      }
    }
    copySummary();
  }

  const costBreakdown = (Object.entries(costs) as [CostKey, number][])
    .map(([k, v]) => ({ key: k, value: v, pct: perAcreCost > 0 ? (v / perAcreCost) * 100 : 0 }))
    .sort((a, b) => b.value - a.value);

  const breakdownColors: Record<CostKey, string> = {
    seeds: "bg-amber-400",
    fertilizer: "bg-emerald-500",
    labor: "bg-sky-500",
    irrigation: "bg-cyan-400",
    pesticides: "bg-rose-400",
    other: "bg-violet-400",
  };

  return (
    <>
      <Nav />
      <main className="max-w-6xl mx-auto px-4 md:px-6 pt-8 pb-32 lg:pb-16">
        <div className="text-center mb-8 animate-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-[11px] font-bold uppercase tracking-widest mb-3">
            <Sparkles className="size-3.5" /> Smart estimator
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter">{t("page.calculator.title")}</h1>
          <p className="text-foreground/60 mt-2">{t("page.calculator.subtitle")}</p>
        </div>

        <div className="grid lg:grid-cols-[1.15fr_1fr] gap-5">
          {/* INPUTS */}
          <div className="space-y-5">
            {/* Crop */}
            <Panel>
              <SectionHeader
                icon={<Wheat className="size-5" />}
                title={t("calculator.crop")}
                hint="Tap a crop to auto-fill yield & price"
              />
              <div className="mt-4 flex flex-wrap gap-2">
                {PRESET_CROPS.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => applyCrop(c.name)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-bold border transition active:scale-95 ${
                      crop === c.name
                        ? "bg-primary text-primary-foreground border-primary shadow-[var(--shadow-glow-primary)]"
                        : "bg-white/70 border-white/80 text-foreground/70 hover:bg-white"
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
              <input
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                placeholder="Or type your own crop"
                maxLength={40}
                className="w-full mt-3 bg-white/70 border border-white/80 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/50 focus:bg-white transition"
              />
            </Panel>

            {/* Area */}
            <Panel>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <SectionHeader
                  inline
                  icon={<Calculator className="size-5" />}
                  title={t("calculator.area")}
                />
                <div className="flex gap-1.5">
                  {AREA_PRESETS.map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setArea(a)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition active:scale-95 ${
                        area === a
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-white/70 border-white/80 text-foreground/70 hover:bg-white"
                      }`}
                    >
                      {a} ac
                    </button>
                  ))}
                </div>
              </div>
              <Stepper value={area} onChange={setArea} step={0.5} min={0} suffix="acres" big />

              <div className="grid sm:grid-cols-2 gap-3 mt-4">
                <Stepper
                  label={t("calculator.yield")}
                  value={yieldPerAcre}
                  onChange={setYieldPerAcre}
                  step={1}
                  min={0}
                  suffix="q/ac"
                />
                <Stepper
                  label={t("calculator.price")}
                  value={price}
                  onChange={setPrice}
                  step={100}
                  min={0}
                  prefix="₹"
                  suffix="/q"
                />
              </div>
            </Panel>

            {/* Costs */}
            <Panel>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <SectionHeader
                  inline
                  icon={<Wallet className="size-5" />}
                  title={`${t("calculator.cost")} (per acre)`}
                />
                <div className="flex gap-1.5">
                  {(["low", "medium", "high"] as const).map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => applyTemplate(k)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border capitalize transition active:scale-95 ${
                        activeTemplate === k
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-white/70 border-white/80 text-foreground/70 hover:bg-white"
                      }`}
                    >
                      {k}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 grid sm:grid-cols-2 gap-3">
                {(
                  [
                    ["seeds", t("calculator.seeds")],
                    ["fertilizer", t("calculator.fertilizer")],
                    ["labor", t("calculator.labor")],
                    ["irrigation", t("calculator.irrigation")],
                    ["pesticides", t("calculator.pesticides")],
                    ["other", t("calculator.other")],
                  ] as [CostKey, string][]
                ).map(([key, label]) => (
                  <Stepper
                    key={key}
                    label={label}
                    value={costs[key]}
                    onChange={(v) => updateCost(key, v)}
                    step={250}
                    min={0}
                    prefix="₹"
                    compact
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={reset}
                className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-foreground/55 hover:text-primary transition"
              >
                <RotateCcw className="size-3.5" /> {t("calculator.reset")}
              </button>
            </Panel>
          </div>

          {/* RESULTS — sticky on desktop */}
          <div className="lg:sticky lg:top-24 lg:self-start space-y-4">
            <div
              className={`relative rounded-[2rem] p-6 md:p-7 overflow-hidden text-white shadow-2xl transition-colors duration-500 ${
                isProfit
                  ? "bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600"
                  : "bg-gradient-to-br from-rose-500 via-rose-600 to-red-700"
              }`}
            >
              <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/25 blur-3xl rounded-full pointer-events-none" />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">
                    Net Profit
                  </div>
                  <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold border border-white/20">
                    {isProfit ? <TrendingUp className="size-3.5" /> : <TrendingDown className="size-3.5" />}
                    {margin.toFixed(1)}%
                  </div>
                </div>
                <div className="mt-2 text-4xl md:text-5xl font-extrabold tracking-tighter tabular-nums">
                  {fmtMoney(animProfit)}
                </div>
                <div className="mt-1 text-sm text-white/85 font-semibold tabular-nums">
                  {fmtMoney(profitPerAcre)} / acre
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4 pt-5 border-t border-white/15">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-white/70">
                      {t("calculator.revenue")}
                    </div>
                    <div className="text-lg font-bold tabular-nums mt-0.5">{fmtMoney(animRevenue)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-white/70">
                      {t("calculator.cost")}
                    </div>
                    <div className="text-lg font-bold tabular-nums mt-0.5">{fmtMoney(animCost)}</div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={copySummary}
                    className="flex items-center justify-center gap-1.5 rounded-2xl bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 py-3 text-xs font-bold transition active:scale-95"
                  >
                    {copied ? (
                      <>
                        <Check className="size-4" /> {t("calculator.copied")}
                      </>
                    ) : (
                      <>
                        <Copy className="size-4" /> {t("calculator.copy")}
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={shareSummary}
                    className="flex items-center justify-center gap-1.5 rounded-2xl bg-white text-foreground py-3 text-xs font-bold transition active:scale-95 hover:bg-white/90"
                  >
                    <Share2 className="size-4" /> Share
                  </button>
                </div>
              </div>
            </div>

            {/* Breakdown */}
            <Panel>
              <SectionHeader inline title="Cost breakdown / acre" />
              <div className="mt-4 flex h-2.5 w-full overflow-hidden rounded-full bg-foreground/10">
                {costBreakdown.map((c) =>
                  c.pct > 0 ? (
                    <div
                      key={c.key}
                      className={`${breakdownColors[c.key]} transition-all duration-500`}
                      style={{ width: `${c.pct}%` }}
                      title={`${c.key} ${c.pct.toFixed(0)}%`}
                    />
                  ) : null,
                )}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                {costBreakdown.map((c) => (
                  <div key={c.key} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`size-2.5 rounded-sm shrink-0 ${breakdownColors[c.key]}`} />
                      <span className="capitalize text-foreground/70 truncate">{c.key}</span>
                    </div>
                    <span className="font-bold tabular-nums">{c.pct.toFixed(0)}%</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-foreground/10 flex items-center justify-between text-xs">
                <span className="text-foreground/60 font-semibold">Total cost / acre</span>
                <span className="font-bold tabular-nums">{fmtMoney(perAcreCost)}</span>
              </div>
            </Panel>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return <div className="glass-panel rounded-[1.75rem] p-5 md:p-6">{children}</div>;
}

function SectionHeader({
  icon,
  title,
  hint,
  inline,
}: {
  icon?: React.ReactNode;
  title: string;
  hint?: string;
  inline?: boolean;
}) {
  return (
    <div className={`flex ${inline ? "items-center" : "items-start"} gap-3`}>
      {icon && (
        <div className="size-9 rounded-xl bg-primary/10 text-primary grid place-items-center shrink-0">
          {icon}
        </div>
      )}
      <div className="min-w-0">
        <div className="text-sm font-bold">{title}</div>
        {hint && <div className="text-[11px] text-foreground/50 mt-0.5">{hint}</div>}
      </div>
    </div>
  );
}

function Stepper({
  label,
  value,
  onChange,
  step = 1,
  min = 0,
  prefix,
  suffix,
  compact,
  big,
}: {
  label?: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
  min?: number;
  prefix?: string;
  suffix?: string;
  compact?: boolean;
  big?: boolean;
}) {
  const dec = () => onChange(Math.max(min, +(value - step).toFixed(2)));
  const inc = () => onChange(+(value + step).toFixed(2));
  return (
    <div className={big ? "mt-4" : ""}>
      {label && (
        <label className="text-[10px] uppercase font-bold tracking-widest text-foreground/55 block mb-1.5">
          {label}
        </label>
      )}
      <div
        className={`flex items-center gap-1 bg-white/70 border border-white/80 rounded-2xl p-1 focus-within:border-primary/50 transition ${
          big ? "" : ""
        }`}
      >
        <button
          type="button"
          onClick={dec}
          aria-label="Decrease"
          className={`${big ? "size-12" : compact ? "size-9" : "size-10"} grid place-items-center rounded-xl bg-white text-foreground/70 hover:text-primary hover:bg-primary/5 active:scale-90 transition shrink-0`}
        >
          <Minus className={big ? "size-5" : "size-4"} />
        </button>
        <div className="flex-1 flex items-center justify-center gap-1 min-w-0">
          {prefix && <span className={`${big ? "text-xl" : "text-sm"} font-bold text-foreground/50`}>{prefix}</span>}
          <input
            type="number"
            inputMode="decimal"
            min={min}
            step={step}
            value={Number.isFinite(value) ? value : 0}
            onChange={(e) => {
              const v = e.target.value;
              onChange(v === "" ? 0 : Math.max(min, Number(v)));
            }}
            className={`w-full bg-transparent text-center outline-none font-bold tabular-nums ${
              big ? "text-2xl" : "text-base"
            }`}
          />
          {suffix && <span className={`${big ? "text-sm" : "text-[11px]"} font-bold text-foreground/50`}>{suffix}</span>}
        </div>
        <button
          type="button"
          onClick={inc}
          aria-label="Increase"
          className={`${big ? "size-12" : compact ? "size-9" : "size-10"} grid place-items-center rounded-xl bg-white text-foreground/70 hover:text-primary hover:bg-primary/5 active:scale-90 transition shrink-0`}
        >
          <Plus className={big ? "size-5" : "size-4"} />
        </button>
      </div>
    </div>
  );
}
