import { Link } from "@tanstack/react-router";
import { Leaf, Moon, Sun } from "lucide-react";
import { LANGS, useI18n, type Lang } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";

export function Nav() {
  const { lang, setLang, t } = useI18n();
  const { theme, toggle } = useTheme();

  return (
    <nav className="sticky top-0 z-50 glass-panel-strong rounded-2xl mx-3 md:mx-6 mt-3 md:mt-4 px-3 md:px-6 py-2.5 md:py-3 flex items-center justify-between gap-2">
      <Link to="/" className="flex items-center gap-2 group shrink-0">
        <span className="size-8 md:size-9 rounded-xl bg-primary text-primary-foreground grid place-items-center shadow-[var(--shadow-glow-primary)] group-hover:scale-105 transition-transform">
          <Leaf className="size-4" />
        </span>
        <span className="font-extrabold tracking-tight text-base md:text-xl text-primary">AgriAI</span>
      </Link>

      <div className="hidden md:flex items-center gap-5 lg:gap-6 text-sm font-medium text-foreground/80">
        <Link to="/assistant" className="hover:text-primary transition-colors" activeProps={{ className: "text-primary" }}>{t("nav.assistant")}</Link>
        <Link to="/weather" className="hover:text-primary transition-colors" activeProps={{ className: "text-primary" }}>{t("nav.weather")}</Link>
        <Link to="/disease" className="hover:text-primary transition-colors" activeProps={{ className: "text-primary" }}>{t("nav.disease")}</Link>
        <Link to="/market" className="hover:text-primary transition-colors" activeProps={{ className: "text-primary" }}>{t("nav.market")}</Link>
        <Link to="/schemes" className="hover:text-primary transition-colors" activeProps={{ className: "text-primary" }}>{t("nav.schemes")}</Link>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <div className="flex items-center gap-0.5 glass-panel rounded-full px-1.5 sm:px-2 py-1 text-[10px] sm:text-[11px] font-semibold">
          {LANGS.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLang(l as Lang)}
              className={`px-1.5 py-0.5 rounded-full transition ${l === lang ? "text-primary bg-primary/10" : "opacity-50 hover:opacity-100"}`}
              aria-pressed={l === lang}
            >
              {l}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={toggle}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          className="size-8 md:size-9 rounded-full glass-panel grid place-items-center text-foreground/80 hover:text-primary transition"
        >
          {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </button>
      </div>
    </nav>
  );
}
