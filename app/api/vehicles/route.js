import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { db, isAdmin } from "@/lib/db";
import { VEHICLES } from "@/lib/vehicles";

const VehicleSchema = new mongoose.Schema(
  {
    brand: String,
    model: String,
    price: Number,
    speed: Number,
    range: Number,
    badge: String,
    photo: String,
    img: Number,
  },
  { timestamps: true }
);

const VehicleItem = mongoose.models.VehicleItem || mongoose.model("VehicleItem", VehicleSchema);

export async function GET() {
  await db();
  let list = await VehicleItem.find().sort({ createdAt: 1 }).lean();
  if (!list.length) {
    const seed = VEHICLES.map((v) => ({
      brand: v.brand,
      model: v.model,
      price: v.price,
      speed: v.speed,
      range: v.range,
      badge: v.badge || "",
      photo: v.photo || `/vehicles/ev-${v.img}.png`,
      img: v.img || 1,
    }));
    await VehicleItem.insertMany(seed);
    list = await VehicleItem.find().sort({ createdAt: 1 }).lean();
  }
  return NextResponse.json(list);
}

export async function POST(req) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await db();
  const body = await req.json();
  return NextResponse.json(await VehicleItem.create(body));
}

export async function PUT(req) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await db();
  const { _id, ...rest } = await req.json();
  return NextResponse.json(await VehicleItem.findByIdAndUpdate(_id, rest, { new: true }).lean());
}

export async function DELETE(req) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await db();
  const { searchParams } = new URL(req.url);
  await VehicleItem.findByIdAndDelete(searchParams.get("id"));
  return NextResponse.json({ ok: true });
}