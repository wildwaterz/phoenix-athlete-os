import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader, Surface } from "@/components/app-shell";
import { setState, usePhoenix } from "@/lib/phoenix-data";
import { useState } from "react";
import { CoachPacketDialog } from "@/components/coach-packet-dialog";
import { Download } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/check-in")({
  head: () => ({
    meta: [
      { title: "Daily Check-In · Phoenix OS" },
      { name: "description", content: "Morning and evening evidence for progression decisions." },
    ],
  }),
  component: CheckInPage,
});

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="text-sm font-medium">{label}</span>
        {hint && <span className="text-[11px] text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </label>
  );
}

function Slider({
  value,
  onChange,
  min,
  max,
  step = 1,
}: {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
}) {
  return (
    <div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="phoenix-range w-full accent-[color:var(--color-phoenix)]"
      />
      <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
        <span>{min}</span>
        <span className="font-medium text-foreground">{value}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

function NumberInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="number"
      {...props}
      className={cn(
        "w-full rounded-xl border border-border bg-background/40 px-3 py-2 text-sm outline-none focus:border-phoenix",
        props.className,
      )}
    />
  );
}

function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      rows={3}
      {...props}
      className={cn(
        "w-full rounded-xl border border-border bg-background/40 px-3 py-2 text-sm outline-none focus:border-phoenix",
        props.className,
      )}
    />
  );
}

function CheckInPage() {
  const s = usePhoenix();
  const [tab, setTab] = useState<"morning" | "evening">("morning");
  const [packetOpen, setPacketOpen] = useState<null | "morning" | "evening">(null);

  const m = s.morning ?? {
    date: new Date().toISOString().slice(0, 10),
    pain: 2,
    swelling: 1,
    walkingConfidence: 3,
    quadActivation: 3,
    extension: 5,
    flexion: 110,
    sleepHours: 7,
    weightKg: 85,
    proteinTargetG: 160,
    confidence: 3,
    notes: "",
  };
  const e = s.evening ?? {
    date: new Date().toISOString().slice(0, 10),
    exercisesCompleted: "",
    painDuring: 2,
    painAfter: 2,
    swellingChange: 0,
    walkingConfidence: 3,
    milestones: "",
    notes: "",
  };

  const updateMorning = (patch: Partial<typeof m>) =>
    setState((prev) => ({ ...prev, morning: { ...m, ...patch } }));
  const updateEvening = (patch: Partial<typeof e>) =>
    setState((prev) => ({ ...prev, evening: { ...e, ...patch } }));

  return (
    <AppShell>
      <PageHeader
        eyebrow="Evidence"
        title="Daily Check-In"
        description="Two checkpoints per day. Data drives progression — not how you feel about today."
      />

      <div className="mb-4 inline-flex rounded-xl border border-border bg-card p-1">
        {(["morning", "evening"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "rounded-lg px-4 py-1.5 text-sm capitalize transition",
              tab === t
                ? "bg-gradient-phoenix text-phoenix-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "morning" ? (
        <Surface>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Pain" hint="0 none — 10 worst">
              <Slider value={m.pain} onChange={(v) => updateMorning({ pain: v })} min={0} max={10} />
            </Field>
            <Field label="Swelling" hint="0 none — 10 severe">
              <Slider value={m.swelling} onChange={(v) => updateMorning({ swelling: v })} min={0} max={10} />
            </Field>
            <Field label="Walking confidence" hint="1 — 5">
              <Slider value={m.walkingConfidence} onChange={(v) => updateMorning({ walkingConfidence: v })} min={1} max={5} />
            </Field>
            <Field label="Quad activation" hint="1 — 5">
              <Slider value={m.quadActivation} onChange={(v) => updateMorning({ quadActivation: v })} min={1} max={5} />
            </Field>
            <Field label="Extension (° from neutral)">
              <NumberInput value={m.extension} onChange={(ev) => updateMorning({ extension: Number(ev.target.value) })} />
            </Field>
            <Field label="Flexion (°)">
              <NumberInput value={m.flexion} onChange={(ev) => updateMorning({ flexion: Number(ev.target.value) })} />
            </Field>
            <Field label="Sleep (hours)">
              <NumberInput step="0.1" value={m.sleepHours} onChange={(ev) => updateMorning({ sleepHours: Number(ev.target.value) })} />
            </Field>
            <Field label="Weight (kg)">
              <NumberInput step="0.1" value={m.weightKg} onChange={(ev) => updateMorning({ weightKg: Number(ev.target.value) })} />
            </Field>
            <Field label="Protein target (g)">
              <NumberInput value={m.proteinTargetG} onChange={(ev) => updateMorning({ proteinTargetG: Number(ev.target.value) })} />
            </Field>
            <Field label="Confidence in knee" hint="1 — 5">
              <Slider value={m.confidence} onChange={(v) => updateMorning({ confidence: v })} min={1} max={5} />
            </Field>
            <div className="md:col-span-2">
              <Field label="Morning notes">
                <TextArea value={m.notes} onChange={(ev) => updateMorning({ notes: ev.target.value })} placeholder="Anything you want the coach to see." />
              </Field>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => setPacketOpen("morning")}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-phoenix px-4 py-2.5 text-sm font-medium text-phoenix-foreground shadow-phoenix"
            >
              <Download className="h-4 w-4" /> Generate morning coach packet
            </button>
          </div>
        </Surface>
      ) : (
        <Surface>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <Field label="Exercises completed">
                <TextArea value={e.exercisesCompleted} onChange={(ev) => updateEvening({ exercisesCompleted: ev.target.value })} placeholder="What you actually did — sets, reps, load." />
              </Field>
            </div>
            <Field label="Pain during activity">
              <Slider value={e.painDuring} onChange={(v) => updateEvening({ painDuring: v })} min={0} max={10} />
            </Field>
            <Field label="Pain after activity">
              <Slider value={e.painAfter} onChange={(v) => updateEvening({ painAfter: v })} min={0} max={10} />
            </Field>
            <Field label="Swelling change" hint="-3 down to +3 up">
              <Slider value={e.swellingChange} onChange={(v) => updateEvening({ swellingChange: v })} min={-3} max={3} />
            </Field>
            <Field label="Walking confidence" hint="1 — 5">
              <Slider value={e.walkingConfidence} onChange={(v) => updateEvening({ walkingConfidence: v })} min={1} max={5} />
            </Field>
            <div className="md:col-span-2">
              <Field label="Milestones achieved">
                <TextArea value={e.milestones} onChange={(ev) => updateEvening({ milestones: ev.target.value })} placeholder="Anything earned today — first SLR without lag, etc." />
              </Field>
            </div>
            <div className="md:col-span-2">
              <Field label="Evening notes">
                <TextArea value={e.notes} onChange={(ev) => updateEvening({ notes: ev.target.value })} />
              </Field>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => setPacketOpen("evening")}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-phoenix px-4 py-2.5 text-sm font-medium text-phoenix-foreground shadow-phoenix"
            >
              <Download className="h-4 w-4" /> Generate evening coach packet
            </button>
          </div>
        </Surface>
      )}

      {packetOpen && (
        <CoachPacketDialog kind={packetOpen} onClose={() => setPacketOpen(null)} />
      )}
    </AppShell>
  );
}