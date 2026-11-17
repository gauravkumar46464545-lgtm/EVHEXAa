"use client";
import { useEffect, useRef } from "react";

export const ytId = (u = "") => (u.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/) || [])[1];

// Only one video may play at a time: when a new one starts, the one that was playing is paused.
let current = null; // { key, pause }
const claim = (key, pause) => { if (current && current.key !== key) current.pause(); current = { key, pause }; };
const release = (key) => { if (current && current.key === key) current = null; };

function FileVideo({ src, className }) {
  const ref = useRef(null);
  useEffect(() => { const v = ref.current; return () => release(v); }, []);
  return <video ref={ref} className={className + " bg-black object-cover"} src={src} controls preload="metadata"
    onPlay={(e) => { const v = e.currentTarget; claim(v, () => v.pause()); }}
    onEnded={(e) => release(e.currentTarget)} />;
}

function YouTube({ id, alt, className }) {
  const ref = useRef(null);
  useEffect(() => {
    const f = ref.current;
    const listen = () => f.contentWindow?.postMessage(JSON.stringify({ event: "listening", id: 1, channel: "widget" }), "*");
    const onMsg = (e) => {
      if (e.source !== f.contentWindow || !/youtube(-nocookie)?\.com$/.test(new URL(e.origin).hostname)) return;
      let d = e.data; try { if (typeof d === "string") d = JSON.parse(d); } catch { return; }
      if (d?.event === "onStateChange" && d.info === 1)
        claim(f, () => f.contentWindow?.postMessage(JSON.stringify({ event: "command", func: "pauseVideo", args: [] }), "*"));
      if (d?.event === "onStateChange" && (d.info === 0 || d.info === 2)) release(f);
    };
    f.addEventListener("load", listen); window.addEventListener("message", onMsg);
    return () => { f.removeEventListener("load", listen); window.removeEventListener("message", onMsg); release(f); };
  }, []);
  return <iframe ref={ref} className={className} src={`https://www.youtube-nocookie.com/embed/${id}?enablejsapi=1&rel=0`} title={alt} allowFullScreen loading="lazy" />;
}

export default function Media({ src, type, alt = "", className = "h-28 w-full" }) {
  if (!src) return <div className={className + " bg-gradient-to-br from-panel to-[#2a1250]"} />;
  const y = ytId(src);
  if (y) return <YouTube id={y} alt={alt} className={className} />;
  if (type === "video" || /\.(mp4|webm|ogg)(\?|$)/i.test(src)) return <FileVideo src={src} className={className} />;
  return <img src={src} alt={alt} className={className + " object-cover"} loading="lazy" />;
}
