// File: src/app/components/TextHighlightSection.tsx
"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  type MotionValue,
} from "framer-motion";

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
  const y = useTransform(progress, [start, end], [12, 0]);

  // Premium unblur reveal
  const blurValue = useTransform(progress, [start, end], [8, 0]);
  const filter = useMotionTemplate`blur(${blurValue}px)`;

  return (
    <motion.span
      style={{
        opacity,
        y,
        filter,
        display: "inline-block",
        willChange: "transform, opacity, filter",
      }}
    >
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
  const opacity = useTransform(progress, [start, end], [0.15, 1]);
  const y = useTransform(progress, [start, end], [8, 0]);

  const blurValue = useTransform(progress, [start, end], [4, 0]);
  const filter = useMotionTemplate`blur(${blurValue}px)`;

  return (
    <motion.p
      style={{
        opacity,
        y,
        filter,
        margin: 0,
        willChange: "transform, opacity, filter",
        ...style,
      }}
    >
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
        <div style={{ maxWidth: "680px", padding: "0 24px", width: "100%" }}>
          {/* Heading: "relationships don't break. they fade." */}
          <h2
            style={{
              fontSize: "clamp(2.4rem, 5vw, 3.8rem)",
              lineHeight: 1.12,
              fontWeight: 400,
              letterSpacing: "-0.035em",
              color: "#1d1d1f",
              fontFamily: "ui-serif, 'Georgia', 'Times New Roman', serif",
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
              <FadeWord progress={scrollYProgress} start={0.1} end={0.14}>
                break.
              </FadeWord>
            </span>
            <span style={{ display: "block", marginTop: "0.15em" }}>
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
              marginTop: "56px",
              fontFamily: "ui-serif, 'Georgia', 'Times New Roman', serif",
              fontSize: "clamp(1.1rem, 1.5vw, 1.3rem)",
              lineHeight: 1.8,
              color: "#86868b",
            }}
          >
            <FadeLine progress={scrollYProgress} start={0.3} end={0.35}>
              you meet someone and it clicks.
            </FadeLine>
            <FadeLine progress={scrollYProgress} start={0.35} end={0.4}>
              a founder who&apos;s building something adjacent.
            </FadeLine>
            <FadeLine progress={scrollYProgress} start={0.4} end={0.45}>
              an investor who gets your thesis.
            </FadeLine>
            <FadeLine progress={scrollYProgress} start={0.45} end={0.5}>
              a senior operator who&apos;d be perfect for the role
              <br className="hidden sm:block" />
              you&apos;re about to open.
            </FadeLine>

            <div style={{ height: "2em" }} />

            <FadeLine progress={scrollYProgress} start={0.54} end={0.59}>
              you mean to follow up. then the quarter happens.
            </FadeLine>

            <div style={{ height: "2em" }} />

            <FadeLine progress={scrollYProgress} start={0.65} end={0.7}>
              three months later, someone else closed the deal.
            </FadeLine>
            <FadeLine progress={scrollYProgress} start={0.72} end={0.77}>
              not because they were better.
            </FadeLine>
            <FadeLine
              progress={scrollYProgress}
              start={0.8}
              end={0.85}
              style={{ fontWeight: 500, color: "#1d1d1f" }}
            >
              because they stayed close.
            </FadeLine>
          </div>
        </div>
      </div>
    </section>
  );
}
