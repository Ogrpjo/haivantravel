import SidebarPage from "./SidebarPage";

export default function UserSystem() {
  return (
    <div className="flex flex-col gap-2">
      <div>
        <span className="font-medium text-[16px] text-[#B0B0B0] px-[20px]">
          Người dùng hệ thống
        </span>
      </div>
      <div className="flex flex-col gap-4">
        <SidebarPage src="/pageLogo/user.svg" title="Người dùng" href="/dashboard/user"/>
        <SidebarPage src="/pageLogo/service.svg" title="Cài đặt" href="/dashboard/settings"/>
      </div>
    </div>
  );
}
