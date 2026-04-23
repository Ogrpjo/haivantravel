import type { Metadata } from "next";
import { resolveUiBlockContent } from "@/app/lib/resolveUiBlockContent";
import Footer from "@/app/components/layout/Footer";
import Navigationbar from "@/app/components/Navigationbar";
import ScopedHtmlContent from "@/app/components/ScopedHtmlContent";

export const metadata: Metadata = {
  title: "MICE",
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
            <h1 className="text-2xl font-semibold mb-2">
              Nội dung MICE chưa sẵn sàng
            </h1>
            <p className="text-white/60">Vui lòng quay lại sau.</p>
          </div>
        ) : (
          <div className="w-full">
            <ScopedHtmlContent html={resolvedContent} />
          </div>
        )}
      </section>
      <Footer />
    </main>
  );
}