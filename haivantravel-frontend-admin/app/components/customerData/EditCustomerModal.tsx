"use client";

import { useEffect, useState } from "react";

export type PartnerForEdit = {
  id: number;
  business_type: string;
  icon: string;
  icon_size: number;
  is_active?: boolean;
  createdAt?: string;
};

type EditCustomerModalProps = {
  isOpen: boolean;
  partner: PartnerForEdit | null;
  onClose: () => void;
  onSuccess: () => void;
};

type FormData = {
  logo: File | null;
  businessType: string;
  iconSize: string;
};

export default function EditCustomerModal({
  isOpen,
  partner,
  onClose,
  onSuccess,
}: EditCustomerModalProps) {
  const [formData, setFormData] = useState<FormData>({
    logo: null,
    businessType: "",
    iconSize: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:2031";

  useEffect(() => {
    if (partner && isOpen) {
      setFormData({
        logo: null,
        businessType: partner.business_type,
        iconSize: String(partner.icon_size),
      });
      setErrorMessage("");
    }
  }, [partner, isOpen]);

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

  const handleChange =
    (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (field === "logo" && e.target instanceof HTMLInputElement && e.target.files) {
        setFormData((prev) => ({ ...prev, logo: e.target.files?.[0] ?? null }));
        return;
      }
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.businessType.trim()) {
      setErrorMessage("Vui lòng nhập loại hình doanh nghiệp.");
      return;
    }

    const iconSizeNumber = Number(formData.iconSize);
    if (!formData.iconSize.trim() || Number.isNaN(iconSizeNumber)) {
      setErrorMessage("Kích thước icon phải là số.");
      return;
    }

    if (!partner) return;

    try {
      setIsSubmitting(true);
      const payload = new FormData();
      payload.append("business_type", formData.businessType.trim());
      payload.append("icon_size", String(iconSizeNumber));
      if (formData.logo) payload.append("icon", formData.logo);

      const response = await fetch(`${apiBaseUrl}/partners/${partner.id}`, {
        method: "PATCH",
        body: payload,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Không thể cập nhật đối tác.");
      }

      onSuccess();
      onClose();
      setFormData({ logo: null, businessType: "", iconSize: "" });
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
      aria-labelledby="edit-customer-title"
    >
      <div
        className="relative w-full max-w-md bg-white rounded-xl shadow-[0_25px_50px_-12px_rgb(0_0_0_/0.15)]"
        style={{ animation: "modal-content-in 0.2s ease-out forwards" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#E0E0E0]">
          <h2 id="edit-customer-title" className="text-xl font-semibold text-[#424242]">
            Chỉnh sửa khách hàng
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
              <label htmlFor="edit-customer-logo" className="block text-sm font-medium text-[#424242] mb-1.5">
                Icon doanh nghiệp (để trống nếu giữ nguyên)
              </label>
              <input
                id="edit-customer-logo"
                type="file"
                accept="image/*"
                onChange={handleChange("logo")}
                className="block w-full text-sm text-[#424242] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#05B9BA] file:text-white hover:file:opacity-90 cursor-pointer"
              />
            </div>

            <div>
              <label
                htmlFor="edit-customer-business-type"
                className="block text-sm font-medium text-[#424242] mb-1.5"
              >
                Loại hình doanh nghiệp
              </label>
              <input
                id="edit-customer-business-type"
                type="text"
                value={formData.businessType}
                onChange={handleChange("businessType")}
                className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-[#424242] placeholder:text-[#9E9E9E] focus:outline-none focus:ring-2 focus:ring-[#05B9BA]/50 focus:border-[#05B9BA]"
                placeholder="Nhập loại hình doanh nghiệp"
              />
            </div>

            <div>
              <label
                htmlFor="edit-customer-icon-size"
                className="block text-sm font-medium text-[#424242] mb-1.5"
              >
                Kích thước icon
              </label>
              <input
                id="edit-customer-icon-size"
                type="number"
                min="1"
                value={formData.iconSize}
                onChange={handleChange("iconSize")}
                className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-[#424242] placeholder:text-[#9E9E9E] focus:outline-none focus:ring-2 focus:ring-[#05B9BA]/50 focus:border-[#05B9BA]"
                placeholder="Ví dụ: 64"
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
