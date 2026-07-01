import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, ProgressBar, Surface } from "@/components/app-shell";
import { CoachPacketDialog } from "@/components/coach-packet-dialog";
import { ImportCoachPlanDialog } from "@/components/import-coach-plan-dialog";
import { buildPacketMarkdown, type PacketKind } from "@/lib/coach-packet";
import {
  activeDailyCoachPlanForDate,
  archiveDailyCoachPlan,
  createRecoveryIqEvent,
  currentMission,
  currentPhaseN,
  dailyQuestsForDate,
  getEveningForDate,
  getLocalDateKey,
  type DailyQuest,
  type DailyCoachPlan,
  type CoachNote,
  type EveningCheckIn,
  type MorningCheckIn,
  type Mission,
  type Phase,
  daysPostOp,
  getMorningForDate,
  latestCoachNoteForDateAndPhase,
  METRIC_DEFINITIONS,
  milestoneWatchForDate,
  phaseForDate,
  previousMorning,
  readinessForDate,
  recoveryIqForState,
  recoveryIqXpForState,
  removeRecoveryIqEvent,
  setState,
  skillTestsForDate,
  todaysWinForDate,
  trendFor,
  updatePrescribedTaskCompletion,
  updateSkillTestResult,
  upsertRecoveryIqEvent,
  type MilestoneWatchItem,
  type MetricId,
  type PrescribedTask,
  type PrescribedTaskCompletionStatus,
  type SkillTest,
  usePhoenix,
} from "@/lib/phoenix-data";
import {
  Archive,
  ArrowLeft,
  ArrowRight as ArrowRightIcon,
  CalendarDays,
  CheckCircle2,
  Circle,
  Copy,
  Eye,
  Flame,
  RefreshCw,
  Sparkles,
  Trophy,
  Upload,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, type ReactNode } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard · Phoenix OS" },
      {
        name: "description",
        content: "Your Athlete OS dashboard — mission, recovery status, today's quests.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const s = usePhoenix();
  const mission = currentMission(s);
  const iq = recoveryIqForState(s);
  const recoveryIqXp = recoveryIqXpForState(s);
  const phaseN = currentPhaseN(s);

  const todayLocalDate = getLocalDateKey();
  const [selectedDate, setSelectedDate] = useState<string>(todayLocalDate);
  const [packetOpen, setPacketOpen] = useState<null | PacketKind>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [viewPlanOpen, setViewPlanOpen] = useState(false);
  const [copiedMorningPacket, setCopiedMorningPacket] = useState(false);
  const [copiedEveningPacket, setCopiedEveningPacket] = useState(false);
  const m = getMorningForDate(s, selectedDate);
  const evening = getEveningForDate(s, selectedDate);
  const prev = previousMorning(s, selectedDate);
  const phase = phaseForDate(s, selectedDate);
  const readiness = readinessForDate(s, selectedDate);
  const isToday = selectedDate === todayLocalDate;

  const shiftDate = (delta: number) => {
    const d = new Date(selectedDate + "T00:00:00");
    d.setDate(d.getDate() + delta);
    setSelectedDate(getLocalDateKey(d));
  };

  const dayOfWeek = new Date(selectedDate + "T00:00:00").toLocaleDateString(undefined, {
    weekday: "long",
  });
  const longDate = new Date(selectedDate + "T00:00:00").toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const dayPostOp = daysPostOp(s, selectedDate);
  const win = todaysWinForDate(s, selectedDate);
  const activePlan = activeDailyCoachPlanForDate(s, selectedDate);
  const latestCoachNote = latestCoachNoteForDateAndPhase(s, selectedDate);
  const quests = dailyQuestsForDate(s, selectedDate);
  const skillTests = skillTestsForDate(s, selectedDate);
  const milestoneWatch = milestoneWatchForDate(s, selectedDate);
  const primaryUnlock = milestoneWatch[0] ?? null;

  const copyMorningPacket = async () => {
    if (!m) return;
    try {
      await navigator.clipboard.writeText(buildPacketMarkdown("morning", s, selectedDate));
      setCopiedMorningPacket(true);
      setTimeout(() => setCopiedMorningPacket(false), 1500);
    } catch {
      /* ignore */
    }
  };
  const copyEveningPacket = async () => {
    if (!evening) return;
    try {
      await navigator.clipboard.writeText(buildPacketMarkdown("evening", s, selectedDate));
      setCopiedEveningPacket(true);
      setTimeout(() => setCopiedEveningPacket(false), 1500);
    } catch {
      /* ignore */
    }
  };

  const toggleQuest = (id: string) =>
    setState((prev) => {
      const dateQuests = dailyQuestsForDate(prev, selectedDate);
      const q = dateQuests.find((x) => x.id === id);
      if (!q || q.prescribedTasks?.length) return prev;

      const done = !q.done;
      const questCompletions = {
        ...(prev.questCompletions ?? {}),
        [selectedDate]: {
          ...(prev.questCompletions?.[selectedDate] ?? {}),
          [id]: done,
        },
      };

      return {
        ...prev,
        questCompletions,
        todayQuests:
          selectedDate === todayLocalDate
            ? dateQuests.map((quest) => (quest.id === id ? { ...quest, done } : quest))
            : prev.todayQuests,
        recoveryIqEvents: done
          ? upsertRecoveryIqEvent(
              prev.recoveryIqEvents,
              createRecoveryIqEvent({
                date: selectedDate,
                sourceType:
                  q.id === "morning-check-in" || q.id === "evening-check-in" ? "check_in" : "quest",
                sourceId:
                  q.id === "morning-check-in" || q.id === "evening-check-in"
                    ? `${q.id}:${selectedDate}`
                    : `quest:${selectedDate}:${id}`,
                title:
                  q.id === "morning-check-in" || q.id === "evening-check-in"
                    ? `${q.label} completed`
                    : "Quest completed",
                description: q.label,
                xpAmount: q.xp,
              }),
            )
          : removeRecoveryIqEvent(
              prev.recoveryIqEvents,
              q.id === "morning-check-in" || q.id === "evening-check-in" ? "check_in" : "quest",
              q.id === "morning-check-in" || q.id === "evening-check-in"
                ? `${q.id}:${selectedDate}`
                : `quest:${selectedDate}:${id}`,
            ),
      };
    });

  const optionalSkillQuests = quests.filter((q) => q.questType === "optional_skill_test");
  const planSkillTestIds = new Set((activePlan?.skillTests ?? []).map((test) => test.id));
  const optionalSkillMilestoneIds = new Set(
    optionalSkillQuests.map((quest) => quest.relatedMilestoneId).filter(Boolean),
  );
  const planSkillTests = activePlan
    ? skillTests.filter(
        (test) =>
          planSkillTestIds.has(test.id) ||
          Boolean(
            test.relatedMilestoneId && optionalSkillMilestoneIds.has(test.relatedMilestoneId),
          ),
      )
    : [];
  const mainQuests = quests.filter(
    (q) => q.kind === "main" && q.questType !== "optional_skill_test",
  );
  const sideQuests = quests.filter(
    (q) => q.kind === "side" && q.questType !== "optional_skill_test",
  );
  const workQuests = [...mainQuests, ...sideQuests, ...(activePlan ? optionalSkillQuests : [])];
  const readinessRing =
    readiness.state === "ready"
      ? "border-success/60 bg-success/5"
      : readiness.state === "modify" || readiness.state === "modify_positive"
        ? "border-warning/60 bg-warning/5"
        : "border-destructive/60 bg-destructive/5";
  const readinessText =
    readiness.state === "ready"
      ? "text-success"
      : readiness.state === "modify" || readiness.state === "modify_positive"
        ? "text-warning"
        : "text-destructive";
  const target = buildTodayTarget({
    activePlan,
    mission,
    phaseName: phase.name,
    primaryUnlock,
    quests,
    skillTests: planSkillTests,
  });
  const handleTaskStatusChange = (task: PrescribedTask, status: PrescribedTaskCompletionStatus) =>
    updatePrescribedTaskCompletion(selectedDate, task.id, {
      status,
      actualSets: status === "completed" ? task.prescription.sets : task.completion.actualSets,
      actualReps: status === "completed" ? task.prescription.reps : task.completion.actualReps,
      actualDurationMinutes:
        status === "completed"
          ? task.prescription.durationMinutes
          : task.completion.actualDurationMinutes,
    });

  return (
    <AppShell>
      {/* Contextual header */}
      <div className="mb-5 grid grid-cols-1 items-end gap-4 md:grid-cols-[1fr_auto]">
        <div className="min-w-0">
          <div className="mb-2 text-[11px] font-medium uppercase tracking-[0.18em] text-phoenix">
            Mission Control
          </div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Welcome back, {s.athleteName}.
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Day {dayPostOp} Post-Op · {dayOfWeek}, {longDate}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Current Campaign · <span className="text-foreground">{s.campaignName}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Compact Recovery IQ */}
          <div className="hidden min-w-[220px] rounded-xl border border-border bg-card/50 p-3 sm:block">
            <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Flame className="h-3 w-3 text-phoenix" /> Recovery IQ
              </span>
              <span className="text-foreground">Lvl {iq.level}</span>
            </div>
            <div className="mt-2">
              <ProgressBar value={iq.pct} />
              <div className="mt-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
                <span>{recoveryIqXp} XP</span>
                <span>{iq.toNext} to next</span>
              </div>
            </div>
          </div>
          <Link
            to="/check-in"
            className="hidden items-center gap-2 rounded-xl bg-gradient-phoenix px-4 py-2.5 text-sm font-medium text-phoenix-foreground shadow-phoenix transition hover:opacity-95 md:inline-flex"
          >
            <Sparkles className="h-4 w-4" />
            Daily check-in
          </Link>
        </div>
      </div>

      {/* Mobile Recovery IQ */}
      <div className="mb-4 rounded-xl border border-border bg-card/50 p-3 sm:hidden">
        <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Flame className="h-3 w-3 text-phoenix" /> Recovery IQ
          </span>
          <span className="text-foreground">
            Lvl {iq.level} · {recoveryIqXp} XP
          </span>
        </div>
        <div className="mt-2">
          <ProgressBar value={iq.pct} />
          <div className="mt-1 text-[11px] text-muted-foreground">{iq.toNext} XP to next level</div>
        </div>
      </div>

      {/* Persistent date selector */}
      <Popover>
        <Surface className="mb-5 p-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => shiftDate(-1)}
              aria-label="Previous day"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-border bg-background/40 text-muted-foreground transition hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>

            <PopoverTrigger asChild>
              <button
                type="button"
                aria-label="Open calendar"
                className="group flex flex-1 cursor-pointer items-center justify-between gap-3 rounded-xl border border-border bg-background/40 px-4 py-2 text-left transition hover:border-phoenix/60 hover:bg-accent/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-phoenix/60"
              >
                <div className="min-w-0">
                  <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                    {dayOfWeek}
                    {isToday && <span className="ml-2 text-phoenix">Today</span>}
                  </div>
                  <div className="text-sm font-semibold tracking-tight">{longDate}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-phoenix/10 px-2 py-0.5 text-[11px] font-medium text-phoenix">
                    Day {dayPostOp} Post-Op
                  </span>
                  <CalendarDays className="h-4 w-4 text-muted-foreground transition group-hover:text-foreground" />
                </div>
              </button>
            </PopoverTrigger>

            <button
              onClick={() => shiftDate(1)}
              aria-label="Next day"
              disabled={isToday}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-border bg-background/40 text-muted-foreground transition hover:text-foreground disabled:opacity-40"
            >
              <ArrowRightIcon className="h-4 w-4" />
            </button>
          </div>
          <PopoverContent className="w-auto p-0 pointer-events-auto" align="center">
            <Calendar
              mode="single"
              selected={new Date(selectedDate + "T00:00:00")}
              onSelect={(d) => d && setSelectedDate(getLocalDateKey(d))}
              disabled={(d) => d > new Date()}
              initialFocus
              className="pointer-events-auto p-3"
            />
          </PopoverContent>
          {!m && (
            <div className="mt-3 flex items-center justify-between rounded-lg border border-dashed border-border/80 bg-background/40 px-3 py-2 text-xs text-muted-foreground">
              <span>No check-in recorded for this day.</span>
              <Link to="/check-in" className="font-medium text-phoenix hover:underline">
                {isToday ? "Log check-in" : "Backfill →"}
              </Link>
            </div>
          )}
        </Surface>
      </Popover>

      <TodayTargetCard
        target={target}
        hasMorningCheckIn={Boolean(m)}
        copiedMorningPacket={copiedMorningPacket}
        onCopyMorningPacket={copyMorningPacket}
        onImportPlan={() => setImportOpen(true)}
        onViewPacket={() => setPacketOpen("morning")}
        onTaskStatusChange={handleTaskStatusChange}
        onSkillTestPass={(test) =>
          updateSkillTestResult(selectedDate, test.id, {
            completed: true,
            repsCompleted: test.testDose.reps,
            painDuring: test.result.painDuring ?? 0,
            painAfter: test.result.painAfter ?? 0,
            qualityScore: test.result.qualityScore ?? 4,
            lagObserved: false,
            feltControlled: true,
            irritation: false,
            swellingResponse: test.result.swellingResponse ?? "unknown",
            walkingResponse: test.result.walkingResponse ?? "unknown",
          })
        }
      />

      <TodayWorkCard
        quests={workQuests}
        skillTests={planSkillTests}
        activePlan={activePlan}
        onToggleQuest={toggleQuest}
        onTaskStatusChange={handleTaskStatusChange}
        onSkillTestPass={(test) =>
          updateSkillTestResult(selectedDate, test.id, {
            completed: true,
            repsCompleted: test.testDose.reps,
            painDuring: test.result.painDuring ?? 0,
            painAfter: test.result.painAfter ?? 0,
            qualityScore: test.result.qualityScore ?? 4,
            lagObserved: false,
            feltControlled: true,
            irritation: false,
            swellingResponse: test.result.swellingResponse ?? "unknown",
            walkingResponse: test.result.walkingResponse ?? "unknown",
          })
        }
      />

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <NextUnlockCard item={primaryUnlock} activePlan={activePlan} />
        <ReadinessSummaryCard
          readinessLabel={readiness.label}
          readinessText={readinessText}
          readinessRing={readinessRing}
          readinessSummary={readiness.summary}
          governor={primaryUnlock?.title ?? activePlan?.primaryFocus ?? mission.nextUnlock}
          morning={m}
          previousMorning={prev}
          evening={evening}
          phase={phase}
          todayWin={win}
        />
      </div>

      <div className="mt-4">
        <CoachToolsCard
          plan={activePlan}
          coachNote={latestCoachNote}
          hasMorningCheckIn={Boolean(m)}
          hasEveningCheckIn={Boolean(evening)}
          copiedMorningPacket={copiedMorningPacket}
          copiedEveningPacket={copiedEveningPacket}
          onCopyMorningPacket={copyMorningPacket}
          onCopyEveningPacket={copyEveningPacket}
          onImportPlan={() => setImportOpen(true)}
          onViewPacket={() => setPacketOpen("morning")}
          onViewEveningPacket={() => setPacketOpen("evening")}
          onViewPlan={() => setViewPlanOpen(true)}
          onArchivePlan={() => activePlan && archiveDailyCoachPlan(activePlan.id)}
        />
      </div>

      <Link
        to="/check-in"
        className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-gradient-phoenix px-4 py-3 text-sm font-medium text-phoenix-foreground shadow-phoenix md:hidden"
      >
        <Sparkles className="h-4 w-4" /> Daily check-in
      </Link>
      {packetOpen && (
        <CoachPacketDialog
          kind={packetOpen}
          date={selectedDate}
          onClose={() => setPacketOpen(null)}
        />
      )}
      {importOpen && (
        <ImportCoachPlanDialog selectedDate={selectedDate} onClose={() => setImportOpen(false)} />
      )}
      {viewPlanOpen && activePlan && (
        <CoachPlanDialog plan={activePlan} onClose={() => setViewPlanOpen(false)} />
      )}
    </AppShell>
  );
}

// ---------- local helpers ----------

function formatMetricValue(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

type TodayTarget = {
  title: string;
  label: string;
  sourceLabel: string;
  capability: string;
  why: string;
  doseHeading: string;
  doseTitle: string;
  doseLines: string[];
  passCriteria: string[];
  stopCriteria: string[];
  confirmationNeeded: string[];
  nextStepIfConfirmed: string;
  nextStepIfNotConfirmed: string;
  hasActivePlan: boolean;
  targetTask?: PrescribedTask;
  targetSkillTest?: SkillTest;
};

function buildTodayTarget({
  activePlan,
  mission,
  phaseName,
  primaryUnlock,
  quests,
  skillTests,
}: {
  activePlan: DailyCoachPlan | null;
  mission: Mission;
  phaseName: string;
  primaryUnlock: MilestoneWatchItem | null;
  quests: DailyQuest[];
  skillTests: SkillTest[];
}): TodayTarget {
  const targetTask = selectTargetTask(quests);
  const targetQuest = targetTask
    ? quests.find((quest) => quest.prescribedTasks?.some((task) => task.id === targetTask.id))
    : undefined;
  const targetSkillTest =
    skillTests.find((test) => test.status === "available" || test.status === "attempted") ??
    skillTests[0];

  if (!activePlan) {
    return {
      title: "Conservative baseline day",
      label: `${phaseName} · ${mission.name}`,
      sourceLabel: "No active coach plan",
      capability:
        primaryUnlock?.title != null
          ? `${primaryUnlock.title} remains the next possible unlock, not a required test today.`
          : mission.objective,
      why: "Without an imported Daily Coach Plan, Phoenix uses phase-safe defaults and does not add new progression tests.",
      doseHeading: "Conservative work",
      doseTitle: "Phase-safe defaults only",
      doseLines: [
        "Complete the morning baseline first.",
        "Use the conservative defaults in Today's Work.",
        "Do not add a new test dose unless a coach plan prescribes it.",
      ],
      passCriteria: ["Symptoms remain stable", "Walking does not worsen", "No sharp pain"],
      stopCriteria: ["Pain spike", "Instability", "Guarding", "Gait worsens"],
      confirmationNeeded: [
        "Evening response check-in",
        "Next-morning baseline before any progression",
        "Imported plan before a new test dose",
      ],
      nextStepIfConfirmed: primaryUnlock?.nextStepIfConfirmed ?? mission.nextUnlock,
      nextStepIfNotConfirmed:
        primaryUnlock?.nextStepIfNotConfirmed ??
        "Keep the day conservative and generate a coach packet.",
      hasActivePlan: false,
    };
  }

  const doseTitle = targetTask?.title ?? targetSkillTest?.title ?? activePlan.primaryFocus;
  const doseLines = targetTask
    ? prescriptionLines(targetTask)
    : targetSkillTest
      ? [skillTestDoseLine(targetSkillTest)]
      : activePlan.targets.length > 0
        ? activePlan.targets.map((target) => `${target.label}: ${target.value}`)
        : ["No exact dose was included for the primary target. Use Today's Work prescriptions."];
  const doseHeading = targetTask
    ? targetTask.taskIntent === "test" || targetTask.category === "skill_test"
      ? "Today's exact test"
      : "Today's exact dose"
    : targetSkillTest
      ? "Today's exact test"
      : "Today's exact target";

  return {
    title: mission.name,
    label: `${phaseName} · ${mission.name}`,
    sourceLabel: "Generated from active Coach Plan",
    capability: targetCapability(mission, primaryUnlock),
    why: mission.why,
    doseHeading,
    doseTitle,
    doseLines,
    passCriteria: uniqueLines([
      targetTask?.prescription.qualityTarget,
      ...(targetQuest?.details ?? []),
      ...(targetSkillTest?.passCriteria ?? []),
      ...(primaryUnlock?.unlockCriteria ?? []),
    ]).slice(0, 5),
    stopCriteria: uniqueLines([
      ...(targetTask?.stopRules ?? []),
      ...(targetSkillTest?.stopRules ?? []),
      ...(activePlan.stopRules ?? []),
    ]).slice(0, 5),
    confirmationNeeded: uniqueLines([
      ...(activePlan.eveningCheckInFocus ?? []),
      ...(primaryUnlock?.unlockCriteria ?? []),
    ]).slice(0, 5),
    nextStepIfConfirmed: primaryUnlock?.nextStepIfConfirmed ?? activePlan.nextReassessment,
    nextStepIfNotConfirmed:
      primaryUnlock?.nextStepIfNotConfirmed ??
      "Repeat or reduce the dose until the response is stable.",
    hasActivePlan: true,
    targetTask,
    targetSkillTest: targetTask ? undefined : targetSkillTest,
  };
}

function selectTargetTask(quests: DailyQuest[]): PrescribedTask | undefined {
  const tasks = quests.flatMap((quest) => quest.prescribedTasks ?? []);
  const executionTasks = tasks.filter(
    (task) =>
      ![
        "check_in_morning",
        "check_in_evening",
        "recovery_basics",
        "nutrition",
        "hydration",
        "sleep",
        "swelling_management",
      ].includes(task.category),
  );
  return (
    executionTasks.find(
      (task) =>
        task.taskIntent === "test" ||
        task.category === "skill_test" ||
        task.title.toLowerCase().includes("weight shift") ||
        task.title.toLowerCase().includes("weight-shift"),
    ) ??
    executionTasks.find((task) => task.taskPriority === "required" && task.category === "gait") ??
    executionTasks.find(
      (task) => task.taskPriority === "required" && task.category === "walking",
    ) ??
    executionTasks.find((task) => task.taskPriority === "required") ??
    executionTasks[0] ??
    tasks[0]
  );
}

function targetCapability(mission: Mission, primaryUnlock: MilestoneWatchItem | null): string {
  const unlockTitle = primaryUnlock?.title.toLowerCase() ?? "";
  if (unlockTitle.includes("weight-shift") || unlockTitle.includes("weight shift")) {
    return "Can the knee accept gentle weight through the surgical leg without compensation?";
  }
  if (primaryUnlock) return `Can the knee demonstrate ${primaryUnlock.title.toLowerCase()} safely?`;
  return mission.objective;
}

function uniqueLines(values: Array<string | undefined | null>): string[] {
  const seen = new Set<string>();
  return values
    .map((value) => value?.trim())
    .filter((value): value is string => Boolean(value))
    .filter((value) => {
      const key = value.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function TodayTargetCard({
  target,
  hasMorningCheckIn,
  copiedMorningPacket,
  onCopyMorningPacket,
  onImportPlan,
  onViewPacket,
  onTaskStatusChange,
  onSkillTestPass,
}: {
  target: TodayTarget;
  hasMorningCheckIn: boolean;
  copiedMorningPacket: boolean;
  onCopyMorningPacket: () => void;
  onImportPlan: () => void;
  onViewPacket: () => void;
  onTaskStatusChange: (task: PrescribedTask, status: PrescribedTaskCompletionStatus) => void;
  onSkillTestPass: (test: SkillTest) => void;
}) {
  return (
    <Surface className="mb-4 overflow-hidden p-0">
      <div className="relative p-5 md:p-6">
        <div
          className="absolute inset-0 -z-10 opacity-30"
          style={{
            background:
              "radial-gradient(620px 220px at 82% 0%, var(--color-phoenix-glow), transparent 62%)",
          }}
        />
        <div className="flex flex-wrap items-center gap-2">
          <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-phoenix">
            Today's Target
          </div>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
              target.hasActivePlan ? "bg-phoenix/15 text-phoenix" : "bg-warning/15 text-warning",
            )}
          >
            {target.sourceLabel}
          </span>
        </div>
        <div className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">{target.title}</div>
        <div className="mt-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">
          {target.label}
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-xl border border-border/80 bg-background/40 p-4">
            <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Capability being tested
            </div>
            <div className="mt-1 text-sm text-foreground">{target.capability}</div>
            <div className="mt-3 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Why it matters
            </div>
            <div className="mt-1 text-sm text-foreground">{target.why}</div>
          </div>

          <div className="rounded-xl border border-phoenix/30 bg-phoenix/5 p-4">
            <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-phoenix">
              {target.doseHeading}
            </div>
            <div className="mt-1 text-sm font-semibold">{target.doseTitle}</div>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              {target.doseLines.map((line) => (
                <li key={line}>- {line}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <TargetList title="Pass criteria" lines={target.passCriteria} />
          <TargetList title="Stop criteria" lines={target.stopCriteria} warning />
          <TargetList title="Confirmation needed" lines={target.confirmationNeeded} />
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <OutcomeBox label="If confirmed" value={target.nextStepIfConfirmed} />
          <OutcomeBox label="If not confirmed" value={target.nextStepIfNotConfirmed} />
        </div>
        <TargetActionPanel
          target={target}
          hasMorningCheckIn={hasMorningCheckIn}
          copiedMorningPacket={copiedMorningPacket}
          onCopyMorningPacket={onCopyMorningPacket}
          onImportPlan={onImportPlan}
          onViewPacket={onViewPacket}
          onTaskStatusChange={onTaskStatusChange}
          onSkillTestPass={onSkillTestPass}
        />
      </div>
    </Surface>
  );
}

function TargetActionPanel({
  target,
  hasMorningCheckIn,
  copiedMorningPacket,
  onCopyMorningPacket,
  onImportPlan,
  onViewPacket,
  onTaskStatusChange,
  onSkillTestPass,
}: {
  target: TodayTarget;
  hasMorningCheckIn: boolean;
  copiedMorningPacket: boolean;
  onCopyMorningPacket: () => void;
  onImportPlan: () => void;
  onViewPacket: () => void;
  onTaskStatusChange: (task: PrescribedTask, status: PrescribedTaskCompletionStatus) => void;
  onSkillTestPass: (test: SkillTest) => void;
}) {
  if (!target.hasActivePlan) {
    return (
      <div className="mt-4 rounded-xl border border-warning/30 bg-warning/5 p-4">
        <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-warning">
          Make this actionable
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          The dashboard will not ask you to pass or fail a target until a Daily Coach Plan
          prescribes the test or dose. For now, complete Today&apos;s Work and import a plan when
          you want the next step prescribed.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={onCopyMorningPacket}
            disabled={!hasMorningCheckIn}
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background/40 px-3 py-2 text-sm font-medium transition hover:bg-accent",
              !hasMorningCheckIn && "cursor-not-allowed opacity-50 hover:bg-background/40",
            )}
          >
            <Copy className="h-4 w-4" /> {copiedMorningPacket ? "Copied" : "Copy Morning Packet"}
          </button>
          <button
            onClick={onImportPlan}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-phoenix px-3 py-2 text-sm font-medium text-phoenix-foreground shadow-phoenix"
          >
            <Upload className="h-4 w-4" /> Import Coach Plan
          </button>
          <button
            onClick={onViewPacket}
            disabled={!hasMorningCheckIn}
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background/40 px-3 py-2 text-sm font-medium transition hover:bg-accent",
              !hasMorningCheckIn && "cursor-not-allowed opacity-50 hover:bg-background/40",
            )}
          >
            <Eye className="h-4 w-4" /> View Packet
          </button>
        </div>
      </div>
    );
  }

  if (target.targetTask) {
    const status = target.targetTask.completion.status;
    return (
      <div className="mt-4 rounded-xl border border-phoenix/30 bg-background/40 p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-phoenix">
              Record target result
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              This updates the same prescribed task shown in Today&apos;s Work. Use Evening Check-In
              to record tolerance and delayed response.
            </p>
          </div>
          <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            {formatMetricValue(status)}
          </span>
        </div>
        <TargetTaskControls
          task={target.targetTask}
          onStatusChange={(status) => onTaskStatusChange(target.targetTask!, status)}
        />
        <Link
          to="/check-in"
          className="mt-3 inline-flex items-center gap-2 text-xs font-medium text-phoenix hover:underline"
        >
          Record response details in Evening Check-In
        </Link>
      </div>
    );
  }

  if (target.targetSkillTest) {
    return (
      <div className="mt-4 rounded-xl border border-warning/30 bg-warning/5 p-4">
        <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-warning">
          Record skill test
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Passing a test dose marks it pending confirmation. The milestone still needs evening and
          next-morning response before it becomes doseable.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => target.targetSkillTest && onSkillTestPass(target.targetSkillTest)}
            disabled={target.targetSkillTest.status === "passed_pending_confirmation"}
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-xl border border-warning/50 px-3 py-2 text-sm font-medium text-warning transition hover:bg-warning/10",
              target.targetSkillTest.status === "passed_pending_confirmation" &&
                "cursor-not-allowed opacity-50",
            )}
          >
            <CheckCircle2 className="h-4 w-4" /> Passed test dose
          </button>
          <Link
            to="/check-in"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background/40 px-3 py-2 text-sm font-medium transition hover:bg-accent"
          >
            Record details
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-xl border border-border bg-background/40 p-4 text-sm text-muted-foreground">
      Use Today&apos;s Work to complete the prescribed tasks, then record response details in
      Evening Check-In.
    </div>
  );
}

function TargetTaskControls({
  task,
  onStatusChange,
}: {
  task: PrescribedTask;
  onStatusChange: (status: PrescribedTaskCompletionStatus) => void;
}) {
  const status = task.completion.status;
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {(
        [
          ["completed", "Done"],
          ["partial", "Partial"],
          ["skipped", "Skip"],
        ] as const
      ).map(([value, label]) => (
        <button
          key={value}
          type="button"
          onClick={() => onStatusChange(status === value ? "not_started" : value)}
          className={cn(
            "inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition",
            status === value
              ? "border-phoenix bg-phoenix/15 text-phoenix"
              : "border-border bg-background/40 text-muted-foreground hover:bg-accent hover:text-foreground",
          )}
        >
          {value === "completed" ? <CheckCircle2 className="h-4 w-4" /> : null}
          {label}
        </button>
      ))}
    </div>
  );
}

function TargetList({
  title,
  lines,
  warning = false,
}: {
  title: string;
  lines: string[];
  warning?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border/80 bg-background/40 p-3">
      <div
        className={cn(
          "text-[10px] font-medium uppercase tracking-[0.16em]",
          warning ? "text-warning" : "text-muted-foreground",
        )}
      >
        {title}
      </div>
      <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
        {(lines.length ? lines : ["Not specified."]).map((line) => (
          <li key={line}>- {line}</li>
        ))}
      </ul>
    </div>
  );
}

function OutcomeBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/80 bg-background/40 p-3">
      <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 text-sm text-foreground">{value || "Not specified."}</div>
    </div>
  );
}

function swellingLevel(m: MorningCheckIn | null | undefined) {
  if (!m) return undefined;
  return m.swellingLevel ?? m.swelling;
}

function metricTone(
  metricId: MetricId,
  value: number | undefined,
): "default" | "good" | "watch" | "alert" {
  if (value == null) return "default";
  if (metricId === "pain") return value <= 3 ? "good" : value <= 4 ? "watch" : "alert";
  if (metricId === "swelling-level") return value <= 2 ? "good" : value <= 4 ? "watch" : "alert";
  if (metricId === "walking-confidence" || metricId === "movement-quality")
    return value >= 4 ? "good" : value >= 3 ? "watch" : "alert";
  if (
    metricId === "quad-activation-quality" ||
    metricId === "training-readiness" ||
    metricId === "sport-confidence"
  )
    return value >= 4 ? "good" : value >= 3 ? "watch" : "alert";
  return "default";
}

function TodayWorkCard({
  quests,
  skillTests,
  activePlan,
  onToggleQuest,
  onTaskStatusChange,
  onSkillTestPass,
}: {
  quests: DailyQuest[];
  skillTests: SkillTest[];
  activePlan: DailyCoachPlan | null;
  onToggleQuest: (id: string) => void;
  onTaskStatusChange: (task: PrescribedTask, status: PrescribedTaskCompletionStatus) => void;
  onSkillTestPass: (test: SkillTest) => void;
}) {
  return (
    <Surface className="p-4 md:p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-phoenix">
            Today's Work
          </div>
          <div className="mt-1 text-sm text-muted-foreground">What exactly do I do?</div>
        </div>
        <span className="rounded-full bg-background/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {activePlan ? "Generated from active Coach Plan" : "Conservative defaults"}
        </span>
      </div>

      {quests.length === 0 ? (
        <div className="rounded-xl border border-border bg-background/40 p-3 text-sm text-muted-foreground">
          No work generated for this date.
        </div>
      ) : (
        <ul className="space-y-2">
          {quests.map((quest) => (
            <QuestRow
              key={quest.id}
              q={quest}
              onToggle={() => onToggleQuest(quest.id)}
              onTaskStatusChange={(task, status) => onTaskStatusChange(task, status)}
            />
          ))}
        </ul>
      )}

      {skillTests.length > 0 && (
        <div className="mt-4">
          <div className="mb-2 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-warning" /> Optional / Testable
          </div>
          <div className="space-y-2">
            {skillTests.map((test) => (
              <SkillTestCard key={test.id} test={test} onPass={() => onSkillTestPass(test)} />
            ))}
          </div>
        </div>
      )}
    </Surface>
  );
}

function NextUnlockCard({
  item,
  activePlan,
}: {
  item: MilestoneWatchItem | null;
  activePlan: DailyCoachPlan | null;
}) {
  return (
    <Surface className="p-4 md:p-5">
      <div className="mb-3">
        <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-phoenix">
          <Trophy className="h-3.5 w-3.5" /> Next Unlock
        </div>
        <div className="mt-1 text-sm text-muted-foreground">
          The next capability that may become doseable.
        </div>
      </div>
      {!item ? (
        <div className="rounded-xl border border-border bg-background/40 p-3 text-sm text-muted-foreground">
          No pending unlocks for this date.
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <div className="text-xl font-semibold tracking-tight">{item.title}</div>
            <div className="mt-1 inline-flex rounded-full bg-warning/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-warning">
              {item.statusLabel}
            </div>
          </div>
          <div className="rounded-xl border border-border/80 bg-background/40 p-3">
            <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Needs
            </div>
            <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
              {item.unlockCriteria.map((line) => (
                <li key={line}>- {line}</li>
              ))}
            </ul>
          </div>
          {item.evidence.length > 0 && (
            <div className="rounded-xl border border-border/80 bg-background/40 p-3">
              <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                Current evidence
              </div>
              <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                {item.evidence.slice(0, 3).map((line) => (
                  <li key={line}>- {line}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="grid gap-2 text-xs text-muted-foreground">
            <div>
              <span className="text-foreground">If confirmed: </span>
              {item.nextStepIfConfirmed}
            </div>
            <div>
              <span className="text-foreground">If not confirmed: </span>
              {item.nextStepIfNotConfirmed}
            </div>
          </div>
          <div className="rounded-xl border border-border/80 bg-background/40 p-3">
            <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Where this is managed
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Milestones are confirmed from check-ins, task responses, and imported milestone
              evidence. This card shows the next unlock; it does not unlock training by itself.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                to="/milestones"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background/40 px-3 py-2 text-xs font-medium transition hover:bg-accent"
              >
                Manage Milestones
              </Link>
              <Link
                to="/check-in"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background/40 px-3 py-2 text-xs font-medium transition hover:bg-accent"
              >
                Record Response
              </Link>
            </div>
            {!activePlan && (
              <div className="mt-2 text-xs text-warning">
                Import a Daily Coach Plan before making this a required task.
              </div>
            )}
          </div>
        </div>
      )}
    </Surface>
  );
}

function ReadinessSummaryCard({
  readinessLabel,
  readinessText,
  readinessRing,
  readinessSummary,
  governor,
  morning,
  previousMorning,
  evening,
  phase,
  todayWin,
}: {
  readinessLabel: string;
  readinessText: string;
  readinessRing: string;
  readinessSummary: string;
  governor: string;
  morning: MorningCheckIn | null;
  previousMorning: MorningCheckIn | null;
  evening: EveningCheckIn | null;
  phase: Phase;
  todayWin: { label: string; detail: string };
}) {
  const swelling = swellingLevel(morning);
  const walking = morning
    ? `${morning.walkingConfidence}/5${
        morning.gaitQuality ? ` · gait ${formatMetricValue(morning.gaitQuality)}` : ""
      }`
    : "Not logged";
  const detailsMetrics = [...phase.primaryMetrics, ...phase.supportingMetrics].filter(
    (metricId, index, list) => list.indexOf(metricId) === index,
  );

  return (
    <Surface className={cn("border p-4 md:p-5", readinessRing)}>
      <div className="mb-3">
        <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Readiness Summary
        </div>
        <div className={cn("mt-1 text-2xl font-bold tracking-tight uppercase", readinessText)}>
          {readinessLabel}
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{readinessSummary}</p>
      </div>

      <div className="grid gap-2 text-sm sm:grid-cols-2">
        <ReadinessLine label="Governor" value={governor} />
        <ReadinessLine label="Pain" value={morning ? `${morning.pain}/10` : "Not logged"} />
        <ReadinessLine
          label="Swelling"
          value={
            swelling == null
              ? "Not logged"
              : `${swelling}/10${morning?.swellingTrend ? `, ${morning.swellingTrend}` : ""}`
          }
        />
        <ReadinessLine
          label="Extension"
          value={
            morning?.extensionStatus ? formatMetricValue(morning.extensionStatus) : "Not logged"
          }
        />
        <ReadinessLine
          label="Flexion"
          value={morning?.flexionStatus ? formatMetricValue(morning.flexionStatus) : "Not logged"}
        />
        <ReadinessLine label="Walking / gait" value={walking} />
      </div>

      <div className="mt-3 rounded-xl border border-border/80 bg-background/40 p-3 text-xs text-muted-foreground">
        <span className="text-foreground">{todayWin.label}</span> · {todayWin.detail}
      </div>

      <details className="mt-3">
        <summary className="cursor-pointer text-xs font-medium text-phoenix hover:underline">
          View details
        </summary>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {detailsMetrics.map((metricId) => (
            <ReadinessMetricDetail
              key={metricId}
              metricId={metricId}
              morning={morning}
              previousMorning={previousMorning}
              evening={evening}
            />
          ))}
        </div>
      </details>
    </Surface>
  );
}

function ReadinessLine({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-lg border border-border/80 bg-background/40 p-2.5">
      <div className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 text-foreground">{value}</div>
    </div>
  );
}

function ReadinessMetricDetail({
  metricId,
  morning,
  previousMorning,
  evening,
}: {
  metricId: MetricId;
  morning: MorningCheckIn | null;
  previousMorning: MorningCheckIn | null;
  evening: EveningCheckIn | null;
}) {
  const metric = metricSnapshot(metricId, morning, previousMorning, evening);
  return (
    <div className="rounded-lg border border-border/80 bg-background/40 p-2.5">
      <div className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
        {metric.label}
      </div>
      <div className={cn("mt-1 text-sm font-medium", metric.toneClass)}>{metric.value}</div>
      <div className="mt-0.5 text-[11px] text-muted-foreground">{metric.hint}</div>
    </div>
  );
}

function metricSnapshot(
  metricId: MetricId,
  morning: MorningCheckIn | null,
  previousMorning: MorningCheckIn | null,
  evening: EveningCheckIn | null,
) {
  const metric = METRIC_DEFINITIONS[metricId];
  const toneClass = (tone: "default" | "good" | "watch" | "alert" = "default") =>
    tone === "good"
      ? "text-success"
      : tone === "watch"
        ? "text-warning"
        : tone === "alert"
          ? "text-destructive"
          : "text-foreground";

  switch (metricId) {
    case "pain":
      return {
        label: metric.label,
        value: morning ? `${morning.pain}/10` : "—",
        hint: compactTrend(morning?.pain, previousMorning?.pain, "lower-better"),
        toneClass: toneClass(metricTone(metricId, morning?.pain)),
      };
    case "swelling-level": {
      const current = swellingLevel(morning);
      const previous = swellingLevel(previousMorning);
      return {
        label: metric.label,
        value: current != null ? `${current}/10` : "—",
        hint: compactTrend(current, previous, "lower-better"),
        toneClass: toneClass(metricTone(metricId, current)),
      };
    }
    case "walking-confidence":
      return {
        label: metric.label,
        value: morning ? `${morning.walkingConfidence}/5` : "—",
        hint: compactTrend(
          morning?.walkingConfidence,
          previousMorning?.walkingConfidence,
          "higher-better",
        ),
        toneClass: toneClass(metricTone(metricId, morning?.walkingConfidence)),
      };
    case "movement-quality":
      return {
        label: metric.label,
        value: morning?.movementQuality != null ? `${morning.movementQuality}/5` : "—",
        hint: compactTrend(
          morning?.movementQuality,
          previousMorning?.movementQuality,
          "higher-better",
        ),
        toneClass: toneClass(metricTone(metricId, morning?.movementQuality)),
      };
    case "quad-activation-quality":
      return {
        label: metric.label,
        value: evening?.quadActivationQuality != null ? `${evening.quadActivationQuality}/5` : "—",
        hint: "Evening response",
        toneClass: toneClass(metricTone(metricId, evening?.quadActivationQuality)),
      };
    case "flexion-status":
      return {
        label: metric.label,
        value: morning?.flexionStatus ? formatMetricValue(morning.flexionStatus) : "—",
        hint: "Morning baseline",
        toneClass: "text-foreground",
      };
    case "sleep-hours":
      return {
        label: metric.label,
        value: morning ? `${morning.sleepHours}h` : "—",
        hint: compactTrend(morning?.sleepHours, previousMorning?.sleepHours, "higher-better"),
        toneClass: "text-foreground",
      };
    case "training-readiness":
      return {
        label: metric.label,
        value: morning?.trainingReadiness != null ? `${morning.trainingReadiness}/5` : "—",
        hint: compactTrend(
          morning?.trainingReadiness,
          previousMorning?.trainingReadiness,
          "higher-better",
        ),
        toneClass: toneClass(metricTone(metricId, morning?.trainingReadiness)),
      };
    case "sport-confidence":
      return {
        label: metric.label,
        value: morning?.sportConfidence != null ? `${morning.sportConfidence}/5` : "—",
        hint: compactTrend(
          morning?.sportConfidence,
          previousMorning?.sportConfidence,
          "higher-better",
        ),
        toneClass: toneClass(metricTone(metricId, morning?.sportConfidence)),
      };
    case "swelling-trend": {
      const trend = morning?.swellingTrend ?? "unknown";
      return {
        label: metric.label,
        value: formatMetricValue(trend),
        hint: "Morning context",
        toneClass: toneClass(
          trend === "improved" ? "good" : trend === "worse" ? "alert" : "default",
        ),
      };
    }
    case "extension-status":
      return {
        label: metric.label,
        value: morning?.extensionStatus ? formatMetricValue(morning.extensionStatus) : "—",
        hint: "Morning baseline",
        toneClass: "text-foreground",
      };
    case "protein-target":
      return {
        label: metric.label,
        value: morning ? `${morning.proteinTargetG}g` : "—",
        hint: "Daily target",
        toneClass: "text-foreground",
      };
    case "session-tolerance": {
      const reactive = evening && (evening.painAfter >= 5 || evening.swellingChange >= 2);
      const stable = evening && evening.painAfter <= 3 && evening.swellingChange <= 0;
      return {
        label: metric.label,
        value: !evening ? "—" : stable ? "Stable" : reactive ? "Reactive" : "Monitor",
        hint: "Evening response",
        toneClass: toneClass(!evening ? "default" : stable ? "good" : reactive ? "alert" : "watch"),
      };
    }
    case "next-morning-response": {
      const trend = morning?.swellingTrend ?? "unknown";
      return {
        label: metric.label,
        value: trend === "worse" ? "Reactive" : trend === "unknown" ? "—" : "Stable",
        hint: "Based on swelling trend",
        toneClass: toneClass(
          trend === "worse" ? "alert" : trend === "unknown" ? "default" : "good",
        ),
      };
    }
  }
}

function compactTrend(
  current: number | undefined,
  previous: number | undefined,
  direction: "lower-better" | "higher-better",
): string {
  const { trend, delta } = trendFor(current, previous, direction);
  if (trend === "none") return "No prior data";
  if (trend === "flat") return "No change";
  return `${trend === "up" ? "Improved" : "Worse"} ${delta > 0 ? "+" : "-"}${Math.abs(delta)}`;
}

function QuestRow({
  q,
  onToggle,
  onTaskStatusChange,
}: {
  q: DailyQuest;
  onToggle: () => void;
  onTaskStatusChange: (task: PrescribedTask, status: PrescribedTaskCompletionStatus) => void;
}) {
  if (q.prescribedTasks?.length) {
    return (
      <li
        className={cn(
          "rounded-xl border border-border bg-background/40 px-3 py-2.5",
          q.done && "opacity-80",
        )}
      >
        <details>
          <summary className="cursor-pointer list-none">
            <div className="flex items-center gap-3">
              {q.done ? (
                <CheckCircle2 className="h-5 w-5 text-success" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground" />
              )}
              <span className="min-w-0 flex-1">
                <span className={cn("block text-sm", q.done && "text-muted-foreground")}>
                  {q.label}
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                  {questPrescriptionSummary(q)}
                </span>
              </span>
              <span
                className={cn(
                  "rounded-md px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.14em]",
                  q.kind === "side"
                    ? "bg-muted text-muted-foreground"
                    : "bg-phoenix/10 text-phoenix",
                )}
              >
                +{q.xp} XP
              </span>
            </div>
          </summary>
          <div className="mt-3 space-y-3 border-t border-border/70 pt-3">
            <div className="text-xs leading-relaxed text-muted-foreground">{q.reason}</div>
            {q.prescribedTasks.map((task) => (
              <PrescribedTaskRow
                key={task.id}
                task={task}
                onStatusChange={(status) => onTaskStatusChange(task, status)}
              />
            ))}
          </div>
        </details>
      </li>
    );
  }

  return (
    <li>
      <button
        onClick={onToggle}
        title={q.reason}
        aria-label={`${q.label}. ${q.reason}`}
        className={cn(
          "flex w-full items-center gap-3 rounded-xl border border-border bg-background/40 px-3 py-3 text-left transition hover:bg-accent/60",
          q.done && "opacity-70",
        )}
      >
        {q.done ? (
          <CheckCircle2 className="h-5 w-5 text-success" />
        ) : (
          <Circle className="h-5 w-5 text-muted-foreground" />
        )}
        <span className="min-w-0 flex-1">
          <span className={cn("block text-sm", q.done && "line-through text-muted-foreground")}>
            {q.label}
          </span>
          {q.details && q.details.length > 0 && (
            <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
              {q.details.join(" · ")}
            </span>
          )}
        </span>
        <span
          className={cn(
            "rounded-md px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.14em]",
            q.kind === "side" ? "bg-muted text-muted-foreground" : "bg-phoenix/10 text-phoenix",
          )}
        >
          +{q.xp} XP
        </span>
      </button>
    </li>
  );
}

function questPrescriptionSummary(q: DailyQuest): string {
  const tasks = q.prescribedTasks ?? [];
  if (tasks.length === 0) return q.details?.join(" · ") || q.reason;
  const summary = tasks.slice(0, 2).map((task) => compactTaskDose(task));
  const suffix = tasks.length > 2 ? ` +${tasks.length - 2} more` : "";
  return `${summary.join(" · ")}${suffix}`;
}

function compactTaskDose(task: PrescribedTask): string {
  const p = task.prescription;
  const dose: string[] = [];
  if (p.sets && p.reps) dose.push(`${p.sets}x${p.reps}`);
  else {
    if (p.sets) dose.push(`${p.sets} sets`);
    if (p.reps) dose.push(`${p.reps} reps`);
  }
  if (p.holdSeconds) dose.push(`${p.holdSeconds}s holds`);
  if (p.durationMinutes) dose.push(`${p.durationMinutes} min`);
  return [task.title, dose.join(", ")].filter(Boolean).join(" - ");
}

function PrescribedTaskRow({
  task,
  onStatusChange,
}: {
  task: PrescribedTask;
  onStatusChange: (status: PrescribedTaskCompletionStatus) => void;
}) {
  const status = task.completion.status;
  return (
    <div className="rounded-lg border border-border/80 bg-card/40 p-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-medium">{task.title}</div>
          <div className="mt-1 space-y-1 text-xs leading-relaxed text-muted-foreground">
            {prescriptionLines(task).map((line) => (
              <div key={line}>{line}</div>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(
            [
              ["completed", "Done"],
              ["partial", "Partial"],
              ["skipped", "Skip"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => onStatusChange(status === value ? "not_started" : value)}
              className={cn(
                "rounded-md border px-2 py-1 text-[11px] font-medium transition",
                status === value
                  ? "border-phoenix bg-phoenix/15 text-phoenix"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      {task.stopRules.length > 0 && (
        <div className="mt-2 text-xs leading-relaxed text-warning">
          Stop: {task.stopRules.join(" · ")}
        </div>
      )}
    </div>
  );
}

function SkillTestCard({ test, onPass }: { test: SkillTest; onPass: () => void }) {
  const disabled = test.status === "deferred" || test.status === "passed_pending_confirmation";
  return (
    <div className="rounded-xl border border-warning/30 bg-warning/5 px-3 py-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-medium">{test.title}</div>
          <div className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {test.description}
          </div>
          <div className="mt-2 space-y-1 text-xs text-muted-foreground">
            <div>{skillTestDoseLine(test)}</div>
            {test.passCriteria.length > 0 && <div>Pass: {test.passCriteria.join(" · ")}</div>}
            {test.stopRules.length > 0 && (
              <div className="text-warning">Stop: {test.stopRules.join(" · ")}</div>
            )}
          </div>
        </div>
        <span className="rounded-md bg-background/60 px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.14em] text-warning">
          {formatSkillTestStatus(test.status)}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onPass}
          disabled={disabled}
          className={cn(
            "rounded-md border px-2.5 py-1.5 text-[11px] font-medium transition",
            disabled
              ? "cursor-not-allowed border-border text-muted-foreground opacity-50"
              : "border-warning/50 text-warning hover:bg-warning/10",
          )}
        >
          Passed test dose
        </button>
        <Link to="/check-in" className="text-xs font-medium text-phoenix hover:underline">
          Record details
        </Link>
      </div>
      {test.result.attemptedAt && (
        <div className="mt-2 text-xs text-muted-foreground">
          Result: {formatSkillTestResult(test)}
        </div>
      )}
    </div>
  );
}

function prescriptionLines(task: PrescribedTask): string[] {
  const p = task.prescription;
  const dose: string[] = [];
  if (p.sets) dose.push(`${p.sets} sets`);
  if (p.reps) dose.push(`${p.reps} reps`);
  if (p.holdSeconds) dose.push(`${p.holdSeconds}s holds`);
  if (p.durationMinutes) dose.push(`${p.durationMinutes} min`);
  const lines = [dose.join(" · ")].filter(Boolean);
  if (p.frequency) lines.push(p.frequency);
  if (p.effortTarget) lines.push(`Effort: ${p.effortTarget}`);
  if (p.rangeInstruction) lines.push(p.rangeInstruction);
  if (p.qualityTarget) lines.push(`Goal: ${p.qualityTarget}`);
  return lines.length ? lines : ["Complete as prescribed."];
}

function skillTestDoseLine(test: SkillTest): string {
  const dose: string[] = [];
  if (test.testDose.sets)
    dose.push(`${test.testDose.sets} set${test.testDose.sets === 1 ? "" : "s"}`);
  if (test.testDose.reps) dose.push(`${test.testDose.reps} reps`);
  if (test.testDose.duration) dose.push(test.testDose.duration);
  return [dose.join(" · "), test.testDose.instructions].filter(Boolean).join(" · ");
}

function formatSkillTestStatus(status: string) {
  return status
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatSkillTestResult(test: SkillTest) {
  const result = test.result;
  const parts = [
    test.status,
    result.repsCompleted == null ? "" : `${result.repsCompleted} reps`,
    result.painDuring == null ? "" : `pain during ${result.painDuring}/10`,
    result.painAfter == null ? "" : `pain after ${result.painAfter}/10`,
    result.qualityScore == null ? "" : `quality ${result.qualityScore}/5`,
    result.lagObserved == null ? "" : result.lagObserved ? "lag observed" : "no lag",
    result.feltControlled == null ? "" : result.feltControlled ? "controlled" : "not controlled",
    result.irritation == null ? "" : result.irritation ? "irritation" : "no irritation",
  ].filter(Boolean);
  return parts.join(" · ");
}

function CoachToolsCard({
  plan,
  coachNote,
  hasMorningCheckIn,
  hasEveningCheckIn,
  copiedMorningPacket,
  copiedEveningPacket,
  onCopyMorningPacket,
  onCopyEveningPacket,
  onImportPlan,
  onViewPacket,
  onViewEveningPacket,
  onViewPlan,
  onArchivePlan,
}: {
  plan: DailyCoachPlan | null;
  coachNote: CoachNote | null;
  hasMorningCheckIn: boolean;
  hasEveningCheckIn: boolean;
  copiedMorningPacket: boolean;
  copiedEveningPacket: boolean;
  onCopyMorningPacket: () => void;
  onCopyEveningPacket: () => void;
  onImportPlan: () => void;
  onViewPacket: () => void;
  onViewEveningPacket: () => void;
  onViewPlan: () => void;
  onArchivePlan: () => void;
}) {
  return (
    <Surface className="p-4 md:p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-phoenix">
            <Sparkles className="h-3.5 w-3.5" /> Coach Tools
          </div>
          <div className="mt-1 text-sm text-muted-foreground">
            Packets, imports, and plan utilities.
          </div>
        </div>
        {plan && (
          <span className="rounded-full bg-phoenix/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-phoenix">
            Coach Plan Active
          </span>
        )}
      </div>

      {plan ? (
        <>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <CoachPlanMeta label="Source" value={formatPlanSource(plan)} />
            <CoachPlanMeta label="Imported time" value={formatImportedTime(plan.importedAt)} />
            <CoachPlanMeta label="Primary Focus" value={plan.primaryFocus} />
            <CoachPlanMeta label="Readiness" value={plan.readiness} />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={onViewPlan}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background/40 px-3 py-2 text-sm font-medium transition hover:bg-accent"
            >
              <Eye className="h-4 w-4" /> View Plan
            </button>
            <button
              onClick={onImportPlan}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background/40 px-3 py-2 text-sm font-medium transition hover:bg-accent"
            >
              <RefreshCw className="h-4 w-4" /> Replace Plan
            </button>
            <button
              onClick={onCopyEveningPacket}
              disabled={!hasEveningCheckIn}
              className={cn(
                "inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background/40 px-3 py-2 text-sm font-medium transition hover:bg-accent",
                !hasEveningCheckIn && "cursor-not-allowed opacity-50 hover:bg-background/40",
              )}
            >
              <Copy className="h-4 w-4" /> {copiedEveningPacket ? "Copied" : "Copy Evening Packet"}
            </button>
            <button
              onClick={onViewEveningPacket}
              disabled={!hasEveningCheckIn}
              className={cn(
                "inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background/40 px-3 py-2 text-sm font-medium transition hover:bg-accent",
                !hasEveningCheckIn && "cursor-not-allowed opacity-50 hover:bg-background/40",
              )}
            >
              <Eye className="h-4 w-4" /> View Evening Packet
            </button>
            <button
              onClick={onArchivePlan}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background/40 px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground"
            >
              <Archive className="h-4 w-4" /> Archive Plan
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="mb-3 rounded-xl border border-warning/30 bg-warning/5 p-3">
            <div className="text-sm font-semibold tracking-tight text-warning">
              No active coach plan
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Copy the Morning Planning Packet and import a plan to update today&apos;s target and
              work.
            </p>
          </div>

          <div className="space-y-2 rounded-xl border border-border bg-background/40 p-3 text-xs text-muted-foreground">
            {!hasMorningCheckIn && <div>Complete morning check-in to generate packet.</div>}
            {!hasEveningCheckIn && <div>Evening packet available after evening check-in.</div>}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={onCopyMorningPacket}
              disabled={!hasMorningCheckIn}
              className={cn(
                "inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background/40 px-3 py-2 text-sm font-medium transition hover:bg-accent",
                !hasMorningCheckIn && "cursor-not-allowed opacity-50 hover:bg-background/40",
              )}
            >
              <Copy className="h-4 w-4" /> {copiedMorningPacket ? "Copied" : "Copy Morning Packet"}
            </button>
            <button
              onClick={onImportPlan}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-phoenix px-3 py-2 text-sm font-medium text-phoenix-foreground shadow-phoenix"
            >
              <Upload className="h-4 w-4" /> Import Coach Plan
            </button>
            <button
              onClick={onViewPacket}
              disabled={!hasMorningCheckIn}
              className={cn(
                "inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background/40 px-3 py-2 text-sm font-medium transition hover:bg-accent",
                !hasMorningCheckIn && "cursor-not-allowed opacity-50 hover:bg-background/40",
              )}
            >
              <Eye className="h-4 w-4" /> View Packet
            </button>
          </div>
        </>
      )}

      {coachNote && (
        <details className="mt-4 rounded-xl border border-border bg-background/40 p-3">
          <summary className="cursor-pointer text-xs font-medium text-muted-foreground hover:text-foreground">
            Latest Coach Note
          </summary>
          <div className="mt-2 text-xs text-muted-foreground">
            {coachNote.source}
            {coachNote.authorName ? ` · ${coachNote.authorName}` : ""} ·{" "}
            {formatImportedTime(coachNote.createdAt)}
          </div>
          <p className="mt-2 text-sm leading-relaxed">{coachNote.summary || coachNote.fullNote}</p>
        </details>
      )}
    </Surface>
  );
}

function CoachPlanMeta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/80 bg-background/40 p-3">
      <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 text-sm text-foreground">{value}</div>
    </div>
  );
}

function CoachPlanDialog({ plan, onClose }: { plan: DailyCoachPlan; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="surface-card flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-phoenix">
              Coach Plan
            </div>
            <div className="text-base font-semibold">{plan.primaryFocus}</div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-auto p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <CoachPlanMeta label="Source" value={formatPlanSource(plan)} />
            <CoachPlanMeta label="Imported" value={formatImportedTime(plan.importedAt)} />
            <CoachPlanMeta label="Readiness" value={plan.readiness} />
            <CoachPlanMeta label="Status" value={plan.status} />
          </div>

          {plan.targets.length > 0 && (
            <section className="mt-5">
              <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                Targets
              </div>
              <div className="mt-2 grid gap-2">
                {plan.targets.map((target) => (
                  <div
                    key={target.id}
                    className="rounded-lg border border-border bg-background/40 p-3"
                  >
                    <div className="text-sm font-medium">{target.label}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{target.value}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {plan.quests.length > 0 && (
            <section className="mt-5">
              <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                Prescribed Tasks
              </div>
              <div className="mt-2 space-y-3">
                {plan.quests.map((quest) => (
                  <div
                    key={quest.id}
                    className="rounded-lg border border-border bg-background/40 p-3"
                  >
                    <div className="text-sm font-medium">{quest.label}</div>
                    <div className="mt-2 space-y-2">
                      {(quest.prescribedTasks ?? []).map((task) => (
                        <div key={task.id} className="rounded-md border border-border/70 p-2">
                          <div className="text-sm">{task.title}</div>
                          <div className="mt-1 space-y-1 text-xs leading-relaxed text-muted-foreground">
                            {prescriptionLines(task).map((line) => (
                              <div key={line}>{line}</div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {plan.skillTests.length > 0 && (
            <section className="mt-5">
              <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                Optional Skill Tests
              </div>
              <div className="mt-2 space-y-2">
                {plan.skillTests.map((test) => (
                  <div
                    key={test.id}
                    className="rounded-lg border border-border bg-background/40 p-3"
                  >
                    <div className="text-sm font-medium">{test.title}</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {skillTestDoseLine(test)}
                    </div>
                    {test.stopRules.length > 0 && (
                      <div className="mt-2 text-xs text-warning">
                        Stop: {test.stopRules.join(" · ")}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {plan.nextUnlocks.length > 0 && (
            <section className="mt-5">
              <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                Next Unlocks
              </div>
              <div className="mt-2 space-y-2">
                {plan.nextUnlocks.map((unlock) => (
                  <div
                    key={unlock.milestoneId}
                    className="rounded-lg border border-border bg-background/40 p-3"
                  >
                    <div className="text-sm font-medium">{unlock.title}</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {formatSkillTestStatus(unlock.state)}
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      If confirmed: {unlock.nextStepIfConfirmed}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      If not confirmed: {unlock.nextStepIfNotConfirmed}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {plan.stopRules.length > 0 && (
            <section className="mt-5">
              <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-warning">
                Stop Rules
              </div>
              <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                {plan.stopRules.map((rule) => (
                  <li key={rule} className="flex gap-2">
                    <span className="text-warning">•</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {plan.eveningCheckInFocus.length > 0 && (
            <section className="mt-5">
              <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                Evening Check-In Focus
              </div>
              <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                {plan.eveningCheckInFocus.map((focus) => (
                  <li key={focus} className="flex gap-2">
                    <span className="text-phoenix">•</span>
                    <span>{focus}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {plan.notes && (
            <section className="mt-5 rounded-lg border border-border bg-background/40 p-3">
              <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                Notes
              </div>
              <p className="mt-2 text-sm leading-relaxed">{plan.notes}</p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function formatPlanSource(plan: DailyCoachPlan) {
  return plan.authorName ? `${plan.source} · ${plan.authorName}` : plan.source;
}

function formatImportedTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
