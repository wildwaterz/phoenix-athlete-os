# Data Model

Version: 1.1  
Owner: Kevin Sauvageau  
Product: Project Phoenix OS  
Status: Living Document

## Purpose

The data model should support phase-aware rehab tracking without requiring a redesign when the athlete moves from early post-op tracking to training and sport preparation.

## Core Hierarchy

```text
Campaign > Phase > Recovery Tracks > Missions > Milestones > Daily Quests
```

## Types

```ts
type Campaign = {
  id: string;
  name: string;
  surgeryType?: string;
  startedAt: string;
  activePhaseId: string;
};

type Phase = {
  id: string;
  name: string;
  order: number;
  dashboardQuestion: string;
  activeTracks: RecoveryTrackId[];
  primaryMetrics: MetricId[];
  supportingMetrics: MetricId[];
};

type RecoveryTrackId =
  | 'symptoms'
  | 'rom'
  | 'activation'
  | 'walking_movement'
  | 'capacity'
  | 'return_to_sport';

type Mission = {
  id: string;
  name: string;
  phaseId: string;
  trackIds: RecoveryTrackId[];
  objective: string;
  whyItMatters: string;
  status: 'locked' | 'active' | 'complete';
  milestoneIds: string[];
};

type Milestone = {
  id: string;
  name: string;
  trackId: RecoveryTrackId;
  status: 'locked' | 'in_progress' | 'unlocked';
  criteria: string[];
  unlockedAt?: string;
};

type DailyQuest = {
  id: string;
  date: string;
  title: string;
  category: 'main' | 'side';
  source: 'phase' | 'mission' | 'track' | 'rule' | 'manual';
  reason?: string;
  xp: number;
  status: 'pending' | 'complete' | 'skipped';
};
```

## Check-In Model

The app should not rely on a single permanent check-in form.

Use stable core metrics plus phase-specific fields.

```ts
type DailyCheckIn = {
  date: string;
  phaseId: string;
  morning?: MorningCheckIn;
  evening?: EveningCheckIn;
};

type MorningCheckIn = {
  pain?: number;
  swellingLevel?: number;
  swellingContext?: 'surgical_baseline' | 'activity_response' | 'unknown';
  swellingTrend?: 'improved' | 'stable' | 'worse' | 'unknown';
  sleepHours?: number;
  proteinTargetG?: number;
  notes?: string;

  // Phase 1-2 fields
  walkingConfidence?: number;
  confidenceInKnee?: number;
  quadActivation?: number;
  extensionStatus?: 'neutral' | 'slightly_limited' | 'moderately_limited' | 'significantly_limited' | 'not_tested';
  extensionEstimateDegrees?: 0 | 5 | 10 | 15;
  flexionDegrees?: number;

  // Later phase placeholders
  movementQuality?: number;
  trainingReadiness?: number;
  sportConfidence?: number;
};

type EveningCheckIn = {
  exercisesCompleted?: string;
  painDuringActivity?: number;
  painAfterActivity?: number;
  swellingChange?: -3 | -2 | -1 | 0 | 1 | 2 | 3;
  walkingConfidenceAfter?: number;
  movementQualityAfter?: number;
  energyFatigue?: number;
  milestonesAchieved?: string;
  todayWin?: string;
  notes?: string;
};
```

## Phase Config

```ts
type PhaseConfig = {
  id: string;
  name: string;
  dashboardQuestion: string;
  activeTracks: RecoveryTrackId[];
  primaryMetrics: MetricId[];
  supportingMetrics: MetricId[];
  morningCheckInFields: string[];
  eveningCheckInFields: string[];
  questTemplates: string[];
  readinessRules: string[];
  smallWinRules: string[];
};
```

## Important Rules

- Walking confidence is important in early phases but should be replaced later by movement quality, training tolerance, or sport confidence.
- ROM includes both extension and flexion.
- Swelling level and swelling response are different data points.
- A high swelling level early post-op should not automatically mean the athlete must do nothing.
- Readiness must consider phase, symptom trend, and activity response.
