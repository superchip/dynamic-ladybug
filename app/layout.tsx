import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dynamic Ladybug — Belief Reframing",
  description: "Register an emotion, explore the belief behind it, and discover a stronger perspective.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col"
        style={{ background: "linear-gradient(135deg, #0d0d1a 0%, #0f0a1e 50%, #0a0d1a 100%)" }}
      >
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4">
          <a href="/" className="text-white/80 font-semibold text-sm tracking-wide hover:text-white transition">
            🐞 Dynamic Ladybug
          </a>
          <a href="/history" className="text-white/40 text-sm hover:text-white/70 transition">
            History
          </a>
        </nav>
        <div className="pt-14 flex-1 flex flex-col">{children}</div>
      </body>
    </html>
  );
}
