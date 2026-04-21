import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import localFont from "next/font/local";
import "./globals.css";

const uncutSans = localFont({
  src: "./fonts/UncutSans-Variable.woff2",
  variable: "--font-uncut-sans",
  display: "swap",
  weight: "300 700",
});

const paperMono = localFont({
  src: "./fonts/PaperMono[wght].woff2",
  variable: "--font-paper-mono",
  display: "swap",
  weight: "400 800",
});

const tabular = localFont({
  src: [
    {
      path: "./fonts/Tabular-Variable.woff2",
      style: "normal",
      weight: "300 700",
    },
    {
      path: "./fonts/Tabular-VariableItalic.woff2",
      style: "italic",
      weight: "300 700",
    },
  ],
  variable: "--font-tabular",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "https://brace.dev"
  ),
  title: "Brace | AI Concierge for Your Network",
  description:
    "Brace connects to your email, calendar, and LinkedIn — and each morning, surfaces who needs your care, and why.",
  icons: {
    icon: "/brace-logo.svg",
  },
  openGraph: {
    title: "Brace | AI Concierge for Your Network",
    description:
      "Brace connects to your email, calendar, and LinkedIn — and each morning, surfaces who needs your care, and why.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Brace | AI Concierge for Your Network",
    description:
      "Brace connects to your email, calendar, and LinkedIn — and each morning, surfaces who needs your care, and why.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${uncutSans.variable} ${paperMono.variable} ${tabular.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
