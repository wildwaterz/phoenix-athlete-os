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
  | "quad-activation"
  | "extension-status"
  | "flexion"
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
  | "quad-activation"
  | "extension"
  | "extension-status"
  | "flexion"
  | "movement-quality"
  | "training-readiness"
  | "sport-confidence"
  | "sleep-hours"
  | "protein-target"
  | "exercises-completed"
  | "pain-during"
  | "pain-after"
  | "swelling-change"
  | "energy-fatigue"
  | "milestones"
  | "notes";

export type SwellingContext = "surgical_baseline" | "activity_response" | "unknown";
export type SwellingTrend = "improved" | "stable" | "worse" | "unknown";

export type ExtensionStatus =
  | "neutral"
  | "slightly_limited"
  | "moderately_limited"
  | "significantly_limited"
  | "not_tested";

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
  readinessRuleIds: string[];
  smallWinRuleIds: string[];
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
  phaseId?: PhaseId;
  pain: number;
  swelling: number;
  swellingLevel?: number;
  swellingTrend?: SwellingTrend;
  swellingContext?: SwellingContext;
  walkingConfidence: number;
  quadActivation: number;
  extension: number;
  extensionStatus?: ExtensionStatus;
  extensionEstimateDegrees?: 0 | 5 | 10 | 15;
  flexion: number;
  flexionComfort?: "comfortable_range_only" | "end_range_sensitive" | "not_tested";
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
  phaseId?: PhaseId;
  exercisesCompleted: string;
  painDuring: number;
  painDuringActivity?: number;
  painAfter: number;
  painAfterActivity?: number;
  swellingChange: number; // -3..+3
  walkingConfidence: number;
  walkingConfidenceAfter?: number;
  movementQualityAfter?: number;
  energyFatigue?: number;
  milestones: string;
  todayWin?: string;
  notes: string;
}

export interface CheckIn {
  id: string;
  date: string;
  phaseId: PhaseId;
  morning?: MorningCheckIn;
  evening?: EveningCheckIn;
}

export interface JournalEntry {
  id: string;
  date: string;
  observation: string;
  interpretation: string;
  decision: string;
  xpAwarded: number;
  nextFocus: string;
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
  label: string;
  title?: string;
  done: boolean;
  status?: QuestStatus;
  xp: number;
  kind: QuestKind;
  category?: QuestKind;
  source: QuestSource;
  reason: string;
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

export type CoachNoteSource =
  | "physio"
  | "surgeon"
  | "chatgpt"
  | "trainer"
  | "coach"
  | "manual"
  | "other";

export interface CoachNote {
  id: string;
  date: string;
  source: CoachNoteSource;
  author?: string;
  body: string;
  relatedPhaseId?: PhaseId;
  relatedMissionIds?: MissionId[];
  relatedTrackIds?: RecoveryTrackId[];
  tags?: string[];
  createdAt: string;
}

export interface AthleteNote {
  id: string;
  date: string;
  body: string;
  relatedPhaseId?: PhaseId;
  relatedMissionIds?: MissionId[];
  relatedTrackIds?: RecoveryTrackId[];
  tags?: string[];
  createdAt: string;
}

export type RecoveryIqEventSource =
  | "check-in"
  | "quest"
  | "milestone"
  | "consistency"
  | "smart-decision"
  | "coach-note";

export interface RecoveryIqEvent {
  id: string;
  date: string;
  source: RecoveryIqEventSource;
  xp: number;
  summary: string;
  reason?: string;
  relatedQuestId?: string;
  relatedMilestoneId?: string;
  relatedNoteId?: string;
  createdAt: string;
}

export type SmallWinSource = "rule" | "manual" | "daily-coach-plan";

export interface SmallWin {
  id: string;
  date: string;
  title: string;
  description: string;
  source: SmallWinSource;
  relatedMetric?: MetricId;
  xp?: number;
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
  }[];
  completedToday: string[];
  pendingToday: string[];
  coachNotesRecent: CoachNote[];
  athleteNotesRecent: AthleteNote[];
  coachJournalRecent: JournalEntry[];
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
  recoveryIqXp: number; // total xp
  morning: MorningCheckIn | null;
  evening: EveningCheckIn | null;
  checkIns: CheckIn[];
  history: { morning: MorningCheckIn[]; evening: EveningCheckIn[] };
  milestones: Milestone[];
  journal: JournalEntry[];
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
export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
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

export const PHASE_CONFIGS: Phase[] = [
  {
    id: "acute-response",
    name: "Phase 1 · Acute Response",
    order: 1,
    dashboardQuestion: "Is the knee settling down?",
    activeTrackIds: ["symptoms", "walking-movement", "activation"],
    primaryMetrics: [
      "pain",
      "swelling-level",
      "walking-confidence",
      "quad-activation",
      "extension-status",
    ],
    supportingMetrics: ["sleep-hours", "swelling-trend"],
    morningCheckInFields: [
      "pain",
      "swelling",
      "swelling-context",
      "swelling-trend",
      "walking-confidence",
      "quad-activation",
      "extension",
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
      "notes",
    ],
    questTemplateIds: [
      "ankle-pumps",
      "assisted-walking",
      "gentle-quad-check",
      "swelling-control",
      "evening-check-in",
    ],
    readinessRuleIds: ["early-post-op-modify", "activity-response-recover"],
    smallWinRuleIds: ["pain-decreased", "swelling-stable", "check-in-logged"],
  },
  {
    id: "activation-early-rom",
    name: "Phase 2 · Activation + Early ROM",
    order: 2,
    dashboardQuestion: "Can I control and move the knee?",
    activeTrackIds: ["symptoms", "rom", "activation", "walking-movement"],
    primaryMetrics: [
      "quad-activation",
      "extension-status",
      "flexion",
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
      "quad-activation",
      "extension",
      "extension-status",
      "flexion",
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
      "milestones",
      "notes",
    ],
    questTemplateIds: [
      "morning-check-in",
      "quad-activation",
      "gentle-extension-exposure",
      "gentle-heel-slides",
      "supported-walking",
      "evening-check-in",
    ],
    readinessRuleIds: ["phase-2-modify", "rom-response-check", "previous-evening-reactive"],
    smallWinRuleIds: [
      "quad-activation-improved",
      "extension-closer-to-neutral",
      "flexion-improved",
      "main-quests-completed",
    ],
  },
  {
    id: "movement-capacity",
    name: "Phase 3 · Movement Capacity",
    order: 3,
    dashboardQuestion: "Can I move normally and tolerate basic loading?",
    activeTrackIds: ["symptoms", "rom", "walking-movement", "capacity"],
    primaryMetrics: ["movement-quality", "pain", "swelling-trend", "session-tolerance", "flexion"],
    supportingMetrics: ["quad-activation", "next-morning-response"],
    morningCheckInFields: [
      "pain",
      "swelling",
      "movement-quality",
      "extension",
      "flexion",
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
    readinessRuleIds: ["movement-quality-gate"],
    smallWinRuleIds: ["movement-quality-improved", "stable-next-morning-response"],
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
    readinessRuleIds: ["training-readiness-gate"],
    smallWinRuleIds: ["session-tolerated", "smart-deload"],
  },
  {
    id: "return-preparation",
    name: "Phase 5 · Return Preparation",
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
    readinessRuleIds: ["sport-repeatability-gate"],
    smallWinRuleIds: ["sport-confidence-improved", "repeatability-proven"],
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
    phase: "Phase 3 · Movement Capacity",
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
    phase: "Phase 5 · Return",
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

const seedJournal: JournalEntry[] = [
  {
    id: "j-1",
    date: "2025-06-20",
    observation: "Morning swelling 1/10, quad activation 4/5 for 4th day.",
    interpretation: "Activation pattern is consolidating. Tissue is tolerating yesterday's volume.",
    decision: "Hold volume. Add terminal knee extension holds at end of session.",
    xpAwarded: 40,
    nextFocus: "Earn straight leg raise without lag.",
  },
  {
    id: "j-2",
    date: "2025-06-22",
    observation: "Asked whether to push range despite end-range pinch.",
    interpretation: "Evidence-based question. Pinch ≠ progress.",
    decision: "Back off 5°. Re-test in 48h. Log next-morning swelling.",
    xpAwarded: 25,
    nextFocus: "Evidence over ego — keep this habit.",
  },
];

// Seed prior morning check-ins so trends and historical viewing work.
function isoDaysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

export function createDefaultMorningCheckIn(date: string): MorningCheckIn {
  return {
    date,
    phaseId: "activation-early-rom",
    pain: 2,
    swelling: 1,
    swellingLevel: 1,
    swellingTrend: "stable",
    swellingContext: "surgical_baseline",
    walkingConfidence: 3,
    quadActivation: 3,
    extension: 5,
    extensionStatus: "slightly_limited",
    extensionEstimateDegrees: 5,
    flexion: 110,
    flexionComfort: "comfortable_range_only",
    sleepHours: 7,
    weightKg: 85,
    proteinTargetG: 160,
    confidence: 3,
    notes: "",
  };
}

export function createDefaultEveningCheckIn(date: string): EveningCheckIn {
  return {
    date,
    phaseId: "activation-early-rom",
    exercisesCompleted: "",
    painDuring: 2,
    painDuringActivity: 2,
    painAfter: 2,
    painAfterActivity: 2,
    swellingChange: 0,
    walkingConfidence: 3,
    walkingConfidenceAfter: 3,
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
    quadActivation: 2,
    extension: 7,
    extensionStatus: "moderately_limited",
    extensionEstimateDegrees: 10,
    flexion: 105,
    flexionComfort: "comfortable_range_only",
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
    quadActivation: 3,
    extension: 5,
    extensionStatus: "slightly_limited",
    extensionEstimateDegrees: 5,
    flexion: 112,
    flexionComfort: "comfortable_range_only",
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
    quadActivation: 3,
    extension: 5,
    extensionStatus: "slightly_limited",
    extensionEstimateDegrees: 5,
    flexion: 115,
    flexionComfort: "comfortable_range_only",
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
    phaseId: morning?.phaseId ?? evening?.phaseId ?? "activation-early-rom",
    morning,
    evening,
  };
}

const seedCoachNotes: CoachNote[] = [];

const seedAthleteNotes: AthleteNote[] = [
  {
    id: "athlete-note-1",
    date: todayIso(),
    body: "Felt stiff for the first few minutes, then settled. Want to know whether ROM or quad work should be the priority today.",
    relatedPhaseId: "activation-early-rom",
    relatedMissionIds: ["wake-the-quad", "restore-extension"],
    relatedTrackIds: ["activation", "rom"],
    tags: ["morning-context"],
    createdAt: `${todayIso()}T07:45:00.000Z`,
  },
];

const seedRecoveryIqEvents: RecoveryIqEvent[] = [
  {
    id: "iq-morning-check-in",
    date: todayIso(),
    source: "check-in",
    xp: 10,
    summary: "Completed morning check-in",
    reason: "Daily evidence was logged before choosing the workload.",
    createdAt: `${todayIso()}T07:40:00.000Z`,
  },
  {
    id: "iq-smart-modify",
    date: todayIso(),
    source: "smart-decision",
    xp: 20,
    summary: "Chose Modify over volume chasing",
    reason: "Stiffness and early swelling context support controlled work rather than progression.",
    relatedNoteId: "coach-note-1",
    createdAt: `${todayIso()}T08:05:00.000Z`,
  },
];

const seedSmallWins: SmallWin[] = [
  {
    id: "small-win-today",
    date: todayIso(),
    title: "Pain remained in the green zone",
    description: "Pain stayed low while quad activation and ROM remain trainable.",
    source: "rule",
    relatedMetric: "pain",
    xp: 5,
  },
];

function createSeedDailyCoachPlan(date: string): DailyCoachPlan {
  const planId = `plan-${date}`;
  const questBase = {
    date,
    done: false,
    status: "pending" as QuestStatus,
    source: "daily-coach-plan" as QuestSource,
    planId,
    phaseId: "activation-early-rom" as PhaseId,
  };

  return {
    id: planId,
    date,
    source: "ChatGPT",
    authorName: "ChatGPT",
    importedFromNoteId: "coach-note-1",
    createdAt: `${date}T08:05:00.000Z`,
    importedAt: `${date}T08:05:00.000Z`,
    planType: "daily_coach_plan",
    phaseId: "activation-early-rom",
    missionIds: ["wake-the-quad", "restore-extension", "normalize-walking"],
    trackIds: ["symptoms", "rom", "activation", "walking-movement"],
    readiness: "modify",
    readinessReason:
      "Expected early post-op swelling context is present, but pain is low and walking confidence is acceptable. Keep work gentle and evidence-led.",
    primaryFocus: "Activation + early ROM without provoking tomorrow's knee response.",
    focus: "Activation + early ROM without provoking tomorrow's knee response.",
    priority: "Reinforce quad activation under low fatigue.",
    workload:
      "Hold yesterday's volume. Add gentle extension and flexion exposure only if tolerated.",
    rationale:
      "Activation is consolidating and swelling is stable; ROM can run in parallel at low intensity.",
    nextReassessment:
      "Tonight and tomorrow morning: pain after activity, swelling change, and walking confidence.",
    confidence: "Medium",
    targets: [
      {
        id: "target-quad",
        label: "Quad activation",
        value: "Quality sets, stop before fatigue compensation",
        trackId: "activation",
        reason: "Quad signal remains the main gate for later loading.",
      },
      {
        id: "target-rom",
        label: "ROM exposure",
        value: "Gentle extension plus comfortable heel slides",
        trackId: "rom",
        reason: "Phase 2 includes both activation and early ROM.",
      },
      {
        id: "target-response",
        label: "Response check",
        value: "Evening check-in plus next-morning swelling",
        trackId: "symptoms",
        reason: "Tomorrow's response decides whether this workload was appropriate.",
      },
    ],
    stopRules: [
      "Stop if pain rises above 4/10 during work.",
      "Stop if swelling noticeably increases or walking quality worsens.",
      "Avoid aggressive end-range ROM testing.",
    ],
    eveningCheckInFocus: [
      "Pain during and after activity",
      "Swelling change",
      "Walking confidence after work",
      "Any ROM symptom response",
    ],
    notes:
      "Imported plan seed shows the intended Daily Coach Plan shape. External coaching remains outside the app.",
    status: "active",
    quests: [
      {
        ...questBase,
        id: "morning-check-in",
        label: "Morning check-in",
        title: "Morning check-in",
        xp: 10,
        kind: "main",
        category: "main",
        reason: "Because today's plan needs a morning baseline",
        trackIds: ["symptoms"],
      },
      {
        ...questBase,
        id: "quad-activation",
        label: "Quad activation sets",
        title: "Quad activation sets",
        xp: 15,
        kind: "main",
        category: "main",
        reason: "Because the current focus includes Wake the Quad",
        missionId: "wake-the-quad",
        trackIds: ["activation"],
      },
      {
        ...questBase,
        id: "extension-exposure",
        label: "Gentle heel prop 3-5 min, only if tolerated",
        title: "Gentle heel prop 3-5 min, only if tolerated",
        xp: 15,
        kind: "main",
        category: "main",
        reason: "Because Phase 2 includes early extension work",
        missionId: "restore-extension",
        trackIds: ["rom"],
      },
      {
        ...questBase,
        id: "gentle-heel-slides",
        label: "Gentle heel slides 1-2 sets of 10, comfortable range only",
        title: "Gentle heel slides 1-2 sets of 10, comfortable range only",
        xp: 15,
        kind: "main",
        category: "main",
        reason: "Because ROM includes flexion as well as extension",
        missionId: "restore-extension",
        trackIds: ["rom"],
      },
      {
        ...questBase,
        id: "supported-walking",
        label: "Short walking practice with support as needed",
        title: "Short walking practice with support as needed",
        xp: 15,
        kind: "main",
        category: "main",
        reason: "Because walking quality matters more than dropping support quickly",
        missionId: "normalize-walking",
        trackIds: ["walking-movement"],
      },
      {
        ...questBase,
        id: "evening-check-in",
        label: "Evening check-in",
        title: "Evening check-in",
        xp: 10,
        kind: "main",
        category: "main",
        reason: "Because response data drives tomorrow's plan",
        trackIds: ["symptoms"],
      },
      {
        ...questBase,
        id: "protein-target",
        label: "Protein target",
        title: "Protein target",
        xp: 10,
        kind: "side",
        category: "side",
        reason: "Because nutrition supports recovery",
        trackIds: ["capacity"],
      },
      {
        ...questBase,
        id: "sleep-window",
        label: "Sleep window",
        title: "Sleep window",
        xp: 5,
        kind: "side",
        category: "side",
        reason: "Because sleep supports tomorrow's response",
        trackIds: ["symptoms"],
      },
    ],
    coachNoteIds: ["coach-note-1"],
  };
}

const seedTodayMorning: MorningCheckIn = {
  date: todayIso(),
  phaseId: "activation-early-rom",
  pain: 2,
  swelling: 1,
  swellingLevel: 1,
  swellingTrend: "stable",
  swellingContext: "surgical_baseline",
  walkingConfidence: 4,
  quadActivation: 4,
  extension: 3,
  extensionStatus: "slightly_limited",
  extensionEstimateDegrees: 5,
  flexion: 118,
  flexionComfort: "comfortable_range_only",
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
  recoveryIqXp: 1240,
  morning: seedTodayMorning,
  evening: null,
  checkIns: [createCheckIn(todayIso(), seedTodayMorning, undefined)],
  history: { morning: seedMorningHistory, evening: [] },
  milestones: seedMilestones,
  journal: seedJournal,
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
    priority: "Reinforce quad activation under low fatigue.",
    workload: "Hold yesterday's volume. Add 3× terminal knee extension holds.",
    reason: "Activation is consolidating (4/5 for 4 days). Swelling stable at 1/10.",
    nextReassessment: "48h — extension and morning swelling.",
    confidence: "Medium",
  },
};

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

  const checkIns =
    saved.checkIns?.length || saved.morning || saved.evening
      ? [
          ...(saved.checkIns ?? []),
          ...(saved.morning || saved.evening
            ? [
                createCheckIn(
                  saved.morning?.date ?? saved.evening?.date ?? todayIso(),
                  saved.morning,
                  saved.evening,
                ),
              ]
            : []),
        ]
      : initial.checkIns;

  const dailyCoachPlans = (saved.dailyCoachPlans ?? initial.dailyCoachPlans).map((plan) => {
    const raw = plan as DailyCoachPlan & {
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
    const source =
      raw.source?.toLowerCase() === "chatgpt"
        ? "ChatGPT"
        : raw.source === "physio" ||
            raw.source === "surgeon" ||
            raw.source === "trainer" ||
            raw.source === "self" ||
            raw.source === "other"
          ? raw.source
          : "self";
    const isSeedPlan =
      raw.importedFromNoteId === "coach-note-1" ||
      raw.notes?.includes("Imported plan seed shows the intended Daily Coach Plan shape");

    return {
      ...raw,
      source,
      importedAt: raw.importedAt ?? raw.createdAt ?? new Date().toISOString(),
      planType: "daily_coach_plan",
      readiness:
        readiness === "ready" || readiness === "recover" || readiness === "modify"
          ? readiness
          : "modify",
      readinessReason:
        raw.readinessReason ??
        (typeof raw.readiness === "object" && raw.readiness ? raw.readiness.reason : undefined),
      primaryFocus: raw.primaryFocus ?? raw.focus ?? raw.priority ?? "Daily coach plan",
      focus: raw.focus ?? raw.primaryFocus ?? raw.priority ?? "Daily coach plan",
      stopRules: raw.stopRules ?? [],
      eveningCheckInFocus: raw.eveningCheckInFocus ?? [],
      notes: raw.notes ?? "",
      status: isSeedPlan ? "archived" : (raw.status ?? "active"),
    };
  });

  return {
    ...initial,
    ...saved,
    campaign,
    phases: saved.phases?.length ? saved.phases : PHASE_CONFIGS,
    recoveryTracks: saved.recoveryTracks?.length ? saved.recoveryTracks : RECOVERY_TRACKS,
    missions,
    currentMissionId: activeMissionId,
    athleteName: campaign.athleteName,
    surgeryDate: campaign.surgeryDate,
    campaignName: campaign.name,
    checkIns,
    milestones,
    dailyCoachPlans,
    coachNotes: saved.coachNotes ?? initial.coachNotes,
    athleteNotes: saved.athleteNotes ?? initial.athleteNotes,
    recoveryIqEvents: saved.recoveryIqEvents ?? initial.recoveryIqEvents,
    smallWins: saved.smallWins ?? initial.smallWins,
    coachPackets: saved.coachPackets ?? initial.coachPackets,
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
  const level = Math.floor(xp / LEVEL_STEP) + 1;
  const intoLevel = xp % LEVEL_STEP;
  const pct = (intoLevel / LEVEL_STEP) * 100;
  return { level, intoLevel, pct, toNext: LEVEL_STEP - intoLevel };
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
  return (s.phases ?? PHASE_CONFIGS).find((phase) => phase.id === phaseId) ?? PHASE_CONFIGS[0];
}

export function activeRecoveryTracks(s: PhoenixState): RecoveryTrack[] {
  const phase = currentPhase(s);
  const activeTrackIds = new Set<RecoveryTrackId>([
    ...phase.activeTrackIds,
    ...activeMissions(s).flatMap((mission) => mission.trackIds),
  ]);
  return (s.recoveryTracks ?? RECOVERY_TRACKS).filter((track) => activeTrackIds.has(track.id));
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
  return allMorningCheckIns(s).find((m) => m.date === isoDate) ?? null;
}

export function getEveningForDate(s: PhoenixState, isoDate: string): EveningCheckIn | null {
  return allEveningCheckIns(s).find((e) => e.date === isoDate) ?? null;
}

export function getCheckInForDate(s: PhoenixState, isoDate: string): CheckIn {
  const saved = s.checkIns?.find((entry) => entry.date === isoDate);
  return {
    id: saved?.id ?? `check-in-${isoDate}`,
    date: isoDate,
    phaseId: saved?.phaseId ?? currentPhase(s).id,
    morning: saved?.morning ?? getMorningForDate(s, isoDate) ?? undefined,
    evening: saved?.evening ?? getEveningForDate(s, isoDate) ?? undefined,
  };
}

export function previousMorning(s: PhoenixState, isoDate: string): MorningCheckIn | null {
  const all = allMorningCheckIns(s)
    .filter((m) => m.date < isoDate)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  return all[0] ?? null;
}

export function previousEvening(s: PhoenixState, isoDate: string): EveningCheckIn | null {
  const all = allEveningCheckIns(s)
    .filter((e) => e.date < isoDate)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
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

function postOpDefaultQuests(day: 0 | 1): QuestDraft[] {
  const reason = `Because this is Day ${day} post-op`;

  if (day === 0) {
    return [
      quest("day-0-ankle-pumps", "Ankle pumps", "main", 10, "post-op-default", reason),
      quest(
        "day-0-assisted-walking",
        "Assisted walking practice",
        "main",
        15,
        "post-op-default",
        reason,
      ),
      quest(
        "day-0-quad-check",
        "Gentle quad activation check",
        "main",
        10,
        "post-op-default",
        reason,
      ),
      quest(
        "day-0-swelling-control",
        "Swelling control / comfortable elevation",
        "main",
        15,
        "post-op-default",
        reason,
      ),
      quest("evening-check-in", "Evening check-in", "main", 10, "post-op-default", reason),
      quest("protein-target", "Protein target", "side", 10, "post-op-default", reason),
      quest("hydration", "Hydration", "side", 5, "post-op-default", reason),
      quest("day-0-sleep-setup", "Sleep setup", "side", 5, "post-op-default", reason),
      quest(
        "avoid-aggressive-rom-testing",
        "Avoid aggressive ROM testing",
        "side",
        5,
        "post-op-default",
        reason,
      ),
    ];
  }

  return [
    quest("morning-check-in", "Morning check-in", "main", 10, "post-op-default", reason),
    quest("day-1-ankle-pumps", "Ankle pumps throughout day", "main", 10, "post-op-default", reason),
    quest(
      "day-1-walking-practice",
      "Short walking practice with crutch support as needed",
      "main",
      15,
      "post-op-default",
      reason,
    ),
    quest("day-1-quad-activation", "Quad activation sets", "main", 15, "post-op-default", reason),
    quest(
      "day-1-gentle-heel-prop",
      "Gentle heel prop 3–5 min, only if tolerated",
      "main",
      15,
      "post-op-default",
      reason,
    ),
    quest(
      "day-1-gentle-heel-slides",
      "Gentle heel slides 1–2 sets of 10, comfortable range only",
      "main",
      15,
      "post-op-default",
      reason,
    ),
    quest("evening-check-in", "Evening check-in", "main", 10, "post-op-default", reason),
    quest("protein-target", "Protein target", "side", 10, "post-op-default", reason),
    quest("hydration", "Hydration", "side", 5, "post-op-default", reason),
    quest(
      "day-1-ice-elevation",
      "Ice/elevation if swelling increases",
      "side",
      5,
      "post-op-default",
      reason,
    ),
    quest("sleep-window", "Sleep window", "side", 5, "post-op-default", reason),
  ];
}

function previousEveningWasReactive(e: EveningCheckIn | null): boolean {
  if (!e) return false;
  return e.painAfter >= 5 || e.swellingChange >= 2 || e.walkingConfidence <= 2;
}

function previousEveningWasStable(e: EveningCheckIn | null): boolean {
  if (!e) return false;
  return e.painAfter <= 3 && e.swellingChange <= 0 && e.walkingConfidence >= 3;
}

function extensionQuestLabel(morning: MorningCheckIn | null, previous: EveningCheckIn | null) {
  if (!morning) return "Extension exposure 3–5 min, only if tolerated";
  if (morning.pain > 3 || morning.swelling >= 3 || previousEveningWasReactive(previous)) {
    return "Gentle heel prop 3–5 min, only if tolerated";
  }
  return "Extension exposure 5–8 min, only if tolerated";
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

  if (morning.quadActivation < 4) {
    addQuest(
      quests,
      quest(
        "quad-activation",
        "Quad activation sets",
        "main",
        15,
        "morning-check-in",
        "Because quad activation is below 4/5",
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

  if (morning.extension > 2 && morning.pain < 5 && morning.swelling < 5) {
    addQuest(
      quests,
      quest(
        "extension-exposure",
        extensionQuestLabel(morning, previous),
        "main",
        20,
        "morning-check-in",
        `Because extension is ${morning.extension}° from neutral`,
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
  if (!previousEveningWasReactive(previous)) return;
  addQuest(
    quests,
    quest(
      "hold-volume",
      "Hold volume; keep work gentle",
      "main",
      15,
      "previous-evening",
      "Because yesterday's response was reactive",
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
      "Because yesterday's response was reactive",
    ),
  );
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

export function generateDailyQuestPlan(s: PhoenixState, isoDate = todayIso()): QuestDraft[] {
  const day = daysPostOp(s, isoDate);
  const morning = getMorningForDate(s, isoDate);
  const priorEvening = previousEvening(s, isoDate);
  const constraints = s.clinicianConstraints ?? [];

  if (day <= 1) {
    const quests = postOpDefaultQuests(day as 0 | 1);
    return applyClinicianConstraints(quests, constraints);
  }

  const quests: QuestDraft[] = [];
  addBaselineQuests(quests, isoDate, morning);
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

  if (isoDate !== todayIso()) return null;

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
    label: quest.label,
    title: quest.title ?? quest.label,
    done,
    status: done ? "complete" : quest.status === "skipped" ? "skipped" : "pending",
    category: quest.category ?? quest.kind,
  };
}

export function dailyCoachPlanForDate(s: PhoenixState, isoDate = todayIso()): DailyCoachPlan {
  const importedPlan = activeDailyCoachPlanForDate(s, isoDate);
  if (importedPlan) {
    return {
      ...importedPlan,
      quests: importedPlan.quests.map((quest) => normalizeQuestForDate(s, isoDate, quest)),
    };
  }

  const phase = currentPhase(s);
  const missions = activeMissions(s);
  const readiness = readinessForDate(s, isoDate);
  const rec = s.todayRecommendation;

  return {
    id: `generated-plan-${isoDate}`,
    date: isoDate,
    source: "self",
    createdAt: new Date().toISOString(),
    importedAt: new Date().toISOString(),
    planType: "daily_coach_plan",
    phaseId: phase.id,
    missionIds: missions.map((mission) => mission.id),
    trackIds: activeRecoveryTracks(s).map((track) => track.id),
    readiness: readiness.state,
    readinessReason: readiness.summary,
    primaryFocus: missions.map((mission) => mission.name).join(" + "),
    focus: missions.map((mission) => mission.name).join(" + "),
    priority: rec.priority,
    workload: rec.workload,
    rationale: rec.reason,
    nextReassessment: rec.nextReassessment,
    confidence: rec.confidence,
    targets: activeRecoveryTracks(s).map((track) => ({
      id: `target-${track.id}`,
      label: track.name,
      value: track.description,
      trackId: track.id,
    })),
    quests: generateDailyQuestPlan(s, isoDate).map((quest) =>
      normalizeQuestForDate(s, isoDate, quest),
    ),
    stopRules: ["Stop or modify if pain, swelling, or walking quality worsens."],
    eveningCheckInFocus: ["Pain after activity", "Swelling change", "Walking or movement quality"],
    notes: "Generated from local Project Phoenix rules when no imported coach plan is active.",
    status: "draft",
  };
}

export function activeDailyCoachPlanForDate(
  s: PhoenixState,
  isoDate = todayIso(),
): DailyCoachPlan | null {
  const plan =
    s.dailyCoachPlans
      ?.filter((item) => item.date === isoDate && item.status === "active")
      .sort((a, b) => (a.importedAt < b.importedAt ? 1 : -1))[0] ?? null;
  if (!plan) return null;
  return {
    ...plan,
    quests: plan.quests.map((quest) => normalizeQuestForDate(s, isoDate, quest)),
  };
}

export function dailyQuestsForDate(s: PhoenixState, isoDate = todayIso()): DailyQuest[] {
  return dailyCoachPlanForDate(s, isoDate).quests;
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

  return {
    id: stringValue(record.id) || `quest-${index + 1}-${slugify(label)}`,
    date,
    label,
    title: stringValue(record.title) || label,
    done,
    status: done ? "complete" : status === "skipped" ? "skipped" : "pending",
    xp,
    kind,
    category: kind,
    source: "daily-coach-plan",
    reason: stringValue(record.reason) || "Imported from Daily Coach Plan",
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
  fallbackDate = todayIso(),
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
  if (errors.length > 0) return { ok: false, errors };

  const planDate = date || fallbackDate;
  const id = stringValue(input.id) || `plan-${planDate}-${Date.now()}`;
  const quests = (questsInput as unknown[])
    .map((quest, index) => normalizeImportedQuest(quest, index, planDate, id))
    .filter((quest): quest is DailyQuest => Boolean(quest));
  const stopRules = stringArray(stopRulesInput);

  if (quests.length === 0) errors.push("quests array must contain at least one quest.");
  if (stopRules.length === 0) errors.push("stopRules array must contain at least one stop rule.");
  if (errors.length > 0) return { ok: false, errors };

  const createdAt = stringValue(input.createdAt) || new Date().toISOString();
  const importedAt = new Date().toISOString();
  const activePhase = PHASE_CONFIGS.some((phase) => phase.id === input.phaseId)
    ? (input.phaseId as PhaseId)
    : "activation-early-rom";

  return {
    ok: true,
    plan: {
      id,
      date: planDate,
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
    const previousQuests = dailyQuestsForDate(prev, plan.date);
    const previousCompleted = previousQuests.filter((quest) => quest.done);
    const nextQuestCompletions = {
      ...(prev.questCompletions ?? {}),
      [plan.date]: {
        ...(prev.questCompletions?.[plan.date] ?? {}),
      },
    };

    const quests = plan.quests.map((quest) => {
      const matchedCompleted = previousCompleted.find(
        (existing) => existing.id === quest.id || existing.label === quest.label,
      );
      const done = Boolean(matchedCompleted ?? quest.done);
      nextQuestCompletions[plan.date][quest.id] = done;
      return {
        ...quest,
        date: plan.date,
        done,
        status: done ? "complete" : quest.status === "skipped" ? "skipped" : "pending",
        source: "daily-coach-plan" as QuestSource,
        planId: plan.id,
      };
    });

    const activatedPlan: DailyCoachPlan = {
      ...plan,
      quests,
      importedAt: plan.importedAt || new Date().toISOString(),
      status: "active",
    };

    return {
      ...prev,
      dailyCoachPlans: [
        ...(prev.dailyCoachPlans ?? []).map((existing) =>
          existing.date === plan.date && existing.status === "active"
            ? { ...existing, status: "replaced" as DailyCoachPlanStatus }
            : existing,
        ),
        activatedPlan,
      ],
      questCompletions: nextQuestCompletions,
      todayQuests: plan.date === todayIso() ? quests : prev.todayQuests,
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

function upsertByDate<T extends { date: string }>(entries: T[], entry: T): T[] {
  const withoutDate = entries.filter((existing) => existing.date !== entry.date);
  return [...withoutDate, entry].sort((a, b) => (a.date < b.date ? -1 : 1));
}

function dedupeByDate<T extends { date: string }>(entries: T[]): T[] {
  const byDate = new Map<string, T>();
  entries.forEach((entry) => byDate.set(entry.date, entry));
  return [...byDate.values()].sort((a, b) => (a.date < b.date ? -1 : 1));
}

function upsertCheckIn(entries: CheckIn[], patch: CheckIn): CheckIn[] {
  const existing = entries.find((entry) => entry.date === patch.date);
  const next: CheckIn = {
    id: existing?.id ?? patch.id,
    date: patch.date,
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
  setState((prev) => ({
    ...prev,
    morning:
      entry.date === todayIso()
        ? { ...entry, phaseId: entry.phaseId ?? currentPhase(prev).id }
        : prev.morning,
    checkIns: upsertCheckIn(prev.checkIns ?? [], {
      id: `check-in-${entry.date}`,
      date: entry.date,
      phaseId: entry.phaseId ?? currentPhase(prev).id,
      morning: { ...entry, phaseId: entry.phaseId ?? currentPhase(prev).id },
    }),
    history: {
      ...prev.history,
      morning: upsertByDate(prev.history.morning, {
        ...entry,
        phaseId: entry.phaseId ?? currentPhase(prev).id,
      }),
    },
  }));
}

export function saveEveningCheckIn(entry: EveningCheckIn) {
  setState((prev) => ({
    ...prev,
    evening:
      entry.date === todayIso()
        ? { ...entry, phaseId: entry.phaseId ?? currentPhase(prev).id }
        : prev.evening,
    checkIns: upsertCheckIn(prev.checkIns ?? [], {
      id: `check-in-${entry.date}`,
      date: entry.date,
      phaseId: entry.phaseId ?? currentPhase(prev).id,
      evening: { ...entry, phaseId: entry.phaseId ?? currentPhase(prev).id },
    }),
    history: {
      ...prev.history,
      evening: upsertByDate(prev.history.evening, {
        ...entry,
        phaseId: entry.phaseId ?? currentPhase(prev).id,
      }),
    },
  }));
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

  return (
    painIncrease >= 2 ||
    current.pain >= 4 ||
    walkingConfidenceDrop >= 1 ||
    current.walkingConfidence <= 2 ||
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
    activityResponse ||
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

export function readinessForDate(s: PhoenixState, isoDate = todayIso()): Readiness {
  return readinessFor(getMorningForDate(s, isoDate), {
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
  if (!current) return { label: "Show up today", detail: "Log a check-in to start the streak." };
  if (previous) {
    if (current.walkingConfidence > previous.walkingConfidence)
      return {
        label: `Walking confidence improved by +${current.walkingConfidence - previous.walkingConfidence}`,
        detail: "Gait is trending the right direction.",
      };
    if (current.quadActivation > previous.quadActivation)
      return {
        label: `Quad activation improved by +${current.quadActivation - previous.quadActivation}`,
        detail: "Neuromuscular control is consolidating.",
      };
    if (current.pain < previous.pain)
      return {
        label: `Pain dropped by ${previous.pain - current.pain}`,
        detail: "Tissue is quieting down.",
      };
    if (current.swelling < previous.swelling)
      return {
        label: `Swelling dropped by ${previous.swelling - current.swelling}`,
        detail: "Inflammation gate is loosening.",
      };
  }
  if (current.pain <= 3 && current.swelling <= 2)
    return { label: "Pain remained in the green zone", detail: "Stable baseline held." };
  if (current.swelling <= 2)
    return { label: "Swelling stayed stable", detail: "Maintenance is a win." };
  return { label: "Check-in logged", detail: "Evidence over assumption — that's the work." };
}

export function smallWinForDate(s: PhoenixState, isoDate = todayIso()): SmallWin {
  const saved = s.smallWins.find((win) => win.date === isoDate);
  if (saved) return saved;

  const win = todaysWin(getMorningForDate(s, isoDate), previousMorning(s, isoDate));
  return {
    id: `small-win-${isoDate}`,
    date: isoDate,
    title: win.label,
    description: win.detail,
    source: "rule",
  };
}

export function coachNotesForDate(s: PhoenixState, isoDate = todayIso()): CoachNote[] {
  return s.coachNotes.filter((note) => note.date === isoDate);
}

export function latestCoachNoteForDateAndPhase(
  s: PhoenixState,
  isoDate = todayIso(),
): CoachNote | null {
  const phaseId = currentPhase(s).id;
  return (
    s.coachNotes
      .filter(
        (note) =>
          note.date === isoDate &&
          note.id !== "coach-note-1" &&
          (note.relatedPhaseId == null || note.relatedPhaseId === phaseId) &&
          !note.tags?.includes("seed") &&
          !note.tags?.includes("demo"),
      )
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))[0] ?? null
  );
}

export function athleteNotesForDate(s: PhoenixState, isoDate = todayIso()): AthleteNote[] {
  return s.athleteNotes.filter((note) => note.date === isoDate);
}

export function recoveryIqEventsForDate(s: PhoenixState, isoDate = todayIso()): RecoveryIqEvent[] {
  return s.recoveryIqEvents.filter((event) => event.date === isoDate);
}
