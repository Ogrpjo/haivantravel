import ButtonGradient from "../button-gradient";
import { useEffect, useMemo, useState } from "react";
import LeftToRightText, { useHoverFloat } from "../effect/text-split";

type WorkCardProps = {
    number: string;
    title: string;
    description: string;

}

function WorkCard({ number, title, description }: WorkCardProps) {
    const useEffect = useHoverFloat();
    return (
        <div {...useEffect} className="w-full flex bg-white/4 border-white/24 border rounded-[14px] shadow-md shadow-white/10">
            <div className="px-[15px] w-full flex py-[15px] gap-[20px]">
                <div className="rounded-[12px] bg-gradient-to-b w-fit h-fit px-[20px] py-[20px] inset-shadow-sm/100 inset-shadow-white flex items-center justify-center font-bold from-[#3F9293] to-[#8E4590]">
                    <p>{number}</p>
                </div>
                <div className="flex flex-col gap-[10px]">
                    <h1 className="lg:text-[20px] font-bold">{title}</h1>
                    <p className="text-white/70 lg:text-[18px]">{description}</p>
                </div>
            </div>
        </div>
    )
}

const workProcessData = {
    small_text: "Cách chúng tôi làm việc",
    big_text: "Quy trình 6 bước chuẩn",
    description: "Quy trình được chuẩn hoá giúp đảm bảo mọi sự kiện đều đạt chất lượng cao nhất và đúng tiến độ",
}

type WorkingProcessApiCard = {
    number: string | null;
    title: string | null;
    description: string | null;
    is_active?: boolean | null;
};

type WorkingProcessApiData = {
    small_text: string | null;
    big_text: string | null;
    description: string | null;
    cards: WorkingProcessApiCard[] | null;
};

function getApiBaseUrl(): string {
    return process.env.NEXT_PUBLIC_API_URL?.trim() || "https://api.haivanevent.vn";
}

function Introduce({ data }: { data: typeof workProcessData }) {
    return (
        <div className="flex flex-col items-center justify-center gap-[20px]">
            <LeftToRightText text={data.small_text} className="text-white/70 slide-text" />
            <LeftToRightText text={data.big_text} className="text-transparent bg-clip-text bg-gradient-to-r from-[#8ED6D7] to-[#4B7171] font-black lg:text-[60px] md:text-[40px] text-[30px] slide-text" />
            <LeftToRightText text={data.description} className="text-white/70 lg:text-[18px] max-w-[600px] text-center slide-text" />
        </div>
    )
}

const workCardData = [
    { number: "01", title: "Tiếp nhận Brief", description: "Lắng nghe yêu cầum mục tiêu và ngân sách của khách hàng. Tư vấn và phân tích nhu cầu cụ thể để định hình concept phù hợp." },
    { number: "02", title: "Lên kế hoạch & Concept", description: "Đội ngũ createive phát triển ý tưởng, thiết kế concept sự kiện độc đáo. Trình bày proposal chi tiết và điều chỉnh theo phản hồi" },
    { number: "03", title: "Báo giá & Ký hợp đồng", description: "Lập bảng dự toán ngân sách chi tiết, minh bạch. Ký kết hợp đồng và cam kết tiến độ thực hiện cụ thể." },
    { number: "04", title: "Chuẩn bị & Setup", description: "Điều phối các nhà cung cấp, setup địa điểm, kiểm tra âm thanh ánh sáng, trang trí và rehearsal đầy đủ trước sự kiện." },
    { number: "05", title: "Thực thi sự kiện", description: "Đội ngũ chuyên nghiệp điều hành toàn bộ sự kiện theo kịch bản đã duyệt, đảm bảo mọi chi tiết diễn ra hoàn hảo." },
    { number: "06", title: "Báo cáo & Đánh giá", description: "Tổng kết sau sự kiện, bàn giao hình ảnh/video chuyên nghiệp, thu thập phản hồi và đưa ra báo cáo kết quả chi tiết." }
]

function ListProcess({ cards }: { cards: typeof workCardData }) {
    return (
        <div className="grid 2xl:grid-cols-3 gap-[20px] lg:grid-cols-2">
            {cards.map((data, index) => (
                <WorkCard key={index} number={data.number} title={data.title} description={data.description} />
            ))}
        </div>
    )
}

export default function WorkingProcess() {
    const [remoteData, setRemoteData] = useState<WorkingProcessApiData | null>(null);
    const scrollToFormContact = () => {
        const target = document.getElementById("form-contact");
        if (!target) return;
        target.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch(`${getApiBaseUrl()}/working-process-content`, { cache: "no-store" });
                if (!res.ok) return;
                const data = (await res.json()) as WorkingProcessApiData | null;
                if (data) setRemoteData(data);
            } catch {
                // Keep fallback static content.
            }
        };
        load();
    }, []);

    const introData = useMemo(() => {
        if (!remoteData) return workProcessData;
        return {
            small_text: remoteData.small_text || workProcessData.small_text,
            big_text: remoteData.big_text || workProcessData.big_text,
            description: remoteData.description || workProcessData.description,
        };
    }, [remoteData]);

    const cards = useMemo(() => {
        if (!remoteData?.cards || remoteData.cards.length !== 6) return workCardData;
        const normalized = remoteData.cards
            .map((c, idx) => ({
                number: c.number || workCardData[idx].number,
                title: c.title || workCardData[idx].title,
                description: c.description || workCardData[idx].description,
                is_active: c.is_active ?? true,
            }))
            .filter((c) => c.is_active);
        return normalized.length ? normalized : workCardData;
    }, [remoteData]);

    return (
        <section className="relative lg:px-[148px] sm:px-[84px] px-[20px] py-[80px] lg:py-[110px] flex flex-col items-center gap-[50px] lg:gap-[80px]">
            <div className="absolute w-[400px] h-[400px] z-10 bg-[#3F9293]/15 rounded-full blur-[50px] left-0 top-30 opacity-80" />
            <div className="absolute w-[400px] h-[400px] z-10 bg-[#904589]/15 rounded-full blur-[50px] right-0 bottom-0 opacity-80" />
            <Introduce data={introData} />
            <ListProcess cards={cards} />
            <ButtonGradient name="Bắt đầu dự án ngay hôm nay" onClick={scrollToFormContact} />
        </section>
    )
}
