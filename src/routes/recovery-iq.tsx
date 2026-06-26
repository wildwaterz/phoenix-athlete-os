import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader, ProgressBar, StatTile, Surface } from "@/components/app-shell";
import { LEVEL_STEP, levelFromXp, usePhoenix } from "@/lib/phoenix-data";
import { Brain, CheckCircle2, Lightbulb, ShieldCheck, Trophy } from "lucide-react";

export const Route = createFileRoute("/recovery-iq")({
  head: () => ({
    meta: [
      { title: "Recovery IQ · Phoenix OS" },
      { name: "description", content: "XP earned for smart decisions, not effort." },
    ],
  }),
  component: RecoveryIQPage,
});

const SOURCES = [
  { icon: Lightbulb, label: "Asking thoughtful questions", xp: "+10–30" },
  { icon: CheckCircle2, label: "Completing the recovery plan", xp: "+10–25" },
  { icon: ShieldCheck, label: "Respecting pain & swelling limits", xp: "+15–40" },
  { icon: Brain, label: "Evidence-based decisions", xp: "+20–50" },
  { icon: Trophy, label: "Unlocking milestones", xp: "+100" },
];

function RecoveryIQPage() {
  const s = usePhoenix();
  const iq = levelFromXp(s.recoveryIqXp);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Progression"
        title="Recovery IQ"
        description="Recovery IQ rewards smart decisions. No negative XP — only missed opportunities."
      />

      <Surface className="mb-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-phoenix">
              Current Level
            </div>
            <div className="mt-1 text-5xl font-bold tracking-tight">
              {iq.level}
              <span className="ml-2 text-base font-normal text-muted-foreground">
                · {s.recoveryIqXp} XP total
              </span>
            </div>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            <div>{iq.toNext} XP to Level {iq.level + 1}</div>
            <div className="text-[11px]">{LEVEL_STEP} XP per level</div>
          </div>
        </div>
        <div className="mt-4">
          <ProgressBar value={iq.pct} />
        </div>
      </Surface>

      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatTile label="Days active" value="42" hint="Lifetime" />
        <StatTile label="Smart decisions" value="18" hint="Logged" tone="good" />
        <StatTile label="Milestones unlocked" value={s.milestones.filter(m => m.status === "unlocked").length} />
        <StatTile label="Streak" value="7d" hint="Daily check-ins" tone="good" />
      </div>

      <Surface>
        <div className="mb-3 text-sm font-semibold tracking-tight">How XP is earned</div>
        <ul className="divide-y divide-border">
          {SOURCES.map(({ icon: Icon, label, xp }) => (
            <li key={label} className="flex items-center gap-3 py-3">
              <div className="grid h-9 w-9 place-items-center rounded-xl border border-border text-phoenix">
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 text-sm">{label}</div>
              <div className="text-xs font-medium text-phoenix">{xp}</div>
            </li>
          ))}
        </ul>
      </Surface>
    </AppShell>
  );
}