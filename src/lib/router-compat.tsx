import { useSpaRouter } from "./spa-router";
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";

type LinkProps = {
  to: string;
  children: ReactNode;
  activeProps?: { className?: string };
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

export function Link({ to, children, className, activeProps, onClick, ...props }: LinkProps) {
  const { path, navigate } = useSpaRouter();
  const active = path === to;
  const combined = [className, active ? activeProps?.className : null].filter(Boolean).join(" ");

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || props.target) return;
    event.preventDefault();
    navigate(to);
  }

  return <a {...props} href={to} onClick={handleClick} className={combined}>{children}</a>;
}

export function createFileRoute(_path: string) {
  return <T,>(config: T) => config;
}

export function createRootRouteWithContext<TContext>() {
  return <T,>(config: T) => config as T & { useRouteContext: () => TContext };
}

export function Outlet() {
  return null;
}

export function HeadContent() {
  return null;
}

export function Scripts() {
  return null;
}

export function useRouter() {
  return { invalidate: () => undefined };
}

export function createRouter(config: unknown) {
  return config;
}