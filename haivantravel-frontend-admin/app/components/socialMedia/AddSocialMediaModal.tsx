"use client";

import { useEffect, useMemo, useState } from "react";
import { getApiBaseUrl } from "@/app/lib/apiBaseUrl";

const SOCIAL_OPTIONS = [
  "Facebook",
  "Instagram",
  "Youtube",
  "Tiktok",
  "LinkedIn",
  "Twitter",
  "Zalo",
];

type AddSocialMediaModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

type SocialMediaFormData = {
  title: string;
  url: string;
};

export default function AddSocialMediaModal({
  isOpen,
  onClose,
  onSuccess,
}: AddSocialMediaModalProps) {
  const [formData, setFormData] = useState<SocialMediaFormData>({
    title: SOCIAL_OPTIONS[0],
    url: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const apiBaseUrl = getApiBaseUrl();

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

  useEffect(() => {
    if (!isOpen) return;
    setFormData({ title: SOCIAL_OPTIONS[0], url: "" });
    setErrorMessage("");
  }, [isOpen]);

  const isValidUrl = useMemo(() => {
    if (!formData.url.trim()) return false;
    try {
      new URL(formData.url.trim());
      return true;
    } catch {
      return false;
    }
  }, [formData.url]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.title.trim()) {
      setErrorMessage("Vui lòng chọn nền tảng mạng xã hội.");
      return;
    }

    if (!formData.url.trim()) {
      setErrorMessage("Vui lòng nhập đường dẫn.");
      return;
    }

    if (!isValidUrl) {
      setErrorMessage("Đường dẫn chưa đúng định dạng.");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch(`${apiBaseUrl}/social-links`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title.trim(),
          url: formData.url.trim(),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Không thể lưu mạng xã hội.");
      }

      onClose();
      onSuccess?.();
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
      aria-labelledby="add-social-title"
    >
      <div
        className="relative w-full max-w-md bg-white rounded-xl shadow-[0_25px_50px_-12px_rgb(0_0_0_/0.15)]"
        style={{ animation: "modal-content-in 0.2s ease-out forwards" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#E0E0E0]">
          <h2 id="add-social-title" className="text-xl font-semibold text-[#424242]">
            Thêm mạng xã hội
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
              <label htmlFor="social-platform" className="block text-sm font-medium text-[#424242] mb-1.5">
                Nền tảng
              </label>
              <select
                id="social-platform"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-[#424242] focus:outline-none focus:ring-2 focus:ring-[#05B9BA]/50 focus:border-[#05B9BA]"
              >
                {SOCIAL_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="social-url" className="block text-sm font-medium text-[#424242] mb-1.5">
                Đường dẫn
              </label>
              <input
                id="social-url"
                type="url"
                placeholder="https://..."
                value={formData.url}
                onChange={(e) => setFormData((prev) => ({ ...prev, url: e.target.value }))}
                className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-[#424242] placeholder:text-[#9E9E9E] focus:outline-none focus:ring-2 focus:ring-[#05B9BA]/50 focus:border-[#05B9BA]"
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
                {isSubmitting ? "Đang lưu..." : "Lưu"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
