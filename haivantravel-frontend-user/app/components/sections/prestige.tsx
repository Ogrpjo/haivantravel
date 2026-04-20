"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@heroui/react";
import { useEffect, useMemo, useState } from "react";
import LeftToRightText, { CardAppear, useHoverFloat } from "../effect/text-split";

const prestigeData = {
  small_text: "Khách hàng đã tin tưởng",
  big_text: "Chúng tôi",
  number_1: "680+",
  name_1: "Khách hàng doanh nghiệp tin tưởng",
  number_2: "1500+",
  name_2: "Chương trình đã triển khai",
  number_3: "860+",
  name_3: "Nhân sự đồng hành",
  number_4: "1290+",
  name_4: "Đối tác chiến lược",
}

interface StatisticApiData {
  small_text: string | null;
  big_text: string | null;
  number_1: string | null;
  name_1: string | null;
  number_2: string | null;
  name_2: string | null;
  number_3: string | null;
  name_3: string | null;
  number_4: string | null;
  name_4: string | null;
}

function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL?.trim() || "https://api.haivanevent.vn";
}

type CardProps = {
  number: string;
  description: string;

};

function PrestigeCard({ number, description }: CardProps) {
  const hoverEffect = useHoverFloat();
  return (
    <Card className="bg-gradient-to-b slide-card from-[#3F9293] h-full to-[#8E4590] max-sm:min-h-[30vw] border inset-shadow-[#FFD9E8] inset-shadow-sm/70" {...hoverEffect}>
      <div className="inset-shadow-[#FFD9E8] inset-shadow-sm/70 absolute inset-0 scale-y-[-1]" />
      <CardContent className="h-full flex flex-col xl:py-[30px] md:py-[12px] text-center max-sm:justify-center">
        <CardTitle>
          <span className="2xl:text-[50px] lg:text-[35px] md:text-[28px] sm:text-[20px] text-[20px] text-transparent bg-clip-text bg-gradient-to-r from-[#121212] to-[#4D4D4D] font-black">
            {number}
          </span>
        </CardTitle>
        <CardDescription className="lg:px-[27px]">
          <span className="text-[#121212] lg:leading-[1.4] sm:leading-[0.5] font-bold 2xl:text-[25px] xl:text-[20px] lg:text-[15px] sm:text-[11px] text-[16px]">
            {description}
          </span>
        </CardDescription>
      </CardContent>
    </Card>
  );
}

export default function Prestige() {
  const [remoteData, setRemoteData] = useState<StatisticApiData | null>(null);

  useEffect(() => {
    const loadStatistic = async () => {
      try {
        const res = await fetch(`${getApiBaseUrl()}/statistic`, { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as StatisticApiData | null;
        if (data) setRemoteData(data);
      } catch {
        // Keep fallback static content if API is unavailable.
      }
    };
    loadStatistic();
  }, []);

  const data = useMemo(() => {
    if (!remoteData) return prestigeData;
    return {
      ...prestigeData,
      small_text: remoteData.small_text || prestigeData.small_text,
      big_text: remoteData.big_text || prestigeData.big_text,
      number_1: remoteData.number_1 || prestigeData.number_1,
      name_1: remoteData.name_1 || prestigeData.name_1,
      number_2: remoteData.number_2 || prestigeData.number_2,
      name_2: remoteData.name_2 || prestigeData.name_2,
      number_3: remoteData.number_3 || prestigeData.number_3,
      name_3: remoteData.name_3 || prestigeData.name_3,
      number_4: remoteData.number_4 || prestigeData.number_4,
      name_4: remoteData.name_4 || prestigeData.name_4,
    };
  }, [remoteData]);

  return (
    <section className="lg:px-[148px] sm:px-[84px] px-[20px] py-[220px] flex flex-col md:gap-[120px] relative gap-[60px]">
      <div className="absolute w-[300px] h-[300px] bg-[#3F9293]/15 rounded-full blur-[100px] top-[10%] -left-[10%] opacity-40" />
      <div className="absolute w-[300px] h-[300px] bg-[#904589]/15 rounded-full blur-[100px] -bottom-[20%] -right-[5%] opacity-60" />
      <div className="flex flex-col items-center justify-center">
        <LeftToRightText className="bg-clip-text text-transparent bg-gradient-to-r from-[#747474] to-[#C4C4C4] text-[18px] slide-text" text={data.small_text}/>
        <LeftToRightText className="bg-clip-text text-transparent bg-gradient-to-r from-[#747474] to-[#C4C4C4] font-black lg:text-[60px] text-[30px] slide-text" text={data.big_text} />
      </div>
      <div className="sm:grid sm:grid-cols-4 sm:gap-1 md:gap-2 xl:gap-4 max-sm:flex max-sm:flex-col gap-3">
        <CardAppear translate={-50} card={<PrestigeCard number={data.number_1} description={data.name_1}/>} />
        <CardAppear translate={-350} card={<PrestigeCard number={data.number_2} description={data.name_2} />} />
        <CardAppear translate={-650} card={<PrestigeCard number={data.number_3} description={data.name_3} />} />
        <CardAppear translate={-950} card={<PrestigeCard number={data.number_4} description={data.name_4} />} />
      </div>
    </section>
  );
}
