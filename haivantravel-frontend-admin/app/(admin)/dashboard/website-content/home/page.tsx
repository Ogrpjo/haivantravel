import Sidebar from "@/app/components/SideBar";
import HomeContent from "@/app/components/websiteContent/HomeContent";

export default function WebsiteContentHomePage() {
  return (
    <main className="flex">
      <Sidebar />
      <HomeContent />
    </main>
  );
}
