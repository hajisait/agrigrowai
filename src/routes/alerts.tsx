import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { useProState } from "@/lib/pro";
import { AppLink } from "@/lib/spa-router";
import { Bell, Trash2, Plus, Lock, Sparkles, TrendingUp, TrendingDown } from "lucide-react";

export const Route = createFileRoute("/alerts")({
  head: () => ({
    meta: [
      { title: "Mandi Price Alerts for Farmers — AgriAI" },
      { name: "description", content: "Track target prices for crops and receive reminders when Indian mandi prices move above or below your threshold." },
      { property: "og:title", content: "Mandi Price Alerts for Farmers — AgriAI" },
      { property: "og:description", content: "Set crop price targets and keep up with mandi market changes." },
      { property: "og:url", content: "https://agrigrowai.lovable.app/alerts" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://agrigrowai.lovable.app/alerts" }],
  }),
  component: AlertsPage,
});

type Alert = {
  id: string;
  crop: string;
  state: string;
  threshold: number;
  direction: "above" | "below";
  createdAt: string;
};

const STORAGE = "agriai_alerts_v1";
const STATES = ["Punjab", "Haryana", "Uttar Pradesh", "Madhya Pradesh", "Maharashtra", "Karnataka", "Tamil Nadu", "Andhra Pradesh", "Telangana", "Gujarat", "West Bengal", "Bihar", "Rajasthan", "Odisha", "Kerala"];
const CROPS = ["Rice", "Wheat", "Maize", "Cotton", "Tomato", "Onion", "Potato", "Sugarcane", "Chilli", "Groundnut", "Soybean", "Mustard", "Turmeric", "Chickpea"];

function load(): Alert[] {
  try { return JSON.parse(localStorage.getItem(STORAGE) || "[]"); } catch { return []; }
}
function save(a: Alert[]) { try { localStorage.setItem(STORAGE, JSON.stringify(a)); } catch {} }

export function AlertsPage() {
  const pro = useProState();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [crop, setCrop] = useState(CROPS[0]);
  const [state, setState] = useState(STATES[0]);
  const [threshold, setThreshold] = useState<number>(2500);
  const [direction, setDirection] = useState<"above" | "below">("above");

  useEffect(() => setAlerts(load()), []);
  useEffect(() => save(alerts), [alerts]);

  const freeLimit = pro.active ? 20 : 2;
  const canAdd = alerts.length < freeLimit;

  function add() {
    if (!canAdd) return;
    setAlerts((a) => [...a, {
      id: crypto.randomUUID(),
      crop, state, threshold, direction,
      createdAt: new Date().toISOString(),
    }]);
  }
  function remove(id: string) {
    setAlerts((a) => a.filter((x) => x.id !== id));
  }

  return (
    <div className="min-h-screen">
      <Nav />
      <main className="max-w-4xl mx-auto px-3 md:px-6 py-8 md:py-12 space-y-6">
        <header className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel text-xs font-semibold text-primary">
            <Bell className="size-3.5" /> Price watchlist
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight">Mandi Price Alerts</h1>
          <p className="text-foreground/70 max-w-2xl">Save crops with target prices. When markets cross your threshold, we notify you.</p>
        </header>

        <section className="glass-panel-strong rounded-2xl p-5 space-y-4">
          <h2 className="font-bold text-lg">Add alert</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs font-semibold text-foreground/60 uppercase">Crop</span>
              <select value={crop} onChange={(e) => setCrop(e.target.value)} className="mt-1 w-full glass-panel rounded-xl px-3 py-2 text-sm">
                {CROPS.map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-foreground/60 uppercase">State</span>
              <select value={state} onChange={(e) => setState(e.target.value)} className="mt-1 w-full glass-panel rounded-xl px-3 py-2 text-sm">
                {STATES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-foreground/60 uppercase">Threshold (₹/quintal)</span>
              <input type="number" min={0} value={threshold} onChange={(e) => setThreshold(Number(e.target.value) || 0)}
                className="mt-1 w-full glass-panel rounded-xl px-3 py-2 text-sm" />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-foreground/60 uppercase">Direction</span>
              <div className="mt-1 flex gap-2">
                <button type="button" onClick={() => setDirection("above")}
                  className={`flex-1 px-3 py-2 rounded-xl text-sm font-semibold inline-flex items-center justify-center gap-1 ${direction === "above" ? "bg-primary text-primary-foreground" : "glass-panel"}`}>
                  <TrendingUp className="size-4" /> Above
                </button>
                <button type="button" onClick={() => setDirection("below")}
                  className={`flex-1 px-3 py-2 rounded-xl text-sm font-semibold inline-flex items-center justify-center gap-1 ${direction === "below" ? "bg-primary text-primary-foreground" : "glass-panel"}`}>
                  <TrendingDown className="size-4" /> Below
                </button>
              </div>
            </label>
          </div>
          <button onClick={add} disabled={!canAdd}
            className="w-full px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold disabled:opacity-40 hover:opacity-90 inline-flex items-center justify-center gap-2">
            <Plus className="size-4" /> Add alert
          </button>
          {!canAdd && (
            <p className="text-xs text-center text-foreground/60">
              Free plan: {freeLimit} alerts max. <AppLink to="/pricing" className="text-primary font-semibold underline">Upgrade to Pro</AppLink> for 20 alerts.
            </p>
          )}
        </section>

        <section className="space-y-3">
          <h2 className="font-bold text-lg">Your alerts ({alerts.length}/{freeLimit})</h2>
          {alerts.length === 0 ? (
            <div className="glass-panel rounded-2xl p-8 text-center text-sm text-foreground/60">No alerts yet. Add one above.</div>
          ) : (
            <div className="grid gap-2">
              {alerts.map((a) => (
                <div key={a.id} className="glass-panel rounded-xl p-4 flex items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold">{a.crop} · {a.state}</div>
                    <div className="text-xs text-foreground/60">
                      Notify when price {a.direction} ₹{a.threshold.toLocaleString("en-IN")}/quintal
                    </div>
                  </div>
                  <button onClick={() => remove(a.id)} className="p-2 rounded-lg text-destructive hover:bg-destructive/10">
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {!pro.active && (
          <div className="glass-panel-strong rounded-2xl p-6 text-center space-y-3">
            <Lock className="size-8 mx-auto text-foreground/40" />
            <div>
              <div className="font-bold text-lg flex items-center justify-center gap-2">
                Email + SMS notifications <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 text-[10px] font-bold uppercase"><Sparkles className="size-3" /> Pro</span>
              </div>
              <p className="text-sm text-foreground/60 max-w-md mx-auto">Free plan tracks alerts locally. Pro delivers them to your inbox & phone automatically.</p>
            </div>
            <AppLink to="/pricing" className="inline-flex px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90">See Pro plans →</AppLink>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
