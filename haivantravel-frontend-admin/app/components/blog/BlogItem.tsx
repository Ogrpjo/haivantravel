"use client";

type BlogItemProps = {
  id: string;
  title: string;
  active: boolean;
  createdAt: string;
  onToggle?: (id: string, active: boolean) => void;
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
        checked ? "bg-[#05B9BA]" : "bg-[#E0E0E0]"
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

export default function BlogItem({
  id,
  title,
  active,
  createdAt,
  onToggle,
}: BlogItemProps) {
  return (
    <div className="flex w-full items-center border-b border-[#E0E0E0] hover:bg-[#FAFAFA]">
      <div className="flex-1 min-w-0 py-3 px-4 border-r border-[#E0E0E0] font-medium">
        {title}
      </div>
      <div className="w-32 shrink-0 py-3 px-4 border-r border-[#E0E0E0]">
        <Toggle checked={active} onChange={() => onToggle?.(id, !active)} />
      </div>
      <div className="w-32 shrink-0 py-3 px-4 border-r border-[#E0E0E0] text-[#7E7E7E]">
        {createdAt}
      </div>
    </div>
  );
}
