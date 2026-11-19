import { NextResponse } from "next/server";
import { db, isAdmin } from "@/lib/db";
import { Feature } from "@/models";
export async function GET() {
  await db();
  const list = await Feature.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(list.map((f) => ({ ...f, media: f.media || f.image || "" })));
}
export async function POST(req) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await db(); const { title, badge, description, media, mediaType, mediaW, mediaH } = await req.json();
  return NextResponse.json(await Feature.create({ title, badge, description, media, mediaType, mediaW, mediaH }));
}
