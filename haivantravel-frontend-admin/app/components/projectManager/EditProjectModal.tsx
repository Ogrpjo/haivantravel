"use client";

import { useEffect, useMemo, useState } from "react";
import { getApiBaseUrl } from "@/app/lib/apiBaseUrl";
import {
  PROJECT_TYPE_OPTIONS,
  linkUrlFromTitle,
} from "./projectFormShared";

export type ProjectForEdit = {
  id: number;
  title: string;
  short_description: string | null;
  project_type: string | null;
  duration_days: number | null;
  guest_count: number | null;
  artist_count: number | null;
  link_url: string;
  image_url: string;
  createdAt?: string;
};

type EditProjectModalProps = {
  isOpen: boolean;
  project: ProjectForEdit | null;
  onClose: () => void;
  onSuccess: () => void;
};

type ProjectFormData = {
  title: string;
  short_description: string;
  project_type: string;
  duration_days: string;
  guest_count: string;
  artist_count: string;
  project_link: string;
  image: File | null;
};

function numToInput(n: number | null | undefined): string {
  if (n === null || n === undefined) return "";
  return String(n);
}

function resolveProjectImageUrl(
  imageUrl: string | undefined,
  apiBaseUrl: string,
): string {
  if (!imageUrl) return "";
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }
  const normalized = imageUrl.startsWith("/") ? imageUrl.slice(1) : imageUrl;
  return `${apiBaseUrl}/${normalized}`;
}

export default function EditProjectModal({
  isOpen,
  project,
  onClose,
  onSuccess,
}: EditProjectModalProps) {
  const [formData, setFormData] = useState<ProjectFormData>({
    title: "",
    short_description: "",
    project_type: "",
    duration_days: "",
    guest_count: "",
    artist_count: "",
    project_link: "",
    image: null,
  });
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectLinkManual, setProjectLinkManual] = useState(false);
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
    if (!project || !isOpen) return;
    const title = project.title?.trim() ?? "";
    const autoLink = linkUrlFromTitle(title);
    const currentLink = (project.link_url ?? "").trim();
    setProjectLinkManual(
      currentLink !== "" && autoLink !== currentLink,
    );
    setFormData({
      title,
      short_description: project.short_description?.trim() ?? "",
      project_type: project.project_type?.trim() ?? "",
      duration_days: numToInput(project.duration_days),
      guest_count: numToInput(project.guest_count),
      artist_count: numToInput(project.artist_count),
      project_link: currentLink || autoLink,
      image: null,
    });
    setErrorMessage("");
    setImagePreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
  }, [project, isOpen]);

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    };
  }, [imagePreviewUrl]);

  const existingImageSrc = useMemo(() => {
    if (!project) return "";
    return resolveProjectImageUrl(project.image_url, apiBaseUrl);
  }, [project, apiBaseUrl]);

  const coverSrc = imagePreviewUrl || existingImageSrc;

  const canSubmit = useMemo(() => {
    const hasCover = !!formData.image || !!existingImageSrc;
    return (
      formData.title.trim().length > 0 &&
      formData.project_type.trim().length > 0 &&
      hasCover
    );
  }, [formData, existingImageSrc]);

  if (!isOpen) return null;

  const handleImageChange = (file: File | null) => {
    setImagePreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return file ? URL.createObjectURL(file) : null;
    });
    setFormData((prev) => ({ ...prev, image: file }));
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    if (!project) return;

    if (!formData.title.trim()) {
      setErrorMessage("Vui lòng nhập tên dự án.");
      return;
    }
    if (!formData.project_type.trim()) {
      setErrorMessage("Vui lòng chọn loại dự án.");
      return;
    }
    if (!formData.image && !existingImageSrc) {
      setErrorMessage("Vui lòng chọn ảnh đại diện dự án.");
      return;
    }

    const linkTrimmed =
      formData.project_link.trim() ||
      linkUrlFromTitle(formData.title.trim());
    if (linkTrimmed) {
      try {
        const parsed = new URL(linkTrimmed);
        if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
          throw new Error("invalid protocol");
        }
      } catch {
        setErrorMessage("Liên kết dự án (project_link) chưa đúng định dạng URL.");
        return;
      }
    }

    try {
      setIsSubmitting(true);
      const payload = new FormData();
      payload.append("title", formData.title.trim());
      payload.append("short_description", formData.short_description.trim());
      payload.append("project_type", formData.project_type.trim());
      if (formData.duration_days.trim() !== "") {
        payload.append("duration_days", formData.duration_days.trim());
      }
      if (formData.guest_count.trim() !== "") {
        payload.append("guest_count", formData.guest_count.trim());
      }
      if (formData.artist_count.trim() !== "") {
        payload.append("artist_count", formData.artist_count.trim());
      }
      if (linkTrimmed) {
        payload.append("link_url", linkTrimmed);
      }
      if (formData.image) {
        payload.append("image", formData.image);
      }

      const response = await fetch(`${apiBaseUrl}/projects/${project.id}`, {
        method: "PATCH",
        body: payload,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Không thể cập nhật dự án.");
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto"
      style={{ animation: "modal-overlay-in 0.2s ease-out forwards" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-project-title"
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-xl shadow-[0_25px_50px_-12px_rgb(0_0_0_/0.15)] my-8"
        style={{ animation: "modal-content-in 0.2s ease-out forwards" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#E0E0E0]">
          <div className="flex items-center gap-2">
            <span className="text-[#05B9BA]" aria-hidden>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </span>
            <h2 id="edit-project-title" className="text-xl font-semibold text-[#424242]">
              Chỉnh sửa dự án
            </h2>
          </div>
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

        <form className="px-6 py-6 space-y-5" onSubmit={handleSubmit}>
          <div>
            <input
              id="edit-project-cover-file"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageChange(e.target.files?.[0] ?? null)}
            />
            <button
              type="button"
              onClick={() => document.getElementById("edit-project-cover-file")?.click()}
              className="relative w-full min-h-[160px] rounded-xl border-2 border-dashed border-[#E0E0E0] bg-[#F5F5F5] flex flex-col items-center justify-center gap-2 text-[#7E7E7E] hover:border-[#05B9BA]/50 transition-colors overflow-hidden"
            >
              {coverSrc ? (
                <img
                  src={coverSrc}
                  alt="Ảnh đại diện dự án"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <>
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="text-sm font-medium">Ảnh đại diện dự án</span>
                </>
              )}
            </button>
            <p className="mt-1.5 text-xs text-[#7E7E7E]">
              Chọn ảnh mới để thay thế; để trống nếu giữ ảnh hiện tại.
            </p>
          </div>

          <div>
            <label htmlFor="edit-project-title" className="block text-sm font-medium text-[#424242] mb-1.5">
              Tên dự án <span className="text-red-500">*</span>
            </label>
            <input
              id="edit-project-title"
              type="text"
              placeholder="Nhập tên dự án"
              value={formData.title}
              onChange={(e) => {
                const nextTitle = e.target.value;
                setFormData((prev) => {
                  const next: ProjectFormData = { ...prev, title: nextTitle };
                  if (!projectLinkManual) {
                    next.project_link = linkUrlFromTitle(nextTitle);
                  }
                  return next;
                });
              }}
              className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-[#424242] placeholder:text-[#9E9E9E] focus:outline-none focus:ring-2 focus:ring-[#05B9BA]/50 focus:border-[#05B9BA]"
            />
          </div>

          <div>
            <label htmlFor="edit-project-desc" className="block text-sm font-medium text-[#424242] mb-1.5">
              Mô tả ngắn dự án
            </label>
            <textarea
              id="edit-project-desc"
              rows={3}
              placeholder="Nhập mô tả dự án"
              value={formData.short_description}
              onChange={(e) => setFormData((p) => ({ ...p, short_description: e.target.value }))}
              className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-[#424242] placeholder:text-[#9E9E9E] focus:outline-none focus:ring-2 focus:ring-[#05B9BA]/50 focus:border-[#05B9BA] resize-none"
            />
          </div>

          <div>
            <label htmlFor="edit-project-type" className="block text-sm font-medium text-[#424242] mb-1.5">
              Loại dự án <span className="text-red-500">*</span>
            </label>
            <select
              id="edit-project-type"
              value={formData.project_type}
              onChange={(e) => setFormData((p) => ({ ...p, project_type: e.target.value }))}
              className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-[#424242] bg-white focus:outline-none focus:ring-2 focus:ring-[#05B9BA]/50 focus:border-[#05B9BA]"
            >
              <option value="">Chọn loại dự án</option>
              {PROJECT_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="edit-duration-days" className="block text-sm font-medium text-[#424242] mb-1.5">
                Số ngày diễn ra
              </label>
              <input
                id="edit-duration-days"
                type="number"
                min={0}
                placeholder="Number"
                value={formData.duration_days}
                onChange={(e) => setFormData((p) => ({ ...p, duration_days: e.target.value }))}
                className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-[#424242] placeholder:text-[#9E9E9E] focus:outline-none focus:ring-2 focus:ring-[#05B9BA]/50 focus:border-[#05B9BA]"
              />
            </div>
            <div>
              <label htmlFor="edit-guest-count" className="block text-sm font-medium text-[#424242] mb-1.5">
                Số khách tham dự
              </label>
              <input
                id="edit-guest-count"
                type="number"
                min={0}
                placeholder="Number"
                value={formData.guest_count}
                onChange={(e) => setFormData((p) => ({ ...p, guest_count: e.target.value }))}
                className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-[#424242] placeholder:text-[#9E9E9E] focus:outline-none focus:ring-2 focus:ring-[#05B9BA]/50 focus:border-[#05B9BA]"
              />
            </div>
            <div>
              <label htmlFor="edit-artist-count" className="block text-sm font-medium text-[#424242] mb-1.5">
                Số nghệ sĩ
              </label>
              <input
                id="edit-artist-count"
                type="number"
                min={0}
                placeholder="Number"
                value={formData.artist_count}
                onChange={(e) => setFormData((p) => ({ ...p, artist_count: e.target.value }))}
                className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-[#424242] placeholder:text-[#9E9E9E] focus:outline-none focus:ring-2 focus:ring-[#05B9BA]/50 focus:border-[#05B9BA]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="edit-project_link" className="block text-sm font-medium text-[#424242] mb-1.5">
              Liên kết dự án <span className="text-[#9E9E9E] font-normal">(project_link)</span>
            </label>
            <input
              id="edit-project_link"
              name="edit-project_link"
              type="url"
              placeholder="https://..."
              value={formData.project_link}
              onChange={(e) => {
                setProjectLinkManual(true);
                setFormData((p) => ({ ...p, project_link: e.target.value }));
              }}
              className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-[#424242] placeholder:text-[#9E9E9E] focus:outline-none focus:ring-2 focus:ring-[#05B9BA]/50 focus:border-[#05B9BA]"
            />
            <p className="mt-1 text-xs text-[#7E7E7E]">
              Tự động: site user + <code className="text-[#424242]">/case-study/</code> + slug (vd:{" "}
              <code className="text-[#424242]">localhost:2032/case-study/du-an-1</code>). Có thể chỉnh tay.
            </p>
          </div>

          {errorMessage ? (
            <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {errorMessage}
            </div>
          ) : null}

          <div className="pt-2 flex justify-between items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-[#424242] hover:bg-[#FAFAFA] transition-colors"
            >
              Huỷ
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !canSubmit}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#05B9BA] text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
