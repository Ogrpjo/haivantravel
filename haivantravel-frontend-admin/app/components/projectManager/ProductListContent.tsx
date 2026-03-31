"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import ProjectItem from "./ProjectItem";
import AddProjectModal from "./AddProjectModal";
import EditProjectModal, { type ProjectForEdit } from "./EditProjectModal";
import { confirmDelete } from "@/app/lib/tableActions";

type Project = {
  id: number;
  image_url: string;
  link_url: string;
  createdAt?: string;
};

export default function ProductListContent() {
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectForEdit | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:2031";

  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch(`${apiBaseUrl}/projects`, { cache: "no-store" });
      if (!res.ok) return;
      const data: Project[] = await res.json();
      setProjects(data);
    } catch {
      // ignore
    }
  }, [apiBaseUrl]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const totalText = useMemo(() => `${projects.length} mục`, [projects.length]);

  const getImageSrc = useCallback(
    (imageUrl?: string) => {
      if (!imageUrl) return "";
      if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
        return imageUrl;
      }
      const normalized = imageUrl.startsWith("/") ? imageUrl.slice(1) : imageUrl;
      return `${apiBaseUrl}/${normalized}`;
    },
    [apiBaseUrl],
  );

  const handleEdit = useCallback(
    (projectId: number) => {
      const project = projects.find((p) => p.id === projectId) ?? null;
      if (project) setEditingProject(project);
    },
    [projects],
  );

  const handleDelete = useCallback(
    (projectId: number) => {
      const project = projects.find((p) => p.id === projectId);
      if (!project) return;

      confirmDelete("Bạn có chắc muốn xóa dự án này? Hành động không thể hoàn tác.", async () => {
        try {
          const res = await fetch(`${apiBaseUrl}/projects/${projectId}`, { method: "DELETE" });
          if (!res.ok) {
            const text = await res.text();
            throw new Error(text || "Không thể xóa dự án.");
          }
          await fetchProjects();
        } catch (err) {
          const error = err instanceof Error ? err : new Error("Không thể xóa dự án.");
          if (typeof window !== "undefined") window.alert(error.message);
        }
      });
    },
    [apiBaseUrl, fetchProjects, projects],
  );

  return (
    <section className="bg-[#121212] text-white flex-8 px-[20px] w-full py-[10px]">
      <div className="py-[10px]">
        <p className="text-xl font-semibold"> {">"} Quản lí dự án </p>
      </div>
      <div className="flex flex-col w-full bg-[#1a1a1a] h-full rounded-[8px] border border-white/10">
        <div className="flex items-center justify-between px-[15px] py-[10px] max-h-[70px] h-full border-b border-white/10">
          <div className="flex flex-row">
            <div className="flex items-center justify-center gap-2">
              <div>
                <Image
                  src="/pageLogo/productlist.svg"
                  alt="logo"
                  width={0}
                  height={0}
                  className="w-[100%]"
                />
              </div>
              <p className="font-medium">Quản lí dự án</p>
            </div>
            <div className="flex px-[20px] items-center justify-center">
              <p className="pr-[20px]">●</p>
              <p className="font-medium text-white/60">{totalText}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsAddProjectOpen(true)}
            className="cursor-pointer font-medium text-white text-md bg-[#05B9BA] px-[10px] rounded-[6px] h-[80%]"
          >
            + Thêm dự án
          </button>
        </div>
        <div className="w-full flex flex-col h-full">
          <div className="flex w-full items-center border-b border-white/10 bg-[#222222] text-white/85">
            <div className="flex-1 min-w-0 py-3 px-4 border-r border-white/10 font-medium">
              Liên kết dự án
            </div>
            <div className="flex-1 min-w-0 py-3 px-4 border-r border-white/10 font-medium">
              Ảnh dự án
            </div>
            <div className="w-32 shrink-0 py-3 px-4 border-r border-white/10 font-medium">
              Ngày tạo
            </div>
            <div className="w-28 shrink-0 py-3 px-4 font-medium">
              Thao tác
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            {projects.length ? (
              projects.map((p) => (
                <ProjectItem
                  key={p.id}
                  id={p.id}
                  link={p.link_url}
                  src={getImageSrc(p.image_url)}
                  createdAt={p.createdAt}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <div className="flex w-full items-center justify-center py-10 text-white/60">
                Chưa có dự án
              </div>
            )}
          </div>
        </div>
      </div>
      <AddProjectModal
        isOpen={isAddProjectOpen}
        onClose={() => setIsAddProjectOpen(false)}
        onSuccess={fetchProjects}
      />
      <EditProjectModal
        isOpen={!!editingProject}
        project={editingProject}
        onClose={() => setEditingProject(null)}
        onSuccess={() => void fetchProjects()}
      />
    </section>
  );
}
