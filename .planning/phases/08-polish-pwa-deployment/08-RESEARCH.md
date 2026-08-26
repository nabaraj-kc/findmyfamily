# Research & Implementation Strategy: Phase 8

## 1. PWA Integration (`@ducanh2912/next-pwa`)
We will use the `@ducanh2912/next-pwa` package, which is the community-standard fork supporting Next.js 14+ and the App Router.
- Install `@ducanh2912/next-pwa`.
- Update `next.config.ts` to wrap our configuration in `withPWA`.
- Create a `public/manifest.json` (or `manifest.webmanifest`) defining the app name ("Find My Family"), short name, description, start url, display mode (`standalone`), and theme color.
- Generate or place placeholder icons in `public/icons/`.

## 2. Meta Tags & Document Configuration
We need to update `src/app/[locale]/layout.tsx` to export standard viewport and theme-color metadata.
```tsx
export const viewport: Viewport = {
  themeColor: '#ffffff', // matching our bg-primary
};
```

## 3. Accessibility & Polish Audit
- Review core components (`Button`, `Badge`, `MatchCard`) to ensure they have sufficient contrast and aria-labels where icons are used without text.
- Ensure all images have `alt` tags.

## 4. Deployment Readiness
- Ensure `npm run build` passes with zero errors (already verified in Phase 7).
- Clean up any dead code or console logs.
