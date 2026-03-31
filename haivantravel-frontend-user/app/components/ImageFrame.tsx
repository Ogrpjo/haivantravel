import React, { useId } from "react";

interface ImageFrameProps {
  src: string | null;
  alt: string;
  /** Số (px) hoặc % (vd: 588, "100%", "50%"). Khi dùng % thì bị giới hạn bởi maxWidth. */
  width?: number | string;
  height?: number | string;
  /** Giới hạn width tối đa (vd: 588). Mặc định 588 khi width là %. */
  maxWidth?: number | string;
  className?: string;
}

const DEFAULT_MAX_WIDTH = 588;
const DEFAULT_ASPECT_W = 588;
const DEFAULT_ASPECT_H = 426;

export default function ImageFrame({
  src,
  alt,
  width = 588,
  height = 426,
  maxWidth: maxWidthProp,
  className = "",
}: ImageFrameProps) {
  const filterId = useId().replace(/:/g, "-");
  const isNumWidth = typeof width === "number";
  const widthNum = isNumWidth ? width : DEFAULT_ASPECT_W;
  const heightNum = typeof height === "number" ? height : DEFAULT_ASPECT_H;
  const widthStyle = isNumWidth ? "100%" : width;
  const maxW =
    maxWidthProp !== undefined
      ? typeof maxWidthProp === "number"
        ? `${maxWidthProp}px`
        : maxWidthProp
      : isNumWidth
        ? `${width}px`
        : `${DEFAULT_MAX_WIDTH}px`;

  return (
    <div
      className={className}
      style={{ width: widthStyle, maxWidth: maxW }}
    >
      <div
        className="relative overflow-hidden bg-white w-full h-full"
        style={{
          aspectRatio: `${widthNum} / ${heightNum}`,
          clipPath: "polygon(15% 0%, 100% 0%, 85% 100%, 0% 100%)",
          boxShadow:
            "0 0 0 1.5px rgba(168, 85, 247, 0.5), 0 0 16px rgba(168, 85, 247, 0.28), 0 0 32px rgba(168, 85, 247, 0.14)",
        }}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : null}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
            <feMorphology in="SourceAlpha" operator="erode" radius="0.4" result="eroded" />
            <feComposite in="SourceAlpha" in2="eroded" operator="out" result="edge" />
            <feGaussianBlur in="edge" stdDeviation="0.35" result="blurred" />
            <feFlood floodColor="#f0ebf5" floodOpacity="0.68" result="shadowColor" />
            <feComposite in="shadowColor" in2="blurred" operator="in" result="shadow" />
            <feMerge>
              <feMergeNode in="shadow" />
            </feMerge>
          </filter>
        </defs>
        {/* Path trùng với clip-path: 15% 0, 100% 0, 85% 100%, 0 100% */}
        <path
          d="M 15,0 L 100,0 L 85,100 L 0,100 Z"
          fill="white"
          filter={`url(#${filterId})`}
        />
      </svg>
      </div>
    </div>
  );
}
