import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "../../components/layout/Footer";
import Navigationbar from "../../components/Navigationbar";
import { resolveUiBlockContent } from "@/app/lib/resolveUiBlockContent";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:2031";

type ApiProject = {
  id: number;
  title: string;
  short_description: string | null;
  seo_title: string | null;
  seo_keywords: string | null;
  seo_description: string | null;
  project_type: string | null;
  duration_days: number | null;
  guest_count: number | null;
  artist_count: number | null;
  image_url: string;
  link_url: string;
  content: string | null;
  html_content: string | null;
  css_content: string | null;
};

type ApiProjectSummary = Pick<ApiProject, "id" | "title">;

function titleToSlug(title: string): string {
  const stripped = title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\u0111/g, "d")
    .replace(/\u0110/g, "d")
    .toLowerCase()
    .trim();

  return stripped.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

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

function normalizeGrapesHtmlFragment(html: string): string {
  const trimmed = html.trim();
  if (!trimmed) return trimmed;
  if (/<!doctype html/i.test(trimmed) || /<html[\s>]/i.test(trimmed)) {
    return trimmed;
  }

  return trimmed
    .replace(/^<body\b([^>]*)>/i, '<div class="ui-block-body"$1>')
    .replace(/<\/body>/gi, "</div>")
    .replace(/^<html\b([^>]*)>/i, '<div class="ui-block-body"$1>')
    .replace(/<\/html>/gi, "</div>");
}

async function findProjectIdBySlug(slug: string): Promise<number | null> {
  try {
    const res = await fetch(`${API_BASE}/projects`, { cache: "no-store" });
    if (!res.ok) return null;

    const data = (await res.json()) as ApiProjectSummary[];
    if (!Array.isArray(data)) return null;

    const decoded = decodeURIComponent(slug);
    const match = data.find((p) => titleToSlug(p.title?.trim() || "") === decoded);
    return match?.id ?? null;
  } catch {
    return null;
  }
}

async function getProjectBySlug(slug: string): Promise<ApiProject | null> {
  try {
    const projectId = await findProjectIdBySlug(slug);
    if (!projectId) return null;

    const res = await fetch(`${API_BASE}/projects/${projectId}`, {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache" },
    });
    if (!res.ok) return null;
    return (await res.json()) as ApiProject;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return { title: "Dự án | Hải Vân Travel" };
  }

  const title =
    project.seo_title?.trim() || `${project.title?.trim() || "Dự án"} | Hải Vân Travel`;

  const description =
    project.seo_description?.trim() || project.short_description?.trim() || undefined;

  const keywords = project.seo_keywords?.trim()
    ? project.seo_keywords
        .split(",")
        .map((keyword) => keyword.trim())
        .filter(Boolean)
    : undefined;

  return {
    title,
    description,
    keywords,
    openGraph: { title, description },
  };
}

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  const normalizedHtmlContent = normalizeGrapesHtmlFragment(project.html_content?.trim() ?? "");
  const htmlToRender = resolveUiBlockContent(
    project.content ?? null,
    normalizedHtmlContent || null,
    null,
  );
  const cssToRender = project.css_content?.trim() ?? "";
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
          <div className="p-8 text-center text-white">Nội dung chưa sẵn sàng</div>
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
