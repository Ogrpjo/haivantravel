"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

type SocialLink = {
  id: number;
  title: string;
  url: string;
  isActive: boolean;
};

const DEFAULT_SOCIAL_LINKS: Record<string, string> = {
  facebook: "https://www.facebook.com/haivantravelhcmc",
  youtube: "https://www.youtube.com/@haivantravel9872",
  tiktok: "https://www.tiktok.com/@haivantravel539?is_from_webapp=1&sender_device=pc",
  zalo: "https://zalo.me/84853566556",
};

const getApiBaseUrl = () => process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:2031";

export default function Navbar() {
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>(DEFAULT_SOCIAL_LINKS);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isServiceMenuOpen, setIsServiceMenuOpen] = useState(false);
  const [isMobileServiceMenuOpen, setIsMobileServiceMenuOpen] = useState(false);
  const desktopServiceMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", controlNavbar, { passive: true });
    return () => window.removeEventListener("scroll", controlNavbar);
  }, [lastScrollY]);

  useEffect(() => {
    let isActive = true;
    const loadSocialLinks = async () => {
      try {
        const res = await fetch(`${getApiBaseUrl()}/social-links`);
        if (!res.ok) return;
        const data: SocialLink[] = await res.json();
        if (!isActive || !Array.isArray(data) || data.length === 0) return;
        const next: Record<string, string> = { ...DEFAULT_SOCIAL_LINKS };
        data.forEach((item) => {
          if (!item?.url || !item?.title || item.isActive === false) return;
          next[item.title.trim().toLowerCase()] = item.url;
        });
        setSocialLinks(next);
      } catch { /* ignore */ }
    };
    loadSocialLinks();
    return () => { isActive = false; };
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) setIsMobileServiceMenuOpen(false);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (!isServiceMenuOpen) return;

    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      if (desktopServiceMenuRef.current?.contains(target)) return;
      setIsServiceMenuOpen(false);
    };

    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [isServiceMenuOpen]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isMobileMenuOpen]);

  const linkFor = useMemo(() => (alt: string) => {
    const key = alt.trim().toLowerCase();
    return socialLinks[key] ?? DEFAULT_SOCIAL_LINKS[key] ?? "";
  }, [socialLinks]);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[100] w-full flex flex-col transition-transform duration-300 ease-in-out ${(isVisible || isMobileMenuOpen) ? "translate-y-0" : "-translate-y-full"}`}>
        <div className="flex flex-row justify-between items-center h-[56px] bg-[#2E2E2E] px-4 min-[576px]:px-9">
          <div className="flex items-center text-white">
            <div className="flex flex-row gap-2 items-center h-[40px] pr-4 border-r border-[#E0E0E0]">
              <Image src="/phone.svg" alt="phone" width={24} height={24} priority />
              <p className="text-sm md:text-md">+84 (853 566 556)</p>
            </div>
            <div className="hidden min-[690px]:flex flex-row gap-2 items-center h-[40px] px-4">
              <Image src="/mail.svg" alt="mail" width={24} height={24} priority />
              <p className="text-sm md:text-md">Info.hcmc@haivantravelvn.com</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a href={linkFor("facebook")} target="_blank" rel="noreferrer"><Image src="/socialbutton/facebook.svg" alt="facebook" width={24} height={24} priority /></a>
            <a href={linkFor("youtube")} target="_blank" rel="noreferrer"><Image src="/socialbutton/youtube.svg" alt="youtube" width={24} height={24} priority /></a>
            <a href={linkFor("tiktok")} target="_blank" rel="noreferrer"><Image src="/socialbutton/tiktok1.svg" alt="tiktok" width={24} height={24} priority /></a>
            <a href={linkFor("zalo")} target="_blank" rel="noreferrer"><Image src="/socialbutton/zalo.svg" alt="zalo" width={24} height={24} priority /></a>
          </div>
        </div>

        <div className="relative w-full h-[80px] flex items-center justify-between border-b-[0.1px] border-[#4F4F4F] bg-[#121212] px-4 min-[576px]:px-9 text-white shadow-xl">
          <a href="/">
            <Image src="/haivantravellogo.svg" alt="logo" width={120} height={120} priority />
          </a>
          <div className="hidden min-[576px]:flex items-center gap-8">
            <div className="relative" ref={desktopServiceMenuRef}>
              <button
                type="button"
                className="flex items-center gap-2 hover:text-blue-400 transition-colors"
                onClick={() => setIsServiceMenuOpen((v) => !v)}
                aria-expanded={isServiceMenuOpen}
              >
                <span>Dịch vụ</span>
                <Image
                  src="/keyboard_arrow_down.svg"
                  alt="dropdown"
                  width={22}
                  height={22}
                  priority
                  className={`transition-transform ${isServiceMenuOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isServiceMenuOpen && (
                <div className="absolute left-0 top-full mt-3 w-[220px] bg-[#121212] border border-white/10 rounded-[12px] shadow-xl z-[250] overflow-hidden">
                  <a
                    href="/mice"
                    className="block px-4 py-3 text-sm hover:bg-white/5 transition-colors"
                    onClick={() => setIsServiceMenuOpen(false)}
                  >
                    MICE
                  </a>
                  <a
                    href="/gala"
                    className="block px-4 py-3 text-sm hover:bg-white/5 transition-colors"
                    onClick={() => setIsServiceMenuOpen(false)}
                  >
                    Gala
                  </a>
                  <a
                    href="/teambuilding"
                    className="block px-4 py-3 text-sm hover:bg-white/5 transition-colors"
                    onClick={() => setIsServiceMenuOpen(false)}
                  >
                    Team building
                  </a>
                </div>
              )}
            </div>
            <a href="/blog" className="hover:text-blue-400 transition-colors">Blog</a>
            <a href="/about" className="hover:text-blue-400 transition-colors">About</a>
            <a href="/recruitment" className="hover:text-blue-400 transition-colors">Tuyển dụng</a>
            <a href="/contact" className="w-[161px] h-[40px] bg-gradient-to-r from-[#3F9293] to-[#8E4590] flex justify-center items-center rounded-[12px] gap-2">
              <p>Liên hệ tư vấn</p>
              <Image src="/arrow-circle-right-solid.svg" alt="arrow" width={24} height={24} priority />
            </a>
          </div>
          <button type="button" onClick={() => setIsMobileMenuOpen(true)} className="min-[576px]:hidden p-2">
            <Image src="/menu-2.svg" alt="menu" width={28} height={28} priority />
          </button>
        </div>
      </nav>

      {/* MOBILE MENU - Đặt bên ngoài nav và dùng z-index cực cao */}
      <div className={`fixed inset-0 z-[200] bg-[#121212] flex flex-col transition-all duration-500 ease-in-out ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none translate-x-full"}`}>
        <div className="h-[136px] flex items-center justify-between px-6 border-b border-white/15">
          <Image src="/haivantravellogo.svg" alt="logo" width={120} height={120} />
          <button onClick={() => setIsMobileMenuOpen(false)} className="text-white text-5xl font-light p-2">×</button>
        </div>
        <div className="flex flex-col gap-2 p-10 text-md font-bold uppercase tracking-widest text-white">
          <button
            type="button"
            onClick={() => setIsMobileServiceMenuOpen((v) => !v)}
            className="border-b border-white/5 pb-2 text-left"
            aria-expanded={isMobileServiceMenuOpen}
          >
            <span className="flex items-center gap-2">
              <span>Dịch vụ</span>
              <Image
                src="/keyboard_arrow_down.svg"
                alt="dropdown"
                width={22}
                height={22}
                priority
                className={`transition-transform ${isMobileServiceMenuOpen ? "rotate-180" : ""}`}
              />
            </span>
          </button>
          {isMobileServiceMenuOpen && (
            <div className="flex flex-col gap-2">
              <a
                href="/mice"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsMobileServiceMenuOpen(false);
                }}
                className="border-b border-white/5 pb-2"
              >
                MICE
              </a>
              <a
                href="/gala"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsMobileServiceMenuOpen(false);
                }}
                className="border-b border-white/5 pb-2"
              >
                Gala
              </a>
              <a
                href="/teambuilding"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsMobileServiceMenuOpen(false);
                }}
                className="border-b border-white/5 pb-2"
              >
                Team building
              </a>
            </div>
          )}
          <a href="/blog" onClick={() => setIsMobileMenuOpen(false)} className="border-b border-white/5 pb-2">Blog</a>
          <a href="/recruitment" onClick={() => setIsMobileMenuOpen(false)} className="border-b border-white/5 pb-2">Recruitment</a>
          <a href="/about" onClick={() => setIsMobileMenuOpen(false)} className="border-b border-white/5 pb-2">About</a>
          <a href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="border-b border-white/5 pb-2">Contact</a>
        </div>
      </div>
    </>
  );
}