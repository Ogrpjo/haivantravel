"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@heroui/react";
import { EventIcon1, EventIcon2, EventIcon3, EventIcon4, EventIcon5, EventIcon6 } from "../icons";
import LeftToRightText, { useHoverFloat } from "../effect/text-split";
import { useEffect, useMemo, useState } from "react";

const eventData = {
  small_text: "Chúng tôi cung cấp",
  big_text: "Dịch vụ sự kiện",
  right_text: "Từ ý tưởng đến thực thi, chúng tôi cung cấp đầy đủ các giải pháp sự kiện toàn diện cho doanh nghiệp của bạn.",
}

const eventCardData = [
  { type: "Corporate Event", title: "Tổ chức sự kiện doanh nghiệp", description: "Lên kế hoạch và thực thi toàn diện các sự kiện lớn nhỏ dành cho doanh nghiệp: lễ khánh thành, ra mắt sản phẩm, anniversary...", icon: <EventIcon1 /> },
  { type: "Team building", title: "Team Building & Gắn kết", description: "Chương trình hoạt động ngoài trời sáng tạo, giúp tăng cường tinh thần đồng đội, xây dựng văn hóa doanh nghiệp bền vững.", icon: <EventIcon2 /> },
  { type: "Conference", title: "Hội nghị & Hội thảo", description: "Tổ chức hội nghị, hội thảo chuyên nghiệp với đầy đủ thiết bị, âm thanh ánh sáng, dịch thuật và hậu cần đẳng cấp.", icon: <EventIcon3 /> },
  { type: "Gala Dinner", title: "Gala Dinner & Year End Party", description: "Thiết kế không gian tiệc tất niên sang trọng, chương trình nghệ thuật đặc sắc, tạo ấn tượng khó quên cho toàn bộ nhân viên.", icon: <EventIcon4 /> },
  { type: "Media", title: "Truyền thông & Media", description: "Sản xuất nội dung truyền thông sự kiện: livestream, quay phim chuyên nghiệp, photography, thiết kế backdrop và ấn phẩm.", icon: <EventIcon5 /> },
  { type: "MICE Travel", title: "Du lịch MICE", description: "Gói tour kết hợp hội nghị, triển lãm và du lịch trong và ngoài nước cho doanh nghiệp, tối ưu ngân sách và trải nghiệm.", icon: <EventIcon6 /> },
]

type EventProviderCardApi = {
  type: string | null;
  title: string | null;
  description: string | null;
  is_active?: boolean | null;
};

type EventProviderApiData = {
  small_text: string | null;
  big_text: string | null;
  right_text: string | null;
  cards: EventProviderCardApi[] | null;
};

function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL?.trim() || "https://api.haivanevent.vn";
}

function iconFromIndex(index: number): React.ReactNode {
  switch (index) {
    case 0:
      return <EventIcon1 />;
    case 1:
      return <EventIcon2 />;
    case 2:
      return <EventIcon3 />;
    case 3:
      return <EventIcon4 />;
    case 4:
      return <EventIcon5 />;
    case 5:
      return <EventIcon6 />;
    default:
      return <EventIcon1 />;
  }
}

function Intro({ header }: { header: typeof eventData }) {
  return (
    <div className="flex sm:flex-row flex-col justify-between max-sm:items-center max-sm:justify-center max-sm:text-center">
      <div className="flex flex-col">
        <LeftToRightText text={header.small_text} className="bg-clip-text text-transparent bg-gradient-to-r from-[#747474] to-[#C4C4C4] slide-text" />
        <LeftToRightText text={header.big_text} className="lg:text-[59px] sm:text-[35px] text-[30px] bg-clip-text text-transparent bg-gradient-to-r from-[#8ED6D7] to-[#4B7171] font-black slide-text" />
      </div>
      <div className="flex items-center justify-center sm:max-w-[28vw]">
        <LeftToRightText text={header.right_text} className="bg-clip-text lg:text-[16px] sm:text-[14px] text-transparent bg-gradient-to-r from-[#747474] to-[#C4C4C4] slide-text" />
      </div>
    </div>
  );
}

interface EventCardProps {
  type: string;
  title: string;
  description: string;
  icon: React.ReactNode;
};

function EventCard({ type, title, description, icon }: EventCardProps) {
  const useEffect = useHoverFloat();
  return (
    <Card {...useEffect} className="flex flex-col gap-4 bg-white/4 border border-[#3F9293]/50 shadow-sm shadow-[#CECECE]/14 px-[30px] py-[30px] max-sm:items-center max-sm:justify-center">
      <div className="flex items-center justify-center inset-shadow-sm/100 inset-shadow-white bg-gradient-to-b from-[#3F9293] to-[#8E4590] rounded-[14px] w-[70px] h-[70px]">
        {icon}
      </div>
      <CardContent className="flex flex-col gap-4 max-sm:items-center max-sm:justify-center max-sm:text-center">
        <CardHeader className="rounded-full border border-[#3F9293]/50 w-fit px-[10px] py-[5px]">
          <p>{type}</p>
        </CardHeader>
        <CardTitle>
          <p className="font-bold 2xl:text-[28px] lg:text-[22px] text-[20px]">{title}</p>
        </CardTitle>
        <CardDescription className="max-w-[98%] pb-[60px] 2xl:text-[19px] lg:text-[16px] leading-[1.4]">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}

function MainContent({ remoteCards }: { remoteCards: EventProviderCardApi[] | null }) {
  const cards = useMemo(() => {
    if (!remoteCards || remoteCards.length !== 6) return eventCardData;
    const normalized = remoteCards
      .map((c, index) => ({
        icon: iconFromIndex(index),
        type: c.type ?? "",
        title: c.title ?? "",
        description: c.description ?? "",
        is_active: c.is_active ?? true,
      }))
      .filter((c) => c.is_active);
    return normalized.length ? normalized : eventCardData;
  }, [remoteCards]);

  return (
    <div className="grid grid-cols-3 gap-4 py-[50px] max-xl:grid-cols-2 max-sm:grid-cols-1">
      {cards.map((event, index) => (
        <EventCard key={index} type={event.type} title={event.title} description={event.description} icon={event.icon} />
      ))}
    </div>
  );
}

export default function EventProvider() {
  const [remoteData, setRemoteData] = useState<EventProviderApiData | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${getApiBaseUrl()}/event-provider`, { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as EventProviderApiData | null;
        if (data) setRemoteData(data);
      } catch {
        // Keep fallback static content if API is unavailable.
      }
    };
    load();
  }, []);

  const header = useMemo(() => {
    if (!remoteData) return eventData;
    return {
      ...eventData,
      small_text: remoteData.small_text || eventData.small_text,
      big_text: remoteData.big_text || eventData.big_text,
      right_text: remoteData.right_text || eventData.right_text,
    };
  }, [remoteData]);

  return (
    <section className="relative lg:px-[148px] sm:px-[84px] px-[20px] py-[100px]">
      <div className="absolute w-[500px] h-[500px] z-100 bg-[#3F9293]/15 rounded-full blur-[50px] right-0 top-30 opacity-80" />
      <Intro header={header} />
      <MainContent remoteCards={remoteData?.cards ?? null} />
    </section>
  );
}
