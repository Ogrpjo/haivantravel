import Image from "next/image";

type SidebarPageProps = {
  src: string;
  title: string;
  href: string;
};

export default function SidebarPage({ src, title, href }: SidebarPageProps) {
  return (
    <a
      href={href}
      className="flex items-center gap-2 px-[20px] py-[7px] text-white/70 hover:text-white transition-colors"
    >
      <Image src={src} alt="logo_page" width={16} height={16} className="shrink-0" />
      <p className="text-[14px] leading-none">{title}</p>
    </a>
  );
}
