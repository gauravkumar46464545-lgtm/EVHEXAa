"use client";
import Link from "next/link";
import { Zap } from "lucide-react";

export default function BrandLogo({ large = false }) {
  return (
    <Link href="/" aria-label="EV HEXA home" className="flex items-center gap-3">
      <span
        className={`block shrink-0 overflow-hidden rounded-full border-2 border-[#16a34a] p-[2px] ring-2 ring-[#22c55e]/60 shadow-[0_0_12px_rgba(22,163,74,0.35)] ${
          large ? "h-[58px] w-[58px]" : "h-[50px] w-[50px]"
        }`}
      >
        <img src="/logo.png" alt="EV HEXA" className="h-full w-full rounded-full object-cover" />
      </span>
      <span
        className={`inline-flex items-center font-display font-extrabold not-italic leading-none tracking-tight ${
          large ? "text-3xl" : "text-2xl"
        }`}
      >
        <span className="text-[#16a34a]">EV</span>
        <Zap size={large ? 20 : 18} className="mx-0.5 fill-[#16a34a] text-[#16a34a]" />
        <span className="text-[#111827]">HEXA</span>
      </span>
    </Link>
  );
}