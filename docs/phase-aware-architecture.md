# Phase-Aware Architecture

Version: 1.1  
Owner: Kevin Sauvageau  
Product: Project Phoenix OS  
Status: Living Document

## Purpose

Project Phoenix must evolve as the athlete progresses. The app should not use one static check-in, dashboard, or quest list for the entire rehab journey.

The correct model is:

```text
Campaign > Phase > Recovery Tracks > Missions > Milestones > Daily Quests
```

## Definitions

### Campaign

The complete rehab journey.

Example: `ACL Revision Prehab`.

### Phase

A broad stage of recovery.

Examples:

- Phase 1: Acute Response
- Phase 2: Activation + Early ROM
- Phase 3: Movement Capacity
- Phase 4: Strength Capacity
- Phase 5: Return Preparation

### Recovery Track

A parallel domain of recovery that can progress independently.

Tracks:

1. Symptoms
2. ROM
3. Activation
4. Walking / Movement
5. Capacity
6. Return to Sport

### Mission

A focused objective inside one or more recovery tracks.

Examples:

- Calm the Knee
- Wake the Quad
- Restore Range
- Normalize Walking
- Build Tolerance

### Milestone

Evidence that a capability has been earned.

### Daily Quest

Today’s action. Quests should be generated from phase, track, check-in data, and previous response.

## Core Principle

The calendar does not promote the athlete. Evidence does.

The app should never progress the athlete simply because time passed.

## Phase-Specific Dashboard Model

Each phase defines:

- dashboard question
- primary metrics
- supporting metrics
- readiness rules
- check-in fields
- quest templates
- small-win rules

### Phase 1: Acute Response

Dashboard question: `Is the knee settling down?`

Primary metrics:

- pain
- swelling
- walking confidence
- quad activation
- extension status

Main tracks:

- Symptoms
- Walking / Movement
- Activation

### Phase 2: Activation + Early ROM

Dashboard question: `Can I control and move the knee?`

Primary metrics:

- quad activation
- extension status
- flexion status
- walking confidence
- swelling response
- pain

Main tracks:

- Symptoms
- ROM
- Activation
- Walking / Movement

Important: Phase 2 is not only quad activation. It must also include early ROM work for both extension and flexion.

### Phase 3: Movement Capacity

Dashboard question: `Can I move normally and tolerate basic loading?`

Primary metrics:

- movement quality
- pain during activity
- pain after activity
- swelling response
- ROM status
- session tolerance

Walking confidence should fade out and be replaced by movement quality.

### Phase 4: Strength Capacity

Dashboard question: `Can I train and recover from it?`

Primary metrics:

- training readiness
- session tolerance
- pain after training
- swelling response
- load completed
- next-morning response

### Phase 5: Return Preparation

Dashboard question: `Can I perform and repeat it?`

Primary metrics:

- sport confidence
- knee response
- instability events
- workload trend
- power tolerance
- next-morning response

## Implementation Guidance

Create a phase configuration system.

Each phase config should define:

```ts
type PhaseConfig = {
  id: string;
  name: string;
  dashboardQuestion: string;
  activeTracks: RecoveryTrackId[];
  primaryMetrics: MetricId[];
  supportingMetrics: MetricId[];
  morningCheckInFields: FieldId[];
  eveningCheckInFields: FieldId[];
  questTemplates: QuestTemplate[];
  readinessRules: ReadinessRule[];
  smallWinRules: SmallWinRule[];
};
```

For MVP, fully implement Phase 1 and Phase 2. Create placeholder configs for Phase 3 through Phase 5.
