# Find My Family - Design System

**Project:** Find My Family
**Category:** Emergency Response & Family Reunification
**Style Influence:** Premium, Calm, Trustworthy (adapted from "Liquid Glass" without heavy performance penalties)

## Tone of Voice
- Warm, plain-language, calm, respectful of grief
- No exclamation-point urgency-bait
- Positive framing for empty states ("We couldn't find a match yet — check back soon")
- Action labels that feel human ("Send this report" not "Submit")

## Color Palette (Premium Dark + Gold Accent)

**Slate (Primary) — Premium Dark:**
H: 24, S: 10%
50:  hsl(24, 10%, 97%)
100: hsl(24, 10%, 93%)
200: hsl(24, 10%, 82%)
300: hsl(24, 10%, 68%)
400: hsl(24, 10%, 55%)
500: hsl(24, 10%, 43%)
600: hsl(24, 10%, 35%)
700: hsl(24, 10%, 27%)
800: hsl(24, 10%, 19%)
900: hsl(24, 10%, 10%) /* Base #1C1917 */

**Warm Surface — Cream/Off-white:**
H: 35, S: 30%
50:  hsl(35, 30%, 98%)
100: hsl(35, 30%, 95%)
200: hsl(35, 30%, 90%)
300: hsl(35, 30%, 82%)
400: hsl(35, 30%, 70%)
500: hsl(35, 30%, 55%)
600: hsl(35, 30%, 42%)
700: hsl(35, 30%, 30%)
800: hsl(35, 30%, 20%)
900: hsl(35, 30%, 12%)

**Gold/Terracotta Accent — CTA:**
H: 45, S: 90% (Gold)
50:  hsl(45, 90%, 96%)
100: hsl(45, 90%, 90%)
200: hsl(45, 90%, 80%)
300: hsl(45, 90%, 68%)
400: hsl(45, 90%, 56%)
500: hsl(45, 90%, 41%) /* Base #CA8A04 */
600: hsl(45, 90%, 35%)
700: hsl(45, 90%, 25%)
800: hsl(45, 90%, 18%)
900: hsl(45, 90%, 12%)

**Semantic Colors:**
Success:  hsl(152, 40%, 40%)  #3D9970  — confirmed/reunited
Warning:  hsl(40, 80%, 50%)   #E6A817  — pending, needs attention
Error:    hsl(0, 50%, 50%)    #BF4040  — not screaming red
Info:     hsl(210, 50%, 50%)  #4080BF  — informational

## Typography
- **Heading Font:** Lora (Latin)
- **Body Font:** Noto Sans (Latin) / Noto Sans Devanagari (Nepali)
- **Mood:** calm, wellness, relaxing, trustworthy

Type scale (rem-based, 16px root):
--text-xs:    0.75rem / 1rem      (12px)
--text-sm:    0.875rem / 1.25rem  (14px)
--text-base:  1rem / 1.5rem       (16px)
--text-lg:    1.125rem / 1.75rem  (18px)
--text-xl:    1.25rem / 1.75rem   (20px)
--text-2xl:   1.5rem / 2rem       (24px)
--text-3xl:   1.875rem / 2.25rem  (30px)
--text-4xl:   2.25rem / 2.5rem    (36px)
--text-5xl:   3rem / 1.1          (48px)

## Spacing
8px base grid.
--space-0.5: 2px    --space-1: 4px     --space-1.5: 6px
--space-2: 8px      --space-2.5: 10px  --space-3: 12px
--space-4: 16px     --space-5: 20px    --space-6: 24px
--space-8: 32px     --space-10: 40px   --space-12: 48px
--space-16: 64px    --space-20: 80px   --space-24: 96px

## Grid
- Mobile (<640px): 4 columns, 16px gutter, 16px margin
- Tablet (640–1024px): 8 columns, 24px gutter, 24px margin
- Desktop (>1024px): 12 columns, 32px gutter, auto margin, max-width 1200px
