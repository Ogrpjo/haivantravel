"use client";

import Sidebar from "@/app/components/SideBar";
import CaseStudyGrapesBuilder from "@/app/components/websiteContent/CaseStudyGrapesBuilder";

export default function WebsiteContentCaseStudyPage() {
  return (
    <main className="flex">
      <Sidebar />
      <section className="bg-[#121212] text-white flex-8 px-[20px] w-full py-[10px]">
        <div className="py-[10px]">
          <p className="text-xl font-semibold text-white/75">
            {">"} Website Content {">"} Case study
          </p>
        </div>
        <CaseStudyGrapesBuilder />
      </section>
    </main>
  );
}
