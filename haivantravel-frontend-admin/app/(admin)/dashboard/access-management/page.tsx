"use client";

import { useEffect, useMemo, useState } from "react";
import Sidebar from "@/app/components/SideBar";

type VisitorStatsResponse = {
  totalVisitors: number;
  propertyId?: string;
  message?: string;
};

export default function AccessManagementPage() {
  const [totalVisitors, setTotalVisitors] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null);

  const visitorLabel = useMemo(() => {
    if (totalVisitors === null) return "—";
    return new Intl.NumberFormat("vi-VN").format(totalVisitors);
  }, [totalVisitors]);

  const fetchVisitorStats = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await fetch("/api/analytics/visitors", {
        method: "GET",
        cache: "no-store",
      });

      const data = (await response.json()) as VisitorStatsResponse;

      if (!response.ok) {
        throw new Error(data.message || "Không thể tải số lượt truy cập.");
      }

      setTotalVisitors(typeof data.totalVisitors === "number" ? data.totalVisitors : 0);
      setLastUpdatedAt(new Date().toLocaleString("vi-VN"));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Có lỗi xảy ra.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchVisitorStats();
  }, []);

  return (
    <main className="flex min-h-screen bg-[#121212] text-white">
      <Sidebar />
      <section className="flex-1 px-[20px] py-[10px] bg-[#121212]">
        <div className="py-[10px]">
          <p className="text-xl font-semibold text-white/75">{">"} Quản lí truy cập</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-[12px] border border-white/10 bg-[#1a1a1a] p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-[#8ED6D7]">
                  Tổng lượt truy cập website
                </p>
                <h1 className="mt-3 text-4xl font-semibold text-white">
                  {isLoading ? "Đang tải..." : visitorLabel}
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60">
                  Số liệu được lấy từ Google Analytics 4 bằng biến môi trường <code>GA_ID</code>.
                  Trang này giúp theo dõi tổng số người đã truy cập website.
                </p>
              </div>

              <button
                type="button"
                onClick={() => void fetchVisitorStats()}
                className="rounded-md border border-white/10 px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/5"
              >
                Làm mới
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-[#151515] p-4">
                <p className="text-sm text-white/50">Trạng thái</p>
                <p className="mt-2 text-base font-medium text-white">
                  {isLoading ? "Đang đồng bộ dữ liệu" : errorMessage ? "Không thành công" : "Sẵn sàng"}
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-[#151515] p-4">
                <p className="text-sm text-white/50">Cập nhật gần nhất</p>
                <p className="mt-2 text-base font-medium text-white">
                  {lastUpdatedAt || "Chưa cập nhật"}
                </p>
              </div>
            </div>

            {errorMessage ? (
              <div className="mt-6 rounded-xl border border-rose-400/30 bg-rose-500/10 p-4 text-rose-200">
                {errorMessage}
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}
