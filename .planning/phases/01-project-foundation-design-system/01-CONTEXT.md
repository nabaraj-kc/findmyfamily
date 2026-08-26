# Phase 1: Project Foundation & Design System - Context

**Gathered:** 2026-08-26
**Status:** Ready for planning
**Source:** PRD Express Path (user prompt)

<domain>
## Phase Boundary

This phase establishes the entire technical and design foundation for Find My Family. It delivers:

1. **Initialized Next.js project** with TypeScript, configured for PWA and mobile-first development
2. **Complete design system** documented in DESIGN_SYSTEM.md — not just color swatches, but a real, opinionated visual identity
3. **Data model** documented in DATA_MODEL.md — full schema for PostgreSQL + PostGIS
4. **Bilingual infrastructure** — i18n framework with Nepali (Devanagari) and English, including all shared strings
5. **Foundational component library** — the reusable atoms and molecules that every subsequent phase builds on
6. **Global CSS / design tokens** — the real CSS that makes everything look cohesive

This phase does NOT build any user-facing pages (those start in Phase 2). It builds the machine that builds the pages.

</domain>

<decisions>
## Implementation Decisions

### Brand & Visual Identity
- Name is "Find My Family" — keep this exact name, no renaming
- Design a calm wordmark, not a stock icon — text-based with a subtle human/connection motif
- Color palette: Deep slate blues as primary, warm off-whites as backgrounds, warm terracotta/marigold as single accent (sparingly for CTAs) — NOT pure white backgrounds, NOT saturated red, NOT generic purple-to-blue gradients
- Full color scale (50–900) for each core color using HSL
- No default component library styling showing through — this must look custom-designed
- The design must NOT look AI-generated: no centered hero with giant emoji, no default shadcn, no symmetric three-icon-card rows, no overuse of rounded-full badges

### Typography
- Must render Devanagari (Nepali script) cleanly alongside Latin script — this is NON-NEGOTIABLE
- Use Noto Sans (which has excellent Devanagari support) as primary, with a humanist fallback stack
- Define a real type scale with specific sizes, weights, and line-heights — not just h1–h6 defaults
- Consider: Noto Sans for body, Noto Serif Devanagari for Nepali headings (or Inter for Latin + Noto Sans Devanagari for Nepali)

### Spacing & Grid
- 8px-based spacing scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128
- Generous whitespace where it calms; tight/dense where it helps scanning (search results)
- Mobile-first 4-column grid, scaling to 8/12 columns on tablet/desktop

### Iconography
- Single consistent icon set — Lucide icons (clean, consistent, good coverage)
- Do NOT mix icon packs

### Imagery Treatment
- Subtle duotone or consistent color-grade over real photos so the whole product feels cohesive
- NOT a stock-photo collage
- Small, unobtrusive photo credits where required by license

### Motion
- Subtle, purposeful micro-interactions only: status changes, form submission confirmations, match notifications
- No gratuitous animation
- Motion communicates state changes — important for low-literacy users

### Tone of Voice
- Warm, plain-language, calm, respectful of grief
- Nepali and English copy sound human-written, never robotic
- No exclamation-point urgency-bait
- "We couldn't find a match for that yet" instead of "No results found"
- "Send this report" instead of generic "Submit"

### Technology Choices
- Next.js 14+ with App Router and TypeScript
- next-intl or next-i18next for bilingual support
- PostgreSQL + PostGIS (schema defined, not necessarily deployed in this phase)
- CSS Modules or vanilla CSS for styling (not Tailwind unless user asks) — design tokens as CSS custom properties
- Component architecture: atoms (Button, Input, Badge, Icon) → molecules (FormField, Card, SearchBar) → organisms (Navigation, FormWizard, CaseCard)

### Bilingual Infrastructure
- Default language: Nepali for users geolocated in Nepal, English otherwise
- Persistent language toggle visible on every page
- All UI strings in translation files from day one — no hardcoded English
- Translation keys organized by feature area

### Data Model Decisions
- Person records with full profile (photo, name, nickname, age, gender, features, last location)
- Case records linking Person to Reporter with status history timeline
- Match suggestions with confidence scores and review state
- Users with role-based access (Public, Volunteer, Official, Admin)
- Comments/tips per case (moderated)
- District boards with posts
- Notifications (SMS + in-app) with delivery tracking
- All timestamps in UTC, displayed in Nepal Time (NPT, UTC+5:45)
- Case IDs: format MP-YYYY-NNNN (e.g., MP-2026-0842)
- Geospatial columns using PostGIS for last-known locations

### the agent's Discretion
- Exact component API signatures (props interfaces)
- CSS architecture details (modules vs. vanilla with BEM)
- Specific PostGIS column types and indexes
- i18n library choice (next-intl vs next-i18next — pick whichever has better App Router support)
- Testing framework setup (Jest, Vitest, etc.)
- Linting/formatting config (ESLint, Prettier)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

No external specs — requirements fully captured in decisions above and in REQUIREMENTS.md (REQ-001, REQ-002, REQ-003, REQ-016, REQ-020).

</canonical_refs>

<specifics>
## Specific Ideas

- The color palette should evoke Nepal's landscape — slate blues like mountain stone, warm terracotta like temple brick, cream like prayer flag fabric
- Consider a subtle gradient in the primary palette that feels like dawn light over mountains — calming, not decorative
- The wordmark could incorporate a subtle path/bridge motif — connecting people, not a literal magnifying glass or person icon
- Voice input support should be scaffolded at the component level (a VoiceInput wrapper) even if not fully implemented until Phase 3
- The Button component should have a "warm" variant for emotionally important actions ("Send this report") distinct from standard CTAs

</specifics>

<deferred>
## Deferred Ideas

- Actual database deployment (Phase 1 defines the schema; deployment is infrastructure work)
- Service worker / PWA manifest (Phase 12)
- SMS gateway integration (Phase 7)
- Actual OTP verification implementation (Phase 3 stubs it)

</deferred>

---

*Phase: 01-project-foundation-design-system*
*Context gathered: 2026-08-26 via PRD Express Path*
