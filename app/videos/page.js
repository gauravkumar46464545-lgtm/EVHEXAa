"use client";
import { Suspense } from "react";
import NavSubPage from "@/components/NavSubPage";

export const dynamic = "force-dynamic";

export default function VideosPage() {
  return (
    <Suspense fallback={null}>
      <NavSubPage
        section="videos"
        title="EV Videos Library"
        subtitle="Watch electric vehicle reviews, charging guides, walkarounds, and playlists right here."
      />
    </Suspense>
  );
}