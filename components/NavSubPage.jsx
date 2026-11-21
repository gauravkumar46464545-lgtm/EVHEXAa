"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import ThemeMenu from "@/components/ThemeMenu";
import { VEHICLES, PAIRS, priceText, byId } from "@/lib/vehicles";
import { ArrowLeft, BatteryCharging, Gauge, ExternalLink } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "HOME" },
  { href: "/e-vehicles", label: "E-VEHICLES" },
  { href: "/brands", label: "BRANDS" },
  { href: "/compare", label: "COMPARE" },
  { href: "/news", label: "NEWS" },
  { href: "/blogs", label: "BLOGS" },
  { href: "/videos", label: "VIDEOS" },
];

const carSrc = (v) => v.photo || `/vehicles/ev-${v.img}.png`;

export default function NavSubPage({ section, title, subtitle }) {
  const [articles, setArticles] = useState([]);
  const [news, setNews] = useState([]);
  const [features, setFeatures] = useState([]);
  const [brand, setBrand] = useState("ALL");

  useEffect(() => {
    fetch("/api/articles").then((r) => r.json()).then((d) => Array.isArray(d) && setArticles(d)).catch(() => {});
    fetch("/api/news").then((r) => r.json()).then((d) => Array.isArray(d) && setNews(d)).catch(() => {});
    fetch("/api/features").then((r) => r.json()).then((d) => Array.isArray(d) && setFeatures(d)).catch(() => {});
  }, []);

  const brands = ["ALL", ...new Set(VEHICLES.map((v) => v.brand))];
  const filteredVehicles = brand === "ALL" ? VEHICLES : VEHICLES.filter((v) => v.brand === brand);

  return (
    <div className="min-h-screen">
      {/* Header with Top Utility Bar + Direct Nav Links */}
      <header className="sticky top-0 z-30 border-b border-[#251a45] bg-ink/90 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3">
          <Link href="/" className="flex items-center gap-3">
            <span className="block h-[50px] w-[50px] shrink-0 overflow-hidden rounded-full border-2 border-[#de910c] p-[2px] ring-2 ring-[#f4b942]/70">
              <img src="/logo.png" alt="EV HEXA" className="h-full w-full rounded-full object-cover" />
            </span>
            <span className="font-display text-2xl font-extrabold italic leading-none tracking-tight">
              <span>EV</span>
              <span className="text-hexa">HEXA</span>
            </span>
          </Link>

          <div className="hidden items-center gap-5 text-sm font-bold tracking-wide lg:flex">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-volt"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <ThemeMenu />
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-volt hover:underline">
              <ArrowLeft size={14} /> Back to Home
            </Link>
            <h1 className="mt-2 font-display text-3xl font-bold uppercase md:text-4xl">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-slate-400">{subtitle}</p>}
          </div>

          <div className="flex flex-wrap gap-2 lg:hidden">
            {NAV_ITEMS.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-full border border-[#36275f] px-3 py-1 text-xs font-semibold hover:border-volt">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* 1. E-VEHICLES & BRANDS */}
        {(section === "e-vehicles" || section === "brands") && (
          <>
            {section === "brands" && (
              <div className="mb-6 flex flex-wrap gap-2">
                {brands.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBrand(b)}
                    className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                      brand === b ? "btn" : "border border-[#36275f] bg-panel hover:border-volt"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredVehicles.map((v) => (
                <article key={v.id} className="flex flex-col rounded-2xl border border-[#251a45] bg-panel p-3.5">
                  <div className="h-36 w-full overflow-hidden rounded-xl border border-[#251a45]">
                    <img src={carSrc(v)} alt={`${v.brand} ${v.model}`} className="h-full w-full object-cover" />
                  </div>
                  <p className="mt-2.5 text-[11px] font-semibold uppercase tracking-[.16em] text-slate-500">{v.brand}</p>
                  <h2 className="font-display text-xl font-bold">{v.model}</h2>
                  <p className="mt-1 text-xs text-slate-400">Starting <span className="font-semibold text-hexa">{priceText(v.price)}</span></p>
                  <div className="mt-3 grid grid-cols-2 gap-2 border-t border-[#251a45] pt-2.5 text-xs">
                    <div className="flex items-center gap-1.5">
                      <Gauge size={15} className="text-volt" />
                      <span>{v.speed} km/h</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <BatteryCharging size={15} className="text-volt" />
                      <span>{v.range} km</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}

        {/* 2. COMPARE */}
        {section === "compare" && (
          <div className="grid gap-4 md:grid-cols-2">
            {PAIRS.map(([x, y]) => {
              const a = byId(x);
              const b = byId(y);
              if (!a || !b) return null;
              return (
                <article key={x + y} className="flex rounded-2xl border border-[#251a45] bg-panel p-4">
                  {[a, b].map((v, idx) => (
                    <div key={v.id} className={`flex-1 px-2 text-center ${idx === 0 ? "border-r border-[#36275f]" : ""}`}>
                      <img src={carSrc(v)} alt={v.model} className="mx-auto h-24 w-full rounded-xl object-cover" />
                      <p className="mt-2 text-[11px] font-semibold uppercase text-slate-500">{v.brand}</p>
                      <h2 className="font-display text-lg font-bold">{v.model}</h2>
                      <p className="mt-1 text-sm font-semibold text-hexa">{priceText(v.price)}</p>
                      <p className="text-xs text-slate-400">Range: {v.range} km · Top: {v.speed} km/h</p>
                    </div>
                  ))}
                </article>
              );
            })}
          </div>
        )}

        {/* 3. NEWS */}
        {section === "news" && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {!news.length ? (
              <p className="rounded-xl border border-dashed border-[#36275f] p-6 text-sm text-slate-400">
                No live news items in database yet. You can add news from the Admin Panel on the home page.
              </p>
            ) : (
              news.map((n) => (
                <article key={n._id} className="overflow-hidden rounded-2xl border border-[#251a45] bg-panel">
                  {n.image && <img src={n.image} alt={n.title} className="h-40 w-full object-cover" />}
                  <div className="p-4">
                    <h2 className="font-display text-xl font-bold">{n.title}</h2>
                    <p className="mt-1.5 text-sm text-slate-400">{n.summary}</p>
                    {n.link && (
                      <a href={n.link} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-volt hover:underline">
                        Source link <ExternalLink size={13} />
                      </a>
                    )}
                  </div>
                </article>
              ))
            )}
          </div>
        )}

        {/* 4. BLOGS / ARTICLES */}
        {section === "blogs" && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => (
              <Link key={a._id} href={`/articles/${a.slug || a._id}`} className="block overflow-hidden rounded-2xl border border-[#251a45] bg-panel hover:border-volt">
                {a.image && <img src={a.image} alt={a.title} className="h-44 w-full object-cover" />}
                <div className="p-4">
                  <h2 className="font-display text-xl font-semibold">{a.title}</h2>
                  <p className="mt-1.5 line-clamp-3 text-sm text-slate-400">{a.content}</p>
                  <p className="mt-3 text-xs text-slate-500">By {a.author}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* 5. VIDEOS & HIGHLIGHTS */}
        {section === "videos" && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <article key={f._id} className="overflow-hidden rounded-2xl border border-[#251a45] bg-panel">
                {f.media && <img src={f.media} alt={f.title} className="h-44 w-full object-cover" />}
                <div className="p-4">
                  <span className="rounded bg-hexa/15 px-2 py-0.5 text-xs text-hexa">{f.badge}</span>
                  <h2 className="mt-2 font-display text-xl font-semibold">{f.title}</h2>
                  <p className="mt-1 text-sm text-slate-400">{f.description}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}