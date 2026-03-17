"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import { useIsNarrowLayout } from "./lib/useIsNarrowLayout";

const Penflow = dynamic(
  () => import("penflow/react").then((mod) => mod.Penflow),
  { ssr: false }
);
import DemoMockup from "./components/DemoMockup";
import BoldTruth from "./components/BoldTruth";
import BoldTruthBridge from "./components/BoldTruthBridge";
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

function HeroSection({ isNarrow }: { isNarrow: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [penflowSize, setPenflowSize] = useState(84);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);
  const animationTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Compute penflow size from the heading's computed font size
  useEffect(() => {
    const updateSize = () => {
      if (headingRef.current) {
        const fs = parseFloat(getComputedStyle(headingRef.current).fontSize);
        setPenflowSize(Math.round(fs * 1.2));
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Pre-load the handwriting font
  useEffect(() => {
    fetch("/fonts/BrittanySignature.ttf");
  }, []);

  const triggerAnimation = useCallback(() => {
    setIsAnimating(true);
    clearTimeout(animationTimerRef.current);
    // Revert to normal text after animation completes (~4s for "Concierge" at speed 0.7)
    animationTimerRef.current = setTimeout(() => {
      setIsAnimating(false);
      setHasPlayedOnce(true);
    }, 4000);
  }, []);

  // Auto-play animation once after 3s on page load
  useEffect(() => {
    const timer = setTimeout(() => triggerAnimation(), 3000);
    return () => clearTimeout(timer);
  }, [triggerAnimation]);

  const handleConciergeHover = () => {
    if (isNarrow) return;
    if (hasPlayedOnce && !isAnimating) {
      triggerAnimation();
    }
  };

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const sectionHeight = isNarrow ? "180svh" : "250vh";
  const viewportUnit = isNarrow ? "svh" : "vh";
  const demoStartHeight = isNarrow ? 24 : 25;
  const demoExpandedHeight = isNarrow ? 82 : 96;
  const demoExitDrift = isNarrow ? -3 : -5;

  // Phase 1: Headline fades out
  const headlineOpacity = useTransform(scrollYProgress, [0.04, 0.22], [1, 0]);
  const headlineY = useTransform(scrollYProgress, [0.04, 0.22], [0, -60]);

  // Phase 2: Demo enlarges and lifts to vertical center
  const demoWidth = useTransform(
    scrollYProgress,
    [0.10, 0.40],
    isNarrow ? ["92%", "100%"] : ["80%", "92%"]
  );
  const demoHeightValue = useTransform(
    scrollYProgress,
    [0.10, 0.40],
    [demoStartHeight, demoExpandedHeight]
  );
  const demoHeight = useTransform(
    demoHeightValue,
    (heightValue) => `${heightValue}${viewportUnit}`
  );
  const demoCenteredLift = useTransform(demoHeightValue, (heightValue) => {
    const growthProgress =
      (heightValue - demoStartHeight) / (demoExpandedHeight - demoStartHeight);
    const expandedCenterOffset = -((100 - demoExpandedHeight) / 2);
    return growthProgress * expandedCenterOffset;
  });
  const demoExitLift = useTransform(
    scrollYProgress,
    [0.60, 0.86],
    [0, demoExitDrift]
  );
  // Grow from the bottom, land in true center when expanded, then drift upward on exit.
  const demoY = useTransform(
    [demoCenteredLift, demoExitLift],
    ([centeredLift, exitLift]) =>
      `${(centeredLift as number) + (exitLift as number)}${viewportUnit}`
  );

  // Phase 3: Demo fades out smoothly
  const demoOpacity = useTransform(scrollYProgress, [0.60, 0.86], [1, 0]);

  // ── Magnetic snap: gently lock demo in perfect view ──
  const snapTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const hasSnappedRef = useRef(false);

  useEffect(() => {
    if (isNarrow) return;

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
  }, [isNarrow]);

  return (
    <section ref={sectionRef} className="relative" style={{ height: sectionHeight }}>
      {/* Background — fixed */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-white" />

      {/* Sticky container — stays in viewport while scrolling */}
      <div className="sticky top-0 overflow-hidden z-10" style={{ height: `100${viewportUnit}` }}>
        {/* Headline + copy + CTA */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center z-20 pointer-events-none sm:px-6"
          style={{
            opacity: headlineOpacity,
            y: headlineY,
            paddingBottom: isNarrow ? "10svh" : "18vh",
          }}
        >
          <motion.h1
            ref={headingRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-[clamp(2.8rem,5.5vw,4.5rem)] leading-[1.1] font-semibold tracking-tight"
            style={{ color: "rgba(9,9,11,0.95)" }}
          >
            AI{" "}
            <span
              className="relative z-20 inline-block cursor-pointer pointer-events-auto"
              style={{ overflow: "visible" }}
              onMouseEnter={handleConciergeHover}
            >
              {/* Normal font — visible when not animating */}
              <span
                className="transition-opacity duration-500"
                style={{ opacity: isAnimating ? 0 : 1 }}
              >
                Concierge
              </span>
              {/* Penflow handwriting overlay — absolutely positioned, overflow visible */}
              <span
                className="pointer-events-none absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2"
                style={{ overflow: "visible" }}
              >
                {isAnimating && (
                  <Penflow
                    text="Concierge"
                    fontUrl="/fonts/BrittanySignature.ttf"
                    size={penflowSize}
                    speed={0.7}
                    quality="balanced"
                    color="rgba(9,9,11,0.90)"
                    animate
                    incremental={false}
                  />
                )}
              </span>
            </span>{" "}
            For
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
              className="pointer-events-auto group relative isolate inline-flex items-center overflow-hidden rounded-full border border-[rgba(255,244,230,0.7)] bg-[linear-gradient(135deg,rgba(255,196,123,0.72),rgba(255,142,42,0.62))] px-7 py-3.5 text-[15px] font-semibold text-[rgba(62,31,8,0.95)] shadow-[0_8px_24px_rgba(226,120,24,0.28),0_2px_10px_rgba(105,54,13,0.20),inset_0_1px_0_rgba(255,255,255,0.65)] transition-all duration-300 backdrop-blur-2xl hover:bg-[linear-gradient(135deg,rgba(255,205,136,0.78),rgba(255,151,52,0.70))] hover:shadow-[0_12px_32px_rgba(226,120,24,0.35),0_4px_14px_rgba(105,54,13,0.24),inset_0_1px_0_rgba(255,255,255,0.72)] hover:scale-[1.03]"
            >
              <span className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="absolute -left-1/4 top-1/2 h-24 w-24 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.55)_0%,rgba(255,255,255,0)_72%)] blur-[1px] transition-transform duration-700 group-hover:translate-x-[190%]" />
                <span className="absolute -right-1/4 top-1/2 h-20 w-20 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.42)_0%,rgba(255,255,255,0)_75%)] blur-[1px] transition-transform duration-[900ms] group-hover:-translate-x-[220%]" />
              </span>
              <span className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(255,255,255,0.32),rgba(255,255,255,0.05))] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <span className="relative z-20 inline-flex items-center gap-2">
                Get Early Access
                <span className="text-[16px] transition-transform duration-300 group-hover:translate-x-0.5">
                  →
                </span>
              </span>
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
              <div style={{ height: `${demoExpandedHeight}${viewportUnit}`, width: "100%" }}>
                <DemoMockup isNarrow={isNarrow} />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default function Home() {
  const isNarrow = useIsNarrowLayout();

  return (
    <div className="min-h-screen bg-white">
      <GrainOverlay />
      <HeroSection isNarrow={isNarrow} />
      {/* <SignalNoise /> */}
      <BoldTruth />
      <BoldTruthBridge />
      <NetworkSection isNarrow={isNarrow} />
      <ComparisonTable isNarrow={isNarrow} />
      <OnePercentClub isNarrow={isNarrow} />
    </div>
  );
}
