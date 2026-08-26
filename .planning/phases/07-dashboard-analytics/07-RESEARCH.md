# Research & Implementation Strategy: Phase 7

## Data Aggregation Strategy
Since we are using `mockCases.ts` as our database, we will build utility functions within a new `src/lib/data/analytics.ts` file to calculate the necessary metrics:
1. `getTotalMissing()`
2. `getTotalFound()`
3. `getPendingModeration()` (Deceased or Community-trust tier cases)
4. `getRecentActivity(limit)`

## Component Architecture
1. **KPICard (Molecule)**: A reusable card that takes a `title`, `value`, `icon`, and `trend` (e.g., "+12% today"). 
2. **Dashboard Layout**: We will implement a standard dashboard layout with a Top Nav (or Side Nav) for the `/admin` routes. For the MVP, a simple Top Nav specifically for the Admin area is sufficient.
3. **Activity Table (Organism)**: A simple, cleanly styled table listing recent cases, their status, and when they were added.

## Routing
- `/admin` will be the primary dashboard.
- We will add a link from the `/admin` dashboard to the `/admin/matches` queue we built in Phase 6.
