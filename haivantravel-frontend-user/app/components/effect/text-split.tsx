"use client"

import { useRef, useEffect } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import ScrollTrigger from "gsap/ScrollTrigger"
import { image } from "motion/react-client"

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger)
}

type LeftToRightTextProps = {
    text: React.ReactNode;
    className: string;
}

export default function LeftToRightText({ className, text }: LeftToRightTextProps) {
    const container = useRef(null);

    useGSAP(() => {
        gsap.from(".slide-text", {
            scrollTrigger: {
                trigger: container.current,
                start: "top 85%",
                toggleActions: "play none none none",
            },
            x: -50,
            opacity: 0,
            duration: 1.8,
            ease: 'power3.out',
            stagger: 0.3,
        });
    }, { scope: container});

    return (
        <div ref={container}>
            <p className={className}>{text}</p>
        </div>
    )
}

type CountingNumberProps = {
    endValue: number;
    className: string;
}

export function CountingNumber({ endValue, className }: CountingNumberProps) {
    const container = useRef(null);
    const digits = endValue.toString().split("");

    useGSAP(() => {
        gsap.to(".digit-strip", {
                        scrollTrigger: {
                trigger: container.current,
                start: "top 85%",
                toggleActions: "play none none none",
            },
            y: (index, target) => {
                const val = parseInt(target.getAttribute("data-value"));
                return `-${val * 10}%`;
            },
            duration: 2,
            ease: "power3.out",
            stagger: 0.1,
        });
    }, { scope: container });

    return (
        <div ref={container} className="flex overflow-hidden h-[3.4em] items-center">
            {digits.map((digit, i) => (
                <div key={i} className="relative h-full overflow-hidden">
                    <div 
                        className="digit-strip flex flex-col transition-none" 
                        data-value={digit}
                    >
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                            <p key={n} className={className}>
                                {n}
                            </p>
                        ))}
                    </div>
                </div>
            ))}
            <p className="lg:text-[35px] text-[25px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#8ED6D7] to-[#4B7171]">+</p>
        </div>
    );
}

type CardAppearProps = {
    card: React.ReactNode;
    translate: number;
}

export function CardAppear({ card, translate }: CardAppearProps) {
    const container = useRef(null);

    useGSAP(() => {
        gsap.from(".slide-card", {
                        scrollTrigger: {
                trigger: container.current,
                start: "top 85%",
                toggleActions: "play none none none",
            },
            x: translate,
            opacity: 0,
            duration: 1.8,
            ease: 'power3.out',
            stagger: 0.3,
        });
    }, { scope: container});

    return (
        <div ref={container}>
            {card}
        </div>
    )
}

export function useHoverFloat() {
    const onMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
        gsap.to(e.currentTarget, {
            y: -15,
            scale: 1.03,
            duration: 0.4, 
            ease: "power2.out",
            boxShadow: "0px 15px 30px rgba(142, 214, 215, 0.3)",
            borderColor: "rgba(142, 214, 215, 0.6)",
        });
    };

    const onMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
        gsap.to(e.currentTarget, {
            y: 0, 
            scale: 1, 
            duration: 0.4,
            ease: "power2.inOut",
            boxShadow: "0px 0px 0px rgba(0,0,0,0)",
            borderColor: "rgba(255, 255, 255, 0.2)",
        });
    };

    return { onMouseEnter, onMouseLeave};
}


export function HoverZoomImage() {
    const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Target the actual img tag inside the container
    const img = container.querySelector("img");
    if (!img) return;

    const hoverIn = () => {
      gsap.to(img, { scale: 1.2, duration: 0.6, ease: "power2.out" });
    };

    const hoverOut = () => {
      gsap.to(img, { scale: 1, duration: 0.6, ease: "power2.out" });
    };

    container.addEventListener("mouseenter", hoverIn);
    container.addEventListener("mouseleave", hoverOut);

    return () => {
      container.removeEventListener("mouseenter", hoverIn);
      container.removeEventListener("mouseleave", hoverOut);
    };
  }, []);

  // Return the ref to be spread onto the container
  return { ref: containerRef };
}

export function HoverZoomWrapper({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const img = container?.querySelector("img");
    if (!container || !img) return;

    const hoverIn = () => gsap.to(img, { scale: 1.1, duration: 0.6, ease: "power2.out" });
    const hoverOut = () => gsap.to(img, { scale: 1, duration: 0.6, ease: "power2.out" });

    container.addEventListener("mouseenter", hoverIn);
    container.addEventListener("mouseleave", hoverOut);
    return () => {
      container.removeEventListener("mouseenter", hoverIn);
      container.removeEventListener("mouseleave", hoverOut);
    };
  }, []);

  return (
    <div ref={containerRef} className="overflow-hidden rounded-[14px] w-full h-full">
      {children}
    </div>
  );
}