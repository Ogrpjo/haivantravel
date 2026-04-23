"use client";

import { Form, TextField, Label, Input } from "@heroui/react"
import { Play, PhoneCall, Clock, Mail } from "@deemlol/next-icons"
import { Button } from "@heroui/react"
import { MapMaker } from "../icons"
import { useState } from "react";

type CardContactProps = {
    icon: React.ReactNode;
    name: string;
    detail: string;
}

function CardContact({ icon, name, detail }: CardContactProps) {
    return (
        <div className="flex flex-row gap-[20px]">
            <div className="rounded-[40%] bg-gradient-to-b w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 inset-shadow-sm/100 inset-shadow-white flex items-center justify-center from-[#3F9293] to-[#8E4590] shrink-0">
                <div className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:block">
                    {icon}
                </div>
            </div>
            <div className="flex flex-col items-start justify-center">
                <p className="text-white/40 max-lg:text-[12px]">{name}</p>
                <p className="font-bold text-[16px] md:text-[20px]">{detail}</p>
            </div>
        </div>
    )
}

function LeftContent() {
    return (
        <div className="flex-1">
            <div className="flex xl:flex-col max-md:flex-col max-md:justify-center gap-[20px]">
                <div className="max-lg:flex-1 max-md:text-center">
                    <p className="text-white/40">Liên hệ tư vấn</p>
                    <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-[#8ED6D7] to-[#4B7171] font-black lg:text-[60px] md:text-[40px] text-[30px]">Gửi Brief miễn phí ngay</h1>
                    <p className="text-white/40">Hãy chia sẻ ý tưởng và yêu cầu của bạn. Đội ngũ chuyên gia của chúng tôi sẽ liên hệ và tư vấn miễn phí trong vòng 24 giờ.</p>
                </div>
                <div className="flex max-lg:flex-1 flex-col gap-[20px] md:items-start">
                    <CardContact icon={<MapMaker />} name="Địa chỉ" detail="154 Phan Văn Hớn, Phường Đông Hưng Thuận, TP. Hồ Chí Minh" />
                    <CardContact icon={<PhoneCall size={37} />} name="Hotline" detail="+84 853 566 556" />
                    <CardContact icon={<Mail size={37} />} name="Email" detail="Info.hcmc@haivantravelvn.com" />
                    <CardContact icon={<Clock size={37} />} name="Giờ làm việc" detail="T2 – T7: 8:00 – 18:00" />
                </div>
            </div>
        </div>
    )
}

export function BriefContactFormPanel() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState("");
    const [formData, setFormData] = useState({
        fullName: "",
        companyName: "",
        phone: "",
        email: "",
        eventType: "",
        attendeeScale: "",
        budget: "",
        expectedTime: "",
        requirements: "",
    });

    const apiBaseUrl = (process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:2031").replace(/\/+$/, "");

    const updateField = (key: keyof typeof formData, value: string) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);
        setSubmitMessage("");

        try {
            const response = await fetch(`${apiBaseUrl}/brief-contact`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    full_name: formData.fullName.trim(),
                    company_name: formData.companyName.trim(),
                    phone: formData.phone.trim(),
                    email: formData.email.trim(),
                    event_type: formData.eventType.trim(),
                    attendee_scale: formData.attendeeScale.trim(),
                    budget: formData.budget.trim(),
                    expected_time: formData.expectedTime.trim(),
                    requirements: formData.requirements.trim(),
                }),
            });

            if (!response.ok) {
                throw new Error("submit failed");
            }

            setSubmitMessage("Yêu cầu của quý khách đã được gửi, đội ngũ hỗ trợ của chúng tôi sẽ liên lạc cho bạn sớm nhất có thể!");
            setFormData({
                fullName: "",
                companyName: "",
                phone: "",
                email: "",
                eventType: "",
                attendeeScale: "",
                budget: "",
                expectedTime: "",
                requirements: "",
            });
        } catch {
            setSubmitMessage("Gửi brief thất bại. Vui lòng thử lại sau.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="md:px-[40px] px-[10px] py-[10px] md:py-[50px] bg-white/4 rounded-[16px] border border-white/24 shadow-md shadow-white/24">
            <Form onSubmit={handleSubmit}>
                <div className="gap-[10px] pb-[20px] flex flex-col">
                    <h1 className="font-bold text-[25px]">Thông tin liên hệ</h1>
                    <p className="text-white/70">Tất cả thông tin được bảo mật tuyệt đối</p>
                </div>
                <div className="grid grid-cols-2 gap-[20px] border-white/15 border-b pb-[20px]">
                    <TextField isRequired name="HỌ & TÊN">
                        <Label className="text-white/70 text-[12px] md:text-[16px]">HỌ & TÊN</Label>
                        <Input value={formData.fullName} onChange={(event) => updateField("fullName", event.target.value)} className="bg-white/5 border border-white/15 text-white text-[12px] md:text-[16px] py-[20px] rounded-[18px]" placeholder="Nguyễn Văn A" />
                    </TextField>
                    <TextField isRequired name="CÔNG TY / DOANH NGHIỆP">
                        <Label className="text-white/70 text-[12px] md:text-[16px]">CÔNG TY / DOANH NGHIỆP</Label>
                        <Input value={formData.companyName} onChange={(event) => updateField("companyName", event.target.value)} className="bg-white/5 border border-white/15 text-white text-[12px] md:text-[16px] py-[20px] rounded-[18px]" placeholder="Tên công ty" />
                    </TextField>
                    <TextField isRequired name="SỐ ĐIỆN THOẠI">
                        <Label className="text-white/70 text-[12px] md:text-[16px]">SỐ ĐIỆN THOẠI</Label>
                        <Input value={formData.phone} onChange={(event) => updateField("phone", event.target.value)} className="bg-white/5 border border-white/15 text-white text-[12px] md:text-[16px] py-[20px] rounded-[18px]" placeholder="+84 xxx xxx xxx" />
                    </TextField>
                    <TextField isRequired name="EMAIL">
                        <Label className="text-white/70 text-[12px] md:text-[16px]">EMAIL</Label>
                        <Input type="email" value={formData.email} onChange={(event) => updateField("email", event.target.value)} className="bg-white/5 border border-white/15 text-white text-[12px] md:text-[16px] py-[20px] rounded-[18px]" placeholder="email@company.com" />
                    </TextField>
                </div>
                <div className="py-[20px]">
                    <h1 className="font-bold text-[25px]">Thông tin sự kiện</h1>
                </div>
                <div className="flex flex-col gap-[20px] pb-[40px]">
                    <div className="grid grid-cols-2 gap-[20px] border-white/15">
                        <TextField isRequired name="LOẠI SỰ KIỆN">
                            <Label className="text-white/70 text-[12px] md:text-[16px]">LOẠI SỰ KIỆN</Label>
                            <Input value={formData.eventType} onChange={(event) => updateField("eventType", event.target.value)} className="bg-white/5 border border-white/15 text-white text-[16px] py-[20px] rounded-[18px]" />
                        </TextField>
                        <TextField isRequired name="QUY MÔ (SỐ NGƯỜI)">
                            <Label className="text-white/70 text-[12px] md:text-[16px]">QUY MÔ (SỐ NGƯỜI)</Label>
                            <Input value={formData.attendeeScale} onChange={(event) => updateField("attendeeScale", event.target.value)} className="bg-white/5 border border-white/15 text-white text-[16px] py-[20px] rounded-[18px]" />
                        </TextField>
                        <TextField isRequired name="NGÂN SÁCH DỰ KIẾN">
                            <Label className="text-white/70 text-[12px] md:text-[16px]">NGÂN SÁCH DỰ KIẾN</Label>
                            <Input value={formData.budget} onChange={(event) => updateField("budget", event.target.value)} className="bg-white/5 border border-white/15 text-white text-[16px] py-[20px] rounded-[18px]" />
                        </TextField>
                        <TextField isRequired name="THỜI GIAN DỰ KIẾN">
                            <Label className="text-white/70 text-[12px] md:text-[16px]">THỜI GIAN DỰ KIẾN</Label>
                            <Input value={formData.expectedTime} onChange={(event) => updateField("expectedTime", event.target.value)} className="bg-white/5 border border-white/15 text-white text-[16px] py-[20px] rounded-[18px]" />
                        </TextField>
                    </div>
                    <TextField isRequired name="MÔ TẢ YÊU CẦU / Ý TƯỞNG SỰ KIỆN">
                        <Label className="text-white/70 text-[12px] md:text-[16px]">MÔ TẢ YÊU CẦU / Ý TƯỞNG SỰ KIỆN</Label>
                        <textarea
                            value={formData.requirements}
                            onChange={(event) => updateField("requirements", event.target.value)}
                            className="bg-white/5 border border-white/15 text-white text-[12px] md:text-[16px] p-[20px] rounded-[18px] min-h-[150px] resize-none outline-none w-full"
                            placeholder="Chia sẻ thêm về ý tưởng, chủ đề, yêu cầu đặc biệt hoặc thông tin cần thiết khác..."
                        />
                    </TextField>
                </div>
                <Button type="submit" isDisabled={isSubmitting} className="bg-gradient-to-b from-[#3F9293] to-[#8E4590] rounded-[12px] text-[16px] lg:text-[18px] py-5 h-auto w-full border-b">
                    <p>{isSubmitting ? "Đang gửi..." : "Bắt đầu dự án ngay hôm nay"}</p>
                    <Play size={24} />
                </Button>
                {submitMessage ? (
                    <p className="pt-[16px] text-center text-white/80">{submitMessage}</p>
                ) : null}
                <div className="pt-[30px]">
                    <p className="text-[12px] md:text-[16px] text-white/40 text-center">Bằng cách gửi form này, bạn đồng ý để chúng tôi liên hệ tư vấn. Thông tin của bạn được bảo mật tuyệt đối.</p>
                </div>
            </Form>
        </div>
    );
}

function RightContent() {
    return (
        <div className="flex-1">
            <BriefContactFormPanel />
        </div>
    );
}

export default function FormContact() {
    return (
        <section id="form-contact" className="flex xl:flex-row flex-col py-[80px] lg:px-[148px] sm:px-[84px] px-[20px] gap-[40px]">
            <LeftContent />
            <RightContent />
        </section>
    )
}