import { NextResponse } from "next/server";
import { db, isAdmin } from "@/lib/db";
import { Article } from "@/models";
import { slugify } from "@/lib/slug";

const DEFAULT_ARTICLES = [
  {
    title: "Top 5 Electric Cars in India Under ₹15 Lakh (2026 Guide)",
    slug: "top-5-electric-cars-in-india-under-15-lakh",
    author: "EV HEXA Desk",
    image: "https://images.unsplash.com/photo-1585011664466-b7bbe92f34ef?auto=format&fit=crop&w=1200&q=80",
    metaDescription: "Best budget electric cars in India under 15 Lakh with real-world range and pricing.",
    content: "India mein electric cars ab sirf luxury nahi rahi. ₹15 Lakh ke andar Tata Nexon EV, Punch EV, Tiago EV, MG Windsor EV aur Comet EV behtareen options hain.\n\nModel | Starting Price | Claimed Range\nMG Comet EV | ₹6.99 Lakh | 230 km\nTata Tiago EV | ₹7.99 Lakh | 315 km\nTata Punch EV | ₹9.99 Lakh | 421 km\nTata Nexon EV | ₹12.49 Lakh | 489 km\nMG Windsor EV | ₹13.99 Lakh | 332 km\n\nDaily city commute ke liye 300+ km range kaafi hoti hai aur running cost sirf ₹1/km ke aas-paas aati hai.",
  },
  {
    title: "Home EV Charger Setup: Cost, Electricity Load & Safety Tips",
    slug: "home-ev-charger-setup-cost-and-tips",
    author: "EV HEXA Tech",
    image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1200&q=80",
    metaDescription: "Complete guide to installing a 3.3 kW or 7.2 kW home EV charger in India.",
    content: "Ghar par EV charge karna sabse sasta aur convenient tarika hai. Zyadatar electric cars ke saath 3.3 kW portable charger aur 7.2 kW AC wallbox charger ka option milta hai.\n\nInstall karwane se pehle apne electricity meter ka sanctioned load check karwayein aur proper earthing zaroor lagwayein. Raat bhar charge karne se subah aapko 100% full battery milti hai.",
  },
  {
    title: "Mahindra BE 6 vs Tata Curvv EV: Highway Range & Comfort Test",
    slug: "mahindra-be-6-vs-tata-curvv-ev-highway-test",
    author: "EV HEXA Reviews",
    image: "https://images.unsplash.com/photo-1738101001592-d135bfe87d35?auto=format&fit=crop&w=1200&q=80",
    metaDescription: "Real-world highway range and comfort comparison between Mahindra BE 6 and Tata Curvv EV.",
    content: "Dono Indian electric SUVs futuristic design aur lambi range ke saath aati hain. Highway par 90–100 km/h cruise karne par dono gaadiyan 420 se 480 km ke beech real-world range deti hain.\n\nSuspension setup aur rear seat comfort ke maamle mein dono ka apna character hai — sporty feel ke liye BE 6 aur balanced family ride ke liye Curvv EV pasand ki ja rahi hai.",
  },
  {
    title: "Electric Scooter vs Petrol Scooter: 3 Saal Mein Kitni Bachat?",
    slug: "electric-scooter-vs-petrol-scooter-savings",
    author: "EV HEXA Desk",
    image: "https://images.unsplash.com/photo-1594054763281-0946baaad462?auto=format&fit=crop&w=1200&q=80",
    metaDescription: "3-year ownership cost comparison between an electric scooter and a petrol scooter in India.",
    content: "Agar aap rozana 35–40 km scooter chalate hain, toh petrol par mahine ka ₹2,500–₹3,000 kharch hota hai. Wahin electric scooter par bijli ka bill sirf ₹300–₹400 aata hai.\n\n3 saal mein fuel aur service milakar lagbhag ₹75,000 se ₹90,000 tak ki seedhi bachat ho jaati hai.",
  },
];

export async function GET() {
  await db();
  let list = await Article.find().sort({ createdAt: -1 }).lean();
  if (!list.length) {
    await Article.insertMany(DEFAULT_ARTICLES);
    list = await Article.find().sort({ createdAt: -1 }).lean();
  }
  for (const a of list) {
    if (a.slug) continue;
    let slug = slugify(a.title);
    if (await Article.exists({ slug })) slug += "-" + String(a._id).slice(-5);
    await Article.collection.updateOne({ _id: a._id }, { $set: { slug } });
    a.slug = slug;
  }
  return NextResponse.json(list);
}

export async function POST(req) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await db();
  const { title, author, image, content, metaDescription } = await req.json();
  let slug = slugify(title);
  if (await Article.exists({ slug })) slug += "-" + Date.now().toString(36);
  return NextResponse.json(await Article.create({ title, slug, author, image, content, metaDescription }));
}