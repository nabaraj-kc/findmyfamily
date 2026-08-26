# Phase 4 Validation Checklist

## Functional Requirements (REQ-007)
- [ ] User can report a found person via a multi-step form.
- [ ] User can specify if the person is Safe, Injured, or Deceased.
- [ ] Reports for Deceased individuals are structurally flagged for moderation (not auto-published).
- [ ] Uses offline queueing mechanism if submission fails.

## UI/UX Pro Max Fidelity
- [ ] Distinct, sensitive copy used (not just a copy-paste of Missing person flow).
- [ ] `FormWizard` component is successfully re-used.

## Architecture & Code Quality
- [ ] Server Action created for `reportFound`.
- [ ] Clean step separation in `report-found/components`.
