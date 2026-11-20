"use client";
import { useEffect, useRef, useState } from "react";

export const ytId = (u = "") => (u.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/) || [])[1];
const isShort = (u = "") => /youtube\.com\/shorts\//.test(u);

// Only one video may play at a time: starting a new one pauses the previous one.
let current = null; // { key, pause }
const claim = (key, pause) => { if (current && current.key !== key) current.pause(); current = { key, pause }; };
const release = (key) => { if (current && current.key === key) current = null; };

// The box always follows the media's own ratio (9:16 reels stay 9:16, 16:9 stays 16:9).
function Frame({ ratio, children }) {
  return <div className="relative w-full overflow-hidden bg-black/10" style={{ aspectRatio: ratio || 16 / 9, maxHeight: "340px" }}>{children}</div>;
}

function FileVideo({ src, onRatio }) {
  const ref = useRef(null);
  useEffect(() => { const v = ref.current; return () => release(v); }, []);
  return <video ref={ref} className="absolute inset-0 h-full w-full bg-black object-contain" src={src} controls playsInline preload="metadata"
    onLoadedMetadata={(e) => onRatio(e.currentTarget.videoWidth, e.currentTarget.videoHeight)}
    onPlay={(e) => { const v = e.currentTarget; claim(v, () => v.pause()); }}
    onEnded={(e) => release(e.currentTarget)} />;
}

function YouTube({ id, alt }) {
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
  return <iframe ref={ref} className="absolute inset-0 h-full w-full" src={`https://www.youtube-nocookie.com/embed/${id}?enablejsapi=1&rel=0`} title={alt} allowFullScreen loading="lazy" />;
}

export default function Media({ src, type, alt = "", w, h, onMeta }) {
  const [r, setR] = useState(w && h ? w / h : null);
  useEffect(() => { setR(w && h ? w / h : null); }, [w, h, src]);
  const onRatio = (W, H) => { if (W && H) { setR(W / H); onMeta?.(W, H); } };
  if (!src) return <Frame ratio={16 / 9}><div className="absolute inset-0 bg-gradient-to-br from-panel to-[#2a1250]" /></Frame>;
  const y = ytId(src);
  if (y) return <Frame ratio={isShort(src) ? 9 / 16 : 16 / 9}><YouTube id={y} alt={alt} /></Frame>;
  if (type === "video" || /\.(mp4|webm|ogg|mov)(\?|$)/i.test(src)) return <Frame ratio={r}><FileVideo src={src} onRatio={onRatio} /></Frame>;
  return <Frame ratio={r}><img src={src} alt={alt} className="absolute inset-0 h-full w-full object-cover" loading="lazy" onLoad={(e) => onRatio(e.currentTarget.naturalWidth, e.currentTarget.naturalHeight)} /></Frame>;
}