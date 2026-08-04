import { AppLink } from "@/lib/spa-router";
import { useAuth } from "@/lib/auth";
import { buildRecommendations, currentSeason } from "@/lib/recommend";
import { Sparkles, UserPlus } from "lucide-react";

export function Recommendations() {
  const { user, profile } = useAuth();
  const season = currentSeason();

  const recs = buildRecommendations({
    state: profile?.state,
    district: profile?.district,
    crops: profile?.crops,
    landAcres: profile?.land_acres,
  });

  const name = profile?.full_name?.split(" ")[0];

  return (
    <section className="px-4 md:px-6 py-10 md:py-14 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-1">
            {season} season · personalised
          </p>
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight">
            {name ? `${name}, here's your plan` : "Recommended for you"}
          </h2>
          <p className="text-sm text-foreground/60 mt-1 max-w-xl">
            {user
              ? "Built from your state, district, crops and land size."
              : "Sign in free and add your crops — every advisory then matches your field."}
          </p>
        </div>
        {!user && (
          <AppLink
            to="/auth"
            className="rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-bold flex items-center gap-2"
          >
            <UserPlus className="size-4" /> Create free account
          </AppLink>
        )}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {recs.map((r) => {
          const tone = {
            primary: "border-l-primary text-primary",
            sky: "border-l-[color:var(--sky-brand)] text-[color:var(--sky-brand)]",
            amber: "border-l-[color:var(--amber-brand)] text-[color:var(--amber-brand)]",
          }[r.tone];
          return (
            <AppLink
              key={r.title}
              to={r.to}
              className={`glass-panel rounded-2xl p-6 border-l-4 ${tone.split(" ")[0]} block hover:-translate-y-0.5 transition`}
            >
              <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5 ${tone.split(" ")[1]}`}>
                <Sparkles className="size-3" /> For you
              </p>
              <h3 className="text-lg font-bold mb-2 text-foreground">{r.title}</h3>
              <p className="text-sm text-foreground/60 mb-4">{r.body}</p>
              <span className={`text-xs font-bold ${tone.split(" ")[1]}`}>{r.action} →</span>
            </AppLink>
          );
        })}
      </div>
    </section>
  );
}
