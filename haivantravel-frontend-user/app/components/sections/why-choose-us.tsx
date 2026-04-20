"use client";

import { Check } from "@deemlol/next-icons";
import ButtonGradient from "../button-gradient";
import LeftToRightText, { CardAppear, HoverZoomImage } from "../effect/text-split";
import { useEffect, useMemo, useState } from "react";

const WhyChooseUsData = {
  image_url: "/home/whychooseus.webp",
  small_text: "Tại sao chọn chúng tôi",
  big_text: "Chuyên nghiệp từ khâu lên kế hoạch đến thực thi",
  description: "Chúng tôi không chỉ tổ chức sự kiện — chúng tôi kiến tạo những trải nghiệm đáng nhớ. Mỗi chi tiết đều được chăm chút tỉ mỉ, từ concept sáng tạo, thiết kế không gian cho đến quản lý hiện trường chuyên nghiệp.",

}

const committedData = [
  {name: "Đội ngũ 860+ nhân sự giàu kinh nghiệm"},
  {name: "Quy trình chuẩn ISO, minh bạch và hiệu quả"},
  {name: "Cam kết 100% hài lòng hoặc hoàn tiền"},
  {name: "Hỗ trợ 24/7 trong suốt quá trình tổ chức"},
]

type WhyChooseUsApiData = {
  image_url: string | null;
  small_text: string | null;
  big_text: string | null;
  description: string | null;
  tick_1: string | null;
  tick_2: string | null;
  tick_3: string | null;
  tick_4: string | null;
};

function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL?.trim() || "https://api.haivanevent.vn";
}

function normalizeImageUrl(url: string | null): string {
  if (!url) return WhyChooseUsData.image_url;
  if (/^https?:\/\//i.test(url)) return url;
  return `${getApiBaseUrl().replace(/\/+$/, "")}/${url.replace(/^\/+/, "")}`;
}

function LeftContent({ imageUrl }: { imageUrl: string }) {
  const useEffect = HoverZoomImage();
  return (
    <div {...useEffect} className="flex-1 relative min-h-[350px] sm:min-h-0 bg-gray-300 rounded-[20px] overflow-hidden order-2 sm:order-1">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={imageUrl} className="object-cover absolute inset-0 h-full w-full" alt="why choose us image" />
      <div className="absolute inset-0 z-10 inset-shadow-sm inset-shadow-white/50 pointer-events-none"></div>
      <div className="absolute inset-0 z-10 inset-shadow-sm inset-shadow-white/50 pointer-events-none scale-y-[-1]"></div>
    </div>
  );
}

interface CheckBoxProps {
  name: string;
};

function CheckBoxItem({ name }: CheckBoxProps) {
  return (
    <div className="flex items-center gap-3 w-fit">
      <div className="rounded-full bg-gradient-to-b from-[#3F9293] to-[#8E4590] flex-shrink-0 px-1 py-1">
        <Check size={20} />
      </div>
      <p className="xl:text-[14px] sm:text-[12px] text-white text-left">
        {name}
      </p>
    </div>
  );
}

function RightContent({ data, ticks }: { data: typeof WhyChooseUsData; ticks: { name: string }[] }) {
  return (
    <div className="flex-1 flex flex-col xl:gap-[40px] md:gap-[20px] gap-6 max-sm:text-center max-sm:items-center order-1 sm:order-2">
      <div className="flex flex-col gap-2">
        <LeftToRightText text={data.small_text} className="bg-clip-text text-transparent bg-gradient-to-r from-[#747474] to-[#C4C4C4] text-[18px] sm:text-[12px] md:text-[16px] slide-text" />
        <LeftToRightText text={data.big_text} className="2xl:text-[59px] md:text-[30px] xl:text-[40px] sm:text-[20px] text-[30px] bg-clip-text text-transparent bg-gradient-to-r from-[#8ED6D7] to-[#4B7171] font-black leading-tight slide-text" />
      </div>

      <LeftToRightText text={data.description} className="text-white/70 xl:text-[18px] sm:text-[12px] md:text-[16px] leading-relaxed slide-text" />

      <CardAppear card={<>
        <div className="slide-card flex flex-col xl:gap-[20px] lg:gap-[10px] gap-[10px] w-full items-center sm:items-start">
          <div className="flex flex-col gap-[10px] items-start w-fit">
            {ticks.map((comitted, index) => (
              <CheckBoxItem key={index} name={comitted.name}/>
            ))}
          </div>
        </div></>} translate={-50} />

      <ButtonGradient name="Tư vấn miễn phí" />
    </div>
  );
}

export default function WhyChooseUs() {
  const [remoteData, setRemoteData] = useState<WhyChooseUsApiData | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${getApiBaseUrl()}/why-choose-us`, { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as WhyChooseUsApiData | null;
        if (data) setRemoteData(data);
      } catch {
        // Keep fallback static content if API is unavailable.
      }
    };
    load();
  }, []);

  const data = useMemo(() => {
    if (!remoteData) return WhyChooseUsData;
    return {
      ...WhyChooseUsData,
      image_url: normalizeImageUrl(remoteData.image_url),
      small_text: remoteData.small_text || WhyChooseUsData.small_text,
      big_text: remoteData.big_text || WhyChooseUsData.big_text,
      description: remoteData.description || WhyChooseUsData.description,
    };
  }, [remoteData]);

  const ticks = useMemo(() => {
    if (!remoteData) return committedData;
    const items = [
      remoteData.tick_1,
      remoteData.tick_2,
      remoteData.tick_3,
      remoteData.tick_4,
    ]
      .map((t) => (t ?? "").trim())
      .filter(Boolean)
      .map((name) => ({ name }));
    return items.length ? items : committedData;
  }, [remoteData]);

  return (
    <section className="py-16 px-[20px] sm:px-[84px] lg:px-[148px] flex flex-col sm:flex-row xl:gap-[80px] sm:gap-[40px] gap-10">
      <LeftContent imageUrl={data.image_url} />
      <RightContent data={data} ticks={ticks} />
    </section>
  );
}
