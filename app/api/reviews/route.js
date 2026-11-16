import { listReviews, createReview, readBody, respond } from "@/lib/store";
export const dynamic = "force-dynamic";
export const GET = () => respond(listReviews);
export const POST = (req) => respond(async () => createReview(await readBody(req)));
