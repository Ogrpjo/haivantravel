import type { Metadata } from "next";
import { resolveUiBlockContent } from "@/app/lib/resolveUiBlockContent";
import Footer from "../components/layout/Footer";
import Navigationbar from "../components/Navigationbar";

export const metadata: Metadata = {
  title: "Về chúng tôi | Hải Vân Event",
  description:
    "Tìm hiểu về Hải Vân Event - Đơn vị đồng hành tổ chức Company Trip, Teambuilding, Gala Dinner, MICE và các chương trình trải nghiệm cho doanh nghiệp.",
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:2031";

type AboutPayload = {
  content?: string | null;
  html_content?: string | null;
  css_content?: string | null;
};

async function getAboutContent(): Promise<AboutPayload | null> {
  try {
    const res = await fetch(`${API_BASE}/about`, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as AboutPayload;
  } catch {
    return null;
  }
}

export default async function About() {
  const data = await getAboutContent();
  const htmlToRender = data?.html_content?.trim() || resolveUiBlockContent(data?.content ?? null, null, null);
  const cssToRender = data?.css_content?.trim() ?? "";

  // 1. Gói CSS từ API vào một Layer có độ ưu tiên thấp nhất (ví dụ: 'external')
  // 2. Chuyển selector 'body' thành một class cụ thể để bảo vệ Navbar
  const safeCss = `
    @layer external-content {
      ${cssToRender.replace(/(body|html|:root)/g, '.gjs-content-wrapper')}
    }
  `;

  return (
    <main className="w-screen min-h-screen bg-[#111111] flex flex-col relative">
      <Navigationbar />
      <section className="w-full flex-1 text-white">
        {!htmlToRender ? (
          <div className="p-8 text-center text-white">Nội dung chưa sẵn sàng</div>
        ) : (
          <div className="w-full gjs-content-wrapper">
             {/* Chèn CSS đã được phân lớp */}
            <style dangerouslySetInnerHTML={{ __html: safeCss }} />
            <div dangerouslySetInnerHTML={{ __html: htmlToRender }} />
          </div>
        )}
      </section>
      <Footer />
    </main>
  );
}
