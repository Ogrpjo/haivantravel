"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { ChevronRight2 } from "@deemlol/next-icons";
import ButtonGradient from "../button-gradient";
import Link from "next/link";

interface ProjectStat {
  number: string;
  name: string;
}

interface Project {
  id: number;
  category: string;
  title: string;
  description: string;
  stats: ProjectStat[];
  mainImage: string;
  thumbnail: string;
  link: string;
  createdAt?: string;
}

type ApiProject = {
  id: number;
  title: string;
  short_description: string | null;
  project_type: string | null;
  duration_days: number | null;
  guest_count: number | null;
  artist_count: number | null;
  image_url: string;
  link_url: string;
  createdAt?: string;
};

type ApiProjectType = {
  id: number;
  name: string;
  sort_order: number;
};

function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL?.trim() || "https://api.haivanevent.vn";
}

function buildProjectImageUrl(imagePath: string): string {
  if (!imagePath) return "";
  if (/^https?:\/\//i.test(imagePath)) return imagePath;
  const normalized = imagePath.replace(/\\/g, "/").replace(/^\/+/, "");
  return `${getApiBaseUrl().replace(/\/+$/, "")}/${normalized}`;
}

function formatGuestDisplay(n: number): string {
  return `${n.toLocaleString("en-US")}+`;
}

function mapApiProjectToUi(p: ApiProject): Project | null {
  const imageUrl = buildProjectImageUrl(p.image_url);
  if (!imageUrl) return null;

  const category = (p.project_type || "").trim() || "";

  const stats: ProjectStat[] = [];
  if (p.guest_count != null && p.guest_count >= 0) {
    stats.push({ number: formatGuestDisplay(p.guest_count), name: "Khách tham dự" });
  }
  if (p.artist_count != null && p.artist_count >= 0) {
    stats.push({ number: String(p.artist_count), name: "Đối tác" });
  }
  if (p.duration_days != null && p.duration_days > 0) {
    stats.push({
      number: `${p.duration_days} ngày`,
      name: "Thời gian",
    });
  }
  if (stats.length === 0) {
    stats.push({ number: "—", name: "Thông tin" });
  }

  return {
    id: p.id,
    category,
    title: p.title?.trim() || "Dự án",
    description: p.short_description?.trim() || "",
    stats,
    mainImage: imageUrl,
    thumbnail: imageUrl,
    link: p.link_url?.trim() || "#",
  };
}

function CaseStudy({
  name,
  isActive,
  onClick,
}: {
  name: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`inline-flex w-fit cursor-pointer border rounded-[10px] px-2 py-2 transition-all duration-300 ${
        isActive
          ? "bg-white/20 border-white/50 shadow-[0_0_15px_rgba(142,214,215,0.3)]"
          : "bg-white/5 border-white/10 hover:bg-white/10"
      }`}
    >
      <p className="text-center lg:text-[14px] text-[12px] whitespace-nowrap">{name}</p>
    </div>
  );
}

function LeftContent({
  activeProject,
  activeCategory,
  categories,
  onCategoryClick,
}: {
  activeProject: Project;
  activeCategory: string | null;
  categories: string[];
  onCategoryClick: (category: string) => void;
}) {
  return (
    <div className="flex-1 flex flex-col h-full max-md:justify-center max-md:items-center gap-10">
      <div className="flex flex-col gap-[15px] lg:gap-[25px] max-md:justify-center shrink-0">
        <p className="bg-clip-text text-transparent bg-gradient-to-r from-[#4B7171] max-md:text-center to-[#8ED6D7] text-[14px] md:text-[16px] max-sm:text-center">
          Dự án đã thực hiện
        </p>
        <h1 className="text-[30px] xl:text-[40px] 2xl:text-[59px] bg-clip-text text-transparent bg-gradient-to-r from-[#4B7171] to-[#8ED6D7] font-black leading-tight max-sm:text-center">
          Case Study nổi bật
        </h1>
      </div>
      <div className="flex flex-wrap gap-[10px]">
        {categories.map((cat) => (
          <CaseStudy
            key={cat}
            name={cat}
            isActive={activeCategory?.toLowerCase() === cat.toLowerCase()}
            onClick={() => onCategoryClick(cat)}
          />
        ))}
      </div>
      <div className="relative w-full h-[220px] sm:h-[300px] lg:h-[390px] xl:h-[480px] rounded-[16px] bg-gradient overflow-hidden">
        <img
          src={activeProject.mainImage}
          alt={activeProject.title}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#121212]/10 via-[#121212]/30 to-[#121212]/85" />
      </div>
    </div>
  );
}

function RightContent({ activeProject }: { activeProject: Project }) {
  const detailHref = activeProject.link.trim() || "/";
  const isExternal = /^https?:\/\//i.test(detailHref);

  return (
    <div className="flex-1 flex flex-col gap-10 justify-center max-md:justify-center max-md:items-center">
      <Link href="/case-study" className="justify-end flex cursor-pointer group">
        <p className="text-white/70 group-hover:text-white transition-colors">Xem tất cả dự án</p>
        <ChevronRight2 className="text-white/70 group-hover:text-white transition-colors" />
      </Link>
      <div className="flex flex-col gap-10">
        <h1 className="xl:text-[40px] text-[30px] max-md:text-center font-bold">
          {activeProject.title}
        </h1>
        <p className="lg:text-[18px] max-md:text-center text-[12px] text-white/70">
          {activeProject.description || "—"}
        </p>
      </div>
      <div className="flex flex-row gap-10 flex-wrap">
        {activeProject.stats.map((stat, index) => (
          <div key={index} className="flex flex-col">
            <p className="text-transparent bg-clip-text bg-gradient-to-r from-[#8ED6D7] to-[#4B7171] xl:text-[35px] text-[25px] font-black">
              {stat.number}
            </p>
            <p className="text-white/70">{stat.name}</p>
          </div>
        ))}
      </div>
      {isExternal ? (
        <a href={detailHref} target="_blank" rel="noopener noreferrer" className="inline-block">
          <ButtonGradient name="Xem chi tiết dự án" />
        </a>
      ) : (
        <Link href={detailHref} className="inline-block">
          <ButtonGradient name="Xem chi tiết dự án" />
        </Link>
      )}
    </div>
  );
}

function SliderBottom({
  projects,
  activeProjectId,
  onProjectClick,
}: {
  projects: Project[];
  activeProjectId: number;
  onProjectClick: (project: Project) => void;
}) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const dragged = useRef(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    isDragging.current = true;
    dragged.current = false;
    startX.current = e.pageX - sliderRef.current.offsetLeft;
    scrollLeft.current = sliderRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX.current) * 2;
    if (Math.abs(walk) > 5) dragged.current = true;
    sliderRef.current.scrollLeft = scrollLeft.current - walk;
  };

  return (
    <div className="relative md:order-2 order-3 w-full pt-5 select-none">
      <div
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={() => (isDragging.current = false)}
        onMouseUp={() => (isDragging.current = false)}
        onMouseMove={handleMouseMove}
        className="flex flex-nowrap overflow-x-auto no-scrollbar gap-4 pb-2 cursor-grab active:cursor-grabbing scroll-smooth"
      >
        {projects.map((project) => (
          <div
            key={project.id}
            onClick={() => !dragged.current && onProjectClick(project)}
            className={`group relative flex-none md:w-[13vw] md:h-[8vw] h-[16vw] w-[25vw] rounded-[16px] overflow-hidden transition-all duration-300 border-2 ${
              activeProjectId === project.id
                ? "border-[#8ED6D7] scale-[1.02] shadow-lg"
                : "border-transparent opacity-60 hover:opacity-100"
            }`}
          >
            <div className="relative w-full h-full transition-transform duration-500 ease-in-out group-hover:scale-110">
              <img
                src={project.thumbnail}
                alt={project.title}
                draggable={false}
                className="absolute inset-0 h-full w-full object-cover pointer-events-none"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CompletedProject() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectTypes, setProjectTypes] = useState<string[]>([]);
  const [loadError, setLoadError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError(false);
      const [projectsRes, typesRes] = await Promise.all([
        fetch(`${getApiBaseUrl()}/projects`, { cache: "no-store" }),
        fetch(`${getApiBaseUrl()}/project-types`, { cache: "no-store" }),
      ]);

      if (!projectsRes.ok) throw new Error("fetch failed");
      const projectData = (await projectsRes.json()) as ApiProject[];
      const typeData = typesRes.ok ? ((await typesRes.json()) as ApiProjectType[]) : [];

      setProjectTypes(
        Array.isArray(typeData)
          ? typeData
              .map((item) => item.name?.trim())
              .filter((name): name is string => Boolean(name))
          : [],
      );

      if (!Array.isArray(projectData)) {
        setProjects([]);
        return;
      }

      const mapped = projectData
        .map(mapApiProjectToUi)
        .filter((p): p is Project => p !== null)
        .slice()
        .sort((a, b) => b.id - a.id);

      setProjects(mapped);
    } catch {
      setLoadError(true);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProjects();
  }, [loadProjects]);

  const categoryOptions = useMemo(() => {
    const categoryMap = new Map<string, string>();

    for (const name of projectTypes) {
      const key = name.toLowerCase();
      if (!categoryMap.has(key)) categoryMap.set(key, name);
    }

    for (const project of projects) {
      const raw = project.category.trim();
      if (!raw) continue;
      const key = raw.toLowerCase();
      if (!categoryMap.has(key)) categoryMap.set(key, raw);
    }

    return Array.from(categoryMap.values());
  }, [projectTypes, projects]);

  const projectsByCategory = useMemo(() => {
    const grouped = new Map<string, Project[]>();

    for (const project of projects) {
      const key = project.category.trim().toLowerCase();
      if (!key) continue;
      const items = grouped.get(key) ?? [];
      items.push(project);
      grouped.set(key, items);
    }

    return grouped;
  }, [projects]);

  const visibleProjects = useMemo(() => {
    if (activeCategory) {
      const source = projectsByCategory.get(activeCategory.toLowerCase()) ?? [];
      return source.slice(0, 5);
    }

    const seen = new Set<number>();
    const visible: Project[] = [];

    for (const category of categoryOptions) {
      const categoryProjects = (projectsByCategory.get(category.toLowerCase()) ?? []).slice(0, 5);
      for (const project of categoryProjects) {
        if (seen.has(project.id)) continue;
        seen.add(project.id);
        visible.push(project);
      }
    }

    if (visible.length > 0) return visible;

    return projects.slice(0, 5);
  }, [activeCategory, categoryOptions, projects, projectsByCategory]);

  useEffect(() => {
    if (visibleProjects.length === 0) {
      setActiveProject(null);
      return;
    }
    setActiveProject((prev) => {
      if (prev && visibleProjects.some((p) => p.id === prev.id)) return prev;
      return visibleProjects[0];
    });
  }, [visibleProjects]);

  const handleCategoryClick = (category: string) => {
    if (activeCategory?.toLowerCase() === category.toLowerCase()) {
      setActiveCategory(null);
    } else {
      setActiveCategory(category);
    }
  };

  if (loading) {
    return (
      <section className="py-[60px] lg:py-[100px] lg:px-[148px] sm:px-[84px] px-[20px]">
        <p className="text-center text-white/60">Đang tải dự án...</p>
      </section>
    );
  }

  if (loadError || projects.length === 0) {
    return (
      <section className="py-[60px] lg:py-[100px] lg:px-[148px] sm:px-[84px] px-[20px]">
        <p className="text-center text-white/60">
          {loadError ? "Không tải được danh sách dự án." : "Chưa có dự án nào."}
        </p>
      </section>
    );
  }

  if (!activeProject) {
    return (
      <section className="py-[60px] lg:py-[100px] lg:px-[148px] sm:px-[84px] px-[20px] flex flex-col items-center gap-4">
        <p className="text-center text-white/60">Không có dự án trong danh mục này.</p>
        {activeCategory ? (
          <button
            type="button"
            onClick={() => setActiveCategory(null)}
            className="text-[#8ED6D7] hover:underline text-sm"
          >
            Xóa bộ lọc
          </button>
        ) : null}
      </section>
    );
  }

  return (
    <section
      id="case-study-section"
      className="py-[60px] lg:py-[100px] flex flex-col lg:px-[148px] sm:px-[84px] px-[20px]"
    >
      <div className="flex max-md:flex-col h-full xl:gap-[80px] sm:gap-[40px] gap-10">
        <LeftContent
          activeProject={activeProject}
          activeCategory={activeCategory}
          categories={categoryOptions}
          onCategoryClick={handleCategoryClick}
        />
        <RightContent activeProject={activeProject} />
      </div>
      {visibleProjects.length > 0 ? (
        <SliderBottom
          projects={visibleProjects}
          activeProjectId={activeProject.id}
          onProjectClick={setActiveProject}
        />
      ) : null}
    </section>
  );
}
