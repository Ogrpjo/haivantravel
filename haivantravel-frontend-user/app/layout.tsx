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
  title: "Hải Vân Event | Teambuilding, Gala, MICE cho doanh nghiệp",
  description:
    "Hải Vân Event cung cấp giải pháp Teambuilding, Gala Dinner, MICE và sự kiện doanh nghiệp được thiết kế riêng theo mục tiêu, quy mô và ngân sách thực tế",
  icons: {
    icon: [{ url: "/HaivantravelLogo.svg", type: "image/svg+xml", sizes: "any" }],
    shortcut: [{ url: "/HaivantravelLogo.svg", type: "image/svg+xml" }],
    apple: [{ url: "/HaivantravelLogo.svg", sizes: "180x180" }],
  },
  openGraph: {
    title: "Hải Vân Event | Teambuilding, Gala, MICE cho doanh nghiệp",
    description:
      "Hải Vân Event cung cấp giải pháp Teambuilding, Gala Dinner, MICE và sự kiện doanh nghiệp được thiết kế riêng theo mục tiêu, quy mô và ngân sách thực tế",
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
