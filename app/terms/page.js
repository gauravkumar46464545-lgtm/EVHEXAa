"use client";
import Link from "next/link";
import ThemeMenu from "@/components/ThemeMenu";
import { ArrowLeft, Zap } from "lucide-react";

export const dynamic = "force-dynamic";

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-[#251a45] bg-ink/90 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/" className="flex items-center gap-3">
            <span className="block h-[50px] w-[50px] shrink-0 overflow-hidden rounded-full border-2 border-[#16a34a] p-[2px] ring-2 ring-[#22c55e]/60">
              <img src="/logo.png" alt="EV HEXA" className="h-full w-full rounded-full object-cover" />
            </span>
            <span className="inline-flex items-center font-display text-2xl font-extrabold not-italic leading-none tracking-tight">
              <span className="text-[#16a34a]">EV</span>
              <Zap size={18} className="mx-0.5 fill-[#16a34a] text-[#16a34a]" />
              <span className="text-[#111827]">HEXA</span>
            </span>
          </Link>
          <ThemeMenu />
        </nav>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-volt hover:underline">
          <ArrowLeft size={14} /> Back to Home
        </Link>
        <h1 className="mt-2 font-display text-3xl font-bold uppercase md:text-4xl">Terms &amp; Conditions</h1>
        <p className="mt-1 text-sm text-slate-400">Last updated: November 2026 · EV HEXA</p>

        <div className="mt-6 space-y-5 rounded-2xl border border-[#251a45] bg-panel p-6 text-sm leading-relaxed text-slate-300">
          <section>
            <h2 className="font-display text-xl font-semibold text-white">1. Acceptance of Terms</h2>
            <p className="mt-1.5">
              By accessing or using EV HEXA, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please refrain from using the website.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-white">2. Indicative EV Pricing, Range &amp; Specifications</h2>
            <p className="mt-1.5">
              All vehicle prices, battery capacities, claimed or real-world driving range estimates, charging times, top speeds, subsidies, and side-by-side comparison figures published on EV HEXA are indicative and meant for general informational guidance only. Automakers frequently revise prices, variants, battery packs, and specifications—always confirm final details with the authorized manufacturer or dealer before booking or purchase.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-white">3. User Reviews, Ratings &amp; Comments</h2>
            <p className="mt-1.5">
              Reviews and comments reflect individual user opinions and do not constitute official engineering or legal advice. Users must not post spam, hate speech, defamatory remarks, false claims, or promotional links. EV HEXA reserves the right to moderate, edit, or delete any submission without prior notice.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-white">4. Intellectual Property Rights</h2>
            <p className="mt-1.5">
              The EV HEXA brand identity, original articles, comparisons, graphics, and site design are protected by applicable intellectual property laws. Vehicle brand names, logos, and trademarks belong to their respective manufacturers. You may share links to EV HEXA pages, but copying or republishing full articles or media without permission is prohibited.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-white">5. Third-Party Websites &amp; Disclaimers</h2>
            <p className="mt-1.5">
              Links to external websites, social channels, or embedded videos are provided for convenience. EV HEXA is not responsible for the accuracy, availability, or policies of external sites.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-white">6. Limitation of Liability &amp; Updates</h2>
            <p className="mt-1.5">
              EV HEXA is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis without warranties of uninterrupted availability or error-free data, and is not liable for indirect or consequential losses arising from site use. We may update these terms from time to time on this page.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}