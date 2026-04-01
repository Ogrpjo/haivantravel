"use client";

import { useEffect, useMemo, useState } from "react";
import Sidebar from "@/app/components/SideBar";
import { getApiBaseUrl } from "@/app/lib/apiBaseUrl";

type ContactData = {
  id: number;
  full_name: string;
  phone: string;
  email: string;
  location: string | null;
  description: string | null;
  created_at: string;
};

type RequestPhone = {
  id: number;
  phone: string;
  created_at: string;
};

type ContactResponse = {
  message: string;
  data: ContactData[];
};

type RequestPhoneResponse = {
  message: string;
  data: RequestPhone[];
};

type CombinedRow = {
  key: string;
  full_name: string | null;
  phone: string;
  email: string | null;
  location: string | null;
  description: string | null;
  created_at: string;
};

export default function ContactFormPage() {
  const [contacts, setContacts] = useState<ContactData[]>([]);
  const [requests, setRequests] = useState<RequestPhone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const apiBaseUrl = getApiBaseUrl();

  const fetchAllData = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const [contactResponse, requestResponse] = await Promise.all([
        fetch(`${apiBaseUrl}/contact-data`, { method: "GET" }),
        fetch(`${apiBaseUrl}/request-phone`, { method: "GET" }),
      ]);

      if (!contactResponse.ok) {
        const errorText = await contactResponse.text();
        throw new Error(errorText || "Không thể tải danh sách contact_data.");
      }

      if (!requestResponse.ok) {
        const errorText = await requestResponse.text();
        throw new Error(errorText || "Không thể tải danh sách request_phone.");
      }

      const contactResult = (await contactResponse.json()) as ContactResponse;
      const requestResult = (await requestResponse.json()) as RequestPhoneResponse;

      setContacts(Array.isArray(contactResult.data) ? contactResult.data : []);
      setRequests(Array.isArray(requestResult.data) ? requestResult.data : []);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Có lỗi xảy ra.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchAllData();
  }, []);

  const rows = useMemo<CombinedRow[]>(() => {
    const contactRows: CombinedRow[] = contacts.map((item) => ({
      key: `contact-${item.id}`,
      full_name: item.full_name,
      phone: item.phone,
      email: item.email,
      location: item.location,
      description: item.description,
      created_at: item.created_at,
    }));

    const requestRows: CombinedRow[] = requests.map((item) => ({
      key: `request-${item.id}`,
      full_name: null,
      phone: item.phone,
      email: null,
      location: null,
      description: null,
      created_at: item.created_at,
    }));

    return [...contactRows, ...requestRows].sort((a, b) => {
      const timeA = new Date(a.created_at).getTime();
      const timeB = new Date(b.created_at).getTime();
      return timeB - timeA;
    });
  }, [contacts, requests]);

  return (
    <main className="flex">
      <Sidebar />
      <section className="bg-[#121212] text-white flex-8 px-[20px] w-full py-[10px]">
        <div className="py-[10px]">
          <p className="text-xl font-semibold text-white/75">{">"} Đăng kí tư vấn</p>
        </div>

        <div className="flex flex-col w-full bg-[#1a1a1a] h-full rounded-[8px] min-h-0 border border-white/10">
          <div className="flex items-center justify-between px-[15px] py-[10px] max-h-[70px] min-h-[60px] border-b border-white/10">
            <p className="font-medium">Danh sách đăng kí tư vấn • {rows.length} mục</p>
          </div>

          <div className="w-full flex flex-col flex-1 min-h-0 overflow-auto" style={{ scrollbarGutter: "stable" }}>
            <div className="flex w-full items-center border-b border-white/10 bg-[#222222] text-white/85 shrink-0 sticky top-0 z-10">
              <div className="w-12 shrink-0 py-3 px-4 border-r border-white/10 font-medium text-center">#</div>
              <div className="min-w-[180px] flex-1 basis-0 py-3 px-4 border-r border-white/10 font-medium">Họ tên</div>
              <div className="min-w-[140px] flex-1 basis-0 py-3 px-4 border-r border-white/10 font-medium">Số điện thoại</div>
              <div className="min-w-[180px] flex-1 basis-0 py-3 px-4 border-r border-white/10 font-medium">Email</div>
              <div className="min-w-[160px] flex-1 basis-0 py-3 px-4 border-r border-white/10 font-medium">Địa chỉ</div>
              <div className="min-w-[260px] flex-1 basis-0 py-3 px-4 font-medium">Nội dung tư vấn</div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-white/60">Đang tải dữ liệu...</p>
              </div>
            ) : errorMessage ? (
              <div className="flex items-center justify-center h-full px-4">
                <p className="text-red-500 break-all">{errorMessage}</p>
              </div>
            ) : rows.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-white/60">Chưa có dữ liệu đăng kí tư vấn</p>
              </div>
            ) : (
              <div className="divide-y divide-white/10">
                {rows.map((row, index) => (
                  <div key={row.key} className="flex w-full items-start min-w-0">
                    <div className="w-12 shrink-0 py-3 px-4 border-r border-white/10 text-center text-white/75">
                      {index + 1}
                    </div>
                    <div className="min-w-[180px] flex-1 basis-0 py-3 px-4 border-r border-white/10 text-white/85 break-words">
                      {row.full_name || "-"}
                    </div>
                    <div className="min-w-[140px] flex-1 basis-0 py-3 px-4 border-r border-white/10 text-white/85 break-words">
                      {row.phone}
                    </div>
                    <div className="min-w-[180px] flex-1 basis-0 py-3 px-4 border-r border-white/10 text-white/85 break-words">
                      {row.email || "-"}
                    </div>
                    <div className="min-w-[160px] flex-1 basis-0 py-3 px-4 border-r border-white/10 text-white/85 break-words">
                      {row.location || "-"}
                    </div>
                    <div className="min-w-[260px] flex-1 basis-0 py-3 px-4 text-white/85 break-words">
                      {row.description || "-"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
