"use client";

import { useEffect, useState } from "react";

const SUPPORT_EMAIL = "kush@brace.so";
const MAILTO_LINK = `mailto:${SUPPORT_EMAIL}?subject=Brace%20Support%20Request`;

export default function SupportPage() {
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = MAILTO_LINK;
      setOpened(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Mail icon */}
        <div className="mx-auto mb-8 w-20 h-20 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          >
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-white mb-3">Brace Support</h1>

        <p className="text-gray-400 text-lg mb-2">
          {opened
            ? "Your email client should be open now."
            : "Opening your email client..."}
        </p>
        <p className="text-gray-500 text-sm mb-8">
          We typically respond within 24 hours.
        </p>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-gray-500 text-xs uppercase tracking-wider">
            {opened ? "Didn't open?" : "or"}
          </span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Manual trigger button */}
        <a
          href={MAILTO_LINK}
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
          Email {SUPPORT_EMAIL}
        </a>

        <p className="text-gray-600 text-xs mt-6">
          You can also email us directly at{" "}
          <a
            href={MAILTO_LINK}
            className="text-gray-400 underline hover:text-white transition-colors"
          >
            {SUPPORT_EMAIL}
          </a>
        </p>
      </div>
    </div>
  );
}
