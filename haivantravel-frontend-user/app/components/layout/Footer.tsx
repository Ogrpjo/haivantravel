"use client";

import { Facebook, YouTube, Mail } from "@deemlol/next-icons";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type SocialLink = {
  id: number;
  title: string;
  url: string;
  isActive: boolean;
};

type SocialIconItem = {
  key: "youtube" | "facebook" | "zalo" | "tiktok";
  href: string;
  icon: React.ReactNode;
};

type CardSocialProps = {
  icon: React.ReactNode;
};
function CardSocial({ icon }: CardSocialProps) {
  return (
    <div className="bg-white/5 rounded-[10px] px-2 py-2 border border-white/10 flex items-center justify-center">
      {icon}
    </div>
  );
}

export default function Footer() {
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>({
    facebook: "https://www.facebook.com/haivantravelhcmc",
    youtube: "https://www.youtube.com/@haivantravel9872",
    zalo: "",
    tiktok:
      "https://www.tiktok.com/@haivantravel539?is_from_webapp=1&sender_device=pc",
  });

  useEffect(() => {
    let isMounted = true;

    const loadSocialLinks = async () => {
      try {
        const apiBaseUrl =
          process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:2031";
        const response = await fetch(`${apiBaseUrl}/social-links`);
        if (!response.ok) return;
        const data = (await response.json()) as SocialLink[];
        if (!Array.isArray(data) || !isMounted) return;

        setSocialLinks((prev) => {
          const next = { ...prev };
          data.forEach((item) => {
            if (!item?.isActive || !item?.title || !item?.url) return;
            const key = item.title.trim().toLowerCase();
            if (key in next) {
              next[key] = item.url;
            }
          });
          return next;
        });
      } catch {
        // keep default links
      }
    };

    void loadSocialLinks();
    return () => {
      isMounted = false;
    };
  }, []);

  const socialItems = useMemo<SocialIconItem[]>(() => {
    return [
      {
        key: "youtube",
        href: socialLinks.youtube,
        icon: <YouTube size={20} />,
      },
      {
        key: "facebook",
        href: socialLinks.facebook,
        icon: <Facebook size={20} />,
      },
      {
        key: "zalo",
        href: socialLinks.zalo,
        icon: (
          <Image
            src="/socialbutton/zalo.svg"
            alt="zalo"
            width={20}
            height={20}
          />
        ),
      },
      {
        key: "tiktok",
        href: socialLinks.tiktok,
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
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
        ),
      },
    ];
  }, [socialLinks]);

  const service = [
    { name: "Team Building", href: "/teambuilding" },
    { name: "Gala Dinner", href: "/gala" },
    { name: "MICE", href: "/mice" },
  ];
  const company = [
    { name: "Về chúng tôi", href: "/about-us" },
    { name: "Case Study", href: "/case-study" },
    { name: "Blog & Tin tức", href: "/blog" },
    { name: "Tuyển dụng", href: "/recruitment" },
    { name: "Liên hệ", href: "/contact" },
  ];
  const contact = [
    "154 Phan Văn Hớn, Phường Đông Hưng Thuận, TP. Hồ Chí Minh",
    "+84 863 566 556",
    "Info.hcmc@haivantravelvn.com",
  ];
  return (
    <footer className="flex w-full relative py-[20px] bg-black">
      <div className="absolute bg-black w-[100vw] h-full z-0 top-0 right-0" />
      <div className="absolute bg-black w-[100vw] h-full z-0 top-0 left-0" />
      <div className="flex w-full lg:px-[148px] flex-col z-10 py-[80px] sm:px-[84px] px-[20px] gap-[40px]">
        <div className="w-full gap-[80px] flex flex-col sm:flex-row border-b pb-[40px] border-white/5">
          <div className="relative w-full flex sm:max-w-[15vw] max-sm:items-center flex-col gap-[20px]">
            <Image
              src="/HaivantravelLogo.webp"
              alt="logo"
              width={140}
              height={130}
            />
            <p className="text-white/40 text-[12px] lg:text-[16px] text-center sm:text-left">
              Đơn vị tổ chức sự kiện doanh nghiệp chuyên nghiệp hàng đầu Việt
              Nam
            </p>
            <div className="flex gap-[10px]">
              {socialItems.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <CardSocial icon={item.icon} />
                </Link>
              ))}
            </div>
          </div>
          <div className="grid w-full flex-1 grid-cols-3">
            <div className="flex flex-col gap-[20px]">
              <p className="font-bold text-[16px] lg:text-[20px]">Dịch vụ</p>
              <div className="flex flex-col gap-[20px]">
                {service.map((item, index) => (
                  <Link
                    href={item.href}
                    key={index}
                    className="hover:text-white text-white/40 cursor-pointer text-[12px] lg:text-[16px]"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-[20px]">
              <p className="font-bold text-[16px] lg:text-[20px]">Công ty</p>
              <div className="flex flex-col gap-[20px]">
                {company.map((item, index) => (
                  <Link
                    href={item.href}
                    key={index}
                    className="hover:text-white text-white/40 cursor-pointer text-[12px] lg:text-[16px]"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-[20px]">
              <p className="font-bold text-[16px] lg:text-[20px]">Liên hệ</p>
              <div className="flex flex-col gap-[20px]">
                {contact.map((item, index) => (
                  <div
                    key={index}
                    className="text-white/40 text-[12px] lg:text-[16px]"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between text-white/30 text-[12px] lg:text-[16px]">
          <p>© 2025 Hải Vân Travel. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
