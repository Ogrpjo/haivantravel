import type { Metadata } from "next";
import { resolveUiBlockContent } from "@/app/lib/resolveUiBlockContent";
import Footer from "@/app/components/layout/Footer";
import Navigationbar from "@/app/components/Navigationbar";

export const metadata: Metadata = {
  title: "Gala Dinner & Year End Party | Hải Vân Event",
  description:
    "Hải Vân Event tổ chức Gala Dinner và Year End Party với concept riêng, sân khấu chỉn chu, kịch bản rõ ràng và trải nghiệm cảm xúc cho doanh nghiệp",
};

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
  const htmlToRender =
    data?.html_content?.trim() ||
    resolveUiBlockContent(data?.content ?? null, null, null);
  const cssToRender = data?.css_content?.trim() ?? "";
  const safeCss = `
    @layer external-content {
      ${cssToRender.replace(/(body|html|:root)/g, ".gjs-content-wrapper")}
    }
  `;

  return (
    <main className="w-screen min-h-screen bg-[#111111] flex flex-col relative">
      <Navigationbar />
      <section className="w-full flex-1 text-white">
        {!htmlToRender ? (
          <div className="p-8 text-center">
            <h1 className="text-2xl font-semibold mb-2">Nội dung Gala chưa sẵn sàng</h1>
            <p className="text-white/60">Vui lòng quay lại sau.</p>
          </div>
        ) : (
          <div className="w-full gjs-content-wrapper">
            <style dangerouslySetInnerHTML={{ __html: safeCss }} />
            <div dangerouslySetInnerHTML={{ __html: htmlToRender }} />
          </div>
        )}
      </section>
      <Footer />
    </main>
  );
}