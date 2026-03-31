"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import {
  fetchGalleryList,
  uploadGalleryFiles,
  deleteGalleryItem,
  getApiBaseUrl,
} from "./api";

export type GalleryItem = { id: number; image_url: string };

export default function GallerySection() {
  const [list, setList] = useState<GalleryItem[]>([]);
  const [previewFiles, setPreviewFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadGallery = async () => {
    try {
      setLoading(true);
      const data = await fetchGalleryList();
      setList(data);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Lỗi tải gallery");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadGallery();
  }, []);

  useEffect(() => {
    const urls = previewFiles.map((f) => URL.createObjectURL(f));
    setPreviewUrls(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [previewFiles]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    const images = files.filter((f) => f.type.startsWith("image/"));
    setPreviewFiles((prev) => [...prev, ...images]);
    e.target.value = "";
  };

  const removePreview = (index: number) => {
    setPreviewFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const save = async () => {
    if (previewFiles.length === 0) {
      setMessage("Chọn ít nhất một ảnh để upload.");
      return;
    }
    setMessage("");
    setSaving(true);
    try {
      await uploadGalleryFiles(previewFiles);
      setPreviewFiles([]);
      setPreviewUrls([]);
      setMessage("Đã lưu gallery.");
      await loadGallery();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Lỗi lưu gallery");
    } finally {
      setSaving(false);
    }
  };

  const removeUploadedItem = async (id: number) => {
    setMessage("");
    setDeletingId(id);
    try {
      await deleteGalleryItem(id);
      setMessage("Đã xóa ảnh.");
      await loadGallery();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Lỗi xóa ảnh");
    } finally {
      setDeletingId(null);
    }
  };

  const apiBase = getApiBaseUrl();

  if (loading) {
    return (
      <div className="rounded-lg border border-white/10 bg-[#1a1a1a] p-4">
        <h3 className="font-semibold text-white mb-2">Gallery</h3>
        <p className="text-white/70">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-white/10 bg-[#1a1a1a] p-4">
      <h3 className="font-semibold text-white mb-3">Gallery</h3>
      <p className="text-sm text-white/70 mb-3">
        Chọn nhiều ảnh, xem preview, sau đó bấm Lưu Gallery để upload vào /uploads và lưu vào bảng galleries.
      </p>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={onFileChange}
      />

      <div className="mb-3">
        <button
          type="button"
          className="px-4 py-2 border border-white/20 rounded text-white hover:bg-white/10"
          onClick={() => fileInputRef.current?.click()}
        >
          Chọn ảnh (Upload)
        </button>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 mb-4">
        {list.map((item) => (
          <div key={item.id} className="relative aspect-square rounded overflow-hidden border border-white/15 bg-[#0f0f0f] group">
            <Image
              src={`${apiBase}/${item.image_url}`}
              alt=""
              fill
              className="object-cover"
              unoptimized
            />
            <button
              type="button"
              className="absolute top-1 right-1 min-w-6 h-6 px-1 rounded bg-red-500 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-60"
              onClick={() => void removeUploadedItem(item.id)}
              disabled={deletingId === item.id}
            >
              {deletingId === item.id ? "..." : "×"}
            </button>
          </div>
        ))}
        {previewUrls.map((url, i) => (
          <div key={`preview-${i}`} className="relative aspect-square rounded overflow-hidden border border-white/15 bg-[#0f0f0f] group">
            <Image src={url} alt="" fill className="object-cover" unoptimized />
            <button
              type="button"
              className="absolute top-1 right-1 w-6 h-6 rounded bg-red-500 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => removePreview(i)}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="px-4 py-2 bg-[#05B9BA] text-white rounded hover:bg-[#049a9b] disabled:opacity-50"
          onClick={save}
          disabled={saving || previewFiles.length === 0}
        >
          {saving ? "Đang lưu..." : "Lưu Gallery"}
        </button>
        {message && (
          <span
            className={
              message.startsWith("Lỗi") || message.startsWith("Chọn")
                ? "text-amber-500"
                : "text-green-500"
            }
          >
            {message}
          </span>
        )}
      </div>
    </div>
  );
}
