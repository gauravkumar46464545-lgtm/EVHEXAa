"use client";
import { useEffect, useState } from "react";

export default function FaqAdmin({ pw, onChanged }) {
  const [faqs, setFaqs] = useState([]);
  const [q, setQ] = useState("");
  const [a, setA] = useState("");
  const [editId, setEditId] = useState(null);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const r = await fetch("/api/faqs");
    if (r.ok) setFaqs(await r.json());
  };

  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const url = editId ? `/api/faqs/${editId}` : "/api/faqs";
      const method = editId ? "PUT" : "POST";
      const r = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", "x-admin-password": pw },
        body: JSON.stringify({ question: q, answer: a }),
      });
      if (!r.ok) throw new Error("Failed to save FAQ");
      setNote(editId ? "FAQ updated." : "FAQ added.");
      setQ(""); setA(""); setEditId(null);
      await load();
      onChanged?.();
    } catch (err) {
      setNote(err.message);
    } finally {
      setBusy(false);
    }
  };

  const del = async (item) => {
    if (!confirm(`Delete FAQ "${item.question}"?`)) return;
    setBusy(true);
    try {
      await fetch(`/api/faqs/${item._id}`, {
        method: "DELETE",
        headers: { "x-admin-password": pw },
      });
      setNote("FAQ deleted.");
      await load();
      onChanged?.();
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="mx-auto max-w-6xl px-4 pb-14">
      <div className="rounded-xl border border-[#251a45] bg-panel p-5">
        <h3 className="font-display text-xl font-semibold">{editId ? "Edit FAQ" : "Add EV FAQ"}</h3>
        {note && <p className="mt-2 text-sm text-hexa">{note}</p>}
        <form onSubmit={save} className="mt-3 space-y-3">
          <input className="inp" placeholder="Question (e.g. Are EVs cheaper to own?)" value={q} onChange={(e) => setQ(e.target.value)} required />
          <textarea className="inp" rows={3} placeholder="Answer" value={a} onChange={(e) => setA(e.target.value)} required />
          <div className="flex gap-2">
            <button disabled={busy} className="btn">{busy ? "Saving..." : editId ? "Save changes" : "Add FAQ"}</button>
            {editId && (
              <button type="button" onClick={() => { setEditId(null); setQ(""); setA(""); }} className="rounded-lg border border-[#36275f] px-4">
                Cancel
              </button>
            )}
          </div>
        </form>

        <h4 className="mt-6 font-display text-lg font-semibold">Manage FAQs ({faqs.length})</h4>
        <ul className="mt-3 space-y-2">
          {faqs.map((item) => (
            <li key={item._id} className="flex items-center justify-between gap-3 rounded-lg border border-[#251a45] px-4 py-3">
              <span className="min-w-0 truncate text-sm">{item.question}</span>
              <div className="flex shrink-0 gap-2">
                <button type="button" onClick={() => { setEditId(item._id); setQ(item.question); setA(item.answer); }} className="rounded border border-[#36275f] px-3 py-1 text-sm hover:border-volt">
                  Edit
                </button>
                <button type="button" onClick={() => del(item)} className="rounded border border-red-500/40 px-3 py-1 text-sm text-red-400">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}