// Data layer. Uses MongoDB when MONGODB_URI is set; otherwise a local JSON file
// (data/db.json) so the site works out of the box with no database.
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { NextResponse } from "next/server";
import { db, useMongo } from "./db";

export class HttpError extends Error { constructor(status, message) { super(message); this.status = status; } }

const ACTIONS = { like: { likes: 1 }, unlike: { likes: -1 }, dislike: { dislikes: 1 }, undislike: { dislikes: -1 } };
const str = (v, n) => String(v ?? "").trim().slice(0, n);
export const clean = {
  feature: (b) => ({ title: str(b.title, 160), badge: str(b.badge, 60), description: str(b.description, 600), image: str(b.image, 2000) }),
  article: (b) => ({ title: str(b.title, 200), author: str(b.author, 80), image: str(b.image, 2000), content: str(b.content, 40000), meta: str(b.meta, 160) }),
};
const need = (o, keys) => { for (const k of keys) if (!o[k]) throw new HttpError(400, `${k} is required`); };

async function M() { await db(); return import("@/models"); }

/* ---------- JSON file backend ---------- */
export const dataDir = () => process.env.DATA_DIR || path.join(process.cwd(), "data");
const file = () => path.join(dataDir(), "db.json");
const id = () => crypto.randomBytes(12).toString("hex");
const iso = (ms) => new Date(ms).toISOString();

function seedData() {
  const now = Date.now(), H = 36e5;
  return {
    features: [
      { _id: id(), title: "Fast charging, 10–80% in 18 min", badge: "800V platform", description: "Why the new generation of 800V EVs cuts charging stops in half.", image: "", createdAt: iso(now - 5 * H) },
      { _id: id(), title: "Single-pedal driving explained", badge: "Efficiency", description: "How regenerative braking adds range in city traffic.", image: "", createdAt: iso(now - 30 * H) },
      { _id: id(), title: "Battery health after 100,000 km", badge: "Ownership", description: "Real owner data on degradation across popular models.", image: "", createdAt: iso(now - 60 * H) },
    ],
    articles: [
      { _id: id(), title: "Tata Motors Passenger Vehicles Registered total Sales of 201,723 Units in Q2 FY27", author: "EV HEXA Desk", image: "", meta: "",
        content: "Mumbai, October 1, 2026: Tata Motors Passenger Vehicles Ltd. recorded sales of 201,723 units in the domestic and international markets in Q2 FY27, compared to 144,397 units in Q2 FY26, representing a robust growth of 40% year-on-year.\n\nSegment | Sep'26 | Sep'25 | Growth\nPV Domestic | 68,810 | 59,667 | 15%\nPV Total (includes EV) | 70,210 | 60,907 | 15%\nEV IB + Domestic | 15,384 | 9,191 | 67%",
        likes: 12, dislikes: 1, comments: [{ name: "Aman", text: "Great list!", createdAt: iso(now - 2 * H) }], createdAt: iso(now - 3 * H) },
      { _id: id(), title: "Home charging: what you actually need", author: "Riya", image: "", meta: "",
        content: "A 7 kW wallbox covers most overnight needs. Here is how to plan wiring, cost and safety.", likes: 5, dislikes: 0, comments: [], createdAt: iso(now - 26 * H) },
    ],
    reviews: [
      { _id: id(), name: "Karan", rating: 5, text: "Switched to an EV last year. Running cost is a fraction of petrol.", createdAt: iso(now - 8 * H) },
      { _id: id(), name: "Sana", rating: 4, text: "Clear, honest reviews. Would love more bike coverage.", createdAt: iso(now - 40 * H) },
    ],
  };
}
function read() {
  try { return JSON.parse(fs.readFileSync(file(), "utf8")); }
  catch (e) { if (e.code !== "ENOENT") throw e; const s = seedData(); write(s); return s; }
}
function write(d) {
  fs.mkdirSync(dataDir(), { recursive: true });
  const tmp = file() + ".tmp"; fs.writeFileSync(tmp, JSON.stringify(d, null, 2)); fs.renameSync(tmp, file());
}
const newest = (l) => [...l].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
// read-modify-write is synchronous, so concurrent requests cannot interleave
const mutate = (fn) => { const d = read(); const r = fn(d); write(d); return r; };
const stamp = (o) => ({ ...o, _id: id(), createdAt: iso(Date.now()), updatedAt: iso(Date.now()) });

/* ---------- Features ---------- */
export async function listFeatures() {
  if (useMongo()) return (await M()).Feature.find().sort({ createdAt: -1 }).lean();
  return newest(read().features);
}
export async function createFeature(b) {
  const o = clean.feature(b); need(o, ["title", "badge", "description"]);
  if (useMongo()) return (await M()).Feature.create(o);
  return mutate((d) => { const r = stamp(o); d.features.push(r); return r; });
}
export async function updateFeature(fid, b) {
  const o = clean.feature(b); need(o, ["title", "badge", "description"]);
  let r;
  if (useMongo()) { try { r = await (await M()).Feature.findByIdAndUpdate(fid, o, { new: true }).lean(); } catch { r = null; } }
  else r = mutate((d) => { const x = d.features.find((f) => f._id === fid); if (x) Object.assign(x, o, { updatedAt: iso(Date.now()) }); return x; });
  if (!r) throw new HttpError(404, "Feature not found"); return r;
}
export async function deleteFeature(fid) {
  let r;
  if (useMongo()) { try { r = await (await M()).Feature.findByIdAndDelete(fid).lean(); } catch { r = null; } }
  else r = mutate((d) => { const n = d.features.length; d.features = d.features.filter((f) => f._id !== fid); return n !== d.features.length; });
  if (!r) throw new HttpError(404, "Feature not found"); return { ok: true };
}

/* ---------- Articles ---------- */
export async function listArticles() {
  if (useMongo()) return (await M()).Article.find().sort({ createdAt: -1 }).lean();
  return newest(read().articles);
}
export async function createArticle(b) {
  const o = clean.article(b); need(o, ["title", "author", "content"]);
  if (useMongo()) return (await M()).Article.create(o);
  return mutate((d) => { const r = { ...stamp(o), likes: 0, dislikes: 0, comments: [] }; d.articles.push(r); return r; });
}
export async function updateArticle(aid, b) {
  const o = clean.article(b); need(o, ["title", "author", "content"]);
  let r;
  if (useMongo()) { try { r = await (await M()).Article.findByIdAndUpdate(aid, { ...o, editedAt: new Date() }, { new: true }).lean(); } catch { r = null; } }
  else r = mutate((d) => { const x = d.articles.find((a) => a._id === aid); if (x) Object.assign(x, o, { editedAt: iso(Date.now()), updatedAt: iso(Date.now()) }); return x; });
  if (!r) throw new HttpError(404, "Article not found"); return r;
}
export async function deleteArticle(aid) {
  let r;
  if (useMongo()) { try { r = await (await M()).Article.findByIdAndDelete(aid).lean(); } catch { r = null; } }
  else r = mutate((d) => { const n = d.articles.length; d.articles = d.articles.filter((a) => a._id !== aid); return n !== d.articles.length; });
  if (!r) throw new HttpError(404, "Article not found"); return { ok: true };
}
// body: {action:"like"|"dislike"|"unlike"|"undislike"} or {action:"comment",name,text}
export async function articleAction(aid, b) {
  let inc = null, comment = null;
  if (b.action === "comment") {
    const name = str(b.name, 60), text = str(b.text, 1000);
    if (!name || !text) throw new HttpError(400, "Name and comment required");
    comment = { name, text };
  } else if (ACTIONS[b.action]) inc = ACTIONS[b.action];
  else throw new HttpError(400, "Bad action");
  let r;
  if (useMongo()) {
    try { r = await (await M()).Article.findByIdAndUpdate(aid, comment ? { $push: { comments: comment } } : { $inc: inc }, { new: true }).lean(); } catch { r = null; }
  } else r = mutate((d) => {
    const x = d.articles.find((a) => a._id === aid); if (!x) return null;
    if (comment) x.comments.push({ ...comment, createdAt: iso(Date.now()) });
    else for (const [k, v] of Object.entries(inc)) x[k] = Math.max(0, (x[k] || 0) + v);
    return x;
  });
  if (!r) throw new HttpError(404, "Article not found"); return r;
}

/* ---------- Reviews ---------- */
export async function listReviews() {
  if (useMongo()) return (await M()).Review.find().sort({ createdAt: -1 }).limit(100).lean();
  return newest(read().reviews).slice(0, 100);
}
export async function createReview(b) {
  const name = str(b.name, 60), text = str(b.text, 1500), rating = Number(b.rating);
  if (!name || !text || !(rating >= 1 && rating <= 5)) throw new HttpError(400, "Invalid review");
  if (useMongo()) return (await M()).Review.create({ name, text, rating });
  return mutate((d) => { const r = stamp({ name, text, rating }); d.reviews.push(r); return r; });
}

/* ---------- route helpers ---------- */
export const readBody = (req) => req.json().catch(() => { throw new HttpError(400, "Invalid request body"); });
export const needAdmin = (req, isAdmin) => { if (!isAdmin(req)) throw new HttpError(401, "Unauthorized"); };
export async function respond(fn) {
  try { return NextResponse.json(await fn()); }
  catch (e) {
    if (!(e instanceof HttpError)) console.error(e);
    return NextResponse.json({ error: e instanceof HttpError ? e.message : "Server error" }, { status: e.status || 500 });
  }
}
