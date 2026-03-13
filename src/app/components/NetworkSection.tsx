"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

// ─── Design Tokens ──────────────────────────────────────────────────────
// Using standard web fonts as fallback, assuming Geist sans/mono are loaded globally via Tailwind
const fonts = {
  sans: "var(--font-geist-sans), system-ui, -apple-system, sans-serif",
  mono: "var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  serif: "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif",
};

// ═══════════════════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════════════════

const founder = {
  name: "Arjun Mehta",
  initials: "AM",
  role: "Co-founder & CEO, Arcline",
  background: "Previously Product at Stripe · Stanford CS '14",
  knownFor: "Fintech infrastructure, developer tools",
};

interface GroupConfig {
  color: string;
  bg: string;
  labelPos: { x: number; y: number };
}

// Refined, premium color palette (softer, more sophisticated)
const groupConfig: Record<string, GroupConfig> = {
  "Previous Colleagues": {
    color: "#166534",
    bg: "#dcfce7",
    labelPos: { x: -18, y: -32 },
  }, // Emerald
  "College Alumni": {
    color: "#5b21b6",
    bg: "#ede9fe",
    labelPos: { x: 18, y: -32 },
  }, // Violet
  "Industry Peers": {
    color: "#9a3412",
    bg: "#ffedd5",
    labelPos: { x: -18, y: 10 },
  }, // Orange/Amber
  "Close Friends": {
    color: "#0369a1",
    bg: "#e0f2fe",
    labelPos: { x: 18, y: 10 },
  }, // Sky Blue
};

const groups = Object.keys(groupConfig);

interface Person {
  id: string;
  name: string;
  initials: string;
  role: string;
  context: string;
  group: string;
  radial: { x: number; y: number };
  grouped: { x: number; y: number };
  enterAt: number;
}

const people: Person[] = [
  {
    id: "p1",
    name: "Priya Venkatesh",
    initials: "PV",
    role: "Engineering Lead, Notion",
    context: "Stripe Infra together '16–'19",
    group: "Previous Colleagues",
    radial: { x: -20, y: -16 },
    grouped: { x: -18, y: -24 },
    enterAt: 0.07,
  },
  {
    id: "p2",
    name: "Marcus Chen",
    initials: "MC",
    role: "VP Product, Ramp",
    context: "Stripe Payments team '15–'19",
    group: "Previous Colleagues",
    radial: { x: -22, y: 4 },
    grouped: { x: -18, y: -12 },
    enterAt: 0.08,
  },
  {
    id: "p3",
    name: "Sarah Kim",
    initials: "SK",
    role: "Founding Engineer, Linear",
    context: "Shipped Stripe Connect together",
    group: "Previous Colleagues",
    radial: { x: -17, y: 20 },
    grouped: { x: -18, y: 0 },
    enterAt: 0.1,
  },
  {
    id: "p4",
    name: "Kavya Iyer",
    initials: "KI",
    role: "Partner, Sequoia Capital",
    context: "Stanford CS '13, same lab group",
    group: "College Alumni",
    radial: { x: -6, y: -26 },
    grouped: { x: 18, y: -24 },
    enterAt: 0.11,
  },
  {
    id: "p5",
    name: "James Liu",
    initials: "JL",
    role: "CTO, Figma",
    context: "Stanford CS '14, classmate",
    group: "College Alumni",
    radial: { x: 10, y: -26 },
    grouped: { x: 18, y: -12 },
    enterAt: 0.12,
  },
  {
    id: "p6",
    name: "Ananya Rao",
    initials: "AR",
    role: "CEO, Cleo Capital",
    context: "Stanford MBA '15, same dorm",
    group: "College Alumni",
    radial: { x: 20, y: -16 },
    grouped: { x: 18, y: 0 },
    enterAt: 0.14,
  },
  {
    id: "p7",
    name: "Rajan Anand",
    initials: "RA",
    role: "GP, Lightspeed Ventures",
    context: "Co-invested in Arcline Series A",
    group: "Industry Peers",
    radial: { x: 22, y: 4 },
    grouped: { x: -18, y: 18 },
    enterAt: 0.15,
  },
  {
    id: "p8",
    name: "Nina Patel",
    initials: "NP",
    role: "COO, Zepto",
    context: "Sequoia portfolio overlap",
    group: "Industry Peers",
    radial: { x: 17, y: 20 },
    grouped: { x: -18, y: 30 },
    enterAt: 0.16,
  },
  {
    id: "p9",
    name: "David Park",
    initials: "DP",
    role: "Staff ML, Google DeepMind",
    context: "Stanford roommate '11–'14",
    group: "Close Friends",
    radial: { x: -4, y: 28 },
    grouped: { x: 18, y: 18 },
    enterAt: 0.18,
  },
  {
    id: "p10",
    name: "Meera Shah",
    initials: "MS",
    role: "Founder, Bloom Health",
    context: "Stanford ACM club together",
    group: "Close Friends",
    radial: { x: 6, y: 28 },
    grouped: { x: 18, y: 30 },
    enterAt: 0.19,
  },
];

// ─── Insights Data ──────────────────────────────────────────────────────

const insights = {
  recent: [
    { text: 'Posted: "NexaFlow hits $5M ARR" — LinkedIn, 2d ago' },
    { text: "TechCrunch mentions NexaFlow in Series A roundup" },
    { text: "Actively looking for enterprise design partners" },
  ],
  personal: [
    { text: "Wife Meera is expecting in April — ask about preparations" },
    { text: "Runs 5K every morning at Cubbon Park" },
    { text: "Prefers Third Wave Coffee over Starbucks" },
  ],
  strategic:
    "Portfolio company. Series A prep underway. Key proof point for Fund I thesis on India B2B SaaS.",
  path: {
    target: {
      name: "Rajesh Jejurikar",
      role: "President, Auto Division, Mahindra",
    },
    intermediary: {
      name: "Priya Venkatesh",
      role: "Engineering Lead, Notion",
      toYou: "Stripe together '16–'19",
      toTarget: "IIT classmate, close friend",
    },
  },
};

// ─── Nudge Data ─────────────────────────────────────────────────────────

interface NudgeData {
  person: { name: string; initials: string; role: string };
  type: string;
  badge: string;
  badgeColor: string;
  badgeBg: string;
  accentColor: string;
  whyNow: string;
  suggested: string;
}

const nudges: NudgeData[] = [
  {
    person: {
      name: "Kavya Iyer",
      initials: "KI",
      role: "Partner, Sequoia Capital",
    },
    type: "reconnect",
    badge: "3mo silent",
    badgeColor: "#854d0e",
    badgeBg: "#fef08a",
    accentColor: "#ca8a04",
    whyNow:
      "Back from Davos. Posted about Fund II closing. Good moment to reconnect.",
    suggested:
      "Congrats on Fund II — saw the news from Davos. Would love to hear how the thesis is evolving. Coffee next week?",
  },
  {
    person: {
      name: "Arjun Mehta",
      initials: "AM",
      role: "Co-founder & CEO, NexaFlow",
    },
    type: "celebrate",
    badge: "milestone",
    badgeColor: "#1e3a8a",
    badgeBg: "#dbeafe",
    accentColor: "#2563eb",
    whyNow:
      "NexaFlow just hit $5M ARR. He posted about it yesterday. This is a moment worth celebrating.",
    suggested:
      "Just saw the $5M milestone — incredible execution. Remember when you were still figuring out pricing at Nasscom? Look how far you've come.",
  },
  {
    person: { name: "Marcus Chen", initials: "MC", role: "VP Product, Ramp" },
    type: "help",
    badge: "new role",
    badgeColor: "#14532d",
    badgeBg: "#dcfce7",
    accentColor: "#16a34a",
    whyNow:
      "Marcus just started at Ramp — first week. You went through the same transition at Stripe. Offer what you learned.",
    suggested:
      "Saw the Ramp move — massive. First 90 days in product at a rocketship are wild. Happy to share what worked for me at Stripe if useful.",
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY
// ═══════════════════════════════════════════════════════════════════════════

function PaperGrain({ id, opacity = 0.04 }: { id: string; opacity?: number }) {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none mix-blend-overlay"
      style={{ opacity }}
    >
      <filter id={id}>
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.8"
          numOctaves="4"
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#${id})`} />
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// NETWORK COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

function FounderCard({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) {
  const rotate = useTransform(scrollYProgress, [0.0, 0.04], [-4, 0]);
  const opacity = useTransform(
    scrollYProgress,
    [0.0, 0.03, 0.27, 0.31],
    [0, 1, 1, 0],
  );
  const scale = useTransform(
    scrollYProgress,
    [0.0, 0.03, 0.2, 0.27],
    [0.94, 1, 1, 0.94],
  );
  const y = useTransform(scrollYProgress, [0.0, 0.03], [30, 0]);

  return (
    <div
      className="absolute left-1/2 top-1/2 z-50 w-[280px]"
      style={{ transform: "translate(-50%, -50%)" }}
    >
      <motion.div
        style={{
          rotate,
          opacity,
          scale,
          y,
          transformOrigin: "center center",
        }}
      >
        <div className="relative w-full overflow-hidden rounded-2xl bg-white/80 backdrop-blur-xl border border-zinc-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.06),0_1px_3px_rgb(0,0,0,0.04)] p-6 flex flex-col">
          <PaperGrain id="founder-grain" opacity={0.03} />

          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center shadow-inner">
              <span
                style={{ fontFamily: fonts.mono }}
                className="text-sm font-semibold text-zinc-600 tracking-wider"
              >
                {founder.initials}
              </span>
            </div>
            <div>
              <div
                style={{ fontFamily: fonts.sans }}
                className="text-[17px] font-medium text-zinc-900 tracking-tight leading-tight"
              >
                {founder.name}
              </div>
              <div
                style={{ fontFamily: fonts.mono }}
                className="text-[11px] text-zinc-500 mt-0.5 tracking-wide"
              >
                {founder.role}
              </div>
            </div>
          </div>

          <div className="h-px w-full bg-gradient-to-r from-zinc-200 to-transparent mb-4" />

          <div className="space-y-4">
            <div>
              <div
                style={{ fontFamily: fonts.mono }}
                className="text-[9px] text-zinc-400 tracking-widest uppercase mb-1"
              >
                Background
              </div>
              <div
                style={{ fontFamily: fonts.serif }}
                className="text-[13px] italic text-zinc-600 leading-relaxed"
              >
                {founder.background}
              </div>
            </div>

            <div>
              <div
                style={{ fontFamily: fonts.mono }}
                className="text-[9px] text-zinc-400 tracking-widest uppercase mb-1"
              >
                Known For
              </div>
              <div
                style={{ fontFamily: fonts.sans }}
                className="text-[12px] font-medium text-zinc-700 leading-snug"
              >
                {founder.knownFor}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function PersonPill({
  person,
  scrollYProgress,
}: {
  person: Person;
  scrollYProgress: MotionValue<number>;
}) {
  const { radial, grouped, enterAt, group } = person;
  const { color, bg } = groupConfig[group];
  const entryEnd = enterAt + 0.015;

  const pillOpacity = useTransform(
    scrollYProgress,
    [enterAt, entryEnd, 0.27, 0.31],
    [0, 1, 1, 0],
  );
  const pillScale = useTransform(
    scrollYProgress,
    [enterAt, entryEnd],
    [0.85, 1],
  );
  const pillRotate = useTransform(
    scrollYProgress,
    [enterAt, entryEnd],
    [-2, 0],
  );

  const xVw = useTransform(scrollYProgress, [0.2, 0.26], [radial.x, grouped.x]);
  const yVh = useTransform(scrollYProgress, [0.2, 0.26], [radial.y, grouped.y]);
  const xCalc = useTransform(xVw, (v) => `calc(${v}vw - 50%)`);
  const yCalc = useTransform(yVh, (v) => `calc(${v}vh - 50%)`);

  return (
    <div className="absolute left-1/2 top-1/2 z-30 pointer-events-auto">
      <motion.div
        style={{
          x: xCalc,
          y: yCalc,
          opacity: pillOpacity,
          scale: pillScale,
          rotate: pillRotate,
        }}
        whileHover={{ scale: 1.03, y: -2, transition: { duration: 0.2 } }}
        className="group relative"
      >
        <div className="relative flex items-start gap-3 w-auto min-w-[200px] max-w-[240px] bg-white/95 backdrop-blur-md border border-zinc-200/80 rounded-xl p-3 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.03)] transition-shadow hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.1)]">
          {/* Subtle group color indicator line */}
          <div
            className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full"
            style={{ backgroundColor: color, opacity: 0.8 }}
          />

          <div
            className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center border shadow-sm"
            style={{
              backgroundColor: bg,
              borderColor: color + "30",
              color: color,
            }}
          >
            <span
              style={{ fontFamily: fonts.mono }}
              className="text-[10px] font-bold tracking-wider"
            >
              {person.initials}
            </span>
          </div>

          <div className="min-w-0 flex-1 pt-0.5">
            <div
              style={{ fontFamily: fonts.sans }}
              className="text-[13px] font-semibold text-zinc-800 tracking-tight leading-none mb-1 truncate"
            >
              {person.name}
            </div>
            <div
              style={{ fontFamily: fonts.mono }}
              className="text-[10px] text-zinc-500 leading-tight mb-1.5 truncate"
            >
              {person.role}
            </div>
            <div
              style={{ fontFamily: fonts.serif, color: color }}
              className="text-[11px] italic leading-snug line-clamp-2"
            >
              {person.context}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function ConnectingLine({
  person,
  scrollYProgress,
}: {
  person: Person;
  scrollYProgress: MotionValue<number>;
}) {
  const { radial, grouped, enterAt } = person;

  const lineOpacity = useTransform(
    scrollYProgress,
    [enterAt - 0.004, enterAt + 0.012, 0.27, 0.31],
    [0, 0.4, 0.4, 0],
  );
  const dashOffset = useTransform(
    scrollYProgress,
    [enterAt - 0.004, enterAt + 0.015],
    [30, 0],
  );

  const endX = useTransform(
    scrollYProgress,
    [0.2, 0.26],
    [radial.x, grouped.x],
  );
  const endY = useTransform(
    scrollYProgress,
    [0.2, 0.26],
    [radial.y, grouped.y],
  );
  const x2 = useTransform(endX, (v) => 35 + v);
  const y2 = useTransform(endY, (v) => 50 + v);

  return (
    <motion.line
      x1={35}
      y1={50}
      x2={x2}
      y2={y2}
      stroke="url(#line-gradient)"
      strokeWidth={0.15}
      strokeDasharray="0.4 0.6"
      strokeLinecap="round"
      style={{ opacity: lineOpacity, strokeDashoffset: dashOffset }}
    />
  );
}

function GroupLabel({
  group,
  scrollYProgress,
}: {
  group: string;
  scrollYProgress: MotionValue<number>;
}) {
  const { color, bg, labelPos } = groupConfig[group];

  const labelOpacity = useTransform(
    scrollYProgress,
    [0.23, 0.26, 0.27, 0.31],
    [0, 1, 1, 0],
  );
  const labelY = useTransform(scrollYProgress, [0.23, 0.26], [10, 0]);

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: `translate(calc(${labelPos.x}vw - 50%), calc(${labelPos.y}vh - 50%))`,
        zIndex: 40,
      }}
    >
      <motion.div
        style={{
          opacity: labelOpacity,
          y: labelY,
          backgroundColor: bg,
          borderColor: color + "20",
        }}
        className="px-3 py-1.5 rounded-full border shadow-sm backdrop-blur-md"
      >
        <span
          style={{ fontFamily: fonts.mono, color: color }}
          className="text-[9px] tracking-[0.15em] uppercase font-bold whitespace-nowrap"
        >
          {group}
        </span>
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// BRIDGE TEXTS
// ═══════════════════════════════════════════════════════════════════════════

function BridgeText({
  scrollYProgress,
  enterRange,
  children,
}: {
  scrollYProgress: MotionValue<number>;
  enterRange: [number, number, number, number];
  children: React.ReactNode;
}) {
  const opacity = useTransform(scrollYProgress, enterRange, [0, 1, 1, 0]);
  const y = useTransform(
    scrollYProgress,
    [enterRange[0], enterRange[1]],
    [24, 0],
  );
  const scale = useTransform(
    scrollYProgress,
    [enterRange[0], enterRange[1]],
    [0.95, 1],
  );

  return (
    <motion.div
      style={{ opacity, y, scale }}
      className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none"
    >
      <div className="text-center max-w-[420px] px-6">
        <div
          style={{ fontFamily: fonts.serif }}
          className="text-[clamp(1.25rem,2vw,1.75rem)] italic text-zinc-400 leading-relaxed tracking-tight"
        >
          {children}
        </div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// INSIGHTS COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

function StaggeredItem({
  scrollYProgress,
  baseEnter,
  index,
  color,
  children,
}: {
  scrollYProgress: MotionValue<number>;
  baseEnter: number;
  index: number;
  color: string;
  children: React.ReactNode;
}) {
  const enterAt = baseEnter + index * 0.008;
  const opacity = useTransform(
    scrollYProgress,
    [enterAt, enterAt + 0.012],
    [0, 1],
  );
  const y = useTransform(scrollYProgress, [enterAt, enterAt + 0.012], [8, 0]);
  const x = useTransform(scrollYProgress, [enterAt, enterAt + 0.012], [-4, 0]);

  return (
    <motion.div style={{ opacity, y, x }} className="flex gap-3 group">
      <div
        className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 opacity-80"
        style={{ backgroundColor: color }}
      />
      <span
        style={{ fontFamily: fonts.sans }}
        className="text-[13px] text-zinc-600 leading-snug"
      >
        {children}
      </span>
    </motion.div>
  );
}

function IntelligenceLayer({
  label,
  color,
  children,
  scrollYProgress,
  enterRange,
}: {
  label: string;
  color: string;
  children: React.ReactNode;
  scrollYProgress: MotionValue<number>;
  enterRange: [number, number];
}) {
  const opacity = useTransform(scrollYProgress, enterRange, [0, 1]);
  const y = useTransform(scrollYProgress, enterRange, [20, 0]);

  return (
    <motion.div
      style={{ opacity, y }}
      className="relative bg-white border border-zinc-100 rounded-xl p-5 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.04)]"
    >
      <div className="flex items-center gap-2 mb-3">
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="6" cy="6" r="4" fill={color} fillOpacity="0.2" />
          <circle cx="6" cy="6" r="2" fill={color} />
        </svg>
        <span
          style={{ fontFamily: fonts.mono, color: color }}
          className="text-[10px] font-bold tracking-[0.15em] uppercase"
        >
          {label}
        </span>
      </div>
      {children}
    </motion.div>
  );
}

function InsightsMovementA({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) {
  const cardOpacity = useTransform(scrollYProgress, [0.34, 0.37], [0, 1]);
  const cardScale = useTransform(
    scrollYProgress,
    [0.34, 0.37, 0.5, 0.53],
    [0.95, 1, 1, 0.95],
  );
  const cardY = useTransform(scrollYProgress, [0.34, 0.37], [40, 0]);
  const exitOpacity = useTransform(scrollYProgress, [0.51, 0.54], [1, 0]);

  return (
    <motion.div
      style={{ opacity: exitOpacity }}
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
    >
      <motion.div
        style={{ opacity: cardOpacity, scale: cardScale, y: cardY }}
        className="w-[min(400px,32vw)] flex flex-col gap-4 pointer-events-auto"
      >
        {/* Identity Header */}
        <div className="bg-zinc-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
          <PaperGrain id="insights-identity-grain" opacity={0.06} />

          <div className="relative z-10">
            <h3
              style={{ fontFamily: fonts.sans }}
              className="text-xl font-medium tracking-tight mb-1"
            >
              {founder.name}
            </h3>
            <p
              style={{ fontFamily: fonts.mono }}
              className="text-[12px] text-zinc-400 mb-3"
            >
              {founder.role}
            </p>
            <p
              style={{ fontFamily: fonts.serif }}
              className="text-[13px] italic text-zinc-300 leading-relaxed"
            >
              {founder.background}
            </p>
          </div>
        </div>

        {/* Signals Container - Subtle gray background to hold the cards */}
        <div className="bg-zinc-50/80 backdrop-blur-md rounded-2xl p-2 border border-zinc-200/60 shadow-inner flex flex-col gap-2">
          {/* Recent Signals */}
          <IntelligenceLayer
            label="Recent"
            color="#2563eb" // Blue
            scrollYProgress={scrollYProgress}
            enterRange={[0.39, 0.42]}
          >
            <div className="flex flex-col gap-2.5">
              {insights.recent.map((s, i) => (
                <StaggeredItem
                  key={i}
                  scrollYProgress={scrollYProgress}
                  baseEnter={0.4}
                  index={i}
                  color="#2563eb"
                >
                  {s.text}
                </StaggeredItem>
              ))}
            </div>
          </IntelligenceLayer>

          {/* Personal Context */}
          <IntelligenceLayer
            label="Remember"
            color="#16a34a" // Green
            scrollYProgress={scrollYProgress}
            enterRange={[0.43, 0.46]}
          >
            <div className="flex flex-col gap-2.5">
              {insights.personal.map((s, i) => (
                <StaggeredItem
                  key={i}
                  scrollYProgress={scrollYProgress}
                  baseEnter={0.44}
                  index={i}
                  color="#16a34a"
                >
                  {s.text}
                </StaggeredItem>
              ))}
            </div>
          </IntelligenceLayer>

          {/* Strategic Context */}
          <IntelligenceLayer
            label="Why They Matter"
            color="#9333ea" // Purple
            scrollYProgress={scrollYProgress}
            enterRange={[0.48, 0.51]}
          >
            <div
              style={{ fontFamily: fonts.serif }}
              className="text-[14px] italic text-zinc-600 leading-relaxed"
            >
              {insights.strategic}
            </div>
          </IntelligenceLayer>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Path Visualization (Movement B) ─────────────────────────────────────

function PathNode({
  label,
  sublabel,
  color,
  bgColor,
  borderColor,
  x,
  y,
}: {
  label: string;
  sublabel?: string;
  color: string;
  bgColor: string;
  borderColor: string;
  x: number;
  y: number;
}) {
  return (
    <div
      className="absolute z-10"
      style={{
        left: `calc(50% + ${x}vw)`,
        top: `calc(50% + ${y}vh)`,
        transform: "translate(-50%, -50%)",
      }}
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="rounded-xl px-4 py-3 min-w-[140px] text-center backdrop-blur-md shadow-[0_8px_24px_-6px_rgba(0,0,0,0.08)] border"
        style={{ backgroundColor: bgColor, borderColor }}
      >
        <div
          style={{ fontFamily: fonts.sans, color }}
          className="text-[14px] font-semibold tracking-tight"
        >
          {label}
        </div>
        {sublabel && (
          <div
            style={{ fontFamily: fonts.mono }}
            className="text-[10px] text-zinc-500 mt-1 truncate"
          >
            {sublabel}
          </div>
        )}
      </motion.div>
    </div>
  );
}

function InsightsMovementB({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) {
  // Combined enter + exit opacity
  const moveOpacity = useTransform(
    scrollYProgress,
    [0.52, 0.55, 0.65, 0.68],
    [0, 1, 1, 0],
  );
  const enterY = useTransform(scrollYProgress, [0.52, 0.55], [30, 0]);

  // Cold path
  const coldOpacity = useTransform(scrollYProgress, [0.55, 0.58], [0, 1]);
  const coldLabelOpacity = useTransform(scrollYProgress, [0.56, 0.58], [0, 1]);

  // Warm path
  const warmOpacity = useTransform(scrollYProgress, [0.58, 0.61], [0, 1]);
  const warmLeg1Dash = useTransform(scrollYProgress, [0.58, 0.61], [1, 0]);
  const warmLeg2Dash = useTransform(scrollYProgress, [0.59, 0.62], [1, 0]);
  const warmLabel1Opacity = useTransform(scrollYProgress, [0.6, 0.62], [0, 1]);
  const warmLabel2Opacity = useTransform(scrollYProgress, [0.61, 0.63], [0, 1]);

  // Bottom elements
  const insightOpacity = useTransform(scrollYProgress, [0.62, 0.64], [0, 1]);
  const insightY = useTransform(scrollYProgress, [0.62, 0.64], [16, 0]);
  const recommendOpacity = useTransform(scrollYProgress, [0.64, 0.66], [0, 1]);
  const recommendY = useTransform(scrollYProgress, [0.64, 0.66], [16, 0]);

  // Node positions
  const youX = -14,
    youY = -6;
  const targetX = 14,
    targetY = -6;
  const midX = 0,
    midY = 10;

  // SVG coordinates
  const sYou = { x: 35 + youX, y: 50 + youY };
  const sTarget = { x: 35 + targetX, y: 50 + targetY };
  const sMid = { x: 35 + midX, y: 50 + midY };

  // Bezier control points
  const coldCp = { x: 35, y: 50 + youY - 8 };
  const warmCp1 = { x: sYou.x + 4, y: (sYou.y + sMid.y) / 2 - 2 };
  const warmCp2 = { x: sTarget.x - 4, y: (sMid.y + sTarget.y) / 2 - 2 };

  return (
    <motion.div
      style={{ opacity: moveOpacity, y: enterY }}
      className="absolute inset-0 pointer-events-none z-20"
    >
      <svg
        viewBox="0 0 70 100"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full z-0"
      >
        {/* Definitions for nicer lines */}
        <defs>
          <linearGradient id="warm-line" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ca8a04" />
            <stop offset="100%" stopColor="#eab308" />
          </linearGradient>
        </defs>

        {/* Cold path */}
        <motion.path
          d={`M ${sYou.x} ${sYou.y} Q ${coldCp.x} ${coldCp.y} ${sTarget.x} ${sTarget.y}`}
          fill="none"
          stroke="rgba(161,161,170,0.4)" // zinc-400
          strokeWidth={0.15}
          strokeDasharray="0.6 0.6"
          style={{ opacity: coldOpacity }}
        />
        {/* Warm leg 1 */}
        <motion.path
          d={`M ${sYou.x} ${sYou.y} Q ${warmCp1.x} ${warmCp1.y} ${sMid.x} ${sMid.y}`}
          fill="none"
          stroke="url(#warm-line)"
          strokeWidth={0.3}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="1"
          style={{ opacity: warmOpacity, strokeDashoffset: warmLeg1Dash }}
        />
        {/* Warm leg 2 */}
        <motion.path
          d={`M ${sMid.x} ${sMid.y} Q ${warmCp2.x} ${warmCp2.y} ${sTarget.x} ${sTarget.y}`}
          fill="none"
          stroke="url(#warm-line)"
          strokeWidth={0.3}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="1"
          style={{ opacity: warmOpacity, strokeDashoffset: warmLeg2Dash }}
        />
      </svg>

      {/* Nodes */}
      <PathNode
        label="YOU"
        color="#2563eb"
        bgColor="#eff6ff"
        borderColor="#bfdbfe"
        x={youX}
        y={youY}
      />
      <PathNode
        label={insights.path.target.name}
        sublabel={insights.path.target.role}
        color="#b91c1c"
        bgColor="#fef2f2"
        borderColor="#fecaca"
        x={targetX}
        y={targetY}
      />
      <motion.div style={{ opacity: warmOpacity }}>
        <PathNode
          label={insights.path.intermediary.name}
          sublabel={insights.path.intermediary.role}
          color="#15803d"
          bgColor="#f0fdf4"
          borderColor="#bbf7d0"
          x={midX}
          y={midY}
        />
      </motion.div>

      {/* Cold path label */}
      <motion.div
        style={{
          opacity: coldLabelOpacity,
          left: "50%",
          top: `calc(50% + ${youY - 8}vh)`,
          transform: "translateX(-50%)",
        }}
        className="absolute z-15"
      >
        <div
          style={{ fontFamily: fonts.mono }}
          className="text-[10px] text-zinc-400 text-center whitespace-nowrap bg-white/80 px-2 py-0.5 rounded-full backdrop-blur-sm border border-zinc-100"
        >
          cold LinkedIn &middot; added 2019 &middot; never messaged
        </div>
      </motion.div>

      {/* Warm labels */}
      <motion.div
        style={{
          opacity: warmLabel1Opacity,
          left: `calc(50% + ${(youX + midX) / 2}vw - 2vw)`,
          top: `calc(50% + ${(youY + midY) / 2}vh + 1vh)`,
        }}
        className="absolute z-15"
      >
        <div
          style={{ fontFamily: fonts.serif }}
          className="text-[12px] italic text-yellow-700 whitespace-nowrap bg-white/80 px-2 py-0.5 rounded-full backdrop-blur-sm shadow-sm"
        >
          {insights.path.intermediary.toYou}
        </div>
      </motion.div>
      <motion.div
        style={{
          opacity: warmLabel2Opacity,
          left: `calc(50% + ${(midX + targetX) / 2}vw + 1vw)`,
          top: `calc(50% + ${(midY + targetY) / 2}vh + 1vh)`,
        }}
        className="absolute z-15"
      >
        <div
          style={{ fontFamily: fonts.serif }}
          className="text-[12px] italic text-yellow-700 whitespace-nowrap bg-white/80 px-2 py-0.5 rounded-full backdrop-blur-sm shadow-sm"
        >
          {insights.path.intermediary.toTarget}
        </div>
      </motion.div>

      {/* Insight badge */}
      <motion.div
        style={{
          opacity: insightOpacity,
          y: insightY,
          left: "50%",
          bottom: "16vh",
          transform: "translateX(-50%)",
        }}
        className="absolute z-20 text-center"
      >
        <div
          style={{ fontFamily: fonts.mono }}
          className="bg-yellow-50 text-yellow-800 border border-yellow-200/60 rounded-full px-5 py-2 text-[12px] font-semibold tracking-wide shadow-sm"
        >
          2 warm hops &gt; 1 cold connection
        </div>
      </motion.div>

      {/* Recommended intro card */}
      <motion.div
        style={{
          opacity: recommendOpacity,
          y: recommendY,
          left: "50%",
          bottom: "5vh",
          transform: "translateX(-50%)",
        }}
        className="absolute z-20 w-[min(340px,26vw)] pointer-events-auto"
      >
        <div className="bg-white/95 backdrop-blur-xl border border-zinc-200/80 rounded-2xl p-5 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.12)]">
          <div className="flex items-center gap-2 mb-3">
            <svg
              className="w-4 h-4 text-emerald-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <span
              style={{ fontFamily: fonts.mono }}
              className="text-[10px] tracking-[0.15em] uppercase text-zinc-500 font-bold"
            >
              Recommended Path
            </span>
          </div>

          <div
            style={{ fontFamily: fonts.sans }}
            className="text-[13px] text-zinc-600 leading-relaxed"
          >
            Ask{" "}
            <span className="font-semibold text-zinc-900">
              {insights.path.intermediary.name}
            </span>{" "}
            for an intro to {insights.path.target.name}. They were in the same
            IIT batch. She introduced you to two others in his circle last year.
          </div>

          <div className="mt-4 flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span
              style={{ fontFamily: fonts.mono }}
              className="text-[11px] font-semibold text-emerald-700"
            >
              High Trust Indicator
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// KEEP UP COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

function NudgeCard({
  nudge,
  scrollYProgress,
  enterRange,
}: {
  nudge: NudgeData;
  scrollYProgress: MotionValue<number>;
  enterRange: [number, number];
}) {
  const opacity = useTransform(scrollYProgress, enterRange, [0, 1]);
  const y = useTransform(scrollYProgress, enterRange, [40, 0]);
  const x = useTransform(scrollYProgress, enterRange, [20, 0]);

  // Stagger internal elements after card enters
  const msgEnter = enterRange[0] + 0.02;
  const msgOpacity = useTransform(
    scrollYProgress,
    [msgEnter, msgEnter + 0.015],
    [0, 1],
  );
  const msgY = useTransform(
    scrollYProgress,
    [msgEnter, msgEnter + 0.015],
    [12, 0],
  );

  const btnEnter = msgEnter + 0.02;
  const btnOpacity = useTransform(
    scrollYProgress,
    [btnEnter, btnEnter + 0.012],
    [0, 1],
  );

  return (
    <motion.div
      style={{ opacity, y, x }}
      className="mb-4 group pointer-events-auto"
    >
      <div className="relative bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] transition-all hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.08)] hover:border-zinc-300">
        {/* Accent tab */}
        <div
          className="absolute left-0 top-6 bottom-6 w-1 rounded-r-full"
          style={{ backgroundColor: nudge.accentColor, opacity: 0.8 }}
        />

        <PaperGrain id={`nudge-${nudge.type}`} opacity={0.02} />

        {/* Header: avatar + name + badge */}
        <div className="flex items-center justify-between mb-4 pl-2">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center border shadow-sm"
              style={{
                backgroundColor: nudge.badgeBg,
                borderColor: nudge.accentColor + "30",
                color: nudge.accentColor,
              }}
            >
              <span
                style={{ fontFamily: fonts.mono }}
                className="text-[10px] font-bold tracking-wider"
              >
                {nudge.person.initials}
              </span>
            </div>
            <div>
              <div
                style={{ fontFamily: fonts.sans }}
                className="text-[14px] font-semibold text-zinc-900 tracking-tight leading-none mb-1"
              >
                {nudge.person.name}
              </div>
              <div
                style={{ fontFamily: fonts.mono }}
                className="text-[10px] text-zinc-500"
              >
                {nudge.person.role}
              </div>
            </div>
          </div>
          <div
            style={{
              fontFamily: fonts.mono,
              color: nudge.badgeColor,
              backgroundColor: nudge.badgeBg,
            }}
            className="px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider"
          >
            {nudge.badge}
          </div>
        </div>

        {/* Why Now */}
        <div className="mb-4 pl-2">
          <div
            style={{ fontFamily: fonts.mono }}
            className="text-[9px] tracking-[0.15em] uppercase text-zinc-400 font-bold mb-1.5"
          >
            Context
          </div>
          <div
            style={{ fontFamily: fonts.sans }}
            className="text-[13px] text-zinc-600 leading-relaxed"
          >
            {nudge.whyNow}
          </div>
        </div>

        {/* Suggested message — staggered */}
        <motion.div
          style={{ opacity: msgOpacity, y: msgY }}
          className="mb-4 pl-2"
        >
          <div
            style={{ fontFamily: fonts.mono }}
            className="text-[9px] tracking-[0.15em] uppercase text-zinc-400 font-bold mb-1.5"
          >
            Draft
          </div>
          <div
            style={{
              fontFamily: fonts.serif,
              borderLeftColor: nudge.accentColor + "40",
            }}
            className="text-[13px] italic text-zinc-700 leading-relaxed bg-zinc-50 rounded-r-lg border-l-2 py-2.5 px-3.5"
          >
            &ldquo;{nudge.suggested}&rdquo;
          </div>
        </motion.div>

        {/* Action buttons — staggered */}
        <motion.div style={{ opacity: btnOpacity }} className="flex gap-2 pl-2">
          <button
            style={{
              fontFamily: fonts.sans,
              backgroundColor: nudge.badgeBg,
              color: nudge.accentColor,
            }}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[13px] font-semibold transition-opacity hover:opacity-80 active:scale-95"
          >
            Review & Send
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </button>
          <button
            style={{ fontFamily: fonts.sans }}
            className="px-4 py-1.5 rounded-lg text-[13px] font-medium text-zinc-500 bg-white border border-zinc-200 transition-colors hover:bg-zinc-50 active:scale-95"
          >
            Dismiss
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}

function KeepUpSection({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) {
  const containerOpacity = useTransform(scrollYProgress, [0.72, 0.75], [0, 1]);

  // Card entrance ranges: each card gets 0.04 to enter, with pauses between
  const cardRanges: [number, number][] = [
    [0.75, 0.79],
    [0.82, 0.86],
    [0.88, 0.92],
  ];

  return (
    <motion.div
      style={{ opacity: containerOpacity }}
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
    >
      <div className="w-[min(440px,32vw)] flex flex-col">
        {nudges.map((nudge, i) => (
          <NudgeCard
            key={nudge.type}
            nudge={nudge}
            scrollYProgress={scrollYProgress}
            enterRange={cardRanges[i]}
          />
        ))}
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN SECTION
// ═══════════════════════════════════════════════════════════════════════════

export default function NetworkSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // ── Left Panel: Section labels (3 crossfading) ──
  const label01Opacity = useTransform(
    scrollYProgress,
    [0.01, 0.04, 0.27, 0.31],
    [0, 1, 1, 0],
  );
  const label02Opacity = useTransform(
    scrollYProgress,
    [0.31, 0.35, 0.64, 0.68],
    [0, 1, 1, 0],
  );
  const label03Opacity = useTransform(
    scrollYProgress,
    [0.68, 0.72, 0.93, 0.96],
    [0, 1, 1, 0],
  );

  // ── Left Panel: Headlines (4 crossfading) ──
  const h1Opacity = useTransform(
    scrollYProgress,
    [0.01, 0.04, 0.27, 0.31],
    [0, 1, 1, 0],
  );
  const h1Y = useTransform(scrollYProgress, [0.01, 0.04], [20, 0]);

  const h2Opacity = useTransform(
    scrollYProgress,
    [0.31, 0.35, 0.51, 0.54],
    [0, 1, 1, 0],
  );
  const h2Y = useTransform(scrollYProgress, [0.31, 0.35], [20, 0]);

  const h3Opacity = useTransform(
    scrollYProgress,
    [0.52, 0.56, 0.64, 0.68],
    [0, 1, 1, 0],
  );
  const h3Y = useTransform(scrollYProgress, [0.52, 0.56], [20, 0]);

  const h4Opacity = useTransform(
    scrollYProgress,
    [0.68, 0.72, 0.93, 0.96],
    [0, 1, 1, 0],
  );
  const h4Y = useTransform(scrollYProgress, [0.68, 0.72], [20, 0]);

  // ── Left Panel: Subtexts (5 crossfading) ──
  const sub1Opacity = useTransform(
    scrollYProgress,
    [0.02, 0.06, 0.17, 0.21],
    [0, 1, 1, 0],
  );
  const sub2Opacity = useTransform(
    scrollYProgress,
    [0.22, 0.26, 0.27, 0.31],
    [0, 1, 1, 0],
  );
  const sub3Opacity = useTransform(
    scrollYProgress,
    [0.35, 0.39, 0.51, 0.54],
    [0, 1, 1, 0],
  );
  const sub4Opacity = useTransform(
    scrollYProgress,
    [0.54, 0.58, 0.64, 0.68],
    [0, 1, 1, 0],
  );
  const sub5Opacity = useTransform(
    scrollYProgress,
    [0.72, 0.76, 0.93, 0.96],
    [0, 1, 1, 0],
  );

  // Section exit
  const sectionOpacity = useTransform(scrollYProgress, [0.96, 1.0], [1, 0]);

  // Shared text classes & styles
  const headlineClass =
    "absolute inset-x-0 top-0 text-[clamp(2rem,3.5vw,3rem)] leading-[1.15] tracking-tight font-medium text-zinc-900";
  const subtextClass =
    "absolute inset-x-0 top-0 text-[15px] leading-relaxed text-zinc-500 tracking-wide";
  const labelClass =
    "absolute inset-x-0 top-0 text-[11px] tracking-[0.2em] uppercase font-bold text-zinc-400";

  return (
    <section
      ref={sectionRef}
      className="relative bg-zinc-50"
      style={{ height: "1500vh" }}
    >
      <motion.div
        className="sticky top-0 h-screen overflow-hidden flex bg-white/50 backdrop-blur-2xl"
        style={{ opacity: sectionOpacity }}
      >
        {/* SVG definition for general lines */}
        <svg className="hidden">
          <defs>
            <linearGradient
              id="line-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#e4e4e7" />
              <stop offset="100%" stopColor="#a1a1aa" />
            </linearGradient>
          </defs>
        </svg>

        {/* ══ Left text panel — 30% ══════════════════════════════ */}
        <div className="w-[30%] h-full flex flex-col justify-center pl-[6vw] pr-[2vw] relative z-40 border-r border-zinc-100/50 bg-white/40 shadow-[4px_0_24px_rgba(0,0,0,0.01)]">
          {/* Section labels — 3-way crossfade */}
          <div className="relative h-6 mb-8">
            <motion.div
              style={{ opacity: label01Opacity, fontFamily: fonts.mono }}
              className={labelClass}
            >
              01 &mdash; Your Network
            </motion.div>
            <motion.div
              style={{ opacity: label02Opacity, fontFamily: fonts.mono }}
              className={labelClass}
            >
              02 &mdash; Insights
            </motion.div>
            <motion.div
              style={{ opacity: label03Opacity, fontFamily: fonts.mono }}
              className={labelClass}
            >
              03 &mdash; Keep Up
            </motion.div>
          </div>

          {/* Headlines — 4-way crossfade */}
          <div className="relative min-h-[200px]">
            <motion.h2
              style={{ opacity: h1Opacity, y: h1Y, fontFamily: fonts.sans }}
              className={headlineClass}
            >
              Brace maps
              <br />
              your world.
            </motion.h2>
            <motion.h2
              style={{ opacity: h2Opacity, y: h2Y, fontFamily: fonts.sans }}
              className={headlineClass}
            >
              Brace knows what
              <br />
              you&apos;d forget.
            </motion.h2>
            <motion.h2
              style={{ opacity: h3Opacity, y: h3Y, fontFamily: fonts.sans }}
              className={headlineClass}
            >
              And paths you
              <br />
              can&apos;t see.
            </motion.h2>
            <motion.h2
              style={{ opacity: h4Opacity, y: h4Y, fontFamily: fonts.sans }}
              className={headlineClass}
            >
              Relationships don&apos;t
              <br />
              die in a fight.
              <br />
              They die in silence.
            </motion.h2>
          </div>

          {/* Spacer */}
          <div className="h-4 w-12 bg-zinc-200/60 rounded-full mb-6" />

          {/* Subtexts — 5-way crossfade */}
          <div className="relative min-h-[100px]">
            <motion.p
              style={{ opacity: sub1Opacity, fontFamily: fonts.sans }}
              className={subtextClass}
            >
              From one profile, we find
              <br />
              who matters — and why.
            </motion.p>
            <motion.p
              style={{ opacity: sub2Opacity, fontFamily: fonts.sans }}
              className={subtextClass}
            >
              Relationships you already have —<br />
              organized by how you know them.
            </motion.p>
            <motion.p
              style={{ opacity: sub3Opacity, fontFamily: fonts.sans }}
              className={subtextClass}
            >
              What they&apos;re building,
              <br />
              what they care about,
              <br />
              what just changed.
            </motion.p>
            <motion.p
              style={{ opacity: sub4Opacity, fontFamily: fonts.sans }}
              className={subtextClass}
            >
              The warmest path,
              <br />
              not the shortest.
            </motion.p>
            <motion.p
              style={{ opacity: sub5Opacity, fontFamily: fonts.sans }}
              className={subtextClass}
            >
              Brace nudges you before
              <br />
              connections fade — so you
              <br />
              show up while it still matters.
            </motion.p>
          </div>
        </div>

        {/* ══ Right visualization panel — 70% ═══════════════════ */}
        <div className="w-[70%] h-full relative overflow-hidden bg-white">
          {/* Elegant background gradients */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-[radial-gradient(ellipse_at_center,rgba(244,244,245,0.8),transparent_70%)] opacity-60" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[radial-gradient(ellipse_at_center,rgba(250,250,250,1),transparent_70%)]" />
          </div>

          {/* ── Network (0% – 31%) ── */}
          <FounderCard scrollYProgress={scrollYProgress} />

          <svg
            viewBox="0 0 70 100"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full z-20 pointer-events-none"
          >
            {people.map((p) => (
              <ConnectingLine
                key={p.id}
                person={p}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </svg>

          {people.map((p) => (
            <PersonPill
              key={p.id}
              person={p}
              scrollYProgress={scrollYProgress}
            />
          ))}

          {groups.map((g) => (
            <GroupLabel key={g} group={g} scrollYProgress={scrollYProgress} />
          ))}

          {/* ── Bridge 1 (28% – 36%) ── */}
          <BridgeText
            scrollYProgress={scrollYProgress}
            enterRange={[0.28, 0.31, 0.33, 0.36]}
          >
            But a map only shows
            <br />
            where things are.
            <br />
            <span className="text-zinc-300">
              Not what&apos;s happening
              <br />
              inside them.
            </span>
          </BridgeText>

          {/* ── Insights Movement A (34% – 54%) ── */}
          <InsightsMovementA scrollYProgress={scrollYProgress} />

          {/* ── Insights Movement B (52% – 68%) ── */}
          <InsightsMovementB scrollYProgress={scrollYProgress} />

          {/* ── Bridge 2 (66% – 73%) ── */}
          <BridgeText
            scrollYProgress={scrollYProgress}
            enterRange={[0.66, 0.69, 0.7, 0.73]}
          >
            <span className="text-zinc-400">
              Intelligence without action
              <br />
              is just trivia.
            </span>
          </BridgeText>

          {/* ── Keep Up (72% – 94%) ── */}
          <KeepUpSection scrollYProgress={scrollYProgress} />
        </div>
      </motion.div>
    </section>
  );
}
