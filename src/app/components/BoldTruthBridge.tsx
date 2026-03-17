"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function BoldTruthBridge() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Fade in as the bridge scrolls into the viewport, fade out as it leaves
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.55, 0.85],
    [0, 1, 1, 0],
  );
  const y = useTransform(scrollYProgress, [0, 0.3, 0.55, 0.85], [30, 0, 0, -20]);

  // Subtle line that draws in
  const lineScale = useTransform(scrollYProgress, [0.1, 0.45], [0, 1]);
  const lineOpacity = useTransform(
    scrollYProgress,
    [0.1, 0.35, 0.6, 0.85],
    [0, 0.3, 0.3, 0],
  );

  return (
    <div
      ref={ref}
      className="relative flex items-center justify-center bg-white px-5"
      style={{ height: "60vh" }}
    >
      <motion.div
        className="max-w-[40rem] text-center"
        style={{ opacity, y }}
      >
        {/* Decorative line above */}
        <motion.div
          className="mx-auto mb-8 h-px w-16 bg-gradient-to-r from-transparent via-zinc-300 to-transparent"
          style={{
            scaleX: lineScale,
            opacity: lineOpacity,
          }}
        />

        <p className="text-[clamp(1.15rem,2vw,1.45rem)] leading-relaxed text-zinc-400 font-normal tracking-tight">
          So we built something that remembers for you.
        </p>
      </motion.div>
    </div>
  );
}
