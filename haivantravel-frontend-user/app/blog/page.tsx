import type { Metadata } from "next";
import Navigationbar from "../components/Navigationbar";
import BlogHeader from "../components/BlogHeader";
import BlogEvent from "../components/BlogEvent";
import BlogIntroduce from "../components/BlogIntroduce";
import BlogList from "../components/BlogList";
import Footer from "../components/layout/Footer";

export const metadata: Metadata = {
  title: "Cẩm nang tổ chức sự kiện doanh nghiệp | Hải Vân Event",
  description:
    "Hải Vân Event tổ chức Gala Dinner và Year End Party với concept riêng, sân khấu chỉn chu, kịch bản rõ ràng và trải nghiệm cảm xúc cho doanh nghiệp.",
};

export default function BlogPage() {
  return (
    <main className="w-screen min-h-screen bg-[#111111] flex flex-col gap-y-20 relative">
      <Navigationbar />
      <BlogHeader />
      <BlogEvent />
      <BlogIntroduce />
      <BlogList />
      <Footer />
    </main>
  );
}
