"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import ImageFrame from "./ImageFrame";

const DEFAULT_DESCRIPTION =
  "Khởi nguồn từ tâm huyết mang lại những chuyến đi an toàn và trọn vẹn, Hải Vân Travel đã dành hơn một thập kỷ để thấu hiểu từng cung đường và mong muốn của khách hàng. Từ nền tảng vững chắc về điều hành vận tải và tour du lịch chuyên nghiệp, chúng tôi chuyển mình mạnh mẽ, trở thành đơn vị tiên phong kiến tạo các chương trình Sự kiện & Teambuilding đột phá. Với Hải Vân, mỗi sự kiện không chỉ là một buổi tụ họp, mà là hành trình đánh thức tiềm năng và gắn kết sức mạnh nội tại của doanh nghiệp.";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:2031";

export default function HeaderHomepage() {
  const [description, setDescription] = useState<string>(DEFAULT_DESCRIPTION);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAboutUs() {
      try {
        const res = await fetch(`${API_BASE}/about-us`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setDescription(
            data?.description != null ? data.description : DEFAULT_DESCRIPTION
          );
          const raw = data?.image_url;
          if (raw && typeof raw === "string") {
            const path = raw.startsWith("/") ? raw.slice(1) : raw;
            setImageUrl(`${API_BASE.replace(/\/$/, "")}/${path}`);
          }
        }
      } catch {
      }
    }
    void fetchAboutUs();
  }, []);

  return (
    <header className="lg:min-h-[100vh] md:min-h-[70vh] sm:min-h-[30vh] min-h-[60vh] flex items-center relative overflow-hidden bg-[#121212]">
      <div className="absolute inset-0 bg-black/75 z-10 sm:hidden"></div>
      <div
        className="absolute w-screen top-0 h-full 
bg-[url('/home/bghp.jpg')] bg-cover bg-center
opacity-100 sm:hidden z-0"
      ></div>
      <Image
        src="/background.svg"
        alt="background"
        width={0}
        height={0}
        className="absolute z-0 2xl:w-[100%] top-0 right-0 xl:w-[120%] xl:max-w-[120%] lg:w-[140%] lg:max-w-[140%] md:w-[110%] md:max-w-[110%] sm:w-[110%] sm:max-w-[110%] hidden sm:block"
      />
      <Image
        src="/background1.svg"
        alt="background1"
        fill
        className="absolute object-cover z-0 w-[80%] top-0 left-0 hidden sm:block"
      />
      <Image
        src="/lighten.svg"
        alt="lighten"
        width={0}
        height={0}
        className="absolute z-1 2xl:w-[70%] xl:w-[80%] lg:w-[95%] md:w-[72%] sm:w-[75%] sm:left-0 lg:left-[-190px] top-0"
      />

      <div className="flex items-center md:px-[120px] sm:px-[90px] px-[60px] justify-between w-full h-full">
        <div className="flex-1 flex items-center justify-center max-sm:text-center">
          <div className="relative z-10 max-sm:flex max-sm:items-center flex gap-3 flex-col">
            <span className="flex flex-col max-sm:items-center">
              <h1 className="text-transparent bg-gradient-to-r from-[#8ED6D7] to-[#4B7171] bg-clip-text md:text-[15px] lg:text-[25px] sm:text-[11px] font-black w-fit">
                Về chúng tôi
              </h1>
              <h3 className="inline-block text-transparent bg-gradient-to-r from-[#8ED6D7] to-[#4B7171] bg-clip-text w-fit 2xl:text-[70px] xl:text-[60px] lg:text-[50px] md:text-[30px] sm:text-[20px] text-[30px] font-black">
                Hải Vân Event 
              </h3>
            </span>
            <p className="max-w-[80%] max-sm:text-center text-justify text-[10px] xl:text-[14px] lg:text-[12px] md:text-[10px] sm:text-[8px] text-[#9B9B9B]">
              {description}
            </p>
            <a href="/about" className="relative z-30 max-sm:self-center sm:self-start w-fit px-4 py-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white rounded-[12px] border border-white/20 shadow-[0_0_10px_rgba(255,255,255,0.1)] flex items-center gap-3 transition-all duration-300 group">
              <span className="text-[14px] md:text-[12px] whitespace-nowrap lg:text-[16px] sm:text-[10px] font-medium">
                Về chúng tôi
              </span>
              <Image
                src="/play.svg"
                alt="play"
                width={15}
                height={15}
                className="relative z-10"
              />
            </a>
          </div>
        </div>
        <div className="flex-1 relative z-10 flex items-center justify-center hidden sm:block min-w-0">
          <ImageFrame
            src={imageUrl}
            alt="Hải Vân Travel"
            width={588}
            height={426}
          />
        </div>
      </div>
    </header>
  );
}
