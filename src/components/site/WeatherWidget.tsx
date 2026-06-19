import { useEffect, useState } from "react";
import { CloudSun, Wind, MapPin } from "lucide-react";
import { AppLink } from "@/lib/spa-router";
import { getWeather, reverseGeocode, type WeatherData } from "@/lib/api-client";
import { useI18n } from "@/lib/i18n";

type Saved = { name: string; admin1?: string; country?: string; latitude: number; longitude: number };
const DEFAULT_PLACE: Saved = { name: "New Delhi", admin1: "Delhi", country: "India", latitude: 28.6139, longitude: 77.209 };

export function WeatherWidget() {
  const { t } = useI18n();
  const [place, setPlace] = useState<Saved | null>(null);
  const [wx, setWx] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load(p: Saved) {
      setLoading(true);
      setNotice(null);
      try {
        const data = await getWeather({ latitude: p.latitude, longitude: p.longitude });
        if (!cancelled) {
          setPlace(p);
          setWx(data);
          setNotice(data.source === "backup" ? "Using backup forecast while live climate feed reconnects." : null);
        }
      } catch {
        if (!cancelled) setNotice("Weather is temporarily unavailable. Open Weather to retry.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    function loadSavedOrDefault() {
      const raw = typeof window !== "undefined" ? localStorage.getItem("agriai_place") : null;
      if (raw) {
        try {
          void load(JSON.parse(raw) as Saved);
          return true;
        } catch {}
      }
      return false;
    }

    const onPlaceChanged = (event: Event) => {
      const next = (event as CustomEvent<Saved>).detail;
      if (next?.latitude && next?.longitude) void load(next);
      else loadSavedOrDefault();
    };
    window.addEventListener("agriai:place-changed", onPlaceChanged);

    if (loadSavedOrDefault()) {
      return () => {
        cancelled = true;
        window.removeEventListener("agriai:place-changed", onPlaceChanged);
      };
    }

    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          try {
            const r = await reverseGeocode({ latitude, longitude });
            const p: Saved = {
              name: r.place?.name ?? "My location",
              admin1: r.place?.admin1,
              country: r.place?.country,
              latitude,
              longitude,
            };
            try {
              localStorage.setItem("agriai_place", JSON.stringify(p));
            } catch {}
            await load(p);
          } catch {
            void load(DEFAULT_PLACE);
          }
        },
        () => {
          void load(DEFAULT_PLACE);
        },
        { timeout: 8000 },
      );
    } else {
      void load(DEFAULT_PLACE);
    }

    return () => {
      cancelled = true;
      window.removeEventListener("agriai:place-changed", onPlaceChanged);
    };
  }, []);

  const rainProb = wx?.daily.precipitation_probability_max.slice(0, 2).reduce((a, b) => Math.max(a, b ?? 0), 0) ?? 0;

  return (
    <div className="md:col-span-4 glass-panel p-6 md:p-8 rounded-[2rem] flex flex-col justify-between">
      <div>
        <div className="mb-1 flex items-start justify-between gap-3">
          <h2 className="text-2xl font-bold tracking-tight">{t("weather.title")}</h2>
          <AppLink to="/weather" className="rounded-full bg-white/70 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary transition hover:bg-white">
            Open
          </AppLink>
        </div>
        <p className="text-sm text-foreground/60 mb-6 flex items-center gap-1.5">
          <MapPin className="size-3.5" />
          {place ? (
            <>
              {place.name}
              {place.admin1 ? `, ${place.admin1}` : ""}
            </>
          ) : loading ? (
            t("weather.locating")
          ) : (
            <AppLink to="/weather" className="text-primary underline">
              {t("weather.setlocation")}
            </AppLink>
          )}
        </p>
        <div className="flex items-center gap-4 mb-8">
          <span className="text-6xl font-extrabold tracking-tighter">
            {wx ? `${Math.round(wx.current.temperature_2m)}°` : "—"}
          </span>
          <CloudSun className="size-12 text-[color:var(--sky-brand)]" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Stat label={t("weather.humidity")} value={wx ? `${wx.current.relative_humidity_2m}%` : "—"} />
          <Stat label={t("weather.wind")} value={wx ? `${Math.round(wx.current.wind_speed_10m)} km/h` : "—"} icon={<Wind className="size-3" />} />
        </div>
      </div>
      <div className="mt-8 pt-6 border-t border-foreground/5">
        {notice ? <p className="mb-3 text-xs font-semibold text-foreground/55">{notice}</p> : null}
        <p className="text-sm font-semibold text-[color:var(--sky-brand)] flex items-center gap-2">
          <span className="size-2 bg-[color:var(--sky-brand)] rounded-full" />
          {rainProb >= 50 ? t("weather.rainsoon") : t("weather.norain")}
        </p>
      </div>
    </div>
  );
}

function Stat({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="p-3.5 bg-white/50 rounded-2xl">
      <p className="text-[10px] uppercase font-bold tracking-widest opacity-50 mb-1 flex items-center gap-1">
        {icon}
        {label}
      </p>
      <p className="font-mono font-bold">{value}</p>
    </div>
  );
}
