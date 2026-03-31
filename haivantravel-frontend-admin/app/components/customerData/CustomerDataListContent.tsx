"use client"

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import AddCustomerModal from "./AddCustomerModal";
import EditCustomerModal from "./EditCustomerModal";
import { createEditHandler, createDeleteHandler } from "@/app/lib/tableActions";

type Partner = {
  id: number;
  business_type: string;
  icon: string;
  icon_size: number;
  createdAt: string;
  is_active: boolean;
};

export default function CustomerDataListContent() {
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [visibleCount, setVisibleCount] = useState(9);
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:2031";

  const fetchPartners = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");
      const response = await fetch(`${apiBaseUrl}/partners`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Không thể tải dữ liệu khách hàng.");
      }
      const data = (await response.json()) as Partner[];
      setPartners(data);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Có lỗi xảy ra.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchPartners();
  }, []);

  const formatCreatedAt = (value: string) =>
    new Date(value).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const partnerRows = useMemo(() => partners, [partners]);
  const visiblePartners = useMemo(
    () => partnerRows.slice(0, Math.min(visibleCount, partnerRows.length)),
    [partnerRows, visibleCount],
  );
  const canLoadMore = visibleCount < partnerRows.length;

  useEffect(() => {
    setVisibleCount(9);
  }, [partnerRows.length]);

  const handleEdit = createEditHandler<Partner>((partner) => setEditingPartner(partner));
  const handleDelete = createDeleteHandler<Partner>(
    (partner) => `${apiBaseUrl}/partners/${partner.id}`,
    () => void fetchPartners(),
    "Bạn có chắc muốn xóa khách hàng này? Hành động không thể hoàn tác."
  );

  const handleToggleStatus = async (partnerId: number) => {
    const previous = partners;
    setPartners((prev) =>
      prev.map((item) =>
        item.id === partnerId ? { ...item, is_active: !item.is_active } : item,
      ),
    );

    try {
      const response = await fetch(`${apiBaseUrl}/partners/${partnerId}/toggle-status`, {
        method: "PATCH",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Không thể cập nhật trạng thái.");
      }

      const updated = (await response.json()) as Partner;
      setPartners((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    } catch (error) {
      setPartners(previous);
      setErrorMessage(error instanceof Error ? error.message : "Có lỗi xảy ra.");
    }
  };

  return (
    <section className="bg-[#121212] text-white flex-8 px-[20px] w-full py-[10px]">
      <div className="py-[10px]">
        <p className="text-xl font-semibold text-white/75">
          {">"} Dữ liệu khách hàng
        </p>
      </div>
      <div className="flex flex-col w-full bg-[#1a1a1a] h-full rounded-[8px] min-h-0 border border-white/10">
        <div className="flex items-center justify-between px-[15px] py-[10px] max-h-[70px] min-h-[60px] border-b border-white/10">
          <div className="flex items-center gap-2">
            <Image
              src="/pageLogo/datacustomer.svg"
              alt=""
              width={24}
              height={24}
              className="shrink-0"
            />
            <p className="font-medium">Danh sách khách hàng • {partners.length} mục</p>
          </div>
          <button
            type="button"
            className="cursor-pointer font-medium text-white text-md bg-[#05B9BA] hover:bg-[#049a9b] px-4 py-2 rounded-[6px] transition-colors"
            onClick={() => setIsAddCustomerOpen(true)}
          >
            + Thêm khách hàng
          </button>
        </div>
        <div className="w-full flex flex-col flex-1 min-h-0 overflow-auto" style={{ scrollbarGutter: "stable" }}>
          <div className="flex w-full items-center border-b border-white/10 bg-[#222222] text-white/85 shrink-0 sticky top-0 z-10">
            <div className="min-w-[320px] flex-1 basis-0 py-3 px-4 border-r border-white/10 font-medium">
              Logo khách hàng
            </div>
            <div className="flex-1 basis-0 min-w-0 max-w-[135px] py-3 px-4 border-r border-white/10 font-medium">
              Lĩnh vực khách hàng
            </div>
            <div className="flex-1 basis-0 min-w-0 py-3 px-4 border-r border-white/10 font-medium">
              Trạng thái
            </div>
            <div className="flex-1 basis-0 min-w-0 py-3 px-4 border-r border-white/10 font-medium">
              Kích thước
            </div>
            <div className="flex-1 basis-0 min-w-0 py-3 px-4 border-r border-white/10 font-medium">
              Ngày tạo
            </div>
            <div className="flex-1 basis-0 min-w-0 py-3 px-4 font-medium">
              Thao tác
            </div>
          </div>
          {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-white/60">Đang tải dữ liệu...</p>
              </div>
            ) : errorMessage ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-red-600">{errorMessage}</p>
              </div>
            ) : partnerRows.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-white/60">Chưa có dữ liệu khách hàng</p>
              </div>
            ) : (
              <div className="divide-y divide-white/10">
                {visiblePartners.map((partner) => (
                  <div key={partner.id} className="flex w-full items-center min-w-0">
                    <div className="min-w-[320px] flex-1 basis-0 py-3 px-4 border-r border-white/10">
                      <p className="text-white/85 truncate">{partner.icon.split("/").pop()}</p>
                    </div>
                    <div className="flex-1 basis-0 min-w-0 max-w-[135px] py-3 px-4 border-r border-white/10 text-white/85">
                      {partner.business_type}
                    </div>
                    <div className="flex-1 basis-0 min-w-0 py-3 px-4 border-r border-white/10">
                      <button
                        type="button"
                        className={`relative inline-flex h-6 w-11 items-center rounded-full border transition-colors ${
                          partner.is_active ? "bg-[#05B9BA] border-[#05B9BA]" : "bg-[#E0E0E0] border-[#BDBDBD]"
                        }`}
                        aria-pressed={partner.is_active}
                        aria-label={partner.is_active ? "Đang kích hoạt" : "Đang tắt"}
                        onClick={() => void handleToggleStatus(partner.id)}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                            partner.is_active ? "translate-x-5" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                    <div className="flex-1 basis-0 min-w-0 py-3 px-4 border-r border-white/10 text-white/85">
                      {partner.icon_size}
                    </div>
                    <div className="flex-1 basis-0 min-w-0 py-3 px-4 border-r border-white/10 text-white/85">
                      {partner.createdAt ? formatCreatedAt(partner.createdAt) : "-"}
                    </div>
                    <div className="flex-1 basis-0 min-w-0 py-3 px-4 text-white/85">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="flex h-8 w-8 items-center justify-center rounded-md border border-white/15 text-white/85 hover:border-[#05B9BA]/40 hover:bg-[#05B9BA]/10"
                          aria-label="Chỉnh sửa"
                          onClick={() => handleEdit(partner)}
                        >
                          <Image src="/admin/edit.svg" alt="Chỉnh sửa" width={16} height={16} />
                        </button>
                        <button
                          type="button"
                          className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E0E0E0] text-[#D32F2F] hover:border-[#D32F2F]/40 hover:bg-[#D32F2F]/10"
                          aria-label="Xóa"
                          onClick={() => handleDelete(partner)}
                        >
                          <Image src="/admin/delete.svg" alt="Xóa" width={16} height={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {canLoadMore ? (
                  <div className="flex w-full items-center justify-center py-4">
                    <button
                      type="button"
                      onClick={() =>
                        setVisibleCount((prev) =>
                          Math.min(prev + 9, partnerRows.length),
                        )
                      }
                      className="cursor-pointer font-medium text-white text-md bg-[#05B9BA] hover:bg-[#049a9b] px-4 py-2 rounded-[6px] transition-colors"
                    >
                      Xem thêm
                    </button>
                  </div>
                ) : null}
              </div>
            )}
        </div>
      </div>
      <AddCustomerModal
        isOpen={isAddCustomerOpen}
        onClose={() => {
          setIsAddCustomerOpen(false);
          void fetchPartners();
        }}
      />
      <EditCustomerModal
        isOpen={!!editingPartner}
        partner={editingPartner}
        onClose={() => setEditingPartner(null)}
        onSuccess={() => void fetchPartners()}
      />
    </section>
  );
}

