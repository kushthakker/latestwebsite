"use client";

import { useCallback, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

// ─────────────────────────────────────────────────────
// Design Tokens
// ─────────────────────────────────────────────────────

const fonts = {
  sans: "var(--font-geist-sans), system-ui, -apple-system, sans-serif",
  mono: "var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  serif: "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif",
};

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
  sourceContent?: string;
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
      "Wife Meera is expecting in April — ask about preparations",
      "Runs 5K every morning at Cubbon Park",
      "Prefers Third Wave Coffee over Starbucks",
    ],
    traits: ["IIT Bombay ’12", "Supply Chain AI", "Seed to $5M ARR in 18mo"],
    circle: [
      { relation: "co-founder", name: "Vikram Rao", detail: "NexaFlow, CTO" },
      { relation: "advisor", name: "Kunal Shah", detail: "CRED, Founder" },
      { relation: "wife", name: "Meera Mehta", detail: "Google, Product Lead" },
    ],
    lastInteraction: "Board call — Feb 28, 2026",
  },
  "priya-venkatesh": {
    id: "priya-venkatesh",
    name: "Priya Venkatesh",
    role: "Founder & CEO at Karya Finance",
    metAt: "Warm intro from Arjun Mehta, Jan 2025",
    knownFor:
      "Ex-Razorpay #30. Built RazorpayX Lending. YC W23 alum. Building for India’s 63M SMBs.",
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
    lastInteraction: "Coffee at Third Wave — Feb 12, 2026",
  },
  "kavya-iyer": {
    id: "kavya-iyer",
    name: "Kavya Iyer",
    role: "Managing Director at Sundaram Capital",
    metAt: "LP meet in Singapore, Oct 2024",
    knownFor:
      "Sharp allocator. Doubled India venture allocation in 2 years. Harvard MBA, ex-McKinsey.",
    alignment:
      "Target LP for Fund II. Family office manages ₹2,000Cr+ in alternatives.",
    email: "kavya@sundaramcapital.com",
    refId: "BRC-KI-0156",
    proximity: "known",
    remember: [
      "Daughter at Harvard — proud of legacy admission",
      "Passionate about climate tech — good Fund II angle",
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
    lastInteraction: "LP meet — Oct 14, 2024",
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
      "IIT Delhi batch of ’97 — same hostel as you",
      "Weekend trekker — just did Hampta Pass",
    ],
    traits: ["IIT Delhi ’97", "India SaaS", "2x co-investor"],
    circle: [
      { relation: "partner", name: "Sandeep Murthy", detail: "Elevar, GP" },
      {
        relation: "portfolio",
        name: "ShipKart team",
        detail: "Logistics SaaS",
      },
    ],
    lastInteraction: "Chai at Chaayos — Jan 15, 2026",
  },
};

const DEMO_SIGNALS: DemoSignal[] = [
  {
    id: "s2",
    personId: "arjun-mehta",
    personName: "Arjun Mehta",
    source: "email",
    timestamp: "3h ago",
    content: "Sent Tata Steel case study + wants intro to Mahindra Group",
    isFollowUp: true,
    followUpContext: "$5M ARR",
    insight:
      "Portfolio support moment — your Mahindra intro could unlock their next big logo",
    because:
      "He’s your portfolio founder asking for a warm intro — this is exactly what good investors do",
    and: "He’s getting Series A inbound from top funds — your active support now cements your value before he has options",
    so: "Delivering on the Mahindra intro proves you’re his most valuable board seat, not just his first check",
    actionLabel: "reply",
    actionChannel: "email",
    suggestedText:
      "Great case study. I’ll reach out to Rajesh Jejurikar’s office — know him from CII meetings. Let me warm it up this week.\n\nOn Series A — let’s discuss timing over dinner. Free Thursday?",
  },
  {
    id: "s6",
    personId: "priya-venkatesh",
    personName: "Priya Venkatesh",
    source: "linkedin",
    timestamp: "5h ago",
    content: "Posted: “Karya Finance crosses ₹200Cr disbursed in 10 months”",
    insight:
      "Strong traction from a founder you’re building a relationship with",
    because:
      "Arjun introduced you to Priya last month and you had a great first coffee at Third Wave",
    and: "Her milestone post is getting traction — engaging now shows you’re paying attention",
    so: "Showing up for her public wins builds trust early, before every other investor starts circling",
    actionLabel: "comment",
    actionChannel: "linkedin",
    suggestedText:
      "Impressive numbers, Priya. The default rate at that disbursement volume is the real story — speaks to how well the alternative data scoring works. Excited to see what’s next.",
  },
  {
    id: "s1",
    personId: "arjun-mehta",
    personName: "Arjun Mehta",
    source: "linkedin",
    timestamp: "1d ago",
    content:
      "Posted: “NexaFlow hits $5M ARR — Tata Steel deal changed everything”",
    insight:
      "Portfolio proof point · $5M ARR in 18mo · validates Fund I thesis",
    because:
      "You led his seed round and this ARR milestone is a key proof point for Fund I returns",
    and: "The first 48 hours of a founder’s milestone post get the most visibility — your public support matters",
    so: "Engaging now reinforces that you’re a hands-on investor, not just a check-writer",
    actionLabel: "comment",
    actionChannel: "linkedin",
    suggestedText:
      "Proud to have backed Arjun & team from day one. The NRR numbers tell the real story — this is sticky, enterprise-grade PMF. Exciting road ahead.",
  },
  {
    id: "s3",
    personId: "kavya-iyer",
    personName: "Kavya Iyer",
    source: "memory",
    timestamp: "today",
    content: "Back from Davos this week",
    insight: "Good moment to reconnect — Davos stories are freshest now",
    because:
      "She asked to see Fund I data at your last meeting and you discussed climate supply chain tech",
    and: "She’s just back from Davos — the first 48 hours are when insights and introductions are top of mind",
    so: "A check-in now naturally reopens the Fund II conversation while she’s energized from Davos",
    actionLabel: "ask how it went",
    actionChannel: "dm",
    suggestedText:
      "Kavya — hope Davos was good. Would love to hear what you picked up on the India allocation side. Coffee at Taj this week? I also have the Fund I data you’d asked about.",
  },
  {
    id: "s7",
    personId: "priya-venkatesh",
    personName: "Priya Venkatesh",
    source: "quiet",
    timestamp: "today",
    content: "Arjun can connect you to Priya’s NBFC partner at MicroLend",
    insight: "Warm path · deepen the relationship through Arjun’s network",
    because:
      "You’re building a relationship with Priya and Arjun’s company integrates with Karya",
    and: "Meeting the people around a founder tells you more than any pitch deck",
    so: "Asking Arjun for this intro signals to Priya that you’re doing the work, not just window-shopping",
    actionLabel: "request intro",
    actionChannel: "dm",
    suggestedText:
      "Arjun — I’m getting to know Priya and Karya Finance better. Could you connect me with Vikram at MicroLend? Would be great to hear their perspective.",
  },
];

// ─────────────────────────────────────────────────────
// UI Themes
// ─────────────────────────────────────────────────────

const SOURCE_THEMES: Record<
  string,
  {
    label: string;
    color: string;
    bg: string;
    border: string;
    soft: string;
  }
> = {
  email: {
    label: "Email",
    color: "#2c7be5",
    bg: "rgba(44,123,229,0.10)",
    border: "rgba(44,123,229,0.18)",
    soft: "rgba(44,123,229,0.16)",
  },
  linkedin: {
    label: "LinkedIn",
    color: "#5856d6",
    bg: "rgba(88,86,214,0.10)",
    border: "rgba(88,86,214,0.18)",
    soft: "rgba(88,86,214,0.15)",
  },
  memory: {
    label: "Memory",
    color: "#b3601e",
    bg: "rgba(179,96,30,0.09)",
    border: "rgba(179,96,30,0.18)",
    soft: "rgba(179,96,30,0.13)",
  },
  news: {
    label: "News",
    color: "#c2410c",
    bg: "rgba(194,65,12,0.09)",
    border: "rgba(194,65,12,0.18)",
    soft: "rgba(194,65,12,0.14)",
  },
  quiet: {
    label: "Quiet",
    color: "#2d7d4f",
    bg: "rgba(45,125,79,0.10)",
    border: "rgba(45,125,79,0.18)",
    soft: "rgba(45,125,79,0.14)",
  },
};

const PROXIMITY_THEMES = {
  close: {
    label: "inner circle",
    color: "#2d7d4f",
    bg: "rgba(45,125,79,0.10)",
    border: "rgba(45,125,79,0.16)",
  },
  known: {
    label: "known",
    color: "#2c7be5",
    bg: "rgba(44,123,229,0.10)",
    border: "rgba(44,123,229,0.16)",
  },
  new: {
    label: "new",
    color: "#71717a",
    bg: "rgba(113,113,122,0.10)",
    border: "rgba(113,113,122,0.16)",
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

function PaperGrain({ id, opacity = 0.03 }: { id: string; opacity?: number }) {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full mix-blend-overlay"
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

function GlassSurface({
  children,
  className = "",
  grainId,
}: {
  children: ReactNode;
  className?: string;
  grainId: string;
}) {
  return (
    <div
      className={`relative min-h-0 overflow-hidden rounded-[30px] border border-white/55 bg-[rgba(242,242,247,0.72)] backdrop-blur-[28px] shadow-[0_4px_16px_rgba(0,0,0,0.05),0_18px_60px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.72)] ${className}`}
    >
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-90" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.28),rgba(255,255,255,0.04)_34%,rgba(255,255,255,0.12)_100%)]" />
      <PaperGrain id={grainId} opacity={0.028} />
      {children}
    </div>
  );
}

function SectionEyebrow({
  label,
  color = "#71717a",
}: {
  label: string;
  color?: string;
}) {
  return (
    <span
      style={{ fontFamily: fonts.mono, color }}
      className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em]"
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

function DemoSignalInbox({
  signals,
  selectedId,
  onSelect,
}: {
  signals: DemoSignal[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <GlassSurface grainId="demo-inbox-grain" className="flex h-full min-h-0 flex-col">
      <div className="relative border-b border-white/45 px-4 pb-3 pt-4">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.28),rgba(255,255,255,0.08))]" />
        <div className="relative flex items-start justify-between gap-3">
          <div>
            <SectionEyebrow label="For You" />
            <div
              style={{ fontFamily: fonts.sans }}
              className="mt-1.5 text-[18px] font-medium tracking-tight text-zinc-900"
            >
              Relationship feed
            </div>
            <p
              style={{ fontFamily: fonts.sans }}
              className="mt-0.5 text-[12px] leading-snug text-zinc-500"
            >
              Signals ranked by urgency, context, and relationship value.
            </p>
          </div>

          <div className="rounded-full border border-white/60 bg-white/45 px-3 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] backdrop-blur-xl">
            <div
              style={{ fontFamily: fonts.mono }}
              className="text-[10px] uppercase tracking-[0.18em] text-zinc-500"
            >
              {signals.length} live
            </div>
          </div>
        </div>
      </div>

      <div className="demo-no-scrollbar min-h-0 flex-1 overflow-y-auto px-2 py-2.5">
        <div className="space-y-1.5">
          {signals.map((signal) => {
            const isSelected = signal.id === selectedId;
            const theme = SOURCE_THEMES[signal.source] ?? SOURCE_THEMES.email;

            return (
              <motion.button
                key={signal.id}
                type="button"
                onClick={() => onSelect(signal.id)}
                whileHover={{ y: -1, scale: 0.995 }}
                whileTap={{ scale: 0.99 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="group relative w-full overflow-hidden rounded-[22px] text-left"
              >
                <div
                  className={`relative border px-3.5 py-3.5 transition-all duration-250 ${
                    isSelected
                      ? "border-white/70 bg-white/60 shadow-[0_10px_30px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.72)]"
                      : "border-white/45 bg-white/30 shadow-[0_4px_14px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.55)] group-hover:bg-white/42"
                  }`}
                >
                  {isSelected && (
                    <>
                      <motion.div
                        layoutId="demo-signal-active"
                        className="absolute inset-0 rounded-[22px]"
                        style={{
                          boxShadow: `inset 0 0 0 1px ${theme.border}, 0 16px 34px ${theme.soft}`,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 260,
                          damping: 30,
                        }}
                      />
                      <motion.div
                        layoutId="demo-signal-rail"
                        className="absolute bottom-3 top-3 left-0 w-[3px] rounded-r-full"
                        style={{ backgroundColor: theme.color }}
                        transition={{
                          type: "spring",
                          stiffness: 260,
                          damping: 30,
                        }}
                      />
                    </>
                  )}

                  <div className="relative z-10 flex gap-3">
                    <div
                      className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]"
                      style={{
                        backgroundColor: theme.bg,
                        borderColor: theme.border,
                        color: theme.color,
                      }}
                    >
                      <SourceIcon
                        source={signal.source}
                        className="h-[15px] w-[15px]"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="mb-1.5 flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div
                            style={{ fontFamily: fonts.sans }}
                            className="truncate text-[14px] font-semibold tracking-tight text-zinc-900"
                          >
                            {signal.personName}
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-1.5">
                            <span
                              style={{
                                fontFamily: fonts.mono,
                                color: theme.color,
                                backgroundColor: theme.bg,
                                borderColor: theme.border,
                              }}
                              className="rounded-full border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.16em]"
                            >
                              {SOURCE_THEMES[signal.source]?.label ??
                                signal.source}
                            </span>
                            {signal.isFollowUp && (
                              <span
                                style={{ fontFamily: fonts.mono }}
                                className="rounded-full border border-white/60 bg-white/55 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-zinc-500"
                              >
                                follow-up
                              </span>
                            )}
                          </div>
                        </div>

                        <span
                          style={{ fontFamily: fonts.mono }}
                          className="shrink-0 pt-0.5 text-[10px] text-zinc-400"
                        >
                          {signal.timestamp}
                        </span>
                      </div>

                      <p
                        style={{ fontFamily: fonts.sans }}
                        className="line-clamp-2 pr-3 text-[12px] leading-relaxed text-zinc-500"
                      >
                        {signal.content}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </GlassSurface>
  );
}

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
    <GlassSurface grainId="demo-detail-grain" className="flex h-full min-h-0 flex-col">
      <div
        className="pointer-events-none absolute -left-[10%] top-[-8%] h-[42%] w-[60%] rounded-full blur-3xl"
        style={{ backgroundColor: theme.soft }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.45),transparent_32%)]" />

      <AnimatePresence mode="wait">
        <motion.div
          key={signal.id}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.24, ease: "easeOut" }}
          className="relative z-10 flex h-full min-h-0 flex-col"
        >
          <div className="border-b border-white/45 px-5 pb-3 pt-4">
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
                  style={{ fontFamily: fonts.mono }}
                  className="rounded-full border border-white/60 bg-white/45 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-zinc-500"
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
                style={{ fontFamily: fonts.mono }}
                className="text-[10px] uppercase tracking-[0.18em] text-zinc-400"
              >
                Action brief
              </span>
            </div>

            <div className="mb-2.5">
              <SectionEyebrow label={signal.personName} color={theme.color} />
              <h2
                style={{ fontFamily: fonts.sans }}
                className="mt-1.5 line-clamp-2 text-[18px] font-medium leading-snug tracking-[-0.03em] text-zinc-900"
              >
                {signal.insight}
              </h2>
            </div>

            <div className="rounded-[18px] border border-white/55 bg-white/40 px-3 py-2.5 shadow-[0_6px_24px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.64)] backdrop-blur-xl">
              <span
                style={{ fontFamily: fonts.mono }}
                className="mb-1 block text-[9px] font-semibold uppercase tracking-[0.18em] text-zinc-400"
              >
                Source snapshot
              </span>
              <p
                style={{ fontFamily: fonts.sans }}
                className="line-clamp-1 text-[13px] leading-snug text-zinc-700"
              >
                {signal.content}
              </p>
            </div>
          </div>

          <div className="flex min-h-0 flex-1 flex-col px-5 pb-4 pt-3">
            <div className="min-h-0 flex flex-1 flex-col rounded-[22px] border border-white/50 bg-white/34 p-4 shadow-[0_6px_20px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.55)] backdrop-blur-xl">
              <div className="mb-3 flex items-center justify-between gap-3">
                <SectionEyebrow label="Why now" color={theme.color} />
                <span
                  style={{ fontFamily: fonts.mono }}
                  className="text-[10px] uppercase tracking-[0.16em] text-zinc-400"
                >
                  reasoning chain
                </span>
              </div>

              <div className="demo-no-scrollbar min-h-0 flex-1 overflow-y-auto">
                <div className="relative space-y-3.5 pl-4 pr-1">
                  <div className="absolute bottom-2 left-[5px] top-2 w-px bg-gradient-to-b from-zinc-200 via-zinc-200 to-transparent" />
                  {[
                    { label: "because", text: signal.because, active: false },
                    { label: "and", text: signal.and, active: false },
                    { label: "so", text: signal.so, active: true },
                  ].map((step) => (
                    <div key={step.label} className="relative">
                      <div
                        className="absolute left-[-15px] top-[7px] h-[11px] w-[11px] rounded-full border-2 border-white shadow-sm"
                        style={{
                          backgroundColor: step.active ? theme.color : "#d4d4d8",
                        }}
                      />
                      <div
                        style={{ fontFamily: fonts.mono }}
                        className="mb-0.5 text-[10px] uppercase tracking-[0.18em] text-zinc-400"
                      >
                        {step.label}
                      </div>
                      <p
                        style={{
                          fontFamily: step.active ? fonts.serif : fonts.sans,
                        }}
                        className={`text-[14px] leading-relaxed ${
                          step.active ? "italic text-zinc-800" : "text-zinc-600"
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
                  style={{ fontFamily: fonts.sans }}
                  className="line-clamp-2 text-[14px] leading-snug text-zinc-800"
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
                  className={`inline-flex h-[40px] items-center justify-center gap-2 rounded-full px-5 text-[14px] font-medium transition-all duration-300 ${
                    sendState === "idle"
                      ? "text-white shadow-[0_14px_28px_rgba(0,0,0,0.16)]"
                      : sendState === "sending"
                        ? "cursor-not-allowed bg-white/50 text-zinc-400"
                        : "bg-emerald-500 text-white shadow-[0_14px_28px_rgba(16,185,129,0.25)]"
                  }`}
                  style={
                    sendState === "idle"
                      ? {
                          fontFamily: fonts.sans,
                          background: `linear-gradient(180deg, ${theme.color}, color-mix(in srgb, ${theme.color} 74%, black))`,
                        }
                      : { fontFamily: fonts.sans }
                  }
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
                      className="h-3.5 w-3.5 text-zinc-400"
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
                    className="h-[40px] w-full rounded-full border border-white/60 bg-white/48 pl-10 pr-4 text-[13px] text-zinc-800 placeholder:text-zinc-400 focus:border-white/80 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-[0_4px_14px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.58)] backdrop-blur-xl"
                    style={{ fontFamily: fonts.sans }}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </GlassSurface>
  );
}

function DemoRolodexCard({ profile }: { profile: DemoProfile }) {
  const proximity = PROXIMITY_THEMES[profile.proximity];

  return (
    <GlassSurface grainId="demo-profile-grain" className="flex h-full min-h-0 flex-col">
      <AnimatePresence mode="wait">
        <motion.div
          key={profile.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="relative z-10 flex h-full min-h-0 flex-col"
        >
          <div className="relative overflow-hidden border-b border-white/45 px-4 pb-4 pt-4">
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
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border backdrop-blur-md shadow-[0_6px_20px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.65)]"
                  style={{
                    backgroundColor: proximity.bg,
                    borderColor: proximity.border,
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
                    style={{ fontFamily: fonts.sans }}
                    className="truncate text-[16px] font-medium tracking-[-0.02em] text-zinc-900"
                  >
                    {profile.name}
                  </h3>
                  <p
                    style={{ fontFamily: fonts.sans }}
                    className="truncate text-[11px] leading-snug text-zinc-500"
                  >
                    {profile.role}
                  </p>
                </div>
              </div>

              {profile.traits && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {profile.traits.map((trait) => (
                    <span
                      key={trait}
                      style={{ fontFamily: fonts.mono }}
                      className="rounded-full border border-white/60 bg-white/46 px-2 py-1 text-[9px] text-zinc-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="demo-no-scrollbar min-h-0 flex-1 overflow-y-auto px-3.5 py-3">
            <div className="space-y-2.5">
              <div className="overflow-hidden rounded-[18px] bg-[linear-gradient(180deg,rgba(24,24,27,0.92),rgba(39,39,42,0.88))] px-3.5 py-3 text-white shadow-[0_12px_34px_rgba(0,0,0,0.18)]">
                <span
                  style={{ fontFamily: fonts.mono }}
                  className="block text-[9px] uppercase tracking-[0.18em] text-zinc-400"
                >
                  Why they matter
                </span>
                <p
                  style={{ fontFamily: fonts.sans }}
                  className="mt-1.5 text-[12px] leading-snug text-zinc-100"
                >
                  {profile.alignment}
                </p>
              </div>

              <div className="rounded-[16px] border border-white/55 bg-white/38 px-3.5 py-3 shadow-[0_6px_20px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.56)] backdrop-blur-xl">
                <SectionEyebrow label="Known For" />
                <p
                  style={{ fontFamily: fonts.sans }}
                  className="mt-1.5 text-[12px] leading-snug text-zinc-700"
                >
                  {profile.knownFor}
                </p>
              </div>

              <div className="rounded-[16px] border border-white/55 bg-white/38 px-3.5 py-3 shadow-[0_6px_20px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.56)] backdrop-blur-xl">
                <SectionEyebrow label="Met" />
                <p
                  style={{ fontFamily: fonts.serif }}
                  className="mt-1.5 text-[12px] italic leading-snug text-zinc-700"
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
                          style={{ fontFamily: fonts.sans }}
                          className="text-[11px] leading-snug text-zinc-600"
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
                  <SectionEyebrow label="Circle" />
                  <div className="mt-2 space-y-1.5">
                    {profile.circle.map((person) => (
                      <div
                        key={`${person.relation}-${person.name}`}
                        className="flex items-center justify-between gap-2 rounded-[12px] border border-white/45 bg-white/40 px-2.5 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]"
                      >
                        <div className="min-w-0">
                          <div
                            style={{ fontFamily: fonts.sans }}
                            className="truncate text-[11px] font-medium text-zinc-800"
                          >
                            {person.name}
                          </div>
                          {person.detail && (
                            <div
                              style={{ fontFamily: fonts.sans }}
                              className="truncate text-[10px] text-zinc-500"
                            >
                              {person.detail}
                            </div>
                          )}
                        </div>
                        <span
                          style={{ fontFamily: fonts.mono }}
                          className="shrink-0 text-[8px] uppercase tracking-[0.16em] text-zinc-400"
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

          <div className="border-t border-white/45 px-4 py-3">
            <div className="flex items-center justify-between gap-2">
              <span
                style={{ fontFamily: fonts.mono }}
                className="truncate text-[10px] text-zinc-500"
              >
                {profile.email}
              </span>
              <span
                style={{ fontFamily: fonts.mono }}
                className="shrink-0 text-[9px] uppercase tracking-[0.16em] text-zinc-400"
              >
                {profile.refId}
              </span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </GlassSurface>
  );
}

// ─────────────────────────────────────────────────────
// Main Container
// ─────────────────────────────────────────────────────

export default function DemoMockup() {
  const [selectedId, setSelectedId] = useState("s2");
  const [sendState, setSendState] = useState<"idle" | "sending" | "sent">(
    "idle",
  );

  const selectedSignal =
    DEMO_SIGNALS.find((signal) => signal.id === selectedId) ?? DEMO_SIGNALS[0];

  const selectedProfile =
    DEMO_PROFILES[selectedSignal.personId] ?? DEMO_PROFILES["arjun-mehta"];

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
    setSendState("idle");
  }, []);

  const handleSend = useCallback(() => {
    setSendState("sending");
    setTimeout(() => setSendState("sent"), 1200);
    setTimeout(() => setSendState("idle"), 3000);
  }, []);

  return (
    <div className="relative box-border h-full w-full px-4 py-4">
      <div className="grid h-full min-h-0 w-full grid-cols-[6fr_9fr_5fr] gap-4">
        <div className="min-h-0 min-w-0 h-full">
          <DemoSignalInbox
            signals={DEMO_SIGNALS}
            selectedId={selectedId}
            onSelect={handleSelect}
          />
        </div>

        <div className="min-h-0 min-w-0 h-full">
          <DemoSignalDetail
            signal={selectedSignal}
            sendState={sendState}
            onSend={handleSend}
          />
        </div>

        <div className="min-h-0 min-w-0 h-full">
          <DemoRolodexCard profile={selectedProfile} />
        </div>
      </div>
    </div>
  );
}
