import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader, Surface } from "@/components/app-shell";
import {
  createRecoveryIqEvent,
  getLocalDateKey,
  getUtcTimestamp,
  MISSIONS,
  setState,
  upsertRecoveryIqEvent,
  usePhoenix,
} from "@/lib/phoenix-data";
import { CheckCircle2, Lock, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/milestones")({
  head: () => ({
    meta: [
      { title: "Milestones · Phoenix OS" },
      { name: "description", content: "Achievements earned by evidence, not effort." },
    ],
  }),
  component: MilestonesPage,
});

function MilestonesPage() {
  const s = usePhoenix();
  const unlock = (id: string) =>
    setState((prev) => {
      const milestone = prev.milestones.find((mi) => mi.id === id);
      if (!milestone || milestone.state === "unlocked") return prev;

      const now = new Date();
      const timestamp = getUtcTimestamp(now);
      const date = getLocalDateKey(now);

      return {
        ...prev,
        milestones: prev.milestones.map((mi) =>
          mi.id === id
            ? {
                ...mi,
                state: "unlocked",
                status: "unlocked",
                unlockedAt: date,
                evidence: [
                  ...mi.evidence,
                  {
                    date,
                    type: "manual",
                    summary: "Manually marked unlocked.",
                    confidence: "medium",
                  },
                ],
              }
            : mi,
        ),
        recoveryIqEvents: upsertRecoveryIqEvent(
          prev.recoveryIqEvents,
          createRecoveryIqEvent({
            date,
            sourceType: "milestone",
            sourceId: `milestone:${id}`,
            title: "Milestone unlocked",
            description: milestone.name,
            xpAmount: 100,
            timestamp,
          }),
        ),
      };
    });

  return (
    <AppShell>
      <PageHeader
        eyebrow="Achievements"
        title="Milestones"
        description="Each milestone has a name, a reason it matters, and the evidence required to earn it."
      />
      <div className="space-y-8">
        {MISSIONS.map((mission) => {
          const items = s.milestones.filter((m) => m.mission === mission.id);
          if (items.length === 0) return null;
          return (
            <section key={mission.id}>
              <div className="mb-3 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                <span>{mission.name}</span>
                <span className="h-px flex-1 bg-border" />
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {items.map((mi) => {
                  const Icon =
                    mi.state === "unlocked"
                      ? CheckCircle2
                      : mi.state === "locked" || mi.state === "paused"
                        ? Lock
                        : Trophy;
                  return (
                    <Surface key={mi.id} className="p-5">
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            "grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-border",
                            mi.state === "unlocked" && "bg-success/15 text-success",
                            (mi.state === "testable" ||
                              mi.state === "test_passed_pending_confirmation") &&
                              "bg-phoenix/15 text-phoenix",
                            (mi.state === "locked" || mi.state === "paused") &&
                              "text-muted-foreground",
                          )}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline justify-between gap-2">
                            <div className="truncate text-sm font-semibold">{mi.name}</div>
                            {mi.unlockedAt && (
                              <div className="shrink-0 text-[11px] text-muted-foreground">
                                {mi.unlockedAt}
                              </div>
                            )}
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">{mi.description}</p>
                          <p className="mt-2 text-xs">
                            <span className="text-muted-foreground">Why it matters · </span>
                            {mi.why}
                          </p>
                          <p className="mt-1 text-xs">
                            <span className="text-muted-foreground">Evidence · </span>
                            {mi.evidenceSummary}
                          </p>
                          {mi.evidence.length > 0 && (
                            <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                              {mi.evidence.slice(-3).map((item) => (
                                <li key={`${item.date}-${item.summary}`}>- {item.summary}</li>
                              ))}
                            </ul>
                          )}
                          <p className="mt-2 text-xs">
                            <span className="text-muted-foreground">State · </span>
                            {formatState(mi.state)}
                          </p>
                          {mi.coachNotes && (
                            <div className="mt-3 rounded-lg border border-border bg-background/40 p-2.5 text-xs text-muted-foreground">
                              <span className="text-foreground">Coach: </span>
                              {mi.coachNotes}
                            </div>
                          )}
                          {mi.state !== "unlocked" && (
                            <button
                              onClick={() => unlock(mi.id)}
                              className="mt-3 rounded-lg border border-border px-2.5 py-1 text-[11px] uppercase tracking-wider text-muted-foreground hover:bg-accent hover:text-foreground"
                            >
                              Mark unlocked
                            </button>
                          )}
                        </div>
                      </div>
                    </Surface>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </AppShell>
  );
}

function formatState(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
