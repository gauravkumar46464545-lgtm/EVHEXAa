"use client";
import { useState } from "react";
import Link from "next/link";
import ThemeMenu from "@/components/ThemeMenu";
import { ArrowLeft, CheckCircle2, Mail, MapPin, Phone, Zap } from "lucide-react";

export const dynamic = "force-dynamic";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const subj = encodeURIComponent(form.subject || `Inquiry from ${form.name}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone || "N/A"}\n\nMessage:\n${form.message}`
    );
    window.location.href = `mailto:contact@evhexa.com?subject=${subj}&body=${body}`;
    setSent(true);
  };

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

      <main className="mx-auto max-w-5xl px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-volt hover:underline">
          <ArrowLeft size={14} /> Back to Home
        </Link>
        <h1 className="mt-2 font-display text-3xl font-bold uppercase md:text-4xl">Contact Us</h1>
        <p className="mt-1 text-sm text-slate-400">
          Have a question, EV press release, feedback, or partnership inquiry? Reach out to EV HEXA.
        </p>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.15fr]">
          <div className="rounded-2xl border border-[#251a45] bg-panel p-6 text-sm text-slate-300">
            <h2 className="font-display text-xl font-semibold text-white">EV HEXA Office Details</h2>
            <ul className="mt-4 space-y-3.5">
              <li className="flex items-start gap-2.5">
                <Phone size={16} className="mt-0.5 shrink-0 text-volt" />
                <a href="tel:+910000000000" className="hover:text-volt">+91 00000 00000</a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail size={16} className="mt-0.5 shrink-0 text-volt" />
                <a href="mailto:contact@evhexa.com" className="hover:text-volt">contact@evhexa.com</a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin size={16} className="mt-0.5 shrink-0 text-volt" />
                <span>Flat No. D-58, 12M-3-8, Gandhinagar, Sigra, Varanasi, U.P.-221010</span>
              </li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 rounded-2xl border border-[#251a45] bg-panel p-6">
            <h2 className="font-display text-xl font-semibold text-white">Send a Message</h2>
            <input
              className="inp"
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                type="email"
                className="inp"
                placeholder="Your email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <input
                type="tel"
                className="inp"
                placeholder="Phone number (optional)"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <input
              className="inp"
              placeholder="Subject (e.g. EV Review, Collaboration, Feedback)"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
            />
            <textarea
              className="inp"
              rows={4}
              placeholder="Write your message here..."
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
              Send Message
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}