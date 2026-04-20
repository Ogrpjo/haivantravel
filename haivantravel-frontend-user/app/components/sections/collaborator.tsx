"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@heroui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import LeftToRightText from "../effect/text-split";

type CollaCardProps = {
  src: string;
};

const defaultCollaboratorData = {
  blue_text_1: "KHÁCH HÀNG",
  blue_text_2: "ĐỐI TÁC",
  first_text: "ĐƯỢC TIN TƯỞNG BỞI",
  last_text: "CỦA CHÚNG TÔI",
  description: "Những doanh nghiệp đã tin tưởng Hải Vân Event"
}

type CollaboratorContentApi = {
  first_text: string | null;
  blue_text_1: string | null;
  blue_text_2: string | null;
  last_text: string | null;
  description: string | null;
};

type PartnerApi = {
  id: number;
  business_type: string;
  icon: string;
  is_active: boolean;
};

function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL?.trim() || "https://api.haivanevent.vn";
}

function buildPartnerIconUrl(iconPath: string): string {
  if (!iconPath) return "";
  if (/^https?:\/\//i.test(iconPath)) return iconPath;

  const normalized = iconPath.replace(/\\/g, "/");
  // If backend already returns a public path like `upload/...`, use it directly.
  if (normalized.startsWith("upload/")) {
    return `${getApiBaseUrl().replace(/\/+$/, "")}/${normalized}`;
  }
  const filename = normalized.split("/").filter(Boolean).pop();
  if (!filename) return "";
  // Otherwise treat it as a filename stored in the shared `/upload` folder.
  return `${getApiBaseUrl().replace(/\/+$/, "")}/upload/${encodeURIComponent(filename)}`;
}

function CollaCard({ src }: CollaCardProps) {
  return (
    <Card className="bg-transparent rounded-none border-t border-r border-black h-full w-full shadow-none hover:bg-white/5 transition-colors duration-300 group">
      <CardContent className="flex items-center justify-center p-6 transition-all duration-300">
        <img
          src={src}
          alt="collaborator logo"
          className="h-[60px] w-[120px] object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
        />
      </CardContent>
    </Card>
  );
}

function LeftList({ data }: { data: typeof defaultCollaboratorData }) {
  return (
    <div className="flex-2 relative border-r-3 h-[60vh] flex items-center justify-center">
      <div className="absolute h-full border-r-[40px] -right-[8%] blur-xl opacity-13 hidden sm:flex" />
      <div className="absolute w-[400px] h-[400px] bg-[#3F9293]/15 rounded-full blur-[40px] bottom-0 opacity-40" />
      <div className="shadow-[-10px_0_25px_-5px] shadow-white/3 px-[20px] py-[20px]">
        <LeftToRightText className="font-bold lg:text-[20px] xl:text-[30px] max-w-[80%] leading-tight text-white uppercase slide-text" text={<> {data.first_text}{" "}
          <span className="text-[#8ED6D7]">
            {data.blue_text_1} & {data.blue_text_2}
          </span>{" "}
          {data.last_text}
        </>} />
        <LeftToRightText className="text-[#9B9B9B] max-lg:text-[12px] mt-2 slide-text" text={data.description}/>
      </div>
    </div>
  );
}

function RightList({ collaborators }: { collaborators: { src: string }[] }) {
  if (collaborators.length === 0) return null;

  const repeated = [...collaborators];
  while (repeated.length < 24) {
    repeated.push(...collaborators);
  }

  const row1 = repeated.slice(0, 8);
  const row2 = repeated.slice(8, 16);
  const row3 = repeated.slice(16, 24);
  const rows = [row1, row2, row3];

  return (
    <div className="flex-5 w-full overflow-hidden relative">
      <div className="bg-white absolute left-0 h-full border-l-3 sm:hidden" />
      <div className="absolute h-full border-r-[40px] left-0 blur-xl opacity-13 sm:hidden" />
      <div className="border-l border-b border-black h-full w-full flex flex-col">
        {rows.map((rowData, rowIndex) => (
          <div key={rowIndex} className="h-1/3 w-full">
            <Swiper
              modules={[Autoplay]}
              slidesPerView={2}
              breakpoints={{
                640: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
              }}
              spaceBetween={0}
              speed={2000}
              autoplay={{
                delay: 0,
                disableOnInteraction: false,
              }}
              loop={true}
              className="h-full w-full"
            >
              {rowData.map((item, idx) => (
                <SwiperSlide key={idx} className="h-full">
                  <CollaCard src={item.src} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ))}
      </div>
      <style jsx global>{`
        .swiper-wrapper {
          transition-timing-function: linear !important;
        }
      `}</style>
    </div>
  );
}

function MainContent({
  data,
  collaborators,
}: {
  data: typeof defaultCollaboratorData;
  collaborators: { src: string }[];
}) {
  return (
    <div className="flex flex-row max-sm:flex-col lg:pl-[148px] sm:pl-[84px] pl-[20px] h-full w-full">
      <LeftList data={data} />
      <RightList collaborators={collaborators} />
    </div>
  );
}

export default function Collaborator() {
  const [content, setContent] = useState<CollaboratorContentApi | null>(null);
  const [partners, setPartners] = useState<PartnerApi[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [contentRes, partnersRes] = await Promise.all([
          fetch(`${getApiBaseUrl()}/collaborator-content`, { cache: "no-store" }),
          fetch(`${getApiBaseUrl()}/partners/active`, { cache: "no-store" }),
        ]);

        if (contentRes.ok) {
          const contentData = (await contentRes.json()) as CollaboratorContentApi | null;
          if (contentData) setContent(contentData);
        }

        if (partnersRes.ok) {
          const partnerData = (await partnersRes.json()) as PartnerApi[];
          setPartners(Array.isArray(partnerData) ? partnerData : []);
        }
      } catch {
        // Keep fallback content when API is unavailable.
      }
    };
    load();
  }, []);

  const displayContent = useMemo(
    () => ({
      first_text: content?.first_text || defaultCollaboratorData.first_text,
      blue_text_1: content?.blue_text_1 || defaultCollaboratorData.blue_text_1,
      blue_text_2: content?.blue_text_2 || defaultCollaboratorData.blue_text_2,
      last_text: content?.last_text || defaultCollaboratorData.last_text,
      description: content?.description || defaultCollaboratorData.description,
    }),
    [content],
  );

  const collaboratorCards = useMemo(() => {
    const mapped = partners
      .filter((item) => item.is_active)
      .map((item) => ({
        src: buildPartnerIconUrl(item.icon),
      }))
      .filter((item) => item.src);

    if (mapped.length > 0) return mapped;
    return [
      { src: "/slider/bacha.webp" },
      { src: "/slider/vietjet.webp" },
      { src: "/slider/ursin.webp" },
      { src: "/slider/trobz.webp" },
      { src: "/slider/jollibee.webp" },
    ];
  }, [partners]);

  return (
    <section className="min-h-[80vh] bg-[#121212] relative z-10 flex items-center overflow-hidden">
      <MainContent data={displayContent} collaborators={collaboratorCards} />
    </section>
  );
}