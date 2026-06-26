# Coach Packets

Version: 1.0
Owner: Kevin Sauvageau
Product: Project Phoenix OS
Status: Living Document

## Purpose

Coach Packets are exportable summaries designed to give an external coach or AI assistant enough context to assess the athlete’s status without needing direct access to the app.

Project Phoenix owns the data. AI interprets the data.

## Packet Types

Project Phoenix supports two daily coach packets:

1. Morning Coach Packet
2. Evening Coach Packet

## Morning Coach Packet

Purpose:

Determine the day’s starting point and decide whether the athlete should progress, hold, modify, or recover.

### Required Fields

- kind: morning
- generatedAt
- localGeneratedAt
- timezone
- athleteName
- campaign
- surgeryType
- recoveryDay
- daysSinceSurgery
- currentMission
- recoveryIq
- readiness
- morning check-in
- previousMorning
- trends
- previousEvening
- milestones
- completedToday
- pendingToday
- coachJournalRecent
- questionsForCoach
- currentConcerns
- lastCoachFocus

### Morning Check-In Fields

- date
- pain
- swelling
- walkingConfidence
- quadActivation
- extension
- flexion
- sleepHours
- weightKg
- proteinTargetG
- confidenceInKnee
- notes

### Readiness Object

```json
{
  "status": "green",
  "label": "Ready",
  "recommendation": "Proceed as planned",
  "reason": "Pain and swelling improved, walking confidence improved, and no negative response was reported.",
  "confidence": "medium"
}
```

### Trend Object

```json
{
  "painChange": -1,
  "swellingChange": -1,
  "walkingConfidenceChange": 1,
  "quadActivationChange": 1,
  "extensionChange": -2,
  "extensionTrendLabel": "Improved 2°",
  "flexionChange": 5
}
```

## Evening Coach Packet

Purpose:

Evaluate whether the knee tolerated the day.

### Required Fields

- kind: evening
- generatedAt
- localGeneratedAt
- timezone
- athleteName
- campaign
- surgeryType
- recoveryDay
- currentMission
- morningCheckInSummary
- eveningCheckIn
- workCompleted
- painDuringActivity
- painAfterActivity
- swellingChange
- walkingConfidenceAfter
- fatigue
- milestonesAchieved
- xpEarned
- notes
- questionsForCoach

## Markdown Export

The Markdown export should be clean when pasted into ChatGPT or Claude.

It should use:

- Clear headings
- Bullet points
- No unnecessary emojis except status markers
- Plain language

## JSON Export

The JSON export should be valid, formatted, and stable.

It should prioritize structure over display text.

## User-Editable Questions

The user should be able to add or edit questions before export.

Examples:

- Should I prioritize extension or activation today?
- Did yesterday’s workload create a negative response?
- Am I ready to add the next progression?

## Design Principle

A coach packet should eliminate repetitive explanation.

The athlete should be able to click Copy, paste into a coach or AI chat, and receive useful guidance without manually restating context.
