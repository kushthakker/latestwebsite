"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { fonts } from "../lib/fonts";

interface Row {
  label: string;
  everyoneElse: { value: string; sub: string };
  theOnePercent: { value: string; sub: string };
}

const rows: Row[] = [
  {
    label: "response rate",
    everyoneElse: { value: "4%", sub: "cold outreach" },
    theOnePercent: { value: "85%", sub: "warm intro" },
  },
  {
    label: "where it starts",
    everyoneElse: { value: "hope for inbound", sub: "" },
    theOnePercent: { value: "84%", sub: "begin with a referral" },
  },
  {
    label: "speed to yes",
    everyoneElse: { value: "39 days", sub: "" },
    theOnePercent: { value: "21 days", sub: "" },
  },
  {
    label: "they stay",
    everyoneElse: { value: "33%", sub: "retention" },
    theOnePercent: { value: "46%", sub: "relationship-sourced" },
  },
];

function TableRow({
  row,
  index,
  scrollYProgress,
}: {
  row: Row;
  index: number;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const enterStart = 0.15 + index * 0.06;
  const enterEnd = enterStart + 0.06;

  const opacity = useTransform(scrollYProgress, [enterStart, enterEnd], [0, 1]);
  const y = useTransform(scrollYProgress, [enterStart, enterEnd], [30, 0]);

  return (
    <motion.tr style={{ opacity, y }}>
      <td
        style={{
          fontFamily: fonts.serif,
          padding: "28px 32px",
          fontSize: "clamp(16px, 1.4vw, 20px)",
          fontWeight: 600,
          color: "#3d3d3d",
          fontStyle: "italic",
          verticalAlign: "middle",
          width: "25%",
          borderBottom: index < rows.length - 1 ? "1px solid rgba(0,0,0,0.06)" : "none",
        }}
      >
        {row.label}
      </td>
      <td
        style={{
          padding: "28px 32px",
          verticalAlign: "middle",
          width: "40%",
          borderBottom: index < rows.length - 1 ? "1px solid rgba(0,0,0,0.06)" : "none",
        }}
      >
        <div
          style={{
            fontFamily: fonts.serif,
            fontSize: "clamp(24px, 2.5vw, 36px)",
            fontWeight: 400,
            color: "#888",
            fontStyle: "italic",
            lineHeight: 1.2,
          }}
        >
          {row.everyoneElse.value}
        </div>
        {row.everyoneElse.sub && (
          <div
            style={{
              fontFamily: fonts.serif,
              fontSize: "clamp(12px, 1vw, 15px)",
              color: "#aaa",
              fontStyle: "italic",
              marginTop: 4,
            }}
          >
            {row.everyoneElse.sub}
          </div>
        )}
      </td>
      <td
        style={{
          padding: "28px 32px",
          verticalAlign: "middle",
          width: "35%",
          borderBottom: index < rows.length - 1 ? "1px solid rgba(0,0,0,0.06)" : "none",
        }}
      >
        <div
          style={{
            fontFamily: fonts.serif,
            fontSize: "clamp(28px, 3vw, 42px)",
            fontWeight: 700,
            color: "#b8860b",
            fontStyle: "italic",
            lineHeight: 1.2,
          }}
        >
          {row.theOnePercent.value}
        </div>
        {row.theOnePercent.sub && (
          <div
            style={{
              fontFamily: fonts.serif,
              fontSize: "clamp(12px, 1vw, 15px)",
              color: "#c4975a",
              fontStyle: "italic",
              marginTop: 4,
            }}
          >
            {row.theOnePercent.sub}
          </div>
        )}
      </td>
    </motion.tr>
  );
}

export default function ComparisonTable() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Title animations
  const titleOpacity = useTransform(scrollYProgress, [0.05, 0.15], [0, 1]);
  const titleY = useTransform(scrollYProgress, [0.05, 0.15], [40, 0]);

  // Quote animation
  const quoteOpacity = useTransform(scrollYProgress, [0.12, 0.22], [0, 1]);
  const quoteY = useTransform(scrollYProgress, [0.12, 0.22], [30, 0]);

  // Table container
  const tableOpacity = useTransform(scrollYProgress, [0.18, 0.25], [0, 1]);

  // Exit
  const sectionOpacity = useTransform(scrollYProgress, [0.85, 0.95], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{
        minHeight: "120vh",
        padding: "4vh 0 16vh",
        background: "#fff",
      }}
    >
      <motion.div
        style={{ opacity: sectionOpacity }}
        className="max-w-[960px] mx-auto px-6"
      >
        {/* Title */}
        <motion.div
          style={{ opacity: titleOpacity, y: titleY }}
          className="text-center mb-4"
        >
          <h2
            style={{
              fontFamily: fonts.serif,
              fontSize: "clamp(2rem, 3.8vw, 3rem)",
              fontWeight: 700,
              color: "#2d2d2d",
              fontStyle: "italic",
              letterSpacing: "-0.01em",
              lineHeight: 1.2,
            }}
          >
            the proof
          </h2>
        </motion.div>

        {/* Quote */}
        <motion.p
          style={{
            opacity: quoteOpacity,
            y: quoteY,
            fontFamily: fonts.serif,
            fontSize: "clamp(1.1rem, 2vw, 1.5rem)",
            fontStyle: "italic",
            color: "#555",
            textAlign: "center",
            marginBottom: "clamp(32px, 5vw, 56px)",
          }}
        >
          &ldquo;the numbers aren&rsquo;t subtle.&rdquo;
        </motion.p>

        {/* Table card */}
        <motion.div
          style={{
            opacity: tableOpacity,
            background: "#fafaf8",
            borderRadius: 20,
            border: "1px solid rgba(0,0,0,0.06)",
            boxShadow: "0 4px 40px -8px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.03)",
            overflow: "hidden",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              tableLayout: "fixed",
            }}
          >
            <thead>
              <tr>
                <th style={{ width: "25%", padding: "24px 32px" }} />
                <th
                  style={{
                    width: "40%",
                    padding: "24px 32px",
                    textAlign: "left",
                    fontFamily: fonts.serif,
                    fontSize: "clamp(14px, 1.3vw, 18px)",
                    fontWeight: 400,
                    fontStyle: "italic",
                    color: "#999",
                    borderBottom: "1px solid rgba(0,0,0,0.06)",
                  }}
                >
                  everyone else
                </th>
                <th
                  style={{
                    width: "35%",
                    padding: "24px 32px",
                    textAlign: "left",
                    fontFamily: fonts.serif,
                    fontSize: "clamp(14px, 1.3vw, 18px)",
                    fontWeight: 600,
                    fontStyle: "italic",
                    color: "#b8860b",
                    borderBottom: "1px solid rgba(0,0,0,0.06)",
                  }}
                >
                  with brace
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <TableRow
                  key={row.label}
                  row={row}
                  index={i}
                  scrollYProgress={scrollYProgress}
                />
              ))}
            </tbody>
          </table>
        </motion.div>
      </motion.div>
    </section>
  );
}
