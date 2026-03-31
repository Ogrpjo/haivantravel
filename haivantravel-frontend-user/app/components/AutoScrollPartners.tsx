"use client";

import { useEffect, useRef } from "react";
import PartnerCard from "./partnetCard";

export type PartnerItem = {
  id: number;
  src: string;
  width: number;
  title: string;
};

type Props = {
  className?: string;
  speedPxPerFrame?: number;
  partners: PartnerItem[];
};

export default function AutoScrollPartners({
  className = "sm:hidden",
  speedPxPerFrame = 2,
  partners,
}: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const isMobile = window.matchMedia("(max-width: 639px)").matches;

    if (prefersReducedMotion || !isMobile) return;

    let lastTime = 0;
    let pauseUntil = 0;

    const pause = () => {
      pauseUntil = performance.now() + 1500;
    };

    const events = ["pointerdown", "touchstart", "mouseenter", "wheel"];

    events.forEach((event) =>
      el.addEventListener(event, pause, { passive: true })
    );

    const animate = (time: number) => {
      if (!lastTime) lastTime = time;

      const delta = time - lastTime;
      lastTime = time;

      if (time < pauseUntil) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      const maxScroll = el.scrollWidth - el.clientWidth;

      if (maxScroll > 0) {
        const step = speedPxPerFrame * (delta / 16.67);
        const nextScroll = el.scrollLeft + step;

        el.scrollLeft = nextScroll >= maxScroll ? 0 : nextScroll;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      events.forEach((event) =>
        el.removeEventListener(event, pause)
      );
    };
  }, [speedPxPerFrame]);

  return (
    <div
      ref={scrollerRef}
      className={`w-full overflow-x-auto ${className}`}
      aria-label="Danh sách đối tác"
    >
      <div className="flex gap-5 min-w-max pt-6">
        {partners.map((partner) => (
          <div
            key={partner.id}
            className="flex-shrink-0 w-[200px] aspect-square"
          >
            <PartnerCard
              src={partner.src}
              width={partner.width}
              title={partner.title}
            />
          </div>
        ))}
      </div>
    </div>
  );
}