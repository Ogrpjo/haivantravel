"use client";

import { useEffect, useState } from "react";

export type ServiceForEdit = {
  id: number;
  title: string;
  description: string;
  icon: string;
};

type EditServiceModalProps = {
  isOpen: boolean;
  service: ServiceForEdit | null;
  onClose: () => void;
  onSuccess: () => void;
};

type ServiceFormData = {
  title: string;
  description: string;
  icon: File | null;
};

export default function EditServiceModal({
  isOpen,
  service,
  onClose,
  onSuccess,
}: EditServiceModalProps) {
  const [formData, setFormData] = useState<ServiceFormData>({
    title: "",
    description: "",
    icon: null,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "https://api.haivanevent.vn";

  useEffect(() => {
    if (service && isOpen) {
      setFormData({
        title: service.title ?? "",
        description: service.description ?? "",
        icon: null,
      });
      setErrorMessage("");
    }
  }, [service, isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    if (!service) return;

    if (!formData.title.trim()) {
      setErrorMessage("Vui lòng nhập tên dịch vụ.");
      return;
    }

    if (!formData.description.trim()) {
      setErrorMessage("Vui lòng nhập mô tả dịch vụ.");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = new FormData();
      payload.append("title", formData.title.trim());
      payload.append("description", formData.description.trim());
      if (formData.icon) payload.append("icon", formData.icon);

      const response = await fetch(`${apiBaseUrl}/services/${service.id}`, {
        method: "PATCH",
        body: payload,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Không thể cập nhật dịch vụ.");
      }

      onSuccess();
      onClose();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Có lỗi xảy ra.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      style={{ animation: "modal-overlay-in 0.2s ease-out forwards" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-service-title"
    >
      <div
        className="relative w-full max-w-md bg-white rounded-xl shadow-[0_25px_50px_-12px_rgb(0_0_0_/0.15)]"
        style={{ animation: "modal-content-in 0.2s ease-out forwards" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#E0E0E0]">
          <h2 id="edit-service-title" className="text-xl font-semibold text-[#424242]">
            Chỉnh sửa dịch vụ
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#7E7E7E] hover:bg-[#E0E0E0] hover:text-[#424242] transition-colors"
            aria-label="Đóng"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-6">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="edit-service-name" className="block text-sm font-medium text-[#424242] mb-1.5">
                Tên dịch vụ
              </label>
              <input
                id="edit-service-name"
                type="text"
                placeholder="Nhập tên dịch vụ"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-[#424242] placeholder:text-[#9E9E9E] focus:outline-none focus:ring-2 focus:ring-[#05B9BA]/50 focus:border-[#05B9BA]"
              />
            </div>

            <div>
              <label
                htmlFor="edit-service-logo"
                className="block text-sm font-medium text-[#424242] mb-1.5"
              >
                Logo (để trống nếu giữ nguyên)
              </label>
              <input
                id="edit-service-logo"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  setFormData((prev) => ({ ...prev, icon: file }));
                }}
                className="block w-full text-sm text-[#424242] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#05B9BA] file:text-white hover:file:opacity-90 cursor-pointer"
              />
            </div>

            <div>
              <label
                htmlFor="edit-service-description"
                className="block text-sm font-medium text-[#424242] mb-1.5"
              >
                Mô tả dịch vụ
              </label>
              <textarea
                id="edit-service-description"
                rows={3}
                placeholder="Nhập mô tả dịch vụ"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, description: e.target.value }))
                }
                className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-[#424242] placeholder:text-[#9E9E9E] focus:outline-none focus:ring-2 focus:ring-[#05B9BA]/50 focus:border-[#05B9BA] resize-none"
              />
            </div>

            {errorMessage ? (
              <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {errorMessage}
              </div>
            ) : null}

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-[#E0E0E0] text-[#424242] hover:bg-[#FAFAFA] transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 rounded-lg bg-[#05B9BA] text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
