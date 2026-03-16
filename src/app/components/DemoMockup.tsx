"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

// ─────────────────────────────────────────────────────
// Design Tokens
// ─────────────────────────────────────────────────────

const fonts = {
  sans: "var(--font-geist-sans), system-ui, -apple-system, sans-serif",
  mono: "var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  serif: "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif",
};

const AUTOPLAY_MS = 7000;

// ─────────────────────────────────────────────────────
// Types & Data
// ─────────────────────────────────────────────────────

interface DemoSignal {
  id: string;
  personId: string;
  personName: string;
  source: string;
  timestamp: string;
  content: string;
  isFollowUp?: boolean;
  followUpContext?: string;
  insight: string;
  because: string;
  and: string;
  so: string;
  actionLabel: string;
  actionChannel: string;
  suggestedText: string;
}

interface DemoProfile {
  id: string;
  name: string;
  role: string;
  metAt: string;
  knownFor: string;
  alignment: string;
  email: string;
  phone?: string;
  refId: string;
  proximity: "close" | "known" | "new";
  remember?: string[];
  traits?: string[];
  circle?: { relation: string; name: string; detail?: string }[];
  lastInteraction?: string;
}

const DEMO_PROFILES: Record<string, DemoProfile> = {
  "arjun-mehta": {
    id: "arjun-mehta",
    name: "Arjun Mehta",
    role: "Co-founder & CEO at NexaFlow",
    metAt: "Nasscom Product Conclave 2023, Bangalore",
    knownFor:
      "Ex-Flipkart PM. Built NexaFlow from 0 to $5M ARR in 18 months. Relentless executor.",
    alignment:
      "Portfolio company. Series A prep underway. Key proof point for Fund I thesis on India B2B SaaS.",
    email: "arjun@nexaflow.in",
    phone: "+91 98765 43210",
    refId: "BRC-AM-0247",
    proximity: "close",
    remember: [
      "Wife Meera is expecting in April \u2014 ask about preparations",
      "Runs 5K every morning at Cubbon Park",
      "Prefers Third Wave Coffee over Starbucks",
    ],
    traits: ["IIT Bombay '12", "Supply Chain AI", "Seed to $5M ARR in 18mo"],
    circle: [
      { relation: "co-founder", name: "Vikram Rao", detail: "NexaFlow, CTO" },
      { relation: "advisor", name: "Kunal Shah", detail: "CRED, Founder" },
      { relation: "wife", name: "Meera Mehta", detail: "Google, Product Lead" },
    ],
    lastInteraction: "Board call \u2014 Feb 28, 2026",
  },
  "priya-venkatesh": {
    id: "priya-venkatesh",
    name: "Priya Venkatesh",
    role: "Founder & CEO at Karya Finance",
    metAt: "Warm intro from Arjun Mehta, Jan 2025",
    knownFor:
      "Ex-Razorpay #30. Built RazorpayX Lending. YC W23 alum. Building for India\u2019s 63M SMBs.",
    alignment:
      "Pipeline deal for Fund I. Strong founder-market fit. Fintech infra thesis.",
    email: "priya@karyafinance.com",
    refId: "BRC-PV-0389",
    proximity: "new",
    traits: ["YC W23", "Fintech Infra", "Ex-Razorpay #30"],
    circle: [
      { relation: "co-founder", name: "Sneha Iyer", detail: "Karya, CTO" },
      { relation: "mentor", name: "Arjun Mehta", detail: "NexaFlow, CEO" },
    ],
    lastInteraction: "Coffee at Third Wave \u2014 Feb 12, 2026",
  },
  "kavya-iyer": {
    id: "kavya-iyer",
    name: "Kavya Iyer",
    role: "Managing Director at Sundaram Capital",
    metAt: "LP meet in Singapore, Oct 2024",
    knownFor:
      "Sharp allocator. Doubled India venture allocation in 2 years. Harvard MBA, ex-McKinsey.",
    alignment:
      "Target LP for Fund II. Family office manages \u20B92,000Cr+ in alternatives.",
    email: "kavya@sundaramcapital.com",
    refId: "BRC-KI-0156",
    proximity: "known",
    remember: [
      "Daughter at Harvard \u2014 proud of legacy admission",
      "Passionate about climate tech \u2014 good Fund II angle",
    ],
    traits: ["Harvard MBA", "Family Office", "Climate Allocator"],
    circle: [
      {
        relation: "husband",
        name: "Ravi Iyer",
        detail: "Sundaram Group, Chairman",
      },
      { relation: "colleague", name: "Anita Rao", detail: "Sundaram, Partner" },
    ],
    lastInteraction: "LP meet \u2014 Oct 14, 2024",
  },
  "rajan-anand": {
    id: "rajan-anand",
    name: "Rajan Anand",
    role: "Managing Partner at Elevar Capital",
    metAt: "IIT Delhi alumni event, 2019",
    knownFor:
      "Deep India SaaS conviction. Led early rounds in MapmyIndia, Postman. Founder-first approach.",
    alignment:
      "Key co-investment partner. Deal flow sharing in supply chain & logistics.",
    email: "rajan@elevarcapital.com",
    phone: "+91 99887 76655",
    refId: "BRC-RA-0312",
    proximity: "close",
    remember: [
      "IIT Delhi batch of \u201997 \u2014 same hostel as you",
      "Weekend trekker \u2014 just did Hampta Pass",
    ],
    traits: ["IIT Delhi '97", "India SaaS", "2x co-investor"],
    circle: [
      { relation: "partner", name: "Sandeep Murthy", detail: "Elevar, GP" },
      {
        relation: "portfolio",
        name: "ShipKart team",
        detail: "Logistics SaaS",
      },
    ],
    lastInteraction: "Chai at Chaayos \u2014 Jan 15, 2026",
  },
};

const DEMO_SIGNALS: Record<string, DemoSignal> = {
  s2: {
    id: "s2",
    personId: "arjun-mehta",
    personName: "Arjun Mehta",
    source: "email",
    timestamp: "3h ago",
    content: "Sent Tata Steel case study + wants intro to Mahindra Group",
    isFollowUp: true,
    followUpContext: "$5M ARR",
    insight:
      "Portfolio support moment \u2014 your Mahindra intro could unlock their next big logo",
    because:
      "He\u2019s your portfolio founder asking for a warm intro \u2014 this is exactly what good investors do",
    and: "He\u2019s getting Series A inbound from top funds \u2014 your active support now cements your value before he has options",
    so: "Delivering on the Mahindra intro proves you\u2019re his most valuable board seat, not just his first check",
    actionLabel: "reply",
    actionChannel: "email",
    suggestedText:
      "Great case study. I\u2019ll reach out to Rajesh Jejurikar\u2019s office \u2014 know him from CII meetings. Let me warm it up this week.\n\nOn Series A \u2014 let\u2019s discuss timing over dinner. Free Thursday?",
  },
  s3: {
    id: "s3",
    personId: "kavya-iyer",
    personName: "Kavya Iyer",
    source: "memory",
    timestamp: "today",
    content: "Back from Davos this week",
    insight: "Good moment to reconnect \u2014 Davos stories are freshest now",
    because:
      "She asked to see Fund I data at your last meeting and you discussed climate supply chain tech",
    and: "She\u2019s just back from Davos \u2014 the first 48 hours are when insights and introductions are top of mind",
    so: "A check-in now naturally reopens the Fund II conversation while she\u2019s energized from Davos",
    actionLabel: "ask how it went",
    actionChannel: "dm",
    suggestedText:
      "Kavya \u2014 hope Davos was good. Would love to hear what you picked up on the India allocation side. Coffee at Taj this week? I also have the Fund I data you\u2019d asked about.",
  },
  s7: {
    id: "s7",
    personId: "priya-venkatesh",
    personName: "Priya Venkatesh",
    source: "quiet",
    timestamp: "today",
    content: "Arjun can connect you to Priya\u2019s NBFC partner at MicroLend",
    insight: "Warm path \u00B7 deepen the relationship through Arjun\u2019s network",
    because:
      "You\u2019re building a relationship with Priya and Arjun\u2019s company integrates with Karya",
    and: "Meeting the people around a founder tells you more than any pitch deck",
    so: "Asking Arjun for this intro signals to Priya that you\u2019re doing the work, not just window-shopping",
    actionLabel: "request intro",
    actionChannel: "dm",
    suggestedText:
      "Arjun \u2014 I\u2019m getting to know Priya and Karya Finance better. Could you connect me with Vikram at MicroLend? Would be great to hear their perspective.",
  },
  "s-hire": {
    id: "s-hire",
    personId: "rajan-anand",
    personName: "Rajan Anand",
    source: "email",
    timestamp: "2h ago",
    content:
      "ShipKart\u2019s VP Eng Deepa Sharma is exploring \u2014 perfect for NexaFlow",
    insight:
      "Warm talent lead \u2014 your co-investor is surfacing the VP Eng Arjun needs",
    because:
      "Rajan co-invested in NexaFlow and knows Arjun has been searching for a VP Engineering for 3 months",
    and: "Deepa built ShipKart\u2019s engineering from 5 to 40 people \u2014 exactly the scaling experience NexaFlow needs right now",
    so: "Acting fast shows Rajan you\u2019re a valuable co-investor and gives Arjun a warm lead on a hire that usually takes 6 months",
    actionLabel: "connect them",
    actionChannel: "email",
    suggestedText:
      "Rajan \u2014 great timing. Arjun\u2019s been looking for exactly this profile. Let me loop him in and set up coffee for the three of you this week.",
  },
};

const USE_CASES = [
  {
    id: "keeping-up",
    label: "Keeping Up",
    signalId: "s2",
    profileId: "arjun-mehta",
  },
  {
    id: "warm-intro",
    label: "Warm Intro",
    signalId: "s7",
    profileId: "priya-venkatesh",
  },
  {
    id: "hiring",
    label: "Hiring",
    signalId: "s-hire",
    profileId: "rajan-anand",
  },
  {
    id: "sales",
    label: "Sales",
    signalId: "s3",
    profileId: "kavya-iyer",
  },
];

// ─────────────────────────────────────────────────────
// UI Themes (light, matching minimalistic/signal-new)
// ─────────────────────────────────────────────────────

const SOURCE_THEMES: Record<
  string,
  { label: string; color: string; bg: string; border: string; soft: string }
> = {
  email: {
    label: "Email",
    color: "rgba(145,110,60,0.76)",
    bg: "rgba(175,145,95,0.08)",
    border: "rgba(145,110,60,0.22)",
    soft: "rgba(175,145,95,0.10)",
  },
  linkedin: {
    label: "LinkedIn",
    color: "rgba(60,110,170,0.75)",
    bg: "rgba(80,120,170,0.07)",
    border: "rgba(60,110,170,0.20)",
    soft: "rgba(80,120,170,0.10)",
  },
  memory: {
    label: "Memory",
    color: "rgba(132,98,62,0.75)",
    bg: "rgba(170,140,105,0.08)",
    border: "rgba(132,98,62,0.20)",
    soft: "rgba(170,140,105,0.10)",
  },
  news: {
    label: "News",
    color: "rgba(90,100,82,0.72)",
    bg: "rgba(120,135,100,0.08)",
    border: "rgba(90,100,82,0.20)",
    soft: "rgba(120,135,100,0.10)",
  },
  quiet: {
    label: "Quiet",
    color: "rgba(80,100,60,0.72)",
    bg: "rgba(80,100,60,0.07)",
    border: "rgba(80,100,60,0.18)",
    soft: "rgba(80,100,60,0.10)",
  },
};

const PROXIMITY_THEMES = {
  close: {
    label: "inner circle",
    color: "#c9a55a",
    bg: "rgba(201,165,90,0.08)",
    border: "rgba(201,165,90,0.20)",
  },
  known: {
    label: "known",
    color: "rgba(80,50,30,0.50)",
    bg: "rgba(80,50,30,0.04)",
    border: "rgba(80,50,30,0.12)",
  },
  new: {
    label: "new",
    color: "rgba(80,50,30,0.35)",
    bg: "rgba(80,50,30,0.03)",
    border: "rgba(80,50,30,0.08)",
  },
} as const;

const CHANNEL_LABELS: Record<string, string> = {
  email: "email",
  linkedin: "LinkedIn comment",
  dm: "direct message",
};

// ─────────────────────────────────────────────────────
// Helpers & Icons
// ─────────────────────────────────────────────────────

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function PaperGrain({ id, opacity = 0.035 }: { id: string; opacity?: number }) {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full mix-blend-overlay"
      style={{ opacity }}
    >
      <filter id={id}>
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.85"
          numOctaves="4"
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#${id})`} />
    </svg>
  );
}

function CardSurface({
  children,
  className = "",
  grainId,
  variant = "signal",
}: {
  children: ReactNode;
  className?: string;
  grainId: string;
  variant?: "signal" | "rolodex";
}) {
  const bg =
    variant === "signal"
      ? "linear-gradient(168deg, rgba(243,245,237,0.32) 0%, rgba(236,239,225,0.22) 100%)"
      : "linear-gradient(168deg, rgba(245,235,227,0.30) 0%, rgba(238,228,218,0.20) 100%)";

  return (
    <div
      className={`relative min-h-0 overflow-hidden rounded-[30px] backdrop-blur-[28px] ${className}`}
      style={{
        background: bg,
        border: "1px solid rgba(0,0,0,0.04)",
        boxShadow:
          "0 1px 0 rgba(255,255,255,0.7) inset, 0 2px 8px rgba(0,0,0,0.03), 0 8px 32px rgba(0,0,0,0.04)",
      }}
    >
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-50" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.40),rgba(255,255,255,0.10)_34%,rgba(255,255,255,0.20)_100%)]" />
      <PaperGrain id={grainId} opacity={0.02} />
      {children}
    </div>
  );
}

function SectionEyebrow({
  label,
  color = "rgba(60,70,50,0.42)",
}: {
  label: string;
  color?: string;
}) {
  return (
    <span
      style={{ fontFamily: fonts.mono, color }}
      className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em]"
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      {label}
    </span>
  );
}

function SourceIcon({
  source,
  className = "",
}: {
  source: string;
  className?: string;
}) {
  const baseClasses = "h-4 w-4 " + className;

  switch (source) {
    case "email":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={baseClasses}
        >
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      );
    case "linkedin":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={baseClasses}
        >
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect width="4" height="12" x="2" y="9" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      );
    case "memory":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={baseClasses}
        >
          <path d="M12 21a9 9 0 1 0-9-9c0 1.488.36 2.89 1 4.127L3 21l4.873-1c1.236.64 2.64 1 4.127 1Z" />
          <path d="M12 7v5l3 3" />
        </svg>
      );
    case "news":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={baseClasses}
        >
          <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
          <path d="M18 14h-8" />
          <path d="M15 18h-5" />
          <path d="M10 6h8v4h-8V6Z" />
        </svg>
      );
    case "quiet":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={baseClasses}
        >
          <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
          <path d="M8.5 10a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1Z" />
          <path d="M15.5 10a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1Z" />
          <path d="M12 16a4 4 0 0 0 4-4H8a4 4 0 0 0 4 4Z" />
        </svg>
      );
    default:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={baseClasses}
        >
          <circle cx="12" cy="12" r="10" />
        </svg>
      );
  }
}

// ─────────────────────────────────────────────────────
// Components
// ─────────────────────────────────────────────────────

function DemoSignalDetail({
  signal,
  sendState,
  onSend,
}: {
  signal: DemoSignal;
  sendState: "idle" | "sending" | "sent";
  onSend: () => void;
}) {
  const theme = SOURCE_THEMES[signal.source] ?? SOURCE_THEMES.email;

  return (
    <CardSurface
      grainId="demo-detail-grain"
      variant="signal"
      className="flex h-full min-h-0 flex-col"
    >
      <div
        className="pointer-events-none absolute -left-[10%] top-[-8%] h-[42%] w-[60%] rounded-full blur-3xl"
        style={{ backgroundColor: theme.soft }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.45),transparent_32%)]" />

      <AnimatePresence mode="wait">
        <motion.div
          key={signal.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative z-10 flex h-full min-h-0 flex-col"
        >
          <div
            className="px-5 pb-3 pt-4"
            style={{ borderBottom: "1px solid rgba(60,70,50,0.08)" }}
          >
            <div className="mb-2.5 flex items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  style={{
                    fontFamily: fonts.mono,
                    color: theme.color,
                    backgroundColor: theme.bg,
                    borderColor: theme.border,
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]"
                >
                  <SourceIcon source={signal.source} className="h-3.5 w-3.5" />
                  {SOURCE_THEMES[signal.source]?.label ?? signal.source}
                </span>

                <span
                  style={{
                    fontFamily: fonts.mono,
                    color: "rgba(60,70,50,0.38)",
                  }}
                  className="rounded-full border border-white/60 bg-white/45 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em]"
                >
                  {signal.timestamp}
                </span>

                {signal.isFollowUp && (
                  <span
                    style={{
                      fontFamily: fonts.mono,
                      color: theme.color,
                      backgroundColor: theme.bg,
                      borderColor: theme.border,
                    }}
                    className="rounded-full border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.18em]"
                  >
                    Re: {signal.followUpContext}
                  </span>
                )}
              </div>

              <span
                style={{ fontFamily: fonts.mono, color: "rgba(60,70,50,0.35)" }}
                className="text-[10px] uppercase tracking-[0.18em]"
              >
                Action brief
              </span>
            </div>

            <div className="mb-2.5">
              <SectionEyebrow label={signal.personName} color={theme.color} />
              <h2
                style={{
                  fontFamily: fonts.sans,
                  color: "rgba(35,40,30,0.85)",
                }}
                className="mt-1.5 line-clamp-2 text-[21px] font-medium leading-snug tracking-[-0.03em]"
              >
                {signal.insight}
              </h2>
            </div>

            <div className="rounded-[18px] border border-white/55 bg-white/40 px-3 py-2.5 shadow-[0_6px_24px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.64)] backdrop-blur-xl">
              <span
                style={{
                  fontFamily: fonts.mono,
                  color: "rgba(60,70,50,0.35)",
                }}
                className="mb-1 block text-[9px] font-semibold uppercase tracking-[0.18em]"
              >
                Source snapshot
              </span>
              <p
                style={{
                  fontFamily: fonts.sans,
                  color: "rgba(35,40,30,0.72)",
                }}
                className="line-clamp-1 text-[14px] leading-snug"
              >
                {signal.content}
              </p>
            </div>
          </div>

          <div className="flex min-h-0 flex-1 flex-col px-5 pb-4 pt-3">
            <div className="flex min-h-0 flex-1 flex-col rounded-[22px] border border-white/50 bg-white/34 p-4 shadow-[0_6px_20px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.55)] backdrop-blur-xl">
              <div className="mb-3 flex items-center justify-between gap-3">
                <SectionEyebrow label="Why now" color={theme.color} />
                <span
                  style={{
                    fontFamily: fonts.mono,
                    color: "rgba(60,70,50,0.30)",
                  }}
                  className="text-[10px] uppercase tracking-[0.16em]"
                >
                  reasoning chain
                </span>
              </div>

              <div>
                <div className="relative space-y-3.5 pl-4 pr-1">
                  <div
                    className="absolute bottom-2 left-[5px] top-2 w-px"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(60,70,50,0.15), rgba(60,70,50,0.05))",
                    }}
                  />
                  {[
                    { label: "because", text: signal.because, active: false },
                    { label: "and", text: signal.and, active: false },
                    { label: "so", text: signal.so, active: true },
                  ].map((step) => (
                    <div key={step.label} className="relative">
                      <div
                        className="absolute left-[-15px] top-[7px] h-[11px] w-[11px] rounded-full border-2 border-white shadow-sm"
                        style={{
                          backgroundColor: step.active
                            ? "rgba(80,100,60,0.60)"
                            : "rgba(60,70,50,0.18)",
                        }}
                      />
                      <div
                        style={{
                          fontFamily: fonts.mono,
                          color: step.active
                            ? "rgba(80,100,60,0.55)"
                            : "rgba(60,70,50,0.35)",
                        }}
                        className="mb-0.5 text-[10px] uppercase tracking-[0.18em]"
                      >
                        {step.label}
                      </div>
                      <p
                        style={{
                          fontFamily: step.active ? fonts.serif : fonts.sans,
                          color: step.active
                            ? "rgba(35,40,30,0.85)"
                            : "rgba(35,40,30,0.62)",
                        }}
                        className={`text-[15px] leading-relaxed ${
                          step.active ? "italic" : ""
                        }`}
                      >
                        {step.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-3 rounded-[22px] border border-white/50 bg-white/34 p-4 shadow-[0_6px_20px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.55)] backdrop-blur-xl">
              <div className="mb-2">
                <SectionEyebrow
                  label={`Suggested ${CHANNEL_LABELS[signal.actionChannel] ?? signal.actionChannel}`}
                  color={theme.color}
                />
              </div>

              <div className="mb-3 overflow-hidden rounded-[18px] border border-white/60 bg-white/46 px-3.5 py-3 shadow-[0_8px_28px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.68)] backdrop-blur-xl">
                <div
                  className="mb-2 h-px w-full"
                  style={{
                    background: `linear-gradient(90deg, ${theme.border}, transparent 65%)`,
                  }}
                />
                <p
                  style={{
                    fontFamily: fonts.sans,
                    color: "rgba(35,40,30,0.72)",
                  }}
                  className="line-clamp-2 text-[15px] leading-snug"
                >
                  {signal.suggestedText}
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <motion.button
                  type="button"
                  onClick={onSend}
                  disabled={sendState !== "idle"}
                  whileHover={sendState === "idle" ? { y: -1 } : undefined}
                  whileTap={sendState === "idle" ? { scale: 0.985 } : undefined}
                  className="inline-flex h-[40px] items-center justify-center gap-2 rounded-full px-5 text-[14px] font-medium transition-all duration-300"
                  style={{
                    fontFamily: fonts.sans,
                    ...(sendState === "idle"
                      ? {
                          background: `linear-gradient(180deg, rgba(80,100,60,0.65), rgba(80,100,60,0.50))`,
                          border: "1px solid rgba(80,100,60,0.30)",
                          color: "white",
                          boxShadow: "0 14px 28px rgba(80,100,60,0.18)",
                        }
                      : sendState === "sending"
                        ? {
                            background: "rgba(255,255,255,0.50)",
                            border: "1px solid rgba(255,255,255,0.60)",
                            color: "rgba(60,70,50,0.38)",
                            cursor: "not-allowed",
                          }
                        : {
                            background: "rgba(80,100,60,0.55)",
                            border: "1px solid rgba(80,100,60,0.25)",
                            color: "white",
                            boxShadow: "0 14px 28px rgba(80,100,60,0.20)",
                          }),
                  }}
                >
                  <span className="capitalize">
                    {sendState === "idle"
                      ? signal.actionLabel
                      : sendState === "sending"
                        ? "Sending..."
                        : "Sent"}
                  </span>

                  {sendState === "idle" && (
                    <svg
                      className="h-3.5 w-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  )}

                  {sendState === "sent" && (
                    <svg
                      className="h-3.5 w-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </motion.button>

                <div className="relative flex-1">
                  <div className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center">
                    <svg
                      className="h-3.5 w-3.5"
                      style={{ color: "rgba(60,70,50,0.35)" }}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.75"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6v12m6-6H6"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Refine or add context..."
                    className="h-[40px] w-full rounded-full border border-white/60 bg-white/48 pl-10 pr-4 text-[13px] backdrop-blur-xl focus:border-white/80 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-[0_4px_14px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.58)]"
                    style={{
                      fontFamily: fonts.sans,
                      color: "rgba(35,40,30,0.78)",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </CardSurface>
  );
}

function DemoRolodexCard({ profile }: { profile: DemoProfile }) {
  const proximity = PROXIMITY_THEMES[profile.proximity];

  return (
    <CardSurface
      grainId="demo-profile-grain"
      variant="rolodex"
      className="flex h-full min-h-0 flex-col"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={profile.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative z-10 flex h-full min-h-0 flex-col"
        >
          <div
            className="relative overflow-hidden px-4 pb-4 pt-4"
            style={{ borderBottom: "1px solid rgba(80,50,30,0.06)" }}
          >
            <div
              className="pointer-events-none absolute left-[-20%] top-[-35%] h-[72%] w-[80%] rounded-full blur-3xl"
              style={{ backgroundColor: proximity.bg }}
            />
            <div className="relative z-10">
              <div className="mb-3 flex items-center justify-between">
                <SectionEyebrow label="Rolodex" color={proximity.color} />
                <span
                  style={{
                    fontFamily: fonts.mono,
                    color: proximity.color,
                    backgroundColor: proximity.bg,
                    borderColor: proximity.border,
                  }}
                  className="rounded-full border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.18em]"
                >
                  {proximity.label}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full backdrop-blur-md shadow-[0_6px_20px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.65)]"
                  style={{
                    backgroundColor: proximity.bg,
                    border: `1px solid ${proximity.border}`,
                    color: proximity.color,
                  }}
                >
                  <span
                    style={{ fontFamily: fonts.mono }}
                    className="text-[12px] font-semibold tracking-[0.14em]"
                  >
                    {getInitials(profile.name)}
                  </span>
                </div>

                <div className="min-w-0">
                  <h3
                    style={{
                      fontFamily: fonts.sans,
                      color: "rgba(35,25,15,0.92)",
                    }}
                    className="truncate text-[18px] font-medium tracking-[-0.02em]"
                  >
                    {profile.name}
                  </h3>
                  <p
                    style={{
                      fontFamily: fonts.sans,
                      color: "rgba(80,50,30,0.48)",
                    }}
                    className="truncate text-[13px] leading-snug"
                  >
                    {profile.role}
                  </p>
                </div>
              </div>

            </div>
          </div>

          <div className="demo-no-scrollbar min-h-0 flex-1 overflow-y-auto px-3.5 py-3">
            <div className="space-y-2.5">
              <div className="overflow-hidden rounded-[18px] border border-white/55 bg-white/40 px-3.5 py-3 shadow-[0_6px_20px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.56)] backdrop-blur-xl">
                <span
                  style={{
                    fontFamily: fonts.mono,
                    color: "rgba(80,50,30,0.42)",
                  }}
                  className="block text-[10px] uppercase tracking-[0.18em]"
                >
                  Why they matter
                </span>
                <p
                  style={{
                    fontFamily: fonts.sans,
                    color: "rgba(35,25,15,0.70)",
                  }}
                  className="mt-1.5 text-[13px] leading-snug"
                >
                  {profile.alignment}
                </p>
              </div>

              <div className="rounded-[16px] border border-white/55 bg-white/38 px-3.5 py-3 shadow-[0_6px_20px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.56)] backdrop-blur-xl">
                <SectionEyebrow label="Known For" color="rgba(80,50,30,0.42)" />
                <p
                  style={{
                    fontFamily: fonts.sans,
                    color: "rgba(35,25,15,0.78)",
                  }}
                  className="mt-1.5 text-[13px] leading-snug"
                >
                  {profile.knownFor}
                </p>
              </div>

              <div
                className="rounded-[16px] border border-white/55 bg-white/38 px-3.5 py-3 shadow-[0_6px_20px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.56)] backdrop-blur-xl"
                style={{ background: "rgba(120,80,40,0.04)" }}
              >
                <SectionEyebrow label="Met" color="rgba(80,50,30,0.42)" />
                <p
                  style={{
                    fontFamily: fonts.serif,
                    color: "rgba(35,25,15,0.67)",
                  }}
                  className="mt-1.5 text-[13px] italic leading-snug"
                >
                  {profile.metAt}
                </p>
              </div>

              {profile.remember && profile.remember.length > 0 && (
                <div className="rounded-[16px] border border-white/55 bg-white/38 px-3.5 py-3 shadow-[0_6px_20px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.56)] backdrop-blur-xl">
                  <SectionEyebrow label="Remember" color={proximity.color} />
                  <div className="mt-2 space-y-1.5">
                    {profile.remember.map((item) => (
                      <div key={item} className="flex items-start gap-2">
                        <span
                          className="mt-1.5 h-1 w-1 shrink-0 rounded-full"
                          style={{ backgroundColor: proximity.color }}
                        />
                        <p
                          style={{
                            fontFamily: fonts.sans,
                            color: "rgba(35,25,15,0.62)",
                          }}
                          className="text-[12px] leading-snug"
                        >
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {profile.circle && profile.circle.length > 0 && (
                <div className="rounded-[16px] border border-white/55 bg-white/38 px-3.5 py-3 shadow-[0_6px_20px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.56)] backdrop-blur-xl">
                  <SectionEyebrow label="Circle" color="rgba(80,50,30,0.42)" />
                  <div className="mt-2 space-y-1.5">
                    {profile.circle.map((person) => (
                      <div
                        key={`${person.relation}-${person.name}`}
                        className="flex items-center justify-between gap-2 rounded-[12px] border border-white/45 bg-white/40 px-2.5 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]"
                      >
                        <div className="min-w-0">
                          <div
                            style={{
                              fontFamily: fonts.sans,
                              color: "rgba(35,25,15,0.72)",
                            }}
                            className="truncate text-[12px] font-medium"
                          >
                            {person.name}
                          </div>
                          {person.detail && (
                            <div
                              style={{
                                fontFamily: fonts.sans,
                                color: "rgba(80,50,30,0.42)",
                              }}
                              className="truncate text-[11px]"
                            >
                              {person.detail}
                            </div>
                          )}
                        </div>
                        <span
                          style={{
                            fontFamily: fonts.mono,
                            color: "rgba(80,50,30,0.32)",
                          }}
                          className="shrink-0 text-[8px] uppercase tracking-[0.16em]"
                        >
                          {person.relation}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div
            className="px-4 py-3"
            style={{ borderTop: "1px solid rgba(80,50,30,0.06)" }}
          >
            <div className="flex items-center justify-between gap-2">
              <span
                style={{
                  fontFamily: fonts.mono,
                  color: "rgba(35,25,15,0.50)",
                }}
                className="truncate text-[10px]"
              >
                {profile.email}
              </span>
              <span
                style={{
                  fontFamily: fonts.mono,
                  color: "rgba(80,50,30,0.32)",
                }}
                className="shrink-0 text-[9px] uppercase tracking-[0.16em]"
              >
                {profile.refId}
              </span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </CardSurface>
  );
}

// ─────────────────────────────────────────────────────
// Use Case Carousel
// ─────────────────────────────────────────────────────

function UseCaseCarousel({
  activeIdx,
  onSelect,
  onAutoAdvance,
  slowed,
}: {
  activeIdx: number;
  onSelect: (idx: number) => void;
  onAutoAdvance: () => void;
  slowed: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const progressRef = useRef<HTMLDivElement>(null);
  const [pill, setPill] = useState({ left: 0, width: 0 });
  const measured = useRef(false);

  useEffect(() => {
    const btn = buttonRefs.current[activeIdx];
    const container = containerRef.current;
    if (!btn || !container) return;
    const cRect = container.getBoundingClientRect();
    const bRect = btn.getBoundingClientRect();
    setPill({ left: bRect.left - cRect.left, width: bRect.width });
    measured.current = true;
  }, [activeIdx]);

  useEffect(() => {
    const el = progressRef.current;
    if (!el) return;
    // Wait one frame so the CSS animation is registered on the new DOM element
    const raf = requestAnimationFrame(() => {
      const anims = el.getAnimations();
      for (const a of anims) {
        a.playbackRate = slowed ? 0.5 : 1;
      }
    });
    return () => cancelAnimationFrame(raf);
  }, [slowed, activeIdx]);

  return (
    <div
      ref={containerRef}
      className="relative inline-flex items-center gap-0.5 rounded-full p-1 backdrop-blur-xl"
      style={{
        background: "rgba(255,255,255,0.38)",
        border: "1px solid rgba(0,0,0,0.04)",
        boxShadow:
          "0 2px 8px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,0.55)",
      }}
    >
      {/* Single sliding pill — never unmounts */}
      <motion.div
        className="pointer-events-none absolute rounded-full"
        initial={false}
        animate={{
          left: pill.left,
          width: pill.width,
          opacity: measured.current ? 1 : 0,
        }}
        transition={{
          type: "tween",
          duration: 0.4,
          ease: [0.25, 0.1, 0.25, 1],
        }}
        style={{
          top: 4,
          bottom: 4,
          background: "rgba(240,238,235,0.85)",
          boxShadow:
            "0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.9)",
        }}
      />

      {USE_CASES.map((uc, idx) => {
        const isActive = idx === activeIdx;
        return (
          <button
            key={uc.id}
            ref={(el) => {
              buttonRefs.current[idx] = el;
            }}
            type="button"
            onClick={() => onSelect(idx)}
            className="relative rounded-full px-5 py-2.5"
          >
            <span
              className="relative z-10 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors duration-300"
              style={{
                fontFamily: fonts.mono,
                color: isActive
                  ? "rgba(35,40,30,0.82)"
                  : "rgba(60,70,50,0.32)",
              }}
            >
              {uc.label}
            </span>

            {isActive && (
              <div className="absolute bottom-1.5 left-4 right-4 h-[1.5px] overflow-hidden rounded-full bg-black/[0.03]">
                <div
                  ref={progressRef}
                  key={`prog-${activeIdx}`}
                  className="h-full rounded-full"
                  style={{
                    backgroundColor: "rgba(80,100,60,0.28)",
                    willChange: "transform",
                    transformOrigin: "left",
                    animation: `usecaseProgress ${AUTOPLAY_MS}ms cubic-bezier(0.4, 0, 0.2, 1) forwards`,
                  }}
                  onAnimationEnd={(e) => {
                    e.stopPropagation();
                    onAutoAdvance();
                  }}
                />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────
// Main Container
// ─────────────────────────────────────────────────────

export default function DemoMockup() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [sendState, setSendState] = useState<"idle" | "sending" | "sent">(
    "idle",
  );
  const [slowed, setSlowed] = useState(false);

  const sendTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearSendTimeouts = useCallback(() => {
    sendTimeoutsRef.current.forEach(clearTimeout);
    sendTimeoutsRef.current = [];
  }, []);

  useEffect(() => {
    return () => clearSendTimeouts();
  }, [clearSendTimeouts]);

  const useCase = USE_CASES[activeIdx];
  const signal = DEMO_SIGNALS[useCase.signalId];
  const profile = DEMO_PROFILES[useCase.profileId];

  const handleAutoAdvance = useCallback(() => {
    clearSendTimeouts();
    setActiveIdx((prev) => (prev + 1) % USE_CASES.length);
    setSendState("idle");
  }, [clearSendTimeouts]);

  const handleSelectUseCase = useCallback(
    (idx: number) => {
      if (idx === activeIdx) return;
      clearSendTimeouts();
      setActiveIdx(idx);
      setSendState("idle");
    },
    [activeIdx, clearSendTimeouts],
  );

  const handleSend = useCallback(() => {
    clearSendTimeouts();
    setSendState("sending");
    sendTimeoutsRef.current = [
      setTimeout(() => setSendState("sent"), 1200),
      setTimeout(() => setSendState("idle"), 3000),
    ];
  }, [clearSendTimeouts]);

  return (
    <>
      <style>{`@keyframes usecaseProgress{from{transform:scaleX(0);opacity:0}4%{opacity:1}to{transform:scaleX(1);opacity:1}}`}</style>
      <div className="relative box-border flex h-full w-full flex-col px-6 py-5">
        <div
          className="mx-auto grid min-h-0 w-full max-w-[1060px] flex-1 grid-cols-[9fr_7fr] gap-4"
          onMouseEnter={() => setSlowed(true)}
          onMouseLeave={() => setSlowed(false)}
        >
          <div className="h-full min-h-0 min-w-0">
            <DemoSignalDetail
              signal={signal}
              sendState={sendState}
              onSend={handleSend}
            />
          </div>

          <div className="h-full min-h-0 min-w-0">
            <DemoRolodexCard profile={profile} />
          </div>
        </div>

        <div className="mt-4 flex shrink-0 justify-center">
          <UseCaseCarousel
            activeIdx={activeIdx}
            onSelect={handleSelectUseCase}
            onAutoAdvance={handleAutoAdvance}
            slowed={slowed}
          />
        </div>
      </div>
    </>
  );
}
