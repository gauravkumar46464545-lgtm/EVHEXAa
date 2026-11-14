"use client";
import { useEffect, useRef, useState } from "react";
import { MoreVertical, Moon, Sun, Check } from "lucide-react";

const OPTIONS = [
  { id: "dark", label: "Dark (Night)", Icon: Moon },
  { id: "light", label: "Light (Day)", Icon: Sun },
];

export default function ThemeMenu() {
  const [open, setOpen] = useState(false); const [theme, setTheme] = useState("dark"); const ref = useRef(null);
  useEffect(() => { setTheme(document.documentElement.dataset.theme || "dark"); }, []);
  useEffect(() => {
    if (!open) return;
    const away = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    const esc = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", away); document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", away); document.removeEventListener("keydown", esc); };
  }, [open]);
  const pick = (t) => {
    document.documentElement.dataset.theme = t;
    try { localStorage.setItem("evh_theme", t); } catch {}
    setTheme(t); setOpen(false);
  };
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)} aria-label="Menu" aria-haspopup="menu" aria-expanded={open} className="rounded-lg border border-[#1c2a37] p-2 hover:border-volt"><MoreVertical size={18} /></button>
      {open && (
        <div role="menu" className="absolute right-0 top-full z-50 mt-2 w-52 rounded-xl border border-[#1c2a37] bg-panel p-2 shadow-xl">
          <p className="px-3 py-1 text-xs uppercase tracking-wide text-slate-500">Appearance</p>
          {OPTIONS.map(({ id, label, Icon }) => (
            <button key={id} role="menuitemradio" aria-checked={theme === id} onClick={() => pick(id)}
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-hexa/10 ${theme === id ? "text-hexa" : ""}`}>
              <Icon size={16} />{label}{theme === id && <Check size={16} className="ml-auto" />}</button>))}
        </div>)}
    </div>);
}
