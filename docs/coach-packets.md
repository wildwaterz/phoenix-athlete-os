# Coach Packets

Version: 1.1  
Owner: Kevin Sauvageau  
Product: Project Phoenix OS  
Status: Living Document

## Purpose

Coach Packets allow Project Phoenix to export structured evidence for an external coach, clinician, or AI assistant.

The app owns the data. External coaching interprets it.

## Packet Requirements

Coach packets should include:

- campaign
- phase
- active recovery tracks
- current mission(s)
- recovery day
- morning check-in
- previous evening response
- readiness state
- readiness reason
- quests completed / pending
- small win
- coach questions
- concerns

## Important Fields

### Phase and Tracks

```json
{
  "phase": "Phase 2 · Activation + Early ROM",
  "activeTracks": ["Symptoms", "ROM", "Activation", "Walking / Movement"]
}
```

### Swelling Context

```json
{
  "swellingLevel": 5,
  "swellingTrend": "stable",
  "swellingContext": "surgical_baseline"
}
```

This prevents the system from treating expected surgical swelling as activity-induced failure.

### ROM

```json
{
  "rom": {
    "extensionStatus": "slightly_limited",
    "extensionEstimateDegrees": 5,
    "flexionDegrees": 118,
    "flexionComfort": "comfortable_range_only"
  }
}
```

### Readiness

```json
{
  "readiness": {
    "status": "modify",
    "label": "Modify",
    "reason": "Expected post-op swelling is present, but pain is low and walking confidence is acceptable. Complete gentle recovery work and avoid volume increases."
  }
}
```

### Small Win

```json
{
  "smallWin": {
    "title": "Pain improved",
    "description": "Pain dropped by 1 point compared with the previous check-in.",
    "source": "rule"
  }
}
```

## Markdown Packet Structure

```md
# Project Phoenix Coach Packet

Date:
Recovery Day:
Campaign:
Phase:
Active Tracks:
Current Mission(s):
Readiness:
Readiness Reason:

## Morning Check-In
Pain:
Swelling Level:
Swelling Context:
Walking Confidence:
Quad Activation:
Extension Status:
Flexion:
Sleep:
Protein:
Notes:

## Previous Evening Response
Work completed:
Pain during:
Pain after:
Swelling change:
Walking / movement quality:
Notes:

## Daily Quests
Completed:
Pending:

## Small Win

## Questions for Coach

## Concerns
```
