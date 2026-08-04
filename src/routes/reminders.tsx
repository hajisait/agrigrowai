import { useCallback, useEffect, useMemo, useState } from "react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { AppLink, useSpaRouter } from "@/lib/spa-router";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { suggestedReminders } from "@/lib/recommend";
import { BellRing, Check, Loader2, Plus, Trash2, Bell, BellOff } from "lucide-react";

type Reminder = {
  id: string;
  title: string;
  note: string | null;
  due_at: string;
  repeat_days: number;
  done: boolean;
};

const NOTIFIED_KEY = "agriai.notified.reminders";

function notifiedIds(): string[] {
  try {
    return JSON.parse(localStorage.getItem(NOTIFIED_KEY) ?? "[]") as string[];
  } catch {
    return [];
  }
}

export function RemindersPage() {
  const { user, profile, loading } = useAuth();
  const { navigate } = useSpaRouter();
  const [items, setItems] = useState<Reminder[]>([]);
  const [fetching, setFetching] = useState(true);
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(() => new Date(Date.now() + 864e5).toISOString().slice(0, 10));
  const [time, setTime] = useState("07:00");
  const [repeat, setRepeat] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">(
    typeof Notification === "undefined" ? "unsupported" : Notification.permission,
  );

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [loading, user, navigate]);

  const load = useCallback(async () => {
    if (!user) return;
    setFetching(true);
    const { data, error: err } = await supabase
      .from("reminders")
      .select("id,title,note,due_at,repeat_days,done")
      .order("due_at", { ascending: true });
    setFetching(false);
    if (err) setError(err.message);
    else setItems((data ?? []) as Reminder[]);
  }, [user]);

  useEffect(() => {
    void load();
  }, [load]);

  // Fire local notifications for due reminders while the app is open.
  useEffect(() => {
    if (permission !== "granted" || !items.length) return;
    const tick = () => {
      const seen = notifiedIds();
      const now = Date.now();
      const due = items.filter((r) => !r.done && new Date(r.due_at).getTime() <= now && !seen.includes(r.id));
      if (!due.length) return;
      for (const r of due) {
        new Notification(r.title, { body: r.note ?? "AgriAI reminder", icon: "/favicon.png", tag: r.id });
      }
      localStorage.setItem(NOTIFIED_KEY, JSON.stringify([...seen, ...due.map((r) => r.id)].slice(-200)));
    };
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, [items, permission]);

  const suggestions = useMemo(
    () => suggestedReminders({ crops: profile?.crops, state: profile?.state }),
    [profile?.crops, profile?.state],
  );

  async function add(payload?: { title: string; note: string; inDays: number; repeatDays: number }) {
    setError(null);
    if (!user) return;
    const dueAt = payload
      ? new Date(Date.now() + payload.inDays * 864e5)
      : new Date(`${date}T${time || "07:00"}:00`);
    const finalTitle = (payload?.title ?? title).trim();
    if (finalTitle.length < 2) {
      setError("Give the reminder a short title.");
      return;
    }
    if (Number.isNaN(dueAt.getTime())) {
      setError("Pick a valid date and time.");
      return;
    }
    const { error: err } = await supabase.from("reminders").insert({
      user_id: user.id,
      title: finalTitle.slice(0, 140),
      note: (payload?.note ?? note).trim().slice(0, 400) || null,
      due_at: dueAt.toISOString(),
      repeat_days: payload?.repeatDays ?? repeat,
    });
    if (err) {
      setError(err.message);
      return;
    }
    if (!payload) {
      setTitle("");
      setNote("");
    }
    await load();
  }

  async function toggleDone(r: Reminder) {
    if (!r.done && r.repeat_days > 0) {
      const next = new Date(new Date(r.due_at).getTime() + r.repeat_days * 864e5).toISOString();
      await supabase.from("reminders").update({ due_at: next, done: false }).eq("id", r.id);
    } else {
      await supabase.from("reminders").update({ done: !r.done }).eq("id", r.id);
    }
    await load();
  }

  async function remove(id: string) {
    await supabase.from("reminders").delete().eq("id", id);
    await load();
  }

  async function askPermission() {
    if (typeof Notification === "undefined") return;
    const res = await Notification.requestPermission();
    setPermission(res);
  }

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
      <main className="px-4 md:px-6 py-8 md:py-14 max-w-4xl mx-auto space-y-6">
        <header className="space-y-1">
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight flex items-center gap-2">
            <BellRing className="size-6 text-primary" /> Reminders
          </h1>
          <p className="text-sm text-foreground/60">
            Irrigation, spraying, mandi and scheme deadlines — with alerts on your phone.
          </p>
        </header>

        <div className="glass-panel rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-foreground/70 flex items-center gap-2">
            {permission === "granted" ? <Bell className="size-4 text-primary" /> : <BellOff className="size-4 text-foreground/50" />}
            {permission === "granted"
              ? "Notifications are on for this device."
              : permission === "unsupported"
                ? "This browser cannot show notifications — reminders still show in this list."
                : "Turn on notifications to get alerts when a task is due."}
          </p>
          {permission !== "granted" && permission !== "unsupported" && (
            <button type="button" onClick={askPermission} className="rounded-full bg-primary text-primary-foreground px-4 py-2 text-xs font-bold">
              Enable notifications
            </button>
          )}
        </div>

        <section className="glass-panel-strong rounded-[2rem] p-5 md:p-6 space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-widest text-foreground/50">New reminder</h2>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={140}
            placeholder="e.g. Irrigate wheat field"
            className="w-full rounded-xl bg-background/60 border border-foreground/10 px-3.5 py-2.5 text-sm outline-none focus:border-primary/60"
          />
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={400}
            placeholder="Optional note"
            className="w-full rounded-xl bg-background/60 border border-foreground/10 px-3.5 py-2.5 text-sm outline-none focus:border-primary/60"
          />
          <div className="grid sm:grid-cols-3 gap-3">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-xl bg-background/60 border border-foreground/10 px-3.5 py-2.5 text-sm outline-none focus:border-primary/60"
            />
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="rounded-xl bg-background/60 border border-foreground/10 px-3.5 py-2.5 text-sm outline-none focus:border-primary/60"
            />
            <select
              value={repeat}
              onChange={(e) => setRepeat(Number(e.target.value))}
              className="rounded-xl bg-background/60 border border-foreground/10 px-3.5 py-2.5 text-sm outline-none focus:border-primary/60"
            >
              <option value={0}>No repeat</option>
              <option value={1}>Every day</option>
              <option value={7}>Every week</option>
              <option value={15}>Every 15 days</option>
              <option value={30}>Every month</option>
            </select>
          </div>
          {error && <p className="text-xs font-semibold text-red-600 dark:text-red-400">{error}</p>}
          <button
            type="button"
            onClick={() => void add()}
            className="rounded-xl bg-primary text-primary-foreground px-5 py-2.5 text-sm font-bold flex items-center gap-2"
          >
            <Plus className="size-4" /> Add reminder
          </button>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-widest text-foreground/50">Suggested for you</h2>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s.title}
                type="button"
                onClick={() => void add(s)}
                className="glass-panel rounded-full px-4 py-2 text-xs font-bold hover:text-primary transition"
              >
                + {s.title}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-foreground/50">
            Suggestions use your crops and state from your <AppLink to="/account" className="text-primary font-bold">profile</AppLink>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-widest text-foreground/50">Upcoming</h2>
          {fetching ? (
            <Loader2 className="size-5 animate-spin text-primary" />
          ) : items.length === 0 ? (
            <p className="text-sm text-foreground/60">No reminders yet — add one above.</p>
          ) : (
            <ul className="space-y-2">
              {items.map((r) => (
                <li key={r.id} className={`glass-panel rounded-2xl p-4 flex items-start gap-3 ${r.done ? "opacity-55" : ""}`}>
                  <button
                    type="button"
                    onClick={() => void toggleDone(r)}
                    aria-label={r.done ? "Mark as pending" : "Mark as done"}
                    className={`size-6 shrink-0 rounded-lg grid place-items-center border ${r.done ? "bg-primary text-primary-foreground border-transparent" : "border-foreground/20"}`}
                  >
                    {r.done && <Check className="size-3.5" />}
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-bold break-words ${r.done ? "line-through" : ""}`}>{r.title}</p>
                    {r.note && <p className="text-xs text-foreground/60 break-words">{r.note}</p>}
                    <p className="text-[11px] text-foreground/50 mt-1">
                      {new Date(r.due_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                      {r.repeat_days > 0 && ` · repeats every ${r.repeat_days}d`}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => void remove(r.id)}
                    aria-label="Delete reminder"
                    className="size-8 shrink-0 rounded-lg grid place-items-center text-foreground/40 hover:text-red-500"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
