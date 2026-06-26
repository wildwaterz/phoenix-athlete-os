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

export type QuestKind = "main" | "side";

export type QuestSource =
  | "post-op-default"
  | "date"
  | "mission"
  | "morning-check-in"
  | "previous-evening"
  | "clinician-constraint"
  | "baseline";

export interface DailyQuest {
  id: string;
  date: string;
  label: string;
  done: boolean;
  xp: number;
  kind: QuestKind;
  source: QuestSource;
  reason: string;
}

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

export interface PhoenixState {
  currentMissionId: MissionId;
  recoveryIqXp: number; // total xp
  morning: MorningCheckIn | null;
  evening: EveningCheckIn | null;
  history: { morning: MorningCheckIn[]; evening: EveningCheckIn[] };
  milestones: Milestone[];
  journal: JournalEntry[];
  todayQuests: DailyQuest[];
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

// Seed prior morning check-ins so trends and historical viewing work.
function isoDaysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

export function createDefaultMorningCheckIn(date: string): MorningCheckIn {
  return {
    date,
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
}

export function createDefaultEveningCheckIn(date: string): EveningCheckIn {
  return {
    date,
    exercisesCompleted: "",
    painDuring: 2,
    painAfter: 2,
    swellingChange: 0,
    walkingConfidence: 3,
    milestones: "",
    notes: "",
  };
}

const seedMorningHistory: MorningCheckIn[] = [
  {
    date: isoDaysAgo(3),
    pain: 4,
    swelling: 3,
    walkingConfidence: 2,
    quadActivation: 2,
    extension: 7,
    flexion: 105,
    sleepHours: 6.5,
    weightKg: 86,
    proteinTargetG: 170,
    confidence: 3,
    notes: "",
  },
  {
    date: isoDaysAgo(2),
    pain: 3,
    swelling: 2,
    walkingConfidence: 3,
    quadActivation: 3,
    extension: 5,
    flexion: 112,
    sleepHours: 7,
    weightKg: 86,
    proteinTargetG: 170,
    confidence: 3,
    notes: "",
  },
  {
    date: isoDaysAgo(1),
    pain: 3,
    swelling: 2,
    walkingConfidence: 3,
    quadActivation: 3,
    extension: 5,
    flexion: 115,
    sleepHours: 7,
    weightKg: 86,
    proteinTargetG: 170,
    confidence: 3,
    notes: "Yesterday.",
  },
];

const initial: PhoenixState = {
  athleteName: "Kevin",
  surgeryDate: "2026-06-25",
  campaignName: "ACL Revision Prehab",
  currentMissionId: "wake-the-quad",
  recoveryIqXp: 1240,
  morning: {
    date: todayIso(),
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
  todayQuests: [],
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
  return e.painAfter >= 5 || e.swellingChange > 0 || e.walkingConfidence <= 2;
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
  addMissionQuests(quests, currentMission(s), morning, priorEvening);
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
  "evening-check-in": ["q5"],
  "protein-target": ["q4"],
  "sleep-window": ["q7"],
};

function storedCompletionForQuest(
  s: PhoenixState,
  isoDate: string,
  quest: QuestDraft,
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

function questDoneForDate(s: PhoenixState, isoDate: string, quest: QuestDraft): boolean {
  const stored = storedCompletionForQuest(s, isoDate, quest);
  if (stored !== null) return stored;
  if (quest.id === "morning-check-in") return Boolean(getMorningForDate(s, isoDate));
  if (quest.id === "evening-check-in") return Boolean(getEveningForDate(s, isoDate));
  return false;
}

export function dailyQuestsForDate(s: PhoenixState, isoDate = todayIso()): DailyQuest[] {
  return generateDailyQuestPlan(s, isoDate).map((quest) => ({
    ...quest,
    date: isoDate,
    done: questDoneForDate(s, isoDate, quest),
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

export function allMorningCheckIns(s: PhoenixState): MorningCheckIn[] {
  return dedupeByDate([...s.history.morning, ...(s.morning ? [s.morning] : [])]);
}

export function allEveningCheckIns(s: PhoenixState): EveningCheckIn[] {
  return dedupeByDate([...s.history.evening, ...(s.evening ? [s.evening] : [])]);
}

export function saveMorningCheckIn(entry: MorningCheckIn) {
  setState((prev) => ({
    ...prev,
    morning: entry.date === todayIso() ? entry : prev.morning,
    history: {
      ...prev.history,
      morning: upsertByDate(prev.history.morning, entry),
    },
  }));
}

export function saveEveningCheckIn(entry: EveningCheckIn) {
  setState((prev) => ({
    ...prev,
    evening: entry.date === todayIso() ? entry : prev.evening,
    history: {
      ...prev.history,
      evening: upsertByDate(prev.history.evening, entry),
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
  if (m.pain > 3 || m.swelling >= 3 || m.walkingConfidence <= 2)
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
  if (current.pain <= 3 && current.swelling <= 2)
    return { label: "Pain remained in the green zone", detail: "Stable baseline held." };
  if (current.swelling <= 2)
    return { label: "Swelling stayed stable", detail: "Maintenance is a win." };
  return { label: "Check-in logged", detail: "Evidence over assumption — that's the work." };
}
