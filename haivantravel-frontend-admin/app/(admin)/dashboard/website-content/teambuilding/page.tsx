"use client";

import ServiceContentGrapesBuilder from "@/app/components/websiteContent/ServiceContentGrapesBuilder";

export default function WebsiteContentTeamBuildingPage() {
  return (
    <main className="w-screen h-screen bg-white">
      <ServiceContentGrapesBuilder
        endpoint="teambuilding"
        saveSuccessMessage="Da luu noi dung Team building."
      />
    </main>
  );
}

