"use client";

import Sidebar from "@/app/components/SideBar";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import "suneditor/dist/css/suneditor.min.css";

const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

export default function WebsiteContentMicePage() {
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:2031";

  useEffect(() => {
    let cancelled = false;
    const fetchContent = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/mice`, { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && data?.content != null) setContent(String(data.content));
      } catch (error) {
        console.error("[MICE] fetch error", error);
      }
    };

    fetchContent();
    return () => {
      cancelled = true;
    };
  }, [apiBaseUrl]);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`${apiBaseUrl}/mice`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Không thể lưu nội dung.");
      }
      setMessage("Đã lưu nội dung MICE.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Có lỗi xảy ra khi lưu.");
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
            {">"} Website Content {">"} MICE
          </p>
        </div>
        <div className="rounded-lg bg-[#1a1a1a] p-6 flex flex-col gap-4 h-screen border border-white/10">
          <div className="border border-white/15 rounded-lg overflow-hidden">
            <SunEditor
              setContents={content}
              onChange={(value: string) => setContent(value)}
              setOptions={{
                height: "400px",
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

