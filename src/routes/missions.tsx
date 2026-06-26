import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader, ProgressBar, Surface } from "@/components/app-shell";
import { MISSIONS, setState, usePhoenix, type MissionId } from "@/lib/phoenix-data";
import { CheckCircle2, Circle, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/missions")({
  head: () => ({
    meta: [
      { title: "Missions · Phoenix OS" },
      { name: "description", content: "Earn progression through missions, not weeks." },
    ],
  }),
  component: MissionsPage,
});

function MissionsPage() {
  const s = usePhoenix();
  const setMission = (id: MissionId) =>
    setState((prev) => ({ ...prev, currentMissionId: id }));

  return (
    <AppShell>
      <PageHeader
        eyebrow="Campaign"
        title="Missions"
        description="Progression is earned through criteria — never assumed by the calendar."
      />
      <div className="space-y-4">
        {MISSIONS.map((m, idx) => {
          const active = m.id === s.currentMissionId;
          const Icon =
            m.status === "complete" ? CheckCircle2 : m.status === "locked" ? Lock : Circle;
          return (
            <Surface key={m.id} className={cn("p-5", active && "shadow-phoenix")}>
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    "grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-border",
                    m.status === "complete" && "bg-success/15 text-success",
                    m.status === "active" && "bg-gradient-phoenix text-phoenix-foreground",
                    m.status === "locked" && "text-muted-foreground",
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                      Mission {idx + 1} · {m.phase}
                    </div>
                    {active && (
                      <span className="rounded-full bg-phoenix/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-phoenix">
                        Active
                      </span>
                    )}
                  </div>
                  <div className="mt-1 text-lg font-semibold tracking-tight">{m.name}</div>
                  <div className="text-sm text-muted-foreground">{m.tagline}</div>
                  <p className="mt-2 text-sm">{m.objective}</p>

                  <div className="mt-4">
                    <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
                      <span>Progress</span>
                      <span className="font-medium text-foreground">{m.progress}%</span>
                    </div>
                    <ProgressBar value={m.progress} />
                  </div>

                  <div className="mt-4 grid gap-2 text-sm md:grid-cols-2">
                    {m.criteria.map((c) => (
                      <div key={c} className="flex items-start gap-2 text-muted-foreground">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-phoenix" />
                        <span>{c}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span>
                      Next unlock · <span className="text-foreground">{m.nextUnlock}</span>
                    </span>
                    {m.status !== "locked" && !active && (
                      <button
                        onClick={() => setMission(m.id)}
                        className="rounded-lg border border-border px-2.5 py-1 text-xs hover:bg-accent"
                      >
                        Set as current mission
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </Surface>
          );
        })}
      </div>
    </AppShell>
  );
}