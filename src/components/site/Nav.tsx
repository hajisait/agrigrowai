import { Link } from "@tanstack/react-router";
import { Leaf } from "lucide-react";
import { LANGS, useI18n, type Lang } from "@/lib/i18n";

export function Nav() {
  const { lang, setLang, t } = useI18n();

  return (
    <nav className="sticky top-0 z-50 glass-panel-strong rounded-2xl mx-3 md:mx-6 mt-3 md:mt-4 px-4 md:px-6 py-3 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2 group">
        <span className="size-9 rounded-xl bg-primary text-primary-foreground grid place-items-center shadow-[var(--shadow-glow-primary)] group-hover:scale-105 transition-transform">
          <Leaf className="size-4" />
        </span>
        <span className="font-extrabold tracking-tight text-lg md:text-xl text-primary">AgriAI</span>
      </Link>

      <div className="hidden md:flex items-center gap-7 text-sm font-medium text-foreground/80">
        <Link to="/assistant" className="hover:text-primary transition-colors" activeProps={{ className: "text-primary" }}>{t("nav.assistant")}</Link>
        <Link to="/weather" className="hover:text-primary transition-colors" activeProps={{ className: "text-primary" }}>{t("nav.weather")}</Link>
        <Link to="/disease" className="hover:text-primary transition-colors" activeProps={{ className: "text-primary" }}>{t("nav.disease")}</Link>
        <Link to="/market" className="hover:text-primary transition-colors" activeProps={{ className: "text-primary" }}>{t("nav.market")}</Link>
        <Link to="/schemes" className="hover:text-primary transition-colors" activeProps={{ className: "text-primary" }}>{t("nav.schemes")}</Link>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 glass-panel rounded-full px-2.5 sm:px-3 py-1.5 text-[10px] sm:text-[11px] font-semibold">
          {LANGS.map((l, i) => (
            <span key={l} className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setLang(l as Lang)}
                className={l === lang ? "text-primary" : "opacity-50 hover:opacity-100 transition"}
                aria-pressed={l === lang}
              >
                {l}
              </button>
              {i < LANGS.length - 1 ? <span className="text-foreground/20">·</span> : null}
            </span>
          ))}
        </div>
      </div>

    </nav>
  );
}
