import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:2031";

async function getAboutContent(): Promise<string | null> {
  try {
    const res = await fetch(`${API_BASE}/about`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return typeof data?.content === "string" ? data.content : null;
  } catch {
    return null;
  }
}

export default async function About() {
  const content = await getAboutContent();

  return (
    <main className="w-screen min-h-screen bg-[#111111] flex flex-col gap-y-20 relative pt-[136px]">
      <Navbar />
      <section className="w-full max-w-[1200px] mx-auto px-6 max-sm:px-4 py-10 text-white">
        {!content ? (
          <div className="rounded-2xl p-8 text-center">
            <h1 className="text-2xl font-semibold mb-2">
              Nội dung giới thiệu chưa sẵn sàng
            </h1>
            <p className="text-white/60">Vui lòng quay lại sau.</p>
          </div>
        ) : (
          <article
            className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-white/90 prose-a:text-[#05B9BA]"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
      </section>
      <Footer />
    </main>
  );
}
