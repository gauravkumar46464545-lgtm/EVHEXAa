"use client";
import { useEffect, useRef, useState } from "react";
import { VEHICLES, PAIRS, priceText, byId } from "@/lib/vehicles";
import {
  ArrowRight, BatteryCharging, ChevronLeft, ChevronRight, Gauge, X
} from "lucide-react";

const carSrc = (v) => v.photo || `/vehicles/ev-${v.img || 1}.png`;

function Head({ id, title, sub, action }) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
      <div>
        <h2 id={id} className="font-display text-2xl font-bold uppercase tracking-tight md:text-3xl">{title}</h2>
        {sub && <p className="mt-0.5 text-sm text-slate-400">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

function Scroller({ label, step = 300, children }) {
  const ref = useRef(null);
  const [at, setAt] = useState({ l: false, r: true });
  const sync = () => {
    const el = ref.current;
    if (!el) return;
    setAt({ l: el.scrollLeft > 8, r: el.scrollLeft + el.clientWidth < el.scrollWidth - 8 });
  };
  useEffect(() => {
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);
  const go = (d) => ref.current?.scrollBy({ left: d * step, behavior: "smooth" });
  const btn = "hidden md:grid place-items-center absolute top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full border border-[#36275f] bg-panel/95 shadow-lg hover:border-volt disabled:opacity-0 disabled:pointer-events-none transition-opacity";
  return (
    <div className="relative">
      <button type="button" onClick={() => go(-1)} disabled={!at.l} aria-label={`Scroll ${label} left`} className={`${btn} -left-3`}>
        <ChevronLeft size={20} />
      </button>
      <div
        ref={ref}
        onScroll={sync}
        role="region"
        aria-label={label}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(1);
          if (e.key === "ArrowLeft") go(-1);
        }}
        className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 focus:outline-none"
      >
        {children}
      </div>
      <button type="button" onClick={() => go(1)} disabled={!at.r} aria-label={`Scroll ${label} right`} className={`${btn} -right-3`}>
        <ChevronRight size={20} />
      </button>
    </div>
  );
}

/* ---------------- Popular EVs (Admin Editable) ---------------- */
function CarCard({ v, onPick, full }) {
  return (
    <article className={`${full ? "w-full" : "w-[264px] shrink-0 snap-start"} flex flex-col rounded-2xl border border-[#251a45] bg-panel p-3.5 transition-colors hover:border-[#36275f]`}>
      <div className="relative h-[136px] w-full overflow-hidden rounded-xl border border-[#251a45]">
        <img src={carSrc(v)} alt={`${v.brand} ${v.model}`} className="h-full w-full object-cover" loading="lazy" />
        {v.badge && (
          <span className="badge-tag absolute right-2 top-2 rounded-full bg-ink/85 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-volt backdrop-blur">
            {v.badge}
          </span>
        )}
      </div>
      <p className="mt-2.5 text-[11px] font-semibold uppercase tracking-[.16em] text-slate-500">{v.brand}</p>
      <h3 className="font-display text-xl font-bold leading-tight">{v.model}</h3>
      <p className="mt-1 text-xs text-slate-400">
        Starting <span className="font-semibold text-hexa">{priceText(Number(v.price || 0))}</span>
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2 border-t border-[#251a45] pt-2.5 text-xs">
        <div className="flex items-center gap-1.5">
          <Gauge size={16} className="shrink-0 text-volt" />
          <div>
            <p className="font-semibold leading-none">{v.speed} km/h</p>
            <p className="mt-0.5 text-[10px] text-slate-500">Top Speed</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <BatteryCharging size={16} className="shrink-0 text-volt" />
          <div>
            <p className="font-semibold leading-none">{v.range} km</p>
            <p className="mt-0.5 text-[10px] text-slate-500">Range</p>
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onPick(v)}
        className="mt-3 w-full rounded-xl border border-[#36275f] py-2 text-center text-xs font-semibold tracking-wide transition-colors hover:border-volt hover:text-volt"
      >
        View Details
      </button>
    </article>
  );
}

function CarModal({ v, onClose }) {
  useEffect(() => {
    const k = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, [onClose]);
  if (!v) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/75 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${v.brand} ${v.model}`}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl border border-[#36275f] bg-panel p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.18em] text-slate-500">{v.brand}</p>
            <h3 className="font-display text-3xl font-bold leading-tight">{v.model}</h3>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-lg border border-[#36275f] p-1.5 hover:border-volt">
            <X size={18} />
          </button>
        </div>
        <div className="mt-4 h-44 w-full overflow-hidden rounded-xl border border-[#251a45]">
          <img src={carSrc(v)} alt={`${v.brand} ${v.model}`} className="h-full w-full object-cover" />
        </div>
        <dl className="mt-4 grid grid-cols-3 gap-2 rounded-xl border border-[#251a45] p-3 text-center">
          <div><dt className="text-[11px] text-slate-500">Starting price</dt><dd className="mt-0.5 font-display text-lg font-bold text-hexa">{priceText(Number(v.price || 0))}</dd></div>
          <div><dt className="text-[11px] text-slate-500">Claimed range</dt><dd className="mt-0.5 font-display text-lg font-bold">{v.range} km</dd></div>
          <div><dt className="text-[11px] text-slate-500">Top speed</dt><dd className="mt-0.5 font-display text-lg font-bold">{v.speed} km/h</dd></div>
        </dl>
        <p className="mt-3 text-xs text-slate-500">Ex-showroom India indicative figures. Check local dealer for variant-wise battery options.</p>
      </div>
    </div>
  );
}

export function EvShowcase({ items = [] }) {
  const [all, setAll] = useState(false);
  const [pick, setPick] = useState(null);
  const list = items.length ? items : VEHICLES;

  return (
    <section id="popular" aria-labelledby="pop-h" className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-6 pt-5">
      <Head
        id="pop-h"
        title="Popular EVs"
        sub="India's most-searched electric cars at a glance."
        action={
          <button type="button" onClick={() => setAll(!all)} className="flex items-center gap-1 text-sm font-semibold text-volt hover:underline">
            {all ? "Show less" : "View All"} <ArrowRight size={16} />
          </button>
        }
      />
      {all ? (
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {list.map((v) => <CarCard key={v._id || v.id} v={v} onPick={setPick} full />)}
        </div>
      ) : (
        <Scroller label="Popular electric vehicles" step={276}>
          {list.map((v) => <CarCard key={v._id || v.id} v={v} onPick={setPick} />)}
        </Scroller>
      )}
      <CarModal v={pick} onClose={() => setPick(null)} />
    </section>
  );
}

/* ---------------- Compare Electric Vehicles (Admin Editable) ---------------- */
function Stat({ label, value, win }) {
  return (
    <div className="text-center">
      <p className="text-[10px] uppercase tracking-wide text-slate-500">{label}</p>
      <p className={`text-sm font-semibold ${win ? "text-hexa" : ""}`}>{value}</p>
    </div>
  );
}

function Side({ v, o, flip }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center px-2 text-center">
      <div className="relative h-[96px] w-full overflow-hidden rounded-xl border border-[#251a45]">
        <img
          src={v.photo || `/vehicles/ev-${v.img || 1}.png`}
          alt={`${v.brand} ${v.model}`}
          className={`h-full w-full object-cover ${flip ? "-scale-x-100" : ""}`}
          loading="lazy"
        />
      </div>
      <p className="mt-2.5 text-[11px] font-semibold uppercase tracking-[.16em] text-slate-500">{v.brand}</p>
      <h3 className="w-full truncate font-display text-lg font-bold leading-tight">{v.model}</h3>
      <div className="mt-2.5 w-full space-y-1.5 border-t border-[#251a45] pt-2.5">
        <Stat label="Starting price" value={priceText(Number(v.price || 0))} win={Number(v.price) < Number(o.price)} />
        <Stat label="Range" value={`${v.range} km`} win={Number(v.range) > Number(o.range)} />
        <Stat label="Top speed" value={`${v.speed} km/h`} win={Number(v.speed) > Number(o.speed)} />
      </div>
    </div>
  );
}

function CompareCard({ a, b, full }) {
  return (
    <article className={`${full ? "w-full" : "w-[360px] sm:w-[372px] shrink-0 snap-start"} relative flex min-h-[345px] rounded-2xl border border-[#251a45] bg-panel p-3.5`}>
      <Side v={a} o={b} flip />
      <div className="relative mx-1 w-px self-stretch bg-[#36275f]">
        <span className="vs-badge absolute left-1/2 top-1/2 grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-xs font-extrabold">VS</span>
      </div>
      <Side v={b} o={a} />
    </article>
  );
}

export function CompareEvs({ items = [] }) {
  const [all, setAll] = useState(false);
  const fallback = PAIRS.map(([x, y]) => ({ _id: x + y, carA: byId(x), carB: byId(y) }));
  const list = items.length ? items : fallback;

  return (
    <section id="compare" aria-labelledby="compare-h" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-6">
      <Head
        id="compare-h"
        title="Compare Electric Vehicles"
        sub="Side-by-side price, range and speed. The better value is highlighted."
        action={
          <button type="button" onClick={() => setAll(!all)} className="flex items-center gap-1 text-sm font-semibold text-volt hover:underline">
            {all ? "Show less" : "View All"} <ArrowRight size={16} />
          </button>
        }
      />
      {all ? (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => <CompareCard key={p._id} a={p.carA} b={p.carB} full />)}
        </div>
      ) : (
        <Scroller label="Compare electric vehicles" step={380}>
          {list.map((p) => <CompareCard key={p._id} a={p.carA} b={p.carB} />)}
        </Scroller>
      )}
    </section>
  );
}