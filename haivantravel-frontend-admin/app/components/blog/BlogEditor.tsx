"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import "suneditor/dist/css/suneditor.min.css";

const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export default function BlogCreatePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [content, setContent] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaKeywords, setMetaKeywords] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [demoImage, setDemoImage] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:2031";

  const slug = useMemo(() => slugify(title), [title]);

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

    if (!demoImage) {
      setErrorMessage("Vui lòng chọn ảnh demo.");
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
      payload.append("demo_image", demoImage);

      const response = await fetch(`${apiBaseUrl}/blog-details`, {
        method: "POST",
        body: payload,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Không thể lưu bài viết.");
      }

      router.push(`/dashboard/blog`);
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
          {">"} Blog {">"} Tạo bài viết mới
        </p>
      </div>

      <div className="flex flex-col w-full bg-[#1a1a1a] h-full rounded-[8px] p-6 min-h-[calc(100vh-120px)] border border-white/10">
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
            <label className="block text-sm font-medium text-white/85">
              Ảnh demo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setDemoImage(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-white/80 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#05B9BA] file:text-white hover:file:opacity-90 cursor-pointer"
            />
            <p className="mt-1 text-xs text-white/55">
              Chọn ảnh demo từ thiết bị của bạn.
            </p>
          </div>

          <div className="border border-white/15 rounded-lg overflow-hidden bg-white">
            <SunEditor
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
            <div className="text-sm text-red-400 bg-red-900/20 border border-red-900/50 rounded-lg px-3 py-2">
              {errorMessage}
            </div>
          ) : null}

          <div className="flex justify-end gap-2 mt-4">
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
              {isSubmitting ? "Đang lưu..." : "Lưu bài viết"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}