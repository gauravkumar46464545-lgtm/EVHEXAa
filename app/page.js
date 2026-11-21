"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Media from "@/components/Media";
import CarRig from "@/components/CarRig";
import { EvShowcase, CompareEvs } from "@/components/EvSections";
import ThemeMenu from "@/components/ThemeMenu";
import FaqSection from "@/components/FaqSection";
import {
  Instagram, Youtube, Linkedin,
  Star, Phone, Mail, MapPin, Lock, X,
  ChevronLeft, ChevronRight, ExternalLink, Zap
} from "lucide-react";

/* ===== DIRECT HERO EV NEWS (Topic-wise real photos) ===== */
const HERO_NEWS = [
  {
    tag: "NEW EV LAUNCH",
    title: "Tata Harrier EV & Sierra EV India Launch Timeline Confirmed",
    summary: "Dual-motor AWD aur 500+ km real-world range ke saath nayi SUV lineup jaldi aane wali hai. Isme fast charging, V2L support aur naya connected cabin milega.",
    image: "https://images.unsplash.com/photo-1585011664466-b7bbe92f34ef?auto=format&fit=crop&w=1600&q=80",
    link: "#articles",
  },
  {
    tag: "CHARGING UPDATE",
    title: "India Mein 25,000+ Naye Fast Charging Stations Ka Expansion",
    summary: "National highways par 800V ultra-fast chargers lagne se long-distance EV travel aur aasan hoga. 10 se 80% charge ab sirf 20–25 minute mein possible hoga.",
    image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1600&q=80",
    link: "#articles",
  },
  {
    tag: "OWNER REVIEWS",
    title: "Mahindra BE 6 & XEV 9e: Real-World Range & Highway Test",
    summary: "Blade battery technology aur futuristic cabin ke saath highway test results saamne aaye. Owners ne ride comfort aur regen braking ko top rating di hai.",
    image: "https://images.unsplash.com/photo-1738101001592-d135bfe87d35?auto=format&fit=crop&w=1600&q=80",
    link: "#reviews",
  },
  {
    tag: "EV SCOOTERS & POLICY",
    title: "PM E-DRIVE Scheme: Electric Scooters & Cars Par Naye Benefits",
    summary: "Nayi EV kharidne par road tax waiver aur charging infrastructure subsidies jari rahengi, jisse 2-wheeler aur 4-wheeler buyers ko seedha fayda milega.",
    image: "https://images.unsplash.com/photo-1594054763281-0946baaad462?auto=format&fit=crop&w=1600&q=80",
    link: "#popular",
  },
];

const fmt = (d) => {
  const x = new Date(d);
  const date = x.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "Asia/Kolkata" });
  const time = x.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: "Asia/Kolkata" });
  return `Posted on: ${date} at ${time}`;
};
const short = (d) => fmt(d).replace("Posted on: ", "");
const api = async (url, opt = {}, pw) => {
  const r = await fetch(url, { ...opt, headers: { "Content-Type": "application/json", ...(pw ? { "x-admin-password": pw } : {}) } });
  const j = await r.json(); if (!r.ok) throw new Error(j.error || "Request failed"); return j;
};
const post = (url, body, pw) => api(url, { method: "POST", body: JSON.stringify(body) }, pw);
const Img = ({ src, className, alt = "" }) => src ? <img src={src} alt={alt} className={className} loading="lazy" /> : <div className={className + " bg-gradient-to-br from-panel to-[#2a1250]"} />;
const Stars = ({ value, onPick }) => (
  <div className="flex gap-1">{[1, 2, 3, 4, 5].map((n) => (
    <button type="button" key={n} onClick={() => onPick?.(n)} aria-label={`${n} star`} disabled={!onPick}>
      <Star size={onPick ? 26 : 16} className={n <= value ? "fill-hexa text-hexa" : "text-slate-600"} /></button>))}</div>
);

export default function Home() {
  const [news, setNews] = useState([]);
  const [features, setFeatures] = useState([]);
  const [articles, setArticles] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [compares, setCompares] = useState([]);
  const [msg, setMsg] = useState("");

  const load = async () => {
    const [f, a, r, n, v, c] = await Promise.all([
      api("/api/features"),
      api("/api/articles"),
      api("/api/reviews"),
      api("/api/news").catch(() => []),
      api("/api/vehicles").catch(() => []),
      api("/api/compares").catch(() => []),
    ]);
    setFeatures(f);
    setArticles(a);
    setReviews(r);
    setNews(n);
    setVehicles(v);
    setCompares(c);
  };

  useEffect(() => { load().catch((e) => setMsg(e.message)); }, []);

  return (
    <div>
      <header className="sticky top-0 z-30 border-b border-[#251a45] bg-ink/90 backdrop-blur">
        {/* Clean & Readable Top Utility Bar */}
        <div className="border-b border-[#251a45] bg-panel text-xs text-slate-300">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-2">
            <div className="flex items-center gap-3 font-medium">
              <a href="tel:+910000000000" className="flex items-center gap-1.5 hover:text-volt">
                <Phone size={13} className="text-volt" />
                <span>+91 00000 00000</span>
              </a>
              <span className="opacity-35">|</span>
              <a href="mailto:contact@evhexa.com" className="flex items-center gap-1.5 hover:text-volt">
                <Mail size={13} className="text-volt" />
                <span>contact@evhexa.com</span>
              </a>
            </div>
            <div className="hidden items-center gap-4 md:flex">
              <div className="flex items-center gap-3">
                <a href="https://www.instagram.com/evhexa.it/" target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-volt"><Instagram size={14} /></a>
                <a href="https://www.youtube.com/@EVHEXA" target="_blank" rel="noreferrer" aria-label="YouTube" className="hover:text-volt"><Youtube size={14} /></a>
                <a href="#" aria-label="LinkedIn" className="hover:text-volt"><Linkedin size={14} /></a>
              </div>
              <span className="opacity-35">|</span>
              <div className="flex items-center gap-3 font-semibold tracking-wide">
                <Link href="/privacy" className="hover:text-volt">PRIVACY</Link>
                <span className="opacity-35">|</span>
                <Link href="/terms" className="hover:text-volt">TERMS &amp; CONDITIONS</Link>
                <span className="opacity-35">|</span>
                <Link href="/career" className="hover:text-volt">CAREER</Link>
                <span className="opacity-35">|</span>
                <Link href="/contact" className="hover:text-volt">CONTACT US</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navbar: Green & Black Framed Circular Logo + EVHEXA */}
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-[15px]">
          <a href="#top" aria-label="EV HEXA home" className="flex items-center gap-3">
            <span className="block h-[58px] w-[58px] shrink-0 overflow-hidden rounded-full border-2 border-[#16a34a] p-[2px] ring-2 ring-[#22c55e]/60 shadow-[0_0_14px_rgba(22,163,74,0.35)]">
              <img src="/logo.png" alt="EV HEXA" className="h-full w-full rounded-full object-cover" />
            </span>
            <span className="inline-flex items-center font-display text-3xl font-extrabold not-italic leading-none tracking-tight">
              <span className="text-[#16a34a]">EV</span>
              <Zap size={20} className="mx-0.5 fill-[#16a34a] text-[#16a34a]" />
              <span className="text-[#111827]">HEXA</span>
            </span>
          </a>
          <div className="flex items-center">
            <ThemeMenu />
          </div>
        </nav>
      </header>

      <main id="top">
        {/* Hero EV News Slider (Full Banner Tap-to-Open + Auto Slide + Car & Road) */}
        <HeroNewsBoard news={news} />

        <EvShowcase items={vehicles} />

        {msg && <p className="mx-auto mt-4 max-w-6xl px-4 text-sm text-red-400" role="alert">{msg}</p>}

        <section id="features" className="mx-auto max-w-6xl px-4 py-6">
          <h2 className="font-display text-3xl font-semibold">Featured highlights</h2>
          {!features.length && <p className="mt-3 text-slate-500">No highlights yet. The admin can add the first one.</p>}
          <div className="mt-4 grid grid-cols-2 items-start gap-3 md:grid-cols-3 lg:grid-cols-4">
            {features.map((f) => (
              <article key={f._id} className="overflow-hidden rounded-lg border border-[#251a45] bg-panel">
                <Media src={f.media} type={f.mediaType} w={f.mediaW} h={f.mediaH} alt={f.title} />
                <div className="p-3"><span className="rounded bg-hexa/15 px-1.5 py-0.5 text-[11px] text-hexa">{f.badge}</span>
                  <h3 className="mt-1.5 font-display text-base font-semibold leading-snug">{f.title}</h3>
                  <p className="mt-1 line-clamp-2 text-xs text-slate-400">{f.description}</p>
                  <p className="mt-2 text-[11px] text-slate-500">{fmt(f.createdAt)}</p></div>
              </article>))}
          </div>
        </section>

        <section id="articles" className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="font-display text-3xl font-semibold">Latest articles</h2>
          {!articles.length && <p className="mt-4 text-slate-500">No articles published yet.</p>}
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => (
              <Link key={a._id} href={`/articles/${a.slug || a._id}`} className="block overflow-hidden rounded-xl border border-[#251a45] bg-panel hover:border-volt">
                <Img src={a.image} alt={a.title} className="h-44 w-full object-cover" />
                <div className="p-4"><h3 className="font-display text-xl font-semibold">{a.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-400">{a.content}</p>
                  <p className="mt-3 text-xs text-slate-500">By {a.author} · {fmt(a.createdAt)}</p>
                  <p className="mt-2 flex gap-4 text-xs text-slate-400"><span>👍 {a.likes}</span><span>👎 {a.dislikes}</span><span>💬 {a.comments.length}</span></p></div>
              </Link>))}
          </div>
        </section>

        <CompareEvs items={compares} />
        <ReviewSection reviews={reviews} onAdded={(r) => setReviews([r, ...reviews])} />
        <FaqSection />
      </main>

      <footer id="contact" className="mt-10 border-t border-[#251a45] bg-panel">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-2">
          <div>
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 overflow-hidden rounded-full border-2 border-[#16a34a] p-[2px] ring-2 ring-[#22c55e]/60 shadow-[0_0_12px_rgba(22,163,74,0.35)]">
                <img src="/logo.png" alt="EV HEXA" className="h-full w-full rounded-full object-cover" />
              </div>
              <span className="inline-flex items-center font-display text-3xl font-extrabold not-italic leading-none tracking-tight">
                <span className="text-[#16a34a]">EV</span>
                <Zap size={20} className="mx-0.5 fill-[#16a34a] text-[#16a34a]" />
                <span className="text-[#111827]">HEXA</span>
              </span>
            </div>
            <p className="mt-3 max-w-sm text-sm text-slate-400">
              EV HEXA covers electric vehicle news, launches, charging updates and honest owner reviews from India.
            </p>
          </div>
          <div>
            <p className="font-display text-xl font-semibold">Contact</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-400">
              <li className="flex gap-2"><Phone size={16} />+91 00000 00000</li>
              <li className="flex gap-2"><Mail size={16} />contact@evhexa.com</li>
              <li className="flex gap-2"><MapPin size={16} />Flat No. D-58, 12M-3-8, Gandhinagar, Sigra, Varanasi, U.P.-221010</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[#251a45]">
          <div className="mx-auto grid max-w-6xl items-center gap-3 px-4 py-4 text-sm text-slate-500 md:grid-cols-3">
            <span className="hidden md:block" />
            <p className="text-center">Developed by Nexworktech</p>
            <Link
              href="/admin"
              className="flex items-center justify-center gap-1 justify-self-center rounded-lg border border-[#36275f] px-3 py-1.5 hover:border-volt hover:text-volt md:justify-self-end"
            >
              <Lock size={14} />Admin Panel
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ---------------- Hero EV News Slider (Full Banner Tap-to-Open + Auto Slide + Car & Road) ---------------- */
function HeroNewsBoard({ news = [] }) {
  const slides = [
    ...news.map((n) => ({
      tag: "LIVE EV NEWS",
      title: n.title,
      summary: n.summary,
      image: n.image || "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1600&q=80",
      link: n.link || "",
    })),
    ...HERO_NEWS,
  ];

  const [idx, setIdx] = useState(0);
  const [activeNews, setActiveNews] = useState(null);
  const touchX = useRef(0);

  const prevSlide = (e) => {
    e?.stopPropagation();
    setIdx((p) => (p - 1 + slides.length) % slides.length);
  };
  const nextSlide = (e) => {
    e?.stopPropagation();
    setIdx((p) => (p + 1) % slides.length);
  };

  useEffect(() => {
    if (activeNews) return;
    const timer = setInterval(() => {
      setIdx((p) => (p + 1) % slides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [activeNews, slides.length]);

  useEffect(() => {
    if (!activeNews) return;
    const esc = (e) => { if (e.key === "Escape") setActiveNews(null); };
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [activeNews]);

  return (
    <>
      <section
        id="news"
        className="relative overflow-hidden border-b border-[#251a45] bg-[#120f2a]"
        onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          const diff = touchX.current - e.changedTouches[0].clientX;
          if (diff > 45) nextSlide();
          else if (diff < -45) prevSlide();
        }}
      >
        {/* Sliding News Track */}
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${idx * 100}%)` }}
        >
          {slides.map((item, i) => (
            <div
              key={i}
              onClick={() => setActiveNews(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && setActiveNews(item)}
              aria-label={`Open news: ${item.title}`}
              className="relative w-full shrink-0 cursor-pointer bg-cover bg-center"
              style={{ backgroundImage: `url(${item.image})` }}
            >
              {/* Dark gradient taaki har topic photo ke upar text crisp dikhe */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#0e0b16]/90 via-[#0e0b16]/65 to-[#0e0b16]/25" />

              <div className="relative z-10 mx-auto max-w-6xl px-12 pb-40 pt-8 md:px-14 md:pb-44 md:pt-10">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#f4b942] px-3 py-1 text-xs font-bold tracking-widest text-[#1c1408]">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[#1c1408]" />
                  {item.tag}
                </span>
                <h1 className="mt-3 max-w-2xl font-display text-3xl font-bold leading-tight text-white md:text-5xl">
                  {item.title}
                </h1>
                <p className="mt-2 line-clamp-2 max-w-xl text-sm text-slate-200 md:text-base">
                  {item.summary}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <span className="btn inline-block">Read more</span>
                  <a
                    href="#reviews"
                    onClick={(e) => e.stopPropagation()}
                    className="rounded-full border border-white/35 bg-black/35 px-5 py-2 text-sm font-semibold text-white backdrop-blur hover:border-[#f4b942]"
                  >
                    Write a review
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Left & Right Manual Arrows */}
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Previous news"
          className="absolute left-2.5 top-[38%] z-30 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-[#f4b942]/60 bg-black/55 text-white backdrop-blur transition hover:bg-[#f4b942] hover:text-[#1c1408] md:left-4"
        >
          <ChevronLeft size={22} />
        </button>
        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next news"
          className="absolute right-2.5 top-[38%] z-30 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-[#f4b942]/60 bg-black/55 text-white backdrop-blur transition hover:bg-[#f4b942] hover:text-[#1c1408] md:right-4"
        >
          <ChevronRight size={22} />
        </button>

        {/* Slide Indicator Dots */}
        <div className="absolute bottom-36 right-6 z-20 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={(e) => { e.stopPropagation(); setIdx(i); }}
              aria-label={`News slide ${i + 1}`}
              className={`h-2 rounded-full transition-all ${i === idx ? "w-7 bg-[#f4b942]" : "w-2 bg-white/45 hover:bg-white/80"}`}
            />
          ))}
        </div>

        {/* Car & Road As-Is */}
        <MovingCar />
      </section>

      {/* Tap-to-Open News & Full Photo Modal */}
      {activeNews && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setActiveNews(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={activeNews.title}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl overflow-hidden rounded-2xl border-2 border-[#f4b942]/60 bg-panel shadow-2xl"
          >
            <div className="relative">
              <img src={activeNews.image} alt={activeNews.title} className="max-h-[380px] w-full object-cover" />
              <button
                type="button"
                onClick={() => setActiveNews(null)}
                aria-label="Close"
                className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-black/70 text-white hover:bg-[#f4b942] hover:text-[#1c1408]"
              >
                <X size={18} />
              </button>
              <span className="absolute bottom-3 left-4 rounded-full bg-[#f4b942] px-3 py-1 text-xs font-bold tracking-widest text-[#1c1408]">
                {activeNews.tag}
              </span>
            </div>
            <div className="p-6">
              <h2 className="font-display text-2xl font-bold leading-snug md:text-3xl">{activeNews.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-300 md:text-base">{activeNews.summary}</p>
              <div className="mt-5 flex flex-wrap items-center justify-end gap-3">
                {activeNews.link && (
                  <a
                    href={activeNews.link}
                    target={activeNews.link.startsWith("http") ? "_blank" : undefined}
                    rel={activeNews.link.startsWith("http") ? "noreferrer" : undefined}
                    onClick={() => !activeNews.link.startsWith("http") && setActiveNews(null)}
                    className="btn inline-flex items-center gap-2"
                  >
                    Read full update <ExternalLink size={15} />
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setActiveNews(null)}
                  className="rounded-full border border-[#36275f] px-5 py-2 text-sm font-semibold hover:border-volt"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ReviewSection({ reviews, onAdded }) {
  const [f, setF] = useState({ name: "", rating: 5, text: "" }); const [err, setErr] = useState("");
  const send = async (e) => { e.preventDefault(); try { onAdded(await post("/api/reviews", f)); setF({ name: "", rating: 5, text: "" }); setErr(""); } catch (x) { setErr(x.message); } };
  return (
    <section id="reviews" className="mx-auto max-w-6xl px-4 py-14">
      <h2 className="font-display text-3xl font-semibold">User reviews</h2>
      <div className="mt-6 grid gap-8 lg:grid-cols-[360px_1fr]">
        <form onSubmit={send} className="space-y-3 self-start rounded-xl border border-[#251a45] bg-panel p-5">
          <input className="inp" placeholder="Your name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} required />
          <Stars value={f.rating} onPick={(n) => setF({ ...f, rating: n })} />
          <textarea className="inp" rows={4} placeholder="Your review of an EV or EV HEXA" value={f.text} onChange={(e) => setF({ ...f, text: e.target.value })} required />
          {err && <p className="text-sm text-red-400">{err}</p>}
          <button className="btn w-full">Submit review</button></form>
        <div className="grid gap-4 sm:grid-cols-2">
          {!reviews.length && <p className="text-slate-500">No reviews yet. Be the first to write one.</p>}
          {reviews.map((r) => (
            <div key={r._id} className="rounded-xl border border-[#251a45] bg-panel p-4"><Stars value={r.rating} />
              <p className="mt-2 text-sm text-slate-300">{r.text}</p>
              <p className="mt-3 text-sm font-medium">{r.name}</p><p className="text-xs text-slate-500">{short(r.createdAt)}</p></div>))}
        </div>
      </div>
    </section>);
}

function MovingCar() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-40 overflow-hidden" aria-hidden="true">
      <div className="hero-road" />
      <div className="drive absolute bottom-[33px] left-0"><CarRig className="hero-rig" /></div>
    </div>);
}