"use client";

import Sidebar from "@/app/components/SideBar";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getApiBaseUrl } from "@/app/lib/apiBaseUrl";
import {
  PROJECT_TYPE_OPTIONS,
  linkUrlFromTitle,
} from "@/app/components/projectManager/projectFormShared";
import type { ProjectData } from "@grapesjs/studio-sdk";

type ProjectDetailApi = {
  id: number;
  title: string;
  short_description: string | null;
  seo_title: string | null;
  seo_keywords: string | null;
  seo_description: string | null;
  project_type: string | null;
  duration_days: number | null;
  guest_count: number | null;
  artist_count: number | null;
  link_url: string;
  content: string | null;
};

type ProjectFormData = {
  title: string;
  short_description: string;
  seo_title: string;
  seo_keywords: string;
  seo_description: string;
  project_type: string;
  duration_days: string;
  guest_count: string;
  artist_count: string;
  project_link: string;
  content: string;
};

function numToInput(n: number | null | undefined): string {
  if (n === null || n === undefined) return "";
  return String(n);
}

const defaultProject: ProjectData = {
  pages: [{ name: "Trang", component: "<h1>Nội dung chi tiết dự án</h1><p></p>" }],
};

function safeParseProjectData(rawContent: string): ProjectData {
  const trimmed = rawContent.trim();
  if (!trimmed) return defaultProject;
  try {
    return JSON.parse(trimmed) as ProjectData;
  } catch {
    // Backward compatibility for legacy HTML content.
    return { pages: [{ name: "Trang", component: trimmed }] };
  }
}

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const apiBaseUrl = getApiBaseUrl();
  const projectId = useMemo(() => Number(params?.id), [params?.id]);

  const [formData, setFormData] = useState<ProjectFormData>({
    title: "",
    short_description: "",
    seo_title: "",
    seo_keywords: "",
    seo_description: "",
    project_type: "",
    duration_days: "",
    guest_count: "",
    artist_count: "",
    project_link: "",
    content: "",
  });
  const [projectLinkManual, setProjectLinkManual] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [initialProjectData, setInitialProjectData] =
    useState<ProjectData>(defaultProject);

  useEffect(() => {
    if (!projectId || Number.isNaN(projectId)) {
      setIsLoading(false);
      setMessage("ID dự án không hợp lệ.");
      return;
    }

    let cancelled = false;
    const fetchProject = async () => {
      try {
        setIsLoading(true);
        setMessage(null);
        const res = await fetch(`${apiBaseUrl}/projects/${projectId}`, {
          cache: "no-store",
        });
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText || "Không thể tải dự án.");
        }
        const data = (await res.json()) as ProjectDetailApi;
        if (!cancelled) {
          const title = data.title?.trim() || "";
          const autoLink = linkUrlFromTitle(title);
          const currentLink = (data.link_url ?? "").trim();
          setProjectLinkManual(currentLink !== "" && autoLink !== currentLink);
          setFormData({
            title,
            short_description: data.short_description?.trim() ?? "",
            seo_title: data.seo_title?.trim() ?? "",
            seo_keywords: data.seo_keywords?.trim() ?? "",
            seo_description: data.seo_description?.trim() ?? "",
            project_type: data.project_type?.trim() ?? "",
            duration_days: numToInput(data.duration_days),
            guest_count: numToInput(data.guest_count),
            artist_count: numToInput(data.artist_count),
            project_link: currentLink || autoLink,
            content: data.content ?? "",
          });
          const nextProjectData = safeParseProjectData(data.content ?? "");
          setInitialProjectData(nextProjectData);
        }
      } catch (error) {
        if (!cancelled) {
          setMessage(error instanceof Error ? error.message : "Có lỗi xảy ra khi tải dữ liệu.");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void fetchProject();
    return () => {
      cancelled = true;
    };
  }, [apiBaseUrl, projectId]);

  const handleSave = async () => {
    if (!projectId || Number.isNaN(projectId)) return;
    setIsSaving(true);
    setMessage(null);
    try {
      const payload = new FormData();
      payload.append("title", formData.title.trim());
      payload.append("short_description", formData.short_description.trim());
      payload.append("seo_title", formData.seo_title.trim());
      payload.append("seo_keywords", formData.seo_keywords.trim());
      payload.append("seo_description", formData.seo_description.trim());
      payload.append("project_type", formData.project_type.trim());
      if (formData.duration_days.trim() !== "") payload.append("duration_days", formData.duration_days.trim());
      if (formData.guest_count.trim() !== "") payload.append("guest_count", formData.guest_count.trim());
      if (formData.artist_count.trim() !== "") payload.append("artist_count", formData.artist_count.trim());
      if (formData.project_link.trim()) payload.append("link_url", formData.project_link.trim());
      const res = await fetch(`${apiBaseUrl}/projects/${projectId}`, {
        method: "PATCH",
        body: payload,
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Không thể lưu nội dung chi tiết dự án.");
      }
      setMessage("Đã lưu thông tin dự án.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Có lỗi xảy ra khi lưu.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="flex">
      <Sidebar />
      <section className="bg-[#121212] text-white flex-8 px-[20px] w-full py-[10px]">
        <div className="py-[10px] flex items-center justify-between gap-3">
          <p className="text-xl font-semibold text-white/75">
            {">"} Quản lí dự án {">"} Chi tiết dự án
          </p>
          <button
            type="button"
            onClick={() => router.push("/dashboard/projectlist")}
            className="px-3 py-2 rounded-lg border border-white/20 text-white/80 hover:bg-white/10 transition-colors"
          >
            ← Quay lại danh sách
          </button>
        </div>
        <div className="rounded-lg bg-[#1a1a1a] p-6 flex flex-col gap-4 border border-white/10">
          <div className="text-white/90">
            <p className="text-sm text-white/60">Dự án</p>
            <h1 className="text-2xl font-semibold mt-1">{formData.title || "Dự án"}</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="detail-title" className="block text-sm font-medium text-white/85 mb-1.5">
                Tên dự án
              </label>
              <input
                id="detail-title"
                type="text"
                value={formData.title}
                onChange={(e) => {
                  const nextTitle = e.target.value;
                  setFormData((prev) => {
                    const next = { ...prev, title: nextTitle };
                    if (!projectLinkManual) next.project_link = linkUrlFromTitle(nextTitle);
                    return next;
                  });
                }}
                className="w-full px-3 py-2 border border-white/15 rounded-lg bg-[#111111] text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#05B9BA]/50"
              />
            </div>
            <div>
              <label htmlFor="detail-type" className="block text-sm font-medium text-white/85 mb-1.5">
                Loại dự án
              </label>
              <select
                id="detail-type"
                value={formData.project_type}
                onChange={(e) => setFormData((p) => ({ ...p, project_type: e.target.value }))}
                className="w-full px-3 py-2 border border-white/15 rounded-lg bg-[#111111] text-white focus:outline-none focus:ring-2 focus:ring-[#05B9BA]/50"
              >
                <option value="">Chọn loại dự án</option>
                {PROJECT_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="detail-short-desc" className="block text-sm font-medium text-white/85 mb-1.5">
                Intro ngắn
              </label>
              <textarea
                id="detail-short-desc"
                rows={3}
                value={formData.short_description}
                onChange={(e) => setFormData((p) => ({ ...p, short_description: e.target.value }))}
                className="w-full px-3 py-2 border border-white/15 rounded-lg bg-[#111111] text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#05B9BA]/50 resize-none"
              />
            </div>
            <div className="md:col-span-2 border border-white/15 rounded-lg p-3 space-y-3">
              <p className="text-sm font-semibold text-white/85">Thiết lập SEO</p>
              <div>
                <label htmlFor="detail-seo-title" className="block text-sm font-medium text-white/85 mb-1.5">
                  Meta title
                </label>
                <input
                  id="detail-seo-title"
                  type="text"
                  value={formData.seo_title}
                  onChange={(e) => setFormData((p) => ({ ...p, seo_title: e.target.value }))}
                  placeholder="Nhập meta title (tùy chọn)"
                  className="w-full px-3 py-2 border border-white/15 rounded-lg bg-[#111111] text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#05B9BA]/50"
                />
              </div>
              <div>
                <label htmlFor="detail-seo-keywords" className="block text-sm font-medium text-white/85 mb-1.5">
                  Meta keywords
                </label>
                <input
                  id="detail-seo-keywords"
                  type="text"
                  value={formData.seo_keywords}
                  onChange={(e) => setFormData((p) => ({ ...p, seo_keywords: e.target.value }))}
                  placeholder="Ví dụ: du lịch, xe khách, hải vân"
                  className="w-full px-3 py-2 border border-white/15 rounded-lg bg-[#111111] text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#05B9BA]/50"
                />
              </div>
              <div>
                <label htmlFor="detail-seo-description" className="block text-sm font-medium text-white/85 mb-1.5">
                  Meta description
                </label>
                <textarea
                  id="detail-seo-description"
                  rows={3}
                  value={formData.seo_description}
                  onChange={(e) => setFormData((p) => ({ ...p, seo_description: e.target.value }))}
                  placeholder="Nhập mô tả SEO ngắn gọn (tùy chọn)"
                  className="w-full px-3 py-2 border border-white/15 rounded-lg bg-[#111111] text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#05B9BA]/50 resize-none"
                />
              </div>
            </div>
            <div>
              <label htmlFor="detail-duration" className="block text-sm font-medium text-white/85 mb-1.5">
                Số ngày
              </label>
              <input
                id="detail-duration"
                type="number"
                min={0}
                value={formData.duration_days}
                onChange={(e) => setFormData((p) => ({ ...p, duration_days: e.target.value }))}
                className="w-full px-3 py-2 border border-white/15 rounded-lg bg-[#111111] text-white focus:outline-none focus:ring-2 focus:ring-[#05B9BA]/50"
              />
            </div>
            <div>
              <label htmlFor="detail-guest" className="block text-sm font-medium text-white/85 mb-1.5">
                Số khách tham dự
              </label>
              <input
                id="detail-guest"
                type="number"
                min={0}
                value={formData.guest_count}
                onChange={(e) => setFormData((p) => ({ ...p, guest_count: e.target.value }))}
                className="w-full px-3 py-2 border border-white/15 rounded-lg bg-[#111111] text-white focus:outline-none focus:ring-2 focus:ring-[#05B9BA]/50"
              />
            </div>
            <div>
              <label htmlFor="detail-artist" className="block text-sm font-medium text-white/85 mb-1.5">
                Số nghệ sĩ
              </label>
              <input
                id="detail-artist"
                type="number"
                min={0}
                value={formData.artist_count}
                onChange={(e) => setFormData((p) => ({ ...p, artist_count: e.target.value }))}
                className="w-full px-3 py-2 border border-white/15 rounded-lg bg-[#111111] text-white focus:outline-none focus:ring-2 focus:ring-[#05B9BA]/50"
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="detail-link" className="block text-sm font-medium text-white/85 mb-1.5">
                Link dự án
              </label>
              <input
                id="detail-link"
                type="url"
                value={formData.project_link}
                onChange={(e) => {
                  setProjectLinkManual(true);
                  setFormData((p) => ({ ...p, project_link: e.target.value }));
                }}
                className="w-full px-3 py-2 border border-white/15 rounded-lg bg-[#111111] text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#05B9BA]/50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/85">
              Nội dung chi tiết
            </label>
            <div className="border border-white/15 rounded-lg bg-[#111111] p-4 flex items-center justify-between gap-3">
              <p className="text-sm text-white/65">
                Mở trang riêng để chỉnh sửa UI Block chi tiết.
              </p>
              <button
                type="button"
                onClick={() => router.push(`/dashboard/project-detail/${projectId}/content`)}
                className="px-4 py-2 rounded-lg bg-[#05B9BA] text-white font-medium hover:opacity-90 transition-opacity"
              >
                Chỉnh sửa nội dung chi tiết
              </button>
            </div>
          </div>

          {message ? (
            <div
              className={`text-sm border rounded-lg px-3 py-2 ${
                message.startsWith("Đã lưu")
                  ? "text-[#2E7D32] bg-[#E8F5E9] border-[#C8E6C9]"
                  : "text-[#C62828] bg-[#FFEBEE] border-[#FFCDD2]"
              }`}
            >
              {message}
            </div>
          ) : null}

          <div className="flex justify-end">
            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-[#05B9BA] text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={handleSave}
              disabled={isSaving || isLoading}
            >
              {isSaving ? "Đang lưu..." : "Lưu thông tin"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
