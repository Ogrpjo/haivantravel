 "use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Profile() {
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
    <div className="relative flex items-center gap-1 px-[20px] py-[1.65vh] border-b border-white/10 group">
      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-300 relative">
        <Image src="/aaaaaa.jpg" alt="avt" fill className="object-cover" />
      </div>
      <p className="font-medium">Admin</p>
      <div className="absolute left-4 right-4 top-full -mt-2 hidden z-50 group-hover:block">
        <div className="rounded-md bg-[#1f1f1f] shadow-lg ring-1 ring-white/10 py-1 px-3">
          <button
            onClick={handleLogout}
            className="text-sm text-white/80 hover:text-white whitespace-nowrap"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}