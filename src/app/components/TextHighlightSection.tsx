"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

function FadeWord({
  children,
  progress,
  start,
  end,
}: {
  children: React.ReactNode;
  progress: MotionValue<number>;
  start: number;
  end: number;
}) {
  const opacity = useTransform(progress, [start, end], [0.08, 1]);
  const y = useTransform(progress, [start, end], [8, 0]);
  return (
    <motion.span style={{ opacity, y, display: "inline-block" }}>
      {children}
    </motion.span>
  );
}

function FadeLine({
  children,
  progress,
  start,
  end,
  style,
}: {
  children: React.ReactNode;
  progress: MotionValue<number>;
  start: number;
  end: number;
  style?: React.CSSProperties;
}) {
  const opacity = useTransform(progress, [start, end], [0.08, 1]);
  const y = useTransform(progress, [start, end], [5, 0]);
  return (
    <motion.p style={{ opacity, y, margin: 0, ...style }}>
      {children}
    </motion.p>
  );
}

export default function TextHighlightSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  return (
    <section ref={sectionRef} className="relative" style={{ height: "350vh" }}>
      <div className="sticky top-0 h-screen flex items-center justify-center">
        <div style={{ maxWidth: "640px", padding: "0 24px", width: "100%" }}>
          {/* Heading: "relationships don't break. they fade." */}
          <h2
            style={{
              fontSize: "clamp(2.1rem, 4.5vw, 3.4rem)",
              lineHeight: 1.15,
              fontWeight: 400,
              letterSpacing: "-0.025em",
              color: "rgba(9,9,11,0.9)",
              fontFamily: "'Georgia', 'Times New Roman', serif",
              margin: 0,
            }}
          >
            <span style={{ display: "block" }}>
              <FadeWord progress={scrollYProgress} start={0.04} end={0.08}>
                relationships
              </FadeWord>{" "}
              <FadeWord progress={scrollYProgress} start={0.07} end={0.11}>
                don&apos;t
              </FadeWord>{" "}
              <FadeWord progress={scrollYProgress} start={0.10} end={0.14}>
                break.
              </FadeWord>
            </span>
            <span style={{ display: "block", marginTop: "0.1em" }}>
              <FadeWord progress={scrollYProgress} start={0.19} end={0.23}>
                they
              </FadeWord>{" "}
              <FadeWord progress={scrollYProgress} start={0.22} end={0.26}>
                fade.
              </FadeWord>
            </span>
          </h2>

          {/* Body copy */}
          <div
            style={{
              marginTop: "48px",
              fontFamily: "'Georgia', 'Times New Roman', serif",
              fontSize: "clamp(1rem, 1.35vw, 1.15rem)",
              lineHeight: 1.85,
              color: "rgba(9,9,11,0.82)",
            }}
          >
            <FadeLine progress={scrollYProgress} start={0.30} end={0.35}>
              you meet someone and it clicks.
            </FadeLine>
            <FadeLine progress={scrollYProgress} start={0.35} end={0.40}>
              a founder who&apos;s building something adjacent.
            </FadeLine>
            <FadeLine progress={scrollYProgress} start={0.40} end={0.45}>
              an investor who gets your thesis.
            </FadeLine>
            <FadeLine progress={scrollYProgress} start={0.45} end={0.50}>
              a senior operator who&apos;d be perfect for the role
              you&apos;re about to open.
            </FadeLine>

            <div style={{ height: "1.5em" }} />

            <FadeLine progress={scrollYProgress} start={0.54} end={0.59}>
              you mean to follow up. then the quarter happens.
            </FadeLine>

            <div style={{ height: "1.5em" }} />

            <FadeLine progress={scrollYProgress} start={0.65} end={0.70}>
              three months later, someone else closed the deal.
            </FadeLine>
            <FadeLine progress={scrollYProgress} start={0.72} end={0.77}>
              not because they were better.
            </FadeLine>
            <FadeLine
              progress={scrollYProgress}
              start={0.80}
              end={0.85}
              style={{ fontWeight: 500 }}
            >
              because they stayed close.
            </FadeLine>
          </div>
        </div>
      </div>
    </section>
  );
}
