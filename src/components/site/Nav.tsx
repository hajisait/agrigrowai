import { Link } from "@tanstack/react-router";
import { Leaf, Menu, Moon, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";
import { LANGS, useI18n, type Lang } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";

export function Nav() {
  const { lang, setLang, t } = useI18n();
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const links = [
    { to: "/assistant", label: t("nav.assistant") },
    { to: "/weather", label: t("nav.weather") },
    { to: "/disease", label: t("nav.disease") },
    { to: "/market", label: t("nav.market") },
    { to: "/calculator", label: t("nav.calculator") },
    { to: "/schemes", label: t("nav.schemes") },
  ] as const;

  return (
    <>
      <nav className="sticky top-0 z-50 glass-panel-strong rounded-2xl mx-3 md:mx-6 mt-3 md:mt-4 px-3 md:px-6 py-2.5 md:py-3 flex items-center justify-between gap-2">
        <Link to="/" className="flex items-center gap-2 group shrink-0" onClick={() => setOpen(false)}>
          <span className="size-8 md:size-9 rounded-xl bg-primary text-primary-foreground grid place-items-center shadow-[var(--shadow-glow-primary)] group-hover:scale-105 transition-transform">
            <Leaf className="size-4" />
          </span>
          <span className="font-extrabold tracking-tight text-base md:text-xl text-primary">AgriAI</span>
        </Link>

        <div className="hidden md:flex items-center gap-5 lg:gap-6 text-sm font-medium text-foreground/80">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="hover:text-primary transition-colors" activeProps={{ className: "text-primary" }}>
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <div className="hidden sm:flex items-center gap-0.5 glass-panel rounded-full px-1.5 sm:px-2 py-1 text-[10px] sm:text-[11px] font-semibold">
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
            className="size-9 rounded-full glass-panel grid place-items-center text-foreground/80 hover:text-primary transition"
          >
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="md:hidden size-9 rounded-full glass-panel grid place-items-center text-foreground/80 hover:text-primary transition"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile sheet */}
      <div
        className={`md:hidden fixed inset-0 z-40 transition-opacity ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      >
        <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" />
        <div
          className={`absolute top-20 left-3 right-3 glass-panel-strong rounded-2xl p-4 flex flex-col gap-1 transition-transform ${open ? "translate-y-0" : "-translate-y-4"}`}
          onClick={(e) => e.stopPropagation()}
        >
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="px-4 py-3 rounded-xl text-base font-semibold text-foreground/85 hover:bg-primary/10 hover:text-primary transition"
              activeProps={{ className: "bg-primary/10 text-primary" }}
            >
              {l.label}
            </Link>
          ))}
          <div className="flex items-center justify-center gap-1 mt-2 pt-3 border-t border-foreground/10">
            {LANGS.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l as Lang)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${l === lang ? "bg-primary text-primary-foreground" : "bg-foreground/5 text-foreground/60"}`}
                aria-pressed={l === lang}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
