import React, { useId } from "react";

interface ImageFrameEmotionProps {
  src: string | null;
  alt: string;
  width?: number | string;
  height?: number | string;
  maxWidth?: number | string;
  className?: string;
}

const DEFAULT_MAX_WIDTH = 580;
const DEFAULT_ASPECT_W = 450;
const DEFAULT_ASPECT_H = 463;

export default function ImageFrameEmotion({
  src,
  alt,
  width = DEFAULT_ASPECT_W,
  height,
  maxWidth: maxWidthProp,
  className = "",
}: ImageFrameEmotionProps) {
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
        : undefined;

  return (
    <div
      className={className}
      style={{
        width: widthStyle,
        ...(maxW ? { maxWidth: maxW } : null),
        aspectRatio: `${widthNum} / ${heightNum}`,
      }}
    >
      <div
        className="absolute inset-0 overflow-hidden bg-white w-full h-full"
        style={{
          aspectRatio: `${widthNum} / ${heightNum}`,
          clipPath:
            "polygon(32.5% 0.64%, 2.8% 95.1%, 67.4% 95.1%, 97.1% 0.64%)",
          boxShadow:
            "0px 10.2677px 13.3981px rgba(229, 0, 92, 0.22), 0px 3.71362px 4.84582px rgba(229, 0, 92, 0.153301), 0px 0px 0px #F8EAF0, 0px 0px 0px #FFFFFF, inset 0px 1px 18px #FFD9E8, inset 0px 1px 4px #FFD9E8",
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
          <path
            d="M 32.5,0.64 L 2.8,95.1 L 67.4,95.1 L 97.1,0.64 Z"
            fill="white"
            filter={`url(#${filterId})`}
          />
        </svg>
      </div>
    </div>
  );
}
