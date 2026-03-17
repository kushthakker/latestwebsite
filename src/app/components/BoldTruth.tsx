// File: src/app/components/BoldTruth.tsx
"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView, useAnimation } from "framer-motion";

const SCRAMBLE_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

/* ————————————————————————————————————————————
   Gold shimmer sweep — "the funding"

   CSS-driven. Class toggles on → sweep plays
   → class removed → text returns to normal.
   Hover replays via forced reflow.
   ———————————————————————————————————————————— */

function GoldShimmerWord({
  play,
  delay = 0,
}: {
  play: boolean;
  delay?: number;
}) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const doneRef = useRef(false);

  useEffect(() => {
    if (!play) return;
    const t = setTimeout(() => {
      spanRef.current?.classList.add("bold-truth-shimmer");
    }, delay);
    return () => clearTimeout(t);
  }, [play, delay]);

  const handleAnimationEnd = () => {
    spanRef.current?.classList.remove("bold-truth-shimmer");
    doneRef.current = true;
  };

  const handleHover = () => {
    if (!doneRef.current) return;
    const el = spanRef.current;
    if (!el) return;
    el.classList.remove("bold-truth-shimmer");
    void el.offsetWidth; // force reflow to restart CSS animation
    el.classList.add("bold-truth-shimmer");
  };

  return (
    <span
      ref={spanRef}
      onAnimationEnd={handleAnimationEnd}
      onMouseEnter={handleHover}
    >
      The funding
    </span>
  );
}

/* ————————————————————————————————————————————
   Typewriter cursor — "The hire"

   Thin blinking cursor appears, blinks 3x,
   then vanishes. Conditional rendering means
   each show creates a fresh DOM element,
   automatically restarting the CSS animation.
   ———————————————————————————————————————————— */

function HireCursorWord({
  play,
  delay = 0,
}: {
  play: boolean;
  delay?: number;
}) {
  const [showCursor, setShowCursor] = useState(false);
  const doneRef = useRef(false);
  const hideRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (!play) return;
    const show = setTimeout(() => setShowCursor(true), delay);
    const hide = setTimeout(() => {
      setShowCursor(false);
      doneRef.current = true;
    }, delay + 2000);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, [play, delay]);

  const handleHover = () => {
    if (!doneRef.current || showCursor) return;
    setShowCursor(true);
    clearTimeout(hideRef.current);
    hideRef.current = setTimeout(() => setShowCursor(false), 2000);
  };

  return (
    <span onMouseEnter={handleHover}>
      The hire
      {showCursor && <span className="bold-truth-cursor" />}
    </span>
  );
}

/* ————————————————————————————————————————————
   Ink stamp — "the deal"

   Scale bounce + underline draw. Underline
   fades out after a beat so the text resets
   to normal. Uses useAnimation for
   imperative control (initial + hover replay).
   ———————————————————————————————————————————— */

function StampDealWord({
  play,
  delay = 0,
}: {
  play: boolean;
  delay?: number;
}) {
  const controls = useAnimation();
  const underlineControls = useAnimation();
  const doneRef = useRef(false);

  const playStamp = useCallback(async () => {
    doneRef.current = false;
    // Reset underline
    await underlineControls.set({ scaleX: 0, opacity: 0 });
    // Scale bounce + underline draw
    controls.start(
      { scale: [1, 1.06, 0.97, 1], y: [0, -2, 1, 0] },
      {
        duration: 0.55,
        ease: [0.22, 1.2, 0.36, 1],
        times: [0, 0.25, 0.65, 1],
      }
    );
    await underlineControls.start(
      { scaleX: 1, opacity: 1 },
      { duration: 0.4, delay: 0.12, ease: [0.25, 0.1, 0.25, 1] }
    );
    // Hold, then fade out to reset
    await underlineControls.start(
      { opacity: 0 },
      { duration: 0.4, delay: 0.6, ease: "easeOut" }
    );
    doneRef.current = true;
  }, [controls, underlineControls]);

  useEffect(() => {
    if (!play) return;
    const t = setTimeout(playStamp, delay);
    return () => clearTimeout(t);
  }, [play, delay, playStamp]);

  const handleHover = () => {
    if (!doneRef.current) return;
    playStamp();
  };

  return (
    <motion.span
      style={{
        display: "inline-block",
        position: "relative",
        verticalAlign: "baseline",
      }}
      animate={controls}
      onMouseEnter={handleHover}
    >
      The deal
      <motion.span
        style={{
          position: "absolute",
          bottom: "-2px",
          left: "8%",
          right: "8%",
          height: "2px",
          background: "#18181b",
          transformOrigin: "center",
          borderRadius: "1px",
        }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={underlineControls}
      />
    </motion.span>
  );
}

/* ————————————————————————————————————————————
   Warm pulse — "a relationship"

   Amber color shift + gradient underline that
   fades in and dissolves. Already resets
   naturally (color returns, underline fades).
   ———————————————————————————————————————————— */

function RelationshipWord({
  play,
  delay = 0,
}: {
  play: boolean;
  delay?: number;
}) {
  const colorControls = useAnimation();
  const underlineControls = useAnimation();
  const doneRef = useRef(false);

  const playWarm = useCallback(async () => {
    doneRef.current = false;
    // Reset underline
    await underlineControls.set({ scaleX: 0, opacity: 0 });
    // Color pulse + underline
    colorControls.start(
      { color: ["#18181b", "#92400e", "#78350f", "#18181b"] },
      { duration: 2, ease: "easeInOut" }
    );
    await underlineControls.start(
      { scaleX: [0, 1, 1], opacity: [0, 0.7, 0] },
      { duration: 2, ease: [0.25, 0.1, 0.25, 1] }
    );
    doneRef.current = true;
  }, [colorControls, underlineControls]);

  useEffect(() => {
    if (!play) return;
    const t = setTimeout(playWarm, delay);
    return () => clearTimeout(t);
  }, [play, delay, playWarm]);

  const handleHover = () => {
    if (!doneRef.current) return;
    playWarm();
  };

  return (
    <motion.span
      style={{
        display: "inline-block",
        position: "relative",
        verticalAlign: "baseline",
      }}
      animate={colorControls}
      onMouseEnter={handleHover}
    >
      a relationship
      <motion.span
        style={{
          position: "absolute",
          bottom: "-3px",
          left: 0,
          right: 0,
          height: "2px",
          background:
            "linear-gradient(90deg, transparent, #92400e, transparent)",
          transformOrigin: "center",
          borderRadius: "1px",
        }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={underlineControls}
      />
    </motion.span>
  );
}

/* ————————————————————————————————————————————
   Character scramble — "an algorithm"

   Shuffles then resolves left-to-right.
   Uses ref-based guard to prevent re-entry
   during an active scramble.
   ———————————————————————————————————————————— */

function ScrambleWord({
  text,
  play,
  delay = 0,
}: {
  text: string;
  play: boolean;
  delay?: number;
}) {
  const [display, setDisplay] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);
  const isScramblingRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const doneRef = useRef(false);

  const runScramble = useCallback(() => {
    if (isScramblingRef.current) return;
    isScramblingRef.current = true;
    setIsScrambling(true);
    let resolved = 0;

    intervalRef.current = setInterval(() => {
      setDisplay(
        text
          .split("")
          .map((char, i) => {
            if (char === " ") return " ";
            if (i <= resolved) return text[i];
            return SCRAMBLE_CHARS[
              Math.floor(Math.random() * SCRAMBLE_CHARS.length)
            ];
          })
          .join("")
      );
      resolved += 1;
      if (resolved >= text.length) {
        clearInterval(intervalRef.current);
        setDisplay(text);
        setTimeout(() => {
          isScramblingRef.current = false;
          setIsScrambling(false);
          doneRef.current = true;
        }, 80);
      }
    }, 40);
  }, [text]);

  useEffect(() => {
    if (!play) return;
    timeoutRef.current = setTimeout(runScramble, delay);
    return () => {
      clearTimeout(timeoutRef.current);
      clearInterval(intervalRef.current);
    };
  }, [play, delay, runScramble]);

  const handleHover = () => {
    if (!doneRef.current || isScramblingRef.current) return;
    runScramble();
  };

  return (
    <motion.span
      style={{ display: "inline-block" }}
      animate={
        isScrambling
          ? { x: [0, -0.7, 0.7, -0.3, 0.3, 0] }
          : { x: 0 }
      }
      transition={
        isScrambling
          ? { duration: 0.15, repeat: Infinity }
          : { duration: 0.1 }
      }
      onMouseEnter={handleHover}
    >
      {display}
    </motion.span>
  );
}

/* ————————————————————————————————————————————
   Strikethrough — "an application"

   Line draws left-to-right, holds briefly,
   then retracts to the right (transform-origin
   flips on exit for a clean wipe effect).
   Resets to normal after.
   ———————————————————————————————————————————— */

function StrikethroughWord({
  children,
  play,
  delay = 0,
}: {
  children: React.ReactNode;
  play: boolean;
  delay?: number;
}) {
  const [active, setActive] = useState(false);
  const doneRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const playStrike = useCallback(() => {
    doneRef.current = false;
    setActive(true);
    timerRef.current = setTimeout(() => {
      setActive(false);
      // Mark done after retract transition finishes
      setTimeout(() => {
        doneRef.current = true;
      }, 500);
    }, 1200); // 0.5s draw + 0.7s hold
  }, []);

  useEffect(() => {
    if (!play) return;
    const t = setTimeout(playStrike, delay);
    return () => clearTimeout(t);
  }, [play, delay, playStrike]);

  const handleHover = () => {
    if (!doneRef.current) return;
    clearTimeout(timerRef.current);
    playStrike();
  };

  return (
    <span style={{ position: "relative" }} onMouseEnter={handleHover}>
      {children}
      <span
        style={{
          position: "absolute",
          top: "53%",
          left: 0,
          width: "100%",
          height: "1.5px",
          background: "currentColor",
          // Draws from left, retracts to right
          transformOrigin: active ? "left center" : "right center",
          transform: active ? "scaleX(1)" : "scaleX(0)",
          transition:
            "transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)",
          opacity: 0.5,
        }}
      />
    </span>
  );
}

/* ————————————————————————————————————————————
   Warm phrase — progressive reveal

   Each clause fades in sequentially from dim
   to full. The last phrase lands warmer.
   ———————————————————————————————————————————— */

function WarmPhrase({
  children,
  play,
  delay = 0,
  emphasis = false,
}: {
  children: React.ReactNode;
  play: boolean;
  delay?: number;
  emphasis?: boolean;
}) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!play) return;
    const t = setTimeout(() => setActive(true), delay);
    return () => clearTimeout(t);
  }, [play, delay]);

  return (
    <motion.span
      initial={{ opacity: 0.3 }}
      animate={
        active
          ? {
              opacity: 1,
              ...(emphasis ? { color: "#57534e" } : {}),
            }
          : {}
      }
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {children}
    </motion.span>
  );
}

/* ————————————————————————————————————————————
   BoldTruth — the full section

   Orchestrates micro-interactions sequentially
   so the reader's eye is guided word by word.
   After all effects complete, everything resets
   to normal text — hover any keyword to replay.

   Timeline (from scroll-into-view):
   ┌─ 0–900ms     Text fades in, reader begins
   │
   ├─ 900ms       "the funding" — gold shimmer
   ├─ 1900ms      "the hire" — cursor blink
   ├─ 2900ms      "the deal" — stamp + underline
   ├─ 3900ms      "a relationship" — warm pulse
   │
   ├─ 4500ms      "an algorithm" — scramble
   ├─ 5300ms      "an application" — strikethrough
   │
   ├─ 6000ms      "knew you" — warm reveal
   ├─ 6300ms      "trusted you" — warm reveal
   └─ 6600ms      "thought of you…" — warm emphasis

   ~1000ms between headline keywords.
   ~800ms between subtitle effects.
   ———————————————————————————————————————————— */

export default function BoldTruth() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-15%" });
  const [keywordsPlay, setKeywordsPlay] = useState(false);
  const [subtitlePlay, setSubtitlePlay] = useState(false);

  useEffect(() => {
    if (!isInView) return;
    // Phase 2: after headline fade-in completes
    const t1 = setTimeout(() => setKeywordsPlay(true), 900);
    // Phase 3: after headline keywords have had their moment
    const t2 = setTimeout(() => setSubtitlePlay(true), 4500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [isInView]);

  return (
    <section
      ref={sectionRef}
      className="relative flex items-center justify-center min-h-screen bg-white px-6 py-24"
    >
      <div className="max-w-[58rem] text-center">
        {/* ── Main statement ── */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.9,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="text-[clamp(2rem,4.2vw,3.8rem)] leading-[1.2] tracking-tight text-zinc-900 font-semibold"
        >
          <GoldShimmerWord play={keywordsPlay} delay={0} />.{" "}
          <HireCursorWord play={keywordsPlay} delay={1000} />.{" "}
          <StampDealWord play={keywordsPlay} delay={2000} />{" "}
          that changed everything. Every one was decided by{" "}
          <RelationshipWord play={keywordsPlay} delay={3000} />.
        </motion.p>

        {/* ── Subtitle with anti-pattern contrast + warm reveal ── */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.9,
            delay: 0.25,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="mt-8 text-[clamp(1.1rem,1.8vw,1.5rem)] leading-relaxed text-zinc-400 font-normal tracking-tight"
        >
          Not{" "}
          <ScrambleWord
            text="an algorithm"
            play={subtitlePlay}
            delay={0}
          />
          . Not{" "}
          <StrikethroughWord play={subtitlePlay} delay={800}>
            an application
          </StrikethroughWord>
          .
          <br className="hidden sm:block" />
          <WarmPhrase play={subtitlePlay} delay={1500}>
            A person who knew you,
          </WarmPhrase>{" "}
          <WarmPhrase play={subtitlePlay} delay={1800}>
            trusted you,
          </WarmPhrase>{" "}
          <WarmPhrase play={subtitlePlay} delay={2100} emphasis>
            and thought of you at the right moment.
          </WarmPhrase>
        </motion.p>
      </div>
    </section>
  );
}
