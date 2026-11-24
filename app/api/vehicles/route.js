import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { db, isAdmin } from "@/lib/db";

const DEFAULT_SEED_VIDEOS = [
  {
    title: "Electric SUVs & Highway Range Tests",
    description: "Watch EV SUV reviews, highway cruising clips, and real-world range insights.",
    url: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
    badge: "EV SUV",
  },
  {
    title: "EV Charging Stations & Fast Top-Up Guide",
    description: "Fast charger plug-in clips, charging speeds, and battery care tips for EV owners.",
    url: "https://assets.mixkit.co/videos/preview/mixkit-hand-plugging-a-charger-into-an-electric-car-42874-large.mp4",
    badge: "CHARGING",
  },
  {
    title: "Electric Scooters & Electric Bikes Walkaround",
    description: "Explore 2-wheeler EV highlights, daily commute performance, and smart features.",
    url: "https://assets.mixkit.co/videos/preview/mixkit-car-driving-on-a-city-street-at-night-34565-large.mp4",
    badge: "2-WHEELER EV",
  },
];

const VideoItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    url: { type: String, required: true },
    badge: { type: String, default: "EV VIDEO" },
  },
  { timestamps: true }
);

const VideoItem = mongoose.models.VideoItem || mongoose.model("VideoItem", VideoItemSchema);

export async function GET() {
  try {
    await db();
    let list = await VideoItem.find().sort({ createdAt: -1 }).lean();
    if (!list.length) {
      await VideoItem.insertMany(DEFAULT_SEED_VIDEOS);
      list = await VideoItem.find().sort({ createdAt: -1 }).lean();
    }
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