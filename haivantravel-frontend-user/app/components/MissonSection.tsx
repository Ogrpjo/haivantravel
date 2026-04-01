"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import ImageFrameEmotion from "./ImageFrameEmotion";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "https://api.haivanevent.vn";

const DEFAULT_TITLE = "Những người kiến tạo cảm xúc";
const DEFAULT_DESCRIPTION =
  '"Đội ngũ của chúng tôi không chỉ là những nhân viên lữ hành, mà là những "Kiến trúc sư trải nghiệm" luôn tận tụy với từng nụ cười của khách hàng"';
const DEFAULT_DESCRIPTION_DETAIL =
  "Hải Vân Travel mang sứ mệnh nâng tầm văn hóa doanh nghiệp thông qua những chương trình Sự kiện & Teambuilding khác biệt. Chúng tôi không chỉ tổ chức sự kiện, chúng tôi kiến tạo những điểm chạm cảm xúc để kết nối con người, khơi thông sức mạnh và đồng hành cùng sự phát triển trường tồn của quý đối tác.";

interface EmotionCreatorData {
  id: number;
  title: string | null;
  description: string | null;
  description_detail: string | null;
  left_image_url: string | null;
  center_image_url: string | null;
  right_image_url: string | null;
}

function buildImageUrl(raw: string | null | undefined): string | null {
  if (raw == null || typeof raw !== "string" || !raw.trim()) return null;
  const path = raw.startsWith("/") ? raw.slice(1) : raw;
  return `${API_BASE.replace(/\/$/, "")}/${path}`;
}

export default function MissonSection() {
  const [data, setData] = useState<EmotionCreatorData | null>(null);

  useEffect(() => {
    async function fetchEmotionCreator() {
      try {
        const res = await fetch(`${API_BASE}/emotion-creator`, {
          cache: "no-store",
        });
        if (res.ok) {
          const json = await res.json();
          setData({
            id: json?.id ?? 0,
            title: json?.title ?? null,
            description: json?.description ?? null,
            description_detail: json?.description_detail ?? null,
            left_image_url: json?.left_image_url ?? null,
            center_image_url: json?.center_image_url ?? null,
            right_image_url: json?.right_image_url ?? null,
          });
        }
      } catch {
        // giữ nội dung mặc định
      }
    }
    void fetchEmotionCreator();
  }, []);

  const title = data?.title?.trim() || DEFAULT_TITLE;
  const description = data?.description?.trim() || DEFAULT_DESCRIPTION;
  const descriptionDetail =
    data?.description_detail?.trim() || DEFAULT_DESCRIPTION_DETAIL;
  const leftImage = buildImageUrl(data?.left_image_url) ?? "/img6.svg";
  const centerImage = buildImageUrl(data?.center_image_url) ?? "/img5.svg";
  const rightImage = buildImageUrl(data?.right_image_url) ?? "/img4.svg";

  return (
    <section className="xl:min-h-[100vh] md:min-h-[70vh] min-h-[40vh] flex flex-row sm:px-[120px] px-[30px] relative overflow-hidden">
      <Image src="/bgg.svg" alt="bgg" fill className="w-[100%] max-sm:max-w-[150%] max-sm:w-[150%] absolute top-0 right-0" />
      <div className="flex-3 flex items-center justify-center relative hidden sm:flex min-h-[320px]">
        <div className="relative w-full max-w-[640px] h-[360px] sm:h-[420px]">
          <ImageFrameEmotion
            src={leftImage}
            alt="Sự kiện"
            width="55%"
            maxWidth={280}
            className="absolute left-[-10%] xl:top-[60%] top-[25%] lg:top-[40%] z-[1]"
          />
          <ImageFrameEmotion
            src={rightImage}
            alt="Teambuilding"
            width="60%"
            maxWidth={290}
            className="absolute right-0 top-[7%] z-[4]"
          />
          <ImageFrameEmotion
            src={centerImage}
            alt={title}
            width="90%"
            maxWidth={580}
            className="absolute left-[4%] top-0 z-[3]"
          />
        </div>
      </div>
      <div className="flex-2 flex justify-center flex-col max-sm:items-center max-sm:px-[20px]">
          <h3 className="2xl:text-[50px] max-sm:text-center xl:text-[38px] lg:text-[30px] md:text-[22px] sm:text-[12px] font-black bg-gradient-to-r from-[#8ED6D7] to-[#4B7171] bg-clip-text text-transparent text-[24px]">
            {title}
          </h3>
          <p className="font-bold py-[10px] text-[12px] 2xl:text-[16px] max-sm:text-center xl:text-[14px] lg:text-[12px] md:text-[10px] text-justify sm:text-[8px]">
            {description}
          </p>

          <p className="max-sm:text-center text-justify text-[12px] 2xl:text-[16px] xl:text-[14px] lg:text-[12px] md:text-[10px] sm:text-[8px]">
            {descriptionDetail}
          </p>
        </div>
    </section>
  );
}
