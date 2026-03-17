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

function FixedLogo() {
  const { scrollY } = useScroll();
  const braceOpacity = useTransform(scrollY, [0, 140], [1, 0]);
  const braceMaxWidth = useTransform(scrollY, [0, 140], ["4.8rem", "0rem"]);
  const braceMarginLeft = useTransform(scrollY, [0, 140], [10, 0]);

  return (
    <motion.a
      href="#"
      aria-label="Brace home"
      className="fixed left-4 top-4 z-50 inline-flex items-center justify-center rounded-2xl px-2.5 py-2 text-black sm:left-6 sm:top-6"
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
        viewBox="0 0 334 354"
        className="h-11 w-auto sm:h-12"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        animate={{ y: [0, -1.5, 0] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <g>
          <path d="M253.499 220.733C212.861 149.164 163.35 116.113 59.3917 105.375C53.3539 104.751 52.3564 114.778 58.9151 116.519C163.687 126.496 214.232 170.146 243.954 225.017C237.886 229.57 233.5 236.627 233.5 245C233.5 258.846 244.678 269.5 258 269.5C271.322 269.5 282.5 258.846 282.5 245C282.5 231.154 271.38 220.286 258.059 220.286C256.499 220.286 254.975 220.44 253.499 220.733Z" />
          <path d="M307 112.5C320.5 112 330.5 103 331.5 89C331.5 75.1536 322.5 64.5 308 63.5C299.115 63.5 289.66 67.743 285.475 75.1773C119.422 37.7053 46.4716 236.947 53.3686 345.5C53.7225 351.071 62.414 354.902 66.4344 345.5C66.4344 227.194 126.516 59.8708 282.206 88.8085C282.705 102.197 293.997 112.5 307 112.5Z" />
          <path d="M204.861 48.1279C210.718 43.5537 214.506 36.2724 214.506 28.0714C214.506 14.2248 203.707 3 190.385 3C177.063 3 166.263 14.2248 166.263 28.0714C166.263 41.918 177.063 53.1429 190.385 53.1429C191.614 53.1429 192.82 53.0475 193.999 52.8633C251.356 193.304 117.527 294.603 10.0001 242C0.337605 244.234 2.96307 253.061 8 255C126.884 300.767 264.612 208.079 204.861 48.1279Z" />
        </g>
      </motion.svg>

      <motion.span
        style={{
          opacity: braceOpacity,
          maxWidth: braceMaxWidth,
          marginLeft: braceMarginLeft,
        }}
        className="overflow-hidden whitespace-nowrap text-[1.15rem] font-serif font-semibold leading-none tracking-[-0.02em] text-black/90 sm:text-[1.28rem]"
      >
        Brace
      </motion.span>
    </motion.a>
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
          <a
            href="#"
            className="group relative isolate inline-flex items-center overflow-hidden rounded-full border border-[rgba(255,244,230,0.72)] bg-[linear-gradient(135deg,rgba(255,196,123,0.78),rgba(255,142,42,0.66))] px-5 py-2.5 text-[14px] font-semibold text-[rgba(62,31,8,0.95)] shadow-[0_8px_22px_rgba(226,120,24,0.25),0_2px_8px_rgba(105,54,13,0.16),inset_0_1px_0_rgba(255,255,255,0.68)] transition-all duration-300 backdrop-blur-2xl hover:bg-[linear-gradient(135deg,rgba(255,205,136,0.82),rgba(255,151,52,0.74))] hover:shadow-[0_12px_30px_rgba(226,120,24,0.32),0_4px_12px_rgba(105,54,13,0.22),inset_0_1px_0_rgba(255,255,255,0.72)] hover:scale-[1.02]"
          >
            <span className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <span className="absolute -left-1/4 top-1/2 h-20 w-20 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.50)_0%,rgba(255,255,255,0)_72%)] blur-[1px] transition-transform duration-700 group-hover:translate-x-[190%]" />
              <span className="absolute -right-1/4 top-1/2 h-16 w-16 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.40)_0%,rgba(255,255,255,0)_75%)] blur-[1px] transition-transform duration-[900ms] group-hover:-translate-x-[220%]" />
            </span>
            <span className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(255,255,255,0.32),rgba(255,255,255,0.05))] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <span className="relative z-20 inline-flex items-center gap-2">
              Get Early Access
              <span className="text-[15px] transition-transform duration-300 group-hover:translate-x-0.5">
                →
              </span>
            </span>
          </a>
        </motion.div>
      )}
    </section>
  );
}

export default function Home() {
  const isNarrow = useIsNarrowLayout();

  return (
    <div className="min-h-screen bg-white">
      <FixedLogo />
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
