# Phase 1: Project Foundation & Design System — Research

## RESEARCH COMPLETE

### 1. Next.js Project Setup

**Recommended approach:**
- `npx create-next-app@latest ./` with TypeScript, ESLint, App Router enabled
- Do NOT use Tailwind (per user requirement — vanilla CSS with custom properties)
- Use `src/` directory structure for clean separation

**Folder structure:**
```
src/
  app/           # Routes, layouts, pages (App Router)
  components/    # Reusable UI components (atoms/molecules/organisms)
  lib/           # Shared logic, utilities, db clients
  hooks/         # Custom React hooks
  services/      # Domain business logic, API calls
  types/         # TypeScript interfaces
  constants/     # App-wide constants
  i18n/          # Translation files and config
  styles/        # Global CSS, design tokens
```

**PWA approach (Next.js 14+):**
- Use `app/manifest.ts` for native PWA manifest support
- For service workers / offline: use `@ducanh2912/next-pwa` or `Serwist` (actively maintained for App Router)
- Avoid deprecated `next-pwa`

**Performance patterns:**
- React Server Components (RSC) by default — `'use client'` only for interactivity
- `next/image` for automatic image optimization
- `next/font` for optimized font loading (critical for Devanagari fonts)
- Strict TypeScript mode

### 2. Bilingual Typography (Devanagari + Latin)

**Font selection:**
- **Noto Sans** for Latin text — excellent readability, humanist feel
- **Noto Sans Devanagari** for Nepali — gold standard for Devanagari web rendering, handles complex conjuncts and ligatures correctly
- Both available via Google Fonts / self-hosted WOFF2

**Critical rendering considerations:**
- Use `font-display: swap` to prevent invisible text during load
- Devanagari requires more vertical space (matras, shirorekha) — increase `line-height` and padding in interactive elements
- Self-host fonts in WOFF2 format for best compression and reliability on poor connections
- Use `lang="ne"` attribute on Nepali text sections for screen readers and script-specific styling
- NEVER use legacy fonts (Preeti, Kantipur) — not Unicode-compliant, breaks SEO and accessibility

**Implementation with next/font:**
```typescript
import { Noto_Sans, Noto_Sans_Devanagari } from 'next/font/google'

const notoSans = Noto_Sans({ subsets: ['latin'], variable: '--font-latin' })
const notoSansDevanagari = Noto_Sans_Devanagari({ subsets: ['devanagari'], variable: '--font-devanagari' })
```

### 3. Internationalization (i18n)

**Decision: `next-intl`** — best fit for this project because:
- Purpose-built for Next.js App Router (first-class Server Component support)
- Simpler API than next-i18next
- Excellent TypeScript support with key autocompletion
- Smaller runtime overhead (critical for 3G performance)
- We don't need cross-platform sharing (no React Native, no other frontends)

**Setup pattern:**
- Middleware for locale detection (geolocation-based default to Nepali for Nepal)
- Message files: `messages/en.json`, `messages/ne.json`
- Organized by feature area: `common`, `report`, `search`, `case`, `navigation`, etc.
- Persistent language toggle storing preference in cookie

### 4. CSS Design System Architecture

**Approach: CSS Custom Properties (design tokens) + CSS Modules**

**Color palette strategy (HSL-based 50–900 scale):**
- Define H (hue) and S (saturation) as base variables
- Generate 50–900 scale by varying L (lightness)
- Create both primitive tokens (`--color-slate-500`) and semantic/functional tokens (`--color-bg-primary`, `--color-text-body`)
- Semantic tokens enable theming (light/dark, high-contrast) by remapping

**Chosen palette direction:**
- **Primary (Slate Blue):** H≈215, S≈30-40% — mountain stone, quiet confidence
- **Surface (Warm Off-White):** H≈35, S≈15-30%, L≈95-98% — not pure white, feels warm and calming
- **Accent (Terracotta/Marigold):** H≈25-35, S≈75-85% — Nepali temple brick, used SPARINGLY for CTAs only
- **Semantic colors:** Muted success green, gentle warning amber, soft error (not screaming red)

**Spacing scale (8px base):**
```
--space-1: 4px    --space-2: 8px    --space-3: 12px
--space-4: 16px   --space-5: 20px   --space-6: 24px
--space-8: 32px   --space-10: 40px  --space-12: 48px
--space-16: 64px  --space-20: 80px  --space-24: 96px
```

**Grid system:**
- Mobile: 4-column, 16px gutters
- Tablet: 8-column, 24px gutters
- Desktop: 12-column, 32px gutters
- Max content width: 1200px

### 5. PostGIS Data Model

**Schema architecture:**
- Use `GEOGRAPHY(POINT, 4326)` for last-known locations (WGS84 coordinates — standard GPS)
- GiST indexes on all spatial columns for proximity search
- `TIMESTAMPTZ` for all timestamps (UTC storage, NPT display)

**Key tables (to document in DATA_MODEL.md):**
```
persons         — name, nickname, age, gender, features, photos
cases           — links person to reporter, status history, case_id (MP-YYYY-NNNN)
case_status_log — timeline of all status changes with source attribution
reporters       — contact info (private), relationship to missing person
matches         — potential matches between missing/found with confidence scores
users           — accounts with roles (public, volunteer, official, admin)
comments        — per-case tips/comments with moderation state
districts       — Nepali districts with geospatial boundaries
district_posts  — community board posts per district
notifications   — SMS and in-app notification queue with delivery state
```

**Geospatial queries needed:**
- Proximity search: `ST_DWithin(location, point, radius_meters)`
- District containment: `ST_Contains(district_boundary, point)`
- Nearest-neighbor: `ORDER BY location <-> point LIMIT n`

### 6. Icon Library

**Decision: Lucide React**
- Tree-shakable (only imports used icons)
- Consistent visual style
- Good coverage for this domain (search, map, phone, camera, user, alert, check, etc.)
- Customizable via props: `size`, `color`, `strokeWidth`
- Install: `npm install lucide-react`
- Add `lucide-react` to `transpilePackages` in `next.config.js` for dynamic imports

### 7. Nepal Emergency Hotline Numbers (VERIFIED)

These are real, official numbers sourced from Nepal government and humanitarian organizations:

| Service | Number | Source |
|---------|--------|--------|
| Nepal Police | 100 | Official |
| Fire Brigade | 101 | Official |
| Ambulance | 102 | Official |
| Nepal Red Cross | 1130 | Official |
| Bipad (Disaster Emergency) | 1234 | NDRRMA |
| Disaster/Monsoon Emergency | 1149 | Official |
| Armed Police Force | 1114 | Official |
| Ministry of Home Affairs | 1112 | Official |
| Child Helpline | 1098 | Official |
| Women Helpline | 1145 | Official |

### 8. Component Architecture

**Atoms (primitive building blocks):**
- Button (variants: primary, secondary, warm, ghost, danger)
- Input (text, tel, textarea — with voice input scaffold)
- Select / Dropdown
- Badge (trust tier, status, case ID)
- Icon (Lucide wrapper with consistent sizing)
- Spinner / Loading
- Avatar / PhotoPlaceholder
- ProgressBar / ProgressDots

**Molecules (composed atoms):**
- FormField (label + input + error + helper text)
- SearchBar (input + icon + voice button)
- Card (photo + text + badges — reusable for cases, matches, etc.)
- StatsCounter (number + label, for homepage stats)
- LanguageToggle
- DataSaverToggle
- CaseIdBadge

**Organisms (complex compositions):**
- Navigation (header + nav links + language toggle + auth)
- FormWizard (multi-step form with progress indicator)
- CaseCard (photo + name + age + location + status badge + actions)
- MapView (map container with pin clusters — placeholder in Phase 1)
- EmergencyHotlines (formatted list of verified numbers)

---

*Phase: 01-project-foundation-design-system*
*Research completed: 2026-08-26*
