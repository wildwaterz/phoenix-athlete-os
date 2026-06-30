import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader, Surface } from "@/components/app-shell";
import {
  checkInFieldLabel,
  createDefaultEveningCheckIn,
  createDefaultMorningCheckIn,
  dailyQuestsForDate,
  eveningCheckInFieldsForPhase,
  GAIT_QUALITY_LABELS,
  GAIT_QUALITY_OPTIONS,
  getEveningForDate,
  getLocalDateKey,
  getMorningForDate,
  getUtcTimestamp,
  morningCheckInFieldsForPhase,
  phaseForDate,
  saveEveningCheckIn,
  saveMorningCheckIn,
  skillTestsForDate,
  updatePrescribedTaskCompletion,
  updateSkillTestResult,
  type CheckInFieldId,
  type EveningCheckIn,
  type FlexionLimitingFactor,
  type FlexionStatus,
  type GaitQuality,
  type MorningCheckIn,
  type PrescribedTask,
  type PrescribedTaskActivationQuality,
  type PrescribedTaskAfterEffect,
  type PrescribedTaskCompletion,
  type PrescribedTaskCompletionStatus,
  type PrescribedTaskControlQuality,
  type PrescribedTaskExtensionAfter,
  type PrescribedTaskFlexionLimitingFactor,
  type PrescribedTaskGaitQuality,
  type PrescribedTaskPartialEstimate,
  type PrescribedTaskSupportUsed,
  type RangeResponse,
  type SkillTest,
  type SkillTestResult,
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
      <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-2">
        <span className="text-sm font-medium">{label}</span>
        {hint && <span className="text-right text-[11px] text-muted-foreground">{hint}</span>}
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
  "not_tested",
  "reaches_neutral",
  "slightly_limited",
  "moderately_limited",
  "significantly_limited",
];

const flexionStatusOptions: FlexionStatus[] = [
  "not_tested",
  "comfortable_gentle_bend",
  "stiff_but_tolerable",
  "painful_or_pinching",
];

const flexionLimitingFactorOptions: FlexionLimitingFactor[] = [
  "joint_limited",
  "incision_limited",
  "swelling_limited",
  "pain_limited",
  "unknown",
];

const responseOptions: RangeResponse[] = [
  "not_tested",
  "felt_same",
  "felt_better",
  "felt_stiffer",
  "painful_or_pinching",
];

const quadActivationQualityLabels: Record<number, string> = {
  1: "Could not find quad",
  2: "Faint or inconsistent contraction",
  3: "Repeatable but weak contraction",
  4: "Strong repeatable contraction",
  5: "Near-normal for current phase",
};

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
        <FieldSlot field={field} hint="Subjective trust, 1 — 5">
          <Slider
            value={m.walkingConfidence}
            onChange={(v) => updateMorning({ walkingConfidence: v })}
            min={1}
            max={5}
          />
        </FieldSlot>
      );
    case "gait-quality":
      return (
        <FieldSlot field={field} hint="Walking pattern / compensation">
          <SelectInput
            value={m.gaitQuality ?? "not_assessed"}
            onChange={(ev) => updateMorning({ gaitQuality: ev.target.value as GaitQuality })}
          >
            {GAIT_QUALITY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {GAIT_QUALITY_LABELS[option]}
              </option>
            ))}
          </SelectInput>
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
    case "extension-status":
      return (
        <FieldSlot
          field={field}
          hint="Do not force. Choose based on relaxed position, not a hard stretch."
        >
          <SelectInput
            value={m.extensionStatus}
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
    case "flexion-status":
      return (
        <>
          <FieldSlot field={field} label="Flexion comfort/status">
            <SelectInput
              value={m.flexionStatus}
              onChange={(ev) => updateMorning({ flexionStatus: ev.target.value as FlexionStatus })}
            >
              {flexionStatusOptions.map((option) => (
                <option key={option} value={option}>
                  {formatOption(option)}
                </option>
              ))}
            </SelectInput>
          </FieldSlot>
          <Field label="Flexion limiting factor">
            <SelectInput
              value={m.flexionLimitingFactor ?? "unknown"}
              onChange={(ev) =>
                updateMorning({
                  flexionLimitingFactor: ev.target.value as FlexionLimitingFactor,
                })
              }
            >
              {flexionLimitingFactorOptions.map((option) => (
                <option key={option} value={option}>
                  {formatOption(option)}
                </option>
              ))}
            </SelectInput>
          </Field>
        </>
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
            placeholder="Which quests you completed and what you actually did."
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
        <>
          <FieldSlot field={field} label="Walking confidence after" hint="1 — 5">
            <Slider
              value={e.walkingConfidenceAfter ?? e.walkingConfidence}
              onChange={(v) => updateEvening({ walkingConfidence: v, walkingConfidenceAfter: v })}
              min={1}
              max={5}
            />
          </FieldSlot>
          <Field label="Gait quality after" hint="1 compensation — 5 clean">
            <Slider
              value={e.gaitQualityAfter ?? e.movementQualityAfter ?? 3}
              onChange={(v) => updateEvening({ gaitQualityAfter: v, movementQualityAfter: v })}
              min={1}
              max={5}
            />
          </Field>
        </>
      );
    case "quad-activation-quality":
      return (
        <FieldSlot field={field} hint={quadActivationQualityLabels[e.quadActivationQuality]}>
          <Slider
            value={e.quadActivationQuality}
            onChange={(v) => updateEvening({ quadActivationQuality: v })}
            min={1}
            max={5}
          />
        </FieldSlot>
      );
    case "extension-response":
      return (
        <FieldSlot field={field}>
          <SelectInput
            value={e.extensionResponse}
            onChange={(ev) =>
              updateEvening({ extensionResponse: ev.target.value as RangeResponse })
            }
          >
            {responseOptions.map((option) => (
              <option key={option} value={option}>
                {formatOption(option)}
              </option>
            ))}
          </SelectInput>
        </FieldSlot>
      );
    case "flexion-response":
      return (
        <>
          <FieldSlot field={field}>
            <SelectInput
              value={e.flexionResponse}
              onChange={(ev) =>
                updateEvening({ flexionResponse: ev.target.value as RangeResponse })
              }
            >
              {responseOptions.map((option) => (
                <option key={option} value={option}>
                  {formatOption(option)}
                </option>
              ))}
            </SelectInput>
          </FieldSlot>
          <Field label="Flexion limiting factor">
            <SelectInput
              value={e.flexionLimitingFactor ?? "unknown"}
              onChange={(ev) =>
                updateEvening({
                  flexionLimitingFactor: ev.target.value as FlexionLimitingFactor,
                })
              }
            >
              {flexionLimitingFactorOptions.map((option) => (
                <option key={option} value={option}>
                  {formatOption(option)}
                </option>
              ))}
            </SelectInput>
          </Field>
        </>
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
    case "concerning-symptoms":
      return (
        <FieldSlot field={field} wide>
          <TextArea
            value={e.concerningSymptoms}
            onChange={(ev) => updateEvening({ concerningSymptoms: ev.target.value })}
            placeholder="Sharp pain, instability, buckling, calf symptoms, fever, drainage, or anything that concerns you."
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

function TaskNumberInput({
  value,
  onChange,
  min = 0,
  max,
}: {
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  min?: number;
  max?: number;
}) {
  return (
    <input
      type="number"
      min={min}
      max={max}
      value={value ?? ""}
      onChange={(event) =>
        onChange(event.target.value === "" ? undefined : Number(event.target.value))
      }
      className="w-full rounded-lg border border-border bg-background/40 px-2 py-1.5 text-sm outline-none focus:border-phoenix"
    />
  );
}

function taskPrescriptionSummary(task: PrescribedTask): string {
  const p = task.prescription;
  const dose = [
    p.sets ? `${p.sets} sets` : "",
    p.reps ? `${p.reps} reps` : "",
    p.holdSeconds ? `${p.holdSeconds}s holds` : "",
    p.durationMinutes ? `${p.durationMinutes} min` : "",
  ].filter(Boolean);
  return [
    dose.join(" · "),
    p.frequency,
    p.effortTarget ? `Effort ${p.effortTarget}` : "",
    p.rangeInstruction,
    p.qualityTarget ? `Goal: ${p.qualityTarget}` : "",
  ]
    .filter(Boolean)
    .join(" · ");
}

type TaskResponseKind =
  | "walking_gait"
  | "activation"
  | "skill_control"
  | "rom_flexion"
  | "rom_extension"
  | "recovery_basics";

const taskStatusOptions: Array<Exclude<PrescribedTaskCompletionStatus, "not_started">> = [
  "completed",
  "partial",
  "skipped",
];

const partialEstimateOptions: PrescribedTaskPartialEstimate[] = [
  "less_than_half",
  "about_half",
  "most",
  "custom",
];

const afterEffectOptions: PrescribedTaskAfterEffect[] = ["no_issue", "mild_settled", "worse"];

const gaitQualityOptions: PrescribedTaskGaitQuality[] = ["clean", "slight_limp", "worse_limp"];

const supportUsedOptions: PrescribedTaskSupportUsed[] = [
  "none",
  "one_crutch",
  "two_crutches",
  "mixed",
];

const activationQualityOptions: PrescribedTaskActivationQuality[] = [
  "could_not_find",
  "weak_repeatable",
  "good_control",
  "faded",
];

const controlQualityOptions: PrescribedTaskControlQuality[] = [
  "clean",
  "slight_lag",
  "clear_lag",
  "not_sure",
];

const taskFlexionLimitingFactorOptions: PrescribedTaskFlexionLimitingFactor[] = [
  "comfortable",
  "incision_scar_tension",
  "swelling_fullness",
  "joint_pinch",
  "pain",
  "unknown",
];

const extensionAfterOptions: PrescribedTaskExtensionAfter[] = [
  "relaxed_neutral",
  "stiff",
  "painful_pinching",
  "not_tested",
];

const limitationReasonOptions = [
  "symptoms",
  "fatigue",
  "time",
  "confidence",
  "unclear_prescription",
  "other",
];

const skippedReasonOptions = [
  "symptoms",
  "time_or_energy",
  "not_needed_today",
  "forgot",
  "unclear_prescription",
  "other",
];

function taskResponseKind(task: PrescribedTask): TaskResponseKind {
  if (task.category === "walking" || task.category === "gait") return "walking_gait";
  if (task.category === "activation") return "activation";
  if (task.category === "skill_test") return "skill_control";
  if (task.category === "rom_flexion") return "rom_flexion";
  if (task.category === "rom_extension") return "rom_extension";
  return "recovery_basics";
}

function isRecoveryBasicsTask(task: PrescribedTask): boolean {
  return taskResponseKind(task) === "recovery_basics";
}

function dosePatchForCompletedTask(task: PrescribedTask): Partial<PrescribedTaskCompletion> {
  return {
    actualSets: task.prescription.sets,
    actualReps: task.prescription.reps,
    actualDurationMinutes: task.prescription.durationMinutes,
  };
}

function buildTaskStatusPatch(
  task: PrescribedTask,
  status: PrescribedTaskCompletionStatus,
  completion: PrescribedTaskCompletion,
): Partial<PrescribedTaskCompletion> {
  if (status === "completed") {
    return {
      status,
      ...dosePatchForCompletedTask(task),
      partialEstimate: undefined,
      limitationReason: undefined,
      skippedReason: undefined,
    };
  }
  if (status === "partial") {
    return {
      status,
      actualSets: undefined,
      actualReps: undefined,
      actualDurationMinutes: undefined,
      partialEstimate: completion.partialEstimate ?? "about_half",
      skippedReason: undefined,
    };
  }
  if (status === "skipped") {
    return {
      status,
      actualSets: undefined,
      actualReps: undefined,
      actualDurationMinutes: undefined,
      partialEstimate: undefined,
      limitationReason: undefined,
      afterEffect: undefined,
      gaitQuality: undefined,
      supportUsed: undefined,
      activationQuality: undefined,
      controlQuality: undefined,
      limitingFactor: undefined,
      flexionEstimateDegrees: undefined,
      extensionAfter: undefined,
    };
  }
  return {
    status,
    actualSets: undefined,
    actualReps: undefined,
    actualDurationMinutes: undefined,
    partialEstimate: undefined,
    limitationReason: undefined,
    skippedReason: undefined,
  };
}

function TaskSelect<T extends string>({
  value,
  options,
  placeholder = "Select",
  onChange,
}: {
  value: T | undefined;
  options: readonly T[];
  placeholder?: string;
  onChange: (value: T | undefined) => void;
}) {
  return (
    <SelectInput
      value={value ?? ""}
      onChange={(event) => onChange(event.target.value ? (event.target.value as T) : undefined)}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {formatOption(option)}
        </option>
      ))}
    </SelectInput>
  );
}

function PrescribedTaskResponseSection({
  tasks,
  e,
  updateTask,
}: {
  tasks: PrescribedTask[];
  e: EveningCheckIn;
  updateTask: (task: PrescribedTask, patch: Partial<PrescribedTaskCompletion>) => void;
}) {
  if (tasks.length === 0) return null;
  return (
    <div className="mb-6 rounded-xl border border-border bg-background/30 p-4">
      <div className="mb-3">
        <div className="text-sm font-semibold tracking-tight">Prescribed task responses</div>
        <div className="mt-1 text-xs text-muted-foreground">
          Record what actually happened so tomorrow's plan can adjust from adherence and tolerance.
        </div>
      </div>
      <div className="space-y-3">
        {tasks.map((task) => {
          const completion = e.taskCompletions?.[task.id] ?? task.completion;
          const responseKind = taskResponseKind(task);
          const showResponseFields =
            completion.status === "completed" || completion.status === "partial";
          return (
            <div key={task.id} className="rounded-lg border border-border/80 bg-card/40 p-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium">{task.title}</div>
                  <div className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {taskPrescriptionSummary(task)}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {taskStatusOptions.map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() =>
                        updateTask(
                          task,
                          buildTaskStatusPatch(
                            task,
                            completion.status === status ? "not_started" : status,
                            completion,
                          ),
                        )
                      }
                      className={cn(
                        "rounded-md border px-2.5 py-1.5 text-[11px] font-medium transition",
                        completion.status === status
                          ? "border-phoenix bg-phoenix/15 text-phoenix"
                          : "border-border text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {status === "completed" ? "Completed" : formatOption(status)}
                    </button>
                  ))}
                </div>
              </div>

              {completion.status === "not_started" && (
                <div className="mt-3 text-xs text-muted-foreground">
                  Choose Completed, Partial, or Skipped after you know how this task went.
                </div>
              )}

              {completion.status === "partial" && !isRecoveryBasicsTask(task) && (
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <Field label="Completion estimate">
                    <TaskSelect
                      value={completion.partialEstimate}
                      options={partialEstimateOptions}
                      onChange={(value) =>
                        updateTask(task, {
                          partialEstimate: value,
                          actualSets: value === "custom" ? completion.actualSets : undefined,
                          actualReps: value === "custom" ? completion.actualReps : undefined,
                          actualDurationMinutes:
                            value === "custom" ? completion.actualDurationMinutes : undefined,
                        })
                      }
                    />
                  </Field>
                  <Field label="Limitation reason">
                    <TaskSelect
                      value={completion.limitationReason}
                      options={limitationReasonOptions}
                      onChange={(value) => updateTask(task, { limitationReason: value })}
                    />
                  </Field>
                  {completion.partialEstimate === "custom" && (
                    <CustomDoseFields task={task} completion={completion} updateTask={updateTask} />
                  )}
                </div>
              )}

              {completion.status === "skipped" && (
                <div className="mt-3">
                  <Field label="Skipped reason">
                    <TaskSelect
                      value={completion.skippedReason}
                      options={skippedReasonOptions}
                      onChange={(value) => updateTask(task, { skippedReason: value })}
                    />
                  </Field>
                </div>
              )}

              {showResponseFields && !isRecoveryBasicsTask(task) && (
                <TaskToleranceFields
                  task={task}
                  responseKind={responseKind}
                  completion={completion}
                  updateTask={updateTask}
                />
              )}

              {completion.status !== "not_started" && (
                <div className="mt-3">
                  <TextArea
                    value={completion.notes ?? ""}
                    onChange={(event) => updateTask(task, { notes: event.target.value })}
                    placeholder={
                      completion.status === "skipped"
                        ? "Anything tomorrow's plan should know?"
                        : "What should tomorrow's plan know?"
                    }
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CustomDoseFields({
  task,
  completion,
  updateTask,
}: {
  task: PrescribedTask;
  completion: PrescribedTaskCompletion;
  updateTask: (task: PrescribedTask, patch: Partial<PrescribedTaskCompletion>) => void;
}) {
  const kind = taskResponseKind(task);
  const showSets = kind === "activation" || kind === "rom_flexion";
  const showReps = kind === "activation" || kind === "skill_control" || kind === "rom_flexion";
  const showMinutes = kind === "walking_gait" || kind === "rom_extension";

  return (
    <>
      {showSets && (
        <Field label="Actual sets">
          <TaskNumberInput
            value={completion.actualSets}
            onChange={(value) => updateTask(task, { actualSets: value })}
          />
        </Field>
      )}
      {showReps && (
        <Field label={kind === "skill_control" ? "Reps completed" : "Actual reps"}>
          <TaskNumberInput
            value={completion.actualReps}
            onChange={(value) => updateTask(task, { actualReps: value })}
          />
        </Field>
      )}
      {showMinutes && (
        <Field label="Actual minutes">
          <TaskNumberInput
            value={completion.actualDurationMinutes}
            onChange={(value) => updateTask(task, { actualDurationMinutes: value })}
          />
        </Field>
      )}
    </>
  );
}

function TaskToleranceFields({
  task,
  responseKind,
  completion,
  updateTask,
}: {
  task: PrescribedTask;
  responseKind: TaskResponseKind;
  completion: PrescribedTaskCompletion;
  updateTask: (task: PrescribedTask, patch: Partial<PrescribedTaskCompletion>) => void;
}) {
  if (responseKind === "walking_gait") {
    return (
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <Field label="Gait quality">
          <TaskSelect
            value={completion.gaitQuality}
            options={gaitQualityOptions}
            onChange={(value) => updateTask(task, { gaitQuality: value })}
          />
        </Field>
        <Field label="Support used">
          <TaskSelect
            value={completion.supportUsed}
            options={supportUsedOptions}
            onChange={(value) => updateTask(task, { supportUsed: value })}
          />
        </Field>
        <AfterEffectField task={task} completion={completion} updateTask={updateTask} />
      </div>
    );
  }

  if (responseKind === "activation") {
    return (
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <Field label="Activation quality">
          <TaskSelect
            value={completion.activationQuality}
            options={activationQualityOptions}
            onChange={(value) => updateTask(task, { activationQuality: value })}
          />
        </Field>
        <AfterEffectField task={task} completion={completion} updateTask={updateTask} />
      </div>
    );
  }

  if (responseKind === "skill_control") {
    return (
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <Field label="Control quality">
          <TaskSelect
            value={completion.controlQuality}
            options={controlQualityOptions}
            onChange={(value) => updateTask(task, { controlQuality: value })}
          />
        </Field>
        <AfterEffectField task={task} completion={completion} updateTask={updateTask} />
      </div>
    );
  }

  if (responseKind === "rom_flexion") {
    return (
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <Field label="Limiting factor">
          <TaskSelect
            value={completion.limitingFactor}
            options={taskFlexionLimitingFactorOptions}
            onChange={(value) => updateTask(task, { limitingFactor: value })}
          />
        </Field>
        <AfterEffectField task={task} completion={completion} updateTask={updateTask} />
        <Field label="Flexion estimate" hint="Optional degrees">
          <TaskNumberInput
            value={completion.flexionEstimateDegrees}
            max={160}
            onChange={(value) => updateTask(task, { flexionEstimateDegrees: value })}
          />
        </Field>
      </div>
    );
  }

  if (responseKind === "rom_extension") {
    return (
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <Field label="Extension after">
          <TaskSelect
            value={completion.extensionAfter}
            options={extensionAfterOptions}
            onChange={(value) => updateTask(task, { extensionAfter: value })}
          />
        </Field>
        <AfterEffectField task={task} completion={completion} updateTask={updateTask} />
      </div>
    );
  }

  return null;
}

function AfterEffectField({
  task,
  completion,
  updateTask,
}: {
  task: PrescribedTask;
  completion: PrescribedTaskCompletion;
  updateTask: (task: PrescribedTask, patch: Partial<PrescribedTaskCompletion>) => void;
}) {
  return (
    <Field label="After-effect">
      <TaskSelect
        value={completion.afterEffect}
        options={afterEffectOptions}
        onChange={(value) => updateTask(task, { afterEffect: value })}
      />
    </Field>
  );
}

const skillResponseOptions: Array<NonNullable<SkillTestResult["swellingResponse"]>> = [
  "not_assessed",
  "same",
  "better",
  "worse",
  "unknown",
];

function booleanSelectValue(value: boolean | undefined): string {
  if (value === true) return "yes";
  if (value === false) return "no";
  return "unknown";
}

function booleanFromSelect(value: string): boolean | undefined {
  if (value === "yes") return true;
  if (value === "no") return false;
  return undefined;
}

function SkillTestResponseSection({
  tests,
  e,
  updateTest,
}: {
  tests: SkillTest[];
  e: EveningCheckIn;
  updateTest: (test: SkillTest, patch: Partial<SkillTestResult>) => void;
}) {
  if (tests.length === 0) return null;
  return (
    <div className="mb-6 rounded-xl border border-warning/30 bg-warning/5 p-4">
      <div className="mb-3">
        <div className="text-sm font-semibold tracking-tight">Skill test responses</div>
        <div className="mt-1 text-xs text-muted-foreground">
          Record optional tests separately from required quests so pending milestones can be
          confirmed tomorrow.
        </div>
      </div>
      <div className="space-y-3">
        {tests.map((test) => {
          const result = e.skillTestResults?.[test.id] ?? test.result;
          const attemptStatus = result.attemptedAt
            ? result.completed
              ? "completed"
              : "attempted"
            : "not_attempted";
          return (
            <div key={test.id} className="rounded-lg border border-border/80 bg-card/40 p-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium">{test.title}</div>
                  <div className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {test.testDose.instructions}
                  </div>
                </div>
                <select
                  value={attemptStatus}
                  onChange={(event) => {
                    const value = event.target.value;
                    if (value === "not_attempted") return;
                    updateTest(test, {
                      completed: value === "completed",
                      repsCompleted: result.repsCompleted ?? test.testDose.reps,
                    });
                  }}
                  className="rounded-lg border border-border bg-background/40 px-2 py-1.5 text-sm outline-none focus:border-phoenix"
                >
                  <option value="not_attempted">Not attempted</option>
                  <option value="attempted">Attempted</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <Field label="Reps completed">
                  <TaskNumberInput
                    value={result.repsCompleted}
                    onChange={(value) => updateTest(test, { repsCompleted: value })}
                  />
                </Field>
                <Field label="Pain during">
                  <TaskNumberInput
                    value={result.painDuring}
                    max={10}
                    onChange={(value) => updateTest(test, { painDuring: value })}
                  />
                </Field>
                <Field label="Pain after">
                  <TaskNumberInput
                    value={result.painAfter}
                    max={10}
                    onChange={(value) => updateTest(test, { painAfter: value })}
                  />
                </Field>
                <Field label="Quality / control" hint="1 — 5">
                  <TaskNumberInput
                    value={result.qualityScore}
                    min={1}
                    max={5}
                    onChange={(value) => updateTest(test, { qualityScore: value })}
                  />
                </Field>
                <Field label="Any lag?">
                  <SelectInput
                    value={booleanSelectValue(result.lagObserved)}
                    onChange={(event) =>
                      updateTest(test, { lagObserved: booleanFromSelect(event.target.value) })
                    }
                  >
                    <option value="unknown">Unknown</option>
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </SelectInput>
                </Field>
                <Field label="Controlled?">
                  <SelectInput
                    value={booleanSelectValue(result.feltControlled)}
                    onChange={(event) =>
                      updateTest(test, { feltControlled: booleanFromSelect(event.target.value) })
                    }
                  >
                    <option value="unknown">Unknown</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </SelectInput>
                </Field>
                <Field label="Irritation?">
                  <SelectInput
                    value={booleanSelectValue(result.irritation)}
                    onChange={(event) =>
                      updateTest(test, { irritation: booleanFromSelect(event.target.value) })
                    }
                  >
                    <option value="unknown">Unknown</option>
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </SelectInput>
                </Field>
                <Field label="Swelling response">
                  <SelectInput
                    value={result.swellingResponse ?? "unknown"}
                    onChange={(event) =>
                      updateTest(test, {
                        swellingResponse: event.target.value as NonNullable<
                          SkillTestResult["swellingResponse"]
                        >,
                      })
                    }
                  >
                    {skillResponseOptions.map((option) => (
                      <option key={option} value={option}>
                        {formatOption(option)}
                      </option>
                    ))}
                  </SelectInput>
                </Field>
                <Field label="Walking response">
                  <SelectInput
                    value={result.walkingResponse ?? "unknown"}
                    onChange={(event) =>
                      updateTest(test, {
                        walkingResponse: event.target.value as NonNullable<
                          SkillTestResult["walkingResponse"]
                        >,
                      })
                    }
                  >
                    {skillResponseOptions.map((option) => (
                      <option key={option} value={option}>
                        {formatOption(option)}
                      </option>
                    ))}
                  </SelectInput>
                </Field>
              </div>
              <div className="mt-3">
                <TextArea
                  value={result.notes ?? ""}
                  onChange={(event) => updateTest(test, { notes: event.target.value })}
                  placeholder="Was there lag, guarding, irritation, or worse walking afterward?"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CheckInPage() {
  const s = usePhoenix();
  const today = getLocalDateKey();
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
  const prescribedTasks = dailyQuestsForDate(s, selectedDate)
    .flatMap((quest) => quest.prescribedTasks ?? [])
    .filter((task) => task.category !== "check_in_morning" && task.category !== "check_in_evening");
  const skillTests = skillTestsForDate(s, selectedDate);
  const hasMorning = Boolean(savedMorning);
  const hasEvening = Boolean(savedEvening);

  const updateMorning = (patch: Partial<typeof m>) =>
    saveMorningCheckIn({
      ...m,
      ...patch,
      date: selectedDate,
      localDate: selectedDate,
      phaseId: phase.id,
    });
  const updateEvening = (patch: Partial<typeof e>) =>
    saveEveningCheckIn({
      ...e,
      ...patch,
      date: selectedDate,
      localDate: selectedDate,
      phaseId: phase.id,
    });
  const updateTask = (task: PrescribedTask, patch: Partial<PrescribedTaskCompletion>) => {
    const previous = e.taskCompletions?.[task.id] ?? task.completion;
    const next = {
      ...previous,
      ...patch,
      status: patch.status ?? previous.status,
    };
    updatePrescribedTaskCompletion(selectedDate, task.id, next);
    updateEvening({
      taskCompletions: {
        ...(e.taskCompletions ?? {}),
        [task.id]: next,
      },
    });
  };
  const updateSkillTest = (test: SkillTest, patch: Partial<SkillTestResult>) => {
    const previous = e.skillTestResults?.[test.id] ?? test.result;
    const next = {
      ...previous,
      ...patch,
      attemptedAt: patch.attemptedAt ?? previous.attemptedAt ?? getUtcTimestamp(),
      completed: patch.completed ?? previous.completed,
    };
    updateSkillTestResult(selectedDate, test.id, next);
    updateEvening({
      skillTestResults: {
        ...(e.skillTestResults ?? {}),
        [test.id]: next,
      },
    });
  };

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
          <PrescribedTaskResponseSection tasks={prescribedTasks} e={e} updateTask={updateTask} />
          <SkillTestResponseSection tests={skillTests} e={e} updateTest={updateSkillTest} />
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
