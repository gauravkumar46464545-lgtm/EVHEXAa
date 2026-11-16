"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Media from "@/components/Media";
import ThemeMenu from "@/components/ThemeMenu";
import { Instagram, Facebook, Youtube, Star, ThumbsUp, ThumbsDown, Phone, Mail, MapPin, Lock, X } from "lucide-react";

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
const Img = ({ src, className, alt = "" }) => src ? <img src={src} alt={alt} className={className} loading="lazy" /> : <div className={className + " bg-gradient-to-br from-panel to-[#12303a]"} />;
const Stars = ({ value, onPick }) => (
  <div className="flex gap-1">{[1, 2, 3, 4, 5].map((n) => (
    <button type="button" key={n} onClick={() => onPick?.(n)} aria-label={`${n} star`} disabled={!onPick}>
      <Star size={onPick ? 26 : 16} className={n <= value ? "fill-hexa text-hexa" : "text-slate-600"} /></button>))}</div>
);

export default function Home() {
  const [features, setFeatures] = useState([]); const [articles, setArticles] = useState([]); const [reviews, setReviews] = useState([]);
  const [open, setOpen] = useState(null); const [pw, setPw] = useState(null); const [showLogin, setShowLogin] = useState(false);
  const [votes, setVotes] = useState({}); const [msg, setMsg] = useState("");

  const load = async () => {
    const [f, a, r] = await Promise.all([api("/api/features"), api("/api/articles"), api("/api/reviews")]);
    setFeatures(f); setArticles(a); setReviews(r);
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
      <header className="sticky top-0 z-30 border-b border-[#16222d] bg-ink/90 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <a href="#top" aria-label="EV HEXA home" className="block h-12 w-12 overflow-hidden rounded-full"><img src="/logo.png" alt="EV HEXA" className="h-full w-full scale-[1.1] object-cover" /></a>
          <div className="flex items-center gap-5 text-sm">
            <a href="#features" className="hidden hover:text-volt sm:block">Features</a>
            <a href="#articles" className="hidden hover:text-volt sm:block">Articles</a>
            <a href="#reviews" className="hidden hover:text-volt sm:block">Reviews</a>
            <ThemeMenu />
          </div>
        </nav>
      </header>

      <main id="top">
        <section className="relative overflow-hidden border-b border-[#16222d]">
          <HeroSlides />
          <MovingCar />
          <div className="relative mx-auto max-w-6xl px-4 pb-44 pt-20 md:pb-48 md:pt-28">
            <h1 className="font-display text-5xl font-bold leading-[1.02] md:text-7xl">Every charge,<br />every mile, <span className="text-volt">reviewed.</span></h1>
            <p className="mt-5 max-w-xl text-lg text-slate-400">EV HEXA covers electric vehicle news, launches and honest owner reviews.</p>
            <div className="mt-8 flex gap-3"><a href="#articles" className="btn">Read latest articles</a><a href="#reviews" className="rounded-lg border border-[#1c2a37] px-5 py-2.5 hover:border-hexa">Write a review</a></div>
          </div>
        </section>

        {msg && <p className="mx-auto mt-4 max-w-6xl px-4 text-sm text-red-400" role="alert">{msg}</p>}

        <section id="features" className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="font-display text-3xl font-semibold">Featured highlights</h2>
          {!features.length && <p className="mt-4 text-slate-500">No highlights yet. The admin can add the first one.</p>}
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {features.map((f) => (
              <article key={f._id} className="overflow-hidden rounded-lg border border-[#16222d] bg-panel">
                <Media src={f.media} type={f.mediaType} alt={f.title} />
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
              <Link key={a._id} href={`/articles/${a.slug || a._id}`} className="block overflow-hidden rounded-xl border border-[#16222d] bg-panel hover:border-volt">
                <Img src={a.image} alt={a.title} className="h-44 w-full object-cover" />
                <div className="p-4"><h3 className="font-display text-xl font-semibold">{a.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-400">{a.content}</p>
                  <p className="mt-3 text-xs text-slate-500">By {a.author} · {fmt(a.createdAt)}</p>
                  <p className="mt-2 flex gap-4 text-xs text-slate-400"><span>👍 {a.likes}</span><span>👎 {a.dislikes}</span><span>💬 {a.comments.length}</span></p></div>
              </Link>))}
          </div>
        </section>

        <ReviewSection reviews={reviews} onAdded={(r) => setReviews([r, ...reviews])} />
        {pw && <AdminPanel pw={pw} articles={articles} features={features} onDone={load} />}
      </main>

      {showLogin && <Login onClose={() => setShowLogin(false)} onOk={(p) => { setPw(p); setShowLogin(false); goAdmin(); }} />}

      <footer className="mt-10 border-t border-[#16222d] bg-panel">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-2">
          <div><div className="mb-4 h-16 w-16 overflow-hidden rounded-full"><img src="/logo.png" alt="EV HEXA" className="h-full w-full scale-[1.1] object-cover" /></div><p className="font-display text-xl font-semibold">Follow EV HEXA</p>
            <div className="mt-3 flex gap-4">
              <a href="https://instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram" className="rounded-full border border-[#1c2a37] p-3 hover:border-volt hover:text-volt"><Instagram /></a>
              <a href="https://facebook.com/" target="_blank" rel="noreferrer" aria-label="Facebook" className="rounded-full border border-[#1c2a37] p-3 hover:border-volt hover:text-volt"><Facebook /></a>
              <a href="https://youtube.com/" target="_blank" rel="noreferrer" aria-label="YouTube" className="rounded-full border border-[#1c2a37] p-3 hover:border-volt hover:text-volt"><Youtube /></a></div></div>
          <div><p className="font-display text-xl font-semibold">Contact</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-400">
              <li className="flex gap-2"><Phone size={16} />+91 00000 00000</li>
              <li className="flex gap-2"><Mail size={16} />contact@evhexa.com</li>
              <li className="flex gap-2"><MapPin size={16} />Your office address, City, State, India</li></ul></div>
        </div>
        <div className="border-t border-[#16222d]"><div className="mx-auto grid max-w-6xl items-center gap-3 px-4 py-4 text-sm text-slate-500 md:grid-cols-3">
          <span className="hidden md:block" />
          <p className="text-center">Developed by Nexworktech</p>
          <button onClick={() => (pw ? goAdmin() : setShowLogin(true))} className="flex items-center justify-center gap-1 justify-self-center rounded-lg border border-[#1c2a37] px-3 py-1.5 hover:border-volt hover:text-volt md:justify-self-end"><Lock size={14} />{pw ? "Admin Panel" : "Admin Login"}</button>
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
      <form onSubmit={go} onClick={(e) => e.stopPropagation()} className="w-full max-w-sm space-y-3 rounded-xl border border-[#1c2a37] bg-panel p-6">
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
        <form onSubmit={send} className="space-y-3 self-start rounded-xl border border-[#16222d] bg-panel p-5">
          <input className="inp" placeholder="Your name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} required />
          <Stars value={f.rating} onPick={(n) => setF({ ...f, rating: n })} />
          <textarea className="inp" rows={4} placeholder="Your review of an EV or EV HEXA" value={f.text} onChange={(e) => setF({ ...f, text: e.target.value })} required />
          {err && <p className="text-sm text-red-400">{err}</p>}
          <button className="btn w-full">Submit review</button></form>
        <div className="grid gap-4 sm:grid-cols-2">
          {!reviews.length && <p className="text-slate-500">No reviews yet. Be the first to write one.</p>}
          {reviews.map((r) => (
            <div key={r._id} className="rounded-xl border border-[#16222d] bg-panel p-4"><Stars value={r.rating} />
              <p className="mt-2 text-sm text-slate-300">{r.text}</p>
              <p className="mt-3 text-sm font-medium">{r.name}</p><p className="text-xs text-slate-500">{short(r.createdAt)}</p></div>))}
        </div>
      </div>
    </section>);
}

function MediaPick({ obj, set, pw, setNote, field, label }) {
  const upload = async (file) => {
    if (!file) return; setNote("Uploading…");
    const fd = new FormData(); fd.append("file", file);
    try {
      const r = await fetch("/api/upload", { method: "POST", body: fd, headers: { "x-admin-password": pw } });
      const j = await r.json(); if (!r.ok) throw new Error(j.error);
      set({ ...obj, [field]: j.url, ...(field === "media" ? { mediaType: j.type } : {}) }); setNote("Upload complete.");
    } catch (e) { setNote(e.message); }
  };
  return (<div><input className="inp" placeholder={label} value={obj[field]} onChange={(e) => set({ ...obj, [field]: e.target.value, ...(field === "media" ? { mediaType: "" } : {}) })} />
    <input type="file" accept={field === "media" ? "image/*,video/*" : "image/*"} className="mt-2 text-sm" onChange={(e) => upload(e.target.files[0])} />
    {field === "media" && obj.media && <div className="mt-2 w-48 overflow-hidden rounded"><Media src={obj.media} type={obj.mediaType} /></div>}</div>);
}

function AdminPanel({ pw, articles, features, onDone }) {
  const E1 = { title: "", badge: "", description: "", media: "", mediaType: "" }, E2 = { title: "", author: "", image: "", content: "", metaDescription: "" };
  const [fe, setFe] = useState(E1); const [ar, setAr] = useState(E2);
  const [editF, setEditF] = useState(null); const [editA, setEditA] = useState(null);
  const [note, setNote] = useState(""); const [busy, setBusy] = useState(false); const lock = useRef(false);
  const run = async (fn, ok) => {
    if (lock.current) return; lock.current = true; setBusy(true);
    try { await fn(); setNote(ok); await onDone(); } catch (x) { setNote(x.message); } finally { lock.current = false; setBusy(false); }
  };
  const saveFeature = (e) => { e.preventDefault(); run(async () => {
    if (editF) await api(`/api/features/${editF}`, { method: "PUT", body: JSON.stringify(fe) }, pw); else await post("/api/features", fe, pw);
    setFe(E1); setEditF(null); }, editF ? "Feature updated." : "Feature added."); };
  const saveArticle = (e) => { e.preventDefault(); run(async () => {
    if (editA) await api(`/api/articles/${editA}`, { method: "PUT", body: JSON.stringify(ar) }, pw); else await post("/api/articles", ar, pw);
    setAr(E2); setEditA(null); }, editA ? "Article updated." : "Article published."); };
  const startEditF = (f) => { setEditF(f._id); setFe({ title: f.title, badge: f.badge, description: f.description, media: f.media || "", mediaType: f.mediaType || "" }); document.getElementById("featureForm")?.scrollIntoView({ behavior: "smooth" }); };
  const startEditA = (a) => { setEditA(a._id); setAr({ title: a.title, author: a.author, image: a.image || "", content: a.content, metaDescription: a.metaDescription || "" }); document.getElementById("articleForm")?.scrollIntoView({ behavior: "smooth" }); };
  const delF = (f) => { if (!lock.current && confirm(`Delete feature "${f.title}"?`)) run(() => api(`/api/features/${f._id}`, { method: "DELETE" }, pw), "Feature deleted."); };
  const delA = (a) => { if (!lock.current && confirm(`Delete article "${a.title}"?`)) run(() => api(`/api/articles/${a._id}`, { method: "DELETE" }, pw), "Article deleted."); };
  const List = ({ items, onEdit, onDel }) => (
    <ul className="mt-3 space-y-2">{items.map((x) => (
      <li key={x._id} className="flex items-center justify-between gap-3 rounded-lg border border-[#16222d] bg-panel px-4 py-3">
        <span className="min-w-0 truncate text-sm">{x.title} <span className="text-xs text-slate-500">· {fmt(x.createdAt).replace("Posted on: ", "")}</span></span>
        <span className="flex shrink-0 gap-2"><button disabled={busy} onClick={() => onEdit(x)} className="rounded border border-[#1c2a37] px-3 py-1 text-sm hover:border-volt disabled:opacity-40">Edit</button>
          <button disabled={busy} onClick={() => onDel(x)} className="rounded border border-red-500/40 px-3 py-1 text-sm text-red-400 disabled:opacity-40">Delete</button></span></li>))}</ul>);
  const Cancel = ({ on }) => <button type="button" disabled={busy} onClick={on} className="rounded-lg border border-[#1c2a37] px-4">Cancel</button>;
  return (
    <section id="admin" className="mx-auto max-w-6xl px-4 py-14">
      <h2 className="font-display text-3xl font-semibold">Admin panel</h2>
      {note && <p className="mt-2 text-sm text-hexa" role="status">{note}</p>}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <form id="featureForm" onSubmit={saveFeature} aria-busy={busy} className="rounded-xl border border-[#16222d] bg-panel p-5">
          <fieldset disabled={busy} className="space-y-3 disabled:opacity-60">
            <h3 className="font-display text-xl font-semibold">{editF ? "Edit feature" : "Add feature (photo or video)"}</h3>
            <input className="inp" placeholder="Feature title" value={fe.title} onChange={(e) => setFe({ ...fe, title: e.target.value })} required />
            <input className="inp" placeholder="Category or spec badge (e.g. 520 km range)" value={fe.badge} onChange={(e) => setFe({ ...fe, badge: e.target.value })} required />
            <textarea className="inp" rows={3} placeholder="Description" value={fe.description} onChange={(e) => setFe({ ...fe, description: e.target.value })} required />
            <MediaPick obj={fe} set={setFe} pw={pw} setNote={setNote} field="media" label="Photo / video URL (mp4 or YouTube link), or upload a file" />
            <div className="flex gap-2"><button className="btn disabled:cursor-not-allowed">{busy ? "Please wait…" : editF ? "Save changes" : "Add feature"}</button>
              {editF && <Cancel on={() => { setEditF(null); setFe(E1); }} />}</div>
          </fieldset></form>
        <form id="articleForm" onSubmit={saveArticle} aria-busy={busy} className="rounded-xl border border-[#16222d] bg-panel p-5">
          <fieldset disabled={busy} className="space-y-3 disabled:opacity-60">
            <h3 className="font-display text-xl font-semibold">{editA ? "Edit article" : "Publish article"}</h3>
            <input className="inp" placeholder="Article title" value={ar.title} onChange={(e) => setAr({ ...ar, title: e.target.value })} required />
            <input className="inp" placeholder="Author" value={ar.author} onChange={(e) => setAr({ ...ar, author: e.target.value })} required />
            <textarea className="inp" rows={5} placeholder="Content (blank line = new paragraph; table rows: Col A | Col B | Col C)" value={ar.content} onChange={(e) => setAr({ ...ar, content: e.target.value })} required />
            <input className="inp" maxLength={160} placeholder="SEO meta description (optional, up to 160 characters)" value={ar.metaDescription} onChange={(e) => setAr({ ...ar, metaDescription: e.target.value })} />
            <MediaPick obj={ar} set={setAr} pw={pw} setNote={setNote} field="image" label="Banner image URL (or upload a file)" />
            <div className="flex gap-2"><button className="btn disabled:cursor-not-allowed">{busy ? "Please wait…" : editA ? "Save changes" : "Publish article"}</button>
              {editA && <Cancel on={() => { setEditA(null); setAr(E2); }} />}</div>
          </fieldset></form>
      </div>
      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div><h3 className="font-display text-xl font-semibold">Manage features</h3>{!features.length && <p className="mt-3 text-sm text-slate-500">No features yet.</p>}<List items={features} onEdit={startEditF} onDel={delF} /></div>
        <div><h3 className="font-display text-xl font-semibold">Manage published articles</h3>{!articles.length && <p className="mt-3 text-sm text-slate-500">No articles yet.</p>}<List items={articles} onEdit={startEditA} onDel={delA} /></div>
      </div>
    </section>);
}

function MovingCar() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 overflow-hidden" aria-hidden="true">
      <div className="road absolute inset-x-0 bottom-3 h-px" />
      <div className="car absolute bottom-4 left-0 w-60"><svg viewBox="0 0 240 80" width="240" height="80"><ellipse cx="120" cy="74" rx="105" ry="4" fill="#000" opacity=".5"/><path d="M10 58 L10 46 Q10 40 18 38 L60 32 Q75 14 100 12 L150 12 Q172 14 188 32 L222 38 Q232 40 232 48 L232 58 Z" fill="#10e39a"/><path d="M72 32 Q82 19 102 18 L120 18 L120 32 Z M128 18 L150 18 Q164 20 176 32 L128 32 Z" fill="#0a2630"/><path d="M224 42 L232 44 L232 48 L224 48 Z" fill="#fff"/><path d="M8 46 L12 46 L12 50 L8 50 Z" fill="#ff7a1a"/><g><circle cx="56" cy="60" r="15" fill="#0b0f14" stroke="#19d3ff" strokeWidth="2"/><g className="wheel"><path d="M56 48 V72 M44 60 H68 M47 51 L65 69 M65 51 L47 69" stroke="#19d3ff" strokeWidth="1.5"/></g></g><g><circle cx="188" cy="60" r="15" fill="#0b0f14" stroke="#19d3ff" strokeWidth="2"/><g className="wheel"><path d="M188 48 V72 M176 60 H200 M179 51 L197 69 M197 51 L179 69" stroke="#19d3ff" strokeWidth="1.5"/></g></g></svg></div>
    </div>);
}

function HeroSlides() {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((n) => (
        <div key={n} className="slide" style={{ backgroundImage: `url(/hero/hero-${n}.${n === 4 ? "png" : "svg"})`, animationDelay: `${(n - 1) * 5}s` }} />
      ))}
      <div className="hero-ov absolute inset-0" />
    </div>);
}
