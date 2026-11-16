import { isAdmin } from "@/lib/db";
import { articleAction, updateArticle, deleteArticle, readBody, needAdmin, respond } from "@/lib/store";
export const dynamic = "force-dynamic";
// POST (public) body: {action:"like"|"dislike"|"unlike"|"undislike"} or {action:"comment",name,text}
export const POST = (req, { params }) => respond(async () => articleAction(params.id, await readBody(req)));
// PUT / DELETE are admin-only (edit or remove an article)
export const PUT = (req, { params }) => respond(async () => { needAdmin(req, isAdmin); return updateArticle(params.id, await readBody(req)); });
export const DELETE = (req, { params }) => respond(async () => { needAdmin(req, isAdmin); return deleteArticle(params.id); });
