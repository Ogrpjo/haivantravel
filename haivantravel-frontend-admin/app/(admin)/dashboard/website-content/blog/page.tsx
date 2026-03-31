"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/app/components/SideBar";

type EventPayload = {
  name: string | null;
  time: string | null;
};

const getApiBaseUrl = () =>
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:2031";

export default function WebsiteContentBlogPage() {
  const [eventName, setEventName] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchEvent = async () => {
      try {
        const res = await fetch(`${getApiBaseUrl()}/events`, {
          cache: "no-store",
        });
        if (!res.ok) return;
        const data = (await res.json()) as EventPayload | null;
        if (!cancelled && data) {
          setEventName(data.name ?? "");
          setEventTime(data.time ?? "");
        }
      } catch {
        // ignore fetch error
      }
    };

    fetchEvent();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`${getApiBaseUrl()}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: eventName || null,
          time: eventTime || null,
        }),
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Không thể lưu sự kiện.");
      }
      setMessage("Đã lưu sự kiện sắp diễn ra.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Có lỗi xảy ra khi lưu.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="flex">
      <Sidebar />
      <section className="bg-[#121212] text-white flex-8 px-[20px] w-full py-[10px]">
        <div className="py-[10px]">
          <p className="text-xl font-semibold text-white/75">
            {">"} Website Content {">"} Blog
          </p>
        </div>
        <div className="rounded-lg bg-[#1a1a1a] p-6 flex flex-col gap-4 border border-white/10">
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-white/75 font-medium mb-2">Sự kiện sắp diễn ra</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-white/70">Tên sự kiện</label>
                  <input
                    type="text"
                    value={eventName}
                    onChange={(event) => setEventName(event.target.value)}
                    className="border border-white/15 bg-[#121212] text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#05B9BA]"
                    placeholder="Nhập tên sự kiện"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-white/70">Thời gian diễn ra</label>
                  <input
                    type="text"
                    value={eventTime}
                    onChange={(event) => setEventTime(event.target.value)}
                    className="border border-white/15 bg-[#121212] text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#05B9BA]"
                    placeholder="Nhập thời gian diễn ra"
                  />
                </div>
              </div>
            </div>
          </div>
          {message ? (
            <div
              className={`text-sm border rounded-lg px-3 py-2 ${
                message.startsWith("Đã lưu")
                  ? "text-[#2E7D32] bg-[#E8F5E9] border-[#C8E6C9]"
                  : "text-[#C62828] bg-[#FFEBEE] border-[#FFCDD2]"
              }`}
            >
              {message}
            </div>
          ) : null}
          <div className="flex justify-end">
            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-[#05B9BA] text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "Đang lưu..." : "Lưu nội dung"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

