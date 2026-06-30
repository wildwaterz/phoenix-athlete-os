import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader, ProgressBar, Surface } from "@/components/app-shell";
import {
  currentMission,
  derivedMissions,
  missionCriteriaForMission,
  missionCriteriaProgress,
  setState,
  usePhoenix,
  type Mission,
  type MissionCriterion,
  type MissionCriterionState,
  type MissionId,
  type MissionStatus,
} from "@/lib/phoenix-data";
import { AlertTriangle, CheckCircle2, ChevronDown, Circle, Clock3, Lock } from "lucide-react";
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
      title: "Pending confirmation",
      missions: missions.filter((mission) => mission.status === "pending_confirmation"),
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
                {section.missions.map((m, idx) => {
                  const criteria = missionCriteriaForMission(s, m);
                  return (
                    <MissionCard
                      key={m.id}
                      mission={m}
                      criteria={criteria}
                      index={missionOrder.get(m.id) ?? idx}
                      active={m.id === activeMission.id}
                      onSetMission={setMission}
                    />
                  );
                })}
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
  criteria,
  index,
  active,
  onSetMission,
}: {
  mission: Mission;
  criteria: MissionCriterion[];
  index: number;
  active: boolean;
  onSetMission: (id: MissionId) => void;
}) {
  const criteriaSummary = missionCriteriaProgress(criteria);
  const remainingText =
    mission.status === "maintenance"
      ? "Monitoring: keep symptoms stable."
      : criteriaSummary.remainingText;
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
            mission.status === "pending_confirmation" && "bg-warning/15 text-warning",
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
            {active && mission.status === "pending_confirmation" && (
              <span className="rounded-full bg-warning/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-warning">
                Current
              </span>
            )}
          </div>
          <div className="mt-1 text-lg font-semibold tracking-tight">{mission.name}</div>
          <div className="text-sm text-muted-foreground">{mission.tagline}</div>
          <p className="mt-2 text-sm">{mission.objective}</p>

          <div className="mt-4">
            <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
              <span>Progress from criteria</span>
              <span className="font-medium text-foreground">
                {criteriaSummary.achieved} / {criteriaSummary.total} criteria met
              </span>
            </div>
            <ProgressBar value={mission.progress} />
            <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
              <span>{mission.progress}%</span>
              {criteriaSummary.pending > 0 && (
                <span className="text-warning">{criteriaSummary.pending} pending confirmation</span>
              )}
              {remainingText && (
                <span>
                  Remaining · <span className="text-foreground">{remainingText}</span>
                </span>
              )}
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {criteria.map((criterion) => (
              <MissionCriterionRow key={criterion.id} criterion={criterion} />
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span>
              Next unlock · <span className="text-foreground">{mission.nextUnlock}</span>
            </span>
            {(mission.status === "active" || mission.status === "pending_confirmation") &&
              !active && (
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

function MissionCriterionRow({ criterion }: { criterion: MissionCriterion }) {
  const Icon = criterionIcon(criterion.state);
  return (
    <details className="group rounded-lg border border-border/80 bg-background/35">
      <summary className="flex cursor-pointer list-none items-start gap-3 px-3 py-2.5 marker:hidden">
        <span
          className={cn(
            "mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border",
            criterionIconClass(criterion.state),
          )}
        >
          <Icon className="h-3.5 w-3.5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-foreground">{criterion.title}</span>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                criterionPillClass(criterion.state),
              )}
            >
              {criterionStateLabel(criterion.state)}
            </span>
            {criterion.requiredCount != null && criterion.currentCount != null && (
              <span className="text-[11px] text-muted-foreground">
                {Math.min(criterion.currentCount, criterion.requiredCount)} /{" "}
                {criterion.requiredCount}
              </span>
            )}
          </div>
          <div className="mt-0.5 text-xs text-muted-foreground">
            {criterion.evidenceSummary ?? criterion.remainingText ?? "No evidence recorded yet."}
          </div>
        </div>
        <ChevronDown className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition group-open:rotate-180" />
      </summary>
      <div className="border-t border-border/70 px-3 py-3 text-xs">
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <div className="font-medium uppercase tracking-[0.12em] text-muted-foreground">
              Evidence rule
            </div>
            <p className="mt-1 text-foreground">{criterion.evidenceRuleDescription}</p>
          </div>
          <div>
            <div className="font-medium uppercase tracking-[0.12em] text-muted-foreground">
              Current evidence
            </div>
            <p className="mt-1 text-foreground">
              {criterion.evidenceSummary ?? "No evidence recorded yet."}
            </p>
          </div>
          <div>
            <div className="font-medium uppercase tracking-[0.12em] text-muted-foreground">
              Last update
            </div>
            <p className="mt-1 text-foreground">{criterion.lastEvidenceDate ?? "Not recorded"}</p>
          </div>
          <div>
            <div className="font-medium uppercase tracking-[0.12em] text-muted-foreground">
              Source
            </div>
            <p className="mt-1 text-foreground">{formatSource(criterion.evidenceSource)}</p>
          </div>
        </div>
        {criterion.remainingText && (
          <div className="mt-3 rounded-md border border-border/80 bg-card/40 p-2 text-muted-foreground">
            Remaining · <span className="text-foreground">{criterion.remainingText}</span>
          </div>
        )}
      </div>
    </details>
  );
}

function statusLabel(status: MissionStatus): string {
  if (status === "maintenance") return "Maintenance";
  if (status === "complete") return "Complete";
  if (status === "pending_confirmation") return "Pending";
  if (status === "blocked") return "Blocked";
  if (status === "active") return "Active";
  return "Upcoming";
}

function statusPillClass(status: MissionStatus): string {
  if (status === "active") return "bg-phoenix/15 text-phoenix";
  if (status === "pending_confirmation") return "bg-warning/15 text-warning";
  if (status === "complete" || status === "maintenance") return "bg-success/15 text-success";
  if (status === "blocked") return "bg-warning/15 text-warning";
  return "bg-muted text-muted-foreground";
}

function criterionIcon(state: MissionCriterionState) {
  if (state === "achieved") return CheckCircle2;
  if (state === "pending_confirmation") return Clock3;
  if (state === "blocked") return AlertTriangle;
  if (state === "locked") return Lock;
  return Circle;
}

function criterionIconClass(state: MissionCriterionState): string {
  if (state === "achieved") return "border-success/40 bg-success/15 text-success";
  if (state === "pending_confirmation") return "border-warning/40 bg-warning/15 text-warning";
  if (state === "in_progress") return "border-phoenix/40 bg-phoenix/15 text-phoenix";
  if (state === "blocked") return "border-warning/40 bg-warning/15 text-warning";
  return "border-border bg-muted/40 text-muted-foreground";
}

function criterionPillClass(state: MissionCriterionState): string {
  if (state === "achieved") return "bg-success/15 text-success";
  if (state === "pending_confirmation") return "bg-warning/15 text-warning";
  if (state === "in_progress") return "bg-phoenix/15 text-phoenix";
  if (state === "blocked") return "bg-warning/15 text-warning";
  return "bg-muted text-muted-foreground";
}

function criterionStateLabel(state: MissionCriterionState): string {
  if (state === "achieved") return "Achieved";
  if (state === "pending_confirmation") return "Pending";
  if (state === "in_progress") return "In progress";
  if (state === "blocked") return "Blocked";
  if (state === "locked") return "Locked";
  return "Not started";
}

function formatSource(source: MissionCriterion["evidenceSource"]): string {
  if (source === "check_in") return "Check-in";
  if (source === "coach_import") return "Coach import";
  if (source === "task_response") return "Task response";
  if (source === "manual") return "Manual";
  if (source === "milestone") return "Milestone";
  return "Not assessed";
}
