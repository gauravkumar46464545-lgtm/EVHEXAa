"use client";
import { useEffect, useState } from "react";
import CarRig from "./CarRig";

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
      <div className="intro-wrap">
        <div className="intro-car"><CarRig className="intro-rig" /></div>
      </div>
    </div>);
}
