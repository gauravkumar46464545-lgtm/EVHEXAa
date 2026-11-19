import { NextResponse } from "next/server";
import { db, isAdmin } from "@/lib/db";
import { Faq } from "@/models";

export async function PUT(req, { params }) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await db();
  const { question, answer } = await req.json();
  return NextResponse.json(
    await Faq.findByIdAndUpdate(params.id, { question, answer }, { new: true }).lean()
  );
}

export async function DELETE(req, { params }) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await db();
  await Faq.findByIdAndDelete(params.id);
  return NextResponse.json({ ok: true });
}
