# Product Principles

Version: 1.0
Owner: Kevin Sauvageau
Product: Project Phoenix OS
Status: Living Document

## Purpose

This document defines how product decisions should be made inside Project Phoenix OS.

When there is disagreement about a feature, screen, workflow, or metric, use these principles to decide.

## 1. The athlete must always know what matters today

Every screen should reduce uncertainty.

The athlete should quickly understand:

- Current mission
- Readiness state
- Next action
- Why that action matters

If a screen does not help answer one of those questions, it is probably too noisy.

## 2. Recovery is training

The product should reinforce that sleep, swelling control, nutrition, pain management, and smart restraint are legitimate training behaviors.

Do not reward suffering. Reward good decisions.

## 3. Evidence beats ego

The product should make objective data visible enough that emotional decisions become easier to challenge.

Examples:

- “I feel good” is not enough.
- Pain, swelling, walking confidence, and next-day response matter.
- Progression should be supported by repeatable evidence.

## 4. Progression is earned, never assumed

The calendar does not promote the athlete.

Milestones, trends, and recovery response drive progression.

## 5. Adaptations matter more than exercises

An exercise is replaceable. The target adaptation is not.

Example:

- Tool: heel prop
- Adaptation: restore full knee extension

If the physio changes the exercise but the adaptation is the same, the product should support that change gracefully.

## 6. Every recommendation must be explainable

A recommendation should include:

- Observation
- Interpretation
- Decision
- Next focus
- Confidence level

Avoid vague recommendations such as “keep going” or “push harder.”

## 7. The product should feel like mission control, not a hospital portal

The app should feel premium, calm, focused, and motivating.

Design inspiration:

- WHOOP
- Garmin Connect
- Apple Health
- Linear

Avoid:

- Medical clutter
- Scary red-heavy UI
- Dense forms
- Generic rehab-app language

## 8. Measure only what changes decisions

A metric belongs in the MVP only if a change in that metric could change the plan.

Examples of useful metrics:

- Pain
- Swelling
- Walking confidence
- Quad activation
- Extension
- Sleep
- Previous-day response

Examples of lower-priority metrics:

- Motivation score
- Random wellness notes
- Data that is interesting but not actionable

## 9. The app should be AI-agnostic

Project Phoenix owns the data. AI interprets the data.

The app should export clean context that can be used by ChatGPT, Claude, Gemini, or a future coaching model.

Do not make the data dependent on one AI provider.

## 10. Build for Kevin first, but avoid Kevin-only architecture

The first user is Kevin. The product should be shaped around his needs, motivation style, and rehab journey.

However, the architecture should support future athletes, campaigns, and sports.

## 11. Do not overbuild the MVP

The MVP should focus on:

- Dashboard
- Daily Check-In
- Coach Packet export
- Missions
- Milestones
- Recovery IQ
- Coach Journal
- Glossary
- Principles

Everything else is secondary until the daily loop works.
