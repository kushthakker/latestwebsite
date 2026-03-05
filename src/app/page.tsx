"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import DemoMockup from "./components/DemoMockup";

function GrainOverlay() {
  return (
    <svg className="pointer-events-none fixed inset-0 z-40 h-full w-full opacity-[0.035]">
      <filter id="grain">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.8"
          numOctaves="4"
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain)" />
    </svg>
  );
}

function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Headline fades out early
  const headlineOpacity = useTransform(scrollYProgress, [0.03, 0.18], [1, 0]);
  const headlineY = useTransform(scrollYProgress, [0.03, 0.18], [0, -60]);

  // Demo: grows and lifts to vertical center, then holds
  const demoWidth = useTransform(scrollYProgress, [0.08, 0.32], ["80%", "94%"]);
  const demoHeight = useTransform(scrollYProgress, [0.08, 0.32], ["25vh", "78vh"]);
  // Lift from bottom to center: (100vh - 78vh) / 2 = 11vh upward
  const demoY = useTransform(scrollYProgress, [0.08, 0.32], ["0vh", "-11vh"]);

  return (
    <section ref={sectionRef} className="relative" style={{ height: "350vh" }}>
      {/* Background — fixed */}
      <div className="pointer-events-none fixed inset-0 bg-white z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_30%,rgba(200,190,175,0.08),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_70%,rgba(200,190,175,0.05),transparent)]" />
      </div>

      {/* Sticky container — stays in viewport while scrolling */}
      <div className="sticky top-0 h-screen overflow-hidden z-10">
        {/* Headline + copy + CTA */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center text-center px-6 justify-center z-20"
          style={{ opacity: headlineOpacity, y: headlineY, paddingBottom: "18vh" }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-[clamp(2.5rem,5vw,4rem)] leading-[1.1] font-medium tracking-tight"
            style={{ color: "rgba(9,9,11,0.95)" }}
          >
            AI Concierge For
            <br />
            Your Network
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.15,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="mt-6 max-w-lg text-[16px] leading-relaxed"
            style={{ color: "rgba(9,9,11,0.5)" }}
          >
            Brace connects to your email, calendar, and LinkedIn —
            <br className="hidden sm:block" />
            and each morning, surfaces who needs your care, and why.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.3,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="mt-8"
          >
            <a
              href="#"
              className="group inline-flex items-center gap-2 rounded-full bg-[#09090b] px-6 py-3 text-[15px] font-medium text-white transition-all hover:bg-zinc-800"
            >
              Get Early Access
              <svg
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          </motion.div>
        </motion.div>

        {/* Demo — clip window at bottom, reveals more as user scrolls */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 1,
            delay: 0.4,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="absolute bottom-0 left-0 right-0 z-10 flex justify-center"
          style={{ y: demoY }}
        >
          {/* Clip window — grows from 25vh to 100vh */}
          <motion.div
            className="relative"
            style={{
              width: demoWidth,
              height: demoHeight,
            }}
          >
            <DemoMockup />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <GrainOverlay />
      <HeroSection />
    </div>
  );
}
