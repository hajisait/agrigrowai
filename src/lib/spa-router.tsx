import { createContext, useCallback, useContext, useEffect, useMemo, useState, type MouseEvent, type ReactNode } from "react";

type RouterCtx = {
  path: string;
  navigate: (to: string) => void;
};

const RouterContext = createContext<RouterCtx>({ path: "/", navigate: () => {} });

function normalizedPath() {
  if (typeof window === "undefined") return "/";
  const path = window.location.pathname || "/";
  return path.endsWith("/") && path !== "/" ? path.slice(0, -1) : path;
}

export function SpaRouterProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(normalizedPath);

  const navigate = useCallback((to: string) => {
    const next = to || "/";
    if (next === normalizedPath()) return;
    window.history.pushState({}, "", next);
    setPath(normalizedPath());
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const onPop = () => setPath(normalizedPath());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const value = useMemo(() => ({ path, navigate }), [path, navigate]);
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useSpaRouter() {
  return useContext(RouterContext);
}

export function AppLink({ to, className, activeClassName, children, ...props }: {
  to: string;
  className?: string;
  activeClassName?: string;
  children: ReactNode;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  const { path, navigate } = useSpaRouter();
  const active = path === to;
  const combined = [className, active ? activeClassName : null].filter(Boolean).join(" ");

  function onClick(event: MouseEvent<HTMLAnchorElement>) {
    props.onClick?.(event);
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || props.target) return;
    event.preventDefault();
    navigate(to);
  }

  return <a {...props} href={to} onClick={onClick} className={combined}>{children}</a>;
}