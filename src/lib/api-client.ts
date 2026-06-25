import type { ChatMessage, GeoResult, MarketCrop, Scheme, WeatherData } from "./agri-core";
import { buildBackupWeather, fallbackPlace, getMarketSnapshot, getSchemeSnapshot, nearestFallback } from "./agri-core";

const BACKEND_URL = import.meta.env.VITE_SUPABASE_URL || "https://utevxpbwjmgnwkejqqkt.supabase.co";
const PUBLIC_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0ZXZ4cGJ3am1nbndrZWpxcWt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3NDM4NTQsImV4cCI6MjA5NjMxOTg1NH0.Omg9C12nrvPOqSYALi_1fKqu3Diyo1wIfJV9UFI5C4c";
const FUNCTION_URL = `${BACKEND_URL}/functions/v1/agri-api`;

async function requestApi<T>(action: string, payload: Record<string, unknown>): Promise<T> {
  if (!FUNCTION_URL || FUNCTION_URL.includes("undefined")) throw new Error("Backend URL missing");
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), action === "ask" ? 45_000 : 12_000);
  const res = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(PUBLIC_KEY ? { Authorization: `Bearer ${PUBLIC_KEY}`, apikey: PUBLIC_KEY } : {}),
    },
    body: JSON.stringify({ action, ...payload }),
    signal: controller.signal,
  }).finally(() => window.clearTimeout(timer));
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Backend ${res.status}${text ? `: ${text.slice(0, 160)}` : ""}`);
  }
  return res.json() as Promise<T>;
}

export async function askAgriAI(data: { messages: ChatMessage[]; language?: string; imageDataUrl?: string; crop?: string; userSymptoms?: string }) {
  return requestApi<{ reply: string; error: string | null }>("ask", data as unknown as Record<string, unknown>);
}

export async function geocodePlace(data: { query: string }) {
  try {
    return await requestApi<{ place: GeoResult | null }>("geocode", data);
  } catch {
    return { place: fallbackPlace(data.query) };
  }
}

export async function geocodePlaces(data: { query: string }) {
  try {
    return await requestApi<{ places: GeoResult[] }>("geocodeMany", data);
  } catch {
    const place = fallbackPlace(data.query);
    return { places: place ? [place] : [] };
  }
}

export async function reverseGeocode(data: { latitude: number; longitude: number }) {
  try {
    return await requestApi<{ place: GeoResult }>("reverseGeocode", data);
  } catch {
    return { place: nearestFallback(data.latitude, data.longitude) };
  }
}

export async function getWeather(data: { latitude: number; longitude: number }) {
  try {
    return await requestApi<WeatherData>("weather", data);
  } catch {
    return buildBackupWeather(data.latitude, data.longitude);
  }
}

export async function getMarketPrices(data: { query?: string; state?: string; sort?: "name" | "price" | "change"; nonce?: number }) {
  try {
    return await requestApi<{ crops: MarketCrop[]; states: string[]; updatedAt: string }>("market", data);
  } catch {
    return getMarketSnapshot(data);
  }
}

export async function getSchemes(data: { query?: string; category?: string }) {
  try {
    return await requestApi<{ schemes: Scheme[]; categories: string[] }>("schemes", data);
  } catch {
    return getSchemeSnapshot(data);
  }
}

export async function getCredits() {
  return requestApi<{
    remainingCredits: number;
    dailyRemaining: number;
    totalGranted: number;
    usedThisPeriod: number;
    costPerQuery: number;
    estimatedQueries: number;
    source: string;
    lastUpdated: string;
  }>("credits", {});
}

export function trackSessionQuery() {
  try {
    const key = "agriai_session_queries";
    const n = Number(localStorage.getItem(key) ?? 0);
    localStorage.setItem(key, String(n + 1));
  } catch {
    // ignore storage errors
  }
}

export function getSessionQueryCount() {
  try {
    return Number(localStorage.getItem("agriai_session_queries") ?? 0);
  } catch {
    return 0;
  }
}

export function resetSessionQueryCount() {
  try {
    localStorage.removeItem("agriai_session_queries");
  } catch {
    // ignore
  }
}

export type { MarketCrop, Scheme, WeatherData };