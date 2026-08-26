# Phase 3: Report Missing Person Flow

## Context
Phase 3 builds the core data entry point of the platform. It handles the sensitive process of a user reporting a missing loved one. The flow must be a multi-step guided wizard to avoid overwhelming the user, optimized for mobile (touch targets, voice inputs), and capable of queuing data if the connection drops.

## Requirements Addressed
- **REQ-004 (Offline-First Core Flows)**: Queue submissions locally, sync when connection returns.
- **REQ-005 (Accessibility)**: Voice input on text fields, photo-first reporting with guided prompts.
- **REQ-006 (Report Missing Person)**: Multi-step guided form: Photo upload → Basic details → Last known location (map) → Reporter details → Review & submit. Phone OTP verification. Auto-assigned Case ID.
- **REQ-011 (Privacy & Data Safety)**: Plain-language privacy notice. Reporter contacts never shown publicly.
- **REQ-017 (Security)**: Rate-limit submissions, input sanitization. (Client-side validation and Server Actions setup in this phase).

## Current State
- The Navigation Shell (Header/Footer) and Atoms/Molecules are fully built.
- `FormField` and `Button` components are ready for the forms.
- Data models for `Person`, `Case`, and `Reporter` exist.
