"use client";

import Sidebar from "@/app/components/SideBar";
import ServiceContentGrapesBuilder from "@/app/components/websiteContent/ServiceContentGrapesBuilder";

export default function WebsiteContentMicePage() {
  return (
    <main className="flex">
      <Sidebar />
      <section className="bg-[#121212] text-white flex-8 px-[20px] w-full py-[10px]">
        <div className="py-[10px]">
          <p className="text-xl font-semibold text-white/75">
            {">"} Website Content {">"} MICE
          </p>
        </div>
        <ServiceContentGrapesBuilder
          endpoint="mice"
          saveSuccessMessage="Da luu noi dung MICE."
        />
      </section>
    </main>
  );
}

