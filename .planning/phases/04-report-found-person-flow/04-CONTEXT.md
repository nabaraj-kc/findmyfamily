# Phase 4: Report Found Person Flow

## Context
Following the successful implementation of the missing person reporting flow, Phase 4 focuses on the inverse: reporting a *found* person. 

This flow serves individuals, volunteers, or officials who have located someone and want to update the platform. It structurally mirrors the missing person flow to maintain UI consistency, but introduces critical new sensitivities.

## Core Requirements (REQ-007)
- **Status Reporting:** Must include a step to declare the condition of the found person: `Safe`, `Injured`, or `Deceased`.
- **Sensitive Handling:** Reports marked as `Deceased` must **never** be auto-published to the public feed. They must be routed directly to a moderator/official verification queue.
- **Offline Resilience:** Must utilize the same offline queueing mechanism built in Phase 3.
- **Bilingual Interface:** Fully translatable flow via `next-intl`.
