"use client";
import { useEffect, useState } from "react";
import { Instagram, Youtube, Star, ThumbsUp, ThumbsDown, Phone, Mail, MapPin, Lock, Moon, Sun, MoreVertical } from "lucide-react";

/* ---------- helpers ---------- */
const fmt = (d) => {
  const x = new Date(d);
  const date = x.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  const time = x.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  return `Posted on: ${date} at ${time}`;
};
const short = (d) => fmt(d).replace("Posted on: ", "");
const api = async (url, { method = "GET", body, pw } = {}) => {
  const r = await fetch(url, {
    method, cache: "no-store", body: body === undefined ? undefined : JSON.stringify(body),
    headers: { "Content-Type": "application/json", ...(pw ? { "x-admin-password": pw } : {}) },
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || "Request failed");
  return j;
};
const post = (url, body, pw) => api(url, { method: "POST", body, pw });
const Img = ({ src, className, alt = "" }) => src
  ? <img src={src} alt={alt} className={className} loading="lazy" />
  : <div className={className + " bg-gradient-to-br from-panel to-[#2a1250]"} />;
const Stars = ({ value, onPick }) => (
  <div className="flex gap-1">{[1, 2, 3, 4, 5].map((n) => (
    <button type="button" key={n} onClick={() => onPick?.(n)} aria-label={`${n} star`} disabled={!onPick}>
      <Star size={onPick ? 26 : 16} className={n <= value ? "fill-hexa text-hexa" : "text-slate-600"} /></button>))}</div>
);

/* Only one video / YouTube embed plays at a time. */
const ytCmd = (f, fn) => { try { f.contentWindow.postMessage(JSON.stringify({ event: "command", func: fn, args: [] }), "*"); } catch {} };
const ytListen = (f) => { try { f.contentWindow.postMessage(JSON.stringify({ event: "listening", id: 1, channel: "widget" }), "*"); } catch {} };
const pauseOthers = (except) => {
  document.querySelectorAll("video").forEach((v) => { if (v !== except) v.pause(); });
  document.querySelectorAll("iframe").forEach((f) => { if (f !== except) ytCmd(f, "pauseVideo"); });
};

/* Feature media: YouTube link, mp4/webm video, or image. */
function Media({ f }) {
  const u = f.image || "";
  if (!u) return <div className="h-28 w-full bg-gradient-to-br from-panel to-[#2a1250]" />;
  const y = (u.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/) || [])[1];
  if (y) return <iframe className="h-28 w-full" src={`https://www.youtube-nocookie.com/embed/${y}?enablejsapi=1&rel=0`} onLoad={(e) => ytListen(e.currentTarget)} title={f.title} allowFullScreen loading="lazy" referrerPolicy="strict-origin-when-cross-origin" />;
  if (/\.(mp4|webm|ogg)(\?|$)/i.test(u)) return <video className="h-28 w-full bg-black object-cover" src={u} controls preload="metadata" />;
  return <img src={u} alt={f.title} className="h-28 w-full object-cover" loading="lazy" />;
}

/* ---------- page ---------- */
export default function Home() {
  const [features, setFeatures] = useState([]); const [articles, setArticles] = useState([]); const [reviews, setReviews] = useState([]);
  const [open, setOpen] = useState(null); const [pw, setPw] = useState(null); const [showLogin, setShowLogin] = useState(false);
  const [votes, setVotes] = useState({}); const [msg, setMsg] = useState("");
  const [theme, setThemeState] = useState("dark"); const [menu, setMenu] = useState(false); const [intro, setIntro] = useState(true);

  const load = async () => {
    const [f, a, r] = await Promise.all([api("/api/features"), api("/api/articles"), api("/api/reviews")]);
    setFeatures(f); setArticles(a); setReviews(r);
  };
  useEffect(() => {
    load().catch((e) => setMsg(e.message));
    try { setVotes(JSON.parse(localStorage.getItem("evh_votes") || "{}")); } catch {}
    setThemeState(document.documentElement.dataset.theme || "dark");
    const t = setTimeout(() => setIntro(false), 2400);
    // tap motion blur on buttons / links
    const tap = (e) => {
      const el = e.target.closest?.('button,a[href],[role="menuitem"],[role="menuitemradio"]');
      if (!el || el.disabled || el.getAttribute("aria-disabled") === "true") return;
      el.classList.remove("tap-blur"); void el.offsetWidth; el.classList.add("tap-blur");
      setTimeout(() => el.classList.remove("tap-blur"), 950);
    };
    const play = (e) => { if (e.target.tagName === "VIDEO") pauseOthers(e.target); };
    const ytMsg = (e) => {
      let d = e.data; try { if (typeof d === "string") d = JSON.parse(d); } catch { return; }
      if (d && d.event === "onStateChange" && d.info === 1) {
        const f = [...document.querySelectorAll("iframe")].find((i) => i.contentWindow === e.source); if (f) pauseOthers(f);
      }
    };
    const esc = (e) => { if (e.key === "Escape") setMenu(false); };
    const away = (e) => { if (!e.target.closest?.("#tm")) setMenu(false); };
    document.addEventListener("click", away); document.addEventListener("click", tap); document.addEventListener("play", play, true);
    window.addEventListener("message", ytMsg); document.addEventListener("keydown", esc);
    return () => {
      clearTimeout(t); document.removeEventListener("click", away); document.removeEventListener("click", tap); document.removeEventListener("play", play, true);
      window.removeEventListener("message", ytMsg); document.removeEventListener("keydown", esc);
    };
  }, []);

  const setTheme = (t) => {
    document.documentElement.dataset.theme = t; setThemeState(t); setMenu(false);
    try { localStorage.setItem("evh_theme", t); } catch {}
  };
  const current = articles.find((a) => a._id === open);

  // while an article is open, use its SEO meta description + title
  useEffect(() => {
    if (!current) return;
    const tag = document.querySelector('meta[name="description"]'), oldDesc = tag?.getAttribute("content"), oldTitle = document.title;
    document.title = `${current.title} – EV HEXA`;
    tag?.setAttribute("content", current.meta || current.content.replace(/\s+/g, " ").slice(0, 160));
    return () => { document.title = oldTitle; if (tag && oldDesc != null) tag.setAttribute("content", oldDesc); };
  }, [current]);

  const replace = (u) => setArticles((l) => l.map((a) => (a._id === u._id ? u : a)));
  const goAdmin = () => setTimeout(() => document.getElementById("admin")?.scrollIntoView({ behavior: "smooth" }), 100);

  const vote = async (a, type) => {
    const prev = votes[a._id]; const next = { ...votes }; const url = `/api/articles/${a._id}`;
    try {
      if (prev === type) { replace(await post(url, { action: "un" + type })); delete next[a._id]; }
      else {
        if (prev) await post(url, { action: "un" + prev });
        replace(await post(url, { action: type })); next[a._id] = type;
      }
      setVotes(next); localStorage.setItem("evh_votes", JSON.stringify(next));
    } catch (e) { setMsg(e.message); }
  };

  return (
    <div>
      {intro && (
        <div id="intro" className="intro" aria-hidden="true">
          <div className="absolute left-0 top-1/2 -translate-y-1/2"><div className="intro-car"><Rig cls="intro-rig" /></div></div>
        </div>)}

      <header className="sticky top-0 z-30 border-b border-[#251a45] bg-ink/90 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <a href="#top" aria-label="EV HEXA home" className="block h-12 w-12 overflow-hidden rounded-full"><img src="/logo.png" alt="EV HEXA" className="h-full w-full object-cover" /></a>
          <div className="flex items-center gap-5 text-sm">
            <a href="#features" className="hidden hover:text-volt sm:block">Features</a>
            <a href="#articles" className="hidden hover:text-volt sm:block">Articles</a>
            <a href="#reviews" className="hidden hover:text-volt sm:block">Reviews</a>
            <div className="relative" id="tm">
              <button id="tmBtn" onClick={() => setMenu(!menu)} aria-label="Menu" aria-haspopup="menu" aria-expanded={menu} className="rounded-lg border border-[#36275f] p-2 hover:border-volt"><MoreVertical size={18} /></button>
              {menu && (
                <div id="tmPanel" role="menu" aria-label="Appearance" className="absolute right-0 top-full z-50 mt-2 rounded-xl border border-[#36275f] bg-panel p-1.5 shadow-xl">
                  <div className="flex gap-1">
                    <button role="menuitemradio" aria-checked={theme === "dark"} aria-label="Dark" onClick={() => setTheme("dark")} className="tbtn grid h-10 w-10 place-items-center rounded-lg"><Moon size={18} /></button>
                    <button role="menuitemradio" aria-checked={theme === "light"} aria-label="Light" onClick={() => setTheme("light")} className="tbtn grid h-10 w-10 place-items-center rounded-lg"><Sun size={18} /></button>
                  </div>
                </div>)}
            </div>
          </div>
        </nav>
      </header>

      <main id="top">
        <section className="relative overflow-hidden border-b border-[#251a45]">
          <HeroScene />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-60 overflow-hidden" aria-hidden="true">
            <div className="hero-road" />
            <div className="drive absolute bottom-[48px] left-0"><Rig cls="hero-rig" /></div>
          </div>
          <div className="relative mx-auto max-w-6xl px-4 pb-56 pt-20 md:pb-60 md:pt-28">
            <h1 className="font-display text-5xl font-bold leading-[1.02] md:text-7xl">Every charge,<br />every mile, <span className="text-volt">reviewed.</span></h1>
            <p className="mt-5 max-w-xl text-lg text-slate-400">EV HEXA covers electric vehicle news, launches and honest owner reviews.</p>
            <div className="mt-8 flex gap-3"><a href="#articles" className="btn">Read latest articles</a><a href="#reviews" className="rounded-lg border border-[#36275f] px-5 py-2.5 hover:border-hexa">Write a review</a></div>
          </div>
        </section>

        {msg && <p className="mx-auto mt-4 max-w-6xl px-4 text-sm text-red-400" role="alert">{msg}</p>}

        <section id="features" className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="font-display text-3xl font-semibold">Featured highlights</h2>
          {!features.length && <p className="mt-4 text-slate-500">No highlights yet. The admin can add the first one.</p>}
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {features.map((f) => (
              <article key={f._id} className="overflow-hidden rounded-lg border border-[#251a45] bg-panel">
                <Media f={f} />
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
              <article key={a._id} className="cursor-pointer overflow-hidden rounded-xl border border-[#251a45] bg-panel hover:border-volt" onClick={() => setOpen(a._id)}>
                <Img src={a.image} className="h-44 w-full object-cover" />
                <div className="p-4"><h3 className="font-display text-xl font-semibold">{a.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-400">{a.content}</p>
                  <p className="mt-3 text-xs text-slate-500">By {a.author} · {fmt(a.createdAt)}</p>
                  <p className="mt-2 flex gap-4 text-xs text-slate-400"><span>👍 {a.likes}</span><span>👎 {a.dislikes}</span><span>💬 {a.comments.length}</span></p></div>
              </article>))}
          </div>
        </section>

        <ReviewSection reviews={reviews} onAdded={(r) => setReviews([r, ...reviews])} />
        {pw && <AdminPanel pw={pw} features={features} articles={articles} onDone={load} />}
      </main>

      {current && (
        <div id="modal" className="fixed inset-0 z-40 overflow-y-auto bg-ink">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#251a45] bg-ink/90 px-4 py-3 backdrop-blur">
            <button onClick={() => setOpen(null)} className="rounded-lg border border-[#36275f] px-4 py-1.5 text-sm hover:border-volt">← Back</button>
            <span className="font-display text-lg text-slate-400">EV HEXA</span></div>
          <Img src={current.image} className="h-[260px] w-full object-cover md:h-[380px]" />
          <article className="mx-auto max-w-4xl px-4 pb-16 pt-10">
            <h1 className="text-center font-display text-3xl font-semibold leading-tight md:text-5xl">{current.title}</h1>
            <p className="mt-3 text-center text-sm text-slate-500">By {current.author} · {fmt(current.createdAt)}{current.editedAt ? ` · Updated ${short(current.editedAt)}` : ""}</p>
            <div className="mt-8"><Body text={current.content} /></div>
            <div className="mt-8 flex gap-3">
              <button onClick={() => vote(current, "like")} aria-label="Like" className={`flex items-center gap-2 rounded-lg border px-4 py-2 ${votes[current._id] === "like" ? "border-hexa text-hexa" : "border-[#36275f]"}`}><ThumbsUp size={16} />{current.likes}</button>
              <button onClick={() => vote(current, "dislike")} aria-label="Dislike" className={`flex items-center gap-2 rounded-lg border px-4 py-2 ${votes[current._id] === "dislike" ? "border-red-400 text-red-400" : "border-[#36275f]"}`}><ThumbsDown size={16} />{current.dislikes}</button>
            </div>
            <Comments a={current} onUpdate={replace} setMsg={setMsg} />
          </article>
        </div>)}

      {showLogin && <Login onClose={() => setShowLogin(false)} onOk={(p) => { setPw(p); setShowLogin(false); goAdmin(); }} />}

      <footer className="mt-10 border-t border-[#251a45] bg-panel">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-2">
          <div><div className="mb-4 h-16 w-16 overflow-hidden rounded-full"><img src="/logo.png" alt="EV HEXA" className="h-full w-full object-cover" /></div><p className="font-display text-xl font-semibold">Follow EV HEXA</p>
            <div className="mt-3 flex gap-4">
              <a href="https://www.instagram.com/evhexa.it/" target="_blank" rel="noreferrer" aria-label="Instagram" className="rounded-full border border-[#36275f] p-3 hover:border-volt hover:text-volt"><Instagram /></a>
              <a href="https://www.youtube.com/@EVHEXA" target="_blank" rel="noreferrer" aria-label="YouTube" className="rounded-full border border-[#36275f] p-3 hover:border-volt hover:text-volt"><Youtube /></a></div></div>
          <div><p className="font-display text-xl font-semibold">Contact</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-400">
              <li className="flex gap-2"><Phone size={16} />+91 00000 00000</li>
              <li className="flex gap-2"><Mail size={16} />contact@evhexa.com</li>
              <li className="flex gap-2"><MapPin size={16} />Your office address, City, State, India</li></ul></div>
        </div>
        <div className="border-t border-[#251a45]"><div className="mx-auto grid max-w-6xl items-center gap-3 px-4 py-4 text-sm text-slate-500 md:grid-cols-3">
          <span className="hidden md:block" />
          <p className="text-center">Developed by Nexworktech</p>
          <button id="adminBtn" onClick={() => (pw ? goAdmin() : setShowLogin(true))} className="flex items-center gap-1.5 justify-self-center rounded-lg border border-[#36275f] px-3 py-1.5 hover:border-volt hover:text-volt md:justify-self-end"><Lock size={14} />{pw ? "Admin Panel" : "Admin Login"}</button>
        </div></div>
      </footer>
    </div>
  );
}

/* ---------- decorative scenes ---------- */
function Rig({ cls }) {
  return (
    <div className={`rig ${cls}`} aria-hidden="true">
      <div className="rig-shadow" /><div className="rig-trail" /><div className="rig-refl" /><div className="rig-body" />
      <div className="rig-pool" /><div className="rig-beam" /><div className="rig-hl" /><div className="rig-tl" />
      <div className="whl whl-f" /><div className="whl whl-r" />
    </div>);
}

function HeroScene() {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((n) => (
        <div key={n} className="slide" style={{ backgroundImage: `url(/hero/hero-${n}.jpg)`, animationDelay: `${(n - 1) * 5}s` }} />
      ))}
      <div className="day-scene" aria-hidden="true">
        <div className="day-sky" />
        <div className="day-sunwrap"><div className="day-rays" /><div className="day-sun" /></div>
        <div className="day-cloud c1" /><div className="day-cloud c2" /><div className="day-cloud c3" /><div className="day-cloud c4" />
        <div className="day-far" /><div className="day-near" /><div className="day-trees" />
      </div>
      <div className="hero-ov absolute inset-0" />
    </div>);
}

/* ---------- sections ---------- */
function Login({ onClose, onOk }) {
  const [v, setV] = useState(""); const [err, setErr] = useState("");
  const go = async (e) => { e.preventDefault(); try { await post("/api/admin", {}, v); onOk(v); } catch { setErr("Wrong password. Try again."); } };
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4" onClick={onClose}>
      <form onSubmit={go} onClick={(e) => e.stopPropagation()} className="w-full max-w-sm space-y-3 rounded-xl border border-[#36275f] bg-panel p-6">
        <h3 className="font-display text-2xl font-semibold">Admin login</h3>
        <input type="password" autoFocus className="inp" placeholder="Password" value={v} onChange={(e) => setV(e.target.value)} />
        {err && <p className="text-sm text-red-400">{err}</p>}
        <button className="btn w-full">Unlock</button>
      </form>
    </div>);
}

function Comments({ a, onUpdate, setMsg }) {
  const [name, setName] = useState(""); const [text, setText] = useState("");
  const send = async (e) => { e.preventDefault(); try { onUpdate(await post(`/api/articles/${a._id}`, { action: "comment", name, text })); setText(""); } catch (x) { setMsg(x.message); } };
  return (
    <div className="mt-8"><h3 className="font-display text-xl font-semibold">Comments ({a.comments.length})</h3>
      <form onSubmit={send} className="mt-3 space-y-2">
        <input className="inp" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required />
        <textarea className="inp" rows={3} placeholder="Write a comment" value={text} onChange={(e) => setText(e.target.value)} required />
        <button className="btn">Post comment</button></form>
      <ul className="mt-4 space-y-3">{[...a.comments].reverse().map((c, i) => (
        <li key={c._id || i} className="rounded-lg border border-[#251a45] p-3"><p className="text-sm font-medium text-volt">{c.name}</p>
          <p className="text-sm text-slate-300">{c.text}</p><p className="mt-1 text-xs text-slate-500">{short(c.createdAt)}</p></li>))}</ul>
    </div>);
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

function ImagePick({ obj, set, pw, setNote, placeholder, accept = "image/*" }) {
  const upload = async (input) => {
    const file = input.files[0]; if (!file) return; setNote("Uploading…");
    const fd = new FormData(); fd.append("file", file);
    try {
      const r = await fetch("/api/upload", { method: "POST", body: fd, headers: { "x-admin-password": pw } });
      const j = await r.json(); if (!r.ok) throw new Error(j.error); set({ ...obj, image: j.url }); setNote("File uploaded.");
    } catch (e) { setNote(e.message); }
    input.value = "";
  };
  return (<div><input className="inp" placeholder={placeholder} value={obj.image} onChange={(e) => set({ ...obj, image: e.target.value })} />
    <input type="file" accept={accept} className="mt-2 text-sm" onChange={(e) => upload(e.target)} /></div>);
}

const E1 = { title: "", badge: "", description: "", image: "" }, E2 = { title: "", author: "", image: "", content: "", meta: "" };

const Row = ({ item, onEdit, onDel }) => (
  <li className="flex items-center justify-between gap-3 rounded-lg border border-[#251a45] bg-panel px-4 py-3">
    <span className="min-w-0 truncate text-sm">{item.title} <span className="text-xs text-slate-500">· {short(item.createdAt)}</span></span>
    <span className="flex shrink-0 gap-2">
      <button type="button" onClick={onEdit} className="rounded border border-[#36275f] px-3 py-1 text-sm hover:border-volt">Edit</button>
      <button type="button" onClick={onDel} className="rounded border border-red-500/40 px-3 py-1 text-sm text-red-400">Delete</button></span>
  </li>);

function AdminPanel({ pw, features, articles, onDone }) {
  const [fe, setFe] = useState(E1); const [ar, setAr] = useState(E2); const [note, setNote] = useState("");
  const [editF, setEditF] = useState(null); const [editA, setEditA] = useState(null); const [busy, setBusy] = useState(false);

  const run = async (fn, ok) => {
    if (busy) return; setBusy(true);
    try { await fn(); setNote(ok); await onDone(); } catch (x) { setNote(x.message); }
    setBusy(false);
  };
  const saveFeature = (e) => { e.preventDefault(); run(async () => {
    if (editF) await api(`/api/features/${editF}`, { method: "PUT", body: fe, pw }); else await post("/api/features", fe, pw);
    setFe(E1); setEditF(null); }, editF ? "Feature updated." : "Feature added."); };
  const saveArticle = (e) => { e.preventDefault(); run(async () => {
    if (editA) await api(`/api/articles/${editA}`, { method: "PUT", body: ar, pw }); else await post("/api/articles", ar, pw);
    setAr(E2); setEditA(null); }, editA ? "Article updated." : "Published."); };
  const form = (id) => setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 50);
  const editFeature = (f) => { setEditF(f._id); setFe({ title: f.title, badge: f.badge, description: f.description, image: f.image || "" }); form("fForm"); };
  const editArticle = (a) => { setEditA(a._id); setAr({ title: a.title, author: a.author, image: a.image || "", content: a.content, meta: a.meta || "" }); form("aForm"); };
  const delFeature = (f) => confirm("Delete this feature?") && run(async () => { await api(`/api/features/${f._id}`, { method: "DELETE", pw }); if (editF === f._id) { setEditF(null); setFe(E1); } }, "Feature deleted.");
  const delArticle = (a) => confirm("Delete this article?") && run(async () => { await api(`/api/articles/${a._id}`, { method: "DELETE", pw }); if (editA === a._id) { setEditA(null); setAr(E2); } }, "Article deleted.");


  return (
    <section id="admin" className="mx-auto max-w-6xl px-4 py-14">
      <h2 className="font-display text-3xl font-semibold">Admin panel</h2>
      {note && <p className="mt-2 text-sm text-hexa" role="status">{note}</p>}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <form id="fForm" onSubmit={saveFeature} className="space-y-3 rounded-xl border border-[#251a45] bg-panel p-5">
          <h3 className="font-display text-xl font-semibold">{editF ? "Edit feature" : "Add feature"}</h3>
          <input className="inp" placeholder="Feature title" value={fe.title} onChange={(e) => setFe({ ...fe, title: e.target.value })} required />
          <input className="inp" placeholder="Category or spec badge (e.g. 520 km range)" value={fe.badge} onChange={(e) => setFe({ ...fe, badge: e.target.value })} required />
          <textarea className="inp" rows={3} placeholder="Description" value={fe.description} onChange={(e) => setFe({ ...fe, description: e.target.value })} required />
          <ImagePick obj={fe} set={setFe} pw={pw} setNote={setNote} accept="image/*,video/mp4,video/webm" placeholder="Photo / video URL (mp4 or YouTube link) – or upload a file below" />
          <div className="flex gap-2"><button className="btn" disabled={busy}>{busy ? "Please wait…" : editF ? "Save changes" : "Add feature"}</button>
            {editF && <button type="button" className="rounded-lg border border-[#36275f] px-4 hover:border-volt" onClick={() => { setEditF(null); setFe(E1); }}>Cancel</button>}</div></form>
        <form id="aForm" onSubmit={saveArticle} className="space-y-3 rounded-xl border border-[#251a45] bg-panel p-5">
          <h3 className="font-display text-xl font-semibold">{editA ? "Edit article" : "Publish article"}</h3>
          <input className="inp" placeholder="Article title" value={ar.title} onChange={(e) => setAr({ ...ar, title: e.target.value })} required />
          <input className="inp" placeholder="Author" value={ar.author} onChange={(e) => setAr({ ...ar, author: e.target.value })} required />
          <textarea className="inp" rows={5} placeholder="Content (blank line = new paragraph; table rows: Col A | Col B | Col C)" value={ar.content} onChange={(e) => setAr({ ...ar, content: e.target.value })} required />
          <input className="inp" maxLength={160} placeholder="SEO meta description (optional, up to 160 characters)" value={ar.meta} onChange={(e) => setAr({ ...ar, meta: e.target.value })} />
          <ImagePick obj={ar} set={setAr} pw={pw} setNote={setNote} placeholder="Banner image URL (or upload a file below)" />
          <div className="flex gap-2"><button className="btn" disabled={busy}>{busy ? "Please wait…" : editA ? "Save changes" : "Publish article"}</button>
            {editA && <button type="button" className="rounded-lg border border-[#36275f] px-4 hover:border-volt" onClick={() => { setEditA(null); setAr(E2); }}>Cancel</button>}</div></form>
      </div>
      <h3 className="mt-10 font-display text-xl font-semibold">Manage features</h3>
      <ul className="mt-3 space-y-2">{features.map((f) => <Row key={f._id} item={f} onEdit={() => editFeature(f)} onDel={() => delFeature(f)} />)}</ul>
      <h3 className="mt-10 font-display text-xl font-semibold">Manage published articles</h3>
      <ul className="mt-3 space-y-2">{articles.map((a) => <Row key={a._id} item={a} onEdit={() => editArticle(a)} onDel={() => delArticle(a)} />)}</ul>
    </section>);
}

function Body({ text }) {
  return text.split(/\n\s*\n/).map((blk, i) => {
    const lines = blk.trim().split("\n");
    if (lines.length > 1 && lines.every((l) => l.includes("|"))) {
      const rows = lines.map((l) => l.split("|").map((c) => c.trim()).filter((c, j, a) => !(c === "" && (j === 0 || j === a.length - 1))));
      return (
        <div key={i} className="my-6 overflow-x-auto"><table className="w-full border-collapse text-left text-sm md:text-base">
          <thead><tr>{rows[0].map((c, j) => <th key={j} className="border border-slate-500 bg-[#4a2a9a] px-3 py-2 font-semibold">{c}</th>)}</tr></thead>
          <tbody>{rows.slice(1).map((r, k) => <tr key={k}>{r.map((c, j) => <td key={j} className="border border-slate-600 px-3 py-2">{c}</td>)}</tr>)}</tbody></table></div>);
    }
    return <p key={i} className="my-4 whitespace-pre-line text-[17px] leading-8 text-slate-300">{blk}</p>;
  });
}
