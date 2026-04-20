"use client";

import Footer from "./components/layout/Footer";
import NavigationBar from "./components/layout/Navbar";
import AboutUs from "./components/sections/about-us";
import Collaborator from "./components/sections/collaborator";
import CompletedProject from "./components/sections/completed-project";
import EventProvider from "./components/sections/event-provider";
import Experience from "./components/sections/experience";
import FormContact from "./components/sections/form-contact";
import Prestige from "./components/sections/prestige";
import WhyChooseUs from "./components/sections/why-choose-us";
import WorkingProcess from "./components/sections/working-process";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-[#121212] no-scrollbar">
      <div className="mx-auto max-w-[2000px] w-full">
        <NavigationBar />
        <AboutUs />
        <Prestige />
        <Collaborator />
        <EventProvider />
        <WhyChooseUs />
        <Experience />
        <CompletedProject />
        <WorkingProcess />
        <FormContact />
        <Footer />
      </div>
    </div>
  );
}
