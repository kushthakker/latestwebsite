"use client";

import { useRef, useState, useEffect, type ReactNode } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { fonts } from "../lib/fonts";

// ═══════════════════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════════════════

const founder = {
  name: "Alex Mitchell",
  initials: "AM",
  avatar: "/avatars/alex-mitchell.jpg",
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
    labelPos: { x: -18, y: -34 },
  },
  "College Alumni": {
    color: "#5856d6",
    bg: "rgba(88,86,214,0.08)",
    labelPos: { x: 18, y: -34 },
  },
  "Industry Peers": {
    color: "#b3601e",
    bg: "rgba(179,96,30,0.07)",
    labelPos: { x: -18, y: 5 },
  },
  "Close Friends": {
    color: "#2c7be5",
    bg: "rgba(44,123,229,0.07)",
    labelPos: { x: 18, y: 5 },
  },
};

const groups = Object.keys(groupConfig);

interface Person {
  id: string;
  name: string;
  initials: string;
  avatar: string;
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
    name: "Paige Vasquez",
    initials: "PV",
    avatar: "/avatars/paige-vasquez.jpg",
    role: "Engineering Lead, Notion",
    context: "Stripe Infra together '16–'19",
    group: "Previous Colleagues",
    radial: { x: -20, y: -16 },
    grouped: { x: -18, y: -26 },
    enterAt: 0.07,
  },
  {
    id: "p2",
    name: "Marcus Chen",
    initials: "MC",
    avatar: "/avatars/marcus-chen.jpg",
    role: "VP Product, Ramp",
    context: "Stripe Payments team '15–'19",
    group: "Previous Colleagues",
    radial: { x: -22, y: 4 },
    grouped: { x: -18, y: -14 },
    enterAt: 0.08,
  },
  {
    id: "p3",
    name: "Sarah Kim",
    initials: "SK",
    avatar: "/avatars/sarah-kim.jpg",
    role: "Founding Engineer, Linear",
    context: "Shipped Stripe Connect together",
    group: "Previous Colleagues",
    radial: { x: -17, y: 20 },
    grouped: { x: -18, y: -2 },
    enterAt: 0.1,
  },
  {
    id: "p4",
    name: "Kate Irving",
    initials: "KI",
    avatar: "/avatars/kate-irving.jpg",
    role: "Partner, Sequoia Capital",
    context: "Stanford CS '13, same lab group",
    group: "College Alumni",
    radial: { x: -6, y: -26 },
    grouped: { x: 18, y: -26 },
    enterAt: 0.11,
  },
  {
    id: "p5",
    name: "James Liu",
    initials: "JL",
    avatar: "/avatars/james-liu.jpg",
    role: "CTO, Figma",
    context: "Stanford CS '14, classmate",
    group: "College Alumni",
    radial: { x: 10, y: -26 },
    grouped: { x: 18, y: -14 },
    enterAt: 0.12,
  },
  {
    id: "p6",
    name: "Amy Roberts",
    initials: "AR",
    avatar: "/avatars/amy-roberts.jpg",
    role: "CEO, Cleo Capital",
    context: "Stanford MBA '15, same dorm",
    group: "College Alumni",
    radial: { x: 20, y: -16 },
    grouped: { x: 18, y: -2 },
    enterAt: 0.14,
  },
  {
    id: "p7",
    name: "Ryan Andrews",
    initials: "RA",
    avatar: "/avatars/ryan-andrews.jpg",
    role: "GP, Lightspeed Ventures",
    context: "Co-invested in Arcline Series A",
    group: "Industry Peers",
    radial: { x: 22, y: 4 },
    grouped: { x: -18, y: 15 },
    enterAt: 0.15,
  },
  {
    id: "p8",
    name: "Nora Phillips",
    initials: "NP",
    avatar: "/avatars/nora-phillips.jpg",
    role: "COO, Instacart",
    context: "Sequoia portfolio, same batch",
    group: "Industry Peers",
    radial: { x: 17, y: 20 },
    grouped: { x: -18, y: 27 },
    enterAt: 0.16,
  },
  {
    id: "p9",
    name: "David Park",
    initials: "DP",
    avatar: "/avatars/david-park.jpg",
    role: "Staff ML, Google DeepMind",
    context: "Stanford roommate '11–'14",
    group: "Close Friends",
    radial: { x: -4, y: 28 },
    grouped: { x: 18, y: 15 },
    enterAt: 0.18,
  },
  {
    id: "p10",
    name: "Megan Scott",
    initials: "MS",
    avatar: "/avatars/megan-scott.jpg",
    role: "Founder, Bloom Health",
    context: "Stanford ACM club together",
    group: "Close Friends",
    radial: { x: 6, y: 28 },
    grouped: { x: 18, y: 27 },
    enterAt: 0.19,
  },
];

// ─── Insights Data ──────────────────────────────────────────────────────

const insights = {
  recent: [
    { text: 'Posted: "Arcline hits $5M ARR" — LinkedIn, 2d ago' },
    { text: "TechCrunch mentions Arcline in Series A roundup" },
    { text: "Actively looking for enterprise design partners" },
  ],
  personal: [
    { text: "Wife Lauren is expecting in April — ask about preparations" },
    { text: "Runs 5K every morning along the Embarcadero" },
    { text: "Prefers Blue Bottle over Starbucks" },
  ],
  strategic:
    "Portfolio company. Series A prep underway. Key proof point for Fund I thesis on vertical SaaS.",
  path: {
    target: {
      name: "Mark Jensen",
      role: "VP Engineering, Tesla",
    },
    intermediary: {
      name: "Paige Vasquez",
      role: "Engineering Lead, Notion",
      toYou: "Stripe together '16–'19",
      toTarget: "Stanford classmate, close friend",
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
            <div className="w-10 h-10 rounded-full overflow-hidden border border-white/60 shadow-sm">
              <img src={founder.avatar} alt={founder.name} className="h-full w-full object-cover" />
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
            className="w-8 h-8 rounded-full flex-shrink-0 overflow-hidden border shadow-sm"
            style={{
              borderColor: color + "30",
            }}
          >
            <img src={person.avatar} alt={person.name} className="h-full w-full object-cover" />
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
            className="text-[10px] tracking-[0.14em] uppercase font-extrabold whitespace-nowrap"
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
  const cardOpacity = useTransform(scrollYProgress, [0.4, 0.43], [0, 1]);
  const cardScale = useTransform(
    scrollYProgress,
    [0.4, 0.43, 0.54, 0.57],
    [0.95, 1, 1, 0.95],
  );
  const cardY = useTransform(scrollYProgress, [0.4, 0.43], [40, 0]);
  const exitOpacity = useTransform(scrollYProgress, [0.55, 0.58], [1, 0]);

  const signalsOpacity = useTransform(scrollYProgress, [0.42, 0.45], [0, 1]);
  const signalsY = useTransform(scrollYProgress, [0.42, 0.45], [16, 0]);
  const personalOpacity = useTransform(scrollYProgress, [0.46, 0.49], [0, 1]);
  const personalY = useTransform(scrollYProgress, [0.46, 0.49], [16, 0]);
  const strategyOpacity = useTransform(scrollYProgress, [0.5, 0.53], [0, 1]);
  const strategyY = useTransform(scrollYProgress, [0.5, 0.53], [16, 0]);

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
              <div className="w-11 h-11 rounded-full overflow-hidden border border-white/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.2)]">
                <img src={founder.avatar} alt={founder.name} className="h-full w-full object-cover" />
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
              {["Baby due April", "Runs 5K daily", "Blue Bottle fan"].map(
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

function InsightsMovementB({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) {
  // ── Container enter / exit ──
  const moveOpacity = useTransform(
    scrollYProgress,
    [0.56, 0.59, 0.73, 0.76],
    [0, 1, 1, 0],
  );
  const enterY = useTransform(scrollYProgress, [0.56, 0.59], [30, 0]);

  // ── Glass card ──
  const stageOpacity = useTransform(scrollYProgress, [0.58, 0.615], [0, 1]);
  const stageScale = useTransform(scrollYProgress, [0.58, 0.615], [0.96, 1]);
  const stageY = useTransform(scrollYProgress, [0.58, 0.615], [24, 0]);

  // ── Nodes (staggered L → R) ──
  const youOp = useTransform(scrollYProgress, [0.605, 0.63], [0, 1]);
  const youY = useTransform(scrollYProgress, [0.605, 0.63], [12, 0]);
  const youScale = useTransform(scrollYProgress, [0.605, 0.63], [0.85, 1]);

  const paigeOp = useTransform(scrollYProgress, [0.63, 0.655], [0, 1]);
  const paigeY = useTransform(scrollYProgress, [0.63, 0.655], [12, 0]);
  const paigeScale = useTransform(scrollYProgress, [0.63, 0.655], [0.85, 1]);

  const markOp = useTransform(scrollYProgress, [0.655, 0.68], [0, 1]);
  const markY = useTransform(scrollYProgress, [0.655, 0.68], [12, 0]);
  const markScale = useTransform(scrollYProgress, [0.655, 0.68], [0.85, 1]);

  // ── Warm gradient lines (draw L → R) ──
  const line1Scale = useTransform(scrollYProgress, [0.62, 0.645], [0, 1]);
  const line2Scale = useTransform(scrollYProgress, [0.645, 0.67], [0, 1]);

  // ── Connection context ──
  const ctx1Op = useTransform(scrollYProgress, [0.64, 0.66], [0, 1]);
  const ctx2Op = useTransform(scrollYProgress, [0.665, 0.685], [0, 1]);

  // ── Cold arc (subtle, enters last) ──
  const coldOp = useTransform(
    scrollYProgress,
    [0.67, 0.695, 0.73, 0.76],
    [0, 0.4, 0.4, 0],
  );

  // ── CTA ──
  const ctaOp = useTransform(scrollYProgress, [0.69, 0.71], [0, 1]);
  const ctaY = useTransform(scrollYProgress, [0.69, 0.71], [10, 0]);

  const { intermediary, target } = insights.path;

  return (
    <motion.div
      style={{ opacity: moveOpacity, y: enterY }}
      className="absolute inset-0 pointer-events-none z-20"
    >
      <div className="absolute inset-0 flex items-center justify-center px-8">
        <motion.div
          style={{ opacity: stageOpacity, scale: stageScale, y: stageY }}
          className="pointer-events-auto relative w-full max-w-[720px]"
        >
          {/* Ambient floating orbs */}
          <motion.div
            animate={{
              x: [-10, 14, -10],
              y: [-8, 10, -8],
              scale: [1, 1.08, 1],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="pointer-events-none absolute -right-12 -top-8 h-36 w-36 rounded-full bg-amber-300/20 blur-[46px]"
          />
          <motion.div
            animate={{
              x: [12, -8, 12],
              y: [8, -10, 8],
              scale: [1, 1.12, 1],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="pointer-events-none absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-sky-300/14 blur-[52px]"
          />

          {/* ── Liquid glass card ── */}
          <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-[rgba(248,248,251,0.92)] px-10 pt-9 pb-9 shadow-[0_10px_32px_rgba(0,0,0,0.05),0_28px_72px_rgba(0,0,0,0.09),inset_0_1px_0_rgba(255,255,255,0.76)] backdrop-blur-2xl">
            <PaperGrain id="path-stage-glass" opacity={0.025} />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent" />

            <div className="relative z-10">
              {/* Eyebrow */}
              <div
                style={{ fontFamily: fonts.mono }}
                className="mb-12 text-[12px] font-bold uppercase tracking-[0.18em] text-zinc-500"
              >
                Warm Intro Path
              </div>

              {/* ── Path visualization ── */}
              <div className="relative">
                {/* Cold arc (SVG) */}
                <motion.svg
                  viewBox="0 0 100 16"
                  preserveAspectRatio="none"
                  className="absolute -top-10 inset-x-[8%] h-14 pointer-events-none"
                  style={{
                    opacity: coldOp,
                    filter: "drop-shadow(0 1px 0 rgba(255,255,255,0.9))",
                  }}
                >
                  <path
                    d="M 2 14 Q 50 0 98 14"
                    fill="none"
                    stroke="rgba(255,255,255,0.72)"
                    strokeWidth={2.2}
                    strokeDasharray="4 5"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                  <path
                    d="M 2 14 Q 50 0 98 14"
                    fill="none"
                    stroke="rgba(113,113,122,0.62)"
                    strokeWidth={1.15}
                    strokeDasharray="4 5"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                </motion.svg>

                {/* Cold label */}
                <motion.div
                  style={{ opacity: coldOp }}
                  className="absolute -top-4 left-1/2 -translate-x-1/2 z-10"
                >
                  <span
                    style={{ fontFamily: fonts.mono }}
                    className="text-[10px] text-zinc-500/85 tracking-[0.12em] uppercase whitespace-nowrap"
                  >
                    cold outreach
                  </span>
                </motion.div>

                {/* Grid: [avatar] [line] [avatar] [line] [avatar] */}
                <div
                  className="grid items-center"
                  style={{ gridTemplateColumns: "100px 1fr 100px 1fr 100px" }}
                >
                  {/* ── Row 1: Avatars + warm lines ── */}

                  {/* You */}
                  <motion.div
                    style={{ opacity: youOp, y: youY, scale: youScale }}
                    className="flex justify-center"
                  >
                    <div className="flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full border border-white/70 bg-white/90 shadow-[0_2px_8px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.72)] backdrop-blur-md">
                      <span
                        style={{ fontFamily: fonts.mono }}
                        className="text-[15px] font-semibold tracking-wider text-zinc-700"
                      >
                        You
                      </span>
                    </div>
                  </motion.div>

                  {/* Warm line 1 with bloom glow */}
                  <div className="relative flex items-center px-1.5">
                    <motion.div
                      style={{
                        scaleX: line1Scale,
                        transformOrigin: "left center",
                      }}
                      className="absolute inset-x-1.5 h-[10px] rounded-full bg-gradient-to-r from-blue-400/40 via-cyan-400/40 to-emerald-400/40 blur-[5px]"
                    />
                    <motion.div
                      style={{
                        scaleX: line1Scale,
                        transformOrigin: "left center",
                      }}
                      className="relative z-10 h-[2.5px] w-full rounded-full bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400"
                    />
                  </div>

                  {/* Paige (bridge — pulse ring emphasis) */}
                  <motion.div
                    style={{ opacity: paigeOp, y: paigeY, scale: paigeScale }}
                    className="flex justify-center"
                  >
                    <div className="relative">
                      <motion.div
                        animate={{
                          scale: [1, 1.4, 1.4],
                          opacity: [0.3, 0, 0],
                        }}
                        transition={{
                          duration: 2.5,
                          repeat: Infinity,
                          ease: "easeOut",
                        }}
                        className="absolute inset-0 rounded-full border border-emerald-400/40"
                      />
                      <div className="h-[4.5rem] w-[4.5rem] overflow-hidden rounded-full border border-emerald-200/55 shadow-[0_2px_8px_rgba(5,150,105,0.12),inset_0_1px_0_rgba(255,255,255,0.68)]">
                        <img src="/avatars/paige-vasquez.jpg" alt="Paige Vasquez" className="h-full w-full object-cover" />
                      </div>
                    </div>
                  </motion.div>

                  {/* Warm line 2 with bloom glow */}
                  <div className="relative flex items-center px-1.5">
                    <motion.div
                      style={{
                        scaleX: line2Scale,
                        transformOrigin: "left center",
                      }}
                      className="absolute inset-x-1.5 h-[10px] rounded-full bg-gradient-to-r from-emerald-400/40 via-yellow-400/42 to-amber-400/40 blur-[5px]"
                    />
                    <motion.div
                      style={{
                        scaleX: line2Scale,
                        transformOrigin: "left center",
                      }}
                      className="relative z-10 h-[2.5px] w-full rounded-full bg-gradient-to-r from-emerald-400 via-yellow-400 to-amber-400"
                    />
                  </div>

                  {/* Mark (target) */}
                  <motion.div
                    style={{ opacity: markOp, y: markY, scale: markScale }}
                    className="flex justify-center"
                  >
                    <div className="h-[4.5rem] w-[4.5rem] overflow-hidden rounded-full border border-amber-200/55 shadow-[0_2px_8px_rgba(180,83,9,0.1),inset_0_1px_0_rgba(255,255,255,0.68)]">
                      <img src="/avatars/mark-jensen.jpg" alt="Mark Jensen" className="h-full w-full object-cover" />
                    </div>
                  </motion.div>

                  {/* ── Row 2: Names, roles, context ── */}

                  {/* You label */}
                  <motion.div
                    style={{ opacity: youOp }}
                    className="text-center pt-5"
                  >
                    <div
                      style={{ fontFamily: fonts.sans }}
                      className="text-[17px] font-semibold tracking-tight text-zinc-900"
                    >
                      You
                    </div>
                  </motion.div>

                  {/* Context 1 */}
                  <motion.div
                    style={{ opacity: ctx1Op }}
                    className="flex items-center justify-center pt-5"
                  >
                    <span
                      style={{ fontFamily: fonts.serif }}
                      className="text-center text-[13px] italic leading-snug text-zinc-600"
                    >
                      {intermediary.toYou}
                    </span>
                  </motion.div>

                  {/* Paige label */}
                  <motion.div
                    style={{ opacity: paigeOp }}
                    className="text-center pt-5"
                  >
                    <div
                      style={{ fontFamily: fonts.sans }}
                      className="text-[16px] font-semibold leading-tight tracking-tight text-zinc-900"
                    >
                      {intermediary.name}
                    </div>
                    <div
                      style={{ fontFamily: fonts.mono }}
                      className="mt-1 text-[11px] text-zinc-600"
                    >
                      {intermediary.role}
                    </div>
                  </motion.div>

                  {/* Context 2 */}
                  <motion.div
                    style={{ opacity: ctx2Op }}
                    className="flex items-center justify-center pt-5"
                  >
                    <span
                      style={{ fontFamily: fonts.serif }}
                      className="text-center text-[13px] italic leading-snug text-zinc-600"
                    >
                      {intermediary.toTarget}
                    </span>
                  </motion.div>

                  {/* Mark label */}
                  <motion.div
                    style={{ opacity: markOp }}
                    className="text-center pt-5"
                  >
                    <div
                      style={{ fontFamily: fonts.sans }}
                      className="text-[16px] font-semibold leading-tight tracking-tight text-zinc-900"
                    >
                      {target.name}
                    </div>
                    <div
                      style={{ fontFamily: fonts.mono }}
                      className="mt-1 text-[11px] text-zinc-600"
                    >
                      {target.role}
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Divider */}
              <div className="mt-10 mb-7 h-px w-full bg-gradient-to-r from-zinc-300/75 via-zinc-200/45 to-transparent" />

              {/* CTA — matches hero glass button language */}
              <motion.div
                style={{ opacity: ctaOp, y: ctaY }}
                className="flex justify-center"
              >
                <div className="group inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-[15px] font-medium text-white transition-all duration-300 backdrop-blur-2xl bg-[rgba(9,9,11,0.68)] border border-white/[0.12] shadow-[0_2px_16px_rgba(0,0,0,0.10),0_8px_32px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.10)] hover:bg-[rgba(9,9,11,0.55)] hover:shadow-[0_2px_20px_rgba(0,0,0,0.12),0_12px_40px_rgba(0,0,0,0.10),inset_0_1px_0_rgba(255,255,255,0.14)] hover:scale-[1.03] cursor-pointer">
                  <span style={{ fontFamily: fonts.sans }}>
                    Draft intro request
                  </span>
                  <svg
                    className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 8l4 4-4 4M21 12H3"
                    />
                  </svg>
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
  const enterOp = useTransform(scrollYProgress, [0.76, 0.8], [0, 1]);
  const enterY = useTransform(scrollYProgress, [0.76, 0.8], [40, 0]);
  const exitOp = useTransform(scrollYProgress, [0.94, 0.98], [1, 0]);
  const exitY = useTransform(scrollYProgress, [0.94, 0.98], [0, -20]);

  const opacity = useTransform(scrollYProgress, (v) => {
    if (v < 0.76) return 0;
    if (v > 0.98) return 0;
    if (v >= 0.8 && v <= 0.94) return 1;
    if (v < 0.8) return enterOp.get();
    return exitOp.get();
  });

  const y = useTransform(scrollYProgress, (v) => {
    if (v < 0.8) return enterY.get();
    if (v > 0.94) return exitY.get();
    return 0;
  });

  const scale = useTransform(
    scrollYProgress,
    [0.76, 0.8, 0.94, 0.98],
    [0.95, 1, 1, 0.95],
  );

  // The Brace intervention animates in slightly later to highlight the "save"
  const nudgeOp = useTransform(scrollYProgress, [0.8, 0.84], [0, 1]);
  const nudgeY = useTransform(scrollYProgress, [0.8, 0.84], [20, 0]);

  const nudge = {
    person: {
      name: "Kate Irving",
      initials: "KI",
      avatar: "/avatars/kate-irving.jpg",
      role: "Partner, Sequoia Capital",
    },
    suggested:
      "Hey Kate, hope Davos was good. I\u2019d love to hear what you\u2019re seeing in vertical SaaS this year. Free for coffee at Blue Bottle this week? I also have our latest growth numbers to share.",
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
            <div className="w-14 h-14 rounded-full overflow-hidden border border-white shadow-md">
              <img src={nudge.person.avatar} alt={nudge.person.name} className="h-full w-full object-cover" />
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
              <button className="w-full text-white rounded-xl py-3 text-[13px] font-medium flex items-center justify-center gap-2 transition-all duration-300 backdrop-blur-2xl bg-[rgba(9,9,11,0.62)] border border-white/[0.10] shadow-[0_2px_12px_rgba(0,0,0,0.08),0_6px_24px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.08)] hover:bg-[rgba(9,9,11,0.50)] hover:shadow-[0_2px_16px_rgba(0,0,0,0.10),0_8px_28px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.12)]">
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

function DesktopNetworkSection() {
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
    [0.56, 0.6, 0.72, 0.75],
    [0, 1, 1, 0],
  );
  const h3Y = useTransform(scrollYProgress, [0.56, 0.6], [20, 0]);

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

  const sectionEnterOpacity = useTransform(scrollYProgress, [0, 0.008], [0, 1]);
  const sectionExitOpacity = useTransform(scrollYProgress, [0.96, 0.98], [1, 0]);
  const sectionOpacity = useTransform(
    [sectionEnterOpacity, sectionExitOpacity],
    ([enter, exit]) => Math.min(enter as number, exit as number),
  );

  const headlineClass =
    "absolute inset-x-0 top-0 text-[clamp(2rem,3.5vw,3rem)] leading-[1.15] tracking-tight font-medium text-zinc-900";
  const subtextClass =
    "absolute inset-x-0 top-0 text-[15px] leading-relaxed text-zinc-500 tracking-wide";
  const labelClass =
    "absolute inset-x-0 top-0 text-[14px] tracking-[0.18em] uppercase font-extrabold text-zinc-500";

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
              Brace helps you
              <br />
              remember.
            </motion.h2>
            <motion.h2
              style={{ opacity: h3Opacity, y: h3Y, fontFamily: fonts.sans }}
              className={headlineClass}
            >
              And paths you didn&apos;t
              <br />
              know you had.
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
              who matters and why.
            </motion.p>
            <motion.p
              style={{ opacity: sub2Opacity, fontFamily: fonts.sans }}
              className={subtextClass}
            >
              Relationships you already have,<br />
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
              connections fade, so you
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

function useOnceInView(ref: React.RefObject<HTMLElement | null>, threshold = 0.12) {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, seen, threshold]);
  return seen;
}

function MobileStage({
  label,
  title,
  subtext,
  children,
}: {
  label: string;
  title: ReactNode;
  subtext: ReactNode;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useOnceInView(ref);
  return (
    <div ref={ref} className="space-y-5">
      <div
        className="space-y-3"
        style={{
          transform: "translateZ(0)",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
        }}
      >
        <div
          style={{ fontFamily: fonts.mono }}
          className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-500"
        >
          {label}
        </div>
        <h2
          style={{ fontFamily: fonts.sans }}
          className="text-[clamp(1.9rem,8vw,2.6rem)] leading-[1.12] tracking-tight text-zinc-900"
        >
          {title}
        </h2>
        <p
          style={{ fontFamily: fonts.sans }}
          className="max-w-[34rem] text-[15px] leading-relaxed text-zinc-500"
        >
          {subtext}
        </p>
      </div>
      <div
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translate3d(0,0,0)" : "translate3d(0,24px,0)",
          transition:
            "opacity 0.55s cubic-bezier(0.25,0.1,0.25,1), transform 0.55s cubic-bezier(0.25,0.1,0.25,1)",
          willChange: "opacity, transform",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function MobileNetworkSection() {
  const { intermediary, target } = insights.path;
  const groupedPeople = groups.map((group) => ({
    group,
    theme: groupConfig[group],
    people: people.filter((person) => person.group === group),
  }));
  const keepUpNudge = {
    person: {
      name: "Kate Irving",
      initials: "KI",
      avatar: "/avatars/kate-irving.jpg",
      role: "Partner, Sequoia Capital",
    },
    suggested:
      "Hey Kate, hope Davos was good. I'd love to hear what you're seeing in vertical SaaS this year. Free for coffee at Blue Bottle this week? I also have our latest growth numbers to share.",
  };

  return (
    <section className="bg-[#f2f2f7] px-5 py-16 sm:px-6">
      <div className="mx-auto flex max-w-lg flex-col gap-16">

        {/* ── 01 Your Network ── */}
        <MobileStage
          label="01 — Your Network"
          title={
            <>
              Brace maps
              <br />
              your world.
            </>
          }
          subtext={
            <>
              From one profile, we find who matters and why. Relationships you
              already have, organized by how you know them.
            </>
          }
        >
          <div className="space-y-4">

            {/* Founder card */}
            <div className="rounded-[22px] border border-white/60 bg-white/70 p-4 shadow-[0_6px_18px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.7)]">
              <div className="flex items-center gap-3.5">
                <div className="h-[52px] w-[52px] flex-shrink-0 overflow-hidden rounded-full shadow-[0_2px_12px_rgba(0,0,0,0.18)]">
                  <img src={founder.avatar} alt={founder.name} className="h-full w-full object-cover" />
                </div>
                <div
                  className="min-w-0"
                >
                  <div
                    style={{ fontFamily: fonts.sans }}
                    className="text-[17px] font-semibold tracking-tight text-zinc-900 truncate"
                  >
                    {founder.name}
                  </div>
                  <div
                    style={{ fontFamily: fonts.mono }}
                    className="mt-0.5 text-[12px] text-zinc-500 truncate"
                  >
                    {founder.role}
                  </div>
                </div>
              </div>
              <div className="my-3 h-px w-full bg-gradient-to-r from-zinc-200/80 to-transparent" />
              <div
                style={{ fontFamily: fonts.serif }}
                className="text-[13px] italic leading-relaxed text-zinc-600"
              >
                {founder.background}
              </div>
              <div
                style={{ fontFamily: fonts.sans }}
                className="mt-1.5 text-[13px] font-medium text-zinc-700"
              >
                {founder.knownFor}
              </div>
            </div>

            {/* 2×2 group grid */}
            <div className="grid grid-cols-2 gap-3">
              {groupedPeople.map(({ group, theme, people: members }) => (
                <div
                  key={group}
                  className="rounded-[20px] border border-white/55 bg-white/62 p-3.5 shadow-[0_4px_14px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.68)]"
                >
                  <div className="mb-2.5 flex items-start justify-between gap-2">
                    <div
                      style={{ fontFamily: fonts.mono, color: theme.color }}
                      className="text-[10px] font-bold uppercase tracking-[0.16em] leading-tight"
                    >
                      {group}
                    </div>
                    <span
                      className="h-2 w-2 flex-shrink-0 rounded-full mt-0.5"
                      style={{ backgroundColor: theme.color }}
                    />
                  </div>
                  <div className="space-y-2">
                    {members.slice(0, 2).map((person) => (
                      <div
                        key={person.id}
                        className="rounded-[14px] border border-white/55 bg-[rgba(242,242,247,0.82)] px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]"
                      >
                        <div
                          style={{ fontFamily: fonts.sans }}
                          className="text-[13px] font-medium tracking-tight text-zinc-800 truncate"
                        >
                          {person.name}
                        </div>
                        <div
                          style={{ fontFamily: fonts.sans }}
                          className="text-[11px] text-zinc-500 truncate"
                        >
                          {person.role}
                        </div>
                        <div
                          style={{ fontFamily: fonts.serif, color: theme.color }}
                          className="mt-1 text-[11px] italic line-clamp-2 leading-snug"
                        >
                          {person.context}
                        </div>
                      </div>
                    ))}
                    {members.length > 2 && (
                      <div
                        style={{ fontFamily: fonts.mono, color: theme.color }}
                        className="px-1 text-[9px] uppercase tracking-[0.14em]"
                      >
                        +{members.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </MobileStage>

        {/* ── 02a Insights (unified card mirroring desktop InsightsMovementA) ── */}
        <MobileStage
          label="02 — Insights"
          title={
            <>
              Brace helps you
              <br />
              remember.
            </>
          }
          subtext={
            <>
              What they&apos;re building, what they care about, and what just
              changed.
            </>
          }
        >
          <div className="overflow-hidden rounded-[24px] border border-white/50 bg-[rgba(242,242,247,0.92)] shadow-[0_4px_16px_rgba(0,0,0,0.05),0_12px_40px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.6)] backdrop-blur-3xl">

            {/* Header */}
            <div className="px-5 pt-5 pb-4 border-b border-zinc-200/30">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 flex-shrink-0 rounded-full overflow-hidden border border-white/60 shadow-sm">
                  <img src={founder.avatar} alt={founder.name} className="h-full w-full object-cover" />
                </div>
                <div>
                  <div
                    style={{ fontFamily: fonts.sans }}
                    className="text-[19px] font-semibold text-zinc-900 tracking-tight leading-none"
                  >
                    {founder.name}
                  </div>
                  <div
                    style={{ fontFamily: fonts.mono }}
                    className="text-[11px] text-zinc-500 mt-1"
                  >
                    {founder.role}
                  </div>
                </div>
              </div>
            </div>

            {/* What's New */}
            <div className="px-5 pt-5 pb-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-600/[0.08] border border-blue-600/[0.12] mb-3.5">
                <div className="w-1 h-1 rounded-full bg-blue-600" />
                <span
                  style={{ fontFamily: fonts.mono }}
                  className="text-[9px] tracking-[0.12em] uppercase font-bold text-blue-600"
                >
                  What&apos;s New
                </span>
              </div>
              <div className="mb-3">
                <div
                  style={{ fontFamily: fonts.sans }}
                  className="text-[30px] font-bold text-zinc-900 tracking-tight leading-none"
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
              <div className="flex flex-col gap-1.5">
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

            <div className="mx-5 h-px bg-gradient-to-r from-zinc-300/50 to-transparent" />

            {/* Remember */}
            <div className="px-5 pt-4 pb-4">
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
                {["Baby due April", "Runs 5K daily", "Blue Bottle fan"].map((item) => (
                  <span
                    key={item}
                    style={{ fontFamily: fonts.sans }}
                    className="px-3 py-1.5 rounded-lg bg-white/50 backdrop-blur-sm border border-white/40 text-[12px] font-medium text-zinc-600 shadow-[0_1px_3px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.5)]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="mx-5 h-px bg-gradient-to-r from-zinc-300/50 to-transparent" />

            {/* Why They Matter */}
            <div className="px-5 pt-4 pb-5">
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
                className="text-[14px] font-medium text-zinc-700 leading-snug"
              >
                Portfolio company &middot; Series A prep &middot; Fund I proof point
              </div>
            </div>
          </div>
        </MobileStage>

        {/* ── 02b Paths ── */}
        <MobileStage
          label="02 — Insights"
          title={
            <>
              And paths you didn&apos;t
              <br />
              know you had.
            </>
          }
          subtext={
            <>
              The warmest path, not the shortest.
            </>
          }
        >
          <div className="relative overflow-hidden rounded-[28px] border border-white/60 bg-[rgba(242,242,247,0.9)] p-5 shadow-[0_10px_28px_rgba(0,0,0,0.05),0_22px_52px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.72)] backdrop-blur-3xl">
            <PaperGrain id="mobile-path-stage" opacity={0.025} />
            <div className="relative z-10">
              <div
                style={{ fontFamily: fonts.mono }}
                className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400 mb-6"
              >
                Warm intro path
              </div>

              <div className="relative space-y-5 pl-12">
                {/* Warm gradient vertical line */}
                <div className="absolute bottom-[5.5rem] left-[19px] top-6 w-[2px] rounded-full bg-gradient-to-b from-sky-400 via-emerald-400 to-amber-400 opacity-70" />

                {[
                  {
                    avatar: null as string | null,
                    initials: "You",
                    name: "You",
                    role: founder.role,
                    context: intermediary.toYou,
                    ringColor: "rgba(96,165,250,0.35)",
                  },
                  {
                    avatar: "/avatars/paige-vasquez.jpg",
                    initials: null as string | null,
                    name: intermediary.name,
                    role: intermediary.role,
                    context: intermediary.toTarget,
                    ringColor: "rgba(52,211,153,0.35)",
                  },
                  {
                    avatar: "/avatars/mark-jensen.jpg",
                    initials: null as string | null,
                    name: target.name,
                    role: target.role,
                    context: "Skip the cold email. Start from shared trust.",
                    ringColor: "rgba(251,191,36,0.35)",
                  },
                ].map((node) => (
                  <div key={node.name} className="relative">
                    <div
                      className={`absolute left-[-46px] top-3 h-9 w-9 rounded-full border border-white/70 ${node.avatar ? "overflow-hidden" : "flex items-center justify-center bg-white/85"}`}
                      style={{ boxShadow: `0 0 0 3px ${node.ringColor}, 0 2px 10px rgba(0,0,0,0.08)` }}
                    >
                      {node.avatar ? (
                        <img src={node.avatar} alt={node.name} className="h-full w-full object-cover" />
                      ) : (
                        <span style={{ fontFamily: fonts.mono }} className="text-[10px] font-semibold tracking-[0.08em] text-zinc-600">
                          {node.initials}
                        </span>
                      )}
                    </div>
                    <div className="rounded-[20px] border border-white/60 bg-white/78 px-4 py-3.5 shadow-[0_6px_18px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.72)]">
                      <div
                        style={{ fontFamily: fonts.sans }}
                        className="text-[15px] font-semibold tracking-tight text-zinc-800"
                      >
                        {node.name}
                      </div>
                      <div
                        style={{ fontFamily: fonts.mono }}
                        className="mt-0.5 text-[11px] text-zinc-500"
                      >
                        {node.role}
                      </div>
                      <div
                        style={{ fontFamily: fonts.serif }}
                        className="mt-2 text-[13px] italic leading-relaxed text-zinc-500"
                      >
                        {node.context}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-6">
                <button className="w-full flex items-center justify-center gap-2.5 rounded-2xl border border-white/[0.12] bg-[rgba(9,9,11,0.68)] py-3.5 text-[14px] font-medium text-white shadow-[0_2px_16px_rgba(0,0,0,0.10),0_8px_32px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.10)] backdrop-blur-2xl transition-all duration-300">
                  <span style={{ fontFamily: fonts.sans }}>Draft intro request</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4-4 4M21 12H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </MobileStage>

        {/* ── 03 Keep Up ── */}
        <MobileStage
          label="03 — Keep Up"
          title={
            <>
              Relationships don&apos;t
              <br />
              die in silence.
            </>
          }
          subtext={
            <>
              Brace nudges you before connections fade, so you show up while it
              still matters.
            </>
          }
        >
          <div className="relative overflow-hidden rounded-[30px] border border-white/70 bg-white/48 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.05),0_24px_64px_rgba(0,0,0,0.07),inset_0_2px_4px_rgba(255,255,255,0.82)] backdrop-blur-[36px]">
            <PaperGrain id="mobile-keepup-card" opacity={0.035} />
            <motion.div
              animate={{
                scale: [1, 1.12, 1],
                rotate: [0, 60, 0],
                opacity: [0.22, 0.36, 0.22],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="pointer-events-none absolute -right-[12%] -top-[8%] h-40 w-40 rounded-full bg-amber-400/25 blur-[42px]"
            />
            <div className="relative z-10 space-y-4">

              {/* Person header */}
              <div className="flex items-center gap-3.5">
                <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-full border border-white/70 shadow-[0_4px_14px_rgba(0,0,0,0.05)]">
                  <img src={keepUpNudge.person.avatar} alt={keepUpNudge.person.name} className="h-full w-full object-cover" />
                </div>
                <div>
                  <div
                    style={{ fontFamily: fonts.sans }}
                    className="text-[18px] font-semibold tracking-tight text-zinc-900"
                  >
                    {keepUpNudge.person.name}
                  </div>
                  <div
                    style={{ fontFamily: fonts.mono }}
                    className="text-[12px] text-zinc-500"
                  >
                    {keepUpNudge.person.role}
                  </div>
                </div>
              </div>

              {/* Fading connection alert */}
              <div className="relative rounded-[20px] border border-red-200/80 bg-white/72 px-4 py-3.5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="h-2 w-2 rounded-full bg-red-400 shadow-[0_0_6px_rgba(248,113,113,0.6)] animate-pulse" />
                  <div
                    style={{ fontFamily: fonts.mono }}
                    className="text-[10px] font-bold uppercase tracking-[0.16em] text-red-500"
                  >
                    Fading connection
                  </div>
                </div>
                <p
                  style={{ fontFamily: fonts.sans }}
                  className="text-[13px] leading-relaxed text-zinc-600"
                >
                  No contact for 3 months. She usually allocates capital in Q1.
                </p>
              </div>

              {/* Brace suggestion */}
              <div className="relative overflow-hidden rounded-[22px] border border-white/80 bg-white/76 shadow-[0_8px_22px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.92)]">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-300 to-orange-400" />
                <div className="p-4 pt-5">
                  <div className="mb-3 flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    <span
                      style={{ fontFamily: fonts.mono }}
                      className="text-[10px] font-bold uppercase tracking-[0.12em] text-amber-600"
                    >
                      Brace Suggestion
                    </span>
                  </div>
                  <p
                    style={{ fontFamily: fonts.serif }}
                    className="text-[14px] italic leading-relaxed text-zinc-800 mb-4"
                  >
                    &ldquo;{keepUpNudge.suggested}&rdquo;
                  </p>
                  <button className="w-full flex items-center justify-center gap-2 rounded-xl border border-white/[0.1] bg-[rgba(9,9,11,0.62)] py-3 text-[13px] font-medium text-white shadow-[0_2px_12px_rgba(0,0,0,0.08),0_6px_24px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-2xl transition-all duration-300">
                    <span style={{ fontFamily: fonts.sans }}>Review Draft</span>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </MobileStage>

      </div>
    </section>
  );
}

export default function NetworkSection({ isNarrow = false }: { isNarrow?: boolean }) {
  return isNarrow ? <MobileNetworkSection /> : <DesktopNetworkSection />;
}
