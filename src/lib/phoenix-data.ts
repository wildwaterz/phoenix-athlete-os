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
  | "controlled-weight-shift"
  | "sit-to-stand-control"
  | "step-and-stair-control"
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
  | "gait-quality"
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

export type FlexionLimitingFactor =
  | "joint_limited"
  | "incision_limited"
  | "swelling_limited"
  | "pain_limited"
  | "unknown";

export type GaitQuality =
  | "heavy_limp_needs_support"
  | "noticeable_limp"
  | "slow_but_controlled"
  | "mostly_clean"
  | "normal_for_current_phase"
  | "not_assessed";

export const GAIT_QUALITY_OPTIONS: GaitQuality[] = [
  "heavy_limp_needs_support",
  "noticeable_limp",
  "slow_but_controlled",
  "mostly_clean",
  "normal_for_current_phase",
  "not_assessed",
];

export const GAIT_QUALITY_LABELS: Record<GaitQuality, string> = {
  heavy_limp_needs_support: "Heavy limp / needs support",
  noticeable_limp: "Noticeable limp",
  slow_but_controlled: "Slow but controlled",
  mostly_clean: "Mostly clean",
  normal_for_current_phase: "Normal for current phase",
  not_assessed: "Not assessed",
};

export function formatGaitQuality(value: GaitQuality | undefined): string {
  if (!value || value === "not_assessed") return "not assessed";
  return GAIT_QUALITY_LABELS[value];
}

function normalizeGaitQuality(value: unknown): GaitQuality {
  return GAIT_QUALITY_OPTIONS.includes(value as GaitQuality)
    ? (value as GaitQuality)
    : "not_assessed";
}

function gaitQualityScore(value: GaitQuality | undefined): number | undefined {
  if (value === "heavy_limp_needs_support") return 1;
  if (value === "noticeable_limp") return 2;
  if (value === "slow_but_controlled") return 3;
  if (value === "mostly_clean") return 4;
  if (value === "normal_for_current_phase") return 5;
  return undefined;
}

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
  title: string;
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
  status: MissionStatus;
  maintenanceWhenComplete?: boolean;
}

export type MissionStatus =
  | "locked"
  | "active"
  | "pending_confirmation"
  | "complete"
  | "maintenance"
  | "blocked";

export type MissionCriterionState =
  | "locked"
  | "not_started"
  | "in_progress"
  | "pending_confirmation"
  | "achieved"
  | "blocked";

export type MissionCriterionEvidenceSource =
  | "check_in"
  | "coach_import"
  | "task_response"
  | "manual"
  | "milestone"
  | "not_assessed";

export interface MissionCriterion {
  id: string;
  title: string;
  evidenceRuleDescription: string;
  requiredCount?: number;
  currentCount?: number;
  state: MissionCriterionState;
  linkedMilestoneIds?: string[];
  lastEvidenceDate?: string;
  evidenceSummary?: string;
  evidenceSource?: MissionCriterionEvidenceSource;
  remainingText?: string;
}

export interface Milestone {
  id: string;
  title: string;
  mission: MissionId;
  missionId: MissionId;
  trackId: RecoveryTrackId;
  name: string;
  description: string;
  why: string;
  evidence: MilestoneEvidence[];
  evidenceSummary: string;
  criteria: string[];
  unlockCriteria: string[];
  nextStepIfConfirmed: string;
  nextStepIfNotConfirmed: string;
  progressionType: ProgressionType;
  state: MilestoneState;
  status: MilestoneState;
  unlockedAt?: string;
  coachNotes?: string;
  allowsImmediateUnlock?: boolean;
}

export type MilestoneState =
  | "locked"
  | "testable"
  | "observation_passed"
  | "test_passed_pending_confirmation"
  | "unlocked_progressing"
  | "unlocked"
  | "paused";

export type MilestoneEvidenceType =
  | "check_in"
  | "quest_completion"
  | "skill_test"
  | "coach_note"
  | "coach_plan"
  | "manual";

export interface MilestoneEvidence {
  date: string;
  type: MilestoneEvidenceType;
  summary: string;
  confidence: "low" | "medium" | "high";
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
  gaitQuality?: GaitQuality;
  extensionStatus: ExtensionStatus;
  flexionStatus: FlexionStatus;
  flexionLimitingFactor?: FlexionLimitingFactor;
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
  gaitQualityAfter?: number;
  quadActivationQuality: number;
  extensionResponse: RangeResponse;
  flexionResponse: RangeResponse;
  flexionLimitingFactor?: FlexionLimitingFactor;
  concerningSymptoms: string;
  movementQualityAfter?: number;
  energyFatigue?: number;
  milestones: string;
  todayWin?: string;
  taskCompletions?: Record<string, PrescribedTaskCompletion>;
  skillTestResults?: Record<string, SkillTestResult>;
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

export type QuestType =
  | "required_action"
  | "optional_skill_test"
  | "recovery_basic"
  | "check_in"
  | "monitoring";

export type ProgressionType = "load" | "skill_control" | "rom" | "walking" | "recovery";

export type PrescribedTaskCategory =
  | "check_in_morning"
  | "check_in_evening"
  | "walking"
  | "gait"
  | "activation"
  | "rom_extension"
  | "rom_flexion"
  | "recovery_basics"
  | "nutrition"
  | "hydration"
  | "sleep"
  | "swelling_management"
  | "skill_test";

export type DashboardObjectiveCategory =
  | "morning_check_in"
  | "movement_exposure"
  | "activation"
  | "rom"
  | "recovery_basics"
  | "evening_check_in"
  | "skill_test"
  | "milestone_watch";

export type DashboardObjectiveId = DashboardObjectiveCategory;

export interface DashboardObjective {
  id: DashboardObjectiveId;
  title: string;
  purpose: string;
  xp: number;
  category: DashboardObjectiveCategory;
  taskIds: string[];
}

export type CanonicalExerciseId =
  | "morning_baseline_check_in"
  | "evening_response_check_in"
  | "supported_walk"
  | "quad_sets"
  | "straight_leg_raise"
  | "heel_slides"
  | "heel_prop_extension"
  | "protein_target"
  | "hydration"
  | "sleep_target"
  | "pacing_rest"
  | "elevation_if_symptomatic"
  | "ice_if_symptomatic"
  | (string & {});

export type TaskIntent = "check_in" | "build" | "maintain" | "recover" | "fuel" | "test";
export type TaskPriority = "required" | "optional";

export interface PrescribedTaskPrescription {
  sets?: number;
  reps?: number;
  holdSeconds?: number;
  durationMinutes?: number;
  frequency?: string;
  effortTarget?: string;
  qualityTarget?: string;
  rangeInstruction?: string;
}

export type PrescribedTaskCompletionStatus = "not_started" | "completed" | "partial" | "skipped";

export type PrescribedTaskPartialEstimate = "less_than_half" | "about_half" | "most" | "custom";
export type PrescribedTaskAfterEffect = "no_issue" | "mild_settled" | "worse";
export type PrescribedTaskGaitQuality = "clean" | "slight_limp" | "worse_limp";
export type PrescribedTaskSupportUsed = "none" | "one_crutch" | "two_crutches" | "mixed";
export type PrescribedTaskActivationQuality =
  | "could_not_find"
  | "weak_repeatable"
  | "good_control"
  | "faded";
export type PrescribedTaskControlQuality = "clean" | "slight_lag" | "clear_lag" | "not_sure";
export type PrescribedTaskFlexionLimitingFactor =
  | "comfortable"
  | "incision_scar_tension"
  | "swelling_fullness"
  | "joint_pinch"
  | "pain"
  | "unknown";
export type PrescribedTaskExtensionAfter =
  | "relaxed_neutral"
  | "stiff"
  | "painful_pinching"
  | "not_tested";

export interface PrescribedTaskCompletion {
  status: PrescribedTaskCompletionStatus;
  actualSets?: number;
  actualReps?: number;
  actualDurationMinutes?: number;
  painDuring?: number;
  painAfter?: number;
  qualityScore?: number;
  partialEstimate?: PrescribedTaskPartialEstimate;
  limitationReason?: string;
  skippedReason?: string;
  afterEffect?: PrescribedTaskAfterEffect;
  gaitQuality?: PrescribedTaskGaitQuality;
  supportUsed?: PrescribedTaskSupportUsed;
  activationQuality?: PrescribedTaskActivationQuality;
  controlQuality?: PrescribedTaskControlQuality;
  limitingFactor?: PrescribedTaskFlexionLimitingFactor;
  flexionEstimateDegrees?: number;
  extensionAfter?: PrescribedTaskExtensionAfter;
  notes?: string;
}

export interface PrescribedTask {
  id: string;
  canonicalExerciseId: CanonicalExerciseId;
  title: string;
  category: PrescribedTaskCategory;
  parentObjectiveId: DashboardObjectiveId;
  prescription: PrescribedTaskPrescription;
  stopRules: string[];
  taskIntent: TaskIntent;
  taskPriority: TaskPriority;
  completion: PrescribedTaskCompletion;
}

export type SkillTestStatus =
  | "available"
  | "attempted"
  | "passed_pending_confirmation"
  | "failed"
  | "deferred";

export interface SkillTestDose {
  sets?: number;
  reps?: number;
  duration?: string;
  instructions: string;
}

export interface SkillTestResponseRequired {
  eveningCheckInRequired: boolean;
  nextMorningCheckInRequired: boolean;
}

export interface SkillTestResult {
  attemptedAt?: string;
  completed: boolean;
  repsCompleted?: number;
  painDuring?: number;
  painAfter?: number;
  qualityScore?: number;
  lagObserved?: boolean;
  feltControlled?: boolean;
  irritation?: boolean;
  swellingResponse?: "not_assessed" | "same" | "better" | "worse" | "unknown";
  walkingResponse?: "not_assessed" | "same" | "better" | "worse" | "unknown";
  notes?: string;
}

export interface SkillTest {
  id: string;
  date: string;
  localDate?: string;
  timestampUtc?: string;
  relatedMilestoneId: string;
  title: string;
  description: string;
  status: SkillTestStatus;
  progressionType: ProgressionType;
  testDose: SkillTestDose;
  passCriteria: string[];
  stopRules: string[];
  responseRequired: SkillTestResponseRequired;
  result: SkillTestResult;
}

export type DashboardObjectiveGroup =
  | "morning_check_in"
  | "movement_exposure"
  | "activation"
  | "rom"
  | "recovery_basics"
  | "evening_check_in"
  | "skill_test"
  | "milestone_watch";

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
  objectiveGroup?: DashboardObjectiveGroup;
  prescribedTasks?: PrescribedTask[];
  questType?: QuestType;
  progressionType?: ProgressionType;
  relatedMilestoneId?: string;
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

export interface DailyCoachPlanMilestoneUpdate {
  milestoneId: string;
  state: MilestoneState;
  summary: string;
  nextStepIfConfirmed?: string;
  nextStepIfNotConfirmed?: string;
  confidence?: MilestoneEvidence["confidence"];
}

export interface DailyCoachPlanNextUnlock {
  milestoneId: string;
  title: string;
  state: MilestoneState;
  evidenceNeeded: string[];
  nextStepIfConfirmed: string;
  nextStepIfNotConfirmed: string;
}

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
  readiness: "ready" | "modify" | "modify_positive" | "recover";
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
  skillTests: SkillTest[];
  milestoneUpdates: DailyCoachPlanMilestoneUpdate[];
  nextUnlocks: DailyCoachPlanNextUnlock[];
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
    status: "ready" | "modify" | "modify_positive" | "recover";
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
    id: string;
    name: string;
    state: MilestoneState;
    status: Milestone["status"];
    unlockedAt: string | null;
    evidence: MilestoneEvidence[];
    unlockCriteria: string[];
    nextStepIfConfirmed: string;
    nextStepIfNotConfirmed: string;
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
    prescribedTasks?: PrescribedTask[];
  }[];
  prescribedTasks?: PrescribedTask[];
  skillTests?: SkillTest[];
  nextUnlocks?: MilestoneWatchItem[];
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
  skillTests: SkillTest[];
  dailyCoachPlans: DailyCoachPlan[];
  coachNotes: CoachNote[];
  athleteNotes: AthleteNote[];
  recoveryIqEvents: RecoveryIqEvent[];
  smallWins: SmallWin[];
  coachPackets: CoachPacket[];
  questCompletions?: Record<string, Record<string, boolean>>;
  prescribedTaskCompletions?: Record<string, Record<string, PrescribedTaskCompletion>>;
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
  "gait-quality": "Gait quality",
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
      "gait-quality",
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
      "gait-quality",
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
    title: "Calm the Knee",
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
    milestoneIds: [
      "m-pain-baseline",
      "m-swelling-controlled",
      "m-walking-possible-support",
      "m-sleep-not-severely-disrupted",
    ],
    possibleQuestIds: ["ankle-pumps", "assisted-walking", "swelling-control", "gentle-quad-check"],
    nextUnlock: "Maintain calm baseline",
    status: "complete",
    maintenanceWhenComplete: true,
  },
  {
    id: "wake-the-quad",
    title: "Wake the Quad",
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
    progress: 100,
    criteria: [
      "Quad activation 4/5 on demand",
      "Straight leg raise with no lag",
      "Terminal knee extension to neutral",
    ],
    milestoneIds: [
      "m-visible-quad-set",
      "m-repeatable-quad-activation",
      "m-straight-leg-raise-testable",
      "straight_leg_raise_no_lag",
    ],
    possibleQuestIds: ["quad-activation", "activation-check-in", "supported-walking"],
    nextUnlock: "Controlled Weight Shift",
    status: "complete",
  },
  {
    id: "restore-extension",
    title: "Reclaim Range",
    name: "Reclaim Range",
    tagline: "Reclaim comfortable extension and flexion.",
    phaseId: "activation-early-rom",
    trackIds: ["rom", "symptoms", "activation"],
    objective: "Maintain neutral extension and restore comfortable flexion without symptom flare.",
    whyItMatters:
      "The knee needs both straightening and bending capacity for walking, sitting, stairs, biking, and later training.",
    why: "Lost range changes gait, loads other joints, and blocks later training.",
    estDuration: "3–6 weeks",
    phase: "Phase 2 · Activation + Early ROM",
    progress: 93,
    criteria: [
      "Extension trending toward neutral",
      "Flexion improving or stable across check-ins",
      "Heel slides tolerated without sharp pain or next-day swelling increase",
    ],
    milestoneIds: ["m-extension-0", "m-flexion-comfortable", "m-rom-work-tolerated"],
    possibleQuestIds: ["gentle-extension-exposure", "gentle-heel-slides", "rom-status-check"],
    nextUnlock: "Maintain neutral extension",
    status: "complete",
    maintenanceWhenComplete: true,
  },
  {
    id: "normalize-walking",
    title: "Normalize Household Walking",
    name: "Normalize Household Walking",
    tagline: "Improve gait quality without chasing independence.",
    phaseId: "activation-early-rom",
    trackIds: ["walking-movement", "symptoms"],
    objective: "Walk around the house with clean mechanics, using the least support needed.",
    whyItMatters:
      "Dropping support too early can reinforce compensation. Better walking matters more than faster independence.",
    why: "Quality gait restores confidence and protects the knee from avoidable swelling response.",
    estDuration: "2–5 weeks",
    phase: "Phase 2 · Activation + Early ROM",
    progress: 93,
    criteria: [
      "Walking confidence improving",
      "Support reduced only when mechanics remain clean",
      "No next-day swelling or pain increase from walking volume",
    ],
    milestoneIds: [
      "m-walking-confidence-improving",
      "m-walking-quality",
      "m-support-reduced-clean-gait",
      "m-walking-volume-no-response",
    ],
    possibleQuestIds: ["supported-walking", "comfortable-walking", "walking-response-log"],
    nextUnlock: "Weight-shift control",
    status: "complete",
    maintenanceWhenComplete: true,
  },
  {
    id: "controlled-weight-shift",
    title: "Controlled Weight Shift",
    name: "Controlled Weight Shift",
    tagline: "Confirm basic control before capacity work.",
    phaseId: "activation-early-rom",
    trackIds: ["walking-movement", "activation", "symptoms"],
    objective:
      "Test quiet, controlled weight shift without buckling, guarding, or symptom response.",
    whyItMatters:
      "Weight shift is the bridge between clean household gait and later sit-to-stand or step work.",
    why: "Control comes before load. A quiet weight shift proves the knee can accept careful force without compensation.",
    estDuration: "Current",
    phase: "Phase 2B · Control + Tolerance Confirmation",
    progress: 8,
    criteria: [
      "Weight-shift control is testable",
      "Symptoms stay quiet during the shift",
      "No buckling, guarding, or worse walking afterward",
      "No next-day swelling or pain increase",
    ],
    milestoneIds: [
      "m-weight-shift-control",
      "m-quiet-symptoms-during-shift",
      "m-no-buckling-guarding",
      "m-walking-clean-after-shift",
      "m-weight-shift-no-next-day-response",
    ],
    possibleQuestIds: ["supported-walking", "walking-response-log"],
    nextUnlock: "Weight-shift control",
    status: "active",
  },
  {
    id: "sit-to-stand-control",
    title: "Sit-to-Stand Control",
    name: "Sit-to-Stand Control",
    tagline: "Earn basic capacity without compensation.",
    phaseId: "movement-capacity",
    trackIds: ["capacity", "walking-movement", "activation", "symptoms"],
    objective:
      "Control sit-to-stand from a high chair without collapse, shift, or symptom response.",
    whyItMatters: "Sit-to-stand is the first meaningful capacity pattern after basic gait control.",
    why: "The knee needs quiet force acceptance before step-ups, stairs, and later strength work.",
    estDuration: "Upcoming",
    phase: "Phase 3 · Range / Basic Capacity",
    progress: 13,
    criteria: [
      "Weight shift tolerated",
      "High-chair sit-to-stand controlled",
      "No knee collapse or hip shift",
      "No symptom response",
    ],
    milestoneIds: [
      "m-weight-shift-tolerated",
      "m-high-chair-sit-to-stand",
      "m-no-knee-collapse-hip-shift",
      "m-sit-to-stand-no-response",
    ],
    possibleQuestIds: ["load-response-log"],
    nextUnlock: "Weight shift tolerated",
    status: "locked",
  },
  {
    id: "step-and-stair-control",
    title: "Step and Stair Control",
    name: "Step and Stair Control",
    tagline: "Turn observation into controlled stair capacity.",
    phaseId: "movement-capacity",
    trackIds: ["capacity", "walking-movement", "symptoms"],
    objective:
      "Progress from assisted stair observation to controlled step and stair work only when tolerated.",
    whyItMatters:
      "A single assisted stair ascent is useful evidence, but it does not unlock stair training by itself.",
    why: "Stairs combine range, control, confidence, and load. They need confirmation before becoming training.",
    estDuration: "Upcoming",
    phase: "Phase 3 · Range / Basic Capacity",
    progress: 0,
    criteria: [
      "Assisted stair ascent observation passed",
      "Controlled low step-up",
      "Stair ascent with support and no compensation",
      "No next-day response",
    ],
    milestoneIds: [
      "m-assisted-stair-ascent",
      "m-controlled-low-step-up",
      "m-stair-ascent-supported-no-compensation",
      "m-stair-no-next-day-response",
    ],
    possibleQuestIds: ["load-response-log"],
    nextUnlock: "Controlled low step-up",
    status: "locked",
  },
];

function seedMilestoneEvidence(
  summary: string,
  type: MilestoneEvidenceType = "manual",
  confidence: MilestoneEvidence["confidence"] = "medium",
  date = "2026-06-25",
): MilestoneEvidence {
  return { date, type, summary, confidence };
}

const seedMilestones: Milestone[] = [
  {
    id: "m-pain-baseline",
    title: "Stable pain baseline",
    mission: "calm-the-knee",
    missionId: "calm-the-knee",
    trackId: "symptoms",
    name: "Stable pain baseline",
    description: "Five consecutive days at pain <= 2/10.",
    why: "Proves the tissue has exited the acute reactive window.",
    evidence: [
      seedMilestoneEvidence("5 consecutive morning check-ins <= 2/10", "check_in", "high"),
    ],
    evidenceSummary: "5 consecutive morning check-ins <= 2/10",
    criteria: ["Pain <= 2/10 at rest for 5 consecutive days"],
    unlockCriteria: ["Pain <= 2/10 at rest for 5 consecutive days"],
    nextStepIfConfirmed: "Maintain the low symptom floor while activation work begins.",
    nextStepIfNotConfirmed: "Keep symptom control as the primary focus.",
    progressionType: "recovery",
    state: "unlocked",
    status: "unlocked",
    unlockedAt: "2025-06-12",
    coachNotes: "Earned. Move to activation work without losing this floor.",
  },
  {
    id: "m-swelling-controlled",
    title: "Swelling under control",
    mission: "calm-the-knee",
    missionId: "calm-the-knee",
    trackId: "symptoms",
    name: "Swelling under control",
    description: "Morning swelling <= 2/10 for 7 days.",
    why: "Swelling inhibits quad firing. Control it first.",
    evidence: [
      seedMilestoneEvidence("7 morning check-ins <= 2/10", "check_in", "high", "2025-06-15"),
    ],
    evidenceSummary: "7 morning check-ins <= 2/10",
    criteria: ["Morning swelling <= 2/10 for 7 days", "No activity-induced swelling spike"],
    unlockCriteria: ["Morning swelling <= 2/10 for 7 days", "No activity-induced swelling spike"],
    nextStepIfConfirmed: "Keep swelling control as background support while activation progresses.",
    nextStepIfNotConfirmed: "Hold activity volume and keep recovery support central.",
    progressionType: "recovery",
    state: "unlocked",
    status: "unlocked",
    unlockedAt: "2025-06-15",
  },
  {
    id: "m-walking-possible-support",
    title: "Walking possible with support",
    mission: "calm-the-knee",
    missionId: "calm-the-knee",
    trackId: "walking-movement",
    name: "Walking possible with support",
    description: "Basic supported walking is possible without escalating symptoms.",
    why: "Phase 1 needs safe movement, not independence.",
    evidence: [seedMilestoneEvidence("Supported household walking is possible.")],
    evidenceSummary: "Supported walking possible without symptom escalation",
    criteria: ["Walking possible with support", "No concerning symptom response"],
    unlockCriteria: ["Walking possible with support", "No concerning symptom response"],
    nextStepIfConfirmed: "Keep walking short and support-assisted as needed.",
    nextStepIfNotConfirmed: "Prioritize symptom control and reassess support needs.",
    progressionType: "walking",
    state: "unlocked",
    status: "unlocked",
  },
  {
    id: "m-sleep-not-severely-disrupted",
    title: "Sleep not severely disrupted",
    mission: "calm-the-knee",
    missionId: "calm-the-knee",
    trackId: "symptoms",
    name: "Sleep not severely disrupted",
    description: "Sleep is sufficient enough that recovery basics can continue.",
    why: "Severely disrupted sleep is a recovery limiter.",
    evidence: [seedMilestoneEvidence("Sleep is not currently blocking basic recovery work.")],
    evidenceSummary: "Sleep not currently a severe recovery blocker",
    criteria: ["Sleep not severely disrupted"],
    unlockCriteria: ["Sleep not severely disrupted"],
    nextStepIfConfirmed: "Keep protecting sleep while activation and ROM progress.",
    nextStepIfNotConfirmed: "Make symptom control and sleep protection the primary focus.",
    progressionType: "recovery",
    state: "unlocked",
    status: "unlocked",
  },
  {
    id: "m-visible-quad-set",
    title: "Visible quad set",
    mission: "wake-the-quad",
    missionId: "wake-the-quad",
    trackId: "activation",
    name: "Visible quad set",
    description: "The quad visibly contracts on command.",
    why: "A visible quad set is the first reliable activation signal.",
    evidence: [seedMilestoneEvidence("User can visibly find the quad during quad sets.")],
    evidenceSummary: "Visible quad contraction on command",
    criteria: ["Visible quad contraction"],
    unlockCriteria: ["Visible quad contraction"],
    nextStepIfConfirmed: "Keep quad sets as quality work rather than chasing fatigue.",
    nextStepIfNotConfirmed: "Return to simple quad-finding work.",
    progressionType: "skill_control",
    state: "unlocked",
    status: "unlocked",
  },
  {
    id: "m-repeatable-quad-activation",
    title: "Repeatable quad activation",
    mission: "wake-the-quad",
    missionId: "wake-the-quad",
    trackId: "activation",
    name: "Repeatable quad activation",
    description: "Quad contraction is repeatable without provoking symptoms.",
    why: "Repeatability matters more than one good contraction.",
    evidence: [seedMilestoneEvidence("Quad activation is repeatable during prescribed work.")],
    evidenceSummary: "Repeatable quad activation without symptom spike",
    criteria: ["Repeatable quad activation", "No symptom increase from activation work"],
    unlockCriteria: ["Repeatable quad activation", "No symptom increase from activation work"],
    nextStepIfConfirmed: "Small skill-control checks can be considered.",
    nextStepIfNotConfirmed: "Repeat quad sets and keep activation quality as the target.",
    progressionType: "skill_control",
    state: "unlocked",
    status: "unlocked",
  },
  {
    id: "m-straight-leg-raise-testable",
    title: "Straight leg raise testable",
    mission: "wake-the-quad",
    missionId: "wake-the-quad",
    trackId: "activation",
    name: "Straight leg raise testable",
    description: "The athlete is ready to test a small straight-leg-raise dose.",
    why: "A skill test is allowed only after symptoms, extension, and quad signal support it.",
    evidence: [
      seedMilestoneEvidence(
        "SLR became testable after low symptoms, neutral extension, and repeatable quad signal.",
      ),
    ],
    evidenceSummary: "SLR test dose criteria met",
    criteria: ["Low symptoms", "Neutral extension", "Repeatable quad signal"],
    unlockCriteria: ["Low symptoms", "Neutral extension", "Repeatable quad signal"],
    nextStepIfConfirmed: "Use a controlled SLR test dose before adding it as work.",
    nextStepIfNotConfirmed: "Keep SLR possible but not doseable.",
    progressionType: "skill_control",
    state: "unlocked",
    status: "unlocked",
  },
  {
    id: "straight_leg_raise_no_lag",
    title: "Straight Leg Raise - No Lag",
    mission: "wake-the-quad",
    missionId: "wake-the-quad",
    trackId: "activation",
    name: "Straight Leg Raise - No Lag",
    description: "Lift the leg with the knee fully locked.",
    why: "Lag indicates incomplete extension control.",
    evidence: [seedMilestoneEvidence("User can perform 2x10 SLRs with no lag.", "manual", "high")],
    evidenceSummary: "User can perform 2x10 SLRs with no lag",
    criteria: ["Straight leg raise without lag when clinically appropriate"],
    unlockCriteria: [
      "Evening pain remains <= 3/10",
      "Swelling is stable or improved",
      "Extension remains neutral",
      "Walking quality does not worsen",
      "No delayed irritation",
      "Next-morning baseline is stable",
    ],
    nextStepIfConfirmed: "Tomorrow may add SLR 1x5 clean reps, no load.",
    nextStepIfNotConfirmed: "Keep SLR possible but not doseable. Return to quad sets only.",
    progressionType: "skill_control",
    state: "unlocked",
    status: "unlocked",
  },
  {
    id: "m-extension-0",
    title: "Passive extension to neutral",
    mission: "restore-extension",
    missionId: "restore-extension",
    trackId: "rom",
    name: "Passive extension to neutral",
    description: "Relaxed extension reaches neutral without forcing.",
    why: "Lost extension changes gait and loads other joints.",
    evidence: [
      seedMilestoneEvidence("User repeatedly reaches neutral extension.", "manual", "high"),
    ],
    evidenceSummary: "User repeatedly reaches neutral extension",
    criteria: ["Extension reaches neutral", "No sharp end-range pain pattern"],
    unlockCriteria: ["Extension reaches neutral", "No sharp end-range pain pattern"],
    nextStepIfConfirmed: "Move extension from active build work to maintain/monitor.",
    nextStepIfNotConfirmed: "Use shorter relaxed exposures and avoid forced end range.",
    progressionType: "rom",
    state: "unlocked",
    status: "unlocked",
  },
  {
    id: "m-flexion-comfortable",
    title: "Comfortable flexion improving",
    mission: "restore-extension",
    missionId: "restore-extension",
    trackId: "rom",
    name: "Comfortable flexion improving",
    description: "Flexion improves or holds steady without next-day symptom increase.",
    why: "Flexion supports comfort, sitting, stairs, biking, and later training options.",
    evidence: [
      seedMilestoneEvidence(
        "User can sit at 90 degrees and reach about 110 degrees without joint limitation.",
        "manual",
        "high",
      ),
    ],
    evidenceSummary:
      "User can sit at 90 degrees and reach about 110 degrees without joint limitation",
    criteria: ["Flexion improves or remains stable", "No next-day swelling increase"],
    unlockCriteria: ["Flexion improves or remains stable", "No next-day swelling increase"],
    nextStepIfConfirmed: "Repeat or gently progress comfortable flexion exposure.",
    nextStepIfNotConfirmed: "Keep flexion in a smaller comfortable range.",
    progressionType: "rom",
    state: "unlocked_progressing",
    status: "unlocked_progressing",
  },
  {
    id: "m-rom-work-tolerated",
    title: "ROM work tolerated without next-day response",
    mission: "restore-extension",
    missionId: "restore-extension",
    trackId: "rom",
    name: "ROM work tolerated without next-day response",
    description: "Gentle ROM work does not create a next-day pain or swelling response.",
    why: "Range work only progresses when the knee accepts it afterward.",
    evidence: [
      seedMilestoneEvidence("ROM work has been tolerated without a meaningful next-day response."),
    ],
    evidenceSummary: "ROM work tolerated without meaningful next-day response",
    criteria: ["ROM work tolerated", "No next-day swelling or pain response"],
    unlockCriteria: ["ROM work tolerated", "No next-day swelling or pain response"],
    nextStepIfConfirmed: "Maintain extension and gently progress comfortable flexion.",
    nextStepIfNotConfirmed: "Reduce ROM dose and repeat the prior tolerated range.",
    progressionType: "rom",
    state: "unlocked_progressing",
    status: "unlocked_progressing",
  },
  {
    id: "m-walking-quality",
    title: "Clean supported walking",
    mission: "normalize-walking",
    missionId: "normalize-walking",
    trackId: "walking-movement",
    name: "Clean household walking",
    description: "Household walking is clean and careful without chasing support reduction.",
    why: "Clean mechanics matter more than dropping crutches quickly.",
    evidence: [
      seedMilestoneEvidence(
        "User reports clean careful gait around the house; ignore bugged morning gait quality score.",
        "manual",
        "high",
      ),
    ],
    evidenceSummary:
      "User reports clean careful gait around the house; ignore bugged morning gait quality score",
    criteria: [
      "Walking confidence improving",
      "No limp compensation",
      "No next-day swelling spike",
    ],
    unlockCriteria: [
      "Walking confidence improving",
      "Gait quality does not worsen",
      "No next-day swelling spike",
    ],
    nextStepIfConfirmed: "Keep support reduction optional and quality-gated.",
    nextStepIfNotConfirmed: "Do not reward no-crutch walking if gait quality worsens.",
    progressionType: "walking",
    state: "unlocked",
    status: "unlocked",
  },
  {
    id: "m-walking-confidence-improving",
    title: "Walking confidence improving",
    mission: "normalize-walking",
    missionId: "normalize-walking",
    trackId: "walking-movement",
    name: "Walking confidence improving",
    description: "The athlete trusts walking more while staying careful.",
    why: "Confidence and gait quality are related but separate progression signals.",
    evidence: [seedMilestoneEvidence("Walking confidence is stable to improving.")],
    evidenceSummary: "Walking confidence stable to improving",
    criteria: ["Walking confidence stable or improving"],
    unlockCriteria: ["Walking confidence stable or improving"],
    nextStepIfConfirmed: "Keep gait quality as the gate for reducing support.",
    nextStepIfNotConfirmed: "Keep walking short and supported.",
    progressionType: "walking",
    state: "unlocked_progressing",
    status: "unlocked_progressing",
  },
  {
    id: "m-support-reduced-clean-gait",
    title: "Support reduced only when gait remains clean",
    mission: "normalize-walking",
    missionId: "normalize-walking",
    trackId: "walking-movement",
    name: "Support reduced only when gait remains clean",
    description: "Support changes stay quality-gated.",
    why: "Less support is not progress if gait quality gets worse.",
    evidence: [seedMilestoneEvidence("Support reduction remains optional and quality-gated.")],
    evidenceSummary: "Support reduction quality-gated",
    criteria: ["No support reduction when gait quality worsens"],
    unlockCriteria: ["No support reduction when gait quality worsens"],
    nextStepIfConfirmed: "Continue reducing support only when gait stays clean.",
    nextStepIfNotConfirmed: "Return to more support and clean up gait.",
    progressionType: "walking",
    state: "unlocked_progressing",
    status: "unlocked_progressing",
  },
  {
    id: "m-walking-volume-no-response",
    title: "No next-day response from walking volume",
    mission: "normalize-walking",
    missionId: "normalize-walking",
    trackId: "walking-movement",
    name: "No next-day swelling/pain increase from walking volume",
    description: "Walking volume does not create a next-day symptom response.",
    why: "Walking volume progresses only when tomorrow stays quiet.",
    evidence: [
      seedMilestoneEvidence("Household walking is not producing a clear next-day response."),
    ],
    evidenceSummary: "Household walking not producing a clear next-day response",
    criteria: ["No next-day swelling increase", "No next-day pain increase from walking volume"],
    unlockCriteria: [
      "No next-day swelling increase",
      "No next-day pain increase from walking volume",
    ],
    nextStepIfConfirmed: "Keep walking exposure conservative and quality-based.",
    nextStepIfNotConfirmed: "Reduce walking volume and reassess the next morning.",
    progressionType: "walking",
    state: "unlocked_progressing",
    status: "unlocked_progressing",
  },
  {
    id: "m-weight-shift-control",
    title: "Weight-shift control",
    mission: "controlled-weight-shift",
    missionId: "controlled-weight-shift",
    trackId: "walking-movement",
    name: "Weight-shift control",
    description: "A controlled weight-shift test dose is appropriate.",
    why: "This is the next control gate before sit-to-stand or step work.",
    evidence: [
      seedMilestoneEvidence(
        "Pain/swelling are low, extension is neutral, SLR is clean, flexion is improving, and household gait is clean.",
        "manual",
        "high",
      ),
    ],
    evidenceSummary:
      "Pain/swelling are low, extension is neutral, SLR is clean, flexion is improving, and household gait is clean",
    criteria: ["Low symptoms", "Neutral extension", "Clean SLR", "Clean household gait"],
    unlockCriteria: ["Controlled weight shift without buckling, guarding, or symptom response"],
    nextStepIfConfirmed:
      "Add controlled weight-shift work only if evening and next-morning response stay quiet.",
    nextStepIfNotConfirmed:
      "Keep weight shift as testable only and return to walking/activation basics.",
    progressionType: "skill_control",
    state: "testable",
    status: "testable",
  },
  {
    id: "m-quiet-symptoms-during-shift",
    title: "Quiet symptoms during shift",
    mission: "controlled-weight-shift",
    missionId: "controlled-weight-shift",
    trackId: "symptoms",
    name: "Quiet symptoms during shift",
    description: "Symptoms stay quiet during weight shift.",
    why: "Control tests must not provoke the knee.",
    evidence: [],
    evidenceSummary: "Not yet tested",
    criteria: ["No pain spike during weight shift"],
    unlockCriteria: ["No pain spike during weight shift"],
    nextStepIfConfirmed: "Confirm delayed response before progressing.",
    nextStepIfNotConfirmed: "Stop weight-shift testing and return to easier movement.",
    progressionType: "skill_control",
    state: "locked",
    status: "locked",
  },
  {
    id: "m-no-buckling-guarding",
    title: "No buckling or guarding",
    mission: "controlled-weight-shift",
    missionId: "controlled-weight-shift",
    trackId: "walking-movement",
    name: "No buckling or guarding",
    description: "Weight shift occurs without buckling, guarding, or compensation.",
    why: "Guarding means the skill is not yet doseable.",
    evidence: [],
    evidenceSummary: "Not yet tested",
    criteria: ["No buckling", "No guarding", "No compensation"],
    unlockCriteria: ["No buckling", "No guarding", "No compensation"],
    nextStepIfConfirmed: "Confirm walking remains clean afterward.",
    nextStepIfNotConfirmed: "Keep the test smaller or defer it.",
    progressionType: "skill_control",
    state: "locked",
    status: "locked",
  },
  {
    id: "m-walking-clean-after-shift",
    title: "Walking remains clean afterward",
    mission: "controlled-weight-shift",
    missionId: "controlled-weight-shift",
    trackId: "walking-movement",
    name: "Walking remains clean afterward",
    description: "Walking quality does not worsen after weight shift.",
    why: "A test is not tolerated if it worsens gait.",
    evidence: [],
    evidenceSummary: "Not yet tested",
    criteria: ["Walking remains clean after shift"],
    unlockCriteria: ["Walking remains clean after shift"],
    nextStepIfConfirmed: "Check next-day response before adding more.",
    nextStepIfNotConfirmed: "Remove the provoking dose.",
    progressionType: "walking",
    state: "locked",
    status: "locked",
  },
  {
    id: "m-weight-shift-no-next-day-response",
    title: "No next-day swelling/pain increase",
    mission: "controlled-weight-shift",
    missionId: "controlled-weight-shift",
    trackId: "symptoms",
    name: "No next-day swelling/pain increase",
    description: "The next morning stays stable after weight-shift testing.",
    why: "Tomorrow's response determines whether today was tolerated.",
    evidence: [],
    evidenceSummary: "Not yet tested",
    criteria: ["No next-day swelling increase", "No next-day pain increase"],
    unlockCriteria: ["No next-day swelling increase", "No next-day pain increase"],
    nextStepIfConfirmed: "Weight shift can become a prescribed control task.",
    nextStepIfNotConfirmed: "Repeat easier walking and activation work only.",
    progressionType: "recovery",
    state: "locked",
    status: "locked",
  },
  {
    id: "m-weight-shift-tolerated",
    title: "Weight shift tolerated",
    mission: "sit-to-stand-control",
    missionId: "sit-to-stand-control",
    trackId: "capacity",
    name: "Weight shift tolerated",
    description: "Weight shift has been confirmed without immediate or delayed response.",
    why: "Sit-to-stand should wait until weight shift is tolerated.",
    evidence: [],
    evidenceSummary: "Awaiting weight-shift confirmation",
    criteria: ["Weight shift tolerated"],
    unlockCriteria: ["Weight shift tolerated"],
    nextStepIfConfirmed: "A high-chair sit-to-stand test may become appropriate.",
    nextStepIfNotConfirmed: "Do not add sit-to-stand work.",
    progressionType: "skill_control",
    state: "locked",
    status: "locked",
  },
  {
    id: "m-high-chair-sit-to-stand",
    title: "Sit-to-stand from high chair controlled",
    mission: "sit-to-stand-control",
    missionId: "sit-to-stand-control",
    trackId: "capacity",
    name: "Sit-to-stand from high chair controlled",
    description: "High-chair sit-to-stand is controlled without compensation.",
    why: "This is an early capacity gate.",
    evidence: [],
    evidenceSummary: "Not yet tested",
    criteria: ["Controlled high-chair sit-to-stand"],
    unlockCriteria: ["Controlled high-chair sit-to-stand"],
    nextStepIfConfirmed: "Confirm no collapse, hip shift, or delayed response.",
    nextStepIfNotConfirmed: "Keep sit-to-stand locked.",
    progressionType: "skill_control",
    state: "locked",
    status: "locked",
  },
  {
    id: "m-no-knee-collapse-hip-shift",
    title: "No knee collapse or hip shift",
    mission: "sit-to-stand-control",
    missionId: "sit-to-stand-control",
    trackId: "capacity",
    name: "No knee collapse or hip shift",
    description: "Sit-to-stand pattern stays aligned.",
    why: "Compensation is a failed pattern, not capacity progress.",
    evidence: [],
    evidenceSummary: "Not yet tested",
    criteria: ["No knee collapse", "No hip shift"],
    unlockCriteria: ["No knee collapse", "No hip shift"],
    nextStepIfConfirmed: "Confirm symptoms stay quiet.",
    nextStepIfNotConfirmed: "Reduce the task or keep it locked.",
    progressionType: "skill_control",
    state: "locked",
    status: "locked",
  },
  {
    id: "m-sit-to-stand-no-response",
    title: "No symptom response",
    mission: "sit-to-stand-control",
    missionId: "sit-to-stand-control",
    trackId: "symptoms",
    name: "No symptom response",
    description: "Sit-to-stand testing does not create immediate or next-day symptoms.",
    why: "Capacity is proven by response.",
    evidence: [],
    evidenceSummary: "Not yet tested",
    criteria: ["No immediate response", "No next-day response"],
    unlockCriteria: ["No immediate response", "No next-day response"],
    nextStepIfConfirmed: "Sit-to-stand can become doseable.",
    nextStepIfNotConfirmed: "Return to weight-shift and walking control.",
    progressionType: "recovery",
    state: "locked",
    status: "locked",
  },
  {
    id: "m-assisted-stair-ascent",
    title: "Assisted stair ascent observation passed",
    mission: "step-and-stair-control",
    missionId: "step-and-stair-control",
    trackId: "capacity",
    name: "Assisted stair ascent observation passed",
    description:
      "The athlete observed a stair ascent using surgical leg with both hands assisting.",
    why: "This is useful evidence, but it does not unlock stair training by itself.",
    evidence: [
      seedMilestoneEvidence(
        "User climbed stairs with surgical leg using both hands assisting. Do not unlock stair training yet.",
        "manual",
        "medium",
      ),
    ],
    evidenceSummary:
      "User climbed stairs with surgical leg using both hands assisting; stair training remains locked",
    criteria: ["Assisted stair ascent observed"],
    unlockCriteria: ["Observation only; controlled low step-up still required"],
    nextStepIfConfirmed:
      "Do not unlock stair training yet. Wait for controlled low step-up criteria.",
    nextStepIfNotConfirmed: "Keep stairs observational and assisted only.",
    progressionType: "skill_control",
    state: "observation_passed",
    status: "observation_passed",
  },
  {
    id: "m-controlled-low-step-up",
    title: "Controlled low step-up",
    mission: "step-and-stair-control",
    missionId: "step-and-stair-control",
    trackId: "capacity",
    name: "Controlled low step-up",
    description: "A low step-up is controlled without compensation.",
    why: "Step-up control must precede stair training.",
    evidence: [],
    evidenceSummary: "Not yet tested",
    criteria: ["Controlled low step-up"],
    unlockCriteria: ["Controlled low step-up"],
    nextStepIfConfirmed: "Confirm stair ascent with support and no compensation.",
    nextStepIfNotConfirmed: "Do not add stair training.",
    progressionType: "skill_control",
    state: "locked",
    status: "locked",
  },
  {
    id: "m-stair-ascent-supported-no-compensation",
    title: "Stair ascent with support and no compensation",
    mission: "step-and-stair-control",
    missionId: "step-and-stair-control",
    trackId: "capacity",
    name: "Stair ascent with support and no compensation",
    description: "Supported stair ascent remains controlled.",
    why: "Support is acceptable; compensation is the limiter.",
    evidence: [],
    evidenceSummary: "Not yet tested",
    criteria: ["Supported stair ascent", "No compensation"],
    unlockCriteria: ["Supported stair ascent", "No compensation"],
    nextStepIfConfirmed: "Confirm no next-day response.",
    nextStepIfNotConfirmed: "Keep stair training locked.",
    progressionType: "skill_control",
    state: "locked",
    status: "locked",
  },
  {
    id: "m-stair-no-next-day-response",
    title: "No next-day response",
    mission: "step-and-stair-control",
    missionId: "step-and-stair-control",
    trackId: "symptoms",
    name: "No next-day response",
    description: "Stair exposure does not create a next-day symptom response.",
    why: "Stair training is only earned when tomorrow stays quiet.",
    evidence: [],
    evidenceSummary: "Not yet tested",
    criteria: ["No next-day swelling increase", "No next-day pain increase"],
    unlockCriteria: ["No next-day swelling increase", "No next-day pain increase"],
    nextStepIfConfirmed: "Stair training can become doseable.",
    nextStepIfNotConfirmed: "Return to lower-level control work.",
    progressionType: "recovery",
    state: "locked",
    status: "locked",
  },
  {
    id: "m-walk-30",
    title: "30-minute pain-free walk",
    mission: "build-capacity",
    missionId: "build-capacity",
    trackId: "capacity",
    name: "30-minute pain-free walk",
    description: "Continuous walk with pain <= 2/10 and no swelling spike next day.",
    why: "Capacity is proven by the next morning's response.",
    evidence: [seedMilestoneEvidence("Walk log plus next-morning check-in required.")],
    evidenceSummary: "Walk log plus next-morning check-in",
    criteria: ["30-minute walk pain <= 2/10", "No swelling spike the next morning"],
    unlockCriteria: ["30-minute walk pain <= 2/10", "No swelling spike the next morning"],
    nextStepIfConfirmed: "Capacity walking can become a prescribed task.",
    nextStepIfNotConfirmed: "Repeat shorter supported walking exposures.",
    progressionType: "walking",
    state: "locked",
    status: "locked",
  },
];

const currentMilestoneOverrides: Record<
  string,
  {
    state: MilestoneState;
    evidenceSummary: string;
    evidence: MilestoneEvidence[];
    nextStepIfConfirmed?: string;
    nextStepIfNotConfirmed?: string;
  }
> = {
  "m-extension-0": {
    state: "unlocked",
    evidenceSummary: "User repeatedly reaches neutral extension",
    evidence: [
      seedMilestoneEvidence("User repeatedly reaches neutral extension.", "manual", "high"),
    ],
    nextStepIfConfirmed: "Move extension from active build work to maintain/monitor.",
  },
  straight_leg_raise_no_lag: {
    state: "unlocked",
    evidenceSummary: "User can perform 2x10 SLRs with no lag",
    evidence: [seedMilestoneEvidence("User can perform 2x10 SLRs with no lag.", "manual", "high")],
  },
  "m-flexion-comfortable": {
    state: "unlocked_progressing",
    evidenceSummary:
      "User can sit at 90 degrees and reach about 110 degrees without joint limitation",
    evidence: [
      seedMilestoneEvidence(
        "User can sit at 90 degrees and reach about 110 degrees without joint limitation.",
        "manual",
        "high",
      ),
    ],
  },
  "m-walking-quality": {
    state: "unlocked",
    evidenceSummary:
      "User reports clean careful gait around the house; ignore bugged morning gait quality score",
    evidence: [
      seedMilestoneEvidence(
        "User reports clean careful gait around the house; ignore bugged morning gait quality score.",
        "manual",
        "high",
      ),
    ],
  },
  "m-weight-shift-control": {
    state: "testable",
    evidenceSummary:
      "Pain/swelling are low, extension is neutral, SLR is clean, flexion is improving, and household gait is clean",
    evidence: [
      seedMilestoneEvidence(
        "Pain/swelling are low, extension is neutral, SLR is clean, flexion is improving, and household gait is clean.",
        "manual",
        "high",
      ),
    ],
  },
  "m-assisted-stair-ascent": {
    state: "observation_passed",
    evidenceSummary:
      "User climbed stairs with surgical leg using both hands assisting; stair training remains locked",
    evidence: [
      seedMilestoneEvidence(
        "User climbed stairs with surgical leg using both hands assisting. Do not unlock stair training yet.",
        "manual",
        "medium",
      ),
    ],
    nextStepIfConfirmed:
      "Do not unlock stair training yet. Wait for controlled low step-up criteria.",
  },
};

const currentMilestoneOverrideRank: Record<MilestoneState, number> = {
  locked: 0,
  testable: 40,
  observation_passed: 50,
  test_passed_pending_confirmation: 75,
  unlocked_progressing: 90,
  unlocked: 100,
  paused: 100,
};

function applyCurrentMilestoneOverride(milestone: Milestone): Milestone {
  const override = currentMilestoneOverrides[milestone.id];
  if (!override) return milestone;
  if (milestone.state === "paused") return milestone;
  if (
    currentMilestoneOverrideRank[milestone.state] > currentMilestoneOverrideRank[override.state]
  ) {
    return milestone;
  }
  const existingEvidence = new Set(milestone.evidence.map((item) => item.summary));
  const evidence = [
    ...milestone.evidence,
    ...override.evidence.filter((item) => !existingEvidence.has(item.summary)),
  ];
  return {
    ...milestone,
    state: override.state,
    status: override.state,
    evidence,
    evidenceSummary: override.evidenceSummary,
    nextStepIfConfirmed: override.nextStepIfConfirmed ?? milestone.nextStepIfConfirmed,
    nextStepIfNotConfirmed: override.nextStepIfNotConfirmed ?? milestone.nextStepIfNotConfirmed,
    unlockedAt:
      override.state === "unlocked"
        ? (milestone.unlockedAt ?? override.evidence[0]?.date)
        : milestone.unlockedAt,
  };
}

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
    gaitQuality: "not_assessed",
    extensionStatus: "slightly_limited",
    flexionStatus: "comfortable_gentle_bend",
    flexionLimitingFactor: "unknown",
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
    gaitQualityAfter: 3,
    quadActivationQuality: 3,
    extensionResponse: "felt_same",
    flexionResponse: "felt_same",
    flexionLimitingFactor: "unknown",
    concerningSymptoms: "",
    milestones: "",
    taskCompletions: {},
    skillTestResults: {},
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
    gaitQuality: "not_assessed",
    extensionStatus: "moderately_limited",
    flexionStatus: "stiff_but_tolerable",
    flexionLimitingFactor: "swelling_limited",
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
    gaitQuality: "not_assessed",
    extensionStatus: "slightly_limited",
    flexionStatus: "comfortable_gentle_bend",
    flexionLimitingFactor: "unknown",
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
    gaitQuality: "not_assessed",
    extensionStatus: "slightly_limited",
    flexionStatus: "comfortable_gentle_bend",
    flexionLimitingFactor: "unknown",
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
  gaitQuality: "not_assessed",
  extensionStatus: "slightly_limited",
  flexionStatus: "comfortable_gentle_bend",
  flexionLimitingFactor: "unknown",
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
    activeMissionIds: ["controlled-weight-shift"],
  },
  phases: PHASE_CONFIGS,
  recoveryTracks: RECOVERY_TRACKS,
  missions: MISSIONS,
  athleteName: "Kevin",
  surgeryDate: "2026-06-25",
  campaignName: "ACL Revision Prehab",
  currentMissionId: "controlled-weight-shift",
  recoveryIqXp: 0,
  morning: seedTodayMorning,
  evening: null,
  checkIns: [createCheckIn(seedTodayLocalDate, seedTodayMorning, undefined)],
  history: { morning: seedMorningHistory, evening: [] },
  milestones: seedMilestones,
  todayQuests: [],
  skillTests: [],
  dailyCoachPlans: [],
  coachNotes: seedCoachNotes,
  athleteNotes: seedAthleteNotes,
  recoveryIqEvents: seedRecoveryIqEvents,
  smallWins: seedSmallWins,
  coachPackets: [],
  questCompletions: {},
  prescribedTaskCompletions: {},
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
  gaitQuality?: GaitQuality | number;
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

function normalizeFlexionLimitingFactor(value: unknown): FlexionLimitingFactor {
  return value === "joint_limited" ||
    value === "incision_limited" ||
    value === "swelling_limited" ||
    value === "pain_limited" ||
    value === "unknown"
    ? value
    : "unknown";
}

function normalizeMilestoneId(value: unknown): string {
  const id = stringValue(value);
  const key = id
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  const aliases: Record<string, string> = {
    m_slr_no_lag: "straight_leg_raise_no_lag",
    straight_leg_raise_no_lag: "straight_leg_raise_no_lag",
    straight_leg_raise_no_lag_observation: "straight_leg_raise_no_lag",
    straight_leg_raise_no_lag_test: "straight_leg_raise_no_lag",
    straight_leg_raise_no_lag_milestone: "straight_leg_raise_no_lag",
    straight_leg_raise_without_lag: "straight_leg_raise_no_lag",
    straight_leg_raise_no_lag_: "straight_leg_raise_no_lag",
    m_quad_activation_4: "m-repeatable-quad-activation",
    quad_activation_4_5: "m-repeatable-quad-activation",
    repeatable_quad_activation: "m-repeatable-quad-activation",
    visible_quad_set: "m-visible-quad-set",
    straight_leg_raise_testable: "m-straight-leg-raise-testable",
    passive_extension_to_neutral: "m-extension-0",
    extension_to_neutral: "m-extension-0",
    comfortable_flexion_improving: "m-flexion-comfortable",
    clean_supported_walking: "m-walking-quality",
    clean_household_walking: "m-walking-quality",
    weight_shift_control: "m-weight-shift-control",
    assisted_stair_ascent: "m-assisted-stair-ascent",
    assisted_stair_ascent_observation_passed: "m-assisted-stair-ascent",
  };
  if (id === "m-slr-no-lag") return "straight_leg_raise_no_lag";
  if (aliases[key]) return aliases[key];
  return id;
}

function normalizeMilestoneState(value: unknown): MilestoneState {
  if (value === "in-progress") return "testable";
  return value === "locked" ||
    value === "testable" ||
    value === "observation_passed" ||
    value === "test_passed_pending_confirmation" ||
    value === "unlocked_progressing" ||
    value === "unlocked" ||
    value === "paused"
    ? value
    : "locked";
}

function normalizeProgressionType(value: unknown, fallback: ProgressionType): ProgressionType {
  return value === "load" ||
    value === "skill_control" ||
    value === "rom" ||
    value === "walking" ||
    value === "recovery"
    ? value
    : fallback;
}

function normalizeMilestoneEvidenceType(value: unknown): MilestoneEvidenceType {
  return value === "check_in" ||
    value === "quest_completion" ||
    value === "skill_test" ||
    value === "coach_note" ||
    value === "coach_plan" ||
    value === "manual"
    ? value
    : "manual";
}

function normalizeEvidenceConfidence(value: unknown): MilestoneEvidence["confidence"] {
  return value === "low" || value === "medium" || value === "high" ? value : "medium";
}

function normalizeMilestoneEvidence(
  value: unknown,
  fallbackSummary: string,
  fallbackDate = getLocalDateKey(),
): MilestoneEvidence[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "string") {
          const summary = item.trim();
          return summary
            ? {
                date: fallbackDate,
                type: "manual" as MilestoneEvidenceType,
                summary,
                confidence: "medium" as const,
              }
            : null;
        }
        if (!item || typeof item !== "object") return null;
        const record = item as Record<string, unknown>;
        const summary = stringValue(record.summary) || fallbackSummary;
        if (!summary) return null;
        return {
          date: stringValue(record.date) || fallbackDate,
          type: normalizeMilestoneEvidenceType(record.type),
          summary,
          confidence: normalizeEvidenceConfidence(record.confidence),
        };
      })
      .filter((item): item is MilestoneEvidence => Boolean(item));
  }
  const summary = stringValue(value) || fallbackSummary;
  return summary ? [{ date: fallbackDate, type: "manual", summary, confidence: "medium" }] : [];
}

function normalizeMission(value: unknown, seed: Mission): Mission {
  if (!value || typeof value !== "object") return seed;
  const raw = value as Partial<Mission>;
  return {
    ...seed,
    ...raw,
    id: seed.id,
    title: raw.title ?? raw.name ?? seed.title,
    name: raw.name ?? raw.title ?? seed.name,
    phaseId: seed.phaseId,
    trackIds: seed.trackIds,
    phase: seed.phase,
    criteria: seed.criteria,
    milestoneIds: seed.milestoneIds,
    possibleQuestIds: seed.possibleQuestIds,
    nextUnlock: seed.nextUnlock,
    progress: seed.progress,
    status: seed.status,
    maintenanceWhenComplete: seed.maintenanceWhenComplete,
  };
}

function normalizeMissions(value: unknown): Mission[] {
  const savedById = new Map<string, unknown>();
  if (Array.isArray(value)) {
    value.forEach((item) => {
      if (!item || typeof item !== "object") return;
      const id = stringValue((item as Record<string, unknown>).id);
      if (id) savedById.set(id, item);
    });
  }
  return MISSIONS.map((mission) => normalizeMission(savedById.get(mission.id), mission));
}

function normalizeMilestone(
  value: unknown,
  activeMissionId: MissionId,
  missions: Mission[],
): Milestone | null {
  if (!value || typeof value !== "object") return null;
  const raw = value as Partial<Milestone> & {
    id?: string;
    evidence?: string | MilestoneEvidence[];
    state?: MilestoneState | "in-progress";
    status?: MilestoneState | "in-progress";
  };
  const idFromId = normalizeMilestoneId(raw.id);
  const idFromName = normalizeMilestoneId(raw.title) || normalizeMilestoneId(raw.name);
  const seedIds = new Set(seedMilestones.map((item) => item.id));
  const id = idFromId && seedIds.has(idFromId) ? idFromId : idFromName || idFromId;
  if (!id) return null;
  const seed = seedMilestones.find((item) => item.id === id);
  const missionId = (raw.missionId ??
    raw.mission ??
    seed?.missionId ??
    activeMissionId) as MissionId;
  const mission = missions.find((item) => item.id === missionId);
  const trackId = (raw.trackId ??
    seed?.trackId ??
    mission?.trackIds[0] ??
    "symptoms") as RecoveryTrackId;
  const name = raw.name ?? raw.title ?? seed?.name ?? "Milestone";
  const evidenceSummary =
    raw.evidenceSummary ??
    seed?.evidenceSummary ??
    (typeof raw.evidence === "string" ? raw.evidence : "") ??
    name;
  const state = normalizeMilestoneState(raw.state ?? raw.status ?? seed?.state);
  const milestone = {
    ...(seed ?? {}),
    ...raw,
    id,
    title: raw.title ?? name,
    mission: raw.mission ?? missionId,
    missionId,
    trackId,
    name,
    description: raw.description ?? seed?.description ?? "",
    why: raw.why ?? seed?.why ?? "",
    evidence: normalizeMilestoneEvidence(raw.evidence, evidenceSummary, raw.unlockedAt),
    evidenceSummary,
    criteria: raw.criteria ?? seed?.criteria ?? [evidenceSummary],
    unlockCriteria: raw.unlockCriteria ?? raw.criteria ?? seed?.unlockCriteria ?? [evidenceSummary],
    nextStepIfConfirmed:
      raw.nextStepIfConfirmed ??
      seed?.nextStepIfConfirmed ??
      "Confirm response before progressing.",
    nextStepIfNotConfirmed:
      raw.nextStepIfNotConfirmed ??
      seed?.nextStepIfNotConfirmed ??
      "Repeat the current dose and gather more evidence.",
    progressionType: normalizeProgressionType(
      raw.progressionType,
      seed?.progressionType ?? "recovery",
    ),
    state,
    status: state,
    unlockedAt: raw.unlockedAt,
    coachNotes: raw.coachNotes,
    allowsImmediateUnlock: raw.allowsImmediateUnlock ?? seed?.allowsImmediateUnlock,
  } satisfies Milestone;
  return applyCurrentMilestoneOverride(milestone);
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
    gaitQuality: normalizeGaitQuality(entry.gaitQuality),
    extensionStatus: normalizeExtensionStatus(
      entry.extensionStatus,
      entry.extensionEstimateDegrees ?? entry.extension,
    ),
    flexionStatus: normalizeFlexionStatus(entry.flexionStatus, entry.flexionComfort, entry.flexion),
    flexionLimitingFactor: normalizeFlexionLimitingFactor(entry.flexionLimitingFactor),
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
    gaitQualityAfter:
      entry.gaitQualityAfter == null
        ? (entry.movementQualityAfter ?? fallback.gaitQualityAfter)
        : finiteNumber(entry.gaitQualityAfter, fallback.gaitQualityAfter ?? 3),
    quadActivationQuality: finiteNumber(
      entry.quadActivationQuality,
      fallback.quadActivationQuality,
    ),
    extensionResponse: normalizeRangeResponse(entry.extensionResponse),
    flexionResponse: normalizeRangeResponse(entry.flexionResponse),
    flexionLimitingFactor: normalizeFlexionLimitingFactor(entry.flexionLimitingFactor),
    concerningSymptoms: entry.concerningSymptoms ?? "",
    movementQualityAfter:
      entry.movementQualityAfter == null ? undefined : finiteNumber(entry.movementQualityAfter, 3),
    energyFatigue: entry.energyFatigue == null ? undefined : finiteNumber(entry.energyFatigue, 3),
    milestones: entry.milestones ?? "",
    todayWin: entry.todayWin,
    taskCompletions: normalizeTaskCompletionRecord(entry.taskCompletions) ?? {},
    skillTestResults: normalizeSkillTestResultRecord(entry.skillTestResults) ?? {},
    notes: entry.notes ?? "",
  };
}

function migratePhoenixState(saved: Partial<PhoenixState>): PhoenixState {
  const missions = normalizeMissions(saved.missions);
  const activeMissionId = missions.some((mission) => mission.id === saved.currentMissionId)
    ? (saved.currentMissionId as MissionId)
    : initial.currentMissionId;
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

  const milestoneSeedsById = new Map<string, unknown>(
    seedMilestones.map((milestone) => [milestone.id, milestone]),
  );
  (saved.milestones ?? []).forEach((milestone) => {
    const id = normalizeMilestoneId(milestone.id);
    if (id) milestoneSeedsById.set(id, { ...milestone, id });
  });
  const milestones: Milestone[] = [...milestoneSeedsById.values()]
    .map((milestone) => normalizeMilestone(milestone, activeMissionId, missions))
    .filter((milestone): milestone is Milestone => Boolean(milestone));
  const resolvedCurrentMissionId = currentMission({
    ...initial,
    ...saved,
    campaign,
    missions,
    milestones,
    currentMissionId: activeMissionId,
  }).id;
  const resolvedActiveMission =
    missions.find((mission) => mission.id === resolvedCurrentMissionId) ?? activeMission;
  const resolvedCampaign: Campaign = {
    ...campaign,
    activePhaseId: resolvedActiveMission.phaseId,
    activeMissionIds: [resolvedCurrentMissionId],
  };

  const savedMorning = normalizeMorningCheckIn(saved.morning as LegacyMorningCheckIn | undefined);
  const savedEvening = normalizeEveningCheckIn(saved.evening ?? undefined);
  const normalizedSavedCheckIns =
    saved.checkIns?.map((entry) => ({
      ...entry,
      phaseId:
        entry.phaseId ??
        entry.morning?.phaseId ??
        entry.evening?.phaseId ??
        resolvedActiveMission.phaseId,
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
          readiness === "ready" ||
          readiness === "recover" ||
          readiness === "modify" ||
          readiness === "modify_positive"
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
        quests: (raw.quests ?? []).map((quest, index) => {
          const label = quest.label ?? quest.title ?? `Quest ${index + 1}`;
          const questForFallback: DailyQuest = {
            ...quest,
            id: quest.id ?? `quest-${index + 1}-${slugify(label)}`,
            date: localDate,
            localDate,
            label,
            title: quest.title ?? label,
            done: quest.done ?? false,
            status: quest.status ?? "pending",
            xp: quest.xp ?? 10,
            kind: quest.kind ?? "main",
            category: quest.category ?? "main",
            source: quest.source ?? "daily-coach-plan",
            reason: quest.reason ?? "Daily Coach Plan prescription",
          };
          const record = quest as unknown as Record<string, unknown>;
          const tasks = normalizeQuestTasks(
            record,
            label,
            fallbackTaskCategoryForQuest(questForFallback),
          );
          return {
            ...questForFallback,
            timestampUtc: quest.timestampUtc ?? raw.timestampUtc ?? importedAt,
            prescribedTasks: tasks.length
              ? tasks
              : [prescribedTaskFromQuest(questForFallback, index)],
          };
        }),
        skillTests: normalizeSkillTests(raw.skillTests, localDate),
        milestoneUpdates: normalizeMilestoneUpdates(raw.milestoneUpdates),
        nextUnlocks: normalizeNextUnlocks(raw.nextUnlocks),
        notes: raw.notes ?? "",
        status: isSeedPlan ? "archived" : (raw.status ?? "active"),
      };
    },
  );
  const skillTests = (saved.skillTests ?? initial.skillTests)
    .map((test, index) => normalizeSkillTest(test, index, getLocalDateKey()))
    .filter((test): test is SkillTest => Boolean(test));
  const recoveryIqEvents = (saved.recoveryIqEvents ?? [])
    .map(normalizeRecoveryIqEvent)
    .filter((event): event is RecoveryIqEvent => Boolean(event));
  const smallWins = (saved.smallWins ?? [])
    .map(normalizeSmallWin)
    .filter((win): win is SmallWin => Boolean(win));
  const prescribedTaskCompletions: Record<
    string,
    Record<string, PrescribedTaskCompletion>
  > = normalizeTaskCompletionDateMap(saved.prescribedTaskCompletions);
  [
    ...normalizedSavedCheckIns.flatMap((entry) => (entry.evening ? [entry.evening] : [])),
    savedEvening,
  ]
    .filter((entry): entry is EveningCheckIn => Boolean(entry))
    .forEach((entry) => {
      const date = dailyRecordDate(entry);
      prescribedTaskCompletions[date] = {
        ...(prescribedTaskCompletions[date] ?? {}),
        ...(entry.taskCompletions ?? {}),
      };
    });

  return {
    ...initial,
    ...saved,
    campaign: resolvedCampaign,
    phases: normalizePhaseConfigs(saved.phases),
    recoveryTracks: saved.recoveryTracks?.length ? saved.recoveryTracks : RECOVERY_TRACKS,
    missions,
    currentMissionId: resolvedCurrentMissionId,
    athleteName: resolvedCampaign.athleteName,
    surgeryDate: resolvedCampaign.surgeryDate,
    campaignName: resolvedCampaign.name,
    recoveryIqXp: 0,
    morning: savedMorning ?? initial.morning,
    evening: savedEvening ?? initial.evening,
    checkIns,
    milestones,
    skillTests,
    dailyCoachPlans,
    coachNotes: (saved.coachNotes ?? initial.coachNotes).map(normalizeCoachNote),
    athleteNotes: (saved.athleteNotes ?? initial.athleteNotes).map(normalizeAthleteNote),
    recoveryIqEvents,
    smallWins,
    coachPackets: (saved.coachPackets ?? initial.coachPackets).map(normalizeCoachPacket),
    prescribedTaskCompletions,
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

const MISSION_CRITERION_STATE_SCORES: Record<MissionCriterionState, number> = {
  locked: 0,
  not_started: 0,
  in_progress: 40,
  pending_confirmation: 75,
  achieved: 100,
  blocked: 0,
};

const MILESTONE_STATE_SCORES: Record<MilestoneState, number> = {
  locked: 0,
  testable: 40,
  observation_passed: 50,
  test_passed_pending_confirmation: 75,
  unlocked_progressing: 90,
  unlocked: 100,
  paused: 0,
};

function latestMilestoneEvidence(milestone: Milestone): MilestoneEvidence | undefined {
  return milestone.evidence[milestone.evidence.length - 1];
}

function missionCriterionEvidenceSource(
  evidence: MilestoneEvidence | undefined,
): MissionCriterionEvidenceSource {
  if (!evidence) return "milestone";
  if (evidence.type === "check_in") return "check_in";
  if (evidence.type === "quest_completion") return "task_response";
  if (evidence.type === "coach_note" || evidence.type === "coach_plan") return "coach_import";
  return "manual";
}

function missionCriterionStateFromMilestone(state: MilestoneState): MissionCriterionState {
  if (state === "unlocked" || state === "unlocked_progressing") return "achieved";
  if (state === "test_passed_pending_confirmation" || state === "observation_passed") {
    return "pending_confirmation";
  }
  if (state === "testable") return "in_progress";
  if (state === "paused") return "blocked";
  return "not_started";
}

function isMissionCompleteMilestone(state: MilestoneState): boolean {
  return state === "unlocked" || state === "unlocked_progressing";
}

function isMissionActiveMilestone(state: MilestoneState): boolean {
  return state === "testable" || state === "test_passed_pending_confirmation";
}

function missionLinkedMilestones(s: PhoenixState, mission: Mission): Milestone[] {
  const byId = new Map(s.milestones.map((milestone) => [milestone.id, milestone]));
  return mission.milestoneIds
    .map((id) => byId.get(normalizeMilestoneId(id)))
    .filter((milestone): milestone is Milestone => Boolean(milestone));
}

function milestoneById(s: PhoenixState, id: string): Milestone | undefined {
  const normalized = normalizeMilestoneId(id);
  return s.milestones.find((milestone) => milestone.id === normalized);
}

function criterionFromMilestone(
  milestone: Milestone | undefined,
  input: Pick<MissionCriterion, "id" | "title" | "evidenceRuleDescription"> &
    Partial<MissionCriterion>,
): MissionCriterion {
  if (!milestone) {
    return {
      ...input,
      state: "locked",
      evidenceSummary: "Milestone not found.",
      evidenceSource: "not_assessed",
      remainingText: input.remainingText ?? "Link this criterion to a real milestone.",
    };
  }
  const evidence = latestMilestoneEvidence(milestone);
  const state = missionCriterionStateFromMilestone(milestone.state);
  return {
    ...input,
    linkedMilestoneIds: input.linkedMilestoneIds ?? [milestone.id],
    state,
    currentCount: input.currentCount,
    requiredCount: input.requiredCount,
    lastEvidenceDate: input.lastEvidenceDate ?? evidence?.date ?? milestone.unlockedAt,
    evidenceSummary: input.evidenceSummary ?? milestone.evidenceSummary ?? evidence?.summary,
    evidenceSource: input.evidenceSource ?? missionCriterionEvidenceSource(evidence),
    remainingText:
      state === "achieved"
        ? undefined
        : (input.remainingText ??
          (state === "pending_confirmation"
            ? "Confirm evening and next-morning response before this becomes fully achieved."
            : state === "in_progress"
              ? "Record the test/task result and required response evidence."
              : state === "blocked"
                ? "Resolve the paused or blocked milestone before progressing."
                : `Needs evidence for: ${milestone.unlockCriteria.join("; ")}.`)),
  };
}

function sortedMorningCheckIns(s: PhoenixState): MorningCheckIn[] {
  return [...allMorningCheckIns(s)].sort((a, b) =>
    dailyRecordDate(a) < dailyRecordDate(b) ? 1 : -1,
  );
}

function sortedEveningCheckIns(s: PhoenixState): EveningCheckIn[] {
  return [...allEveningCheckIns(s)].sort((a, b) =>
    dailyRecordDate(a) < dailyRecordDate(b) ? 1 : -1,
  );
}

function localDatePlusDays(isoDate: string, days: number): string {
  const date = new Date(`${isoDate}T00:00:00`);
  date.setDate(date.getDate() + days);
  return getLocalDateKey(date);
}

function consecutiveMorningCount(
  s: PhoenixState,
  predicate: (morning: MorningCheckIn) => boolean,
  requiredCount: number,
): { count: number; lastDate?: string } {
  let count = 0;
  let lastDate: string | undefined;
  for (const morning of sortedMorningCheckIns(s)) {
    if (!predicate(morning)) break;
    count += 1;
    lastDate = lastDate ?? dailyRecordDate(morning);
    if (count >= requiredCount) break;
  }
  return { count, lastDate };
}

function latestMorningWithField<T>(
  s: PhoenixState,
  getter: (morning: MorningCheckIn) => T | undefined,
): { value?: T; date?: string } {
  for (const morning of sortedMorningCheckIns(s)) {
    const value = getter(morning);
    if (value != null) return { value, date: dailyRecordDate(morning) };
  }
  return {};
}

function countToleratedTaskSessions(
  s: PhoenixState,
  taskIdFragments: string[],
  requiredCount: number,
): { count: number; lastDate?: string } {
  const sessions = Object.entries(s.prescribedTaskCompletions ?? {})
    .flatMap(([date, completions]) =>
      Object.entries(completions).map(([taskId, completion]) => ({ date, taskId, completion })),
    )
    .filter(({ taskId, completion }) => {
      const normalizedTaskId = taskId.toLowerCase().replace(/[^a-z0-9]+/g, "_");
      const matches = taskIdFragments.some((fragment) => normalizedTaskId.includes(fragment));
      const completedEnough = completion.status === "completed" || completion.status === "partial";
      const tolerated =
        completion.afterEffect !== "worse" &&
        completion.limitingFactor !== "joint_pinch" &&
        completion.limitingFactor !== "pain" &&
        completion.extensionAfter !== "painful_pinching";
      return matches && completedEnough && tolerated;
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  return {
    count: Math.min(sessions.length, requiredCount),
    lastDate: sessions[0]?.date,
  };
}

function countCriterionState(count: number, requiredCount: number): MissionCriterionState {
  if (count >= requiredCount) return "achieved";
  if (count > 0) return "in_progress";
  return "not_started";
}

function countCriterion({
  id,
  title,
  evidenceRuleDescription,
  requiredCount,
  currentCount,
  lastEvidenceDate,
  evidenceSummary,
  evidenceSource,
  remainingText,
  linkedMilestoneIds,
}: Omit<MissionCriterion, "state"> & { requiredCount: number; currentCount: number }) {
  const state = countCriterionState(currentCount, requiredCount);
  return {
    id,
    title,
    evidenceRuleDescription,
    requiredCount,
    currentCount,
    state,
    linkedMilestoneIds,
    lastEvidenceDate,
    evidenceSummary:
      evidenceSummary ?? `${Math.min(currentCount, requiredCount)} / ${requiredCount} recorded.`,
    evidenceSource,
    remainingText:
      state === "achieved"
        ? undefined
        : (remainingText ??
          `Needs ${requiredCount - Math.min(currentCount, requiredCount)} more matching check-in${
            requiredCount - Math.min(currentCount, requiredCount) === 1 ? "" : "s"
          }.`),
  } satisfies MissionCriterion;
}

function achievedMilestoneCriterion(
  milestone: Milestone | undefined,
  input: Pick<MissionCriterion, "id" | "title" | "evidenceRuleDescription"> &
    Partial<MissionCriterion>,
): MissionCriterion | null {
  if (!milestone || !isMissionCompleteMilestone(milestone.state)) return null;
  return criterionFromMilestone(milestone, {
    ...input,
    state: "achieved",
  });
}

function nextMorningConfirmationPending(
  s: PhoenixState,
  eveningPredicate: (evening: EveningCheckIn) => boolean,
): { pending: boolean; eveningDate?: string } {
  const evening = sortedEveningCheckIns(s).find(eveningPredicate);
  if (!evening) return { pending: false };
  const eveningDate = dailyRecordDate(evening);
  return {
    pending: !getMorningForDate(s, localDatePlusDays(eveningDate, 1)),
    eveningDate,
  };
}

function reclaimRangeCriteria(s: PhoenixState): MissionCriterion[] {
  const extension = milestoneById(s, "m-extension-0");
  const flexion = milestoneById(s, "m-flexion-comfortable");
  const romTolerated = milestoneById(s, "m-rom-work-tolerated");
  const flexionCount = consecutiveMorningCount(
    s,
    (morning) => morning.flexionStatus === "comfortable_gentle_bend",
    2,
  );
  const heelSlideCount = countToleratedTaskSessions(s, ["heel_slides", "heel_slide"], 2);
  const romPending = nextMorningConfirmationPending(
    s,
    (evening) =>
      evening.flexionResponse === "felt_same" ||
      evening.flexionResponse === "felt_better" ||
      evening.extensionResponse === "felt_same" ||
      evening.extensionResponse === "felt_better",
  );

  return [
    criterionFromMilestone(extension, {
      id: "extension-reaches-neutral",
      title: "Extension reaches neutral",
      evidenceRuleDescription:
        "Extension status = reaches_neutral on current or recent check-in, confirmed by the Passive extension to neutral milestone.",
      remainingText: "Needs a neutral extension check-in or coach-confirmed milestone update.",
    }),
    achievedMilestoneCriterion(flexion, {
      id: "flexion-comfortable-improving",
      title: "Flexion comfortable or improving",
      evidenceRuleDescription:
        "Flexion comfort/status is comfortable_gentle_bend for 2 consecutive check-ins, or the linked milestone is unlocked_progressing/unlocked.",
      requiredCount: 2,
      currentCount: 2,
    }) ??
      countCriterion({
        id: "flexion-comfortable-improving",
        title: "Flexion comfortable or improving",
        evidenceRuleDescription:
          "Flexion comfort/status is comfortable_gentle_bend for 2 consecutive check-ins, or the linked milestone is unlocked_progressing/unlocked.",
        requiredCount: 2,
        currentCount: flexionCount.count,
        lastEvidenceDate: flexionCount.lastDate,
        evidenceSummary: `${flexionCount.count} / 2 stable flexion check-ins recorded.`,
        evidenceSource: flexionCount.count > 0 ? "check_in" : "not_assessed",
        linkedMilestoneIds: ["m-flexion-comfortable"],
        remainingText:
          flexionCount.count > 0
            ? "Needs one more stable flexion check-in."
            : "Needs flexion comfort recorded on morning check-ins.",
      }),
    achievedMilestoneCriterion(romTolerated, {
      id: "heel-slides-tolerated",
      title: "Heel slides tolerated",
      evidenceRuleDescription:
        "Heel slides completed or partial-tolerated for 2 sessions with no sharp pain, joint pinch, or worse after-effect.",
      requiredCount: 2,
      currentCount: 2,
    }) ??
      countCriterion({
        id: "heel-slides-tolerated",
        title: "Heel slides tolerated",
        evidenceRuleDescription:
          "Heel slides completed or partial-tolerated for 2 sessions with no sharp pain, joint pinch, or worse after-effect.",
        requiredCount: 2,
        currentCount: heelSlideCount.count,
        lastEvidenceDate: heelSlideCount.lastDate,
        evidenceSummary: `${heelSlideCount.count} / 2 tolerated heel-slide sessions recorded.`,
        evidenceSource: heelSlideCount.count > 0 ? "task_response" : "not_assessed",
        linkedMilestoneIds: ["m-rom-work-tolerated"],
      }),
    achievedMilestoneCriterion(romTolerated, {
      id: "no-next-day-rom-response",
      title: "No next-day ROM symptom response",
      evidenceRuleDescription:
        "Next-morning pain is not worse by more than 1 point, swelling is stable or improved, and extension is still neutral after ROM work.",
    }) ?? {
      id: "no-next-day-rom-response",
      title: "No next-day ROM symptom response",
      evidenceRuleDescription:
        "Next-morning pain is not worse by more than 1 point, swelling is stable or improved, and extension is still neutral after ROM work.",
      state: romPending.pending ? "pending_confirmation" : "not_started",
      linkedMilestoneIds: ["m-rom-work-tolerated"],
      lastEvidenceDate: romPending.eveningDate,
      evidenceSummary: romPending.pending
        ? "Evening ROM response exists; next-morning baseline is still needed."
        : "No confirmed next-morning ROM response yet.",
      evidenceSource: romPending.pending ? "check_in" : "not_assessed",
      remainingText: romPending.pending
        ? "Complete the next morning check-in to confirm the ROM response."
        : "Needs evening ROM response plus next-morning confirmation.",
    },
  ];
}

function normalizeWalkingCriteria(s: PhoenixState): MissionCriterion[] {
  const cleanWalking = milestoneById(s, "m-walking-quality");
  const supportReduced = milestoneById(s, "m-support-reduced-clean-gait");
  const walkingVolume = milestoneById(s, "m-walking-volume-no-response");
  const confidenceCount = consecutiveMorningCount(
    s,
    (morning) => morning.walkingConfidence >= 4,
    2,
  );
  const gaitAssessment = latestMorningWithField(s, (morning) =>
    morning.gaitQuality && morning.gaitQuality !== "not_assessed" ? morning.gaitQuality : undefined,
  );
  const gaitCount = consecutiveMorningCount(
    s,
    (morning) =>
      morning.gaitQuality === "mostly_clean" || morning.gaitQuality === "normal_for_current_phase",
    2,
  );

  return [
    achievedMilestoneCriterion(cleanWalking, {
      id: "walking-confidence-adequate",
      title: "Walking confidence adequate",
      evidenceRuleDescription:
        "Walking confidence >= 4/5 for 2 check-ins, or coach-imported Clean household walking milestone is unlocked.",
      requiredCount: 2,
      currentCount: 2,
    }) ??
      countCriterion({
        id: "walking-confidence-adequate",
        title: "Walking confidence adequate",
        evidenceRuleDescription:
          "Walking confidence >= 4/5 for 2 check-ins, or coach-imported Clean household walking milestone is unlocked.",
        requiredCount: 2,
        currentCount: confidenceCount.count,
        lastEvidenceDate: confidenceCount.lastDate,
        evidenceSummary: `${confidenceCount.count} / 2 walking-confidence check-ins >= 4/5.`,
        evidenceSource: confidenceCount.count > 0 ? "check_in" : "not_assessed",
        linkedMilestoneIds: ["m-walking-quality"],
        remainingText:
          confidenceCount.count > 0
            ? "Needs one more walking-confidence check-in at 4/5 or better."
            : "Needs walking confidence >= 4/5 on morning check-ins.",
      }),
    achievedMilestoneCriterion(cleanWalking, {
      id: "gait-quality-clean",
      title: "Gait quality clean",
      evidenceRuleDescription:
        "Gait quality = mostly_clean or normal_for_current_phase for 2 check-ins. If gait quality is missing, it stays not assessed.",
      requiredCount: 2,
      currentCount: 2,
    }) ??
      countCriterion({
        id: "gait-quality-clean",
        title: "Gait quality clean",
        evidenceRuleDescription:
          "Gait quality = mostly_clean or normal_for_current_phase for 2 check-ins. If gait quality is missing, it stays not assessed.",
        requiredCount: 2,
        currentCount: gaitCount.count,
        lastEvidenceDate: gaitCount.lastDate ?? gaitAssessment.date,
        evidenceSummary:
          gaitAssessment.value == null
            ? "Gait quality: not assessed yet."
            : `${gaitCount.count} / 2 clean gait-quality check-ins recorded.`,
        evidenceSource: gaitAssessment.value == null ? "not_assessed" : "check_in",
        linkedMilestoneIds: ["m-walking-quality"],
        remainingText:
          gaitAssessment.value == null
            ? "Needs gait quality entered in Morning Check-In."
            : "Needs 2 gait-quality check-ins at mostly_clean or better.",
      }),
    criterionFromMilestone(supportReduced, {
      id: "support-reduced-clean-mechanics",
      title: "Support reduced only when mechanics remain clean",
      evidenceRuleDescription:
        "Support use may decrease only when gait quality remains mostly_clean or better.",
      remainingText:
        "Needs user report or task response showing support changes stayed quality-gated.",
    }),
    criterionFromMilestone(walkingVolume, {
      id: "no-next-day-walking-response",
      title: "No next-day walking symptom response",
      evidenceRuleDescription:
        "Walking task completed/tolerated and next-morning swelling/pain stable or improved.",
      remainingText: "Needs tolerated walking task response plus next-morning confirmation.",
    }),
  ];
}

function wakeQuadCriteria(s: PhoenixState): MissionCriterion[] {
  return [
    criterionFromMilestone(milestoneById(s, "m-visible-quad-set"), {
      id: "visible-quad-set",
      title: "Visible quad set / kneecap raise",
      evidenceRuleDescription: "Visible quad contraction or kneecap raise on command.",
    }),
    criterionFromMilestone(milestoneById(s, "m-repeatable-quad-activation"), {
      id: "quad-sets-repeatable",
      title: "Quad sets repeatable",
      evidenceRuleDescription: "Quad contraction is repeatable without provoking symptoms.",
    }),
    criterionFromMilestone(milestoneById(s, "m-straight-leg-raise-testable"), {
      id: "straight-leg-raise-testable",
      title: "Straight leg raise testable",
      evidenceRuleDescription:
        "Pain is low, swelling is stable, extension reaches neutral, quad activation is present, and walking is not worsening.",
    }),
    criterionFromMilestone(milestoneById(s, "straight_leg_raise_no_lag"), {
      id: "straight-leg-raise-no-lag",
      title: "Straight Leg Raise - No Lag",
      evidenceRuleDescription: "Straight leg raise is completed with no lag and stable response.",
    }),
  ];
}

function fallbackMissionCriteria(s: PhoenixState, mission: Mission): MissionCriterion[] {
  const milestones = missionLinkedMilestones(s, mission);
  if (milestones.length === 0) {
    return mission.criteria.map((criterion, index) => ({
      id: `${mission.id}-criterion-${index + 1}`,
      title: criterion,
      evidenceRuleDescription: criterion,
      state: mission.status === "locked" ? "locked" : "not_started",
      evidenceSource: "not_assessed",
      remainingText: "Needs a linked milestone or explicit evidence rule.",
    }));
  }
  return milestones.map((milestone) =>
    criterionFromMilestone(milestone, {
      id: `${mission.id}-${milestone.id}`,
      title: milestone.title,
      evidenceRuleDescription: milestone.unlockCriteria.join("; "),
    }),
  );
}

export function missionCriteriaForMission(s: PhoenixState, mission: Mission): MissionCriterion[] {
  if (mission.id === "wake-the-quad") return wakeQuadCriteria(s);
  if (mission.id === "restore-extension") return reclaimRangeCriteria(s);
  if (mission.id === "normalize-walking") return normalizeWalkingCriteria(s);
  return fallbackMissionCriteria(s, mission);
}

export function missionCriteriaProgress(criteria: MissionCriterion[]) {
  const total = Math.max(criteria.length, 1);
  const achieved = criteria.filter((criterion) => criterion.state === "achieved").length;
  const pending = criteria.filter((criterion) => criterion.state === "pending_confirmation").length;
  const blocked = criteria.filter((criterion) => criterion.state === "blocked").length;
  const inProgress = criteria.filter((criterion) => criterion.state === "in_progress").length;
  const score = criteria.reduce(
    (sum, criterion) => sum + MISSION_CRITERION_STATE_SCORES[criterion.state],
    0,
  );
  const progress = criteria.length ? Math.round(score / total) : 0;
  const remaining =
    criteria.find((criterion) => criterion.state === "blocked") ??
    criteria.find((criterion) => criterion.state === "pending_confirmation") ??
    criteria.find((criterion) => criterion.state === "in_progress") ??
    criteria.find((criterion) => criterion.state === "not_started" || criterion.state === "locked");
  return {
    total,
    achieved,
    pending,
    blocked,
    inProgress,
    progress,
    remainingText: remaining?.remainingText,
  };
}

function missionStatusFromCriteria(mission: Mission, criteria: MissionCriterion[]): MissionStatus {
  if (criteria.length === 0) return "locked";
  if (criteria.some((criterion) => criterion.state === "blocked")) return "blocked";
  const allAchieved = criteria.every((criterion) => criterion.state === "achieved");
  if (allAchieved) return mission.maintenanceWhenComplete ? "maintenance" : "complete";
  if (criteria.some((criterion) => criterion.state === "pending_confirmation")) {
    return "pending_confirmation";
  }
  if (criteria.some((criterion) => criterion.state === "in_progress")) return "active";
  return "locked";
}

function missionProgressFromMilestones(milestones: Milestone[]): number {
  const scored = milestones.filter((milestone) => milestone.state !== "paused");
  if (scored.length === 0) return 0;
  const total = scored.reduce((sum, milestone) => sum + MILESTONE_STATE_SCORES[milestone.state], 0);
  return Math.round(total / scored.length);
}

function missionStatusFromMilestones(mission: Mission, milestones: Milestone[]): MissionStatus {
  if (milestones.length === 0) return "locked";
  if (milestones.some((milestone) => milestone.state === "paused")) return "blocked";
  const allComplete = milestones.every((milestone) => isMissionCompleteMilestone(milestone.state));
  if (allComplete) return mission.maintenanceWhenComplete ? "maintenance" : "complete";
  if (milestones.some((milestone) => isMissionActiveMilestone(milestone.state))) return "active";
  return "locked";
}

function nextUnlockFromMilestones(mission: Mission, milestones: Milestone[]): string {
  const next =
    milestones.find((milestone) => milestone.state === "testable") ??
    milestones.find((milestone) => milestone.state === "test_passed_pending_confirmation") ??
    milestones.find((milestone) => milestone.state === "observation_passed") ??
    milestones.find((milestone) => milestone.state === "locked" || milestone.state === "paused");
  return next?.title ?? next?.name ?? mission.nextUnlock;
}

export function deriveMissionFromMilestones(s: PhoenixState, mission: Mission): Mission {
  const milestones = missionLinkedMilestones(s, mission);
  const criteria = missionCriteriaForMission(s, mission);
  const criteriaProgress = missionCriteriaProgress(criteria);
  const status = missionStatusFromCriteria(mission, criteria);
  return {
    ...mission,
    title: mission.title ?? mission.name,
    progress:
      status === "complete" || status === "maintenance"
        ? 100
        : criteriaProgress.progress || missionProgressFromMilestones(milestones),
    status,
    nextUnlock: nextUnlockFromMilestones(mission, milestones),
  };
}

export function derivedMissions(s: PhoenixState): Mission[] {
  const missions = s.missions?.length ? s.missions : MISSIONS;
  return missions.map((mission) => deriveMissionFromMilestones(s, mission));
}

export function currentMission(s: PhoenixState): Mission {
  const missions = derivedMissions(s);
  const selected = missions.find((mission) => mission.id === s.currentMissionId);
  if (selected?.status === "active" || selected?.status === "pending_confirmation") return selected;
  return (
    missions.find((mission) => mission.status === "active") ??
    missions.find((mission) => mission.status === "pending_confirmation") ??
    selected ??
    missions.find((mission) => mission.status === "maintenance") ??
    missions[0]
  );
}

export function activeMissions(s: PhoenixState): Mission[] {
  const missions = derivedMissions(s);
  const active = missions.filter(
    (mission) => mission.status === "active" || mission.status === "pending_confirmation",
  );
  return active.length ? active : [currentMission(s)];
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
  const completions = taskCompletionsForDate(s, isoDate);
  const prescribedTasks = quest.prescribedTasks?.map((task) =>
    mergePrescribedTaskCompletion(task, completions[task.id]),
  );
  const done = prescribedTasks?.length
    ? prescribedTasks.every(taskIsResolved)
    : questDoneForDate(s, isoDate, quest);
  return {
    ...quest,
    date: isoDate,
    localDate: isoDate,
    label: quest.label,
    title: quest.title ?? quest.label,
    done,
    status: done ? "complete" : quest.status === "skipped" ? "skipped" : "pending",
    category: quest.category ?? quest.kind,
    prescribedTasks,
    questType: quest.questType ?? (quest.id.includes("check-in") ? "check_in" : "required_action"),
    progressionType:
      quest.progressionType ??
      (dashboardObjectiveGroupForQuest(quest as DailyQuest) === "movement_exposure"
        ? "walking"
        : dashboardObjectiveGroupForQuest(quest as DailyQuest) === "recovery_basics"
          ? "recovery"
          : "skill_control"),
  };
}

function normalizedQuestText(quest: Pick<DailyQuest, "id" | "label" | "reason">): string {
  return `${quest.id} ${quest.label} ${quest.reason}`.toLowerCase();
}

const DASHBOARD_OBJECTIVE_ORDER: DashboardObjectiveId[] = [
  "morning_check_in",
  "movement_exposure",
  "activation",
  "rom",
  "recovery_basics",
  "evening_check_in",
];

const DASHBOARD_OBJECTIVE_DEFINITIONS: Record<
  DashboardObjectiveId,
  Omit<DashboardObjective, "taskIds">
> = {
  morning_check_in: {
    id: "morning_check_in",
    title: "Morning baseline check-in",
    purpose: "Establish starting state.",
    xp: 10,
    category: "morning_check_in",
  },
  movement_exposure: {
    id: "movement_exposure",
    title: "Clean movement exposures",
    purpose: "Short supported walks and clean gait practice without chasing steps.",
    xp: 15,
    category: "movement_exposure",
  },
  activation: {
    id: "activation",
    title: "Quad activation work",
    purpose: "Complete today's prescribed activation work with clean control.",
    xp: 20,
    category: "activation",
  },
  rom: {
    id: "rom",
    title: "Gentle ROM work",
    purpose: "Complete prescribed extension and flexion exposure without forcing range.",
    xp: 20,
    category: "rom",
  },
  recovery_basics: {
    id: "recovery_basics",
    title: "Recovery basics",
    purpose: "Support healing and avoid irritation.",
    xp: 15,
    category: "recovery_basics",
  },
  evening_check_in: {
    id: "evening_check_in",
    title: "Evening response check-in",
    purpose: "Record how the knee responded to today's work.",
    xp: 10,
    category: "evening_check_in",
  },
  skill_test: {
    id: "skill_test",
    title: "Optional skill test",
    purpose: "Controlled provisional check only when criteria are met.",
    xp: 0,
    category: "skill_test",
  },
  milestone_watch: {
    id: "milestone_watch",
    title: "Milestone watch",
    purpose: "Track evidence needed before the next unlock.",
    xp: 0,
    category: "milestone_watch",
  },
};

const TASK_CATEGORY_TO_OBJECTIVE: Record<PrescribedTaskCategory, DashboardObjectiveId> = {
  check_in_morning: "morning_check_in",
  check_in_evening: "evening_check_in",
  walking: "movement_exposure",
  gait: "movement_exposure",
  activation: "activation",
  rom_extension: "rom",
  rom_flexion: "rom",
  recovery_basics: "recovery_basics",
  nutrition: "recovery_basics",
  hydration: "recovery_basics",
  sleep: "recovery_basics",
  swelling_management: "recovery_basics",
  skill_test: "skill_test",
};

type CanonicalTaskDefinition = {
  canonicalExerciseId: CanonicalExerciseId;
  title: string;
  category: PrescribedTaskCategory;
  parentObjectiveId: DashboardObjectiveId;
  prescription: PrescribedTaskPrescription;
  stopRules: string[];
  taskIntent: TaskIntent;
  taskPriority: TaskPriority;
};

type NormalizeCoachPlanContext = {
  state?: PhoenixState;
  date?: string;
  includeDefaults?: boolean;
  source?: "active" | "generated";
};

function extensionReachedNeutralForContext(context: NormalizeCoachPlanContext): boolean {
  if (!context.state || !context.date) return false;
  return getMorningForDate(context.state, context.date)?.extensionStatus === "reaches_neutral";
}

function canonicalTaskDefinition(
  canonicalExerciseId: CanonicalExerciseId,
  context: NormalizeCoachPlanContext = {},
): CanonicalTaskDefinition | null {
  const extensionNeutral = extensionReachedNeutralForContext(context);
  const definitions: Record<string, CanonicalTaskDefinition> = {
    morning_baseline_check_in: {
      canonicalExerciseId: "morning_baseline_check_in",
      title: "Morning baseline check-in",
      category: "check_in_morning",
      parentObjectiveId: "morning_check_in",
      prescription: {
        frequency: "Once before choosing today's workload",
        qualityTarget:
          "Baseline captures pain, swelling, walking confidence, extension, flexion, sleep, and notes.",
      },
      stopRules: [],
      taskIntent: "check_in",
      taskPriority: "required",
    },
    evening_response_check_in: {
      canonicalExerciseId: "evening_response_check_in",
      title: "Evening response check-in",
      category: "check_in_evening",
      parentObjectiveId: "evening_check_in",
      prescription: {
        frequency: "Once after today's work",
        qualityTarget:
          "Record adherence, pain during/after, swelling change, gait response, activation quality, and ROM response.",
      },
      stopRules: [],
      taskIntent: "check_in",
      taskPriority: "required",
    },
    supported_walk: {
      canonicalExerciseId: "supported_walk",
      title: "Supported walk",
      category: "walking",
      parentObjectiveId: "movement_exposure",
      prescription: {
        durationMinutes: 3,
        frequency: "2-4 short exposures today",
        effortTarget: "2-3/10 effort",
        qualityTarget: "Clean supported gait, comfort, and confidence. No chasing steps.",
      },
      stopRules: ["Stop if gait worsens, confidence drops, or pain rises above 4/10."],
      taskIntent: "build",
      taskPriority: "required",
    },
    quad_sets: {
      canonicalExerciseId: "quad_sets",
      title: "Quad sets",
      category: "activation",
      parentObjectiveId: "activation",
      prescription: {
        sets: 3,
        reps: 10,
        holdSeconds: 5,
        frequency: "1 session today",
        effortTarget: "5-6/10 effort",
        qualityTarget: "Repeatable contraction with no pain spike. Rest fully between reps.",
        rangeInstruction: "Comfortable knee position only.",
      },
      stopRules: ["Stop if pain rises above 4/10 or contraction quality fades sharply."],
      taskIntent: "build",
      taskPriority: "required",
    },
    straight_leg_raise: {
      canonicalExerciseId: "straight_leg_raise",
      title: "Straight leg raise",
      category: "skill_test",
      parentObjectiveId: "skill_test",
      prescription: {
        sets: 1,
        reps: 5,
        frequency: "Only if prescribed or testable",
        effortTarget: "No load",
        qualityTarget: "Clean reps with no lag, guarding, pain, or irritation.",
      },
      stopRules: ["Stop if lag, pain, guarding, or irritation appears."],
      taskIntent: "test",
      taskPriority: "optional",
    },
    heel_slides: {
      canonicalExerciseId: "heel_slides",
      title: "Heel slides",
      category: "rom_flexion",
      parentObjectiveId: "rom",
      prescription: {
        sets: 2,
        reps: 10,
        frequency: "1-2 sets today",
        effortTarget: "Easy range only",
        qualityTarget: "Easy flexion exposure, not max range.",
        rangeInstruction: "Comfortable range only. No strap pulling and no forcing end range.",
      },
      stopRules: ["Stop if flexion causes sharp pain, pinching, or swelling response."],
      taskIntent: "build",
      taskPriority: "required",
    },
    heel_prop_extension: {
      canonicalExerciseId: "heel_prop_extension",
      title: extensionNeutral ? "Heel prop extension maintenance" : "Heel prop extension exposure",
      category: "rom_extension",
      parentObjectiveId: "rom",
      prescription: {
        sets: extensionNeutral ? 1 : 2,
        durationMinutes: extensionNeutral ? 3 : 5,
        frequency: extensionNeutral
          ? "Optional only if knee feels stiff or not relaxed neutral"
          : "1-2 relaxed exposures today",
        effortTarget: "Passive only",
        qualityTarget: extensionNeutral
          ? "Maintain relaxed neutral extension without forcing."
          : "Build relaxed extension tolerance without guarding.",
        rangeInstruction: "No pushing, no forced end range. Stop before sharp pain or pinching.",
      },
      stopRules: ["Stop if sharp pain, pinching, or worse walking follows the exposure."],
      taskIntent: extensionNeutral ? "maintain" : "build",
      taskPriority: extensionNeutral ? "optional" : "required",
    },
    protein_target: {
      canonicalExerciseId: "protein_target",
      title: "Protein target",
      category: "nutrition",
      parentObjectiveId: "recovery_basics",
      prescription: {
        frequency: "Across the day",
        qualityTarget: "Hit today's protein target.",
      },
      stopRules: [],
      taskIntent: "fuel",
      taskPriority: "required",
    },
    hydration: {
      canonicalExerciseId: "hydration",
      title: "Hydration",
      category: "hydration",
      parentObjectiveId: "recovery_basics",
      prescription: {
        frequency: "Across the day",
        qualityTarget: "Keep fluids steady; do not wait until evening to catch up.",
      },
      stopRules: [],
      taskIntent: "recover",
      taskPriority: "required",
    },
    sleep_target: {
      canonicalExerciseId: "sleep_target",
      title: "Sleep target",
      category: "sleep",
      parentObjectiveId: "recovery_basics",
      prescription: {
        frequency: "Tonight",
        qualityTarget: "Protect sleep window for tissue recovery.",
      },
      stopRules: [],
      taskIntent: "recover",
      taskPriority: "optional",
    },
    pacing_rest: {
      canonicalExerciseId: "pacing_rest",
      title: "Pacing / rest",
      category: "recovery_basics",
      parentObjectiveId: "recovery_basics",
      prescription: {
        frequency: "Between activity exposures",
        effortTarget: "Comfort-based only",
        qualityTarget: "Avoid stacking irritation.",
      },
      stopRules: ["Reduce activity if pain, swelling, or gait quality worsens."],
      taskIntent: "recover",
      taskPriority: "optional",
    },
    elevation_if_symptomatic: {
      canonicalExerciseId: "elevation_if_symptomatic",
      title: "Elevation if symptomatic",
      category: "swelling_management",
      parentObjectiveId: "recovery_basics",
      prescription: {
        durationMinutes: 10,
        frequency: "Only if knee feels full or irritated",
        effortTarget: "Comfort-based only",
        qualityTarget: "Settle symptoms without chasing a perfect swelling score.",
      },
      stopRules: ["Stop any strategy that increases pain, numbness, or concerning symptoms."],
      taskIntent: "recover",
      taskPriority: "optional",
    },
    ice_if_symptomatic: {
      canonicalExerciseId: "ice_if_symptomatic",
      title: "Ice if symptomatic and allowed",
      category: "swelling_management",
      parentObjectiveId: "recovery_basics",
      prescription: {
        durationMinutes: 10,
        frequency: "Only if symptomatic and allowed",
        effortTarget: "Comfort-based only",
        qualityTarget: "Symptom support only; do not use ice to justify more volume.",
      },
      stopRules: ["Do not ice if contraindicated or if skin sensation is altered."],
      taskIntent: "recover",
      taskPriority: "optional",
    },
  };
  return definitions[canonicalExerciseId] ?? null;
}

function canonicalKey(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function canonicalExerciseIdFromText(value: string): CanonicalExerciseId | null {
  const text = canonicalKey(value);
  if (!text) return null;
  if (text.includes("morning") && text.includes("check")) return "morning_baseline_check_in";
  if (text.includes("evening") && text.includes("check")) return "evening_response_check_in";
  if (text.includes("quad activation") || text.includes("quad set")) return "quad_sets";
  if (text.includes("straight leg raise") || text.includes("slr")) return "straight_leg_raise";
  if (text.includes("heel slide") || text.includes("flexion exposure")) return "heel_slides";
  if (
    text.includes("heel prop") ||
    text.includes("extension exposure") ||
    text.includes("extension maintenance")
  )
    return "heel_prop_extension";
  if (
    text.includes("supported walk") ||
    text.includes("supported walking") ||
    text.includes("short walking") ||
    text.includes("walking practice") ||
    text.includes("gait practice")
  )
    return "supported_walk";
  if (text.includes("protein")) return "protein_target";
  if (text.includes("hydration") || text.includes("hydrate")) return "hydration";
  if (text.includes("sleep")) return "sleep_target";
  if (text.includes("elevation") || text.includes("elevate")) return "elevation_if_symptomatic";
  if (text.includes("ice")) return "ice_if_symptomatic";
  if (text.includes("rest") || text.includes("pacing")) return "pacing_rest";
  return null;
}

function dashboardObjectiveGroupForQuest(quest: DailyQuest): DashboardObjectiveGroup {
  if (quest.objectiveGroup) return quest.objectiveGroup;
  const text = normalizedQuestText(quest);
  if (quest.id === "morning-check-in" || text.includes("morning check")) return "morning_check_in";
  if (quest.id === "evening-check-in" || text.includes("evening check")) return "evening_check_in";
  if (
    text.includes("walk") ||
    text.includes("gait") ||
    text.includes("movement") ||
    text.includes("ankle pump") ||
    text.includes("step")
  ) {
    return "movement_exposure";
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
    return "recovery_basics";
  }
  if (text.includes("rom") || text.includes("extension") || text.includes("flexion")) return "rom";
  return "activation";
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

function defaultTaskForCanonicalExerciseId(
  canonicalExerciseId: CanonicalExerciseId,
  context: NormalizeCoachPlanContext = {},
): PrescribedTask {
  const definition =
    canonicalTaskDefinition(canonicalExerciseId, context) ??
    canonicalTaskDefinition("pacing_rest", context)!;
  return {
    id: `task-${definition.canonicalExerciseId}`,
    canonicalExerciseId: definition.canonicalExerciseId,
    title: definition.title,
    category: definition.category,
    parentObjectiveId: definition.parentObjectiveId,
    prescription: definition.prescription,
    stopRules: definition.stopRules,
    taskIntent: definition.taskIntent,
    taskPriority: definition.taskPriority,
    completion: defaultTaskCompletion(),
  };
}

function defaultTasksForObjective(
  objectiveId: DashboardObjectiveId,
  context: NormalizeCoachPlanContext = {},
): PrescribedTask[] {
  const defaults: Record<DashboardObjectiveId, CanonicalExerciseId[]> = {
    morning_check_in: ["morning_baseline_check_in"],
    movement_exposure: ["supported_walk"],
    activation: ["quad_sets"],
    rom: ["heel_slides", "heel_prop_extension"],
    recovery_basics: [
      "protein_target",
      "hydration",
      "elevation_if_symptomatic",
      "ice_if_symptomatic",
    ],
    evening_check_in: ["evening_response_check_in"],
    skill_test: [],
    milestone_watch: [],
  };
  return defaults[objectiveId].map((id) => defaultTaskForCanonicalExerciseId(id, context));
}

function normalizeTaskForDashboard(
  task: PrescribedTask,
  index: number,
  context: NormalizeCoachPlanContext = {},
): PrescribedTask | null {
  const canonicalExerciseId =
    canonicalTaskDefinition(task.canonicalExerciseId, context)?.canonicalExerciseId ??
    canonicalExerciseIdFromText(`${task.id} ${task.title}`) ??
    task.canonicalExerciseId;
  const definition = canonicalTaskDefinition(canonicalExerciseId, context);
  if (!definition) return null;
  const prescription = {
    ...definition.prescription,
    ...task.prescription,
  };
  const category = definition.category;
  const parentObjectiveId = TASK_CATEGORY_TO_OBJECTIVE[category];
  return {
    ...task,
    id: `task-${definition.canonicalExerciseId}`,
    canonicalExerciseId: definition.canonicalExerciseId,
    title: definition.title,
    category,
    parentObjectiveId,
    prescription,
    stopRules: uniqueDetails([...definition.stopRules, ...task.stopRules]),
    taskIntent: definition.taskIntent,
    taskPriority: definition.taskPriority,
    completion: defaultTaskCompletion(task.completion),
  };
}

function prescriptionConflict(
  a: PrescribedTaskPrescription,
  b: PrescribedTaskPrescription,
): boolean {
  const numericKeys: Array<keyof PrescribedTaskPrescription> = [
    "sets",
    "reps",
    "holdSeconds",
    "durationMinutes",
  ];
  return numericKeys.some((key) => a[key] != null && b[key] != null && a[key] !== b[key]);
}

function mergePrescriptions(
  a: PrescribedTaskPrescription,
  b: PrescribedTaskPrescription,
): PrescribedTaskPrescription {
  return {
    ...a,
    ...Object.fromEntries(Object.entries(b).filter(([, value]) => value != null && value !== "")),
  };
}

function mergeCanonicalTasks(existing: PrescribedTask, incoming: PrescribedTask): PrescribedTask {
  if (prescriptionConflict(existing.prescription, incoming.prescription)) {
    console.warn("Coach Plan validation warning: conflicting prescriptions for canonical task.", {
      canonicalExerciseId: existing.canonicalExerciseId,
      existing: existing.prescription,
      incoming: incoming.prescription,
    });
  }
  return {
    ...existing,
    prescription: mergePrescriptions(existing.prescription, incoming.prescription),
    stopRules: uniqueDetails([...existing.stopRules, ...incoming.stopRules]),
    completion:
      existing.completion.status !== "not_started" ? existing.completion : incoming.completion,
    taskPriority:
      existing.taskPriority === "required" || incoming.taskPriority === "required"
        ? "required"
        : "optional",
  };
}

function isObjectiveHeadingQuest(quest: DailyQuest): boolean {
  const text = canonicalKey(`${quest.id} ${quest.label} ${quest.title ?? ""}`);
  return (
    text.includes("activation rom work") ||
    text.includes("activation rom") ||
    text.includes("recovery support") ||
    text.includes("recovery basics") ||
    text.includes("gentle movement exposure") ||
    text.includes("clean movement exposures") ||
    text.includes("quad activation work") ||
    text.includes("gentle rom work")
  );
}

function collectNormalizedTasks(
  plan: DailyCoachPlan,
  context: NormalizeCoachPlanContext,
): PrescribedTask[] {
  const tasks: PrescribedTask[] = [];
  plan.quests.forEach((quest, questIndex) => {
    if (quest.prescribedTasks?.length) {
      quest.prescribedTasks.forEach((task, taskIndex) => {
        const normalized = normalizeTaskForDashboard(task, questIndex + taskIndex, context);
        if (normalized) tasks.push(normalized);
      });
      return;
    }
    const fallbackCanonicalId = canonicalExerciseIdFromText(
      `${quest.id} ${quest.label} ${quest.title ?? ""}`,
    );
    if ((!context.includeDefaults && !fallbackCanonicalId) || isObjectiveHeadingQuest(quest))
      return;
    const fallback = prescribedTaskFromQuest(quest, questIndex);
    const normalized = normalizeTaskForDashboard(fallback, questIndex, context);
    if (normalized) tasks.push(normalized);
  });
  return tasks;
}

function buildObjectivesFromTasks(
  plan: DailyCoachPlan,
  tasks: PrescribedTask[],
  context: NormalizeCoachPlanContext,
): DailyQuest[] {
  const byCanonicalId = new Map<CanonicalExerciseId, PrescribedTask>();
  tasks.forEach((task) => {
    const existing = byCanonicalId.get(task.canonicalExerciseId);
    byCanonicalId.set(
      task.canonicalExerciseId,
      existing ? mergeCanonicalTasks(existing, task) : task,
    );
  });

  if (context.includeDefaults) {
    DASHBOARD_OBJECTIVE_ORDER.forEach((objectiveId) => {
      const hasTaskForObjective = [...byCanonicalId.values()].some(
        (task) => task.parentObjectiveId === objectiveId,
      );
      if (!hasTaskForObjective) {
        defaultTasksForObjective(objectiveId, context).forEach((task) => {
          const existing = byCanonicalId.get(task.canonicalExerciseId);
          byCanonicalId.set(
            task.canonicalExerciseId,
            existing ? mergeCanonicalTasks(existing, task) : task,
          );
        });
      }
    });
  }

  const buckets: Record<DashboardObjectiveId, PrescribedTask[]> = {
    morning_check_in: [],
    movement_exposure: [],
    activation: [],
    rom: [],
    recovery_basics: [],
    evening_check_in: [],
    skill_test: [],
    milestone_watch: [],
  };
  [...byCanonicalId.values()].forEach((task) => buckets[task.parentObjectiveId].push(task));

  return DASHBOARD_OBJECTIVE_ORDER.flatMap((objectiveId) => {
    const prescribedTasks = buckets[objectiveId];
    if (prescribedTasks.length === 0) return [];
    const definition = DASHBOARD_OBJECTIVE_DEFINITIONS[objectiveId];
    const done = prescribedTasks.every(taskIsResolved);
    return [
      {
        id: objectiveId,
        date: plan.date,
        localDate: plan.localDate ?? plan.date,
        label: definition.title,
        title: definition.title,
        done,
        status: done ? "complete" : "pending",
        xp: definition.xp,
        kind: "main" as QuestKind,
        category: "main" as QuestKind,
        source:
          plan.status === "active" ? ("daily-coach-plan" as QuestSource) : ("phase" as QuestSource),
        reason: `Purpose: ${definition.purpose}`,
        details: [definition.purpose],
        relatedQuestIds: plan.quests.map((quest) => quest.id),
        objectiveGroup: objectiveId,
        prescribedTasks,
        questType: objectiveId === "recovery_basics" ? "recovery_basic" : "required_action",
        progressionType:
          objectiveId === "movement_exposure"
            ? "walking"
            : objectiveId === "rom"
              ? "rom"
              : objectiveId === "recovery_basics" ||
                  objectiveId === "morning_check_in" ||
                  objectiveId === "evening_check_in"
                ? "recovery"
                : "skill_control",
        phaseId: plan.phaseId,
        planId: plan.status === "active" ? plan.id : undefined,
      },
    ];
  });
}

export type CoachPlanValidationResult = { ok: true } | { ok: false; errors: string[] };

const OBJECTIVE_ALLOWED_TASK_CATEGORIES: Record<DashboardObjectiveId, PrescribedTaskCategory[]> = {
  morning_check_in: ["check_in_morning"],
  movement_exposure: ["walking", "gait"],
  activation: ["activation"],
  rom: ["rom_extension", "rom_flexion"],
  recovery_basics: ["recovery_basics", "nutrition", "hydration", "sleep", "swelling_management"],
  evening_check_in: ["check_in_evening"],
  skill_test: ["skill_test"],
  milestone_watch: [],
};

export function validateCoachPlan(plan: DailyCoachPlan): CoachPlanValidationResult {
  const errors: string[] = [];
  const seen = new Map<CanonicalExerciseId, DashboardObjectiveId>();
  plan.quests.forEach((quest) => {
    const objectiveId = quest.objectiveGroup;
    if (!objectiveId) {
      errors.push(`${quest.label}: missing parent objective.`);
      return;
    }
    (quest.prescribedTasks ?? []).forEach((task) => {
      if (!task.canonicalExerciseId) errors.push(`${task.title}: missing canonicalExerciseId.`);
      if (!task.category) errors.push(`${task.title}: missing category.`);
      if (!task.parentObjectiveId) errors.push(`${task.title}: missing parentObjectiveId.`);
      if (task.parentObjectiveId !== objectiveId) {
        errors.push(`${task.title}: parentObjectiveId does not match rendered objective.`);
      }
      const allowed = OBJECTIVE_ALLOWED_TASK_CATEGORIES[objectiveId] ?? [];
      if (!allowed.includes(task.category)) {
        errors.push(`${task.title}: ${task.category} cannot render under ${objectiveId}.`);
      }
      const previousObjective = seen.get(task.canonicalExerciseId);
      if (previousObjective && previousObjective !== objectiveId) {
        errors.push(
          `${task.canonicalExerciseId}: duplicate canonicalExerciseId appears in ${previousObjective} and ${objectiveId}.`,
        );
      }
      seen.set(task.canonicalExerciseId, objectiveId);
    });
  });
  return errors.length ? { ok: false, errors } : { ok: true };
}

function logCoachPlanValidation(plan: DailyCoachPlan, validation: CoachPlanValidationResult) {
  const tree = Object.fromEntries(
    plan.quests.map((quest) => [
      quest.objectiveGroup ?? quest.id,
      (quest.prescribedTasks ?? []).map((task) => task.canonicalExerciseId),
    ]),
  );
  if (!validation.ok) {
    console.error("Coach Plan validation failed: duplicate or misclassified prescribed tasks.", {
      errors: validation.errors,
      tree,
    });
    return;
  }
  if (import.meta.env?.DEV) {
    console.debug("Today's Quests normalized tree", tree);
  }
}

export function normalizeCoachPlan(
  plan: DailyCoachPlan,
  context: NormalizeCoachPlanContext = {},
): DailyCoachPlan {
  const normalizeContext = {
    ...context,
    date: context.date ?? plan.localDate ?? plan.date,
  };
  const tasks = collectNormalizedTasks(plan, normalizeContext);
  const quests = buildObjectivesFromTasks(plan, tasks, normalizeContext);
  const normalizedPlan = {
    ...plan,
    date: normalizeContext.date,
    localDate: normalizeContext.date,
    quests,
  };
  logCoachPlanValidation(normalizedPlan, validateCoachPlan(normalizedPlan));
  return normalizedPlan;
}

export function groupCoachPlanQuestsIntoDashboardObjectives(plan: DailyCoachPlan): DailyQuest[] {
  return normalizeCoachPlan(plan, { includeDefaults: true }).quests;
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

  const generatedPlan: DailyCoachPlan = {
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
    quests: generateDailyQuestPlan(s, isoDate).map((quest, index) => {
      const normalized = normalizeQuestForDate(s, isoDate, quest);
      return {
        ...normalized,
        prescribedTasks: normalized.prescribedTasks ?? [prescribedTaskFromQuest(normalized, index)],
      };
    }),
    skillTests: [],
    milestoneUpdates: [],
    nextUnlocks: [],
    stopRules: ["Stop or modify if pain, swelling, or walking quality worsens."],
    eveningCheckInFocus: phase.eveningCheckInFields
      .filter((field) => field !== "notes" && field !== "exercises-completed")
      .map((field) => checkInFieldLabel(field)),
    notes: "Generated from local Project Phoenix rules when no imported coach plan is active.",
    status: "draft",
  };

  const normalizedPlan = normalizeCoachPlan(generatedPlan, {
    state: s,
    date: isoDate,
    includeDefaults: true,
    source: "generated",
  });
  return {
    ...normalizedPlan,
    quests: normalizedPlan.quests.map((quest) => normalizeQuestForDate(s, isoDate, quest)),
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
  const basePlan = {
    ...plan,
    date: isoDate,
    localDate: isoDate,
    skillTests: (plan.skillTests ?? []).map(
      (test, index) => normalizeSkillTest(test, index, isoDate) ?? test,
    ),
    quests: plan.quests.map((quest) => normalizeQuestForDate(s, isoDate, quest)),
  };
  return normalizeCoachPlan(basePlan, {
    state: s,
    date: isoDate,
    includeDefaults: false,
    source: "active",
  });
}

export function dailyQuestsForDate(s: PhoenixState, isoDate = getLocalDateKey()): DailyQuest[] {
  const plan = dailyCoachPlanForDate(s, isoDate);
  return plan.quests.map((quest) => normalizeQuestForDate(s, isoDate, quest));
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

function normalizeSkillTestStatus(value: unknown): SkillTestStatus {
  return value === "available" ||
    value === "attempted" ||
    value === "passed_pending_confirmation" ||
    value === "failed" ||
    value === "deferred"
    ? value
    : "available";
}

function normalizeQuestType(value: unknown): QuestType {
  return value === "required_action" ||
    value === "optional_skill_test" ||
    value === "recovery_basic" ||
    value === "check_in" ||
    value === "monitoring"
    ? value
    : "required_action";
}

function normalizeSkillTestResponseChange(
  value: unknown,
): NonNullable<SkillTestResult["swellingResponse"]> {
  return value === "not_assessed" ||
    value === "same" ||
    value === "better" ||
    value === "worse" ||
    value === "unknown"
    ? value
    : "unknown";
}

function optionalBoolean(value: unknown): boolean | undefined {
  return typeof value === "boolean" ? value : undefined;
}

function normalizeSkillTestResult(value: unknown): SkillTestResult {
  if (!value || typeof value !== "object") {
    return { completed: false };
  }
  const record = value as Record<string, unknown>;
  return {
    attemptedAt: stringValue(record.attemptedAt) || undefined,
    completed: typeof record.completed === "boolean" ? record.completed : false,
    repsCompleted: finiteOptionalNumber(record.repsCompleted),
    painDuring: finiteOptionalNumber(record.painDuring),
    painAfter: finiteOptionalNumber(record.painAfter),
    qualityScore: finiteOptionalNumber(record.qualityScore),
    lagObserved: optionalBoolean(record.lagObserved),
    feltControlled: optionalBoolean(record.feltControlled),
    irritation: optionalBoolean(record.irritation),
    swellingResponse: normalizeSkillTestResponseChange(record.swellingResponse),
    walkingResponse: normalizeSkillTestResponseChange(record.walkingResponse),
    notes: stringValue(record.notes) || undefined,
  };
}

function normalizeSkillTestResultRecord(
  value: unknown,
): Record<string, SkillTestResult> | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  const entries = Object.entries(value as Record<string, unknown>).map(
    ([testId, result]) => [testId, normalizeSkillTestResult(result)] as const,
  );
  return entries.length ? Object.fromEntries(entries) : undefined;
}

function normalizeSkillTestDose(value: unknown): SkillTestDose {
  if (!value || typeof value !== "object") {
    return {
      instructions: "Perform only if today's readiness criteria are met.",
    };
  }
  const record = value as Record<string, unknown>;
  return {
    sets: finiteOptionalNumber(record.sets),
    reps: finiteOptionalNumber(record.reps),
    duration:
      stringValue(record.duration) ||
      (typeof record.duration === "number" && Number.isFinite(record.duration)
        ? `${record.duration} min`
        : undefined),
    instructions:
      stringValue(record.instructions) || "Perform only if today's readiness criteria are met.",
  };
}

function normalizeSkillTest(value: unknown, index: number, fallbackDate: string): SkillTest | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  const title = stringValue(record.title) || stringValue(record.name) || `Skill test ${index + 1}`;
  const relatedMilestoneId = normalizeMilestoneId(record.relatedMilestoneId ?? record.milestoneId);
  if (!relatedMilestoneId) return null;
  const date = stringValue(record.localDate) || stringValue(record.date) || fallbackDate;
  return {
    id: stringValue(record.id) || `skill-test-${date}-${slugify(title)}`,
    date,
    localDate: date,
    timestampUtc: stringValue(record.timestampUtc) || undefined,
    relatedMilestoneId,
    title,
    description: stringValue(record.description) || title,
    status: normalizeSkillTestStatus(record.status),
    progressionType: normalizeProgressionType(record.progressionType, "skill_control"),
    testDose: normalizeSkillTestDose(record.testDose),
    passCriteria: stringArray(record.passCriteria),
    stopRules: stringArray(record.stopRules),
    responseRequired: {
      eveningCheckInRequired:
        !record.responseRequired ||
        typeof record.responseRequired !== "object" ||
        (record.responseRequired as Record<string, unknown>).eveningCheckInRequired !== false,
      nextMorningCheckInRequired:
        !record.responseRequired ||
        typeof record.responseRequired !== "object" ||
        (record.responseRequired as Record<string, unknown>).nextMorningCheckInRequired !== false,
    },
    result: normalizeSkillTestResult(record.result),
  };
}

function normalizeSkillTests(value: unknown, fallbackDate: string): SkillTest[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item, index) => normalizeSkillTest(item, index, fallbackDate))
    .filter((item): item is SkillTest => Boolean(item));
}

function normalizeMilestoneUpdate(value: unknown): DailyCoachPlanMilestoneUpdate | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  const milestoneId = normalizeMilestoneId(record.milestoneId);
  if (!milestoneId) return null;
  return {
    milestoneId,
    state: normalizeMilestoneState(record.state),
    summary: stringValue(record.summary) || "Milestone state updated from Daily Coach Plan.",
    nextStepIfConfirmed: stringValue(record.nextStepIfConfirmed) || undefined,
    nextStepIfNotConfirmed: stringValue(record.nextStepIfNotConfirmed) || undefined,
    confidence: normalizeEvidenceConfidence(record.confidence),
  };
}

function normalizeMilestoneUpdates(value: unknown): DailyCoachPlanMilestoneUpdate[] {
  if (!Array.isArray(value)) return [];
  return value
    .map(normalizeMilestoneUpdate)
    .filter((item): item is DailyCoachPlanMilestoneUpdate => Boolean(item));
}

function normalizeNextUnlock(value: unknown, index: number): DailyCoachPlanNextUnlock | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  const milestoneId = normalizeMilestoneId(record.milestoneId);
  const title = stringValue(record.title) || `Next unlock ${index + 1}`;
  if (!milestoneId) return null;
  return {
    milestoneId,
    title,
    state: normalizeMilestoneState(record.state),
    evidenceNeeded: stringArray(record.evidenceNeeded),
    nextStepIfConfirmed:
      stringValue(record.nextStepIfConfirmed) || "Confirm response before adding this skill.",
    nextStepIfNotConfirmed:
      stringValue(record.nextStepIfNotConfirmed) || "Keep this as possible but not doseable.",
  };
}

function normalizeNextUnlocks(value: unknown): DailyCoachPlanNextUnlock[] {
  if (!Array.isArray(value)) return [];
  return value
    .map(normalizeNextUnlock)
    .filter((item): item is DailyCoachPlanNextUnlock => Boolean(item));
}

const PRESCRIBED_TASK_CATEGORIES: PrescribedTaskCategory[] = [
  "check_in_morning",
  "check_in_evening",
  "walking",
  "gait",
  "activation",
  "rom_extension",
  "rom_flexion",
  "recovery_basics",
  "nutrition",
  "hydration",
  "sleep",
  "swelling_management",
  "skill_test",
];

function taskCategoryFromValue(
  value: unknown,
  fallback: PrescribedTaskCategory,
): PrescribedTaskCategory {
  const category = stringValue(value).replace("-", "_");
  if (category === "check_in")
    return fallback === "check_in_evening" ? "check_in_evening" : "check_in_morning";
  if (category === "movement") return "walking";
  if (category === "rom") return fallback === "rom_flexion" ? "rom_flexion" : "rom_extension";
  if (category === "recovery") return "recovery_basics";
  if (category === "reflection") return "check_in_evening";
  return PRESCRIBED_TASK_CATEGORIES.includes(category as PrescribedTaskCategory)
    ? (category as PrescribedTaskCategory)
    : fallback;
}

function finiteOptionalNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function optionalEnumValue<T extends string>(value: unknown, allowed: readonly T[]): T | undefined {
  return typeof value === "string" && allowed.includes(value as T) ? (value as T) : undefined;
}

function defaultTaskCompletion(
  patch: Partial<PrescribedTaskCompletion> = {},
): PrescribedTaskCompletion {
  const status =
    patch.status === "completed" || patch.status === "partial" || patch.status === "skipped"
      ? patch.status
      : "not_started";
  return {
    status,
    actualSets: finiteOptionalNumber(patch.actualSets),
    actualReps: finiteOptionalNumber(patch.actualReps),
    actualDurationMinutes: finiteOptionalNumber(patch.actualDurationMinutes),
    painDuring: finiteOptionalNumber(patch.painDuring),
    painAfter: finiteOptionalNumber(patch.painAfter),
    qualityScore: finiteOptionalNumber(patch.qualityScore),
    partialEstimate: optionalEnumValue<PrescribedTaskPartialEstimate>(patch.partialEstimate, [
      "less_than_half",
      "about_half",
      "most",
      "custom",
    ]),
    limitationReason: patch.limitationReason,
    skippedReason: patch.skippedReason,
    afterEffect: optionalEnumValue<PrescribedTaskAfterEffect>(patch.afterEffect, [
      "no_issue",
      "mild_settled",
      "worse",
    ]),
    gaitQuality: optionalEnumValue<PrescribedTaskGaitQuality>(patch.gaitQuality, [
      "clean",
      "slight_limp",
      "worse_limp",
    ]),
    supportUsed: optionalEnumValue<PrescribedTaskSupportUsed>(patch.supportUsed, [
      "none",
      "one_crutch",
      "two_crutches",
      "mixed",
    ]),
    activationQuality: optionalEnumValue<PrescribedTaskActivationQuality>(patch.activationQuality, [
      "could_not_find",
      "weak_repeatable",
      "good_control",
      "faded",
    ]),
    controlQuality: optionalEnumValue<PrescribedTaskControlQuality>(patch.controlQuality, [
      "clean",
      "slight_lag",
      "clear_lag",
      "not_sure",
    ]),
    limitingFactor: optionalEnumValue<PrescribedTaskFlexionLimitingFactor>(patch.limitingFactor, [
      "comfortable",
      "incision_scar_tension",
      "swelling_fullness",
      "joint_pinch",
      "pain",
      "unknown",
    ]),
    flexionEstimateDegrees: finiteOptionalNumber(patch.flexionEstimateDegrees),
    extensionAfter: optionalEnumValue<PrescribedTaskExtensionAfter>(patch.extensionAfter, [
      "relaxed_neutral",
      "stiff",
      "painful_pinching",
      "not_tested",
    ]),
    notes: patch.notes,
  };
}

function normalizeTaskCompletionRecord(
  value: unknown,
): Record<string, PrescribedTaskCompletion> | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  const entries = Object.entries(value as Record<string, Partial<PrescribedTaskCompletion>>).map(
    ([taskId, completion]) => [taskId, defaultTaskCompletion(completion)] as const,
  );
  return entries.length ? Object.fromEntries(entries) : undefined;
}

function normalizeTaskCompletionDateMap(
  value: unknown,
): Record<string, Record<string, PrescribedTaskCompletion>> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .map(([date, completions]) => [date, normalizeTaskCompletionRecord(completions)] as const)
      .filter((entry): entry is readonly [string, Record<string, PrescribedTaskCompletion>] =>
        Boolean(entry[1]),
      ),
  );
}

function normalizePrescription(value: unknown): PrescribedTaskPrescription {
  if (!value || typeof value !== "object") return {};
  const record = value as Record<string, unknown>;
  return {
    sets: finiteOptionalNumber(record.sets),
    reps: finiteOptionalNumber(record.reps),
    holdSeconds: finiteOptionalNumber(record.holdSeconds),
    durationMinutes: finiteOptionalNumber(record.durationMinutes),
    frequency: stringValue(record.frequency) || undefined,
    effortTarget: stringValue(record.effortTarget) || undefined,
    qualityTarget: stringValue(record.qualityTarget) || undefined,
    rangeInstruction: stringValue(record.rangeInstruction) || undefined,
  };
}

function prescribedTaskDefaults(
  id: string,
  title: string,
  fallbackCategory: PrescribedTaskCategory,
): Pick<
  PrescribedTask,
  | "canonicalExerciseId"
  | "title"
  | "category"
  | "parentObjectiveId"
  | "prescription"
  | "stopRules"
  | "taskIntent"
  | "taskPriority"
> {
  const fallbackCanonicalByCategory: Record<PrescribedTaskCategory, CanonicalExerciseId> = {
    check_in_morning: "morning_baseline_check_in",
    check_in_evening: "evening_response_check_in",
    walking: "supported_walk",
    gait: "supported_walk",
    activation: "quad_sets",
    rom_extension: "heel_prop_extension",
    rom_flexion: "heel_slides",
    recovery_basics: "pacing_rest",
    nutrition: "protein_target",
    hydration: "hydration",
    sleep: "sleep_target",
    swelling_management: "elevation_if_symptomatic",
    skill_test: "straight_leg_raise",
  };
  const canonicalExerciseId =
    canonicalExerciseIdFromText(`${id} ${title}`) ?? fallbackCanonicalByCategory[fallbackCategory];
  const definition =
    canonicalTaskDefinition(canonicalExerciseId) ??
    canonicalTaskDefinition(fallbackCanonicalByCategory[fallbackCategory])!;
  return definition;
}

function normalizePrescribedTask(
  value: unknown,
  index: number,
  fallbackTitle: string,
  fallbackCategory: PrescribedTaskCategory,
): PrescribedTask | null {
  if (typeof value === "string") {
    const title = value.trim();
    if (!title) return null;
    const id = `task-${index + 1}-${slugify(title)}`;
    const defaults = prescribedTaskDefaults(id, title, fallbackCategory);
    return {
      id: `task-${defaults.canonicalExerciseId}`,
      canonicalExerciseId: defaults.canonicalExerciseId,
      title: defaults.title,
      category: defaults.category,
      parentObjectiveId: defaults.parentObjectiveId,
      prescription: defaults.prescription,
      stopRules: defaults.stopRules,
      taskIntent: defaults.taskIntent,
      taskPriority: defaults.taskPriority,
      completion: defaultTaskCompletion(),
    };
  }

  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  const title =
    stringValue(record.title) ||
    stringValue(record.label) ||
    stringValue(record.name) ||
    fallbackTitle ||
    `Task ${index + 1}`;
  const id = stringValue(record.id) || `task-${index + 1}-${slugify(title)}`;
  const canonicalExerciseId =
    canonicalExerciseIdFromText(
      `${stringValue(record.canonicalExerciseId)} ${id} ${title} ${stringValue(record.exerciseId)}`,
    ) ?? canonicalExerciseIdFromText(`${id} ${title}`);
  const defaults = prescribedTaskDefaults(id, canonicalExerciseId ?? title, fallbackCategory);
  const prescription = {
    ...defaults.prescription,
    ...normalizePrescription(record.prescription),
  };
  return {
    id: `task-${defaults.canonicalExerciseId}`,
    canonicalExerciseId: defaults.canonicalExerciseId,
    title: defaults.title,
    category: defaults.category,
    parentObjectiveId: defaults.parentObjectiveId,
    prescription,
    stopRules: stringArray(record.stopRules).length
      ? stringArray(record.stopRules)
      : defaults.stopRules,
    taskIntent:
      record.taskIntent === "check_in" ||
      record.taskIntent === "build" ||
      record.taskIntent === "maintain" ||
      record.taskIntent === "recover" ||
      record.taskIntent === "fuel" ||
      record.taskIntent === "test"
        ? record.taskIntent
        : defaults.taskIntent,
    taskPriority:
      record.taskPriority === "optional" || record.taskPriority === "required"
        ? record.taskPriority
        : defaults.taskPriority,
    completion: defaultTaskCompletion(record.completion as Partial<PrescribedTaskCompletion>),
  };
}

function fallbackTaskCategoryForQuest(quest: Pick<DailyQuest, "id" | "label" | "reason">) {
  const group = dashboardObjectiveGroupForQuest(quest as DailyQuest);
  if (group === "movement_exposure") return "walking";
  if (group === "recovery_basics") return "recovery_basics";
  if (group === "morning_check_in") return "check_in_morning";
  if (group === "evening_check_in") return "check_in_evening";
  if (group === "rom") return "rom_extension";
  const text = normalizedQuestText(quest).toLowerCase();
  return text.includes("rom") || text.includes("extension") || text.includes("flexion")
    ? "rom_extension"
    : "activation";
}

function prescribedTaskFromQuest(quest: DailyQuest, index = 0): PrescribedTask {
  const category = fallbackTaskCategoryForQuest(quest);
  const defaults = prescribedTaskDefaults(quest.id, quest.title ?? quest.label, category);
  return {
    id: `task-${defaults.canonicalExerciseId}`,
    canonicalExerciseId: defaults.canonicalExerciseId,
    title: defaults.title,
    category: defaults.category,
    parentObjectiveId: defaults.parentObjectiveId,
    prescription: defaults.prescription,
    stopRules: quest.details?.length
      ? uniqueDetails([...defaults.stopRules, ...quest.details])
      : defaults.stopRules,
    taskIntent: defaults.taskIntent,
    taskPriority: defaults.taskPriority,
    completion: defaultTaskCompletion(quest.done ? { status: "completed" } : {}),
  };
}

function normalizeQuestTasks(
  record: Record<string, unknown>,
  label: string,
  fallbackCategory: PrescribedTaskCategory,
): PrescribedTask[] {
  const taskInput = Array.isArray(record.prescribedTasks)
    ? record.prescribedTasks
    : Array.isArray(record.tasks)
      ? record.tasks
      : undefined;
  if (taskInput) {
    return taskInput
      .map((task, index) => normalizePrescribedTask(task, index, label, fallbackCategory))
      .filter((task): task is PrescribedTask => Boolean(task));
  }
  if (record.prescription && typeof record.prescription === "object") {
    const task = normalizePrescribedTask(record, 0, label, fallbackCategory);
    return task ? [task] : [];
  }
  return [];
}

function objectiveGroupFromValue(value: unknown): DashboardObjectiveGroup | undefined {
  const group = stringValue(value).replace("-", "_");
  if (group === "check_in" || group === "morning_check_in" || group === "check-in")
    return "morning_check_in";
  if (group === "movement" || group === "movement_exposure") return "movement_exposure";
  if (group === "activation") return "activation";
  if (group === "activation_rom" || group === "activation-rom") return "activation";
  if (group === "rom") return "rom";
  if (group === "recovery_support" || group === "recovery-support" || group === "recovery_basics")
    return "recovery_basics";
  if (group === "evening_response" || group === "evening-response" || group === "evening_check_in")
    return "evening_check_in";
  if (group === "skill_test") return "skill_test";
  if (group === "milestone_watch") return "milestone_watch";
  return undefined;
}

function mergePrescribedTaskCompletion(
  task: PrescribedTask,
  completion: PrescribedTaskCompletion | undefined,
): PrescribedTask {
  return {
    ...task,
    completion: defaultTaskCompletion(completion ?? task.completion),
  };
}

function taskIsResolved(task: PrescribedTask): boolean {
  return task.completion.status !== "not_started";
}

export function taskCompletionsForDate(
  s: PhoenixState,
  isoDate: string,
): Record<string, PrescribedTaskCompletion> {
  return s.prescribedTaskCompletions?.[isoDate] ?? {};
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
  return readiness === "ready" ||
    readiness === "recover" ||
    readiness === "modify" ||
    readiness === "modify_positive"
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
    const task = normalizePrescribedTask(label, index, label, "activation");
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
      prescribedTasks: task ? [task] : undefined,
      questType: "required_action",
      progressionType: "skill_control",
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
  const fallbackCategory = taskCategoryFromValue(
    record.taskCategory ?? record.category,
    label.toLowerCase().includes("walk") ? "walking" : "activation",
  );
  const xp = typeof record.xp === "number" && Number.isFinite(record.xp) ? record.xp : 10;
  const status = stringValue(record.status);
  const done =
    typeof record.done === "boolean"
      ? record.done
      : status === "complete" || status === "completed";
  const details = stringArray(record.details);
  const prescribedTasks = normalizeQuestTasks(record, label, fallbackCategory);
  const fallbackTask = normalizePrescribedTask(record, 0, label, fallbackCategory);
  const tasks = prescribedTasks.length
    ? prescribedTasks
    : fallbackTask
      ? [fallbackTask]
      : undefined;

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
    objectiveGroup: objectiveGroupFromValue(record.objectiveGroup),
    prescribedTasks: tasks,
    questType: normalizeQuestType(record.questType),
    progressionType: normalizeProgressionType(record.progressionType, "skill_control"),
    relatedMilestoneId: normalizeMilestoneId(record.relatedMilestoneId) || undefined,
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
  const skillTests = normalizeSkillTests(input.skillTests, planDate);
  const milestoneUpdates = normalizeMilestoneUpdates(input.milestoneUpdates);
  const nextUnlocks = normalizeNextUnlocks(input.nextUnlocks);

  if (quests.length === 0) errors.push("quests array must contain at least one quest.");
  if (stopRules.length === 0) errors.push("stopRules array must contain at least one stop rule.");
  if (errors.length > 0) return { ok: false, errors };

  const importedAt = getUtcTimestamp();
  const createdAt = stringValue(input.createdAt) || importedAt;
  const activePhase = PHASE_CONFIGS.some((phase) => phase.id === input.phaseId)
    ? (input.phaseId as PhaseId)
    : "activation-early-rom";
  const readiness = normalizeDailyCoachPlanReadiness(input.readiness);
  if (readiness === "modify_positive" && quests.some((quest) => quest.progressionType === "load")) {
    errors.push("modify_positive cannot include load progression quests.");
  }
  if (errors.length > 0) return { ok: false, errors };

  const plan: DailyCoachPlan = {
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
    readiness,
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
    skillTests,
    milestoneUpdates,
    nextUnlocks,
    stopRules,
    eveningCheckInFocus: stringArray(input.eveningCheckInFocus),
    notes: stringValue(input.notes),
    status: "draft",
  };
  const normalizedPlan = normalizeCoachPlan(plan, {
    date: planDate,
    includeDefaults: false,
    source: "active",
  });
  const validation = validateCoachPlan(normalizedPlan);
  if (normalizedPlan.quests.length === 0) {
    return {
      ok: false,
      errors: [
        "Coach Plan validation failed: duplicate or misclassified prescribed tasks.",
        "Coach plan did not produce any normalized dashboard objectives.",
      ],
    };
  }
  if (!validation.ok) {
    return {
      ok: false,
      errors: [
        "Coach Plan validation failed: duplicate or misclassified prescribed tasks.",
        ...validation.errors,
      ],
    };
  }
  return { ok: true, plan: normalizedPlan };
}

function applyDailyCoachPlanMilestoneUpdates(
  milestones: Milestone[],
  updates: DailyCoachPlanMilestoneUpdate[],
  localDate: string,
): Milestone[] {
  if (updates.length === 0) return milestones;
  return milestones.map((milestone) => {
    const update = updates.find((item) => item.milestoneId === milestone.id);
    if (!update) return milestone;
    const state =
      update.state === "unlocked" && !milestone.allowsImmediateUnlock
        ? "test_passed_pending_confirmation"
        : update.state;
    const evidence = [
      ...milestone.evidence,
      {
        date: localDate,
        type: "coach_plan" as MilestoneEvidenceType,
        summary: update.summary,
        confidence: update.confidence ?? "medium",
      },
    ];
    return {
      ...milestone,
      state,
      status: state,
      evidence,
      evidenceSummary: update.summary,
      nextStepIfConfirmed: update.nextStepIfConfirmed ?? milestone.nextStepIfConfirmed,
      nextStepIfNotConfirmed: update.nextStepIfNotConfirmed ?? milestone.nextStepIfNotConfirmed,
      unlockedAt: state === "unlocked" ? (milestone.unlockedAt ?? localDate) : milestone.unlockedAt,
    };
  });
}

export function activateDailyCoachPlan(plan: DailyCoachPlan) {
  setState((prev) => {
    const importedAt = plan.importedAt || getUtcTimestamp();
    const localDate = plan.localDate || plan.date;
    const timestampUtc = plan.timestampUtc || importedAt;
    const sourcePlan = normalizeCoachPlan(plan, {
      state: prev,
      date: localDate,
      includeDefaults: false,
      source: "active",
    });
    const previousQuests = dailyQuestsForDate(prev, localDate);
    const previousCompleted = previousQuests.filter((quest) => quest.done);
    const nextQuestCompletions = {
      ...(prev.questCompletions ?? {}),
      [localDate]: {
        ...(prev.questCompletions?.[localDate] ?? {}),
      },
    };
    const nextTaskCompletions = {
      ...(prev.prescribedTaskCompletions ?? {}),
      [localDate]: {
        ...(prev.prescribedTaskCompletions?.[localDate] ?? {}),
      },
    };

    const quests: DailyQuest[] = sourcePlan.quests.map((quest) => {
      const matchedCompleted = previousCompleted.find(
        (existing) => existing.id === quest.id || existing.label === quest.label,
      );
      const prescribedTasks = quest.prescribedTasks?.map((task) => {
        const completion = defaultTaskCompletion(
          nextTaskCompletions[localDate][task.id] ?? task.completion,
        );
        nextTaskCompletions[localDate][task.id] = completion;
        return { ...task, completion };
      });
      const done = prescribedTasks?.length
        ? prescribedTasks.every(taskIsResolved)
        : Boolean(matchedCompleted ?? quest.done);
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
        prescribedTasks,
        planId: plan.id,
      };
    });

    const activatedPlan: DailyCoachPlan = {
      ...sourcePlan,
      date: localDate,
      localDate,
      timestampUtc,
      quests,
      skillTests: (plan.skillTests ?? []).map((test, index) => ({
        ...(normalizeSkillTest(test, index, localDate) ?? test),
        date: localDate,
        localDate,
      })),
      milestoneUpdates: plan.milestoneUpdates ?? [],
      nextUnlocks: plan.nextUnlocks ?? [],
      importedAt,
      status: "active",
    };
    const skillTests = [
      ...(prev.skillTests ?? []).filter((test) => dailyRecordDate(test) !== localDate),
      ...activatedPlan.skillTests,
    ];

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
      skillTests,
      milestones: applyDailyCoachPlanMilestoneUpdates(
        prev.milestones,
        activatedPlan.milestoneUpdates,
        localDate,
      ),
      questCompletions: nextQuestCompletions,
      prescribedTaskCompletions: nextTaskCompletions,
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

export function updatePrescribedTaskCompletion(
  isoDate: string,
  taskId: string,
  patch: Partial<PrescribedTaskCompletion>,
) {
  setState((prev) => {
    const existing = prev.prescribedTaskCompletions?.[isoDate]?.[taskId];
    const completion = defaultTaskCompletion({
      ...existing,
      ...patch,
      status: patch.status ?? existing?.status ?? "not_started",
    });
    const prescribedTaskCompletions = {
      ...(prev.prescribedTaskCompletions ?? {}),
      [isoDate]: {
        ...(prev.prescribedTaskCompletions?.[isoDate] ?? {}),
        [taskId]: completion,
      },
    };
    const updateTasks = (quest: DailyQuest): DailyQuest => ({
      ...quest,
      prescribedTasks: quest.prescribedTasks?.map((task) =>
        task.id === taskId ? { ...task, completion } : task,
      ),
    });
    const dailyCoachPlans = prev.dailyCoachPlans.map((plan) =>
      dailyRecordDate(plan) === isoDate
        ? {
            ...plan,
            quests: plan.quests.map(updateTasks),
          }
        : plan,
    );
    const nextBase: PhoenixState = {
      ...prev,
      dailyCoachPlans,
      prescribedTaskCompletions,
    };
    const updatedQuests = dailyQuestsForDate(nextBase, isoDate);
    const questCompletions = {
      ...(prev.questCompletions ?? {}),
      [isoDate]: {
        ...(prev.questCompletions?.[isoDate] ?? {}),
      },
    };
    updatedQuests.forEach((quest) => {
      questCompletions[isoDate][quest.id] = quest.done;
    });
    return {
      ...nextBase,
      questCompletions,
      todayQuests: isoDate === getLocalDateKey() ? updatedQuests : prev.todayQuests,
    };
  });
}

function skillTestDoseForSlr(): SkillTestDose {
  return {
    sets: 1,
    reps: 3,
    instructions:
      "Small test dose only. Lock the knee first, lift only if control is clean, and stop at the first sign of lag, guarding, pain, or irritation.",
  };
}

function skillTestCriteriaMetForSlr(
  morning: MorningCheckIn | null,
  previousResponse: EveningCheckIn | null,
): boolean {
  if (!morning) return false;
  const swellingTrend = morning.swellingTrend ?? "unknown";
  const morningGaitQualityScore = gaitQualityScore(morning.gaitQuality);
  const gaitQuality =
    morningGaitQualityScore ??
    previousResponse?.gaitQualityAfter ??
    previousResponse?.movementQualityAfter;
  return (
    morning.pain <= 3 &&
    (morning.swellingLevel ?? morning.swelling) <= 6 &&
    swellingTrend !== "worse" &&
    morning.walkingConfidence >= 3 &&
    (gaitQuality == null || gaitQuality >= 3) &&
    morning.extensionStatus === "reaches_neutral" &&
    (previousResponse?.quadActivationQuality ?? 3) >= 3 &&
    !hasConcerningNotes(morning.notes)
  );
}

function defaultSkillTestForMilestone(
  milestone: Milestone,
  isoDate: string,
  morning: MorningCheckIn | null,
  previousResponse: EveningCheckIn | null,
): SkillTest | null {
  if (milestone.id !== "straight_leg_raise_no_lag") return null;
  const criteriaMet = skillTestCriteriaMetForSlr(morning, previousResponse);
  return {
    id: `skill-test-${isoDate}-straight-leg-raise-no-lag`,
    date: isoDate,
    localDate: isoDate,
    relatedMilestoneId: milestone.id,
    title: "Straight leg raise test dose",
    description:
      "Optional skill-control check. A successful immediate test still needs evening and next-morning confirmation.",
    status: criteriaMet ? "available" : "deferred",
    progressionType: "skill_control",
    testDose: skillTestDoseForSlr(),
    passCriteria: [
      "No lag",
      "Controlled lift",
      "No pain spike",
      "No incision or joint irritation",
      "No worse walking afterward",
    ],
    stopRules: [
      "Stop if lag appears.",
      "Stop if pain rises above 3/10.",
      "Stop if guarding, pinching, irritation, or worse gait appears.",
    ],
    responseRequired: {
      eveningCheckInRequired: true,
      nextMorningCheckInRequired: true,
    },
    result: { completed: false, swellingResponse: "unknown", walkingResponse: "unknown" },
  };
}

function mergeSkillTestResult(test: SkillTest, result: SkillTestResult | undefined): SkillTest {
  return result
    ? {
        ...test,
        result,
        status: result.attemptedAt
          ? skillTestStatusFromResult(result)
          : normalizeSkillTestStatus(test.status),
      }
    : test;
}

export function skillTestsForDate(s: PhoenixState, isoDate = getLocalDateKey()): SkillTest[] {
  const activePlan = activeDailyCoachPlanForDate(s, isoDate);
  const morning = getMorningForDate(s, isoDate);
  const previousResponse = previousEvening(s, isoDate);
  const storedForDate = (s.skillTests ?? []).filter((test) => dailyRecordDate(test) === isoDate);
  const generated = s.milestones
    .filter(
      (milestone) =>
        milestone.state === "testable" || milestone.state === "test_passed_pending_confirmation",
    )
    .map((milestone) => defaultSkillTestForMilestone(milestone, isoDate, morning, previousResponse))
    .filter((test): test is SkillTest => Boolean(test));
  const byId = new Map<string, SkillTest>();
  [...generated, ...(activePlan?.skillTests ?? []), ...storedForDate].forEach((test) => {
    const normalized = normalizeSkillTest(test, byId.size, isoDate) ?? test;
    byId.set(normalized.id, normalized);
  });
  const eveningResults = getEveningForDate(s, isoDate)?.skillTestResults ?? {};
  return [...byId.values()].map((test) => mergeSkillTestResult(test, eveningResults[test.id]));
}

function resultSuggestsFailedSkillTest(result: SkillTestResult): boolean {
  return (
    result.lagObserved === true ||
    result.irritation === true ||
    (result.painDuring ?? 0) > 3 ||
    (result.painAfter ?? 0) > 3 ||
    (result.qualityScore != null && result.qualityScore < 3) ||
    result.swellingResponse === "worse" ||
    result.walkingResponse === "worse"
  );
}

function skillTestStatusFromResult(result: SkillTestResult): SkillTestStatus {
  if (!result.attemptedAt) return "available";
  if (!result.completed) return "attempted";
  return resultSuggestsFailedSkillTest(result) ? "failed" : "passed_pending_confirmation";
}

export function updateSkillTestResult(
  isoDate: string,
  testId: string,
  patch: Partial<SkillTestResult>,
) {
  setState((prev) => {
    const now = getUtcTimestamp();
    const existing = skillTestsForDate(prev, isoDate).find((test) => test.id === testId);
    if (!existing) return prev;
    const result = normalizeSkillTestResult({
      ...existing.result,
      ...patch,
      attemptedAt: patch.attemptedAt ?? existing.result.attemptedAt ?? now,
      completed: patch.completed ?? existing.result.completed,
    });
    const status = skillTestStatusFromResult(result);
    const updatedTest = { ...existing, status, result, timestampUtc: now };
    const skillTests = [
      ...(prev.skillTests ?? []).filter(
        (test) => !(dailyRecordDate(test) === isoDate && test.id === testId),
      ),
      updatedTest,
    ];
    const dailyCoachPlans = prev.dailyCoachPlans.map((plan) =>
      dailyRecordDate(plan) === isoDate
        ? {
            ...plan,
            skillTests: (plan.skillTests ?? []).map((test) =>
              test.id === testId ? updatedTest : test,
            ),
          }
        : plan,
    );
    const milestones = prev.milestones.map((milestone) => {
      if (milestone.id !== updatedTest.relatedMilestoneId) return milestone;
      const nextState: MilestoneState =
        status === "passed_pending_confirmation"
          ? "test_passed_pending_confirmation"
          : status === "failed"
            ? "paused"
            : milestone.state;
      const evidenceSummary =
        status === "passed_pending_confirmation"
          ? `${updatedTest.title} completed successfully; pending evening and next-morning response.`
          : status === "failed"
            ? `${updatedTest.title} did not meet criteria; keep the milestone paused.`
            : `${updatedTest.title} attempted; response still needs confirmation.`;
      const hasEvidenceForTest = milestone.evidence.some(
        (item) =>
          item.date === isoDate &&
          item.type === "skill_test" &&
          item.summary.includes(updatedTest.title),
      );
      const shouldAppendEvidence = status !== existing.status || !hasEvidenceForTest;
      const nextEvidence: MilestoneEvidence[] = shouldAppendEvidence
        ? [
            ...milestone.evidence,
            {
              date: isoDate,
              type: "skill_test",
              summary: evidenceSummary,
              confidence: status === "passed_pending_confirmation" ? "medium" : "low",
            },
          ]
        : milestone.evidence;
      return {
        ...milestone,
        state: nextState,
        status: nextState,
        evidenceSummary,
        evidence: nextEvidence,
      };
    });
    return {
      ...prev,
      skillTests,
      dailyCoachPlans,
      milestones,
    };
  });
}

export interface MilestoneWatchItem {
  id: string;
  title: string;
  state: MilestoneState;
  statusLabel: string;
  evidence: string[];
  unlockCriteria: string[];
  nextStepIfConfirmed: string;
  nextStepIfNotConfirmed: string;
  progressionType: ProgressionType;
  skillTest?: SkillTest;
}

function milestoneStatusLabel(state: MilestoneState): string {
  if (state === "test_passed_pending_confirmation") return "Test passed - pending confirmation";
  if (state === "observation_passed") return "Observation passed";
  if (state === "unlocked_progressing") return "Unlocked - progressing";
  if (state === "testable") return "Testable";
  if (state === "paused") return "Paused";
  if (state === "unlocked") return "Unlocked";
  return "Locked";
}

export function milestoneWatchForDate(
  s: PhoenixState,
  isoDate = getLocalDateKey(),
): MilestoneWatchItem[] {
  const activePlan = activeDailyCoachPlanForDate(s, isoDate);
  const tests = skillTestsForDate(s, isoDate);
  const planUnlocks = new Map(
    (activePlan?.nextUnlocks ?? []).map((unlock) => [unlock.milestoneId, unlock]),
  );
  return s.milestones
    .filter(
      (milestone) => milestone.state !== "unlocked" && milestone.state !== "unlocked_progressing",
    )
    .sort((a, b) => {
      const order: Record<MilestoneState, number> = {
        testable: 0,
        test_passed_pending_confirmation: 1,
        observation_passed: 2,
        paused: 3,
        locked: 4,
        unlocked_progressing: 5,
        unlocked: 6,
      };
      return order[a.state] - order[b.state];
    })
    .slice(0, 3)
    .map((milestone) => {
      const planUnlock = planUnlocks.get(milestone.id);
      return {
        id: milestone.id,
        title: planUnlock?.title ?? milestone.title ?? milestone.name,
        state: planUnlock?.state ?? milestone.state,
        statusLabel: milestoneStatusLabel(planUnlock?.state ?? milestone.state),
        evidence: milestone.evidence.slice(-3).map((item) => item.summary),
        unlockCriteria: planUnlock?.evidenceNeeded.length
          ? planUnlock.evidenceNeeded
          : milestone.unlockCriteria,
        nextStepIfConfirmed: planUnlock?.nextStepIfConfirmed ?? milestone.nextStepIfConfirmed,
        nextStepIfNotConfirmed:
          planUnlock?.nextStepIfNotConfirmed ?? milestone.nextStepIfNotConfirmed,
        progressionType: milestone.progressionType,
        skillTest: tests.find((test) => test.relatedMilestoneId === milestone.id),
      };
    });
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
    const savedEntry = {
      ...entry,
      date: localDate,
      localDate,
      timestampUtc,
      phaseId,
    };
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
    const taskCompletions = normalizeTaskCompletionRecord(entry.taskCompletions) ?? {};
    const skillTestResults = normalizeSkillTestResultRecord(entry.skillTestResults) ?? {};
    const savedEntry = {
      ...entry,
      date: localDate,
      localDate,
      timestampUtc,
      taskCompletions,
      skillTestResults,
      phaseId,
    };
    const prescribedTaskCompletions = {
      ...(prev.prescribedTaskCompletions ?? {}),
      [localDate]: {
        ...(prev.prescribedTaskCompletions?.[localDate] ?? {}),
        ...taskCompletions,
      },
    };
    const skillTests = (prev.skillTests ?? []).map((test) => {
      const result = skillTestResults[test.id];
      return result && dailyRecordDate(test) === localDate
        ? { ...test, result, status: skillTestStatusFromResult(result) }
        : test;
    });
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
      prescribedTaskCompletions,
      skillTests,
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
  state: "ready" | "modify" | "modify_positive" | "recover";
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
  const currentGaitQualityScore = gaitQualityScore(current.gaitQuality);
  const movementQualityLow =
    (current.movementQuality != null && current.movementQuality <= 2) ||
    (currentGaitQualityScore != null && currentGaitQualityScore <= 2) ||
    (previousEveningEntry?.gaitQualityAfter != null &&
      previousEveningEntry.gaitQualityAfter <= 2) ||
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

function hasPositiveSkillControlSignal(
  current: MorningCheckIn,
  swellingTrend: SwellingTrend,
  previousEveningEntry: EveningCheckIn | null,
): boolean {
  const currentGaitQualityScore = gaitQualityScore(current.gaitQuality);
  const gaitQuality =
    currentGaitQualityScore ??
    previousEveningEntry?.gaitQualityAfter ??
    previousEveningEntry?.movementQualityAfter;
  return (
    current.pain <= 3 &&
    current.walkingConfidence >= 3 &&
    (gaitQuality == null || gaitQuality >= 3) &&
    swellingTrend !== "worse" &&
    current.extensionStatus === "reaches_neutral" &&
    (previousEveningEntry?.quadActivationQuality ?? 3) >= 3 &&
    !hasConcerningNotes(current.notes)
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

  if (
    hasPositiveSkillControlSignal(m, swellingTrend, previousEveningEntry) &&
    (earlyPostOp || m.pain > 2 || swellingLevel >= 2)
  ) {
    return {
      state: "modify_positive",
      label: "Modify+",
      dot: "🟡",
      summary:
        "Stay conservative, but positive control signals may support a small skill/control test or confirmation. Do not progress load.",
    };
  }

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
  const mission = derivedMissions(s).find((item) => item.id === missionId);
  const criteria = mission ? missionCriteriaForMission(s, mission) : [];
  const summary = missionCriteriaProgress(criteria);
  return {
    done: summary.achieved,
    total: summary.total,
    pct: summary.progress,
    pending: summary.pending,
    remainingText: summary.remainingText,
  };
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
