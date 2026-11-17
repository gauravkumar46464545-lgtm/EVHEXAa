import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Article } from "@/models";
import { fmt, SITE } from "@/lib/fmt";
import Body from "@/components/Body";
import Engage from "@/components/Engage";
import ThemeMenu from "@/components/ThemeMenu";
export const revalidate = 60;
const get = async (slug) => { await db(); const a = await Article.findOne({ slug }).lean(); return a ? JSON.parse(JSON.stringify(a)) : null; };
const desc = (a) => a.metaDescription || a.content.replace(/\s+/g, " ").slice(0, 155);
export async function generateMetadata({ params }) {
  const a = await get(params.slug); if (!a) return {};
  const imgs = a.image ? [a.image] : undefined;
  return {
    title: a.title, description: desc(a), alternates: { canonical: `/articles/${a.slug}` },
    openGraph: { type: "article", title: a.title, description: desc(a), url: `/articles/${a.slug}`, publishedTime: a.createdAt, modifiedTime: a.updatedAt, authors: [a.author], images: imgs },
    twitter: { card: "summary_large_image", title: a.title, description: desc(a), images: imgs },
  };
}
export default async function ArticlePage({ params }) {
  const a = await get(params.slug); if (!a) notFound();
  const ld = { "@context": "https://schema.org", "@type": "NewsArticle", headline: a.title, description: desc(a), image: a.image ? [a.image] : undefined,
    datePublished: a.createdAt, dateModified: a.updatedAt, author: { "@type": "Person", name: a.author },
    publisher: { "@type": "Organization", name: "EV HEXA", logo: { "@type": "ImageObject", url: SITE + "/logo.png" } }, mainEntityOfPage: `${SITE}/articles/${a.slug}` };
  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#251a45] bg-ink/90 px-4 py-3 backdrop-blur">
        <Link href="/#articles" className="rounded-lg border border-[#36275f] px-4 py-1.5 text-sm hover:border-volt">← Back</Link>
        <div className="flex items-center gap-4"><Link href="/" className="font-display text-lg text-slate-400">EV HEXA</Link><ThemeMenu /></div></div>
      {a.image && <img src={a.image} alt={a.title} className="h-[260px] w-full object-cover md:h-[380px]" />}
      <article className="mx-auto max-w-4xl px-4 pb-16 pt-10">
        <h1 className="text-center font-display text-3xl font-semibold leading-tight md:text-5xl">{a.title}</h1>
        <p className="mt-3 text-center text-sm text-slate-500">By {a.author} · <time dateTime={a.createdAt}>{fmt(a.createdAt)}</time>{a.updatedAt !== a.createdAt && <> · Updated {fmt(a.updatedAt).replace("Posted on: ", "")}</>}</p>
        <div className="mt-8"><Body text={a.content} /></div>
        <Engage initial={a} />
      </article>
    </div>);
}
