import Profile from "./Profile";
import SidebarItem from "./SidebarItem";

export default function Sidebar() {
  return (
    <aside className="w-[240px] shrink-0 min-h-screen bg-[#121212] text-white relative border-r border-white/10 overflow-y-auto">
      <Profile />
      <SidebarItem />
    </aside>
  );
}
