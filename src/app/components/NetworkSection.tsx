"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

// ─── Design Tokens ──────────────────────────────────────────────────────
const mono = "'Courier New', Courier, monospace";
const serif = "'Georgia', 'Times New Roman', serif";

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
  "Previous Colleagues": { color: "rgba(80,100,60,0.85)",  bg: "rgba(80,100,60,0.08)",  labelPos: { x: -18, y: -32 } },
  "College Alumni":      { color: "rgba(105,75,150,0.75)", bg: "rgba(105,75,150,0.07)", labelPos: { x: 18, y: -32 } },
  "Industry Peers":      { color: "rgba(180,140,60,0.85)", bg: "rgba(180,140,60,0.08)", labelPos: { x: -18, y: 10 } },
  "Close Friends":       { color: "rgba(70,130,160,0.8)",  bg: "rgba(70,130,160,0.07)", labelPos: { x: 18, y: 10 } },
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
  { id: "p1",  name: "Priya Venkatesh",  initials: "PV", role: "Engineering Lead, Notion",  context: "Stripe Infra together '16–'19",    group: "Previous Colleagues", radial: { x: -20, y: -16 }, grouped: { x: -18, y: -24 }, enterAt: 0.10 },
  { id: "p2",  name: "Marcus Chen",      initials: "MC", role: "VP Product, Ramp",          context: "Stripe Payments team '15–'19",    group: "Previous Colleagues", radial: { x: -22, y: 4 },   grouped: { x: -18, y: -12 }, enterAt: 0.12 },
  { id: "p3",  name: "Sarah Kim",        initials: "SK", role: "Founding Engineer, Linear",  context: "Shipped Stripe Connect together", group: "Previous Colleagues", radial: { x: -17, y: 20 },  grouped: { x: -18, y: 0 },   enterAt: 0.14 },
  { id: "p4",  name: "Kavya Iyer",       initials: "KI", role: "Partner, Sequoia Capital",   context: "Stanford CS '13, same lab group", group: "College Alumni",      radial: { x: -6, y: -26 },  grouped: { x: 18, y: -24 },  enterAt: 0.16 },
  { id: "p5",  name: "James Liu",        initials: "JL", role: "CTO, Figma",                 context: "Stanford CS '14, classmate",      group: "College Alumni",      radial: { x: 10, y: -26 },  grouped: { x: 18, y: -12 },  enterAt: 0.18 },
  { id: "p6",  name: "Ananya Rao",       initials: "AR", role: "CEO, Cleo Capital",           context: "Stanford MBA '15, same dorm",     group: "College Alumni",      radial: { x: 20, y: -16 },  grouped: { x: 18, y: 0 },    enterAt: 0.20 },
  { id: "p7",  name: "Rajan Anand",      initials: "RA", role: "GP, Lightspeed Ventures",     context: "Co-invested in Arcline Series A", group: "Industry Peers",      radial: { x: 22, y: 4 },    grouped: { x: -18, y: 18 },  enterAt: 0.22 },
  { id: "p8",  name: "Nina Patel",       initials: "NP", role: "COO, Zepto",                  context: "Sequoia portfolio overlap",       group: "Industry Peers",      radial: { x: 17, y: 20 },   grouped: { x: -18, y: 30 },  enterAt: 0.24 },
  { id: "p9",  name: "David Park",       initials: "DP", role: "Staff ML, Google DeepMind",   context: "Stanford roommate '11–'14",       group: "Close Friends",       radial: { x: -4, y: 28 },   grouped: { x: 18, y: 18 },   enterAt: 0.26 },
  { id: "p10", name: "Meera Shah",       initials: "MS", role: "Founder, Bloom Health",        context: "Stanford ACM club together",      group: "Close Friends",       radial: { x: 6, y: 28 },    grouped: { x: 18, y: 30 },   enterAt: 0.28 },
];

// ─── Insights ───────────────────────────────────────────────────────────

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
    target: { name: "Rajesh Jejurikar", role: "President, Auto Division, Mahindra" },
    intermediary: {
      name: "Priya Venkatesh",
      role: "Engineering Lead, Notion",
      toYou: "Stripe together '16–'19",
      toTarget: "IIT classmate, close friend",
    },
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// SCROLL TIMELINE  (1000vh)
//
//  01 Network         0.00 – 0.44
//    Founder card       0.00 – 0.04  enter
//    Pills stagger      0.10 – 0.30
//    Radial→Grouped     0.30 – 0.38
//    Group labels       0.34 – 0.38
//    Network exit       0.40 – 0.46
//
//  Bridge text          0.44 – 0.54
//
//  02 Insights A        0.48 – 0.76
//    Identity card      0.48 – 0.53
//    Recent layer       0.55 – 0.60  (items stagger)
//    Remember layer     0.62 – 0.67  (items stagger)
//    Strategic layer    0.68 – 0.72
//    Movement A exit    0.72 – 0.76
//
//  02 Insights B        0.74 – 0.96
//    Scene enter        0.74 – 0.78
//    Cold path          0.78 – 0.82
//    Warm path          0.83 – 0.89
//    Insight badge      0.89 – 0.92
//    Recommend card     0.91 – 0.94
//
//  Exit                 0.96 – 1.00
// ═══════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY
// ═══════════════════════════════════════════════════════════════════════════

function PaperGrain({ id }: { id: string }) {
  return (
    <svg
      style={{
        position: "absolute", inset: 0, width: "100%", height: "100%",
        opacity: 0.03, mixBlendMode: "overlay" as const, pointerEvents: "none" as const,
      }}
    >
      <filter id={id}>
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#${id})`} />
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// NETWORK COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

function FounderCard({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const rotate = useTransform(scrollYProgress, [0.0, 0.06], [-6, 0]);
  const opacity = useTransform(scrollYProgress, [0.0, 0.04, 0.40, 0.46], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0.0, 0.04, 0.30, 0.40], [0.92, 1, 1, 0.92]);
  const y = useTransform(scrollYProgress, [0.0, 0.04], [40, 0]);

  return (
    <motion.div
      style={{
        rotate, opacity, scale, y,
        position: "absolute", left: "50%", top: "50%",
        marginLeft: -130, marginTop: -100,
        width: 260, height: 200, zIndex: 50,
        transformOrigin: "center center",
      }}
    >
      <div
        style={{
          width: "100%", height: "100%", borderRadius: 3,
          background: "linear-gradient(168deg, #f5ebe3 0%, #e8ddd1 100%)",
          boxShadow: "0 1px 0 rgba(255,255,255,0.5) inset, 0 16px 48px -8px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
          border: "1px solid rgba(60,70,50,0.08)",
          position: "relative", overflow: "hidden",
          padding: "22px 20px 16px",
          display: "flex", flexDirection: "column" as const,
        }}
      >
        <PaperGrain id="network-grain" />
        {/* Punch hole */}
        <div
          style={{
            position: "absolute", top: 9, left: 10, width: 8, height: 8, borderRadius: "50%",
            background: "radial-gradient(circle at 30% 30%, #e0d8ce 0%, #c8c0b4 100%)",
            boxShadow: "inset 0 1px 3px rgba(0,0,0,0.15), 0 0 0 0.5px rgba(0,0,0,0.04)",
          }}
        />
        <div style={{ fontFamily: mono, fontSize: 16, fontWeight: 500, color: "rgba(35,25,15,0.9)", letterSpacing: "0.02em", marginBottom: 2 }}>
          {founder.name}
        </div>
        <div style={{ height: 1, background: "linear-gradient(90deg, rgba(60,70,50,0.15) 0%, transparent 80%)", marginBottom: 10, marginTop: 5 }} />
        <div style={{ fontFamily: mono, fontSize: 8, color: "rgba(80,50,30,0.4)", letterSpacing: "0.14em", textTransform: "uppercase" as const, marginBottom: 2 }}>DOES</div>
        <div style={{ fontFamily: mono, fontSize: 12, color: "rgba(35,25,15,0.72)", marginBottom: 10 }}>{founder.role}</div>
        <div style={{ fontFamily: mono, fontSize: 8, color: "rgba(80,50,30,0.4)", letterSpacing: "0.14em", textTransform: "uppercase" as const, marginBottom: 2 }}>BACKGROUND</div>
        <div style={{ fontFamily: serif, fontSize: 12, fontStyle: "italic", color: "rgba(35,25,15,0.62)", lineHeight: 1.4 }}>{founder.background}</div>
        <div style={{ marginTop: "auto" }}>
          <div style={{ fontFamily: mono, fontSize: 8, color: "rgba(80,50,30,0.4)", letterSpacing: "0.14em", textTransform: "uppercase" as const, marginBottom: 2 }}>KNOWN FOR</div>
          <div style={{ fontFamily: mono, fontSize: 11, color: "rgba(35,25,15,0.78)", fontWeight: 500 }}>{founder.knownFor}</div>
        </div>
      </div>
    </motion.div>
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
  const color = groupConfig[group].color;
  const entryEnd = enterAt + 0.02;

  const pillOpacity = useTransform(scrollYProgress, [enterAt, entryEnd, 0.40, 0.46], [0, 1, 1, 0]);
  const pillScale = useTransform(scrollYProgress, [enterAt, entryEnd], [0.85, 1]);
  const pillRotate = useTransform(scrollYProgress, [enterAt, entryEnd], [-3, 0]);

  const xVw = useTransform(scrollYProgress, [0.30, 0.38], [radial.x, grouped.x]);
  const yVh = useTransform(scrollYProgress, [0.30, 0.38], [radial.y, grouped.y]);
  const xCalc = useTransform(xVw, (v) => `calc(${v}vw - 50%)`);
  const yCalc = useTransform(yVh, (v) => `calc(${v}vh - 50%)`);

  return (
    <div style={{ position: "absolute", left: "50%", top: "50%", zIndex: 30 }}>
      <motion.div style={{ x: xCalc, y: yCalc, opacity: pillOpacity, scale: pillScale, rotate: pillRotate }}>
        <div
          style={{
            background: "linear-gradient(170deg, #faf6f1 0%, #f3ede5 100%)",
            border: "1px solid rgba(60,70,50,0.10)",
            borderRadius: 6,
            padding: "10px 14px 10px 12px",
            minWidth: 190, maxWidth: 230,
            boxShadow: "0 1px 0 rgba(255,255,255,0.6) inset, 0 4px 20px -4px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)",
            position: "relative", overflow: "hidden",
            display: "flex", gap: 10, alignItems: "flex-start",
          }}
        >
          {/* Group accent bar */}
          <div
            style={{
              position: "absolute", left: 0, top: 0, bottom: 0, width: 3,
              background: `linear-gradient(180deg, ${color} 0%, transparent 100%)`,
            }}
          />
          {/* Initials avatar */}
          <div
            style={{
              width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
              background: `linear-gradient(135deg, ${color.replace(/[\d.]+\)$/, "0.12)")}, ${color.replace(/[\d.]+\)$/, "0.04)")})`,
              border: `1px solid ${color.replace(/[\d.]+\)$/, "0.18)")}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: mono, fontSize: 9, fontWeight: 700, letterSpacing: "0.05em",
              color, marginTop: 2,
            }}
          >
            {person.initials}
          </div>
          {/* Text content */}
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: mono, fontSize: 13, fontWeight: 600, color: "rgba(35,25,15,0.88)", letterSpacing: "0.01em", marginBottom: 2 }}>
              {person.name}
            </div>
            <div style={{ fontFamily: mono, fontSize: 11, color: "rgba(35,25,15,0.45)", marginBottom: 4, letterSpacing: "0.02em" }}>
              {person.role}
            </div>
            <div style={{ fontFamily: serif, fontSize: 12, fontStyle: "italic", color, lineHeight: 1.3 }}>
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
  const color = groupConfig[group].color;

  const lineOpacity = useTransform(
    scrollYProgress,
    [enterAt - 0.005, enterAt + 0.015, 0.40, 0.46],
    [0, 0.35, 0.35, 0]
  );
  const dashOffset = useTransform(scrollYProgress, [enterAt - 0.005, enterAt + 0.02], [30, 0]);

  const endX = useTransform(scrollYProgress, [0.30, 0.38], [radial.x, grouped.x]);
  const endY = useTransform(scrollYProgress, [0.30, 0.38], [radial.y, grouped.y]);
  const x2 = useTransform(endX, (v) => 35 + v);
  const y2 = useTransform(endY, (v) => 50 + v);

  return (
    <motion.line
      x1={35} y1={50} x2={x2} y2={y2}
      stroke={color} strokeWidth={0.15}
      strokeDasharray="0.6 0.4"
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

  const labelOpacity = useTransform(scrollYProgress, [0.34, 0.38, 0.40, 0.46], [0, 1, 1, 0]);
  const labelY = useTransform(scrollYProgress, [0.34, 0.38], [8, 0]);

  return (
    <div
      style={{
        position: "absolute", left: "50%", top: "50%",
        transform: `translate(calc(${labelPos.x}vw - 50%), calc(${labelPos.y}vh - 50%))`,
        zIndex: 40,
      }}
    >
      <motion.div
        style={{
          opacity: labelOpacity, y: labelY,
          fontFamily: mono, fontSize: 10, letterSpacing: "0.16em",
          textTransform: "uppercase" as const,
          color, background: bg,
          padding: "4px 12px 3px", borderRadius: 3,
          whiteSpace: "nowrap" as const, fontWeight: 600,
          borderBottom: `1.5px solid ${color}`,
        }}
      >
        {group}
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// BRIDGE TEXT (Network → Insights transition)
// ═══════════════════════════════════════════════════════════════════════════

function BridgeText({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const opacity = useTransform(scrollYProgress, [0.44, 0.48, 0.50, 0.54], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0.44, 0.48], [20, 0]);

  return (
    <motion.div
      style={{
        opacity, y,
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 60, pointerEvents: "none" as const,
      }}
    >
      <div style={{ textAlign: "center" as const, maxWidth: 360 }}>
        <div
          style={{
            fontFamily: serif,
            fontSize: "clamp(1.1rem, 1.8vw, 1.5rem)",
            fontStyle: "italic",
            color: "rgba(9,9,11,0.35)",
            lineHeight: 1.6,
            letterSpacing: "0.01em",
          }}
        >
          but a map only shows
          <br />
          where things are.
          <br />
          <span style={{ color: "rgba(9,9,11,0.55)" }}>
            not what&apos;s happening
            <br />
            inside them.
          </span>
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
  const enterAt = baseEnter + index * 0.012;
  const opacity = useTransform(scrollYProgress, [enterAt, enterAt + 0.018], [0, 1]);
  const y = useTransform(scrollYProgress, [enterAt, enterAt + 0.018], [10, 0]);
  const x = useTransform(scrollYProgress, [enterAt, enterAt + 0.018], [-4, 0]);

  return (
    <motion.div style={{ opacity, y, x, display: "flex", gap: 8 }}>
      <span style={{ color, flexShrink: 0, fontSize: 10, marginTop: 2 }}>&#9656;</span>
      <span style={{ fontFamily: mono, fontSize: 12, color: "rgba(35,25,15,0.72)", lineHeight: 1.45 }}>
        {children}
      </span>
    </motion.div>
  );
}

function IntelligenceLayer({
  label,
  color,
  bgColor,
  borderColor,
  children,
  scrollYProgress,
  enterRange,
}: {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  children: React.ReactNode;
  scrollYProgress: MotionValue<number>;
  enterRange: [number, number];
}) {
  const opacity = useTransform(scrollYProgress, enterRange, [0, 1]);
  const y = useTransform(scrollYProgress, enterRange, [24, 0]);

  return (
    <motion.div
      style={{
        opacity, y,
        background: bgColor,
        border: `1px solid ${borderColor}`,
        borderRadius: 8,
        padding: "14px 18px 12px",
        borderLeft: `3px solid ${color}`,
        position: "relative",
      }}
    >
      <div
        style={{
          fontFamily: mono, fontSize: 9, letterSpacing: "0.14em",
          textTransform: "uppercase" as const, color,
          marginBottom: 8, fontWeight: 600,
        }}
      >
        {label}
      </div>
      {children}
    </motion.div>
  );
}

function InsightsMovementA({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const cardOpacity = useTransform(scrollYProgress, [0.48, 0.53], [0, 1]);
  const cardScale = useTransform(scrollYProgress, [0.48, 0.53, 0.70, 0.74], [0.92, 1, 1, 0.90]);
  const cardY = useTransform(scrollYProgress, [0.48, 0.53], [50, 0]);
  const exitOpacity = useTransform(scrollYProgress, [0.72, 0.76], [1, 0]);

  return (
    <motion.div
      style={{
        opacity: exitOpacity,
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <motion.div
        style={{
          opacity: cardOpacity, scale: cardScale, y: cardY,
          width: "min(380px, 28vw)",
          display: "flex", flexDirection: "column" as const, gap: 10,
        }}
      >
        {/* Identity Card */}
        <div
          style={{
            background: "linear-gradient(168deg, #f5ebe3 0%, #e8ddd1 100%)",
            border: "1px solid rgba(60,70,50,0.10)",
            borderRadius: 10,
            padding: "22px 22px 18px",
            position: "relative", overflow: "hidden",
            boxShadow: "0 1px 0 rgba(255,255,255,0.5) inset, 0 16px 48px -8px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <PaperGrain id="insights-identity-grain" />
          <div
            style={{
              position: "absolute", top: 10, left: 11, width: 8, height: 8, borderRadius: "50%",
              background: "radial-gradient(circle at 30% 30%, #e0d8ce 0%, #c8c0b4 100%)",
              boxShadow: "inset 0 1px 3px rgba(0,0,0,0.15)",
            }}
          />
          <div style={{ fontFamily: mono, fontSize: 17, fontWeight: 600, color: "rgba(35,25,15,0.90)", letterSpacing: "0.01em", marginBottom: 4 }}>
            {founder.name}
          </div>
          <div style={{ height: 1, background: "linear-gradient(90deg, rgba(60,70,50,0.15) 0%, transparent 80%)", marginBottom: 10, marginTop: 4 }} />
          <div style={{ fontFamily: mono, fontSize: 12, color: "rgba(35,25,15,0.65)", marginBottom: 4 }}>
            {founder.role}
          </div>
          <div style={{ fontFamily: serif, fontSize: 12, fontStyle: "italic", color: "rgba(35,25,15,0.50)", lineHeight: 1.4 }}>
            {founder.background}
          </div>
        </div>

        {/* Recent Signals — staggered items */}
        <IntelligenceLayer
          label="Recent"
          color="rgba(45,100,180,0.80)"
          bgColor="rgba(45,100,180,0.04)"
          borderColor="rgba(45,100,180,0.12)"
          scrollYProgress={scrollYProgress}
          enterRange={[0.55, 0.59]}
        >
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 6 }}>
            {insights.recent.map((s, i) => (
              <StaggeredItem key={i} scrollYProgress={scrollYProgress} baseEnter={0.56} index={i} color="rgba(45,100,180,0.70)">
                {s.text}
              </StaggeredItem>
            ))}
          </div>
        </IntelligenceLayer>

        {/* Personal Context — staggered items */}
        <IntelligenceLayer
          label="Remember"
          color="rgba(50,140,80,0.80)"
          bgColor="rgba(50,140,80,0.04)"
          borderColor="rgba(50,140,80,0.12)"
          scrollYProgress={scrollYProgress}
          enterRange={[0.62, 0.66]}
        >
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 6 }}>
            {insights.personal.map((s, i) => (
              <StaggeredItem key={i} scrollYProgress={scrollYProgress} baseEnter={0.63} index={i} color="rgba(50,140,80,0.70)">
                {s.text}
              </StaggeredItem>
            ))}
          </div>
        </IntelligenceLayer>

        {/* Strategic Context */}
        <IntelligenceLayer
          label="Why They Matter"
          color="rgba(130,90,200,0.80)"
          bgColor="rgba(130,90,200,0.04)"
          borderColor="rgba(130,90,200,0.12)"
          scrollYProgress={scrollYProgress}
          enterRange={[0.68, 0.72]}
        >
          <div style={{ fontFamily: serif, fontSize: 13, fontStyle: "italic", color: "rgba(35,25,15,0.68)", lineHeight: 1.55 }}>
            {insights.strategic}
          </div>
        </IntelligenceLayer>
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
      style={{
        position: "absolute",
        left: `calc(50% + ${x}vw)`,
        top: `calc(50% + ${y}vh)`,
        transform: "translate(-50%, -50%)",
        zIndex: 10,
      }}
    >
      <div
        style={{
          background: bgColor,
          border: `1.5px solid ${borderColor}`,
          borderRadius: 10,
          padding: "12px 18px 10px",
          minWidth: 130,
          textAlign: "center" as const,
          boxShadow: "0 4px 20px -4px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)",
        }}
      >
        <div style={{ fontFamily: mono, fontSize: 14, fontWeight: 600, color, letterSpacing: "0.01em" }}>
          {label}
        </div>
        {sublabel && (
          <div style={{ fontFamily: mono, fontSize: 10, color: "rgba(35,25,15,0.45)", marginTop: 3 }}>
            {sublabel}
          </div>
        )}
      </div>
    </div>
  );
}

function InsightsMovementB({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const enterOpacity = useTransform(scrollYProgress, [0.74, 0.78], [0, 1]);
  const enterY = useTransform(scrollYProgress, [0.74, 0.78], [40, 0]);

  // Cold path — fades in with dashed style
  const coldOpacity = useTransform(scrollYProgress, [0.78, 0.82], [0, 1]);
  const coldLabelOpacity = useTransform(scrollYProgress, [0.80, 0.83], [0, 1]);

  // Warm path — draws in progressively via strokeDashoffset
  const warmOpacity = useTransform(scrollYProgress, [0.83, 0.87], [0, 1]);
  const warmLeg1Dash = useTransform(scrollYProgress, [0.83, 0.87], [1, 0]);
  const warmLeg2Dash = useTransform(scrollYProgress, [0.85, 0.89], [1, 0]);
  const warmLabel1Opacity = useTransform(scrollYProgress, [0.86, 0.89], [0, 1]);
  const warmLabel2Opacity = useTransform(scrollYProgress, [0.87, 0.90], [0, 1]);

  // Bottom elements
  const insightOpacity = useTransform(scrollYProgress, [0.89, 0.92], [0, 1]);
  const insightY = useTransform(scrollYProgress, [0.89, 0.92], [16, 0]);
  const recommendOpacity = useTransform(scrollYProgress, [0.91, 0.94], [0, 1]);
  const recommendY = useTransform(scrollYProgress, [0.91, 0.94], [16, 0]);

  // Node positions (vw/vh offsets from center)
  const youX = -14, youY = -6;
  const targetX = 14, targetY = -6;
  const midX = 0, midY = 10;

  // SVG coordinates (viewBox "0 0 70 100")
  const sYou = { x: 35 + youX, y: 50 + youY };
  const sTarget = { x: 35 + targetX, y: 50 + targetY };
  const sMid = { x: 35 + midX, y: 50 + midY };

  // Bezier control points for organic curves
  const coldCp = { x: 35, y: 50 + youY - 8 };
  const warmCp1 = { x: sYou.x + 4, y: (sYou.y + sMid.y) / 2 - 2 };
  const warmCp2 = { x: sTarget.x - 4, y: (sMid.y + sTarget.y) / 2 - 2 };

  return (
    <motion.div style={{ opacity: enterOpacity, y: enterY, position: "absolute", inset: 0 }}>
      {/* SVG paths */}
      <svg
        viewBox="0 0 70 100"
        preserveAspectRatio="none"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 5, pointerEvents: "none" }}
      >
        {/* Cold path — dashed bezier arc */}
        <motion.path
          d={`M ${sYou.x} ${sYou.y} Q ${coldCp.x} ${coldCp.y} ${sTarget.x} ${sTarget.y}`}
          fill="none"
          stroke="rgba(150,150,150,0.30)"
          strokeWidth={0.18}
          strokeDasharray="0.8 0.5"
          style={{ opacity: coldOpacity }}
        />
        {/* Warm leg 1 — solid bezier, draws in */}
        <motion.path
          d={`M ${sYou.x} ${sYou.y} Q ${warmCp1.x} ${warmCp1.y} ${sMid.x} ${sMid.y}`}
          fill="none"
          stroke="rgba(200,150,50,0.70)"
          strokeWidth={0.35}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="1"
          style={{ opacity: warmOpacity, strokeDashoffset: warmLeg1Dash }}
        />
        {/* Warm leg 2 — solid bezier, draws in */}
        <motion.path
          d={`M ${sMid.x} ${sMid.y} Q ${warmCp2.x} ${warmCp2.y} ${sTarget.x} ${sTarget.y}`}
          fill="none"
          stroke="rgba(200,150,50,0.70)"
          strokeWidth={0.35}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="1"
          style={{ opacity: warmOpacity, strokeDashoffset: warmLeg2Dash }}
        />
      </svg>

      {/* Nodes */}
      <PathNode label="YOU" color="rgba(45,100,180,0.85)" bgColor="rgba(45,100,180,0.06)" borderColor="rgba(45,100,180,0.25)" x={youX} y={youY} />
      <PathNode label={insights.path.target.name} sublabel={insights.path.target.role} color="rgba(180,70,70,0.80)" bgColor="rgba(180,70,70,0.05)" borderColor="rgba(180,70,70,0.20)" x={targetX} y={targetY} />
      <motion.div style={{ opacity: warmOpacity }}>
        <PathNode label={insights.path.intermediary.name} sublabel={insights.path.intermediary.role} color="rgba(50,140,80,0.85)" bgColor="rgba(50,140,80,0.06)" borderColor="rgba(50,140,80,0.20)" x={midX} y={midY} />
      </motion.div>

      {/* Cold path label */}
      <motion.div
        style={{
          opacity: coldLabelOpacity,
          position: "absolute", left: "50%",
          top: `calc(50% + ${youY - 8}vh)`,
          transform: "translateX(-50%)", zIndex: 15,
        }}
      >
        <div style={{ fontFamily: mono, fontSize: 10, color: "rgba(150,150,150,0.60)", textAlign: "center" as const, whiteSpace: "nowrap" as const }}>
          cold LinkedIn &middot; added 2019 &middot; never messaged
        </div>
      </motion.div>

      {/* Warm label: YOU → Priya */}
      <motion.div
        style={{
          opacity: warmLabel1Opacity,
          position: "absolute",
          left: `calc(50% + ${(youX + midX) / 2}vw - 2vw)`,
          top: `calc(50% + ${(youY + midY) / 2}vh + 1vh)`,
          zIndex: 15,
        }}
      >
        <div style={{ fontFamily: serif, fontSize: 11, fontStyle: "italic", color: "rgba(180,130,40,0.85)", whiteSpace: "nowrap" as const }}>
          {insights.path.intermediary.toYou}
        </div>
      </motion.div>

      {/* Warm label: Priya → Target */}
      <motion.div
        style={{
          opacity: warmLabel2Opacity,
          position: "absolute",
          left: `calc(50% + ${(midX + targetX) / 2}vw + 1vw)`,
          top: `calc(50% + ${(midY + targetY) / 2}vh + 1vh)`,
          zIndex: 15,
        }}
      >
        <div style={{ fontFamily: serif, fontSize: 11, fontStyle: "italic", color: "rgba(180,130,40,0.85)", whiteSpace: "nowrap" as const }}>
          {insights.path.intermediary.toTarget}
        </div>
      </motion.div>

      {/* Insight badge */}
      <motion.div
        style={{
          opacity: insightOpacity, y: insightY,
          position: "absolute", left: "50%", bottom: "14vh",
          transform: "translateX(-50%)", zIndex: 20,
          textAlign: "center" as const,
        }}
      >
        <div
          style={{
            background: "rgba(200,150,50,0.08)",
            border: "1px solid rgba(200,150,50,0.18)",
            borderRadius: 6, padding: "10px 22px 9px",
            fontFamily: mono, fontSize: 12, color: "rgba(160,120,30,0.85)",
            fontWeight: 600, letterSpacing: "0.02em",
          }}
        >
          2 warm hops &gt; 1 cold connection
        </div>
      </motion.div>

      {/* Recommended intro card */}
      <motion.div
        style={{
          opacity: recommendOpacity, y: recommendY,
          position: "absolute", left: "50%", bottom: "5vh",
          transform: "translateX(-50%)", zIndex: 20,
          width: "min(320px, 24vw)",
        }}
      >
        <div
          style={{
            background: "linear-gradient(168deg, #faf6f1 0%, #f3ede5 100%)",
            border: "1px solid rgba(60,70,50,0.10)",
            borderRadius: 8, padding: "14px 18px 12px",
            boxShadow: "0 4px 16px -4px rgba(0,0,0,0.06)",
          }}
        >
          <div style={{ fontFamily: mono, fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "rgba(80,50,30,0.45)", marginBottom: 8, fontWeight: 600 }}>
            Recommended Intro Path
          </div>
          <div style={{ fontFamily: mono, fontSize: 12, color: "rgba(35,25,15,0.72)", lineHeight: 1.55 }}>
            Ask <span style={{ fontWeight: 600, color: "rgba(50,140,80,0.85)" }}>{insights.path.intermediary.name}</span> for
            an intro to {insights.path.target.name}. {insights.path.intermediary.name.split(" ")[0]} and {insights.path.target.name.split(" ")[0]} were in the same IIT batch. She introduced you to two others
            in his circle last year.
          </div>
          <div style={{ fontFamily: mono, fontSize: 10, color: "rgba(50,140,80,0.70)", marginTop: 8, fontWeight: 600 }}>
            Trust: strong
          </div>
        </div>
      </motion.div>
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

  // ── Left Panel: Section labels ──
  const label01Opacity = useTransform(scrollYProgress, [0.01, 0.05, 0.42, 0.47], [0, 1, 1, 0]);
  const label02Opacity = useTransform(scrollYProgress, [0.47, 0.52, 0.94, 0.98], [0, 1, 1, 0]);

  // ── Left Panel: Headlines ──
  const h1Opacity = useTransform(scrollYProgress, [0.01, 0.05, 0.42, 0.47], [0, 1, 1, 0]);
  const h1Y = useTransform(scrollYProgress, [0.01, 0.05], [20, 0]);
  const h2Opacity = useTransform(scrollYProgress, [0.47, 0.52, 0.72, 0.76], [0, 1, 1, 0]);
  const h2Y = useTransform(scrollYProgress, [0.47, 0.52], [20, 0]);
  const h3Opacity = useTransform(scrollYProgress, [0.76, 0.80, 0.94, 0.98], [0, 1, 1, 0]);
  const h3Y = useTransform(scrollYProgress, [0.76, 0.80], [20, 0]);

  // ── Left Panel: Subtexts ──
  const sub1Opacity = useTransform(scrollYProgress, [0.03, 0.07, 0.25, 0.30], [0, 1, 1, 0]);
  const sub2Opacity = useTransform(scrollYProgress, [0.32, 0.37, 0.42, 0.47], [0, 1, 1, 0]);
  const sub3Opacity = useTransform(scrollYProgress, [0.50, 0.55, 0.72, 0.76], [0, 1, 1, 0]);
  const sub4Opacity = useTransform(scrollYProgress, [0.78, 0.82, 0.94, 0.98], [0, 1, 1, 0]);

  // Section exit
  const sectionOpacity = useTransform(scrollYProgress, [0.96, 1.0], [1, 0]);

  // Shared text styles
  const headlineBase = {
    position: "absolute" as const, top: 0, left: 0, right: 0,
    fontFamily: serif, fontSize: "clamp(1.6rem, 2.8vw, 2.4rem)",
    fontStyle: "italic" as const, color: "rgba(9,9,11,0.82)",
    fontWeight: 400, margin: 0, lineHeight: 1.25,
  };
  const subtextBase = {
    position: "absolute" as const, top: 0, left: 0, right: 0,
    fontFamily: mono, fontSize: 14, color: "rgba(9,9,11,0.40)",
    lineHeight: 1.7, letterSpacing: "0.02em", margin: 0,
  };
  const labelBase = {
    position: "absolute" as const, top: 0, left: 0,
    fontFamily: mono, fontSize: 11, letterSpacing: "0.14em",
    textTransform: "uppercase" as const, color: "rgba(9,9,11,0.30)",
  };

  return (
    <section ref={sectionRef} className="relative" style={{ height: "1000vh" }}>
      <motion.div
        className="sticky top-0 h-screen overflow-hidden"
        style={{ opacity: sectionOpacity, background: "#fff", display: "flex" }}
      >
        {/* ══ Left text panel — 30% ══════════════════════════════ */}
        <div
          style={{
            width: "30%", height: "100%",
            display: "flex", flexDirection: "column" as const, justifyContent: "center",
            paddingLeft: "5vw", paddingRight: "2vw",
          }}
        >
          {/* Section labels — crossfade */}
          <div style={{ position: "relative", height: 20, marginBottom: 24 }}>
            <motion.div style={{ ...labelBase, opacity: label01Opacity }}>
              01 — Your Network
            </motion.div>
            <motion.div style={{ ...labelBase, opacity: label02Opacity }}>
              02 — Insights
            </motion.div>
          </div>

          {/* Headlines — crossfade */}
          <div style={{ position: "relative", minHeight: 100 }}>
            <motion.h2 style={{ ...headlineBase, opacity: h1Opacity, y: h1Y }}>
              brace maps<br />your world
            </motion.h2>
            <motion.h2 style={{ ...headlineBase, opacity: h2Opacity, y: h2Y }}>
              brace knows what<br />you&apos;d forget
            </motion.h2>
            <motion.h2 style={{ ...headlineBase, opacity: h3Opacity, y: h3Y }}>
              and paths you<br />can&apos;t see
            </motion.h2>
          </div>

          {/* Subtexts — crossfade */}
          <div style={{ position: "relative", marginTop: 28, minHeight: 80 }}>
            <motion.p style={{ ...subtextBase, opacity: sub1Opacity }}>
              from one profile, we find<br />who matters — and why
            </motion.p>
            <motion.p style={{ ...subtextBase, opacity: sub2Opacity }}>
              relationships you already have —<br />organized by how you know them
            </motion.p>
            <motion.p style={{ ...subtextBase, opacity: sub3Opacity }}>
              what they&apos;re building,<br />what they care about,<br />what just changed
            </motion.p>
            <motion.p style={{ ...subtextBase, opacity: sub4Opacity }}>
              the warmest path,<br />not the shortest
            </motion.p>
          </div>
        </div>

        {/* ══ Right visualization panel — 70% ═══════════════════ */}
        <div style={{ width: "70%", height: "100%", position: "relative", overflow: "hidden" }}>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(200,190,175,0.06),transparent)]" />
          </div>

          {/* ── Network (0% – 46%) ── */}
          <FounderCard scrollYProgress={scrollYProgress} />

          <svg
            viewBox="0 0 70 100"
            preserveAspectRatio="none"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 20, pointerEvents: "none" }}
          >
            {people.map((p) => (
              <ConnectingLine key={p.id} person={p} scrollYProgress={scrollYProgress} />
            ))}
          </svg>

          {people.map((p) => (
            <PersonPill key={p.id} person={p} scrollYProgress={scrollYProgress} />
          ))}

          {groups.map((g) => (
            <GroupLabel key={g} group={g} scrollYProgress={scrollYProgress} />
          ))}

          {/* ── Bridge text (44% – 54%) ── */}
          <BridgeText scrollYProgress={scrollYProgress} />

          {/* ── Insights Movement A (48% – 76%) ── */}
          <InsightsMovementA scrollYProgress={scrollYProgress} />

          {/* ── Insights Movement B (74% – 96%) ── */}
          <InsightsMovementB scrollYProgress={scrollYProgress} />
        </div>
      </motion.div>
    </section>
  );
}
