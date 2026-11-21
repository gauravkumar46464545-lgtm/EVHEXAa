"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MoreVertical, X } from "lucide-react";

const SUBJECTS = [
  { href: "/", label: "HOME" },
  { href: "/e-vehicles", label: "E-VEHICLES" },
  { href: "/brands", label: "BRANDS" },
  { href: "/compare", label: "COMPARE" },
  { href: "/news", label: "NEWS" },
  { href: "/blogs", label: "BLOGS" },
  { href: "/videos", label: "VIDEOS" },
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
      {/* Desktop: Saare links directly open rahenge aur naye page par le jayenge */}
      <div className="hidden items-center gap-5 text-sm font-bold tracking-wide md:flex">
        {SUBJECTS.map((s) => (
          <Link key={s.href} href={s.href} className="transition-colors hover:text-volt">
            {s.label}
          </Link>
        ))}
      </div>

      {/* Mobile: Sirf mobile par 3-dot dropdown dikhega */}
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
              <Link
                key={s.href}
                href={s.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-semibold hover:bg-hexa/10 hover:text-volt"
              >
                {s.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}