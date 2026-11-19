"use client";
import { useEffect, useRef, useState } from "react";
import { MoreVertical, Moon, Sun } from "lucide-react";

const OPTIONS = [
  { id: "dark", label: "Dark", Icon: Moon },
  { id: "light", label: "Light", Icon: Sun },
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
      <button onClick={() => setOpen(!open)} aria-label="Menu" aria-haspopup="menu" aria-expanded={open} className="rounded-lg border border-[#36275f] p-2.5 hover:border-volt"><MoreVertical size={22} /></button>
      {open && (
        <div role="menu" aria-label="Appearance" className="absolute right-0 top-full z-50 mt-2 flex gap-1 rounded-xl border border-[#36275f] bg-panel p-1.5 shadow-xl">
          {OPTIONS.map(({ id, label, Icon }) => (
            <button key={id} role="menuitemradio" aria-checked={theme === id} aria-label={label} onClick={() => pick(id)} className="tbtn grid h-10 w-10 place-items-center rounded-lg"><Icon size={18} /></button>))}
        </div>)}
    </div>);
}
