import type { PhoenixState } from "./phoenix-data";
import {
  currentMission,
  getEveningForDate,
  getMorningForDate,
  levelFromXp,
  previousMorning,
  readinessFor,
  todayIso,
} from "./phoenix-data";

export type PacketKind = "morning" | "evening";

export function buildPacketJson(kind: PacketKind, s: PhoenixState, isoDate = todayIso()) {
  const mission = currentMission(s);
  const { level } = levelFromXp(s.recoveryIqXp);
  const morning = getMorningForDate(s, isoDate);
  const evening = getEveningForDate(s, isoDate);
  const previous = previousMorning(s, isoDate);
  const readiness = readinessFor(morning);
  const lastJournal = s.journal[0];
  return {
    kind,
    date: isoDate,
    generatedAt: new Date().toISOString(),
    athlete: s.athleteName,
    mission: {
      id: mission.id,
      name: mission.name,
      phase: mission.phase,
      progress: mission.progress,
    },
    recoveryIq: { level, xp: s.recoveryIqXp },
    readiness: {
      status: readiness.state,
      label: readiness.label,
      summary: readiness.summary,
    },
    morning,
    previousMorning: previous,
    evening: kind === "evening" ? evening : undefined,
    milestones: s.milestones.map((m) => ({
      name: m.name,
      status: m.status,
      unlockedAt: m.unlockedAt ?? null,
    })),
    completedToday: s.todayQuests.filter((q) => q.done).map((q) => q.label),
    pendingToday: s.todayQuests.filter((q) => !q.done).map((q) => q.label),
    coachJournalRecent: s.journal.slice(0, 3),
    questionsForCoach: [
      "Is yesterday's response good enough to add load today?",
      "Should we prioritize extension or activation this week?",
    ],
    currentConcerns: morning?.notes ?? "",
    lastCoachFocus: lastJournal?.nextFocus ?? null,
  };
}

export function buildPacketMarkdown(
  kind: PacketKind,
  s: PhoenixState,
  isoDate = todayIso(),
): string {
  const mission = currentMission(s);
  const { level } = levelFromXp(s.recoveryIqXp);
  const m = getMorningForDate(s, isoDate);
  const e = getEveningForDate(s, isoDate);
  const previous = previousMorning(s, isoDate);
  const readiness = readinessFor(m);

  const lines: string[] = [];
  lines.push(`# Phoenix OS — ${kind === "morning" ? "Morning" : "Evening"} Coach Packet`);
  lines.push(`**Date:** ${isoDate}  `);
  lines.push(`**Athlete:** ${s.athleteName}  `);
  lines.push(`**Mission:** ${mission.name} — ${mission.phase} (${mission.progress}%)  `);
  lines.push(`**Recovery IQ:** Level ${level} · ${s.recoveryIqXp} XP  `);
  lines.push(`**Readiness:** ${readiness.label} — ${readiness.summary}`);
  lines.push("");

  if (m) {
    lines.push(`## Morning Check-In`);
    lines.push(`- Pain: ${m.pain}/10`);
    lines.push(`- Swelling: ${m.swelling}/10`);
    lines.push(`- Walking Confidence: ${m.walkingConfidence}/5`);
    lines.push(`- Quad Activation: ${m.quadActivation}/5`);
    lines.push(`- Extension: ${m.extension}° from neutral`);
    lines.push(`- Flexion: ${m.flexion}°`);
    lines.push(`- Sleep: ${m.sleepHours}h`);
    lines.push(`- Weight: ${m.weightKg}kg · Protein target: ${m.proteinTargetG}g`);
    lines.push(`- Confidence in knee: ${m.confidence}/5`);
    lines.push(`- Notes: ${m.notes || "—"}`);
    lines.push("");
  }

  if (previous) {
    lines.push(`## Previous Morning`);
    lines.push(`- Date: ${previous.date}`);
    lines.push(`- Pain: ${previous.pain}/10 · Swelling: ${previous.swelling}/10`);
    lines.push(`- Walking Confidence: ${previous.walkingConfidence}/5`);
    lines.push(`- Quad Activation: ${previous.quadActivation}/5`);
    lines.push(`- Extension: ${previous.extension}° from neutral · Flexion: ${previous.flexion}°`);
    lines.push("");
  }

  if (kind === "evening" && e) {
    lines.push(`## Evening Check-In`);
    lines.push(`- Exercises completed: ${e.exercisesCompleted || "—"}`);
    lines.push(`- Pain during: ${e.painDuring}/10 · Pain after: ${e.painAfter}/10`);
    lines.push(`- Swelling change: ${e.swellingChange > 0 ? "+" : ""}${e.swellingChange}`);
    lines.push(`- Walking confidence: ${e.walkingConfidence}/5`);
    lines.push(`- Milestones touched: ${e.milestones || "—"}`);
    lines.push(`- Notes: ${e.notes || "—"}`);
    lines.push("");
  }

  lines.push(`## Today's Work`);
  lines.push(`**Completed**`);
  s.todayQuests.filter((q) => q.done).forEach((q) => lines.push(`- ✅ ${q.label}`));
  lines.push(`**Pending**`);
  s.todayQuests.filter((q) => !q.done).forEach((q) => lines.push(`- ⬜ ${q.label}`));
  lines.push("");

  lines.push(`## Milestones`);
  s.milestones.forEach((mi) =>
    lines.push(
      `- [${mi.status === "unlocked" ? "x" : " "}] **${mi.name}** — ${mi.status}${mi.unlockedAt ? ` (${mi.unlockedAt})` : ""}`,
    ),
  );
  lines.push("");

  lines.push(`## Recent Coach Journal`);
  s.journal.slice(0, 3).forEach((j) => {
    lines.push(`**${j.date}** — +${j.xpAwarded} XP`);
    lines.push(`- Observation: ${j.observation}`);
    lines.push(`- Interpretation: ${j.interpretation}`);
    lines.push(`- Decision: ${j.decision}`);
    lines.push(`- Next focus: ${j.nextFocus}`);
    lines.push("");
  });

  lines.push(`## Questions for Coach`);
  lines.push(`- Is yesterday's response good enough to add load today?`);
  lines.push(`- Should we prioritize extension or activation this week?`);
  lines.push("");
  lines.push(`## Current Concerns`);
  lines.push(m?.notes || "None reported.");

  return lines.join("\n");
}
