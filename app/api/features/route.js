import { NextResponse } from "next/server";
import { db, isAdmin } from "@/lib/db";
import { Feature } from "@/models";

const DEFAULT_FEATURES = [
  {
    title: "800V Ultra-Fast Charging: 10–80% in 18 Min",
    badge: "800V Platform",
    description: "Next-gen EVs mein 800V architecture highway charging stops ko aadha kar deta hai.",
    media: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=900&q=80",
    mediaType: "image",
  },
  {
    title: "Single-Pedal Driving & Regen Braking",
    badge: "Efficiency",
    description: "City traffic mein regenerative braking battery ko wapas charge karke extra range deta hai.",
    media: "https://images.unsplash.com/photo-1585011664466-b7bbe92f34ef?auto=format&fit=crop&w=900&q=80",
    mediaType: "image",
  },
  {
    title: "Battery Health After 1,00,000 km",
    badge: "Ownership",
    description: "Indian EV owners ka real-world data: 1 lakh km ke baad bhi 90%+ battery health.",
    media: "https://images.unsplash.com/photo-1738101001592-d135bfe87d35?auto=format&fit=crop&w=900&q=80",
    mediaType: "image",
  },
  {
    title: "V2L (Vehicle-to-Load) Power Backup",
    badge: "Smart Tech",
    description: "Camping ya emergency mein apni electric car ki battery se appliances aur laptops charge karein.",
    media: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=900&q=80",
    mediaType: "image",
  },
];

export async function GET() {
  await db();
  let list = await Feature.find().sort({ createdAt: -1 }).lean();
  if (!list.length) {
    await Feature.insertMany(DEFAULT_FEATURES);
    list = await Feature.find().sort({ createdAt: -1 }).lean();
  }
  return NextResponse.json(list.map((f) => ({ ...f, media: f.media || f.image || "" })));
}

export async function POST(req) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await db();
  const { title, badge, description, media, mediaType, mediaW, mediaH } = await req.json();
  return NextResponse.json(await Feature.create({ title, badge, description, media, mediaType, mediaW, mediaH }));
}