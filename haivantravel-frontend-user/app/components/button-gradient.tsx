"use client";

import { Button } from "@heroui/react"
import { Play } from "@deemlol/next-icons"
import { useHoverFloat } from "./effect/text-split";

type ButtonGradientProps = {
    name: string;
    onClick?: () => void;
    className?: string;
    iconSize?: number;
}

export default function ButtonGradient({
    name,
    onClick,
    className = "",
    iconSize = 24,
}: ButtonGradientProps) {
    const useEffect = useHoverFloat();
    return (
        <button
            {...useEffect}
            onClick={onClick}
            className={`!bg-gradient-to-b !from-[#3F9293] !flex !items-center !to-[#8E4590] !rounded-[12px] !text-[16px] !lg:text-[18px] !py-3 !px-3 !h-auto !border-b ${className}`}
        >
            <p>{name}</p>
            <Play size={iconSize} />
        </button>
    )
}