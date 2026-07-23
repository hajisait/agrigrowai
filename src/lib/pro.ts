// Simple Pro-tier unlock stored in localStorage.
// Users pay via Stripe (see /pricing) and receive an unlock code by email.
// Codes are pre-shared (e.g. "AGRIPRO-2026-XXXX"); validation is intentionally
// lightweight for a v1 monetization funnel.
import { useEffect, useState } from "react";

const STORAGE_KEY = "agriai_pro_v1";
const VALID_PREFIX = "AGRIPRO-";

export type ProState = {
  active: boolean;
  since: string | null;
  plan: "monthly" | "yearly" | "lifetime" | null;
};

// Everything is free — Pro is always active for all users.
const DEFAULT: ProState = { active: true, since: null, plan: "lifetime" };

export function getProState(): ProState {
  return DEFAULT;
}

export function activatePro(code: string, plan: ProState["plan"] = "monthly"): boolean {
  const clean = code.trim().toUpperCase();
  if (!clean.startsWith(VALID_PREFIX) || clean.length < 14) return false;
  const state: ProState = { active: true, since: new Date().toISOString(), plan };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent("agri-pro-changed"));
    return true;
  } catch {
    return false;
  }
}

export function deactivatePro() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent("agri-pro-changed"));
  } catch {}
}

export function useProState(): ProState {
  const [state, setState] = useState<ProState>(DEFAULT);
  useEffect(() => {
    setState(getProState());
    const refresh = () => setState(getProState());
    window.addEventListener("agri-pro-changed", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("agri-pro-changed", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);
  return state;
}
