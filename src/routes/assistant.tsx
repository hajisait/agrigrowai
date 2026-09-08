import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { History, Loader2, Mic, Plus, Send, Sparkles, Trash2 } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { askAgriAI, trackSessionQuery } from "@/lib/api-client";
import {
  createChatThread,
  deleteChatThread,
  listChatMessages,
  listChatThreads,
  saveChatMessage,
  updateChatThread,
  type ChatThread,
} from "@/lib/chat-history";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { useSpaRouter } from "@/lib/spa-router";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "AgriAI Assistant — Farming Advice in Your Language" },
      { name: "description", content: "Ask AgriAI about crops, soil, pests, climate, districts, farming seasons and Indian government schemes." },
      { property: "og:title", content: "AgriAI Assistant — Farming Advice in Your Language" },
      { property: "og:description", content: "Ask practical questions about Indian farming, crops, soil, weather and schemes." },
      { property: "og:url", content: "https://agrigrowai.lovable.app/assistant" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://agrigrowai.lovable.app/assistant" }],
  }),
  component: AssistantPage,
});

type Msg = { role: "user" | "assistant"; content: string };

const WELCOME: Msg = {
  role: "assistant",
  content: "Hi! I'm AgriAI 🌱 — your farming co-pilot. Ask me anything about crops, soil, weather, pests, or schemes.",
};

const SUGGESTIONS = [
  "Best paddy variety for clayey soil in Thanjavur delta?",
  "Fertilizer schedule for wheat in Punjab alluvial soil",
  "Why are my tomato leaves curling in Nashik?",
  "Rainfall forecast for Vidarbha cotton sowing",
  "Suitable rabi crops for sandy loam in Rajasthan",
  "How to apply for PM-KISAN in Bihar?",
  "Organic aphid control for chilli in Guntur",
  "Best drip schedule for sugarcane in western UP",
  "Soil pH correction for tea in Assam",
  "Most profitable kharif crop in Marathwada this year",
  "Rythu Bandhu eligibility in Telangana",
  "Black gram cultivation in red soil of Karnataka",
  "Coconut farming tips for coastal Kerala",
  "Apple orchard pest control in Himachal",
  "Saffron farming in Kashmir — climate needs",
  "Government subsidy on solar pumps in MP",
];

function threadIdFromPath(path: string) {
  if (!path.startsWith("/assistant/")) return null;
  const value = path.slice("/assistant/".length).split("/")[0];
  return value ? decodeURIComponent(value) : null;
}

function titleFor(text: string) {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length > 48 ? `${clean.slice(0, 48).trimEnd()}…` : clean;
}

function formatThreadDate(value: string) {
  const date = new Date(value);
  return date.toLocaleDateString(undefined, { day: "numeric", month: "short" });
}

export function AssistantPage() {
  const { t, lang } = useI18n();
  const { user } = useAuth();
  const userId = user?.id;
  const { path, navigate } = useSpaRouter();
  const threadId = threadIdFromPath(path);
  const [messages, setMessages] = useState<Msg[]>([WELCOME]);
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recogRef = useRef<unknown>(null);
  const bootRef = useRef("");

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [threadId]);

  useEffect(() => {
    if (!userId) {
      bootRef.current = "";
      setThreads([]);
      setMessages([WELCOME]);
      return;
    }
    const authenticatedUserId = userId;

    const bootKey = `${authenticatedUserId}:${threadId ?? "root"}`;
    if (bootRef.current === bootKey) return;
    bootRef.current = bootKey;
    let cancelled = false;

    async function initialize() {
      setHistoryLoading(true);
      setNotice(null);
      try {
        const savedThreads = await listChatThreads();
        if (cancelled) return;
        setThreads(savedThreads);

        if (!threadId) {
          const first = savedThreads[0];
          if (first) {
            navigate(`/assistant/${first.id}`);
          } else {
            const created = await createChatThread(authenticatedUserId);
            if (!cancelled) {
              setThreads([created]);
              navigate(`/assistant/${created.id}`);
            }
          }
          return;
        }

        const current = savedThreads.find((thread) => thread.id === threadId);
        if (!current) {
          navigate("/assistant");
          return;
        }
        const savedMessages = await listChatMessages(threadId);
        if (!cancelled) {
          setMessages(savedMessages.length
            ? savedMessages.map((message) => ({ role: message.role as Msg["role"], content: message.content }))
            : [WELCOME]);
        }
      } catch (error) {
        if (!cancelled) setNotice(error instanceof Error ? error.message : "Could not load saved chats.");
      } finally {
        if (!cancelled) setHistoryLoading(false);
      }
    }

    void initialize();
    return () => { cancelled = true; };
  }, [navigate, threadId, userId]);

  async function startNewChat() {
    if (!user) {
      navigate("/auth");
      return;
    }
    try {
      const created = await createChatThread(user.id);
      setThreads((current) => [created, ...current]);
      setMessages([WELCOME]);
      navigate(`/assistant/${created.id}`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not start a new chat.");
    }
  }

  async function removeThread(id: string) {
    try {
      await deleteChatThread(id);
      const remaining = threads.filter((thread) => thread.id !== id);
      setThreads(remaining);
      if (id === threadId) {
        if (remaining[0]) navigate(`/assistant/${remaining[0].id}`);
        else await startNewChat();
      }
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not delete this chat.");
    }
  }

  async function send(text: string) {
    const content = text.trim();
    if (!content || loading) return;
    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setNotice(null);
    setLoading(true);
    inputRef.current?.focus();

    if (userId && threadId) {
      try {
        await saveChatMessage({ threadId, userId, role: "user", content });
        const current = threads.find((thread) => thread.id === threadId);
        if (current?.title === "New farming chat") {
          const updated = await updateChatThread(threadId, { title: titleFor(content) });
          setThreads((items) => items.map((item) => item.id === updated.id ? updated : item));
        } else {
          setThreads((items) => items.map((item) => item.id === threadId ? { ...item, updated_at: new Date().toISOString() } : item));
        }
      } catch (error) {
        setNotice(error instanceof Error ? `Chat answer ready, but saving failed: ${error.message}` : "Chat answer ready, but saving failed.");
      }
    }

    try {
      const res = await askAgriAI({ messages: next, language: lang });
      const reply = res.reply || "I couldn't generate a response. Please try again.";
      setMessages([...next, { role: "assistant", content: reply }]);
      trackSessionQuery();
      if (userId && threadId) {
        try {
          await saveChatMessage({ threadId, userId, role: "assistant", content: reply });
        } catch (error) {
          setNotice(error instanceof Error ? `Answer shown, but saving failed: ${error instanceof Error ? error.message : "unknown error"}` : "Answer shown, but saving failed.");
        }
      }
    } catch {
      setMessages([...next, { role: "assistant", content: "Sorry, something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  function toggleVoice() {
    const w = window as unknown as { SpeechRecognition?: new () => unknown; webkitSpeechRecognition?: new () => unknown };
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR) {
      alert("Voice input is not supported in this browser.");
      return;
    }
    if (listening) {
      const r = recogRef.current as { stop?: () => void } | null;
      r?.stop?.();
      setListening(false);
      return;
    }
    const recog = new SR() as {
      lang: string; interimResults: boolean; continuous: boolean;
      onresult: (e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void;
      onend: () => void; start: () => void; stop: () => void;
    };
    recog.lang = "en-IN";
    recog.interimResults = false;
    recog.continuous = false;
    recog.onresult = (e) => setInput(e.results[0][0].transcript);
    recog.onend = () => setListening(false);
    recogRef.current = recog;
    recog.start();
    setListening(true);
  }

  return (
    <>
      <Nav />
      <main className="max-w-6xl mx-auto px-4 md:px-6 pt-10 pb-16">
        <div className="text-center mb-6 animate-fade-up">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 border border-white/80 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            <Sparkles className="size-3" /> {t("nav.assistant")}
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mt-3">{t("page.assistant.title")}</h1>
          <p className="text-foreground/60 mt-2">{t("page.assistant.subtitle")}</p>
        </div>

        <div className="grid md:grid-cols-[240px_minmax(0,1fr)] gap-4 items-start">
          <aside className="glass-panel-strong rounded-2xl p-3 md:sticky md:top-24">
            <div className="flex items-center justify-between gap-2 px-2 pb-3">
              <div className="flex items-center gap-2 text-sm font-bold"><History className="size-4 text-primary" /> Saved chats</div>
              <button type="button" onClick={() => void startNewChat()} aria-label="Start a new chat" className="size-8 rounded-full bg-primary text-primary-foreground grid place-items-center hover:opacity-90">
                <Plus className="size-4" />
              </button>
            </div>
            {!user ? (
              <div className="px-2 py-3 text-xs leading-relaxed text-foreground/60">
                <p>Sign in to save questions and return to them later.</p>
                <button type="button" onClick={() => navigate("/auth")} className="mt-3 font-bold text-primary hover:underline">Sign in to save chats</button>
              </div>
            ) : historyLoading ? (
              <div className="flex items-center gap-2 px-2 py-4 text-xs text-foreground/60"><Loader2 className="size-3.5 animate-spin" /> Loading your chats…</div>
            ) : (
              <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
                {threads.map((thread) => (
                  <div key={thread.id} className={`flex items-center gap-1 rounded-xl ${thread.id === threadId ? "bg-primary/10" : "hover:bg-foreground/5"}`}>
                    <button type="button" onClick={() => navigate(`/assistant/${thread.id}`)} className="min-w-0 flex-1 text-left px-3 py-2.5">
                      <span className="block truncate text-xs font-bold">{thread.title}</span>
                      <span className="block mt-0.5 text-[10px] text-foreground/45">{formatThreadDate(thread.updated_at)}</span>
                    </button>
                    <button type="button" onClick={() => void removeThread(thread.id)} aria-label={`Delete ${thread.title}`} className="size-8 mr-1 rounded-full grid place-items-center text-foreground/35 hover:text-destructive hover:bg-destructive/10">
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </aside>

          <div className="glass-panel rounded-[2rem] p-4 md:p-6 flex flex-col h-[60vh] min-h-[480px]">
            {notice && <div role="status" className="mb-3 rounded-xl bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-800 dark:text-amber-200">{notice}</div>}
            <div ref={scrollRef} className="flex-grow overflow-y-auto space-y-4 pr-1">
              {messages.map((m, i) => (
                <div key={`${m.role}-${i}`} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`size-8 rounded-full shrink-0 ${m.role === "user" ? "bg-[color:var(--sky-brand)]/30" : "bg-primary/20"}`} />
                  <div className={`p-4 rounded-2xl max-w-[80%] text-sm whitespace-pre-wrap leading-relaxed ${m.role === "user" ? "bg-primary text-primary-foreground rounded-tr-none shadow-[var(--shadow-glow-primary)]" : "bg-white/85 border border-foreground/5 rounded-tl-none"}`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {loading ? (
                <div className="flex gap-3">
                  <div className="size-8 rounded-full bg-primary/20 shrink-0" />
                  <div className="bg-white/85 border border-foreground/5 p-4 rounded-2xl rounded-tl-none text-sm"><span className="inline-flex gap-1"><span className="size-1.5 bg-foreground/40 rounded-full animate-bounce" /><span className="size-1.5 bg-foreground/40 rounded-full animate-bounce [animation-delay:120ms]" /><span className="size-1.5 bg-foreground/40 rounded-full animate-bounce [animation-delay:240ms]" /></span></div>
                </div>
              ) : null}
            </div>

            {messages.length <= 1 ? (
              <div className="flex flex-wrap gap-2 mt-4">
                {SUGGESTIONS.map((s) => <button key={s} onClick={() => void send(s)} className="text-xs font-semibold bg-white/70 border border-foreground/5 hover:bg-primary/10 hover:text-primary px-3 py-2 rounded-full transition">{s}</button>)}
              </div>
            ) : null}

            <form onSubmit={(e) => { e.preventDefault(); void send(input); }} className="mt-4 flex gap-2 items-center">
              <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your farming question…" className="flex-grow min-w-0 bg-white/70 border border-white/80 rounded-full px-5 py-3 text-sm outline-none focus:border-primary/50 focus:bg-white transition" />
              <button type="button" onClick={toggleVoice} className={`size-12 shrink-0 rounded-full grid place-items-center transition-all border border-foreground/5 ${listening ? "bg-primary text-primary-foreground animate-pulse" : "bg-white text-primary hover:bg-primary/10"}`} aria-label="Voice input"><Mic className="size-5" /></button>
              <button type="submit" disabled={loading || !input.trim()} className="size-12 shrink-0 rounded-full grid place-items-center bg-primary text-primary-foreground shadow-[var(--shadow-glow-primary)] disabled:opacity-40 hover:scale-105 transition" aria-label="Send"><Send className="size-5" /></button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}