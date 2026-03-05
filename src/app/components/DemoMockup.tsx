"use client";

import { useState, useCallback } from "react";

// ─────────────────────────────────────────────────────
// Shared constants
// ─────────────────────────────────────────────────────
const fonts = {
  mono: "'Courier New', Courier, monospace",
  serif: "'Georgia', 'Times New Roman', serif",
};

const PAPER_GRAIN_DATA_URL =
  "data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E";

const colors = {
  textPrimary: "rgba(35,25,15,0.88)",
  textSecondary: "rgba(35,25,15,0.6)",
  textMuted: "rgba(80,50,30,0.48)",
  textFaint: "rgba(80,50,30,0.32)",
  accentGreen: "rgba(80,100,60,0.6)",
  accentGreenStrong: "rgba(80,100,60,0.8)",
  border: "rgba(60,70,50,0.1)",
  borderSubtle: "rgba(60,70,50,0.06)",
  selectedBg: "rgba(80,100,60,0.06)",
  hoverBg: "rgba(60,70,50,0.03)",
};

const sourceAccentColors: Record<string, string> = {
  email: "rgba(180,120,60,0.5)",
  linkedin: "rgba(100,120,140,0.45)",
  memory: "rgba(160,140,60,0.5)",
  news: "rgba(120,100,80,0.4)",
  quiet: "rgba(140,130,110,0.35)",
};

// ─────────────────────────────────────────────────────
// Demo Data
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
      "Wife Meera is expecting in April \u2014 ask about preparations",
      "Runs 5K every morning at Cubbon Park",
      "Prefers Third Wave Coffee over Starbucks",
    ],
    traits: ["IIT Bombay \u201912", "Supply Chain AI", "Seed to $5M ARR in 18mo"],
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
      { relation: "husband", name: "Ravi Iyer", detail: "Sundaram Group, Chairman" },
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
    traits: ["IIT Delhi \u201997", "India SaaS", "2x co-investor"],
    circle: [
      { relation: "partner", name: "Sandeep Murthy", detail: "Elevar, GP" },
      { relation: "portfolio", name: "ShipKart team", detail: "Logistics SaaS" },
    ],
    lastInteraction: "Chai at Chaayos \u2014 Jan 15, 2026",
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
    sourceContent: `Hi \u2014 sharing the Tata Steel case study we put together (attached).

Quick ask: we're seeing strong inbound from auto & manufacturing verticals. Mahindra Group is on our target list and I know you have connections there through the CII network. Would you be open to making an intro to someone in their supply chain / digital transformation team?

Our Tata Steel deployment reduced inventory carrying costs by 22% in 6 months. Think the story translates well to auto manufacturing.

Also \u2014 should we start thinking about Series A timing? Metrics are at a place where I'm getting inbound from Accel, Lightspeed, and Nexus.`,
    insight:
      "portfolio support moment \u2014 your Mahindra intro could unlock their next big logo",
    because:
      "he\u2019s your portfolio founder asking for a warm intro \u2014 this is exactly what good investors do",
    and: "he\u2019s getting Series A inbound from top funds \u2014 your active support now cements your value before he has options",
    so: "delivering on the Mahindra intro proves you\u2019re his most valuable board seat, not just his first check",
    actionLabel: "reply",
    actionChannel: "email",
    suggestedText:
      "Great case study. I\u2019ll reach out to Rajesh Jejurikar\u2019s office \u2014 know him from CII meetings. Let me warm it up this week.\n\nOn Series A \u2014 let\u2019s discuss timing over dinner. Free Thursday?",
  },
  {
    id: "s6",
    personId: "priya-venkatesh",
    personName: "Priya Venkatesh",
    source: "linkedin",
    timestamp: "5h ago",
    content:
      "Posted: \u201CKarya Finance crosses \u20B9200Cr disbursed in 10 months\u201D",
    insight: "strong traction from a founder you\u2019re building a relationship with",
    because:
      "Arjun introduced you to Priya last month and you had a great first coffee at Third Wave",
    and: "her milestone post is getting traction \u2014 engaging now shows you\u2019re paying attention",
    so: "showing up for her public wins builds trust early, before every other investor starts circling",
    actionLabel: "comment",
    actionChannel: "linkedin",
    suggestedText:
      "Impressive numbers, Priya. The default rate at that disbursement volume is the real story \u2014 speaks to how well the alternative data scoring works. Excited to see what\u2019s next.",
  },
  {
    id: "s1",
    personId: "arjun-mehta",
    personName: "Arjun Mehta",
    source: "linkedin",
    timestamp: "1d ago",
    content:
      "Posted: \u201CNexaFlow hits $5M ARR \u2014 Tata Steel deal changed everything\u201D",
    insight:
      "portfolio proof point \u00B7 $5M ARR in 18mo \u00B7 validates Fund I thesis",
    because:
      "you led his seed round and this ARR milestone is a key proof point for Fund I returns",
    and: "the first 48 hours of a founder\u2019s milestone post get the most visibility \u2014 your public support matters",
    so: "engaging now reinforces that you\u2019re a hands-on investor, not just a check-writer",
    actionLabel: "comment",
    actionChannel: "linkedin",
    suggestedText:
      "Proud to have backed Arjun & team from day one. The NRR numbers tell the real story \u2014 this is sticky, enterprise-grade PMF. Exciting road ahead.",
  },
  {
    id: "s3",
    personId: "kavya-iyer",
    personName: "Kavya Iyer",
    source: "memory",
    timestamp: "today",
    content: "Back from Davos this week",
    insight: "Good moment to reconnect \u2014 Davos stories are freshest now",
    because:
      "she asked to see Fund I data at your last meeting and you discussed climate supply chain tech",
    and: "she\u2019s just back from Davos \u2014 the first 48 hours are when insights and introductions are top of mind",
    so: "a check-in now naturally reopens the Fund II conversation while she\u2019s energized from Davos",
    actionLabel: "ask how it went",
    actionChannel: "dm",
    suggestedText:
      "Kavya \u2014 hope Davos was good. Would love to hear what you picked up on the India allocation side. Coffee at Taj this week? I also have the Fund I data you\u2019d asked about.",
  },
  {
    id: "s7",
    personId: "priya-venkatesh",
    personName: "Priya Venkatesh",
    source: "quiet",
    timestamp: "today",
    content: "Arjun can connect you to Priya\u2019s NBFC partner at MicroLend",
    insight:
      "warm path \u00B7 deepen the relationship through Arjun\u2019s network",
    because:
      "you\u2019re building a relationship with Priya and Arjun\u2019s company integrates with Karya",
    and: "meeting the people around a founder tells you more than any pitch deck",
    so: "asking Arjun for this intro signals to Priya that you\u2019re doing the work, not just window-shopping",
    actionLabel: "request intro",
    actionChannel: "dm",
    suggestedText:
      "Arjun \u2014 I\u2019m getting to know Priya and Karya Finance better. Could you connect me with Vikram at MicroLend? Would be great to hear their perspective.",
  },
  {
    id: "s5",
    personId: "rajan-anand",
    personName: "Rajan Anand",
    source: "news",
    timestamp: "today",
    content: "Inc42: \u201CElevar Capital leads $30M Series B in ShipKart\u201D",
    insight:
      "logistics-tech is adjacent to your supply chain thesis \u2014 co-invest angle",
    because:
      "you\u2019ve co-invested with Rajan twice before and your supply chain thesis is adjacent to his logistics bet",
    and: "this deal just closed \u2014 he\u2019ll be in a generous mood and open to sharing deal flow",
    so: "congratulating now and flagging the overlap opens the door for co-investment on his next deal",
    actionLabel: "congratulate",
    actionChannel: "dm",
    suggestedText:
      "Rajan \u2014 saw the ShipKart news, congrats. The logistics-supply chain adjacency is interesting \u2014 NexaFlow is seeing similar pull from D2C brands. Chai at Chaayos this week?",
  },
];

// ─────────────────────────────────────────────────────
// Source icon helper
// ─────────────────────────────────────────────────────
function SourceIcon({ source, size = 13 }: { source: string; size?: number }) {
  const c = colors.textMuted;
  const s = size;
  if (source === "email")
    return (
      <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
        <rect
          x="1.5"
          y="3.5"
          width="13"
          height="9"
          rx="1.5"
          stroke={c}
          strokeWidth="1.2"
        />
        <path d="M2 4l6 4.5L14 4" stroke={c} strokeWidth="1.2" fill="none" />
      </svg>
    );
  if (source === "linkedin")
    return (
      <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
        <rect
          x="1"
          y="1"
          width="14"
          height="14"
          rx="2"
          stroke={c}
          strokeWidth="1.2"
        />
        <path d="M5 6.5v4M5 4.5v.01" stroke={c} strokeWidth="1.4" strokeLinecap="round" />
        <path
          d="M8 6.5v4M8 8.5c0-1.1.9-2 2-2s2 .9 2 2v2"
          stroke={c}
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    );
  if (source === "memory")
    return (
      <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6" stroke={c} strokeWidth="1.2" />
        <circle cx="8" cy="8" r="2" fill={c} opacity="0.5" />
      </svg>
    );
  if (source === "news")
    return (
      <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
        <rect
          x="2"
          y="2"
          width="12"
          height="12"
          rx="1.5"
          stroke={c}
          strokeWidth="1.2"
        />
        <line x1="5" y1="5" x2="11" y2="5" stroke={c} strokeWidth="1.2" />
        <line x1="5" y1="8" x2="11" y2="8" stroke={c} strokeWidth="0.8" opacity="0.5" />
        <line
          x1="5"
          y1="10.5"
          x2="9"
          y2="10.5"
          stroke={c}
          strokeWidth="0.8"
          opacity="0.5"
        />
      </svg>
    );
  if (source === "quiet")
    return (
      <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
        <path
          d="M8 2C4.7 2 2 4.7 2 8s2.7 6 6 6c1 0 2-.3 2.8-.7L14 14l-.7-3.2c.4-.8.7-1.8.7-2.8 0-3.3-2.7-6-6-6z"
          stroke={c}
          strokeWidth="1.2"
          fill="none"
        />
        <circle cx="5.5" cy="8" r="0.8" fill={c} opacity="0.5" />
        <circle cx="8" cy="8" r="0.8" fill={c} opacity="0.5" />
        <circle cx="10.5" cy="8" r="0.8" fill={c} opacity="0.5" />
      </svg>
    );
  return (
    <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke={c} strokeWidth="1.2" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────
// Paper grain overlay
// ─────────────────────────────────────────────────────
function PaperGrain({ opacity = 0.035 }: { opacity?: number }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `url("${PAPER_GRAIN_DATA_URL}")`,
        opacity,
        mixBlendMode: "overlay",
      }}
    />
  );
}

// ─────────────────────────────────────────────────────
// DemoSignalInbox (left panel) — enriched 2-line rows
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
    <div
      className="h-full flex flex-col relative overflow-hidden"
      style={{
        background: "linear-gradient(168deg, #f3f5ed 0%, #e7ead9 100%)",
        borderRadius: "3px",
        boxShadow:
          "0 1px 0 rgba(255,255,255,0.7) inset, 0 2px 4px rgba(0,0,0,0.04), 0 8px 16px -8px rgba(0,0,0,0.1)",
      }}
    >
      <PaperGrain />
      <div className="relative z-10 h-full p-4 flex flex-col">
        {/* Header */}
        <div className="flex items-baseline justify-between mb-2">
          <span
            style={{
              fontSize: "11px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "rgba(35,45,30,0.5)",
              fontFamily: fonts.mono,
              fontWeight: 600,
            }}
          >
            For You
          </span>
          <span
            style={{
              fontSize: "9px",
              color: colors.textFaint,
              fontFamily: fonts.mono,
            }}
          >
            {signals.length} signals
          </span>
        </div>

        {/* Divider */}
        <div
          className="h-px mb-2"
          style={{
            background:
              "linear-gradient(90deg, rgba(60,70,50,0.15) 0%, transparent 100%)",
          }}
        />

        {/* Signal list — 2-line rows */}
        <div className="flex-1 overflow-hidden min-h-0">
          {signals.map((signal) => {
            const isSelected = signal.id === selectedId;
            const accentColor = sourceAccentColors[signal.source] || colors.textMuted;
            return (
              <div
                key={signal.id}
                onClick={() => onSelect(signal.id)}
                className="cursor-pointer transition-all duration-200"
                style={{
                  padding: "8px 6px 8px 0",
                  backgroundColor: isSelected
                    ? colors.selectedBg
                    : "transparent",
                  borderBottom: `1px solid ${colors.borderSubtle}`,
                  opacity: selectedId && !isSelected ? 0.6 : 1,
                  transition: "all 0.3s ease",
                  display: "flex",
                  gap: "8px",
                }}
              >
                {/* Left accent bar */}
                <div
                  style={{
                    width: "2.5px",
                    flexShrink: 0,
                    borderRadius: "1px",
                    backgroundColor: isSelected ? accentColor : "transparent",
                    transition: "background-color 0.3s ease",
                  }}
                />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Row 1: source icon + name + preview + time */}
                  <div className="flex items-center gap-2">
                    {/* Follow-up mark */}
                    {signal.isFollowUp && (
                      <div
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          border: `1.5px solid ${colors.accentGreen}`,
                          flexShrink: 0,
                        }}
                      />
                    )}
                    {!signal.isFollowUp && <div style={{ width: 6 }} />}

                    {/* Source icon */}
                    <div className="flex-shrink-0">
                      <SourceIcon source={signal.source} size={13} />
                    </div>

                    {/* Person name */}
                    <span
                      className="flex-shrink-0 truncate"
                      style={{
                        width: "100px",
                        fontSize: "12px",
                        color: isSelected ? "rgba(35,40,30,0.92)" : "rgba(35,40,30,0.75)",
                        fontFamily: fonts.mono,
                        fontWeight: isSelected ? 600 : 400,
                      }}
                    >
                      {signal.personName}
                    </span>

                    {/* Content preview */}
                    <span
                      className="truncate flex-1 min-w-0"
                      style={{
                        fontSize: "11px",
                        fontFamily: fonts.mono,
                      }}
                    >
                      {signal.isFollowUp && signal.followUpContext && (
                        <span style={{ color: colors.textMuted }}>
                          re: {signal.followUpContext}
                          <span style={{ margin: "0 3px", opacity: 0.5 }}>
                            &middot;
                          </span>
                        </span>
                      )}
                      <span style={{ color: "rgba(35,40,30,0.45)" }}>
                        {signal.content}
                      </span>
                    </span>

                    {/* Timestamp */}
                    <span
                      className="flex-shrink-0"
                      style={{
                        fontSize: "10px",
                        color: colors.textFaint,
                        fontFamily: fonts.mono,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {signal.timestamp}
                    </span>
                  </div>

                  {/* Row 2: insight preview */}
                  <div
                    className="truncate"
                    style={{
                      marginTop: "3px",
                      marginLeft: "28px",
                      fontSize: "11px",
                      fontFamily: fonts.serif,
                      fontStyle: "italic",
                      color: isSelected ? "rgba(80,100,60,0.7)" : "rgba(80,50,30,0.3)",
                      transition: "color 0.3s ease",
                    }}
                  >
                    {signal.insight}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div
          className="mt-2 pt-2 flex items-center justify-between"
          style={{
            borderTop: `1px solid ${colors.borderSubtle}`,
          }}
        >
          <span
            style={{
              fontSize: "9px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: colors.textFaint,
              fontFamily: fonts.mono,
            }}
          >
            sorted by priority
          </span>
          <span
            style={{
              fontSize: "9px",
              color: colors.textFaint,
              fontFamily: fonts.serif,
              fontStyle: "italic",
            }}
          >
            {new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────
// DemoSignalDetail (center panel) — action-forward
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
  return (
    <div
      className="h-full flex flex-col relative overflow-hidden"
      style={{
        background: "linear-gradient(168deg, #f3f5ed 0%, #e7ead9 100%)",
        borderRadius: "3px",
        boxShadow:
          "0 1px 0 rgba(255,255,255,0.7) inset, 0 2px 6px rgba(0,0,0,0.06), 0 12px 24px -8px rgba(0,0,0,0.12)",
      }}
    >
      <PaperGrain />
      <div className="relative z-10 p-6 flex flex-col h-full overflow-hidden">
        {/* Source stamp — quieter */}
        <div className="mb-3">
          <span
            style={{
              fontSize: "10px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: colors.textFaint,
              fontFamily: fonts.mono,
            }}
          >
            {signal.source} &middot; {signal.timestamp}
          </span>
        </div>

        {/* Insight headline — hero text */}
        <h3
          style={{
            fontSize: "24px",
            lineHeight: "1.3",
            color: colors.textPrimary,
            fontFamily: fonts.serif,
            fontWeight: 400,
            margin: "0 0 28px 0",
          }}
        >
          {signal.insight}
        </h3>

        {/* Reasoning: inline BECAUSE / AND / SO */}
        <div
          style={{
            paddingLeft: "14px",
            borderLeft: `2px solid ${colors.border}`,
          }}
        >
          <div style={{ marginBottom: "14px" }}>
            <span
              style={{
                fontSize: "10px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: colors.textMuted,
                fontFamily: fonts.mono,
                fontWeight: 600,
                marginRight: "8px",
              }}
            >
              because
            </span>
            <span
              style={{
                fontSize: "14px",
                lineHeight: "1.55",
                color: colors.textSecondary,
                fontFamily: fonts.serif,
                fontStyle: "italic",
              }}
            >
              {signal.because}
            </span>
          </div>
          <div style={{ marginBottom: "14px" }}>
            <span
              style={{
                fontSize: "10px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: colors.textMuted,
                fontFamily: fonts.mono,
                fontWeight: 600,
                marginRight: "8px",
              }}
            >
              and
            </span>
            <span
              style={{
                fontSize: "14px",
                lineHeight: "1.55",
                color: colors.textSecondary,
                fontFamily: fonts.serif,
                fontStyle: "italic",
              }}
            >
              {signal.and}
            </span>
          </div>
          <div>
            <span
              style={{
                fontSize: "10px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: colors.textMuted,
                fontFamily: fonts.mono,
                fontWeight: 600,
                marginRight: "8px",
              }}
            >
              so
            </span>
            <span
              style={{
                fontSize: "14px",
                lineHeight: "1.55",
                color: colors.textSecondary,
                fontFamily: fonts.serif,
                fontStyle: "italic",
              }}
            >
              {signal.so}
            </span>
          </div>
        </div>

        {/* Flexible space between reasoning and action */}
        <div className="flex-1" />

        {/* ACTION — elevated, card-within-card feel */}
        <div
          style={{
            padding: "16px",
            background: "rgba(255,255,255,0.35)",
            border: `1px solid ${colors.border}`,
            borderRadius: "3px",
          }}
        >
          {/* Action label */}
          <div className="flex items-center gap-2 mb-3">
            <span
              style={{
                fontSize: "10px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: colors.accentGreenStrong,
                fontFamily: fonts.mono,
                fontWeight: 600,
              }}
            >
              suggested {signal.actionChannel}
            </span>
            <div
              className="flex-1 h-px"
              style={{
                background: `linear-gradient(90deg, ${colors.accentGreen} 0%, transparent 100%)`,
              }}
            />
          </div>

          {/* Suggested text — styled like a draft message */}
          <div
            style={{
              padding: "12px 14px",
              marginBottom: "14px",
              background: "rgba(255,255,255,0.4)",
              borderLeft: `2.5px solid ${colors.accentGreen}`,
              borderRadius: "0 2px 2px 0",
            }}
          >
            <p
              style={{
                fontSize: "14px",
                lineHeight: "1.6",
                color: colors.textPrimary,
                fontFamily: fonts.serif,
                margin: 0,
                whiteSpace: "pre-wrap",
              }}
            >
              {signal.suggestedText}
            </p>
          </div>

          {/* Send button + refine — integrated row */}
          <div className="flex items-center gap-3">
            <button
              onClick={onSend}
              disabled={sendState !== "idle"}
              className="cursor-pointer border-none"
              style={{
                padding: "8px 22px",
                fontSize: "13px",
                fontFamily: fonts.mono,
                fontWeight: 600,
                letterSpacing: "0.04em",
                color:
                  sendState === "sent"
                    ? colors.accentGreenStrong
                    : sendState === "sending"
                      ? colors.textMuted
                      : "rgba(255,255,255,0.95)",
                background:
                  sendState === "idle"
                    ? "rgba(55,70,45,0.75)"
                    : sendState === "sending"
                      ? "rgba(80,100,60,0.12)"
                      : "rgba(80,100,60,0.08)",
                borderRadius: "2px",
                transition: "all 0.25s ease",
              }}
            >
              {sendState === "idle"
                ? `${signal.actionLabel} \u2192`
                : sendState === "sending"
                  ? "sending\u2026"
                  : "sent \u2713"}
            </button>

            {/* Refine input — inline with action */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="refine: make shorter, add context\u2026"
                className="w-full outline-none"
                style={{
                  padding: "7px 10px",
                  fontSize: "11.5px",
                  fontFamily: fonts.mono,
                  color: colors.textSecondary,
                  background: "rgba(255,255,255,0.3)",
                  border: `1px solid ${colors.borderSubtle}`,
                  borderRadius: "2px",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────
// DemoRolodexCard (right panel) — restructured
// ─────────────────────────────────────────────────────
function DemoRolodexCard({ profile }: { profile: DemoProfile }) {
  const proximityLabel =
    profile.proximity === "close"
      ? "close"
      : profile.proximity === "known"
        ? "known"
        : "new";
  const proximityColor =
    profile.proximity === "close"
      ? "rgba(180,160,60,0.7)"
      : profile.proximity === "known"
        ? "rgba(180,160,60,0.4)"
        : "rgba(180,160,60,0.2)";

  return (
    <div
      className="h-full flex flex-col relative overflow-hidden"
      style={{
        background: "linear-gradient(168deg, #f5ebe3 0%, #e8ddd1 100%)",
        borderRadius: "3px",
        boxShadow:
          "0 1px 0 rgba(255,255,255,0.7) inset, 0 2px 4px rgba(0,0,0,0.04), 0 8px 16px -8px rgba(0,0,0,0.1)",
      }}
    >
      <PaperGrain />

      {/* Punch hole */}
      <div
        className="absolute z-20"
        style={{
          top: "12px",
          left: "12px",
          width: "12px",
          height: "12px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 40% 35%, rgba(255,255,255,0.5) 0%, rgba(0,0,0,0.08) 60%, rgba(0,0,0,0.15) 100%)",
          boxShadow:
            "0 0 0 0.5px rgba(0,0,0,0.12) inset, 0 1px 2px rgba(0,0,0,0.06)",
        }}
      />

      {/* Proximity mark with label */}
      <div
        className="absolute z-20 flex items-center gap-1.5"
        style={{
          top: "13px",
          right: "14px",
        }}
      >
        <span
          style={{
            fontSize: "9px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: colors.textFaint,
            fontFamily: fonts.mono,
          }}
        >
          {proximityLabel}
        </span>
        <div
          style={{
            width: "7px",
            height: "7px",
            borderRadius: "50%",
            backgroundColor: proximityColor,
            boxShadow: `0 0 4px ${proximityColor}`,
          }}
        />
      </div>

      <div className="relative z-10 p-4 pt-7 flex flex-col h-full overflow-hidden">
        {/* Name */}
        <h3
          style={{
            fontSize: "16px",
            color: colors.textPrimary,
            fontFamily: fonts.serif,
            fontWeight: 400,
            margin: "0 0 2px 0",
            letterSpacing: "0.01em",
          }}
        >
          {profile.name}
        </h3>

        {/* Role */}
        <span
          style={{
            fontSize: "11px",
            color: colors.textSecondary,
            fontFamily: fonts.mono,
            display: "block",
            marginBottom: "6px",
          }}
        >
          {profile.role}
        </span>

        {/* Traits tags */}
        {profile.traits && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {profile.traits.map((trait) => (
              <span
                key={trait}
                style={{
                  fontSize: "9px",
                  letterSpacing: "0.04em",
                  color: colors.textSecondary,
                  fontFamily: fonts.mono,
                  padding: "2px 6px",
                  border: `1px solid ${colors.border}`,
                  borderRadius: "1px",
                }}
              >
                {trait}
              </span>
            ))}
          </div>
        )}

        <div
          className="h-px mb-3"
          style={{
            background:
              "linear-gradient(90deg, rgba(60,70,50,0.12) 0%, transparent 100%)",
          }}
        />

        {/* ALIGNMENT — promoted, highlighted */}
        <div
          style={{
            padding: "7px 9px",
            marginBottom: "10px",
            background: "rgba(80,100,60,0.03)",
            border: `1px solid rgba(80,100,60,0.1)`,
            borderRadius: "2px",
          }}
        >
          <span
            style={{
              fontSize: "9px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: colors.accentGreen,
              fontFamily: fonts.mono,
              display: "block",
              marginBottom: "3px",
            }}
          >
            why they matter
          </span>
          <p
            style={{
              fontSize: "11.5px",
              lineHeight: "1.5",
              color: colors.textSecondary,
              fontFamily: fonts.serif,
              fontStyle: "italic",
              margin: 0,
            }}
          >
            {profile.alignment}
          </p>
        </div>

        {/* KNOWN FOR */}
        <div className="mb-3">
          <span
            style={{
              fontSize: "9px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: colors.textMuted,
              fontFamily: fonts.mono,
            }}
          >
            known for
          </span>
          <p
            style={{
              fontSize: "11px",
              lineHeight: "1.5",
              color: colors.textSecondary,
              fontFamily: fonts.mono,
              margin: "3px 0 0",
            }}
          >
            {profile.knownFor}
          </p>
        </div>

        {/* MET */}
        <div
          className="mb-3"
          style={{
            padding: "6px 8px",
            background: "rgba(120,80,40,0.025)",
            borderRadius: "2px",
          }}
        >
          <span
            style={{
              fontSize: "9px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: colors.textMuted,
              fontFamily: fonts.mono,
            }}
          >
            met
          </span>
          <p
            style={{
              fontSize: "11px",
              lineHeight: "1.45",
              color: colors.textSecondary,
              fontFamily: fonts.serif,
              fontStyle: "italic",
              margin: "2px 0 0",
            }}
          >
            {profile.metAt}
          </p>
        </div>

        {/* REMEMBER — personal notes */}
        {profile.remember && profile.remember.length > 0 && (
          <div className="mb-3">
            <span
              style={{
                fontSize: "9px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: colors.textMuted,
                fontFamily: fonts.mono,
              }}
            >
              remember
            </span>
            <div style={{ marginTop: "3px" }}>
              {profile.remember.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-1.5"
                  style={{ marginBottom: i < profile.remember!.length - 1 ? "2px" : 0 }}
                >
                  <span
                    style={{
                      width: "3px",
                      height: "3px",
                      borderRadius: "50%",
                      background: colors.textMuted,
                      flexShrink: 0,
                      marginTop: "5px",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "10.5px",
                      lineHeight: "1.4",
                      color: colors.textSecondary,
                      fontFamily: fonts.serif,
                      fontStyle: "italic",
                    }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CIRCLE — key people in their network */}
        {profile.circle && profile.circle.length > 0 && (
          <div className="mb-3">
            <span
              style={{
                fontSize: "9px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: colors.textMuted,
                fontFamily: fonts.mono,
              }}
            >
              circle
            </span>
            <div style={{ marginTop: "3px" }}>
              {profile.circle.map((person, i) => (
                <div
                  key={i}
                  className="flex items-baseline gap-1.5"
                  style={{ marginBottom: i < profile.circle!.length - 1 ? "2px" : 0 }}
                >
                  <span
                    style={{
                      fontSize: "10.5px",
                      color: colors.textSecondary,
                      fontFamily: fonts.mono,
                    }}
                  >
                    {person.name}
                  </span>
                  <span
                    style={{
                      fontSize: "9px",
                      color: colors.textMuted,
                      fontFamily: fonts.serif,
                      fontStyle: "italic",
                    }}
                  >
                    {person.relation}{person.detail ? ` \u00B7 ${person.detail}` : ""}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CONTACT */}
        <div
          className="mt-auto pt-2"
          style={{ borderTop: `1px solid ${colors.border}` }}
        >
          <span
            style={{
              fontSize: "11px",
              color: colors.textSecondary,
              fontFamily: fonts.mono,
              display: "block",
            }}
          >
            {profile.email}
          </span>
          {profile.lastInteraction && (
            <span
              style={{
                fontSize: "9.5px",
                color: colors.textMuted,
                fontFamily: fonts.serif,
                fontStyle: "italic",
                display: "block",
                marginTop: "2px",
              }}
            >
              Last: {profile.lastInteraction}
            </span>
          )}
          <div className="flex items-center justify-between mt-2">
            <span
              style={{
                fontSize: "8px",
                letterSpacing: "0.1em",
                color: colors.textFaint,
                fontFamily: fonts.mono,
              }}
            >
              {profile.refId}
            </span>
            <span
              style={{
                fontSize: "8px",
                letterSpacing: "0.1em",
                color: colors.textFaint,
                fontFamily: fonts.mono,
                textTransform: "uppercase",
              }}
            >
              private
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────
// DemoMockup — main 3-panel UI
// ─────────────────────────────────────────────────────
export default function DemoMockup() {
  const [selectedId, setSelectedId] = useState("s2");
  const [sendState, setSendState] = useState<"idle" | "sending" | "sent">(
    "idle"
  );

  const selectedSignal =
    DEMO_SIGNALS.find((s) => s.id === selectedId) || DEMO_SIGNALS[0];
  const selectedProfile =
    DEMO_PROFILES[selectedSignal.personId] ||
    DEMO_PROFILES["arjun-mehta"];

  const handleSelect = useCallback(
    (id: string) => {
      setSelectedId(id);
      setSendState("idle");
    },
    []
  );

  const handleSend = useCallback(() => {
    setSendState("sending");
    setTimeout(() => setSendState("sent"), 1200);
    setTimeout(() => setSendState("idle"), 3000);
  }, []);

  return (
    <div
      className="demo-no-scrollbar"
      style={{
        display: "flex",
        alignItems: "stretch",
        gap: "18px",
        height: "100%",
      }}
    >
      {/* Left: Signal Inbox */}
      <div style={{ flex: "0.77 1 0", minWidth: 0, height: "100%" }}>
        <DemoSignalInbox
          signals={DEMO_SIGNALS}
          selectedId={selectedId}
          onSelect={handleSelect}
        />
      </div>

      {/* Center: Signal Detail — dominant */}
      <div style={{ flex: "1.18 1 0", minWidth: 0, height: "100%" }}>
        <DemoSignalDetail
          signal={selectedSignal}
          sendState={sendState}
          onSend={handleSend}
        />
      </div>

      {/* Right: Rolodex Card */}
      <div style={{ flex: "0.85 1 0", minWidth: 0, height: "100%" }}>
        <DemoRolodexCard profile={selectedProfile} />
      </div>
    </div>
  );
}
