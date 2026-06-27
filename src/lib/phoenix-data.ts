import { useSyncExternalStore } from "react";

// ============================================================
// Phoenix OS — types, seed data, and tiny localStorage store.
// All data is local for v1; structure mirrors a future API.
// ============================================================

export type MissionId =
  | "calm-the-knee"
  | "wake-the-quad"
  | "restore-extension"
  | "normalize-walking"
  | "build-capacity"
  | "become-an-athlete-again";

export type CampaignId = "acl-revision-prehab";

export type PhaseId =
  | "acute-response"
  | "activation-early-rom"
  | "movement-capacity"
  | "strength-capacity"
  | "return-preparation";

export type RecoveryTrackId =
  | "symptoms"
  | "rom"
  | "activation"
  | "walking-movement"
  | "capacity"
  | "return-to-sport";

export type MetricId =
  | "pain"
  | "swelling-level"
  | "swelling-trend"
  | "walking-confidence"
  | "movement-quality"
  | "quad-activation-quality"
  | "extension-status"
  | "flexion-status"
  | "sleep-hours"
  | "protein-target"
  | "session-tolerance"
  | "training-readiness"
  | "sport-confidence"
  | "next-morning-response";

export type CheckInFieldId =
  | "pain"
  | "swelling"
  | "swelling-context"
  | "swelling-trend"
  | "walking-confidence"
  | "confidence-in-knee"
  | "quad-activation-quality"
  | "extension-status"
  | "flexion-status"
  | "extension-response"
  | "flexion-response"
  | "movement-quality"
  | "training-readiness"
  | "sport-confidence"
  | "sleep-hours"
  | "protein-target"
  | "exercises-completed"
  | "pain-during"
  | "pain-after"
  | "swelling-change"
  | "concerning-symptoms"
  | "energy-fatigue"
  | "milestones"
  | "notes";

export type SwellingContext = "surgical_baseline" | "activity_response" | "unknown";
export type SwellingTrend = "improved" | "stable" | "worse" | "unknown";

export type MetricDirection = "lower-better" | "higher-better";

export type ExtensionStatus =
  | "not_tested"
  | "reaches_neutral"
  | "slightly_limited"
  | "moderately_limited"
  | "significantly_limited";

export type FlexionStatus =
  | "not_tested"
  | "comfortable_gentle_bend"
  | "stiff_but_tolerable"
  | "painful_or_pinching";

export type RangeResponse =
  | "not_tested"
  | "felt_same"
  | "felt_better"
  | "felt_stiffer"
  | "painful_or_pinching";

export interface Campaign {
  id: CampaignId;
  name: string;
  athleteName: string;
  surgeryType?: string;
  startedAt: string;
  surgeryDate: string;
  activePhaseId: PhaseId;
  activeMissionIds: MissionId[];
}

export interface MetricDefinition {
  id: MetricId;
  label: string;
  direction?: MetricDirection;
  unit?: string;
}

export interface QuestTemplateDefault {
  id: string;
  label: string;
  kind: QuestKind;
  xp: number;
  reason: string;
}

export interface PhaseRule {
  id: string;
  label: string;
  description: string;
}

export interface RecoveryTrack {
  id: RecoveryTrackId;
  name: string;
  description: string;
  order: number;
}

export interface Phase {
  id: PhaseId;
  name: string;
  order: number;
  dashboardQuestion: string;
  activeTrackIds: RecoveryTrackId[];
  primaryMetrics: MetricId[];
  supportingMetrics: MetricId[];
  morningCheckInFields: CheckInFieldId[];
  eveningCheckInFields: CheckInFieldId[];
  questTemplateIds: string[];
  questTemplateDefaults: QuestTemplateDefault[];
  readinessRuleIds: string[];
  readinessRules: PhaseRule[];
  smallWinRuleIds: string[];
  smallWinRules: PhaseRule[];
  placeholder?: boolean;
}

export interface Mission {
  id: MissionId;
  name: string;
  tagline: string;
  phaseId: PhaseId;
  trackIds: RecoveryTrackId[];
  objective: string;
  whyItMatters: string;
  why: string;
  estDuration?: string;
  phase: string;
  progress: number; // 0-100
  criteria: string[];
  milestoneIds: string[];
  possibleQuestIds: string[];
  nextUnlock: string;
  status: "locked" | "active" | "complete";
}

export interface Milestone {
  id: string;
  mission: MissionId;
  missionId: MissionId;
  trackId: RecoveryTrackId;
  name: string;
  description: string;
  why: string;
  evidence: string;
  criteria: string[];
  status: "locked" | "in-progress" | "unlocked";
  unlockedAt?: string;
  coachNotes?: string;
}

export interface MorningCheckIn {
  date: string;
  localDate?: string;
  timestampUtc?: string;
  phaseId?: PhaseId;
  pain: number;
  swelling: number;
  swellingLevel?: number;
  swellingTrend?: SwellingTrend;
  swellingContext?: SwellingContext;
  walkingConfidence: number;
  extensionStatus: ExtensionStatus;
  flexionStatus: FlexionStatus;
  sleepHours: number;
  weightKg: number;
  proteinTargetG: number;
  confidence: number;
  movementQuality?: number;
  trainingReadiness?: number;
  sportConfidence?: number;
  notes: string;
}

export interface EveningCheckIn {
  date: string;
  localDate?: string;
  timestampUtc?: string;
  phaseId?: PhaseId;
  exercisesCompleted: string;
  painDuring: number;
  painDuringActivity?: number;
  painAfter: number;
  painAfterActivity?: number;
  swellingChange: number; // -3..+3
  walkingConfidence: number;
  walkingConfidenceAfter?: number;
  quadActivationQuality: number;
  extensionResponse: RangeResponse;
  flexionResponse: RangeResponse;
  concerningSymptoms: string;
  movementQualityAfter?: number;
  energyFatigue?: number;
  milestones: string;
  todayWin?: string;
  notes: string;
}

export interface CheckIn {
  id: string;
  date: string;
  localDate?: string;
  timestampUtc?: string;
  phaseId: PhaseId;
  morning?: MorningCheckIn;
  evening?: EveningCheckIn;
}

export type QuestKind = "main" | "side";

export type QuestSource =
  | "phase"
  | "track"
  | "rule"
  | "manual"
  | "daily-coach-plan"
  | "post-op-default"
  | "date"
  | "mission"
  | "morning-check-in"
  | "previous-evening"
  | "clinician-constraint"
  | "baseline";

export type QuestStatus = "pending" | "complete" | "skipped";

export interface Quest {
  id: string;
  date: string;
  localDate?: string;
  timestampUtc?: string;
  label: string;
  title?: string;
  done: boolean;
  status?: QuestStatus;
  xp: number;
  kind: QuestKind;
  category?: QuestKind;
  source: QuestSource;
  reason: string;
  details?: string[];
  sourceLabel?: string;
  relatedQuestIds?: string[];
  phaseId?: PhaseId;
  trackIds?: RecoveryTrackId[];
  missionId?: MissionId;
  planId?: string;
  target?: string;
}

export type DailyQuest = Quest;

export interface ClinicianConstraint {
  id: string;
  label: string;
  reason?: string;
  active?: boolean;
  kind?: QuestKind;
  xp?: number;
  questLabel?: string;
  blockedQuestIds?: string[];
  blockedLabelIncludes?: string[];
}

export type CoachNoteSource = "ChatGPT" | "physio" | "surgeon" | "trainer" | "other";

export type CoachNoteType =
  | "evening_review"
  | "physio_note"
  | "surgeon_note"
  | "restriction"
  | "milestone"
  | "general";

export type CoachNoteAppliesTo = "today" | "current_phase" | "until_next_appointment" | "custom";

export type CoachNotePriority = "normal" | "important" | "override";

export interface CoachNote {
  id: string;
  date: string;
  localDate?: string;
  timestampUtc?: string;
  source: CoachNoteSource;
  noteType: CoachNoteType;
  authorName?: string;
  summary: string;
  fullNote: string;
  nextFocus?: string;
  appliesTo: CoachNoteAppliesTo;
  priority: CoachNotePriority;
  relatedPhaseId?: PhaseId;
  relatedMissionIds?: MissionId[];
  relatedTrackIds?: RecoveryTrackId[];
  tags?: string[];
  createdAt: string;
}

export interface AthleteNote {
  id: string;
  date: string;
  localDate?: string;
  timestampUtc?: string;
  body: string;
  relatedPhaseId?: PhaseId;
  relatedMissionIds?: MissionId[];
  relatedTrackIds?: RecoveryTrackId[];
  tags?: string[];
  createdAt: string;
}

export type RecoveryIqEventSourceType =
  | "check_in"
  | "quest"
  | "coach_plan"
  | "milestone"
  | "small_win"
  | "smart_decision"
  | "manual_adjustment";

export interface RecoveryIqEvent {
  id: string;
  date: string;
  localDate?: string;
  timestamp: string;
  timestampUtc?: string;
  sourceType: RecoveryIqEventSourceType;
  sourceId?: string;
  title: string;
  description?: string;
  xpAmount: number;
  createdAt: string;
}

export type SmallWinSource = "rule" | "manual" | "daily-coach-plan";

export interface SmallWin {
  id: string;
  date: string;
  localDate?: string;
  timestampUtc?: string;
  title: string;
  description: string;
  source: SmallWinSource;
  relatedMetric?: MetricId;
}

export interface DailyCoachPlanTarget {
  id: string;
  label: string;
  value: string;
  trackId?: RecoveryTrackId;
  reason?: string;
}

export type DailyCoachPlanSource = "ChatGPT" | "physio" | "surgeon" | "trainer" | "self" | "other";

export type DailyCoachPlanStatus = "draft" | "active" | "archived" | "replaced";

export interface DailyCoachPlan {
  id: string;
  date: string;
  localDate?: string;
  timestampUtc?: string;
  source: DailyCoachPlanSource;
  authorName?: string;
  importedFromNoteId?: string;
  createdAt: string;
  importedAt: string;
  planType: "daily_coach_plan";
  phaseId: PhaseId;
  missionIds: MissionId[];
  trackIds: RecoveryTrackId[];
  readiness: "ready" | "modify" | "recover";
  readinessReason?: string;
  primaryFocus: string;
  focus: string;
  priority: string;
  workload: string;
  rationale: string;
  nextReassessment: string;
  confidence: "High" | "Medium" | "Low";
  targets: DailyCoachPlanTarget[];
  quests: DailyQuest[];
  stopRules: string[];
  eveningCheckInFocus: string[];
  notes: string;
  status: DailyCoachPlanStatus;
  coachNoteIds?: string[];
}

export type CoachPacketKind = "morning" | "evening" | "daily";

export interface CoachPacket {
  id: string;
  kind: CoachPacketKind;
  date: string;
  localDate?: string;
  timestampUtc?: string;
  generatedAt: string;
  athlete: string;
  campaign: {
    id: CampaignId;
    name: string;
    recoveryDay: number;
  };
  phase: {
    id: PhaseId;
    name: string;
    dashboardQuestion: string;
  };
  activeTracks: Pick<RecoveryTrack, "id" | "name">[];
  currentMissions: Pick<Mission, "id" | "name" | "objective">[];
  recoveryIq: { level: number; xp: number };
  readiness: {
    status: "ready" | "modify" | "recover";
    label: string;
    summary: string;
    reason?: string;
  };
  morning: MorningCheckIn | null;
  previousMorning: MorningCheckIn | null;
  previousEvening: EveningCheckIn | null;
  evening?: EveningCheckIn | null;
  dailyCoachPlan?: DailyCoachPlan;
  smallWin?: SmallWin;
  milestones: {
    name: string;
    status: Milestone["status"];
    unlockedAt: string | null;
  }[];
  dailyQuests: {
    date: string;
    label: string;
    done: boolean;
    kind: QuestKind;
    source: QuestSource;
    reason: string;
    details?: string[];
    sourceLabel?: string;
  }[];
  completedToday: string[];
  pendingToday: string[];
  coachNotesRecent: CoachNote[];
  athleteNotesRecent: AthleteNote[];
  questionsForCoach: string[];
  currentConcerns: string;
  lastCoachFocus: string | null;
}

export interface PhoenixState {
  campaign: Campaign;
  phases: Phase[];
  recoveryTracks: RecoveryTrack[];
  missions: Mission[];
  currentMissionId: MissionId;
  /** @deprecated Recovery IQ is derived from recoveryIqEvents. */
  recoveryIqXp: number;
  morning: MorningCheckIn | null;
  evening: EveningCheckIn | null;
  checkIns: CheckIn[];
  history: { morning: MorningCheckIn[]; evening: EveningCheckIn[] };
  milestones: Milestone[];
  todayQuests: DailyQuest[];
  dailyCoachPlans: DailyCoachPlan[];
  coachNotes: CoachNote[];
  athleteNotes: AthleteNote[];
  recoveryIqEvents: RecoveryIqEvent[];
  smallWins: SmallWin[];
  coachPackets: CoachPacket[];
  questCompletions?: Record<string, Record<string, boolean>>;
  clinicianConstraints?: ClinicianConstraint[];
  todayRecommendation: {
    priority: string;
    workload: string;
    reason: string;
    nextReassessment: string;
    confidence: "High" | "Medium" | "Low";
  };
  athleteName: string;
  surgeryDate: string; // ISO yyyy-mm-dd
  campaignName: string;
}

// ---------- seed ----------
function padDatePart(value: number): string {
  return String(value).padStart(2, "0");
}

export function getLocalDateKey(date = new Date()): string {
  return `${date.getFullYear()}-${padDatePart(date.getMonth() + 1)}-${padDatePart(date.getDate())}`;
}

export function getUtcTimestamp(date = new Date()): string {
  return date.toISOString();
}

export function getDetectedTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "unknown";
}

function localDateFromTimestampUtc(value: string | undefined): string {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : getLocalDateKey(date);
}

function dailyRecordDate(record: { date: string; localDate?: string }): string {
  return record.localDate || record.date;
}

export const RECOVERY_TRACKS: RecoveryTrack[] = [
  {
    id: "symptoms",
    name: "Symptoms",
    description: "Pain, swelling, warmth, and tissue response.",
    order: 1,
  },
  {
    id: "rom",
    name: "ROM",
    description: "Extension and flexion restored without symptom escalation.",
    order: 2,
  },
  {
    id: "activation",
    name: "Activation",
    description: "Voluntary quad signal, lock-out control, and early neuromuscular control.",
    order: 3,
  },
  {
    id: "walking-movement",
    name: "Walking / Movement",
    description: "Gait quality, support level, confidence, and basic movement quality.",
    order: 4,
  },
  {
    id: "capacity",
    name: "Capacity",
    description: "Tolerance for load, volume, and repeatable training exposure.",
    order: 5,
  },
  {
    id: "return-to-sport",
    name: "Return to Sport",
    description: "Sport confidence, power tolerance, and repeatable sport-specific performance.",
    order: 6,
  },
];

export const METRIC_DEFINITIONS: Record<MetricId, MetricDefinition> = {
  pain: { id: "pain", label: "Pain zone", direction: "lower-better", unit: "" },
  "swelling-level": {
    id: "swelling-level",
    label: "Swelling",
    direction: "lower-better",
    unit: "",
  },
  "swelling-trend": { id: "swelling-trend", label: "Swelling trend" },
  "walking-confidence": {
    id: "walking-confidence",
    label: "Walking confidence",
    direction: "higher-better",
    unit: "",
  },
  "movement-quality": {
    id: "movement-quality",
    label: "Movement quality",
    direction: "higher-better",
    unit: "",
  },
  "quad-activation-quality": {
    id: "quad-activation-quality",
    label: "Quad activation quality",
    direction: "higher-better",
    unit: "",
  },
  "extension-status": { id: "extension-status", label: "Extension" },
  "flexion-status": { id: "flexion-status", label: "Flexion comfort" },
  "sleep-hours": { id: "sleep-hours", label: "Sleep", direction: "higher-better", unit: "h" },
  "protein-target": { id: "protein-target", label: "Protein target", unit: "g" },
  "session-tolerance": { id: "session-tolerance", label: "Session tolerance" },
  "training-readiness": {
    id: "training-readiness",
    label: "Training tolerance",
    direction: "higher-better",
    unit: "",
  },
  "sport-confidence": {
    id: "sport-confidence",
    label: "Sport confidence",
    direction: "higher-better",
    unit: "",
  },
  "next-morning-response": { id: "next-morning-response", label: "Next-morning response" },
};

const CHECK_IN_FIELD_LABELS: Record<CheckInFieldId, string> = {
  pain: "Pain",
  swelling: "Swelling",
  "swelling-context": "Swelling context",
  "swelling-trend": "Swelling trend",
  "walking-confidence": "Walking confidence",
  "confidence-in-knee": "Confidence in knee",
  "quad-activation-quality": "Quad activation quality",
  "extension-status": "Extension status",
  "flexion-status": "Flexion comfort/status",
  "extension-response": "Extension response",
  "flexion-response": "Flexion response",
  "movement-quality": "Movement quality",
  "training-readiness": "Training tolerance",
  "sport-confidence": "Sport confidence",
  "sleep-hours": "Sleep",
  "protein-target": "Protein target",
  "exercises-completed": "Quests completed",
  "pain-during": "Pain during activity",
  "pain-after": "Pain after activity",
  "swelling-change": "Swelling change",
  "concerning-symptoms": "Sharp pain / instability / concerning symptoms",
  "energy-fatigue": "Energy / fatigue",
  milestones: "Milestones achieved",
  notes: "Notes",
};

export function checkInFieldLabel(field: CheckInFieldId): string {
  return CHECK_IN_FIELD_LABELS[field];
}

export const PHASE_CONFIGS: Phase[] = [
  {
    id: "acute-response",
    name: "Phase 1 · Acute Response",
    order: 1,
    dashboardQuestion: "Is the knee settling down?",
    activeTrackIds: ["symptoms", "walking-movement", "activation"],
    primaryMetrics: ["pain", "swelling-level", "walking-confidence", "extension-status"],
    supportingMetrics: ["sleep-hours", "swelling-trend", "flexion-status"],
    morningCheckInFields: [
      "pain",
      "swelling",
      "swelling-context",
      "swelling-trend",
      "walking-confidence",
      "extension-status",
      "flexion-status",
      "sleep-hours",
      "protein-target",
      "notes",
    ],
    eveningCheckInFields: [
      "exercises-completed",
      "pain-during",
      "pain-after",
      "swelling-change",
      "walking-confidence",
      "quad-activation-quality",
      "extension-response",
      "flexion-response",
      "concerning-symptoms",
      "notes",
    ],
    questTemplateIds: [
      "morning-check-in",
      "ankle-pumps",
      "assisted-walking",
      "gentle-quad-check",
      "swelling-control",
      "protein-target",
      "hydration",
      "sleep-window",
      "evening-check-in",
    ],
    questTemplateDefaults: [
      {
        id: "morning-check-in",
        label: "Morning check-in",
        kind: "main",
        xp: 10,
        reason: "Because acute response decisions need a morning baseline",
      },
      {
        id: "ankle-pumps",
        label: "Ankle pumps",
        kind: "main",
        xp: 10,
        reason: "Because early circulation work supports symptom control",
      },
      {
        id: "assisted-walking",
        label: "Assisted walking practice",
        kind: "main",
        xp: 15,
        reason: "Because Phase 1 prioritizes safe basic movement",
      },
      {
        id: "gentle-quad-check",
        label: "Gentle quad activation check",
        kind: "main",
        xp: 10,
        reason: "Because early quad signal matters without chasing fatigue",
      },
      {
        id: "swelling-control",
        label: "Swelling control / comfortable elevation",
        kind: "main",
        xp: 15,
        reason: "Because Phase 1 is governed by symptom response",
      },
      {
        id: "evening-check-in",
        label: "Evening check-in",
        kind: "main",
        xp: 10,
        reason: "Because today's response decides tomorrow's plan",
      },
      {
        id: "protein-target",
        label: "Protein target",
        kind: "side",
        xp: 10,
        reason: "Because nutrition supports surgical recovery",
      },
      {
        id: "hydration",
        label: "Hydration",
        kind: "side",
        xp: 5,
        reason: "Because hydration supports recovery",
      },
      {
        id: "sleep-window",
        label: "Sleep window",
        kind: "side",
        xp: 5,
        reason: "Because sleep supports symptom settling",
      },
    ],
    readinessRuleIds: ["early-post-op-modify", "activity-response-recover"],
    readinessRules: [
      {
        id: "early-post-op-modify",
        label: "Baseline surgical swelling modifies",
        description:
          "Days 0-3 can show expected 4-6/10 swelling without automatically triggering Recover when pain and walking are stable.",
      },
      {
        id: "activity-response-recover",
        label: "Activity response recovers",
        description:
          "Meaningful swelling increases after activity, especially with pain or lower walking confidence, trigger Recover.",
      },
    ],
    smallWinRuleIds: ["pain-decreased", "swelling-stable", "check-in-logged"],
    smallWinRules: [
      {
        id: "pain-decreased",
        label: "Pain decreased",
        description: "Pain is lower than the previous morning check-in.",
      },
      {
        id: "swelling-stable",
        label: "Swelling stable",
        description: "Swelling is stable or lower while symptoms remain controlled.",
      },
      {
        id: "check-in-logged",
        label: "Check-in logged",
        description: "A morning check-in creates useful evidence for the day.",
      },
    ],
  },
  {
    id: "activation-early-rom",
    name: "Phase 2 · Activation + Early ROM",
    order: 2,
    dashboardQuestion: "Can I control and move the knee?",
    activeTrackIds: ["symptoms", "rom", "activation", "walking-movement"],
    primaryMetrics: [
      "quad-activation-quality",
      "extension-status",
      "flexion-status",
      "walking-confidence",
      "swelling-trend",
      "pain",
    ],
    supportingMetrics: ["sleep-hours", "swelling-level"],
    morningCheckInFields: [
      "pain",
      "swelling",
      "swelling-context",
      "swelling-trend",
      "walking-confidence",
      "extension-status",
      "flexion-status",
      "sleep-hours",
      "protein-target",
      "notes",
    ],
    eveningCheckInFields: [
      "exercises-completed",
      "pain-during",
      "pain-after",
      "swelling-change",
      "walking-confidence",
      "quad-activation-quality",
      "extension-response",
      "flexion-response",
      "concerning-symptoms",
      "milestones",
      "notes",
    ],
    questTemplateIds: [
      "morning-check-in",
      "quad-activation",
      "extension-exposure",
      "gentle-heel-slides",
      "supported-walking",
      "protein-target",
      "hydration",
      "sleep-window",
      "evening-check-in",
    ],
    questTemplateDefaults: [
      {
        id: "morning-check-in",
        label: "Morning check-in",
        kind: "main",
        xp: 10,
        reason: "Because Phase 2 needs a morning baseline before loading decisions",
      },
      {
        id: "quad-activation",
        label: "Quad activation sets",
        kind: "main",
        xp: 15,
        reason: "Because Phase 2 is built around restoring quad signal",
      },
      {
        id: "extension-exposure",
        label: "Gentle extension exposure, only if tolerated",
        kind: "main",
        xp: 20,
        reason: "Because Phase 2 tracks extension without provoking symptoms",
      },
      {
        id: "gentle-heel-slides",
        label: "Gentle heel slides 1-2 sets of 10, comfortable range only",
        kind: "main",
        xp: 15,
        reason: "Because Phase 2 begins comfortable flexion exposure",
      },
      {
        id: "supported-walking",
        label: "Supported walking practice",
        kind: "main",
        xp: 15,
        reason: "Because early walking confidence is the movement gate",
      },
      {
        id: "evening-check-in",
        label: "Evening check-in",
        kind: "main",
        xp: 10,
        reason: "Because Phase 2 progression depends on today's response",
      },
      {
        id: "protein-target",
        label: "Protein target",
        kind: "side",
        xp: 10,
        reason: "Because nutrition supports tissue recovery",
      },
      {
        id: "hydration",
        label: "Hydration",
        kind: "side",
        xp: 5,
        reason: "Because hydration supports recovery",
      },
      {
        id: "sleep-window",
        label: "Sleep window",
        kind: "side",
        xp: 5,
        reason: "Because sleep supports tomorrow's response",
      },
    ],
    readinessRuleIds: [
      "early-post-op-modify",
      "activity-response-recover",
      "phase-2-modify",
      "rom-response-check",
      "previous-evening-reactive",
    ],
    readinessRules: [
      {
        id: "early-post-op-modify",
        label: "Baseline surgical swelling modifies",
        description:
          "Days 0-3 can show expected 4-6/10 swelling without automatically triggering Recover when pain and walking are stable.",
      },
      {
        id: "activity-response-recover",
        label: "Activity response recovers",
        description:
          "Meaningful swelling increases after activity, especially with pain or lower walking confidence, trigger Recover.",
      },
      {
        id: "phase-2-modify",
        label: "Symptoms modify activation work",
        description:
          "Pain above green-zone or moderate swelling keeps the plan gentle rather than advancing volume.",
      },
      {
        id: "rom-response-check",
        label: "ROM respects symptom response",
        description:
          "Extension and flexion exposure stay comfortable when swelling, pain, or walking confidence worsen.",
      },
      {
        id: "previous-evening-reactive",
        label: "Reactive evening response recovers",
        description:
          "A reactive previous evening reduces workload and prioritizes symptom control.",
      },
    ],
    smallWinRuleIds: [
      "rom-response-stable",
      "quad-activation-quality-logged",
      "main-quests-completed",
    ],
    smallWinRules: [
      {
        id: "rom-response-stable",
        label: "ROM response stable",
        description: "Extension and flexion response stayed tolerable after today's work.",
      },
      {
        id: "quad-activation-quality-logged",
        label: "Quad activation logged",
        description: "Evening check-in captured quad activation quality after activation work.",
      },
      {
        id: "main-quests-completed",
        label: "Main quests completed",
        description: "All configured main quests for the day are complete.",
      },
    ],
  },
  {
    id: "movement-capacity",
    name: "Phase 3 · Range / Basic Capacity",
    order: 3,
    dashboardQuestion: "Can I move normally and tolerate basic loading?",
    activeTrackIds: ["symptoms", "rom", "walking-movement", "capacity"],
    primaryMetrics: [
      "movement-quality",
      "pain",
      "swelling-trend",
      "session-tolerance",
      "flexion-status",
    ],
    supportingMetrics: ["quad-activation-quality", "next-morning-response"],
    morningCheckInFields: [
      "pain",
      "swelling",
      "movement-quality",
      "extension-status",
      "flexion-status",
      "sleep-hours",
      "notes",
    ],
    eveningCheckInFields: [
      "exercises-completed",
      "pain-during",
      "pain-after",
      "swelling-change",
      "movement-quality",
      "notes",
    ],
    questTemplateIds: ["movement-quality", "basic-loading", "evening-check-in"],
    questTemplateDefaults: [],
    readinessRuleIds: ["movement-quality-gate"],
    readinessRules: [
      {
        id: "movement-quality-gate",
        label: "Movement quality gate",
        description: "Placeholder rule for Phase 3 movement-quality readiness.",
      },
    ],
    smallWinRuleIds: ["movement-quality-improved", "stable-next-morning-response"],
    smallWinRules: [
      {
        id: "movement-quality-improved",
        label: "Movement quality improved",
        description: "Placeholder rule for Phase 3 movement quality wins.",
      },
      {
        id: "stable-next-morning-response",
        label: "Stable next-morning response",
        description: "Placeholder rule for Phase 3 response wins.",
      },
    ],
    placeholder: true,
  },
  {
    id: "strength-capacity",
    name: "Phase 4 · Strength Capacity",
    order: 4,
    dashboardQuestion: "Can I train and recover from it?",
    activeTrackIds: ["symptoms", "capacity"],
    primaryMetrics: [
      "training-readiness",
      "session-tolerance",
      "pain",
      "swelling-trend",
      "next-morning-response",
    ],
    supportingMetrics: ["movement-quality"],
    morningCheckInFields: ["pain", "swelling", "training-readiness", "sleep-hours", "notes"],
    eveningCheckInFields: [
      "exercises-completed",
      "pain-during",
      "pain-after",
      "swelling-change",
      "energy-fatigue",
      "notes",
    ],
    questTemplateIds: ["strength-tolerance", "load-response-log", "evening-check-in"],
    questTemplateDefaults: [],
    readinessRuleIds: ["training-readiness-gate"],
    readinessRules: [
      {
        id: "training-readiness-gate",
        label: "Training tolerance gate",
        description: "Placeholder rule for Phase 4 training-tolerance readiness.",
      },
    ],
    smallWinRuleIds: ["session-tolerated", "smart-deload"],
    smallWinRules: [
      {
        id: "session-tolerated",
        label: "Session tolerated",
        description: "Placeholder rule for Phase 4 session tolerance wins.",
      },
      {
        id: "smart-deload",
        label: "Smart deload",
        description: "Placeholder rule for Phase 4 smart decision wins.",
      },
    ],
    placeholder: true,
  },
  {
    id: "return-preparation",
    name: "Phase 5 · Return to Sport",
    order: 5,
    dashboardQuestion: "Can I perform and repeat it?",
    activeTrackIds: ["symptoms", "capacity", "return-to-sport"],
    primaryMetrics: [
      "sport-confidence",
      "swelling-trend",
      "session-tolerance",
      "next-morning-response",
    ],
    supportingMetrics: ["movement-quality", "training-readiness"],
    morningCheckInFields: ["pain", "swelling", "sport-confidence", "training-readiness", "notes"],
    eveningCheckInFields: [
      "exercises-completed",
      "pain-during",
      "pain-after",
      "swelling-change",
      "energy-fatigue",
      "notes",
    ],
    questTemplateIds: ["sport-readiness-scan", "controlled-conditioning", "evening-check-in"],
    questTemplateDefaults: [],
    readinessRuleIds: ["sport-repeatability-gate"],
    readinessRules: [
      {
        id: "sport-repeatability-gate",
        label: "Sport repeatability gate",
        description: "Placeholder rule for Phase 5 return-to-sport readiness.",
      },
    ],
    smallWinRuleIds: ["sport-confidence-improved", "repeatability-proven"],
    smallWinRules: [
      {
        id: "sport-confidence-improved",
        label: "Sport confidence improved",
        description: "Placeholder rule for Phase 5 sport confidence wins.",
      },
      {
        id: "repeatability-proven",
        label: "Repeatability proven",
        description: "Placeholder rule for Phase 5 repeatability wins.",
      },
    ],
    placeholder: true,
  },
];

export const MISSIONS: Mission[] = [
  {
    id: "calm-the-knee",
    name: "Calm the Knee",
    tagline: "Reduce inflammation. Reclaim baseline.",
    phaseId: "acute-response",
    trackIds: ["symptoms", "walking-movement", "activation"],
    objective: "Bring swelling and pain to a stable, low daily baseline.",
    whyItMatters: "A calmer knee is easier to move, easier to activate, and easier to progress.",
    why: "Inflammation gates everything else — quad firing, range, sleep. Quiet the tissue first.",
    estDuration: "1–2 weeks",
    phase: "Phase 1 · Acute response",
    progress: 100,
    criteria: [
      "Pain ≤ 2/10 at rest for 5 consecutive days",
      "Swelling ≤ 2/10 morning baseline",
      "Sleep ≥ 7h average",
    ],
    milestoneIds: ["m-pain-baseline", "m-swelling-controlled"],
    possibleQuestIds: ["ankle-pumps", "assisted-walking", "swelling-control", "gentle-quad-check"],
    nextUnlock: "Wake the Quad",
    status: "complete",
  },
  {
    id: "wake-the-quad",
    name: "Wake the Quad",
    tagline: "Restore neuromuscular control.",
    phaseId: "activation-early-rom",
    trackIds: ["activation", "symptoms", "walking-movement"],
    objective: "Re-establish voluntary quad activation and lock-out control.",
    whyItMatters:
      "The quad must fire reliably before meaningful loading and later athletic control can return.",
    why: "Without an active quad, the knee can't stabilize under load and extension won't return.",
    estDuration: "2–4 weeks",
    phase: "Phase 2 · Activation + Early ROM",
    progress: 64,
    criteria: [
      "Quad activation 4/5 on demand",
      "Straight leg raise with no lag",
      "Terminal knee extension to neutral",
    ],
    milestoneIds: ["m-quad-activation-4", "m-slr-no-lag"],
    possibleQuestIds: ["quad-activation", "activation-check-in", "supported-walking"],
    nextUnlock: "Restore Range",
    status: "active",
  },
  {
    id: "restore-extension",
    name: "Restore Range",
    tagline: "Reclaim comfortable extension and flexion.",
    phaseId: "activation-early-rom",
    trackIds: ["rom", "symptoms", "activation"],
    objective: "Restore comfortable extension and flexion without increasing symptoms.",
    whyItMatters:
      "The knee needs both straightening and bending capacity for walking, sitting, stairs, biking, and later training.",
    why: "Lost range changes gait, loads other joints, and blocks later training.",
    estDuration: "3–6 weeks",
    phase: "Phase 2 · Activation + Early ROM",
    progress: 22,
    criteria: [
      "Extension trending toward neutral",
      "Flexion improving or stable across check-ins",
      "Heel slides tolerated without sharp pain or next-day swelling increase",
    ],
    milestoneIds: ["m-extension-0", "m-flexion-comfortable"],
    possibleQuestIds: ["gentle-extension-exposure", "gentle-heel-slides", "rom-status-check"],
    nextUnlock: "Normalize Walking",
    status: "active",
  },
  {
    id: "normalize-walking",
    name: "Normalize Walking",
    tagline: "Improve gait quality without chasing independence.",
    phaseId: "activation-early-rom",
    trackIds: ["walking-movement", "symptoms"],
    objective: "Improve walking quality and reduce support only when mechanics stay clean.",
    whyItMatters:
      "Dropping support too early can reinforce compensation. Better walking matters more than faster independence.",
    why: "Quality gait restores confidence and protects the knee from avoidable swelling response.",
    estDuration: "2–5 weeks",
    phase: "Phase 2 · Activation + Early ROM",
    progress: 15,
    criteria: [
      "Walking confidence improving",
      "Support reduced only when mechanics remain clean",
      "No next-day swelling or pain increase from walking volume",
    ],
    milestoneIds: ["m-walking-quality"],
    possibleQuestIds: ["supported-walking", "comfortable-walking", "walking-response-log"],
    nextUnlock: "Build Capacity",
    status: "active",
  },
  {
    id: "build-capacity",
    name: "Build Capacity",
    tagline: "Tissue tolerance. Volume. Confidence.",
    phaseId: "movement-capacity",
    trackIds: ["capacity", "walking-movement", "symptoms"],
    objective: "Tolerate progressive load across daily and training sessions.",
    whyItMatters:
      "Capacity is proven by what the knee tolerates today and how it responds tomorrow.",
    why: "Capacity is the bridge from rehab to performance. Earn the right to train hard.",
    estDuration: "6–10 weeks",
    phase: "Phase 3 · Range / Basic Capacity",
    progress: 0,
    criteria: ["Single-leg press ≥ 1× BW", "30-min walk pain-free", "Stairs reciprocal"],
    milestoneIds: ["m-walk-30"],
    possibleQuestIds: ["capacity-walk", "strength-tolerance", "load-response-log"],
    nextUnlock: "Become an Athlete Again",
    status: "locked",
  },
  {
    id: "become-an-athlete-again",
    name: "Become an Athlete Again",
    tagline: "Sport-specific readiness.",
    phaseId: "return-preparation",
    trackIds: ["return-to-sport", "capacity", "symptoms"],
    objective: "Return-to-sport criteria met across strength, power, and confidence.",
    whyItMatters: "Sport readiness requires repeatable performance, not one good session.",
    why: "Return-to-sport is a test you pass, not a date you hit.",
    estDuration: "Ongoing",
    phase: "Phase 5 · Return to Sport",
    progress: 0,
    criteria: ["LSI ≥ 90% across battery", "Hop tests symmetrical", "Confidence 5/5"],
    milestoneIds: [],
    possibleQuestIds: ["readiness-scan", "controlled-conditioning"],
    nextUnlock: "Long-term performance",
    status: "locked",
  },
];

const seedMilestones: Milestone[] = [
  {
    id: "m-pain-baseline",
    mission: "calm-the-knee",
    missionId: "calm-the-knee",
    trackId: "symptoms",
    name: "Stable pain baseline",
    description: "Five consecutive days at pain ≤ 2/10.",
    why: "Proves the tissue has exited the acute reactive window.",
    evidence: "5 consecutive morning check-ins ≤ 2/10",
    criteria: ["Pain ≤ 2/10 at rest for 5 consecutive days"],
    status: "unlocked",
    unlockedAt: "2025-06-12",
    coachNotes: "Earned. Move to activation work without losing this floor.",
  },
  {
    id: "m-swelling-controlled",
    mission: "calm-the-knee",
    missionId: "calm-the-knee",
    trackId: "symptoms",
    name: "Swelling under control",
    description: "Morning swelling ≤ 2/10 for 7 days.",
    why: "Swelling inhibits quad firing. Control it first.",
    evidence: "7 morning check-ins ≤ 2/10",
    criteria: ["Morning swelling ≤ 2/10 for 7 days", "No activity-induced swelling spike"],
    status: "unlocked",
    unlockedAt: "2025-06-15",
  },
  {
    id: "m-quad-activation-4",
    mission: "wake-the-quad",
    missionId: "wake-the-quad",
    trackId: "activation",
    name: "Quad activation 4/5",
    description: "Voluntary quad activation reported 4/5 across a week.",
    why: "Neuromuscular control is the gate to load tolerance.",
    evidence: "Self-rated activation ≥ 4 on 5 of 7 days",
    criteria: ["Quad activation ≥ 4/5 on 5 of 7 days", "No symptom increase from activation work"],
    status: "in-progress",
  },
  {
    id: "m-slr-no-lag",
    mission: "wake-the-quad",
    missionId: "wake-the-quad",
    trackId: "activation",
    name: "Straight leg raise — no lag",
    description: "Lift the leg with the knee fully locked.",
    why: "Lag indicates incomplete extension control.",
    evidence: "Video-confirmed SLR, knee locked",
    criteria: ["Straight leg raise without lag when clinically appropriate"],
    status: "in-progress",
  },
  {
    id: "m-extension-0",
    mission: "restore-extension",
    missionId: "restore-extension",
    trackId: "rom",
    name: "Passive extension to 0°",
    description: "Heel-prop reaches contralateral extension.",
    why: "Lost extension changes gait and loads other joints.",
    evidence: "Goniometer or side-by-side video",
    criteria: ["Extension reaches neutral", "No sharp end-range pain pattern"],
    status: "locked",
  },
  {
    id: "m-flexion-comfortable",
    mission: "restore-extension",
    missionId: "restore-extension",
    trackId: "rom",
    name: "Comfortable flexion improving",
    description: "Flexion improves or holds steady without next-day symptom increase.",
    why: "Flexion supports comfort, sitting, stairs, biking, and later training options.",
    evidence: "Flexion log + next-morning swelling and pain response",
    criteria: ["Flexion improves or remains stable", "No next-day swelling increase"],
    status: "in-progress",
  },
  {
    id: "m-walking-quality",
    mission: "normalize-walking",
    missionId: "normalize-walking",
    trackId: "walking-movement",
    name: "Clean supported walking",
    description: "Walking quality improves without forcing support reduction.",
    why: "Clean mechanics matter more than dropping crutches quickly.",
    evidence: "Walking confidence trend + no next-day swelling response",
    criteria: [
      "Walking confidence improving",
      "No limp compensation",
      "No next-day swelling spike",
    ],
    status: "locked",
  },
  {
    id: "m-walk-30",
    mission: "build-capacity",
    missionId: "build-capacity",
    trackId: "capacity",
    name: "30-minute pain-free walk",
    description: "Continuous walk with pain ≤ 2/10 and no swelling spike next day.",
    why: "Capacity is proven by the next morning's response.",
    evidence: "Walk log + next-morning check-in",
    criteria: ["30-minute walk pain ≤ 2/10", "No swelling spike the next morning"],
    status: "locked",
  },
];

// Seed prior morning check-ins so trends and historical viewing work.
function isoDaysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return getLocalDateKey(d);
}

export function createDefaultMorningCheckIn(
  date: string,
  phaseId: PhaseId = "activation-early-rom",
): MorningCheckIn {
  return {
    date,
    localDate: date,
    timestampUtc: getUtcTimestamp(),
    phaseId,
    pain: 2,
    swelling: 1,
    swellingLevel: 1,
    swellingTrend: "stable",
    swellingContext: "surgical_baseline",
    walkingConfidence: 3,
    extensionStatus: "slightly_limited",
    flexionStatus: "comfortable_gentle_bend",
    sleepHours: 7,
    weightKg: 85,
    proteinTargetG: 160,
    confidence: 3,
    notes: "",
  };
}

export function createDefaultEveningCheckIn(
  date: string,
  phaseId: PhaseId = "activation-early-rom",
): EveningCheckIn {
  return {
    date,
    localDate: date,
    timestampUtc: getUtcTimestamp(),
    phaseId,
    exercisesCompleted: "",
    painDuring: 2,
    painDuringActivity: 2,
    painAfter: 2,
    painAfterActivity: 2,
    swellingChange: 0,
    walkingConfidence: 3,
    walkingConfidenceAfter: 3,
    quadActivationQuality: 3,
    extensionResponse: "felt_same",
    flexionResponse: "felt_same",
    concerningSymptoms: "",
    milestones: "",
    notes: "",
  };
}

const seedMorningHistory: MorningCheckIn[] = [
  {
    date: isoDaysAgo(3),
    phaseId: "activation-early-rom",
    pain: 4,
    swelling: 3,
    swellingLevel: 3,
    swellingTrend: "unknown",
    swellingContext: "unknown",
    walkingConfidence: 2,
    extensionStatus: "moderately_limited",
    flexionStatus: "stiff_but_tolerable",
    sleepHours: 6.5,
    weightKg: 86,
    proteinTargetG: 170,
    confidence: 3,
    notes: "",
  },
  {
    date: isoDaysAgo(2),
    phaseId: "activation-early-rom",
    pain: 3,
    swelling: 2,
    swellingLevel: 2,
    swellingTrend: "improved",
    swellingContext: "surgical_baseline",
    walkingConfidence: 3,
    extensionStatus: "slightly_limited",
    flexionStatus: "comfortable_gentle_bend",
    sleepHours: 7,
    weightKg: 86,
    proteinTargetG: 170,
    confidence: 3,
    notes: "",
  },
  {
    date: isoDaysAgo(1),
    phaseId: "activation-early-rom",
    pain: 3,
    swelling: 2,
    swellingLevel: 2,
    swellingTrend: "stable",
    swellingContext: "surgical_baseline",
    walkingConfidence: 3,
    extensionStatus: "slightly_limited",
    flexionStatus: "comfortable_gentle_bend",
    sleepHours: 7,
    weightKg: 86,
    proteinTargetG: 170,
    confidence: 3,
    notes: "Yesterday.",
  },
];

function createCheckIn(date: string, morning?: MorningCheckIn, evening?: EveningCheckIn): CheckIn {
  return {
    id: `check-in-${date}`,
    date,
    localDate: date,
    timestampUtc: morning?.timestampUtc ?? evening?.timestampUtc ?? getUtcTimestamp(),
    phaseId: morning?.phaseId ?? evening?.phaseId ?? "activation-early-rom",
    morning,
    evening,
  };
}

const seedCoachNotes: CoachNote[] = [];

const seedAthleteNotes: AthleteNote[] = [];

const seedRecoveryIqEvents: RecoveryIqEvent[] = [];

const seedSmallWins: SmallWin[] = [];

const seedTodayLocalDate = getLocalDateKey();
const seedTimestampUtc = getUtcTimestamp();

const seedTodayMorning: MorningCheckIn = {
  date: seedTodayLocalDate,
  localDate: seedTodayLocalDate,
  timestampUtc: seedTimestampUtc,
  phaseId: "activation-early-rom",
  pain: 2,
  swelling: 1,
  swellingLevel: 1,
  swellingTrend: "stable",
  swellingContext: "surgical_baseline",
  walkingConfidence: 4,
  extensionStatus: "slightly_limited",
  flexionStatus: "comfortable_gentle_bend",
  sleepHours: 7.5,
  weightKg: 86,
  proteinTargetG: 170,
  confidence: 4,
  notes: "Felt stiff first 5 min, settled fast.",
};

const initial: PhoenixState = {
  campaign: {
    id: "acl-revision-prehab",
    name: "ACL Revision Prehab",
    athleteName: "Kevin",
    surgeryType: "ACL revision",
    startedAt: "2026-06-25",
    surgeryDate: "2026-06-25",
    activePhaseId: "activation-early-rom",
    activeMissionIds: ["wake-the-quad", "restore-extension", "normalize-walking"],
  },
  phases: PHASE_CONFIGS,
  recoveryTracks: RECOVERY_TRACKS,
  missions: MISSIONS,
  athleteName: "Kevin",
  surgeryDate: "2026-06-25",
  campaignName: "ACL Revision Prehab",
  currentMissionId: "wake-the-quad",
  recoveryIqXp: 0,
  morning: seedTodayMorning,
  evening: null,
  checkIns: [createCheckIn(seedTodayLocalDate, seedTodayMorning, undefined)],
  history: { morning: seedMorningHistory, evening: [] },
  milestones: seedMilestones,
  todayQuests: [],
  dailyCoachPlans: [],
  coachNotes: seedCoachNotes,
  athleteNotes: seedAthleteNotes,
  recoveryIqEvents: seedRecoveryIqEvents,
  smallWins: seedSmallWins,
  coachPackets: [],
  questCompletions: {},
  clinicianConstraints: [],
  todayRecommendation: {
    priority: "Keep activation and ROM gentle until evening response confirms tolerance.",
    workload:
      "Hold volume. Use comfortable activation and ROM exposure only if symptoms stay quiet.",
    reason:
      "Morning baseline is calm; next progression depends on evening pain, swelling, and ROM response.",
    nextReassessment:
      "Tonight and tomorrow morning: pain after activity, swelling change, and walking confidence.",
    confidence: "Medium",
  },
};

function normalizePhaseConfigs(savedPhases?: Partial<Phase>[]): Phase[] {
  return PHASE_CONFIGS.map((seed) => {
    const saved = savedPhases?.find((phase) => phase.id === seed.id);
    return {
      ...(saved ?? {}),
      ...seed,
    };
  });
}

function normalizeCoachNoteSource(source: unknown): CoachNoteSource {
  if (source === "ChatGPT" || source === "chatgpt") return "ChatGPT";
  if (source === "physio" || source === "surgeon" || source === "trainer" || source === "other")
    return source;
  return "other";
}

function normalizeCoachNoteType(value: unknown): CoachNoteType {
  return value === "evening_review" ||
    value === "physio_note" ||
    value === "surgeon_note" ||
    value === "restriction" ||
    value === "milestone" ||
    value === "general"
    ? value
    : "general";
}

function normalizeCoachNoteAppliesTo(value: unknown): CoachNoteAppliesTo {
  return value === "today" ||
    value === "current_phase" ||
    value === "until_next_appointment" ||
    value === "custom"
    ? value
    : "today";
}

function normalizeCoachNotePriority(value: unknown): CoachNotePriority {
  return value === "normal" || value === "important" || value === "override" ? value : "normal";
}

function normalizeCoachNote(
  note: Partial<CoachNote> & { author?: string; body?: string },
): CoachNote {
  const fullNote = note.fullNote ?? note.body ?? "";
  const createdAt = note.createdAt ?? getUtcTimestamp();
  const localDate =
    note.localDate || note.date || localDateFromTimestampUtc(createdAt) || getLocalDateKey();
  return {
    id: note.id ?? `coach-note-${Date.now()}`,
    date: localDate,
    localDate,
    timestampUtc: note.timestampUtc ?? createdAt,
    source: normalizeCoachNoteSource(note.source),
    noteType: normalizeCoachNoteType(note.noteType),
    authorName: note.authorName ?? note.author,
    summary: note.summary ?? fullNote.split("\n")[0] ?? "",
    fullNote,
    nextFocus: note.nextFocus,
    appliesTo: normalizeCoachNoteAppliesTo(note.appliesTo),
    priority: normalizeCoachNotePriority(note.priority),
    relatedPhaseId: note.relatedPhaseId,
    relatedMissionIds: note.relatedMissionIds,
    relatedTrackIds: note.relatedTrackIds,
    tags: note.tags ?? [],
    createdAt,
  };
}

function normalizeAthleteNote(note: Partial<AthleteNote>): AthleteNote {
  const createdAt = note.createdAt ?? getUtcTimestamp();
  const localDate =
    note.localDate || note.date || localDateFromTimestampUtc(createdAt) || getLocalDateKey();
  return {
    id: note.id ?? `athlete-note-${Date.now()}`,
    date: localDate,
    localDate,
    timestampUtc: note.timestampUtc ?? createdAt,
    body: note.body ?? "",
    relatedPhaseId: note.relatedPhaseId,
    relatedMissionIds: note.relatedMissionIds,
    tags: note.tags ?? [],
    createdAt,
  };
}

function normalizeCoachPacket(packet: Partial<CoachPacket>): CoachPacket {
  const timestampUtc = packet.timestampUtc ?? packet.generatedAt ?? getUtcTimestamp();
  const localDate =
    packet.localDate || packet.date || localDateFromTimestampUtc(timestampUtc) || getLocalDateKey();
  return {
    ...(packet as CoachPacket),
    id: packet.id ?? `packet-${packet.kind ?? "morning"}-${localDate}`,
    kind: packet.kind ?? "morning",
    date: localDate,
    localDate,
    timestampUtc,
    generatedAt: packet.generatedAt ?? timestampUtc,
  };
}

const DEMO_RECOVERY_IQ_EVENT_IDS = new Set(["iq-morning-check-in", "iq-smart-modify"]);

function normalizeRecoveryIqEventSourceType(value: unknown): RecoveryIqEventSourceType | null {
  return value === "check_in" ||
    value === "quest" ||
    value === "coach_plan" ||
    value === "milestone" ||
    value === "small_win" ||
    value === "smart_decision" ||
    value === "manual_adjustment"
    ? value
    : null;
}

function normalizeRecoveryIqEvent(value: unknown): RecoveryIqEvent | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  const rawId = stringValue(record.id);
  if (DEMO_RECOVERY_IQ_EVENT_IDS.has(rawId)) return null;

  const sourceType = normalizeRecoveryIqEventSourceType(record.sourceType);
  if (!sourceType) return null;

  const timestamp =
    stringValue(record.timestampUtc) ||
    stringValue(record.timestamp) ||
    stringValue(record.createdAt) ||
    getUtcTimestamp();
  const date =
    stringValue(record.localDate) ||
    stringValue(record.date) ||
    localDateFromTimestampUtc(timestamp) ||
    getLocalDateKey();
  const title = stringValue(record.title);
  const xpAmount =
    typeof record.xpAmount === "number" && Number.isFinite(record.xpAmount) ? record.xpAmount : 0;

  return {
    id:
      rawId ||
      recoveryIqEventId(sourceType, stringValue(record.sourceId) || undefined, date, title),
    date,
    localDate: date,
    timestamp,
    timestampUtc: timestamp,
    sourceType,
    sourceId: stringValue(record.sourceId) || undefined,
    title: title || "Recovery IQ event",
    description: stringValue(record.description) || undefined,
    xpAmount,
    createdAt: stringValue(record.createdAt) || timestamp,
  };
}

function normalizeSmallWin(value: unknown): SmallWin | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Partial<SmallWin> & { xp?: number };
  if (record.id === "small-win-today") return null;
  if (
    !record.id ||
    (!record.date && !record.localDate) ||
    !record.title ||
    !record.description ||
    !record.source
  ) {
    return null;
  }
  const localDate = record.localDate || record.date || getLocalDateKey();
  return {
    id: record.id,
    date: localDate,
    localDate,
    timestampUtc: record.timestampUtc,
    title: record.title,
    description: record.description,
    source: record.source,
    relatedMetric: record.relatedMetric,
  };
}

type LegacyMorningCheckIn = Partial<MorningCheckIn> & {
  quadActivation?: number;
  extension?: number;
  extensionStatus?: ExtensionStatus | "neutral";
  extensionEstimateDegrees?: number;
  flexion?: number;
  flexionComfort?: "comfortable_range_only" | "end_range_sensitive" | "not_tested";
};

function finiteNumber(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function normalizeExtensionStatus(status: unknown, legacyDegrees: unknown): ExtensionStatus {
  if (status === "reaches_neutral" || status === "neutral") return "reaches_neutral";
  if (
    status === "not_tested" ||
    status === "slightly_limited" ||
    status === "moderately_limited" ||
    status === "significantly_limited"
  ) {
    return status;
  }

  const degrees = finiteNumber(legacyDegrees, Number.NaN);
  if (!Number.isFinite(degrees)) return "not_tested";
  if (degrees <= 0) return "reaches_neutral";
  if (degrees <= 5) return "slightly_limited";
  if (degrees <= 10) return "moderately_limited";
  return "significantly_limited";
}

function normalizeFlexionStatus(
  status: unknown,
  legacyComfort: unknown,
  legacyDegrees: unknown,
): FlexionStatus {
  if (
    status === "not_tested" ||
    status === "comfortable_gentle_bend" ||
    status === "stiff_but_tolerable" ||
    status === "painful_or_pinching"
  ) {
    return status;
  }

  if (legacyComfort === "not_tested") return "not_tested";
  if (legacyComfort === "end_range_sensitive") return "painful_or_pinching";
  if (legacyComfort === "comfortable_range_only") return "comfortable_gentle_bend";

  const degrees = finiteNumber(legacyDegrees, Number.NaN);
  if (!Number.isFinite(degrees)) return "not_tested";
  if (degrees < 90) return "stiff_but_tolerable";
  return "comfortable_gentle_bend";
}

function normalizeRangeResponse(value: unknown): RangeResponse {
  return value === "not_tested" ||
    value === "felt_same" ||
    value === "felt_better" ||
    value === "felt_stiffer" ||
    value === "painful_or_pinching"
    ? value
    : "not_tested";
}

function normalizeMorningCheckIn(
  entry: LegacyMorningCheckIn | undefined,
): MorningCheckIn | undefined {
  if (!entry) return undefined;
  const timestampUtc = entry.timestampUtc ?? getUtcTimestamp();
  const date =
    entry.localDate || entry.date || localDateFromTimestampUtc(timestampUtc) || getLocalDateKey();
  const phaseId = entry.phaseId ?? "activation-early-rom";
  const fallback = createDefaultMorningCheckIn(date, phaseId);
  return {
    date,
    localDate: date,
    timestampUtc,
    phaseId,
    pain: finiteNumber(entry.pain, fallback.pain),
    swelling: finiteNumber(entry.swelling, fallback.swelling),
    swellingLevel: finiteNumber(entry.swellingLevel ?? entry.swelling, fallback.swellingLevel ?? 1),
    swellingTrend: entry.swellingTrend ?? fallback.swellingTrend,
    swellingContext: entry.swellingContext ?? fallback.swellingContext,
    walkingConfidence: finiteNumber(entry.walkingConfidence, fallback.walkingConfidence),
    extensionStatus: normalizeExtensionStatus(
      entry.extensionStatus,
      entry.extensionEstimateDegrees ?? entry.extension,
    ),
    flexionStatus: normalizeFlexionStatus(entry.flexionStatus, entry.flexionComfort, entry.flexion),
    sleepHours: finiteNumber(entry.sleepHours, fallback.sleepHours),
    weightKg: finiteNumber(entry.weightKg, fallback.weightKg),
    proteinTargetG: finiteNumber(entry.proteinTargetG, fallback.proteinTargetG),
    confidence: finiteNumber(entry.confidence, fallback.confidence),
    movementQuality:
      entry.movementQuality == null ? undefined : finiteNumber(entry.movementQuality, 3),
    trainingReadiness:
      entry.trainingReadiness == null ? undefined : finiteNumber(entry.trainingReadiness, 3),
    sportConfidence:
      entry.sportConfidence == null ? undefined : finiteNumber(entry.sportConfidence, 3),
    notes: entry.notes ?? "",
  };
}

function normalizeEveningCheckIn(
  entry: Partial<EveningCheckIn> | undefined,
): EveningCheckIn | undefined {
  if (!entry) return undefined;
  const timestampUtc = entry.timestampUtc ?? getUtcTimestamp();
  const date =
    entry.localDate || entry.date || localDateFromTimestampUtc(timestampUtc) || getLocalDateKey();
  const phaseId = entry.phaseId ?? "activation-early-rom";
  const fallback = createDefaultEveningCheckIn(date, phaseId);
  return {
    date,
    localDate: date,
    timestampUtc,
    phaseId,
    exercisesCompleted: entry.exercisesCompleted ?? "",
    painDuring: finiteNumber(entry.painDuringActivity ?? entry.painDuring, fallback.painDuring),
    painDuringActivity: finiteNumber(
      entry.painDuringActivity ?? entry.painDuring,
      fallback.painDuringActivity ?? fallback.painDuring,
    ),
    painAfter: finiteNumber(entry.painAfterActivity ?? entry.painAfter, fallback.painAfter),
    painAfterActivity: finiteNumber(
      entry.painAfterActivity ?? entry.painAfter,
      fallback.painAfterActivity ?? fallback.painAfter,
    ),
    swellingChange: finiteNumber(entry.swellingChange, fallback.swellingChange),
    walkingConfidence: finiteNumber(
      entry.walkingConfidenceAfter ?? entry.walkingConfidence,
      fallback.walkingConfidence,
    ),
    walkingConfidenceAfter: finiteNumber(
      entry.walkingConfidenceAfter ?? entry.walkingConfidence,
      fallback.walkingConfidenceAfter ?? fallback.walkingConfidence,
    ),
    quadActivationQuality: finiteNumber(
      entry.quadActivationQuality,
      fallback.quadActivationQuality,
    ),
    extensionResponse: normalizeRangeResponse(entry.extensionResponse),
    flexionResponse: normalizeRangeResponse(entry.flexionResponse),
    concerningSymptoms: entry.concerningSymptoms ?? "",
    movementQualityAfter:
      entry.movementQualityAfter == null ? undefined : finiteNumber(entry.movementQualityAfter, 3),
    energyFatigue: entry.energyFatigue == null ? undefined : finiteNumber(entry.energyFatigue, 3),
    milestones: entry.milestones ?? "",
    todayWin: entry.todayWin,
    notes: entry.notes ?? "",
  };
}

function migratePhoenixState(saved: Partial<PhoenixState>): PhoenixState {
  const activeMissionId = saved.currentMissionId ?? initial.currentMissionId;
  const missions = saved.missions?.length ? saved.missions : MISSIONS;
  const activeMission = missions.find((mission) => mission.id === activeMissionId) ?? MISSIONS[1];
  const campaign: Campaign = {
    ...initial.campaign,
    ...(saved.campaign ?? {}),
    name: saved.campaign?.name ?? saved.campaignName ?? initial.campaign.name,
    athleteName: saved.campaign?.athleteName ?? saved.athleteName ?? initial.campaign.athleteName,
    surgeryDate: saved.campaign?.surgeryDate ?? saved.surgeryDate ?? initial.campaign.surgeryDate,
    activePhaseId: saved.campaign?.activePhaseId ?? activeMission.phaseId,
    activeMissionIds: saved.campaign?.activeMissionIds?.length
      ? saved.campaign.activeMissionIds
      : [activeMissionId],
  };

  const milestones = (saved.milestones?.length ? saved.milestones : seedMilestones).map(
    (milestone) => {
      const seed = seedMilestones.find((item) => item.id === milestone.id);
      const missionId = (milestone.missionId ??
        milestone.mission ??
        seed?.missionId ??
        activeMissionId) as MissionId;
      const mission = missions.find((item) => item.id === missionId);
      const trackId = (milestone.trackId ??
        seed?.trackId ??
        mission?.trackIds[0] ??
        "symptoms") as RecoveryTrackId;
      return {
        ...seed,
        ...milestone,
        mission: milestone.mission ?? missionId,
        missionId,
        trackId,
        criteria: milestone.criteria ?? seed?.criteria ?? [milestone.evidence],
      };
    },
  );

  const savedMorning = normalizeMorningCheckIn(saved.morning as LegacyMorningCheckIn | undefined);
  const savedEvening = normalizeEveningCheckIn(saved.evening ?? undefined);
  const normalizedSavedCheckIns =
    saved.checkIns?.map((entry) => ({
      ...entry,
      phaseId:
        entry.phaseId ?? entry.morning?.phaseId ?? entry.evening?.phaseId ?? activeMission.phaseId,
      morning: normalizeMorningCheckIn(entry.morning as LegacyMorningCheckIn | undefined),
      evening: normalizeEveningCheckIn(entry.evening),
    })) ?? [];

  const checkIns =
    normalizedSavedCheckIns.length || savedMorning || savedEvening
      ? [
          ...normalizedSavedCheckIns,
          ...(savedMorning || savedEvening
            ? [
                createCheckIn(
                  savedMorning?.date ?? savedEvening?.date ?? getLocalDateKey(),
                  savedMorning,
                  savedEvening,
                ),
              ]
            : []),
        ]
      : initial.checkIns;

  const dailyCoachPlans: DailyCoachPlan[] = (saved.dailyCoachPlans ?? initial.dailyCoachPlans).map(
    (plan) => {
      const raw = plan as Omit<Partial<DailyCoachPlan>, "source" | "readiness"> & {
        source?: string;
        readiness?: DailyCoachPlan["readiness"] | { status?: string; reason?: string };
        focus?: string;
        priority?: string;
        importedAt?: string;
        planType?: string;
        stopRules?: string[];
        eveningCheckInFocus?: string[];
        notes?: string;
        status?: DailyCoachPlanStatus;
      };
      const readiness =
        typeof raw.readiness === "object" && raw.readiness ? raw.readiness.status : raw.readiness;
      const source: DailyCoachPlanSource =
        raw.source?.toLowerCase() === "chatgpt"
          ? "ChatGPT"
          : raw.source === "physio" ||
              raw.source === "surgeon" ||
              raw.source === "trainer" ||
              raw.source === "self" ||
              raw.source === "other"
            ? (raw.source as DailyCoachPlanSource)
            : "self";
      const isSeedPlan =
        raw.importedFromNoteId === "coach-note-1" ||
        raw.notes?.includes("Imported plan seed shows the intended Daily Coach Plan shape");
      const importedAt = raw.importedAt ?? raw.createdAt ?? getUtcTimestamp();
      const localDate =
        raw.localDate || raw.date || localDateFromTimestampUtc(importedAt) || getLocalDateKey();
      const phaseId = PHASE_CONFIGS.some((phase) => phase.id === raw.phaseId)
        ? (raw.phaseId as PhaseId)
        : "activation-early-rom";
      const confidence =
        raw.confidence === "High" || raw.confidence === "Low" || raw.confidence === "Medium"
          ? raw.confidence
          : "Medium";

      return {
        ...raw,
        id: raw.id ?? `plan-${localDate}-${slugify(importedAt)}`,
        date: localDate,
        localDate,
        timestampUtc: raw.timestampUtc ?? importedAt,
        source,
        createdAt: raw.createdAt ?? importedAt,
        importedAt,
        planType: "daily_coach_plan",
        phaseId,
        missionIds: raw.missionIds ?? [],
        trackIds: raw.trackIds ?? [],
        readiness:
          readiness === "ready" || readiness === "recover" || readiness === "modify"
            ? readiness
            : "modify",
        readinessReason:
          raw.readinessReason ??
          (typeof raw.readiness === "object" && raw.readiness ? raw.readiness.reason : undefined),
        primaryFocus: raw.primaryFocus ?? raw.focus ?? raw.priority ?? "Daily coach plan",
        focus: raw.focus ?? raw.primaryFocus ?? raw.priority ?? "Daily coach plan",
        priority: raw.priority ?? raw.primaryFocus ?? raw.focus ?? "Daily coach plan",
        workload: raw.workload ?? "",
        rationale: raw.rationale ?? "",
        nextReassessment: raw.nextReassessment ?? "",
        confidence,
        targets: raw.targets ?? [],
        stopRules: raw.stopRules ?? [],
        eveningCheckInFocus: raw.eveningCheckInFocus ?? [],
        quests: (raw.quests ?? []).map((quest) => ({
          ...quest,
          date: localDate,
          localDate,
          timestampUtc: quest.timestampUtc ?? raw.timestampUtc ?? importedAt,
        })),
        notes: raw.notes ?? "",
        status: isSeedPlan ? "archived" : (raw.status ?? "active"),
      };
    },
  );
  const recoveryIqEvents = (saved.recoveryIqEvents ?? [])
    .map(normalizeRecoveryIqEvent)
    .filter((event): event is RecoveryIqEvent => Boolean(event));
  const smallWins = (saved.smallWins ?? [])
    .map(normalizeSmallWin)
    .filter((win): win is SmallWin => Boolean(win));

  return {
    ...initial,
    ...saved,
    campaign,
    phases: normalizePhaseConfigs(saved.phases),
    recoveryTracks: saved.recoveryTracks?.length ? saved.recoveryTracks : RECOVERY_TRACKS,
    missions,
    currentMissionId: activeMissionId,
    athleteName: campaign.athleteName,
    surgeryDate: campaign.surgeryDate,
    campaignName: campaign.name,
    recoveryIqXp: 0,
    morning: savedMorning ?? initial.morning,
    evening: savedEvening ?? initial.evening,
    checkIns,
    milestones,
    dailyCoachPlans,
    coachNotes: (saved.coachNotes ?? initial.coachNotes).map(normalizeCoachNote),
    athleteNotes: (saved.athleteNotes ?? initial.athleteNotes).map(normalizeAthleteNote),
    recoveryIqEvents,
    smallWins,
    coachPackets: (saved.coachPackets ?? initial.coachPackets).map(normalizeCoachPacket),
  };
}

// ---------- store ----------
const KEY = "phoenix-os:v1";
let state: PhoenixState = load();
const listeners = new Set<() => void>();

function load(): PhoenixState {
  if (typeof window === "undefined") return initial;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return initial;
    return migratePhoenixState(JSON.parse(raw) as Partial<PhoenixState>);
  } catch {
    return initial;
  }
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

export function setState(updater: (s: PhoenixState) => PhoenixState) {
  state = updater(state);
  persist();
  listeners.forEach((l) => l());
}

export function getState() {
  return state;
}

export function usePhoenix(): PhoenixState {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => state,
    () => initial,
  );
}

// ---------- derived helpers ----------
export const LEVEL_STEP = 500;

export function levelFromXp(xp: number) {
  const safeXp = Math.max(0, xp);
  const level = Math.floor(safeXp / LEVEL_STEP) + 1;
  const intoLevel = safeXp % LEVEL_STEP;
  const pct = (intoLevel / LEVEL_STEP) * 100;
  return { level, intoLevel, pct, toNext: LEVEL_STEP - intoLevel };
}

function recoveryIqEventId(
  sourceType: RecoveryIqEventSourceType,
  sourceId: string | undefined,
  date: string,
  title: string,
) {
  return `iq-${sourceType}-${slugify(sourceId || `${date}-${title}`)}`;
}

export function recoveryIqXpFromEvents(events: RecoveryIqEvent[] = []): number {
  const total = events.reduce((sum, event) => {
    const xp = Number.isFinite(event.xpAmount) ? event.xpAmount : 0;
    return sum + xp;
  }, 0);
  return Math.max(0, total);
}

export function recoveryIqXpForState(s: Pick<PhoenixState, "recoveryIqEvents">): number {
  return recoveryIqXpFromEvents(s.recoveryIqEvents ?? []);
}

export function recoveryIqForState(s: Pick<PhoenixState, "recoveryIqEvents">) {
  return levelFromXp(recoveryIqXpForState(s));
}

export function createRecoveryIqEvent({
  date,
  sourceType,
  sourceId,
  title,
  description,
  xpAmount,
  timestamp = getUtcTimestamp(),
}: {
  date: string;
  sourceType: RecoveryIqEventSourceType;
  sourceId?: string;
  title: string;
  description?: string;
  xpAmount: number;
  timestamp?: string;
}): RecoveryIqEvent {
  const timestampUtc = timestamp;
  return {
    id: recoveryIqEventId(sourceType, sourceId, date, title),
    date,
    localDate: date,
    timestamp: timestampUtc,
    timestampUtc,
    sourceType,
    sourceId,
    title,
    description,
    xpAmount,
    createdAt: timestampUtc,
  };
}

export function upsertRecoveryIqEvent(
  events: RecoveryIqEvent[] = [],
  event: RecoveryIqEvent,
): RecoveryIqEvent[] {
  const withoutDuplicate = events.filter((existing) => {
    const sameId = existing.id === event.id;
    const sameSource =
      Boolean(event.sourceId) &&
      existing.sourceType === event.sourceType &&
      existing.sourceId === event.sourceId;
    return !sameId && !sameSource;
  });
  return [...withoutDuplicate, event].sort((a, b) => (a.timestamp < b.timestamp ? -1 : 1));
}

export function removeRecoveryIqEvent(
  events: RecoveryIqEvent[] = [],
  sourceType: RecoveryIqEventSourceType,
  sourceId: string,
): RecoveryIqEvent[] {
  return events.filter((event) => event.sourceType !== sourceType || event.sourceId !== sourceId);
}

export function currentCampaign(s: PhoenixState): Campaign {
  return s.campaign;
}

export function currentMission(s: PhoenixState): Mission {
  return (s.missions ?? MISSIONS).find((m) => m.id === s.currentMissionId) ?? MISSIONS[1];
}

export function activeMissions(s: PhoenixState): Mission[] {
  const missionIds = s.campaign.activeMissionIds?.length
    ? s.campaign.activeMissionIds
    : [s.currentMissionId];
  const missions = s.missions ?? MISSIONS;
  return missionIds
    .map((id) => missions.find((mission) => mission.id === id))
    .filter((mission): mission is Mission => Boolean(mission));
}

export function currentPhase(s: PhoenixState): Phase {
  const mission = currentMission(s);
  const phaseId = s.campaign.activePhaseId ?? mission.phaseId;
  return phaseConfigById(phaseId, s.phases);
}

export function phaseConfigById(phaseId: PhaseId, phases = PHASE_CONFIGS): Phase {
  return phases.find((phase) => phase.id === phaseId) ?? PHASE_CONFIGS[0];
}

export function phaseForDate(s: PhoenixState, isoDate = getLocalDateKey()): Phase {
  const saved = s.checkIns?.find((entry) => dailyRecordDate(entry) === isoDate);
  const morning = saved?.morning ?? getMorningForDate(s, isoDate);
  const evening = saved?.evening ?? getEveningForDate(s, isoDate);
  return phaseConfigById(
    saved?.phaseId ?? morning?.phaseId ?? evening?.phaseId ?? currentPhase(s).id,
    s.phases ?? PHASE_CONFIGS,
  );
}

export function morningCheckInFieldsForPhase(phase: Phase): CheckInFieldId[] {
  return phase.morningCheckInFields;
}

export function eveningCheckInFieldsForPhase(phase: Phase): CheckInFieldId[] {
  return phase.eveningCheckInFields;
}

export function activeRecoveryTracksForPhase(s: PhoenixState, phase: Phase): RecoveryTrack[] {
  const activeTrackIds = new Set<RecoveryTrackId>([
    ...phase.activeTrackIds,
    ...activeMissions(s).flatMap((mission) => mission.trackIds),
  ]);
  return (s.recoveryTracks ?? RECOVERY_TRACKS).filter((track) => activeTrackIds.has(track.id));
}

export function activeRecoveryTracks(s: PhoenixState): RecoveryTrack[] {
  return activeRecoveryTracksForPhase(s, currentPhase(s));
}

export function recoveryStatus(s: PhoenixState): {
  label: string;
  tone: "good" | "watch" | "alert";
} {
  const m = s.morning;
  if (!m) return { label: "Awaiting check-in", tone: "watch" };
  if (m.pain >= 5 || m.swelling >= 5) return { label: "Reactive — back off", tone: "alert" };
  if (m.pain > 3 || m.swelling >= 3) return { label: "Watch — hold volume", tone: "watch" };
  return { label: "Green — proceed as planned", tone: "good" };
}

// ---------- date / readiness / trend helpers ----------

export function daysPostOp(s: PhoenixState, isoDate: string): number {
  const a = new Date(s.surgeryDate + "T00:00:00");
  const b = new Date(isoDate + "T00:00:00");
  return Math.max(0, Math.round((b.getTime() - a.getTime()) / 86_400_000));
}

export function getMorningForDate(s: PhoenixState, isoDate: string): MorningCheckIn | null {
  return allMorningCheckIns(s).find((m) => dailyRecordDate(m) === isoDate) ?? null;
}

export function getEveningForDate(s: PhoenixState, isoDate: string): EveningCheckIn | null {
  return allEveningCheckIns(s).find((e) => dailyRecordDate(e) === isoDate) ?? null;
}

export function getCheckInForDate(s: PhoenixState, isoDate: string): CheckIn {
  const saved = s.checkIns?.find((entry) => dailyRecordDate(entry) === isoDate);
  return {
    id: saved?.id ?? `check-in-${isoDate}`,
    date: isoDate,
    localDate: isoDate,
    timestampUtc: saved?.timestampUtc,
    phaseId: saved?.phaseId ?? currentPhase(s).id,
    morning: saved?.morning ?? getMorningForDate(s, isoDate) ?? undefined,
    evening: saved?.evening ?? getEveningForDate(s, isoDate) ?? undefined,
  };
}

export function previousMorning(s: PhoenixState, isoDate: string): MorningCheckIn | null {
  const all = allMorningCheckIns(s)
    .filter((m) => dailyRecordDate(m) < isoDate)
    .sort((a, b) => (dailyRecordDate(a) < dailyRecordDate(b) ? 1 : -1));
  return all[0] ?? null;
}

export function previousEvening(s: PhoenixState, isoDate: string): EveningCheckIn | null {
  const all = allEveningCheckIns(s)
    .filter((e) => dailyRecordDate(e) < isoDate)
    .sort((a, b) => (dailyRecordDate(a) < dailyRecordDate(b) ? 1 : -1));
  return all[0] ?? null;
}

type QuestDraft = Omit<DailyQuest, "date" | "done">;

function quest(
  id: string,
  label: string,
  kind: QuestKind,
  xp: number,
  source: QuestSource,
  reason: string,
): QuestDraft {
  return { id, label, kind, xp, source, reason };
}

function addQuest(quests: QuestDraft[], next: QuestDraft) {
  const existingIndex = quests.findIndex((q) => q.id === next.id);
  if (existingIndex === -1) {
    quests.push(next);
    return;
  }

  const existing = quests[existingIndex];
  quests[existingIndex] = {
    ...existing,
    ...next,
    kind: existing.kind === "main" ? "main" : next.kind,
    xp: Math.max(existing.xp, next.xp),
  };
}

function eveningWalkingConfidence(e: EveningCheckIn): number {
  return e.walkingConfidenceAfter ?? e.walkingConfidence;
}

function responseWasNegative(response: RangeResponse): boolean {
  return response === "felt_stiffer" || response === "painful_or_pinching";
}

function hasConcerningEveningSymptoms(e: EveningCheckIn | null): boolean {
  if (!e) return false;
  return hasConcerningNotes(`${e.concerningSymptoms} ${e.notes}`);
}

function previousEveningWasReactive(e: EveningCheckIn | null): boolean {
  if (!e) return false;
  return (
    e.painAfter >= 5 ||
    e.swellingChange >= 2 ||
    eveningWalkingConfidence(e) <= 2 ||
    responseWasNegative(e.extensionResponse) ||
    responseWasNegative(e.flexionResponse) ||
    hasConcerningEveningSymptoms(e)
  );
}

function previousEveningWasStable(e: EveningCheckIn | null): boolean {
  if (!e) return false;
  return (
    e.painAfter <= 3 &&
    e.swellingChange <= 0 &&
    eveningWalkingConfidence(e) >= 3 &&
    !responseWasNegative(e.extensionResponse) &&
    !responseWasNegative(e.flexionResponse) &&
    !hasConcerningEveningSymptoms(e)
  );
}

function extensionStatusIsLimited(status: ExtensionStatus): boolean {
  return (
    status === "slightly_limited" ||
    status === "moderately_limited" ||
    status === "significantly_limited"
  );
}

function formatStatusReason(value: string): string {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function extensionQuestLabel(morning: MorningCheckIn | null, previous: EveningCheckIn | null) {
  if (!morning) return "Gentle extension exposure, only if tolerated";
  if (
    morning.pain > 3 ||
    normalizedSwellingLevel(morning) >= 3 ||
    previousEveningWasReactive(previous) ||
    morning.extensionStatus === "significantly_limited"
  ) {
    return "Gentle extension exposure in a relaxed position, only if tolerated";
  }
  if (morning.extensionStatus === "reaches_neutral") {
    return "Comfortable extension maintenance, only if tolerated";
  }
  return "Extension exposure, relaxed position only";
}

function addMissionQuests(
  quests: QuestDraft[],
  mission: Mission,
  morning: MorningCheckIn | null,
  previous: EveningCheckIn | null,
) {
  const stable = previousEveningWasStable(previous);
  const source: QuestSource = stable ? "previous-evening" : "mission";
  const reason = stable
    ? "Because yesterday's response was stable"
    : `Because the current mission is ${mission.name}`;

  switch (mission.id) {
    case "calm-the-knee":
      addQuest(
        quests,
        quest(
          "swelling-control",
          "Swelling control / comfortable elevation",
          "main",
          15,
          source,
          reason,
        ),
      );
      addQuest(
        quests,
        quest("comfortable-walking", "Comfortable walking practice", "main", 15, source, reason),
      );
      break;
    case "wake-the-quad":
      addQuest(
        quests,
        quest("quad-activation", "Quad activation sets", "main", 15, source, reason),
      );
      addQuest(
        quests,
        quest(
          "walking-practice",
          "Short walking practice with support as needed",
          "main",
          15,
          source,
          reason,
        ),
      );
      break;
    case "restore-extension":
      addQuest(
        quests,
        quest(
          "extension-exposure",
          extensionQuestLabel(morning, previous),
          "main",
          20,
          source,
          reason,
        ),
      );
      addQuest(
        quests,
        quest(
          "gentle-heel-slides",
          "Gentle heel slides 1–2 sets of 10, comfortable range only",
          "main",
          15,
          source,
          reason,
        ),
      );
      addQuest(
        quests,
        quest("quad-activation", "Quad activation sets", "main", 15, "mission", reason),
      );
      break;
    case "build-capacity":
      addQuest(
        quests,
        quest("capacity-walk", "Low-impact capacity walk", "main", 20, source, reason),
      );
      addQuest(
        quests,
        quest("strength-tolerance", "Strength tolerance session", "main", 20, source, reason),
      );
      break;
    case "become-an-athlete-again":
      addQuest(quests, quest("readiness-scan", "Sport readiness scan", "main", 15, source, reason));
      addQuest(
        quests,
        quest(
          "controlled-conditioning",
          "Controlled conditioning exposure",
          "main",
          20,
          source,
          reason,
        ),
      );
      break;
  }
}

function addMorningSignalQuests(
  quests: QuestDraft[],
  morning: MorningCheckIn | null,
  previous: EveningCheckIn | null,
) {
  if (!morning) return;

  if (morning.pain >= 5 || morning.swelling >= 5) {
    addQuest(
      quests,
      quest(
        "recovery-priority",
        "Recovery priority: comfort, swelling control, and easy movement",
        "main",
        20,
        "morning-check-in",
        morning.swelling >= 5 ? "Because swelling is elevated" : "Because pain is elevated",
      ),
    );
  }

  if (morning.swelling >= 3) {
    addQuest(
      quests,
      quest(
        "swelling-control",
        "Swelling control / comfortable elevation",
        "main",
        15,
        "morning-check-in",
        "Because swelling is elevated",
      ),
    );
  }

  if (morning.walkingConfidence <= 2) {
    addQuest(
      quests,
      quest(
        "supported-walking",
        "Supported walking practice",
        "main",
        15,
        "morning-check-in",
        "Because walking confidence is low",
      ),
    );
  }

  if (
    extensionStatusIsLimited(morning.extensionStatus) &&
    morning.pain < 5 &&
    normalizedSwellingLevel(morning) < 5
  ) {
    addQuest(
      quests,
      quest(
        "extension-exposure",
        extensionQuestLabel(morning, previous),
        "main",
        20,
        "morning-check-in",
        `Because extension status is ${formatStatusReason(morning.extensionStatus)}`,
      ),
    );
  }

  if (morning.sleepHours < 7) {
    addQuest(
      quests,
      quest(
        "sleep-window",
        "Sleep window",
        "side",
        5,
        "morning-check-in",
        "Because last night's sleep was short",
      ),
    );
  }
}

function addPreviousEveningQuests(quests: QuestDraft[], previous: EveningCheckIn | null) {
  if (!previous) return;

  if (previousEveningWasReactive(previous)) {
    addQuest(
      quests,
      quest(
        "hold-volume",
        "Hold volume; keep work gentle",
        "main",
        15,
        "previous-evening",
        "Because yesterday's evening response was reactive",
      ),
    );
    addQuest(
      quests,
      quest(
        "ice-elevation",
        "Ice/elevation if swelling increases",
        "side",
        5,
        "previous-evening",
        "Because yesterday's evening response was reactive",
      ),
    );
  }

  if (previous.quadActivationQuality <= 2) {
    addQuest(
      quests,
      quest(
        "quad-activation",
        "Gentle quad activation practice",
        "main",
        15,
        "previous-evening",
        "Because yesterday's quad activation quality was low after activation work",
      ),
    );
  }

  if (
    responseWasNegative(previous.extensionResponse) ||
    responseWasNegative(previous.flexionResponse)
  ) {
    addQuest(
      quests,
      quest(
        "comfortable-rom-only",
        "Comfortable ROM only; avoid painful or pinching ranges",
        "main",
        15,
        "previous-evening",
        "Because yesterday's ROM response was stiff, painful, or pinching",
      ),
    );
  }
}

function addPhaseTemplateQuests(
  quests: QuestDraft[],
  phase: Phase,
  isoDate: string,
  morning: MorningCheckIn | null,
) {
  phase.questTemplateDefaults.forEach((template) => {
    const reason =
      template.id === "protein-target" && morning
        ? `Because today's target is ${morning.proteinTargetG}g`
        : template.reason.replace("{date}", isoDate);
    addQuest(
      quests,
      quest(template.id, template.label, template.kind, template.xp, "phase", reason),
    );
  });
}

function addBaselineQuests(quests: QuestDraft[], isoDate: string, morning: MorningCheckIn | null) {
  addQuest(
    quests,
    quest(
      "morning-check-in",
      "Morning check-in",
      "main",
      10,
      "date",
      `Because ${isoDate} needs a morning baseline`,
    ),
  );
  addQuest(
    quests,
    quest(
      "evening-check-in",
      "Evening check-in",
      "main",
      10,
      "date",
      `Because ${isoDate} needs an evening response`,
    ),
  );
  addQuest(
    quests,
    quest(
      "protein-target",
      "Protein target",
      "side",
      10,
      "baseline",
      morning
        ? `Because today's target is ${morning.proteinTargetG}g`
        : "Because nutrition supports recovery",
    ),
  );
  addQuest(
    quests,
    quest("hydration", "Hydration", "side", 5, "baseline", "Because hydration supports recovery"),
  );
  addQuest(
    quests,
    quest(
      "sleep-window",
      "Sleep window",
      "side",
      5,
      "baseline",
      "Because sleep supports tomorrow's response",
    ),
  );
}

function clinicianConstraintBlocksQuest(quest: QuestDraft, constraint: ClinicianConstraint) {
  const blockedIds = constraint.blockedQuestIds ?? [];
  const blockedLabels = constraint.blockedLabelIncludes ?? [];
  return (
    blockedIds.includes(quest.id) ||
    blockedLabels.some((label) => quest.label.toLowerCase().includes(label.toLowerCase()))
  );
}

function applyClinicianConstraints(
  quests: QuestDraft[],
  constraints: ClinicianConstraint[] = [],
): QuestDraft[] {
  const activeConstraints = constraints.filter((constraint) => constraint.active !== false);
  const allowedQuests = quests.filter(
    (quest) =>
      !activeConstraints.some((constraint) => clinicianConstraintBlocksQuest(quest, constraint)),
  );

  activeConstraints.forEach((constraint) => {
    addQuest(
      allowedQuests,
      quest(
        `clinician-${constraint.id}`,
        constraint.questLabel ?? `Follow clinician guidance: ${constraint.label}`,
        constraint.kind ?? "main",
        constraint.xp ?? 0,
        "clinician-constraint",
        constraint.reason ?? "Because clinician constraints are present",
      ),
    );
  });

  return allowedQuests;
}

export function generateDailyQuestPlan(s: PhoenixState, isoDate = getLocalDateKey()): QuestDraft[] {
  const phase = phaseForDate(s, isoDate);
  const morning = getMorningForDate(s, isoDate);
  const priorEvening = previousEvening(s, isoDate);
  const constraints = s.clinicianConstraints ?? [];

  const quests: QuestDraft[] = [];
  if (phase.questTemplateDefaults.length > 0) {
    addPhaseTemplateQuests(quests, phase, isoDate, morning);
  } else {
    addBaselineQuests(quests, isoDate, morning);
  }
  activeMissions(s).forEach((mission) => addMissionQuests(quests, mission, morning, priorEvening));
  addMorningSignalQuests(quests, morning, priorEvening);
  addPreviousEveningQuests(quests, priorEvening);
  return applyClinicianConstraints(quests, constraints);
}

const LEGACY_QUEST_ID_ALIASES: Record<string, string[]> = {
  "morning-check-in": ["q1"],
  "quad-activation": ["q2"],
  "day-1-quad-activation": ["q2"],
  "extension-exposure": ["q3"],
  "day-1-gentle-heel-prop": ["q3"],
  "day-1-gentle-heel-slides": ["q6"],
  "gentle-heel-slides": ["q6"],
  "evening-check-in": ["q5"],
  "protein-target": ["q4"],
  "sleep-window": ["q7"],
};

function storedCompletionForQuest(
  s: PhoenixState,
  isoDate: string,
  quest: QuestDraft | DailyQuest,
): boolean | null {
  const completions = s.questCompletions?.[isoDate];
  if (completions && Object.prototype.hasOwnProperty.call(completions, quest.id)) {
    return completions[quest.id];
  }

  if (isoDate !== getLocalDateKey()) return null;

  const ids = [quest.id, ...(LEGACY_QUEST_ID_ALIASES[quest.id] ?? [])];
  const saved = s.todayQuests.find((q) => ids.includes(q.id) || q.label === quest.label);
  return saved ? saved.done : null;
}

function questDoneForDate(
  s: PhoenixState,
  isoDate: string,
  quest: QuestDraft | DailyQuest,
): boolean {
  const stored = storedCompletionForQuest(s, isoDate, quest);
  if (stored !== null) return stored;
  if (quest.id === "morning-check-in") return Boolean(getMorningForDate(s, isoDate));
  if (quest.id === "evening-check-in") return Boolean(getEveningForDate(s, isoDate));
  if ("done" in quest) return quest.done;
  return false;
}

function normalizeQuestForDate(
  s: PhoenixState,
  isoDate: string,
  quest: QuestDraft | DailyQuest,
): DailyQuest {
  const done = questDoneForDate(s, isoDate, quest);
  return {
    ...quest,
    date: isoDate,
    localDate: isoDate,
    label: quest.label,
    title: quest.title ?? quest.label,
    done,
    status: done ? "complete" : quest.status === "skipped" ? "skipped" : "pending",
    category: quest.category ?? quest.kind,
  };
}

type DashboardObjectiveGroup =
  | "check-in"
  | "movement"
  | "activation_rom"
  | "recovery_support"
  | "evening_response";

function normalizedQuestText(quest: Pick<DailyQuest, "id" | "label" | "reason">): string {
  return `${quest.id} ${quest.label} ${quest.reason}`.toLowerCase();
}

function dashboardObjectiveGroupForQuest(quest: DailyQuest): DashboardObjectiveGroup {
  const text = normalizedQuestText(quest);
  if (quest.id === "morning-check-in" || text.includes("morning check")) return "check-in";
  if (quest.id === "evening-check-in" || text.includes("evening check")) return "evening_response";
  if (
    text.includes("walk") ||
    text.includes("gait") ||
    text.includes("movement") ||
    text.includes("ankle pump") ||
    text.includes("step")
  ) {
    return "movement";
  }
  if (
    text.includes("swelling") ||
    text.includes("elevation") ||
    text.includes("ice") ||
    text.includes("protein") ||
    text.includes("hydration") ||
    text.includes("sleep") ||
    text.includes("rest") ||
    text.includes("recover") ||
    text.includes("hold volume")
  ) {
    return "recovery_support";
  }
  return "activation_rom";
}

function uniqueDetails(values: string[]): string[] {
  const seen = new Set<string>();
  return values
    .map((value) => value.trim())
    .filter(Boolean)
    .filter((value) => {
      const key = value.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function groupDone(groupId: string, childQuests: DailyQuest[], fallbackDone = false): boolean {
  if (childQuests.length === 0) return fallbackDone;
  if (groupId === "morning-check-in" || groupId === "evening-check-in") {
    return childQuests.some((quest) => quest.done);
  }
  return childQuests.every((quest) => quest.done);
}

function dashboardObjective(
  plan: DailyCoachPlan,
  group: DashboardObjectiveGroup,
  childQuests: DailyQuest[],
): DailyQuest {
  const fromActiveCoachPlan = plan.status === "active" && plan.id !== `generated-plan-${plan.date}`;
  const source: QuestSource = fromActiveCoachPlan ? "daily-coach-plan" : "phase";
  const sourceLabel = fromActiveCoachPlan ? "Generated from active Coach Plan" : undefined;
  const relatedQuestIds = childQuests.map((quest) => quest.id);
  const childDetails = childQuests
    .filter((quest) => quest.id !== "morning-check-in" && quest.id !== "evening-check-in")
    .flatMap((quest) => [quest.label, ...(quest.details ?? [])]);

  switch (group) {
    case "check-in":
      return {
        id: "morning-check-in",
        date: plan.date,
        label: "Morning baseline check-in",
        title: "Morning baseline check-in",
        done: groupDone("morning-check-in", childQuests),
        status: groupDone("morning-check-in", childQuests) ? "complete" : "pending",
        xp: 10,
        kind: "main",
        category: "main",
        source,
        sourceLabel,
        reason: "Purpose: establish starting state.",
        details: ["Pain, swelling, walking confidence, extension status, flexion comfort, sleep."],
        relatedQuestIds,
        phaseId: plan.phaseId,
        planId: fromActiveCoachPlan ? plan.id : undefined,
      };
    case "movement":
      return {
        id: "gentle-movement-exposure",
        date: plan.date,
        label: "Gentle movement exposure",
        title: "Gentle movement exposure",
        done: groupDone("gentle-movement-exposure", childQuests),
        status: groupDone("gentle-movement-exposure", childQuests) ? "complete" : "pending",
        xp: 15,
        kind: "main",
        category: "main",
        source,
        sourceLabel,
        reason: "Purpose: short supported walks and easy movement.",
        details: uniqueDetails([
          "Prioritize clean gait, comfort, and confidence. No chasing steps.",
          ...childDetails,
        ]),
        relatedQuestIds,
        phaseId: plan.phaseId,
        planId: fromActiveCoachPlan ? plan.id : undefined,
      };
    case "activation_rom":
      return {
        id: "activation-rom-work",
        date: plan.date,
        label: "Activation + ROM work",
        title: "Activation + ROM work",
        done: groupDone("activation-rom-work", childQuests),
        status: groupDone("activation-rom-work", childQuests) ? "complete" : "pending",
        xp: 20,
        kind: "main",
        category: "main",
        source,
        sourceLabel,
        reason: fromActiveCoachPlan
          ? "Purpose: complete today's prescribed activation and gentle ROM work from the active Daily Coach Plan."
          : "Purpose: complete today's conservative activation and gentle ROM work.",
        details: uniqueDetails([
          ...(childDetails.length
            ? childDetails
            : ["Quad sets", "Gentle extension exposure", "Heel slides if prescribed/tolerated"]),
        ]),
        relatedQuestIds,
        phaseId: plan.phaseId,
        planId: fromActiveCoachPlan ? plan.id : undefined,
      };
    case "recovery_support":
      return {
        id: "recovery-support",
        date: plan.date,
        label: "Recovery support",
        title: "Recovery support",
        done: groupDone("recovery-support", childQuests),
        status: groupDone("recovery-support", childQuests) ? "complete" : "pending",
        xp: 15,
        kind: "main",
        category: "main",
        source,
        sourceLabel,
        reason: "Purpose: support healing and avoid irritation.",
        details: uniqueDetails([
          "Comfort-based swelling control",
          "Protein target",
          "Hydration",
          "Rest / elevation as needed",
          ...childDetails,
        ]),
        relatedQuestIds,
        phaseId: plan.phaseId,
        planId: fromActiveCoachPlan ? plan.id : undefined,
      };
    case "evening_response":
      return {
        id: "evening-check-in",
        date: plan.date,
        label: "Evening response check-in",
        title: "Evening response check-in",
        done: groupDone("evening-check-in", childQuests),
        status: groupDone("evening-check-in", childQuests) ? "complete" : "pending",
        xp: 10,
        kind: "main",
        category: "main",
        source,
        sourceLabel,
        reason: "Purpose: record how the knee responded to today's work.",
        details: [
          "Pain during / after",
          "Swelling change",
          "Walking response",
          "Quad activation quality",
          "Extension response",
          "Flexion response",
        ],
        relatedQuestIds,
        phaseId: plan.phaseId,
        planId: fromActiveCoachPlan ? plan.id : undefined,
      };
  }
}

export function groupCoachPlanQuestsIntoDashboardObjectives(plan: DailyCoachPlan): DailyQuest[] {
  const groups: Record<DashboardObjectiveGroup, DailyQuest[]> = {
    "check-in": [],
    movement: [],
    activation_rom: [],
    recovery_support: [],
    evening_response: [],
  };

  plan.quests.forEach((quest) => {
    groups[dashboardObjectiveGroupForQuest(quest)].push(quest);
  });

  return (
    ["check-in", "movement", "activation_rom", "recovery_support", "evening_response"] as const
  )
    .map((group) => dashboardObjective(plan, group, groups[group]))
    .slice(0, 5);
}

export function dailyCoachPlanForDate(
  s: PhoenixState,
  isoDate = getLocalDateKey(),
): DailyCoachPlan {
  const importedPlan = activeDailyCoachPlanForDate(s, isoDate);
  if (importedPlan) {
    return {
      ...importedPlan,
      quests: importedPlan.quests.map((quest) => normalizeQuestForDate(s, isoDate, quest)),
    };
  }

  const phase = phaseForDate(s, isoDate);
  const missions = activeMissions(s);
  const readiness = readinessForDate(s, isoDate);
  const rec = s.todayRecommendation;
  const tracks = activeRecoveryTracksForPhase(s, phase);
  const timestampUtc = getUtcTimestamp();

  return {
    id: `generated-plan-${isoDate}`,
    date: isoDate,
    localDate: isoDate,
    timestampUtc,
    source: "self",
    createdAt: timestampUtc,
    importedAt: timestampUtc,
    planType: "daily_coach_plan",
    phaseId: phase.id,
    missionIds: missions.map((mission) => mission.id),
    trackIds: tracks.map((track) => track.id),
    readiness: readiness.state,
    readinessReason: readiness.summary,
    primaryFocus: missions.map((mission) => mission.name).join(" + "),
    focus: missions.map((mission) => mission.name).join(" + "),
    priority: rec.priority,
    workload: rec.workload,
    rationale: rec.reason,
    nextReassessment: rec.nextReassessment,
    confidence: rec.confidence,
    targets: tracks.map((track) => ({
      id: `target-${track.id}`,
      label: track.name,
      value: track.description,
      trackId: track.id,
    })),
    quests: generateDailyQuestPlan(s, isoDate).map((quest) =>
      normalizeQuestForDate(s, isoDate, quest),
    ),
    stopRules: ["Stop or modify if pain, swelling, or walking quality worsens."],
    eveningCheckInFocus: phase.eveningCheckInFields
      .filter((field) => field !== "notes" && field !== "exercises-completed")
      .map((field) => checkInFieldLabel(field)),
    notes: "Generated from local Project Phoenix rules when no imported coach plan is active.",
    status: "draft",
  };
}

export function activeDailyCoachPlanForDate(
  s: PhoenixState,
  isoDate = getLocalDateKey(),
): DailyCoachPlan | null {
  const plan =
    s.dailyCoachPlans
      ?.filter((item) => dailyRecordDate(item) === isoDate && item.status === "active")
      .sort((a, b) => (a.importedAt < b.importedAt ? 1 : -1))[0] ?? null;
  if (!plan) return null;
  return {
    ...plan,
    date: isoDate,
    localDate: isoDate,
    quests: plan.quests.map((quest) => normalizeQuestForDate(s, isoDate, quest)),
  };
}

export function dailyQuestsForDate(s: PhoenixState, isoDate = getLocalDateKey()): DailyQuest[] {
  const plan = dailyCoachPlanForDate(s, isoDate);
  const phaseId = plan.phaseId ?? phaseForDate(s, isoDate).id;
  const shouldGroup =
    phaseId === "acute-response" ||
    phaseId === "activation-early-rom" ||
    Boolean(activeDailyCoachPlanForDate(s, isoDate));
  const quests = shouldGroup ? groupCoachPlanQuestsIntoDashboardObjectives(plan) : plan.quests;
  return quests.map((quest) => normalizeQuestForDate(s, isoDate, quest));
}

export type DailyCoachPlanImportResult =
  | { ok: true; plan: DailyCoachPlan }
  | { ok: false; errors: string[] };

const DAILY_COACH_PLAN_SOURCES: DailyCoachPlanSource[] = [
  "ChatGPT",
  "physio",
  "surgeon",
  "trainer",
  "self",
  "other",
];

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function stringValue(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function stringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => (typeof item === "string" ? item.trim() : "")).filter(Boolean);
  }
  const single = stringValue(value);
  return single ? [single] : [];
}

function normalizeDailyCoachPlanSource(value: unknown): DailyCoachPlanSource | null {
  const source = stringValue(value);
  if (source.toLowerCase() === "chatgpt") return "ChatGPT";
  return DAILY_COACH_PLAN_SOURCES.includes(source as DailyCoachPlanSource)
    ? (source as DailyCoachPlanSource)
    : null;
}

function normalizeDailyCoachPlanReadiness(value: unknown): DailyCoachPlan["readiness"] {
  const readiness = stringValue(value).toLowerCase();
  return readiness === "ready" || readiness === "recover" || readiness === "modify"
    ? readiness
    : "modify";
}

function normalizePlanTargets(value: unknown): DailyCoachPlanTarget[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item, index) => {
      if (typeof item === "string") {
        const label = item.trim();
        if (!label) return null;
        return {
          id: `target-${index + 1}-${slugify(label)}`,
          label,
          value: label,
        };
      }

      if (!item || typeof item !== "object") return null;
      const record = item as Record<string, unknown>;
      const label = stringValue(record.label) || stringValue(record.name) || `Target ${index + 1}`;
      const value =
        stringValue(record.value) ||
        stringValue(record.target) ||
        stringValue(record.description) ||
        label;
      return {
        id: stringValue(record.id) || `target-${index + 1}-${slugify(label)}`,
        label,
        value,
        reason: stringValue(record.reason) || undefined,
        trackId: RECOVERY_TRACKS.some((track) => track.id === record.trackId)
          ? (record.trackId as RecoveryTrackId)
          : undefined,
      };
    })
    .filter((target): target is DailyCoachPlanTarget => Boolean(target));
}

function normalizeImportedQuest(
  value: unknown,
  index: number,
  date: string,
  planId: string,
): DailyQuest | null {
  if (typeof value === "string") {
    const label = value.trim();
    if (!label) return null;
    return {
      id: `quest-${index + 1}-${slugify(label)}`,
      date,
      localDate: date,
      label,
      title: label,
      done: false,
      status: "pending",
      xp: 10,
      kind: "main",
      category: "main",
      source: "daily-coach-plan",
      reason: "Imported from Daily Coach Plan",
      planId,
    };
  }

  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  const label =
    stringValue(record.label) ||
    stringValue(record.title) ||
    stringValue(record.name) ||
    `Quest ${index + 1}`;
  const kindValue = stringValue(record.kind) || stringValue(record.category);
  const kind: QuestKind = kindValue === "side" ? "side" : "main";
  const xp = typeof record.xp === "number" && Number.isFinite(record.xp) ? record.xp : 10;
  const status = stringValue(record.status);
  const done =
    typeof record.done === "boolean"
      ? record.done
      : status === "complete" || status === "completed";
  const details = stringArray(record.details);

  return {
    id: stringValue(record.id) || `quest-${index + 1}-${slugify(label)}`,
    date,
    localDate: date,
    label,
    title: stringValue(record.title) || label,
    done,
    status: done ? "complete" : status === "skipped" ? "skipped" : "pending",
    xp,
    kind,
    category: kind,
    source: "daily-coach-plan",
    reason: stringValue(record.reason) || "Imported from Daily Coach Plan",
    details: details.length ? details : undefined,
    phaseId: PHASE_CONFIGS.some((phase) => phase.id === record.phaseId)
      ? (record.phaseId as PhaseId)
      : undefined,
    trackIds: Array.isArray(record.trackIds)
      ? record.trackIds.filter((track): track is RecoveryTrackId =>
          RECOVERY_TRACKS.some((known) => known.id === track),
        )
      : undefined,
    missionId: MISSIONS.some((mission) => mission.id === record.missionId)
      ? (record.missionId as MissionId)
      : undefined,
    planId,
    target: stringValue(record.target) || undefined,
  };
}

export function parseDailyCoachPlanJson(
  rawJson: string,
  fallbackDate = getLocalDateKey(),
): DailyCoachPlanImportResult {
  const errors: string[] = [];
  let parsed: unknown;

  try {
    parsed = JSON.parse(rawJson);
  } catch {
    return { ok: false, errors: ["JSON could not be parsed."] };
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return { ok: false, errors: ["Coach plan JSON must be an object."] };
  }

  const input = parsed as Record<string, unknown>;
  const date = stringValue(input.date);
  const source = normalizeDailyCoachPlanSource(input.source);
  const primaryFocus = stringValue(input.primaryFocus);
  const questsInput = input.quests;
  const stopRulesInput = input.stopRules;

  if (!date) errors.push("date is required.");
  if (!source) errors.push("source is required.");
  if (!primaryFocus) errors.push("primaryFocus is required.");
  if (!Array.isArray(questsInput)) errors.push("quests array is required.");
  if (!Array.isArray(stopRulesInput)) errors.push("stopRules array is required.");
  if (errors.length > 0 || !source) return { ok: false, errors };

  const planDate = date || fallbackDate;
  const id = stringValue(input.id) || `plan-${planDate}-${Date.now()}`;
  const quests = (questsInput as unknown[])
    .map((quest, index) => normalizeImportedQuest(quest, index, planDate, id))
    .filter((quest): quest is DailyQuest => Boolean(quest));
  const stopRules = stringArray(stopRulesInput);

  if (quests.length === 0) errors.push("quests array must contain at least one quest.");
  if (stopRules.length === 0) errors.push("stopRules array must contain at least one stop rule.");
  if (errors.length > 0) return { ok: false, errors };

  const importedAt = getUtcTimestamp();
  const createdAt = stringValue(input.createdAt) || importedAt;
  const activePhase = PHASE_CONFIGS.some((phase) => phase.id === input.phaseId)
    ? (input.phaseId as PhaseId)
    : "activation-early-rom";

  return {
    ok: true,
    plan: {
      id,
      date: planDate,
      localDate: planDate,
      timestampUtc: importedAt,
      source,
      authorName: stringValue(input.authorName) || undefined,
      createdAt,
      importedAt,
      planType: "daily_coach_plan",
      phaseId: activePhase,
      missionIds: Array.isArray(input.missionIds)
        ? input.missionIds.filter((mission): mission is MissionId =>
            MISSIONS.some((known) => known.id === mission),
          )
        : [],
      trackIds: Array.isArray(input.trackIds)
        ? input.trackIds.filter((track): track is RecoveryTrackId =>
            RECOVERY_TRACKS.some((known) => known.id === track),
          )
        : [],
      readiness: normalizeDailyCoachPlanReadiness(input.readiness),
      readinessReason: stringValue(input.readinessReason) || undefined,
      primaryFocus,
      focus: primaryFocus,
      priority: stringValue(input.priority) || primaryFocus,
      workload: stringValue(input.workload) || "",
      rationale: stringValue(input.rationale) || "",
      nextReassessment: stringValue(input.nextReassessment) || "",
      confidence:
        input.confidence === "High" || input.confidence === "Low" || input.confidence === "Medium"
          ? input.confidence
          : "Medium",
      targets: normalizePlanTargets(input.targets),
      quests,
      stopRules,
      eveningCheckInFocus: stringArray(input.eveningCheckInFocus),
      notes: stringValue(input.notes),
      status: "draft",
    },
  };
}

export function activateDailyCoachPlan(plan: DailyCoachPlan) {
  setState((prev) => {
    const importedAt = plan.importedAt || getUtcTimestamp();
    const localDate = plan.localDate || plan.date;
    const timestampUtc = plan.timestampUtc || importedAt;
    const previousQuests = dailyQuestsForDate(prev, localDate);
    const previousCompleted = previousQuests.filter((quest) => quest.done);
    const nextQuestCompletions = {
      ...(prev.questCompletions ?? {}),
      [localDate]: {
        ...(prev.questCompletions?.[localDate] ?? {}),
      },
    };

    const quests: DailyQuest[] = plan.quests.map((quest) => {
      const matchedCompleted = previousCompleted.find(
        (existing) => existing.id === quest.id || existing.label === quest.label,
      );
      const done = Boolean(matchedCompleted ?? quest.done);
      nextQuestCompletions[localDate][quest.id] = done;
      return {
        ...quest,
        date: localDate,
        localDate,
        timestampUtc,
        done,
        status: (done
          ? "complete"
          : quest.status === "skipped"
            ? "skipped"
            : "pending") as QuestStatus,
        source: "daily-coach-plan" as QuestSource,
        planId: plan.id,
      };
    });

    const activatedPlan: DailyCoachPlan = {
      ...plan,
      date: localDate,
      localDate,
      timestampUtc,
      quests,
      importedAt,
      status: "active",
    };

    return {
      ...prev,
      dailyCoachPlans: [
        ...(prev.dailyCoachPlans ?? []).map((existing) =>
          dailyRecordDate(existing) === localDate && existing.status === "active"
            ? { ...existing, status: "replaced" as DailyCoachPlanStatus }
            : existing,
        ),
        activatedPlan,
      ],
      questCompletions: nextQuestCompletions,
      todayQuests: localDate === getLocalDateKey() ? quests : prev.todayQuests,
      recoveryIqEvents: upsertRecoveryIqEvent(
        prev.recoveryIqEvents,
        createRecoveryIqEvent({
          date: localDate,
          sourceType: "coach_plan",
          sourceId: `coach-plan:${plan.id}`,
          title: "Daily Coach Plan imported",
          description: plan.primaryFocus,
          xpAmount: 25,
          timestamp: activatedPlan.importedAt,
        }),
      ),
    };
  });
}

export function archiveDailyCoachPlan(planId: string) {
  setState((prev) => ({
    ...prev,
    dailyCoachPlans: prev.dailyCoachPlans.map((plan) =>
      plan.id === planId ? { ...plan, status: "archived" } : plan,
    ),
  }));
}

export type Trend = "up" | "down" | "flat" | "none";

function upsertByDate<T extends { date: string; localDate?: string }>(entries: T[], entry: T): T[] {
  const entryDate = dailyRecordDate(entry);
  const withoutDate = entries.filter((existing) => dailyRecordDate(existing) !== entryDate);
  return [...withoutDate, entry].sort((a, b) => (dailyRecordDate(a) < dailyRecordDate(b) ? -1 : 1));
}

function dedupeByDate<T extends { date: string; localDate?: string }>(entries: T[]): T[] {
  const byDate = new Map<string, T>();
  entries.forEach((entry) => byDate.set(dailyRecordDate(entry), entry));
  return [...byDate.values()].sort((a, b) => (dailyRecordDate(a) < dailyRecordDate(b) ? -1 : 1));
}

function upsertCheckIn(entries: CheckIn[], patch: CheckIn): CheckIn[] {
  const patchDate = dailyRecordDate(patch);
  const existing = entries.find((entry) => dailyRecordDate(entry) === patchDate);
  const next: CheckIn = {
    id: existing?.id ?? patch.id,
    date: patchDate,
    localDate: patchDate,
    timestampUtc: patch.timestampUtc ?? existing?.timestampUtc,
    phaseId: patch.phaseId ?? existing?.phaseId ?? "activation-early-rom",
    morning: patch.morning ?? existing?.morning,
    evening: patch.evening ?? existing?.evening,
  };
  return upsertByDate(entries, next);
}

export function allMorningCheckIns(s: PhoenixState): MorningCheckIn[] {
  return dedupeByDate([
    ...s.history.morning,
    ...(s.checkIns ?? []).flatMap((entry) => (entry.morning ? [entry.morning] : [])),
    ...(s.morning ? [s.morning] : []),
  ]);
}

export function allEveningCheckIns(s: PhoenixState): EveningCheckIn[] {
  return dedupeByDate([
    ...s.history.evening,
    ...(s.checkIns ?? []).flatMap((entry) => (entry.evening ? [entry.evening] : [])),
    ...(s.evening ? [s.evening] : []),
  ]);
}

export function saveMorningCheckIn(entry: MorningCheckIn) {
  setState((prev) => {
    const phaseId = entry.phaseId ?? currentPhase(prev).id;
    const localDate = entry.localDate || entry.date;
    const timestampUtc = entry.timestampUtc || getUtcTimestamp();
    const savedEntry = { ...entry, date: localDate, localDate, timestampUtc, phaseId };
    return {
      ...prev,
      morning: localDate === getLocalDateKey() ? savedEntry : prev.morning,
      checkIns: upsertCheckIn(prev.checkIns ?? [], {
        id: `check-in-${localDate}`,
        date: localDate,
        localDate,
        timestampUtc,
        phaseId,
        morning: savedEntry,
      }),
      history: {
        ...prev.history,
        morning: upsertByDate(prev.history.morning, savedEntry),
      },
      recoveryIqEvents: upsertRecoveryIqEvent(
        prev.recoveryIqEvents,
        createRecoveryIqEvent({
          date: localDate,
          sourceType: "check_in",
          sourceId: `morning-check-in:${localDate}`,
          title: "Morning check-in completed",
          description: "Daily evidence was logged before choosing today's workload.",
          xpAmount: 10,
          timestamp: timestampUtc,
        }),
      ),
    };
  });
}

export function saveEveningCheckIn(entry: EveningCheckIn) {
  setState((prev) => {
    const phaseId = entry.phaseId ?? currentPhase(prev).id;
    const localDate = entry.localDate || entry.date;
    const timestampUtc = entry.timestampUtc || getUtcTimestamp();
    const savedEntry = { ...entry, date: localDate, localDate, timestampUtc, phaseId };
    return {
      ...prev,
      evening: localDate === getLocalDateKey() ? savedEntry : prev.evening,
      checkIns: upsertCheckIn(prev.checkIns ?? [], {
        id: `check-in-${localDate}`,
        date: localDate,
        localDate,
        timestampUtc,
        phaseId,
        evening: savedEntry,
      }),
      history: {
        ...prev.history,
        evening: upsertByDate(prev.history.evening, savedEntry),
      },
      recoveryIqEvents: upsertRecoveryIqEvent(
        prev.recoveryIqEvents,
        createRecoveryIqEvent({
          date: localDate,
          sourceType: "check_in",
          sourceId: `evening-check-in:${localDate}`,
          title: "Evening check-in completed",
          description: "Response data was logged for tomorrow's recovery decision.",
          xpAmount: 10,
          timestamp: timestampUtc,
        }),
      ),
    };
  });
}

/** direction: "lower-better" (pain, swelling) or "higher-better" (confidence, extension*) */
export function trendFor(
  current: number | undefined,
  previous: number | undefined,
  direction: "lower-better" | "higher-better",
): { trend: Trend; delta: number } {
  if (current == null || previous == null) return { trend: "none", delta: 0 };
  const delta = +(current - previous).toFixed(1);
  if (delta === 0) return { trend: "flat", delta: 0 };
  const improved = direction === "lower-better" ? delta < 0 : delta > 0;
  return { trend: improved ? "up" : "down", delta };
}

export type Readiness = {
  state: "ready" | "modify" | "recover";
  label: string;
  dot: string; // emoji
  summary: string;
};

type ReadinessContext = {
  recoveryDay?: number;
  previousMorning?: MorningCheckIn | null;
  previousEvening?: EveningCheckIn | null;
  phaseId?: PhaseId;
  readinessRuleIds?: string[];
};

function normalizedSwellingLevel(m: MorningCheckIn): number {
  return m.swellingLevel ?? m.swelling;
}

function derivedSwellingTrend(
  current: MorningCheckIn,
  previous: MorningCheckIn | null,
): SwellingTrend {
  if (current.swellingTrend) return current.swellingTrend;
  if (!previous) return "unknown";

  const delta = normalizedSwellingLevel(current) - normalizedSwellingLevel(previous);
  if (delta >= 1) return "worse";
  if (delta <= -1) return "improved";
  return "stable";
}

function swellingIncrease(current: MorningCheckIn, previous: MorningCheckIn | null): number {
  if (!previous) return 0;
  return normalizedSwellingLevel(current) - normalizedSwellingLevel(previous);
}

function hasConcerningNotes(notes: string): boolean {
  const normalized = notes.toLowerCase();
  return [
    "fever",
    "redness",
    "hot",
    "heat",
    "drainage",
    "calf",
    "shortness of breath",
    "instability",
    "buckling",
    "sharp",
    "worse",
  ].some((term) => normalized.includes(term));
}

function activityInducedSwellingResponse(
  current: MorningCheckIn,
  previousMorningEntry: MorningCheckIn | null,
  previousEveningEntry: EveningCheckIn | null,
): boolean {
  const context = current.swellingContext ?? "unknown";
  if (context === "activity_response") return true;
  if ((previousEveningEntry?.swellingChange ?? 0) >= 2) return true;
  return swellingIncrease(current, previousMorningEntry) >= 2;
}

function swellingPairedWithNegativeSignals(
  current: MorningCheckIn,
  previousMorningEntry: MorningCheckIn | null,
  previousEveningEntry: EveningCheckIn | null,
): boolean {
  const painIncrease = previousMorningEntry ? current.pain - previousMorningEntry.pain : 0;
  const walkingConfidenceDrop = previousMorningEntry
    ? previousMorningEntry.walkingConfidence - current.walkingConfidence
    : 0;
  const movementQualityLow =
    (current.movementQuality != null && current.movementQuality <= 2) ||
    (previousEveningEntry?.movementQualityAfter != null &&
      previousEveningEntry.movementQualityAfter <= 2);
  const previousEveningNegative =
    previousEveningEntry != null &&
    (eveningWalkingConfidence(previousEveningEntry) <= 2 ||
      responseWasNegative(previousEveningEntry.extensionResponse) ||
      responseWasNegative(previousEveningEntry.flexionResponse) ||
      hasConcerningEveningSymptoms(previousEveningEntry));

  return (
    painIncrease >= 2 ||
    current.pain >= 4 ||
    walkingConfidenceDrop >= 1 ||
    current.walkingConfidence <= 2 ||
    previousEveningNegative ||
    movementQualityLow ||
    hasConcerningNotes(current.notes)
  );
}

export function readinessFor(m: MorningCheckIn | null, context: ReadinessContext = {}): Readiness {
  if (!m)
    return {
      state: "modify",
      label: "Awaiting check-in",
      dot: "🟡",
      summary: "Log a morning check-in to score today's readiness.",
    };

  const recoveryDay = context.recoveryDay;
  const previousMorningEntry = context.previousMorning ?? null;
  const previousEveningEntry = context.previousEvening ?? null;
  const phaseId = context.phaseId ?? m.phaseId ?? "activation-early-rom";
  const readinessRuleIds =
    context.readinessRuleIds ??
    (phaseId === "acute-response" || phaseId === "activation-early-rom"
      ? ["early-post-op-modify", "activity-response-recover"]
      : []);
  const readinessRuleSet = new Set(readinessRuleIds);
  const usesEarlyPostOpSwellingRule = readinessRuleSet.has("early-post-op-modify");
  const usesActivityResponseRule =
    readinessRuleSet.has("activity-response-recover") ||
    readinessRuleSet.has("previous-evening-reactive") ||
    readinessRuleSet.has("rom-response-check");
  const swellingLevel = normalizedSwellingLevel(m);
  const swellingTrend = derivedSwellingTrend(m, previousMorningEntry);
  const swellingContext = m.swellingContext ?? "unknown";
  const earlyPostOp = recoveryDay != null && recoveryDay >= 0 && recoveryDay <= 3;
  const activityResponse = activityInducedSwellingResponse(
    m,
    previousMorningEntry,
    previousEveningEntry,
  );
  const pairedNegativeSignals = swellingPairedWithNegativeSignals(
    m,
    previousMorningEntry,
    previousEveningEntry,
  );
  const swellingWithNegativeSignals =
    swellingLevel >= (earlyPostOp ? 4 : 5) && pairedNegativeSignals;
  const expectedEarlySwelling =
    usesEarlyPostOpSwellingRule &&
    earlyPostOp &&
    swellingLevel >= 4 &&
    swellingLevel <= 6 &&
    m.pain <= 3 &&
    m.walkingConfidence >= 3 &&
    !activityResponse &&
    !pairedNegativeSignals &&
    (swellingContext === "surgical_baseline" ||
      swellingContext === "unknown" ||
      swellingTrend === "stable" ||
      swellingTrend === "unknown");

  if (expectedEarlySwelling) {
    return {
      state: "modify",
      label: "Modify",
      dot: "🟡",
      summary:
        "Expected post-op swelling present. Complete gentle recovery work. Avoid volume increases.",
    };
  }

  if (
    m.pain >= 5 ||
    (usesActivityResponseRule && activityResponse) ||
    swellingWithNegativeSignals ||
    (swellingLevel >= 7 && !earlyPostOp)
  )
    return {
      state: "recover",
      label: "Recover",
      dot: "🔴",
      summary:
        "Reactive swelling response. Reduce workload and prioritize symptom control, easy movement, and reassessment.",
    };

  if (m.pain > 3 || swellingLevel >= 3 || m.walkingConfidence <= 2)
    return {
      state: "modify",
      label: "Modify",
      dot: "🟡",
      summary: earlyPostOp
        ? "Post-op symptoms are present. Complete gentle recovery work and avoid volume increases."
        : "Hold volume. Substitute heavy work for activation and range.",
    };
  return {
    state: "ready",
    label: "Ready",
    dot: "🟢",
    summary: "Green light. Proceed with today's planned session.",
  };
}

export function readinessForDate(s: PhoenixState, isoDate = getLocalDateKey()): Readiness {
  const phase = phaseForDate(s, isoDate);
  return readinessFor(getMorningForDate(s, isoDate), {
    phaseId: phase.id,
    readinessRuleIds: phase.readinessRuleIds,
    recoveryDay: daysPostOp(s, isoDate),
    previousMorning: previousMorning(s, isoDate),
    previousEvening: previousEvening(s, isoDate),
  });
}

export const PRINCIPLES: { title: string; body: string }[] = [
  {
    title: "Progression is earned, never assumed.",
    body: "The calendar does not promote you. Evidence does.",
  },
  {
    title: "Recovery is training.",
    body: "What you do between sessions decides what the next session can be.",
  },
  {
    title: "Adaptations matter more than exercises.",
    body: "The exercise is a stimulus. The adaptation is the point.",
  },
  {
    title: "Competency matters more than timelines.",
    body: "Move when you've earned it — not when the protocol says so.",
  },
  { title: "Evidence beats ego.", body: "What the data says wins over what you want to be true." },
  {
    title: "Tomorrow's response matters more than today's workout.",
    body: "If today breaks tomorrow, today wasn't a win.",
  },
];

export function principleForDate(isoDate: string) {
  const seed = isoDate.split("-").reduce((a, p) => a + parseInt(p, 10), 0);
  return PRINCIPLES[seed % PRINCIPLES.length];
}

export const PHASE_PRINCIPLES: { title: string; body: string }[] = [
  {
    title: "Recovery is training.",
    body: "What you do between sessions decides what the next session can be.",
  },
  {
    title: "Progression is earned, never assumed.",
    body: "The calendar does not promote you. Evidence does.",
  },
  { title: "Load builds capacity.", body: "Tissue tolerates what you teach it to tolerate." },
  { title: "Consistency beats intensity.", body: "Stacked good days compound. Heroic ones don't." },
  {
    title: "Performance is earned.",
    body: "Return-to-sport is a test you pass, not a date you hit.",
  },
];

export function principleForPhase(phaseN: number) {
  return PHASE_PRINCIPLES[Math.min(Math.max(phaseN, 1), 5) - 1];
}

export const PHASES = PHASE_CONFIGS.map((phase) => ({
  n: phase.order,
  name: phase.name.replace(/^Phase \d+ · /, ""),
  phaseId: phase.id,
}));

export function currentPhaseN(s: PhoenixState): number {
  return currentPhase(s).order;
}

export function missionMilestoneProgress(s: PhoenixState, missionId: MissionId) {
  const list = s.milestones.filter((m) => m.mission === missionId);
  const total = Math.max(list.length, 1);
  const done = list.filter((m) => m.status === "unlocked").length;
  return { done, total, pct: Math.round((done / total) * 100) };
}

export function todaysWin(
  current: MorningCheckIn | null,
  previous: MorningCheckIn | null,
): { label: string; detail: string } {
  return todaysWinFromRules(PHASE_CONFIGS[1], current, previous);
}

function mainQuestsCompleteForDate(s: PhoenixState, isoDate: string): boolean {
  const main = dailyQuestsForDate(s, isoDate).filter((quest) => quest.kind === "main");
  return main.length > 0 && main.every((quest) => quest.done);
}

function todaysWinFromRules(
  phase: Phase,
  current: MorningCheckIn | null,
  previous: MorningCheckIn | null,
  s?: PhoenixState,
  isoDate?: string,
): { label: string; detail: string } {
  const rules = new Set(phase.smallWinRuleIds);
  if (!current) return { label: "Show up today", detail: "Log a check-in to start the streak." };
  if (previous) {
    if (
      rules.has("walking-confidence-improved") &&
      current.walkingConfidence > previous.walkingConfidence
    )
      return {
        label: `Walking confidence improved by +${current.walkingConfidence - previous.walkingConfidence}`,
        detail: "Gait is trending the right direction.",
      };
    if (rules.has("pain-decreased") && current.pain < previous.pain)
      return {
        label: `Pain dropped by ${previous.pain - current.pain}`,
        detail: "Tissue is quieting down.",
      };
    if (rules.has("swelling-stable") && current.swelling < previous.swelling)
      return {
        label: `Swelling dropped by ${previous.swelling - current.swelling}`,
        detail: "Inflammation gate is loosening.",
      };
    if (rules.has("swelling-stable") && current.swelling === previous.swelling)
      return { label: "Swelling stayed stable", detail: "Maintenance is a win." };
  }
  const evening = s && isoDate ? getEveningForDate(s, isoDate) : null;
  if (
    rules.has("rom-response-stable") &&
    evening &&
    evening.painAfter <= 3 &&
    evening.swellingChange <= 0 &&
    (evening.extensionResponse === "felt_same" || evening.extensionResponse === "felt_better") &&
    (evening.flexionResponse === "felt_same" || evening.flexionResponse === "felt_better")
  ) {
    return {
      label: "ROM response stayed stable",
      detail: "Extension and flexion work stayed inside a tolerable range.",
    };
  }
  if (rules.has("quad-activation-quality-logged") && evening) {
    return {
      label: "Quad activation quality logged",
      detail: "The activation signal was checked after the day's work.",
    };
  }
  if (rules.has("main-quests-completed") && s && isoDate && mainQuestsCompleteForDate(s, isoDate))
    return { label: "Main quests complete", detail: "The configured work is done for today." };
  if (current.pain <= 3 && current.swelling <= 2)
    return { label: "Pain remained in the green zone", detail: "Stable baseline held." };
  if (current.swelling <= 2)
    return { label: "Swelling stayed stable", detail: "Maintenance is a win." };
  return { label: "Check-in logged", detail: "Evidence over assumption — that's the work." };
}

export function todaysWinForDate(
  s: PhoenixState,
  isoDate = getLocalDateKey(),
): { label: string; detail: string } {
  return todaysWinFromRules(
    phaseForDate(s, isoDate),
    getMorningForDate(s, isoDate),
    previousMorning(s, isoDate),
    s,
    isoDate,
  );
}

export function smallWinForDate(s: PhoenixState, isoDate = getLocalDateKey()): SmallWin {
  const saved = s.smallWins.find((win) => dailyRecordDate(win) === isoDate);
  if (saved) return saved;

  const win = todaysWinForDate(s, isoDate);
  return {
    id: `small-win-${isoDate}`,
    date: isoDate,
    localDate: isoDate,
    title: win.label,
    description: win.detail,
    source: "rule",
  };
}

export function coachNotesForDate(s: PhoenixState, isoDate = getLocalDateKey()): CoachNote[] {
  return s.coachNotes.filter((note) => dailyRecordDate(note) === isoDate);
}

export function latestCoachNoteForDateAndPhase(
  s: PhoenixState,
  isoDate = getLocalDateKey(),
): CoachNote | null {
  const phaseId = currentPhase(s).id;
  return (
    s.coachNotes
      .filter(
        (note) =>
          dailyRecordDate(note) === isoDate &&
          note.id !== "coach-note-1" &&
          (note.relatedPhaseId == null || note.relatedPhaseId === phaseId) &&
          !note.tags?.includes("seed") &&
          !note.tags?.includes("demo"),
      )
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))[0] ?? null
  );
}

export function athleteNotesForDate(s: PhoenixState, isoDate = getLocalDateKey()): AthleteNote[] {
  return s.athleteNotes.filter((note) => dailyRecordDate(note) === isoDate);
}

export function recoveryIqEventsForDate(
  s: PhoenixState,
  isoDate = getLocalDateKey(),
): RecoveryIqEvent[] {
  return s.recoveryIqEvents.filter((event) => dailyRecordDate(event) === isoDate);
}
