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
