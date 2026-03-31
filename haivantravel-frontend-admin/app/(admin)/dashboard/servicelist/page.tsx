import ServiceListContent from "@/app/components/serviceList/ServiceListContent";
import Sidebar from "@/app/components/SideBar";

export default function ServiceListPage() {
  return (
    <main className="flex">
      <Sidebar />
      <ServiceListContent />
    </main>
  );
}
