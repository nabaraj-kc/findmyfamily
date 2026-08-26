# Phase 6 Validation Checklist

## Functional Requirements
- [ ] Heuristic matching algorithm accurately identifies similarities between a Missing case and a Found case (Age, Gender, District).
- [ ] The engine generates a confidence score 0-100 and a list of human-readable reasons.
- [ ] `/admin/matches` displays a queue of these algorithmic matches.
- [ ] Officials can view the data side-by-side and interact with Confirm/Reject actions.

## UI/UX Pro Max Fidelity
- [ ] `MatchCard` is easily scannable, drawing the eye to the similarities.
- [ ] The Confidence Score uses color theory (e.g., Green for >80, Yellow for >50).

## Architecture & Code Quality
- [ ] Core matching logic is decoupled from UI in `src/lib/matching/matcher.ts` so it can eventually be moved to a backend service/cron job.
