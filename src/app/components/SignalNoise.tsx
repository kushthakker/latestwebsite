"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// ─────────────────────────────────────────────────────
// Noise card data — realistic digital clutter
// ─────────────────────────────────────────────────────

interface NoiseCard {
  id: string;
  type: string;
  content: React.ReactNode;
  x: string;
  y: string;
  rotation: number;
  width: string;
  enterAt: number;
  z: number;
}

// ─────────────────────────────────────────────────────
// Card components
// ─────────────────────────────────────────────────────

const cardBase = {
  background: "#fff",
  boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.04)",
  border: "1px solid rgba(0,0,0,0.06)",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  width: "100%",
} as const;

function LinkedInCard({ name, text }: { name: string; text: string }) {
  return (
    <div style={{ ...cardBase, borderRadius: 12, padding: "16px 18px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #0a66c2 0%, #004182 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          {name[0]}
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#191919" }}>{name}</div>
          <div style={{ fontSize: 11, color: "#666", marginTop: 1 }}>2nd &middot; 3h</div>
        </div>
        <div style={{ marginLeft: "auto", fontSize: 10, fontWeight: 600, color: "#0a66c2" }}>
          in
        </div>
      </div>
      <div style={{ fontSize: 12.5, lineHeight: 1.5, color: "#333" }}>{text}</div>
      <div
        style={{
          display: "flex",
          gap: 16,
          marginTop: 12,
          paddingTop: 10,
          borderTop: "1px solid rgba(0,0,0,0.06)",
          fontSize: 11,
          color: "#666",
        }}
      >
        <span>Like</span>
        <span>Comment</span>
        <span>Repost</span>
      </div>
    </div>
  );
}

function TweetCard({ handle, text, likes }: { handle: string; text: string; likes: string }) {
  return (
    <div style={{ ...cardBase, borderRadius: 14, padding: "14px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #1d1d1f 0%, #333 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          {handle[1]?.toUpperCase()}
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#0f1419" }}>{handle}</div>
        <div style={{ marginLeft: "auto", fontSize: 13, fontWeight: 700, color: "#536471" }}>
          𝕏
        </div>
      </div>
      <div style={{ fontSize: 13, lineHeight: 1.45, color: "#0f1419" }}>{text}</div>
      <div style={{ display: "flex", gap: 20, marginTop: 10, fontSize: 11, color: "#536471" }}>
        <span>3 replies</span>
        <span>12 reposts</span>
        <span>{likes} likes</span>
      </div>
    </div>
  );
}

function WhatsAppCard({ group, sender, text }: { group: string; sender: string; text: string }) {
  return (
    <div style={{ ...cardBase, borderRadius: 12, padding: "12px 14px" }}>
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: "#128C7E",
          marginBottom: 6,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span style={{ fontSize: 13 }}>WhatsApp</span>
        <span style={{ color: "#999", fontWeight: 400, fontSize: 10 }}>&middot; {group}</span>
      </div>
      <div
        style={{
          background: "#dcf8c6",
          borderRadius: 8,
          padding: "8px 12px",
          fontSize: 12.5,
          lineHeight: 1.45,
          color: "#111",
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 600, color: "#128C7E", marginBottom: 3 }}>
          {sender}
        </div>
        {text}
        <div style={{ fontSize: 10, color: "#999", textAlign: "right", marginTop: 4 }}>
          11:42 AM
        </div>
      </div>
    </div>
  );
}

function LinearCard({
  id,
  title,
  status,
  priority,
}: {
  id: string;
  title: string;
  status: string;
  priority: "urgent" | "high" | "medium";
}) {
  const priorityColors = { urgent: "#e53e3e", high: "#dd6b20", medium: "#d69e2e" };
  const statusColors: Record<string, string> = {
    "In Progress": "#3182ce",
    Todo: "#718096",
    "In Review": "#805ad5",
  };
  return (
    <div style={{ ...cardBase, borderRadius: 10, padding: "12px 14px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: 3,
            background: "linear-gradient(135deg, #5e6ad2, #4852c9)",
          }}
        />
        <span style={{ fontSize: 11, color: "#666", fontFamily: "monospace" }}>{id}</span>
        <span
          style={{
            marginLeft: "auto",
            fontSize: 10,
            fontWeight: 600,
            color: priorityColors[priority],
            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}
        >
          {priority}
        </span>
      </div>
      <div style={{ fontSize: 13, fontWeight: 500, color: "#1a1a1a", lineHeight: 1.35 }}>
        {title}
      </div>
      <div
        style={{
          marginTop: 8,
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          fontSize: 10.5,
          color: statusColors[status] || "#718096",
          fontWeight: 500,
        }}
      >
        <div
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: statusColors[status] || "#718096",
          }}
        />
        {status}
      </div>
    </div>
  );
}

function SlackCard({ channel, sender, text }: { channel: string; sender: string; text: string }) {
  return (
    <div style={{ ...cardBase, borderRadius: 10, padding: "12px 14px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 8,
          fontSize: 11,
          fontWeight: 600,
        }}
      >
        <span style={{ color: "#e01e5a", fontSize: 14 }}>#</span>
        <span style={{ color: "#1d1c1d" }}>{channel}</span>
        <span style={{ color: "#999", fontWeight: 400, marginLeft: "auto", fontSize: 10 }}>
          2m ago
        </span>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            background: "linear-gradient(135deg, #36c5f0, #2eb67d)",
            flexShrink: 0,
          }}
        />
        <div>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#1d1c1d" }}>{sender}</span>
          <div style={{ fontSize: 12.5, color: "#1d1c1d", lineHeight: 1.4, marginTop: 2 }}>
            {text}
          </div>
        </div>
      </div>
    </div>
  );
}

function EmailCard({ from, subject }: { from: string; subject: string }) {
  return (
    <div style={{ ...cardBase, borderRadius: 10, padding: "12px 14px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #ea4335, #fbbc04)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          {from[0]}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#202124" }}>{from}</div>
          <div
            style={{
              fontSize: 12,
              color: "#5f6368",
              marginTop: 2,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {subject}
          </div>
        </div>
        <div style={{ fontSize: 10, color: "#999", flexShrink: 0 }}>9:14 AM</div>
      </div>
    </div>
  );
}

function NewsCard({ source, headline }: { source: string; headline: string }) {
  return (
    <div style={{ ...cardBase, borderRadius: 10, padding: "12px 14px" }}>
      <div
        style={{
          fontSize: 10,
          fontWeight: 600,
          color: "#e53e3e",
          marginBottom: 4,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}
      >
        {source} &middot; Breaking
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a", lineHeight: 1.35 }}>
        {headline}
      </div>
    </div>
  );
}

function SubstackCard({
  author,
  title,
  preview,
}: {
  author: string;
  title: string;
  preview: string;
}) {
  return (
    <div style={{ ...cardBase, borderRadius: 12, padding: "14px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #ff6719, #ff8a50)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          S
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#191919" }}>{author}</div>
          <div style={{ fontSize: 10, color: "#999" }}>on Substack</div>
        </div>
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color: "#191919", lineHeight: 1.3, marginBottom: 6 }}>
        {title}
      </div>
      <div style={{ fontSize: 12, color: "#666", lineHeight: 1.45 }}>{preview}</div>
      <div
        style={{
          marginTop: 10,
          paddingTop: 8,
          borderTop: "1px solid rgba(0,0,0,0.06)",
          fontSize: 11,
          color: "#ff6719",
          fontWeight: 500,
        }}
      >
        Read more
      </div>
    </div>
  );
}

function BraceSignalCard({
  person,
  signal,
  source,
}: {
  person: string;
  signal: string;
  source: string;
}) {
  const sourceIcons: Record<string, string> = {
    email: "e",
    linkedin: "in",
    memory: "m",
    news: "n",
  };
  const sourceColors: Record<string, string> = {
    email: "rgba(180,120,60,0.7)",
    linkedin: "rgba(100,120,140,0.65)",
    memory: "rgba(160,140,60,0.7)",
    news: "rgba(120,100,80,0.6)",
  };
  return (
    <div
      style={{
        background: "rgba(252,250,245,0.97)",
        borderRadius: 10,
        padding: "12px 14px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 6px 20px rgba(0,0,0,0.03)",
        border: "1px solid rgba(80,100,60,0.12)",
        fontFamily: "'Georgia', 'Times New Roman', serif",
        width: "100%",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: "50%",
            background: sourceColors[source] || "#999",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: 9,
            fontWeight: 600,
            letterSpacing: "0.02em",
          }}
        >
          {sourceIcons[source] || "?"}
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(35,25,15,0.88)" }}>
          {person}
        </div>
        <div style={{ fontSize: 10, color: "rgba(80,50,30,0.4)", marginLeft: "auto" }}>3h ago</div>
      </div>
      <div
        style={{
          fontSize: 12.5,
          lineHeight: 1.45,
          color: "rgba(35,25,15,0.72)",
        }}
      >
        {signal}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────
// All the noise cards with their positions
// ─────────────────────────────────────────────────────

// Loose grid: cards spaced ~22% apart in x, ~20% apart in y
// Original card widths preserved. Early waves well-spaced, later waves crowd center.

const noiseCards: NoiseCard[] = [
  // ── Wave 1 — four corners, maximum spacing ──
  {
    id: "li1",
    type: "linkedin",
    content: (
      <LinkedInCard
        name="Marcus Reed"
        text="Thrilled to announce I've accepted a position as Chief Synergy Officer at VaporScale AI. After 6 transformative months of self-discovery..."
      />
    ),
    x: "-4%",
    y: "2%",
    rotation: -3,
    width: "270px",
    enterAt: 0.14,
    z: 10,
  },
  {
    id: "tw1",
    type: "tweet",
    content: (
      <TweetCard
        handle="@cryptoguru99"
        text="just mass-applied to 47 jobs using AI. hustle culture is dead, automation culture is king"
        likes="2.1k"
      />
    ),
    x: "76%",
    y: "0%",
    rotation: 2.5,
    width: "255px",
    enterAt: 0.16,
    z: 11,
  },
  {
    id: "ss1",
    type: "substack",
    content: (
      <SubstackCard
        author="The Generalist"
        title="Why Every Company Will Be an AI Company by 2028"
        preview="The shift isn't gradual. It's a phase transition. Here's what the data shows..."
      />
    ),
    x: "72%",
    y: "74%",
    rotation: -1.5,
    width: "260px",
    enterAt: 0.18,
    z: 12,
  },
  {
    id: "brace1",
    type: "signal",
    content: (
      <BraceSignalCard
        person="Arjun Mehta"
        signal="Sent Tata Steel case study. Wants intro to Mahindra Group supply chain team."
        source="email"
      />
    ),
    x: "-2%",
    y: "76%",
    rotation: 1.2,
    width: "255px",
    enterAt: 0.20,
    z: 13,
  },
  // ── Wave 2 — mid-edges, filling the ring ──
  {
    id: "wa1",
    type: "whatsapp",
    content: (
      <WhatsAppCard
        group="College Batch '14"
        sender="Rahul"
        text="guys check out this meme lol 😂😂 also who's coming for the reunion??"
      />
    ),
    x: "38%",
    y: "75%",
    rotation: 2,
    width: "250px",
    enterAt: 0.22,
    z: 14,
  },
  {
    id: "tw-good1",
    type: "tweet",
    content: (
      <TweetCard
        handle="@packyM"
        text="Most underrated skill in business: the ability to genuinely celebrate other people's wins without making it about yourself"
        likes="14.2k"
      />
    ),
    x: "78%",
    y: "40%",
    rotation: -1.5,
    width: "260px",
    enterAt: 0.24,
    z: 15,
  },
  {
    id: "ln1",
    type: "linear",
    content: (
      <LinearCard
        id="ENG-342"
        title="Migrate auth service to new SSO provider"
        status="In Progress"
        priority="urgent"
      />
    ),
    x: "40%",
    y: "0%",
    rotation: -2,
    width: "250px",
    enterAt: 0.26,
    z: 16,
  },
  // ── Wave 3 — second ring inward ──
  {
    id: "sl1",
    type: "slack",
    content: (
      <SlackCard
        channel="general"
        sender="Sarah K."
        text="@here quick sync in 5? need alignment on the Q3 OKRs before standup"
      />
    ),
    x: "-2%",
    y: "42%",
    rotation: 1.5,
    width: "265px",
    enterAt: 0.28,
    z: 17,
  },
  {
    id: "em1",
    type: "email",
    content: (
      <EmailCard
        from="ProductHunt"
        subject="Your Weekly Digest: 23 new products launched..."
      />
    ),
    x: "22%",
    y: "0%",
    rotation: -1,
    width: "265px",
    enterAt: 0.30,
    z: 18,
  },
  {
    id: "brace2",
    type: "signal",
    content: (
      <BraceSignalCard
        person="Priya Venkatesh"
        signal="Posted: Karya Finance crosses 200Cr disbursed in 10 months. Strong traction."
        source="linkedin"
      />
    ),
    x: "60%",
    y: "22%",
    rotation: -1,
    width: "250px",
    enterAt: 0.32,
    z: 19,
  },
  {
    id: "li2",
    type: "linkedin",
    content: (
      <LinkedInCard
        name="Jessica Liu"
        text="I don't usually post but... I just have to say that LEADERSHIP is not about titles. It's about showing up. Agree? 🙌 #leadership #ceo #founder"
      />
    ),
    x: "78%",
    y: "58%",
    rotation: 1.5,
    width: "265px",
    enterAt: 0.34,
    z: 20,
  },
  // ── Wave 4 — third ring, approaching center ──
  {
    id: "ss2",
    type: "substack",
    content: (
      <SubstackCard
        author="Lenny Rachitsky"
        title="The art of the warm intro (and why most people do it wrong)"
        preview="I asked 50 top VCs what makes a warm intro actually work. The answers surprised me..."
      />
    ),
    x: "20%",
    y: "72%",
    rotation: 2,
    width: "260px",
    enterAt: 0.36,
    z: 21,
  },
  {
    id: "tw2",
    type: "tweet",
    content: (
      <TweetCard
        handle="@aihotttakes"
        text="hot take: if your startup isn't using AI in 2026 you're literally a horse buggy manufacturer"
        likes="847"
      />
    ),
    x: "58%",
    y: "56%",
    rotation: -2.5,
    width: "255px",
    enterAt: 0.38,
    z: 22,
  },
  {
    id: "wa2",
    type: "whatsapp",
    content: (
      <WhatsAppCard
        group="Founders Circle"
        sender="Alex"
        text="anyone know a good accountant? mine just ghosted me mid-tax season 💀"
      />
    ),
    x: "18%",
    y: "22%",
    rotation: -1.5,
    width: "250px",
    enterAt: 0.40,
    z: 23,
  },
  {
    id: "ln2",
    type: "linear",
    content: (
      <LinearCard
        id="DES-189"
        title="Update onboarding flow per new brand guidelines"
        status="Todo"
        priority="high"
      />
    ),
    x: "-2%",
    y: "60%",
    rotation: 2.5,
    width: "245px",
    enterAt: 0.42,
    z: 24,
  },
  {
    id: "brace3",
    type: "signal",
    content: (
      <BraceSignalCard
        person="Kavya Iyer"
        signal="Back from Davos this week. Good moment to reconnect on Fund II."
        source="memory"
      />
    ),
    x: "42%",
    y: "22%",
    rotation: 0.5,
    width: "248px",
    enterAt: 0.44,
    z: 25,
  },
  // ── Wave 5 — center approach ──
  {
    id: "tw-good2",
    type: "tweet",
    content: (
      <TweetCard
        handle="@shl"
        text="the best networkers I know don't network. they just help people. the connections come later, as a side effect."
        likes="28.4k"
      />
    ),
    x: "5%",
    y: "20%",
    rotation: -1.5,
    width: "255px",
    enterAt: 0.46,
    z: 26,
  },
  {
    id: "nw1",
    type: "news",
    content: (
      <NewsCard
        source="TechCrunch"
        headline="Series B funding hits 18-month low as investors pull back"
      />
    ),
    x: "55%",
    y: "74%",
    rotation: -1,
    width: "245px",
    enterAt: 0.48,
    z: 27,
  },
  {
    id: "sl2",
    type: "slack",
    content: (
      <SlackCard
        channel="eng-standup"
        sender="Dev Bot"
        text="Reminder: Daily standup in 10 minutes. Please update your status."
      />
    ),
    x: "60%",
    y: "5%",
    rotation: 1.8,
    width: "260px",
    enterAt: 0.50,
    z: 28,
  },
  {
    id: "ss3",
    type: "substack",
    content: (
      <SubstackCard
        author="Not Boring"
        title="The Network State Is Inevitable"
        preview="Balaji was early. The question isn't if but when. Here's what the last 6 months prove..."
      />
    ),
    x: "18%",
    y: "48%",
    rotation: 1.5,
    width: "255px",
    enterAt: 0.52,
    z: 29,
  },
  {
    id: "em2",
    type: "email",
    content: (
      <EmailCard
        from="Calendly"
        subject="Reminder: You have 3 meetings scheduled tomorrow"
      />
    ),
    x: "40%",
    y: "58%",
    rotation: -2,
    width: "265px",
    enterAt: 0.54,
    z: 30,
  },
  // ── Wave 6 — closing in on center ──
  {
    id: "li3",
    type: "linkedin",
    content: (
      <LinkedInCard
        name="David Chen"
        text="Day 47 of posting every single day on LinkedIn. The algorithm rewards consistency. Here are my 7 tips for building a personal brand..."
      />
    ),
    x: "32%",
    y: "36%",
    rotation: 1,
    width: "265px",
    enterAt: 0.56,
    z: 31,
  },
  {
    id: "brace4",
    type: "signal",
    content: (
      <BraceSignalCard
        person="Rajan Anand"
        signal="Elevar leads $30M Series B in ShipKart. Adjacent to your supply chain thesis."
        source="news"
      />
    ),
    x: "58%",
    y: "40%",
    rotation: -1.5,
    width: "252px",
    enterAt: 0.58,
    z: 32,
  },
  {
    id: "tw3",
    type: "tweet",
    content: (
      <TweetCard
        handle="@startupbro"
        text="I wake up at 4am, cold plunge, 90min deep work block, then I network for 3 hours. No excuses. That's why I'm winning."
        likes="4.2k"
      />
    ),
    x: "15%",
    y: "36%",
    rotation: -1.5,
    width: "258px",
    enterAt: 0.60,
    z: 33,
  },
  {
    id: "wa3",
    type: "whatsapp",
    content: (
      <WhatsAppCard
        group="Family Group"
        sender="Mom"
        text="Beta please call when free. Also forwarding very important health article 🙏"
      />
    ),
    x: "60%",
    y: "38%",
    rotation: 1.5,
    width: "250px",
    enterAt: 0.62,
    z: 34,
  },
  {
    id: "ln3",
    type: "linear",
    content: (
      <LinearCard
        id="OPS-77"
        title="Investigate CI pipeline flakiness on staging"
        status="In Review"
        priority="medium"
      />
    ),
    x: "40%",
    y: "42%",
    rotation: 2,
    width: "250px",
    enterAt: 0.64,
    z: 35,
  },
  {
    id: "li-good1",
    type: "linkedin",
    content: (
      <LinkedInCard
        name="Sarah Tavel"
        text="The best founders I've backed all share one trait: they remember people. Not strategically. Genuinely. That compounds."
      />
    ),
    x: "28%",
    y: "48%",
    rotation: -1.8,
    width: "268px",
    enterAt: 0.66,
    z: 36,
  },
  // ── Wave 7 — final center pile ──
  {
    id: "ss4",
    type: "substack",
    content: (
      <SubstackCard
        author="The Profile"
        title="How to Build a Network That Actually Matters"
        preview="It's not about collecting contacts. It's about the 50 people who would take your call at midnight..."
      />
    ),
    x: "50%",
    y: "44%",
    rotation: -2,
    width: "258px",
    enterAt: 0.68,
    z: 37,
  },
  {
    id: "tw4",
    type: "tweet",
    content: (
      <TweetCard
        handle="@VCstarterpck"
        text="your network is your net worth if you're not sending 20 cold DMs a day you're ngmi"
        likes="1.3k"
      />
    ),
    x: "22%",
    y: "42%",
    rotation: 2.5,
    width: "255px",
    enterAt: 0.70,
    z: 38,
  },
  {
    id: "em3",
    type: "email",
    content: (
      <EmailCard
        from="Notion"
        subject="What's new in Notion: AI blocks, calendar sync, and more"
      />
    ),
    x: "38%",
    y: "50%",
    rotation: -0.8,
    width: "265px",
    enterAt: 0.72,
    z: 39,
  },
  {
    id: "sl3",
    type: "slack",
    content: (
      <SlackCard
        channel="random"
        sender="Mike T."
        text="has anyone tried that new ramen place on 3rd? heard it's great"
      />
    ),
    x: "48%",
    y: "34%",
    rotation: 1,
    width: "255px",
    enterAt: 0.74,
    z: 40,
  },
  {
    id: "brace5",
    type: "signal",
    content: (
      <BraceSignalCard
        person="Arjun Mehta"
        signal="NexaFlow hits $5M ARR. Tata Steel deal changed everything. Series A inbound."
        source="linkedin"
      />
    ),
    x: "35%",
    y: "40%",
    rotation: -0.5,
    width: "252px",
    enterAt: 0.76,
    z: 41,
  },
  // ── Wave 8 — 10 more cards, final flood ──
  {
    id: "tw5",
    type: "tweet",
    content: (
      <TweetCard
        handle="@naval"
        text="specific knowledge is found by pursuing your genuine curiosity and passion rather than whatever is hot right now"
        likes="42.8k"
      />
    ),
    x: "10%",
    y: "52%",
    rotation: 1.2,
    width: "258px",
    enterAt: 0.78,
    z: 42,
  },
  {
    id: "li4",
    type: "linkedin",
    content: (
      <LinkedInCard
        name="Raj Patel"
        text="10 years ago I was rejected from 200 companies. Today I'm a CEO. Never give up. Never stop grinding. The universe rewards persistence. 🚀 #hustle"
      />
    ),
    x: "52%",
    y: "30%",
    rotation: -2,
    width: "262px",
    enterAt: 0.79,
    z: 43,
  },
  {
    id: "em4",
    type: "email",
    content: (
      <EmailCard
        from="Google Workspace"
        subject="Storage almost full — upgrade to Google One"
      />
    ),
    x: "72%",
    y: "18%",
    rotation: 1.5,
    width: "260px",
    enterAt: 0.80,
    z: 44,
  },
  {
    id: "sl4",
    type: "slack",
    content: (
      <SlackCard
        channel="design"
        sender="Priya M."
        text="pushed the new mockups to Figma, can someone review before EOD?"
      />
    ),
    x: "25%",
    y: "30%",
    rotation: -1,
    width: "255px",
    enterAt: 0.81,
    z: 45,
  },
  {
    id: "wa4",
    type: "whatsapp",
    content: (
      <WhatsAppCard
        group="Gym Bros"
        sender="Vikram"
        text="skipping leg day again? 🦵 see you at 6am or I'm sending the screenshot to the group"
      />
    ),
    x: "60%",
    y: "52%",
    rotation: 2,
    width: "248px",
    enterAt: 0.82,
    z: 46,
  },
  {
    id: "ss5",
    type: "substack",
    content: (
      <SubstackCard
        author="Stratechery"
        title="The AI Value Chain Continues to Shift"
        preview="The biggest winners won't be the model makers. It'll be the companies closest to the customer..."
      />
    ),
    x: "5%",
    y: "35%",
    rotation: -1.8,
    width: "255px",
    enterAt: 0.83,
    z: 47,
  },
  {
    id: "ln4",
    type: "linear",
    content: (
      <LinearCard
        id="FE-445"
        title="Fix responsive breakpoints on pricing page"
        status="In Progress"
        priority="medium"
      />
    ),
    x: "45%",
    y: "48%",
    rotation: 1.5,
    width: "245px",
    enterAt: 0.84,
    z: 48,
  },
  {
    id: "nw2",
    type: "news",
    content: (
      <NewsCard
        source="Bloomberg"
        headline="Fed signals potential rate cut as inflation cools to 2.3%"
      />
    ),
    x: "30%",
    y: "56%",
    rotation: -1,
    width: "248px",
    enterAt: 0.85,
    z: 49,
  },
  {
    id: "tw6",
    type: "tweet",
    content: (
      <TweetCard
        handle="@shreyas"
        text="the real networking hack: be genuinely useful to people without keeping score. everything else is noise."
        likes="18.7k"
      />
    ),
    x: "42%",
    y: "36%",
    rotation: 0.8,
    width: "260px",
    enterAt: 0.86,
    z: 50,
  },
  {
    id: "em5",
    type: "email",
    content: (
      <EmailCard
        from="LinkedIn"
        subject="You have 14 new connection requests and 8 new messages"
      />
    ),
    x: "20%",
    y: "44%",
    rotation: -2.2,
    width: "262px",
    enterAt: 0.87,
    z: 51,
  },
];

// ─────────────────────────────────────────────────────
// Animated noise card wrapper
// ─────────────────────────────────────────────────────

function AnimatedNoiseCard({
  card,
  scrollProgress,
}: {
  card: NoiseCard;
  scrollProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const entryEnd = card.enterAt + 0.035;
  const opacity = useTransform(scrollProgress, [card.enterAt, entryEnd], [0, 1]);
  const scale = useTransform(scrollProgress, [card.enterAt, entryEnd], [0.88, 1]);
  const y = useTransform(scrollProgress, [card.enterAt, entryEnd], [24, 0]);

  return (
    <motion.div
      style={{
        position: "absolute",
        left: card.x,
        top: card.y,
        width: card.width,
        rotate: card.rotation,
        zIndex: card.z,
        opacity,
        scale,
        y,
        transformOrigin: "center center",
      }}
    >
      {card.content}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────

export default function SignalNoise() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const headlineOpacity = useTransform(scrollYProgress, [0.02, 0.10], [0, 1]);
  const headlineY = useTransform(scrollYProgress, [0.02, 0.10], [30, 0]);
  const sectionOpacity = useTransform(scrollYProgress, [0.90, 0.98], [1, 0]);

  return (
    <section ref={sectionRef} className="relative" style={{ height: "500vh" }}>
      <motion.div
        className="sticky top-0 h-screen overflow-hidden"
        style={{ opacity: sectionOpacity }}
      >
        {/* White background — seamless with page */}
        <div className="absolute inset-0" style={{ background: "#fff" }} />

        {/* Noise cards fill the viewport */}
        <div className="absolute inset-0 overflow-hidden">
          {noiseCards.map((card) => (
            <AnimatedNoiseCard
              key={card.id}
              card={card}
              scrollProgress={scrollYProgress}
            />
          ))}
        </div>

        {/* Headline text — centered, underneath cards */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{
            opacity: headlineOpacity,
            y: headlineY,
            zIndex: 5,
          }}
        >
          <div style={{ maxWidth: 600, textAlign: "center", padding: "0 32px" }}>
            <h2
              style={{
                fontFamily: "'Georgia', 'Times New Roman', serif",
                fontSize: "clamp(1.6rem, 3.2vw, 2.4rem)",
                lineHeight: 1.25,
                fontWeight: 400,
                letterSpacing: "-0.02em",
                color: "rgba(9,9,11,0.88)",
                margin: 0,
              }}
            >
              every signal above would have gone unnoticed.
            </h2>
            <p
              style={{
                fontFamily: "'Georgia', 'Times New Roman', serif",
                fontSize: "clamp(1rem, 1.8vw, 1.25rem)",
                lineHeight: 1.5,
                color: "rgba(9,9,11,0.5)",
                margin: "16px 0 0 0",
              }}
            >
              that&apos;s dozens of relationships fading,
              <br />
              every month, in silence.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
