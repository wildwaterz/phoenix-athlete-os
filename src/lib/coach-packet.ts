import type { PhoenixState } from "./phoenix-data";
import { currentMission, levelFromXp, recoveryStatus } from "./phoenix-data";

export type PacketKind = "morning" | "evening";

export function buildPacketJson(kind: PacketKind, s: PhoenixState) {
  const mission = currentMission(s);
  const { level } = levelFromXp(s.recoveryIqXp);
  const status = recoveryStatus(s);
  const lastJournal = s.journal[0];
  return {
    kind,
    generatedAt: new Date().toISOString(),
    athlete: s.athleteName,
    mission: {
      id: mission.id,
      name: mission.name,
      phase: mission.phase,
      progress: mission.progress,
    },
    recoveryIq: { level, xp: s.recoveryIqXp },
    recoveryStatus: status.label,
    morning: s.morning,
    evening: kind === "evening" ? s.evening : undefined,
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
    currentConcerns: s.morning?.notes ?? "",
    lastCoachFocus: lastJournal?.nextFocus ?? null,
  };
}

export function buildPacketMarkdown(kind: PacketKind, s: PhoenixState): string {
  const mission = currentMission(s);
  const { level } = levelFromXp(s.recoveryIqXp);
  const status = recoveryStatus(s);
  const m = s.morning;
  const e = s.evening;
  const date = new Date().toISOString().slice(0, 10);

  const lines: string[] = [];
  lines.push(`# Phoenix OS — ${kind === "morning" ? "Morning" : "Evening"} Coach Packet`);
  lines.push(`**Date:** ${date}  `);
  lines.push(`**Athlete:** ${s.athleteName}  `);
  lines.push(`**Mission:** ${mission.name} — ${mission.phase} (${mission.progress}%)  `);
  lines.push(`**Recovery IQ:** Level ${level} · ${s.recoveryIqXp} XP  `);
  lines.push(`**Recovery Status:** ${status.label}`);
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