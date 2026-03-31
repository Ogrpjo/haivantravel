import CustomerDataListContent from "@/app/components/customerData/CustomerDataListContent";
import Sidebar from "@/app/components/SideBar";

export default function DataCustomerPage() {
  return (
    <main className="flex">
      <Sidebar />
      <CustomerDataListContent />
    </main>
  );
}
