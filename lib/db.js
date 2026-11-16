import mongoose from "mongoose";
const g = global._mongo || (global._mongo = { conn: null, p: null });
export const useMongo = () => !!process.env.MONGODB_URI;
export async function db() {
  if (g.conn) return g.conn;
  g.p ||= mongoose.connect(process.env.MONGODB_URI);
  g.conn = await g.p;
  return g.conn;
}
export const isAdmin = (req) =>
  req.headers.get("x-admin-password") === (process.env.ADMIN_PASSWORD || "12345");
