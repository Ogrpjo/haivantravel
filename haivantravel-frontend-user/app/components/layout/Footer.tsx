import { Facebook, YouTube } from "@deemlol/next-icons"
import { div } from "motion/react-client"
import Image from "next/image"
import Link from "next/link"

type CardSocialProps = {
    icon: React.ReactNode
}
function CardSocial({ icon }: CardSocialProps) {
    return (
        <div className="bg-white/5 rounded-[10px] px-2 py-2 border border-white/10 flex items-center justify-center">
            {icon}
        </div>
    )
}

export default function Footer() {
    const service = [
        "Tổ chức dự kiện",
        "Team Building",
        "Hội nghị & Hội thảo",
        "Gala Dinner",
        "Du lịch MICE",
        "Truyền thông"
    ]
    const company = [
        "Về chúng tôi",
        "Case Study",
        "Blog & Tin tức",
        "Tuyển dụng",
        "Liên hệ",
    ]
    const contact = [
        "123 Nguyễn Đình Chiểu, Q.3, TP.HCM",
        "+84 863 566 556",
        "Info.hcmc@haivantravelvn.com"
    ]
    return (
        <footer className="flex w-full relative py-[20px] bg-black">
            <div className="absolute bg-black w-[100vw] h-full z-0 top-0 right-0" />
            <div className="absolute bg-black w-[100vw] h-full z-0 top-0 left-0" />
            <div className="flex w-full lg:px-[148px] flex-col z-10 py-[80px] sm:px-[84px] px-[20px] gap-[40px]">
                <div className="w-full gap-[80px] flex flex-col sm:flex-row border-b pb-[40px] border-white/5">
                    <div className="relative w-full flex sm:max-w-[15vw] max-sm:items-center flex-col gap-[20px]">
                        <Image src="/HaivantravelLogo.webp" alt="logo" width={140} height={130} />
                        <p className="text-white/40 text-[12px] lg:text-[16px]">Đơn vị tổ chức sự kiện doanh nghiệp chuyên nghiệp hàng đầu Việt Nam</p>
                        <div className="flex gap-[10px]">
                            <CardSocial icon={<YouTube size={20} />} />
                            <CardSocial icon={<Facebook size={20} />} />
                        </div>
                    </div>
                    <div className="grid w-full flex-1 grid-cols-3">
                        <div className="flex flex-col gap-[20px]">
                            <p className="font-bold text-[16px] lg:text-[20px]">Dịch vụ</p>
                            <div className="flex flex-col gap-[20px]">
                                {service.map((item, index) => (
                                    <Link href="" key={index} className="hover:text-white text-white/40 cursor-pointer text-[12px] lg:text-[16px]">
                                        {item}
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col gap-[20px]">
                            <p className="font-bold text-[16px] lg:text-[20px]">Công ty</p>
                            <div className="flex flex-col gap-[20px]">
                                {company.map((item, index) => (
                                    <Link href="" key={index} className="hover:text-white text-white/40 cursor-pointer text-[12px] lg:text-[16px]">
                                        {item}
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col gap-[20px]">
                            <p className="font-bold text-[16px] lg:text-[20px]">Liên hệ</p>
                            <div className="flex flex-col gap-[20px]">
                                {contact.map((item, index) => (
                                    <Link href="" key={index} className="text-white/40 hover:text-white cursor-pointer text-[12px] lg:text-[16px]">
                                        {item}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between text-white/30 text-[12px] lg:text-[16px]">
                    <p>© 2025 Hải Vân Travel. All rights reserved.</p>
                    <p>Thiết kế bởi đội ngũ Hải Vân Creative</p>
                </div>
            </div>
        </footer>
    )
}