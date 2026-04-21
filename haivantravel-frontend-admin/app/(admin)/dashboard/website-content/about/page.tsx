"use client";

import ServiceContentGrapesBuilder from "@/app/components/websiteContent/ServiceContentGrapesBuilder";

export default function WebsiteContentAboutPage() {
  return (
    <main className="w-screen h-screen bg-white">
      <ServiceContentGrapesBuilder
        endpoint="about"
        saveSuccessMessage="Da luu noi dung About."
      />
    </main>
  );
}
