import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:2031";

async function getMiceContent(): Promise<string | null> {
  try {
    const res = await fetch(`${API_BASE}/mice`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = (await res.json()) as { content?: string | null };
    return typeof data?.content === "string" ? data.content : null;
  } catch {
    return null;
  }
}

export default async function Mice() {
  const content = await getMiceContent();

  return (
    <main className="min-h-screen flex flex-col pt-[136px]">
      <Navbar />
      <section className="flex-1 w-full max-w-[1200px] mx-auto px-6 max-sm:px-4 text-white flex items-center justify-center">
        {!content ? (
          <div className="rounded-2xl p-8 text-center w-full">
            <h1 className="text-2xl font-semibold mb-2">
              Nội dung MICE chưa sẵn sàng
            </h1>
            <p className="text-white/60">Vui lòng quay lại sau.</p>
          </div>
        ) : (
          <article
            className="prose prose-invert w-full max-w-none prose-headings:text-white prose-p:text-white/90 prose-a:text-[#05B9BA] [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:ml-4 [&_li]:my-1"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
      </section>
      <Footer />
    </main>
  );
}