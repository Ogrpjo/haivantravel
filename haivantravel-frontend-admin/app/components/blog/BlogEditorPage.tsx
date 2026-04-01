"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import "suneditor/dist/css/suneditor.min.css";
import { getApiBaseUrl } from "@/app/lib/apiBaseUrl";

const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

type BlogDetail = {
  id: number;
  title: string;
  slug: string;
  type: string | null;
  content: string | null;
  demo_image: string | null;
  date: string;
  meta_title?: string | null;
  meta_keywords?: string | null;
  meta_description?: string | null;
};

type BlogEditorPageProps = {
  blogId: string;
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export default function BlogEditorPage({ blogId }: BlogEditorPageProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [content, setContent] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaKeywords, setMetaKeywords] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [demoImage, setDemoImage] = useState<File | null>(null);
  const [existingDemoImage, setExistingDemoImage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const apiBaseUrl = getApiBaseUrl();

  const slug = useMemo(() => slugify(title), [title]);

  const resolveImageUrl = (value: string | null) => {
    if (!value) return "";
    if (value.startsWith("http://") || value.startsWith("https://")) return value;
    const trimmed = value.replace(/^\/+/, "");
    return `${apiBaseUrl}/${trimmed}`;
  };

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");
        const response = await fetch(`${apiBaseUrl}/blog-details`);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "Không thể tải bài viết.");
        }
        const data = (await response.json()) as BlogDetail[];
        const normalizedId = String(blogId).trim();
        const selected = data.find((item) => {
          const itemId = String(item.id).trim();
          return itemId === normalizedId || Number(itemId) === Number(normalizedId);
        });
        if (!selected) {
          throw new Error("Không tìm thấy bài viết.");
        }
        setTitle(selected.title);
        setType(selected.type ?? "");
        setContent(selected.content ?? "");
        setMetaTitle(selected.meta_title ?? "");
        setMetaKeywords(selected.meta_keywords ?? "");
        setMetaDescription(selected.meta_description ?? "");
        setExistingDemoImage(selected.demo_image ?? null);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Có lỗi xảy ra.");
      } finally {
        setIsLoading(false);
      }
    };

    void fetchBlog();
  }, [apiBaseUrl, blogId]);

  const handleSubmit = async () => {
    setErrorMessage("");

    if (!title.trim()) {
      setErrorMessage("Vui lòng nhập tiêu đề.");
      return;
    }

    if (!content.trim()) {
      setErrorMessage("Vui lòng nhập nội dung bài viết.");
      return;
    }

    const finalSlug = slug || `blog-${Date.now()}`;

    try {
      setIsSubmitting(true);
      const payload = new FormData();
      payload.append("title", title.trim());
      payload.append("slug", finalSlug);
      if (type.trim()) payload.append("type", type.trim());
      payload.append("content", content);
      payload.append("meta_title", metaTitle.trim());
      payload.append("meta_keywords", metaKeywords.trim());
      payload.append("meta_description", metaDescription.trim());
      if (demoImage) payload.append("demo_image", demoImage);

      const response = await fetch(`${apiBaseUrl}/blog-details/${blogId}`, {
        method: "PATCH",
        body: payload,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Không thể cập nhật bài viết.");
      }

      router.push("/dashboard/blog");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Có lỗi xảy ra.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-[#121212] text-white flex-8 px-[20px] w-full py-[10px]">
      <div className="py-[10px]">
        <p className="text-xl font-semibold text-white/75">
          {">"} Blog {">"} Chỉnh sửa bài viết
        </p>
      </div>
      <div className="flex flex-col w-full bg-[#1a1a1a] h-full rounded-[8px] p-6 min-h-[calc(100vh-120px)] border border-white/10">
        {isLoading ? (
          <div className="flex items-center justify-center py-10 text-white/60">Đang tải...</div>
        ) : errorMessage ? (
          <div className="flex items-center justify-center py-10 text-red-600">{errorMessage}</div>
        ) : (
          <div className="flex flex-col h-full gap-4">
            <div className="flex flex-col gap-2">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Tiêu đề bài viết"
                className="w-full px-4 py-2 border border-white/15 bg-[#121212] rounded-lg text-lg font-semibold text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#05B9BA]/50 focus:border-[#05B9BA]"
              />
              <div className="text-sm text-white/60">
                Đường dẫn: <span className="text-white/85">/blog/{slug || "..."}</span>
              </div>
            </div>

            <div className="border border-white/15 rounded-lg p-4 space-y-3 bg-[#121212]">
              <p className="text-sm font-semibold text-white/85">Thiết lập SEO</p>

              <div className="space-y-1">
                <label className="block text-sm text-white/70">Meta title</label>
                <input
                  type="text"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="Nhập meta title (tuỳ chọn)"
                  className="w-full px-4 py-2 border border-white/15 bg-[#121212] rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#05B9BA]/50 focus:border-[#05B9BA]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm text-white/70">Meta keywords</label>
                <input
                  type="text"
                  value={metaKeywords}
                  onChange={(e) => setMetaKeywords(e.target.value)}
                  placeholder="Ví dụ: du lịch, xe khách, hải vân (tuỳ chọn)"
                  className="w-full px-4 py-2 border border-white/15 bg-[#121212] rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#05B9BA]/50 focus:border-[#05B9BA]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm text-white/70">Meta description</label>
                <textarea
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="Nhập mô tả SEO ngắn gọn (tuỳ chọn)"
                  rows={3}
                  className="w-full px-4 py-2 border border-white/15 bg-[#121212] rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#05B9BA]/50 focus:border-[#05B9BA] resize-y"
                />
              </div>
            </div>

            <input
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="Loại bài viết (tuỳ chọn)"
              className="w-full px-4 py-2 border border-white/15 bg-[#121212] rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#05B9BA]/50 focus:border-[#05B9BA]"
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/85">Ảnh demo</label>
              {existingDemoImage ? (
                <a
                  href={resolveImageUrl(existingDemoImage)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-[#05B9BA] hover:underline break-all"
                >
                  {resolveImageUrl(existingDemoImage)}
                </a>
              ) : (
                <p className="text-sm text-white/50">Chưa có ảnh demo</p>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setDemoImage(e.target.files?.[0] ?? null)}
                className="block w-full text-sm text-white/80 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#05B9BA] file:text-white hover:file:opacity-90 cursor-pointer"
              />
              <p className="text-xs text-white/55">Chọn ảnh mới nếu muốn thay đổi.</p>
            </div>

            <div className="border border-white/15 rounded-lg overflow-hidden">
              <SunEditor
                setContents={content}
                onChange={(value: string) => setContent(value)}
                setOptions={{
                  height: "400px",
                  font: ["Inter", "Montserrat", "Roboto", "Arial", "Tahoma", "Times New Roman"],
                  buttonList: [
                    ["undo", "redo"],
                    ["font", "fontSize", "formatBlock"],
                    ["bold", "italic", "underline", "strike"],
                    ["fontColor", "hiliteColor"],
                    ["align", "list", "lineHeight"],
                    ["link", "image"],
                    ["removeFormat"],
                  ],
                }}
              />
            </div>

            {errorMessage ? (
              <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {errorMessage}
              </div>
            ) : null}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="px-4 py-2 rounded-lg border border-white/15 text-white/85 hover:bg-white/10 transition-colors"
                onClick={() => router.push("/dashboard/blog")}
              >
                Hủy
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded-lg bg-[#05B9BA] text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
