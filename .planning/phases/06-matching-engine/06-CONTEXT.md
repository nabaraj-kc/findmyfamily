# Phase 6: Matching Engine & Match Review

## Context
As missing person reports and found person reports accumulate in the system, manual review becomes a bottleneck. We need an automated heuristic matching engine (REQ-005) that constantly compares the two datasets and surfaces high-probability matches for official review (REQ-008).

## Core Requirements
- **Heuristic Matcher (REQ-005)**: A utility algorithm that scores similarity between a Missing Report and a Found Report based on:
  - Gender (strict match or 'other' fallback).
  - Age (within a configurable tolerance, e.g., +/- 5 years).
  - Location (same district gets higher weight).
  - Keywords (overlap in clothing or distinguishing features).
- **Match Review Dashboard (REQ-008)**: A secure UI for trusted volunteers/officials to review the algorithmic suggestions side-by-side and confirm or reject the match.

## UI/UX Pro Max Imperatives
- The side-by-side comparison must be visually distinct, highlighting the overlapping fields in green/success colors so the reviewer can instantly see *why* the algorithm suggested it.
- The review actions (Confirm, Reject) must be clear, primary actions.
