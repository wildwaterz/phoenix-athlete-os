import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, PageHeader, ProgressBar, StatTile, Surface } from "@/components/app-shell";
import {
  currentMission,
  levelFromXp,
  recoveryStatus,
  setState,
  usePhoenix,
} from "@/lib/phoenix-data";
import { ArrowRight, CheckCircle2, Circle, Flame, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const status = recoveryStatus(s);
  const m = s.morning;

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
            <div className="mt-5">
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
          label="Recovery"
          value={status.label.split(" — ")[0]}
          hint={status.label}
          tone={status.tone}
        />
        <StatTile
          label="Walking confidence"
          value={m ? `${m.walkingConfidence}/5` : "—"}
          hint="Self-reported"
        />
        <StatTile
          label="Pain zone"
          value={m ? `${m.pain}/10` : "—"}
          hint={m && m.pain <= 2 ? "Green" : m && m.pain <= 4 ? "Watch" : "Reactive"}
          tone={m ? (m.pain <= 2 ? "good" : m.pain <= 4 ? "watch" : "alert") : "default"}
        />
        <StatTile
          label="Swelling"
          value={m ? `${m.swelling}/10` : "—"}
          hint="Morning baseline"
          tone={m ? (m.swelling <= 2 ? "good" : m.swelling <= 4 ? "watch" : "alert") : "default"}
        />
        <StatTile label="Sleep" value={m ? `${m.sleepHours}h` : "—"} hint="Last night" />
        <StatTile
          label="Protein"
          value={m ? `${m.proteinTargetG}g` : "—"}
          hint="Daily target"
        />
        <StatTile
          label="Quad activation"
          value={m ? `${m.quadActivation}/5` : "—"}
          hint="Voluntary"
        />
        <StatTile
          label="Extension"
          value={m ? `${m.extension}°` : "—"}
          hint="From neutral"
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
          <ul className="space-y-2">
            {s.todayQuests.map((q) => (
              <li key={q.id}>
                <button
                  onClick={() => toggleQuest(q.id)}
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
                  <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-phoenix">
                    +{q.xp} XP
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-5 rounded-xl border border-phoenix/20 bg-phoenix/5 p-4">
            <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-phoenix">
              <Sparkles className="h-3.5 w-3.5" /> Today's recommendation
            </div>
            <div className="mt-2 text-sm text-foreground">{s.todayRecommendation}</div>
            <div className="mt-2 text-[11px] text-muted-foreground">
              Informational only. Coaching decisions happen externally.
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
            <div>
              <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                {s.journal[0].date} · +{s.journal[0].xpAwarded} XP
              </div>
              <p className="mt-2 text-sm leading-relaxed">{s.journal[0].observation}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                <span className="text-foreground">Decision:</span> {s.journal[0].decision}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                <span className="text-foreground">Next focus:</span> {s.journal[0].nextFocus}
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No entries yet.</p>
          )}
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
