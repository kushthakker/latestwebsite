"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

// ─── Data ────────────────────────────────────────────────────────────────────

const founder = {
  name: "Arjun Mehta",
  role: "Co-founder & CEO, Arcline",
  background: "Previously Product at Stripe · Stanford CS '14",
  knownFor: "Fintech infrastructure, developer tools",
};

interface Person {
  id: string;
  name: string;
  role: string;
  context: string;
  group: string;
}

const people: Person[] = [
  { id: "p1", name: "Priya Venkatesh", role: "Engineering Lead, Notion", context: "Stripe Infra together '16–'19", group: "Previous Colleagues" },
  { id: "p2", name: "Marcus Chen", role: "VP Product, Ramp", context: "Stripe Payments team '15–'19", group: "Previous Colleagues" },
  { id: "p3", name: "Sarah Kim", role: "Founding Engineer, Linear", context: "Shipped Stripe Connect together", group: "Previous Colleagues" },
  { id: "p4", name: "Kavya Iyer", role: "Partner, Sequoia Capital", context: "Stanford CS '13, same lab group", group: "College Alumni" },
  { id: "p5", name: "James Liu", role: "CTO, Figma", context: "Stanford CS '14, classmate", group: "College Alumni" },
  { id: "p6", name: "Ananya Rao", role: "CEO, Cleo Capital", context: "Stanford MBA '15, same dorm", group: "College Alumni" },
  { id: "p7", name: "Rajan Anand", role: "GP, Lightspeed Ventures", context: "Co-invested in Arcline Series A", group: "Industry Peers" },
  { id: "p8", name: "Nina Patel", role: "COO, Zepto", context: "Sequoia portfolio overlap", group: "Industry Peers" },
  { id: "p9", name: "David Park", role: "Staff ML, Google DeepMind", context: "Stanford roommate '11–'14", group: "Close Friends" },
  { id: "p10", name: "Meera Shah", role: "Founder, Bloom Health", context: "Stanford ACM club together", group: "Close Friends" },
];

const groups = ["Previous Colleagues", "College Alumni", "Industry Peers", "Close Friends"];

const groupColors: Record<string, string> = {
  "Previous Colleagues": "rgba(80,100,60,0.85)",
  "College Alumni": "rgba(105,75,150,0.75)",
  "Industry Peers": "rgba(180,140,60,0.85)",
  "Close Friends": "rgba(70,130,160,0.8)",
};

const groupColorsBg: Record<string, string> = {
  "Previous Colleagues": "rgba(80,100,60,0.08)",
  "College Alumni": "rgba(105,75,150,0.07)",
  "Industry Peers": "rgba(180,140,60,0.08)",
  "Close Friends": "rgba(70,130,160,0.07)",
};

// ─── Positions (vw/vh offsets from center) ───────────────────────────────

interface Pos { x: number; y: number }

// Radial spread — constellation around center card
const radialPositions: Record<string, Pos> = {
  p1:  { x: -30, y: -16 },
  p2:  { x: -34, y: 5 },
  p3:  { x: -26, y: 22 },
  p4:  { x: -10, y: -28 },
  p5:  { x: 14, y: -28 },
  p6:  { x: 30, y: -16 },
  p7:  { x: 34, y: 5 },
  p8:  { x: 26, y: 22 },
  p9:  { x: -6, y: 30 },
  p10: { x: 8, y: 30 },
};

// Grouped clusters — 4 quadrants, 13vh vertical spacing between cards
const groupedPositions: Record<string, Pos> = {
  // Previous Colleagues — top-left
  p1:  { x: -30, y: -26 },
  p2:  { x: -30, y: -13 },
  p3:  { x: -30, y: 0 },
  // College Alumni — top-right
  p4:  { x: 26, y: -26 },
  p5:  { x: 26, y: -13 },
  p6:  { x: 26, y: 0 },
  // Industry Peers — bottom-left
  p7:  { x: -30, y: 20 },
  p8:  { x: -30, y: 33 },
  // Close Friends — bottom-right
  p9:  { x: 26, y: 20 },
  p10: { x: 26, y: 33 },
};

const groupLabelPositions: Record<string, Pos> = {
  "Previous Colleagues": { x: -30, y: -34 },
  "College Alumni":      { x: 26, y: -34 },
  "Industry Peers":      { x: -30, y: 12 },
  "Close Friends":       { x: 26, y: 12 },
};

// Staggered entrance times
const entranceTimes: Record<string, number> = {
  p1: 0.20, p2: 0.23, p3: 0.26,
  p4: 0.29, p5: 0.32, p6: 0.35,
  p7: 0.38, p8: 0.41,
  p9: 0.44, p10: 0.47,
};

// ─── Fonts ───────────────────────────────────────────────────────────────

const mono = "'Courier New', Courier, monospace";
const serif = "'Georgia', 'Times New Roman', serif";

// ─── Sub-components ──────────────────────────────────────────────────────

function PaperGrain() {
  return (
    <svg
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        opacity: 0.03,
        mixBlendMode: "overlay" as const,
        pointerEvents: "none" as const,
      }}
    >
      <filter id="network-grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#network-grain)" />
    </svg>
  );
}

// ─── Founder Card ────────────────────────────────────────────────────────

function FounderCard({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const rotate = useTransform(scrollYProgress, [0.0, 0.12], [-6, 0]);
  const cardOpacity = useTransform(scrollYProgress, [0.0, 0.08], [0, 1]);
  const cardScale = useTransform(
    scrollYProgress,
    [0.0, 0.08, 0.50, 0.65],
    [0.92, 1, 1, 0.88]
  );
  const cardY = useTransform(scrollYProgress, [0.0, 0.08], [40, 0]);

  return (
    <motion.div
      style={{
        rotate,
        opacity: cardOpacity,
        scale: cardScale,
        y: cardY,
        position: "absolute",
        left: "50%",
        top: "50%",
        marginLeft: -160,
        marginTop: -120,
        width: 320,
        height: 240,
        zIndex: 50,
        transformOrigin: "center center",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 3,
          background: "linear-gradient(168deg, #f5ebe3 0%, #e8ddd1 100%)",
          boxShadow:
            "0 1px 0 rgba(255,255,255,0.5) inset, 0 16px 48px -8px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
          border: "1px solid rgba(60,70,50,0.08)",
          position: "relative",
          overflow: "hidden",
          padding: "28px 24px 20px",
          display: "flex",
          flexDirection: "column" as const,
        }}
      >
        <PaperGrain />

        {/* Punch hole */}
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 12,
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "radial-gradient(circle at 30% 30%, #e0d8ce 0%, #c8c0b4 100%)",
            boxShadow: "inset 0 1px 3px rgba(0,0,0,0.15)",
          }}
        />

        <div
          style={{
            fontFamily: mono,
            fontSize: 18,
            fontWeight: 500,
            color: "rgba(35,25,15,0.9)",
            letterSpacing: "0.02em",
            marginBottom: 2,
          }}
        >
          {founder.name}
        </div>

        <div
          style={{
            height: 1,
            background: "linear-gradient(90deg, rgba(60,70,50,0.15) 0%, transparent 80%)",
            marginBottom: 12,
            marginTop: 6,
          }}
        />

        <div
          style={{
            fontFamily: mono,
            fontSize: 9,
            color: "rgba(80,50,30,0.4)",
            letterSpacing: "0.14em",
            textTransform: "uppercase" as const,
            marginBottom: 3,
          }}
        >
          DOES
        </div>
        <div style={{ fontFamily: mono, fontSize: 13, color: "rgba(35,25,15,0.72)", marginBottom: 12 }}>
          {founder.role}
        </div>

        <div
          style={{
            fontFamily: mono,
            fontSize: 9,
            color: "rgba(80,50,30,0.4)",
            letterSpacing: "0.14em",
            textTransform: "uppercase" as const,
            marginBottom: 3,
          }}
        >
          BACKGROUND
        </div>
        <div
          style={{
            fontFamily: serif,
            fontSize: 13,
            fontStyle: "italic",
            color: "rgba(35,25,15,0.62)",
            lineHeight: 1.45,
          }}
        >
          {founder.background}
        </div>

        <div style={{ marginTop: "auto" }}>
          <div
            style={{
              fontFamily: mono,
              fontSize: 9,
              color: "rgba(80,50,30,0.4)",
              letterSpacing: "0.14em",
              textTransform: "uppercase" as const,
              marginBottom: 3,
            }}
          >
            KNOWN FOR
          </div>
          <div style={{ fontFamily: mono, fontSize: 12, color: "rgba(35,25,15,0.78)", fontWeight: 500 }}>
            {founder.knownFor}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Person Pill ─────────────────────────────────────────────────────────

function PersonPill({
  person,
  scrollYProgress,
  enterAt,
}: {
  person: Person;
  scrollYProgress: MotionValue<number>;
  enterAt: number;
}) {
  const radial = radialPositions[person.id];
  const grouped = groupedPositions[person.id];
  const color = groupColors[person.group];

  const entryEnd = enterAt + 0.04;
  const pillOpacity = useTransform(scrollYProgress, [enterAt, entryEnd], [0, 1]);
  const pillScale = useTransform(scrollYProgress, [enterAt, entryEnd], [0.88, 1]);

  // Interpolate position: radial → grouped
  const xVw = useTransform(scrollYProgress, [0.55, 0.70], [radial.x, grouped.x]);
  const yVh = useTransform(scrollYProgress, [0.55, 0.70], [radial.y, grouped.y]);

  // Combine vw/vh offset with -50% centering into a single transform
  const xCalc = useTransform(xVw, (v) => `calc(${v}vw - 50%)`);
  const yCalc = useTransform(yVh, (v) => `calc(${v}vh - 50%)`);

  return (
    <div style={{ position: "absolute", left: "50%", top: "50%", zIndex: 30 }}>
      <motion.div
        style={{
          x: xCalc,
          y: yCalc,
          opacity: pillOpacity,
          scale: pillScale,
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.96)",
            border: `1px solid ${color}`,
            borderRadius: 4,
            padding: "12px 18px",
            minWidth: 220,
            maxWidth: 280,
            boxShadow: "0 2px 12px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.03)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Color accent bar */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: 3,
              background: color,
            }}
          />

          <div
            style={{
              fontFamily: mono,
              fontSize: 15,
              fontWeight: 500,
              color: "rgba(35,25,15,0.92)",
              marginBottom: 3,
              paddingLeft: 8,
            }}
          >
            {person.name}
          </div>
          <div
            style={{
              fontFamily: mono,
              fontSize: 13,
              color: "rgba(35,25,15,0.6)",
              marginBottom: 6,
              paddingLeft: 8,
            }}
          >
            {person.role}
          </div>
          <div
            style={{
              fontFamily: serif,
              fontSize: 13,
              fontStyle: "italic",
              color: "rgba(35,25,15,0.55)",
              paddingLeft: 8,
            }}
          >
            {person.context}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Connecting Line (SVG) ───────────────────────────────────────────────

function ConnectingLine({
  personId,
  scrollYProgress,
  enterAt,
}: {
  personId: string;
  scrollYProgress: MotionValue<number>;
  enterAt: number;
}) {
  const radial = radialPositions[personId];
  const grouped = groupedPositions[personId];
  const group = people.find((p) => p.id === personId)?.group || "";
  const color = groupColors[group];

  // Line fades in with person
  const lineOpacity = useTransform(
    scrollYProgress,
    [enterAt - 0.01, enterAt + 0.03],
    [0, 0.35]
  );

  // Endpoint moves: radial → grouped
  const endX = useTransform(scrollYProgress, [0.55, 0.70], [radial.x, grouped.x]);
  const endY = useTransform(scrollYProgress, [0.55, 0.70], [radial.y, grouped.y]);

  // Map vw/vh offsets → SVG coords (viewBox 0 0 100 100, preserveAspectRatio none)
  const x2 = useTransform(endX, (v) => 50 + v);
  const y2 = useTransform(endY, (v) => 50 + v);

  return (
    <motion.line
      x1={50}
      y1={50}
      x2={x2}
      y2={y2}
      stroke={color}
      strokeWidth={0.15}
      style={{ opacity: lineOpacity }}
      strokeDasharray="0.6 0.4"
    />
  );
}

// ─── Group Label ─────────────────────────────────────────────────────────

function GroupLabel({
  group,
  scrollYProgress,
}: {
  group: string;
  scrollYProgress: MotionValue<number>;
}) {
  const pos = groupLabelPositions[group];
  const color = groupColors[group];
  const bgColor = groupColorsBg[group];

  const labelOpacity = useTransform(scrollYProgress, [0.64, 0.72], [0, 1]);
  const labelY = useTransform(scrollYProgress, [0.64, 0.72], [8, 0]);

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: `translate(calc(${pos.x}vw - 50%), calc(${pos.y}vh - 50%))`,
        zIndex: 40,
      }}
    >
      <motion.div
        style={{
          opacity: labelOpacity,
          y: labelY,
          fontFamily: mono,
          fontSize: 13,
          letterSpacing: "0.12em",
          textTransform: "uppercase" as const,
          color,
          background: bgColor,
          padding: "6px 16px",
          borderRadius: 4,
          whiteSpace: "nowrap" as const,
          fontWeight: 600,
          borderBottom: `2px solid ${color}`,
        }}
      >
        {group}
      </motion.div>
    </div>
  );
}

// ─── Main Section ────────────────────────────────────────────────────────

export default function NetworkSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const headlineY = useTransform(scrollYProgress, [0.08, 0.16], [20, 0]);
  const headlineOpacity = useTransform(
    scrollYProgress,
    [0.08, 0.16, 0.42, 0.52],
    [0, 1, 1, 0]
  );

  const subheadOpacity = useTransform(scrollYProgress, [0.74, 0.82], [0, 1]);
  const subheadY = useTransform(scrollYProgress, [0.74, 0.82], [12, 0]);

  const sectionOpacity = useTransform(scrollYProgress, [0.90, 0.98], [1, 0]);

  return (
    <section ref={sectionRef} className="relative" style={{ height: "450vh" }}>
      <motion.div
        className="sticky top-0 h-screen overflow-hidden"
        style={{ opacity: sectionOpacity, background: "#fff" }}
      >
        {/* Subtle warm radial bg */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(200,190,175,0.06),transparent)]" />
        </div>

        {/* Headline */}
        <motion.div
          style={{
            position: "absolute",
            top: "8vh",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 60,
            opacity: headlineOpacity,
            y: headlineY,
            pointerEvents: "none" as const,
          }}
        >
          <h2
            style={{
              fontFamily: serif,
              fontSize: "clamp(1.4rem, 2.8vw, 2rem)",
              fontStyle: "italic",
              color: "rgba(9,9,11,0.82)",
              fontWeight: 400,
              margin: 0,
            }}
          >
            brace maps your world
          </h2>
          <p
            style={{
              fontFamily: mono,
              fontSize: 12,
              color: "rgba(9,9,11,0.4)",
              marginTop: 8,
              letterSpacing: "0.06em",
            }}
          >
            from one profile, we find who matters — and why
          </p>
        </motion.div>

        {/* Founder card */}
        <FounderCard scrollYProgress={scrollYProgress} />

        {/* SVG connecting lines */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            zIndex: 20,
            pointerEvents: "none",
          }}
        >
          {people.map((person) => (
            <ConnectingLine
              key={person.id}
              personId={person.id}
              scrollYProgress={scrollYProgress}
              enterAt={entranceTimes[person.id]}
            />
          ))}
        </svg>

        {/* Person pills */}
        {people.map((person) => (
          <PersonPill
            key={person.id}
            person={person}
            scrollYProgress={scrollYProgress}
            enterAt={entranceTimes[person.id]}
          />
        ))}

        {/* Group labels */}
        {groups.map((group) => (
          <GroupLabel key={group} group={group} scrollYProgress={scrollYProgress} />
        ))}

        {/* Post-grouping subhead */}
        <motion.div
          style={{
            position: "absolute",
            bottom: "6vh",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 60,
            opacity: subheadOpacity,
            y: subheadY,
            pointerEvents: "none" as const,
          }}
        >
          <p
            style={{
              fontFamily: serif,
              fontSize: "clamp(1rem, 2vw, 1.3rem)",
              fontStyle: "italic",
              color: "rgba(9,9,11,0.65)",
              fontWeight: 400,
              margin: 0,
            }}
          >
            relationships you already have — organized by how you know them
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
