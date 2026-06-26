# Decision Engine

Version: 1.0
Owner: Kevin Sauvageau
Product: Project Phoenix OS
Status: Living Document

## Purpose

The Decision Engine defines the logic Project Phoenix uses to support progression decisions.

It should not make autonomous medical decisions. It should organize evidence and produce transparent recommendations.

## Decision States

### Green: Ready

Proceed as planned.

Typical evidence:

- Pain in green zone
- Swelling stable or improving
- Walking confidence stable or improving
- No negative next-day response
- Current mission criteria being met

### Yellow: Modify

Proceed with caution or reduce workload.

Typical evidence:

- Pain in yellow zone
- Swelling slightly increased
- Walking confidence decreased
- Extension or flexion worsened
- Fatigue or sleep issues present

### Red: Recover

Back off and prioritize recovery.

Typical evidence:

- Pain in orange/red zone
- Swelling significantly increased
- Limp returned or worsened
- Loss of ROM
- Mechanical symptoms
- Concerning calf symptoms
- Clinician warning signs

## Core Rules

### Rule 1: Next-day response matters most

If the athlete performed a session yesterday and today shows worse pain, worse swelling, worse walking confidence, or worse ROM, do not progress.

Decision: Hold, modify, or deload.

### Rule 2: Stable swelling is required for progression

If swelling increases meaningfully, do not progress lower-body loading.

Decision: Prioritize swelling control and ROM quality.

### Rule 3: Pain alone is not enough

Low pain does not automatically mean readiness.

Readiness also requires:

- Movement quality
- Swelling control
- ROM stability
- Confidence
- Previous-day tolerance

### Rule 4: Green pain with poor movement is not green readiness

If pain is low but walking confidence is poor or the athlete is compensating, do not treat the day as fully green.

Decision: Modify.

### Rule 5: Orange pain changes the plan

If pain reaches 5/10 or higher during an activity, modify or stop.

Decision: Reduce load, volume, range, or complexity.

### Rule 6: Trend beats snapshot

A single good number is less important than a stable trend.

Progression is stronger when improvement repeats across several check-ins.

### Rule 7: Extension has priority early

If extension is worsening or not progressing, prioritize extension and swelling control before adding more strengthening complexity.

### Rule 8: Confidence matters, but does not overrule evidence

The athlete’s confidence is useful context.

However, confidence alone does not unlock progression.

## Example Decision Logic

### Eligible to progress

IF:

- Pain <= 2
- Swelling <= 2 and not increasing
- Walking Confidence >= 3
- Previous evening response is neutral or positive
- No worsening ROM

THEN:

- Recommendation: Green / proceed as planned
- Progression may be considered

### Hold current workload

IF:

- Pain is stable
- Swelling is stable
- Movement quality is acceptable
- But milestone criteria are not yet met

THEN:

- Recommendation: Hold
- Continue current plan

### Modify workload

IF:

- Pain is 3-4
- Or swelling increased slightly
- Or walking confidence dropped by 1
- Or sleep was poor

THEN:

- Recommendation: Yellow / modify
- Reduce workload or avoid progression

### Recover / back off

IF:

- Pain >= 5
- Or swelling increased significantly
- Or walking worsened noticeably
- Or ROM worsened materially
- Or mechanical symptoms are present

THEN:

- Recommendation: Red / recover
- Consider contacting physio depending on severity

## Recommendation Format

Each recommendation should include:

- Status: Green / Yellow / Red
- Label: Ready / Modify / Recover
- Today’s priority
- Workload recommendation
- Reason
- Next reassessment
- Confidence: High / Medium / Low
