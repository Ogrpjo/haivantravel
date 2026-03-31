import Sidebar from "@/app/components/SideBar";
import SocialMediaListContent from "@/app/components/socialMedia/SocialMediaListContent";

export default function SocialManagerPage() {
  return (
    <main className="flex">
      <Sidebar />
      <SocialMediaListContent />
    </main>
  );
}
