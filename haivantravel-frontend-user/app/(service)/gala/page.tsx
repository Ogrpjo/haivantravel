import { resolveUiBlockContent } from "@/app/lib/resolveUiBlockContent";
import ProjectContentFrame from "@/app/components/ProjectContentFrame";
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

function toIframeDocument(content: string): string {
  const trimmed = content.trim().toLowerCase();
  if (trimmed.startsWith("<!doctype html") || trimmed.startsWith("<html")) {
    return content;
  }
  return `<!DOCTYPE html><html lang="vi"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head><body>${content}</body></html>`;
}

export default async function Gala() {
  const data = await getGalaContent();
  const resolvedContent = resolveUiBlockContent(
    data?.content ?? null,
    data?.html_content ?? null,
    data?.css_content ?? null,
  );
  const iframeDoc = toIframeDocument(resolvedContent);

  return (
    <main className="w-screen min-h-screen bg-[#111111] flex flex-col relative pt-[136px]">
      <Navigationbar />
      <section className="w-full flex-1 text-white">
        {!resolvedContent ? (
          <div className="p-8 text-center">
            <h1 className="text-2xl font-semibold mb-2">Nội dung Gala chưa sẵn sàng</h1>
            <p className="text-white/60">Vui lòng quay lại sau.</p>
          </div>
        ) : (
          <ProjectContentFrame
            title="Gala content preview"
            srcDoc={iframeDoc}
          />
        )}
      </section>
      <Footer />
    </main>
  );
}