"use client";

import { useEffect, useState } from "react";

type StatisticItem = {
  id?: number;
  title: string;
  number: string;
};

const DEFAULT_STATS: StatisticItem[] = [
  { number: "300+", title: "Khách hàng" },
  { number: "900+", title: "Chương trình đã diễn ra" },
  { number: "90+", title: "Nhân viên" },
  { number: "120+", title: "Đối tác dịch vụ" },
];

const getApiBaseUrl = () =>
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:2031";

export default function StaticSection() {
  const [statistics, setStatistics] = useState<StatisticItem[]>(DEFAULT_STATS);

  useEffect(() => {
    let isActive = true;
    const loadStatistics = async () => {
      try {
        const res = await fetch(`${getApiBaseUrl()}/statistics`);
        if (!res.ok) return;
        const data: StatisticItem[] = await res.json();
        if (!isActive || !Array.isArray(data) || data.length === 0) return;
        setStatistics(data);
      } catch {
        // ignore fetch errors and keep defaults
      }
    };

    loadStatistics();
    return () => {
      isActive = false;
    };
  }, []);

  return (
    <section className="xl:min-h-[40vh] md:min-h-[20vh] min-h-[20vh] md:px-[120px] px-[30px] flex justify-center items-center">
      <div className="flex font-bold w-full gap-[10px] bg-gradient-to-b from-[#3F9293] to-[#8E4590] rounded-[12px]">
        <div className="flex grid grid-cols-2 grid-rows-2 justify-between items-center w-full py-[10px] sm:px-[60px]">
          {statistics.slice(0, 4).map((item, index) => (
            <p key={item.id ?? `${item.title}-${index}`} className="flex gap-1 sm:gap-3 items-center justify-center">
              <span className="bg-gradient-to-br from-[#000000] to-[#515151] text-transparent bg-clip-text 2xl:text-[45px] xl:text-[28px] lg:text-[25px] md:text-[22px] text-[14px]">
                {item.number}
              </span>
              <span className="2xl:text-[25px] text-black xl:text-[25px] lg:text-[15px] md:text-[10px] sm:text-[9px] text-[10px]">
                {item.title}
              </span>
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
