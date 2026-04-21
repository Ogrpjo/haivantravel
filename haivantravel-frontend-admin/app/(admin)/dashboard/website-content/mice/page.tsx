"use client";

import ServiceContentGrapesBuilder from "@/app/components/websiteContent/ServiceContentGrapesBuilder";

export default function WebsiteContentMicePage() {
  return (
    <main className="w-screen h-screen bg-white">
      <ServiceContentGrapesBuilder
        endpoint="mice"
        saveSuccessMessage="Da luu noi dung MICE."
      />
    </main>
  );
}

