"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import {
  fetchEmotionCreator,
  saveEmotionCreator,
  getApiBaseUrl,
} from "./api";

type ImageSlot = "center" | "left" | "right";

const LABELS: Record<ImageSlot, string> = {
  center: "Ảnh trung tâm",
  left: "Ảnh bên trái",
  right: "Ảnh bên phải",
};

export default function EmotionCreatorSection() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionDetail, setDescriptionDetail] = useState("");
  const [imageUrls, setImageUrls] = useState<Record<ImageSlot, string | null>>({
    center: null,
    left: null,
    right: null,
  });
  const [previewFiles, setPreviewFiles] = useState<Record<ImageSlot, File | null>>({
    center: null,
    left: null,
    right: null,
  });
  const [previewUrls, setPreviewUrls] = useState<Record<ImageSlot, string | null>>({
    center: null,
    left: null,
    right: null,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const initialRef = useRef<{
    title: string;
    description: string;
    descriptionDetail: string;
    imageUrls: Record<ImageSlot, string | null>;
  }>({
    title: "",
    description: "",
    descriptionDetail: "",
    imageUrls: { center: null, left: null, right: null },
  });
  const fileInputRefs = useRef<Record<ImageSlot, HTMLInputElement | null>>({
    center: null,
    left: null,
    right: null,
  });

  const load = async () => {
    try {
      setLoading(true);
      const data = await fetchEmotionCreator();
      if (data) {
        const nextTitle = data.title ?? "";
        const nextDescription = data.description ?? "";
        const nextDescriptionDetail = data.description_detail ?? "";
        const nextImageUrls = {
          center: data.center_image_url ?? null,
          left: data.left_image_url ?? null,
          right: data.right_image_url ?? null,
        };

        setTitle(nextTitle);
        setDescription(nextDescription);
        setDescriptionDetail(nextDescriptionDetail);
        setImageUrls(nextImageUrls);
        initialRef.current = {
          title: nextTitle,
          description: nextDescription,
          descriptionDetail: nextDescriptionDetail,
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
    const urls: Record<ImageSlot, string | null> = { center: null, left: null, right: null };
    (["center", "left", "right"] as ImageSlot[]).forEach((slot) => {
      const file = previewFiles[slot];
      if (file) urls[slot] = URL.createObjectURL(file);
    });
    setPreviewUrls(urls);
    return () => {
      (["center", "left", "right"] as ImageSlot[]).forEach((slot) => {
        if (urls[slot]) URL.revokeObjectURL(urls[slot]!);
      });
    };
  }, [previewFiles.center, previewFiles.left, previewFiles.right]);

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
      description?: string;
      description_detail?: string;
      center_image?: File;
      left_image?: File;
      right_image?: File;
    } = {};

    if (title !== initialRef.current.title) payload.title = title;
    if (description !== initialRef.current.description) payload.description = description;
    if (descriptionDetail !== initialRef.current.descriptionDetail) {
      payload.description_detail = descriptionDetail;
    }
    if (previewFiles.center) payload.center_image = previewFiles.center;
    if (previewFiles.left) payload.left_image = previewFiles.left;
    if (previewFiles.right) payload.right_image = previewFiles.right;

    if (Object.keys(payload).length === 0) {
      setMessage("Không có thay đổi để lưu.");
      return;
    }

    setSaving(true);
    try {
      const saved = await saveEmotionCreator(payload);
      const nextImageUrls = {
        center: saved.center_image_url ?? null,
        left: saved.left_image_url ?? null,
        right: saved.right_image_url ?? null,
      };
      setImageUrls(nextImageUrls);
      setPreviewFiles({ center: null, left: null, right: null });
      setPreviewUrls({ center: null, left: null, right: null });
      initialRef.current = {
        title: saved.title ?? "",
        description: saved.description ?? "",
        descriptionDetail: saved.description_detail ?? "",
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
          className="w-24 h-24 rounded border-2 border-dashed border-white/25 text-white/70 flex items-center justify-center hover:border-[#05B9BA] hover:text-[#05B9BA]"
          onClick={() => fileInputRefs.current[slot]?.click()}
        >
          + Ảnh
        </button>
        {displayUrl && (
          <div className="w-24 h-24 relative rounded overflow-hidden border mt-1">
            <Image src={displayUrl} alt="" fill className="object-cover" unoptimized />
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="rounded-lg border border-white/10 bg-[#1a1a1a] p-4">
        <h3 className="font-semibold text-white mb-2">Emotion Creator</h3>
        <p className="text-white/70">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-white/10 bg-[#1a1a1a] p-4">
      <h3 className="font-semibold text-white mb-3">Emotion Creator</h3>
      <p className="text-sm text-white/70 mb-3">
        Ảnh lưu vào thư mục upload, URL và text lưu vào bảng emotion_creator.
      </p>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-6">
          {renderImageSlot("left")}
          {renderImageSlot("center")}
          {renderImageSlot("right")}
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
          <label className="block text-sm text-white/85 mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-white/15 bg-[#121212] text-white rounded px-2 py-1.5 resize-none"
            rows={3}
          />
        </div>
        <div>
          <label className="block text-sm text-white/85 mb-1">Mô tả chi tiết</label>
          <textarea
            value={descriptionDetail}
            onChange={(e) => setDescriptionDetail(e.target.value)}
            className="w-full border border-white/15 bg-[#121212] text-white rounded px-2 py-1.5 resize-none"
            rows={4}
            placeholder="Mô tả chi tiết..."
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
