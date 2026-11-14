import { NextResponse } from "next/server";
import { db, isAdmin } from "@/lib/db";
import { Article } from "@/models";
// body: {action:"like"|"dislike"|"unlike"|"undislike"} or {action:"comment",name,text}
export async function POST(req, { params }) {
  await db(); const b = await req.json(); let u;
  if (b.action === "comment") {
    const name = String(b.name || "").trim().slice(0, 60), text = String(b.text || "").trim().slice(0, 1000);
    if (!name || !text) return NextResponse.json({ error: "Name and comment required" }, { status: 400 });
    u = { $push: { comments: { name, text } } };
  } else {
    const map = { like: { likes: 1 }, unlike: { likes: -1 }, dislike: { dislikes: 1 }, undislike: { dislikes: -1 } };
    if (!map[b.action]) return NextResponse.json({ error: "Bad action" }, { status: 400 });
    u = { $inc: map[b.action] };
  }
  return NextResponse.json(await Article.findByIdAndUpdate(params.id, u, { new: true }).lean());
}

// Admin: edit a published article (slug stays the same so SEO links never break)
export async function PUT(req, { params }) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await db(); const { title, author, image, content, metaDescription } = await req.json();
  return NextResponse.json(await Article.findByIdAndUpdate(params.id, { title, author, image, content, metaDescription }, { new: true }).lean());
}
export async function DELETE(req, { params }) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await db(); await Article.findByIdAndDelete(params.id); return NextResponse.json({ ok: true });
}
