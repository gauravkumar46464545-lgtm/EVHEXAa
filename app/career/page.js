"use client";
import { useState } from "react";
import Link from "next/link";
import ThemeMenu from "@/components/ThemeMenu";
import { ArrowLeft, Briefcase, CheckCircle2, Mail } from "lucide-react";

export const dynamic = "force-dynamic";

const ROLES = [
  "EV News & Review Writer",
  "Short-Form Video & Reels Editor (YouTube / Instagram)",
  "EV Testing & Spec Researcher",
];

export default function CareerPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: ROLES[0],
    portfolio: "",
    message: "",
  });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Career Application: ${form.role} — ${form.name}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nRole: ${form.role}\nPortfolio / Link: ${form.portfolio || "N/A"}\n\nAbout:\n${form.message}`
    );
    window.location.href = `mailto:contact@evhexa.com?subject=${subject}&body=${body}`;
    setSent(true);
  };

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

      <main className="mx-auto max-w-5xl px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-volt hover:underline">
          <ArrowLeft size={14} /> Back to Home
        </Link>
        <h1 className="mt-2 font-display text-3xl font-bold uppercase md:text-4xl">Careers at EV HEXA</h1>
        <p className="mt-1 text-sm text-slate-400">
          Build India&apos;s electric vehicle media coverage with us—remote and flexible collaboration options.
        </p>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.15fr]">
          <div className="space-y-4">
            <div className="rounded-2xl border border-[#251a45] bg-panel p-5 text-sm leading-relaxed text-slate-300">
              <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-white">
                <Briefcase size={18} className="text-volt" /> Open Opportunities
              </h2>
              <p className="mt-2">
                We look for clear writers, accurate spec researchers, and sharp video editors who care about electric mobility.
              </p>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-slate-300">
                {ROLES.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
              <p className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                <Mail size={14} className="text-volt" /> Direct email:{" "}
                <a href="mailto:contact@evhexa.com" className="font-semibold text-volt hover:underline">
                  contact@evhexa.com
                </a>
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 rounded-2xl border border-[#251a45] bg-panel p-6">
            <h2 className="font-display text-xl font-semibold text-white">Apply Now</h2>
            <input
              className="inp"
              placeholder="Your full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              type="email"
              className="inp"
              placeholder="Your email address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <select
              className="inp"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <input
              type="url"
              className="inp"
              placeholder="Portfolio / YouTube / Instagram / LinkedIn link (optional)"
              value={form.portfolio}
              onChange={(e) => setForm({ ...form, portfolio: e.target.value })}
            />
            <textarea
              className="inp"
              rows={4}
              placeholder="Tell us briefly about your experience and why you want to join EV HEXA"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
            />
            {sent && (
              <p className="flex items-center gap-1.5 text-xs text-hexa" role="status">
                <CheckCircle2 size={15} /> Mail draft prepared for contact@evhexa.com.
              </p>
            )}
            <button type="submit" className="btn w-full">
              Send Application
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}