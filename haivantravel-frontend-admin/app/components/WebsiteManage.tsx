import SidebarPage from "./SidebarPage";

export default function WebsiteManage() {
  return (
    <div className="flex flex-col gap-2">
      <div>
        <span className="font-medium text-[16px] text-[#B0B0B0] px-[20px]">
          Quản lý website
        </span>
      </div>
      <div className="flex flex-col gap-4">
        <SidebarPage
          src="/pageLogo/productlist.svg"
          title="Quản lí dự án"
          href="/dashboard/projectlist"
        />
        <SidebarPage
          src="/pageLogo/service.svg"
          title="Dịch vụ"
          href="/dashboard/servicelist"
        />
        <SidebarPage
          src="/pageLogo/blog.svg"
          title="Blog"
          href="/dashboard/blog"
        />
        <SidebarPage
          src="/pageLogo/social.svg"
          title="Social Media"
          href="/dashboard/socialmanager"
        />
        <SidebarPage
          src="/pageLogo/datacustomer.svg"
          title="Dữ liệu khách hàng"
          href="/dashboard/datacustomer"
        />
        <SidebarPage
          src="/pageLogo/datacustomer.svg"
          title="Đăng kí tư vấn"
          href="/dashboard/contactform"
        />
      </div>
    </div>
  );
}
