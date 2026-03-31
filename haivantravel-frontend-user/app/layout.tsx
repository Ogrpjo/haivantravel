import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Haivanevent",
  description: "Haivanevent - Hải Vân Travel với hơn một thập kỷ kinh nghiệm tổ chức tour, sự kiện và teambuilding, mang đến hành trình gắn kết và trải nghiệm trọn vẹn cho doanh nghiệp.",
  icons: "/haivantravellogo.svg",
  openGraph: {
    title: "HaivanEvent",
    description:
      "Hải Vân Travel - Đơn vị tổ chức tour, sự kiện và teambuilding chuyên nghiệp cho doanh nghiệp.",
    url: "https://haivanevent.vn",
    siteName: "Hải Vân Travel",
    images: [
      {
        url: "/home/Projects/bgit.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
        <body
        className={`${plusJakartaSans.variable} ${geistMono.variable} antialiased bg-[#121212] min-h-screen`}
      >
            {children}
        </body>
    </html>
  );
}
