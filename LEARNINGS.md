# Learnings

## 2026-03-05 — 3-Panel Signal Demo in Hero

- **Inline styles vs Tailwind margin classes**: Never mix Tailwind `mb-*` classes with inline `style={{ margin: 0 }}` — the inline style wins and kills the Tailwind margin. Use inline `margin` consistently when the element already uses inline styles.
- **Reference codebase styling**: The minimalistic signal-new UI uses a specific design system:
  - Signal surfaces: `linear-gradient(168deg, #f3f5ed 0%, #e7ead9 100%)`
  - Rolodex surfaces: `linear-gradient(168deg, #f5ebe3 0%, #e8ddd1 100%)`
  - Paper grain: SVG feTurbulence data URL with `mixBlendMode: "overlay"` at ~0.035 opacity
  - Fonts: Courier New mono for data/labels, Georgia serif for insight/italic text
  - Labels: 8-10px uppercase Courier, letterSpacing 0.12-0.14em, color `rgba(80,50,30,0.48)`
  - Accent green: `rgba(80,100,60,0.6)`
- **Context panel toggle**: Simplest approach is conditional rendering — show inbox OR context panel in the same flex slot. No need for complex grid column transitions.
- **Demo data**: Full signal and profile data lives in the minimalistic project at `app/signal-new/mockData.ts` and `app/profile/mockData.ts`. Profiles keyed by slugified names.
- **Project uses Next.js 16.1.6 with Turbopack** and framer-motion for animations.

## 2026-03-13 — Unified 3-Section Scroll (Network + Insights + Keep Up)

- **Scroll budget management**: When adding a new section to a shared scroll container, all existing progress values must be remapped proportionally. With 3 sections (Network, Insights, Keep Up) the container went from 1000vh → 1500vh. Factor of ~0.65 on all existing values, then Keep Up fills 0.67–0.94.
- **Reusable BridgeText**: Made bridge text a generic component accepting `enterRange` tuple + children. Two instances: "but a map only shows..." (Network→Insights) and "intelligence without action..." (Insights→Keep Up).
- **Movement B exit opacity**: `InsightsMovementB` needs an explicit exit (`[0.65, 0.68]`) before Keep Up enters. Previously it relied on the section-level exit which was at 0.96. Now it uses a combined enter+exit: `[0.52, 0.55, 0.65, 0.68]` on a single `moveOpacity` transform.
- **NudgeCard internal stagger**: Each nudge card has 3 layers of staggered animation: card body (opacity+y+x), suggested message (+0.02 delay), and action buttons (+0.04 delay). Each layer has its own `useTransform` — cannot share across layers since they have different scroll ranges.
- **SVG pathLength trick**: Using `pathLength={1}` with `strokeDasharray="1"` and animating `strokeDashoffset` from 1→0 creates a smooth path-draw effect. Works for solid lines; for dashed lines, just fade opacity instead.
- **Person data model**: Embedding `radial`, `grouped`, and `enterAt` directly in the Person objects (instead of separate lookup dictionaries) eliminates 5 separate Record types and simplifies component signatures.
- **Left panel crossfade count**: With 3 sections, the left panel now has 3 labels, 4 headlines, and 5 subtexts all crossfading. The `minHeight` on the headline container should be increased (100→120) to accommodate longer text like the Keep Up headline.
