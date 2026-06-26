# Project Phoenix OS

Version: 1.0  
Owner: Kevin Sauvageau  
Product: Project Phoenix OS  
Status: Living Document

## Vision

Project Phoenix OS is an Athlete Operating System.

It is not a generic rehab app, a workout tracker, or a medical application. Its purpose is to help athletes make better day-to-day decisions throughout rehabilitation, training, recovery, and long-term athletic development.

The first campaign is ACL revision prehab and rehabilitation. Future campaigns may include strength development, hockey performance, golf, conditioning, nutrition, and longevity.

## Mission

Project Phoenix exists to reduce uncertainty, increase consistency, and turn recovery and training into a progression system driven by evidence rather than emotion.

Every day, the app should help the athlete answer:

1. Where am I?
2. What should I focus on today?
3. Am I progressing appropriately?
4. Why is today’s recommendation what it is?

## Core Product Philosophy

### Recovery is training

Recovery is never considered “doing nothing.” Managing swelling, sleep, nutrition, pain response, and workload are productive training activities.

### Progression is earned

Time alone does not unlock progress. Progression requires evidence.

### Evidence beats ego

Subjective confidence is useful context. Objective evidence drives decisions.

### Adaptation over exercise

Exercises are tools. Adaptations are goals. The app should focus on capabilities being restored rather than rigid exercise prescriptions.

### Competency over timelines

The athlete progresses after demonstrating readiness, not after completing arbitrary calendar weeks.

### Explain every decision

Every recommendation should be explainable. The app should avoid black-box logic. Every recommendation should be traceable to observable data.

### Build the athlete

The ACL is not the destination. It is one campaign within a lifelong athletic journey.

## Target User

Initially: Kevin Sauvageau.

Ultimately: serious recreational athletes who value evidence-based coaching, objective progress tracking, and long-term athletic performance.

## Success Metrics

Project Phoenix succeeds when:

- Daily check-ins take less than two minutes.
- The athlete always understands today’s mission.
- Progression decisions can be justified objectively.
- Communication with coaches and physiotherapists becomes easier.
- Recovery becomes motivating instead of overwhelming.
- The athlete can export a coach packet without manually retyping context.

## What Project Phoenix Is Not

Project Phoenix does not:

- Diagnose injuries.
- Replace physicians or physiotherapists.
- Prescribe medical treatment.
- Make autonomous medical decisions.

Instead, it organizes information and supports better conversations, better decisions, and better adherence.

## Long-Term Vision

Project Phoenix evolves into a complete Athlete Operating System containing independent but connected modules:

- Rehabilitation
- Strength
- Conditioning
- Nutrition
- Sleep and recovery
- Sport-specific readiness
- Performance analytics
- Longevity

The core operating principles remain unchanged regardless of campaign.


## Phase-Aware Architecture Update

The current product model is:

```text
Campaign > Phase > Recovery Tracks > Missions > Milestones > Daily Quests
```

Phases and missions are not the same thing. A phase is the broad stage of recovery; a mission is a focused objective within one or more recovery tracks.

Project Phoenix should support parallel recovery tracks:

- Symptoms
- ROM
- Activation
- Walking / Movement
- Capacity
- Return to Sport

Phase 2 should be treated as `Activation + Early ROM`, not only quad activation. ROM must include both extension and flexion.

The dashboard and check-in system should be phase-aware. Walking confidence is useful early, but later phases should replace it with movement quality, training tolerance, and sport confidence.
