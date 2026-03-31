"use client";

import Image from "next/image";
import PartnerCard from "./partnetCard";
import { useEffect, useState } from "react";
import AutoScrollPartners from "./AutoScrollPartners";

const ITEMS_PER_PAGE = 10;

type PartnerItem = {
  id: number;
  src: string;
  width: number;
  title: string;
};

type PartnerFromApi = {
  id: number;
  business_type: string;
  icon: string;
  icon_size: number;
  is_active: boolean;
};

function buildPartnerSrc(iconPath: string, apiBaseUrl: string): string {
  if (!iconPath || typeof iconPath !== "string") return "";
  const trimmed = iconPath.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://"))
    return trimmed;
  const base = apiBaseUrl.replace(/\/$/, "");
  const filename = trimmed.split(/[/\\]/).pop()?.trim() ?? trimmed;
  if (!filename) return "";
  return `${base}/uploads/${filename}`;
}

export default function PartnerList() {
  const [partners, setPartners] = useState<PartnerItem[]>([]);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_URL || "https://api.haivanevent.vn";

  useEffect(() => {
    let cancelled = false;
    async function fetchPartners() {
      try {
        const res = await fetch(`${apiBaseUrl}/partners/active`, {
          cache: "no-store",
        });
        if (!res.ok) return;
        const data = (await res.json()) as PartnerFromApi[];
        if (cancelled) return;
        setPartners(
          data.map((p) => ({
            id: p.id,
            width: p.icon_size,
            title: p.business_type,
            src: buildPartnerSrc(p.icon, apiBaseUrl),
          })),
        );
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    void fetchPartners();
    return () => {
      cancelled = true;
    };
  }, [apiBaseUrl]);

  const start = page * ITEMS_PER_PAGE;
  const visiblePartners = partners.slice(start, start + ITEMS_PER_PAGE);

  const handleNextPage = () => {
    if ((page + 1) * ITEMS_PER_PAGE < partners.length) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  return (
    <section className="lg:min-h-[100vh] w-screen flex justify-center items-center bg-[#121212] md:min-h-[70vh] min-h-[50vh] pb-[60px] max-w-[1920px] relative">
      <Image
        src="background2.svg"
        alt="background2"
        width={0}
        height={0}
        className="sm:w-[100%] w-[150%] max-w-[150%] absolute left-0 z-0"
      />
      <div className="flex flex-col w-full sm:px-[30px] relative z-10">
        <div className="md:px-[90px] sm:px-[60px] flex flex-col my-[50px] max-sm:items-center max-sm:justify-center">
          <h1 className="text-transparent bg-gradient-to-r from-[#8ED6D7] to-[#4B7171] bg-clip-text md:text-[15px] lg:text-[25px] sm:text-[11px] font-black w-fit">
            Khách hàng đã tin tưởng
          </h1>
          <h3 className="text-transparent bg-gradient-to-r from-[#8ED6D7] to-[#4B7171] bg-clip-text 2xl:text-[70px] xl:text-[60px] lg:text-[50px] md:text-[30px] w-fit sm:text-[20px] text-[30px] font-black">
            Chúng tôi
          </h3>
        </div>
        <div className="flex items-center justify-between">
        <button
            onClick={handlePrevPage}
            className="bg-white/18 flex items-center justify-center xl:h-[120px] xl:w-[55px] lg:h-[100px] lg:w-[45px] md:h-[80px] md:w-[40px] sm:h-[70px] sm:w-[35px] rounded-full"
          >
            <Image
              src="/arrow-backward.svg"
              alt="arrow backward"
              width={20}
              height={20}
            />
          </button>
          <div className="w-full">
            {isLoading ? (
              <div className="flex justify-center items-center min-h-[200px] text-[#8ED6D7]">
                Đang tải...
              </div>
            ) : (
              <>
                <div className="sm:hidden w-screen">
                  <AutoScrollPartners partners={partners} />
                </div>

                <div className="hidden w-full sm:grid grid-cols-5 grid-rows-2 gap-[20px] px-[30px]">
                  {Array.from({ length: 10 }).map((_, index) => {
                    const partner = visiblePartners[index];

                    return partner ? (
                      <PartnerCard
                        key={`partner-slot-${index}`}
                        src={partner.src}
                        width={partner.width}
                        title={partner.title}
                      />
                    ) : (
                      <div key={`partner-slot-${index}`} className="w-screen" />
                    );
                  })}
                </div>
              </>
            )}
          </div>
          <button
            onClick={handleNextPage}
            className="bg-white/18 flex items-center justify-center xl:h-[120px] xl:w-[55px] lg:h-[100px] lg:w-[45px] md:h-[80px] md:w-[40px] sm:h-[70px] sm:w-[35px] rounded-full"
          >
            <Image
              src="/arrow-forward.svg"
              alt="arrow forward"
              width={29}
              height={20}
            />
          </button>
        </div>
      </div>
    </section>
  );
}
