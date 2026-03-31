"use client"

import Image from "next/image";
import { useEffect, useState } from "react";

type EventPayload = {
  name: string | null;
  time: string | null;
};

const getApiBaseUrl = () =>
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:2031";

export default function BlogEvent() {
  const [eventName, setEventName] = useState("");
  const [eventTime, setEventTime] = useState("");

  useEffect(() => {
    let cancelled = false;
    const fetchEvent = async () => {
      try {
        const res = await fetch(`${getApiBaseUrl()}/events`, {
          cache: "no-store",
        });
        if (!res.ok) return;
        const data = (await res.json()) as EventPayload | null;
        if (!cancelled && data) {
          setEventName(data.name ?? "");
          setEventTime(data.time ?? "");
        }
      } catch {
        // ignore fetch errors
      }
    };

    fetchEvent();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="relative z-20">
      <Image
        src="/Blog/image.webp"
        alt="blog event"
        width={2000}
        height={2000}
        className="2xl:mt-10"
      />
      <div className="flex flex-col absolute top-10 ml-10 md:ml-20 md:top-15 lg:top-20 xl:top-30 2xl:top-50">
        <h3 className="font-bold text-[20px] sm:text-[30px] md:text-[40px] lg:text-[60px] ">
          {eventName || "Sự kiện họp hội đồng của..."}
        </h3>
        <p className="text-[10px] sm:text-[15px] md:text-[20px] lg:text-[30px]">
          {eventTime || "Sự kiện diễn ra vào..."}
        </p>
      </div>
    </section>
  );
}
