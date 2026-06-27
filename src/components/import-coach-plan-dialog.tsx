import { useState } from "react";
import {
  activateDailyCoachPlan,
  parseDailyCoachPlanJson,
  type DailyCoachPlan,
} from "@/lib/phoenix-data";
import { cn } from "@/lib/utils";
import { CheckCircle2, ClipboardPaste, X } from "lucide-react";

const exampleJson = `{
  "date": "2026-06-26",
  "source": "ChatGPT",
  "authorName": "ChatGPT",
  "planType": "daily_coach_plan",
  "readiness": "modify_positive",
  "primaryFocus": "Activation + early ROM without provoking swelling.",
  "targets": [
    { "label": "Quad activation", "value": "Quality sets before fatigue" },
    { "label": "ROM", "value": "Comfortable extension and heel slides" }
  ],
  "quests": [
    {
      "id": "activation-rom-work",
      "label": "Activation + ROM work",
      "objectiveGroup": "activation",
      "kind": "main",
      "xp": 20,
      "prescribedTasks": [
        {
          "id": "quad-sets",
          "title": "Quad sets",
          "category": "activation",
          "prescription": {
            "sets": 3,
            "reps": 10,
            "holdSeconds": 5,
            "effortTarget": "5-6/10",
            "qualityTarget": "Repeatable contraction, no pain spike"
          },
          "stopRules": ["Stop if pain rises above 4/10 or contraction fades sharply."]
        },
        {
          "id": "heel-slides",
          "title": "Heel slides",
          "category": "rom_flexion",
          "prescription": {
            "sets": 2,
            "reps": 10,
            "rangeInstruction": "Comfortable range only; no strap pulling or forcing end range",
            "qualityTarget": "Easy flexion exposure, not max range"
          },
          "stopRules": ["Stop if sharp pain, pinching, or swelling response appears."]
        }
      ]
    },
    {
      "id": "evening-check-in",
      "label": "Evening response check-in",
      "objectiveGroup": "evening_check_in",
      "kind": "main",
      "xp": 10
    }
  ],
  "skillTests": [
    {
      "id": "slr-test-dose",
      "date": "2026-06-26",
      "relatedMilestoneId": "straight_leg_raise_no_lag",
      "title": "Straight leg raise test dose",
      "description": "Optional skill-control check only if criteria are met.",
      "status": "available",
      "progressionType": "skill_control",
      "testDose": {
        "sets": 1,
        "reps": 3,
        "instructions": "Lock knee first. Stop immediately if lag, guarding, pain, or irritation appears."
      },
      "passCriteria": ["No lag", "Controlled lift", "No pain spike", "No worse walking afterward"],
      "stopRules": ["Stop if lag appears.", "Stop if pain rises above 3/10."],
      "responseRequired": {
        "eveningCheckInRequired": true,
        "nextMorningCheckInRequired": true
      }
    }
  ],
  "milestoneUpdates": [
    {
      "milestoneId": "straight_leg_raise_no_lag",
      "state": "test_passed_pending_confirmation",
      "summary": "SLR test dose completed successfully; pending evening and next-morning response.",
      "nextStepIfConfirmed": "Add SLR 1x5 clean reps tomorrow, no load.",
      "nextStepIfNotConfirmed": "Keep SLR possible but not doseable; return to quad sets only."
    }
  ],
  "nextUnlocks": [
    {
      "milestoneId": "straight_leg_raise_no_lag",
      "title": "Straight Leg Raise - No Lag",
      "state": "test_passed_pending_confirmation",
      "evidenceNeeded": [
        "evening pain <= 3",
        "swelling stable or improved",
        "extension neutral",
        "walking not worse",
        "next morning baseline stable"
      ],
      "nextStepIfConfirmed": "Tomorrow may add SLR 1x5 clean reps, no load.",
      "nextStepIfNotConfirmed": "Keep SLR possible but not doseable."
    }
  ],
  "stopRules": [
    "Stop if pain rises above 4/10.",
    "Stop if swelling or walking quality worsens."
  ],
  "eveningCheckInFocus": ["Pain after activity", "Swelling change"],
  "notes": "Structured import only. No AI is connected inside the app."
}`;

export function ImportCoachPlanDialog({
  selectedDate,
  onClose,
}: {
  selectedDate: string;
  onClose: () => void;
}) {
  const [raw, setRaw] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [plan, setPlan] = useState<DailyCoachPlan | null>(null);
  const [imported, setImported] = useState(false);

  const validate = () => {
    const result = parseDailyCoachPlanJson(raw, selectedDate);
    if (!result.ok) {
      setErrors(result.errors);
      setPlan(null);
      return;
    }

    setErrors([]);
    setPlan(result.plan);
  };

  const activate = () => {
    if (!plan) return;
    activateDailyCoachPlan(plan);
    setImported(true);
    setTimeout(onClose, 700);
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="surface-card flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-phoenix">
              Daily Coach Plan
            </div>
            <div className="text-base font-semibold">Import Coach Plan JSON</div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-5">
          <textarea
            value={raw}
            onChange={(event) => {
              setRaw(event.target.value);
              setPlan(null);
              setImported(false);
            }}
            placeholder={exampleJson}
            className="min-h-[320px] w-full rounded-xl border border-border bg-background/40 p-4 font-mono text-xs leading-relaxed outline-none focus:border-phoenix"
          />

          {errors.length > 0 && (
            <div className="mt-4 rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
              <div className="font-medium">Validation failed</div>
              <ul className="mt-2 list-inside list-disc space-y-1">
                {errors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {plan && !imported && (
            <div className="mt-4 rounded-xl border border-phoenix/30 bg-phoenix/5 p-4">
              <div className="text-sm font-semibold">Activate this coach plan for today?</div>
              <div className="mt-2 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
                <PreviewRow label="Date" value={plan.date} />
                <PreviewRow label="Source" value={plan.authorName ?? plan.source} />
                <PreviewRow label="Readiness" value={plan.readiness} />
                <PreviewRow label="Quests" value={String(plan.quests.length)} />
                <PreviewRow label="Skill tests" value={String(plan.skillTests.length)} />
                <PreviewRow label="Next unlocks" value={String(plan.nextUnlocks.length)} />
              </div>
              <div className="mt-3 text-sm">{plan.primaryFocus}</div>
            </div>
          )}

          {imported && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-success/40 bg-success/10 p-3 text-sm text-success">
              <CheckCircle2 className="h-4 w-4" />
              Coach plan activated.
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-4">
          <div className="text-xs text-muted-foreground">
            Selected date: <span className="text-foreground">{selectedDate}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={validate}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm hover:bg-accent"
            >
              <ClipboardPaste className="h-4 w-4" />
              Validate JSON
            </button>
            <button
              onClick={activate}
              disabled={!plan || imported}
              className={cn(
                "rounded-lg bg-gradient-phoenix px-3 py-2 text-sm font-medium text-phoenix-foreground",
                (!plan || imported) && "cursor-not-allowed opacity-50",
              )}
            >
              Activate plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/80 bg-background/40 p-2">
      <div className="text-[10px] font-medium uppercase tracking-[0.14em]">{label}</div>
      <div className="mt-0.5 text-foreground">{value}</div>
    </div>
  );
}
