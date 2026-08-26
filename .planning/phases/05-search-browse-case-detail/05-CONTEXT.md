# Phase 5: Search, Browse & Case Detail

## Context
Phase 5 shifts the platform from "data ingestion" (Reporting Missing/Found) to "data consumption" and community action. The goal is to provide a comprehensive, searchable directory of cases and detailed views for each case.

## Core Requirements (REQ-009, REQ-011)
- **Browse & Search (`/cases`)**: A public directory with a search bar (name, case ID) and filters (status, district).
- **Case Detail (`/cases/[caseId]`)**: A dedicated page for each case showing a status timeline, location map, and photo.
- **"I Have Information" Action**: A primary CTA on the case detail page for users to submit tips anonymously/securely.
- **Dignity & Privacy**: Result cards must be dignified. Deceased cases are *never* shown here (enforced in mock data/queries).

## UI/UX Pro Max Imperatives
- Searching must feel instant.
- The `CaseCard` component must look premium and compassionate—no harsh colors unless signifying critical status.
- The layout should seamlessly transition from a grid view to a list view on mobile.
