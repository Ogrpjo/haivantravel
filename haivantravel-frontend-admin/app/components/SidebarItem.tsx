import Profile from "./Profile";
import WebsiteManage from "./WebsiteManage";
import WebsiteContentMenu from "./WebsiteContentMenu";
import UserSystem from "./UserSystem";

export default function SidebarItem() {
  return (
    <div className="flex flex-col gap-[10px] pt-[10px]">
      <WebsiteManage />
      <WebsiteContentMenu />
    </div>
  );
}
