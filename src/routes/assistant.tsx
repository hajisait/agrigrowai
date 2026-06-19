import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Mic, Send, Sparkles } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { askAgriAI } from "@/lib/api-client";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "AI Assistant — AgriAI Assist" },
      { name: "description", content: "Ask farming questions and get instant AI-powered advice in your language." },
      { property: "og:title", content: "AI Assistant — AgriAI Assist" },
      { property: "og:description", content: "Ask farming questions and get instant AI-powered advice." },
    ],
  }),
  component: AssistantPage,
});

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Best fertilizer for rice in monsoon?",
  "Why are my tomato leaves yellow?",
  "Will it rain in Coimbatore tomorrow?",
  "How much water does cotton need?",
  "How to control aphids on chilli plants naturally?",
  "Which crop is most profitable in Maharashtra this season?",
  "Soil preparation tips for wheat sowing",
  "What government scheme helps small farmers buy a tractor?",
  "Signs of nitrogen deficiency in maize?",
  "Best drip irrigation schedule for tomatoes",
  "How to store onions to prevent rotting?",
  "Organic pesticide recipe for brinjal",
];

export function AssistantPage() {
  const { t, lang } = useI18n();
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hi! I'm AgriAI 🌱 — your farming co-pilot. Ask me anything about crops, soil, weather, pests, or schemes." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recogRef = useRef<unknown>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || loading) return;
    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await askAgriAI({ messages: next.map((m) => ({ role: m.role, content: m.content })), language: lang });
      setMessages([...next, { role: "assistant", content: res.reply }]);
    } catch {
      setMessages([...next, { role: "assistant", content: "Sorry, something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
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
      <main className="max-w-4xl mx-auto px-4 md:px-6 pt-10 pb-16">
        <div className="text-center mb-6 animate-fade-up">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 border border-white/80 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            <Sparkles className="size-3" /> {t("nav.assistant")}
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mt-3">{t("page.assistant.title")}</h1>
          <p className="text-foreground/60 mt-2">{t("page.assistant.subtitle")}</p>
        </div>

        <div className="glass-panel rounded-[2rem] p-4 md:p-6 flex flex-col h-[60vh] min-h-[480px]">
          <div ref={scrollRef} className="flex-grow overflow-y-auto space-y-4 pr-1">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`size-8 rounded-full shrink-0 ${m.role === "user" ? "bg-[color:var(--sky-brand)]/30" : "bg-primary/20"}`} />
                <div
                  className={`p-4 rounded-2xl max-w-[80%] text-sm whitespace-pre-wrap leading-relaxed ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-none shadow-[var(--shadow-glow-primary)]"
                      : "bg-white/85 border border-foreground/5 rounded-tl-none"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading ? (
              <div className="flex gap-3">
                <div className="size-8 rounded-full bg-primary/20 shrink-0" />
                <div className="bg-white/85 border border-foreground/5 p-4 rounded-2xl rounded-tl-none text-sm">
                  <span className="inline-flex gap-1">
                    <span className="size-1.5 bg-foreground/40 rounded-full animate-bounce" />
                    <span className="size-1.5 bg-foreground/40 rounded-full animate-bounce [animation-delay:120ms]" />
                    <span className="size-1.5 bg-foreground/40 rounded-full animate-bounce [animation-delay:240ms]" />
                  </span>
                </div>
              </div>
            ) : null}
          </div>

          {messages.length <= 1 ? (
            <div className="flex flex-wrap gap-2 mt-4">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-xs font-semibold bg-white/70 border border-foreground/5 hover:bg-primary/10 hover:text-primary px-3 py-2 rounded-full transition"
                >
                  {s}
                </button>
              ))}
            </div>
          ) : null}

          <form
            onSubmit={(e) => { e.preventDefault(); send(input); }}
            className="mt-4 flex gap-2 items-center"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your farming question…"
              className="flex-grow bg-white/70 border border-white/80 rounded-full px-5 py-3 text-sm outline-none focus:border-primary/50 focus:bg-white transition"
            />
            <button
              type="button"
              onClick={toggleVoice}
              className={`size-12 rounded-full grid place-items-center transition-all border border-foreground/5 ${
                listening ? "bg-primary text-primary-foreground animate-pulse" : "bg-white text-primary hover:bg-primary/10"
              }`}
              aria-label="Voice input"
            >
              <Mic className="size-5" />
            </button>
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="size-12 rounded-full grid place-items-center bg-primary text-primary-foreground shadow-[var(--shadow-glow-primary)] disabled:opacity-40 hover:scale-105 transition"
              aria-label="Send"
            >
              <Send className="size-5" />
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
