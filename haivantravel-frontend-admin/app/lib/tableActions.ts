/**
 * Hàm dùng chung cho nút "Chỉnh sửa" và "Xóa" trong bảng dữ liệu.
 * Dùng lại trên nhiều trang (datacustomer, v.v.)
 */

/**
 * Mở hộp xác nhận xóa, nếu đồng ý thì gọi onConfirm.
 * @param message - Câu hỏi xác nhận (mặc định tiếng Việt)
 * @param onConfirm - Hàm gọi khi user bấm OK (thường là gọi API xóa rồi refresh)
 * @returns true nếu user đã xác nhận, false nếu hủy
 */
export function confirmDelete(
  message: string = "Bạn có chắc muốn xóa mục này? Hành động không thể hoàn tác.",
  onConfirm: () => void | Promise<void>
): void {
  if (typeof window === "undefined") return;
  const confirmed = window.confirm(message);
  if (confirmed) {
    void Promise.resolve(onConfirm()).catch(() => {});
  }
}

/**
 * Tạo handler cho nút Chỉnh sửa.
 * Mỗi trang truyền vào hàm mở modal hoặc điều hướng tới trang edit.
 * @param onEdit - Hàm nhận item (ví dụ partner) và mở form chỉnh sửa hoặc navigate
 */
export function createEditHandler<T>(onEdit: (item: T) => void) {
  return (item: T) => onEdit(item);
}

/**
 * Tạo handler cho nút Xóa: xác nhận -> gọi API xóa -> gọi onAfterDelete (ví dụ refresh list).
 * @param getDeleteUrl - Hàm nhận item, trả về URL DELETE (ví dụ `/api/partners/${id}`)
 * @param onAfterDelete - Gọi sau khi xóa thành công (ví dụ refresh danh sách)
 * @param confirmMessage - Câu xác nhận (tùy chọn)
 * @param onError - Gọi khi xóa lỗi (tùy chọn, mặc định alert)
 */
export function createDeleteHandler<T extends { id?: number }>(
  getDeleteUrl: (item: T) => string,
  onAfterDelete: () => void,
  confirmMessage?: string,
  onError?: (error: Error) => void
) {
  return (item: T) => {
    confirmDelete(confirmMessage, async () => {
      try {
        const url = getDeleteUrl(item);
        const res = await fetch(url, { method: "DELETE" });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Không thể xóa.");
        }
        onAfterDelete();
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Không thể xóa.");
        if (onError) onError(error);
        else if (typeof window !== "undefined") window.alert(error.message);
      }
    });
  };
}
