"use client";
import { useEffect, useRef, useState } from "react";
import { MoreVertical, Moon, Sun } from "lucide-react";

const LINKS = [
  { href: "/#news", label: "News" },
  { href: "/#popular", label: "EVs" },
  { href: "/#compare", label: "Compare" },
  { href: "/#features", label: "Features" },
  { href: "/#articles", label: "Articles" },
  { href: "/#reviews", label: "Reviews" },
];

const OPTIONS = [
  { id: "dark", label: "Dark", Icon: Moon },
  { id: "light", label: "Light", Icon: Sun },
];

export default function ThemeMenu() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState("dark");
  const ref = useRef(null);

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme || "dark");
  }, []);

  useEffect(() => {
    if (!open) return;
    const away = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    const esc = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", away);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", away);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  const pick = (t) => {
    document.documentElement.dataset.theme = t;
    try {
      localStorage.setItem("evh_theme", t);
    } catch {}
    setTheme(t);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-label="Menu"
        aria-haspopup="menu"
        aria-expanded={open}
        className="rounded-lg border border-[#36275f] p-2.5 hover:border-volt"
      >
        <MoreVertical size={22} />
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Menu"
          className="absolute right-0 top-full z-50 mt-2 w-44 rounded-xl border border-[#36275f] bg-panel p-2 shadow-xl"
        >
          <div className="flex flex-col gap-0.5">
            {LINKS.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                role="menuitem"
                onClick={() => setOpen(false)}
                className="tbtn rounded-lg px-3 py-2 text-sm font-semibold hover:text-volt"
              >
                {label}
              </a>
            ))}
          </div>

          <div className="my-2 border-t border-[#36275f]" />

          <div className="flex gap-1">
            {OPTIONS.map(({ id, label, Icon }) => (
              <button
                key={id}
                role="menuitemradio"
                aria-checked={theme === id}
                aria-label={label}
                onClick={() => pick(id)}
                className="tbtn flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg text-xs font-medium"
              >
                <Icon size={16} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}