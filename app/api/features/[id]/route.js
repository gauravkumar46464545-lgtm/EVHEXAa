import { NextResponse } from "next/server";
import { db, isAdmin } from "@/lib/db";
import { Feature } from "@/models";
export async function PUT(req, { params }) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await db(); const { title, badge, description, media, mediaType, mediaW, mediaH } = await req.json();
  return NextResponse.json(await Feature.findByIdAndUpdate(params.id, { title, badge, description, media, mediaType, mediaW, mediaH }, { new: true }).lean());
}
export async function DELETE(req, { params }) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await db(); await Feature.findByIdAndDelete(params.id); return NextResponse.json({ ok: true });
}
