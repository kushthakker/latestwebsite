"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
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
import WaitlistInput from "./components/WaitlistInput";


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

function FixedLogo({ demoProgress }: { demoProgress: MotionValue<number> }) {
  const logoOpacity = useTransform(demoProgress, [0.10, 0.28], [1, 0]);

  return (
    <motion.div
      className="fixed left-4 top-4 z-50 sm:left-6 sm:top-6"
    >
      <motion.a
        href="#"
        aria-label="Brace home"
        className="inline-flex items-center justify-center rounded-2xl px-2.5 py-2 text-black"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.2, 0.65, 0.3, 1] }}
      >
        <motion.span
          className="pointer-events-none absolute inset-0 -z-10 rounded-2xl bg-[radial-gradient(circle_at_45%_45%,rgba(251,146,60,0.24),rgba(251,146,60,0)_70%)]"
          animate={{ opacity: [0.35, 0.6, 0.35], scale: [0.96, 1.03, 0.96] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.svg
          viewBox="0 0 529 530"
          className="h-11 w-auto sm:h-12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          animate={{ y: [0, -1.5, 0] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M80.0005 522.01C80.0005 526.428 83.5822 530.01 88.0005 530.01C92.4188 530.01 96.0005 526.428 96.0005 522.01L80.0005 522.01ZM442.834 167.01C442.834 190.574 461.936 209.677 485.501 209.677C509.065 209.677 528.167 190.574 528.167 167.01C528.167 143.446 509.065 124.343 485.501 124.343C461.936 124.343 442.834 143.446 442.834 167.01ZM96.0005 522.01C96.0005 394.103 138.866 281.255 208.334 213.552C277.337 146.302 373.132 122.929 482.092 174.247L488.909 159.772C373.869 105.591 270.914 130.219 197.167 202.093C123.885 273.514 80.0005 390.917 80.0005 522.01L96.0005 522.01Z" fill="currentColor" />
          <path d="M88.6265 176.034C84.2218 175.689 80.3708 178.979 80.025 183.384C79.6793 187.788 82.9697 191.639 87.3744 191.985L88.6265 176.034ZM349.334 395.51C349.334 419.074 368.436 438.176 392 438.176C415.565 438.176 434.667 419.074 434.667 395.51C434.667 371.946 415.565 352.843 392 352.843C368.436 352.843 349.334 371.946 349.334 395.51ZM87.3744 191.985C159.692 197.662 222.649 216.008 273.087 249.37C323.41 282.656 361.717 331.177 384.425 398.081L399.576 392.939C375.784 322.843 335.341 271.364 281.914 236.025C228.602 200.762 162.809 181.858 88.6265 176.034L87.3744 191.985Z" fill="currentColor" />
          <path d="M5.30815 387.544C1.14763 386.057 -1.01964 381.478 0.46741 377.318C1.95446 373.157 6.53271 370.99 10.6932 372.477L5.30815 387.544ZM249.778 83.2362C227.562 75.3811 215.919 51.0035 223.774 28.7871C231.629 6.57068 256.007 -5.07152 278.224 2.78348C300.44 10.6385 312.082 35.0162 304.227 57.2326C296.372 79.449 271.994 91.0912 249.778 83.2362ZM10.6932 372.477C135.428 417.06 228.282 373.719 274.573 301.325C321.238 228.348 321.258 125.035 257.828 48.0989L270.173 37.9208C338.244 120.485 338.264 231.422 288.053 309.945C237.47 389.051 136.574 434.461 5.30815 387.544L10.6932 372.477Z" fill="currentColor" />
        </motion.svg>

        <motion.span
          style={{ opacity: logoOpacity, marginLeft: 10 }}
          className="overflow-hidden whitespace-nowrap text-[1.15rem] font-serif font-semibold leading-none tracking-[-0.02em] text-black/90 sm:text-[1.28rem]"
        >
          Brace
        </motion.span>
      </motion.a>
    </motion.div>
  );
}

function HeroSection({ isNarrow }: { isNarrow: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [penflowSize, setPenflowSize] = useState(84);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);
  const [isFinalSectionVisible, setIsFinalSectionVisible] = useState(false);
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
  const demoStartHeight = isNarrow ? 22 : 25;
  const demoExpandedHeight = isNarrow ? 94 : 96;
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
  const desktopEarlyAccessOpacity = useTransform(scrollYProgress, [0.86, 0.92], [0, 1]);
  const desktopEarlyAccessY = useTransform(scrollYProgress, [0.86, 0.92], [-10, 0]);
  const desktopEarlyAccessScale = useTransform(scrollYProgress, [0.86, 0.92], [0.98, 1]);
  const desktopEarlyAccessPointerEvents = useTransform(scrollYProgress, (value) =>
    value > 0.86 ? "auto" : "none"
  );

  useEffect(() => {
    if (isNarrow) return;

    const finalSection = document.getElementById("one-percent-club-section");
    if (!finalSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFinalSectionVisible(entry.isIntersecting);
      },
      { threshold: 0.06 }
    );

    observer.observe(finalSection);
    return () => observer.disconnect();
  }, [isNarrow]);

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
      {!isNarrow && <FixedLogo demoProgress={scrollYProgress} />}

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
            Your next opportunity is one relationship away.{" "}
            <br className="hidden sm:block" />
            Brace makes sure you don&apos;t miss it.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.3,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="mt-8 pointer-events-auto"
          >
            <WaitlistInput variant="orange" isNarrow={isNarrow} />
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

      {!isNarrow && (
        <motion.div
          className="fixed right-6 top-6 z-50 hidden lg:block"
          style={{
            opacity: isFinalSectionVisible ? 0 : desktopEarlyAccessOpacity,
            y: desktopEarlyAccessY,
            scale: desktopEarlyAccessScale,
            pointerEvents: isFinalSectionVisible ? "none" : desktopEarlyAccessPointerEvents,
          }}
        >
          <WaitlistInput variant="orange" isNarrow={false} size="compact" />
        </motion.div>
      )}
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
