import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, PageHeader, ProgressBar, StatTile, Surface } from "@/components/app-shell";
import {
  currentMission,
  daysPostOp,
  getMorningForDate,
  levelFromXp,
  previousMorning,
  principleForDate,
  readinessFor,
  setState,
  trendFor,
  usePhoenix,
} from "@/lib/phoenix-data";
import {
  ArrowRight,
  ArrowLeft,
  ArrowRight as ArrowRightIcon,
  CalendarDays,
  CheckCircle2,
  Circle,
  Flame,
  Minus,
  Sparkles,
  TrendingDown,
  TrendingUp,
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

  const todayIso = new Date().toISOString().slice(0, 10);
  const [selectedDate, setSelectedDate] = useState<string>(todayIso);
  const m = getMorningForDate(s, selectedDate);
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
  const principle = principleForDate(selectedDate);

  const toggleQuest = (id: string) =>
    setState((prev) => ({
      ...prev,
      todayQuests: prev.todayQuests.map((q) =>
        q.id === id
          ? { ...q, done: !q.done }
          : q,
      ),
      recoveryIqXp: prev.recoveryIqXp + (() => {
        const q = prev.todayQuests.find((x) => x.id === id);
        if (!q) return 0;
        return q.done ? -q.xp : q.xp;
      })(),
    }));

  const mainQuests = s.todayQuests.filter((q) => q.kind === "main");
  const sideQuests = s.todayQuests.filter((q) => q.kind === "side");
  const rec = s.todayRecommendation;
  const readinessTone =
    readiness.state === "ready" ? "good" : readiness.state === "modify" ? "watch" : "alert";

  return (
    <AppShell>
      <PageHeader
        eyebrow="Today"
        title={`Good to see you, ${s.athleteName}.`}
        description="Here's how you're doing today — based on this morning's evidence."
        action={
          <Link
            to="/check-in"
            className="hidden items-center gap-2 rounded-xl bg-gradient-phoenix px-4 py-2.5 text-sm font-medium text-phoenix-foreground shadow-phoenix transition hover:opacity-95 md:inline-flex"
          >
            <Sparkles className="h-4 w-4" />
            Daily check-in
          </Link>
        }
      />

      {/* Persistent date selector */}
      <Surface className="mb-5 p-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => shiftDate(-1)}
            aria-label="Previous day"
            className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-background/40 text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                aria-label="Change date"
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
                  <span className="hidden items-center gap-1 rounded-md border border-border/80 bg-background/60 px-2 py-1 text-[11px] font-medium text-muted-foreground transition group-hover:text-foreground sm:inline-flex">
                    <CalendarDays className="h-3.5 w-3.5" />
                    Change
                  </span>
                  <CalendarDays className="h-4 w-4 text-muted-foreground sm:hidden" />
                </div>
              </button>
            </PopoverTrigger>
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
          </Popover>

          <button
            onClick={() => shiftDate(1)}
            aria-label="Next day"
            disabled={isToday}
            className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-background/40 text-muted-foreground transition hover:text-foreground disabled:opacity-40"
          >
            <ArrowRightIcon className="h-4 w-4" />
          </button>
        </div>
        {!m && (
          <div className="mt-3 flex items-center justify-between rounded-lg border border-dashed border-border/80 bg-background/40 px-3 py-2 text-xs text-muted-foreground">
            <span>No check-in recorded for this day.</span>
            <Link to="/check-in" className="font-medium text-phoenix hover:underline">
              {isToday ? "Log check-in" : "Backfill →"}
            </Link>
          </div>
        )}
      </Surface>

      {/* Hero mission card */}
      <Surface className="mb-6 overflow-hidden p-0">
        <div className="relative grid gap-6 p-6 md:grid-cols-[1fr_auto] md:items-center md:p-7">
          <div className="absolute inset-0 -z-10 opacity-30"
               style={{ background: "radial-gradient(600px 200px at 80% 0%, var(--color-phoenix-glow), transparent 60%)" }} />
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
                <span className="font-medium text-foreground">{mission.progress}%</span>
              </div>
              <ProgressBar value={mission.progress} />
            </div>
            <div className="mt-4 text-xs text-muted-foreground">
              Next unlock · <span className="text-foreground">{mission.nextUnlock}</span>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-background/40 p-5">
            <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              <Flame className="h-3.5 w-3.5 text-phoenix" />
              Recovery IQ
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight">Lvl {iq.level}</span>
              <span className="text-xs text-muted-foreground">{s.recoveryIqXp} XP</span>
            </div>
            <div className="mt-3">
              <ProgressBar value={iq.pct} />
              <div className="mt-1.5 text-[11px] text-muted-foreground">
                {iq.toNext} XP to next level
              </div>
            </div>
          </div>
        </div>
      </Surface>

      {/* Vitals grid */}
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatTile
          label="Today's Readiness"
          value={
            <span className="inline-flex items-center gap-2">
              <span className="text-xl leading-none">{readiness.dot}</span>
              {readiness.label}
            </span>
          }
          hint={readiness.summary}
          tone={readinessTone}
        />
        <MetricTile
          label="Pain zone"
          value={m ? `${m.pain}/10` : "—"}
          unit=""
          current={m?.pain}
          previous={prev?.pain}
          direction="lower-better"
          tone={m ? (m.pain <= 2 ? "good" : m.pain <= 4 ? "watch" : "alert") : "default"}
        />
        <MetricTile
          label="Swelling"
          value={m ? `${m.swelling}/10` : "—"}
          current={m?.swelling}
          previous={prev?.swelling}
          direction="lower-better"
          tone={m ? (m.swelling <= 2 ? "good" : m.swelling <= 4 ? "watch" : "alert") : "default"}
        />
        <MetricTile
          label="Walking confidence"
          value={m ? `${m.walkingConfidence}/5` : "—"}
          current={m?.walkingConfidence}
          previous={prev?.walkingConfidence}
          direction="higher-better"
        />
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

          <div className="mt-5 rounded-xl border border-phoenix/20 bg-phoenix/5 p-4">
            <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-phoenix">
              <Sparkles className="h-3.5 w-3.5" /> Coach Recommendation
            </div>
            <dl className="mt-3 grid gap-3 sm:grid-cols-2">
              <RecRow label="Today's Priority" value={rec.priority} />
              <RecRow label="Workload" value={rec.workload} />
              <RecRow label="Reason" value={rec.reason} />
              <RecRow label="Next Reassessment" value={rec.nextReassessment} />
            </dl>
            <div className="mt-3 text-[11px] text-muted-foreground">
              Informational only. External coaching makes the final decision.
            </div>
          </div>
        </Surface>

        <Surface>
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-semibold tracking-tight">Coach Journal</div>
            <Link to="/journal" className="text-xs text-muted-foreground hover:text-foreground">
              View all <ArrowRight className="inline h-3 w-3" />
            </Link>
          </div>
          {s.journal[0] ? (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                <span>{s.journal[0].date}</span>
                <span className="rounded-md bg-phoenix/10 px-2 py-0.5 text-phoenix">
                  +{s.journal[0].xpAwarded} XP
                </span>
              </div>
              <JournalField label="Observation" value={s.journal[0].observation} />
              <JournalField label="Interpretation" value={s.journal[0].interpretation} />
              <JournalField label="Decision" value={s.journal[0].decision} />
              <JournalField label="Next Focus" value={s.journal[0].nextFocus} />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No entries yet.</p>
          )}

          {/* Rotating principle card */}
          <div className="mt-5 rounded-xl border border-border bg-background/40 p-4">
            <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.16em] text-phoenix">
              <Flame className="h-3 w-3" /> Daily Principle
            </div>
            <div className="mt-2 text-sm font-medium">{principle.title}</div>
            <p className="mt-1 text-xs text-muted-foreground">{principle.body}</p>
          </div>
        </Surface>
      </div>

      <Link
        to="/check-in"
        className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-gradient-phoenix px-4 py-3 text-sm font-medium text-phoenix-foreground shadow-phoenix md:hidden"
      >
        <Sparkles className="h-4 w-4" /> Daily check-in
      </Link>
    </AppShell>
  );
}

// ---------- local helpers ----------

function QuestRow({
  q,
  onToggle,
}: {
  q: { id: string; label: string; done: boolean; xp: number; kind: "main" | "side" };
  onToggle: () => void;
}) {
  return (
    <li>
      <button
        onClick={onToggle}
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
            q.kind === "side"
              ? "bg-muted text-muted-foreground"
              : "bg-phoenix/10 text-phoenix",
          )}
        >
          +{q.xp} XP
        </span>
      </button>
    </li>
  );
}

function RecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/80 bg-background/40 p-3">
      <dt className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-foreground">{value}</dd>
    </div>
  );
}

function JournalField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </div>
      <p className="mt-0.5 text-sm leading-relaxed">{value}</p>
    </div>
  );
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
