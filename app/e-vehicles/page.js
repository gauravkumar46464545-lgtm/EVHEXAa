"use client";
import { Suspense } from "react";
import NavSubPage from "@/components/NavSubPage";

export const dynamic = "force-dynamic";

export default function EVehiclesPage() {
  return (
    <Suspense fallback={null}>
      <NavSubPage
        section="e-vehicles"
        title="Electric Vehicles"
        subtitle="Explore electric cars, two-wheelers, range, top speed and starting prices."
      />
    </Suspense>
  );
}