import mongoose from "mongoose";

// Check karta hai ki MONGODB_URI set hai ya nahi
export function useMongo() {
  return Boolean(process.env.MONGODB_URI);
}

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function db() {
  if (!useMongo()) return null;

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false,
    }).then((m) => m);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}