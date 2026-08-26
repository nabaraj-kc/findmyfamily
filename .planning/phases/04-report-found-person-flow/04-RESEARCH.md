# Research & Implementation Strategy: Phase 4

## Architectural Approach
1. **Component Reuse:** We will reuse the `FormWizard` organism (`src/components/organisms/FormWizard`) created in Phase 3. It proved resilient and scalable.
2. **Distinct Components:** While we could theoretically reuse the exact step components from `report-missing`, the UX copy, translation keys, and context differ heavily (e.g., "Where did you find them?" vs "Where were they last seen?"). Thus, we will create dedicated components inside `src/app/[locale]/report-found/components/`.
3. **The Status Step:** A new `StatusStep.tsx` will be introduced early in the flow. It will act as a structural modifier.
4. **Deceased Handling:** The Next.js Server Action (`submitReportFound`) will inspect the `status` field. If `status === 'deceased'`, the database payload (simulated) will force `is_published: false` and `trust_tier: 'community'`, awaiting official review.
5. **Success Page Routing:** The success page for found reports will conditionally render messaging. If deceased, it will reassure the reporter that authorities have been notified securely, rather than stating it's on the public board.

## Data Structure (simulated)
```typescript
interface FoundReportData {
  status: 'safe' | 'injured' | 'deceased';
  fullName?: string;
  age?: string;
  gender?: string;
  foundLocation?: string;
  district?: string;
  features?: string;
  clothing?: string;
  reporterName: string;
  reporterPhone: string;
  relationship: string;
  privacyConsent: boolean;
}
```
