import { useEffect, useMemo, useState } from "react";
import LeftToRightText, { HoverZoomImage, HoverZoomWrapper } from "../effect/text-split";

const experienceData = {
  small_text: "Kinh nghiệm thực chiến",
  big_text: "Hơn 1500+ sự kiện được tổ chức thành công",
  description: "Từ startup 50 người đến tập đoàn đa quốc gia, chúng tôi đã đồng hành và thực hiện thành công hàng nghìn chương trình sự kiện lớn nhỏ trên khắp cả nước và quốc tế."
}

type ExpImageProps = {
  type: string;
  src: string;
};

function ExpImage({ type, src }: ExpImageProps) {
  return (
    <div className="relative rounded-[14px] overflow-hidden w-full h-full">
      <img src={src} className="object-cover z-0 absolute inset-0 w-full h-full" alt={type} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-10" />
      <LeftToRightText text={type} className="absolute z-20 bottom-0 left-0 px-[15px] py-[10px] text-[12px] md:text-[16px] text-white font-medium slide-text" />
    </div>
  );
}

const experienceImageData = [
  { src: "/home/experience-1.webp", type: "Gala Dinner 2024" },
  { src: "/home/experience-2.webp", type: "Team building Q1" },
  { src: "/home/experience-3.webp", type: "Conference APAC" },
  { src: "/home/experience-4.webp", type: "Year End Party" },
]

type ExperienceApiData = {
  small_text: string | null;
  big_text: string | null;
  description: string | null;
  big_image_url: string | null;
  small_image_1_url: string | null;
  small_image_1_name: string | null;
  small_image_2_url: string | null;
  small_image_2_name: string | null;
  small_image_3_url: string | null;
  small_image_3_name: string | null;
  small_image_4_url: string | null;
  small_image_4_name: string | null;
};

function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL?.trim() || "https://api.haivanevent.vn";
}

function normalizeImageUrl(url: string | null, fallback: string): string {
  if (!url) return fallback;
  if (/^https?:\/\//i.test(url)) return url;
  return `${getApiBaseUrl().replace(/\/+$/, "")}/${url.replace(/^\/+/, "")}`;
}

function LeftContent({ data, images }: { data: typeof experienceData; images: typeof experienceImageData }) {
  return (
    <div className="flex-1 h-1/2 lg:h-full flex flex-col">
      <div className="flex flex-col gap-[15px] lg:gap-[25px] shrink-0">
        <LeftToRightText text={data.small_text} className="bg-clip-text text-transparent bg-gradient-to-r from-[#747474] to-[#C4C4C4] text-[14px] md:text-[16px] max-sm:text-center slide-text" />
        <LeftToRightText text={data.big_text} className="text-[22px] md:text-[30px] xl:text-[40px] 2xl:text-[59px] bg-clip-text text-transparent bg-gradient-to-r from-[#8ED6D7] to-[#4B7171] font-black leading-tight max-sm:text-center slide-text" />
        <LeftToRightText text={data.description} className="text-white/70 text-[14px] md:text-[16px] leading-relaxed lg:line-clamp-none max-sm:text-center slide-text" />
      </div>
      <div className="grid grid-cols-2 pt-[20px] lg:pt-[40px] gap-[15px] lg:gap-[30px] flex-1">
        {images.map((image, index) => (
          <HoverZoomWrapper key={index}>
              <ExpImage src={image.src} type={image.type} />
          </HoverZoomWrapper> 
        ))}
      </div>
    </div>
  );
}

function RightContent({ imageUrl }: { imageUrl: string }) {
  const useEffect = HoverZoomImage();
  return (
    <div {...useEffect} className="flex-1 h-1/2 lg:h-full relative rounded-[16px] overflow-hidden">
      <img src={imageUrl} alt="experience hero" className="object-cover absolute inset-0 w-full h-full" />
    </div>
  );
}

export default function Experience() {
  const [remoteData, setRemoteData] = useState<ExperienceApiData | null>(null);
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${getApiBaseUrl()}/experience-content`, { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as ExperienceApiData | null;
        if (data) setRemoteData(data);
      } catch {
        // Keep fallback static content.
      }
    };
    load();
  }, []);

  const data = useMemo(() => {
    if (!remoteData) return experienceData;
    return {
      small_text: remoteData.small_text || experienceData.small_text,
      big_text: remoteData.big_text || experienceData.big_text,
      description: remoteData.description || experienceData.description,
    };
  }, [remoteData]);

  const images = useMemo(() => {
    if (!remoteData) return experienceImageData;
    return [
      {
        src: normalizeImageUrl(remoteData.small_image_1_url, experienceImageData[0].src),
        type: remoteData.small_image_1_name || experienceImageData[0].type,
      },
      {
        src: normalizeImageUrl(remoteData.small_image_2_url, experienceImageData[1].src),
        type: remoteData.small_image_2_name || experienceImageData[1].type,
      },
      {
        src: normalizeImageUrl(remoteData.small_image_3_url, experienceImageData[2].src),
        type: remoteData.small_image_3_name || experienceImageData[2].type,
      },
      {
        src: normalizeImageUrl(remoteData.small_image_4_url, experienceImageData[3].src),
        type: remoteData.small_image_4_name || experienceImageData[3].type,
      },
    ];
  }, [remoteData]);

  const bigImage = useMemo(
    () => normalizeImageUrl(remoteData?.big_image_url ?? null, "/home/experience-hero.webp"),
    [remoteData],
  );

  return (
    <section className="relative h-[120vh] lg:h-[80vh] xl:h-[115vh] 2xl:h-[95vh] py-[60px] lg:py-[100px] flex flex-col lg:flex-row xl:gap-[80px] sm:gap-[40px] gap-10 lg:px-[148px] sm:px-[84px] px-[20px]">
      <LeftContent data={data} images={images} />
      <RightContent imageUrl={bigImage} />
    </section>
  );
}
