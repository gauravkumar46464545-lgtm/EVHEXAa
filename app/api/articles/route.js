import { isAdmin } from "@/lib/db";
import { listArticles, createArticle, readBody, needAdmin, respond } from "@/lib/store";
export const dynamic = "force-dynamic";
export const GET = () => respond(listArticles);
export const POST = (req) => respond(async () => { needAdmin(req, isAdmin); return createArticle(await readBody(req)); });
