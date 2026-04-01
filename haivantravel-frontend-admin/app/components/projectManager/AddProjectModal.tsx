"use client";

import { useEffect, useMemo, useState } from "react";

type AddProjectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

type ProjectFormData = {
  link_url: string;
  image: File | null;
};

export default function AddProjectModal({
  isOpen,
  onClose,
  onSuccess,
}: AddProjectModalProps) {
  const [formData, setFormData] = useState<ProjectFormData>({
    link_url: "",
    image: null,
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

  useEffect(() => {
    if (!isOpen) return;
    setFormData({ link_url: "", image: null });
    setErrorMessage("");
  }, [isOpen]);

  const isValidUrl = useMemo(() => {
    if (!formData.link_url.trim()) return false;
    try {
      new URL(formData.link_url.trim());
      return true;
    } catch {
      return false;
    }
  }, [formData.link_url]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.link_url.trim()) {
      setErrorMessage("Vui lòng nhập liên kết dự án.");
      return;
    }
    if (!isValidUrl) {
      setErrorMessage("Liên kết chưa đúng định dạng.");
      return;
    }
    if (!formData.image) {
      setErrorMessage("Vui lòng chọn ảnh dự án.");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = new FormData();
      payload.append("link_url", formData.link_url.trim());
      payload.append("image", formData.image);

      const response = await fetch(`${apiBaseUrl}/projects`, {
        method: "POST",
        body: payload,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Không thể lưu dự án.");
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
      aria-labelledby="add-project-title"
    >
      <div
        className="relative w-full max-w-md bg-white rounded-xl shadow-[0_25px_50px_-12px_rgb(0_0_0_/0.15)]"
        style={{ animation: "modal-content-in 0.2s ease-out forwards" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#E0E0E0]">
          <h2 id="add-project-title" className="text-xl font-semibold text-[#424242]">
            Thêm dự án
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
          <form
            className="space-y-4"
            onSubmit={handleSubmit}
          >
            <div>
              <label htmlFor="project-link" className="block text-sm font-medium text-[#424242] mb-1.5">
                Liên kết dự án
              </label>
              <input
                id="project-link"
                type="url"
                placeholder="https://..."
                value={formData.link_url}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, link_url: e.target.value }))
                }
                className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-[#424242] placeholder:text-[#9E9E9E] focus:outline-none focus:ring-2 focus:ring-[#05B9BA]/50 focus:border-[#05B9BA]"
              />
            </div>

            <div>
              <label
                htmlFor="project-image"
                className="block text-sm font-medium text-[#424242] mb-1.5"
              >
                Ảnh dự án
              </label>
              <input
                id="project-image"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  setFormData((prev) => ({ ...prev, image: file }));
                }}
                className="block w-full text-sm text-[#424242] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#05B9BA] file:text-white hover:file:opacity-90 cursor-pointer"
              />
              <p className="mt-1 text-xs text-[#7E7E7E]">
                Chọn ảnh dự án từ thiết bị của bạn.
              </p>
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
                {isSubmitting ? "Đang lưu..." : "Thêm dự án"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
