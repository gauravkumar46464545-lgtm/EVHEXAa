"use client";
import Link from "next/link";
import ThemeMenu from "@/components/ThemeMenu";
import { ArrowLeft, Zap } from "lucide-react";

export const dynamic = "force-dynamic";

export default function PrivacyPage() {
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
        <h1 className="mt-2 font-display text-3xl font-bold uppercase md:text-4xl">Privacy Policy</h1>
        <p className="mt-1 text-sm text-slate-400">Last updated: November 2026 · EV HEXA</p>

        <div className="mt-6 space-y-5 rounded-2xl border border-[#251a45] bg-panel p-6 text-sm leading-relaxed text-slate-300">
          <section>
            <h2 className="font-display text-xl font-semibold text-white">1. Overview</h2>
            <p className="mt-1.5">
              EV HEXA is an electric vehicle digital media platform covering EV launches, pricing, charging infrastructure, vehicle comparisons, news, articles, and owner reviews in India. This Privacy Policy explains how we handle information when you browse our website or interact with its features.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-white">2. Information You Provide</h2>
            <p className="mt-1.5">
              We collect only the details you voluntarily submit—such as your name, star rating, and review or comment when posting feedback on an electric vehicle or article, or your name, email, phone number, and message when contacting us or applying for a role.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-white">3. How We Use Collected Information</h2>
            <p className="mt-1.5">
              Submitted reviews and comments are published to help EV buyers and owners share real-world experiences. Contact details are used solely to reply to inquiries, press/partnership requests, or career applications, and to protect the platform against spam or misuse.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-white">4. Cookies, Storage &amp; Technical Logs</h2>
            <p className="mt-1.5">
              EV HEXA uses standard browser storage and server/hosting logs to keep pages fast, maintain layout/theme settings, and diagnose technical errors during site delivery.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-white">5. Third-Party Links &amp; Media</h2>
            <p className="mt-1.5">
              Our articles, news cards, and video sections may link to or embed third-party services such as YouTube, Instagram, LinkedIn, or manufacturer pages. Those platforms govern their own data practices under their respective privacy policies.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-white">6. Data Retention &amp; Contact</h2>
            <p className="mt-1.5">
              We retain public reviews, comments, and editorial records while relevant to the platform or until removal is requested. To ask questions or request review/comment removal, write to{" "}
              <span className="font-semibold text-volt">contact@evhexa.com</span>.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}