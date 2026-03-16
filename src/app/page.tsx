"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import DemoMockup from "./components/DemoMockup";
import SignalNoise from "./components/SignalNoise";
import NetworkSection from "./components/NetworkSection";
import ComparisonTable from "./components/ComparisonTable";
import OnePercentClub from "./components/OnePercentClub";


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
  const demoStartHeightVh = 25;
  const demoExpandedHeightVh = 94;
  const demoExitDriftVh = -5;

  // Phase 1: Headline fades out
  const headlineOpacity = useTransform(scrollYProgress, [0.04, 0.22], [1, 0]);
  const headlineY = useTransform(scrollYProgress, [0.04, 0.22], [0, -60]);

  // Phase 2: Demo enlarges and lifts to vertical center
  const demoWidth = useTransform(scrollYProgress, [0.10, 0.40], ["80%", "92%"]);
  const demoHeightVh = useTransform(
    scrollYProgress,
    [0.10, 0.40],
    [demoStartHeightVh, demoExpandedHeightVh]
  );
  const demoHeight = useTransform(demoHeightVh, (heightVh) => `${heightVh}vh`);
  const demoCenteredLiftVh = useTransform(demoHeightVh, (heightVh) => {
    const growthProgress =
      (heightVh - demoStartHeightVh) / (demoExpandedHeightVh - demoStartHeightVh);
    const expandedCenterOffset = -((100 - demoExpandedHeightVh) / 2);
    return growthProgress * expandedCenterOffset;
  });
  const demoExitLiftVh = useTransform(
    scrollYProgress,
    [0.60, 0.86],
    [0, demoExitDriftVh]
  );
  // Grow from the bottom, land in true center when expanded, then drift upward on exit.
  const demoY = useTransform(
    [demoCenteredLiftVh, demoExitLiftVh],
    ([centeredLiftVh, exitLiftVh]) => `${centeredLiftVh + exitLiftVh}vh`
  );

  // Phase 3: Demo fades out smoothly
  const demoOpacity = useTransform(scrollYProgress, [0.60, 0.86], [1, 0]);

  // ── Magnetic snap: gently lock demo in perfect view ──
  const snapTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const hasSnappedRef = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleScroll = () => {
      clearTimeout(snapTimeoutRef.current);

      const rect = section.getBoundingClientRect();
      const progress = -rect.top / rect.height;

      // Reset snap flag when well outside the zone
      if (progress < 0.15 || progress > 0.65) {
        hasSnappedRef.current = false;
      }

      // After user stops scrolling, check if we should snap
      snapTimeoutRef.current = setTimeout(() => {
        if (hasSnappedRef.current) return;

        const r = section.getBoundingClientRect();
        const p = -r.top / r.height;

        if (p >= 0.33 && p <= 0.50) {
          hasSnappedRef.current = true;
          const sectionAbsTop = r.top + window.scrollY;
          const targetScroll = sectionAbsTop + 0.42 * r.height;
          window.scrollTo({ top: targetScroll, behavior: "smooth" });
        }
      }, 180);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(snapTimeoutRef.current);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative" style={{ height: "250vh" }}>
      {/* Background — fixed */}
      <div className="pointer-events-none fixed inset-0 bg-white z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_30%,rgba(200,190,175,0.08),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_70%,rgba(200,190,175,0.05),transparent)]" />
      </div>

      {/* Sticky container — stays in viewport while scrolling */}
      <div className="sticky top-0 h-screen overflow-hidden z-10">
        {/* Headline + copy + CTA */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center text-center px-6 justify-center z-20 pointer-events-none"
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
            The people who matter most are already in your network.
            <br className="hidden sm:block" />
            Brace makes sure you stay on their mind.
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
              className="pointer-events-auto group inline-flex items-center gap-2 rounded-full bg-[#09090b] px-6 py-3 text-[15px] font-medium text-white transition-all hover:bg-zinc-800"
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

        {/* Demo — page-load entrance */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 1,
            delay: 0.4,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="absolute bottom-0 left-0 right-0 z-10"
        >
          {/* Scroll-driven position + exit fade */}
          <motion.div
            className="flex justify-center"
            style={{ y: demoY, opacity: demoOpacity }}
          >
            {/* Clip window — grows from 25vh to the expanded demo height, content always full-size */}
            <motion.div
              className="relative overflow-hidden"
              style={{
                width: demoWidth,
                height: demoHeight,
                borderTopLeftRadius: "14px",
                borderTopRightRadius: "14px",
                borderBottomLeftRadius: "0px",
                borderBottomRightRadius: "0px",
                background: "#fff",
              }}
            >
              <div style={{ height: "94vh", width: "100%" }}>
                <DemoMockup />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function BoldTruth() {
  return (
    <section className="relative flex items-center justify-center min-h-screen bg-white px-6 py-24">
      <div className="max-w-[58rem] text-center">
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-[clamp(1.75rem,3.8vw,3.5rem)] leading-[1.2] tracking-tight text-zinc-900 font-medium"
        >
          Every important outcome in your career — the funding, the hire, the deal that changed everything — was
          decided by a relationship.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{
            duration: 0.9,
            delay: 0.25,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="mt-8 text-[clamp(1.1rem,1.8vw,1.5rem)] leading-relaxed text-zinc-400 font-normal tracking-tight"
        >
          Not an algorithm. Not an application.
          <br className="hidden sm:block" />
          A person who knew you, trusted you, and thought of you at the right moment.
        </motion.p>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <GrainOverlay />
      <HeroSection />
      {/* <SignalNoise /> */}
      <BoldTruth />
      <NetworkSection />
      <ComparisonTable />
      <OnePercentClub />
    </div>
  );
}
