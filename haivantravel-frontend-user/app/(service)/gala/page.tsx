import { resolveUiBlockContent } from "@/app/lib/resolveUiBlockContent";
import Footer from "@/app/components/layout/Footer";
import Navigationbar from "@/app/components/Navigationbar";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:2031";

type GalaPayload = {
  content?: string | null;
  html_content?: string | null;
  css_content?: string | null;
};

async function getGalaContent(): Promise<GalaPayload | null> {
  try {
    const res = await fetch(`${API_BASE}/gala`, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as GalaPayload;
  } catch {
    return null;
  }
}

export default async function Gala() {
  const data = await getGalaContent();
  const resolvedContent = resolveUiBlockContent(
    data?.content ?? null,
    data?.html_content ?? null,
    data?.css_content ?? null,
  );

  return (
    <main className="w-screen min-h-screen bg-[#111111] flex flex-col relative">
      <Navigationbar />
      <section className="w-full flex-1 text-white">
        {!resolvedContent ? (
          <div className="p-8 text-center">
            <h1 className="text-2xl font-semibold mb-2">Nội dung Gala chưa sẵn sàng</h1>
            <p className="text-white/60">Vui lòng quay lại sau.</p>
          </div>
        ) : (
          <div className="w-full max-w-[1200px] mx-auto px-6 max-sm:px-4 py-10">
            <article
              className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-white/90 prose-a:text-[#05B9BA] [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:ml-4 [&_li]:my-1"
              dangerouslySetInnerHTML={{ __html: resolvedContent }}
            />
          </div>
        )}
      </section>
      <Footer />
    </main>
  );
}