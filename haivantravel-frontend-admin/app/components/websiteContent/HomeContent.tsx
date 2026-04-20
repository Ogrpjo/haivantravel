"use client";

import AboutUs from "./about-us";
import CollaboratorSection from "./collaborator";
import ExperienceSection from "./experience";
import EventProviderSection from "./event-provider";
import StatisticSection from "./statistic";
import WorkingProcessSection from "./working-process";
import WhyChooseUsSection from "./why-choose-us";

export default function HomeContent() {
  return (
    <section className="bg-[#121212] text-white flex-8 px-[20px] w-full py-[10px]">
      <div className="py-[10px]">
        <p className="text-xl font-semibold text-white/75"> {">"} Website Content {">"} Home </p>
      </div>
      <div className="flex flex-col gap-4 max-h-[calc(100vh-120px)] overflow-auto">
          <AboutUs />
          <StatisticSection />
          <CollaboratorSection />
          <EventProviderSection />
          <WhyChooseUsSection />
          <ExperienceSection />
          <WorkingProcessSection />
      </div>
    </section>
  );
}
