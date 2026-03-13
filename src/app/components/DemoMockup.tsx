"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
// Helpers & Icons
// ─────────────────────────────────────────────────────

function SourceIcon({
  source,
  className = "",
}: {
  source: string;
  className?: string;
}) {
  const baseClasses = "text-zinc-500 w-4 h-4 " + className;
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
    <div className="flex flex-col h-full bg-white rounded-2xl border border-black/5 shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden">
      <div className="px-5 py-4 border-b border-black/5 flex items-center justify-between bg-zinc-50/50">
        <span className="text-[11px] font-mono tracking-widest text-zinc-400 uppercase font-medium">
          For You
        </span>
        <span className="text-[11px] font-mono text-zinc-400">
          {signals.length} signals
        </span>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 p-2 space-y-1">
        {signals.map((signal) => {
          const isSelected = signal.id === selectedId;
          return (
            <motion.div
              key={signal.id}
              onClick={() => onSelect(signal.id)}
              whileHover={{ scale: 0.99 }}
              whileTap={{ scale: 0.98 }}
              className={`relative cursor-pointer rounded-xl p-3 transition-colors duration-200 flex gap-3 ${
                isSelected ? "bg-zinc-100/80 shadow-sm" : "hover:bg-zinc-50"
              }`}
            >
              {isSelected && (
                <motion.div
                  layoutId="active-indicator"
                  className="absolute left-0 top-3 bottom-3 w-[3px] bg-black rounded-r-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}

              <div className="flex-shrink-0 pt-0.5">
                <SourceIcon
                  source={signal.source}
                  className={isSelected ? "text-black" : "text-zinc-400"}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-sm font-medium truncate ${isSelected ? "text-black" : "text-zinc-700"}`}
                  >
                    {signal.personName}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono whitespace-nowrap ml-2">
                    {signal.timestamp}
                  </span>
                </div>

                <p className="text-xs text-zinc-500 line-clamp-1 pr-2 mb-1">
                  {signal.isFollowUp && (
                    <span className="text-blue-500 font-medium mr-1">re:</span>
                  )}
                  {signal.content}
                </p>

                <p
                  className={`text-xs italic line-clamp-1 pr-2 ${isSelected ? "text-zinc-600" : "text-zinc-400"}`}
                >
                  {signal.insight}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
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
  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-black/5 shadow-[0_8px_32px_rgba(0,0,0,0.03)] overflow-hidden relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={signal.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="flex-1 flex flex-col h-full overflow-hidden"
        >
          {/* Header */}
          <div className="px-8 py-6 border-b border-black/5 bg-zinc-50/30">
            <div className="flex items-center gap-2 mb-3">
              <span className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-100 rounded-md text-[10px] font-mono tracking-wider text-zinc-500 uppercase">
                <SourceIcon source={signal.source} className="w-3 h-3" />
                {signal.source}
              </span>
              <span className="text-[10px] font-mono text-zinc-400">
                {signal.timestamp}
              </span>
            </div>
            <h2 className="text-[22px] leading-snug font-medium tracking-tight text-zinc-900">
              {signal.insight}
            </h2>
          </div>

          {/* Reasoning Chain */}
          <div className="flex-1 overflow-y-auto px-8 py-8">
            <div className="relative pl-4 border-l-2 border-zinc-100 space-y-6">
              {[
                { label: "because", text: signal.because },
                { label: "and", text: signal.and },
                { label: "so", text: signal.so, isFinal: true },
              ].map((step, i) => (
                <div key={i} className="relative">
                  <div
                    className={`absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white ${step.isFinal ? "bg-black" : "bg-zinc-300"}`}
                  />
                  <span className="block text-[10px] font-mono uppercase tracking-widest text-zinc-400 mb-1.5">
                    {step.label}
                  </span>
                  <p className="text-sm leading-relaxed text-zinc-600">
                    {step.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-6 bg-[#FAFAFA] border-t border-black/5">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
                Suggested {signal.actionChannel}
              </span>
            </div>

            <div className="bg-white border border-black/5 rounded-xl p-4 shadow-sm mb-4 relative overflow-hidden group">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-black/10 group-hover:bg-black/20 transition-colors" />
              <p className="text-sm text-zinc-800 leading-relaxed whitespace-pre-wrap font-sans">
                {signal.suggestedText}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onSend}
                disabled={sendState !== "idle"}
                className={`
                  relative overflow-hidden flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300
                  ${sendState === "idle" ? "bg-black text-white hover:bg-zinc-800 shadow-md hover:shadow-lg hover:-translate-y-0.5" : ""}
                  ${sendState === "sending" ? "bg-zinc-100 text-zinc-400 cursor-not-allowed" : ""}
                  ${sendState === "sent" ? "bg-emerald-500 text-white shadow-md" : ""}
                `}
              >
                <span className="block relative z-10 capitalize">
                  {sendState === "idle"
                    ? signal.actionLabel
                    : sendState === "sending"
                      ? "Sending..."
                      : "Sent"}
                </span>
                {sendState === "idle" && (
                  <svg
                    className="w-4 h-4 relative z-10"
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
                    className="w-4 h-4 relative z-10"
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
              </button>

              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Refine: make it shorter, add context..."
                  className="w-full bg-white border border-black/5 rounded-full px-5 py-2.5 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black/10 transition-all shadow-sm"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function DemoRolodexCard({ profile }: { profile: DemoProfile }) {
  const proximityColors = {
    close: "bg-emerald-100 text-emerald-700 border-emerald-200",
    known: "bg-blue-100 text-blue-700 border-blue-200",
    new: "bg-zinc-100 text-zinc-600 border-zinc-200",
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-black/5 shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden">
      {/* Header Profile Area */}
      <div className="px-6 py-6 border-b border-black/5 bg-zinc-50/50 relative">
        <div className="absolute top-6 right-6 flex items-center gap-2">
          <span
            className={`px-2.5 py-0.5 rounded-full border text-[10px] font-mono uppercase tracking-wider ${proximityColors[profile.proximity]}`}
          >
            {profile.proximity}
          </span>
        </div>

        <div className="w-12 h-12 bg-gradient-to-br from-zinc-200 to-zinc-300 rounded-full flex items-center justify-center text-zinc-500 font-medium text-lg mb-4 shadow-sm border border-white">
          {profile.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </div>

        <h3 className="text-xl font-medium tracking-tight text-zinc-900 mb-1">
          {profile.name}
        </h3>
        <p className="text-sm text-zinc-500">{profile.role}</p>

        {profile.traits && (
          <div className="flex flex-wrap gap-2 mt-4">
            {profile.traits.map((trait) => (
              <span
                key={trait}
                className="px-2 py-1 bg-white border border-black/5 rounded-md text-[10px] font-mono text-zinc-500 shadow-sm"
              >
                {trait}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Alignment - Premium Dark Mode Highlight */}
        <div className="bg-zinc-900 rounded-xl p-4 shadow-md text-white">
          <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase block mb-2">
            Why They Matter
          </span>
          <p className="text-sm leading-relaxed text-zinc-200">
            {profile.alignment}
          </p>
        </div>

        {/* Info Blocks */}
        <div className="space-y-4">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase block mb-1">
              Known For
            </span>
            <p className="text-sm text-zinc-700 leading-relaxed">
              {profile.knownFor}
            </p>
          </div>

          <div className="p-3 bg-zinc-50 rounded-xl border border-black/5">
            <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase block mb-1">
              Met
            </span>
            <p className="text-sm text-zinc-700 italic">{profile.metAt}</p>
          </div>

          {profile.remember && profile.remember.length > 0 && (
            <div>
              <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase block mb-2">
                Remember
              </span>
              <ul className="space-y-2">
                {profile.remember.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-zinc-600"
                  >
                    <span className="block w-1 h-1 rounded-full bg-zinc-300 mt-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {profile.circle && profile.circle.length > 0 && (
            <div>
              <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase block mb-2">
                Circle
              </span>
              <div className="space-y-2">
                {profile.circle.map((person, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 hover:bg-zinc-50 rounded-lg transition-colors border border-transparent hover:border-black/5"
                  >
                    <span className="text-sm text-zinc-800 font-medium">
                      {person.name}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400 text-right">
                      {person.relation} {person.detail && `· ${person.detail}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Contact */}
      <div className="px-6 py-4 bg-zinc-50/50 border-t border-black/5 mt-auto">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-mono text-zinc-600">
            {profile.email}
          </span>
          {profile.phone && (
            <span className="text-xs font-mono text-zinc-600">
              {profile.phone}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest">
            {profile.refId}
          </span>
          {profile.lastInteraction && (
            <span className="text-[10px] text-zinc-400 italic">
              Last: {profile.lastInteraction}
            </span>
          )}
        </div>
      </div>
    </div>
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
    DEMO_SIGNALS.find((s) => s.id === selectedId) || DEMO_SIGNALS[0];
  const selectedProfile =
    DEMO_PROFILES[selectedSignal.personId] || DEMO_PROFILES["arjun-mehta"];

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
    <div className="demo-no-scrollbar w-full h-full flex items-stretch gap-4 p-4 bg-[#F7F7F8] rounded-[24px] border border-black/5 shadow-inner">
      <div className="w-[30%] min-w-0 h-full">
        <DemoSignalInbox
          signals={DEMO_SIGNALS}
          selectedId={selectedId}
          onSelect={handleSelect}
        />
      </div>

      <div className="w-[45%] min-w-0 h-full">
        <DemoSignalDetail
          signal={selectedSignal}
          sendState={sendState}
          onSend={handleSend}
        />
      </div>

      <div className="w-[25%] min-w-0 h-full">
        <DemoRolodexCard profile={selectedProfile} />
      </div>
    </div>
  );
}
