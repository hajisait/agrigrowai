import { createServerFn } from "@tanstack/react-start";

type GeoResult = {
  name: string;
  country: string;
  admin1?: string;
  latitude: number;
  longitude: number;
};

export type WeatherData = {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    weather_code: number;
    apparent_temperature: number;
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
    weather_code: number[];
  };
  source: "live" | "backup";
};

const FALLBACK_PLACES: GeoResult[] = [
  { name: "New Delhi", admin1: "Delhi", country: "India", latitude: 28.6139, longitude: 77.209 },
  { name: "Ludhiana", admin1: "Punjab", country: "India", latitude: 30.901, longitude: 75.8573 },
  { name: "Coimbatore", admin1: "Tamil Nadu", country: "India", latitude: 11.0168, longitude: 76.9558 },
  { name: "Hyderabad", admin1: "Telangana", country: "India", latitude: 17.385, longitude: 78.4867 },
  { name: "Kochi", admin1: "Kerala", country: "India", latitude: 9.9312, longitude: 76.2673 },
  { name: "Nashik", admin1: "Maharashtra", country: "India", latitude: 19.9975, longitude: 73.7898 },
  { name: "Indore", admin1: "Madhya Pradesh", country: "India", latitude: 22.7196, longitude: 75.8577 },
  { name: "Guntur", admin1: "Andhra Pradesh", country: "India", latitude: 16.3067, longitude: 80.4365 },
];

function nearestFallback(latitude: number, longitude: number) {
  return FALLBACK_PLACES.reduce((best, place) => {
    const bestDistance = Math.hypot(best.latitude - latitude, best.longitude - longitude);
    const nextDistance = Math.hypot(place.latitude - latitude, place.longitude - longitude);
    return nextDistance < bestDistance ? place : best;
  }, FALLBACK_PLACES[0]);
}

function fallbackPlace(query: string) {
  const q = query.toLowerCase();
  return FALLBACK_PLACES.find((p) => q.includes(p.name.toLowerCase()) || q.includes((p.admin1 ?? "").toLowerCase())) ?? null;
}

function buildBackupWeather(latitude: number, longitude: number): WeatherData {
  const today = new Date();
  const seasonalBase = latitude > 24 ? 31 : 28;
  const offset = Math.round(Math.sin((latitude + longitude) / 12) * 3);
  const rainBase = latitude < 15 ? 58 : latitude < 23 ? 36 : 24;

  return {
    source: "backup",
    current: {
      temperature_2m: seasonalBase + offset,
      apparent_temperature: seasonalBase + offset + 1,
      relative_humidity_2m: Math.min(88, Math.max(38, rainBase + 18)),
      wind_speed_10m: Math.max(6, Math.round(10 + Math.abs(offset) * 2)),
      weather_code: rainBase > 45 ? 51 : 2,
    },
    daily: Array.from({ length: 7 }).reduce<WeatherData["daily"]>(
      (acc, _, index) => {
        const date = new Date(today);
        date.setDate(today.getDate() + index);
        const dayOffset = Math.round(Math.sin(index + latitude / 8) * 2);
        const rain = Math.min(90, Math.max(8, rainBase + index * 4 - Math.abs(offset) * 2));
        acc.time.push(date.toISOString().slice(0, 10));
        acc.weather_code.push(rain > 60 ? 61 : rain > 40 ? 51 : 2);
        acc.temperature_2m_max.push(seasonalBase + offset + dayOffset + 5);
        acc.temperature_2m_min.push(seasonalBase + offset + dayOffset - 4);
        acc.precipitation_probability_max.push(rain);
        return acc;
      },
      { time: [], temperature_2m_max: [], temperature_2m_min: [], precipitation_probability_max: [], weather_code: [] },
    ),
  };
}

async function fetchWithTimeout(url: string) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6000);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export const geocodePlace = createServerFn({ method: "GET" })
  .inputValidator((data: { query: string }) => {
    const q = String(data?.query ?? "").trim().slice(0, 80);
    if (!q) throw new Error("Empty query");
    return { query: q };
  })
  .handler(async ({ data }) => {
    try {
      const r = await fetchWithTimeout(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(data.query)}&count=1&language=en&format=json`,
      );
      if (r.ok) {
        const j = (await r.json()) as { results?: GeoResult[] };
        const place = j.results?.[0] ?? fallbackPlace(data.query);
        return { place };
      }
    } catch (error) {
      console.warn("[weather] geocode fallback", error);
    }
    return { place: fallbackPlace(data.query) };
  });

export const reverseGeocode = createServerFn({ method: "GET" })
  .inputValidator((data: { latitude: number; longitude: number }) => ({
    latitude: Number(data.latitude),
    longitude: Number(data.longitude),
  }))
  .handler(async ({ data }) => {
    try {
      const r = await fetchWithTimeout(
        `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${data.latitude}&longitude=${data.longitude}&language=en&format=json`,
      );
      if (r.ok) {
        const j = (await r.json()) as { results?: GeoResult[] };
        return { place: j.results?.[0] ?? nearestFallback(data.latitude, data.longitude) };
      }
    } catch (error) {
      console.warn("[weather] reverse geocode fallback", error);
    }
    return { place: nearestFallback(data.latitude, data.longitude) };
  });

export const getWeather = createServerFn({ method: "GET" })
  .inputValidator((data: { latitude: number; longitude: number }) => {
    const lat = Number(data.latitude);
    const lon = Number(data.longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) throw new Error("Bad coords");
    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) throw new Error("Out of range");
    return { latitude: lat, longitude: lon };
  })
  .handler(async ({ data }) => {
    try {
      const r = await fetchWithTimeout(
        `https://api.open-meteo.com/v1/forecast?latitude=${data.latitude}&longitude=${data.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&forecast_days=7`,
      );
      if (!r.ok) throw new Error(`Weather provider ${r.status}`);
      const payload = (await r.json()) as WeatherData;
      if (!payload.current || !payload.daily) throw new Error("Incomplete weather payload");
      return { ...payload, source: "live" as const };
    } catch (error) {
      console.warn("[weather] using backup forecast", error);
      return buildBackupWeather(data.latitude, data.longitude);
    }
  });
