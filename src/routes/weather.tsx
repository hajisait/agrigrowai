import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search, CloudSun, Droplets, Wind, Thermometer, MapPin, LocateFixed } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { geocodePlaces, getWeather, reverseGeocode, type WeatherData } from "@/lib/api-client";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/weather")({
  head: () => ({
    meta: [
      { title: "Live Weather — AgriAI Assist" },
      { name: "description", content: "Real-time village-level weather, forecasts, and rain alerts for farmers." },
      { property: "og:title", content: "Live Weather — AgriAI Assist" },
      { property: "og:description", content: "Real-time village-level weather and rain alerts." },
    ],
  }),
  component: WeatherPage,
});

type Place = { name: string; country: string; admin1?: string; latitude: number; longitude: number };
const DEFAULT_PLACE: Place = { name: "New Delhi", admin1: "Delhi", country: "India", latitude: 28.6139, longitude: 77.209 };

const WMO: Record<number, string> = {
  0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
  45: "Foggy", 48: "Rime fog", 51: "Light drizzle", 53: "Drizzle", 55: "Heavy drizzle",
  61: "Light rain", 63: "Rain", 65: "Heavy rain", 71: "Light snow", 73: "Snow", 75: "Heavy snow",
  80: "Showers", 81: "Heavy showers", 82: "Violent showers", 95: "Thunderstorm", 96: "Thunderstorm + hail", 99: "Severe storm",
};

export function WeatherPage() {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const [place, setPlace] = useState<Place | null>(null);
  const [current, setCurrent] = useState<WeatherData["current"] | null>(null);
  const [daily, setDaily] = useState<WeatherData["daily"] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<Place[]>([]);

  async function loadWeather(p: Place) {
    setPlace(p);
    try {
      localStorage.setItem("agriai_place", JSON.stringify(p));
      window.dispatchEvent(new CustomEvent("agriai:place-changed", { detail: p }));
    } catch {}
    const wx = await getWeather({ latitude: p.latitude, longitude: p.longitude });
    setCurrent(wx.current);
    setDaily(wx.daily);
  }

  useEffect(() => {
    const raw = typeof window !== "undefined" ? localStorage.getItem("agriai_place") : null;
    if (raw) {
      try {
        const saved = JSON.parse(raw) as Place;
        void loadWeather(saved);
        return;
      } catch {}
    }
    void loadWeather(DEFAULT_PLACE);
  }, []);

  async function search(e?: React.FormEvent) {
    e?.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setSuggestions([]);
    try {
      const geo = await geocodePlaces({ query });
      const places = geo.places ?? [];
      if (places.length === 0) {
        setError("Location not found. Try the nearest district, taluka or city.");
        setLoading(false);
        return;
      }
      const first = places[0];
      await loadWeather({
        name: first.name, country: first.country, admin1: first.admin1,
        latitude: first.latitude, longitude: first.longitude,
      });
      if (places.length > 1) {
        setSuggestions(places.slice(1, 6).map((p) => ({
          name: p.name, country: p.country, admin1: p.admin1, latitude: p.latitude, longitude: p.longitude,
        })));
      }
    } catch {
      setError("Network error. Please retry.");
    } finally {
      setLoading(false);
    }
  }
  

  function useMyLocation() {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported in this browser.");
      return;
    }
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const rev = await reverseGeocode({ latitude, longitude });
          const first = rev.place;
          await loadWeather({
            name: first?.name ?? "My location",
            country: first?.country ?? "",
            admin1: first?.admin1,
            latitude, longitude,
          });
        } catch {
          setError("Could not load weather for your location.");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError("Location permission denied.");
        setLoading(false);
      },
    );
  }

  return (
    <>
      <Nav />
      <main className="max-w-6xl mx-auto px-4 md:px-6 pt-10 pb-16">
        <div className="text-center mb-8 animate-fade-up">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter">{t("page.weather.title")}</h1>
          <p className="text-foreground/60 mt-2">{t("page.weather.subtitle")}</p>
        </div>

        <form onSubmit={search} className="max-w-xl mx-auto flex flex-wrap gap-2 mb-8">
          <div className="flex-grow relative min-w-[200px]">
            <Search className="size-4 absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Coimbatore, Punjab, Bali…"
              className="w-full bg-white/70 border border-white/80 rounded-full pl-11 pr-5 py-3 text-sm outline-none focus:border-primary/50 focus:bg-white"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-full text-sm font-bold shadow-[var(--shadow-glow-primary)] disabled:opacity-50"
          >
            {loading ? "Loading…" : "Search"}
          </button>
          <button
            type="button"
            onClick={useMyLocation}
            disabled={loading}
            className="bg-white/70 border border-white/80 text-primary px-4 py-3 rounded-full text-sm font-bold flex items-center gap-1.5 hover:bg-white disabled:opacity-50"
            title="Use my location"
          >
            <LocateFixed className="size-4" /> My location
          </button>
        </form>

        {error ? (
          <p className="text-center text-sm text-destructive mb-6">{error}</p>
        ) : null}

        {place && current ? (
          <div className="grid md:grid-cols-3 gap-5 animate-fade-up">
            <div className="md:col-span-2 glass-panel rounded-[2rem] p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-sm text-foreground/60 flex items-center gap-1.5"><MapPin className="size-3.5" /> {place.admin1 ? `${place.admin1}, ` : ""}{place.country}</p>
                  <h2 className="text-3xl font-extrabold tracking-tight">{place.name}</h2>
                </div>
                <CloudSun className="size-14 text-[color:var(--sky-brand)]" />
              </div>
              <div className="flex items-end gap-4 mb-8">
                <span className="text-7xl md:text-8xl font-extrabold tracking-tighter">
                  {Math.round(current.temperature_2m)}°
                </span>
                <span className="pb-3 text-foreground/60 font-medium">
                  {WMO[current.weather_code] ?? "—"} · feels {Math.round(current.apparent_temperature)}°
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <WeatherStat icon={<Droplets className="size-4" />} label="Humidity" value={`${current.relative_humidity_2m}%`} />
                <WeatherStat icon={<Wind className="size-4" />} label="Wind" value={`${Math.round(current.wind_speed_10m)} km/h`} />
                <WeatherStat icon={<Thermometer className="size-4" />} label="Feels like" value={`${Math.round(current.apparent_temperature)}°`} />
              </div>
            </div>

            <div className="glass-panel rounded-[2rem] p-6">
              <h3 className="font-bold mb-4">7-Day Forecast</h3>
              <div className="space-y-2">
                {daily?.time.map((d, i) => (
                  <div key={d} className="flex items-center justify-between text-sm py-2 border-b border-foreground/5 last:border-0">
                    <span className="font-semibold w-12">
                      {i === 0 ? "Today" : new Date(d).toLocaleDateString("en", { weekday: "short" })}
                    </span>
                    <span className="text-foreground/60 text-xs truncate flex-grow px-2">{WMO[daily.weather_code[i]] ?? "—"}</span>
                    <span className="text-[color:var(--sky-brand)] text-xs font-bold w-10 text-right">{daily.precipitation_probability_max[i] ?? 0}%</span>
                    <span className="font-mono font-bold w-16 text-right">{Math.round(daily.temperature_2m_min[i])}°/{Math.round(daily.temperature_2m_max[i])}°</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-foreground/40 text-sm mt-12">Search a location to see live weather.</div>
        )}
      </main>
      <Footer />
    </>
  );
}

function WeatherStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-white/50 rounded-2xl p-4">
      <p className="text-[10px] uppercase font-bold tracking-widest text-foreground/50 mb-1 flex items-center gap-1.5">{icon}{label}</p>
      <p className="font-mono font-bold text-lg">{value}</p>
    </div>
  );
}
