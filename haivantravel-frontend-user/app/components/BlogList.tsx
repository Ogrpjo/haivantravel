"use client";

import PostCard from "./Postcard";
import { useEffect, useMemo, useState } from "react";
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
  const [errorMessage, setErrorMessage] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [visibleCount, setVisibleCount] = useState(0);
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  const pageConfig = useMemo(
    () => ({
      initial: isMobile ? 3 : 9,
      step: isMobile ? 1 : 3,
    }),
    [isMobile],
  );

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");
        if (!apiBaseUrl) throw new Error("Thiếu NEXT_PUBLIC_API_URL.");
        const response = await fetch(`${apiBaseUrl}/blog-details`);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "Không thể tải danh sách bài viết.");
        }
        const data = (await response.json()) as BlogDetail[];
        const safe = Array.isArray(data) ? data : [];
        setItems(safe);
      } catch (error) {
        setItems([]);
        setErrorMessage(error instanceof Error ? error.message : "Có lỗi xảy ra.");
      } finally {
        setIsLoading(false);
      }
    };

    void fetchBlogs();
  }, [apiBaseUrl]);

  useEffect(() => {
    // reset pagination when data source / breakpoint changes
    setVisibleCount(pageConfig.initial);
  }, [pageConfig.initial, items.length]);

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

  const visibleItems = items.slice(0, Math.min(visibleCount, items.length));
  const canLoadMore = visibleCount < items.length;
  const handleLoadMore = () => {
    setVisibleCount((prev) =>
      Math.min(prev + pageConfig.step, items.length),
    );
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
              {visibleItems.map((item) => (
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
            {canLoadMore ? (
              <div className="mt-8 flex w-full justify-center">
                <button
                  type="button"
                  onClick={handleLoadMore}
                  className="inline-flex items-center gap-2 rounded-[12px] bg-gradient-to-b from-[#3F9293] to-[#8E4590] px-5 py-2 text-[12px] font-semibold text-white"
                >
                  Xem thêm
                  <Image
                    src="/arrow-circle-right-solid.svg"
                    alt="arrow"
                    width={16}
                    height={16}
                    className="h-4 w-4"
                  />
                </button>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}
