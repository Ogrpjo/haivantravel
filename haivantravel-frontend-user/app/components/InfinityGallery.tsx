"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";

type GalleryItem = {
  id?: number;
  image_url: string;
};

const DEFAULT_IMAGES: string[] = [];

const getApiBaseUrl = () =>
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:2031";

const getUploadBaseUrl = () =>
  process.env.NEXT_PUBLIC_UPLOAD_BASE_URL ?? "https://api.haivanevent.vn";

export default function InfinityGallery() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>(DEFAULT_IMAGES);

  const images = useMemo(
    () => (galleryImages.length ? galleryImages : DEFAULT_IMAGES).filter(Boolean),
    [galleryImages]
  );

  const duplicatedImages = useMemo(() => images.concat(images), [images]);
  const speed = 80;

  useEffect(() => {
    let isActive = true;

    const loadGallery = async () => {
      try {
        const res = await fetch(`${getApiBaseUrl()}/gallery`, { cache: "force-cache" });
        if (!res.ok) return;
        const data: GalleryItem[] = await res.json();
        if (!isActive || !Array.isArray(data) || data.length === 0) return;

        const uploadBaseUrl = getUploadBaseUrl();
        const urls = data
          .map((item) => item.image_url)
          .filter(Boolean)
          .map((url) => {
            if (/^https?:\/\//i.test(url)) return url;
            const normalized = url.startsWith("/") ? url : `/${url}`;
            return `${uploadBaseUrl}${normalized}`;
          });

        if (urls.length) setGalleryImages(urls);
      } catch {
        // ignore fetch errors and keep defaults
      }
    };

    loadGallery();
    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    const el = sliderRef.current;
    if (!el || images.length === 0) return;

    gsap.killTweensOf(el);
    const width = el.scrollWidth / 2;
    if (!width) return;

    const tween = gsap.to(el, {
      x: -width,
      duration: width / speed,
      ease: "none",
      repeat: -1,
    });

    return () => {
      tween.kill();
      gsap.killTweensOf(el);
    };
  }, [images]);

  if (!images.length) return null;

  return (
    <div className="relative w-full overflow-hidden bg-[#121212] py-24 translate-y-[-50px]">
      <div className="w-full overflow-hidden">
        <div ref={sliderRef} className="flex w-max gap-10 max-sm:gap-4 will-change-transform">
          {duplicatedImages.map((src, i) => (
            <div
              key={`${src}-${i}`}
              className="relative h-[350px] w-[300px] overflow-hidden rounded-xl shadow-2xl sm:h-[600px] sm:w-[500px]"
            >
              <img
                src={src}
                alt="Gallery"
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
