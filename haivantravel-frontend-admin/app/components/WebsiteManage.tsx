"use client";

import { useState } from "react";
import SidebarPage from "./SidebarPage";

export default function WebsiteManage() {
  const [isProjectConfigOpen, setIsProjectConfigOpen] = useState(true);

  return (
    <div className="flex flex-col gap-2">
      <div>
        <span className="font-medium text-[14px] text-[#B0B0B0] px-[20px]">
          Quản lý website
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={() => setIsProjectConfigOpen((prev) => !prev)}
          className="flex w-full items-center gap-2 px-[20px] py-[6px] text-left text-white/80 hover:text-white transition-colors"
        >
          <img src="/pageLogo/productlist.svg" alt="logo_page" className="w-4 h-4" />
          <span className="text-[14px] font-medium">Cấu hình dự án</span>
        </button>

        {isProjectConfigOpen ? (
          <div className="ml-[24px] flex flex-col gap-1 border-l border-white/15 pl-[10px]">
            <a
              href="/dashboard/projectlist"
              className="rounded-[8px] px-[12px] py-[6px] text-[13px] text-white/75 hover:text-white hover:bg-white/8 transition-colors"
            >
              Danh sách dự án
            </a>
            <a
              href="/dashboard/project-types"
              className="rounded-[8px] px-[12px] py-[6px] text-[13px] text-white/55 hover:text-white hover:bg-white/8 transition-colors"
            >
              Loại dự án
            </a>
          </div>
        ) : null}

        <SidebarPage src="/pageLogo/blog.svg" title="Blog" href="/dashboard/blog" />
        <SidebarPage src="/pageLogo/social.svg" title="Social Media" href="/dashboard/socialmanager" />
        <SidebarPage src="/pageLogo/datacustomer.svg" title="Dữ liệu khách hàng" href="/dashboard/datacustomer" />
        <SidebarPage src="/pageLogo/datacustomer.svg" title="Đăng kí tư vấn" href="/dashboard/contactform" />
        <SidebarPage src="/pageLogo/service.svg" title="Email templates" href="/dashboard/email-templates" />
      </div>
    </div>
  );
}
