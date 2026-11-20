"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Media from "@/components/Media";
import CarRig from "@/components/CarRig";
import { NewsBanner, EvShowcase, CompareEvs } from "@/components/EvSections";
import ThemeMenu from "@/components/ThemeMenu";
import FaqSection from "@/components/FaqSection";
import FaqAdmin from "@/components/FaqAdmin";
import { Instagram, Youtube, Facebook, Linkedin, Star, ThumbsUp, ThumbsDown, Phone, Mail, MapPin, Lock, X } from "lucide-react";

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
  const [news, setNews] = useState([]); const [features, setFeatures] = useState([]); const [articles, setArticles] = useState([]); const [reviews, setReviews] = useState([]);
  const [open, setOpen] = useState(null); const [pw, setPw] = useState(null); const [showLogin, setShowLogin] = useState(false);
  const [votes, setVotes] = useState({}); const [msg, setMsg] = useState("");
  const [faqTick, setFaqTick] = useState(0);

  const load = async () => {
    const [f, a, r, n] = await Promise.all([api("/api/features"), api("/api/articles"), api("/api/reviews"), api("/api/news").catch(() => [])]);
    setFeatures(f); setArticles(a); setReviews(r); setNews(n);
  };
  useEffect(() => { load().catch((e) => setMsg(e.message)); try { setVotes(JSON.parse(localStorage.getItem("evh_votes") || "{}")); } catch {} }, []);
  const current = articles.find((a) => a._id === open);
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
      <header className="sticky top-0 z-30 border-b border-[#251a45] bg-ink/90 backdrop-blur">
        {/* Top Utility Bar */}
        <div className="border-b border-[#251a45] bg-panel/80 text-xs text-slate-400">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-2">
            <div className="flex items-center gap-3">
              <a href="tel:+910000000000" className="flex items-center gap-1.5 hover:text-volt">
                <Phone size={14} className="text-hexa" />
                <span>+91 00000 00000</span>
              </a>
              <span className="text-slate-600">|</span>
              <a href="mailto:contact@evhexa.com" className="flex items-center gap-1.5 hover:text-volt">
                <Mail size={14} className="text-hexa" />
                <span>contact@evhexa.com</span>
              </a>
            </div>
            <div className="hidden items-center gap-3 md:flex">
              <div className="flex items-center gap-2">
                <a href="https://www.instagram.com/evhexa.it/" target="_blank" rel="noreferrer" aria-label="Instagram" className="rounded border border-[#36275f] p-1 hover:border-volt hover:text-volt"><Instagram size={13} /></a>
                <a href="https://www.youtube.com/@EVHEXA" target="_blank" rel="noreferrer" aria-label="YouTube" className="rounded border border-[#36275f] p-1 hover:border-volt hover:text-volt"><Youtube size={13} /></a>
                <a href="#" aria-label="Facebook" className="rounded border border-[#36275f] p-1 hover:border-volt hover:text-volt"><Facebook size={13} /></a>
                <a href="#" aria-label="LinkedIn" className="rounded border border-[#36275f] p-1 hover:border-volt hover:text-volt"><Linkedin size={13} /></a>
              </div>
              <span className="text-slate-600">|</span>
              <div className="flex items-center gap-3 font-medium tracking-wide">
                <a href="#privacy" className="hover:text-volt">PRIVACY</a>
                <span className="text-slate-600">|</span>
                <a href="#terms" className="hover:text-volt">TERMS &amp; CONDITIONS</a>
                <span className="text-slate-600">|</span>
                <a href="#career" className="hover:text-volt">CAREER</a>
                <span className="text-slate-600">|</span>
                <a href="#contact" className="hover:text-volt">CONTACT US</a>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-[15px]">
          <a href="#top" aria-label="EV HEXA home" className="block h-[60px] w-[60px] overflow-hidden rounded-full">
            <img src="/logo.png" alt="EV HEXA" className="h-full w-full object-cover" />
          </a>
          <div className="flex items-center">
            <ThemeMenu />
          </div>
        </nav>
      </header>

      <main id="top">
        <section className="relative overflow-hidden border-b border-[#251a45]">
          <HeroSlides />
          <MovingCar />
          <div className="relative mx-auto max-w-6xl px-4 pb-24 pt-8">
            <h1 className="font-display text-4xl font-bold leading-[1.05] md:text-5xl">Every charge,<br className="md:hidden" /> every mile, <span className="text-volt">reviewed.</span></h1>
            <p className="mt-3 max-w-xl text-base text-slate-400">EV HEXA covers electric vehicle news, launches and honest owner reviews.</p>
            <div className="mt-5 flex gap-3"><a href="#articles" className="btn">Read latest articles</a><a href="#reviews" className="rounded-lg border border-[#36275f] px-5 py-2.5 hover:border-hexa">Write a review</a></div>
          </div>
        </section>
        <NewsBanner news={news} admin={!!pw} onManage={goAdmin} />
        <EvShowcase />

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

        <CompareEvs />
        <ReviewSection reviews={reviews} onAdded={(r) => setReviews([r, ...reviews])} />
        <FaqSection refresh={faqTick} />
        {pw && <AdminPanel pw={pw} articles={articles} features={features} news={news} onDone={load} />}
        {pw && <FaqAdmin pw={pw} onChanged={() => setFaqTick((t) => t + 1)} />}
      </main>

      {showLogin && <Login onClose={() => setShowLogin(false)} onOk={(p) => { setPw(p); setShowLogin(false); goAdmin(); }} />}

      <footer id="contact" className="mt-10 border-t border-[#251a45] bg-panel">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-2">
          <div><div className="mb-4 h-16 w-16 overflow-hidden rounded-full"><img src="/logo.png" alt="EV HEXA" className="h-full w-full object-cover" /></div><p className="font-display text-xl font-semibold">Follow EV HEXA</p>
            <div className="mt-3 flex gap-4">
              <a href="https://www.instagram.com/evhexa.it/" target="_blank" rel="noreferrer" aria-label="Instagram" className="rounded-full border border-[#36275f] p-3 hover:border-volt hover:text-volt"><Instagram /></a>
              <a href="https://www.youtube.com/@EVHEXA" target="_blank" rel="noreferrer" aria-label="YouTube" className="rounded-full border border-[#36275f] p-3 hover:border-volt hover:text-volt"><Youtube /></a></div></div>
          <div><p className="font-display text-xl font-semibold">Contact</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-400">
              <li className="flex gap-2"><Phone size={16} />+91 00000 00000</li>
              <li className="flex gap-2"><Mail size={16} />contact@evhexa.com</li>
              <li className="flex gap-2"><MapPin size={16} />Flat No. D-58, 12M-3-8, Gandhinagar, Sigra, Varanasi, U.P.-221010</li></ul></div>
        </div>
        <div className="border-t border-[#251a45]"><div className="mx-auto grid max-w-6xl items-center gap-3 px-4 py-4 text-sm text-slate-500 md:grid-cols-3">
          <span className="hidden md:block" />
          <p className="text-center">Developed by Nexworktech</p>
          <button onClick={() => (pw ? goAdmin() : setShowLogin(true))} className="flex items-center justify-center gap-1 justify-self-center rounded-lg border border-[#36275f] px-3 py-1.5 hover:border-volt hover:text-volt md:justify-self-end"><Lock size={14} />{pw ? "Admin Panel" : "Admin Login"}</button>
        </div></div>
      </footer>
    </div>
  );
}

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

const fmtSize = (b) => (b >= 1048576 ? (b / 1048576).toFixed(1) + " MB" : Math.max(1, Math.round(b / 1024)) + " KB");

function MediaPick({ obj, set, setNote, field, label, onBusy, pw }) {
  const isMedia = field === "media";
  const LIMIT = isMedia ? 100 * 1048576 : 10 * 1048576;
  const [up, setUp] = useState(null); const xhr = useRef(null); const input = useRef(null);
  const pick = async (file) => {
    if (!file) return;
    if (!(isMedia ? /^(image|video)\//.test(file.type) : /^image\//.test(file.type))) return setNote("Unsupported file type.");
    if (file.size > LIMIT) return setNote(`File is too large (max ${isMedia ? "100 MB" : "10 MB"}).`);
    onBusy(true); setUp({ name: file.name, size: file.size, pct: 0, stage: "Uploading" });
    try {
      const sig = await api("/api/upload", { method: "POST" }, pw);
      const fd = new FormData(); fd.append("file", file); fd.append("api_key", sig.key); fd.append("timestamp", sig.timestamp); fd.append("signature", sig.signature); fd.append("folder", sig.folder);
      const res = await new Promise((resolve, reject) => {
        const x = new XMLHttpRequest(); xhr.current = x;
        x.open("POST", `https://api.cloudinary.com/v1_1/${sig.cloud}/auto/upload`);
        x.upload.onprogress = (e) => { if (e.lengthComputable) setUp((u) => ({ ...u, pct: Math.min(99, Math.round((e.loaded / e.total) * 100)) })); };
        x.upload.onload = () => setUp((u) => ({ ...u, pct: 100, stage: "Processing" }));
        x.onload = () => { let j = {}; try { j = JSON.parse(x.responseText); } catch {} x.status >= 200 && x.status < 300 ? resolve(j) : reject(new Error(j.error?.message || "Upload failed")); };
        x.onerror = () => reject(new Error("Network error during upload"));
        x.onabort = () => reject(new Error("Upload cancelled"));
        x.send(fd);
      });
      set((o) => ({ ...o, [field]: res.secure_url, ...(isMedia ? { mediaType: res.resource_type === "video" ? "video" : "image", mediaW: res.width || 0, mediaH: res.height || 0 } : {}) }));
      setNote("Upload complete.");
    } catch (e) { setNote(e.message); }
    finally { xhr.current = null; setUp(null); onBusy(false); if (input.current) input.current.value = ""; }
  };
  const remove = () => set((o) => ({ ...o, [field]: "", ...(isMedia ? { mediaType: "", mediaW: 0, mediaH: 0 } : {}) }));
  return (
    <div>
      <input className="inp" placeholder={label} value={obj[field]} disabled={!!up}
        onChange={(e) => set({ ...obj, [field]: e.target.value, ...(isMedia ? { mediaType: "", mediaW: 0, mediaH: 0 } : {}) })} />
      <input ref={input} type="file" disabled={!!up} accept={isMedia ? "image/*,video/*" : "image/*"} className="mt-2 text-sm" onChange={(e) => pick(e.target.files[0])} />
      {up && (
        <div className="mt-2 rounded-lg border border-[#251a45] p-3 text-sm" role="status" aria-live="polite">
          <div className="flex items-center justify-between gap-3"><span className="min-w-0 truncate">{up.name}</span><span className="shrink-0 tabular-nums text-slate-400">{fmtSize(up.size)}</span></div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#251a45]" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={up.pct}>
            <div className="h-full rounded-full bg-gradient-to-r from-volt to-hexa transition-[width] duration-200" style={{ width: `${up.pct}%` }} /></div>
          <div className="mt-2 flex items-center justify-between">
            <span className="font-semibold tabular-nums">{up.stage === "Processing" ? "Processing… 100%" : `Uploading… ${up.pct}%`}</span>
            <button type="button" onClick={() => xhr.current?.abort()} className="rounded border border-red-500/40 px-2 py-0.5 text-red-400">Cancel</button></div>
        </div>)}
      {!up && obj[field] && (
        <div className="mt-2 flex items-start gap-3">
          <div className="w-40 overflow-hidden rounded-lg border border-[#251a45]">
            {isMedia ? <Media src={obj.media} type={obj.mediaType} w={obj.mediaW} h={obj.mediaH}
              onMeta={(w, h) => set((o) => (o.mediaW === w && o.mediaH === h ? o : { ...o, mediaW: w, mediaH: h }))} /> : <img src={obj[field]} alt="" className="h-24 w-full object-cover" />}</div>
          <button type="button" onClick={remove} className="rounded border border-[#36275f] px-2 py-1 text-xs hover:border-volt">Remove</button></div>)}
    </div>);
}

function AdminPanel({ pw, articles, features, news, onDone }) {
  const E1 = { title: "", badge: "", description: "", media: "", mediaType: "", mediaW: 0, mediaH: 0 }, E2 = { title: "", author: "", image: "", content: "", metaDescription: "" };
  const E3 = { title: "", summary: "", link: "", image: "" };
  const [fe, setFe] = useState(E1); const [ar, setAr] = useState(E2);
  const [nw, setNw] = useState(E3); const [editN, setEditN] = useState(null); const [upN, setUpN] = useState(false);
  const [editF, setEditF] = useState(null); const [editA, setEditA] = useState(null);
  const [note, setNote] = useState(""); const [busy, setBusy] = useState(false); const lock = useRef(false);
  const [upF, setUpF] = useState(false); const [upA, setUpA] = useState(false);
  const run = async (fn, ok) => {
    if (lock.current) return; lock.current = true; setBusy(true);
    try { await fn(); setNote(ok); await onDone(); } catch (x) { setNote(x.message); } finally { lock.current = false; setBusy(false); }
  };
  const saveFeature = (e) => { e.preventDefault(); if (upF) return; run(async () => {
    if (editF) await api(`/api/features/${editF}`, { method: "PUT", body: JSON.stringify(fe) }, pw); else await post("/api/features", fe, pw);
    setFe(E1); setEditF(null); }, editF ? "Feature updated." : "Feature added."); };
  const saveArticle = (e) => { e.preventDefault(); if (upA) return; run(async () => {
    if (editA) await api(`/api/articles/${editA}`, { method: "PUT", body: JSON.stringify(ar) }, pw); else await post("/api/articles", ar, pw);
    setAr(E2); setEditA(null); }, editA ? "Article updated." : "Article published."); };
  const startEditF = (f) => { setEditF(f._id); setFe({ title: f.title, badge: f.badge, description: f.description, media: f.media || "", mediaType: f.mediaType || "", mediaW: f.mediaW || 0, mediaH: f.mediaH || 0 }); document.getElementById("featureForm")?.scrollIntoView({ behavior: "smooth" }); };
  const startEditA = (a) => { setEditA(a._id); setAr({ title: a.title, author: a.author, image: a.image || "", content: a.content, metaDescription: a.metaDescription || "" }); document.getElementById("articleForm")?.scrollIntoView({ behavior: "smooth" }); };
  const delF = (f) => { if (!lock.current && confirm(`Delete feature "${f.title}"?`)) run(() => api(`/api/features/${f._id}`, { method: "DELETE" }, pw), "Feature deleted."); };
  const delA = (a) => { if (!lock.current && confirm(`Delete article "${a.title}"?`)) run(() => api(`/api/articles/${a._id}`, { method: "DELETE" }, pw), "Article deleted."); };
  const saveNews = (e) => { e.preventDefault(); if (upN) return; run(async () => {
    if (editN) await api(`/api/news/${editN}`, { method: "PUT", body: JSON.stringify(nw) }, pw); else await post("/api/news", nw, pw);
    setNw(E3); setEditN(null); }, editN ? "News updated." : "News published."); };
  const startEditN = (n) => { setEditN(n._id); setNw({ title: n.title, summary: n.summary, link: n.link || "", image: n.image || "" }); document.getElementById("newsForm")?.scrollIntoView({ behavior: "smooth" }); };
  const delN = (n) => { if (!lock.current && confirm(`Delete news "${n.title}"?`)) run(() => api(`/api/news/${n._id}`, { method: "DELETE" }, pw), "News deleted."); };
  const List = ({ items, onEdit, onDel }) => (
    <ul className="mt-3 space-y-2">{items.map((x) => (
      <li key={x._id} className="flex items-center justify-between gap-3 rounded-lg border border-[#251a45] bg-panel px-4 py-3">
        <span className="min-w-0 truncate text-sm">{x.title} <span className="text-xs text-slate-500">· {fmt(x.createdAt).replace("Posted on: ", "")}</span></span>
        <span className="flex shrink-0 gap-2"><button disabled={busy} onClick={() => onEdit(x)} className="rounded border border-[#36275f] px-3 py-1 text-sm hover:border-volt disabled:opacity-40">Edit</button>
          <button disabled={busy} onClick={() => onDel(x)} className="rounded border border-red-500/40 px-3 py-1 text-sm text-red-400 disabled:opacity-40">Delete</button></span></li>))}</ul>);
  const Cancel = ({ on }) => <button type="button" disabled={busy} onClick={on} className="rounded-lg border border-[#36275f] px-4">Cancel</button>;
  return (
    <section id="admin" className="mx-auto max-w-6xl px-4 py-14">
      <h2 className="font-display text-3xl font-semibold">Admin panel</h2>
      {note && <p className="mt-2 text-sm text-hexa" role="status">{note}</p>}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <form id="featureForm" onSubmit={saveFeature} aria-busy={busy} className="rounded-xl border border-[#251a45] bg-panel p-5">
          <fieldset disabled={busy} className="space-y-3 disabled:opacity-60">
            <h3 className="font-display text-xl font-semibold">{editF ? "Edit feature" : "Add feature (photo or video)"}</h3>
            <input className="inp" placeholder="Feature title" value={fe.title} onChange={(e) => setFe({ ...fe, title: e.target.value })} required />
            <input className="inp" placeholder="Category or spec badge (e.g. 520 km range)" value={fe.badge} onChange={(e) => setFe({ ...fe, badge: e.target.value })} required />
            <textarea className="inp" rows={3} placeholder="Description" value={fe.description} onChange={(e) => setFe({ ...fe, description: e.target.value })} required />
            <MediaPick obj={fe} set={setFe} pw={pw} setNote={setNote} onBusy={setUpF} field="media" label="Photo / video URL (mp4 or YouTube link), or upload a file" />
            <div className="flex gap-2"><button disabled={busy || upF} className="btn">{upF ? "Uploading… please wait" : busy ? "Please wait…" : editF ? "Save changes" : "Add feature"}</button>
              {editF && <Cancel on={() => { setEditF(null); setFe(E1); }} />}</div>
          </fieldset></form>
        <form id="articleForm" onSubmit={saveArticle} aria-busy={busy} className="rounded-xl border border-[#251a45] bg-panel p-5">
          <fieldset disabled={busy} className="space-y-3 disabled:opacity-60">
            <h3 className="font-display text-xl font-semibold">{editA ? "Edit article" : "Publish article"}</h3>
            <input className="inp" placeholder="Article title" value={ar.title} onChange={(e) => setAr({ ...ar, title: e.target.value })} required />
            <input className="inp" placeholder="Author" value={ar.author} onChange={(e) => setAr({ ...ar, author: e.target.value })} required />
            <textarea className="inp" rows={5} placeholder="Content (blank line = new paragraph; table rows: Col A | Col B | Col C)" value={ar.content} onChange={(e) => setAr({ ...ar, content: e.target.value })} required />
            <input className="inp" maxLength={160} placeholder="SEO meta description (optional, up to 160 characters)" value={ar.metaDescription} onChange={(e) => setAr({ ...ar, metaDescription: e.target.value })} />
            <MediaPick obj={ar} set={setAr} pw={pw} setNote={setNote} onBusy={setUpA} field="image" label="Banner image URL (or upload a file)" />
            <div className="flex gap-2"><button disabled={busy || upA} className="btn">{upA ? "Uploading… please wait" : busy ? "Please wait…" : editA ? "Save changes" : "Publish article"}</button>
              {editA && <Cancel on={() => { setEditA(null); setAr(E2); }} />}</div>
          </fieldset></form>
        <form id="newsForm" onSubmit={saveNews} aria-busy={busy} className="rounded-xl border border-[#251a45] bg-panel p-5 lg:col-span-2">
          <fieldset disabled={busy} className="space-y-3 disabled:opacity-60">
            <h3 className="font-display text-xl font-semibold">{editN ? "Edit EV news" : "Add EV news"}</h3>
            <input className="inp" placeholder="Headline" value={nw.title} onChange={(e) => setNw({ ...nw, title: e.target.value })} required />
            <textarea className="inp" rows={3} maxLength={400} placeholder="Short summary (shown on the news card)" value={nw.summary} onChange={(e) => setNw({ ...nw, summary: e.target.value })} required />
            <input className="inp" type="url" placeholder="Source link (optional) https://…" value={nw.link} onChange={(e) => setNw({ ...nw, link: e.target.value })} />
            <MediaPick obj={nw} set={setNw} pw={pw} setNote={setNote} onBusy={setUpN} field="image" label="Photo URL (or upload a file)" />
            <div className="flex gap-2"><button disabled={busy || upN} className="btn">{upN ? "Uploading… please wait" : busy ? "Please wait…" : editN ? "Save changes" : "Publish news"}</button>
              {editN && <Cancel on={() => { setEditN(null); setNw(E3); }} />}</div>
          </fieldset></form>
      </div>
      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        <div><h3 className="font-display text-xl font-semibold">Manage features</h3>{!features.length && <p className="mt-3 text-sm text-slate-500">No features yet.</p>}<List items={features} onEdit={startEditF} onDel={delF} /></div>
        <div><h3 className="font-display text-xl font-semibold">Manage published articles</h3>{!articles.length && <p className="mt-3 text-sm text-slate-500">No articles yet.</p>}<List items={articles} onEdit={startEditA} onDel={delA} /></div>
        <div><h3 className="font-display text-xl font-semibold">Manage EV news</h3>{!news.length && <p className="mt-3 text-sm text-slate-500">No news yet.</p>}<List items={news} onEdit={startEditN} onDel={delN} /></div>
      </div>
    </section>);
}

function MovingCar() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 overflow-hidden" aria-hidden="true">
      <div className="hero-road" />
      <div className="drive absolute bottom-[33px] left-0"><CarRig className="hero-rig" /></div>
    </div>);
}

function HeroSlides() {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((n) => (
        <div key={n} className="slide" style={{ backgroundImage: `url(/hero/hero-${n}.jpg)`, animationDelay: `${(n - 1) * 5}s` }} />
      ))}
      <div className="day-scene" aria-hidden="true"><div className="day-sky" /><div className="day-sunwrap"><div className="day-rays" /><div className="day-sun" /></div><div className="day-cloud c1" /><div className="day-cloud c2" /><div className="day-cloud c3" /><div className="day-cloud c4" /><div className="day-far" /><div className="day-near" /><div className="day-trees" /></div>
      <div className="hero-ov absolute inset-0" />
    </div>);
}