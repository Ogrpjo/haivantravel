"use client";

import { getApiBaseUrl } from "@/app/lib/apiBaseUrl";
import { useEffect, useState } from "react";
import { fetchExperienceContent, saveExperienceContent } from "./api";

type FormState = {
  small_text: string;
  big_text: string;
  description: string;
  small_image_1_name: string;
  small_image_2_name: string;
  small_image_3_name: string;
  small_image_4_name: string;
};

function normalizeImageUrl(url: string | null): string | null {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  return `${getApiBaseUrl().replace(/\/+$/, "")}/${url.replace(/^\/+/, "")}`;
}

export default function ExperienceSection() {
  const [form, setForm] = useState<FormState>({
    small_text: "Kinh nghiệm thực chiến",
    big_text: "Hơn 1500+ sự kiện được tổ chức thành công",
    description:
      "Từ startup 50 người đến tập đoàn đa quốc gia, chúng tôi đã đồng hành và thực hiện thành công hàng nghìn chương trình sự kiện lớn nhỏ trên khắp cả nước và quốc tế.",
    small_image_1_name: "Gala Dinner 2024",
    small_image_2_name: "Team building Q1",
    small_image_3_name: "Conference APAC",
    small_image_4_name: "Year End Party",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [bigImageUrl, setBigImageUrl] = useState<string | null>(null);
  const [smallImageUrls, setSmallImageUrls] = useState<(string | null)[]>([null, null, null, null]);
  const [bigImageFile, setBigImageFile] = useState<File | null>(null);
  const [smallImageFiles, setSmallImageFiles] = useState<(File | null)[]>([null, null, null, null]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchExperienceContent();
        if (!data) return;
        setForm((prev) => ({
          ...prev,
          small_text: data.small_text ?? prev.small_text,
          big_text: data.big_text ?? prev.big_text,
          description: data.description ?? prev.description,
          small_image_1_name: data.small_image_1_name ?? prev.small_image_1_name,
          small_image_2_name: data.small_image_2_name ?? prev.small_image_2_name,
          small_image_3_name: data.small_image_3_name ?? prev.small_image_3_name,
          small_image_4_name: data.small_image_4_name ?? prev.small_image_4_name,
        }));
        setBigImageUrl(normalizeImageUrl(data.big_image_url));
        setSmallImageUrls([
          normalizeImageUrl(data.small_image_1_url),
          normalizeImageUrl(data.small_image_2_url),
          normalizeImageUrl(data.small_image_3_url),
          normalizeImageUrl(data.small_image_4_url),
        ]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Không tải được Experience.");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      setIsSaving(true);
      const res = await saveExperienceContent({
        ...form,
        big_image: bigImageFile,
        small_image_1: smallImageFiles[0],
        small_image_2: smallImageFiles[1],
        small_image_3: smallImageFiles[2],
        small_image_4: smallImageFiles[3],
      });
      setBigImageUrl(normalizeImageUrl(res.big_image_url ?? null));
      setSmallImageUrls([
        normalizeImageUrl(res.small_image_1_url ?? null),
        normalizeImageUrl(res.small_image_2_url ?? null),
        normalizeImageUrl(res.small_image_3_url ?? null),
        normalizeImageUrl(res.small_image_4_url ?? null),
      ]);
      setBigImageFile(null);
      setSmallImageFiles([null, null, null, null]);
      setMessage("Đã lưu Experience thành công.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lưu Experience thất bại.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="rounded-xl border border-white/10 bg-[#1a1a1a] p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Experience</h2>
        {isLoading ? <span className="text-sm text-white/60">Đang tải...</span> : null}
      </div>

      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <label className="block">
            <p className="mb-2 text-sm text-white/80">small_text</p>
            <input
              type="text"
              value={form.small_text}
              onChange={(e) => setForm((p) => ({ ...p, small_text: e.target.value }))}
              className="w-full rounded-md border border-white/15 bg-[#121212] px-3 py-2 text-sm outline-none focus:border-[#8ED6D7]"
            />
          </label>
          <label className="block">
            <p className="mb-2 text-sm text-white/80">big_text</p>
            <input
              type="text"
              value={form.big_text}
              onChange={(e) => setForm((p) => ({ ...p, big_text: e.target.value }))}
              className="w-full rounded-md border border-white/15 bg-[#121212] px-3 py-2 text-sm outline-none focus:border-[#8ED6D7]"
            />
          </label>
        </div>
        <label className="block">
          <p className="mb-2 text-sm text-white/80">description</p>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            className="w-full rounded-md border border-white/15 bg-[#121212] px-3 py-2 text-sm outline-none focus:border-[#8ED6D7]"
          />
        </label>

        <div className="rounded-lg border border-white/10 p-3">
          <p className="mb-2 text-sm text-white/80">big_image</p>
          {bigImageUrl ? <img src={bigImageUrl} alt="big preview" className="mb-2 h-[140px] w-full max-w-[520px] rounded-lg object-cover" /> : null}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setBigImageFile(e.target.files?.[0] ?? null)}
            className="block w-full text-sm text-white/70 file:mr-4 file:rounded-md file:border-0 file:bg-[#8ED6D7] file:px-4 file:py-2 file:text-sm file:font-medium file:text-black hover:file:opacity-90"
          />
          <p className="mt-1 text-xs text-white/60">Chỉ được upload ảnh có dung lượng tối đa là 2MB / 1 ảnh.</p>
        </div>

        {[1, 2, 3, 4].map((idx) => (
          <div key={idx} className="rounded-lg border border-white/10 p-3">
            <p className="mb-2 text-sm font-semibold text-white/80">Small image {idx}</p>
            {smallImageUrls[idx - 1] ? <img src={smallImageUrls[idx - 1] ?? ""} alt={`small-${idx}`} className="mb-2 h-[120px] w-full max-w-[420px] rounded-lg object-cover" /> : null}
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setSmallImageFiles((prev) => prev.map((f, i) => (i === idx - 1 ? e.target.files?.[0] ?? null : f)))
              }
              className="block w-full text-sm text-white/70 file:mr-4 file:rounded-md file:border-0 file:bg-[#8ED6D7] file:px-4 file:py-2 file:text-sm file:font-medium file:text-black hover:file:opacity-90"
            />
            <p className="mt-1 text-xs text-white/60">Chỉ được upload ảnh có dung lượng tối đa là 2MB / 1 ảnh.</p>
            <input
              type="text"
              value={form[`small_image_${idx}_name` as keyof FormState]}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, [`small_image_${idx}_name`]: e.target.value } as FormState))
              }
              className="mt-2 w-full rounded-md border border-white/15 bg-[#121212] px-3 py-2 text-sm outline-none focus:border-[#8ED6D7]"
              placeholder={`small_image_${idx}_name`}
            />
          </div>
        ))}

        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        {message ? <p className="text-sm text-emerald-400">{message}</p> : null}
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-md bg-[#8ED6D7] px-4 py-2 text-sm font-medium text-black disabled:opacity-60"
        >
          {isSaving ? "Đang lưu..." : "Lưu Experience"}
        </button>
      </form>
    </section>
  );
}

