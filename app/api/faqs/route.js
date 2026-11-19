import { NextResponse } from "next/server";
import { db, isAdmin } from "@/lib/db";
import { Faq } from "@/models";

export async function GET() {
  await db();
  return NextResponse.json(await Faq.find().sort({ createdAt: 1 }).lean());
}

export async function POST(req) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await db();
  const { question, answer } = await req.json();
  return NextResponse.json(await Faq.create({ question, answer }));
}
