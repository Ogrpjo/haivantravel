"use client";

import { useEffect, useState } from "react";

type AddCustomerModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type CustomerFormData = {
  logo: File | null;
  businessType: string;
  iconSize: string;
};

export default function AddCustomerModal({ isOpen, onClose }: AddCustomerModalProps) {
  const [formData, setFormData] = useState<CustomerFormData>({
    logo: null,
    businessType: "",
    iconSize: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "https://api.haivanevent.vn";

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
    (field: keyof CustomerFormData) =>
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

    if (!formData.logo) {
      setErrorMessage("Vui lòng chọn icon doanh nghiệp.");
      return;
    }

    if (!formData.businessType.trim()) {
      setErrorMessage("Vui lòng nhập loại hình doanh nghiệp.");
      return;
    }

    const iconSizeNumber = Number(formData.iconSize);
    if (!formData.iconSize.trim() || Number.isNaN(iconSizeNumber)) {
      setErrorMessage("Kích thước icon phải là số.");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = new FormData();
      payload.append("icon", formData.logo);
      payload.append("business_type", formData.businessType.trim());
      payload.append("icon_size", String(iconSizeNumber));

      const response = await fetch(`${apiBaseUrl}/partners`, {
        method: "POST",
        body: payload,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Không thể lưu đối tác mới.");
      }

      onClose();
      setFormData({
        logo: null,
        businessType: "",
        iconSize: "",
      });
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
      aria-labelledby="add-customer-title"
    >
      <div
        className="relative w-full max-w-md bg-white rounded-xl shadow-[0_25px_50px_-12px_rgb(0_0_0_/0.15)]"
        style={{ animation: "modal-content-in 0.2s ease-out forwards" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#E0E0E0]">
          <h2 id="add-customer-title" className="text-xl font-semibold text-[#424242]">
            Thêm khách hàng mới
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
              <label htmlFor="customer-logo" className="block text-sm font-medium text-[#424242] mb-1.5">
                Icon doanh nghiệp
              </label>
              <input
                id="customer-logo"
                type="file"
                accept="image/*"
                onChange={handleChange("logo")}
                className="block w-full text-sm text-[#424242] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#05B9BA] file:text-white hover:file:opacity-90 cursor-pointer"
              />
            </div>

            <div>
              <label
                htmlFor="customer-business-type"
                className="block text-sm font-medium text-[#424242] mb-1.5"
              >
                Loại hình doanh nghiệp
              </label>
              <input
                id="customer-business-type"
                type="text"
                value={formData.businessType}
                onChange={handleChange("businessType")}
                className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-[#424242] placeholder:text-[#9E9E9E] focus:outline-none focus:ring-2 focus:ring-[#05B9BA]/50 focus:border-[#05B9BA]"
                placeholder="Nhập loại hình doanh nghiệp"
              />
            </div>

            <div>
              <label
                htmlFor="customer-icon-size"
                className="block text-sm font-medium text-[#424242] mb-1.5"
              >
                Kích thước icon
              </label>
              <input
                id="customer-icon-size"
                type="number"
                min="1"
                value={formData.iconSize}
                onChange={handleChange("iconSize")}
                className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-[#424242] placeholder:text-[#9E9E9E] focus:outline-none focus:ring-2 focus:ring-[#05B9BA]/50 focus:border-[#05B9BA]"
                placeholder="Ví dụ: 64px"
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
                {isSubmitting ? "Đang lưu..." : "Lưu đối tác"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

