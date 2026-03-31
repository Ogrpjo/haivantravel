import ProductListContent from "@/app/components/projectManager/ProductListContent";
import Sidebar from "@/app/components/SideBar";

export default function ProductList() {
  return (
    <main className="flex">
      <Sidebar />
      <ProductListContent />
    </main>
  );
}
