import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { askAgriAI } from "@/lib/api-client";
import { useProState } from "@/lib/pro";
import { AppLink } from "@/lib/spa-router";
import { FlaskConical, Upload, Lock, Sparkles, Loader2 } from "lucide-react";

export const Route = createFileRoute("/soil")({
  head: () => ({
    meta: [
      { title: "AI Soil Test Report Reader for Farmers — AgriAI" },
      { name: "description", content: "Upload an Indian Soil Health Card to understand pH, NPK, micronutrients and recommended soil amendments." },
      { property: "og:title", content: "AI Soil Test Report Reader for Farmers — AgriAI" },
      { property: "og:description", content: "Understand soil test results and improve fertilizer decisions with AI guidance." },
      { property: "og:url", content: "https://agrigrowai.lovable.app/soil" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://agrigrowai.lovable.app/soil" }],
  }),
  component: SoilPage,
});

const SOIL_PROMPT = `You are analysing a Soil Health Card / soil test report from India.
Extract these values if visible: pH, EC, Organic Carbon (OC), Available N, P, K, and micronutrients (Zn, Fe, Mn, Cu, B, S).
Then produce a clear, plain-language report with these sections:

1. **Summary** — one-line health assessment (Good / Moderate / Poor).
2. **Interpretation** — what each value means (low/medium/high) with normal ranges.
3. **Amendments needed** — specific quantities per acre (lime for acidic pH, gypsum for alkaline/sodic, FYM/compost for OC, micronutrient sprays).
4. **Fertilizer strategy** — how to adjust standard NPK doses based on soil status.
5. **Crops best suited** to this soil profile.

Format with markdown headings. Be specific with quantities (e.g. "Apply 2 quintal lime per acre"). If the image is unreadable, say so and ask for a clearer photo.`;

export function SoilPage() {
  const pro = useProState();
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [reply, setReply] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 6 * 1024 * 1024) { setError("Image too large — please use under 6MB."); return; }
    const reader = new FileReader();
    reader.onload = () => setImageDataUrl(String(reader.result));
    reader.readAsDataURL(f);
    setReply(null);
    setError(null);
  }

  async function analyse() {
    if (!imageDataUrl) return;
    setLoading(true);
    setError(null);
    setReply(null);
    try {
      const res = await askAgriAI({
        messages: [{ role: "user", content: SOIL_PROMPT }],
        language: "English",
        imageDataUrl,
      });
      if (res.error) throw new Error(res.error);
      setReply(res.reply);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen">
      <Nav />
      <main className="max-w-4xl mx-auto px-3 md:px-6 py-8 md:py-12 space-y-6">
        <header className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel text-xs font-semibold text-primary">
            <FlaskConical className="size-3.5" /> AI-powered analysis
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight">Soil Test Report Reader</h1>
          <p className="text-foreground/70 max-w-2xl">Upload a photo of your Soil Health Card. AI extracts values, explains them in plain language, and suggests amendments.</p>
        </header>

        {!pro.active ? (
          <div className="glass-panel-strong rounded-2xl p-8 text-center space-y-4">
            <Lock className="size-10 mx-auto text-foreground/40" />
            <div>
              <div className="font-bold text-2xl flex items-center justify-center gap-2">
                Pro Feature <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase"><Sparkles className="size-3" /> Pro</span>
              </div>
              <p className="text-sm text-foreground/60 max-w-md mx-auto mt-2">Soil report AI analysis is a premium feature. Unlock unlimited scans, structured recommendations, and export.</p>
            </div>
            <AppLink to="/pricing" className="inline-flex px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90">Upgrade to Pro →</AppLink>
          </div>
        ) : (
          <>
            <section className="glass-panel-strong rounded-2xl p-5 space-y-4">
              <input ref={fileRef} type="file" accept="image/*" onChange={onFile} className="hidden" />
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-foreground/20 rounded-xl p-8 gap-3 cursor-pointer hover:border-primary/50 transition" onClick={() => fileRef.current?.click()}>
                {imageDataUrl ? (
                  <img src={imageDataUrl} alt="Soil card" className="max-h-64 rounded-lg" />
                ) : (
                  <>
                    <Upload className="size-8 text-foreground/40" />
                    <p className="text-sm text-foreground/60">Tap to upload Soil Health Card photo</p>
                    <p className="text-xs text-foreground/40">JPG/PNG · up to 6MB</p>
                  </>
                )}
              </div>
              <button disabled={!imageDataUrl || loading} onClick={analyse}
                className="w-full px-4 py-3 rounded-xl bg-primary text-primary-foreground font-semibold disabled:opacity-40 hover:opacity-90 flex items-center justify-center gap-2">
                {loading ? <><Loader2 className="size-4 animate-spin" /> Analysing…</> : "Analyse soil report"}
              </button>
              {error && <p className="text-sm text-destructive">{error}</p>}
            </section>

            {reply && (
              <section className="glass-panel-strong rounded-2xl p-5">
                <h2 className="font-bold text-lg mb-3">Report</h2>
                <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap text-foreground/85">{reply}</div>
              </section>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
