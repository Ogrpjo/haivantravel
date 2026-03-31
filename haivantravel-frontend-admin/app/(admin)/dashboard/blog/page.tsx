import BlogListContent from "@/app/components/blog/BlogListContent";
import Sidebar from "@/app/components/SideBar";

export default function BlogPage() {
  return (
    <main className="flex">
      <Sidebar />
      <BlogListContent />
    </main>
  );
}
