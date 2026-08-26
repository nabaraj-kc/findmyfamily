# Phase 2: Research & Technical Decisions

## UI/UX Pro Max Integration
- **Header**: Needs to be sticky but unobtrusive. We will use a glassmorphism effect (semi-transparent background with backdrop blur) mapped to our `surface` tokens.
- **Hero Section**: Must feel calm and human. Rather than jarring disaster photos, we should use a muted, respectful, high-quality background image (or gradient) with the Gold/Terracotta accent for the primary "Report Missing" CTA.
- **Data Saver Mode**: We need a global state or cookie to track Data Saver preference. When enabled, background images and heavy assets should be suppressed. For now, a React Context provider can manage this state.
- **Navigation Shell**: Next.js App Router's `[locale]/layout.tsx` is the perfect place for the persistent Header and Footer.

## Organism Components Required
1. `Header`: Contains Logo, Desktop/Mobile Nav, LanguageToggle, DataSaverToggle.
2. `Footer`: Contains Emergency Hotlines (from constants), links.
3. `HeroSection`: The homepage banner.
4. `StatsSection`: Displays the 3 live stats (Active, Reunited, Total).

## Dependencies
- We have `lucide-react` for icons.
- We have `next-intl` for translations (already configured).
- We have the base CSS Modules system.
