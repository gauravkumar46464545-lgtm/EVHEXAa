import fs from "fs";
import path from "path";
import { dataDir } from "@/lib/store";

export const dynamic = "force-dynamic";
const MIME = { jpg: "image/jpeg", png: "image/png", webp: "image/webp", gif: "image/gif", mp4: "video/mp4", webm: "video/webm", ogg: "video/ogg" };

// Serves files uploaded while Cloudinary is not configured. Names are validated, so no path traversal.
export async function GET(req, { params }) {
  const m = /^[a-f0-9]{24}\.(jpg|png|webp|gif|mp4|webm|ogg)$/.exec(params.name);
  const fp = m && path.join(dataDir(), "uploads", params.name);
  if (!fp || !fs.existsSync(fp)) return new Response("Not found", { status: 404 });
  const buf = fs.readFileSync(fp), type = MIME[m[1]];
  const h = { "Content-Type": type, "Accept-Ranges": "bytes", "Cache-Control": "public, max-age=31536000, immutable" };
  const r = /^bytes=(\d*)-(\d*)$/.exec(req.headers.get("range") || "");
  if (r && (r[1] || r[2])) {
    let s = r[1] ? +r[1] : buf.length - +r[2], e = r[1] && r[2] ? +r[2] : buf.length - 1;
    e = Math.min(e, buf.length - 1);
    if (s > e || s >= buf.length) return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${buf.length}` } });
    return new Response(buf.subarray(s, e + 1), { status: 206, headers: { ...h, "Content-Range": `bytes ${s}-${e}/${buf.length}`, "Content-Length": String(e - s + 1) } });
  }
  return new Response(buf, { headers: { ...h, "Content-Length": String(buf.length) } });
}
