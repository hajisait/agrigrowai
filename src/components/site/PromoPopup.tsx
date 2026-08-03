import { useEffect, useState } from "react";
import { X, ExternalLink } from "lucide-react";
import { AFFILIATE_OFFERS, ENABLE_ADSENSE, ADSENSE_PUBLISHER_ID, ADSENSE_SLOT_ID } from "@/lib/ads";

const COOLDOWN_KEY = "agriai_promo_seen";
const DAY_MS = 24 * 60 * 60 * 1000;

export function PromoPopup() {
  const [visible, setVisible] = useState(false);
  const [offer, setOffer] = useState(AFFILIATE_OFFERS[0]);

  useEffect(() => {
    // Show once per day per device, after a short delay on first load.
    let seen = 0;
    try {
      seen = Number(localStorage.getItem(COOLDOWN_KEY) ?? 0);
    } catch {
      /* ignore */
    }
    if (Date.now() - seen < DAY_MS) return;

    const timer = window.setTimeout(() => {
      setOffer(AFFILIATE_OFFERS[Math.floor(Math.random() * AFFILIATE_OFFERS.length)]);
      setVisible(true);
    }, 18000); // 18s — let the user read the page first

    return () => window.clearTimeout(timer);
  }, []);

  function dismiss() {
    setVisible(false);
    try {
      localStorage.setItem(COOLDOWN_KEY, String(Date.now()));
    } catch {
      /* ignore */
    }
  }

  function openOffer() {
    window.open(offer.url, "_blank", "noopener,noreferrer");
    dismiss();
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="promo-title"
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-3 sm:p-6"
      onClick={dismiss}
    >
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm animate-[fadeIn_0.2s_ease]" />
      <div
        className="relative w-full max-w-md glass-panel-strong rounded-3xl p-6 shadow-2xl animate-[slideUp_0.25s_ease]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={dismiss}
          aria-label="Close"
          className="absolute top-3 right-3 size-9 rounded-full glass-panel grid place-items-center text-foreground/70 hover:text-primary transition"
        >
          <X className="size-4" />
        </button>

        <div className="flex items-start gap-4">
          <div className="size-14 shrink-0 rounded-2xl bg-primary/10 grid place-items-center text-3xl">
            {offer.emoji}
          </div>
          <div className="min-w-0">
            <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 rounded-full px-2 py-0.5 mb-2">
              {offer.tag}
            </span>
            <h2 id="promo-title" className="text-lg font-extrabold tracking-tight leading-snug">
              {offer.title}
            </h2>
          </div>
        </div>

        <p className="mt-4 text-sm text-foreground/70 leading-relaxed">{offer.body}</p>

        {ENABLE_ADSENSE && ADSENSE_PUBLISHER_ID.startsWith("ca-pub-") ? (
          <div className="mt-4 min-h-[90px] rounded-2xl bg-foreground/5 grid place-items-center text-xs text-foreground/40">
            <ins
              className="adsbygoogle block w-full"
              style={{ display: "block" }}
              data-ad-client={ADSENSE_PUBLISHER_ID}
              data-ad-slot={ADSENSE_SLOT_ID}
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
          </div>
        ) : null}

        <div className="mt-5 flex items-center gap-2">
          <button
            type="button"
            onClick={openOffer}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground hover:opacity-90 transition shadow-[var(--shadow-glow-primary)]"
          >
            {offer.cta}
            <ExternalLink className="size-4" />
          </button>
          <button
            type="button"
            onClick={dismiss}
            className="rounded-full px-4 py-3 text-sm font-semibold text-foreground/60 hover:text-foreground transition"
          >
            Not now
          </button>
        </div>

        <p className="mt-3 text-center text-[10px] text-foreground/40">
          Sponsored · helps keep AgriAI free
        </p>
      </div>
    </div>
  );
}
