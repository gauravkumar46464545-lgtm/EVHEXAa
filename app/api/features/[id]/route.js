import { isAdmin } from "@/lib/db";
import { updateFeature, deleteFeature, readBody, needAdmin, respond } from "@/lib/store";
export const dynamic = "force-dynamic";
export const PUT = (req, { params }) => respond(async () => { needAdmin(req, isAdmin); return updateFeature(params.id, await readBody(req)); });
export const DELETE = (req, { params }) => respond(async () => { needAdmin(req, isAdmin); return deleteFeature(params.id); });
