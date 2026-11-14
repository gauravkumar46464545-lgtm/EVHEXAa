import { SITE } from "@/lib/fmt";
export default function robots() { return { rules: { userAgent: "*", allow: "/", disallow: "/api/" }, sitemap: `${SITE}/sitemap.xml` }; }
