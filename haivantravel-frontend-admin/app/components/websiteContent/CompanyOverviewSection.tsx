"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import {
  fetchCompanyOverview,
  saveCompanyOverview,
  getApiBaseUrl,
} from "./api";

type ImageSlot = "large" | "small";

const LABELS: Record<ImageSlot, string> = {
  large: "Ảnh lớn",
  small: "Ảnh nhỏ",
};

export default function CompanyOverviewSection() {
  const [title, setTitle] = useState("");
  const [description1, setDescription1] = useState("");
  const [description2, setDescription2] = useState("");
  const [imageUrls, setImageUrls] = useState<Record<ImageSlot, string | null>>({
    large: null,
    small: null,
  });
  const [previewFiles, setPreviewFiles] = useState<Record<ImageSlot, File | null>>({
    large: null,
    small: null,
  });
  const [previewUrls, setPreviewUrls] = useState<Record<ImageSlot, string | null>>({
    large: null,
    small: null,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const initialRef = useRef<{
    title: string;
    description1: string;
    description2: string;
    imageUrls: Record<ImageSlot, string | null>;
  }>({
    title: "",
    description1: "",
    description2: "",
    imageUrls: { large: null, small: null },
  });
  const fileInputRefs = useRef<Record<ImageSlot, HTMLInputElement | null>>({
    large: null,
    small: null,
  });

  const load = async () => {
    try {
      setLoading(true);
      const data = await fetchCompanyOverview();
      if (data) {
        const nextTitle = data.title ?? "";
        const nextDescription1 = data.description1 ?? "";
        const nextDescription2 = data.description2 ?? "";
        const nextImageUrls = {
          large: data.big_image_url ?? null,
          small: data.small_image_url ?? null,
        };

        setTitle(nextTitle);
        setDescription1(nextDescription1);
        setDescription2(nextDescription2);
        setImageUrls(nextImageUrls);
        initialRef.current = {
          title: nextTitle,
          description1: nextDescription1,
          description2: nextDescription2,
          imageUrls: nextImageUrls,
        };
      }
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  useEffect(() => {
    const urls: Record<ImageSlot, string | null> = { large: null, small: null };
    (["large", "small"] as ImageSlot[]).forEach((slot) => {
      const file = previewFiles[slot];
      if (file) urls[slot] = URL.createObjectURL(file);
    });
    setPreviewUrls(urls);
    return () => {
      (["large", "small"] as ImageSlot[]).forEach((slot) => {
        if (urls[slot]) URL.revokeObjectURL(urls[slot]!);
      });
    };
  }, [previewFiles.large, previewFiles.small]);

  const onFileChange = (slot: ImageSlot) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file?.type.startsWith("image/")) {
      setPreviewFiles((prev) => ({ ...prev, [slot]: file }));
    }
    e.target.value = "";
  };

  const save = async () => {
    setMessage("");

    const payload: {
      title?: string;
      description1?: string;
      description2?: string;
      big_image?: File;
      small_image?: File;
    } = {};

    if (title !== initialRef.current.title) payload.title = title;
    if (description1 !== initialRef.current.description1) payload.description1 = description1;
    if (description2 !== initialRef.current.description2) payload.description2 = description2;
    if (previewFiles.large) payload.big_image = previewFiles.large;
    if (previewFiles.small) payload.small_image = previewFiles.small;

    if (Object.keys(payload).length === 0) {
      setMessage("Không có thay đổi để lưu.");
      return;
    }

    setSaving(true);
    try {
      const saved = await saveCompanyOverview(payload);
      const nextImageUrls = {
        large: saved.big_image_url ?? null,
        small: saved.small_image_url ?? null,
      };
      setImageUrls(nextImageUrls);
      setPreviewFiles({ large: null, small: null });
      setPreviewUrls({ large: null, small: null });
      initialRef.current = {
        title: saved.title ?? "",
        description1: saved.description1 ?? "",
        description2: saved.description2 ?? "",
        imageUrls: nextImageUrls,
      };
      setMessage("Đã lưu.");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Lỗi lưu");
    } finally {
      setSaving(false);
    }
  };

  const apiBase = getApiBaseUrl();

  const renderImageSlot = (slot: ImageSlot) => {
    const displayUrl = previewUrls[slot] ?? (imageUrls[slot] ? `${apiBase}/${imageUrls[slot]}` : null);
    const isLarge = slot === "large";
    const boxClass = isLarge ? "w-32 h-32" : "w-24 h-24";
    return (
      <div key={slot} className="flex flex-col items-center gap-1">
        <span className="text-sm text-white/85">{LABELS[slot]}</span>
        <input
          ref={(el) => { fileInputRefs.current[slot] = el; }}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onFileChange(slot)}
        />
        <button
          type="button"
          className={`${boxClass} rounded border-2 border-dashed border-white/25 text-white/70 flex items-center justify-center hover:border-[#05B9BA] hover:text-[#05B9BA]`}
          onClick={() => fileInputRefs.current[slot]?.click()}
        >
          + Ảnh
        </button>
        {displayUrl && (
          <div className={`${boxClass} relative rounded overflow-hidden border border-white/15 mt-1`}>
            <Image src={displayUrl} alt="" fill className="object-cover" unoptimized />
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="rounded-lg border border-white/10 bg-[#1a1a1a] p-4">
        <h3 className="font-semibold text-white mb-2">Company Overview</h3>
        <p className="text-white/70">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-white/10 bg-[#1a1a1a] p-4">
      <h3 className="font-semibold text-white mb-3">Company Overview</h3>
      <p className="text-sm text-white/70 mb-3">
        Ảnh lớn và ảnh nhỏ. Dữ liệu lưu vào bảng company_overview.
      </p>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-8">
          {renderImageSlot("large")}
          {renderImageSlot("small")}
        </div>
        <div>
          <label className="block text-sm text-white/85 mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-white/15 bg-[#121212] text-white rounded px-2 py-1.5"
          />
        </div>
        <div>
          <label className="block text-sm text-white/85 mb-1">Description 1</label>
          <textarea
            value={description1}
            onChange={(e) => setDescription1(e.target.value)}
            className="w-full border border-white/15 bg-[#121212] text-white rounded px-2 py-1.5 resize-none"
            rows={3}
          />
        </div>
        <div>
          <label className="block text-sm text-white/85 mb-1">Description 2</label>
          <textarea
            value={description2}
            onChange={(e) => setDescription2(e.target.value)}
            className="w-full border border-white/15 bg-[#121212] text-white rounded px-2 py-1.5 resize-none"
            rows={3}
          />
        </div>
      </div>
      <div className="flex items-center gap-2 mt-3">
        <button
          type="button"
          className="px-4 py-2 bg-[#05B9BA] text-white rounded hover:bg-[#049a9b] disabled:opacity-50"
          onClick={save}
          disabled={saving}
        >
          {saving ? "Đang lưu..." : "Lưu"}
        </button>
        {message && (
          <span className={message.startsWith("Lỗi") ? "text-red-400" : "text-green-400"}>
            {message}
          </span>
        )}
      </div>
    </div>
  );
}
