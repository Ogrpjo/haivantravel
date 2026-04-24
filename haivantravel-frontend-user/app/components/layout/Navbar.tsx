"use client";

import { useState, useEffect, useRef } from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/navbar";
import { Link } from "@heroui/react";
import { usePathname } from "next/navigation";
import { PhoneCall, Facebook, YouTube, Menu, X } from "@deemlol/next-icons";
import Image from "next/image";
import ButtonGradient from "../button-gradient";

type SocialLink = {
  id: number;
  title: string;
  url: string;
  isActive: boolean;
};

type SocialMap = {
  facebook: string;
  youtube: string;
  zalo: string;
  tiktok: string;
};

const DEFAULT_SOCIAL_MAP: SocialMap = {
  facebook: "https://www.facebook.com/haivantravelhcmc",
  youtube: "https://www.youtube.com/@haivantravel9872",
  zalo: "",
  tiktok:
    "https://www.tiktok.com/@haivantravel539?is_from_webapp=1&sender_device=pc",
};

const getApiBaseUrl = () =>
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:2031";

function TopNavbar({ socialMap }: { socialMap: SocialMap }) {
  return (
    <div className="!px-[20px] !justify-between !flex !w-full !bg-[#2E2E2E] !text-white max-sm:!hidden">
      <div className="!flex !items-center !justify-start">
        <div className="!flex !gap-3 !items-center !border-r !pr-[20px] !my-[10px]">
          <PhoneCall size={20} />
          <p>+84 (853 566 556)</p>
        </div>
        <p className="!pl-[20px]">Info.hcmc@haivantravelvn.com</p>
      </div>
      <div className="!flex !items-center md:!px-[20px] !gap-3 !hidden sm:!flex">
        <Link
          href={socialMap.facebook}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Facebook size={20} />
        </Link>
        <Link
          href={socialMap.youtube}
          target="_blank"
          rel="noopener noreferrer"
        >
          <YouTube size={20} />
        </Link>
        <Link href={socialMap.tiktok} target="_blank" rel="noopener noreferrer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M21 7.917v4.034a9.948 9.948 0 0 1 -5 -1.951v4.5a6.5 6.5 0 1 1 -8 -6.326v4.326a2.5 2.5 0 1 0 4 2v-11.5h4.083a6.005 6.005 0 0 0 4.917 4.917" />
          </svg>
        </Link>
        <Link href={socialMap.zalo} target="_blank" rel="noopener noreferrer">
          <Image
            src="/socialbutton/zalo.svg"
            alt="zalo"
            width={25}
            height={20}
          />
        </Link>
      </div>
    </div>
  );
}

function BottomNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false);
  const [isMobileServiceOpen, setIsMobileServiceOpen] = useState(false);
  const menuItems = [
    { name: "Trang chủ", href: "/" },
    { name: "Case Study", href: "/case-study" },
    { name: "Blog", href: "/blog" },
  ];
  const aboutItem = { name: "Về chúng tôi", href: "/about-us" };
  const serviceItems = [
    { name: "MICE", href: "/mice" },
    { name: "Gala Dinner", href: "/gala" },
    { name: "Team building", href: "/teambuilding" },
  ];

  return (
    <>
      <Navbar className="!h-auto !py-[10px] !bg-[#121212] lg:!px-[84px] !border-b-2 !border-white/5">
        <NavbarContent className="lg:!px-[40px]" justify="start">
          <Link href="/">
            <NavbarBrand>
              <Image
                src="/HaivantravelLogo.svg"
                alt="Logo"
                width={190}
                height={104}
              />
            </NavbarBrand>
          </Link>
        </NavbarContent>

        <NavbarContent className="!hidden lg:!flex !relative" justify="center">
          {menuItems.map((item, index) => (
            <NavbarItem key={`${item}-${index}`}>
              <Link
                className="!no-underline hover:!text-white/70 !text-[16px]"
                href={item.href}
              >
                {item.name}
              </Link>
            </NavbarItem>
          ))}
          <NavbarItem className="!relative">
            <button
              type="button"
              onClick={() => setIsServiceDropdownOpen((prev) => !prev)}
              className="!cursor-pointer !text-[16px] !font-semibold !text-white hover:!text-white/70 !flex !items-center !gap-2"
            >
              Dịch vụ
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`!transition-transform !duration-200 ${isServiceDropdownOpen ? "!rotate-180" : ""}`}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            {isServiceDropdownOpen ? (
              <div className="!absolute !top-[150%] !left-0 !min-w-[180px] !bg-[#1E1E1E] !border !border-white/10 !rounded-[10px] !py-2 !z-[120]">
                {serviceItems.map((serviceItem) => (
                  <Link
                    key={serviceItem.name}
                    href={serviceItem.href}
                    className="!block !px-4 !py-2 !text-[15px] hover:!bg-white/10 !no-underline !text-white"
                    onPress={() => setIsServiceDropdownOpen(false)}
                  >
                    {serviceItem.name}
                  </Link>
                ))}
              </div>
            ) : null}
          </NavbarItem>
          <NavbarItem>
            <Link
              className="!no-underline hover:!text-white/70 !text-[16px]"
              href={aboutItem.href}
            >
              {aboutItem.name}
            </Link>
          </NavbarItem>
        </NavbarContent>

        <NavbarContent className="lg:!px-[40px]" justify="end">
          <Link
            href="/contact"
            className="!no-underline !decoration-transparent hover:!no-underline"
          >
            <ButtonGradient name="Nhận Brief ngay" />
          </Link>

          <button
            className="lg:!hidden !cursor-pointer"
            onClick={() => {
              setIsMenuOpen(true);
              setIsMobileServiceOpen(false);
            }}
          >
            <Menu size={30} />
          </button>
        </NavbarContent>
      </Navbar>

      <div
        className={`!fixed !inset-0 !flex !transition-opacity !duration-300 ${
          isMenuOpen
            ? "!opacity-100 !pointer-events-auto"
            : "!opacity-0 !pointer-events-none"
        }`}
      >
        <div className="!flex-1" onClick={() => setIsMenuOpen(false)} />

        <div
          className={`!w-full sm:!max-w-sm !bg-[#121212] !text-white !h-screen !z-100 !relative !p-6 !transform !transition-transform !duration-300 ${
            isMenuOpen ? "!translate-x-0" : "!translate-x-full"
          }`}
        >
          <div className="!flex !justify-end !mb-6">
            <button
              className="!cursor-pointer"
              onClick={() => {
                setIsMenuOpen(false);
                setIsMobileServiceOpen(false);
              }}
            >
              <X size={28} />
            </button>
          </div>

          <div className="!flex !flex-col !gap-6">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="!no-underline hover:!text-white/70 !cursor-pointer !text-[16px]"
              >
                {item.name}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => setIsMobileServiceOpen((prev) => !prev)}
              className="!no-underline hover:!text-white/70 !cursor-pointer !text-[16px] !flex !items-center !justify-between"
            >
              Dịch vụ
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`!transition-transform !duration-200 ${isMobileServiceOpen ? "!rotate-180" : ""}`}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            {isMobileServiceOpen ? (
              <div className="!pl-3 !flex !flex-col !gap-3">
                {serviceItems.map((serviceItem) => (
                  <Link
                    key={serviceItem.name}
                    href={serviceItem.href}
                    className="!no-underline hover:!text-white/70 !cursor-pointer !text-[15px]"
                    onPress={() => {
                      setIsMobileServiceOpen(false);
                      setIsMenuOpen(false);
                    }}
                  >
                    {serviceItem.name}
                  </Link>
                ))}
              </div>
            ) : null}
            <Link
              href={aboutItem.href}
              className="!no-underline hover:!text-white/70 !cursor-pointer !text-[16px]"
            >
              {aboutItem.name}
            </Link>
            <Link
              href="/contact"
              className="!no-underline !decoration-transparent hover:!no-underline"
            >
              <ButtonGradient name="Nhận Brief ngay" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default function NavigationBar() {
  const [isVisible, setIsVisible] = useState(true);
  const [socialMap, setSocialMap] = useState<SocialMap>(DEFAULT_SOCIAL_MAP);
  const lastScrollYRef = useRef(0);
  const tickingRef = useRef(false);
  const pathname = usePathname();

  useEffect(() => {
    let isMounted = true;

    const loadSocialLinks = async () => {
      try {
        const response = await fetch(`${getApiBaseUrl()}/social-links`);
        if (!response.ok) return;
        const data = (await response.json()) as SocialLink[];
        if (!Array.isArray(data) || !isMounted) return;

        const nextMap: SocialMap = { ...DEFAULT_SOCIAL_MAP };
        data.forEach((item) => {
          if (!item?.isActive || !item?.title || !item?.url) return;
          const key = item.title.trim().toLowerCase() as keyof SocialMap;
          if (key in nextMap) {
            nextMap[key] = item.url;
          }
        });
        setSocialMap(nextMap);
      } catch {
        // Keep default links when API is unavailable.
      }
    };

    void loadSocialLinks();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const controlNavbar = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;

      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const previousScrollY = lastScrollYRef.current;
        const scrollDelta = Math.abs(currentScrollY - previousScrollY);

        if (currentScrollY <= 50) {
          setIsVisible(true);
        } else if (scrollDelta >= 4) {
          setIsVisible(currentScrollY < previousScrollY);
        }

        lastScrollYRef.current = currentScrollY;
        tickingRef.current = false;
      });
    };

    window.addEventListener("scroll", controlNavbar, { passive: true });
    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, []);

  useEffect(() => {
    setIsVisible(true);
    lastScrollYRef.current = 0;
  }, [pathname]);

  return (
    <>
      <div className="!h-[148px] max-sm:!h-[96px]" aria-hidden="true" />
      <section
        className={`!fixed !top-0 !left-0 !w-full !z-[100] !bg-black !transition-transform !duration-300 ${
          isVisible ? "!translate-y-0" : "!-translate-y-full"
        }`}
      >
        <TopNavbar socialMap={socialMap} />
        <BottomNavbar />
      </section>
    </>
  );
}
