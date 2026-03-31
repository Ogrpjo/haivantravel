import Image from "next/image";

type ProjectItemProps = {
  id: number;
  link: string;
  src: string;
  createdAt?: string;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

function formatDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("vi-VN");
}

export default function ProjectItem({
  id,
  src,
  link,
  createdAt,
  onEdit,
  onDelete,
}: ProjectItemProps) {
  return (
    <div className="flex w-full items-center border-b border-white/10 hover:bg-[#111111]">
      <div className="flex-1 min-w-0 py-3 px-4 border-r border-l border-white/10 truncate">
        {link || "—"}
      </div>
      <div className="flex-1 min-w-0 py-2 px-4 border-r border-white/10">
        {src ? (
          <Image
            src={src}
            alt=""
            width={36}
            height={36}
            className="h-9 w-9 rounded object-cover"
          />
        ) : (
          "—"
        )}
      </div>
      <div className="w-32 shrink-0 py-3 px-4 border-r border-white/10 text-[#7E7E7E]">
        {formatDate(createdAt)}
      </div>
      <div className="w-28 shrink-0 px-4 flex items-center gap-2">
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-md border border-white/10 text-[#424242] hover:border-[#05B9BA]/40 hover:bg-[#05B9BA]/10"
          aria-label="Chỉnh sửa"
          onClick={() => onEdit?.(id)}
        >
          <Image src="/admin/edit.svg" alt="Chỉnh sửa" width={16} height={16} />
        </button>
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-md border border-white/10 text-[#D32F2F] hover:border-[#D32F2F]/40 hover:bg-[#D32F2F]/10"
          aria-label="Xóa"
          onClick={() => onDelete?.(id)}
        >
          <Image src="/admin/delete.svg" alt="Xóa" width={16} height={16} />
        </button>
      </div>
    </div>
  );
}