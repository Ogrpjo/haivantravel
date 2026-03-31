"use client";

import { useRouter } from "next/navigation";

export default function UserAvatarDropdown() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      router.push("/login");
    }
  };

  return (
    <div className="group relative inline-block text-left">
      <button
        type="button"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 text-sm font-semibold text-white shadow"
      >
        logout
      </button>
      <div className="absolute right-0 top-full z-50 mt-1 w-32 origin-top-right rounded-md bg-[#1f1f1f] py-1 opacity-0 shadow-lg ring-1 ring-white/10 invisible pointer-events-none transition-opacity duration-150 group-hover:visible group-hover:opacity-100 group-hover:pointer-events-auto">
        <button
          onClick={handleLogout}
          className="block w-full px-3 py-2 text-left text-sm text-white/85 hover:bg-white/10"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

