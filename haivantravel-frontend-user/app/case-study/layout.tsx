import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dự án tiêu biểu | Case Study sự kiện doanh nghiệp | Hải Vân Event",
  description:
    "Khám phá các dự án Company Trip, Teambuilding, Gala Dinner, MICE và School Event tiêu biểu do Hải Vân Event triển khai.",
};

export default function CaseStudyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
