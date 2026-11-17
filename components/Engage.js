"use client";
import { useEffect, useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { fmt } from "@/lib/fmt";
const post = async (url, body) => {
  const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const j = await r.json(); if (!r.ok) throw new Error(j.error || "Request failed"); return j;
};
export default function Engage({ initial }) {
  const [a, setA] = useState(initial); const [v, setV] = useState(null); const [err, setErr] = useState("");
  const [name, setName] = useState(""); const [text, setText] = useState("");
  const key = "evh_vote_" + a._id, url = `/api/articles/${a._id}`;
  useEffect(() => { try { setV(localStorage.getItem(key)); } catch {} }, [key]);
  const vote = async (t) => {
    try {
      let cur = a;
      if (v) cur = await post(url, { action: "un" + v });
      if (v === t) { setV(null); localStorage.removeItem(key); }
      else { cur = await post(url, { action: t }); setV(t); localStorage.setItem(key, t); }
      setA(cur);
    } catch (e) { setErr(e.message); }
  };
  const send = async (e) => { e.preventDefault(); try { setA(await post(url, { action: "comment", name, text })); setText(""); } catch (x) { setErr(x.message); } };
  return (
    <section>
      <div className="mt-8 flex gap-3">
        <button onClick={() => vote("like")} className={`flex items-center gap-2 rounded-lg border px-4 py-2 ${v === "like" ? "border-hexa text-hexa" : "border-[#36275f]"}`}><ThumbsUp size={16} />{a.likes}</button>
        <button onClick={() => vote("dislike")} className={`flex items-center gap-2 rounded-lg border px-4 py-2 ${v === "dislike" ? "border-red-400 text-red-400" : "border-[#36275f]"}`}><ThumbsDown size={16} />{a.dislikes}</button>
      </div>
      {err && <p className="mt-2 text-sm text-red-400" role="alert">{err}</p>}
      <h2 className="mt-8 font-display text-xl font-semibold">Comments ({a.comments.length})</h2>
      <form onSubmit={send} className="mt-3 space-y-2">
        <input className="inp" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required />
        <textarea className="inp" rows={3} placeholder="Write a comment" value={text} onChange={(e) => setText(e.target.value)} required />
        <button className="btn">Post comment</button></form>
      <ul className="mt-4 space-y-3">{[...a.comments].reverse().map((c, i) => (
        <li key={i} className="rounded-lg border border-[#251a45] p-3"><p className="text-sm font-medium text-volt">{c.name}</p>
          <p className="text-sm text-slate-300">{c.text}</p><p className="mt-1 text-xs text-slate-500">{fmt(c.createdAt).replace("Posted on: ", "")}</p></li>))}</ul>
    </section>);
}
