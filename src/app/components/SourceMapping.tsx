"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function SourceMapping() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Left text
  const textOpacity = useTransform(scrollYProgress, [0.04, 0.14], [0, 1]);
  const textY = useTransform(scrollYProgress, [0.04, 0.14], [40, 0]);

  // Right image
  const imgOpacity = useTransform(scrollYProgress, [0.08, 0.20], [0, 1]);
  const imgScale = useTransform(scrollYProgress, [0.08, 0.20], [0.92, 1]);

  // Section exit
  const sectionOpacity = useTransform(scrollYProgress, [0.84, 0.96], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: "300vh", background: "#fff" }}
    >
      <motion.div
        className="sticky top-0 h-screen overflow-hidden"
        style={{ opacity: sectionOpacity }}
      >
        {/* White background with subtle warm radials */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "#fff",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 60% 50% at 65% 50%, rgba(200,190,175,0.06), transparent)",
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            height: "100%",
            display: "flex",
            alignItems: "center",
            zIndex: 2,
          }}
        >
          {/* ── Left panel — 35% ── */}
          <div
            style={{
              width: "35%",
              paddingLeft: "clamp(40px, 6vw, 96px)",
              paddingRight: "clamp(24px, 3vw, 48px)",
            }}
          >
            <motion.div style={{ opacity: textOpacity, y: textY }}>
              <h2
                style={{
                  fontFamily: "'Georgia', 'Times New Roman', serif",
                  fontSize: "clamp(1.5rem, 2.6vw, 2.3rem)",
                  lineHeight: 1.3,
                  fontWeight: 400,
                  letterSpacing: "-0.02em",
                  color: "rgba(9,9,11,0.88)",
                  margin: 0,
                }}
              >
                brace maps everyone you know
              </h2>
              <p
                style={{
                  fontFamily: "'Georgia', 'Times New Roman', serif",
                  fontSize: "clamp(0.95rem, 1.5vw, 1.15rem)",
                  lineHeight: 1.65,
                  color: "rgba(9,9,11,0.4)",
                  margin: "20px 0 0 0",
                }}
              >
                by proximity, momentum,
                <br />
                and intent.
              </p>

              {/* Subtle accent line */}
              <motion.div
                style={{
                  width: 40,
                  height: 1,
                  marginTop: 28,
                  background:
                    "linear-gradient(90deg, rgba(9,9,11,0.15), transparent)",
                  opacity: useTransform(
                    scrollYProgress,
                    [0.10, 0.20],
                    [0, 1]
                  ),
                }}
              />
            </motion.div>
          </div>

          {/* ── Right panel — 65% ── */}
          <div
            style={{
              width: "65%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              paddingRight: "clamp(24px, 4vw, 64px)",
            }}
          >
            <motion.img
              src="/source-brain.png"
              alt="Sources connecting to Brace intelligence"
              style={{
                width: "100%",
                maxWidth: 700,
                height: "auto",
                opacity: imgOpacity,
                scale: imgScale,
                mixBlendMode: "screen",
              }}
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
