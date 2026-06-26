# Backlog

Version: 1.1  
Owner: Kevin Sauvageau  
Product: Project Phoenix OS  
Status: Living Document

## P0 — Now

### Phase-Aware Architecture

- Create phase config layer.
- Dashboard reads metrics from active phase config.
- Check-In renders fields from active phase config.
- Fully wire Phase 1 and Phase 2.
- Add placeholder configs for Phase 3-5.

### Recovery Tracks

Add track model:

- Symptoms
- ROM
- Activation
- Walking / Movement
- Capacity
- Return to Sport

### Fix Missions / Phases Overlap

- Do not treat Mission 1 = Phase 1, Mission 2 = Phase 2.
- Add Campaign > Phase > Recovery Tracks > Missions > Milestones > Quests model.
- Rename Phase 2 to Activation + Early ROM.

### Add Flexion / ROM Support

- Track extension and flexion.
- Add gentle flexion-related quest support.
- Add ROM milestones for extension and flexion.

### Fix Readiness Logic

- Separate surgical baseline swelling from activity-induced swelling.
- Day 0-3 swelling 4-6/10 should usually produce Modify, not Recover, when pain is low and walking is acceptable.

### Fix Quest Generation

- Remove hardcoded quest list.
- Generate quests from phase, track, recovery day, check-in values, previous response, and constraints.
- Add quest source/reason field.

## P1 — Next

### Small Wins Engine

- Rule-based win generation.
- Manual evening win selection.
- Dashboard shows highest-priority win only.

### Coach Packet Improvements

- Include phase, active tracks, swelling context, ROM status, previous evening response, and small wins.

### Better Extension Input

- Replace precise degree input with home-friendly bands for early post-op.

## P2 — Later

- Trend charts.
- Training log.
- Strength progressions.
- Sport confidence tracking.
- Return-to-skating module.
- Wearables integration.
