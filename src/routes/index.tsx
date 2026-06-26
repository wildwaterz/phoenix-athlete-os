import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, ProgressBar, StatTile, Surface } from "@/components/app-shell";
import { CoachPacketDialog } from "@/components/coach-packet-dialog";
import { ImportCoachPlanDialog } from "@/components/import-coach-plan-dialog";
import { buildPacketMarkdown, type PacketKind } from "@/lib/coach-packet";
import {
  activeDailyCoachPlanForDate,
  archiveDailyCoachPlan,
  currentMission,
  currentPhaseN,
  dailyQuestsForDate,
  getEveningForDate,
  type DailyQuest,
  type DailyCoachPlan,
  type CoachNote,
  daysPostOp,
  getMorningForDate,
  latestCoachNoteForDateAndPhase,
  levelFromXp,
  missionMilestoneProgress,
  previousMorning,
  readinessFor,
  setState,
  todaysWin,
  trendFor,
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
  Minus,
  RefreshCw,
  Sparkles,
  Trophy,
  TrendingDown,
  TrendingUp,
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
  const iq = levelFromXp(s.recoveryIqXp);
  const milestoneProg = missionMilestoneProgress(s, mission.id);
  const phaseN = currentPhaseN(s);

  const todayIso = new Date().toISOString().slice(0, 10);
  const [selectedDate, setSelectedDate] = useState<string>(todayIso);
  const [packetOpen, setPacketOpen] = useState<null | PacketKind>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [viewPlanOpen, setViewPlanOpen] = useState(false);
  const [copiedMorningPacket, setCopiedMorningPacket] = useState(false);
  const m = getMorningForDate(s, selectedDate);
  const evening = getEveningForDate(s, selectedDate);
  const prev = previousMorning(s, selectedDate);
  const readiness = readinessFor(m);
  const isToday = selectedDate === todayIso;

  const shiftDate = (delta: number) => {
    const d = new Date(selectedDate + "T00:00:00");
    d.setDate(d.getDate() + delta);
    setSelectedDate(d.toISOString().slice(0, 10));
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
  const win = todaysWin(m, prev);
  const activePlan = activeDailyCoachPlanForDate(s, selectedDate);
  const latestCoachNote = latestCoachNoteForDateAndPhase(s, selectedDate);
  const quests = dailyQuestsForDate(s, selectedDate);

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

  const toggleQuest = (id: string) =>
    setState((prev) => {
      const dateQuests = dailyQuestsForDate(prev, selectedDate);
      const q = dateQuests.find((x) => x.id === id);
      if (!q) return prev;

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
          selectedDate === todayIso
            ? dateQuests.map((quest) => (quest.id === id ? { ...quest, done } : quest))
            : prev.todayQuests,
        recoveryIqXp: prev.recoveryIqXp + (done ? q.xp : -q.xp),
      };
    });

  const mainQuests = quests.filter((q) => q.kind === "main");
  const sideQuests = quests.filter((q) => q.kind === "side");
  const readinessTone =
    readiness.state === "ready" ? "good" : readiness.state === "modify" ? "watch" : "alert";
  const readinessRing =
    readiness.state === "ready"
      ? "border-success/60 bg-success/5"
      : readiness.state === "modify"
        ? "border-warning/60 bg-warning/5"
        : "border-destructive/60 bg-destructive/5";
  const readinessText =
    readiness.state === "ready"
      ? "text-success"
      : readiness.state === "modify"
        ? "text-warning"
        : "text-destructive";

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
                <span>{s.recoveryIqXp} XP</span>
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
            Lvl {iq.level} · {s.recoveryIqXp} XP
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
              onSelect={(d) => d && setSelectedDate(d.toISOString().slice(0, 10))}
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

      {/* Hero mission card */}
      <Surface className="mb-5 overflow-hidden p-0">
        <div className="relative p-6 md:p-7">
          <div
            className="absolute inset-0 -z-10 opacity-30"
            style={{
              background:
                "radial-gradient(600px 200px at 80% 0%, var(--color-phoenix-glow), transparent 60%)",
            }}
          />
          <div className="min-w-0">
            <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-phoenix">
              Current Mission · {mission.phase}
            </div>
            <div className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
              {mission.name}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">{mission.tagline}</div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border/80 bg-background/40 p-3">
                <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  Mission Objective
                </div>
                <div className="mt-1 text-sm text-foreground">{mission.objective}</div>
              </div>
              <div className="rounded-xl border border-border/80 bg-background/40 p-3">
                <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  Why this matters
                </div>
                <div className="mt-1 text-sm text-foreground">{mission.why}</div>
              </div>
            </div>

            {mission.estDuration && (
              <div className="mt-3 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                Est. duration · <span className="text-foreground">{mission.estDuration}</span>
              </div>
            )}

            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>Mission progress</span>
                <span className="font-medium text-foreground">
                  {milestoneProg.done} of {milestoneProg.total} milestones complete
                </span>
              </div>
              <ProgressBar value={milestoneProg.pct} />
            </div>
            <div className="mt-4 text-xs text-muted-foreground">
              Next unlock · <span className="text-foreground">{mission.nextUnlock}</span>
            </div>
          </div>
        </div>
      </Surface>

      {/* Dominant Today's Readiness */}
      <Surface className={cn("mb-5 border p-5", readinessRing)}>
        <div className="flex items-start gap-4">
          <span className="text-4xl leading-none">{readiness.dot}</span>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Today's Readiness
            </div>
            <div className={cn("mt-1 text-3xl font-bold tracking-tight uppercase", readinessText)}>
              {readiness.label}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{readiness.summary}</p>
          </div>
        </div>
      </Surface>

      {/* Row 1 · Decision metrics */}
      <div className="mb-2 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
        <span className="h-1.5 w-1.5 rounded-full bg-phoenix" /> Decision Metrics
        <span className="text-muted-foreground/70">Can I move and train today?</span>
      </div>
      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <MetricTile
          label="Walking confidence"
          value={m ? `${m.walkingConfidence}/5` : "—"}
          current={m?.walkingConfidence}
          previous={prev?.walkingConfidence}
          direction="higher-better"
        />
        <MetricTile
          label="Pain zone"
          value={m ? `${m.pain}/10` : "—"}
          unit=""
          current={m?.pain}
          previous={prev?.pain}
          direction="lower-better"
          tone={m ? (m.pain <= 3 ? "good" : m.pain <= 4 ? "watch" : "alert") : "default"}
        />
        <MetricTile
          label="Swelling"
          value={m ? `${m.swelling}/10` : "—"}
          current={m?.swelling}
          previous={prev?.swelling}
          direction="lower-better"
          tone={m ? (m.swelling <= 2 ? "good" : m.swelling <= 4 ? "watch" : "alert") : "default"}
        />
        <Surface className="p-4">
          <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Today's Win
          </div>
          <div className="mt-2 inline-flex items-center gap-2">
            <Trophy className="h-4 w-4 text-phoenix" />
            <span className="text-sm font-semibold leading-snug">{win.label}</span>
          </div>
          <div className="mt-1 text-xs text-muted-foreground">{win.detail}</div>
        </Surface>
      </div>

      {/* Row 2 · Supporting metrics */}
      <div className="mb-2 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60" /> Supporting Metrics
        <span className="text-muted-foreground/70">What is influencing readiness?</span>
      </div>
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <MetricTile
          label="Quad activation"
          value={m ? `${m.quadActivation}/5` : "—"}
          current={m?.quadActivation}
          previous={prev?.quadActivation}
          direction="higher-better"
        />
        <MetricTile
          label="Extension"
          value={m ? `${m.extension}°` : "—"}
          current={m?.extension}
          previous={prev?.extension}
          direction="lower-better"
          unit="°"
        />
        <StatTile label="Sleep" value={m ? `${m.sleepHours}h` : "—"} hint="Last night" />
        <StatTile
          label="Protein target"
          value={m ? `${m.proteinTargetG}g` : "—"}
          hint="Daily target"
        />
      </div>

      {/* Today */}
      <div className="grid gap-4 md:grid-cols-3">
        <Surface className="md:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-semibold tracking-tight">Today's Quests</div>
            <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              Tap to complete
            </div>
          </div>

          <div className="mb-2 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-phoenix" /> Main Quests
            <span className="text-muted-foreground/70">Required</span>
          </div>
          <ul className="space-y-2">
            {mainQuests.map((q) => (
              <QuestRow key={q.id} q={q} onToggle={() => toggleQuest(q.id)} />
            ))}
          </ul>

          {sideQuests.length > 0 && (
            <>
              <div className="mb-2 mt-5 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60" /> Side Quests
                <span className="text-muted-foreground/70">Bonus XP</span>
              </div>
              <ul className="space-y-2">
                {sideQuests.map((q) => (
                  <QuestRow key={q.id} q={q} onToggle={() => toggleQuest(q.id)} />
                ))}
              </ul>
            </>
          )}
        </Surface>

        <Surface>
          <CoachPlanCard
            plan={activePlan}
            coachNote={latestCoachNote}
            hasMorningCheckIn={Boolean(m)}
            hasEveningCheckIn={Boolean(evening)}
            copiedMorningPacket={copiedMorningPacket}
            onCopyMorningPacket={copyMorningPacket}
            onImportPlan={() => setImportOpen(true)}
            onViewPacket={() => setPacketOpen("morning")}
            onViewPlan={() => setViewPlanOpen(true)}
            onArchivePlan={() => activePlan && archiveDailyCoachPlan(activePlan.id)}
          />
        </Surface>
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

function QuestRow({ q, onToggle }: { q: DailyQuest; onToggle: () => void }) {
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
        <span className={cn("flex-1 text-sm", q.done && "line-through text-muted-foreground")}>
          {q.label}
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

function CoachPlanCard({
  plan,
  coachNote,
  hasMorningCheckIn,
  hasEveningCheckIn,
  copiedMorningPacket,
  onCopyMorningPacket,
  onImportPlan,
  onViewPacket,
  onViewPlan,
  onArchivePlan,
}: {
  plan: DailyCoachPlan | null;
  coachNote: CoachNote | null;
  hasMorningCheckIn: boolean;
  hasEveningCheckIn: boolean;
  copiedMorningPacket: boolean;
  onCopyMorningPacket: () => void;
  onImportPlan: () => void;
  onViewPacket: () => void;
  onViewPlan: () => void;
  onArchivePlan: () => void;
}) {
  return (
    <div>
      {plan ? (
        <>
          <div className="mb-3">
            <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-phoenix">
              <Sparkles className="h-3.5 w-3.5" /> Coach Plan Active
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              Imported guidance is driving today&apos;s quests and targets.
            </div>
          </div>

          <div className="grid gap-2">
            <CoachPlanMeta label="Source" value={formatPlanSource(plan)} />
            <CoachPlanMeta label="Imported time" value={formatImportedTime(plan.importedAt)} />
            <CoachPlanMeta label="Readiness" value={plan.readiness} />
            <CoachPlanMeta label="Primary Focus" value={plan.primaryFocus} />
            <CoachPlanMeta label="Key Stop Rule" value={plan.stopRules[0] ?? "None provided"} />
          </div>

          <div className="mt-4 grid gap-2">
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
              onClick={onArchivePlan}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background/40 px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground"
            >
              <Archive className="h-4 w-4" /> Archive Plan
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="mb-3">
            <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-phoenix">
              <Sparkles className="h-3.5 w-3.5" /> Coach Plan
            </div>
            <div className="mt-2 text-lg font-semibold tracking-tight">No coach plan imported</div>
            <p className="mt-1 text-sm text-muted-foreground">
              Generate a coach packet and import a plan to update today&apos;s quests.
            </p>
          </div>

          <div className="space-y-2 rounded-xl border border-border bg-background/40 p-3 text-xs text-muted-foreground">
            {!hasMorningCheckIn && <div>Complete morning check-in to generate packet.</div>}
            {!hasEveningCheckIn && <div>Evening packet available after evening check-in.</div>}
          </div>

          <div className="mt-4 grid gap-2">
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
        <div className="mt-5 rounded-xl border border-border bg-background/40 p-4">
          <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Latest Coach Note
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            {coachNote.source}
            {coachNote.author ? ` · ${coachNote.author}` : ""} ·{" "}
            {formatImportedTime(coachNote.createdAt)}
          </div>
          <p className="mt-2 line-clamp-4 text-sm leading-relaxed">{coachNote.body}</p>
        </div>
      )}
    </div>
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

function MetricTile({
  label,
  value,
  current,
  previous,
  direction,
  unit = "",
  tone = "default",
}: {
  label: string;
  value: ReactNode;
  current?: number;
  previous?: number;
  direction: "lower-better" | "higher-better";
  unit?: string;
  tone?: "default" | "good" | "watch" | "alert";
}) {
  const { trend, delta } = trendFor(current, previous, direction);
  const toneClass =
    tone === "good"
      ? "text-success"
      : tone === "watch"
        ? "text-warning"
        : tone === "alert"
          ? "text-destructive"
          : "text-foreground";

  const trendNode = (() => {
    if (trend === "none") return <span className="text-muted-foreground">No prior data</span>;
    if (trend === "flat")
      return (
        <span className="inline-flex items-center gap-1 text-muted-foreground">
          <Minus className="h-3 w-3" /> No change
        </span>
      );
    const improved = trend === "up";
    const Icon = improved ? TrendingUp : TrendingDown;
    const abs = Math.abs(delta);
    const sign = delta > 0 ? "+" : "−";
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1",
          improved ? "text-success" : "text-destructive",
        )}
      >
        <Icon className="h-3 w-3" />
        {improved ? "Improved" : "Worse"} {sign}
        {abs}
        {unit}
      </span>
    );
  })();

  return (
    <Surface className="p-4">
      <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </div>
      <div className={cn("mt-2 text-2xl font-semibold tracking-tight", toneClass)}>{value}</div>
      <div className="mt-1 text-xs">{trendNode}</div>
    </Surface>
  );
}
