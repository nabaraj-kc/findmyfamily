# Find My Family — Requirements

## Core Requirements

### REQ-001: Design System & Brand Identity
Define and document a complete design system (DESIGN_SYSTEM.md) including: name/wordmark, color palette (50–900 scales), typography (Devanagari + Latin), 8px spacing grid, iconography, imagery treatment, motion principles, and tone of voice. Must feel calm, trustworthy, premium — not generic or AI-generated.

### REQ-002: Bilingual Support (Nepali/English)
Full bilingual UI with persistent language toggle. Default to Nepali for Nepal-geolocated users. All copy in both Devanagari and English. Human-written tone, never robotic.

### REQ-003: Mobile-First & Low-Bandwidth
Mobile-first responsive design for mid/low-range Android. PWA installable. Low-bandwidth mode with data saver toggle. Lazy loading, aggressive compression, edge caching. Usable on 3G.

### REQ-004: Offline-First Core Flows
Report Missing and Search flows must work with intermittent connectivity. Queue submissions locally, sync when connection returns. Clear "pending sync" indicator.

### REQ-005: Accessibility
WCAG 2.1 AA compliance. Large-text/high-contrast mode. Voice input on text fields. Icon-supported forms for low-literacy users. Photo-first reporting with guided prompts.

### REQ-006: Report Missing Person
Multi-step guided form: Photo upload → Basic details (name, nickname, age, gender, distinguishing features) → Last known location (map pin drop + search) → Reporter details → Review & submit. Phone OTP verification. Auto-assigned Case ID (e.g., MP-2026-0842). Duplicate detection.

### REQ-007: Report Found Person
Mirror structure of missing-person form. Status: Found Safe / Found Injured / Found Deceased. Same photo + description fields. Deceased reports never auto-published — route to moderator + official verification.

### REQ-008: Matching Engine
Automated fuzzy matching (name similarity handling Nepali spelling variation, age range, gender, location proximity, basic photo similarity). Possible matches surfaced as review cards — never auto-merged. Human confirmation required. Re-runs on every new report.

### REQ-009: Search & Browse
Primary search bar (name, nickname, location, Case ID). Advanced filters (status, district, age, gender, date). Map view with clustered pins color-coded by status. Dignified result cards. Full case detail page with status timeline, photo gallery, map, "I have information" button, social share card generation.

### REQ-010: Verification & Trust Layers
Three trust tiers: Officially Verified (Police/Red Cross/hospital), Volunteer Verified, Community Reported. Visible badges on every case. Official Portal for authenticated officials. Volunteer moderator tier with vetting flow. Report abuse/flag system.

### REQ-011: Privacy & Data Safety
Reporter contacts never shown publicly. Masked messaging/relay for "I have information." Plain-language privacy notice (both languages). Data retention & deletion policy. Deceased cases require extra consent handling.

### REQ-012: Notifications & Alerts
SMS notifications (report received, match found, status change). In-app push as secondary. "Follow this case" for any user.

### REQ-013: Community & Discussion
Per-case comment/tips thread (moderated). District-level community boards. "How can I help" volunteer/needs matching board. Contributor recognition badges.

### REQ-014: Homepage & Public Information
Clear homepage with two primary actions (Report Missing / Report Found) + search. Live stats bar. Official emergency hotlines (verified, real numbers). Reunited success stories section (consent-based). Current disaster context.

### REQ-015: Admin & Moderation Dashboard
Queue-based moderation UI. Basic analytics. Role-based access (Admin / Official / Volunteer Moderator / Public).

### REQ-016: Data Model
Document in DATA_MODEL.md. Person records, Case records with status history, Match suggestions, Users/roles, Comments, District boards, Notifications. PostgreSQL + PostGIS.

### REQ-017: Security
Rate-limit submissions. Input sanitization. Proper authentication + RBAC for official/admin portals. Audit logging for status-changing actions.

### REQ-018: Real Imagery
Fetch real, verifiably-sourced photographs (government press materials, Wikimedia Commons, UN/humanitarian agencies, Unsplash/Pexels for general). No AI-generated imagery presented as real. Photo credits where required.

### REQ-019: Error & Offline States
Custom-designed 404, offline, and connection-lost states — not default error pages. Designed with same care as primary pages.

### REQ-020: Performance
Fast load on 3G. Responsive images (modern formats). Minimal JS bundle. Edge caching. Core Web Vitals optimized.
