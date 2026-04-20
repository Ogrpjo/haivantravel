"use client";

import { Button } from "@heroui/react";
import { useEffect, useMemo, useState } from "react";
import ButtonGradient from "../button-gradient";
import LeftToRightText, { CountingNumber } from "../effect/text-split";

interface StatItem {
  number: number;
  name: string;
}

interface StaticsProps {
  stats: StatItem[];
}

const defaultAboutUsData = {
  image_url: "/home/hero.webp",
  small_text: "Đơn vị tổ chức sự kiện doanh nghiệp hàng đầu",
  big_text: "Kiến tạo sự kiện đỉnh cao ",
  description:
    "Với đội ngũ trẻ đầy nhiệt huyết, Hải Vân Event tự hào là cầu nối gắn kết doanh nghiệp qua những kiến tạo giàu cảm xúc.",
  is_active: true,
  stats: [
    { number: 680, name: "Doanh nghiệp" },
    { number: 1534, name: "Sự kiện" },
    { number: 12, name: "Năm kinh nghiệm" },
    { number: 1290, name: "Đối tác chiến lược" }
  ]
};

interface AboutUsApiData {
  id: number;
  image_url: string | null;
  small_text: string | null;
  big_text: string | null;
  description: string | null;
  is_active: boolean;
}

interface AboutUsStatisticApiData {
  number_1: number;
  name_1: string | null;
  number_2: number;
  name_2: string | null;
  number_3: number;
  name_3: string | null;
  number_4: number;
  name_4: string | null;
}

function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL?.trim() || "https://api.haivanevent.vn";
}

function normalizeImageUrl(url: string | null): string {
  if (!url) return defaultAboutUsData.image_url;
  if (/^https?:\/\//i.test(url)) return url;
  return `${getApiBaseUrl().replace(/\/+$/, "")}/${url.replace(/^\/+/, "")}`;
}

function Statics({ stats }: StaticsProps) {
  return (
    <div className="flex xl:max-w-[75%] md:max-w-[100%] w-full justify-between py-[30px]">
      {stats.map((stat, index) => (
        <span key={index} className="flex flex-col">
          <CountingNumber
            className="lg:text-[35px] text-[25px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#8ED6D7] to-[#4B7171] h-[3.3em]"
            endValue={stat.number}
          />
          <LeftToRightText
            className="text-[#9B9B9B] lg:text-[16px] text-[12px] slide-text"
            text={stat.name}
          />
        </span>
      ))}
    </div>
  );
}

export default function AboutUs() {
  const [remoteData, setRemoteData] = useState<AboutUsApiData | null>(null);
  const [remoteStatistics, setRemoteStatistics] = useState<AboutUsStatisticApiData | null>(null);

  useEffect(() => {
    const loadAboutUs = async () => {
      try {
        const res = await fetch(`${getApiBaseUrl()}/about-us`, { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as AboutUsApiData | null;
        if (data) setRemoteData(data);

        const statisticRes = await fetch(`${getApiBaseUrl()}/about-us-statistic`, {
          cache: "no-store",
        });
        if (statisticRes.ok) {
          const statisticData = (await statisticRes.json()) as AboutUsStatisticApiData | null;
          if (statisticData) setRemoteStatistics(statisticData);
        }
      } catch {
        // Keep default content if API is unavailable.
      }
    };
    loadAboutUs();
  }, []);

  const data = useMemo(() => {
    if (!remoteData) return defaultAboutUsData;
    return {
      ...defaultAboutUsData,
      image_url: normalizeImageUrl(remoteData.image_url),
      small_text: remoteData.small_text || defaultAboutUsData.small_text,
      big_text: remoteData.big_text || defaultAboutUsData.big_text,
      description: remoteData.description || defaultAboutUsData.description,
      is_active: remoteData.is_active,
      stats: remoteStatistics
        ? [
            {
              number: remoteStatistics.number_1 ?? defaultAboutUsData.stats[0].number,
              name: remoteStatistics.name_1 || defaultAboutUsData.stats[0].name,
            },
            {
              number: remoteStatistics.number_2 ?? defaultAboutUsData.stats[1].number,
              name: remoteStatistics.name_2 || defaultAboutUsData.stats[1].name,
            },
            {
              number: remoteStatistics.number_3 ?? defaultAboutUsData.stats[2].number,
              name: remoteStatistics.name_3 || defaultAboutUsData.stats[2].name,
            },
            {
              number: remoteStatistics.number_4 ?? defaultAboutUsData.stats[3].number,
              name: remoteStatistics.name_4 || defaultAboutUsData.stats[3].name,
            },
          ]
        : defaultAboutUsData.stats,
    };
  }, [remoteData, remoteStatistics]);

  if (!data.is_active) return null;

  return (
    <section className="flex relative z-0 flex-row lg:pl-[148px] w-full sm:pl-[84px] pt-[150px]">
      <div className="absolute w-[300px] h-[300px] bg-[#3F9293]/15 rounded-full blur-[50px] left-[10%] top-[65%] opacity-40" />
      <div className="absolute w-[300px] h-[300px] bg-[#3F9293]/15 rounded-full blur-[50px] left-[25%] top-[30%] opacity-40" />
      <div className="sm:flex-1 relative z-10 gap-3 flex-col sm:items-start items-center flex justify-center max-sm:px-[20px]">
        <LeftToRightText
          className="text-[#9B9B9B] lg:text-[20px] text-[12px] text-center pt-[30px] slide-text"
          text={data.small_text}
        />
        <LeftToRightText
          className="font-bold 2xl:text-[90px] xl:text-[80px] lg:text-[60px] md:text-[40px] text-[30px] bg-gradient-to-r from-[#8ED6D7] to-[#4B7171] bg-clip-text text-transparent leading-[1.2] max-w-[90%] max-sm:text-center slide-text"
          text={data.big_text}
        />
        <LeftToRightText
          className="text-[#9B9B9B] lg:text-[20px] text-[12px] max-w-[80%] max-sm:text-justify slide-text"
          text={data.description}
        />
        <div className="flex gap-3 pt-6">
          <ButtonGradient name="Nhận tư vấn Concept" />
          <Button className="rounded-[12px] h-auto bg-white/4 border-t shadow-[#CECECE]/14 shadow-1">
            <p className="lg:text-[18px] text-[12px]">Xem hồ sơ năng lực</p>
          </Button>
        </div>
        <Statics stats={data.stats} />
      </div>
      <div className="sm:flex-1 relative">
        <img
          src={data.image_url}
          alt="hero image"
          className="object-cover absolute inset-0 h-full w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#121212]/1 to-[#121212]/80" />
        <div className="absolute inset-0 bg-gradient-to-l from-[#121212]/1 to-[#121212]/80" />
      </div>
      <div className="sm:hidden opacity-20">
        <img
          src={data.image_url}
          alt="hero img"
          className="object-cover absolute inset-0 h-full w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#121212]/1 to-[#121212]/80" />
        <div className="absolute inset-0 bg-gradient-to-l from-[#121212]/1 to-[#121212]/80" />
      </div>
    </section>
  );
}
