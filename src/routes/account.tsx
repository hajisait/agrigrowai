import { useEffect, useState } from "react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { AppLink, useSpaRouter } from "@/lib/spa-router";
import { useAuth } from "@/lib/auth";
import { CROP_OPTIONS, INDIAN_STATES, buildRecommendations } from "@/lib/recommend";
import { Check, LogOut, Loader2, BellRing, Sparkles } from "lucide-react";

export function AccountPage() {
  const { user, profile, loading, saveProfile, signOut } = useAuth();
  const { navigate } = useSpaRouter();
  const [fullName, setFullName] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [acres, setAcres] = useState("");
  const [crops, setCrops] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!profile) return;
    setFullName(profile.full_name ?? "");
    setState(profile.state ?? "");
    setDistrict(profile.district ?? "");
    setAcres(profile.land_acres === null ? "" : String(profile.land_acres));
    setCrops(profile.crops ?? []);
  }, [profile]);

  async function save() {
    setBusy(true);
    setError(null);
    const parsedAcres = acres.trim() === "" ? null : Number(acres);
    if (parsedAcres !== null && (!Number.isFinite(parsedAcres) || parsedAcres < 0 || parsedAcres > 10000)) {
      setBusy(false);
      setError("Enter land size in acres between 0 and 10000.");
      return;
    }
    const res = await saveProfile({
      full_name: fullName.trim().slice(0, 120) || null,
      state: state || null,
      district: district.trim().slice(0, 80) || null,
      land_acres: parsedAcres,
      crops,
    });
    setBusy(false);
    if (res.error) setError(res.error);
    else {
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2500);
    }
  }

  const recs = buildRecommendations({
    fullName: profile?.full_name,
    state: profile?.state,
    district: profile?.district,
    crops: profile?.crops,
    landAcres: profile?.land_acres,
  });

  if (loading || !user) {
    return (
      <>
        <Nav />
        <main className="px-4 py-24 grid place-items-center">
          <Loader2 className="size-6 animate-spin text-primary" />
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Nav />
      <main className="px-4 md:px-6 py-8 md:py-14 max-w-5xl mx-auto space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">My farm profile</h1>
            <p className="text-sm text-foreground/60">{user.email}</p>
          </div>
          <button
            type="button"
            onClick={async () => { await signOut(); navigate("/"); }}
            className="rounded-full glass-panel px-4 py-2 text-xs font-bold flex items-center gap-1.5"
          >
            <LogOut className="size-3.5" /> Sign out
          </button>
        </header>

        <section className="glass-panel-strong rounded-[2rem] p-5 md:p-7 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-[11px] font-bold uppercase tracking-widest text-foreground/50">Name</span>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                maxLength={120}
                className="mt-1 w-full rounded-xl bg-background/60 border border-foreground/10 px-3.5 py-2.5 text-sm outline-none focus:border-primary/60"
              />
            </label>
            <label className="block">
              <span className="text-[11px] font-bold uppercase tracking-widest text-foreground/50">State</span>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="mt-1 w-full rounded-xl bg-background/60 border border-foreground/10 px-3.5 py-2.5 text-sm outline-none focus:border-primary/60"
              >
                <option value="">Select state</option>
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-[11px] font-bold uppercase tracking-widest text-foreground/50">District / village</span>
              <input
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                maxLength={80}
                placeholder="e.g. Nashik"
                className="mt-1 w-full rounded-xl bg-background/60 border border-foreground/10 px-3.5 py-2.5 text-sm outline-none focus:border-primary/60"
              />
            </label>
            <label className="block">
              <span className="text-[11px] font-bold uppercase tracking-widest text-foreground/50">Land size (acres)</span>
              <input
                value={acres}
                onChange={(e) => setAcres(e.target.value)}
                inputMode="decimal"
                placeholder="e.g. 2.5"
                className="mt-1 w-full rounded-xl bg-background/60 border border-foreground/10 px-3.5 py-2.5 text-sm outline-none focus:border-primary/60"
              />
            </label>
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-foreground/50">My crops</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {CROP_OPTIONS.map((c) => {
                const on = crops.includes(c);
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCrops((prev) => (on ? prev.filter((x) => x !== c) : [...prev, c]))}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition ${
                      on ? "bg-primary text-primary-foreground border-transparent" : "bg-foreground/5 border-foreground/10 text-foreground/60"
                    }`}
                    aria-pressed={on}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>

          {error && <p className="text-xs font-semibold text-red-600 dark:text-red-400">{error}</p>}

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={save}
              disabled={busy}
              className="rounded-xl bg-primary text-primary-foreground px-5 py-2.5 text-sm font-bold flex items-center gap-2 disabled:opacity-60"
            >
              {busy ? <Loader2 className="size-4 animate-spin" /> : saved ? <Check className="size-4" /> : null}
              {saved ? "Saved" : "Save profile"}
            </button>
            <AppLink to="/reminders" className="rounded-xl glass-panel px-4 py-2.5 text-sm font-bold flex items-center gap-2">
              <BellRing className="size-4 text-primary" /> My reminders
            </AppLink>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-extrabold flex items-center gap-2">
            <Sparkles className="size-4 text-primary" /> Recommended for your farm
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recs.map((r) => (
              <AppLink key={r.title} to={r.to} className="glass-panel rounded-2xl p-5 hover:-translate-y-0.5 transition block">
                <p className="font-bold text-sm mb-1">{r.title}</p>
                <p className="text-xs text-foreground/60 mb-3">{r.body}</p>
                <span className="text-[11px] font-bold text-primary">{r.action} →</span>
              </AppLink>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
