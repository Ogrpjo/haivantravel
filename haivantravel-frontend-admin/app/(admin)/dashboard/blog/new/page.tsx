import BlogListContent from "@/app/components/blog/BlogListContent";
import BlogEditor from "@/app/components/blog/BlogEditor";
import Sidebar from "@/app/components/SideBar";

export default function NewBlogPage() {
  return (
    <main className="flex">
      <Sidebar />
      <section className="bg-[#121212] text-white flex-8 px-[20px] w-full py-[10px]">
        <div className="py-[10px]">
          <p className="text-xl font-semibold text-white/75">
            {">"} Blog {">"} Tạo bài viết mới
          </p>
        </div>
        <div className="flex flex-col w-full bg-[#1a1a1a] h-full rounded-[8px] p-6 min-h-[calc(100vh-120px)] border border-white/10">
          <BlogEditor />
        </div>
      </section>
    </main>
  );
}

