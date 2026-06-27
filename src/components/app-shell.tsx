import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  ClipboardCheck,
  Target,
  Trophy,
  Brain,
  BookOpen,
  Library,
  Compass,
  Settings as SettingsIcon,
  Flame,
} from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { PHASES, currentPhaseN, usePhoenix } from "@/lib/phoenix-data";

type NavEntry = {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
};

const NAV: NavEntry[] = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/check-in", label: "Check-In", icon: ClipboardCheck },
  { to: "/missions", label: "Missions", icon: Target },
  { to: "/milestones", label: "Milestones", icon: Trophy },
  { to: "/recovery-iq", label: "Recovery IQ", icon: Brain },
  { to: "/journal", label: "Journal", icon: BookOpen },
  { to: "/glossary", label: "Glossary", icon: Library },
  { to: "/principles", label: "Principles", icon: Compass },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
];

// Routes shown in the mobile bottom bar (compact subset).
const MOBILE_NAV = NAV.filter((n) =>
  ["/", "/check-in", "/missions", "/milestones", "/recovery-iq"].includes(n.to),
);

function NavItem({
  to,
  label,
  icon: Icon,
  active,
  compact,
}: {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  active: boolean;
  compact?: boolean;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
        active
          ? "bg-accent text-foreground"
          : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
        compact && "flex-col gap-1 px-2 py-1.5 text-[11px]",
      )}
    >
      <Icon className={cn("h-4 w-4 shrink-0", active && "text-phoenix")} />
      <span className="truncate">{label}</span>
      {active && !compact && (
        <span className="absolute right-3 h-1.5 w-1.5 rounded-full bg-phoenix shadow-[0_0_12px_var(--color-phoenix-glow)]" />
      )}
    </Link>
  );
}

export function AppShell({ children }: { children?: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");
  const state = usePhoenix();
  const phaseN = currentPhaseN(state);

  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-sidebar px-3 py-5 md:flex">
        <div className="mb-6 flex items-center gap-2 px-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-phoenix shadow-phoenix">
            <Flame className="h-5 w-5 text-phoenix-foreground" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold tracking-tight">Phoenix OS</div>
            <div className="truncate text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              Athlete Operating System
            </div>
          </div>
        </div>
        <nav className="flex-1 space-y-1">
          {NAV.map((n) => (
            <NavItem key={n.to} {...n} active={isActive(n.to, n.exact)} />
          ))}
        </nav>
        <div className="mt-4 rounded-xl border border-border bg-card/40 p-3">
          <div className="mb-2 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Recovery Phase
          </div>
          <ol className="space-y-1.5">
            {PHASES.map((p) => {
              const done = p.n < phaseN;
              const active = p.n === phaseN;
              return (
                <li key={p.n} className="flex items-center gap-2 text-[11px]">
                  <span
                    className={cn(
                      "grid h-3.5 w-3.5 place-items-center rounded-full border",
                      active
                        ? "border-phoenix bg-phoenix shadow-[0_0_10px_var(--color-phoenix-glow)]"
                        : done
                          ? "border-success bg-success/70"
                          : "border-border bg-transparent",
                    )}
                  />
                  <span
                    className={cn(
                      "truncate",
                      active ? "font-medium text-foreground" : "text-muted-foreground",
                    )}
                  >
                    Phase {p.n} · {p.name}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
        <div className="mt-4 rounded-xl border border-border bg-card/60 p-3 text-[11px] leading-relaxed text-muted-foreground">
          <div className="mb-1 font-medium text-foreground">Evidence beats ego.</div>
          Tomorrow's response matters more than today's workout.
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border/80 bg-background/80 px-4 py-3 backdrop-blur md:hidden">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-phoenix">
            <Flame className="h-4 w-4 text-phoenix-foreground" />
          </div>
          <div className="text-sm font-semibold tracking-tight">Phoenix OS</div>
        </div>
        <Link to="/settings" className="text-xs text-muted-foreground">
          Settings
        </Link>
      </header>

      {/* Main */}
      <main className="pb-24 md:ml-64 md:pb-10">
        <div className="mx-auto w-full max-w-5xl px-4 py-6 md:px-8 md:py-10">
          {children ?? <Outlet />}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-border bg-sidebar/95 px-2 py-2 backdrop-blur md:hidden">
        {MOBILE_NAV.map((n) => (
          <NavItem key={n.to} {...n} active={isActive(n.to, n.exact)} compact />
        ))}
      </nav>
    </div>
  );
}

// ============ small primitives shared across pages ============

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
      <div className="min-w-0">
        {eyebrow && (
          <div className="mb-2 text-[11px] font-medium uppercase tracking-[0.18em] text-phoenix">
            {eyebrow}
          </div>
        )}
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1>
        {description && (
          <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function Surface({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("surface-card rounded-2xl p-5", className)}>{children}</div>;
}

export function StatTile({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  tone?: "default" | "good" | "watch" | "alert";
}) {
  const toneClass =
    tone === "good"
      ? "text-success"
      : tone === "watch"
        ? "text-warning"
        : tone === "alert"
          ? "text-destructive"
          : "text-foreground";
  return (
    <Surface className="p-4">
      <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </div>
      <div className={cn("mt-2 text-2xl font-semibold tracking-tight", toneClass)}>{value}</div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </Surface>
  );
}

export function ProgressBar({ value, className }: { value: number; className?: string }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-muted", className)}>
      <div
        className="h-full rounded-full bg-gradient-phoenix transition-[width] duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
