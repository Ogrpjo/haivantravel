"use client";

import Footer from "../components/layout/Footer";
import NavigationBar from "../components/layout/Navbar";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

type CaseStudyItem = {
    id: number;
    title: string;
    guests: string;
    artists: string;
    duration: string;
    description: string;
    image: string;
    category: string;
    href: string;
};

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
};

type ApiProjectType = {
    id: number;
    name: string;
    sort_order: number;
};

const INITIAL_LOAD_COUNT = 7;
const LOAD_MORE_COUNT = 3;

function normalizeTypeName(value: string): string {
    return value
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ")
        .replace(/gala\s*dinner/g, "gala");
}

function getApiBaseUrl(): string {
    return process.env.NEXT_PUBLIC_API_URL?.trim() || "https://api.haivanevent.vn";
}

function buildProjectImageUrl(imagePath: string): string {
    if (!imagePath) return "";
    if (/^https?:\/\//i.test(imagePath)) return imagePath;
    const normalized = imagePath.replace(/\\/g, "/").replace(/^\/+/, "");
    return `${getApiBaseUrl().replace(/\/+$/, "")}/${normalized}`;
}

function titleToSlug(title: string): string {
    const stripped = title
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\u0111/g, "d")
        .replace(/\u0110/g, "d")
        .toLowerCase()
        .trim();
    return stripped.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function toCaseStudyHref(project: ApiProject): string {
    const raw = project.link_url?.trim();
    if (raw) {
        try {
            const url = new URL(raw);
            if (url.pathname.startsWith("/case-study/")) {
                return url.pathname;
            }
        } catch {
            if (raw.startsWith("/case-study/")) return raw;
        }
    }
    return `/case-study/${titleToSlug(project.title || "du-an")}`;
}

function mapApiProjectToUi(project: ApiProject): CaseStudyItem {
    const guestCount = project.guest_count ?? 0;
    return {
        id: project.id,
        title: project.title?.trim() || "Dự án",
        guests: guestCount > 0 ? `${guestCount.toLocaleString("en-US")}+` : "—",
        artists: project.artist_count != null ? String(project.artist_count) : "—",
        duration: project.duration_days != null && project.duration_days > 0 ? `${project.duration_days} ngày` : "—",
        description: project.short_description?.trim() || "Đang cập nhật mô tả dự án.",
        image: buildProjectImageUrl(project.image_url),
        category: project.project_type?.trim() || "",
        href: toCaseStudyHref(project),
    };
}

function MainContent() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [projects, setProjects] = useState<CaseStudyItem[]>([]);
    const [projectTypes, setProjectTypes] = useState<string[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProjectTypes = useCallback(async () => {
        try {
            const res = await fetch(`${getApiBaseUrl()}/project-types`, { cache: "no-store" });
            if (!res.ok) return;
            const data = (await res.json()) as ApiProjectType[];
            const names = Array.isArray(data)
                ? data
                      .map((item) => item.name?.trim())
                      .filter((name): name is string => Boolean(name))
                : [];
            setProjectTypes(names);
        } catch {
            // keep project-derived fallback
        }
    }, []);

    const fetchProjects = useCallback(
        async (offset: number, limit: number, append: boolean) => {
            try {
                setIsLoading(true);
                setError(null);
                const params = new URLSearchParams();
                params.set("offset", String(offset));
                params.set("limit", String(limit));
                if (activeCategory !== "All") {
                    params.set("project_type", activeCategory);
                }

                const res = await fetch(`${getApiBaseUrl()}/projects?${params.toString()}`, {
                    cache: "no-store",
                });
                if (!res.ok) throw new Error("Không thể tải danh sách dự án.");

                const data = (await res.json()) as ApiProject[];
                const mapped = Array.isArray(data) ? data.map(mapApiProjectToUi) : [];
                setProjects((prev) => (append ? [...prev, ...mapped] : mapped));
                setHasMore(mapped.length === limit);
            } catch (err) {
                if (!append) setProjects([]);
                setHasMore(false);
                setError(err instanceof Error ? err.message : "Có lỗi xảy ra.");
            } finally {
                setIsLoading(false);
            }
        },
        [activeCategory],
    );

    useEffect(() => {
        void fetchProjectTypes();
    }, [fetchProjectTypes]);

    useEffect(() => {
        void fetchProjects(0, INITIAL_LOAD_COUNT, false);
    }, [fetchProjects]);

    const projectCategories = useMemo(() => {
        const categoryMap = new Map<string, string>();

        for (const name of projectTypes) {
            const key = normalizeTypeName(name);
            if (!categoryMap.has(key)) {
                categoryMap.set(key, name);
            }
        }

        for (const project of projects) {
            const raw = project.category.trim();
            if (!raw) continue;
            const key = normalizeTypeName(raw);
            if (!categoryMap.has(key)) {
                categoryMap.set(key, raw);
            }
        }

        return Array.from(categoryMap.values()).sort((a, b) => a.localeCompare(b, "vi"));
    }, [projectTypes, projects]);

    const filterButtons = ["All", ...projectCategories];

    const visibleProjects = projects.filter((project) => {
        if (activeCategory === "All") return true;
        return normalizeTypeName(project.category) === normalizeTypeName(activeCategory);
    });

    const handleLoadMore = () => {
        if (isLoading || !hasMore) return;
        void fetchProjects(projects.length, LOAD_MORE_COUNT, true);
    };

    return (
        <section className="pt-[120px] min-h-[100vh]">
            <header className="relative w-full h-[300px]">
                <img
                    src="/case-study/CaseHero.webp"
                    className="absolute inset-0 h-full w-full object-cover"
                    alt="Case Study Image"
                />
                <div className="absolute inset-0 bg-[#121212]/55" />
                <div className="absolute inset-0 flex items-end lg:px-[148px] sm:px-[84px] px-[20px] pb-[20px]">
                    <div className="flex flex-col font-black bg-clip-text text-transparent bg-gradient-to-r min-h-[100px] from-[#4B7171] to-[#8ED6D7]">
                        <p className="text-[25px]">Dự án</p>
                        <h1 className="text-[50px] leading-[1.1]">Của chúng tôi</h1>
                    </div>
                </div>
            </header>

            <div className="lg:px-[148px] sm:px-[84px] px-[20px] pt-[24px] pb-[80px]">
                <div className="flex flex-wrap gap-2">
                    {filterButtons.map((item) => (
                        <button
                            type="button"
                            key={item}
                            onClick={() => setActiveCategory(item)}
                            className={`w-fit px-2 py-1 rounded-[8px] text-[13px] border transition-colors ${
                                activeCategory === item
                                    ? "border-[#8ED6D7]/60 bg-[#8ED6D7]/20 text-white"
                                    : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
                            }`}
                        >
                            {item}
                        </button>
                    ))}
                </div>

                <div className="pt-[16px] flex flex-col gap-4">
                    {visibleProjects.map((item) => (
                        <Link key={item.id} href={item.href} className="no-underline">
                            <article className="grid grid-cols-[360px_1fr] max-md:grid-cols-1 gap-5 p-3 rounded-[12px] border border-white/10 bg-[#121212] hover:border-[#8ED6D7]/40 transition-colors cursor-pointer">
                                <div className="relative w-full aspect-[3/2] max-md:aspect-[4/3] rounded-[8px] overflow-hidden">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="absolute inset-0 h-full w-full object-cover"
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <h2 className="text-[16px] md:text-[18px] text-white font-semibold">
                                        {item.title}
                                    </h2>
                                    <div className="flex flex-wrap gap-8">
                                        <div>
                                            <p className="text-[#8ED6D7] text-[24px] font-black leading-none">{item.guests}</p>
                                            <p className="text-white/60 text-[12px]">Khách tham dự</p>
                                        </div>
                                        <div>
                                            <p className="text-[#8ED6D7] text-[24px] font-black leading-none">{item.artists}</p>
                                            <p className="text-white/60 text-[12px]">Nghệ sĩ</p>
                                        </div>
                                        <div>
                                            <p className="text-[#8ED6D7] text-[24px] font-black leading-none">{item.duration}</p>
                                            <p className="text-white/60 text-[12px]">Thời gian</p>
                                        </div>
                                    </div>
                                    <p className="text-white/60 text-[14px] leading-relaxed">{item.description}</p>
                                </div>
                            </article>
                        </Link>
                    ))}

                    {!isLoading && projects.length === 0 && !error ? (
                        <p className="text-white/60 py-6">Không có dự án trong danh mục này.</p>
                    ) : null}
                    {error ? <p className="text-red-400 py-2">{error}</p> : null}

                    {projects.length > 0 && hasMore ? (
                        <div className="pt-4 flex justify-center">
                            <button
                                type="button"
                                onClick={handleLoadMore}
                                disabled={isLoading}
                                className="px-5 py-2 rounded-[10px] border border-[#8ED6D7]/50 text-[#8ED6D7] hover:bg-[#8ED6D7]/10 transition-colors disabled:opacity-60"
                            >
                                {isLoading ? "Đang tải..." : "Show more"}
                            </button>
                        </div>
                    ) : null}
                </div>
            </div>
        </section>
    );
}

export default function CaseStudy() {
    return (
        <main className="min-h-screen flex flex-col">
            <NavigationBar />
            <MainContent />
            <Footer />
        </main>
    );
}
