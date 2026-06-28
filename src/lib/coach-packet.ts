import type { CoachPacket, PhoenixState, PrescribedTask, SkillTest } from "./phoenix-data";
import {
  activeMissions,
  activeRecoveryTracksForPhase,
  athleteNotesForDate,
  coachNotesForDate,
  currentCampaign,
  currentMission,
  dailyCoachPlanForDate,
  dailyQuestsForDate,
  daysPostOp,
  getDetectedTimeZone,
  getEveningForDate,
  getLocalDateKey,
  getMorningForDate,
  getUtcTimestamp,
  milestoneWatchForDate,
  previousEvening,
  previousMorning,
  phaseForDate,
  readinessForDate,
  recoveryIqForState,
  recoveryIqXpForState,
  skillTestsForDate,
  smallWinForDate,
} from "./phoenix-data";

export type PacketKind = "morning" | "evening";

export function buildPacketJson(
  kind: PacketKind,
  s: PhoenixState,
  isoDate = getLocalDateKey(),
): CoachPacket {
  const timestampUtc = getUtcTimestamp();
  const campaign = currentCampaign(s);
  const phase = phaseForDate(s, isoDate);
  const mission = currentMission(s);
  const missions = activeMissions(s);
  const activeTracks = activeRecoveryTracksForPhase(s, phase);
  const { level } = recoveryIqForState(s);
  const recoveryIqXp = recoveryIqXpForState(s);
  const morning = getMorningForDate(s, isoDate);
  const evening = getEveningForDate(s, isoDate);
  const previous = previousMorning(s, isoDate);
  const previousResponse = previousEvening(s, isoDate);
  const readiness = readinessForDate(s, isoDate);
  const coachNotes = coachNotesForDate(s, isoDate);
  const latestCoachNote = coachNotes[0];
  const dailyQuests = dailyQuestsForDate(s, isoDate);
  const dailyCoachPlan = dailyCoachPlanForDate(s, isoDate);
  const skillTests = skillTestsForDate(s, isoDate);
  const nextUnlocks = milestoneWatchForDate(s, isoDate);
  return {
    id: `packet-${kind}-${isoDate}`,
    kind,
    date: isoDate,
    localDate: isoDate,
    timestampUtc,
    generatedAt: timestampUtc,
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
    recoveryIq: { level, xp: recoveryIqXp },
    readiness: {
      status: readiness.state,
      label: readiness.label,
      summary: readiness.summary,
      reason: dailyCoachPlan.readinessReason,
    },
    morning,
    previousMorning: previous,
    previousEvening: previousResponse,
    evening: kind === "evening" ? evening : undefined,
    dailyCoachPlan,
    smallWin: smallWinForDate(s, isoDate),
    milestones: s.milestones.map((m) => ({
      id: m.id,
      name: m.name,
      state: m.state,
      status: m.status,
      unlockedAt: m.unlockedAt ?? null,
      evidence: m.evidence,
      unlockCriteria: m.unlockCriteria,
      nextStepIfConfirmed: m.nextStepIfConfirmed,
      nextStepIfNotConfirmed: m.nextStepIfNotConfirmed,
    })),
    dailyQuests: dailyQuests.map((q) => ({
      date: q.date,
      label: q.label,
      done: q.done,
      kind: q.kind,
      source: q.source,
      reason: q.reason,
      details: q.details,
      sourceLabel: q.sourceLabel,
      prescribedTasks: q.prescribedTasks,
    })),
    prescribedTasks: dailyQuests.flatMap((q) => q.prescribedTasks ?? []),
    skillTests,
    nextUnlocks,
    completedToday: dailyQuests.filter((q) => q.done).map((q) => q.label),
    pendingToday: dailyQuests.filter((q) => !q.done).map((q) => q.label),
    coachNotesRecent: coachNotes.slice(0, 3),
    athleteNotesRecent: athleteNotesForDate(s, isoDate).slice(0, 3),
    questionsForCoach: [
      "Is yesterday's response good enough to add load today?",
      "Should we prioritize extension or activation this week?",
    ],
    currentConcerns: morning?.notes ?? "",
    lastCoachFocus: latestCoachNote?.nextFocus ?? null,
  };
}

export function buildPacketMarkdown(
  kind: PacketKind,
  s: PhoenixState,
  isoDate = getLocalDateKey(),
): string {
  const campaign = currentCampaign(s);
  const phase = phaseForDate(s, isoDate);
  const mission = currentMission(s);
  const missions = activeMissions(s);
  const tracks = activeRecoveryTracksForPhase(s, phase);
  const { level } = recoveryIqForState(s);
  const recoveryIqXp = recoveryIqXpForState(s);
  const m = getMorningForDate(s, isoDate);
  const e = getEveningForDate(s, isoDate);
  const previous = previousMorning(s, isoDate);
  const previousResponse = previousEvening(s, isoDate);
  const readiness = readinessForDate(s, isoDate);
  const dailyCoachPlan = dailyCoachPlanForDate(s, isoDate);
  const smallWin = smallWinForDate(s, isoDate);
  const dailyQuests = dailyQuestsForDate(s, isoDate);
  const prescribedTasks = dailyQuests.flatMap((q) => q.prescribedTasks ?? []);
  const skillTests = skillTestsForDate(s, isoDate);
  const nextUnlocks = milestoneWatchForDate(s, isoDate);
  const previousTasks = previousResponse
    ? dailyQuestsForDate(s, previousResponse.date).flatMap((q) => q.prescribedTasks ?? [])
    : [];
  const previousSkillTests = previousResponse ? skillTestsForDate(s, previousResponse.date) : [];

  const lines: string[] = [];
  lines.push(`# Phoenix OS — ${kind === "morning" ? "Morning" : "Evening"} Coach Packet`);
  lines.push(`**Date:** ${isoDate}  `);
  lines.push(`**Timezone:** ${getDetectedTimeZone()}  `);
  lines.push(`**Athlete:** ${s.athleteName}  `);
  lines.push(`**Campaign:** ${campaign.name} · Day ${daysPostOp(s, isoDate)}  `);
  lines.push(`**Phase:** ${phase.name}  `);
  lines.push(`**Active Tracks:** ${tracks.map((track) => track.name).join(", ")}  `);
  lines.push(`**Current Mission:** ${mission.name} — ${mission.phase} (${mission.progress}%)  `);
  lines.push(`**Active Missions:** ${missions.map((item) => item.name).join(", ")}  `);
  lines.push(`**Recovery IQ:** Level ${level} · ${recoveryIqXp} XP  `);
  lines.push(
    `**Readiness:** ${readiness.label} — ${dailyCoachPlan.readinessReason ?? readiness.summary}`,
  );
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
    lines.push(`## Morning Baseline Check-In`);
    lines.push(`- Pain: ${m.pain}/10`);
    lines.push(`- Swelling level: ${m.swellingLevel ?? m.swelling}/10`);
    lines.push(`- Swelling context: ${m.swellingContext ?? "unknown"}`);
    lines.push(`- Swelling trend: ${m.swellingTrend ?? "unknown"}`);
    lines.push(`- Walking confidence: ${m.walkingConfidence}/5`);
    lines.push(`- Gait quality: ${m.gaitQuality ?? "—"}/5`);
    lines.push(`- Extension status: ${formatPacketValue(m.extensionStatus)}`);
    lines.push(`- Flexion comfort/status: ${formatPacketValue(m.flexionStatus)}`);
    lines.push(`- Flexion limiting factor: ${formatPacketValue(m.flexionLimitingFactor)}`);
    lines.push(`- Sleep: ${m.sleepHours}h`);
    lines.push(`- Weight: ${m.weightKg}kg · Protein target: ${m.proteinTargetG}g`);
    lines.push(`- Confidence in knee: ${m.confidence}/5`);
    lines.push(`- Notes: ${m.notes || "—"}`);
    lines.push("");
  }

  if (previous) {
    lines.push(`## Previous Morning`);
    lines.push(`- Date: ${previous.date}`);
    lines.push(
      `- Pain: ${previous.pain}/10 · Swelling: ${previous.swellingLevel ?? previous.swelling}/10`,
    );
    lines.push(`- Walking confidence: ${previous.walkingConfidence}/5`);
    lines.push(`- Gait quality: ${previous.gaitQuality ?? "—"}/5`);
    lines.push(`- Extension status: ${formatPacketValue(previous.extensionStatus)}`);
    lines.push(`- Flexion comfort/status: ${formatPacketValue(previous.flexionStatus)}`);
    lines.push(`- Flexion limiting factor: ${formatPacketValue(previous.flexionLimitingFactor)}`);
    lines.push("");
  }

  if (previousResponse) {
    lines.push(`## Previous Evening Response`);
    lines.push(`- Date: ${previousResponse.date}`);
    lines.push(`- Quests completed: ${previousResponse.exercisesCompleted || "—"}`);
    lines.push(
      `- Pain during: ${previousResponse.painDuring}/10 · Pain after: ${previousResponse.painAfter}/10`,
    );
    lines.push(
      `- Swelling change: ${previousResponse.swellingChange > 0 ? "+" : ""}${previousResponse.swellingChange}`,
    );
    lines.push(
      `- Walking confidence after: ${previousResponse.walkingConfidenceAfter ?? previousResponse.walkingConfidence}/5`,
    );
    lines.push(`- Gait quality after: ${previousResponse.gaitQualityAfter ?? "—"}/5`);
    lines.push(`- Quad activation quality: ${previousResponse.quadActivationQuality}/5`);
    lines.push(`- Extension response: ${formatPacketValue(previousResponse.extensionResponse)}`);
    lines.push(`- Flexion response: ${formatPacketValue(previousResponse.flexionResponse)}`);
    lines.push(`- Concerning symptoms: ${previousResponse.concerningSymptoms || "—"}`);
    lines.push(`- Notes: ${previousResponse.notes || "—"}`);
    lines.push("");
  }

  if (previousTasks.length > 0) {
    lines.push(`## Previous Prescribed Task Responses`);
    previousTasks.forEach((task) => {
      lines.push(`- ${task.title}: ${formatTaskCompletion(task)}`);
    });
    lines.push("");
  }

  if (previousSkillTests.length > 0) {
    lines.push(`## Previous Skill Test Responses`);
    previousSkillTests.forEach((test) => {
      lines.push(`- ${test.title}: ${formatSkillTest(test)}`);
    });
    lines.push("");
  }

  if (kind === "evening" && e) {
    lines.push(`## Evening Response Check-In`);
    lines.push(`- Quests completed: ${e.exercisesCompleted || "—"}`);
    lines.push(`- Pain during: ${e.painDuring}/10 · Pain after: ${e.painAfter}/10`);
    lines.push(`- Swelling change: ${e.swellingChange > 0 ? "+" : ""}${e.swellingChange}`);
    lines.push(`- Walking confidence after: ${e.walkingConfidenceAfter ?? e.walkingConfidence}/5`);
    lines.push(`- Gait quality after: ${e.gaitQualityAfter ?? "—"}/5`);
    lines.push(`- Quad activation quality: ${e.quadActivationQuality}/5`);
    lines.push(`- Extension response: ${formatPacketValue(e.extensionResponse)}`);
    lines.push(`- Flexion response: ${formatPacketValue(e.flexionResponse)}`);
    lines.push(`- Concerning symptoms: ${e.concerningSymptoms || "—"}`);
    lines.push(`- Milestones touched: ${e.milestones || "—"}`);
    lines.push(`- Notes: ${e.notes || "—"}`);
    lines.push("");
  }

  if (kind === "evening" && prescribedTasks.length > 0) {
    lines.push(`## Today's Prescribed Task Responses`);
    prescribedTasks.forEach((task) => {
      lines.push(`- ${task.title}: ${formatTaskCompletion(task)}`);
    });
    lines.push("");
  }

  if (skillTests.length > 0) {
    lines.push(`## Optional Skill Tests`);
    skillTests.forEach((test) => {
      lines.push(`- ${test.title}: ${formatSkillTest(test)}`);
      lines.push(`  - Test dose: ${formatSkillTestDose(test)}`);
      if (test.passCriteria.length) lines.push(`  - Pass: ${test.passCriteria.join("; ")}`);
      if (test.stopRules.length) lines.push(`  - Stop: ${test.stopRules.join("; ")}`);
    });
    lines.push("");
  }

  if (nextUnlocks.length > 0) {
    lines.push(`## Milestone Watch / Next Unlocks`);
    nextUnlocks.forEach((item) => {
      lines.push(`**${item.title}** — ${item.statusLabel}`);
      if (item.evidence.length) lines.push(`- Evidence: ${item.evidence.join("; ")}`);
      if (item.unlockCriteria.length) lines.push(`- To unlock: ${item.unlockCriteria.join("; ")}`);
      lines.push(`- If confirmed: ${item.nextStepIfConfirmed}`);
      lines.push(`- If not confirmed: ${item.nextStepIfNotConfirmed}`);
    });
    lines.push("");
  }

  if (prescribedTasks.length > 0) {
    lines.push(`## Today's Prescribed Tasks`);
    dailyQuests.forEach((quest) => {
      if (!quest.prescribedTasks?.length) return;
      lines.push(`**${quest.label}**`);
      quest.prescribedTasks.forEach((task) => {
        lines.push(`- ${task.title}`);
        prescriptionLines(task).forEach((line) => lines.push(`  - ${line}`));
        if (task.stopRules.length) lines.push(`  - Stop: ${task.stopRules.join("; ")}`);
      });
    });
    lines.push("");
  }

  lines.push(`## Today's Work`);
  lines.push(`**Completed**`);
  dailyQuests
    .filter((q) => q.done)
    .forEach((q) => {
      lines.push(`- ✅ ${q.label} (${q.reason})`);
      if (q.details?.length) lines.push(`  - Details: ${q.details.join("; ")}`);
    });
  lines.push(`**Pending**`);
  dailyQuests
    .filter((q) => !q.done)
    .forEach((q) => {
      lines.push(`- ⬜ ${q.label} (${q.reason})`);
      if (q.sourceLabel) lines.push(`  - Source: ${q.sourceLabel}`);
      if (q.details?.length) lines.push(`  - Details: ${q.details.join("; ")}`);
    });
  lines.push("");

  lines.push(`## Small Win`);
  lines.push(`**${smallWin.title}**`);
  lines.push(smallWin.description);
  lines.push("");

  lines.push(`## Milestones`);
  s.milestones.forEach((mi) =>
    lines.push(
      `- [${mi.state === "unlocked" ? "x" : " "}] **${mi.name}** — ${mi.state}${mi.unlockedAt ? ` (${mi.unlockedAt})` : ""}`,
    ),
  );
  lines.push("");

  const coachNotes = coachNotesForDate(s, isoDate);
  if (coachNotes.length > 0) {
    lines.push(`## Coach Notes`);
    coachNotes.slice(0, 3).forEach((note) => {
      const author = note.authorName ? ` · ${note.authorName}` : "";
      lines.push(`- ${note.source}${author} · ${note.noteType}: ${note.summary}`);
      if (note.nextFocus) lines.push(`  - Next focus: ${note.nextFocus}`);
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
  lines.push(`- Which prescribed task should repeat, progress slightly, reduce, or be removed?`);
  lines.push("");
  lines.push(`## Progression Rules For Tomorrow`);
  lines.push(
    `- Completed and tolerated with stable next-morning baseline: repeat or consider tiny progression.`,
  );
  lines.push(`- Partial but tolerated: repeat the same dose.`);
  lines.push(`- Completed but symptoms worsened: reduce dose.`);
  lines.push(
    `- Sharp pain, pinching, worse gait, or swelling increase that does not settle: remove or modify the provoking task.`,
  );
  lines.push(
    `- Do not let swelling level alone dominate progression; use adherence plus response.`,
  );
  lines.push(`- Modify+ can support skill/control testing, but not load progression.`);
  lines.push("");
  lines.push(`## Current Concerns`);
  lines.push(m?.notes || "None reported.");

  return lines.join("\n");
}

function prescriptionLines(task: PrescribedTask): string[] {
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
    p.effortTarget ? `Effort: ${p.effortTarget}` : "",
    p.rangeInstruction,
    p.qualityTarget ? `Goal: ${p.qualityTarget}` : "",
  ].filter((line): line is string => Boolean(line));
}

function formatTaskCompletion(task: PrescribedTask): string {
  const c = task.completion;
  const planned = prescriptionLines(task);
  const actual = [
    c.actualSets == null ? "" : `${c.actualSets} sets`,
    c.actualReps == null ? "" : `${c.actualReps} reps`,
    c.actualDurationMinutes == null ? "" : `${c.actualDurationMinutes} min`,
  ].filter(Boolean);
  const response = [
    c.afterEffect ? `after-effect ${formatPacketValue(c.afterEffect)}` : "",
    c.gaitQuality ? `gait ${formatPacketValue(c.gaitQuality)}` : "",
    c.supportUsed ? `support ${formatPacketValue(c.supportUsed)}` : "",
    c.activationQuality ? `activation ${formatPacketValue(c.activationQuality)}` : "",
    c.controlQuality ? `control ${formatPacketValue(c.controlQuality)}` : "",
    c.limitingFactor ? `limiting factor ${formatPacketValue(c.limitingFactor)}` : "",
    c.flexionEstimateDegrees == null ? "" : `flexion estimate ${c.flexionEstimateDegrees}°`,
    c.extensionAfter ? `extension after ${formatPacketValue(c.extensionAfter)}` : "",
  ].filter(Boolean);
  return [
    planned.length ? `prescribed ${planned.join("; ")}` : "prescribed dose not specified",
    `status ${formatPacketValue(c.status)}`,
    c.status === "completed" ? "actual prescribed dose completed" : "",
    c.status === "partial" && c.partialEstimate
      ? `partial estimate ${formatPacketValue(c.partialEstimate)}`
      : "",
    c.status === "partial" && c.limitationReason
      ? `limitation ${formatPacketValue(c.limitationReason)}`
      : "",
    c.status === "partial" && c.partialEstimate === "custom" && actual.length
      ? `custom actual ${actual.join(", ")}`
      : "",
    c.status === "skipped" && c.skippedReason
      ? `skipped reason ${formatPacketValue(c.skippedReason)}`
      : "",
    response.length ? response.join(", ") : "",
    c.notes ? `notes: ${c.notes}` : "",
  ]
    .filter(Boolean)
    .join("; ");
}

function formatSkillTestDose(test: SkillTest): string {
  const dose = [
    test.testDose.sets == null ? "" : `${test.testDose.sets} sets`,
    test.testDose.reps == null ? "" : `${test.testDose.reps} reps`,
    test.testDose.duration ?? "",
  ].filter(Boolean);
  return [dose.join(", "), test.testDose.instructions].filter(Boolean).join("; ");
}

function formatSkillTest(test: SkillTest): string {
  const result = test.result;
  const response = [
    result.completed ? "completed" : "not completed",
    result.repsCompleted == null ? "" : `${result.repsCompleted} reps`,
    result.painDuring == null ? "" : `pain during ${result.painDuring}/10`,
    result.painAfter == null ? "" : `pain after ${result.painAfter}/10`,
    result.qualityScore == null ? "" : `quality ${result.qualityScore}/5`,
    result.lagObserved == null ? "" : result.lagObserved ? "lag observed" : "no lag reported",
    result.feltControlled == null
      ? ""
      : result.feltControlled
        ? "felt controlled"
        : "did not feel controlled",
    result.irritation == null ? "" : result.irritation ? "irritation reported" : "no irritation",
    result.swellingResponse ? `swelling ${result.swellingResponse}` : "",
    result.walkingResponse ? `walking ${result.walkingResponse}` : "",
    result.notes ? `notes: ${result.notes}` : "",
  ].filter(Boolean);
  return [`status ${test.status}`, ...response].join("; ");
}

function formatPacketValue(value: string | undefined) {
  if (!value) return "—";
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
