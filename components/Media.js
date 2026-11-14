export const ytId = (u = "") => (u.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/) || [])[1];
export default function Media({ src, type, alt = "", className = "h-28 w-full" }) {
  if (!src) return <div className={className + " bg-gradient-to-br from-panel to-[#12303a]"} />;
  const y = ytId(src);
  if (y) return <iframe className={className} src={`https://www.youtube-nocookie.com/embed/${y}`} title={alt} allowFullScreen loading="lazy" />;
  if (type === "video" || /\.(mp4|webm|ogg)(\?|$)/i.test(src)) return <video className={className + " bg-black object-cover"} src={src} controls preload="metadata" />;
  return <img src={src} alt={alt} className={className + " object-cover"} loading="lazy" />;
}
