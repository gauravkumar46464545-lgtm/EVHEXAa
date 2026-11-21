"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import Media from "@/components/Media";
import FaqAdmin from "@/components/FaqAdmin";
import { ArrowLeft, Lock, LogOut } from "lucide-react";

export const dynamic = "force-dynamic";

const SECTIONS = [
  { id: "news", label: "1. News" },
  { id: "popular", label: "2. Popular EV" },
  { id: "features", label: "3. Features & Highlights" },
  { id: "articles", label: "4. Latest Articles" },
  { id: "compare", label: "5. Compare Electric Vehicles" },
  { id: "faqs", label: "6. FAQs on EV" },
  { id: "videos", label: "7. Videos" },
];

const api = async (url, opt = {}, pw) => {
  const r = await fetch(url, {
    ...opt,
    headers: { "Content-Type": "application/json", ...(pw ? { "x-admin-password": pw } : {}) },
  });
  const j = await r.json();
  if (!r.ok) throw new Error(j.error || "Request failed");
  return j;
};
const post = (url, body, pw) => api(url, { method: "POST", body: JSON.stringify(body) }, pw);
const fmtSize = (b) => (b >= 1048576 ? (b / 1048576).toFixed(1) + " MB" : Math.max(1, Math.round(b / 1024)) + " KB");

function MediaPick({ obj, set, setNote, field, label, onBusy, pw }) {
  const isMedia = field === "media";
  const LIMIT = isMedia ? 100 * 1048576 : 10 * 1048576;
  const [up, setUp] = useState(null);
  const xhr = useRef(null);
  const input = useRef(null);

  const pick = async (file) => {
    if (!file) return;
    if (!(isMedia ? /^(image|video)\//.test(file.type) : /^image\//.test(file.type))) return setNote("Unsupported file type.");
    if (file.size > LIMIT) return setNote(`File is too large (max ${isMedia ? "100 MB" : "10 MB"}).`);
    onBusy(true);
    setUp({ name: file.name, size: file.size, pct: 0, stage: "Uploading" });
    try {
      const sig = await api("/api/upload", { method: "POST" }, pw);
      const fd = new FormData();
      fd.append("file", file);
      fd.append("api_key", sig.key);
      fd.append("timestamp", sig.timestamp);
      fd.append("signature", sig.signature);
      fd.append("folder", sig.folder);
      const res = await new Promise((resolve, reject) => {
        const x = new XMLHttpRequest();
        xhr.current = x;
        x.open("POST", `https://api.cloudinary.com/v1_1/${sig.cloud}/auto/upload`);
        x.upload.onprogress = (e) => {
          if (e.lengthComputable) setUp((u) => ({ ...u, pct: Math.min(99, Math.round((e.loaded / e.total) * 100)) }));
        };
        x.upload.onload = () => setUp((u) => ({ ...u, pct: 100, stage: "Processing" }));
        x.onload = () => {
          let j = {};
          try { j = JSON.parse(x.responseText); } catch {}
          x.status >= 200 && x.status < 300 ? resolve(j) : reject(new Error(j.error?.message || "Upload failed"));
        };
        x.onerror = () => reject(new Error("Network error during upload"));
        x.onabort = () => reject(new Error("Upload cancelled"));
        x.send(fd);
      });
      set((o) => ({
        ...o,
        [field]: res.secure_url,
        ...(isMedia ? { mediaType: res.resource_type === "video" ? "video" : "image", mediaW: res.width || 0, mediaH: res.height || 0 } : {}),
      }));
      setNote("Upload complete.");
    } catch (e) {
      setNote(e.message);
    } finally {
      xhr.current = null;
      setUp(null);
      onBusy(false);
      if (input.current) input.current.value = "";
    }
  };

  return (
    <div>
      <input
        className="inp"
        placeholder={label}
        value={obj[field] || ""}
        disabled={!!up}
        onChange={(e) => set({ ...obj, [field]: e.target.value })}
      />
      <input ref={input} type="file" disabled={!!up} accept={isMedia ? "image/*,video/*" : "image/*"} className="mt-2 text-sm" onChange={(e) => pick(e.target.files[0])} />
      {up && (
        <div className="mt-2 rounded-lg border border-[#251a45] p-3 text-sm">
          <div className="flex justify-between"><span>{up.name}</span><span>{fmtSize(up.size)}</span></div>
          <p className="mt-1 font-semibold">{up.stage === "Processing" ? "Processing… 100%" : `Uploading… ${up.pct}%`}</p>
        </div>
      )}
      {!up && obj[field] && (
        <div className="mt-2 flex items-start gap-3">
          <div className="w-36 overflow-hidden rounded-lg border border-[#251a45]">
            {isMedia ? <Media src={obj.media} type={obj.mediaType} w={obj.mediaW} h={obj.mediaH} /> : <img src={obj[field]} alt="" className="h-20 w-full object-cover" />}
          </div>
          <button type="button" onClick={() => set({ ...obj, [field]: "" })} className="rounded border border-[#36275f] px-2 py-1 text-xs hover:border-volt">Remove</button>
        </div>
      )}
    </div>
  );
}

export default function AdminDashboardPage() {
  const [pw, setPw] = useState("");
  const [passInput, setPassInput] = useState("");
  const [authErr, setAuthErr] = useState("");
  const [tab, setTab] = useState("news");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  const [news, setNews] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [features, setFeatures] = useState([]);
  const [articles, setArticles] = useState([]);
  const [compares, setCompares] = useState([]);
  const [videos, setVideos] = useState([]);

  // Forms
  const E_NEWS = { title: "", summary: "", link: "", image: "" };
  const [nw, setNw] = useState(E_NEWS);
  const [editN, setEditN] = useState(null);

  const E_VEH = { brand: "", model: "", price: "", speed: "", range: "", badge: "", photo: "" };
  const [vh, setVh] = useState(E_VEH);
  const [editV, setEditV] = useState(null);

  const E_FEA = { title: "", badge: "", description: "", media: "", mediaType: "", mediaW: 0, mediaH: 0 };
  const [fe, setFe] = useState(E_FEA);
  const [editF, setEditF] = useState(null);

  const E_ART = { title: "", author: "", image: "", content: "", metaDescription: "" };
  const [ar, setAr] = useState(E_ART);
  const [editA, setEditA] = useState(null);

  const E_CAR = { brand: "", model: "", price: "", range: "", speed: "", photo: "" };
  const [carA, setCarA] = useState(E_CAR);
  const [carB, setCarB] = useState(E_CAR);
  const [editC, setEditC] = useState(null);

  const E_VID = { title: "", description: "", url: "", badge: "EV VIDEO" };
  const [vd, setVd] = useState(E_VID);
  const [editVid, setEditVid] = useState(null);

  const loadAll = async () => {
    const [n, v, f, a, c, vdData] = await Promise.all([
      api("/api/news").catch(() => []),
      api("/api/vehicles").catch(() => []),
      api("/api/features").catch(() => []),
      api("/api/articles").catch(() => []),
      api("/api/compares").catch(() => []),
      api("/api/videos").catch(() => []),
    ]);
    setNews(n);
    setVehicles(v);
    setFeatures(f);
    setArticles(a);
    setCompares(c);
    setVideos(vdData);
  };

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("evh_admin_pw");
      if (saved) setPw(saved);
    } catch {}
  }, []);

  useEffect(() => {
    if (pw) loadAll();
  }, [pw]);

  const login = async (e) => {
    e.preventDefault();
    try {
      await post("/api/admin", {}, passInput);
      setPw(passInput);
      setAuthErr("");
      try { sessionStorage.setItem("evh_admin_pw", passInput); } catch {}
    } catch {
      setAuthErr("Wrong password. Try again.");
    }
  };

  const logout = () => {
    setPw("");
    try { sessionStorage.removeItem("evh_admin_pw"); } catch {}
  };

  if (!pw) {
    return (
      <div className="min-h-screen">
        <header className="border-b border-[#251a45] bg-ink/90">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <BrandLogo />
            <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase text-volt hover:underline">
              <ArrowLeft size={14} /> Back to Website
            </Link>
          </nav>
        </header>
        <main className="mx-auto flex max-w-md flex-col justify-center px-4 py-16">
          <form onSubmit={login} className="space-y-4 rounded-2xl border border-[#36275f] bg-panel p-6 shadow-xl">
            <div className="flex items-center gap-2">
              <Lock size={20} className="text-volt" />
              <h1 className="font-display text-2xl font-bold">EV HEXA Admin Panel</h1>
            </div>
            <p className="text-xs text-slate-400">Enter admin password to manage News, Popular EVs, Features, Articles, Compare EVs, FAQs &amp; Videos.</p>
            <input type="password" autoFocus className="inp" placeholder="Admin Password" value={passInput} onChange={(e) => setPassInput(e.target.value)} required />
            {authErr && <p className="text-sm text-red-400">{authErr}</p>}
            <button className="btn w-full">Unlock Admin Dashboard</button>
          </form>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-14">
      <header className="sticky top-0 z-30 border-b border-[#251a45] bg-ink/95 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-4">
            <BrandLogo />
            <span className="rounded-full bg-[#16a34a]/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#16a34a]">
              Admin Dashboard
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="rounded-lg border border-[#36275f] px-3 py-1.5 text-xs font-semibold hover:border-volt">
              View Live Site
            </Link>
            <button type="button" onClick={logout} className="inline-flex items-center gap-1 rounded-lg border border-red-500/40 px-3 py-1.5 text-xs font-semibold text-red-400">
              <LogOut size={13} /> Logout
            </button>
          </div>
        </nav>

        <div className="border-t border-[#251a45] bg-panel">
          <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-2.5">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => { setTab(s.id); setNote(""); }}
                className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-bold tracking-wide transition ${
                  tab === s.id ? "btn" : "border border-[#36275f] hover:border-volt"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pt-6">
        {note && <p className="mb-4 rounded-lg border border-[#16a34a]/40 bg-[#16a34a]/10 px-4 py-2 text-sm font-medium text-[#16a34a]">{note}</p>}

        {/* 1. NEWS */}
        {tab === "news" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setBusy(true);
                try {
                  if (editN) await api(`/api/news/${editN}`, { method: "PUT", body: JSON.stringify(nw) }, pw);
                  else await post("/api/news", nw, pw);
                  setNw(E_NEWS); setEditN(null); setNote("News saved."); await loadAll();
                } catch (err) { setNote(err.message); } finally { setBusy(false); }
              }}
              className="space-y-3 rounded-xl border border-[#251a45] bg-panel p-5"
            >
              <h2 className="font-display text-2xl font-bold">{editN ? "Edit News" : "Add New EV News"}</h2>
              <input className="inp" placeholder="Headline" value={nw.title} onChange={(e) => setNw({ ...nw, title: e.target.value })} required />
              <textarea className="inp" rows={3} placeholder="News summary" value={nw.summary} onChange={(e) => setNw({ ...nw, summary: e.target.value })} required />
              <input className="inp" placeholder="Source link (optional)" value={nw.link} onChange={(e) => setNw({ ...nw, link: e.target.value })} />
              <MediaPick obj={nw} set={setNw} pw={pw} setNote={setNote} onBusy={setBusy} field="image" label="News Banner Photo URL or Upload" />
              <div className="flex gap-2">
                <button disabled={busy} className="btn">{editN ? "Update News" : "Publish News"}</button>
                {editN && <button type="button" onClick={() => { setEditN(null); setNw(E_NEWS); }} className="rounded-lg border border-[#36275f] px-4">Cancel</button>}
              </div>
            </form>
            <div>
              <h3 className="font-display text-xl font-bold">Published News ({news.length})</h3>
              <ul className="mt-3 space-y-2">
                {news.map((n) => (
                  <li key={n._id} className="flex items-center justify-between gap-2 rounded-lg border border-[#251a45] bg-panel p-3">
                    <span className="truncate text-sm font-medium">{n.title}</span>
                    <span className="flex shrink-0 gap-2">
                      <button type="button" onClick={() => { setEditN(n._id); setNw({ title: n.title, summary: n.summary, link: n.link || "", image: n.image || "" }); }} className="rounded border border-[#36275f] px-2.5 py-1 text-xs hover:border-volt">Edit</button>
                      <button type="button" onClick={async () => { if (confirm("Delete this news?")) { await api(`/api/news/${n._id}`, { method: "DELETE" }, pw); await loadAll(); } }} className="rounded border border-red-500/40 px-2.5 py-1 text-xs text-red-400">Delete</button>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* 2. POPULAR EV */}
        {tab === "popular" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setBusy(true);
                try {
                  const payload = { ...vh, price: Number(vh.price), speed: Number(vh.speed), range: Number(vh.range) };
                  if (editV) await api("/api/vehicles", { method: "PUT", body: JSON.stringify({ _id: editV, ...payload }) }, pw);
                  else await post("/api/vehicles", payload, pw);
                  setVh(E_VEH); setEditV(null); setNote("Popular EV saved."); await loadAll();
                } catch (err) { setNote(err.message); } finally { setBusy(false); }
              }}
              className="space-y-3 rounded-xl border border-[#251a45] bg-panel p-5"
            >
              <h2 className="font-display text-2xl font-bold">{editV ? "Edit Popular EV" : "Add New Popular EV"}</h2>
              <div className="grid grid-cols-2 gap-2">
                <input className="inp" placeholder="Brand (e.g. Tata)" value={vh.brand} onChange={(e) => setVh({ ...vh, brand: e.target.value })} required />
                <input className="inp" placeholder="Model (e.g. Nexon EV)" value={vh.model} onChange={(e) => setVh({ ...vh, model: e.target.value })} required />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <input type="number" step="0.01" className="inp" placeholder="Price (Lakh)" value={vh.price} onChange={(e) => setVh({ ...vh, price: e.target.value })} required />
                <input type="number" className="inp" placeholder="Top Speed (km/h)" value={vh.speed} onChange={(e) => setVh({ ...vh, speed: e.target.value })} required />
                <input type="number" className="inp" placeholder="Range (km)" value={vh.range} onChange={(e) => setVh({ ...vh, range: e.target.value })} required />
              </div>
              <input className="inp" placeholder="Badge (optional, e.g. Bestseller)" value={vh.badge} onChange={(e) => setVh({ ...vh, badge: e.target.value })} />
              <MediaPick obj={vh} set={setVh} pw={pw} setNote={setNote} onBusy={setBusy} field="photo" label="EV Photo URL or Upload Photo" />
              <div className="flex gap-2">
                <button disabled={busy} className="btn">{editV ? "Update EV" : "Add Popular EV"}</button>
                {editV && <button type="button" onClick={() => { setEditV(null); setVh(E_VEH); }} className="rounded-lg border border-[#36275f] px-4">Cancel</button>}
              </div>
            </form>
            <div>
              <h3 className="font-display text-xl font-bold">Manage Popular EVs ({vehicles.length})</h3>
              <ul className="mt-3 space-y-2">
                {vehicles.map((v) => (
                  <li key={v._id} className="flex items-center justify-between gap-2 rounded-lg border border-[#251a45] bg-panel p-3">
                    <span className="truncate text-sm font-medium">{v.brand} {v.model} · ₹{v.price}L · {v.range} km</span>
                    <span className="flex shrink-0 gap-2">
                      <button type="button" onClick={() => { setEditV(v._id); setVh({ brand: v.brand, model: v.model, price: v.price, speed: v.speed, range: v.range, badge: v.badge || "", photo: v.photo || "" }); }} className="rounded border border-[#36275f] px-2.5 py-1 text-xs hover:border-volt">Edit</button>
                      <button type="button" onClick={async () => { if (confirm(`Delete ${v.brand} ${v.model}?`)) { await api(`/api/vehicles?id=${v._id}`, { method: "DELETE" }, pw); await loadAll(); } }} className="rounded border border-red-500/40 px-2.5 py-1 text-xs text-red-400">Delete</button>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* 3. FEATURES & HIGHLIGHTS */}
        {tab === "features" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setBusy(true);
                try {
                  if (editF) await api(`/api/features/${editF}`, { method: "PUT", body: JSON.stringify(fe) }, pw);
                  else await post("/api/features", fe, pw);
                  setFe(E_FEA); setEditF(null); setNote("Feature/Video saved."); await loadAll();
                } catch (err) { setNote(err.message); } finally { setBusy(false); }
              }}
              className="space-y-3 rounded-xl border border-[#251a45] bg-panel p-5"
            >
              <h2 className="font-display text-2xl font-bold">{editF ? "Edit Feature / Video" : "Add Feature or Video"}</h2>
              <input className="inp" placeholder="Title" value={fe.title} onChange={(e) => setFe({ ...fe, title: e.target.value })} required />
              <input className="inp" placeholder="Badge (e.g. 520 km range or 0:07 Video)" value={fe.badge} onChange={(e) => setFe({ ...fe, badge: e.target.value })} required />
              <textarea className="inp" rows={3} placeholder="Description" value={fe.description} onChange={(e) => setFe({ ...fe, description: e.target.value })} required />
              <MediaPick obj={fe} set={setFe} pw={pw} setNote={setNote} onBusy={setBusy} field="media" label="Photo / Video URL or Upload File" />
              <div className="flex gap-2">
                <button disabled={busy} className="btn">{editF ? "Update Feature" : "Add Feature"}</button>
                {editF && <button type="button" onClick={() => { setEditF(null); setFe(E_FEA); }} className="rounded-lg border border-[#36275f] px-4">Cancel</button>}
              </div>
            </form>
            <div>
              <h3 className="font-display text-xl font-bold">Manage Features &amp; Videos ({features.length})</h3>
              <ul className="mt-3 space-y-2">
                {features.map((f) => (
                  <li key={f._id} className="flex items-center justify-between gap-2 rounded-lg border border-[#251a45] bg-panel p-3">
                    <span className="truncate text-sm font-medium">{f.title}</span>
                    <span className="flex shrink-0 gap-2">
                      <button type="button" onClick={() => { setEditF(f._id); setFe({ title: f.title, badge: f.badge, description: f.description, media: f.media || "", mediaType: f.mediaType || "", mediaW: f.mediaW || 0, mediaH: f.mediaH || 0 }); }} className="rounded border border-[#36275f] px-2.5 py-1 text-xs hover:border-volt">Edit</button>
                      <button type="button" onClick={async () => { if (confirm("Delete this item?")) { await api(`/api/features/${f._id}`, { method: "DELETE" }, pw); await loadAll(); } }} className="rounded border border-red-500/40 px-2.5 py-1 text-xs text-red-400">Delete</button>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* 4. LATEST ARTICLES */}
        {tab === "articles" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setBusy(true);
                try {
                  if (editA) await api(`/api/articles/${editA}`, { method: "PUT", body: JSON.stringify(ar) }, pw);
                  else await post("/api/articles", ar, pw);
                  setAr(E_ART); setEditA(null); setNote("Article saved."); await loadAll();
                } catch (err) { setNote(err.message); } finally { setBusy(false); }
              }}
              className="space-y-3 rounded-xl border border-[#251a45] bg-panel p-5"
            >
              <h2 className="font-display text-2xl font-bold">{editA ? "Edit Article" : "Publish New Article"}</h2>
              <input className="inp" placeholder="Article title" value={ar.title} onChange={(e) => setAr({ ...ar, title: e.target.value })} required />
              <input className="inp" placeholder="Author" value={ar.author} onChange={(e) => setAr({ ...ar, author: e.target.value })} required />
              <textarea className="inp" rows={5} placeholder="Article content" value={ar.content} onChange={(e) => setAr({ ...ar, content: e.target.value })} required />
              <input className="inp" placeholder="SEO meta description (optional)" value={ar.metaDescription} onChange={(e) => setAr({ ...ar, metaDescription: e.target.value })} />
              <MediaPick obj={ar} set={setAr} pw={pw} setNote={setNote} onBusy={setBusy} field="image" label="Banner Image URL or Upload" />
              <div className="flex gap-2">
                <button disabled={busy} className="btn">{editA ? "Update Article" : "Publish Article"}</button>
                {editA && <button type="button" onClick={() => { setEditA(null); setAr(E_ART); }} className="rounded-lg border border-[#36275f] px-4">Cancel</button>}
              </div>
            </form>
            <div>
              <h3 className="font-display text-xl font-bold">Published Articles ({articles.length})</h3>
              <ul className="mt-3 space-y-2">
                {articles.map((a) => (
                  <li key={a._id} className="flex items-center justify-between gap-2 rounded-lg border border-[#251a45] bg-panel p-3">
                    <span className="truncate text-sm font-medium">{a.title}</span>
                    <span className="flex shrink-0 gap-2">
                      <button type="button" onClick={() => { setEditA(a._id); setAr({ title: a.title, author: a.author, image: a.image || "", content: a.content, metaDescription: a.metaDescription || "" }); }} className="rounded border border-[#36275f] px-2.5 py-1 text-xs hover:border-volt">Edit</button>
                      <button type="button" onClick={async () => { if (confirm("Delete this article?")) { await api(`/api/articles/${a._id}`, { method: "DELETE" }, pw); await loadAll(); } }} className="rounded border border-red-500/40 px-2.5 py-1 text-xs text-red-400">Delete</button>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* 5. COMPARE ELECTRIC VEHICLES */}
        {tab === "compare" && (
          <div className="space-y-6">
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setBusy(true);
                try {
                  const payload = {
                    carA: { ...carA, price: Number(carA.price), range: Number(carA.range), speed: Number(carA.speed) },
                    carB: { ...carB, price: Number(carB.price), range: Number(carB.range), speed: Number(carB.speed) },
                  };
                  if (editC) await api("/api/compares", { method: "PUT", body: JSON.stringify({ _id: editC, ...payload }) }, pw);
                  else await post("/api/compares", payload, pw);
                  setCarA(E_CAR); setCarB(E_CAR); setEditC(null); setNote("Compare EVs saved."); await loadAll();
                } catch (err) { setNote(err.message); } finally { setBusy(false); }
              }}
              className="rounded-xl border border-[#251a45] bg-panel p-5"
            >
              <h2 className="font-display text-2xl font-bold">{editC ? "Edit Compare EV Pair" : "Add New Compare EV Pair"}</h2>
              <div className="mt-4 grid gap-6 md:grid-cols-2">
                {[
                  { title: "Car 1 (Left)", car: carA, set: setCarA },
                  { title: "Car 2 (Right)", car: carB, set: setCarB },
                ].map(({ title, car, set }) => (
                  <div key={title} className="space-y-2.5 rounded-lg border border-[#36275f] p-4">
                    <p className="text-xs font-bold uppercase text-[#16a34a]">{title}</p>
                    <input className="inp" placeholder="Brand" value={car.brand} onChange={(e) => set({ ...car, brand: e.target.value })} required />
                    <input className="inp" placeholder="Model" value={car.model} onChange={(e) => set({ ...car, model: e.target.value })} required />
                    <div className="grid grid-cols-3 gap-2">
                      <input type="number" step="0.01" className="inp" placeholder="Price (Lakh)" value={car.price} onChange={(e) => set({ ...car, price: e.target.value })} required />
                      <input type="number" className="inp" placeholder="Range (km)" value={car.range} onChange={(e) => set({ ...car, range: e.target.value })} required />
                      <input type="number" className="inp" placeholder="Speed (km/h)" value={car.speed} onChange={(e) => set({ ...car, speed: e.target.value })} required />
                    </div>
                    <MediaPick obj={car} set={set} pw={pw} setNote={setNote} onBusy={setBusy} field="photo" label="Car Photo URL or Upload Photo" />
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <button disabled={busy} className="btn">{editC ? "Update Comparison" : "Add Comparison"}</button>
                {editC && <button type="button" onClick={() => { setEditC(null); setCarA(E_CAR); setCarB(E_CAR); }} className="rounded-lg border border-[#36275f] px-4">Cancel</button>}
              </div>
            </form>

            <div>
              <h3 className="font-display text-xl font-bold">Manage Compare EV Pairs ({compares.length})</h3>
              <ul className="mt-3 space-y-2">
                {compares.map((c) => (
                  <li key={c._id} className="flex items-center justify-between gap-2 rounded-lg border border-[#251a45] bg-panel p-3">
                    <span className="text-sm font-medium">{c.carA.brand} {c.carA.model} <strong className="text-[#16a34a]">VS</strong> {c.carB.brand} {c.carB.model}</span>
                    <span className="flex shrink-0 gap-2">
                      <button type="button" onClick={() => { setEditC(c._id); setCarA({ ...c.carA }); setCarB({ ...c.carB }); }} className="rounded border border-[#36275f] px-2.5 py-1 text-xs hover:border-volt">Edit</button>
                      <button type="button" onClick={async () => { if (confirm("Delete this comparison?")) { await api(`/api/compares?id=${c._id}`, { method: "DELETE" }, pw); await loadAll(); } }} className="rounded border border-red-500/40 px-2.5 py-1 text-xs text-red-400">Delete</button>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* 6. FAQs ON EV */}
        {tab === "faqs" && <FaqAdmin pw={pw} onChanged={() => setNote("FAQs updated.")} />}

        {/* 7. VIDEOS */}
        {tab === "videos" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setBusy(true);
                try {
                  if (editVid) await api("/api/videos", { method: "PUT", body: JSON.stringify({ _id: editVid, ...vd }) }, pw);
                  else await post("/api/videos", vd, pw);
                  setVd(E_VID);
                  setEditVid(null);
                  setNote("Video saved.");
                  await loadAll();
                } catch (err) {
                  setNote(err.message);
                } finally {
                  setBusy(false);
                }
              }}
              className="space-y-3 rounded-xl border border-[#251a45] bg-panel p-5"
            >
              <h2 className="font-display text-2xl font-bold">{editVid ? "Edit YouTube Video" : "Add YouTube Video"}</h2>
              <input
                className="inp"
                placeholder="Video title"
                value={vd.title}
                onChange={(e) => setVd({ ...vd, title: e.target.value })}
                required
              />
              <textarea
                className="inp"
                rows={3}
                placeholder="Video description"
                value={vd.description}
                onChange={(e) => setVd({ ...vd, description: e.target.value })}
                required
              />
              <input
                type="url"
                className="inp"
                placeholder="YouTube Video URL (https://www.youtube.com/watch?v=... or youtu.be/...)"
                value={vd.url}
                onChange={(e) => setVd({ ...vd, url: e.target.value })}
                required
              />
              <div className="flex gap-2">
                <button disabled={busy} className="btn">{editVid ? "Update Video" : "Add Video"}</button>
                {editVid && (
                  <button type="button" onClick={() => { setEditVid(null); setVd(E_VID); }} className="rounded-lg border border-[#36275f] px-4">
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <div>
              <h3 className="font-display text-xl font-bold">Manage Videos ({videos.length})</h3>
              <ul className="mt-3 space-y-2">
                {videos.map((item) => (
                  <li key={item._id} className="flex items-center justify-between gap-2 rounded-lg border border-[#251a45] bg-panel p-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{item.title}</p>
                      <p className="truncate text-xs text-slate-400">{item.url}</p>
                    </div>
                    <span className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditVid(item._id);
                          setVd({ title: item.title, description: item.description, url: item.url, badge: item.badge || "EV VIDEO" });
                        }}
                        className="rounded border border-[#36275f] px-2.5 py-1 text-xs hover:border-volt"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          if (confirm("Delete this video?")) {
                            await api(`/api/videos?id=${item._id}`, { method: "DELETE" }, pw);
                            await loadAll();
                          }
                        }}
                        className="rounded border border-red-500/40 px-2.5 py-1 text-xs text-red-400"
                      >
                        Delete
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}