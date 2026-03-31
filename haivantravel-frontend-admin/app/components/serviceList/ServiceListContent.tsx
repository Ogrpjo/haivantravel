"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import AddServiceModel from "./AddServiceModel";
import EditServiceModal, { type ServiceForEdit } from "./EditServiceModal";
import ServiceItem from "./ServiceItem";
import { createDeleteHandler } from "@/app/lib/tableActions";

export type Service = {
  id: number;
  title: string;
  description: string;
  icon: string;
  createAt: string;
  is_active: boolean;
};

export default function ServiceListContent() {
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceForEdit | null>(
    null,
  );
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:2031";

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");
      const response = await fetch(`${apiBaseUrl}/services`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Không thể tải danh sách dịch vụ.");
      }
      const data = (await response.json()) as Service[];
      setServices(data);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Có lỗi xảy ra.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchServices();
  }, []);

  const formatCreatedAt = (value: string) =>
    new Date(value).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const handleToggleStatus = async (serviceId: number) => {
    const previous = services;
    setServices((prev) =>
      prev.map((item) =>
        item.id === serviceId ? { ...item, is_active: !item.is_active } : item,
      ),
    );

    try {
      const response = await fetch(
        `${apiBaseUrl}/services/${serviceId}/toggle-status`,
        { method: "PATCH" },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Không thể cập nhật trạng thái.");
      }

      const updated = (await response.json()) as Service;
      setServices((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item)),
      );
    } catch (error) {
      setServices(previous);
      setErrorMessage(error instanceof Error ? error.message : "Có lỗi xảy ra.");
    }
  };

  const handleDelete = createDeleteHandler<Service>(
    (service) => `${apiBaseUrl}/services/${service.id}`,
    () => void fetchServices(),
    "Bạn có chắc muốn xóa dịch vụ này? Hành động không thể hoàn tác.",
  );

  const handleEdit = (serviceId: number) => {
    const service = services.find((item) => item.id === serviceId) ?? null;
    if (service) {
      setEditingService(service);
    }
  };

  return (
    <section className="bg-[#121212] text-white flex-8 px-[20px] w-full py-[10px]">
      <div className="py-[10px]">
        <p className="text-xl font-semibold text-white/75"> {">"} Sản phẩm </p>
      </div>
      <div className="flex flex-col w-full bg-[#1a1a1a] h-full rounded-[8px] min-h-0 border border-white/10">
        <div className="flex items-center justify-between px-[15px] py-[10px] max-h-[70px] min-h-[60px] border-b border-white/10">
          <div className="flex items-center gap-2">
            <Image
              src="/pageLogo/service.svg"
              alt=""
              width={24}
              height={24}
              className="shrink-0"
            />
            <p className="font-medium">
              Danh sách dịch vụ • {services.length} dịch vụ
            </p>
          </div>
          <button
            type="button"
            className="cursor-pointer font-medium text-white text-md bg-[#05B9BA] hover:bg-[#049a9b] px-4 py-2 rounded-[6px] transition-colors"
            onClick={() => setIsAddServiceOpen(true)}
          >
            + Tạo dịch vụ
          </button>
        </div>
        <div className="w-full flex flex-col flex-1 min-h-0">
          <div className="flex w-full items-center border-b border-r border-white/10 bg-[#222222] text-white/85 shrink-0">
            <div className="flex-1 min-w-0 py-3 px-4 border-r border-white/10 font-medium">
              Tên dịch vụ
            </div>
            <div className="w-40 shrink-0 py-3 px-4 border-r border-white/10 font-medium">
              Logo
            </div>
            <div className="w-40 shrink-0 py-3 px-4 border-r border-white/10 font-medium">
              Mô tả dịch vụ
            </div>
            <div className="w-32 shrink-0 py-3 px-4 border-r border-white/10 font-medium">
              Trạng thái
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
            ) : services.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-white/60">Chưa có dịch vụ</p>
              </div>
            ) : (
              services.map((service) => (
                <ServiceItem
                  key={service.id}
                  id={String(service.id)}
                  name={service.title}
                  description={service.description}
                  iconPath={service.icon}
                  active={service.is_active}
                  createdAt={formatCreatedAt(service.createAt)}
                  onToggle={() => handleToggleStatus(service.id)}
                  onEdit={(id) => handleEdit(Number(id))}
                  onDelete={() => handleDelete(service)}
                />
              ))
            )}
          </div>
        </div>
        <AddServiceModel
          isOpen={isAddServiceOpen}
          onClose={() => setIsAddServiceOpen(false)}
          onSuccess={() => void fetchServices()}
        />
        <EditServiceModal
          isOpen={!!editingService}
          service={editingService}
          onClose={() => setEditingService(null)}
          onSuccess={() => void fetchServices()}
        />
      </div>
    </section>
  );
}
