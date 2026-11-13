import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/db";
export async function POST(req) {
  return isAdmin(req) ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "Wrong password" }, { status: 401 });
}
