import { db } from "@/lib/db";
import { Article } from "@/models";
import { SITE } from "@/lib/fmt";
export const revalidate = 3600;
export default async function sitemap() {
  let list = [];
  try { await db(); list = await Article.find({}, "slug updatedAt").lean(); } catch {}
  return [{ url: SITE, changeFrequency: "daily", priority: 1 },
    ...list.map((a) => ({ url: `${SITE}/articles/${a.slug || a._id}`, lastModified: a.updatedAt, changeFrequency: "weekly", priority: 0.8 }))];
}
