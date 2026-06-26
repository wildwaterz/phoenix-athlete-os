import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader, Surface } from "@/components/app-shell";
import {
  checkInFieldLabel,
  createDefaultEveningCheckIn,
  createDefaultMorningCheckIn,
  eveningCheckInFieldsForPhase,
  getEveningForDate,
  getMorningForDate,
  morningCheckInFieldsForPhase,
  phaseForDate,
  saveEveningCheckIn,
  saveMorningCheckIn,
  todayIso,
  type CheckInFieldId,
  type EveningCheckIn,
  type MorningCheckIn,
  usePhoenix,
} from "@/lib/phoenix-data";
import { Fragment, useState } from "react";
import { CoachPacketDialog } from "@/components/coach-packet-dialog";
import { ImportCoachPlanDialog } from "@/components/import-coach-plan-dialog";
import { CalendarDays, Download, Upload } from "lucide-react";
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

function SelectInput(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
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

const swellingContextOptions: Array<NonNullable<MorningCheckIn["swellingContext"]>> = [
  "surgical_baseline",
  "activity_response",
  "unknown",
];

const swellingTrendOptions: Array<NonNullable<MorningCheckIn["swellingTrend"]>> = [
  "improved",
  "stable",
  "worse",
  "unknown",
];

const extensionStatusOptions: Array<NonNullable<MorningCheckIn["extensionStatus"]>> = [
  "neutral",
  "slightly_limited",
  "moderately_limited",
  "significantly_limited",
  "not_tested",
];

function formatOption(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function FieldSlot({
  field,
  label,
  hint,
  wide,
  children,
}: {
  field: CheckInFieldId;
  label?: string;
  hint?: string;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div key={field} className={wide ? "md:col-span-2" : undefined}>
      <Field label={label ?? checkInFieldLabel(field)} hint={hint}>
        {children}
      </Field>
    </div>
  );
}

function renderMorningField(
  field: CheckInFieldId,
  m: MorningCheckIn,
  updateMorning: (patch: Partial<MorningCheckIn>) => void,
) {
  switch (field) {
    case "pain":
      return (
        <FieldSlot field={field} hint="0 none — 10 worst">
          <Slider value={m.pain} onChange={(v) => updateMorning({ pain: v })} min={0} max={10} />
        </FieldSlot>
      );
    case "swelling":
      return (
        <FieldSlot field={field} hint="0 none — 10 severe">
          <Slider
            value={m.swellingLevel ?? m.swelling}
            onChange={(v) => updateMorning({ swelling: v, swellingLevel: v })}
            min={0}
            max={10}
          />
        </FieldSlot>
      );
    case "swelling-context":
      return (
        <FieldSlot field={field}>
          <SelectInput
            value={m.swellingContext ?? "unknown"}
            onChange={(ev) =>
              updateMorning({
                swellingContext: ev.target.value as NonNullable<MorningCheckIn["swellingContext"]>,
              })
            }
          >
            {swellingContextOptions.map((option) => (
              <option key={option} value={option}>
                {formatOption(option)}
              </option>
            ))}
          </SelectInput>
        </FieldSlot>
      );
    case "swelling-trend":
      return (
        <FieldSlot field={field}>
          <SelectInput
            value={m.swellingTrend ?? "unknown"}
            onChange={(ev) =>
              updateMorning({
                swellingTrend: ev.target.value as NonNullable<MorningCheckIn["swellingTrend"]>,
              })
            }
          >
            {swellingTrendOptions.map((option) => (
              <option key={option} value={option}>
                {formatOption(option)}
              </option>
            ))}
          </SelectInput>
        </FieldSlot>
      );
    case "walking-confidence":
      return (
        <FieldSlot field={field} hint="1 — 5">
          <Slider
            value={m.walkingConfidence}
            onChange={(v) => updateMorning({ walkingConfidence: v })}
            min={1}
            max={5}
          />
        </FieldSlot>
      );
    case "confidence-in-knee":
      return (
        <FieldSlot field={field} hint="1 — 5">
          <Slider
            value={m.confidence}
            onChange={(v) => updateMorning({ confidence: v })}
            min={1}
            max={5}
          />
        </FieldSlot>
      );
    case "quad-activation":
      return (
        <FieldSlot field={field} hint="1 — 5">
          <Slider
            value={m.quadActivation}
            onChange={(v) => updateMorning({ quadActivation: v })}
            min={1}
            max={5}
          />
        </FieldSlot>
      );
    case "extension":
      return (
        <FieldSlot field={field} label="Extension (° from neutral)">
          <NumberInput
            value={m.extension}
            onChange={(ev) => updateMorning({ extension: Number(ev.target.value) })}
          />
        </FieldSlot>
      );
    case "extension-status":
      return (
        <FieldSlot field={field}>
          <SelectInput
            value={m.extensionStatus ?? "not_tested"}
            onChange={(ev) =>
              updateMorning({
                extensionStatus: ev.target.value as NonNullable<MorningCheckIn["extensionStatus"]>,
              })
            }
          >
            {extensionStatusOptions.map((option) => (
              <option key={option} value={option}>
                {formatOption(option)}
              </option>
            ))}
          </SelectInput>
        </FieldSlot>
      );
    case "flexion":
      return (
        <FieldSlot field={field} label="Flexion (°)">
          <NumberInput
            value={m.flexion}
            onChange={(ev) => updateMorning({ flexion: Number(ev.target.value) })}
          />
        </FieldSlot>
      );
    case "movement-quality":
      return (
        <FieldSlot field={field} hint="1 — 5">
          <Slider
            value={m.movementQuality ?? 3}
            onChange={(v) => updateMorning({ movementQuality: v })}
            min={1}
            max={5}
          />
        </FieldSlot>
      );
    case "training-readiness":
      return (
        <FieldSlot field={field} hint="1 — 5">
          <Slider
            value={m.trainingReadiness ?? 3}
            onChange={(v) => updateMorning({ trainingReadiness: v })}
            min={1}
            max={5}
          />
        </FieldSlot>
      );
    case "sport-confidence":
      return (
        <FieldSlot field={field} hint="1 — 5">
          <Slider
            value={m.sportConfidence ?? 3}
            onChange={(v) => updateMorning({ sportConfidence: v })}
            min={1}
            max={5}
          />
        </FieldSlot>
      );
    case "sleep-hours":
      return (
        <FieldSlot field={field} label="Sleep (hours)">
          <NumberInput
            step="0.1"
            value={m.sleepHours}
            onChange={(ev) => updateMorning({ sleepHours: Number(ev.target.value) })}
          />
        </FieldSlot>
      );
    case "protein-target":
      return (
        <FieldSlot field={field} label="Protein target (g)">
          <NumberInput
            value={m.proteinTargetG}
            onChange={(ev) => updateMorning({ proteinTargetG: Number(ev.target.value) })}
          />
        </FieldSlot>
      );
    case "notes":
      return (
        <FieldSlot field={field} label="Morning notes" wide>
          <TextArea
            value={m.notes}
            onChange={(ev) => updateMorning({ notes: ev.target.value })}
            placeholder="Anything you want the coach to see."
          />
        </FieldSlot>
      );
    default:
      return null;
  }
}

function renderEveningField(
  field: CheckInFieldId,
  e: EveningCheckIn,
  updateEvening: (patch: Partial<EveningCheckIn>) => void,
) {
  switch (field) {
    case "exercises-completed":
      return (
        <FieldSlot field={field} wide>
          <TextArea
            value={e.exercisesCompleted}
            onChange={(ev) => updateEvening({ exercisesCompleted: ev.target.value })}
            placeholder="What you actually did — sets, reps, load."
          />
        </FieldSlot>
      );
    case "pain-during":
      return (
        <FieldSlot field={field}>
          <Slider
            value={e.painDuringActivity ?? e.painDuring}
            onChange={(v) => updateEvening({ painDuring: v, painDuringActivity: v })}
            min={0}
            max={10}
          />
        </FieldSlot>
      );
    case "pain-after":
      return (
        <FieldSlot field={field}>
          <Slider
            value={e.painAfterActivity ?? e.painAfter}
            onChange={(v) => updateEvening({ painAfter: v, painAfterActivity: v })}
            min={0}
            max={10}
          />
        </FieldSlot>
      );
    case "swelling-change":
      return (
        <FieldSlot field={field} hint="-3 down to +3 up">
          <Slider
            value={e.swellingChange}
            onChange={(v) => updateEvening({ swellingChange: v })}
            min={-3}
            max={3}
          />
        </FieldSlot>
      );
    case "walking-confidence":
      return (
        <FieldSlot field={field} label="Walking confidence after" hint="1 — 5">
          <Slider
            value={e.walkingConfidenceAfter ?? e.walkingConfidence}
            onChange={(v) => updateEvening({ walkingConfidence: v, walkingConfidenceAfter: v })}
            min={1}
            max={5}
          />
        </FieldSlot>
      );
    case "movement-quality":
      return (
        <FieldSlot field={field} label="Movement quality after" hint="1 — 5">
          <Slider
            value={e.movementQualityAfter ?? 3}
            onChange={(v) => updateEvening({ movementQualityAfter: v })}
            min={1}
            max={5}
          />
        </FieldSlot>
      );
    case "energy-fatigue":
      return (
        <FieldSlot field={field} hint="1 low — 5 high">
          <Slider
            value={e.energyFatigue ?? 3}
            onChange={(v) => updateEvening({ energyFatigue: v })}
            min={1}
            max={5}
          />
        </FieldSlot>
      );
    case "milestones":
      return (
        <FieldSlot field={field} wide>
          <TextArea
            value={e.milestones}
            onChange={(ev) => updateEvening({ milestones: ev.target.value })}
            placeholder="Anything earned today — first SLR without lag, etc."
          />
        </FieldSlot>
      );
    case "notes":
      return (
        <FieldSlot field={field} label="Evening notes" wide>
          <TextArea value={e.notes} onChange={(ev) => updateEvening({ notes: ev.target.value })} />
        </FieldSlot>
      );
    default:
      return null;
  }
}

function CheckInPage() {
  const s = usePhoenix();
  const today = todayIso();
  const [selectedDate, setSelectedDate] = useState(today);
  const [tab, setTab] = useState<"morning" | "evening">("morning");
  const [packetOpen, setPacketOpen] = useState<null | "morning" | "evening">(null);
  const [importOpen, setImportOpen] = useState(false);

  const savedMorning = getMorningForDate(s, selectedDate);
  const savedEvening = getEveningForDate(s, selectedDate);
  const phase = phaseForDate(s, selectedDate);
  const morningFieldIds = morningCheckInFieldsForPhase(phase);
  const eveningFieldIds = eveningCheckInFieldsForPhase(phase);
  const m = savedMorning ?? createDefaultMorningCheckIn(selectedDate, phase.id);
  const e = savedEvening ?? createDefaultEveningCheckIn(selectedDate, phase.id);
  const hasMorning = Boolean(savedMorning);
  const hasEvening = Boolean(savedEvening);

  const updateMorning = (patch: Partial<typeof m>) =>
    saveMorningCheckIn({ ...m, ...patch, date: selectedDate, phaseId: phase.id });
  const updateEvening = (patch: Partial<typeof e>) =>
    saveEveningCheckIn({ ...e, ...patch, date: selectedDate, phaseId: phase.id });

  return (
    <AppShell>
      <PageHeader
        eyebrow="Evidence"
        title="Daily Check-In"
        description="Two checkpoints per day. Data drives progression — not how you feel about today."
      />

      <Surface className="mb-4 p-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold">
              <CalendarDays className="h-4 w-4 text-phoenix" />
              Check-in date
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              {phase.name} ·{" "}
              {hasMorning || hasEvening ? "Saved on this device." : "No entry yet for this date."}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={selectedDate}
              max={today}
              onChange={(event) => setSelectedDate(event.target.value || today)}
              className="rounded-xl border border-border bg-background/40 px-3 py-2 text-sm outline-none focus:border-phoenix"
            />
            {selectedDate !== today && (
              <button
                type="button"
                onClick={() => setSelectedDate(today)}
                className="rounded-xl border border-border bg-background/40 px-3 py-2 text-sm text-muted-foreground transition hover:text-foreground"
              >
                Today
              </button>
            )}
          </div>
        </div>
      </Surface>

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
            {morningFieldIds.map((field) => (
              <Fragment key={field}>{renderMorningField(field, m, updateMorning)}</Fragment>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => setPacketOpen("morning")}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-phoenix px-4 py-2.5 text-sm font-medium text-phoenix-foreground shadow-phoenix"
            >
              <Download className="h-4 w-4" /> Generate morning coach packet
            </button>
            <button
              onClick={() => setImportOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-background/40 px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-accent"
            >
              <Upload className="h-4 w-4" /> Import coach plan
            </button>
          </div>
        </Surface>
      ) : (
        <Surface>
          <div className="grid gap-5 md:grid-cols-2">
            {eveningFieldIds.map((field) => (
              <Fragment key={field}>{renderEveningField(field, e, updateEvening)}</Fragment>
            ))}
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
        <CoachPacketDialog
          kind={packetOpen}
          date={selectedDate}
          onClose={() => setPacketOpen(null)}
        />
      )}
      {importOpen && (
        <ImportCoachPlanDialog selectedDate={selectedDate} onClose={() => setImportOpen(false)} />
      )}
    </AppShell>
  );
}
