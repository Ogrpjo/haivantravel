"use client";

import PostCard from "./Postcard";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

type BlogDetail = {
  id: number;
  title: string;
  slug: string;
  type: string | null;
  demo_image: string | null;
  date: string;
};

export default function BlogList() {
  const [items, setItems] = useState<BlogDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
  const INITIAL_LOAD = 9;
  const LOAD_MORE_STEP = 3;

  const fetchBlogs = useCallback(
    async (offset: number, limit: number, append: boolean) => {
      try {
        if (append) {
          setIsLoadingMore(true);
        } else {
          setIsLoading(true);
        }
        setErrorMessage("");
        if (!apiBaseUrl) throw new Error("Thiếu NEXT_PUBLIC_API_URL.");

        const params = new URLSearchParams();
        params.set("offset", String(offset));
        params.set("limit", String(limit));
        const response = await fetch(`${apiBaseUrl}/blog-details?${params.toString()}`);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "Không thể tải danh sách bài viết.");
        }
        const data = (await response.json()) as BlogDetail[];
        const safe = Array.isArray(data) ? data : [];

        setItems((prev) => (append ? [...prev, ...safe] : safe));
        setHasMore(safe.length === limit);
      } catch (error) {
        if (!append) setItems([]);
        setErrorMessage(error instanceof Error ? error.message : "Có lỗi xảy ra.");
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [apiBaseUrl],
  );

  useEffect(() => {
    void fetchBlogs(0, INITIAL_LOAD, false);
  }, [fetchBlogs]);

  const formatCreatedAt = (value: string) =>
    new Date(value).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const resolveImageUrl = (value?: string | null) => {
    if (!value) {
      console.warn("[BlogList] demo_image is null/empty, using fallback");
      return "/Blog/image1.png";
    }
    if (value.startsWith("data:")) return value;
    if (value.startsWith("http://") || value.startsWith("https://")) return value;

    const normalized = value.replace(/\\/g, "/");
    const uploadsIndex = normalized.toLowerCase().lastIndexOf("/uploads/");
    if (uploadsIndex !== -1) {
      const resolved = `${apiBaseUrl}${normalized.slice(uploadsIndex)}`;
      console.debug("[BlogList] demo_image resolved (uploads)", { value, resolved });
      return resolved;
    }

    const resolved = `${apiBaseUrl}/${normalized.replace(/^\/+/, "")}`;
    console.debug("[BlogList] demo_image resolved", { value, resolved });
    return resolved;
  };

  const handleLoadMore = () => {
    if (isLoadingMore || !hasMore) return;
    void fetchBlogs(items.length, LOAD_MORE_STEP, true);
  };

  return (
    <section className="w-full">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col border-t-2 border-[#1D1C1C] px-6 max-lg:px-5 max-sm:px-4">
        <h3 className="mt-2 text-center text-[20px] font-bold">Danh sách tin tức</h3>
        {isLoading ? (
          <div className="py-8 text-[#7E7E7E]">Đang tải...</div>
        ) : errorMessage ? (
          <div className="py-8 text-red-600">{errorMessage}</div>
        ) : items.length === 0 ? (
          <div className="py-8 text-[#7E7E7E]">Chưa có bài viết</div>
        ) : (
          <div className="mt-4">
            <div className="grid w-full grid-cols-1 gap-y-6 lg:grid-cols-3 lg:gap-x-6">
              {items.map((item) => (
                <PostCard
                  key={item.id}
                  src={resolveImageUrl(item.demo_image)}
                  title={item.title}
                  topic={item.type ?? ""}
                  date={formatCreatedAt(item.date)}
                  href={`/blog/${item.slug}`}
                />
              ))}
            </div>
            {items.length > 0 && hasMore ? (
              <div className="mt-8 flex w-full justify-center">
                <button
                  type="button"
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="inline-flex items-center gap-2 rounded-[12px] bg-gradient-to-b from-[#3F9293] to-[#8E4590] px-5 py-2 text-[12px] font-semibold text-white"
                >
                  {isLoadingMore ? "Đang tải..." : "Xem thêm"}
                </button>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}
