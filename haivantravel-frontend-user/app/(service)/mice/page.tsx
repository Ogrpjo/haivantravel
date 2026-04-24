import type { Metadata } from "next";
import { resolveUiBlockContent } from "@/app/lib/resolveUiBlockContent";
import Footer from "@/app/components/layout/Footer";
import Navigationbar from "@/app/components/Navigationbar";

export const metadata: Metadata = {
  title: "MICE, Hội nghị, Hội thảo cho doanh nghiệp | Hải Vân Event",
  description:
    "Giải pháp MICE, hội nghị và hội thảo cho doanh nghiệp với quy trình rõ ràng, vận hành chuyên nghiệp và trải nghiệm đồng bộ cho đại biểu.",
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:2031";

type MicePayload = {
  content?: string | null;
  html_content?: string | null;
  css_content?: string | null;
};

async function getMiceContent(): Promise<MicePayload | null> {
  try {
    const res = await fetch(`${API_BASE}/mice`, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as MicePayload;
  } catch {
    return null;
  }
}

export default async function Mice() {
  const data = await getMiceContent();
  const htmlToRender = resolveUiBlockContent(
    data?.content ?? null,
    data?.html_content ?? null,
    null,
  );
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
            <h1 className="text-2xl font-semibold mb-2">
              Nội dung MICE chưa sẵn sàng
            </h1>
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