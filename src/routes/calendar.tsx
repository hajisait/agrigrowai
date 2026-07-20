import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { CROP_CALENDARS } from "@/lib/crop-calendar-data";
import { useProState } from "@/lib/pro";
import { AppLink } from "@/lib/spa-router";
import { CalendarDays, Sparkles, Lock, Download } from "lucide-react";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Crop Calendar & Sowing Advisor — AgriAI Assist" },
      { name: "description", content: "State-wise month-by-month sowing, fertilizer and harvest schedule for Indian crops." },
      { property: "og:title", content: "Crop Calendar — AgriAI Assist" },
      { property: "og:description", content: "12-month cropping timeline for India." },
    ],
  }),
  component: CalendarPage,
});

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function CalendarPage() {
  const pro = useProState();
  const [cropIdx, setCropIdx] = useState(0);
  const currentMonth = new Date().getMonth();
  const crop = CROP_CALENDARS[cropIdx];

  const byMonth = useMemo(() => {
    const m: Record<number, typeof crop.timeline> = {};
    crop.timeline.forEach((e) => {
      (m[e.month] ??= []).push(e);
    });
    return m;
  }, [crop]);

  const visibleMonths = pro.active ? Array.from({ length: 12 }, (_, i) => i) : [currentMonth];

  function downloadICS() {
    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      `PRODID:-//AgriAI//${crop.crop}//EN`,
    ];
    const year = new Date().getFullYear();
    crop.timeline.forEach((e, i) => {
      const d = new Date(year, e.month, 15);
      const stamp = d.toISOString().replace(/[-:]|\.\d{3}/g, "").slice(0, 15) + "Z";
      lines.push(
        "BEGIN:VEVENT",
        `UID:${crop.crop}-${i}@agriai`,
        `DTSTAMP:${stamp}`,
        `DTSTART;VALUE=DATE:${d.getFullYear()}${String(e.month + 1).padStart(2, "0")}15`,
        `SUMMARY:${crop.crop}: ${e.activity}`,
        `DESCRIPTION:${e.detail.replace(/\n/g, " ")}`,
        "END:VEVENT",
      );
    });
    lines.push("END:VCALENDAR");
    const blob = new Blob([lines.join("\r\n")], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${crop.crop.replace(/\s+/g, "-")}-calendar.ics`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen">
      <Nav />
      <main className="max-w-6xl mx-auto px-3 md:px-6 py-8 md:py-12 space-y-6">
        <header className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel text-xs font-semibold text-primary">
            <CalendarDays className="size-3.5" /> 12-month crop calendar
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight">Crop Calendar & Sowing Advisor</h1>
          <p className="text-foreground/70 max-w-2xl">Month-by-month sowing, irrigation, fertilizer and harvest guidance for major Indian crops.</p>
        </header>

        <div className="glass-panel-strong rounded-2xl p-4 flex flex-wrap gap-2">
          {CROP_CALENDARS.map((c, i) => (
            <button key={c.crop} onClick={() => setCropIdx(i)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${i === cropIdx ? "bg-primary text-primary-foreground" : "glass-panel text-foreground/70 hover:text-primary"}`}>
              {c.crop}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase text-foreground/50 font-bold">Primary states</div>
            <div className="text-sm text-foreground/80">{crop.states.join(" · ")}</div>
          </div>
          {pro.active && (
            <button onClick={downloadICS} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20">
              <Download className="size-3.5" /> Export .ics
            </button>
          )}
        </div>

        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {visibleMonths.map((m) => {
            const entries = byMonth[m] || [];
            const isCurrent = m === currentMonth;
            return (
              <div key={m} className={`rounded-2xl p-4 ${isCurrent ? "bg-primary/10 ring-2 ring-primary/40" : "glass-panel"}`}>
                <div className="flex items-baseline justify-between mb-2">
                  <div className="text-xl font-black">{MONTHS[m]}</div>
                  {isCurrent && <span className="text-[10px] font-bold uppercase text-primary">Now</span>}
                </div>
                {entries.length === 0 ? (
                  <p className="text-xs text-foreground/50 italic">No scheduled activity.</p>
                ) : (
                  <ul className="space-y-2 text-sm">
                    {entries.map((e, i) => (
                      <li key={i}>
                        <div className="font-semibold text-foreground/90">{e.activity}</div>
                        <div className="text-xs text-foreground/60">{e.detail}</div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </section>

        {!pro.active && (
          <div className="glass-panel-strong rounded-2xl p-6 text-center space-y-3">
            <Lock className="size-8 mx-auto text-foreground/40" />
            <div>
              <div className="font-bold text-lg flex items-center justify-center gap-2">
                Full 12-month timeline <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 text-[10px] font-bold uppercase"><Sparkles className="size-3" /> Pro</span>
              </div>
              <p className="text-sm text-foreground/60 max-w-md mx-auto">Free shows the current month. Upgrade to see the full year, get iCal export, and weather-adjusted reminders.</p>
            </div>
            <AppLink to="/pricing" className="inline-flex px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90">See Pro plans →</AppLink>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
