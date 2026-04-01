"use client";

import ServiceCard from "./ServiceCard";
import { useEffect, useState } from "react";

type ServiceFromApi = {
  id: number;
  title: string;
  description: string;
  icon: string;
  createAt: string;
  is_active: boolean;
};

function buildServiceIconSrc(iconPath: string, apiBaseUrl: string): string {
  if (!iconPath || typeof iconPath !== "string") return "";
  const trimmed = iconPath.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  const base = apiBaseUrl.replace(/\/$/, "");
  const filename = trimmed.split(/[/\\]/).pop()?.trim() ?? trimmed;
  if (!filename) return "";
  return `${base}/services/upload/${filename}`;
}

export default function ServiceSection() {
  const [services, setServices] = useState<ServiceFromApi[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:2031";

  useEffect(() => {
    let cancelled = false;
    async function fetchServices() {
      try {
        const res = await fetch(`${apiBaseUrl}/services/active`, { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as ServiceFromApi[];
        if (cancelled) return;
        setServices(data);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    void fetchServices();
    return () => {
      cancelled = true;
    };
  }, [apiBaseUrl]);

  return (
    <section className="xl:min-h-[100vh] md:min-h-[70vh] sm:min-h-[40vh] lg:px-[120px] md:px-[60px] max-sm:px-[20px] flex flex-col justify-center w-full relative border-[#1D1C1C] z-10 pb-[100px]">
      <div className="absolute right-0 bg-white/30 blur-3xl rounded-full w-[200px] h-[200px] mt-[50px] hidden sm:block" />
      <div className="absolute w-[200px] h-[200px] right-0 bg-white/30 blur-3xl rounded-full mt-[-150px] hidden sm:block" />
      <div className="absolute z-0 opacity-25 blur-3xl rounded-full bg-radial from-[#904589] to-transparent w-[700px] h-[700px] right-[-10%] top-[-30%] hidden sm:block" />
      <div className="flex flex-col items-center justify-center gap-[10px]">
        <h1 className="font-black text-transparent bg-clip-text bg-gradient-to-r from-[#C4C4C4] to-[#747474] 2xl:text-[50px] xl:text-[50px] lg:text-[40px] md:text-[22px] sm:text-[20px] text-[24px] text-center">
          Dịch vụ của chúng tôi
        </h1>
        <p className="2xl:text-[17px] text-[13px] text-center sm:max-w-[500px] 2xl:max-w-[700px] xl:max-w-[700px] lg:max-w-[600px] md:max-w-[570px] sm:text-[12px] max-w-[430px]">
          Dịch Vụ MICE & Sự Kiện Được Thiết Kế Riêng Cho Doanh Nghiệp Của Bạn
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-center mt-[50px] justify-center gap-10 md:gap-6 sm:px-8 md:px-2 w-full max-w-[1600px] md:max-w-[calc(100%-24px)] mx-auto px-4">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[200px] text-[#747474]">
            Đang tải...
          </div>
        ) : services.length > 0 ? (
          services.map((service, index) => (
            <ServiceCard
              key={service.id}
              highlight={index === 1}
              title={service.title}
              description={service.description}
              icon={buildServiceIconSrc(service.icon, apiBaseUrl)}
            />
          ))
        ) : (
          <div className="flex justify-center items-center min-h-[200px] text-[#747474]">
            Chưa có dịch vụ
          </div>
        )}
      </div>
    </section>
  );
}
