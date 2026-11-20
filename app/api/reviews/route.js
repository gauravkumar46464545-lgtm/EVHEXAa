import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Review } from "@/models";

const DEFAULT_REVIEWS = [
  { name: "Rohit Sharma", rating: 5, text: "Nexon EV 45 kWh pichhle 6 mahine se chala raha hoon. City mein aaram se 360+ km real range mil jaati hai aur running cost bilkul negligible hai." },
  { name: "Ananya Verma", rating: 5, text: "MG Windsor EV ka rear seat space aur glass roof kamaal ka hai. Family trips ke liye best electric car lagi." },
  { name: "Vikram Singh", rating: 4, text: "Punch EV city traffic ke liye super smooth hai. Bas highway par fast chargers thode aur badh jayein toh maza aa jaye." },
  { name: "Priya Nair", rating: 5, text: "EV HEXA par comparison aur honest owner reviews padh kar mujhe apni pehli electric car chunne mein kaafi help mili." },
];

export async function GET() {
  await db();
  let list = await Review.find().sort({ createdAt: -1 }).limit(100).lean();
  if (!list.length) {
    await Review.insertMany(DEFAULT_REVIEWS);
    list = await Review.find().sort({ createdAt: -1 }).limit(100).lean();
  }
  return NextResponse.json(list);
}

export async function POST(req) {
  await db();
  const b = await req.json();
  const name = String(b.name || "").trim().slice(0, 60), text = String(b.text || "").trim().slice(0, 1500), rating = Number(b.rating);
  if (!name || !text || !(rating >= 1 && rating <= 5)) return NextResponse.json({ error: "Invalid review" }, { status: 400 });
  return NextResponse.json(await Review.create({ name, text, rating }));
}