# Research & Implementation Strategy: Phase 5

## Architecture & State
1. **Mock Data Generation**: Since we don't have a live Postgres database connected yet, we will create a `src/lib/data/mockCases.ts` utility to generate 10-15 realistic mock cases (mixing missing, found safe, and found injured).
2. **Search Page (`/cases`)**: We will use Next.js Server Components for the initial render, and Client Components for the interactive search/filter state.
3. **Filtering Mechanism**: Filters will be pushed to the URL query string (`?status=missing&district=D1`) so that search states are shareable and SSR-friendly.
4. **Case Card Component**: We'll build a `CaseCard` molecule. It will handle its own image fallback if a photo isn't available, maintaining the UI/UX Pro Max aesthetic.
5. **Case Detail Page (`/cases/[caseId]`)**: Dynamic route. Will fetch from `mockCases.ts`.
6. **I Have Information CTA**: Will open a Client Component Modal (`InformationModal.tsx`) to collect the tip. For now, it will simulate a submission and show a success toast/state.

## Map View Strategy
Due to the complexities of integrating a full Leaflet/Mapbox map in a mock environment without API keys, we will build the *Toggle UI* (List vs Map), but the "Map View" will display a beautifully styled placeholder map component, adhering to the UI/UX constraint of not blocking on external dependencies for MVP UI construction.
