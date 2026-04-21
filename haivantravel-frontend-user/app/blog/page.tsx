import Navigationbar from "../components/Navigationbar";
import BlogHeader from "../components/BlogHeader";
import BlogEvent from "../components/BlogEvent";
import BlogIntroduce from "../components/BlogIntroduce";
import BlogList from "../components/BlogList";
import Footer from "../components/layout/Footer";

export default function BlogPage() {
  return (
    <main className="w-screen min-h-screen bg-[#111111] flex flex-col gap-y-20 relative pt-[136px]">
      <Navigationbar />
      <BlogHeader />
      <BlogEvent />
      <BlogIntroduce />
      <BlogList />
      <Footer />
    </main>
  );
}
