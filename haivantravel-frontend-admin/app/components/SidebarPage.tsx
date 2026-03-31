import Image from "next/image"

type SidebarPageProps = {
    src: string, 
    title: string,
    href: string,
}

export default function SidebarPage({src, title, href}: SidebarPageProps) {
    
    return (
        <a href={href} className="flex px-[30px] items-center gap-2 text-white/80 hover:text-white transition-colors">
            <div className="">
                <Image src={src} alt="logo_page" width={0} height={0} className="w-[100%]"/>
            </div>
            <div>
                <p className="text-[16px]">{title}</p>
            </div>
        </a>
    )
}