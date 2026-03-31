import { useEffect } from "react";

type AddBlogModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AddBlogModal({ isOpen, onClose }: AddBlogModalProps) {
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      style={{ animation: "modal-overlay-in 0.2s ease-out forwards" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-blog-title"
    >
      <div
        className="relative w-full max-w-md bg-white rounded-xl shadow-[0_25px_50px_-12px_rgb(0_0_0_/0.15)]"
        style={{ animation: "modal-content-in 0.2s ease-out forwards" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#E0E0E0]">
          <h2
            id="add-blog-title"
            className="text-xl font-semibold text-[#424242]"
          >
            Tạo bài viết mới
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#7E7E7E] hover:bg-[#E0E0E0] hover:text-[#424242] transition-colors"
            aria-label="Đóng"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="px-6 py-6">
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              onClose();
            }}
          >
            <div>
              <label
                htmlFor="blog-title"
                className="block text-sm font-medium text-[#424242] mb-1.5"
              >
                Tên bài viết
              </label>
              <input
                id="blog-title"
                type="text"
                placeholder="Nhập tiêu đề bài viết"
                className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-[#424242] placeholder:text-[#9E9E9E] focus:outline-none focus:ring-2 focus:ring-[#05B9BA]/50 focus:border-[#05B9BA]"
              />
            </div>
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
                className="px-4 py-2 rounded-lg bg-[#05B9BA] text-white font-medium hover:opacity-90 transition-opacity"
              >
                Tạo bài viết
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
