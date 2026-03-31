import Profile from "./Profile"
import SidebarItem from "./SidebarItem"
import UserSystem from "./UserSystem"
import WebsiteManage from "./WebsiteManage"

export default function Sidebar() {
    return (
        <div className="flex-2 min-h-screen bg-[#121212] text-white relative border-r border-white/10">
            <Profile /> 
            <SidebarItem />
        </div>
    )
}