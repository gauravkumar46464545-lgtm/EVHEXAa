import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Review } from "@/models";
export async function GET() { await db(); return NextResponse.json(await Review.find().sort({ createdAt: -1 }).limit(100).lean()); }
export async function POST(req) {
  await db(); const b = await req.json();
  const name = String(b.name || "").trim().slice(0, 60), text = String(b.text || "").trim().slice(0, 1500), rating = Number(b.rating);
  if (!name || !text || !(rating >= 1 && rating <= 5)) return NextResponse.json({ error: "Invalid review" }, { status: 400 });
  return NextResponse.json(await Review.create({ name, text, rating }));
}
