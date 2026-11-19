import { NextResponse } from "next/server";
import { db, isAdmin } from "@/lib/db";
import { News } from "@/models";
export async function PUT(req, { params }) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await db(); const { title, summary, image, link } = await req.json();
  return NextResponse.json(await News.findByIdAndUpdate(params.id, { title, summary, image, link }, { new: true }).lean());
}
export async function DELETE(req, { params }) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await db(); await News.findByIdAndDelete(params.id); return NextResponse.json({ ok: true });
}
