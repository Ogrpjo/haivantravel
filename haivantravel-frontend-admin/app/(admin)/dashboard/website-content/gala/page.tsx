"use client";

import Sidebar from "@/app/components/SideBar";
import ServiceContentGrapesBuilder from "@/app/components/websiteContent/ServiceContentGrapesBuilder";

export default function WebsiteContentGalaPage() {
  return (
    <main className="flex">
      <Sidebar />
      <section className="bg-[#121212] text-white flex-8 px-[20px] w-full py-[10px]">
        <div className="py-[10px]">
          <p className="text-xl font-semibold text-white/75">
            {">"} Website Content {">"} Gala
          </p>
        </div>
        <ServiceContentGrapesBuilder
          endpoint="gala"
          saveSuccessMessage="Da luu noi dung Gala."
        />
      </section>
    </main>
  );
}

