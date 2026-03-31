import BlogEditorPage from "@/app/components/blog/BlogEditorPage";
import Sidebar from "@/app/components/SideBar";

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="flex">
      <Sidebar />
      <BlogEditorPage blogId={id} />
    </main>
  );
}
