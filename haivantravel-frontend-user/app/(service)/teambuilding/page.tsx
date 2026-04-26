import type { Metadata } from "next";
import { resolveUiBlockContent } from "@/app/lib/resolveUiBlockContent";
import Footer from "@/app/components/layout/Footer";
import Navigationbar from "@/app/components/Navigationbar";

export const metadata: Metadata = {
  title: "Company Trip & Teambuilding cho doanh nghiệp | Hải Vân Event",
  description:
    "Giải pháp Company Trip và Teambuilding thiết kế riêng cho doanh nghiệp. Hải Vân Event đồng hành từ concept, lên lịch trình đến vận hành onsite.",
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:2031";

type TeamBuildingPayload = {
  content?: string | null;
  html_content?: string | null;
  css_content?: string | null;
};

function scopeCssToWrapper(css: string, wrapperSelector: string): string {
  return css.replace(/(^|})\s*([^@}{][^{}]*)\s*\{/g, (match, boundary, selectorGroup) => {
    const scopedSelectors = selectorGroup
      .split(",")
      .map((selector: string) => selector.trim())
      .filter(Boolean)
      .map((selector: string) => {
        if (selector.startsWith(wrapperSelector)) return selector;
        if (selector === "html" || selector === "body" || selector === ":root") {
          return wrapperSelector;
        }
        return `${wrapperSelector} ${selector}`;
      })
      .join(", ");

    if (!scopedSelectors) return match;
    return `${boundary} ${scopedSelectors} {`;
  });
}

async function getTeamBuildingContent(): Promise<TeamBuildingPayload | null> {
  try {
    const res = await fetch(`${API_BASE}/teambuilding`, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as TeamBuildingPayload;
  } catch {
    return null;
  }
}

export default async function Teambuilding() {
  const data = await getTeamBuildingContent();
  const htmlToRender = resolveUiBlockContent(
    data?.content ?? null,
    data?.html_content ?? null,
    null,
  );
  const cssToRender = data?.css_content?.trim() ?? "";
  const scopedCss = scopeCssToWrapper(cssToRender, ".gjs-content-wrapper");
  const safeCss = `
    @layer external-content {
      ${scopedCss}
    }
  `;

  return (
    <main className="w-screen min-h-screen bg-[#111111] flex flex-col relative">
      <Navigationbar />
      <section className="w-full flex-1 text-white">
        {!htmlToRender ? (
          <div className="p-8 text-center">
            <h1 className="text-2xl font-semibold mb-2">
              Nội dung Team building chưa sẵn sàng
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