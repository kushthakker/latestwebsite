// File: src/app/components/SourceMapping.tsx
"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { fonts } from "../lib/fonts";

export default function SourceMapping() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Left text entrance
  const textOpacity = useTransform(scrollYProgress, [0.04, 0.14], [0, 1]);
  const textY = useTransform(scrollYProgress, [0.04, 0.14], [40, 0]);

  // Right image entrance
  const imgOpacity = useTransform(scrollYProgress, [0.08, 0.2], [0, 1]);
  const imgScale = useTransform(scrollYProgress, [0.08, 0.2], [0.94, 1]);

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
        {/* White background with subtle warm radials for depth */}
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
              "radial-gradient(ellipse 60% 50% at 65% 50%, rgba(200,190,175,0.08), transparent)",
          }}
        />

        {/* Content Container */}
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
              paddingLeft: "clamp(48px, 8vw, 120px)",
              paddingRight: "clamp(24px, 3vw, 48px)",
            }}
          >
            <motion.div style={{ opacity: textOpacity, y: textY }}>
              <h2
                style={{
                  fontFamily: fonts.serif,
                  fontSize: "clamp(2rem, 3.2vw, 2.8rem)",
                  lineHeight: 1.25,
                  fontWeight: 500,
                  letterSpacing: "-0.03em",
                  color: "#1d1d1f",
                  margin: 0,
                }}
              >
                brace maps everyone you know
              </h2>
              <p
                style={{
                  fontFamily: fonts.serif,
                  fontSize: "clamp(1.05rem, 1.6vw, 1.25rem)",
                  lineHeight: 1.6,
                  color: "#86868b",
                  margin: "24px 0 0 0",
                  fontStyle: "italic",
                }}
              >
                by proximity, momentum,
                <br />
                and intent.
              </p>

              {/* Premium gradient accent line */}
              <motion.div
                style={{
                  width: 64,
                  height: 1,
                  marginTop: 32,
                  background:
                    "linear-gradient(90deg, rgba(29,29,31,0.2), transparent)",
                  opacity: useTransform(scrollYProgress, [0.1, 0.2], [0, 1]),
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
              paddingRight: "clamp(24px, 6vw, 80px)",
            }}
          >
            <motion.img
              src="/source-brain.png"
              alt="Sources connecting to Brace intelligence"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              style={{
                width: "100%",
                maxWidth: 720,
                height: "auto",
                opacity: imgOpacity,
                scale: imgScale,
                mixBlendMode: "multiply",
                filter: "drop-shadow(0 24px 48px rgba(0,0,0,0.06))",
              }}
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
