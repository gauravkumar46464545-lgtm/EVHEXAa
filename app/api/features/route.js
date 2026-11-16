import { isAdmin } from "@/lib/db";
import { listFeatures, createFeature, readBody, needAdmin, respond } from "@/lib/store";
export const dynamic = "force-dynamic";
export const GET = () => respond(listFeatures);
export const POST = (req) => respond(async () => { needAdmin(req, isAdmin); return createFeature(await readBody(req)); });
