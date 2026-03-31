"use client";
import Navbar from "./components/Navbar";
import ServiceSection from "./components/ServiceSection";
import MissonSection from "./components/MissonSection";
import Footer from "./components/Footer";
import HeaderHomepage from "./components/HeaderHomepage";
import PartnerList from "./components/PartnerList";
import IntroduceSection from "./components/IntroduceSection";
import StaticSection from "./components/StaticSection";
import ProjectSection from "./components/ProjectSection";
import GallerySection from "./components/GallerySection";

export default function Home() {
  return (
    <div className="min-h-screen w-full flex flex-col bg-[#121212] overflow-x-hidden overflow-y-visible pt-[136px]">
      <Navbar />
      <HeaderHomepage />
      <PartnerList />
      <IntroduceSection />
      <ServiceSection />
      <MissonSection />
      <StaticSection />
      <ProjectSection />
      <GallerySection />
      <Footer />
    </div>
  );
}
