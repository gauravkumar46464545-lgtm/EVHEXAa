"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import BrandLogo from "@/components/BrandLogo";
import ThemeMenu from "@/components/ThemeMenu";
import Media, { ytId } from "@/components/Media";
import { VEHICLES, PAIRS, priceText, byId } from "@/lib/vehicles";
import { ArrowLeft, BatteryCharging, Gauge, ExternalLink, ChevronDown, ChevronRight, Play, ListVideo, X } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "HOME" },
  { href: "/e-vehicles", label: "E-VEHICLES", hasMenu: true },
  { href: "/brands", label: "BRANDS" },
  { href: "/compare", label: "COMPARE" },
  { href: "/news", label: "NEWS" },
  { href: "/blogs", label: "BLOGS" },
  { href: "/videos", label: "VIDEOS" },
];

const VEHICLE_MENU = [
  {
    label: "Two Wheeler",
    href: "/e-vehicles?category=two-wheeler",
    subItems: [
      { label: "Scooter", href: "/e-vehicles?category=scooter" },
      { label: "Bike", href: "/e-vehicles?category=bike" },
    ],
  },
  {
    label: "Four Wheeler",
    href: "/e-vehicles?category=four-wheeler",
  },
  {
    label: "Commercial",
    href: "/e-vehicles?category=commercial",
  },
];

const DEFAULT_VIDEOS = [
  {
    _id: "yt-ev-1",
    badge: "EV SUV",
    title: "Electric SUVs & Highway Range Tests",
    description: "Watch EV SUV reviews, highway cruising clips, and real-world range insights.",
    url: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
  },
  {
    _id: "yt-ev-2",
    badge: "CHARGING",
    title: "EV Charging Stations & Fast Top-Up Guide",
    description: "Fast charger plug-in clips, charging speeds, and battery care tips for EV owners.",
    url: "https://assets.mixkit.co/videos/preview/mixkit-hand-plugging-a-charger-into-an-electric-car-42874-large.mp4",
  },
  {
    _id: "yt-ev-3",
    badge: "2-WHEELER EV",
    title: "Electric Scooters & Electric Bikes Walkaround",
    description: "Explore 2-wheeler EV highlights, daily commute performance, and smart features.",
    url: "https://assets.mixkit.co/videos/preview/mixkit-car-driving-on-a-city-street-at-night-34565-large.mp4",
  },
];

const carSrc = (v) => v.photo || `/vehicles/ev-${v.img}.png`;
const isVideoItem = (f) =>
  f?.mediaType === "video" ||
  /\.(mp4|webm|ogg|mov)(\?|$)/i.test(f?.media || "") ||
  /(?:youtu\.be\/|v=|embed\/|shorts\/)/i.test(f?.media || "");

function getYtId(url) {
  if (!url) return "";
  const fromHelper = ytId(url);
  if (fromHelper) return fromHelper;
  const m = String(url).match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?.*v=|embed\/|v\/|shorts\/))([A-Za-z0-9_-]{6,})/);
  return m ? m[1] : "";
}

function getThumb(url) {
  const id = getYtId(url);
  if (id) return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  return "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=900&q=80";
}

function matchCategory(v, cat) {
  if (!cat || cat === "all") return true;
  const text = `${v.category || ""} ${v.type || ""} ${v.segment || ""} ${v.model || ""}`.toLowerCase();
  if (cat === "two-wheeler") return /scooter|bike|motorcycle|2w|two/.test(text);
  if (cat === "scooter") return /scooter/.test(text);
  if (cat === "bike") return /bike|motorcycle/.test(text);
  if (cat === "four-wheeler") return /suv|car|sedan|hatchback|4w|four/.test(text) || (!/scooter|bike|motorcycle|truck|van|bus|auto|cargo|commercial/.test(text));
  if (cat === "commercial") return /truck|van|bus|auto|cargo|commercial|fleet/.test(text);
  return true;
}

function VideoLibraryView({ videoList, highlights }) {
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [nowPlaying, setNowPlaying] = useState(null);

  const openPlaylist = (item) => {
    setSelectedPlaylist(item);
    const srcUrl = item.url || item.media;
    setNowPlaying({
      id: item._id,
      title: item.title,
      meta: item.badge || "EV VIDEO",
      url: srcUrl,
      isFile: /\.(mp4|webm|ogg|mov)(\?|$)/i.test(srcUrl || ""),
    });
  };

  const renderPlayer = (track) => {
    if (!track?.url) return null;
    const id = getYtId(track.url);
    if (id && !track.isFile) {
      return (
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
          <iframe
            className="h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
            title={track.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    }
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
        <video
          key={track.url}
          src={track.url}
          controls
          autoPlay
          playsInline
          className="h-full w-full object-contain"
        />
      </div>
    );
  };

  const queue = selectedPlaylist
    ? videoList
        .filter((v) => v._id !== selectedPlaylist._id)
        .map((v) => {
          const u = v.url || v.media;
          return {
            id: v._id,
            title: v.title,
            meta: v.badge || "EV VIDEO",
            url: u,
            isFile: /\.(mp4|webm|ogg|mov)(\?|$)/i.test(u || ""),
          };
        })
    : [];

  return (
    <div className="space-y-10">
      <div className="rounded-2xl border border-[#251a45] bg-panel p-5">
        <h2 className="font-display text-2xl font-bold">Welcome to the EV Video Library</h2>
        <p className="mt-1 text-sm text-slate-400">
          Click on any playlist or video card to open it in the website player along with the Up Next queue.
        </p>
      </div>

      {selectedPlaylist && nowPlaying && (
        <div className="rounded-2xl border-2 border-volt/60 bg-panel p-4 md:p-6 shadow-2xl">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <span className="rounded bg-hexa/15 px-2.5 py-0.5 text-xs font-bold text-hexa">{selectedPlaylist.badge || "EV VIDEO"}</span>
              <h3 className="mt-1 font-display text-2xl font-bold">{nowPlaying.title}</h3>
            </div>
            <button
              type="button"
              onClick={() => { setSelectedPlaylist(null); setNowPlaying(null); }}
              className="inline-flex items-center gap-1 rounded-lg border border-[#36275f] px-3 py-1.5 text-xs font-semibold hover:border-volt"
            >
              <X size={15} /> Close Player
            </button>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
            <div>
              {renderPlayer(nowPlaying)}
              <p className="mt-3 text-sm text-slate-300">{selectedPlaylist.description}</p>
            </div>

            <div className="rounded-xl border border-[#251a45] bg-ink/40 p-3.5">
              <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-volt">
                <ListVideo size={16} /> Up Next ({queue.length} videos)
              </div>
              <div className="max-h-[340px] space-y-2 overflow-y-auto pr-1">
                {queue.map((q) => {
                  const active = nowPlaying.id === q.id && nowPlaying.title === q.title;
                  return (
                    <button
                      key={`${q.id}-${q.title}`}
                      type="button"
                      onClick={() => setNowPlaying(q)}
                      className={`flex w-full items-start gap-3 rounded-xl border p-2.5 text-left transition ${
                        active ? "border-volt bg-panel" : "border-[#251a45] bg-panel/60 hover:border-[#36275f]"
                      }`}
                    >
                      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-volt/15 text-volt">
                        <Play size={14} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{q.title}</p>
                        <p className="text-[11px] text-slate-400">{q.meta}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Compact YouTube Preview Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {videoList.map((f) => {
          const mediaUrl = f.url || f.media;
          return (
            <article
              key={f._id}
              onClick={() => openPlaylist(f)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && openPlaylist(f)}
              className="group cursor-pointer overflow-hidden rounded-xl border border-[#251a45] bg-panel transition hover:border-volt"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-black">
                <img
                  src={getThumb(mediaUrl)}
                  alt={f.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <span className="absolute inset-0 grid place-items-center bg-black/25 transition group-hover:bg-black/40">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-red-600 text-white shadow-lg">
                    <Play size={18} className="ml-0.5 fill-white" />
                  </span>
                </span>
              </div>
              <div className="p-3.5">
                <h2 className="line-clamp-1 font-display text-base font-bold group-hover:text-volt">{f.title}</h2>
                <p className="mt-1 line-clamp-2 text-xs text-slate-400">{f.description}</p>
                <p className="mt-2 text-xs font-semibold text-volt">Watch video →</p>
              </div>
            </article>
          );
        })}
      </div>

      {/* Featured Highlights Placed At The Very Bottom */}
      {highlights.length > 0 && (
        <section className="border-t border-[#251a45] pt-8">
          <h3 className="font-display text-2xl font-bold uppercase">Featured Highlights</h3>
          <div className="mt-4 grid grid-cols-2 items-start gap-3 md:grid-cols-3 lg:grid-cols-4">
            {highlights.map((f) => (
              <article key={f._id} className="overflow-hidden rounded-lg border border-[#251a45] bg-panel">
                <Media src={f.media} type={f.mediaType} w={f.mediaW} h={f.mediaH} alt={f.title} />
                <div className="p-3">
                  <span className="rounded bg-hexa/15 px-1.5 py-0.5 text-[11px] text-hexa">{f.badge}</span>
                  <h4 className="mt-1.5 font-display text-base font-semibold leading-snug">{f.title}</h4>
                  <p className="mt-1 line-clamp-2 text-xs text-slate-400">{f.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function NavSubPageInner({ section, title, subtitle }) {
  const searchParams = useSearchParams();
  const selectedCat = searchParams?.get("category") || "all";

  const [articles, setArticles] = useState([]);
  const [news, setNews] = useState([]);
  const [features, setFeatures] = useState([]);
  const [adminVideos, setAdminVideos] = useState([]);
  const [brand, setBrand] = useState("ALL");
  const [evDropdownOpen, setEvDropdownOpen] = useState(false);

  useEffect(() => {
    fetch("/api/articles").then((r) => r.json()).then((d) => Array.isArray(d) && setArticles(d)).catch(() => {});
    fetch("/api/news").then((r) => r.json()).then((d) => Array.isArray(d) && setNews(d)).catch(() => {});
    fetch("/api/features").then((r) => r.json()).then((d) => Array.isArray(d) && setFeatures(d)).catch(() => {});
    fetch("/api/videos").then((r) => r.json()).then((d) => Array.isArray(d) && setAdminVideos(d)).catch(() => {});
  }, []);

  const brands = ["ALL", ...new Set(VEHICLES.map((v) => v.brand))];
  const filteredVehicles = (brand === "ALL" ? VEHICLES : VEHICLES.filter((v) => v.brand === brand))
    .filter((v) => (section === "e-vehicles" ? matchCategory(v, selectedCat) : true));
  const videoList = [...adminVideos, ...features.filter(isVideoItem), ...DEFAULT_VIDEOS];

  return (
    <div className="min-h-screen" onClick={() => evDropdownOpen && setEvDropdownOpen(false)}>
      <header className="sticky top-0 z-30 border-b border-[#251a45] bg-ink/90 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3">
          <BrandLogo />

          <div className="hidden items-center gap-5 text-sm font-bold tracking-wide lg:flex">
            {NAV_ITEMS.map((item) =>
              item.hasMenu ? (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => setEvDropdownOpen(true)}
                  onMouseLeave={() => setEvDropdownOpen(false)}
                >
                  <div className="inline-flex items-center gap-1">
                    <Link href={item.href} className="transition-colors hover:text-volt">
                      {item.label}
                    </Link>
                    <button
                      type="button"
                      aria-label="Toggle E-Vehicles categories"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEvDropdownOpen((prev) => !prev);
                      }}
                      className="rounded p-0.5 hover:text-volt"
                    >
                      <ChevronDown size={15} className={`transition-transform ${evDropdownOpen ? "rotate-180" : ""}`} />
                    </button>
                  </div>

                  {evDropdownOpen && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute left-0 top-full z-40 mt-2 w-56 rounded-xl border border-[#36275f] bg-panel p-2 shadow-2xl"
                    >
                      {VEHICLE_MENU.map((cat) => (
                        <div key={cat.label} className="group/sub relative">
                          <Link
                            href={cat.href}
                            onClick={() => setEvDropdownOpen(false)}
                            className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider hover:bg-white/5 hover:text-volt"
                          >
                            <span>{cat.label}</span>
                            {cat.subItems && <ChevronRight size={14} />}
                          </Link>

                          {cat.subItems && (
                            <div className="ml-3 mt-0.5 space-y-0.5 border-l border-[#36275f] pl-2">
                              {cat.subItems.map((sub) => (
                                <Link
                                  key={sub.href}
                                  href={sub.href}
                                  onClick={() => setEvDropdownOpen(false)}
                                  className="block rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-white/5 hover:text-volt"
                                >
                                  {sub.label}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link key={item.href} href={item.href} className="transition-colors hover:text-volt">
                  {item.label}
                </Link>
              )
            )}
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
            <h1 className="mt-2 font-display text-3xl font-bold uppercase md:text-4xl">
              {section === "e-vehicles" && selectedCat !== "all"
                ? `${title} · ${selectedCat.replace("-", " ").toUpperCase()}`
                : title}
            </h1>
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

        {section === "news" && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {!news.length ? (
              <p className="rounded-xl border border-dashed border-[#36275f] p-6 text-sm text-slate-400">
                No live news items in database yet. You can add news from the Admin Panel.
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

        {section === "videos" && <VideoLibraryView videoList={videoList} highlights={features} />}
      </main>
    </div>
  );
}

export default function NavSubPage(props) {
  return (
    <Suspense fallback={null}>
      <NavSubPageInner {...props} />
    </Suspense>
  );
}