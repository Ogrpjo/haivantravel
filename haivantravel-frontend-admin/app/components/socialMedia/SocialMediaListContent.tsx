"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import AddSocialMediaModal from "./AddSocialMediaModal";
import { getApiBaseUrl } from "@/app/lib/apiBaseUrl";

export type SocialLink = {
  id: number;
  title: string;
  url: string;
  isActive: boolean;
  createdAt: string;
};

export default function SocialMediaListContent() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SocialLink | null>(null);
  const [list, setList] = useState<SocialLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const apiBaseUrl = getApiBaseUrl();

  const fetchSocialLinks = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");
      const response = await fetch(`${apiBaseUrl}/social-links`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Không thể tải danh sách mạng xã hội.");
      }
      const data = (await response.json()) as SocialLink[];
      setList(data);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Có lỗi xảy ra.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchSocialLinks();
  }, []);

  const formatCreatedAt = (value: string) =>
    new Date(value).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const totalLabel = useMemo(() => `${list.length} mục`, [list.length]);

  const handleDelete = async (item: SocialLink) => {
    const ok = window.confirm(`Bạn có chắc muốn xóa ${item.title} không?`);
    if (!ok) return;

    try {
      setActionMessage("");
      const response = await fetch(`${apiBaseUrl}/social-links/${item.id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Không thể xóa mạng xã hội.");
      }
      setActionMessage("Đã xóa mạng xã hội.");
      await fetchSocialLinks();
    } catch (error) {
      setActionMessage(error instanceof Error ? error.message : "Có lỗi xảy ra.");
    }
  };

  return (
    <section className="bg-[#121212] text-white flex-8 px-[20px] w-full py-[10px]">
      <div className="py-[10px]">
        <p className="text-xl font-semibold text-white/75">{">"} Social Media</p>
      </div>
      <div className="flex flex-col w-full bg-[#1a1a1a] h-full rounded-[8px] min-h-0 border border-white/10">
        <div className="flex items-center justify-between px-[15px] py-[10px] max-h-[70px] min-h-[60px] border-b border-white/10 gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <Image src="/pageLogo/social.svg" alt="" width={24} height={24} className="shrink-0" />
            <p className="font-medium truncate">Danh sách mạng xã hội • {totalLabel}</p>
          </div>
          <button
            type="button"
            className="cursor-pointer font-medium text-white text-md bg-[#05B9BA] hover:bg-[#049a9b] px-4 py-2 rounded-[6px] transition-colors shrink-0"
            onClick={() => setIsAddOpen(true)}
          >
            + Thêm mạng xã hội
          </button>
        </div>
        {actionMessage ? (
          <div className="px-4 pt-3 text-sm text-white/70">{actionMessage}</div>
        ) : null}
        <div className="w-full flex flex-col flex-1 min-h-0">
          <div className="flex w-full items-center border-b border-r border-white/10 bg-[#222222] text-white/85 shrink-0">
            <div className="flex-1 min-w-0 py-3 px-4 border-r border-white/10 font-medium">Nền tảng</div>
            <div className="flex-1 min-w-0 py-3 px-4 border-r border-white/10 font-medium">Link</div>
            <div className="w-32 shrink-0 py-3 px-4 border-r border-white/10 font-medium">Kích hoạt</div>
            <div className="w-32 shrink-0 py-3 px-4 border-r border-white/10 font-medium">Ngày tạo</div>
            <div className="w-40 shrink-0 py-3 px-4 font-medium">Thao tác</div>
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
            ) : list.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-white/60">Chưa có mạng xã hội</p>
              </div>
            ) : (
              list.map((item) => (
                <div key={item.id} className="flex w-full items-center border-b border-r border-white/10 text-white/85">
                  <div className="flex-1 min-w-0 py-3 px-4 border-r border-white/10 truncate" title={item.title}>{item.title}</div>
                  <div className="flex-1 min-w-0 py-3 px-4 border-r border-white/10">
                    <a href={item.url} target="_blank" rel="noreferrer" className="block truncate text-[#05B9BA] hover:underline" title={item.url}>
                      {item.url}
                    </a>
                  </div>
                  <div className="w-32 shrink-0 py-3 px-4 border-r border-white/10">
                    <span className={item.isActive ? "inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700" : "inline-flex rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-medium text-rose-700"}>
                      {item.isActive ? "Đang bật" : "Tắt"}
                    </span>
                  </div>
                  <div className="w-32 shrink-0 py-3 px-4 border-r border-white/10">{formatCreatedAt(item.createdAt)}</div>
                  <div className="w-40 shrink-0 py-3 px-4 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingItem(item)}
                      className="inline-flex items-center rounded-md border border-white/15 px-3 py-1.5 text-sm text-white hover:bg-white/10 transition-colors"
                    >
                      Sửa
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDelete(item)}
                      className="inline-flex items-center rounded-md border border-rose-400/30 px-3 py-1.5 text-sm text-rose-300 hover:bg-rose-500/10 transition-colors"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <AddSocialMediaModal
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          onSuccess={() => void fetchSocialLinks()}
        />
        <AddSocialMediaModal
          isOpen={Boolean(editingItem)}
          mode="edit"
          initialData={editingItem ? { title: editingItem.title, url: editingItem.url } : undefined}
          onClose={() => setEditingItem(null)}
          onSuccess={() => void fetchSocialLinks()}
        />
      </div>
    </section>
  );
}
