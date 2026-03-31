"use client";

import { useEffect, useState } from "react";
import ImageFrame from "./ImageFrame";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:2031";

const DEFAULT_TITLE = "Tổng quan về doanh nghiệp của chúng tôi";
const DEFAULT_DESCRIPTION1 =
  "Khởi đầu từ khát vọng kết nối những hành trình hạnh phúc, Hải Vân Travel tự hào với bề dày 10 năm kinh nghiệm trong lĩnh vực Lữ hành và Vận tải cao cấp. Chúng tôi không chỉ bán một chuyến đi; chúng tôi mang đến một giải pháp gắn kết toàn diện.";
const DEFAULT_DESCRIPTION2 =
  "";

interface CompanyOverviewData {
  title: string | null;
  description1: string | null;
  description2: string | null;
  big_image_url: string | null;
  small_image_url: string | null;
}

function buildImageUrl(raw: string | null | undefined): string | null {
  if (raw == null || typeof raw !== "string" || !raw.trim()) return null;
  const path = raw.startsWith("/") ? raw.slice(1) : raw;
  return `${API_BASE.replace(/\/$/, "")}/${path}`;
}

export default function IntroduceSection() {
  const [data, setData] = useState<CompanyOverviewData | null>(null);

  useEffect(() => {
    async function fetchCompanyOverview() {
      try {
        const res = await fetch(`${API_BASE}/company-overview`, {
          cache: "no-store",
        });
        if (res.ok) {
          const json = await res.json();
          setData({
            title: json?.title ?? null,
            description1: json?.description1 ?? null,
            description2: json?.description2 ?? null,
            big_image_url: json?.big_image_url ?? null,
            small_image_url: json?.small_image_url ?? null,
          });
        }
      } catch {
      }
    }
    void fetchCompanyOverview();
  }, []);

  const title = data?.title?.trim() || DEFAULT_TITLE;
  const description1 = data?.description1?.trim() || DEFAULT_DESCRIPTION1;
  const description2 = data?.description2?.trim() || DEFAULT_DESCRIPTION2;
  const bigImage = buildImageUrl(data?.big_image_url) ?? "/home/img2.svg";
  const smallImage = buildImageUrl(data?.small_image_url) ?? "/home/img1.svg";

  return (
    <section className="xl:min-h-[100vh] md:min-h-[70vh] sm:min-h-[40vh] flex justify-center items-center pt-[100px] pb-[100px] min-h-[60vh] w-full relative">
      <div className="absolute w-screen top-0 left-1/2 -translate-x-1/2 h-full bg-[url('/home/bgit.jpg')] bg-center bg-cover bg-no-repeat opacity-20 sm:hidden z-0"></div>
      <div className="relative hidden md:block">
        <div className="absolute w-[200px] h-[200px] right-0 bg-white/30 blur-3xl rounded-full top-0 left-0" />
        <div className="absolute w-[200px] h-[200px] right-0 bg-white/30 blur-3xl rounded-full top-0 left-[150px] opacity-50" />
        <div className="absolute w-[200px] h-[200px] right-0 bg-white/30 blur-3xl rounded-full top-[150px] left-0 opacity-50" />
        <div className="absolute opacity-30 blur-3xl rounded-full bg-radial from-[#904589] to-transparent w-[700px] h-[700px] z-3 top-[-100px] left-[-200px]" />
      </div>
      <div className="flex items-center h-full gap-[60px] sm:px-[90px] md:px-[120px] justify-center">
        <div className="flex-1 relative hidden sm:block min-w-0">
          <ImageFrame
            src={bigImage}
            alt="Tổng quan doanh nghiệp"
            width="100%"
            maxWidth={588}
            className="z-0"
          />
          <ImageFrame
            src={smallImage}
            alt="Hải Vân Travel"
            width="40%"
            maxWidth={294}
            className="absolute xl:bottom-[-70px] sm:bottom-[-30px] right-0 2xl:right-[15%] z-10"
          />
        </div>

        <div className="flex-1 flex-cols max-sm:items-center max-sm:px-[20px]">
          <h3 className="2xl:text-[50px] max-sm:text-center xl:text-[38px] lg:text-[30px] md:text-[22px] sm:text-[12px] font-black bg-gradient-to-r from-[#8ED6D7] to-[#4B7171] bg-clip-text text-transparent text-[24px]">
            {title}
          </h3>
          <p className="border-b py-[20px] text-[12px] 2xl:text-[16px] max-sm:text-center xl:text-[14px] lg:text-[12px] md:text-[10px] text-justify sm:text-[8px]">
            {description1}
          </p>

          <p className="py-[20px] max-sm:text-center text-justify text-[12px] 2xl:text-[16px] xl:text-[14px] lg:text-[12px] md:text-[10px] sm:text-[8px]">
            {description2}
          </p>
        </div>
      </div>
    </section>
  );
}
