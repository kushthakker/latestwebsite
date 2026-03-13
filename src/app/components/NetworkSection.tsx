"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

// ─── Design Tokens ──────────────────────────────────────────────────────
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

const groupConfig: Record<string, GroupConfig> = {
  "Previous Colleagues": {
    color: "#2d7d4f",
    bg: "rgba(45,125,79,0.08)",
    labelPos: { x: -18, y: -32 },
  },
  "College Alumni": {
    color: "#5856d6",
    bg: "rgba(88,86,214,0.08)",
    labelPos: { x: 18, y: -32 },
  },
  "Industry Peers": {
    color: "#b3601e",
    bg: "rgba(179,96,30,0.07)",
    labelPos: { x: -18, y: 10 },
  },
  "Close Friends": {
    color: "#2c7be5",
    bg: "rgba(44,123,229,0.07)",
    labelPos: { x: 18, y: 10 },
  },
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
    [0.0, 0.03, 0.33, 0.37],
    [0, 1, 1, 0],
  );
  const scale = useTransform(
    scrollYProgress,
    [0.0, 0.03, 0.29, 0.33],
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
        <div className="relative w-full overflow-hidden rounded-2xl bg-[rgba(242,242,247,0.92)] backdrop-blur-3xl border border-white/50 shadow-[0_4px_16px_rgba(0,0,0,0.05),0_12px_40px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.6)] p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md border border-white/60 flex items-center justify-center">
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

          <div className="h-px w-full bg-gradient-to-r from-zinc-200/80 to-transparent mb-4" />

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
    [enterAt, entryEnd, 0.33, 0.37],
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
        className="group relative"
      >
        <div className="relative flex items-start gap-3 w-auto min-w-[200px] max-w-[240px] bg-[rgba(242,242,247,0.85)] backdrop-blur-2xl border border-white/45 rounded-2xl p-3 shadow-[0_2px_4px_rgba(0,0,0,0.03),0_8px_24px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.5)]">
          <div
            className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center border backdrop-blur-md shadow-sm"
            style={{
              backgroundColor: bg,
              borderColor: color + "30",
              color: color,
            }}
          >
            <span
              style={{ fontFamily: fonts.mono }}
              className="text-[10px] font-semibold tracking-wider"
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
  const { radial, grouped, enterAt, group } = person;
  const { color } = groupConfig[group];

  const lineOpacity = useTransform(
    scrollYProgress,
    [enterAt - 0.004, enterAt + 0.012, 0.33, 0.37],
    [0, 0.35, 0.35, 0],
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
      stroke={color}
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
  const { color, labelPos } = groupConfig[group];

  const labelOpacity = useTransform(
    scrollYProgress,
    [0.23, 0.26, 0.33, 0.37],
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
        }}
        className=""
      >
        <div className="px-3 py-1.5 rounded-full bg-[rgba(242,242,247,0.8)] backdrop-blur-xl border border-white/40 shadow-[0_2px_8px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.4)]">
          <span
            style={{ fontFamily: fonts.mono, color: color }}
            className="text-[9px] tracking-[0.15em] uppercase font-semibold whitespace-nowrap"
          >
            {group}
          </span>
        </div>
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// INSIGHTS COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

function InsightsMovementA({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) {
  const cardOpacity = useTransform(scrollYProgress, [0.40, 0.43], [0, 1]);
  const cardScale = useTransform(
    scrollYProgress,
    [0.40, 0.43, 0.54, 0.57],
    [0.95, 1, 1, 0.95],
  );
  const cardY = useTransform(scrollYProgress, [0.40, 0.43], [40, 0]);
  const exitOpacity = useTransform(scrollYProgress, [0.55, 0.58], [1, 0]);

  const signalsOpacity = useTransform(scrollYProgress, [0.42, 0.45], [0, 1]);
  const signalsY = useTransform(scrollYProgress, [0.42, 0.45], [16, 0]);
  const personalOpacity = useTransform(scrollYProgress, [0.46, 0.49], [0, 1]);
  const personalY = useTransform(scrollYProgress, [0.46, 0.49], [16, 0]);
  const strategyOpacity = useTransform(scrollYProgress, [0.50, 0.53], [0, 1]);
  const strategyY = useTransform(scrollYProgress, [0.50, 0.53], [16, 0]);

  return (
    <motion.div
      style={{ opacity: exitOpacity }}
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
    >
      <motion.div
        style={{ opacity: cardOpacity, scale: cardScale, y: cardY }}
        className="w-[min(400px,30vw)] pointer-events-auto"
      >
        <div className="bg-[rgba(242,242,247,0.92)] backdrop-blur-3xl border border-white/50 rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.05),0_12px_40px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.6)] overflow-hidden">
          {/* Identity — compact row */}
          <div className="px-6 pt-6 pb-5 border-b border-zinc-200/30">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-[rgba(30,30,32,0.88)] backdrop-blur-md flex items-center justify-center border border-white/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.2)]">
                <span
                  style={{ fontFamily: fonts.mono }}
                  className="text-[13px] font-semibold text-white/90 tracking-wider"
                >
                  {founder.initials}
                </span>
              </div>
              <div>
                <div
                  style={{ fontFamily: fonts.sans }}
                  className="text-[20px] font-semibold text-zinc-900 tracking-tight leading-none"
                >
                  {founder.name}
                </div>
                <div
                  style={{ fontFamily: fonts.mono }}
                  className="text-[11px] text-zinc-500 mt-1.5"
                >
                  {founder.role}
                </div>
              </div>
            </div>
          </div>

          {/* Signals — hero number + supporting lines */}
          <motion.div
            style={{ opacity: signalsOpacity, y: signalsY }}
            className="px-6 pt-5 pb-4"
          >
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-600/[0.08] border border-blue-600/[0.12] mb-3.5">
              <div className="w-1 h-1 rounded-full bg-blue-600" />
              <span
                style={{ fontFamily: fonts.mono }}
                className="text-[9px] tracking-[0.12em] uppercase font-bold text-blue-600"
              >
                What&apos;s New
              </span>
            </div>
            <div className="space-y-3">
              <div>
                <div
                  style={{ fontFamily: fonts.sans }}
                  className="text-[32px] font-bold text-zinc-900 tracking-tight leading-none"
                >
                  $5M ARR
                </div>
                <div
                  style={{ fontFamily: fonts.mono }}
                  className="text-[11px] text-zinc-400 mt-1.5"
                >
                  LinkedIn &middot; 2 days ago
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div
                  style={{ fontFamily: fonts.sans }}
                  className="text-[13px] font-medium text-zinc-600"
                >
                  Featured in TechCrunch Series A roundup
                </div>
                <div
                  style={{ fontFamily: fonts.sans }}
                  className="text-[13px] font-medium text-zinc-600"
                >
                  Seeking enterprise design partners
                </div>
              </div>
            </div>
          </motion.div>

          <div className="mx-6 h-px bg-gradient-to-r from-zinc-300/50 to-transparent" />

          {/* Personal — scannable chips */}
          <motion.div
            style={{ opacity: personalOpacity, y: personalY }}
            className="px-6 pt-4 pb-4"
          >
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-600/[0.08] border border-emerald-600/[0.12] mb-3">
              <div className="w-1 h-1 rounded-full bg-emerald-600" />
              <span
                style={{ fontFamily: fonts.mono }}
                className="text-[9px] tracking-[0.12em] uppercase font-bold text-emerald-600"
              >
                Remember
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {["Baby due April", "Runs 5K daily", "Third Wave Coffee fan"].map(
                (item) => (
                  <span
                    key={item}
                    style={{ fontFamily: fonts.sans }}
                    className="px-3 py-1.5 rounded-lg bg-white/50 backdrop-blur-sm border border-white/40 text-[12px] font-medium text-zinc-600 shadow-[0_1px_3px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.5)]"
                  >
                    {item}
                  </span>
                ),
              )}
            </div>
          </motion.div>

          <div className="mx-6 h-px bg-gradient-to-r from-zinc-300/50 to-transparent" />

          {/* Strategic — single bold line */}
          <motion.div
            style={{ opacity: strategyOpacity, y: strategyY }}
            className="px-6 pt-4 pb-6"
          >
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-600/[0.08] border border-purple-600/[0.12] mb-2">
              <div className="w-1 h-1 rounded-full bg-purple-600" />
              <span
                style={{ fontFamily: fonts.mono }}
                className="text-[9px] tracking-[0.12em] uppercase font-bold text-purple-600"
              >
                Why They Matter
              </span>
            </div>
            <div
              style={{ fontFamily: fonts.sans }}
              className="text-[15px] font-medium text-zinc-700 leading-snug"
            >
              Portfolio company &middot; Series A prep &middot; Fund I proof
              point
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Path Visualization (Movement B) ─────────────────────────────────────

function IntroStepCard({
  step,
  eyebrow,
  title,
  subtitle,
  accent,
}: {
  step: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  accent: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-[1.65rem] bg-[rgba(242,242,247,0.88)] backdrop-blur-2xl border border-white/45 shadow-[0_2px_10px_rgba(0,0,0,0.04),0_14px_32px_rgba(0,0,0,0.07),inset_0_1px_0_rgba(255,255,255,0.55)] p-4">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent" />

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div
            style={{ fontFamily: fonts.mono, color: accent }}
            className="text-[9px] font-bold tracking-[0.18em] uppercase"
          >
            {eyebrow}
          </div>
          <div
            style={{ fontFamily: fonts.sans }}
            className="mt-2 text-[15px] font-semibold text-zinc-900 tracking-tight leading-tight"
          >
            {title}
          </div>
          <div
            style={{ fontFamily: fonts.mono }}
            className="mt-2 text-[10px] leading-relaxed text-zinc-500"
          >
            {subtitle}
          </div>
        </div>

        <div
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]"
          style={{
            color: accent,
            backgroundColor: `${accent}14`,
            borderColor: `${accent}26`,
          }}
        >
          <span
            style={{ fontFamily: fonts.mono }}
            className="text-[12px] font-semibold tracking-[0.08em]"
          >
            {step}
          </span>
        </div>
      </div>
    </div>
  );
}

function IntroConnector({
  label,
  accentClassName,
  lineScale,
  labelOpacity,
  labelY,
}: {
  label: string;
  accentClassName: string;
  lineScale: MotionValue<number>;
  labelOpacity: MotionValue<number>;
  labelY: MotionValue<number>;
}) {
  return (
    <div className="relative flex min-w-[88px] flex-1 items-center justify-center px-1 pt-12">
      <motion.div
        style={{ opacity: labelOpacity, y: labelY }}
        className="absolute left-1/2 top-0 z-10 -translate-x-1/2"
      >
        <div className="rounded-full bg-[rgba(242,242,247,0.84)] backdrop-blur-xl border border-white/40 px-3 py-1 shadow-[0_2px_10px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.45)]">
          <span
            style={{ fontFamily: fonts.mono }}
            className={`text-[9px] font-bold uppercase tracking-[0.16em] ${accentClassName}`}
          >
            {label}
          </span>
        </div>
      </motion.div>

      <div className="absolute inset-x-2 top-1/2 h-px -translate-y-1/2 bg-white/60" />
      <motion.div
        style={{ scaleX: lineScale, transformOrigin: "left center" }}
        className={`absolute inset-x-2 top-1/2 h-px -translate-y-1/2 rounded-full bg-gradient-to-r ${accentClassName === "text-blue-600" ? "from-blue-400 via-cyan-400 to-emerald-400" : "from-emerald-400 via-yellow-400 to-amber-400"}`}
      />
      <motion.div
        style={{ opacity: labelOpacity, scale: labelOpacity }}
        className="absolute right-0 top-1/2 -translate-y-1/2"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/70 backdrop-blur-md border border-white/60 shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
          <svg
            className={`h-4 w-4 ${accentClassName}`}
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 10h10m0 0-3-3m3 3-3 3"
            />
          </svg>
        </div>
      </motion.div>
    </div>
  );
}

function InsightsMovementB({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) {
  const moveOpacity = useTransform(
    scrollYProgress,
    [0.56, 0.59, 0.73, 0.76],
    [0, 1, 1, 0],
  );
  const enterY = useTransform(scrollYProgress, [0.56, 0.59], [30, 0]);

  const coldOpacity = useTransform(
    scrollYProgress,
    [0.595, 0.625, 0.66, 0.69],
    [0, 1, 0.25, 0.14],
  );
  const coldLabelOpacity = useTransform(
    scrollYProgress,
    [0.605, 0.625, 0.65, 0.67],
    [0, 1, 0.25, 0],
  );

  const warmOpacity = useTransform(scrollYProgress, [0.625, 0.66], [0, 1]);
  const warmLeg1Dash = useTransform(scrollYProgress, [0.63, 0.658], [1, 0]);
  const warmLeg2Dash = useTransform(scrollYProgress, [0.645, 0.673], [1, 0]);
  const warmLeg1Scale = useTransform(scrollYProgress, [0.628, 0.656], [0, 1]);
  const warmLeg2Scale = useTransform(scrollYProgress, [0.643, 0.671], [0, 1]);
  const stageOpacity = useTransform(scrollYProgress, [0.58, 0.615], [0, 1]);
  const stageScale = useTransform(scrollYProgress, [0.58, 0.615], [0.96, 1]);
  const stageY = useTransform(scrollYProgress, [0.58, 0.615], [24, 0]);

  const coldTagY = useTransform(scrollYProgress, [0.595, 0.625], [10, 0]);
  const youCardOpacity = useTransform(scrollYProgress, [0.605, 0.635], [0, 1]);
  const youCardY = useTransform(scrollYProgress, [0.605, 0.635], [22, 0]);
  const bridgeCardOpacity = useTransform(scrollYProgress, [0.635, 0.665], [0, 1]);
  const bridgeCardY = useTransform(scrollYProgress, [0.635, 0.665], [22, 0]);
  const targetCardOpacity = useTransform(scrollYProgress, [0.665, 0.695], [0, 1]);
  const targetCardY = useTransform(scrollYProgress, [0.665, 0.695], [22, 0]);
  const askLabelOpacity = useTransform(scrollYProgress, [0.628, 0.648], [0, 1]);
  const askLabelY = useTransform(scrollYProgress, [0.628, 0.648], [10, 0]);
  const introLabelOpacity = useTransform(scrollYProgress, [0.652, 0.674], [0, 1]);
  const introLabelY = useTransform(scrollYProgress, [0.652, 0.674], [10, 0]);
  const trayOpacity = useTransform(scrollYProgress, [0.688, 0.712], [0, 1]);
  const trayY = useTransform(scrollYProgress, [0.688, 0.712], [18, 0]);

  return (
    <motion.div
      style={{ opacity: moveOpacity, y: enterY }}
      className="absolute inset-0 pointer-events-none z-20"
    >
      <div className="absolute inset-0 flex items-center justify-center px-8">
        <motion.div
          style={{ opacity: stageOpacity, scale: stageScale, y: stageY }}
          className="pointer-events-auto relative w-full max-w-[760px]"
        >
          <motion.div
            animate={{
              x: [-10, 14, -10],
              y: [-8, 10, -8],
              scale: [1, 1.08, 1],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="pointer-events-none absolute -right-8 top-0 h-40 w-40 rounded-full bg-amber-300/20 blur-[46px]"
          />
          <motion.div
            animate={{
              x: [12, -8, 12],
              y: [8, -10, 8],
              scale: [1, 1.12, 1],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="pointer-events-none absolute -bottom-6 left-6 h-44 w-44 rounded-full bg-sky-300/14 blur-[52px]"
          />

          <div className="relative overflow-hidden rounded-[2rem] bg-[rgba(242,242,247,0.84)] backdrop-blur-3xl border border-white/50 shadow-[0_8px_28px_rgba(0,0,0,0.05),0_24px_64px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.6)] p-6">
            <PaperGrain id="path-stage-glass" opacity={0.025} />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent" />

            <div className="relative z-10">
              <div className="flex items-start justify-between gap-4">
                <div className="max-w-[26rem]">
                  <div
                    style={{ fontFamily: fonts.mono }}
                    className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500"
                  >
                    Warm Introduction
                  </div>
                  <div
                    style={{ fontFamily: fonts.sans }}
                    className="mt-2 text-[24px] font-semibold tracking-tight text-zinc-900 leading-tight"
                  >
                    First ask Priya.
                    <br />
                    Then let her carry the trust.
                  </div>
                </div>

                <div className="rounded-full bg-[rgba(242,242,247,0.82)] backdrop-blur-xl border border-white/40 px-4 py-2 shadow-[0_2px_10px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.45)]">
                  <span
                    style={{ fontFamily: fonts.mono }}
                    className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-700"
                  >
                    2 warm hops &gt; 1 cold DM
                  </span>
                </div>
              </div>

              <div className="relative mt-6 overflow-hidden rounded-[1.75rem] bg-white/30 border border-white/45 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]">
                <svg
                  viewBox="0 0 100 26"
                  preserveAspectRatio="none"
                  className="pointer-events-none absolute inset-x-5 top-3 h-16 w-[calc(100%-2.5rem)]"
                >
                  <defs>
                    <linearGradient id="warm-stage-line" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#60a5fa" />
                      <stop offset="55%" stopColor="#34d399" />
                      <stop offset="100%" stopColor="#fbbf24" />
                    </linearGradient>
                  </defs>

                  <motion.path
                    d="M 14 22 Q 50 2 86 22"
                    fill="none"
                    stroke="rgba(161,161,170,0.45)"
                    strokeWidth={0.55}
                    strokeDasharray="1.2 1.2"
                    style={{ opacity: coldOpacity }}
                  />
                  <motion.path
                    d="M 14 22 Q 32 16 50 22"
                    fill="none"
                    stroke="url(#warm-stage-line)"
                    strokeWidth={0.95}
                    strokeLinecap="round"
                    pathLength={1}
                    strokeDasharray="1"
                    style={{ opacity: warmOpacity, strokeDashoffset: warmLeg1Dash }}
                  />
                  <motion.path
                    d="M 50 22 Q 68 16 86 22"
                    fill="none"
                    stroke="url(#warm-stage-line)"
                    strokeWidth={0.95}
                    strokeLinecap="round"
                    pathLength={1}
                    strokeDasharray="1"
                    style={{ opacity: warmOpacity, strokeDashoffset: warmLeg2Dash }}
                  />
                </svg>

                <motion.div
                  style={{ opacity: coldLabelOpacity, y: coldTagY }}
                  className="absolute left-1/2 top-3 z-10 -translate-x-1/2"
                >
                  <div className="rounded-full bg-[rgba(242,242,247,0.8)] backdrop-blur-xl border border-white/40 px-3 py-1 shadow-[0_2px_10px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.4)]">
                    <span
                      style={{ fontFamily: fonts.mono }}
                      className="text-[9px] font-semibold uppercase tracking-[0.16em] text-zinc-500"
                    >
                      Cold DM: LinkedIn add from 2019
                    </span>
                  </div>
                </motion.div>

                <div className="relative z-10 mt-12 flex items-center gap-3">
                  <motion.div
                    style={{ opacity: youCardOpacity, y: youCardY }}
                    className="w-[min(170px,13.5vw)]"
                  >
                    <IntroStepCard
                      step="01"
                      eyebrow="Start"
                      title="You"
                      subtitle="Need a warm path into Mahindra."
                      accent="#2563eb"
                    />
                  </motion.div>

                  <IntroConnector
                    label="Ask Priya"
                    accentClassName="text-blue-600"
                    lineScale={warmLeg1Scale}
                    labelOpacity={askLabelOpacity}
                    labelY={askLabelY}
                  />

                  <motion.div
                    style={{ opacity: bridgeCardOpacity, y: bridgeCardY }}
                    className="w-[min(170px,13.5vw)]"
                  >
                    <IntroStepCard
                      step="02"
                      eyebrow="Bridge"
                      title={insights.path.intermediary.name}
                      subtitle={insights.path.intermediary.toYou}
                      accent="#059669"
                    />
                  </motion.div>

                  <IntroConnector
                    label="She Introduces"
                    accentClassName="text-emerald-600"
                    lineScale={warmLeg2Scale}
                    labelOpacity={introLabelOpacity}
                    labelY={introLabelY}
                  />

                  <motion.div
                    style={{ opacity: targetCardOpacity, y: targetCardY }}
                    className="w-[min(170px,13.5vw)]"
                  >
                    <IntroStepCard
                      step="03"
                      eyebrow="Target"
                      title={insights.path.target.name}
                      subtitle={insights.path.target.role}
                      accent="#b45309"
                    />
                  </motion.div>
                </div>
              </div>

              <motion.div
                style={{ opacity: trayOpacity, y: trayY }}
                className="mt-5 grid grid-cols-2 gap-3"
              >
                <div className="rounded-[1.4rem] bg-[rgba(242,242,247,0.78)] backdrop-blur-2xl border border-white/45 p-4 shadow-[0_2px_10px_rgba(0,0,0,0.04),0_12px_30px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.45)]">
                  <div
                    style={{ fontFamily: fonts.mono }}
                    className="text-[9px] font-bold uppercase tracking-[0.16em] text-blue-600"
                  >
                    What Brace suggests
                  </div>
                  <div
                    style={{ fontFamily: fonts.sans }}
                    className="mt-3 text-[14px] leading-relaxed text-zinc-700"
                  >
                    &ldquo;Priya, would you be open to introducing me to
                    Rajesh? I think NexaFlow could be relevant for
                    Mahindra&apos;s supply chain team.&rdquo;
                  </div>
                </div>

                <div className="rounded-[1.4rem] bg-[rgba(242,242,247,0.78)] backdrop-blur-2xl border border-white/45 p-4 shadow-[0_2px_10px_rgba(0,0,0,0.04),0_12px_30px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.45)]">
                  <div
                    style={{ fontFamily: fonts.mono }}
                    className="text-[9px] font-bold uppercase tracking-[0.16em] text-emerald-600"
                  >
                    Why Priya
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      <div
                        style={{ fontFamily: fonts.sans }}
                        className="text-[13px] leading-relaxed text-zinc-700"
                      >
                        {insights.path.intermediary.toTarget}
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-500" />
                      <div
                        style={{ fontFamily: fonts.sans }}
                        className="text-[13px] leading-relaxed text-zinc-700"
                      >
                        She introduced you to two others in his circle last
                        year.
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// NEW APPLE LIQUID GLASS KEEP UP SECTION
// ═══════════════════════════════════════════════════════════════════════════

function LiquidKeepUpSection({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) {
  const enterOp = useTransform(scrollYProgress, [0.76, 0.80], [0, 1]);
  const enterY = useTransform(scrollYProgress, [0.76, 0.80], [40, 0]);
  const exitOp = useTransform(scrollYProgress, [0.94, 0.98], [1, 0]);
  const exitY = useTransform(scrollYProgress, [0.94, 0.98], [0, -20]);

  const opacity = useTransform(scrollYProgress, (v) => {
    if (v < 0.76) return 0;
    if (v > 0.98) return 0;
    if (v >= 0.80 && v <= 0.94) return 1;
    if (v < 0.80) return enterOp.get();
    return exitOp.get();
  });

  const y = useTransform(scrollYProgress, (v) => {
    if (v < 0.80) return enterY.get();
    if (v > 0.94) return exitY.get();
    return 0;
  });

  const scale = useTransform(
    scrollYProgress,
    [0.76, 0.80, 0.94, 0.98],
    [0.95, 1, 1, 0.95],
  );

  // The Brace intervention animates in slightly later to highlight the "save"
  const nudgeOp = useTransform(scrollYProgress, [0.80, 0.84], [0, 1]);
  const nudgeY = useTransform(scrollYProgress, [0.80, 0.84], [20, 0]);

  const nudge = {
    person: {
      name: "Kavya Iyer",
      initials: "KI",
      role: "Partner, Sequoia Capital",
    },
    suggested:
      "Congrats on Fund II — saw the news from Davos. Would love to hear how the thesis is evolving. Coffee next week?",
  };

  return (
    <motion.div
      style={{ opacity, y, scale }}
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
    >
      <div className="w-[min(440px,32vw)] pointer-events-auto relative group">
        {/* Animated Liquid Orbs Behind the Glass */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] -right-[10%] w-[60%] h-[60%] bg-amber-400/30 rounded-full blur-[40px] pointer-events-none"
        />
        <motion.div
          animate={{
            scale: [1, 1.4, 1],
            rotate: [0, -90, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-[10%] -left-[10%] w-[70%] h-[70%] bg-rose-400/20 rounded-full blur-[40px] pointer-events-none"
        />

        {/* Premium Frosted Glass Card */}
        <div className="relative overflow-hidden rounded-[2rem] bg-white/40 backdrop-blur-[40px] border border-white/70 shadow-[0_8px_32px_rgba(0,0,0,0.04),0_24px_64px_rgba(0,0,0,0.06),inset_0_2px_4px_rgba(255,255,255,0.8)] p-8">
          <PaperGrain id="liquid-glass-grain" opacity={0.04} />

          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80" />

          <div className="flex items-center gap-4 mb-8 relative z-10">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-white to-zinc-100 border border-white shadow-md flex items-center justify-center text-zinc-600 font-mono text-lg font-semibold backdrop-blur-md">
              {nudge.person.initials}
            </div>
            <div>
              <div
                className="text-[20px] font-semibold text-zinc-900 tracking-tight leading-none mb-1.5"
                style={{ fontFamily: fonts.sans }}
              >
                {nudge.person.name}
              </div>
              <div
                className="text-[13px] text-zinc-500 font-medium"
                style={{ fontFamily: fonts.mono }}
              >
                {nudge.person.role}
              </div>
            </div>
          </div>

          {/* The "Silence" State */}
          <div className="relative pl-4 border-l-2 border-red-200 mb-8 z-10">
            <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.6)] animate-pulse" />
            <div className="text-[10px] font-mono font-bold tracking-[0.15em] uppercase text-red-500 mb-2">
              Fading Connection
            </div>
            <div
              className="text-[14px] text-zinc-600 leading-relaxed"
              style={{ fontFamily: fonts.sans }}
            >
              No contact for 3 months. She usually allocates capital in Q1.
            </div>
          </div>

          {/* The AI "Intervention" */}
          <motion.div
            style={{ opacity: nudgeOp, y: nudgeY }}
            className="relative z-10"
          >
            <div className="relative overflow-hidden bg-white/60 backdrop-blur-xl rounded-2xl p-5 border border-white/80 shadow-[0_8px_24px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,1)]">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-300 to-orange-400" />
              <div className="flex items-center gap-2 mb-3">
                <svg
                  className="w-3.5 h-3.5 text-amber-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
                <span className="text-[10px] font-mono font-bold tracking-[0.12em] uppercase text-amber-600">
                  Brace Suggestion
                </span>
              </div>
              <p className="text-[13px] font-serif italic text-zinc-800 leading-relaxed mb-4">
                &ldquo;{nudge.suggested}&rdquo;
              </p>
              <button className="w-full bg-zinc-900 text-white rounded-xl py-3 text-[13px] font-medium shadow-md hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2">
                Review Draft
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
            </div>
          </motion.div>
        </div>
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
    [0.01, 0.04, 0.33, 0.37],
    [0, 1, 1, 0],
  );
  const label02Opacity = useTransform(
    scrollYProgress,
    [0.37, 0.41, 0.72, 0.75],
    [0, 1, 1, 0],
  );
  const label03Opacity = useTransform(
    scrollYProgress,
    [0.75, 0.79, 0.96, 0.98],
    [0, 1, 1, 0],
  );

  // ── Left Panel: Headlines (4 crossfading) ──
  const h1Opacity = useTransform(
    scrollYProgress,
    [0.01, 0.04, 0.33, 0.37],
    [0, 1, 1, 0],
  );
  const h1Y = useTransform(scrollYProgress, [0.01, 0.04], [20, 0]);

  const h2Opacity = useTransform(
    scrollYProgress,
    [0.37, 0.41, 0.55, 0.58],
    [0, 1, 1, 0],
  );
  const h2Y = useTransform(scrollYProgress, [0.37, 0.41], [20, 0]);

  const h3Opacity = useTransform(
    scrollYProgress,
    [0.56, 0.60, 0.72, 0.75],
    [0, 1, 1, 0],
  );
  const h3Y = useTransform(scrollYProgress, [0.56, 0.60], [20, 0]);

  const h4Opacity = useTransform(
    scrollYProgress,
    [0.75, 0.79, 0.96, 0.98],
    [0, 1, 1, 0],
  );
  const h4Y = useTransform(scrollYProgress, [0.75, 0.79], [20, 0]);

  // ── Left Panel: Subtexts (5 crossfading) ──
  const sub1Opacity = useTransform(
    scrollYProgress,
    [0.02, 0.06, 0.17, 0.21],
    [0, 1, 1, 0],
  );
  const sub2Opacity = useTransform(
    scrollYProgress,
    [0.22, 0.26, 0.33, 0.37],
    [0, 1, 1, 0],
  );
  const sub3Opacity = useTransform(
    scrollYProgress,
    [0.41, 0.45, 0.55, 0.58],
    [0, 1, 1, 0],
  );
  const sub4Opacity = useTransform(
    scrollYProgress,
    [0.58, 0.62, 0.72, 0.75],
    [0, 1, 1, 0],
  );
  const sub5Opacity = useTransform(
    scrollYProgress,
    [0.79, 0.83, 0.96, 0.98],
    [0, 1, 1, 0],
  );

  const sectionOpacity = useTransform(scrollYProgress, [0.96, 0.98], [1, 0]);

  const headlineClass =
    "absolute inset-x-0 top-0 text-[clamp(2rem,3.5vw,3rem)] leading-[1.15] tracking-tight font-medium text-zinc-900";
  const subtextClass =
    "absolute inset-x-0 top-0 text-[15px] leading-relaxed text-zinc-500 tracking-wide";
  const labelClass =
    "absolute inset-x-0 top-0 text-[11px] tracking-[0.2em] uppercase font-bold text-zinc-400";

  return (
    <section
      ref={sectionRef}
      className="relative bg-white"
      style={{ height: "1500vh" }}
    >
      <motion.div
        className="sticky top-0 h-screen overflow-hidden flex bg-white/50 backdrop-blur-2xl"
        style={{ opacity: sectionOpacity }}
      >
        {/* ══ Left text panel — 30% ══════════════════════════════ */}
        <div className="w-[30%] h-full flex flex-col justify-center pl-[6vw] pr-[2vw] relative z-40 border-r border-white/50 bg-white/55 backdrop-blur-2xl shadow-[4px_0_24px_rgba(0,0,0,0.03)]">
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

          <div className="relative min-h-[280px]">
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

          <div className="h-px w-16 bg-gradient-to-r from-zinc-300 to-transparent mb-8" />

          <div className="relative min-h-[120px]">
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
        <div className="w-[70%] h-full relative overflow-hidden bg-[#f2f2f7]">
          {/* Ambient gradient mesh */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[-15%] left-[-5%] w-[55%] h-[55%] bg-[radial-gradient(ellipse_at_center,rgba(45,125,79,0.07),transparent_70%)]" />
            <div className="absolute top-[-10%] right-[5%] w-[50%] h-[50%] bg-[radial-gradient(ellipse_at_center,rgba(88,86,214,0.06),transparent_70%)]" />
            <div className="absolute bottom-[-10%] left-[10%] w-[55%] h-[55%] bg-[radial-gradient(ellipse_at_center,rgba(179,96,30,0.05),transparent_70%)]" />
            <div className="absolute bottom-[-5%] right-[-5%] w-[50%] h-[50%] bg-[radial-gradient(ellipse_at_center,rgba(44,123,229,0.06),transparent_70%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(255,255,255,0.3),transparent_80%)]" />
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

          {/* ── Insights Movement A (34% – 54%) ── */}
          <InsightsMovementA scrollYProgress={scrollYProgress} />

          {/* ── Insights Movement B (52% – 68%) ── */}
          <InsightsMovementB scrollYProgress={scrollYProgress} />

          {/* ── Keep Up (72% – 98%) ── */}
          <LiquidKeepUpSection scrollYProgress={scrollYProgress} />
        </div>
      </motion.div>
    </section>
  );
}
