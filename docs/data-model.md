# Data Model

Version: 1.0
Owner: Kevin Sauvageau
Product: Project Phoenix OS
Status: Living Document

## Purpose

This document defines the core data objects used by Project Phoenix OS.

The model should support the current ACL campaign while remaining flexible enough for future athletic campaigns.

## Athlete

Represents the person using the app.

Fields:

- id
- name
- timezone
- preferredUnits
- activeCampaignId

## Campaign

Represents a long-term athletic project.

Example: ACL Revision Prehab.

Fields:

- id
- name
- description
- startDate
- targetDate
- surgeryType
- status
- currentMissionId

## Mission

Represents the current focus area.

Fields:

- id
- campaignId
- name
- phase
- objective
- whyItMatters
- estimatedDuration
- status
- milestoneIds
- nextUnlockId

## Milestone

Represents an evidence-based progression marker.

Fields:

- id
- missionId
- name
- description
- whyItMatters
- evidenceRequired
- status
- unlockedAt
- coachNotes

Status values:

- locked
- in-progress
- unlocked

## Daily Check-In

Represents one day of athlete-reported data.

Fields:

- id
- athleteId
- campaignId
- date
- recoveryDay
- morningCheckIn
- eveningCheckIn

## Morning Check-In

Fields:

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
- questionsForCoach

## Evening Check-In

Fields:

- exercisesCompleted
- painDuringActivity
- painAfterActivity
- swellingChange
- walkingConfidenceAfter
- fatigue
- milestonesAchieved
- xpEarned
- notes
- questionsForCoach

## Readiness

Represents the app’s structured readiness state.

Fields:

- status
- label
- recommendation
- reason
- confidence

Status values:

- green
- yellow
- red

## Recovery IQ

Fields:

- athleteId
- level
- xp
- xpToNextLevel
- title
- history

## XP Event

Represents an XP-earning behavior.

Fields:

- id
- date
- athleteId
- campaignId
- amount
- reason
- source
- relatedMilestoneId
- relatedCoachJournalId

## Coach Journal Entry

Fields:

- id
- date
- athleteId
- campaignId
- observation
- interpretation
- decision
- nextFocus
- xpAwarded
- confidence

## Coach Packet

Represents an exportable coaching context packet.

Fields:

- kind
- generatedAt
- localGeneratedAt
- timezone
- athlete
- campaign
- mission
- recoveryIq
- readiness
- morning
- evening
- previousMorning
- previousEvening
- trends
- milestones
- completedToday
- pendingToday
- coachJournalRecent
- questionsForCoach
- currentConcerns
- lastCoachFocus
