import { NextResponse } from "next/server";
import { db, isAdmin } from "@/lib/db";
import { Article } from "@/models";
export async function GET() { await db(); return NextResponse.json(await Article.find().sort({ createdAt: -1 }).lean()); }
export async function POST(req) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await db(); const { title, author, image, content } = await req.json();
  return NextResponse.json(await Article.create({ title, author, image, content }));
}
