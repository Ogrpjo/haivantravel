import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "../../components/layout/Footer";
import Navigationbar from "../../components/Navigationbar";

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
};

function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL?.trim() || "https://api.haivanevent.vn";
}

function titleToSlug(title: string): string {
  const stripped = title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\u0111/g, "d")
    .replace(/\u0110/g, "d")
    .toLowerCase()
    .trim();
  return stripped
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function getProjectBySlug(slug: string): Promise<ApiProject | null> {
  try {
    const res = await fetch(`${getApiBaseUrl()}/projects`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = (await res.json()) as ApiProject[];
    if (!Array.isArray(data)) return null;
    const decoded = decodeURIComponent(slug);
    return (
      data.find((p) => titleToSlug(p.title?.trim() || "") === decoded) ?? null
    );
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
    project.seo_title?.trim() ||
    `${project.title?.trim() || "Dự án"} | Hải Vân Travel`;
  const description =
    project.seo_description?.trim() ||
    project.short_description?.trim() ||
    undefined;
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

  return (
    <main className="w-screen min-h-screen bg-[#111111] flex flex-col gap-y-20 relative pt-[136px]">
      <Navigationbar />
      <section className="w-full lg:px-[120px] sm:px-[84px] px-[20px] py-10 text-white pb-24">
        <article
          className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-10 prose prose-invert max-w-none prose-headings:text-white prose-p:text-white/80 prose-li:text-white/80"
          dangerouslySetInnerHTML={{
            __html: project.content?.trim() || "<p>Chưa có nội dung chi tiết cho dự án này.</p>",
          }}
        />

      </section>
      <Footer />
    </main>
  );
}
