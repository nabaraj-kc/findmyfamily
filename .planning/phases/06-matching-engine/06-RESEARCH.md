# Research & Implementation Strategy: Phase 6

## 1. The Matching Algorithm
We will build a deterministic, heuristic scoring function in `src/lib/matching/matcher.ts`.
- **Inputs:** `missingCase`, `foundCase`
- **Output:** A confidence score (`0` to `100`), and a list of `reasons` (e.g., "Age within 2 years", "Same district").
- **Logic:**
  - Base Score = 0
  - Gender mismatch = Immediate 0 (unless one is unknown/other).
  - Age: If within 2 years (+40 pts). If within 5 years (+20 pts).
  - District: If exact match (+30 pts).
  - Text Similarity: Basic word-boundary intersection on `features` and `clothing`. (+10 pts per matching meaningful keyword).

## 2. Match Generation (Mocking the Backend)
Since we lack a real backend cron job, we will create a utility `generatePotentialMatches()` that runs our heuristic against our `mockCases.ts` data and returns pairs with a score > 50.

## 3. The Match Review UI
- Route: `/admin/matches` (Simulating a protected route for MVP).
- **MatchCard Component**: A molecule that accepts a `matchPair` object. It renders two columns (Missing on Left, Found on Right) and a central "Confidence Score" ring.
- **Interactivity**: Clicking "Confirm Match" will simulate a database update (changing both statuses to `reunited`) and remove the card from the queue.
