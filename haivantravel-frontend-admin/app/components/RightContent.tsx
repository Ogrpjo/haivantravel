import Image from "next/image";
import UserAvatarDropdown from "./UserAvatarDropdown";

export default function RightContent() {
  return (
    <div className="flex-8 flex flex-col h-[100vh] bg-[#121212] text-white">
      <div className="flex items-center justify-end px-6 py-[1.65vhs] bg-[#121212] border-white/10">
        <UserAvatarDropdown />
      </div>
      <div className="flex flex-1 items-center justify-center">
        <p className="text-xl font-bold mx-[20px] text-white/80">
          HAIVAN EVENT'S ADMIN DASHBOARD
        </p>
      </div>
    </div>
  );
}
