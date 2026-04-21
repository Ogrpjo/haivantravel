"use client";

import ServiceContentGrapesBuilder from "@/app/components/websiteContent/ServiceContentGrapesBuilder";

export default function WebsiteContentGalaPage() {
  return (
    <main className="w-screen h-screen bg-white">
      <ServiceContentGrapesBuilder
        endpoint="gala"
        saveSuccessMessage="Da luu noi dung Gala."
      />
    </main>
  );
}

