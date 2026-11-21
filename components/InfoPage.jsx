"use client";
import Link from "next/link";
import ThemeMenu from "@/components/ThemeMenu";
import { ArrowLeft, Mail, MapPin, Phone } from "lucide-react";

export default function InfoPage({ title, subtitle, type }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-[#251a45] bg-ink/90 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/" className="flex items-center gap-3">
            <span className="block h-[50px] w-[50px] shrink-0 overflow-hidden rounded-full border-2 border-[#de910c] p-[2px] ring-2 ring-[#f4b942]/70">
              <img src="/logo.png" alt="EV HEXA" className="h-full w-full rounded-full object-cover" />
            </span>
            <span className="font-display text-2xl font-extrabold italic leading-none tracking-tight">
              <span>EV</span>
              <span className="text-hexa">HEXA</span>
            </span>
          </Link>
          <ThemeMenu />
        </nav>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-volt hover:underline">
          <ArrowLeft size={14} /> Back to Home
        </Link>
        <h1 className="mt-2 font-display text-3xl font-bold uppercase md:text-4xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-400">{subtitle}</p>}

        <div className="mt-6 space-y-4 rounded-2xl border border-[#251a45] bg-panel p-6 text-sm leading-relaxed text-slate-300">
          {type === "privacy" && (
            <>
              <p>EV HEXA respects your privacy. We only collect minimal information needed to display user reviews, comments, or direct inquiries sent by you.</p>
              <p>We do not sell or rent personal visitor data to third parties. Media uploads and analytics follow standard security practices.</p>
            </>
          )}

          {type === "terms" && (
            <>
              <p>Prices, battery range, charging times, and vehicle specifications listed on EV HEXA are indicative and for informational purposes. Always confirm final figures with the official manufacturer or dealer.</p>
              <p>By using EV HEXA, you agree not to post spam, abusive language, or misleading information in reviews or comments.</p>
            </>
          )}

          {type === "career" && (
            <>
              <p>EV HEXA is growing its automotive and electric vehicle coverage across India. We welcome writers, EV reviewers, video editors, and researchers passionate about clean mobility.</p>
              <p>Send your portfolio or sample work to <span className="font-semibold text-volt">contact@evhexa.com</span> with the role in the subject line.</p>
            </>
          )}

          {type === "contact" && (
            <ul className="space-y-3">
              <li className="flex items-center gap-2.5"><Phone size={16} className="text-volt" /><span>+91 00000 00000</span></li>
              <li className="flex items-center gap-2.5"><Mail size={16} className="text-volt" /><span>contact@evhexa.com</span></li>
              <li className="flex items-center gap-2.5"><MapPin size={16} className="text-volt" /><span>Flat No. D-58, 12M-3-8, Gandhinagar, Sigra, Varanasi, U.P.-221010</span></li>
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}