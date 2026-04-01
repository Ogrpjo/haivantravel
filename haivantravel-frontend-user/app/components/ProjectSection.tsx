"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import ImageFrameEmotion from "./ImageFrameEmotion";

type Project = {
  id: number;
  image_url: string;
  link_url: string;
};

function buildProjectImageSrc(
  imageUrl: string,
  apiBaseUrl: string,
): string | null {
  if (!imageUrl || typeof imageUrl !== "string") return null;
  const trimmed = imageUrl.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://"))
    return trimmed;
  const base = apiBaseUrl.replace(/\/$/, "");
  // backend returns `upload/<filename>` or sometimes a full path; normalize to `/upload/<filename>`
  const parts = trimmed.split(/[/\\]/).filter(Boolean);
  const uploadsIdx = parts.findIndex((p) => p.toLowerCase() === "upload");
  const filename =
    uploadsIdx >= 0
      ? parts.slice(uploadsIdx + 1).join("/")
      : parts[parts.length - 1];
  if (!filename) return null;
  return `${base}/upload/${filename}`;
}

export default function ProjectSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [current, setCurrent] = useState(0);
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:2031";

  useEffect(() => {
    let cancelled = false;
    const fetchProjects = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/projects`, {
          cache: "no-store",
        });
        if (!res.ok) {
          console.error(
            "[ProjectSection] Failed to fetch projects",
            res.status,
          );
          return;
        }
        const data: Project[] = await res.json();
        if (!cancelled) setProjects(data);
      } catch (error) {
        console.error("[ProjectSection] Error fetching projects", error);
      }
    };

    fetchProjects();
    return () => {
      cancelled = true;
    };
  }, [apiBaseUrl]);

  const handleNext = () => {
    setCurrent((prev) =>
      projects.length > 0 ? (prev + 1) % projects.length : prev,
    );
  };

  const handlePrevious = () => {
    setCurrent((prev) =>
      projects.length > 0
        ? (prev - 1 + projects.length) % projects.length
        : prev,
    );
  };

  const hasProjects = projects.length > 0;
  const currentProject = hasProjects ? projects[current] : null;
  const nextProject =
    projects.length > 1 ? projects[(current + 1) % projects.length] : null;
  const currentImageSrc = currentProject?.image_url
    ? buildProjectImageSrc(currentProject.image_url, apiBaseUrl)
    : null;
  const nextImageSrc = nextProject?.image_url
    ? buildProjectImageSrc(nextProject.image_url, apiBaseUrl)
    : null;

  return (
    <section className="xl:min-h-[100vh] md:min-h-[60vh] min-h-[60vh] max-sm:gap-[30px] px-[30px] md:px-[120px] flex items-center justify-center max-sm:flex-col max-sm:items-stretch">
      <div className="flex-1 flex flex-col max-sm:items-center max-sm:justify-center gap-[10px]">
        <h3 className="2xl:text-[65px] xl:text-[50px] lg:text-[40px] md:text-[30px] sm:text-[16px] text-[20px] font-black text-transparent bg-clip-text bg-gradient-to-r from-[#8ED6D7] to-[#4B7171] inline-block md:pb-[10px] max-sm:text-center">
          Dự án đã thực hiện
        </h3>
        <p className="font-black 2xl:text-[32px] xl:text-[25px] lg:text-[20px] md:text-[14px] sm:text-[10px] text-[12px] max-sm:text-center">
          Những hành trình giá trị cùng khách hàng
        </p>
        <p className="2xl:max-w-[530px] text-[11px] max-sm:text-center text-justify pb-[30px] lg:text-[14px] md:text-[10px] md:max-w-[300px] sm:max-w-[300px] sm:text-[14px]">
          Chúng tôi đã đồng hành cùng nhiều doanh nghiệp và tổ chức trong việc
          xây dựng những giải pháp hiệu quả và bền vững. Mỗi dự án là một hành
          trình sáng tạo, nơi chúng tôi tập trung vào chất lượng, trải nghiệm và
          giá trị thực tế mang lại cho khách hàng.
        </p>
        {currentProject?.link_url ? (
          <Link
            href={currentProject.link_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex max-sm:self-center sm:self-start flex-row items-center w-auto px-4 py-2 justify-center bg-gradient-to-b from-[#3F9293] to-[#8E4590] rounded-[12px]"
          >
            <p className="text-[10px] lg:text-[12px] xl:text-[15px]">
              Tìm hiểu thêm
            </p>
            <Image
              src="/arrow-circle-right-solid.svg"
              alt="arrow circle right"
              width={0}
              height={0}
              className="sm:w-[15px] pl-[4px] lg:w-[20px] w-[10px] max-sm:w-[18px] max-sm:h-[18px]"
            />
          </Link>
        ) : (
          <button
            type="button"
            disabled
            title="Dự án này chưa có link"
            className="flex max-sm:self-center sm:self-start flex-row items-center w-auto px-4 py-2 justify-center bg-gradient-to-b from-[#3F9293] to-[#8E4590] rounded-[12px] opacity-60 cursor-not-allowed"
          >
            <p className="text-[10px] lg:text-[12px] xl:text-[15px]">
              Tìm hiểu thêm
            </p>
            <Image
              src="/arrow-circle-right-solid.svg"
              alt="arrow circle right"
              width={0}
              height={0}
              className="sm:w-[15px] pl-[4px] lg:w-[20px] w-[10px] max-sm:w-[18px] max-sm:h-[18px]"
            />
          </button>
        )}
      </div>
      <div className="flex-1 flex items-center relative justify-center max-sm:w-full max-sm:flex-col max-sm:items-center">
        <div className="w-full relative max-sm:w-full max-sm:min-h-[30vh]">
          <ImageFrameEmotion
            src={currentImageSrc}
            alt="img"
            width="100%"
            className="relative left-[10%] z-10 max-w-[650px] max-sm:left-1/2 max-sm:-translate-x-1/2 max-sm:max-w-full"
          />
          <ImageFrameEmotion
            src={nextImageSrc}
            alt="img"
            width="100%"
            className="absolute top-0 left-[75%] max-w-[500px] sm:min-w-[400px] opacity-70 max-sm:left-1/2 max-sm:translate-x-[30%] max-sm:max-w-[160px] max-sm:opacity-50"
          />
        </div>
        <div className="absolute bottom-0 sm:bottom-[5%] xl:bottom-[-5%] flex gap-1 sm:gap-3 items-center justify-center sm:-right-[10%] md:-right-[25%] lg:-right-10 max-sm:static max-sm:mt-8 max-sm:justify-center max-sm:w-full max-sm:transform-none">
          <button
            className="relative z-30 mt-6 2xl:px-6 2xl:py-5 xl:px-5 xl:py-4 lg:px-3 lg:py-2 md:px-3 md:py-2 sm:px-2 sm:py-1 max-sm:px-2 max-sm:py-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white rounded-[12px] border border-white/20 shadow-[0_0_10px_rgba(255,255,255,0.1)] flex items-center gap-3 transition-all duration-300 group cursor-pointer"
            onClick={handlePrevious}
          >
            <Image
              src="/pre.svg"
              alt="play"
              width={16}
              height={15}
              className="relative z-10 2xl:w-[16px] xl:w-[14px] lg:w-[12px] md:w-[12px] sm:w-[10px] max-sm:w-[12px]"
            />
          </button>
          {hasProjects ? (
            <p className="font-black 2xl:text-[30px] xl:text-[24px] lg:text-[20px] md:text-[18px] sm:text-[16px] pt-[25px] text-[10px]">
              {current + 1}/{projects.length}
            </p>
          ) : null}
          <button
            className="relative z-30 mt-6 2xl:px-6 2xl:py-5 xl:px-5 xl:py-4 lg:px-3 lg:py-2 md:px-3 md:py-2 sm:px-2 sm:py-1 max-sm:px-2 max-sm:py-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white rounded-[12px] border border-white/20 shadow-[0_0_10px_rgba(255,255,255,0.1)] flex items-center gap-3 transition-all duration-300 group cursor-pointer"
            onClick={handleNext}
          >
            <Image
              src="/nex.svg"
              alt="play"
              width={20}
              height={0}
              className="relative z-10 2xl:w-[20px] xl:w-[16px] lg:w-[14px] md:w-[14px] sm:w-[12px] max-sm:w-[12px]"
            />
          </button>
        </div>
      </div>
    </section>
  );
}
