import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Case-study",
};

export default function CaseStudyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
