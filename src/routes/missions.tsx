import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader, ProgressBar, Surface } from "@/components/app-shell";
import {
  currentMission,
  derivedMissions,
  setState,
  usePhoenix,
  type Mission,
  type MissionId,
  type MissionStatus,
} from "@/lib/phoenix-data";
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
  const setMission = (id: MissionId) => setState((prev) => ({ ...prev, currentMissionId: id }));
  const missions = derivedMissions(s);
  const activeMission = currentMission(s);
  const missionOrder = new Map(missions.map((mission, index) => [mission.id, index]));
  const sections: Array<{ title: string; missions: Mission[] }> = [
    {
      title: "Active mission",
      missions: missions.filter((mission) => mission.status === "active"),
    },
    {
      title: "Monitoring / maintenance",
      missions: missions.filter((mission) => mission.status === "maintenance"),
    },
    {
      title: "Completed missions",
      missions: missions.filter((mission) => mission.status === "complete"),
    },
    {
      title: "Upcoming missions",
      missions: missions.filter(
        (mission) => mission.status === "locked" || mission.status === "blocked",
      ),
    },
  ];

  return (
    <AppShell>
      <PageHeader
        eyebrow="Campaign"
        title="Missions"
        description="Progression is earned through criteria — never assumed by the calendar."
      />
      <div className="space-y-7">
        {sections.map((section) =>
          section.missions.length ? (
            <section key={section.title}>
              <div className="mb-3 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                <span>{section.title}</span>
                <span className="h-px flex-1 bg-border" />
              </div>
              <div className="space-y-4">
                {section.missions.map((m, idx) => (
                  <MissionCard
                    key={m.id}
                    mission={m}
                    index={missionOrder.get(m.id) ?? idx}
                    active={m.id === activeMission.id}
                    onSetMission={setMission}
                  />
                ))}
              </div>
            </section>
          ) : null,
        )}
      </div>
    </AppShell>
  );
}

function MissionCard({
  mission,
  index,
  active,
  onSetMission,
}: {
  mission: Mission;
  index: number;
  active: boolean;
  onSetMission: (id: MissionId) => void;
}) {
  const Icon =
    mission.status === "complete" || mission.status === "maintenance"
      ? CheckCircle2
      : mission.status === "locked" || mission.status === "blocked"
        ? Lock
        : Circle;
  return (
    <Surface className={cn("p-5", active && "shadow-phoenix")}>
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-border",
            (mission.status === "complete" || mission.status === "maintenance") &&
              "bg-success/15 text-success",
            mission.status === "active" && "bg-gradient-phoenix text-phoenix-foreground",
            (mission.status === "locked" || mission.status === "blocked") &&
              "text-muted-foreground",
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Mission {index + 1} · {mission.phase}
            </div>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                statusPillClass(mission.status),
              )}
            >
              {statusLabel(mission.status)}
            </span>
            {active && mission.status === "active" && (
              <span className="rounded-full bg-phoenix/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-phoenix">
                Current
              </span>
            )}
          </div>
          <div className="mt-1 text-lg font-semibold tracking-tight">{mission.name}</div>
          <div className="text-sm text-muted-foreground">{mission.tagline}</div>
          <p className="mt-2 text-sm">{mission.objective}</p>

          <div className="mt-4">
            <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
              <span>Progress from linked milestones</span>
              <span className="font-medium text-foreground">{mission.progress}%</span>
            </div>
            <ProgressBar value={mission.progress} />
          </div>

          <div className="mt-4 grid gap-2 text-sm md:grid-cols-2">
            {mission.criteria.map((c) => (
              <div key={c} className="flex items-start gap-2 text-muted-foreground">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-phoenix" />
                <span>{c}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span>
              Next unlock · <span className="text-foreground">{mission.nextUnlock}</span>
            </span>
            {mission.status === "active" && !active && (
              <button
                onClick={() => onSetMission(mission.id)}
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
}

function statusLabel(status: MissionStatus): string {
  if (status === "maintenance") return "Maintenance";
  if (status === "complete") return "Complete";
  if (status === "blocked") return "Blocked";
  if (status === "active") return "Active";
  return "Upcoming";
}

function statusPillClass(status: MissionStatus): string {
  if (status === "active") return "bg-phoenix/15 text-phoenix";
  if (status === "complete" || status === "maintenance") return "bg-success/15 text-success";
  if (status === "blocked") return "bg-warning/15 text-warning";
  return "bg-muted text-muted-foreground";
}
