# Learnings

## 2026-03-18 — Mobile Network Title Flicker

- **Do not animate mobile section headlines together with heavy glass cards**: In `NetworkSection` mobile stages, fading/translating the entire stage caused the title block to flicker on mobile Chrome while the blurred glass card below it was compositing. Keep the label/title/subtext on a stable layer and animate only the content card body.
- **`translate3d` + backface guards help text stability**: For mobile reveal wrappers, `translate3d(...)`, `backfaceVisibility: "hidden"`, and `WebkitBackfaceVisibility: "hidden"` are safer than a plain `translateY(...)` on the headline container when nearby elements use `backdrop-blur`.

## 2026-03-19 — Desktop Warm Intro Path Contrast

- **Layered glass on pale backgrounds needs stronger card contrast**: The desktop `Warm Intro Path` card sits on top of a light mesh and a translucent section shell, so `text-zinc-400/500` plus a low-opacity glass fill made the names, roles, and context lines wash out. A more opaque card fill and darker copy (`zinc-500/600/900`) keeps the path legible without redesigning the layout.
- **Subtle dashed SVG paths still need a halo on white**: The cold-outreach arc looked lost against the light background until it used a two-pass stroke (soft light halo + darker dashed line). A single faint dashed stroke is not enough once the card is nested inside multiple white/glass layers.
- **If the alternate path is just visual noise, remove it entirely**: In the same desktop warm-intro card, the cleanest follow-up was deleting the `cold outreach` arc and label instead of continuing to tune a decorative path that competed with the main warm-intro story.
- **Env-dependent clients cannot initialize at module scope in App Router pages**: The homepage imports `WaitlistInput`, so a top-level `createClient(...)` in `src/app/lib/supabase.ts` can kill prerender during `next build` on Vercel when public env vars are missing. Wrap that client in a getter and let the UI fail gracefully instead of crashing the whole page export.
- **Headless Chromium trips an unrelated WebGL overlay here**: Visual checks in headless Playwright currently hit a `THREE.WebGLRenderer` failure inside `OnePercentClub`, which throws the Next dev error overlay over the whole page. For future visual checks of earlier sections, expect that interference or use a non-headless browser path.

## 2026-03-19 — First Network Stage Label Spacing

- **Lower group pills need a true lane, not just a higher pill**: In the first desktop `NetworkSection` stage, the lower labels (`Industry Peers`, `Close Friends`) still felt jammed when only the pill moved. The stable fix is to raise the pill slightly (`~4vh`) and also push the lower two-card stack slightly down (`~16/28vh`) so the pill has breathing room above and below.
- **Move top group pills and people together**: For the upper desktop groups (`Previous Colleagues`, `College Alumni`), shifting only the title pill makes the composition feel detached. If those sections need to move up, nudge the pill and the full three-card stack by the same amount so the internal spacing stays constant.

## 2026-03-18 — Mobile Bridge Spacing

- **Narrative bridge sections need a full mobile viewport**: The `BoldTruthBridge` copy ("So we built something that remembers for you.") looked off-center on phones because the bridge was only `60vh`, so the next section started appearing before the bridge copy reached visual center. Use `min-h-[100svh]` on mobile and keep the shorter bridge only on larger screens.

## 2026-03-18 — Mobile Network Width Usage

- **Do not wrap the first mobile network stage in an extra glass shell**: The mobile `Your Network` stage already contains cardized founder and group blocks. Keeping an additional padded outer container around them wastes horizontal space on phones. Let the inner cards sit directly in the stage flow so they can use the available width.

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

## 2026-03-16 — Demo Vertical Alignment Ownership

- **Bottom toolbar breaks visual centering**: In `DemoMockup`, the main two-panel grid is `flex-1`, but the use-case carousel sits in a separate bottom row with `mt-4` and `shrink-0`. That means the white canvas spends extra height below the panels, so the panel block cannot look vertically centered even though the root wrapper uses symmetric `py-5`.
- **Hero positioning compounds the offset**: In `page.tsx`, the demo is anchored with `absolute bottom-0` and then translated upward with `demoY`. So the clip window itself is bottom-owned, while the interior spacing in `DemoMockup` is also bottom-heavy. If the demo looks high or the top/bottom whitespace feels unequal, check both files together rather than tuning only one.
- **Full mockup centering belongs in `page.tsx`**: If the requirement is to center the complete demo, including the bottom use-case pill, fix the hero lift in `page.tsx`, not `DemoMockup`. The full mockup already uses symmetric outer padding; the anchored-state mismatch came from a hardcoded `demoY` guess (`-6vh`) instead of using the expanded clip height to derive the true centered lift (`-(100 - expandedHeight) / 2`).
- **Reasoning chain scroll ownership**: The inner reasoning text in `DemoMockup` only scrolls because it sits inside a dedicated `overflow-y-auto` wrapper. If the user wants that section to expand naturally, remove the wrapper scroll itself instead of tuning the surrounding card heights.
- **Extra breathing room should come from expanded hero height**: When the reasoning chain becomes non-scrollable and starts clipping against the suggested-action card, increase the expanded demo height slightly in `page.tsx` and keep the fixed inner wrapper height matched. A small bump (`92vh` -> `94vh`) is enough to reveal the full reasoning block without disturbing the anchor math.

## 2026-03-17 — Narrow Layout Branching for Mobile

- **Preserve desktop by branching at the section level**: For this landing page, wide-screen motion is too geometry-heavy to make mobile-safe with a few breakpoints. The cleanest approach is a shared `isNarrow` switch at the page level and separate narrow branches for hero/demo, comparison, network, and the final CTA section.
- **Use `svh` for mobile hero math**: The hero clip-window reveal works on phones only when height values move off `vh` and onto `svh`; otherwise mobile browser chrome makes the expansion and centering feel jumpy.
- **`DemoMockup` mobile needs purposeful compaction**: A good phone version is not the desktop 2-column grid collapsed to one column. The narrow path should use stacked cards, smaller paddings, a horizontally scrollable use-case rail, and selective line clamps/trims so the mockup still fits inside the animated hero shell.
- **Mobile network story reads better as cards than as viewport geometry**: The desktop network section depends on `vw`/`vh` coordinates, sticky split panes, and long scrub ranges. On mobile, the same narrative is clearer as sequential content-flow stages with shorter reveal animations.
- **Disable hover-first affordances on touch**: The constellation ending can stay visually alive on mobile, but tooltips, mouse parallax, and full desktop pixel density are unnecessary. Lower node count, clamp pixel ratio, and let the canvas behave like an ambient backdrop rather than an interactive scene.
- **Phone demos should show hierarchy, not completeness**: The hero mockup looked awkward when mobile tried to show the full signal detail and full rolodex stack at once. A better pattern is one dominant action card plus a compact secondary preview card, which reads like a real phone product surface instead of a squeezed desktop panel.
- **Mobile relationship maps need summaries, not directories**: The first mobile network branch was too tall because each group expanded into a full people list. A 2x2 group summary grid with a couple of representative people and a count cue preserves the idea without turning the section into a long roster.
- **Do not use `scrollIntoView` inside autoplaying horizontal rails on mobile**: In the hero mockup, advancing the active use-case chip with `scrollIntoView` caused the page itself to jump back up on mobile. Use `container.scrollTo({ left })` against the chip-row scroller instead so only the horizontal rail moves.
- **Headline sequencing is coupled to subtitle timing**: In `BoldTruth`, delaying one of the animated headline words also means shifting the subtitle trigger. Otherwise the subtitle starts before the keyword sequence has actually finished.

## 2026-03-18 — Mobile NetworkSection Redesign

- **Unified insights card over separate mini-cards**: The old mobile insights section used 3 separate rounded cards (Recent signals, Personal context, Strategic read). Replacing with a single unified card (header + What's New section + divider + Remember section + divider + Why They Matter section) mirrors the desktop InsightsMovementA and is far more impactful — the $5M ARR headline becomes a hero number, Remember becomes scannable chips, and strategic read becomes a clear badge section.
- **Colored avatar rings on path nodes**: Using `boxShadow: "0 0 0 3px rgba(R,G,B,0.35)"` for the avatar border ring (instead of a colored `border` class) lets the ring color be data-driven from each node without fighting Tailwind's border-color precedence. Sky/emerald/amber for You/Bridge/Target respectively.
- **Edit tool introduces smart/curly quotes**: When using the Edit tool with long `old_string` replacements that contain quoted string values, the tool sometimes replaces straight ASCII double quotes (`"`) with Unicode typographic quotes (`"` / `"`). Fix with: `python3 -c "content = open(f).read(); open(f,'w').write(content.replace('\u201c','\"').replace('\u201d','\"'))"`. Always run `tsc --noEmit` after large edits to catch this.
- **`max-w-lg` vs `max-w-[440px]`**: Changing the outer container from `max-w-[440px]` to `max-w-lg` (512px) gives the cards more breathing room on mid-size phones while still constraining on very wide viewports. The extra ~70px per side makes the group grid and insight card feel properly spacious.
- **CTA button on path section**: Adding "Draft intro request →" as a full-width dark button at the bottom of the mobile path card is a meaningful UX improvement over the desktop version (which has it inside the scroll-driven animation). On mobile it's immediately actionable after reading the path.

## 2026-03-18 — Full Mobile Pass: Text Spacing + Final Polish

- **`<br className="hidden sm:block" />` needs a trailing `{" "}`**: When a `<br>` is hidden on mobile and the preceding text line ends without a space, the text runs together. Pattern: `...sentence end.{" "}<br className="hidden sm:block" />Next sentence`. This was needed in `page.tsx` (hero subtitle) and `BoldTruth.tsx` (subtitle after strikethrough animation). Always check every `hidden sm:block` br in JSX for this.
- **Mobile section audit order**: After redesigning the main demo section, do a full scroll-through of each remaining section at ~390–500px viewport width before closing the task. The easiest way is to use `javascript_tool` to get section `top` offsets and screenshot each one at those scroll positions.
- **`ComparisonTable` already has `MobileStatCard`**: The comparison section renders card-based layout on mobile (passed via `isNarrow`). The desktop HTML `<table>` is never used on mobile — no horizontal overflow risk.
- **`OnePercentClub` self-adapts**: The constellation section already handles `isNarrow` — fewer nodes (72 vs 200), capped pixel ratio, tooltips hidden, reduced scroll height (`260svh` vs `500vh`). No additional changes needed for mobile.
- **`TextHighlightSection` is not on the current page**: Component exists but is not imported in `page.tsx`. Don't waste time fixing its mobile layout.
- **Browser window resize gives ~500px viewport at 390px target**: When using `resize_window` to 390×844, the actual `window.innerWidth` is ~500 because Chrome's extension panel consumes width. `isNarrow` still fires correctly (under 1023px), so all mobile branches are active.

## 2026-03-17 — BoldTruth → NetworkSection Transition Fix

- **Dead space between sections**: BoldTruth's `min-h-screen` + centered flex left ~50vh of white space below text. NetworkSection's sticky frame (split panel, borders, bg) was visible at progress=0 with all content at opacity 0, creating an empty layout flash.
- **Scroll-driven exit on BoldTruth**: Added `useScroll`/`useTransform` to fade out text (opacity 1→0, y 0→-40px) from progress 0.5→0.85. The section keeps its `min-h-screen` height but the text departs gracefully.
- **BoldTruthBridge component**: A 60vh bridge between sections with a connecting phrase ("So we built something that remembers for you."). Fades in/out via scroll progress. Provides narrative continuity without dead space.
- **NetworkSection entrance opacity**: Added `sectionEnterOpacity` (0→1 at progress 0→0.008) combined with existing exit opacity via `Math.min()`. Prevents the empty frame flash — the split-panel layout only appears once content is ready.

## 2026-03-17 — Hero Background Tint Revert

- **Gray hero came from overlay layers, not base canvas**: The hero section already had a white fixed base (`bg-white`), but a blurred `hero-bg.png` layer plus warm radial gradients on top introduced an unintended gray/beige cast.
- **Safest revert is flattening to one fixed white layer**: Replacing the multi-layer background block with a single `fixed inset-0 bg-white` div restores the original white hero without affecting scroll math, sticky behavior, or demo transforms.
- **Penflow descenders can sit behind the next line without explicit stacking**: The handwritten `Concierge` SVG needs a higher z-index (`relative z-20` on the word wrapper and `z-30` on the absolute Penflow layer) so letters like `g` render above "Your Network" instead of being visually cut by the line below.
- **Hero CTA can keep glassmorphism while shifting warm**: For an orange glass button, keep the same structural recipe (backdrop blur, translucent border, specular inset, layered shadow), then swap to warm gradient tones and darker amber text for contrast; this preserves the premium look without reverting to a flat orange pill.
- **Water hover effect works best as moving radial highlights under the label**: Two absolute, blurred radial-gradient circles moving in opposite directions on `group-hover` (`overflow-hidden` + `isolate` on the button) create a believable internal water ripple without JS animation.
- **Minimal logo refresh can preserve brand shape while reducing visual weight**: Reusing the original logo path geometry with `fill="none"`, rounded joins/caps, and a medium stroke creates a cleaner top-left mark that stays recognizable.
- **Subtle logo ambiance should be layered, not flashy**: A slow breathing radial glow behind the mark plus tiny, staggered twinkle stars around it gives premium motion without stealing attention from hero content.
- **For stronger brand anchoring, a larger filled mark reads better than decorative particles**: When the icon itself becomes solid black and scales up, auxiliary micro-elements (stars/circles) can be removed without losing visual presence.

## 2026-03-17 — Desktop Fixed CTA After Demo Exit

- **Use existing hero scroll progress as the trigger source**: `HeroSection` already drives the `DemoMockup` lifecycle with `scrollYProgress`, so the fixed top-right CTA can appear at the same exit threshold (`> 0.86`) without introducing extra observers or duplicated scroll listeners.
- **Prefer motion-value transforms over effect-driven state for scroll UI flags**: Driving `opacity`, `y`, `scale`, and `pointerEvents` with `useTransform` avoids `setState`-in-effect lint errors and keeps the interaction purely scroll-synced.
- **Desktop-only CTA should be gated twice**: Keep both the `!isNarrow` branch and `hidden lg:block` on the fixed element so mobile/tablet flows stay unchanged while desktop gets the persistent post-demo CTA.
- **Hide global fixed CTA when entering endcap section via section observer**: Assign a stable id to the final black section (`one-percent-club-section`) and use an `IntersectionObserver` in `HeroSection` to force the top-right CTA opacity/pointer events to off while the endcap is on screen, so it doesn’t compete with the bottom CTA there.

## 2026-03-17 — Sticky Brand Lockup

- **Top-left logo should be a lockup, not an icon-only chip**: In `FixedLogo`, pairing the animated mark with a `Brace` wordmark (`font-serif`, tight tracking, semibold) reads more intentional and makes the sticky brand anchor legible at a glance while preserving the existing glow/float motion.
- **Collapse wordmark on initial scroll to reduce chrome weight**: Keep the icon persistent, but map the `Brace` wordmark `opacity`, `maxWidth`, and left spacing to `scrollY` over a longer range (0→~140px) so the lockup compacts smoothly instead of disappearing abruptly.
