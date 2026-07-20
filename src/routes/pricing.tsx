import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { activatePro, deactivatePro, useProState } from "@/lib/pro";
import { Check, Sparkles, Crown, Zap } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "AgriAI Pro — Pricing & Plans" },
      { name: "description", content: "Unlock unlimited AI queries, soil report analysis, full crop calendar and price alerts." },
      { property: "og:title", content: "AgriAI Pro — Pricing" },
      { property: "og:description", content: "Affordable premium plans for Indian farmers." },
    ],
  }),
  component: PricingPage,
});

const FREE = ["10 AI queries per day", "3 disease scans per day", "Basic fertilizer calculator", "Current-month calendar", "2 price alerts (local)", "Weather & schemes (full)"];
const PRO = ["Unlimited AI queries", "Unlimited disease scans", "Full split-dose & pesticide schedules", "Full 12-month calendar + iCal export", "20 price alerts + email/SMS", "Soil Health Card AI analysis", "Priority support", "No ads"];

const PAYMENT_LINK = "https://buy.stripe.com/test_agrigrow"; // replace with real Stripe payment link after enabling

export function PricingPage() {
  const pro = useProState();
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [plan, setPlan] = useState<"monthly" | "yearly">("yearly");

  function redeem() {
    const ok = activatePro(code, plan);
    if (ok) { setMsg("✓ AgriAI Pro activated. Enjoy!"); setCode(""); }
    else setMsg("Invalid code. Codes look like AGRIPRO-XXXX-XXXX.");
  }

  return (
    <div className="min-h-screen">
      <Nav />
      <main className="max-w-5xl mx-auto px-3 md:px-6 py-10 md:py-16 space-y-10">
        <header className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel text-xs font-semibold text-primary">
            <Crown className="size-3.5" /> AgriAI Pro
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight">Grow more. Pay less.</h1>
          <p className="text-foreground/70 max-w-xl mx-auto">Unlimited AI, soil analysis and mandi alerts for the price of one cup of chai per week.</p>
        </header>

        {pro.active && (
          <div className="glass-panel-strong rounded-2xl p-5 text-center bg-primary/10 border border-primary/20">
            <div className="flex items-center justify-center gap-2 font-bold text-primary">
              <Sparkles className="size-4" /> You're on AgriAI Pro
            </div>
            <p className="text-sm text-foreground/70 mt-1">Active since {pro.since ? new Date(pro.since).toLocaleDateString() : "now"}. Plan: {pro.plan}</p>
            <button onClick={deactivatePro} className="mt-3 text-xs text-foreground/60 underline">Cancel / remove</button>
          </div>
        )}

        <div className="flex justify-center gap-2">
          {(["monthly", "yearly"] as const).map((p) => (
            <button key={p} onClick={() => setPlan(p)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${plan === p ? "bg-primary text-primary-foreground" : "glass-panel"}`}>
              {p === "monthly" ? "Monthly" : "Yearly (save 25%)"}
            </button>
          ))}
        </div>

        <section className="grid md:grid-cols-2 gap-5">
          <div className="glass-panel-strong rounded-3xl p-6 space-y-4">
            <div>
              <div className="text-xs font-bold uppercase text-foreground/60">Free forever</div>
              <div className="text-4xl font-black">₹0</div>
              <div className="text-xs text-foreground/60">Great for casual use</div>
            </div>
            <ul className="space-y-2 text-sm">
              {FREE.map((f) => <li key={f} className="flex gap-2"><Check className="size-4 text-primary shrink-0" /> {f}</li>)}
            </ul>
            <button disabled className="w-full px-4 py-2.5 rounded-xl glass-panel text-sm font-semibold opacity-70">Current plan</button>
          </div>

          <div className="rounded-3xl p-6 space-y-4 bg-gradient-to-br from-primary/15 via-primary/5 to-transparent ring-2 ring-primary/40 shadow-[var(--shadow-glow-primary)] relative">
            <div className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-wider">Most popular</div>
            <div>
              <div className="text-xs font-bold uppercase text-primary flex items-center gap-1"><Crown className="size-3" /> AgriAI Pro</div>
              <div className="text-4xl font-black">
                {plan === "monthly" ? "₹99" : "₹899"}
                <span className="text-base font-medium text-foreground/60">/{plan === "monthly" ? "mo" : "yr"}</span>
              </div>
              <div className="text-xs text-foreground/60">
                {plan === "yearly" ? "Just ₹75/month billed annually" : "Cancel anytime"}
              </div>
            </div>
            <ul className="space-y-2 text-sm">
              {PRO.map((f) => <li key={f} className="flex gap-2"><Check className="size-4 text-primary shrink-0" /> {f}</li>)}
            </ul>
            <a href={PAYMENT_LINK} target="_blank" rel="noreferrer"
              className="w-full px-4 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 inline-flex items-center justify-center gap-2">
              <Zap className="size-4" /> Get Pro — {plan === "monthly" ? "₹99/mo" : "₹899/yr"}
            </a>
            <p className="text-[11px] text-center text-foreground/50">Secure payment via Stripe. You'll receive your unlock code by email.</p>
          </div>
        </section>

        <section className="glass-panel-strong rounded-2xl p-5 max-w-md mx-auto space-y-3">
          <h2 className="font-bold text-lg">Have an unlock code?</h2>
          <div className="flex gap-2">
            <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="AGRIPRO-XXXX-XXXX"
              className="flex-1 glass-panel rounded-xl px-3 py-2 text-sm font-mono uppercase" />
            <button onClick={redeem} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold">Activate</button>
          </div>
          {msg && <p className="text-sm text-center text-foreground/70">{msg}</p>}
        </section>

        <section className="text-center space-y-2 text-sm text-foreground/60 max-w-xl mx-auto">
          <h3 className="font-bold text-foreground">Questions?</h3>
          <p>Email <a href="mailto:support@agrigrowai.com" className="text-primary underline">support@agrigrowai.com</a>. Refunds within 7 days, no questions asked.</p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
