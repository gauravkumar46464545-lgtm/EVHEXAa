import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { isAdmin } from "@/lib/db";
cloudinary.config({ cloud_name: process.env.CLOUDINARY_CLOUD_NAME, api_key: process.env.CLOUDINARY_API_KEY, api_secret: process.env.CLOUDINARY_API_SECRET });
// Returns a short-lived signature so the browser can upload straight to Cloudinary
// (real progress %, and no server body-size limit for large videos).
export async function POST(req) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const timestamp = Math.round(Date.now() / 1000), folder = "ev-hexa";
  const signature = cloudinary.utils.api_sign_request({ folder, timestamp }, process.env.CLOUDINARY_API_SECRET);
  return NextResponse.json({ cloud: process.env.CLOUDINARY_CLOUD_NAME, key: process.env.CLOUDINARY_API_KEY, timestamp, signature, folder });
}
