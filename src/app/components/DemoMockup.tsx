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
  refId: string;
  proximity: "close" | "known" | "new";
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
    refId: "BRC-AM-0247",
    proximity: "close",
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
    refId: "BRC-RA-0312",
    proximity: "close",
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

const DEMO_GROUPS = [
  { id: "for-you", label: "Truly For You", isSystem: true },
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
  // fallback
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
// Section Heading (BECAUSE / AND / SO / ACTION labels)
// ─────────────────────────────────────────────────────
function SectionLabel({
  label,
  accent,
}: {
  label: string;
  accent?: boolean;
}) {
  const gradientColor = accent ? colors.accentGreen : colors.border;
  return (
    <div className="flex items-center gap-2 mb-1.5">
      <span
        style={{
          color: accent ? colors.accentGreenStrong : colors.textMuted,
          fontFamily: fonts.mono,
          fontWeight: 600,
          fontSize: "10px",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
      <div
        className="flex-1 h-px"
        style={{
          background: `linear-gradient(90deg, ${gradientColor} 0%, transparent 100%)`,
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────
// DemoSignalInbox (left panel)
// ─────────────────────────────────────────────────────
function DemoSignalInbox({
  signals,
  selectedId,
  activeGroupId,
  onSelect,
  onGroupChange,
}: {
  signals: DemoSignal[];
  selectedId: string;
  activeGroupId: string;
  onSelect: (id: string) => void;
  onGroupChange: (id: string) => void;
}) {
  return (
    <div
      className="h-full flex flex-col relative overflow-hidden rounded-md"
      style={{
        background: "linear-gradient(168deg, #f3f5ed 0%, #e7ead9 100%)",
        boxShadow:
          "0 1px 0 rgba(255,255,255,0.7) inset, 0 2px 4px rgba(0,0,0,0.04), 0 8px 16px -8px rgba(0,0,0,0.1)",
      }}
    >
      <PaperGrain />
      <div className="relative z-10 h-full p-4 flex flex-col">
        {/* Group tabs */}
        <div className="flex items-baseline gap-4 mb-2">
          {DEMO_GROUPS.map((g) => {
            const active = g.id === activeGroupId;
            return (
              <button
                key={g.id}
                onClick={() => onGroupChange(g.id)}
                className="cursor-pointer bg-transparent border-none p-0"
                style={{
                  fontSize: active ? "16px" : "11px",
                  color: active
                    ? "rgba(35,45,30,0.9)"
                    : "rgba(60,70,50,0.38)",
                  fontFamily: active ? fonts.serif : fonts.mono,
                  fontStyle: active ? "italic" : "normal",
                  letterSpacing: active ? "0.01em" : "0.04em",
                }}
              >
                {g.label}
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div
          className="h-px mb-2"
          style={{
            background:
              "linear-gradient(90deg, rgba(60,70,50,0.15) 0%, transparent 100%)",
          }}
        />

        {/* Signal list */}
        <div className="flex-1 overflow-hidden min-h-0">
          {signals.map((signal) => {
            const isSelected = signal.id === selectedId;
            return (
              <div
                key={signal.id}
                onClick={() => onSelect(signal.id)}
                className="cursor-pointer transition-all duration-200"
                style={{
                  padding: "7px 4px",
                  backgroundColor: isSelected
                    ? colors.selectedBg
                    : "transparent",
                  borderBottom: `1px solid ${colors.borderSubtle}`,
                  opacity:
                    selectedId && !isSelected ? 0.45 : 1,
                  filter:
                    selectedId && !isSelected
                      ? "blur(0.5px)"
                      : "none",
                  transition: "all 0.3s ease",
                }}
              >
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
                    <SourceIcon source={signal.source} size={14} />
                  </div>

                  {/* Person name */}
                  <span
                    className="flex-shrink-0 truncate"
                    style={{
                      width: "110px",
                      fontSize: "12px",
                      color: "rgba(35,40,30,0.85)",
                      fontFamily: fonts.mono,
                    }}
                  >
                    {signal.personName}
                  </span>

                  {/* Content preview */}
                  <span
                    className="truncate flex-1 min-w-0"
                    style={{
                      fontSize: "12px",
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
                    <span style={{ color: "rgba(35,40,30,0.5)" }}>
                      {signal.content}
                    </span>
                  </span>

                  {/* Timestamp */}
                  <span
                    className="flex-shrink-0"
                    style={{
                      fontSize: "10px",
                      color: colors.textMuted,
                      fontFamily: fonts.mono,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {signal.timestamp}
                  </span>
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
// DemoSignalDetail (center panel)
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
      className="h-full flex flex-col relative overflow-hidden rounded-md"
      style={{
        background: "linear-gradient(168deg, #f3f5ed 0%, #e7ead9 100%)",
        boxShadow:
          "0 1px 0 rgba(255,255,255,0.7) inset, 0 2px 4px rgba(0,0,0,0.04), 0 8px 16px -8px rgba(0,0,0,0.1)",
      }}
    >
      <PaperGrain />
      <div className="relative z-10 p-4 flex flex-col h-full overflow-hidden">
        {/* Source stamp */}
        <div className="mb-3">
          <span
            style={{
              fontSize: "10px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: colors.textMuted,
              fontFamily: fonts.mono,
            }}
          >
            {signal.source.toUpperCase()} &middot;{" "}
            {signal.timestamp.toUpperCase()}
          </span>
        </div>

        {/* Headline */}
        <h3
          style={{
            fontSize: "17px",
            lineHeight: "1.35",
            color: colors.textPrimary,
            fontFamily: fonts.serif,
            fontWeight: 400,
            margin: "0 0 16px 0",
          }}
        >
          {signal.insight}
        </h3>

        {/* Reasoning: BECAUSE / AND / SO */}
        <div className="space-y-3 mb-4">
          <div>
            <SectionLabel label="BECAUSE" />
            <p
              style={{
                fontSize: "12px",
                lineHeight: "1.5",
                color: colors.textSecondary,
                fontFamily: fonts.serif,
                fontStyle: "italic",
                margin: 0,
              }}
            >
              {signal.because}
            </p>
          </div>
          <div>
            <SectionLabel label="AND" />
            <p
              style={{
                fontSize: "12px",
                lineHeight: "1.5",
                color: colors.textSecondary,
                fontFamily: fonts.serif,
                fontStyle: "italic",
                margin: 0,
              }}
            >
              {signal.and}
            </p>
          </div>
          <div>
            <SectionLabel label="SO" />
            <p
              style={{
                fontSize: "12px",
                lineHeight: "1.5",
                color: colors.textSecondary,
                fontFamily: fonts.serif,
                fontStyle: "italic",
                margin: 0,
              }}
            >
              {signal.so}
            </p>
          </div>
        </div>

        {/* ACTION section */}
        <div>
          <SectionLabel label="ACTION" accent />

          {/* Suggested reply */}
          <div
            className="mb-3"
            style={{
              padding: "8px",
              border: `1px solid ${colors.border}`,
              borderRadius: "2px",
              background: "rgba(255,255,255,0.3)",
            }}
          >
            <p
              style={{
                fontSize: "12px",
                lineHeight: "1.55",
                color: colors.textPrimary,
                fontFamily: fonts.serif,
                margin: 0,
                whiteSpace: "pre-wrap",
              }}
            >
              {signal.suggestedText}
            </p>
          </div>

          {/* Send button */}
          <div className="flex items-center justify-between">
            <button
              onClick={onSend}
              disabled={sendState !== "idle"}
              className="cursor-pointer border-none"
              style={{
                padding: "5px 14px",
                fontSize: "11px",
                fontFamily: fonts.mono,
                letterSpacing: "0.06em",
                color:
                  sendState === "sent"
                    ? colors.accentGreenStrong
                    : sendState === "sending"
                      ? colors.textMuted
                      : colors.textPrimary,
                background:
                  sendState === "idle"
                    ? "rgba(80,100,60,0.08)"
                    : "transparent",
                borderRadius: "2px",
                transition: "all 0.2s ease",
              }}
            >
              {sendState === "idle"
                ? `${signal.actionLabel} \u2192`
                : sendState === "sending"
                  ? "sending..."
                  : "sent \u2713"}
            </button>
          </div>

          {/* REFINE */}
          <div className="mt-3">
            <span
              style={{
                fontSize: "9px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: colors.textFaint,
                fontFamily: fonts.mono,
                display: "block",
                marginBottom: "4px",
              }}
            >
              REFINE
            </span>
            <input
              type="text"
              placeholder="make it shorter, add context..."
              className="w-full outline-none"
              style={{
                padding: "5px 8px",
                fontSize: "11px",
                fontFamily: fonts.mono,
                color: colors.textSecondary,
                background: "rgba(255,255,255,0.25)",
                border: `1px solid ${colors.borderSubtle}`,
                borderRadius: "2px",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────
// DemoRolodexCard (right panel)
// ─────────────────────────────────────────────────────
function DemoRolodexCard({ profile }: { profile: DemoProfile }) {
  const proximityColor =
    profile.proximity === "close"
      ? "rgba(180,160,60,0.7)"
      : profile.proximity === "known"
        ? "rgba(180,160,60,0.4)"
        : "rgba(180,160,60,0.2)";

  return (
    <div
      className="h-full flex flex-col relative overflow-hidden rounded-md"
      style={{
        background: "linear-gradient(168deg, #f5ebe3 0%, #e8ddd1 100%)",
        boxShadow:
          "0 1px 0 rgba(255,255,255,0.7) inset, 0 2px 4px rgba(0,0,0,0.04), 0 8px 16px -8px rgba(0,0,0,0.1)",
      }}
    >
      <PaperGrain />

      {/* Punch hole */}
      <div
        className="absolute z-20"
        style={{
          top: "10px",
          left: "10px",
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 40% 35%, rgba(255,255,255,0.5) 0%, rgba(0,0,0,0.08) 60%, rgba(0,0,0,0.15) 100%)",
          boxShadow:
            "0 0 0 0.5px rgba(0,0,0,0.12) inset, 0 1px 2px rgba(0,0,0,0.06)",
        }}
      />

      {/* Proximity mark */}
      <div
        className="absolute z-20"
        style={{
          top: "12px",
          right: "12px",
          width: "7px",
          height: "7px",
          borderRadius: "50%",
          backgroundColor: proximityColor,
          boxShadow: `0 0 4px ${proximityColor}`,
        }}
      />

      <div className="relative z-10 p-4 pt-6 flex flex-col h-full overflow-hidden">
        {/* Name */}
        <h3
          style={{
            fontSize: "16px",
            color: colors.textPrimary,
            fontFamily: fonts.mono,
            fontWeight: 500,
            margin: "0 0 4px 0",
          }}
        >
          {profile.name}
        </h3>
        <div
          className="h-px mb-3"
          style={{
            background:
              "linear-gradient(90deg, rgba(60,70,50,0.15) 0%, transparent 100%)",
          }}
        />

        {/* DOES */}
        <div className="mb-3">
          <span
            style={{
              fontSize: "10px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: colors.textMuted,
              fontFamily: fonts.mono,
              fontWeight: 600,
            }}
          >
            DOES
          </span>
          <p
            style={{
              fontSize: "12px",
              lineHeight: "1.45",
              color: colors.textSecondary,
              fontFamily: fonts.mono,
              margin: "3px 0 0",
            }}
          >
            {profile.role}
          </p>
        </div>

        {/* MET */}
        <div className="mb-3">
          <span
            style={{
              fontSize: "10px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: colors.textMuted,
              fontFamily: fonts.mono,
              fontWeight: 600,
            }}
          >
            MET
          </span>
          <p
            style={{
              fontSize: "12px",
              lineHeight: "1.45",
              color: colors.textSecondary,
              fontFamily: fonts.serif,
              fontStyle: "italic",
              margin: "3px 0 0",
            }}
          >
            {profile.metAt}
          </p>
        </div>

        {/* KNOWN FOR */}
        <div className="mb-3">
          <span
            style={{
              fontSize: "10px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: colors.textMuted,
              fontFamily: fonts.mono,
              fontWeight: 600,
            }}
          >
            KNOWN FOR
          </span>
          <p
            style={{
              fontSize: "12px",
              lineHeight: "1.45",
              color: colors.textPrimary,
              fontFamily: fonts.mono,
              fontWeight: 500,
              margin: "3px 0 0",
            }}
          >
            {profile.knownFor}
          </p>
        </div>

        {/* ALIGNMENT */}
        <div
          className="mb-3"
          style={{
            padding: "6px 8px",
            border: `1px solid ${colors.border}`,
            borderRadius: "2px",
          }}
        >
          <span
            style={{
              fontSize: "10px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: colors.textMuted,
              fontFamily: fonts.mono,
              fontWeight: 600,
              display: "block",
              marginBottom: "3px",
            }}
          >
            ALIGNMENT
          </span>
          <p
            style={{
              fontSize: "12px",
              lineHeight: "1.45",
              color: colors.textSecondary,
              fontFamily: fonts.serif,
              fontStyle: "italic",
              margin: 0,
            }}
          >
            {profile.alignment}
          </p>
        </div>

        {/* CONTACT */}
        <div className="mb-3">
          <span
            style={{
              fontSize: "10px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: colors.textMuted,
              fontFamily: fonts.mono,
              fontWeight: 600,
              display: "block",
              marginBottom: "3px",
            }}
          >
            CONTACT
          </span>
          <span
            style={{
              fontSize: "11px",
              color: colors.textSecondary,
              fontFamily: fonts.mono,
            }}
          >
            {profile.email}
          </span>
        </div>

        {/* Ref ID footer */}
        <div
          className="pt-2 flex items-center justify-between"
          style={{ borderTop: `1px solid ${colors.borderSubtle}` }}
        >
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
  );
}

// ─────────────────────────────────────────────────────
// DemoMockup — main 3-panel UI
// ─────────────────────────────────────────────────────
export default function DemoMockup() {
  const [selectedId, setSelectedId] = useState("s2");
  const [activeGroupId, setActiveGroupId] = useState("for-you");
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
        gap: "14px",
        height: "100%",
      }}
    >
      {/* Left: Signal Inbox */}
      <div style={{ flex: "0.8 1 0", minWidth: 0, height: "100%" }}>
        <DemoSignalInbox
          signals={DEMO_SIGNALS}
          selectedId={selectedId}
          activeGroupId={activeGroupId}
          onSelect={handleSelect}
          onGroupChange={setActiveGroupId}
        />
      </div>

      {/* Center: Signal Detail */}
      <div style={{ flex: "1.2 1 0", minWidth: 0, height: "100%" }}>
        <DemoSignalDetail
          signal={selectedSignal}
          sendState={sendState}
          onSend={handleSend}
        />
      </div>

      {/* Right: Rolodex Card */}
      <div style={{ flex: "0.85 1 0", minWidth: 0, height: "100%", display: "flex", justifyContent: "center" }}>
        <div style={{ width: "100%", height: "100%" }}>
          <DemoRolodexCard profile={selectedProfile} />
        </div>
      </div>
    </div>
  );
}

