import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { db, isAdmin } from "@/lib/db";
import { PAIRS, byId } from "@/lib/vehicles";

const CarSubSchema = new mongoose.Schema(
  {
    brand: String,
    model: String,
    price: Number,
    range: Number,
    speed: Number,
    photo: String,
  },
  { _id: false }
);

const CompareSchema = new mongoose.Schema(
  {
    carA: CarSubSchema,
    carB: CarSubSchema,
  },
  { timestamps: true }
);

const ComparePair = mongoose.models.ComparePair || mongoose.model("ComparePair", CompareSchema);

const seedPairs = () =>
  PAIRS.map(([x, y]) => {
    const a = byId(x);
    const b = byId(y);
    return {
      carA: { brand: a.brand, model: a.model, price: a.price, range: a.range, speed: a.speed, photo: a.photo || `/vehicles/ev-${a.img}.png` },
      carB: { brand: b.brand, model: b.model, price: b.price, range: b.range, speed: b.speed, photo: b.photo || `/vehicles/ev-${b.img}.png` },
    };
  });

export async function GET() {
  await db();
  let list = await ComparePair.find().sort({ createdAt: 1 }).lean();
  if (!list.length) {
    await ComparePair.insertMany(seedPairs());
    list = await ComparePair.find().sort({ createdAt: 1 }).lean();
  }
  return NextResponse.json(list);
}

export async function POST(req) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await db();
  const { carA, carB } = await req.json();
  return NextResponse.json(await ComparePair.create({ carA, carB }));
}

export async function PUT(req) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await db();
  const { _id, carA, carB } = await req.json();
  return NextResponse.json(await ComparePair.findByIdAndUpdate(_id, { carA, carB }, { new: true }).lean());
}

export async function DELETE(req) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await db();
  const { searchParams } = new URL(req.url);
  await ComparePair.findByIdAndDelete(searchParams.get("id"));
  return NextResponse.json({ ok: true });
}