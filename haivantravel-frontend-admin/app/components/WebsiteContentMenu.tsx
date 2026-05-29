import SidebarPage from "./SidebarPage";

export default function WebsiteContentMenu() {
  return (
    <div className="flex flex-col gap-2">
      <div>
        <span className="font-medium text-[16px] text-[#B0B0B0] px-[20px]">
          Website Content
        </span>
      </div>
      <div className="flex flex-col gap-4">
        <SidebarPage
          src="/pageLogo/productlist.svg"
          title="Home"
          href="/dashboard/website-content/home"
        />
        <SidebarPage
          src="/pageLogo/blog.svg"
          title="Blog"
          href="/dashboard/website-content/blog"
        />
        <SidebarPage
          src="/pageLogo/user.svg"
          title="About"
          href="/dashboard/website-content/about"
        />
        <SidebarPage
          src="/pageLogo/setting.svg"
          title="Tuyển dụng"
          href="/dashboard/website-content/recruitment"
        />
        <SidebarPage
          src="/pageLogo/service.svg"
          title="Gala"
          href="/dashboard/website-content/gala"
        />
        <SidebarPage
          src="/pageLogo/service.svg"
          title="MICE"
          href="/dashboard/website-content/mice"
        />
        <SidebarPage
          src="/pageLogo/service.svg"
          title="Team building"
          href="/dashboard/website-content/teambuilding"
        />
      </div>
    </div>
  );
}
