import { useEffect, useMemo, useRef } from "react";
import {
  ADSENSE_PUBLISHER_ID,
  ADSENSE_SLOT_ID,
  AFFILIATE_OFFERS,
  ENABLE_ADSENSE,
} from "@/lib/ads";

let adsenseScriptLoaded = false;

function loadAdsenseScript() {
  if (adsenseScriptLoaded || typeof document === "undefined") return;
  adsenseScriptLoaded = true;
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUBLISHER_ID}`;
  s.crossOrigin = "anonymous";
  document.head.appendChild(s);
}

/**
 * Home / page-level banner slot.
 * - If ENABLE_ADSENSE is true (and your publisher id is set in src/lib/ads.ts)
 *   this renders a real AdSense unit and earns per impression/click.
 * - Otherwise it falls back to one of your affiliate offers, so the slot is
 *   never empty and still earns commission.
 */
export function AdBanner({ className = "" }: { className?: string }) {
  const insRef = useRef<HTMLModElement | null>(null);

  const offer = useMemo(() => {
    const idx = Math.floor(Date.now() / 3_600_000) % AFFILIATE_OFFERS.length;
    return AFFILIATE_OFFERS[idx]!;
  }, []);

  useEffect(() => {
    if (!ENABLE_ADSENSE) return;
    loadAdsenseScript();
    try {
      // @ts-expect-error injected by the AdSense script
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* ad blocked or script not ready — fallback stays visible */
    }
  }, []);

  if (ENABLE_ADSENSE) {
    return (
      <div className={`max-w-7xl mx-auto px-6 ${className}`}>
        <p className="text-[10px] uppercase tracking-widest font-bold text-foreground/35 mb-2">
          Advertisement
        </p>
        <ins
          ref={insRef}
          className="adsbygoogle block w-full"
          style={{ display: "block", minHeight: 90 }}
          data-ad-client={ADSENSE_PUBLISHER_ID}
          data-ad-slot={ADSENSE_SLOT_ID}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  return (
    <div className={`max-w-7xl mx-auto px-6 ${className}`}>
      <a
        href={offer.url}
        target="_blank"
        rel="sponsored noopener noreferrer"
        className="glass-panel rounded-[1.75rem] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-white/65 transition-colors"
      >
        <span className="text-3xl leading-none shrink-0" aria-hidden>
          {offer.emoji}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[10px] uppercase tracking-widest font-bold text-foreground/40">
            Sponsored · {offer.tag}
          </span>
          <span className="block text-base sm:text-lg font-bold mt-1 break-words">{offer.title}</span>
          <span className="block text-xs sm:text-sm text-foreground/60 mt-1 break-words">{offer.body}</span>
        </span>
        <span className="shrink-0 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground text-center">
          {offer.cta}
        </span>
      </a>
    </div>
  );
}
