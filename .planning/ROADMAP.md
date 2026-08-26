# Find My Family — Roadmap

## Milestone: v1.0 — MVP Launch (72-hour target)

### Phase 1: Project Foundation & Design System
**Goal:** Initialize Next.js project, establish complete design system (DESIGN_SYSTEM.md), define data model (DATA_MODEL.md), set up bilingual infrastructure, and create the foundational component library.
**Requirements:** REQ-001, REQ-002, REQ-003, REQ-016, REQ-020

### Phase 2: Homepage & Navigation Shell
**Goal:** Build the homepage with hero section, primary CTAs (Report Missing / Report Found), search bar, live stats, emergency hotlines, and the responsive navigation/layout shell that wraps all pages. Include language toggle and data saver toggle.
**Requirements:** REQ-002, REQ-003, REQ-014, REQ-018, REQ-019
**Depends on:** Phase 1

### Phase 3: Report Missing Person Flow
**Goal:** Build the complete multi-step "Report Missing" form: photo upload, basic details, last known location with map, reporter details, review & submit. Include OTP verification stub, Case ID generation, duplicate detection, and offline queueing.
**Requirements:** REQ-004, REQ-005, REQ-006, REQ-011, REQ-017
**Depends on:** Phase 1, Phase 2

### Phase 4: Report Found Person Flow
**Goal:** Build the "Report Found" form mirroring the missing-person structure with status options (Safe/Injured/Deceased), sensitive handling for deceased reports, and moderator routing.
**Requirements:** REQ-005, REQ-007, REQ-011
**Depends on:** Phase 1, Phase 2, Phase 3

### Phase 5: Search, Browse & Case Detail
**Goal:** Build search with filters, list/map toggle views, case detail page with status timeline, photo gallery, location map, "I have information" button, and social share card generation.
**Requirements:** REQ-009, REQ-011, REQ-018
**Depends on:** Phase 1, Phase 2

### Phase 6: Matching Engine & Match Review
**Goal:** Implement fuzzy matching engine (name similarity for Nepali, age/gender/location/photo signals), possible match surfacing, match review UI, and match confirmation flow with SMS notification stubs.
**Requirements:** REQ-008, REQ-012
**Depends on:** Phase 3, Phase 4, Phase 5

### Phase 7: Notifications, Alerts & Follow System
**Goal:** Build SMS notification integration (Sparrow SMS abstracted), in-app push notifications, "Follow this case" system, and notification preferences.
**Requirements:** REQ-012
**Depends on:** Phase 5, Phase 6

### Phase 8: Community Features
**Goal:** Build per-case comment/tips threads, district-level community boards, "How Can I Help" volunteer board, and contributor recognition system.
**Requirements:** REQ-013
**Depends on:** Phase 2, Phase 5

### Phase 9: Verification & Trust System
**Goal:** Build trust tier badges, Official Portal (authenticated dashboard for Police/Red Cross/hospitals), volunteer moderator application/vetting flow, and report abuse system.
**Requirements:** REQ-010, REQ-017
**Depends on:** Phase 5, Phase 6

### Phase 10: Admin & Moderation Dashboard
**Goal:** Build queue-based moderation UI, analytics dashboard, role-based access enforcement, and audit logging.
**Requirements:** REQ-015, REQ-017
**Depends on:** Phase 9

### Phase 11: Reunited Stories & About Pages
**Goal:** Build Reunited/Success Stories page (consent-based), About/How This Works page, Privacy & Data Policy page.
**Requirements:** REQ-011, REQ-014, REQ-018

### Phase 12: PWA, Offline & Performance Optimization
**Goal:** Full PWA implementation (service worker, manifest, install prompt), offline-first for core flows, performance audit and optimization (bundle analysis, image optimization, edge caching config).
**Requirements:** REQ-003, REQ-004, REQ-019, REQ-020
**Depends on:** All previous phases
