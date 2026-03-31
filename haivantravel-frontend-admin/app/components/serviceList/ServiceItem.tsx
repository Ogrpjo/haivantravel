"use client";

type ServiceItemProps = {
  id: string;
  name: string;
  description: string;
  iconPath: string;
  active: boolean;
  createdAt: string;
  onToggle?: () => void;
  onEdit?: (id: string) => void;
  onDelete?: () => void;
};

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-0 transition-colors focus:outline-none focus:ring-2 focus:ring-[#05B9BA] focus:ring-offset-2 ${
        checked ? "bg-[#05B9BA]" : "bg-white/10"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition-transform ${
          checked ? "translate-x-5" : "translate-x-0.5"
        } mt-0.5`}
      />
    </button>
  );
}

export default function ServiceItem({
  id,
  name,
  description,
  iconPath,
  active,
  createdAt,
  onToggle,
  onEdit,
  onDelete,
}: ServiceItemProps) {
  const truncatedDescription =
    description.length > 40 ? `${description.slice(0, 40)}...` : description;

  const iconFilename = (iconPath || "").trim().split(/[/\\]/).pop() || null;

  return (
    <div className="flex w-full items-center border-b border-white/10 hover:bg-[#111111]">
      <div className="flex-1 min-w-0 py-3 px-4 border-r border-white/10 font-medium">
        {name}
      </div>
      <div className="w-40 shrink-0 py-3 px-4 border-r border-white/10 text-[#424242]">
        <p className="truncate" title={iconFilename ?? undefined}>
          {iconFilename ?? "—"}
        </p>
      </div>
      <div className="w-40 shrink-0 py-3 px-4 border-r border-white/10 text-[#424242] truncate" title={description}>
        {truncatedDescription}
      </div>
      <div className="w-32 shrink-0 py-3 px-4 border-r border-white/10">
        <Toggle
          checked={active}
          onChange={() => onToggle?.()}
        />
      </div>
      <div className="w-32 shrink-0 py-3 px-4 border-r border-white/10 text-[#7E7E7E]">
        {createdAt}
      </div>
      <div className="w-28 shrink-0 py-3 px-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => onEdit?.(id)}
          className="text-[#424242] hover:text-[#05B9BA] transition-colors"
          aria-label="Sửa"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            <path d="m15 5 4 4" />
          </svg>
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="text-[#424242] hover:text-red-500 transition-colors"
          aria-label="Xóa"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            <line x1="10" x2="10" y1="11" y2="17" />
            <line x1="14" x2="14" y1="11" y2="17" />
          </svg>
        </button>
      </div>
    </div>
  );
}
