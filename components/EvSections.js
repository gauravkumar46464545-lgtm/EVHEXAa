"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, BatteryCharging, ChevronLeft, ChevronRight, Gauge, Newspaper, Search, X } from "lucide-react";
import { VEHICLES, PAIRS, BUDGETS, RANGES, inBudget, priceText, byId } from "@/lib/vehicles";
import { fmt } from "@/lib/fmt";

const carSrc = (v) => v.photo || `/vehicles/ev-${v.img}.png`;

/* Horizontal carousel inside container: shows 5 cards cleanly on desktop with subtle scroll/peek */
function Scroller({ label, step = 440, children }) {
  const ref = useRef(null);
  const go = (d) => ref.current?.scrollBy({ left: d * step, behavior: "smooth" });
  return (
    <div className="relative">
      <div
        ref={ref}
        tabIndex={0}
        aria-label={label}
        className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-3"
      >
        {children}
      </div>
      <button
        type="button"
        onClick={() => go(-1)}
        aria-label="Scroll left"
        className="nav-arrow -left-3 top-1/2 -translate-y-1/2"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        type="button"
        onClick={() => go(1)}
        aria-label="Scroll right"
        className="nav-arrow -right-3 top-1/2 -translate-y-1/2"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}

function Head({ id, title, sub, action }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        <h2 id={id} className="font-display text-2xl font-bold uppercase tracking-wide md:text-3xl">{title}</h2>
        {sub && <p className="mt-1 text-sm text-slate-400">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

/* ---------------- EV NEWS callout banner ---------------- */
export function NewsBanner({ news, admin, onManage }) {
  return (
    <section id="news" aria-label="EV news" className="mx-auto max-w-6xl px-4 pt-6">
      <div className="news-banner grid overflow-hidden rounded-2xl border border-[#36275f] lg:grid-cols-[250px_1fr]">
        <div className="news-callout flex flex-col justify-between gap-4 p-6">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-bold tracking-[.2em]"><span className="live-dot" />LIVE UPDATES</span>
            <h2 className="mt-3 flex items-center gap-2 font-display text-4xl font-bold leading-none"><Newspaper size={30} />EV NEWS</h2>
            <p className="mt-3 text-sm font-medium opacity-90">Launches, prices, charging and policy updates from the EV world.</p>
          </div>
          {admin && <button onClick={onManage} className="rounded-lg bg-black/25 px-3 py-2 text-left text-sm font-semibold hover:bg-black/35">Add / edit news →</button>}
        </div>
        <div className="min-w-0 p-4">
          {!news.length ? (
            <div className="grid h-full min-h-[200px] place-items-center rounded-xl border border-dashed border-[#36275f] text-center text-sm text-slate-400">
              <p>No news yet.<br />{admin ? "Use “Add / edit news” to publish the first update." : "Check back soon."}</p></div>
          ) : (
            <Scroller label="EV news" step={520}>
              {news.map((n) => (
                <article key={n._id} className="w-[240px] shrink-0 snap-start overflow-hidden rounded-xl border border-[#251a45] bg-panel">
                  {n.image ? <img src={n.image} alt={n.title} className="h-28 w-full object-cover" loading="lazy" /> : <div className="h-28 w-full bg-gradient-to-br from-panel to-[#2a1250]" />}
                  <div className="p-3">
                    <p className="text-[11px] text-slate-500">{fmt(n.createdAt).replace("Posted on: ", "")}</p>
                    <h3 className="mt-1 line-clamp-2 font-display text-lg font-semibold leading-snug">{n.title}</h3>
                    <p className="mt-1 line-clamp-2 text-xs text-slate-400">{n.summary}</p>
                    {n.link && <a href={n.link} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-volt">Read more <ArrowRight size={12} /></a>}
                  </div>
                </article>
              ))}
            </Scroller>
          )}
        </div>
      </div>
    </section>
  );
}

/* ---------------- EV Finder + Popular EVs ---------------- */
function VehicleCard({ v, full, onOpen }) {
  return (
    <article
      className={`${
        full
          ? "w-full"
          : "w-[calc(50%-6px)] sm:w-[calc(33.333%-8px)] lg:w-[calc((100%-48px)/5.15)] shrink-0 snap-start"
      } flex min-h-[370px] flex-col rounded-2xl border border-[#251a45] bg-panel p-3`}
    >
      <div className="relative h-[135px] w-full overflow-hidden rounded-xl border border-[#251a45]">
        <img
          src={carSrc(v)}
          alt={`${v.brand} ${v.model}`}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <p className="mt-2.5 text-[11px] font-semibold uppercase tracking-[.16em] text-slate-500">{v.brand}</p>
      <h3 className="truncate font-display text-xl font-bold leading-tight">{v.model}</h3>
      <p className="mt-1 text-xs text-slate-400">Starting <span className="font-semibold text-hexa">{priceText(v.price)}</span></p>
      <div className="mt-2.5 grid grid-cols-2 gap-2 border-t border-[#251a45] pt-2.5">
        <div className="flex items-center gap-1.5">
          <Gauge size={16} className="shrink-0 text-volt" />
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wide text-slate-500">Top Speed</p>
            <p className="truncate text-xs font-semibold">{v.speed} km/h</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <BatteryCharging size={16} className="shrink-0 text-volt" />
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wide text-slate-500">Range</p>
            <p className="truncate text-xs font-semibold">{v.range} km</p>
          </div>
        </div>
      </div>
      <button type="button" onClick={() => onOpen(v)} className="btn mt-auto w-full text-sm">View Details</button>
    </article>
  );
}

function VehicleModal({ v, onClose }) {
  useEffect(() => {
    const k = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, [onClose]);
  const rows = [["Starting price", priceText(v.price)], ["Range", `${v.range} km`], ["Top speed", `${v.speed} km/h`], ["Battery", v.battery], ["Body", v.body]];
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label={`${v.brand} ${v.model}`} className="w-full max-w-md rounded-2xl border border-[#36275f] bg-panel p-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.18em] text-slate-500">{v.brand}</p>
            <h3 className="font-display text-3xl font-bold">{v.model}</h3>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-full border border-[#36275f] p-2"><X size={16} /></button>
        </div>
        <div className="relative mt-3 h-[180px] w-full overflow-hidden rounded-xl border border-[#251a45]">
          <img src={carSrc(v)} alt={`${v.brand} ${v.model}`} className="h-full w-full object-cover" />
        </div>
        <dl className="mt-4 divide-y divide-[#251a45] text-sm">
          {rows.map(([k, val]) => (
            <div key={k} className="flex justify-between py-2">
              <dt className="text-slate-400">{k}</dt>
              <dd className="font-semibold">{val}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-xs text-slate-500">*Indicative figures. Please confirm price and specifications with the manufacturer.</p>
      </div>
    </div>
  );
}

export function EvShowcase() {
  const [budget, setBudget] = useState("any");
  const [range, setRange] = useState("any");
  const [applied, setApplied] = useState({ budget: "any", range: "any" });
  const [all, setAll] = useState(false);
  const [open, setOpen] = useState(null);
  const list = VEHICLES.filter((v) => inBudget(v.price, applied.budget) && (applied.range === "any" || v.range >= +applied.range));
  const find = (e) => {
    e.preventDefault();
    setApplied({ budget, range });
    document.getElementById("popular")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const reset = () => { setBudget("any"); setRange("any"); setApplied({ budget: "any", range: "any" }); };
  const filtered = applied.budget !== "any" || applied.range !== "any";

  return (
    <>
      <section id="finder" aria-label="EV finder" className="mx-auto max-w-6xl px-4 pt-6">
        <form onSubmit={find} className="finder grid min-h-[160px] items-center gap-5 p-5 md:grid-cols-[1fr_1.5fr] md:p-6">
          <div>
            <p className="text-xs font-bold tracking-[.22em] text-hexa">FIND YOUR EV</p>
            <h2 className="mt-1 font-display text-3xl font-bold leading-tight md:text-4xl">Electric Vehicles in India</h2>
            <p className="mt-1 text-sm text-slate-400">Pick a budget and range to match the right EV.</p>
          </div>
          <div className="grid items-end gap-3 sm:grid-cols-[1fr_1fr_auto]">
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400">Budget
              <select className="inp mt-1 text-base font-normal normal-case text-inherit" value={budget} onChange={(e) => setBudget(e.target.value)}>
                {BUDGETS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
              </select>
            </label>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400">Range
              <select className="inp mt-1 text-base font-normal normal-case text-inherit" value={range} onChange={(e) => setRange(e.target.value)}>
                {RANGES.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
              </select>
            </label>
            <button type="submit" className="btn flex h-[46px] items-center justify-center gap-2 px-6 tracking-wide">
              <Search size={18} />FIND EVs
            </button>
          </div>
        </form>
      </section>

      <section id="popular" aria-labelledby="popular-h" className="mx-auto max-w-6xl scroll-mt-24 px-4 pt-6">
        <Head
          id="popular-h"
          title="Popular Electric Vehicles"
          sub={filtered ? `${list.length} EV${list.length === 1 ? "" : "s"} match your search` : undefined}
          action={
            <div className="flex items-center gap-4">
              {filtered && <button type="button" onClick={reset} className="text-sm text-slate-400 underline">Reset</button>}
              <button type="button" onClick={() => setAll(!all)} className="flex items-center gap-1 text-sm font-semibold text-volt hover:underline">
                {all ? "Show less" : "View All"} <ArrowRight size={16} />
              </button>
            </div>
          }
        />
        {!list.length ? (
          <p className="rounded-xl border border-dashed border-[#36275f] p-8 text-center text-slate-400">No EVs match these filters. Try a wider budget or range.</p>
        ) : all ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
            {list.map((v) => <VehicleCard key={v.id} v={v} full onOpen={setOpen} />)}
          </div>
        ) : (
          <Scroller label="Popular electric vehicles" step={440}>
            {list.map((v) => <VehicleCard key={v.id} v={v} onOpen={setOpen} />)}
          </Scroller>
        )}
        <p className="mt-1 text-xs text-slate-500">*Indicative prices and specifications. Please confirm with the manufacturer.</p>
      </section>
      {open && <VehicleModal v={open} onClose={() => setOpen(null)} />}
    </>
  );
}

/* ---------------- Compare Electric Vehicles ---------------- */
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
          src={carSrc(v)}
          alt={`${v.brand} ${v.model}`}
          className={`h-full w-full object-cover ${flip ? "-scale-x-100" : ""}`}
          loading="lazy"
        />
      </div>
      <p className="mt-2.5 text-[11px] font-semibold uppercase tracking-[.16em] text-slate-500">{v.brand}</p>
      <h3 className="truncate w-full font-display text-lg font-bold leading-tight">{v.model}</h3>
      <div className="mt-2.5 w-full space-y-1.5 border-t border-[#251a45] pt-2.5">
        <Stat label="Starting price" value={priceText(v.price)} win={v.price < o.price} />
        <Stat label="Range" value={`${v.range} km`} win={v.range > o.range} />
        <Stat label="Top speed" value={`${v.speed} km/h`} win={v.speed > o.speed} />
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

export function CompareEvs() {
  const [all, setAll] = useState(false);
  const pairs = PAIRS.map(([x, y]) => [byId(x), byId(y)]);
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
          {pairs.map(([a, b]) => <CompareCard key={a.id + b.id} a={a} b={b} full />)}
        </div>
      ) : (
        <Scroller label="Compare electric vehicles" step={380}>
          {pairs.map(([a, b]) => <CompareCard key={a.id + b.id} a={a} b={b} />)}
        </Scroller>
      )}
    </section>
  );
}