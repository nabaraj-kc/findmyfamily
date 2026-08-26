# Phase 2: Homepage & Navigation Shell

## Context
Phase 1 established the foundation (Next.js, Next-Intl, UI/UX Pro Max tokens, typography, and atoms/molecules). Phase 2 focuses on building the primary user-facing shell and the homepage. The goal is to provide immediate, clear paths to the core actions (reporting missing/found persons, searching) while maintaining a calm, premium aesthetic optimized for 3G networks.

## Requirements Addressed
- **REQ-002 (Bilingual Support)**: Integration of LanguageToggle in the header.
- **REQ-003 (Mobile-First & Low-Bandwidth)**: Responsive layout shell, Data Saver toggle.
- **REQ-014 (Homepage & Public Info)**: Hero section with CTAs, Search bar, Live Stats, Emergency Hotlines.
- **REQ-018 (Real Imagery)**: Usage of placeholders for verifiable imagery in the Hero section (to be replaced with actual assets).
- **REQ-019 (Error & Offline States)**: Laying the groundwork in the layout shell for offline indicators.

## Current State
- `src/app/[locale]/layout.tsx` exists as a blank slate.
- `src/app/[locale]/page.tsx` exists as a placeholder.
- Atoms and Molecules are built (`Button`, `SearchBar`, `LanguageToggle`, `StatsCounter`, etc.).
- Design tokens and typography are integrated.
