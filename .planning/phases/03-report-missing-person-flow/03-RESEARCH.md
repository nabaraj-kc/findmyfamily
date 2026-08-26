# Phase 3: Research & Technical Decisions

## UI/UX Pro Max Form Design
- The form should utilize a `FormWizard` organism. A wizard (stepper) reduces cognitive load during a traumatic time.
- **Step 1: Photo & Basic Details** (Name, Nickname, Age, Gender). Photo is critical for matching, but must be optional in case they don't have one on their device.
- **Step 2: Location** (Last known district, detailed location, time). Since we lack a complex mapping library for now, we will use a District dropdown (from `constants/districts.ts`) and a text area for "Last Known Location Name / Description".
- **Step 3: Distinguishing Features & Clothing**. Text areas with voice input enabled.
- **Step 4: Reporter Details & Privacy**. Full Name, Phone Number, Relationship. Checkbox for privacy consent.
- **Step 5: Review & Submit**. A read-only summary before confirming.

## Offline Queueing Strategy
- We will use `localStorage` or `IndexedDB` to save form progress automatically.
- For submission: If `navigator.onLine` is false (or the fetch fails due to network), we save the payload to a `pending_submissions` queue in localStorage and show a success message with an "Offline Sync Pending" badge.

## State Management
- For the multi-step form, a simple React Context (`ReportFormContext`) or just lifting state to a parent `ReportWizard` component is sufficient. We will lift state to the parent `ReportMissingWizard` component.

## Server Actions
- Data submission will be handled by a Next.js Server Action (`src/app/actions/reportMissing.ts`). This action will validate the input, generate the Case ID (e.g., MP-2026-[RANDOM_4_DIGIT]), and mock the database insert (since the actual Postgres DB isn't wired up in Phase 3 yet).
