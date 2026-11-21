import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { db, isAdmin } from "@/lib/db";

const VideoItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    url: { type: String, required: true },
    badge: { type: String, default: "EV VIDEO" },
  },
  { timestamps: true }
);

const VideoItem = mongoose.models.VideoItem || mongoose.model("VideoItem", VideoItemSchema);

export async function GET() {
  try {
    await db();
    const list = await VideoItem.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(list);
  } catch (err) {
    return NextResponse.json({ error: err.message || "Failed to load videos" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ error: "Unauthorized: Invalid admin password" }, { status: 401 });
    }
    await db();
    const body = await req.json();
    if (!body?.title || !body?.url) {
      return NextResponse.json({ error: "Title and YouTube URL are required" }, { status: 400 });
    }
    const created = await VideoItem.create({
      title: String(body.title).trim(),
      description: String(body.description || "").trim(),
      url: String(body.url).trim(),
      badge: String(body.badge || "EV VIDEO").trim(),
    });
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message || "Failed to save video" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ error: "Unauthorized: Invalid admin password" }, { status: 401 });
    }
    await db();
    const body = await req.json();
    const id = body?._id;
    if (!id) {
      return NextResponse.json({ error: "Video ID is required" }, { status: 400 });
    }
    const { _id, ...rest } = body;
    const updated = await VideoItem.findByIdAndUpdate(id, rest, { new: true }).lean();
    if (!updated) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: err.message || "Failed to update video" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ error: "Unauthorized: Invalid admin password" }, { status: 401 });
    }
    await db();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Video ID is required" }, { status: 400 });
    }
    await VideoItem.findByIdAndDelete(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message || "Failed to delete video" }, { status: 500 });
  }
}