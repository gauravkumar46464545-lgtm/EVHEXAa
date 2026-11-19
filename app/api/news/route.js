import { NextResponse } from "next/server";
import { db, isAdmin } from "@/lib/db";
import { News } from "@/models";
export async function GET() { await db(); return NextResponse.json(await News.find().sort({ createdAt: -1 }).limit(30).lean()); }
export async function POST(req) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await db(); const { title, summary, image, link } = await req.json();
  return NextResponse.json(await News.create({ title, summary, image, link }));
}
