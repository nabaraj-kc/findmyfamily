# Phase 5 Validation Checklist

## Functional Requirements (REQ-009, REQ-011)
- [ ] Users can browse a directory of active cases at `/cases`.
- [ ] The case directory can be filtered by status and district via URL search parameters.
- [ ] Users can view a detailed profile of a case at `/cases/[caseId]`.
- [ ] Case Detail page contains an "I Have Information" CTA.
- [ ] Deceased cases from the mock data are explicitly filtered out of the public directory.

## UI/UX Pro Max Fidelity
- [ ] `CaseCard` uses proper spacing, typography, and image fallbacks (placeholder if no image).
- [ ] The layout handles responsive breakpoints smoothly (grid to list).
- [ ] The `InformationModal` looks secure and compassionate.

## Architecture & Code Quality
- [ ] Mock data is strongly typed to the `DATA_MODEL.md` schema.
- [ ] Search page uses Server Components for data fetching and Client Components for URL manipulation.
