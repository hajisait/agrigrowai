import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search, ExternalLink } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { useI18n } from "@/lib/i18n";
import { getSchemes, type Scheme } from "@/lib/api-client";

export const Route = createFileRoute("/schemes")({
  head: () => ({
    meta: [
      { title: "Government Schemes — AgriAI Assist" },
      { name: "description", content: "Discover government schemes, subsidies, insurance and loans available to Indian farmers." },
      { property: "og:title", content: "Government Schemes — AgriAI Assist" },
      { property: "og:description", content: "Government schemes, subsidies and insurance for farmers." },
    ],
  }),
  component: SchemesPage,
});

type Tone = "primary" | "sky" | "amber";
const TONE: Record<Tone, { border: string; text: string; bg: string }> = {
  primary: { border: "border-l-primary", text: "text-primary", bg: "bg-primary/10 hover:bg-primary/15" },
  sky: { border: "border-l-[color:var(--sky-brand)]", text: "text-[color:var(--sky-brand)]", bg: "bg-[color:var(--sky-brand)]/10 hover:bg-[color:var(--sky-brand)]/15" },
  amber: { border: "border-l-[color:var(--amber-brand)]", text: "text-[color:var(--amber-brand)]", bg: "bg-[color:var(--amber-brand)]/15 hover:bg-[color:var(--amber-brand)]/25" },
};

export function SchemesPage() {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("All");
  const [list, setList] = useState<Scheme[]>([]);
  const [categories, setCategories] = useState(["All"]);

  useEffect(() => {
    let cancelled = false;
    getSchemes({ query, category: cat }).then((res) => {
      if (cancelled) return;
      setList(res.schemes);
      setCategories(res.categories);
    });
    return () => {
      cancelled = true;
    };
  }, [query, cat]);

  return (
    <>
      <Nav />
      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-10 pb-16">
        <div className="text-center mb-8 animate-fade-up">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter">{t("page.schemes.title")}</h1>
          <p className="text-foreground/60 mt-2">{t("page.schemes.subtitle")}</p>
        </div>

        <div className="glass-panel rounded-3xl p-4 md:p-5 mb-6 flex flex-col md:flex-row gap-3">
          <div className="flex-grow relative">
            <Search className="size-4 absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search schemes, subsidies, benefits…"
              className="w-full bg-white/70 border border-white/80 rounded-full pl-11 pr-5 py-2.5 text-sm outline-none focus:border-primary/50 focus:bg-white"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto md:flex-wrap">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold border transition ${
                  cat === c
                    ? "bg-primary text-primary-foreground border-primary shadow-[var(--shadow-glow-primary)]"
                    : "bg-white/60 border-white/80 text-foreground/70 hover:bg-white"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {list.length === 0 ? (
          <div className="text-center text-foreground/50 py-16">No schemes match your search.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {list.map((s) => {
              const t = TONE[s.tone];
              return (
                <div key={s.title} className={`glass-panel rounded-[2rem] p-7 border-l-4 ${t.border} flex flex-col`}>
                  <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${t.text}`}>{s.tag}</p>
                  <h3 className="text-xl font-bold mb-3">{s.title}</h3>
                  <p className="text-sm text-foreground/60 mb-4">{s.body}</p>
                  <dl className="text-xs space-y-2 mb-6 flex-grow">
                    <div><dt className="font-bold text-foreground/70">Eligibility</dt><dd className="text-foreground/60">{s.eligibility}</dd></div>
                    <div><dt className="font-bold text-foreground/70">Benefits</dt><dd className="text-foreground/60">{s.benefits}</dd></div>
                  </dl>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full py-3 rounded-xl text-xs font-bold border border-foreground/5 ${t.bg} ${t.text} flex items-center justify-center gap-1.5 transition`}
                  >
                    Visit Official Portal <ExternalLink className="size-3" />
                  </a>
                </div>
              );
            })}
          </div>
        )}

        <p className="text-center text-[11px] text-foreground/40 mt-8">
          Always verify scheme details on the official government portal before applying.
        </p>
      </main>
      <Footer />
    </>
  );
}
