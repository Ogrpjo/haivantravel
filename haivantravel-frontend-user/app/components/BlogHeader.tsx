import UserCard from "./UserCard";
import Image from "next/image";

export default function BlogHeader() {
    return (
        <section className="z-10">
            <Image src="background2.svg" alt="background2" width={0} height={0} className="absolute right-0 scale-x-[-1] w-[100%] sm:top-30 md:top-0 lg:top-[-100px] xl:top-[-300px] 2xl:top-[-300px]" />
            <div className="flex flex-col max-lg:items-center lg:ml-50 xl:ml-90 gap-y-3 z-20">
                <p className="text-[#3F9293] text-[12px]">Blog of Hai Van Event</p>
                <h3 className="font-bold text-[20px] md:text-[35px] lg:text-[60px]">Hai Van Event</h3>
                <p className="lg:text-[25px] text-[12px] md:text-[15px]">Xem những blog và tin tức mới nhất của Haivan Event</p>
                <p className="text-[12px] md:text-[15px]">25-12-2025</p>
            </div>
        </section>
    )
}