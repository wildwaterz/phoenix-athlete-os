import { useSyncExternalStore } from "react";

// ============================================================
// Phoenix OS — types, seed data, and tiny localStorage store.
// All data is local for v1; structure mirrors a future API.
// ============================================================

export type MissionId =
  | "calm-the-knee"
  | "wake-the-quad"
  | "restore-extension"
  | "build-capacity"
  | "become-an-athlete-again";

export interface Mission {
  id: MissionId;
  name: string;
  tagline: string;
  objective: string;
  why: string;
  estDuration?: string;
  phase: string;
  progress: number; // 0-100
  criteria: string[];
  nextUnlock: string;
  status: "locked" | "active" | "complete";
}

export interface Milestone {
  id: string;
  mission: MissionId;
  name: string;
  description: string;
  why: string;
  evidence: string;
  status: "locked" | "in-progress" | "unlocked";
  unlockedAt?: string;
  coachNotes?: string;
}

export interface MorningCheckIn {
  date: string;
  pain: number;
  swelling: number;
  walkingConfidence: number;
  quadActivation: number;
  extension: number;
  flexion: number;
  sleepHours: number;
  weightKg: number;
  proteinTargetG: number;
  confidence: number;
  notes: string;
}

export interface EveningCheckIn {
  date: string;
  exercisesCompleted: string;
  painDuring: number;
  painAfter: number;
  swellingChange: number; // -3..+3
  walkingConfidence: number;
  milestones: string;
  notes: string;
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

export interface PhoenixState {
  currentMissionId: MissionId;
  recoveryIqXp: number; // total xp
  morning: MorningCheckIn | null;
  evening: EveningCheckIn | null;
  history: { morning: MorningCheckIn[]; evening: EveningCheckIn[] };
  milestones: Milestone[];
  journal: JournalEntry[];
  todayQuests: { id: string; label: string; done: boolean; xp: number; kind: "main" | "side" }[];
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
const today = () => new Date().toISOString().slice(0, 10);

export const MISSIONS: Mission[] = [
  {
    id: "calm-the-knee",
    name: "Calm the Knee",
    tagline: "Reduce inflammation. Reclaim baseline.",
    objective: "Bring swelling and pain to a stable, low daily baseline.",
    why: "Inflammation gates everything else — quad firing, range, sleep. Quiet the tissue first.",
    estDuration: "1–2 weeks",
    phase: "Phase 1 · Acute response",
    progress: 100,
    criteria: [
      "Pain ≤ 2/10 at rest for 5 consecutive days",
      "Swelling ≤ 2/10 morning baseline",
      "Sleep ≥ 7h average",
    ],
    nextUnlock: "Wake the Quad",
    status: "complete",
  },
  {
    id: "wake-the-quad",
    name: "Wake the Quad",
    tagline: "Restore neuromuscular control.",
    objective: "Re-establish voluntary quad activation and lock-out control.",
    why: "Without an active quad, the knee can't stabilize under load and extension won't return.",
    estDuration: "2–4 weeks",
    phase: "Phase 2 · Activation",
    progress: 64,
    criteria: [
      "Quad activation 4/5 on demand",
      "Straight leg raise with no lag",
      "Terminal knee extension to neutral",
    ],
    nextUnlock: "Restore Extension",
    status: "active",
  },
  {
    id: "restore-extension",
    name: "Restore Extension",
    tagline: "Reclaim full passive and active extension.",
    objective: "Symmetrical extension within 2° of contralateral side.",
    why: "Lost extension changes gait, loads the back and hip, and blocks return to sport.",
    estDuration: "3–6 weeks",
    phase: "Phase 3 · Range",
    progress: 22,
    criteria: ["0° passive extension", "Active extension without quad lag", "No end-range pain"],
    nextUnlock: "Build Capacity",
    status: "locked",
  },
  {
    id: "build-capacity",
    name: "Build Capacity",
    tagline: "Tissue tolerance. Volume. Confidence.",
    objective: "Tolerate progressive load across daily and training sessions.",
    why: "Capacity is the bridge from rehab to performance. Earn the right to train hard.",
    estDuration: "6–10 weeks",
    phase: "Phase 4 · Capacity",
    progress: 0,
    criteria: ["Single-leg press ≥ 1× BW", "30-min walk pain-free", "Stairs reciprocal"],
    nextUnlock: "Become an Athlete Again",
    status: "locked",
  },
  {
    id: "become-an-athlete-again",
    name: "Become an Athlete Again",
    tagline: "Sport-specific readiness.",
    objective: "Return-to-sport criteria met across strength, power, and confidence.",
    why: "Return-to-sport is a test you pass, not a date you hit.",
    estDuration: "Ongoing",
    phase: "Phase 5 · Return",
    progress: 0,
    criteria: ["LSI ≥ 90% across battery", "Hop tests symmetrical", "Confidence 5/5"],
    nextUnlock: "Long-term performance",
    status: "locked",
  },
];

const seedMilestones: Milestone[] = [
  {
    id: "m-pain-baseline",
    mission: "calm-the-knee",
    name: "Stable pain baseline",
    description: "Five consecutive days at pain ≤ 2/10.",
    why: "Proves the tissue has exited the acute reactive window.",
    evidence: "5 consecutive morning check-ins ≤ 2/10",
    status: "unlocked",
    unlockedAt: "2025-06-12",
    coachNotes: "Earned. Move to activation work without losing this floor.",
  },
  {
    id: "m-swelling-controlled",
    mission: "calm-the-knee",
    name: "Swelling under control",
    description: "Morning swelling ≤ 2/10 for 7 days.",
    why: "Swelling inhibits quad firing. Control it first.",
    evidence: "7 morning check-ins ≤ 2/10",
    status: "unlocked",
    unlockedAt: "2025-06-15",
  },
  {
    id: "m-quad-activation-4",
    mission: "wake-the-quad",
    name: "Quad activation 4/5",
    description: "Voluntary quad activation reported 4/5 across a week.",
    why: "Neuromuscular control is the gate to load tolerance.",
    evidence: "Self-rated activation ≥ 4 on 5 of 7 days",
    status: "in-progress",
  },
  {
    id: "m-slr-no-lag",
    mission: "wake-the-quad",
    name: "Straight leg raise — no lag",
    description: "Lift the leg with the knee fully locked.",
    why: "Lag indicates incomplete extension control.",
    evidence: "Video-confirmed SLR, knee locked",
    status: "in-progress",
  },
  {
    id: "m-extension-0",
    mission: "restore-extension",
    name: "Passive extension to 0°",
    description: "Heel-prop reaches contralateral extension.",
    why: "Lost extension changes gait and loads other joints.",
    evidence: "Goniometer or side-by-side video",
    status: "locked",
  },
  {
    id: "m-walk-30",
    mission: "build-capacity",
    name: "30-minute pain-free walk",
    description: "Continuous walk with pain ≤ 2/10 and no swelling spike next day.",
    why: "Capacity is proven by the next morning's response.",
    evidence: "Walk log + next-morning check-in",
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

const seedQuests = [
  { id: "q1", label: "Morning check-in", done: true, xp: 10, kind: "main" as const },
  { id: "q2", label: "Quad activation set ×3", done: true, xp: 15, kind: "main" as const },
  { id: "q3", label: "Heel-prop extension 10 min", done: false, xp: 20, kind: "main" as const },
  { id: "q5", label: "Evening check-in", done: false, xp: 10, kind: "main" as const },
  { id: "q4", label: "Protein target hit", done: false, xp: 10, kind: "side" as const },
  { id: "q6", label: "10-min mobility flow", done: false, xp: 5, kind: "side" as const },
  { id: "q7", label: "8h sleep window", done: false, xp: 5, kind: "side" as const },
];

// Seed prior morning check-ins so trends and historical viewing work.
function isoDaysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

const seedMorningHistory: MorningCheckIn[] = [
  { date: isoDaysAgo(3), pain: 4, swelling: 3, walkingConfidence: 2, quadActivation: 2, extension: 7, flexion: 105, sleepHours: 6.5, weightKg: 86, proteinTargetG: 170, confidence: 3, notes: "" },
  { date: isoDaysAgo(2), pain: 3, swelling: 2, walkingConfidence: 3, quadActivation: 3, extension: 5, flexion: 112, sleepHours: 7,   weightKg: 86, proteinTargetG: 170, confidence: 3, notes: "" },
  { date: isoDaysAgo(1), pain: 3, swelling: 2, walkingConfidence: 3, quadActivation: 3, extension: 5, flexion: 115, sleepHours: 7,   weightKg: 86, proteinTargetG: 170, confidence: 3, notes: "Yesterday." },
];

const initial: PhoenixState = {
  athleteName: "Kevin",
  surgeryDate: "2026-06-25",
  campaignName: "ACL Revision Prehab",
  currentMissionId: "wake-the-quad",
  recoveryIqXp: 1240,
  morning: {
    date: today(),
    pain: 2,
    swelling: 1,
    walkingConfidence: 4,
    quadActivation: 4,
    extension: 3,
    flexion: 118,
    sleepHours: 7.5,
    weightKg: 86,
    proteinTargetG: 170,
    confidence: 4,
    notes: "Felt stiff first 5 min, settled fast.",
  },
  evening: null,
  history: { morning: seedMorningHistory, evening: [] },
  milestones: seedMilestones,
  journal: seedJournal,
  todayQuests: seedQuests,
  todayRecommendation: {
    priority: "Reinforce quad activation under low fatigue.",
    workload: "Hold yesterday's volume. Add 3× terminal knee extension holds.",
    reason: "Activation is consolidating (4/5 for 4 days). Swelling stable at 1/10.",
    nextReassessment: "48h — extension and morning swelling.",
    confidence: "Medium",
  },
};

// ---------- store ----------
const KEY = "phoenix-os:v1";
let state: PhoenixState = load();
const listeners = new Set<() => void>();

function load(): PhoenixState {
  if (typeof window === "undefined") return initial;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return initial;
    return { ...initial, ...JSON.parse(raw) } as PhoenixState;
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

export function currentMission(s: PhoenixState): Mission {
  return MISSIONS.find((m) => m.id === s.currentMissionId) ?? MISSIONS[1];
}

export function recoveryStatus(s: PhoenixState): {
  label: string;
  tone: "good" | "watch" | "alert";
} {
  const m = s.morning;
  if (!m) return { label: "Awaiting check-in", tone: "watch" };
  if (m.pain >= 5 || m.swelling >= 5) return { label: "Reactive — back off", tone: "alert" };
  if (m.pain >= 3 || m.swelling >= 3) return { label: "Watch — hold volume", tone: "watch" };
  return { label: "Green — proceed as planned", tone: "good" };
}

// ---------- date / readiness / trend helpers ----------

export function daysPostOp(s: PhoenixState, isoDate: string): number {
  const a = new Date(s.surgeryDate + "T00:00:00");
  const b = new Date(isoDate + "T00:00:00");
  return Math.max(0, Math.round((b.getTime() - a.getTime()) / 86_400_000));
}

export function getMorningForDate(s: PhoenixState, isoDate: string): MorningCheckIn | null {
  if (s.morning?.date === isoDate) return s.morning;
  return s.history.morning.find((m) => m.date === isoDate) ?? null;
}

export function previousMorning(s: PhoenixState, isoDate: string): MorningCheckIn | null {
  const all = [...s.history.morning, ...(s.morning ? [s.morning] : [])]
    .filter((m) => m.date < isoDate)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  return all[0] ?? null;
}

export type Trend = "up" | "down" | "flat" | "none";

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

export function readinessFor(m: MorningCheckIn | null): Readiness {
  if (!m)
    return {
      state: "modify",
      label: "Awaiting check-in",
      dot: "🟡",
      summary: "Log a morning check-in to score today's readiness.",
    };
  if (m.pain >= 5 || m.swelling >= 5)
    return {
      state: "recover",
      label: "Recover",
      dot: "🔴",
      summary: "Reactive signal. Prioritize sleep, walking, and nutrition today.",
    };
  if (m.pain >= 3 || m.swelling >= 3 || m.walkingConfidence <= 2)
    return {
      state: "modify",
      label: "Modify",
      dot: "🟡",
      summary: "Hold volume. Substitute heavy work for activation and range.",
    };
  return {
    state: "ready",
    label: "Ready",
    dot: "🟢",
    summary: "Green light. Proceed with today's planned session.",
  };
}

export const PRINCIPLES: { title: string; body: string }[] = [
  { title: "Progression is earned, never assumed.", body: "The calendar does not promote you. Evidence does." },
  { title: "Recovery is training.", body: "What you do between sessions decides what the next session can be." },
  { title: "Adaptations matter more than exercises.", body: "The exercise is a stimulus. The adaptation is the point." },
  { title: "Competency matters more than timelines.", body: "Move when you've earned it — not when the protocol says so." },
  { title: "Evidence beats ego.", body: "What the data says wins over what you want to be true." },
  { title: "Tomorrow's response matters more than today's workout.", body: "If today breaks tomorrow, today wasn't a win." },
];

export function principleForDate(isoDate: string) {
  const seed = isoDate.split("-").reduce((a, p) => a + parseInt(p, 10), 0);
  return PRINCIPLES[seed % PRINCIPLES.length];
}

export const PHASE_PRINCIPLES: { title: string; body: string }[] = [
  { title: "Recovery is training.", body: "What you do between sessions decides what the next session can be." },
  { title: "Progression is earned, never assumed.", body: "The calendar does not promote you. Evidence does." },
  { title: "Load builds capacity.", body: "Tissue tolerates what you teach it to tolerate." },
  { title: "Consistency beats intensity.", body: "Stacked good days compound. Heroic ones don't." },
  { title: "Performance is earned.", body: "Return-to-sport is a test you pass, not a date you hit." },
];

export function principleForPhase(phaseN: number) {
  return PHASE_PRINCIPLES[Math.min(Math.max(phaseN, 1), 5) - 1];
}

export const PHASES = [
  { n: 1, name: "Acute response", missionId: "calm-the-knee" as MissionId },
  { n: 2, name: "Activation", missionId: "wake-the-quad" as MissionId },
  { n: 3, name: "Range", missionId: "restore-extension" as MissionId },
  { n: 4, name: "Capacity", missionId: "build-capacity" as MissionId },
  { n: 5, name: "Return", missionId: "become-an-athlete-again" as MissionId },
];

export function currentPhaseN(s: PhoenixState): number {
  return PHASES.find((p) => p.missionId === s.currentMissionId)?.n ?? 1;
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
  if (current.pain <= 2 && current.swelling <= 2)
    return { label: "Pain remained in the green zone", detail: "Stable baseline held." };
  if (current.swelling <= 2)
    return { label: "Swelling stayed stable", detail: "Maintenance is a win." };
  return { label: "Check-in logged", detail: "Evidence over assumption — that's the work." };
}