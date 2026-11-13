import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { isAdmin } from "@/lib/db";
cloudinary.config({ cloud_name: process.env.CLOUDINARY_CLOUD_NAME, api_key: process.env.CLOUDINARY_API_KEY, api_secret: process.env.CLOUDINARY_API_SECRET });
export async function POST(req) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const file = (await req.formData()).get("file");
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });
  const buf = Buffer.from(await file.arrayBuffer());
  const url = await new Promise((res, rej) =>
    cloudinary.uploader.upload_stream({ folder: "ev-hexa" }, (e, r) => (e ? rej(e) : res(r.secure_url))).end(buf));
  return NextResponse.json({ url });
}
