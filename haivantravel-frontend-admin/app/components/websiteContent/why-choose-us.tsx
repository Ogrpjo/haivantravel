"use client";

import { useEffect, useState } from "react";
import { fetchWhyChooseUs, saveWhyChooseUs } from "./api";
import { getApiBaseUrl } from "@/app/lib/apiBaseUrl";

type WhyChooseUsFormState = {
  small_text: string;
  big_text: string;
  description: string;
  tick_1: string;
  tick_2: string;
  tick_3: string;
  tick_4: string;
};

function normalizeImageUrl(url: string | null): string | null {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  return `${getApiBaseUrl().replace(/\/+$/, "")}/${url.replace(/^\/+/, "")}`;
}

export default function WhyChooseUsSection() {
  const [form, setForm] = useState<WhyChooseUsFormState>({
    small_text: "Tại sao chọn chúng tôi",
    big_text: "Chuyên nghiệp từ khâu lên kế hoạch đến thực thi",
    description:
      "Chúng tôi không chỉ tổ chức sự kiện — chúng tôi kiến tạo những trải nghiệm đáng nhớ. Mỗi chi tiết đều được chăm chút tỉ mỉ, từ concept sáng tạo, thiết kế không gian cho đến quản lý hiện trường chuyên nghiệp.",
    tick_1: "Đội ngũ 860+ nhân sự giàu kinh nghiệm",
    tick_2: "Quy trình chuẩn ISO, minh bạch và hiệu quả",
    tick_3: "Cam kết 100% hài lòng hoặc hoàn tiền",
    tick_4: "Hỗ trợ 24/7 trong suốt quá trình tổ chức",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchWhyChooseUs();
        if (!data) return;
        setImageUrl(normalizeImageUrl(data.image_url));
        setForm({
          small_text: data.small_text ?? form.small_text,
          big_text: data.big_text ?? form.big_text,
          description: data.description ?? form.description,
          tick_1: data.tick_1 ?? form.tick_1,
          tick_2: data.tick_2 ?? form.tick_2,
          tick_3: data.tick_3 ?? form.tick_3,
          tick_4: data.tick_4 ?? form.tick_4,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Không tải được dữ liệu Why Choose Us.");
      } finally {
        setIsLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateField = <K extends keyof WhyChooseUsFormState>(key: K, value: WhyChooseUsFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    if (!selectedImage) {
      setPreviewUrl(imageUrl);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedImage);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [imageUrl, selectedImage]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      setIsSaving(true);
      const res = await saveWhyChooseUs({ ...form, image: selectedImage });
      setImageUrl(normalizeImageUrl(res.image_url));
      setSelectedImage(null);
      setMessage("Đã lưu Why Choose Us thành công.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lưu Why Choose Us thất bại.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="rounded-xl border border-white/10 bg-[#1a1a1a] p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Why Choose Us</h2>
        {isLoading ? <span className="text-sm text-white/60">Đang tải...</span> : null}
      </div>

      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <label className="block">
            <p className="mb-2 text-sm text-white/80">small_text</p>
            <input
              type="text"
              value={form.small_text}
              onChange={(e) => updateField("small_text", e.target.value)}
              className="w-full rounded-md border border-white/15 bg-[#121212] px-3 py-2 text-sm outline-none focus:border-[#8ED6D7]"
            />
          </label>

          <label className="block">
            <p className="mb-2 text-sm text-white/80">big_text</p>
            <input
              type="text"
              value={form.big_text}
              onChange={(e) => updateField("big_text", e.target.value)}
              className="w-full rounded-md border border-white/15 bg-[#121212] px-3 py-2 text-sm outline-none focus:border-[#8ED6D7]"
            />
          </label>
        </div>

        <label className="block">
          <p className="mb-2 text-sm text-white/80">image</p>
          <div className="flex flex-col gap-3">
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt="why-choose-us preview"
                className="h-[140px] w-full max-w-[520px] rounded-lg border border-white/10 object-cover"
              />
            ) : null}

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedImage(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-white/70 file:mr-4 file:rounded-md file:border-0 file:bg-[#8ED6D7] file:px-4 file:py-2 file:text-sm file:font-medium file:text-black hover:file:opacity-90"
            />
            <p className="text-xs text-white/50">
              Upload ảnh mới nếu muốn thay đổi. Nếu không chọn ảnh, hệ thống giữ ảnh hiện tại.
            </p>
          </div>
        </label>

        <label className="block">
          <p className="mb-2 text-sm text-white/80">description</p>
          <textarea
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            rows={4}
            className="w-full resize-y rounded-md border border-white/15 bg-[#121212] px-3 py-2 text-sm outline-none focus:border-[#8ED6D7]"
          />
        </label>

        <div className="space-y-3">
          <p className="text-sm font-medium text-white/80">Tick items (4)</p>

          {(["tick_1", "tick_2", "tick_3", "tick_4"] as const).map((key, idx) => (
            <label key={key} className="block">
              <p className="mb-2 text-sm text-white/80">tick_{idx + 1}</p>
              <input
                type="text"
                value={form[key]}
                onChange={(e) => updateField(key, e.target.value)}
                className="w-full rounded-md border border-white/15 bg-[#121212] px-3 py-2 text-sm outline-none focus:border-[#8ED6D7]"
              />
            </label>
          ))}
        </div>

        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        {message ? <p className="text-sm text-emerald-400">{message}</p> : null}

        <button
          type="submit"
          disabled={isSaving}
          className="rounded-md bg-[#8ED6D7] px-4 py-2 text-sm font-medium text-black disabled:opacity-60"
        >
          {isSaving ? "Đang lưu..." : "Lưu Why Choose Us"}
        </button>
      </form>
    </section>
  );
}

