"use client";
import NavSubPage from "@/components/NavSubPage";

export const dynamic = "force-dynamic";

export default function BlogsPage() {
  return (
    <NavSubPage
      section="blogs"
      title="EV Blogs & Guides"
      subtitle="In-depth EV buying guides, charging tips and ownership stories."
    />
  );
}