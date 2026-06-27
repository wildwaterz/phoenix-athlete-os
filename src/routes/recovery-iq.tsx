import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader, ProgressBar, StatTile, Surface } from "@/components/app-shell";
import {
  LEVEL_STEP,
  recoveryIqForState,
  recoveryIqXpForState,
  type RecoveryIqEvent,
  type RecoveryIqEventSourceType,
  usePhoenix,
} from "@/lib/phoenix-data";
import { Brain, CheckCircle2, ClipboardCheck, FileText, Target, Trophy } from "lucide-react";

export const Route = createFileRoute("/recovery-iq")({
  head: () => ({
    meta: [
      { title: "Recovery IQ · Phoenix OS" },
      { name: "description", content: "XP earned for smart decisions, not effort." },
    ],
  }),
  component: RecoveryIQPage,
});

function RecoveryIQPage() {
  const s = usePhoenix();
  const xp = recoveryIqXpForState(s);
  const iq = recoveryIqForState(s);
  const events = [...s.recoveryIqEvents].sort((a, b) =>
    (a.timestamp || a.createdAt) < (b.timestamp || b.createdAt) ? 1 : -1,
  );
  const checkInCount = events.filter((event) => event.sourceType === "check_in").length;
  const questCount = events.filter((event) => event.sourceType === "quest").length;
  const milestoneCount = events.filter((event) => event.sourceType === "milestone").length;

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
              Recovery IQ
            </div>
            <div className="mt-1 text-5xl font-bold tracking-tight">
              {iq.level}
              <span className="ml-2 text-base font-normal text-muted-foreground">· {xp} XP</span>
            </div>
            {xp === 0 && (
              <p className="mt-3 max-w-xl text-sm text-muted-foreground">
                Complete check-ins and quests to start earning Recovery IQ.
              </p>
            )}
          </div>
          {xp > 0 && (
            <div className="text-right text-sm text-muted-foreground">
              <div>
                {iq.toNext} XP to Level {iq.level + 1}
              </div>
              <div className="text-[11px]">{LEVEL_STEP} XP per level</div>
            </div>
          )}
        </div>
        <div className="mt-4">
          <ProgressBar value={iq.pct} />
        </div>
      </Surface>

      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatTile label="Events logged" value={events.length} hint="RecoveryIqEvent records" />
        <StatTile label="Check-ins" value={checkInCount} hint="Completed" />
        <StatTile label="Quests" value={questCount} hint="Completed" />
        <StatTile label="Milestones" value={milestoneCount} hint="Unlocked" />
      </div>

      <Surface>
        <div className="mb-3 text-sm font-semibold tracking-tight">Recovery IQ Events</div>
        {events.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-background/30 p-4 text-sm text-muted-foreground">
            Complete check-ins and quests to start earning Recovery IQ.
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {events.map((event) => (
              <RecoveryIqEventRow key={event.id} event={event} />
            ))}
          </ul>
        )}
      </Surface>
    </AppShell>
  );
}

function RecoveryIqEventRow({ event }: { event: RecoveryIqEvent }) {
  const Icon = eventIcon(event.sourceType);
  return (
    <li className="flex items-start gap-3 py-3">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-border text-phoenix">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium">{event.title}</div>
        <div className="mt-1 text-xs text-muted-foreground">
          {formatSource(event.sourceType)} · {event.date}
        </div>
        {event.description && (
          <div className="mt-1 text-sm text-muted-foreground">{event.description}</div>
        )}
      </div>
      <div className="shrink-0 rounded-md bg-phoenix/10 px-2 py-1 text-[11px] font-semibold text-phoenix">
        {event.xpAmount > 0 ? "+" : ""}
        {event.xpAmount} XP
      </div>
    </li>
  );
}

function eventIcon(sourceType: RecoveryIqEventSourceType) {
  if (sourceType === "check_in") return ClipboardCheck;
  if (sourceType === "quest") return CheckCircle2;
  if (sourceType === "coach_plan") return FileText;
  if (sourceType === "milestone") return Trophy;
  if (sourceType === "small_win") return Target;
  return Brain;
}

function formatSource(sourceType: RecoveryIqEventSourceType) {
  return sourceType
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
