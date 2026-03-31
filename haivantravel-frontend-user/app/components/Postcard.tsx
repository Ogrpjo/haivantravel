import Image from "next/image";
import Link from "next/link";

type PostCardProps = {
  src: string;
  title: string;
  topic: string;
  date: string;
  href?: string;
};

export default function PostCard({ src, title, topic, date, href }: PostCardProps) {
  const content = (
    <>
      <div className="relative w-full pt-[56.25%] overflow-hidden">
        <Image
          src={src}
          alt="postImage"
          fill
          className="object-cover"
          unoptimized
          onError={() => console.error("[PostCard] Image failed to load", src)}
          onLoadingComplete={() => console.debug("[PostCard] Image loaded", src)}
        />
      </div>
      <h1 className="text-[16px] font-bold mt-2">{title}</h1>
      {topic ? <p className="text-[13px] text-[#3F9293]">{topic}</p> : null}
      <p className="text-[12px] text-[#3F9293]">{date}</p>
    </>
  );

  return href ? (
    <Link href={href} className="flex flex-col w-full">
      {content}
    </Link>
  ) : (
    <div className="flex flex-col w-full">{content}</div>
  );
}
