import { NextResponse } from "next/server";
import { db, isAdmin } from "@/lib/db";
import { Article } from "@/models";
import { slugify } from "@/lib/slug";
export async function GET() { await db(); return NextResponse.json(await Article.find().sort({ createdAt: -1 }).lean()); }
export async function POST(req) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await db(); const { title, author, image, content, metaDescription } = await req.json();
  let slug = slugify(title);
  if (await Article.exists({ slug })) slug += "-" + Date.now().toString(36);
  return NextResponse.json(await Article.create({ title, slug, author, image, content, metaDescription }));
}
