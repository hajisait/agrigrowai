import { useEffect, useState } from "react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { useAuth } from "@/lib/auth";
import { useSpaRouter } from "@/lib/spa-router";
import { Leaf, Loader2, Mail, ShieldCheck } from "lucide-react";

export function AuthPage() {
  const { user, loading, signIn, signUp, signInWithGoogle } = useAuth();
  const { navigate } = useSpaRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) navigate("/account");
  }, [loading, user, navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    if (!email.trim() || password.length < 6) {
      setError("Enter a valid email and a password of at least 6 characters.");
      return;
    }
    if (mode === "signup" && fullName.trim().length < 2) {
      setError("Please enter your name.");
      return;
    }
    setBusy(true);
    const res = mode === "signin" ? await signIn(email, password) : await signUp(email, password, fullName);
    setBusy(false);
    if (res.error) {
      setError(res.error);
      return;
    }
    if (mode === "signup" && "needsConfirm" in res && res.needsConfirm) {
      setInfo("Check your email and click the confirmation link to activate your account.");
      return;
    }
    navigate("/account");
  }

  async function google() {
    setError(null);
    setBusy(true);
    const res = await signInWithGoogle();
    setBusy(false);
    if (res.error) setError(res.error);
  }

  return (
    <>
      <Nav />
      <main className="px-4 md:px-6 py-10 md:py-16 max-w-md mx-auto">
        <div className="glass-panel-strong rounded-[2rem] p-6 md:p-8">
          <div className="flex items-center gap-2 mb-5">
            <span className="size-9 rounded-xl bg-primary text-primary-foreground grid place-items-center">
              <Leaf className="size-4" />
            </span>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight">
                {mode === "signin" ? "Welcome back" : "Create your account"}
              </h1>
              <p className="text-xs text-foreground/60">Free forever · personalised farm advisory</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1 p-1 rounded-full bg-foreground/5 mb-5 text-xs font-bold">
            {(["signin", "signup"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => { setMode(m); setError(null); setInfo(null); }}
                className={`py-2 rounded-full transition ${mode === m ? "bg-primary text-primary-foreground" : "text-foreground/60"}`}
              >
                {m === "signin" ? "Sign in" : "Sign up"}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-3">
            {mode === "signup" && (
              <Field label="Full name" value={fullName} onChange={setFullName} placeholder="Ramesh Kumar" autoComplete="name" />
            )}
            <Field label="Email" value={email} onChange={setEmail} type="email" placeholder="you@example.com" autoComplete="email" />
            <Field
              label="Password"
              value={password}
              onChange={setPassword}
              type="password"
              placeholder="At least 6 characters"
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
            />

            {error && <p className="text-xs font-semibold text-red-600 dark:text-red-400">{error}</p>}
            {info && (
              <p className="text-xs font-semibold text-primary flex items-start gap-1.5">
                <Mail className="size-3.5 mt-0.5 shrink-0" /> {info}
              </p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {busy && <Loader2 className="size-4 animate-spin" />}
              {mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>

          <div className="flex items-center gap-3 my-4 text-[10px] font-bold uppercase tracking-widest text-foreground/40">
            <span className="h-px flex-1 bg-foreground/10" /> or <span className="h-px flex-1 bg-foreground/10" />
          </div>

          <button
            type="button"
            onClick={google}
            disabled={busy}
            className="w-full py-3 rounded-xl glass-panel text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
              <path fill="#4285F4" d="M23 12.2c0-.9-.1-1.5-.2-2.2H12v4.1h6.2c-.1 1-.8 2.6-2.3 3.6l-.1.1 3.4 2.6.2.1c2.1-2 3.6-4.9 3.6-8.3z" />
              <path fill="#34A853" d="M12 23.5c3.1 0 5.6-1 7.4-2.8l-3.5-2.7c-1 .7-2.3 1.2-3.9 1.2-3 0-5.6-2-6.5-4.8H2l-.1.1C3.7 20.6 7.6 23.5 12 23.5z" />
              <path fill="#FBBC05" d="M5.5 14.4c-.2-.7-.4-1.5-.4-2.4s.1-1.6.4-2.4V9.5H2A11.5 11.5 0 0 0 .8 12c0 1.9.4 3.6 1.2 5l3.5-2.6z" />
              <path fill="#EA4335" d="M12 4.9c2.1 0 3.6.9 4.4 1.7l3.2-3.1C17.6 1.7 15.1.5 12 .5 7.6.5 3.7 3.4 1.9 7l3.6 2.6C6.4 6.9 9 4.9 12 4.9z" />
            </svg>
            Continue with Google
          </button>

          <p className="mt-5 text-[11px] text-foreground/50 flex items-start gap-1.5">
            <ShieldCheck className="size-3.5 mt-px shrink-0 text-primary" />
            We store only your farm profile and reminders. Every record is locked to your account.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Field({
  label, value, onChange, type = "text", placeholder, autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-bold uppercase tracking-widest text-foreground/50">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        maxLength={120}
        className="mt-1 w-full rounded-xl bg-background/60 border border-foreground/10 px-3.5 py-2.5 text-sm outline-none focus:border-primary/60"
      />
    </label>
  );
}
