"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type SocialLink = {
  id: number;
  title: string;
  url: string;
  isActive: boolean;
};

type SocialItem = {
  key: string;
  href: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  className: string;
};

const DEFAULT_SOCIALS: SocialItem[] = [
  {
    key: "facebook",
    href: "https://www.facebook.com/haivantravelhcmc",
    src: "/socialbutton/fb.svg",
    alt: "facebook",
    width: 28,
    height: 28,
    className: "max-sm:w-5 max-sm:h-5",
  },
  {
    key: "youtube",
    href: "https://www.youtube.com/@haivantravel9872",
    src: "/socialbutton/yt.svg",
    alt: "youtube",
    width: 28,
    height: 28,
    className: "max-sm:w-5 max-sm:h-5",
  },
  {
    key: "tiktok",
    href: "https://www.tiktok.com/@haivantravel539?is_from_webapp=1&sender_device=pc",
    src: "/socialbutton/tiktok.svg",
    alt: "tiktok",
    width: 30,
    height: 30,
    className: "max-sm:w-5 max-sm:h-5",
  },
  {
    key: "linkedin",
    href: "",
    src: "/socialbutton/in.svg",
    alt: "linkedin",
    width: 28,
    height: 28,
    className: "max-sm:w-5 max-sm:h-5",
  },
];

const getApiBaseUrl = () =>
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:2031";

export default function Footer() {
  const [socialLinks, setSocialLinks] = useState<SocialItem[]>(DEFAULT_SOCIALS);
  const [phone, setPhone] = useState("");
  const [isSubmittingPhone, setIsSubmittingPhone] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const socialMap = useMemo(() => {
    const map = new Map<string, SocialItem>();
    socialLinks.forEach((item) => map.set(item.key, item));
    return map;
  }, [socialLinks]);

  useEffect(() => {
    let isActive = true;
    const loadSocialLinks = async () => {
      try {
        const res = await fetch(`${getApiBaseUrl()}/social-links`);
        if (!res.ok) return;
        const data: SocialLink[] = await res.json();
        if (!isActive || !Array.isArray(data) || data.length === 0) return;

        setSocialLinks((prev) => {
          const next = prev.map((item) => ({ ...item }));
          const lookup = new Map(next.map((item) => [item.key, item]));

          data.forEach((link) => {
            if (!link.isActive || !link.title || !link.url) return;
            const key = link.title.trim().toLowerCase();
            const target = lookup.get(key);
            if (target) {
              target.href = link.url;
            }
          });

          return next;
        });
      } catch {
        // ignore errors and keep defaults
      }
    };

    loadSocialLinks();
    return () => {
      isActive = false;
    };
  }, []);

  const handleSubmitRequestPhone = async () => {
    const trimmedPhone = phone.trim();

    if (!trimmedPhone) {
      setSubmitError("Vui lòng nhập số điện thoại.");
      setSubmitMessage(null);
      return;
    }

    try {
      setIsSubmittingPhone(true);
      setSubmitError(null);
      setSubmitMessage(null);

      const response = await fetch(`${getApiBaseUrl()}/request-phone`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: trimmedPhone }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Gửi yêu cầu thất bại.");
      }

      setSubmitMessage("Gửi yêu cầu tư vấn thành công. Chúng tôi sẽ liên hệ sớm.");
      setPhone("");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Có lỗi xảy ra.");
    } finally {
      setIsSubmittingPhone(false);
    }
  };

  return (
    <div className="flex flex-col w-full z-20 bg-[#121212]">
      <div className="max-w-[1600px] mx-auto w-full flex flex-col lg:flex-row lg:justify-between gap-6 max-sm:gap-4 lg:gap-20 px-6 max-sm:px-4 py-12 max-sm:py-6 items-center lg:items-start text-center lg:text-left">
        <div className="flex flex-col items-center lg:items-start">
          <div className="flex gap-3 max-sm:gap-2 items-center">
            <Image
              src="/haivantravellogo.svg"
              alt="logo"
              width={120}
              height={120}
              className="max-sm:w-16 max-sm:h-16"
            />
            <span className="text-xl max-sm:text-lg font-bold max-w-[100px] max-sm:max-w-[80px]">
              Hải Vân Event
            </span>
          </div>

          <p className="max-w-[320px] max-sm:max-w-[280px] mt-3 max-sm:mt-2 max-sm:text-sm">
            TRAO NIỀM TIN - TRỌN CẢM XÚC
          </p>

          <div className="flex gap-2 max-sm:gap-1.5 mt-4 max-sm:mt-2 justify-center lg:justify-start">
            {DEFAULT_SOCIALS.map((item) => {
              const activeItem = socialMap.get(item.key) ?? item;
              return (
                <a key={item.key} href={activeItem.href}>
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={item.width}
                    height={item.height}
                    className={item.className}
                  />
                </a>
              );
            })}
          </div>
        </div>

        <div className="space-y-3 max-sm:space-y-2 flex flex-col items-center lg:items-start">
          <h1 className="text-xl max-sm:text-lg font-bold">Các chi nhánh</h1>

          <div className="flex gap-2 max-sm:gap-1.5">
            <Image
              src="/Location.svg"
              alt="location"
              width={28}
              height={28}
              className="max-sm:w-5 max-sm:h-5 shrink-0"
            />
            <span className="max-w-[300px] max-sm:max-w-[260px] max-sm:text-sm">
              TRỤ SỞ CHÍNH: 154 Phan Văn Hớn, Phường Tân Thới Nhất, Quận 12,
              TP.HCM.
            </span>
          </div>
        </div>

        <div className="space-y-3 max-sm:space-y-2 flex flex-col items-center lg:items-start">
          <h1 className="text-xl max-sm:text-lg font-bold">Liên hệ</h1>

          <div className="flex gap-2 max-sm:gap-1.5">
            <Image
              src="/Location.svg"
              alt="location"
              width={28}
              height={28}
              className="max-sm:w-5 max-sm:h-5 shrink-0"
            />
            <span className="max-sm:text-sm">
              154 Phan Văn Hớn P. Tân Thới Nhất Quận 12 TP.HCM
            </span>
          </div>

          <div className="flex gap-2 max-sm:gap-1.5">
            <Image
              src="/Call.svg"
              alt="call"
              width={22}
              height={22}
              className="max-sm:w-4 max-sm:h-4 shrink-0"
            />
            <span className="max-sm:text-sm">0853 566 556</span>
          </div>

          <div className="flex gap-2 max-sm:gap-1.5">
            <Image
              src="/Message.svg"
              alt="message"
              width={28}
              height={28}
              className="max-sm:w-5 max-sm:h-5 shrink-0"
            />
            <span className="max-sm:text-sm break-all">
              Info.hcmc@haivantravelvn.com
            </span>
          </div>
        </div>

        <div className="space-y-3 max-sm:space-y-2 flex flex-col items-center lg:items-start">
          <h1 className="text-xl max-sm:text-lg font-bold">
          Sẵn sàng cho chương trình của bạn?
          </h1>

          <p className="max-w-[310px] text-[13px] max-sm:max-w-full max-sm:text-sm">
            Để lại thông tin, đội ngũ Hải Vân Event sẽ liên hệ tư vấn
            chương trình phù hợp với mục tiêu, quy mô và kỳ vọng của doanh
            nghiệp bạn.
          </p>

          <input
            type="text"
            placeholder="0853 566 556"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className="w-full max-w-[310px] h-[45px] placeholder:text-[17px] placeholder:text-center max-sm:h-[30px] max-sm:max-w-[45%] bg-white text-black rounded-[12px] max-sm:rounded-[10px] text-[20px] max-sm:text-base placeholder:text-[#868686]/40 font-semibold"
          />

          <button
            type="button"
            onClick={() => void handleSubmitRequestPhone()}
            disabled={isSubmittingPhone}
            className="w-full cursor-pointer max-w-[310px] h-[45px] max-sm:h-[30px] max-sm:max-w-[45%] bg-[#3F9293] rounded-[12px] max-sm:rounded-[10px] text-[15px] max-sm:text-base font-semibold text-white disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmittingPhone ? "Đang gửi..." : "Gửi yêu cầu tư vấn"}
          </button>

          {submitMessage ? (
            <p className="w-full max-w-[310px] text-sm text-[#8ED6D7]">{submitMessage}</p>
          ) : null}

          {submitError ? (
            <p className="w-full max-w-[310px] text-sm text-red-400 break-all">{submitError}</p>
          ) : null}
        </div>
      </div>

      <div className="w-full border-t border-white/20">
        <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row justify-between items-center gap-4 max-sm:gap-2 px-6 max-sm:px-4 py-6 max-sm:py-3 text-center lg:text-left">
          <span className="max-sm:text-sm">
            © 2025 Hải Vân Travel. Tất cả quyền được bảo lưu.
          </span>   
        </div>
      </div>
    </div>
  );
}
