import type { Metadata } from "next";
import Footer from "../components/layout/Footer";
import NavigationBar from "../components/layout/Navbar";
import ContactBody from "./components/ContactBody";

export const metadata: Metadata = {
  title: "Liên hệ | Hải Vân Event",
  description:
    "Liên hệ Hải Vân Event để được tư vấn Company Trip, Teambuilding, Gala Dinner, MICE và các chương trình sự kiện phù hợp với doanh nghiệp bạn.",
};

export default function Contact() {
    return (
        <main>
            <NavigationBar />
            <ContactBody />
            <Footer />
        </main>
    )
}