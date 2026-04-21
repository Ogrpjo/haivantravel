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

const FILTER_CATEGORIES = [
  "Gala Dinner",
  "Team Building",
  "Conference",
  "Year End Party",
] as const;

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

  const rawType = (p.project_type || "").trim();
  const category = FILTER_CATEGORIES.find(
    (c) => c.toLowerCase() === rawType.toLowerCase(),
  ) || rawType || "Gala Dinner";

  const stats: ProjectStat[] = [];
  if (p.guest_count != null && p.guest_count >= 0) {
    stats.push({ number: formatGuestDisplay(p.guest_count), name: "Khách tham dự" });
  }
  if (p.artist_count != null && p.artist_count >= 0) {
    stats.push({ number: String(p.artist_count), name: "Nghệ sĩ" });
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
      className={`cursor-pointer border rounded-[10px] px-4 py-2 transition-all duration-300 ${
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
  onCategoryClick,
}: {
  activeProject: Project;
  activeCategory: string | null;
  onCategoryClick: (category: string) => void;
}) {
  const categories = [...FILTER_CATEGORIES];

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
      <div className="md:grid xl:grid-cols-4 md:grid-cols-2 max-md:flex max-md:flex-row gap-[10px] flex-wrap">
        {categories.map((cat) => (
          <CaseStudy
            key={cat}
            name={cat}
            isActive={activeCategory?.toLowerCase() === cat.toLowerCase()}
            onClick={() => onCategoryClick(cat)}
          />
        ))}
      </div>
      <div className="relative h-full w-full min-h-[200px] rounded-[16px] bg-gradient overflow-hidden">
        <img
          src={activeProject.mainImage}
          alt={activeProject.title}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#121212]/1 to-[#121212]" />
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
  const [loadError, setLoadError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError(false);
      const res = await fetch(`${getApiBaseUrl()}/projects`, { cache: "no-store" });
      if (!res.ok) throw new Error("fetch failed");
      const data = (await res.json()) as ApiProject[];
      if (!Array.isArray(data)) {
        setProjects([]);
        return;
      }
      const mapped = data
        .map(mapApiProjectToUi)
        .filter((p): p is Project => p !== null);
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

  const filteredProjects = useMemo(() => {
    if (!activeCategory) return projects;
    return projects.filter(
      (p) => p.category.toLowerCase() === activeCategory.toLowerCase(),
    );
  }, [projects, activeCategory]);

  useEffect(() => {
    if (filteredProjects.length === 0) {
      setActiveProject(null);
      return;
    }
    setActiveProject((prev) => {
      if (prev && filteredProjects.some((p) => p.id === prev.id)) return prev;
      return filteredProjects[0];
    });
  }, [filteredProjects]);

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
          onCategoryClick={handleCategoryClick}
        />
        <RightContent activeProject={activeProject} />
      </div>
      {filteredProjects.length > 0 ? (
        <SliderBottom
          projects={filteredProjects}
          activeProjectId={activeProject.id}
          onProjectClick={setActiveProject}
        />
      ) : null}
    </section>
  );
}
