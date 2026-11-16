import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { isAdmin } from "@/lib/db";
import { dataDir } from "@/lib/store";

export const dynamic = "force-dynamic";
const TYPES = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif", "video/mp4": "mp4", "video/webm": "webm", "video/ogg": "ogg" };
const MAX = 25 * 1024 * 1024;
const cloudinaryReady = () => process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET;

export async function POST(req) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const file = (await req.formData()).get("file");
    if (!file || typeof file === "string") return NextResponse.json({ error: "No file" }, { status: 400 });
    const ext = TYPES[file.type];
    if (!ext) return NextResponse.json({ error: "Unsupported file type (use JPG, PNG, WEBP, GIF, MP4 or WEBM)" }, { status: 400 });
    if (file.size > MAX) return NextResponse.json({ error: "File too large (max 25 MB)" }, { status: 400 });
    const buf = Buffer.from(await file.arrayBuffer());

    if (cloudinaryReady()) {
      const { v2: cloudinary } = await import("cloudinary");
      cloudinary.config({ cloud_name: process.env.CLOUDINARY_CLOUD_NAME, api_key: process.env.CLOUDINARY_API_KEY, api_secret: process.env.CLOUDINARY_API_SECRET });
      const url = await new Promise((res, rej) =>
        cloudinary.uploader.upload_stream({ folder: "ev-hexa", resource_type: "auto" }, (e, r) => (e ? rej(e) : res(r.secure_url))).end(buf));
      return NextResponse.json({ url });
    }
    // No Cloudinary keys: keep the file locally (served by /api/uploads/[name])
    const name = `${crypto.randomBytes(12).toString("hex")}.${ext}`;
    const dir = path.join(dataDir(), "uploads"); fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, name), buf);
    return NextResponse.json({ url: `/api/uploads/${name}` });
  } catch (e) {
    console.error(e); return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
