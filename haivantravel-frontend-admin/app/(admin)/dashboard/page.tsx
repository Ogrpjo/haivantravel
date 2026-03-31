import Sidebar from "@/app/components/SideBar"
import RightContent from "@/app/components/RightContent"

export default function DashBoard() {
    return (
        <div className="flex min-h-screen bg-[#121212] text-white">
           <Sidebar /> 
           <RightContent />
        </div>
    )
}