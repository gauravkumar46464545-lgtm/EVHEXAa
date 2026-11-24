import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { db, isAdmin } from "@/lib/db";

const VehicleSchema = new mongoose.Schema(
  {
    brand: { type: String, required: true },
    model: { type: String, required: true },
    price: { type: Number, required: true },
    speed: { type: Number, required: true },
    range: { type: Number, required: true },
    badge: { type: String, default: "" },
    photo: { type: String, default: "" },
  },
  { timestamps: true }
);

const Vehicle = mongoose.models.Vehicle || mongoose.model("Vehicle", VehicleSchema);

export async function GET() {
  try {
    await db();
    const list = await Vehicle.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(list);
  } catch (err) {
    return NextResponse.json({ error: err.message || "Failed to load vehicles" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await db();
    const body = await req.json();
    if (!body?.brand || !body?.model) {
      return NextResponse.json({ error: "Brand and Model are required" }, { status: 400 });
    }
    const created = await Vehicle.create({
      brand: String(body.brand).trim(),
      model: String(body.model).trim(),
      price: Number(body.price) || 0,
      speed: Number(body.speed) || 0,
      range: Number(body.range) || 0,
      badge: String(body.badge || "").trim(),
      photo: String(body.photo || "").trim(),
    });
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message || "Failed to save EV" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await db();
    const body = await req.json();
    const { _id, ...rest } = body || {};
    if (!_id) {
      return NextResponse.json({ error: "Vehicle ID is required" }, { status: 400 });
    }
    const updated = await Vehicle.findByIdAndUpdate(_id, rest, { new: true }).lean();
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: err.message || "Failed to update EV" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await db();
    const { searchParams } = new URL(req.url);
    await Vehicle.findByIdAndDelete(searchParams.get("id"));
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message || "Failed to delete EV" }, { status: 500 });
  }
}