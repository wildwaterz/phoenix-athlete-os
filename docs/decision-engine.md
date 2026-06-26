# Decision Engine

Version: 1.1  
Owner: Kevin Sauvageau  
Product: Project Phoenix OS  
Status: Living Document

## Purpose

The decision engine translates check-in data into readiness, quests, small wins, and coach packet context.

It should be transparent, rule-based, and conservative.

The app does not make medical decisions. It organizes evidence.

## Core Principles

1. The calendar does not promote the athlete. Evidence does.
2. Absolute symptoms matter, but symptom response matters more.
3. Surgical baseline swelling is not the same as activity-induced swelling.
4. Readiness should be phase-aware.
5. Quests should be generated from the current phase, active tracks, current check-in, previous response, and clinician constraints.

## Readiness States

### Ready

Low symptoms, stable or improving trend, and no negative response to previous activity.

### Modify

Symptoms are present, expected, or moderately elevated, but activity can continue in a controlled way.

Example: Day 1 post-op swelling 5/10 with pain 2/10 and walking confidence 3/5 should usually be Modify, not Recover, if there is no evidence that activity caused worsening.

### Recover

Meaningful worsening, high pain, major swelling response, reduced walking/movement quality, instability, or concerning symptoms.

## Swelling Logic

Track three concepts:

```ts
swellingLevel: 0-10
swellingTrend: 'improved' | 'stable' | 'worse' | 'unknown'
swellingContext: 'surgical_baseline' | 'activity_response' | 'unknown'
```

Early post-op rules:

- Recovery day 0-3, swelling 4-6/10, pain <=3, walking confidence >=3, and no activity-induced worsening => Modify.
- Swelling increase of +2 or more after activity => Recover or reduce next workload.
- Swelling paired with higher pain and worse walking quality => Recover.

## ROM Logic

ROM includes both:

- extension
- flexion

Extension should be tracked in practical home bands:

- neutral / 0 degrees
- slightly limited / about 5 degrees
- moderately limited / about 10 degrees
- significantly limited / 15+ degrees
- not tested

Flexion can be tracked in degrees when available, but the app should also record comfort and symptom response.

Gentle ROM can run in parallel with activation work. The athlete does not need to fully complete quad activation before beginning gentle flexion exposure if it is tolerated and clinically allowed.

## Quest Generation

Quest generation inputs:

- recovery day
- phase
- active tracks
- morning check-in
- previous evening response
- current mission(s)
- clinician constraints

Day 0 example main quests:

- ankle pumps
- assisted walking practice
- gentle quad activation check
- swelling control / comfortable elevation
- evening check-in

Day 1 example main quests:

- morning check-in
- ankle pumps throughout day
- short walking practice with crutch support as needed
- quad activation sets
- gentle heel prop 3-5 min if tolerated
- gentle heel slides 1-2 sets of 10 if tolerated
- evening check-in

## Small Wins

Small wins should be rule-based first and manually editable.

Do not require AI.

Examples:

- pain decreased versus previous check-in
- swelling stayed stable after activity
- walking confidence improved
- quad activation improved
- extension status moved closer to neutral
- flexion improved without symptom increase
- all main quests completed
- user logged a smart decision to back off

Only one primary win should appear on the dashboard.
