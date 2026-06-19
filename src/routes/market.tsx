import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search, TrendingDown, TrendingUp, ArrowUpDown, ExternalLink, RefreshCw } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { useI18n } from "@/lib/i18n";
import { getMarketPrices, type MarketCrop } from "@/lib/api-client";

export const Route = createFileRoute("/market")({
  head: () => ({
    meta: [
      { title: "Market Prices — AgriAI Assist" },
      { name: "description", content: "Live mandi prices, trends and nearby market comparison for major crops across Indian states." },
      { property: "og:title", content: "Market Prices — AgriAI Assist" },
      { property: "og:description", content: "Live mandi prices and price trends for farmers." },
    ],
  }),
  component: MarketPage,
});

type SortKey = "name" | "price" | "change";

export function MarketPage() {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const [state, setState] = useState("All");
  const [sort, setSort] = useState<SortKey>("change");
  const [nonce, setNonce] = useState(0);
  const [crops, setCrops] = useState<MarketCrop[]>([]);
  const [states, setStates] = useState(["All"]);
  const [updatedAt, setUpdatedAt] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getMarketPrices({ query, state, sort, nonce })
      .then((res) => {
        if (cancelled) return;
        setCrops(res.crops);
        setStates(res.states);
        setUpdatedAt(res.updatedAt);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [query, state, sort, nonce]);

  return (
    <>
      <Nav />
      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-10 pb-16">
        <div className="text-center mb-8 animate-fade-up">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter">{t("page.market.title")}</h1>
          <p className="text-foreground/60 mt-2">{t("page.market.subtitle")} · Updated {updatedAt}</p>
        </div>

        <div className="glass-panel rounded-3xl p-4 md:p-5 mb-6 flex flex-col md:flex-row gap-3 md:items-center">
          <div className="flex-grow relative">
            <Search className="size-4 absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search crop, grade or mandi…"
              className="w-full bg-white/70 border border-white/80 rounded-full pl-11 pr-5 py-2.5 text-sm outline-none focus:border-primary/50 focus:bg-white"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto md:max-w-xs">
            {states.map((s) => (
              <button key={s} type="button" onClick={() => setState(s)} className={`shrink-0 rounded-full px-3.5 py-2.5 text-xs font-bold border transition ${state === s ? "bg-primary text-primary-foreground border-primary" : "bg-white/70 border-white/80 text-foreground/70 hover:bg-white"}`}>
                {s === "All" ? "All States" : s}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {([
              ["change", "Top Movers"],
              ["price", "Highest"],
              ["name", "A–Z"],
            ] as const).map(([key, label]) => (
              <button key={key} type="button" onClick={() => setSort(key)} className={`rounded-full px-3.5 py-2.5 text-xs font-bold border transition ${sort === key ? "bg-primary text-primary-foreground border-primary" : "bg-white/70 border-white/80 text-foreground/70 hover:bg-white"}`}>
                {label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setNonce((n) => n + 1)}
            className="bg-primary text-primary-foreground rounded-full px-4 py-2.5 text-sm font-bold flex items-center gap-2 shadow-[var(--shadow-glow-primary)] hover:scale-[1.02] transition"
            title="Refresh"
          >
            <RefreshCw className="size-4" /> Refresh
          </button>
        </div>

        {crops.length === 0 ? (
          <div className="text-center text-foreground/50 py-16">
            <ArrowUpDown className="size-8 mx-auto mb-3 opacity-40" />
            No crops match your filters.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {crops.map((c) => {
              const up = c.change >= 0;
              const max = Math.max(...c.spark);
              const min = Math.min(...c.spark);
              return (
                <div key={c.name} className="glass-panel rounded-[2rem] p-6 hover:bg-white/65 transition flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="size-12 rounded-2xl bg-white grid place-items-center text-2xl">{c.emoji}</div>
                      <div>
                        <p className="font-bold">{c.name}</p>
                        <p className="text-xs text-foreground/50">{c.grade}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-bold flex items-center gap-1 ${up ? "text-emerald-600" : "text-red-500"}`}>
                      {up ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />} {up ? "+" : ""}{c.change}%
                    </span>
                  </div>
                  <div className="flex items-end justify-between mb-3">
                    <p className="font-mono text-3xl font-extrabold tracking-tight">₹{c.price.toLocaleString("en-IN")}</p>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-foreground/40">per qt</p>
                  </div>
                  <p className="text-[11px] text-foreground/50 mb-3">📍 {c.mandi} · {c.state}</p>
                  <svg viewBox="0 0 100 30" className="w-full h-12 mb-4">
                    <polyline
                      fill="none"
                      stroke={up ? "oklch(0.55 0.15 145)" : "oklch(0.60 0.21 25)"}
                      strokeWidth="1.5"
                      points={c.spark.map((v, i) => {
                        const x = (i / (c.spark.length - 1)) * 100;
                        const y = 28 - ((v - min) / Math.max(1, max - min)) * 24;
                        return `${x},${y}`;
                      }).join(" ")}
                    />
                  </svg>
                  <a
                    href={`https://agmarknet.gov.in/SearchCmmMkt.aspx?Tx_Commodity=0&Tx_State=0&Tx_District=0&Tx_Market=0&DateFrom=&DateTo=&Fr_Date=&To_Date=&Tx_Trend=0&Tx_CommodityHead=${encodeURIComponent(c.name)}&Tx_StateHead=--Select--&Tx_DistrictHead=--Select--&Tx_MarketHead=--Select--`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex items-center justify-center gap-1.5 text-xs font-bold text-primary bg-primary/10 hover:bg-primary/15 rounded-full py-2.5 transition"
                  >
                    View on Agmarknet <ExternalLink className="size-3" />
                  </a>
                </div>
              );
            })}
          </div>
        )}

        <p className="text-center text-[11px] text-foreground/40 mt-8">
          Indicative prices derived from recent mandi trends. For binding rates, consult{" "}
          <a className="underline hover:text-primary" target="_blank" rel="noopener noreferrer" href="https://agmarknet.gov.in/">Agmarknet</a>.
        </p>
      </main>
      <Footer />
    </>
  );
}
