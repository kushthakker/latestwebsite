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

## 2026-03-14 — Movement B Overlap Fix + Keep Up Glass Redesign

- **Movement B node overlap**: The path visualization had nodes and recommendation card overlapping at the bottom. Fix: raised the triangle (youY: -6→-8, targetY: -6→-8, midY: 10→6) and repositioned the recommendation card from `bottom: 5vh` to `top: calc(50% + 20vh)`.
- **Merging floating elements**: The separate "2 warm hops" badge and "Recommended Path" card were two competing floating elements. Merging them into a single glass card with an internal divider is cleaner — the badge becomes a centered header pill inside the card.
- **Glass design system tiers**: The codebase has a 3-tier glass system. Strong (0.92 opacity, blur-3xl, specular 0.6), Standard (0.85-0.88, blur-2xl, specular 0.5), Light (0.80-0.85, blur-xl, specular 0.4). All share `rgba(242,242,247,...)` base, `border-white/40-50`, multi-layer shadow, and `inset 0 1px 0 rgba(255,255,255,X)` specular highlight.
- **NudgeCard glass treatment**: Replaced `bg-white/95` flat cards with proper glass (`rgba(242,242,247,0.88)`, backdrop-blur-2xl, specular inset). Top shimmer line (`linear-gradient(90deg, transparent, accent40, transparent)`) replaces the left accent bar for a more refined look.
- **Card stack depth**: Adding two progressively smaller/more transparent divs below a card (`mx-3 h-2 -mt-1` then `mx-6 h-1.5 -mt-0.5`) creates a convincing stacked-cards depth effect.
- **Scroll-driven rotation**: Adding a subtle `rotate` transform (1.5→0→0→-1) on enter/exit gives NudgeCards a more premium, spring-like feel during scroll transitions.
- **Glass badges/pills**: Replacing solid-bg badges with glass pills (`bg-[rgba(242,242,247,0.8)] backdrop-blur-xl border border-white/40 shadow-[inset...]`) keeps visual consistency across the component.

## 2026-03-14 — Demo Mockup Clip Window + Detail Flow

- **Hero clip window constraint**: `DemoMockup` renders inside a shorter clip window on the landing page, but the true expanded height is owned by the hero animation in `page.tsx`. If the bottom still feels cut off, adjust `demoHeight` there before shrinking the component itself.
- **Background ownership**: The white canvas belongs to the hero clip window in `page.tsx`, not `DemoMockup`. If the user wants the three panels on plain white, strip the outer shell chrome from `DemoMockup` and keep only spacing/grid there.
- **Inset tuning**: The first shell inset was too aggressive. The current balance is an expanded hero of `88vh` with the shell using `h-[calc(100%-3rem)]`, which preserves the frame while giving the panels more usable height.
- **Expanded demo height lives in `page.tsx`**: The hero animation controls the expanded size via `demoHeight`, not inside `DemoMockup`. Keep the inner demo wrapper at the fixed expanded height (`88vh` right now) so the clip window reveals more of a full-size product instead of scaling the product itself.
- **Expansion reveal behavior**: The clip-window animation should reveal from the top as it grows. Do not vertically center the inner `DemoMockup` wrapper during the expanded hero state, and do not switch the inner wrapper to `height: "100%"`, or the user will see a resized middle slice instead of a pure reveal.
- **Hero clip corner treatment**: Once the mockup shell background is removed, the outer hero clip window becomes visible. Keep only the top corners rounded and leave the bottom corners square so the demo doesn’t look like a floating card clipped at the bottom.
- **Grid/flex shrink boundary**: The three-column demo will overflow as a group if the grid items or panel shells keep the default `min-height: auto`. Add `min-h-0` at the grid container, each grid child, and the `GlassSurface` root so the right profile card can scroll internally without stretching the whole row.
- **Reasoning/action spacing**: In the center panel, a `flex-1` reasoning scroller plus a fixed footer creates a dead gap for shorter signals and hides actions for taller ones. Put reasoning and suggested action in the same scroll flow with explicit bottom padding.
- **Bottom-pinned action layout**: If the action block must always stay at the bottom of the center card, make the reasoning card the only flexible scroll region (`flex-1` + `overflow-y-auto`) and keep the action card as a sibling below it with a fixed `mt-*` gap.
- **Action header copy**: The action card already signals intent through the eyebrow label and CTA button, so extra status text like `ready to send` is redundant and can be removed to keep the header cleaner.

## 2026-03-14 — Warm Intro Stage Clarification

- **Show the comparison, then demote it**: For the "paths you can't see" moment, briefly let the cold route appear first, then fade it down once the warm path starts drawing. Keeping both paths equally loud makes the story harder to parse.
- **Sequence beats explanation**: Replacing floating nodes plus scattered labels with explicit `Start / Bridge / Target` cards and verb labels on the connectors makes the intro mechanics legible at a glance.
- **Keep the action tray focused**: Once the flow itself explains `You -> Priya -> Rajesh`, the lower glass tray should only do two jobs: show the actual ask and explain why this intermediary is trusted.
- **Do not reuse draw values for straight bars**: SVG path drawing wants `strokeDashoffset: 1 -> 0`, but connector bars want `scaleX: 0 -> 1`. Using one motion value for both inverts one of the animations.
- **Use container width, not viewport width, inside the right panel**: For the centered warm-intro stage, `w-full max-w-[760px]` inside a padded flex wrapper is more stable than sizing the whole card with `vw`, especially because the stage lives inside a 70% panel rather than the full viewport.
- **Longer stagger reads cleaner here**: The intro sequence feels clearer when each beat gets a little more scroll budget: stage, cold-route compare, first handoff, second handoff, then the explanation tray. Tight ranges made the whole moment feel like one simultaneous reveal.
- **Slightly oversized badges work better than perfectly balanced ones**: The step-number circles and connector arrow bubbles should be a touch larger than the surrounding microcopy, otherwise the eye lands on the text first and misses the motion direction.
