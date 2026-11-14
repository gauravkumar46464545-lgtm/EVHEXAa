"use client";
import { useEffect, useState } from "react";

const TAPPABLE = 'button, a[href], [role="menuitem"], [role="menuitemradio"]';

export default function Effects() {
  const [intro, setIntro] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setIntro(false), 2400);
    // Light motion blur on every valid (enabled) tap. Disabled / locked controls are ignored.
    const onClick = (e) => {
      const el = e.target.closest?.(TAPPABLE);
      if (!el || el.matches(":disabled") || el.getAttribute("aria-disabled") === "true") return;
      el.classList.remove("tap-blur"); void el.offsetWidth; el.classList.add("tap-blur");
      setTimeout(() => el.classList.remove("tap-blur"), 950);
    };
    document.addEventListener("click", onClick);
    return () => { clearTimeout(t); document.removeEventListener("click", onClick); };
  }, []);
  if (!intro) return null;
  return (
    <div className="intro" aria-hidden="true">
      <div className="absolute left-0 top-1/2" style={{ marginTop: -56 }}>
        <div className="intro-car"><svg viewBox="0 0 240 80" width="340" height="113"><ellipse cx="120" cy="74" rx="105" ry="4" fill="#000" opacity=".5"/><path d="M10 58 L10 46 Q10 40 18 38 L60 32 Q75 14 100 12 L150 12 Q172 14 188 32 L222 38 Q232 40 232 48 L232 58 Z" fill="#10e39a"/><path d="M72 32 Q82 19 102 18 L120 18 L120 32 Z M128 18 L150 18 Q164 20 176 32 L128 32 Z" fill="#0a2630"/><path d="M224 42 L232 44 L232 48 L224 48 Z" fill="#fff"/><path d="M8 46 L12 46 L12 50 L8 50 Z" fill="#ff7a1a"/><g><circle cx="56" cy="60" r="15" fill="#0b0f14" stroke="#19d3ff" strokeWidth="2"/><g className="wheel"><path d="M56 48 V72 M44 60 H68 M47 51 L65 69 M65 51 L47 69" stroke="#19d3ff" strokeWidth="1.5"/></g></g><g><circle cx="188" cy="60" r="15" fill="#0b0f14" stroke="#19d3ff" strokeWidth="2"/><g className="wheel"><path d="M188 48 V72 M176 60 H200 M179 51 L197 69 M197 51 L179 69" stroke="#19d3ff" strokeWidth="1.5"/></g></g></svg></div>
      </div>
    </div>);
}
