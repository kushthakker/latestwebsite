"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getSupabaseClient } from "../lib/supabase";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

type WaitlistVariant = "orange" | "white";

interface WaitlistInputProps {
  variant?: WaitlistVariant;
  isNarrow: boolean;
  /** Extra classes on the outer wrapper */
  className?: string;
  /** Size variant for the sticky nav (smaller) */
  size?: "default" | "compact";
}

type SubmitState = "idle" | "expanded" | "submitting" | "success" | "error" | "duplicate";

export default function WaitlistInput({
  variant = "orange",
  isNarrow,
  className = "",
  size = "default",
}: WaitlistInputProps) {
  const [state, setState] = useState<SubmitState>("idle");
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Focus input when expanded (desktop)
  useEffect(() => {
    if (state === "expanded" && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 120);
    }
  }, [state]);

  // Focus input when mobile popup opens
  useEffect(() => {
    if (mobileOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [mobileOpen]);

  // Close desktop expansion on outside click
  useEffect(() => {
    if (state !== "expanded") return;
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setState("idle");
        setEmail("");
        setErrorMsg("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [state]);

  // Auto-reset success after delay
  useEffect(() => {
    if (state === "success" || state === "duplicate") {
      const t = setTimeout(() => {
        setState("idle");
        setEmail("");
        if (mobileOpen) setMobileOpen(false);
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [state, mobileOpen]);

  const handleClick = useCallback(() => {
    if (state !== "idle") return;
    if (isNarrow) {
      setMobileOpen(true);
    } else {
      setState("expanded");
    }
  }, [state, isNarrow]);

  const handleSubmit = useCallback(async () => {
    if (!email.trim()) {
      setErrorMsg("Enter your email");
      return;
    }
    if (!EMAIL_REGEX.test(email)) {
      setErrorMsg("Enter a valid email");
      return;
    }

    setState("submitting");
    setErrorMsg("");

    try {
      const supabase = getSupabaseClient();

      if (!supabase) {
        setState("error");
        setErrorMsg("Waitlist is unavailable right now.");
        return;
      }

      const { error } = await supabase
        .from("waitlist")
        .insert([{ email: email.trim(), created_at: new Date().toISOString() }]);

      if (error) {
        if (error.code === "23505") {
          setState("duplicate");
        } else {
          setState("error");
          setErrorMsg("Something went wrong. Try again.");
        }
      } else {
        setState("success");
      }
    } catch {
      setState("error");
      setErrorMsg("Something went wrong. Try again.");
    }
  }, [email]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSubmit();
      }
      if (e.key === "Escape") {
        setState("idle");
        setEmail("");
        setErrorMsg("");
        setMobileOpen(false);
      }
    },
    [handleSubmit]
  );

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
    setState("idle");
    setEmail("");
    setErrorMsg("");
  }, []);

  // ── Styling tokens ──
  const isCompact = size === "compact";
  const isWhite = variant === "white";

  // ── IDLE BUTTON ──
  const idleButton = (
    <motion.button
      onClick={handleClick}
      className={
        isWhite
          ? `group relative inline-flex items-center gap-3 overflow-hidden rounded-full font-semibold text-black transition-all duration-300 backdrop-blur-2xl bg-white/75 border border-white/80 shadow-[0_2px_16px_rgba(255,255,255,0.12),0_8px_32px_rgba(255,255,255,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] hover:scale-105 hover:bg-white/85 hover:shadow-[0_2px_24px_rgba(255,255,255,0.18),0_12px_48px_rgba(255,255,255,0.10),inset_0_1px_0_rgba(255,255,255,1)] ${
              isCompact ? "px-5 py-2.5 text-[14px]" : "px-8 py-4 text-[15px]"
            }`
          : `group relative isolate inline-flex items-center overflow-hidden rounded-full border border-[rgba(255,244,230,0.7)] bg-[linear-gradient(135deg,rgba(255,196,123,0.72),rgba(255,142,42,0.62))] font-semibold text-[rgba(62,31,8,0.95)] shadow-[0_8px_24px_rgba(226,120,24,0.28),0_2px_10px_rgba(105,54,13,0.20),inset_0_1px_0_rgba(255,255,255,0.65)] transition-all duration-300 backdrop-blur-2xl hover:bg-[linear-gradient(135deg,rgba(255,205,136,0.78),rgba(255,151,52,0.70))] hover:shadow-[0_12px_32px_rgba(226,120,24,0.35),0_4px_14px_rgba(105,54,13,0.24),inset_0_1px_0_rgba(255,255,255,0.72)] hover:scale-[1.03] ${
              isCompact ? "px-5 py-2.5 text-[14px]" : "px-7 py-3.5 text-[15px]"
            }`
      }
      whileTap={{ scale: 0.97 }}
    >
      {/* Water hover effect (orange variant only) */}
      {!isWhite && (
        <>
          <span className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="absolute -left-1/4 top-1/2 h-24 w-24 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.55)_0%,rgba(255,255,255,0)_72%)] blur-[1px] transition-transform duration-700 group-hover:translate-x-[190%]" />
            <span className="absolute -right-1/4 top-1/2 h-20 w-20 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.42)_0%,rgba(255,255,255,0)_75%)] blur-[1px] transition-transform duration-[900ms] group-hover:-translate-x-[220%]" />
          </span>
          <span className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(255,255,255,0.32),rgba(255,255,255,0.05))] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </>
      )}
      <span className="relative z-20 inline-flex items-center gap-2">
        Get Early Access
        {isWhite ? (
          <svg
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        ) : (
          <span
            className={`transition-transform duration-300 group-hover:translate-x-0.5 ${isCompact ? "text-[15px]" : "text-[16px]"}`}
          >
            →
          </span>
        )}
      </span>
    </motion.button>
  );

  // ── DESKTOP EXPANDED INPUT ──
  const expandedInput = (
    <motion.div
      ref={wrapperRef}
      initial={{ width: 220, opacity: 0.9 }}
      animate={{ width: isCompact ? 320 : 380, opacity: 1 }}
      exit={{ width: 220, opacity: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 32 }}
      className={`relative flex items-center overflow-hidden rounded-full ${
        isWhite
          ? "bg-white/20 border border-white/40 shadow-[0_4px_24px_rgba(255,255,255,0.08),inset_0_1px_0_rgba(255,255,255,0.5)] backdrop-blur-2xl"
          : "bg-white/90 border border-orange-200/60 shadow-[0_4px_24px_rgba(226,120,24,0.12),inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-2xl"
      }`}
      style={{ height: isCompact ? 42 : 48 }}
    >
      <input
        ref={inputRef}
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setErrorMsg("");
        }}
        onKeyDown={handleKeyDown}
        placeholder="Enter your email"
        disabled={state === "submitting"}
        className={`flex-1 bg-transparent outline-none placeholder:text-opacity-40 ${
          isCompact ? "pl-4 pr-2 text-[13px]" : "pl-5 pr-2 text-[14px]"
        } ${
          isWhite
            ? "text-white placeholder:text-white/40 caret-white"
            : "text-zinc-800 placeholder:text-zinc-400 caret-orange-500"
        }`}
      />
      <motion.button
        onClick={handleSubmit}
        disabled={state === "submitting"}
        className={`mr-1.5 flex items-center justify-center rounded-full transition-all duration-200 ${
          isCompact ? "h-[30px] w-[30px]" : "h-[36px] w-[36px]"
        } ${
          isWhite
            ? "bg-white/80 text-black hover:bg-white"
            : "bg-gradient-to-br from-orange-400 to-orange-500 text-white hover:from-orange-500 hover:to-orange-600"
        } ${state === "submitting" ? "opacity-60" : ""}`}
        whileTap={{ scale: 0.92 }}
      >
        {state === "submitting" ? (
          <motion.svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity={0.25} />
            <path
              d="M4 12a8 8 0 018-8"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </motion.svg>
        ) : (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        )}
      </motion.button>

      {/* Error tooltip */}
      <AnimatePresence>
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className={`absolute -bottom-8 left-4 text-[12px] font-medium ${
              isWhite ? "text-red-300" : "text-red-500"
            }`}
          >
            {errorMsg}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  // ── DESKTOP SUCCESS ──
  const successBadge = (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className={`inline-flex items-center gap-2 rounded-full font-medium ${
        isCompact ? "px-4 py-2 text-[13px]" : "px-6 py-3 text-[14px]"
      } ${
        isWhite
          ? "bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 backdrop-blur-xl"
          : "bg-emerald-50 border border-emerald-200 text-emerald-700"
      }`}
    >
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      You&apos;re on the list!
    </motion.div>
  );

  const duplicateBadge = (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className={`inline-flex items-center gap-2 rounded-full font-medium ${
        isCompact ? "px-4 py-2 text-[13px]" : "px-6 py-3 text-[14px]"
      } ${
        isWhite
          ? "bg-white/15 border border-white/25 text-white/90 backdrop-blur-xl"
          : "bg-amber-50 border border-amber-200 text-amber-700"
      }`}
    >
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      Already on the list!
    </motion.div>
  );

  // ── MOBILE POPUP ──
  const mobilePopup = (
    <AnimatePresence>
      {mobileOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-end justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeMobile}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Sheet */}
          <motion.div
            className="relative w-full max-w-lg mx-4 mb-4 overflow-hidden rounded-3xl"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 340, damping: 34 }}
            style={{
              background: isWhite
                ? "rgba(20,20,22,0.92)"
                : "rgba(255,255,255,0.95)",
              backdropFilter: "blur(40px) saturate(1.6)",
              WebkitBackdropFilter: "blur(40px) saturate(1.6)",
              border: isWhite
                ? "1px solid rgba(255,255,255,0.12)"
                : "1px solid rgba(0,0,0,0.06)",
              boxShadow: isWhite
                ? "0 -8px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)"
                : "0 -8px 60px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.9)",
            }}
          >
            {/* Grab indicator */}
            <div className="flex justify-center pt-3 pb-1">
              <div
                className={`h-1 w-10 rounded-full ${
                  isWhite ? "bg-white/20" : "bg-black/10"
                }`}
              />
            </div>

            {/* Close button */}
            <button
              onClick={closeMobile}
              className={`absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                isWhite
                  ? "bg-white/10 text-white/60 hover:bg-white/20"
                  : "bg-black/5 text-black/40 hover:bg-black/10"
              }`}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="px-6 pb-8 pt-4">
              {/* Title */}
              <h3
                className={`text-[22px] font-bold tracking-tight ${
                  isWhite ? "text-white" : "text-zinc-900"
                }`}
              >
                Get Early Access
              </h3>
              <p
                className={`mt-1.5 text-[14px] leading-relaxed ${
                  isWhite ? "text-white/50" : "text-zinc-500"
                }`}
              >
                Join the waitlist — we&apos;ll let you know when it&apos;s your turn.
              </p>

              {/* Input + Button */}
              <AnimatePresence mode="wait">
                {state === "success" || state === "duplicate" ? (
                  <motion.div
                    key="mobile-success"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className={`mt-6 flex items-center gap-3 rounded-2xl px-5 py-4 ${
                      state === "success"
                        ? isWhite
                          ? "bg-emerald-500/15 border border-emerald-400/25"
                          : "bg-emerald-50 border border-emerald-200"
                        : isWhite
                          ? "bg-white/10 border border-white/20"
                          : "bg-amber-50 border border-amber-200"
                    }`}
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        state === "success"
                          ? isWhite
                            ? "bg-emerald-400/20 text-emerald-300"
                            : "bg-emerald-100 text-emerald-600"
                          : isWhite
                            ? "bg-white/15 text-white/80"
                            : "bg-amber-100 text-amber-600"
                      }`}
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p
                        className={`text-[15px] font-semibold ${
                          state === "success"
                            ? isWhite ? "text-emerald-300" : "text-emerald-700"
                            : isWhite ? "text-white/90" : "text-amber-700"
                        }`}
                      >
                        {state === "success" ? "You're on the list!" : "Already on the list!"}
                      </p>
                      <p
                        className={`text-[13px] mt-0.5 ${
                          state === "success"
                            ? isWhite ? "text-emerald-400/60" : "text-emerald-600/70"
                            : isWhite ? "text-white/50" : "text-amber-600/70"
                        }`}
                      >
                        {state === "success"
                          ? "We'll reach out soon."
                          : "You've already signed up."}
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="mobile-form"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="mt-6 space-y-3"
                  >
                    <div className="relative">
                      <input
                        ref={inputRef}
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setErrorMsg("");
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder="you@email.com"
                        disabled={state === "submitting"}
                        className={`w-full rounded-xl px-4 py-3.5 text-[16px] outline-none transition-all duration-200 ${
                          isWhite
                            ? "bg-white/8 border border-white/15 text-white placeholder:text-white/30 caret-white focus:border-white/30 focus:bg-white/12"
                            : "bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 caret-orange-500 focus:border-orange-300 focus:bg-white"
                        }`}
                        style={{ fontSize: "16px" /* prevent iOS zoom */ }}
                      />
                      {errorMsg && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className={`mt-1.5 text-[12px] font-medium ${
                            isWhite ? "text-red-400" : "text-red-500"
                          }`}
                        >
                          {errorMsg}
                        </motion.p>
                      )}
                    </div>

                    <motion.button
                      onClick={handleSubmit}
                      disabled={state === "submitting"}
                      className={`w-full rounded-xl py-3.5 text-[15px] font-semibold transition-all duration-200 ${
                        state === "submitting" ? "opacity-70" : ""
                      } ${
                        isWhite
                          ? "bg-white text-black hover:bg-white/90"
                          : "bg-gradient-to-br from-orange-400 to-orange-500 text-white hover:from-orange-500 hover:to-orange-600 shadow-[0_4px_16px_rgba(226,120,24,0.3)]"
                      }`}
                      whileTap={{ scale: 0.98 }}
                    >
                      {state === "submitting" ? (
                        <span className="inline-flex items-center gap-2">
                          <motion.svg
                            className="h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <circle
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="3"
                              opacity={0.25}
                            />
                            <path
                              d="M4 12a8 8 0 018-8"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeLinecap="round"
                            />
                          </motion.svg>
                          Joining...
                        </span>
                      ) : (
                        "Join Waitlist"
                      )}
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Safe area for iPhone */}
            <div style={{ height: "env(safe-area-inset-bottom, 0px)" }} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // ── RENDER ──
  return (
    <div className={className}>
      <AnimatePresence mode="wait">
        {state === "idle" && <motion.div key="idle" exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.15 }}>{idleButton}</motion.div>}
        {(state === "expanded" || state === "submitting" || state === "error") && (
          <motion.div key="expanded">{expandedInput}</motion.div>
        )}
        {state === "success" && <motion.div key="success">{successBadge}</motion.div>}
        {state === "duplicate" && <motion.div key="duplicate">{duplicateBadge}</motion.div>}
      </AnimatePresence>

      {/* Mobile popup rendered via portal-like fixed positioning */}
      {isNarrow && mobilePopup}
    </div>
  );
}
