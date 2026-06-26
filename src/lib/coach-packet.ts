import type { CoachPacket, PhoenixState } from "./phoenix-data";
import {
  activeMissions,
  activeRecoveryTracks,
  athleteNotesForDate,
  coachNotesForDate,
  currentCampaign,
  currentMission,
  currentPhase,
  dailyCoachPlanForDate,
  dailyQuestsForDate,
  daysPostOp,
  getEveningForDate,
  getMorningForDate,
  levelFromXp,
  previousEvening,
  previousMorning,
  readinessFor,
  smallWinForDate,
  todayIso,
} from "./phoenix-data";

export type PacketKind = "morning" | "evening";

export function buildPacketJson(
  kind: PacketKind,
  s: PhoenixState,
  isoDate = todayIso(),
): CoachPacket {
  const campaign = currentCampaign(s);
  const phase = currentPhase(s);
  const mission = currentMission(s);
  const missions = activeMissions(s);
  const activeTracks = activeRecoveryTracks(s);
  const { level } = levelFromXp(s.recoveryIqXp);
  const morning = getMorningForDate(s, isoDate);
  const evening = getEveningForDate(s, isoDate);
  const previous = previousMorning(s, isoDate);
  const previousResponse = previousEvening(s, isoDate);
  const readiness = readinessFor(morning);
  const lastJournal = s.journal[0];
  const dailyQuests = dailyQuestsForDate(s, isoDate);
  const dailyCoachPlan = dailyCoachPlanForDate(s, isoDate);
  return {
    id: `packet-${kind}-${isoDate}`,
    kind,
    date: isoDate,
    generatedAt: new Date().toISOString(),
    athlete: s.athleteName,
    campaign: {
      id: campaign.id,
      name: campaign.name,
      recoveryDay: daysPostOp(s, isoDate),
    },
    phase: {
      id: phase.id,
      name: phase.name,
      dashboardQuestion: phase.dashboardQuestion,
    },
    activeTracks: activeTracks.map((track) => ({ id: track.id, name: track.name })),
    currentMissions: missions.map((item) => ({
      id: item.id,
      name: item.name,
      objective: item.objective,
    })),
    recoveryIq: { level, xp: s.recoveryIqXp },
    readiness: {
      status: readiness.state,
      label: readiness.label,
      summary: readiness.summary,
      reason: dailyCoachPlan.readiness.reason,
    },
    morning,
    previousMorning: previous,
    previousEvening: previousResponse,
    evening: kind === "evening" ? evening : undefined,
    dailyCoachPlan,
    smallWin: smallWinForDate(s, isoDate),
    milestones: s.milestones.map((m) => ({
      name: m.name,
      status: m.status,
      unlockedAt: m.unlockedAt ?? null,
    })),
    dailyQuests: dailyQuests.map((q) => ({
      date: q.date,
      label: q.label,
      done: q.done,
      kind: q.kind,
      source: q.source,
      reason: q.reason,
    })),
    completedToday: dailyQuests.filter((q) => q.done).map((q) => q.label),
    pendingToday: dailyQuests.filter((q) => !q.done).map((q) => q.label),
    coachNotesRecent: coachNotesForDate(s, isoDate).slice(0, 3),
    athleteNotesRecent: athleteNotesForDate(s, isoDate).slice(0, 3),
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
  const campaign = currentCampaign(s);
  const phase = currentPhase(s);
  const mission = currentMission(s);
  const missions = activeMissions(s);
  const tracks = activeRecoveryTracks(s);
  const { level } = levelFromXp(s.recoveryIqXp);
  const m = getMorningForDate(s, isoDate);
  const e = getEveningForDate(s, isoDate);
  const previous = previousMorning(s, isoDate);
  const previousResponse = previousEvening(s, isoDate);
  const readiness = readinessFor(m);
  const dailyCoachPlan = dailyCoachPlanForDate(s, isoDate);
  const smallWin = smallWinForDate(s, isoDate);
  const dailyQuests = dailyQuestsForDate(s, isoDate);

  const lines: string[] = [];
  lines.push(`# Phoenix OS — ${kind === "morning" ? "Morning" : "Evening"} Coach Packet`);
  lines.push(`**Date:** ${isoDate}  `);
  lines.push(`**Athlete:** ${s.athleteName}  `);
  lines.push(`**Campaign:** ${campaign.name} · Day ${daysPostOp(s, isoDate)}  `);
  lines.push(`**Phase:** ${phase.name}  `);
  lines.push(`**Active Tracks:** ${tracks.map((track) => track.name).join(", ")}  `);
  lines.push(`**Current Mission:** ${mission.name} — ${mission.phase} (${mission.progress}%)  `);
  lines.push(`**Active Missions:** ${missions.map((item) => item.name).join(", ")}  `);
  lines.push(`**Recovery IQ:** Level ${level} · ${s.recoveryIqXp} XP  `);
  lines.push(`**Readiness:** ${readiness.label} — ${dailyCoachPlan.readiness.reason}`);
  lines.push("");

  lines.push(`## Daily Coach Plan`);
  lines.push(`- Focus: ${dailyCoachPlan.focus}`);
  lines.push(`- Priority: ${dailyCoachPlan.priority}`);
  lines.push(`- Workload: ${dailyCoachPlan.workload}`);
  lines.push(`- Rationale: ${dailyCoachPlan.rationale}`);
  lines.push(`- Next reassessment: ${dailyCoachPlan.nextReassessment}`);
  lines.push(`- Confidence: ${dailyCoachPlan.confidence}`);
  lines.push("");

  if (m) {
    lines.push(`## Morning Check-In`);
    lines.push(`- Pain: ${m.pain}/10`);
    lines.push(`- Swelling: ${m.swelling}/10`);
    lines.push(`- Swelling context: ${m.swellingContext ?? "unknown"}`);
    lines.push(`- Swelling trend: ${m.swellingTrend ?? "unknown"}`);
    lines.push(`- Walking Confidence: ${m.walkingConfidence}/5`);
    lines.push(`- Quad Activation: ${m.quadActivation}/5`);
    lines.push(`- Extension: ${m.extension}° from neutral (${m.extensionStatus ?? "not_tested"})`);
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

  if (previousResponse) {
    lines.push(`## Previous Evening Response`);
    lines.push(`- Date: ${previousResponse.date}`);
    lines.push(`- Work completed: ${previousResponse.exercisesCompleted || "—"}`);
    lines.push(
      `- Pain during: ${previousResponse.painDuring}/10 · Pain after: ${previousResponse.painAfter}/10`,
    );
    lines.push(
      `- Swelling change: ${previousResponse.swellingChange > 0 ? "+" : ""}${previousResponse.swellingChange}`,
    );
    lines.push(`- Walking confidence: ${previousResponse.walkingConfidence}/5`);
    lines.push(`- Notes: ${previousResponse.notes || "—"}`);
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
  dailyQuests.filter((q) => q.done).forEach((q) => lines.push(`- ✅ ${q.label} (${q.reason})`));
  lines.push(`**Pending**`);
  dailyQuests.filter((q) => !q.done).forEach((q) => lines.push(`- ⬜ ${q.label} (${q.reason})`));
  lines.push("");

  lines.push(`## Small Win`);
  lines.push(`**${smallWin.title}**`);
  lines.push(smallWin.description);
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

  const coachNotes = coachNotesForDate(s, isoDate);
  if (coachNotes.length > 0) {
    lines.push(`## Coach Notes`);
    coachNotes.slice(0, 3).forEach((note) => {
      lines.push(`- ${note.source}${note.author ? ` · ${note.author}` : ""}: ${note.body}`);
    });
    lines.push("");
  }

  const athleteNotes = athleteNotesForDate(s, isoDate);
  if (athleteNotes.length > 0) {
    lines.push(`## Athlete Notes`);
    athleteNotes.slice(0, 3).forEach((note) => {
      lines.push(`- ${note.body}`);
    });
    lines.push("");
  }

  lines.push(`## Questions for Coach`);
  lines.push(`- Is yesterday's response good enough to add load today?`);
  lines.push(`- Should we prioritize extension or activation this week?`);
  lines.push("");
  lines.push(`## Current Concerns`);
  lines.push(m?.notes || "None reported.");

  return lines.join("\n");
}
