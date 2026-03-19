"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { fonts } from "../lib/fonts";

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
  avatar: string;
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
  "lisa-ramirez": {
    id: "lisa-ramirez",
    name: "Lisa Ramirez",
    avatar: "/avatars/lisa-ramirez.jpg",
    role: "VP of Partnerships at Shopify",
    metAt: "SaaStr Annual, San Francisco, Sep 2025",
    knownFor:
      "Built Shopify\u2019s app ecosystem from 200 to 2,000 partners. Ex-Salesforce. Deep enterprise channel expertise.",
    alignment:
      "Strategic partner. Exploring how your product fits into Shopify\u2019s enterprise app marketplace.",
    email: "lisa@shopify.com",
    refId: "BRC-LR-0421",
    proximity: "known",
    remember: [
      "Training for the NYC marathon. Ask how prep is going",
      "Obsessed with specialty coffee. Knows every roaster in SF",
    ],
    traits: ["Ex-Salesforce", "Channel Partnerships", "Enterprise Apps"],
    circle: [
      { relation: "colleague", name: "James Park", detail: "Shopify, SVP Revenue" },
      { relation: "mentor", name: "Maria Santos", detail: "Salesforce, EVP Alliances" },
    ],
    lastInteraction: "SaaStr after-party, Dec 10, 2025",
  },
  "megan-scott": {
    id: "megan-scott",
    name: "Megan Scott",
    avatar: "/avatars/megan-scott.jpg",
    role: "Founder & CEO at Bloom Health",
    metAt: "Warm intro from Alex Mitchell, Jan 2025",
    knownFor:
      "Stanford CS \u201915. Previously Apple Health team lead. Building personalized preventive care for 40M underserved Americans. YC W23 alum.",
    alignment:
      "Potential strategic partner. Bloom Health\u2019s clinical platform could complement your product roadmap.",
    email: "megan@bloomhealth.com",
    refId: "BRC-MS-0389",
    proximity: "new",
    traits: ["YC W23", "Health Tech", "Ex-Apple Health"],
    circle: [
      { relation: "co-founder", name: "Lena Torres", detail: "Bloom Health, CTO" },
      { relation: "mentor", name: "Alex Mitchell", detail: "Arcline, CEO" },
    ],
    lastInteraction: "Coffee at Blue Bottle, Feb 12, 2026",
  },
  "daniel-ortiz": {
    id: "daniel-ortiz",
    name: "Daniel Ortiz",
    avatar: "/avatars/daniel-ortiz.jpg",
    role: "VP of Engineering at Plaid",
    metAt: "Stripe alumni dinner, San Francisco, 2021",
    knownFor:
      "Scaled Plaid\u2019s platform team from 8 to 60 engineers. Deep infrastructure conviction. Known for developing senior engineering talent.",
    alignment:
      "Close industry peer. Shares engineering talent network and deep technical partnerships.",
    email: "daniel@plaid.com",
    phone: "+1 (650) 555-7741",
    refId: "BRC-DO-0312",
    proximity: "close",
    remember: [
      "Stanford GSB \u201909. Ran the same venture seminar",
      "Weekend hiker. Just summited Half Dome",
    ],
    traits: ["Stanford GSB '09", "Platform Engineering", "Ex-Stripe"],
    circle: [
      { relation: "colleague", name: "Greg Torres", detail: "Plaid, Sr. Staff Engineer" },
      {
        relation: "report",
        name: "Claire Donovan",
        detail: "Plaid, Staff Engineer",
      },
    ],
    lastInteraction: "Coffee at Philz, Jan 15, 2026",
  },
  "priya-sharma": {
    id: "priya-sharma",
    name: "Priya Sharma",
    avatar: "/avatars/priya-sharma.jpg",
    role: "Director of Platform Engineering at Databricks",
    metAt: "AWS re:Invent developer lounge, Nov 2025",
    knownFor:
      "Building Databricks\u2019 internal developer platform. Ex-Google Cloud. Deeply thoughtful about developer experience and tooling.",
    alignment:
      "Potential customer. Had a great conversation at re:Invent about platform challenges your product could help with.",
    email: "priya@databricks.com",
    refId: "BRC-PS-0503",
    proximity: "known",
    remember: [
      "Huge Tottenham fan. Always ask about the season",
      "Just relocated her team to the Austin office",
    ],
    traits: ["Ex-Google Cloud", "Platform Engineering", "DevEx"],
    circle: [
      { relation: "colleague", name: "Nina Patel", detail: "Databricks, VP Engineering" },
      { relation: "former manager", name: "Tom Wu", detail: "Google Cloud, Director" },
    ],
    lastInteraction: "Quick chat at re:Invent, Nov 18, 2025",
  },
};

const DEMO_SIGNALS: Record<string, DemoSignal> = {
  "s-keep": {
    id: "s-keep",
    personId: "lisa-ramirez",
    personName: "Lisa Ramirez",
    source: "memory",
    timestamp: "today",
    content: "3 months since you last talked. She just keynoted Shopify Editions this week",
    insight:
      "Lisa just keynoted Editions and you haven\u2019t spoken in 3 months",
    because:
      "You haven\u2019t spoken since SaaStr in December. She was excited about adding your product to Shopify\u2019s partner marketplace.",
    and: "She\u2019s riding the high from keynoting Shopify Editions. People are most open to conversations right after a big moment.",
    so: "A quick congrats reopens the door without feeling forced, and naturally leads back to the partnership you discussed.",
    actionLabel: "message Lisa",
    actionChannel: "dm",
    suggestedText:
      "Hey Lisa, congrats on the Editions keynote! The marketplace push looks really exciting. Would love to hear where things are heading. Want to grab coffee at Sightglass this week? I also pulled together that integration spec you\u2019d asked about.",
  },
  s7: {
    id: "s7",
    personId: "megan-scott",
    personName: "Megan Scott",
    source: "quiet",
    timestamp: "today",
    content: "Alex can connect you to Megan\u2019s clinical partner at HealthBridge",
    insight: "Alex can get you a warm intro into Bloom Health",
    because:
      "You\u2019re exploring a partnership with Bloom Health, and Alex\u2019s Stanford circle overlaps with their clinical advisory team.",
    and: "Understanding the people around a company tells you whether there\u2019s real alignment.",
    so: "Asking Alex for this intro shows Megan you\u2019re doing the homework, not just kicking tires.",
    actionLabel: "ask Alex",
    actionChannel: "dm",
    suggestedText:
      "Hey Alex, I\u2019ve been getting to know Megan and Bloom Health. Any chance you could connect me with Dr. Rivera at HealthBridge? Would love to hear their take on the clinical integration side.",
  },
  "s-hire": {
    id: "s-hire",
    personId: "daniel-ortiz",
    personName: "Daniel Ortiz",
    source: "email",
    timestamp: "2h ago",
    content:
      "His staff engineer Claire Donovan is exploring. Perfect VP Eng for your team",
    insight:
      "Daniel just surfaced the VP Eng you\u2019ve been searching for",
    because:
      "Daniel knows you\u2019ve been looking for a VP Engineering for 3 months. Claire\u2019s on his platform team at Plaid.",
    and: "She scaled their infrastructure and grew the team from 5 to 40. Exactly the kind of builder you need right now.",
    so: "Moving fast shows Daniel you take his recommendations seriously, and gives you a warm lead on a hire that usually takes 6 months.",
    actionLabel: "intro Claire",
    actionChannel: "email",
    suggestedText:
      "Hey Daniel, that\u2019s exactly the kind of person I\u2019ve been looking for. Would you mind introducing me to Claire? Happy to grab a hike or coffee this week, your call.",
  },
  "s-sale": {
    id: "s-sale",
    personId: "priya-sharma",
    personName: "Priya Sharma",
    source: "linkedin",
    timestamp: "4h ago",
    content: "Posted about developer tooling fragmentation slowing her team down",
    insight:
      "Priya just posted about the exact problem you solve",
    because:
      "You had a great conversation at re:Invent about platform engineering pain points. She was curious about how you\u2019re approaching tooling consolidation.",
    and: "Her post is getting traction. She\u2019s clearly thinking hard about this and looking for answers right now.",
    so: "Reaching out about her post is genuine, not a cold pitch. You\u2019re continuing a conversation you already started.",
    actionLabel: "message Priya",
    actionChannel: "dm",
    suggestedText:
      "Hey Priya, saw your post about tooling fragmentation. We\u2019ve been deep in that exact problem. Would love to pick up where we left off at re:Invent. Coffee next week? Also how are Spurs doing this season?",
  },
};

const USE_CASES = [
  {
    id: "keeping-up",
    label: "Keeping Up",
    signalId: "s-keep",
    profileId: "lisa-ramirez",
  },
  {
    id: "warm-intro",
    label: "Warm Intro",
    signalId: "s7",
    profileId: "megan-scott",
  },
  {
    id: "hiring",
    label: "Hiring",
    signalId: "s-hire",
    profileId: "daniel-ortiz",
  },
  {
    id: "sales",
    label: "Sales",
    signalId: "s-sale",
    profileId: "priya-sharma",
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

function MobileDemoSignalDetail({
  signal,
  sendState,
  onSend,
}: {
  signal: DemoSignal;
  sendState: "idle" | "sending" | "sent";
  onSend: () => void;
}) {
  const theme = SOURCE_THEMES[signal.source] ?? SOURCE_THEMES.email;
  const reasoningSteps = [
    { label: "Because", text: signal.because },
    { label: "Now", text: signal.and },
    { label: "Move", text: signal.so, emphasize: true },
  ];

  return (
    <CardSurface
      grainId="mobile-demo-detail-grain"
      variant="signal"
      className="flex h-full min-h-0 flex-col"
    >
      <div
        className="pointer-events-none absolute -left-[12%] top-[-10%] h-[44%] w-[62%] rounded-full blur-3xl"
        style={{ backgroundColor: theme.soft }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.48),transparent_34%)]" />

      <div className="relative z-10 flex h-full flex-col">
        <div
          className="px-4 pb-3 pt-4"
          style={{ borderBottom: "1px solid rgba(60,70,50,0.08)" }}
        >
          <div className="mb-3 flex items-start justify-between gap-3">
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
                  color: "rgba(60,70,50,0.36)",
                }}
                className="rounded-full border border-white/60 bg-white/45 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em]"
              >
                {signal.timestamp}
              </span>
            </div>

            <span
              style={{ fontFamily: fonts.mono, color: "rgba(60,70,50,0.34)" }}
              className="pt-0.5 text-[9px] uppercase tracking-[0.18em]"
            >
              Action brief
            </span>
          </div>

          <SectionEyebrow label={signal.personName} color={theme.color} />
          <h2
            style={{ fontFamily: fonts.sans, color: "rgba(35,40,30,0.85)" }}
            className="mt-2 line-clamp-3 text-[20px] font-medium leading-[1.18] tracking-[-0.03em]"
          >
            {signal.insight}
          </h2>

          <div className="mt-3 rounded-[18px] border border-white/55 bg-white/42 px-3.5 py-3 shadow-[0_6px_24px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.64)] backdrop-blur-xl">
            <div className="mb-1">
              <SectionEyebrow label="Source snapshot" color={theme.color} />
            </div>
            <p
              style={{ fontFamily: fonts.sans, color: "rgba(35,40,30,0.72)" }}
              className="line-clamp-2 text-[13px] leading-[1.45]"
            >
              {signal.content}
            </p>
          </div>
        </div>

        <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
          <div className="rounded-[22px] border border-white/50 bg-white/36 p-3.5 shadow-[0_6px_20px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.55)] backdrop-blur-xl">
            <div className="mb-3 flex items-center justify-between gap-3">
              <SectionEyebrow label="Why now" color={theme.color} />
              <span
                style={{ fontFamily: fonts.mono, color: "rgba(60,70,50,0.30)" }}
                className="text-[9px] uppercase tracking-[0.16em]"
              >
                reasoning
              </span>
            </div>

            <div className="space-y-2.5">
              {reasoningSteps.map((step) => (
                <div
                  key={step.label}
                  className={`rounded-[16px] border px-3 py-2.5 ${
                    step.emphasize
                      ? "border-[rgba(80,100,60,0.18)] bg-[rgba(80,100,60,0.07)]"
                      : "border-white/55 bg-white/58"
                  }`}
                >
                  <div
                    style={{
                      fontFamily: fonts.mono,
                      color: step.emphasize
                        ? "rgba(80,100,60,0.78)"
                        : "rgba(60,70,50,0.46)",
                    }}
                    className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em]"
                  >
                    {step.label}
                  </div>
                  <p
                    style={{
                      fontFamily: step.emphasize ? fonts.serif : fonts.sans,
                      color: step.emphasize
                        ? "rgba(35,40,30,0.84)"
                        : "rgba(35,40,30,0.68)",
                    }}
                    className={`line-clamp-2 text-[12px] leading-[1.45] ${
                      step.emphasize ? "italic" : ""
                    }`}
                  >
                    {step.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 rounded-[22px] border border-white/50 bg-white/36 p-3.5 shadow-[0_6px_20px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.55)] backdrop-blur-xl">
            <div className="mb-2">
              <SectionEyebrow
                label={`Suggested ${CHANNEL_LABELS[signal.actionChannel] ?? signal.actionChannel}`}
                color={theme.color}
              />
            </div>

            <div className="rounded-[18px] border border-white/60 bg-white/48 px-3.5 py-3 shadow-[0_8px_24px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.68)] backdrop-blur-xl">
              <p
                style={{ fontFamily: fonts.sans, color: "rgba(35,40,30,0.72)" }}
                className="line-clamp-4 text-[13px] leading-[1.45]"
              >
                {signal.suggestedText}
              </p>
            </div>

            <div className="mt-3 flex gap-2">
              <motion.button
                type="button"
                onClick={onSend}
                disabled={sendState !== "idle"}
                whileHover={sendState === "idle" ? { y: -1 } : undefined}
                whileTap={sendState === "idle" ? { scale: 0.985 } : undefined}
                className="inline-flex h-[40px] min-w-[8.5rem] items-center justify-center gap-2 rounded-full px-4 text-[13px] font-medium transition-all duration-300"
                style={{
                  fontFamily: fonts.sans,
                  ...(sendState === "idle"
                    ? {
                        background:
                          "linear-gradient(180deg, rgba(80,100,60,0.65), rgba(80,100,60,0.50))",
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
              </motion.button>

              <div className="relative min-w-0 flex-1">
                <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
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
                  placeholder="Refine..."
                  className="h-[40px] w-full rounded-full border border-white/60 bg-white/48 pl-9 pr-3 text-[12px] backdrop-blur-xl focus:border-white/80 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-[0_4px_14px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.58)]"
                  style={{
                    fontFamily: fonts.sans,
                    color: "rgba(35,40,30,0.78)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </CardSurface>
  );
}

function MobileDemoRolodexCard({ profile }: { profile: DemoProfile }) {
  const proximity = PROXIMITY_THEMES[profile.proximity];
  const traitPills =
    profile.traits?.slice(0, 3) ??
    profile.remember?.slice(0, 3).map((item) => item.split(".")[0]) ??
    [];
  const circleSummary = profile.circle?.slice(0, 2).map((person) => person.name).join(" • ");

  return (
    <CardSurface
      grainId="mobile-demo-rolodex-grain"
      variant="rolodex"
      className="flex h-full min-h-0 flex-col"
    >
      <div
        className="pointer-events-none absolute left-[-18%] top-[-34%] h-[80%] w-[84%] rounded-full blur-3xl"
        style={{ backgroundColor: proximity.bg }}
      />
      <div className="relative z-10 flex h-full flex-col px-4 pb-4 pt-4">
        <div className="mb-3 flex items-center justify-between gap-3">
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

        <div className="rounded-[22px] border border-white/58 bg-white/70 p-3.5 shadow-[0_6px_18px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.72)]">
          <div className="flex items-center gap-3">
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
                style={{ fontFamily: fonts.sans, color: "rgba(35,25,15,0.92)" }}
                className="truncate text-[18px] font-medium tracking-[-0.02em]"
              >
                {profile.name}
              </h3>
              <p
                style={{ fontFamily: fonts.sans, color: "rgba(80,50,30,0.48)" }}
                className="line-clamp-2 text-[12px] leading-snug"
              >
                {profile.role}
              </p>
            </div>
          </div>

          <p
            style={{ fontFamily: fonts.sans, color: "rgba(35,25,15,0.70)" }}
            className="mt-3 line-clamp-2 text-[12px] leading-[1.45]"
          >
            {profile.alignment}
          </p>

          {traitPills.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {traitPills.map((trait) => (
                <span
                  key={trait}
                  style={{ fontFamily: fonts.mono, color: proximity.color }}
                  className="rounded-full border border-white/60 bg-white/62 px-2.5 py-1 text-[9px] uppercase tracking-[0.14em] shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]"
                >
                  {trait}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2.5">
          <div className="rounded-[18px] border border-white/55 bg-white/52 px-3 py-3 shadow-[0_4px_14px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.62)]">
            <SectionEyebrow label="Met" color="rgba(80,50,30,0.42)" />
            <p
              style={{ fontFamily: fonts.serif, color: "rgba(35,25,15,0.67)" }}
              className="mt-2 line-clamp-3 text-[11px] italic leading-[1.45]"
            >
              {profile.metAt}
            </p>
          </div>

          <div className="rounded-[18px] border border-white/55 bg-white/52 px-3 py-3 shadow-[0_4px_14px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.62)]">
            <SectionEyebrow label="Circle" color="rgba(80,50,30,0.42)" />
            <p
              style={{ fontFamily: fonts.sans, color: "rgba(35,25,15,0.66)" }}
              className="mt-2 line-clamp-3 text-[11px] leading-[1.45]"
            >
              {circleSummary || profile.knownFor}
            </p>
          </div>
        </div>

        <div
          className="mt-3 flex items-center justify-between gap-2 border-t border-[rgba(80,50,30,0.06)] pt-3"
        >
          <span
            style={{ fontFamily: fonts.mono, color: "rgba(35,25,15,0.50)" }}
            className="truncate text-[10px]"
          >
            {profile.email}
          </span>
          <span
            style={{ fontFamily: fonts.mono, color: "rgba(80,50,30,0.32)" }}
            className="shrink-0 text-[9px] uppercase tracking-[0.16em]"
          >
            {profile.refId}
          </span>
        </div>
      </div>
    </CardSurface>
  );
}

function DemoSignalDetail({
  signal,
  sendState,
  onSend,
  isNarrow,
}: {
  signal: DemoSignal;
  sendState: "idle" | "sending" | "sent";
  onSend: () => void;
  isNarrow: boolean;
}) {
  if (isNarrow) {
    return (
      <MobileDemoSignalDetail
        signal={signal}
        sendState={sendState}
        onSend={onSend}
      />
    );
  }

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
            className={isNarrow ? "px-4 pb-3 pt-3.5" : "px-5 pb-3 pt-4"}
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
                className={`mt-1.5 font-medium leading-snug tracking-[-0.03em] ${
                  isNarrow ? "line-clamp-3 text-[18px]" : "line-clamp-2 text-[21px]"
                }`}
              >
                {signal.insight}
              </h2>
            </div>

            <div className="rounded-[18px] border border-white/55 bg-white/40 px-3 py-2.5 shadow-[0_6px_24px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.64)] backdrop-blur-xl">
              <div className="mb-1">
                <SectionEyebrow label="Source snapshot" color={theme.color} />
              </div>
              <p
                style={{
                  fontFamily: fonts.sans,
                  color: "rgba(35,40,30,0.72)",
                }}
                className={`leading-snug ${isNarrow ? "line-clamp-2 text-[13px]" : "line-clamp-1 text-[14px]"}`}
              >
                {signal.content}
              </p>
            </div>
          </div>

          <div
            className={`flex flex-col ${isNarrow ? "px-4 pb-3 pt-3" : "min-h-0 flex-1 px-5 pb-4 pt-3"}`}
          >
            <div
              className={`flex flex-col rounded-[22px] border border-white/50 bg-white/34 shadow-[0_6px_20px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.55)] backdrop-blur-xl ${
                isNarrow ? "p-3.5" : "min-h-0 flex-1 p-4"
              }`}
            >
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

              <div className={isNarrow ? "overflow-visible" : "min-h-0 flex-1 overflow-hidden"}>
                <div className={`relative pl-4 ${isNarrow ? "space-y-3 pr-0" : "space-y-3.5 pr-1"}`}>
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
                            ? "rgba(80,100,60,0.78)"
                            : "rgba(60,70,50,0.52)",
                        }}
                        className="mb-0.5 text-[11px] font-semibold uppercase tracking-[0.16em]"
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
                        className={`${isNarrow ? "line-clamp-3 text-[13px] leading-[1.45]" : "text-[15px] leading-relaxed"} ${
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
                  className={`${isNarrow ? "line-clamp-4 text-[13px] leading-[1.45]" : "line-clamp-3 text-[15px] leading-snug"}`}
                >
                  {signal.suggestedText}
                </p>
              </div>

              <div className={`flex gap-2.5 ${isNarrow ? "flex-col items-stretch" : "items-center"}`}>
                <motion.button
                  type="button"
                  onClick={onSend}
                  disabled={sendState !== "idle"}
                  whileHover={sendState === "idle" ? { y: -1 } : undefined}
                  whileTap={sendState === "idle" ? { scale: 0.985 } : undefined}
                  className={`inline-flex h-[40px] items-center justify-center gap-2 rounded-full px-5 text-[14px] font-medium transition-all duration-300 ${
                    isNarrow ? "w-full" : ""
                  }`}
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

                <div className={`relative ${isNarrow ? "w-full" : "flex-1"}`}>
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

function DemoRolodexCard({
  profile,
  isNarrow,
}: {
  profile: DemoProfile;
  isNarrow: boolean;
}) {
  if (isNarrow) {
    return <MobileDemoRolodexCard profile={profile} />;
  }

  const proximity = PROXIMITY_THEMES[profile.proximity];
  const rememberItems = isNarrow ? profile.remember?.slice(0, 1) : profile.remember;
  const circleItems = isNarrow ? profile.circle?.slice(0, 2) : profile.circle;

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
                  className="h-11 w-11 shrink-0 overflow-hidden rounded-full shadow-[0_6px_20px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.65)]"
                  style={{
                    border: `1px solid ${proximity.border}`,
                  }}
                >
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="min-w-0">
                  <h3
                    style={{
                      fontFamily: fonts.sans,
                      color: "rgba(35,25,15,0.92)",
                    }}
                    className={`${isNarrow ? "text-[16px]" : "text-[18px]"} truncate font-medium tracking-[-0.02em]`}
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

          <div
            className={`demo-no-scrollbar px-3.5 py-3 ${
              isNarrow ? "overflow-hidden" : "min-h-0 flex-1 overflow-y-auto"
            }`}
          >
            <div className="space-y-2.5">
              <div className="overflow-hidden rounded-[18px] border border-white/55 bg-white/40 px-3.5 py-3 shadow-[0_6px_20px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.56)] backdrop-blur-xl">
                <SectionEyebrow label="Why they matter" color={proximity.color} />
                <p
                  style={{
                    fontFamily: fonts.sans,
                    color: "rgba(35,25,15,0.70)",
                  }}
                  className={`mt-1.5 leading-snug ${isNarrow ? "line-clamp-3 text-[12px]" : "text-[13px]"}`}
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
                  className={`mt-1.5 leading-snug ${isNarrow ? "line-clamp-3 text-[12px]" : "text-[13px]"}`}
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
                  className={`mt-1.5 italic leading-snug ${isNarrow ? "line-clamp-2 text-[12px]" : "text-[13px]"}`}
                >
                  {profile.metAt}
                </p>
              </div>

              {rememberItems && rememberItems.length > 0 && (
                <div className="rounded-[16px] border border-white/55 bg-white/38 px-3.5 py-3 shadow-[0_6px_20px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.56)] backdrop-blur-xl">
                  <SectionEyebrow label="Remember" color={proximity.color} />
                  <div className="mt-2 space-y-1.5">
                    {rememberItems.map((item) => (
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
                          className={`${isNarrow ? "line-clamp-2 text-[11px]" : "text-[12px]"} leading-snug`}
                        >
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {circleItems && circleItems.length > 0 && (
                <div className="rounded-[16px] border border-white/55 bg-white/38 px-3.5 py-3 shadow-[0_6px_20px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.56)] backdrop-blur-xl">
                  <SectionEyebrow label="Circle" color="rgba(80,50,30,0.42)" />
                  <div className="mt-2 space-y-1.5">
                    {circleItems.map((person) => (
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
  paused,
  isNarrow,
}: {
  activeIdx: number;
  onSelect: (idx: number) => void;
  onAutoAdvance: () => void;
  paused: boolean;
  isNarrow: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const progressRef = useRef<HTMLDivElement>(null);
  const [pill, setPill] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const btn = buttonRefs.current[activeIdx];
    const container = containerRef.current;
    if (!btn || !container) return;
    const cRect = container.getBoundingClientRect();
    const bRect = btn.getBoundingClientRect();
    setPill({ left: bRect.left - cRect.left, width: bRect.width });
    if (isNarrow) {
      const targetLeft =
        btn.offsetLeft - (container.clientWidth - btn.offsetWidth) / 2;
      const maxScrollLeft = Math.max(
        0,
        container.scrollWidth - container.clientWidth,
      );
      container.scrollTo({
        left: Math.max(0, Math.min(targetLeft, maxScrollLeft)),
        behavior: "smooth",
      });
    }
  }, [activeIdx, isNarrow]);

  useEffect(() => {
    const el = progressRef.current;
    if (!el) return;
    // Wait one frame so the CSS animation is registered on the new DOM element
    const raf = requestAnimationFrame(() => {
      const anims = el.getAnimations();
      for (const a of anims) {
        a.playbackRate = paused ? 0 : 1;
      }
    });
    return () => cancelAnimationFrame(raf);
  }, [paused, activeIdx]);

  return (
    <div
      ref={containerRef}
      className={`demo-no-scrollbar relative items-center gap-0.5 rounded-full p-1 backdrop-blur-xl ${
        isNarrow
          ? "flex w-full max-w-full overflow-x-auto overflow-y-hidden"
          : "inline-flex"
      }`}
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
          opacity: pill.width > 0 ? 1 : 0,
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
            className={`relative cursor-pointer rounded-full whitespace-nowrap ${isNarrow ? "px-4 py-1.5" : "px-5 py-2.5"}`}
          >
            <span
              className={`relative z-10 font-semibold uppercase tracking-[0.14em] transition-colors duration-300 ${isNarrow ? "text-[10px]" : "text-[11px]"}`}
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
              <div className={`absolute h-[1.5px] overflow-hidden rounded-full bg-black/[0.03] ${isNarrow ? "bottom-1 left-3 right-3" : "bottom-1.5 left-4 right-4"}`}>
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
// Mobile Unified Card (replaces two-card mobile layout)
// ─────────────────────────────────────────────────────

function MobileSignalCard({
  signal,
  profile,
  sendState,
  onSend,
}: {
  signal: DemoSignal;
  profile: DemoProfile;
  sendState: "idle" | "sending" | "sent";
  onSend: () => void;
}) {
  const theme = SOURCE_THEMES[signal.source] ?? SOURCE_THEMES.email;
  const proximity = PROXIMITY_THEMES[profile.proximity];

  return (
    <CardSurface
      grainId="mobile-signal-grain"
      variant="signal"
      className="flex h-full min-h-0 flex-col"
    >
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute -left-[10%] top-[-8%] h-[42%] w-[60%] rounded-full blur-3xl"
        style={{ backgroundColor: theme.soft }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.48),transparent_34%)]" />

      <AnimatePresence mode="wait">
        <motion.div
          key={signal.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.32, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative z-10 flex h-full min-h-0 flex-col"
        >
          {/* ── Person + signal meta strip ── */}
          <div
            className="shrink-0 px-4 pt-3.5 pb-2.5"
            style={{ borderBottom: "1px solid rgba(60,70,50,0.07)" }}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <div
                  className="h-7 w-7 shrink-0 overflow-hidden rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.65)]"
                  style={{ border: `1px solid ${proximity.border}` }}
                >
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <div
                    style={{ fontFamily: fonts.sans, color: "rgba(35,25,15,0.90)" }}
                    className="truncate text-[13.5px] font-semibold tracking-[-0.01em]"
                  >
                    {profile.name}
                  </div>
                  <div
                    style={{ fontFamily: fonts.sans, color: "rgba(80,50,30,0.46)" }}
                    className="truncate text-[11px] leading-tight"
                  >
                    {profile.role}
                  </div>
                </div>
              </div>
              <div className="flex shrink-0 flex-wrap items-center justify-end gap-1.5">
                <span
                  style={{
                    fontFamily: fonts.mono,
                    color: proximity.color,
                    backgroundColor: proximity.bg,
                    borderColor: proximity.border,
                  }}
                  className="rounded-full border px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.16em]"
                >
                  {proximity.label}
                </span>
                <span
                  style={{
                    fontFamily: fonts.mono,
                    color: theme.color,
                    backgroundColor: theme.bg,
                    borderColor: theme.border,
                  }}
                  className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.16em] shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]"
                >
                  <SourceIcon source={signal.source} className="h-2.5 w-2.5" />
                  {SOURCE_THEMES[signal.source]?.label ?? signal.source}
                </span>
                <span
                  style={{ fontFamily: fonts.mono, color: "rgba(60,70,50,0.34)" }}
                  className="text-[8px] uppercase tracking-[0.14em]"
                >
                  {signal.timestamp}
                </span>
              </div>
            </div>
          </div>

          {/* ── Insight + snapshot ── */}
          <div
            className="shrink-0 px-4 pt-2.5 pb-2.5"
            style={{ borderBottom: "1px solid rgba(60,70,50,0.06)" }}
          >
            <h2
              style={{ fontFamily: fonts.sans, color: "rgba(35,40,30,0.88)" }}
              className="text-[21px] font-medium leading-[1.22] tracking-[-0.03em]"
            >
              {signal.insight}
            </h2>
            <div className="mt-2 rounded-[13px] border border-white/55 bg-white/42 px-3 py-1.5 shadow-[0_4px_16px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.64)] backdrop-blur-xl">
              <p
                style={{ fontFamily: fonts.sans, color: "rgba(35,40,30,0.62)" }}
                className="line-clamp-2 text-[13px] leading-[1.4]"
              >
                {signal.content}
              </p>
            </div>
          </div>

          {/* ── Why now reasoning ── */}
          <div className="shrink-0 px-4 pt-2.5 pb-2">
            <div className="mb-1.5 flex items-center justify-between">
              <SectionEyebrow label="Why now" color={theme.color} />
              <span
                style={{ fontFamily: fonts.mono, color: "rgba(60,70,50,0.28)" }}
                className="text-[8px] uppercase tracking-[0.16em]"
              >
                reasoning
              </span>
            </div>
            <div className="relative pl-3.5 space-y-1.5">
              <div
                className="absolute bottom-2 left-[3.5px] top-2 w-px"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(60,70,50,0.14), rgba(60,70,50,0.04))",
                }}
              />
              {[
                { label: "because", text: signal.because, active: false },
                { label: "and", text: signal.and, active: false },
                { label: "so", text: signal.so, active: true },
              ].map((step) => (
                <div key={step.label} className="relative">
                  <div
                    className="absolute left-[-12px] top-[5px] h-[7px] w-[7px] rounded-full border-[1.5px] border-white shadow-sm"
                    style={{
                      backgroundColor: step.active
                        ? "rgba(80,100,60,0.60)"
                        : "rgba(60,70,50,0.16)",
                    }}
                  />
                  <div
                    style={{
                      fontFamily: fonts.mono,
                      color: step.active
                        ? "rgba(80,100,60,0.78)"
                        : "rgba(60,70,50,0.44)",
                    }}
                    className="mb-0.5 text-[8.5px] font-semibold uppercase tracking-[0.16em]"
                  >
                    {step.label}
                  </div>
                  <p
                    style={{
                      fontFamily: step.active ? fonts.serif : fonts.sans,
                      color: step.active
                        ? "rgba(35,40,30,0.84)"
                        : "rgba(35,40,30,0.55)",
                    }}
                    className={`line-clamp-2 text-[14px] leading-[1.38] ${step.active ? "italic" : ""}`}
                  >
                    {step.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Suggested message + actions ── */}
          <div className="min-h-0 flex-1 px-4 pb-3 pt-0 flex flex-col">
            <div className="min-h-0 flex-1 rounded-[18px] border border-white/50 bg-white/36 px-3.5 py-3 shadow-[0_6px_20px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.55)] backdrop-blur-xl flex flex-col">
              <SectionEyebrow
                label={`Suggested ${CHANNEL_LABELS[signal.actionChannel] ?? signal.actionChannel}`}
                color={theme.color}
              />
              <p
                style={{ fontFamily: fonts.sans, color: "rgba(35,40,30,0.68)" }}
                className="mt-1.5 line-clamp-[4] text-[14px] leading-[1.45]"
              >
                {signal.suggestedText}
              </p>
              <div className="mt-auto">
                <div
                  className="mt-2.5 mb-2.5 h-px w-full"
                  style={{ background: "rgba(60,70,50,0.07)" }}
                />
              <div className="flex gap-2">
                <motion.button
                  type="button"
                  onClick={onSend}
                  disabled={sendState !== "idle"}
                  whileHover={sendState === "idle" ? { y: -1 } : undefined}
                  whileTap={sendState === "idle" ? { scale: 0.985 } : undefined}
                  className="inline-flex h-[34px] min-w-[7.5rem] items-center justify-center gap-1.5 rounded-full px-3.5 text-[12px] font-medium transition-all duration-300"
                  style={{
                    fontFamily: fonts.sans,
                    ...(sendState === "idle"
                      ? {
                          background:
                            "linear-gradient(180deg, rgba(80,100,60,0.65), rgba(80,100,60,0.50))",
                          border: "1px solid rgba(80,100,60,0.30)",
                          color: "white",
                          boxShadow: "0 8px 20px rgba(80,100,60,0.18)",
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
                            boxShadow: "0 8px 20px rgba(80,100,60,0.20)",
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
                      className="h-3 w-3"
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
                      className="h-3 w-3"
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
                  <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                    <svg
                      className="h-3 w-3"
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
                    placeholder="Refine..."
                    className="h-[34px] w-full rounded-full border border-white/60 bg-white/48 pl-8 pr-3 text-[11px] backdrop-blur-xl focus:border-white/80 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-[0_2px_10px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.58)]"
                    style={{
                      fontFamily: fonts.sans,
                      color: "rgba(35,40,30,0.78)",
                    }}
                  />
                </div>
              </div>
              </div>{/* mt-auto */}
            </div>{/* inner card */}
          </div>{/* outer flex-1 wrapper */}
        </motion.div>
      </AnimatePresence>
    </CardSurface>
  );
}

// ─────────────────────────────────────────────────────
// Main Container
// ─────────────────────────────────────────────────────

export default function DemoMockup({ isNarrow = false }: { isNarrow?: boolean }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [sendState, setSendState] = useState<"idle" | "sending" | "sent">(
    "idle",
  );
  const [paused, setPaused] = useState(false);

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

  const keyframes = `@keyframes usecaseProgress{from{transform:scaleX(0);opacity:0}4%{opacity:1}to{transform:scaleX(1);opacity:1}}`;

  if (isNarrow) {
    return (
      <>
        <style>{keyframes}</style>
        <div className="relative box-border flex h-full w-full flex-col px-4 py-4">
          <div className="mx-auto min-h-0 w-full flex-1 flex max-w-[420px] flex-col">
            <MobileSignalCard
              signal={signal}
              profile={profile}
              sendState={sendState}
              onSend={handleSend}
            />
          </div>
          <div className="mt-3 flex shrink-0">
            <UseCaseCarousel
              activeIdx={activeIdx}
              onSelect={handleSelectUseCase}
              onAutoAdvance={handleAutoAdvance}
              paused={paused}
              isNarrow={true}
            />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{keyframes}</style>
      <div className="relative box-border flex h-full w-full flex-col px-6 py-5">
        <div
          className="mx-auto min-h-0 w-full flex-1 grid max-w-[1100px] grid-cols-[10fr_7fr] gap-4"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="h-full min-h-0 min-w-0">
            <DemoSignalDetail
              signal={signal}
              sendState={sendState}
              onSend={handleSend}
              isNarrow={false}
            />
          </div>
          <div className="h-full min-h-0 min-w-0">
            <DemoRolodexCard profile={profile} isNarrow={false} />
          </div>
        </div>
        <div className="mt-4 flex shrink-0 justify-center">
          <UseCaseCarousel
            activeIdx={activeIdx}
            onSelect={handleSelectUseCase}
            onAutoAdvance={handleAutoAdvance}
            paused={paused}
            isNarrow={false}
          />
        </div>
      </div>
    </>
  );
}
