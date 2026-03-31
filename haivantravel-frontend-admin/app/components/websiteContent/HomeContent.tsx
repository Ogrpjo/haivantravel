"use client";

import GallerySection from "./GallerySection";
import StatisticsSection from "./StatisticsSection";
import EmotionCreatorSection from "./EmotionCreatorSection";
import CompanyOverviewSection from "./CompanyOverviewSection";
import AboutUsSection from "./AboutUsSection";

export default function HomeContent() {
  return (
    <section className="bg-[#121212] text-white flex-8 px-[20px] w-full py-[10px]">
      <div className="py-[10px]">
        <p className="text-xl font-semibold text-white/75"> {">"} Website Content {">"} Home </p>
      </div>
      <div className="flex flex-col gap-4 max-h-[calc(100vh-120px)] overflow-auto">
        <GallerySection />
        <StatisticsSection />
        <EmotionCreatorSection />
        <CompanyOverviewSection />
        <AboutUsSection />
      </div>
    </section>
  );
}
