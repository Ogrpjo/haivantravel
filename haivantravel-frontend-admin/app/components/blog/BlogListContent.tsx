"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createDeleteHandler } from "@/app/lib/tableActions";

export type BlogDetail = {
  id: number;
  title: string;
  slug: string;
  type: string | null;
  content: string | null;
  demo_image: string | null;
  date: string;
};

export default function BlogListContent() {
  const router = useRouter();
  const [items, setItems] = useState<BlogDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "https://api.haivanevent.vn";

  const resolveImageUrl = (value: string | null) => {
    if (!value) return "";
    if (value.startsWith("http://") || value.startsWith("https://")) return value;
    const trimmed = value.replace(/^\/+/, "");
    return `${apiBaseUrl}/${trimmed}`;
  };

  const getImageName = (value: string | null) => {
    if (!value) return "";
    const normalized = value.replace(/\\/g, "/");
    const parts = normalized.split("/").filter(Boolean);
    return parts[parts.length - 1] ?? "";
  };

  const fetchBlogs = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");
      const response = await fetch(`${apiBaseUrl}/blog-details`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Không thể tải danh sách bài viết.");
      }
      const data = (await response.json()) as BlogDetail[];
      setItems(data);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Có lỗi xảy ra.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchBlogs();
  }, []);

  const formatCreatedAt = (value: string) =>
    new Date(value).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const handleDelete = createDeleteHandler<BlogDetail>(
    (blog) => `${apiBaseUrl}/blog-details/${blog.id}`,
    () => void fetchBlogs(),
    "Bạn có chắc muốn xóa bài viết này? Hành động không thể hoàn tác."
  );

  return (
    <section className="bg-[#121212] text-white flex-8 px-[20px] w-full py-[10px]">
      <div className="py-[10px]">
        <p className="text-xl font-semibold text-white/75"> {">"} Blog </p>
      </div>
      <div className="flex flex-col w-full bg-[#1a1a1a] h-full rounded-[8px] min-h-0 border border-white/10">
        <div className="flex items-center justify-between px-[15px] py-[10px] max-h-[70px] min-h-[60px] border-b border-white/10">
          <div className="flex items-center gap-2">
            <Image
              src="/pageLogo/blog.svg"
              alt=""
              width={24}
              height={24}
              className="shrink-0"
            />
            <p className="font-medium">Danh sách bài viết • {items.length} bài viết</p>
          </div>
          <button
            type="button"
            className="cursor-pointer font-medium text-white text-md bg-[#05B9BA] hover:bg-[#049a9b] px-4 py-2 rounded-[6px] transition-colors"
            onClick={() => router.push("/dashboard/blog/new")}
          >
            + Tạo bài viết mới
          </button>
        </div>
        <div className="w-full flex flex-col flex-1 min-h-0">
          <div className="flex w-full items-center border-b border-r border-white/10 bg-[#222222] text-white/85 shrink-0">
            <div className="w-48 shrink-0 py-3 px-4 border-r border-white/10 font-medium">
              URL ảnh
            </div>
            <div className="flex-1 min-w-0 py-3 px-4 border-r border-white/10 font-medium">
              Tên bài viết
            </div>
            <div className="w-32 shrink-0 py-3 px-4 border-r border-white/10 font-medium">
              Loại
            </div>
            <div className="w-32 shrink-0 py-3 px-4 border-r border-white/10 font-medium">
              Ngày tạo
            </div>
            <div className="w-28 shrink-0 py-3 px-4 font-medium">
              Thao tác
            </div>
          </div>
          <div className="flex-1 overflow-auto min-h-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-white/60">Đang tải...</p>
              </div>
            ) : errorMessage ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-red-600">{errorMessage}</p>
              </div>
            ) : items.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-white/60">Chưa có bài viết</p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex w-full items-center border-b border-r border-white/10 text-white/85"
                >
                  <div className="w-48 shrink-0 py-3 px-4 border-r border-white/10">
                    {item.demo_image ? (
                      <a
                        href={resolveImageUrl(item.demo_image)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-[#05B9BA] hover:underline break-all"
                      >
                        {getImageName(item.demo_image)}
                      </a>
                    ) : (
                      <span className="text-xs text-white/40">-</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 py-3 px-4 border-r border-white/10">
                    <div className="font-medium text-white/90">{item.title}</div>
                    <div className="text-xs text-white/55">/blog/{item.slug}</div>
                  </div>
                  <div className="w-32 shrink-0 py-3 px-4 border-r border-white/10">
                    {item.type ?? "-"}
                  </div>
                  <div className="w-32 shrink-0 py-3 px-4 border-r border-white/10">
                    {formatCreatedAt(item.date)}
                  </div>
                  <div className="w-28 shrink-0 py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="flex h-8 w-8 items-center justify-center rounded-md border border-white/15 text-white/85 hover:border-[#05B9BA]/40 hover:bg-[#05B9BA]/10"
                        aria-label="Chỉnh sửa"
                        onClick={() => router.push(`/dashboard/blog/${item.id}/edit`)}
                      >
                        <Image src="/admin/edit.svg" alt="Chỉnh sửa" width={16} height={16} />
                      </button>
                      <button
                        type="button"
                        className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E0E0E0] text-[#D32F2F] hover:border-[#D32F2F]/40 hover:bg-[#D32F2F]/10"
                        aria-label="Xóa"
                        onClick={() => handleDelete(item)}
                      >
                        <Image src="/admin/delete.svg" alt="Xóa" width={16} height={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
