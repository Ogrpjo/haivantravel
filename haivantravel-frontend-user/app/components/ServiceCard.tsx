import Image from "next/image";

type ServiceCardProps = {
    highlight?: boolean;
    title: string;
    description: string;
    icon?: string;
};

export default function ServiceCard({
    highlight,
    title,
    description,
    icon,
}: ServiceCardProps) {
    return (
        <div className="flex flex-col aspect-square bg-white/8 gap-[5px] rounded-[12px] py-[20px] w-full justify-center">
            <div className="flex items-center justify-center overflow-visible">
                <div className="relative bg-gradient-to-b aspect-square w-[20%] from-[#3F9293] to-[#8E4590] rounded-[12px] overflow-visible">
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                        {icon ? (
                            <img src={icon} alt="" className="max-w-[80%] max-h-[80%] w-auto h-auto object-contain scale-[2] origin-center" />
                        ) : (
                            <span className="scale-[2] origin-center inline-flex items-center justify-center">
                                <Image
                                    src="service.svg"
                                    alt="service"
                                    width={0}
                                    height={0}
                                    className="w-full"
                                />
                            </span>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center px-[10px] gap-[5px]">
                <h3 className="2xl:text-2xl xl:text-lg lg:text-[14px] md:text-[13px] sm:text-[10px] font-bold ">
                    {title}
                </h3>
                <p className="2xl:text-xl xl:text-md lg:text-[12px] md:text-[11px] sm:text-[8px] text-center">
                    {description}
                </p>
            </div>
        </div>
    );
}
