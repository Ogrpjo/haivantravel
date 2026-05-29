"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import Sidebar from "@/app/components/SideBar";
import { getApiBaseUrl } from "@/app/lib/apiBaseUrl";

type BriefContact = {
  id: number;
  full_name: string;
  company_name: string;
  phone: string;
  email: string;
  event_type: string;
  attendee_scale: string;
  budget: string;
  expected_time: string;
  requirements: string;
  created_at: string;
};

type BriefContactResponse = {
  message: string;
  data: BriefContact[];
};

const REQUIREMENTS_PREVIEW_LIMIT = 120;

export default function ContactFormPage() {
  const [briefContacts, setBriefContacts] = useState<BriefContact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const apiBaseUrl = getApiBaseUrl();
  const ITEMS_PER_PAGE = 15;

  const fetchAllData = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await fetch(`${apiBaseUrl}/brief-contact`, { method: "GET" });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Không thể tải danh sách brief_contact.");
      }

      const result = (await response.json()) as BriefContactResponse;

      setBriefContacts(Array.isArray(result.data) ? result.data : []);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Có lỗi xảy ra.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRequest = async (id: number) => {
    const ok = window.confirm("Bạn có chắc muốn xóa request này không?");
    if (!ok) return;

    try {
      setErrorMessage("");
      const response = await fetch(`${apiBaseUrl}/brief-contact/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Không thể xóa request.");
      }

      await fetchAllData();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Có lỗi xảy ra.");
    }
  };

  const handleDeleteAllRequests = async () => {
    const ok = window.confirm("Bạn có chắc muốn xóa toàn bộ request của trang này không?");
    if (!ok) return;

    try {
      setErrorMessage("");
      const response = await fetch(`${apiBaseUrl}/brief-contact`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Không thể xóa toàn bộ request.");
      }

      await fetchAllData();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Có lỗi xảy ra.");
    }
  };

  useEffect(() => {
    void fetchAllData();
  }, []);

  const rows = useMemo<BriefContact[]>(() => {
    return [...briefContacts].sort((a, b) => {
      const timeA = new Date(a.created_at).getTime();
      const timeB = new Date(b.created_at).getTime();
      return timeB - timeA;
    });
  }, [briefContacts]);

  const totalPages = Math.max(1, Math.ceil(rows.length / ITEMS_PER_PAGE));
  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return rows.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [currentPage, rows]);

  useEffect(() => {
    setCurrentPage(1);
    setExpandedRowId(null);
  }, [rows]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const formatCreatedAt = (value: string) => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat("vi-VN", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(date);
  };

  const getRequirementsPreview = (value: string) => {
    if (value.length <= REQUIREMENTS_PREVIEW_LIMIT) return value;
    return `${value.slice(0, REQUIREMENTS_PREVIEW_LIMIT)}...`;
  };

  return (
    <main className="flex">
      <Sidebar />
      <section className="bg-[#121212] text-white flex-8 px-[20px] w-full py-[10px]">
        <div className="py-[10px]">
          <p className="text-xl font-semibold text-white/75">{">"} Đăng kí tư vấn</p>
        </div>

        <div className="flex flex-col w-full bg-[#1a1a1a] h-full rounded-[8px] min-h-0 border border-white/10">
          <div className="flex items-center justify-between gap-3 px-[15px] py-[10px] max-h-[70px] min-h-[60px] border-b border-white/10">
            <p className="font-medium">
              Danh sách đăng kí tư vấn • {rows.length} mục
            </p>
            <div className="flex items-center gap-3">
              <p className="text-sm text-white/60">
                Trang {currentPage}/{totalPages} • Tối đa {ITEMS_PER_PAGE} request/trang
              </p>
              <button
                type="button"
                onClick={() => void handleDeleteAllRequests()}
                disabled={rows.length === 0}
                className="rounded-md border border-rose-400/30 px-3 py-2 text-sm font-medium text-rose-300 transition-colors hover:bg-rose-500/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Xóa toàn bộ
              </button>
            </div>
          </div>

          <div className="w-full flex flex-col flex-1 min-h-0 overflow-auto" style={{ scrollbarGutter: "stable" }}>
            <div className="flex w-full items-center border-b border-white/10 bg-[#222222] text-white/85 shrink-0 sticky top-0 z-10">
              <div className="w-12 shrink-0 py-3 px-4 border-r border-white/10 font-medium text-center">#</div>
              <div className="min-w-[180px] flex-1 basis-0 py-3 px-4 border-r border-white/10 font-medium">Họ tên</div>
              <div className="min-w-[180px] flex-1 basis-0 py-3 px-4 border-r border-white/10 font-medium">Công ty</div>
              <div className="min-w-[150px] flex-1 basis-0 py-3 px-4 border-r border-white/10 font-medium">Số điện thoại</div>
              <div className="min-w-[200px] flex-1 basis-0 py-3 px-4 border-r border-white/10 font-medium">Email</div>
              <div className="min-w-[160px] flex-1 basis-0 py-3 px-4 border-r border-white/10 font-medium">Loại sự kiện</div>
              <div className="min-w-[160px] flex-1 basis-0 py-3 px-4 border-r border-white/10 font-medium">Quy mô</div>
              <div className="min-w-[160px] flex-1 basis-0 py-3 px-4 border-r border-white/10 font-medium">Ngân sách</div>
              <div className="min-w-[170px] flex-1 basis-0 py-3 px-4 border-r border-white/10 font-medium">Thời gian sự kiện</div>
              <div className="min-w-[180px] flex-1 basis-0 py-3 px-4 border-r border-white/10 font-medium">Thời gian request</div>
              <div className="min-w-[260px] flex-1 basis-0 py-3 px-4 font-medium">Yêu cầu</div>
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
                {paginatedRows.map((row, index) => (
                  <Fragment key={row.id}>
                    <div className="flex w-full items-start min-w-0">
                      <div className="w-12 shrink-0 py-3 px-4 border-r border-white/10 text-center text-white/75">
                        {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                      </div>
                      <div className="min-w-[180px] flex-1 basis-0 py-3 px-4 border-r border-white/10 text-white/85 break-words">
                        {row.full_name}
                      </div>
                      <div className="min-w-[180px] flex-1 basis-0 py-3 px-4 border-r border-white/10 text-white/85 break-words">
                        {row.company_name}
                      </div>
                      <div className="min-w-[150px] flex-1 basis-0 py-3 px-4 border-r border-white/10 text-white/85 break-words">
                        {row.phone}
                      </div>
                      <div className="min-w-[200px] flex-1 basis-0 py-3 px-4 border-r border-white/10 text-white/85 break-words">
                        {row.email}
                      </div>
                      <div className="min-w-[160px] flex-1 basis-0 py-3 px-4 border-r border-white/10 text-white/85 break-words">
                        {row.event_type}
                      </div>
                      <div className="min-w-[160px] flex-1 basis-0 py-3 px-4 border-r border-white/10 text-white/85 break-words">
                        {row.attendee_scale}
                      </div>
                      <div className="min-w-[160px] flex-1 basis-0 py-3 px-4 border-r border-white/10 text-white/85 break-words">
                        {row.budget}
                      </div>
                      <div className="min-w-[170px] flex-1 basis-0 py-3 px-4 border-r border-white/10 text-white/85 break-words">
                        {row.expected_time}
                      </div>
                      <div className="min-w-[180px] flex-1 basis-0 py-3 px-4 border-r border-white/10 text-white/85 break-words">
                        {formatCreatedAt(row.created_at)}
                      </div>
                      <div className="min-w-[260px] flex-1 basis-0 py-3 px-4 text-white/85 break-words">
                        <p>{getRequirementsPreview(row.requirements)}</p>
                        {row.requirements.length > REQUIREMENTS_PREVIEW_LIMIT ? (
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedRowId((prev) => (prev === row.id ? null : row.id))
                            }
                            className="mt-2 text-[#8ED6D7] hover:text-[#A8EAEB] text-sm font-medium"
                          >
                            {expandedRowId === row.id ? "View Less" : "View More"}
                          </button>
                        ) : null}
                        <button
                          type="button"
                          onClick={() => void handleDeleteRequest(row.id)}
                          className="mt-3 inline-flex items-center rounded-md border border-rose-400/30 px-3 py-1.5 text-sm font-medium text-rose-300 transition-colors hover:bg-rose-500/10"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                    {expandedRowId === row.id ? (
                      <div className="w-full px-4 py-4 bg-[#161616] border-t border-white/10">
                        <p className="text-sm text-white/70 mb-2">Yêu cầu chi tiết</p>
                        <p className="text-white/90 whitespace-pre-wrap break-words">
                          {row.requirements}
                        </p>
                      </div>
                    ) : null}
                  </Fragment>
                ))}
              </div>
            )}
          </div>

          {rows.length > 0 ? (
            <div className="flex items-center justify-between gap-3 px-[15px] py-[12px] border-t border-white/10">
              <p className="text-sm text-white/60">
                Hiển thị {(currentPage - 1) * ITEMS_PER_PAGE + 1}-
                {Math.min(currentPage * ITEMS_PER_PAGE, rows.length)} trên {rows.length} request
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="rounded-md border border-white/10 px-3 py-2 text-sm text-white/80 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-white/5"
                >
                  Trang trước
                </button>
                <div className="flex items-center gap-1 text-sm text-white/70">
                  {Array.from({ length: totalPages }, (_, pageIndex) => pageIndex + 1).map(
                    (page) => (
                      <button
                        key={page}
                        type="button"
                        onClick={() => setCurrentPage(page)}
                        className={`min-w-9 rounded-md border px-3 py-2 transition-colors ${
                          page === currentPage
                            ? "border-[#8ED6D7] bg-[#8ED6D7]/15 text-[#A8EAEB]"
                            : "border-white/10 text-white/75 hover:bg-white/5"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded-md border border-white/10 px-3 py-2 text-sm text-white/80 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-white/5"
                >
                  Trang sau
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
