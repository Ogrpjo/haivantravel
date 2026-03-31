import type { Metadata } from "next";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import styles from "./blog-detail.module.css";

type BlogDetail = {
  id: number;
  title: string;
  slug: string;
  type: string | null;
  content: string | null;
  createdAt: string;
  date?: string | null;
  metaTitle?: string | null;
  metaKeywords?: string | null;
  metaDescription?: string | null;
  meta_title?: string | null;
  meta_keywords?: string | null;
  meta_description?: string | null;
};

const getApiBaseUrl = () =>
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:2031";

async function getBlogDetail(slug: string): Promise<BlogDetail | null> {
  try {
    const url = `${getApiBaseUrl()}/blog-details/slug/${slug}`;
    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) {
      return null;
    }

    const data = (await res.json()) as BlogDetail;
    return data;
  } catch {
    return null;
  }
}

const getSeoData = (detail: BlogDetail | null) => {
  if (!detail) {
    return {
      title: "Bài viết không tồn tại | Hải Vân Travel",
      description: "Nội dung bài viết không tồn tại hoặc đã bị xóa.",
      keywords: undefined as string | undefined,
    };
  }

  const title =
    detail.metaTitle?.trim() ||
    detail.meta_title?.trim() ||
    `${detail.title} | Hải Vân Travel`;
  const description =
    detail.metaDescription?.trim() ||
    detail.meta_description?.trim() ||
    undefined;
  const keywords =
    detail.metaKeywords?.trim() || detail.meta_keywords?.trim() || undefined;

  return { title, description, keywords };
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getBlogDetail(slug);
  const seo = getSeoData(detail);

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      title: seo.title,
      description: seo.description,
      type: "article",
      locale: "vi_VN",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
    },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const detail = await getBlogDetail(slug);

  const publishedDate = detail
    ? new Date(detail.createdAt ?? detail.date ?? "").toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "";

  return (
    <main className="w-screen min-h-screen bg-[#111111] flex flex-col gap-y-20 relative pt-[136px]">
      <Navbar />
      <section className="w-full max-w-[1200px] mx-auto px-6 max-sm:px-4 py-10 text-white">
        {!detail ? (
          <div className="rounded-2xl p-8 text-center">
            <h1 className="text-2xl font-semibold mb-2">Bài viết không tồn tại</h1>
            <p className="text-white/60">Vui lòng kiểm tra lại đường dẫn.</p>
          </div>
        ) : (
          <div className="rounded-2xl p-0 bg-[#111111] overflow-hidden">
            <div className="blog-header mb-5">
              <h1 className="m-0 text-[32px] font-bold leading-[1.25] text-white">
                {detail.title}
              </h1>
              <div className="mt-2 text-sm text-white/60">Ngày đăng: {publishedDate}</div>
            </div>
            <div
              className={[
                styles.blogContent,
                "prose prose-invert max-w-none",
                "prose-headings:text-white prose-p:text-white/90 prose-a:text-[#05B9BA]",
                "prose-ul:list-disc prose-ol:list-decimal",
                "prose-ul:pl-6 prose-ol:pl-6",
                "prose-li:my-1",
              ].join(" ")}
              dangerouslySetInnerHTML={{ __html: detail.content ?? "" }}
            />
          </div>
        )}
      </section>
      <Footer />
      
    </main>
  );
}
