import { useEffect, useState } from "react";

type PartnerCardProps = {
  src: string;
  title: string;
  width: number;
};

export default function PartnerCard({ src, title, width }: PartnerCardProps) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [src]);

  return (
    <div
      className="w-full group relative rounded-[12px] bg-white/4 hover:bg-gradient-to-b hover:from-[#3F9293] hover:to-[#8E4590] transition-all duration-300 shadow-[0_0_10px_rgba(255,255,255,0.20)] aspect-square max-w-[330px] flex flex-col items-center justify-center">
      <div className="min-h-[85%] min-w-[80%] flex items-center justify-center">
        {imgError ? (
          <div
            className="flex items-center justify-center w-[41%] aspect-square rounded-lg bg-white/10 text-[#8ED6D7] text-sm"
            title={`Ảnh không tải: ${src}`}
          >
            Logo
          </div>
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={src}
            alt={title}
            width={width}
            height={width}
            className="object-contain max-w-full max-h-full"
            style={{ width: width ? `${width}px` : undefined, height: width ? `${width}px` : undefined }}
            onError={() => setImgError(true)}
          />
        )}
      </div>

      <div className="w-full flex justify-center pb-[6%]">
        <p className="border px-[12%] py-[3%] font-semibold rounded-[8px] text-[clamp(10px,1.1vw,16px)] xl:text-[16px] md:text-[10px] sm:text-[8px]">
          {title}
        </p>
      </div>
    </div>
  );
}
