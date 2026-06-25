import { useEffect, useState } from "react";
import { BatteryCharging, Coins, Loader2, RefreshCw, Sparkles } from "lucide-react";
import { getCredits, getSessionQueryCount, resetSessionQueryCount } from "@/lib/api-client";
import { useI18n } from "@/lib/i18n";

type Credits = {
  remainingCredits: number;
  dailyRemaining: number;
  totalGranted: number;
  usedThisPeriod: number;
  costPerQuery: number;
  estimatedQueries: number;
  source: string;
  lastUpdated: string;
};

export function CreditsWidget() {
  const { t } = useI18n();
  const [credits, setCredits] = useState<Credits | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionQueries, setSessionQueries] = useState(0);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCredits();
      setCredits(data);
      setSessionQueries(getSessionQueryCount());
    } catch (e) {
      setError(t("credits.error") ?? "Could not load credit balance.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const reset = () => {
    resetSessionQueryCount();
    setSessionQueries(0);
  };

  const remaining = credits ? Math.max(0, credits.estimatedQueries - sessionQueries) : 0;
  const usedPercent = credits && credits.totalGranted > 0
    ? Math.min(100, (credits.usedThisPeriod / credits.totalGranted) * 100)
    : 0;
  const dailyPercent = credits && credits.dailyRemaining > 0 && credits.totalGranted > 0
    ? Math.min(100, (credits.dailyRemaining / credits.totalGranted) * 100)
    : 0;

  return (
    <div className="md:col-span-4 glass-panel p-6 md:p-8 rounded-[2rem] flex flex-col justify-between">
      <div>
        <div className="mb-1 flex items-start justify-between gap-3">
          <h2 className="text-2xl font-bold tracking-tight">{t("credits.title")}</h2>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-1">
            <Sparkles className="size-3" /> AI
          </span>
        </div>
        <p className="text-sm text-foreground/60 mb-6">{t("credits.subtitle")}</p>

        {loading ? (
          <div className="flex items-center gap-2 text-sm text-foreground/60 py-6">
            <Loader2 className="size-4 animate-spin" /> {t("credits.loading")}
          </div>
        ) : error ? (
          <div className="text-sm text-red-500 py-4">{error}</div>
        ) : credits ? (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="size-14 rounded-2xl bg-primary/10 text-primary grid place-items-center">
                <Coins className="size-7" />
              </div>
              <div>
                <p className="text-4xl font-extrabold tracking-tighter">{credits.dailyRemaining.toFixed(2)}</p>
                <p className="text-xs font-bold uppercase tracking-widest text-foreground/50">{t("credits.remainingToday")}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-foreground/60">{t("credits.dailyCap")}</span>
                <span>{credits.dailyRemaining.toFixed(2)} / {credits.totalGranted.toFixed(0)}</span>
              </div>
              <div className="h-2.5 rounded-full bg-white/60 overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${dailyPercent}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 bg-white/50 rounded-2xl">
                <p className="text-[10px] uppercase font-bold tracking-widest opacity-50 mb-1 flex items-center gap-1">
                  <BatteryCharging className="size-3" /> {t("credits.estQueries")}
                </p>
                <p className="font-mono font-bold text-lg">{remaining}</p>
              </div>
              <div className="p-3.5 bg-white/50 rounded-2xl">
                <p className="text-[10px] uppercase font-bold tracking-widest opacity-50 mb-1">{t("credits.thisSession")}</p>
                <p className="font-mono font-bold text-lg">{sessionQueries}</p>
              </div>
            </div>

            <p className="text-xs text-foreground/50 leading-relaxed">
              {t("credits.estimateNote")}
            </p>
          </div>
        ) : null}
      </div>

      <div className="mt-8 pt-6 border-t border-foreground/5 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={reset}
          className="text-xs font-bold text-foreground/55 hover:text-primary transition"
        >
          {t("credits.resetSession")}
        </button>
        <button
          type="button"
          onClick={() => void load()}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-full bg-white/80 px-4 py-2 text-xs font-bold text-primary border border-foreground/5 hover:bg-white disabled:opacity-50 transition"
        >
          <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} /> {t("credits.refresh")}
        </button>
      </div>
    </div>
  );
}
