"use client";
import { useEffect, useRef, useState } from "react";
import { MoreVertical, X } from "lucide-react";

const SUBJECTS = [
  { href: "#news", label: "News" },
  { href: "#popular", label: "EVs" },
  { href: "#compare", label: "Compare" },
  { href: "#features", label: "Features" },
  { href: "#articles", label: "Articles" },
  { href: "#reviews", label: "Reviews" },
];

export default function ThemeMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    document.documentElement.dataset.theme = "light";
    try { localStorage.setItem("evh_theme", "light"); } catch {}
  }, []);

  useEffect(() => {
    if (!open) return;
    const away = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    const esc = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", away);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", away);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative flex items-center">
      {/* Desktop: 3-dot nahi dikhega, saare subjects directly open rahenge */}
      <div className="hidden items-center gap-6 text-[16px] font-semibold md:flex">
        {SUBJECTS.map((s) => (
          <a key={s.href} href={s.href} className="transition-colors hover:text-volt">
            {s.label}
          </a>
        ))}
      </div>

      {/* Mobile: Sirf chhoti screen par 3-dot dropdown dikhega */}
      <div className="md:hidden">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
          aria-haspopup="menu"
          aria-expanded={open}
          className="rounded-lg border border-[#36275f] p-2 hover:border-volt"
        >
          {open ? <X size={20} /> : <MoreVertical size={20} />}
        </button>

        {open && (
          <div
            role="menu"
            aria-label="Navigation"
            className="absolute right-0 top-full z-50 mt-2 flex min-w-[160px] flex-col gap-1 rounded-xl border border-[#36275f] bg-panel p-2 shadow-xl"
          >
            {SUBJECTS.map((s) => (
              <a
                key={s.href}
                href={s.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-semibold hover:bg-hexa/10 hover:text-volt"
              >
                {s.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}