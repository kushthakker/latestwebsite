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

  // Payoff line — fades in later with a gentle rise
  const payoffOpacity = useTransform(scrollYProgress, [0.35, 0.50, 0.55, 0.85], [0, 1, 1, 0]);
  const payoffY = useTransform(scrollYProgress, [0.35, 0.50, 0.55, 0.85], [16, 0, 0, -20]);

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
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-white px-5 sm:min-h-0 sm:h-[60vh] sm:px-6"
    >
      <motion.div
        className="max-w-[32rem] text-center sm:max-w-[40rem]"
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

        <p className="text-[clamp(1.05rem,1.6vw,1.3rem)] leading-relaxed text-zinc-500 font-normal tracking-tight">
          Soon every AI agent will send a thousand perfect cold emails.{" "}
          <br className="hidden sm:block" />
          When everyone can outreach at scale, the only thing that still opens doors{" "}
          <br className="hidden sm:block" />
          is someone who actually knows you.
        </p>
        <motion.p
          className="mt-6 text-[clamp(1.15rem,2vw,1.45rem)] leading-relaxed text-zinc-500 font-normal tracking-tight"
          style={{ opacity: payoffOpacity, y: payoffY }}
        >
          <strong>So we built something that remembers for you.</strong>
        </motion.p>
      </motion.div>
    </div>
  );
}
