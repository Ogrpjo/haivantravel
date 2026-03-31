"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { fetchAboutUs, saveAboutUs, getApiBaseUrl } from "./api";

export default function AboutUsSection() {
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const initialRef = useRef<{ description: string; imageUrl: string | null }>({
    description: "",
    imageUrl: null,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchAboutUs();
        if (data) {
          const nextDescription = data.description ?? "";
          const nextImageUrl = data.image_url ?? null;
          setDescription(nextDescription);
          setImageUrl(nextImageUrl);
          initialRef.current = {
            description: nextDescription,
            imageUrl: nextImageUrl,
          };
        }
      } catch (e) {
        setMessage(e instanceof Error ? e.message : "Lỗi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  useEffect(() => {
    if (!previewFile) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(previewFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [previewFile]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file?.type.startsWith("image/")) setPreviewFile(file);
    e.target.value = "";
  };

  const save = async () => {
    setMessage("");

    const payload: { description?: string; image?: File } = {};
    if (description !== initialRef.current.description) payload.description = description;
    if (previewFile) payload.image = previewFile;

    if (Object.keys(payload).length === 0) {
      setMessage("Không có thay đổi để lưu.");
      return;
    }

    setSaving(true);
    try {
      const result = await saveAboutUs(payload);
      const nextDescription = result.description ?? "";
      const nextImageUrl = result.image_url ?? null;
      setDescription(nextDescription);
      setImageUrl(nextImageUrl);
      setPreviewFile(null);
      setPreviewUrl(null);
      initialRef.current = {
        description: nextDescription,
        imageUrl: nextImageUrl,
      };
      setMessage("Đã lưu.");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Lỗi lưu");
    } finally {
      setSaving(false);
    }
  };

  const apiBase = getApiBaseUrl();
  const displayImage = previewUrl ?? (imageUrl ? `${apiBase}/${imageUrl}` : null);

  if (loading) {
    return (
      <div className="rounded-lg border border-white/10 bg-[#1a1a1a] p-4">
        <h3 className="font-semibold text-white mb-2">About Us</h3>
        <p className="text-white/70">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-white/10 bg-[#1a1a1a] p-4">
      <h3 className="font-semibold text-white mb-3">About Us</h3>
      <div className="space-y-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onFileChange}
        />
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="w-24 h-24 rounded border-2 border-dashed border-white/25 text-white/70 flex items-center justify-center hover:border-[#05B9BA] hover:text-[#05B9BA]"
            onClick={() => fileInputRef.current?.click()}
          >
            + Ảnh
          </button>
          {displayImage && (
            <div className="w-24 h-24 relative rounded overflow-hidden border border-white/15">
              <Image
                src={displayImage}
                alt=""
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          )}
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
