"use client";

import { useEffect, useState } from "react";
import { fetchCollaboratorContent, saveCollaboratorContent } from "./api";

type CollaboratorForm = {
  first_text: string;
  blue_text_1: string;
  blue_text_2: string;
  last_text: string;
  description: string;
};

export default function CollaboratorSection() {
  const [form, setForm] = useState<CollaboratorForm>({
    first_text: "ĐƯỢC TIN TƯỞNG BỞI",
    blue_text_1: "KHÁCH HÀNG",
    blue_text_2: "ĐỐI TÁC",
    last_text: "CỦA CHÚNG TÔI",
    description: "Những doanh nghiệp đã tin tưởng Hải Vân Event",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadContent = async () => {
    setError("");
    const content = await fetchCollaboratorContent();

    if (content) {
      setForm({
        first_text: content.first_text ?? "",
        blue_text_1: content.blue_text_1 ?? "",
        blue_text_2: content.blue_text_2 ?? "",
        last_text: content.last_text ?? "",
        description: content.description ?? "",
      });
    }
  };

  useEffect(() => {
    const run = async () => {
      try {
        await loadContent();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Không tải được dữ liệu collaborator.");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const saveContent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    try {
      await saveCollaboratorContent(form);
      setMessage("Đã lưu nội dung Collaborator.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lưu nội dung thất bại.");
    } finally {
      setSaving(false);
    }
  };



  return (
    <section className="rounded-xl border border-white/10 bg-[#1a1a1a] p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Collaborator Section</h2>
        {loading ? <span className="text-sm text-white/60">Đang tải...</span> : null}
      </div>

      <form className="space-y-3" onSubmit={saveContent}>
        <input
          value={form.first_text}
          onChange={(e) => setForm((p) => ({ ...p, first_text: e.target.value }))}
          placeholder="first_text"
          className="w-full rounded-md border border-white/15 bg-[#121212] px-3 py-2 text-sm"
        />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <input
            value={form.blue_text_1}
            onChange={(e) => setForm((p) => ({ ...p, blue_text_1: e.target.value }))}
            placeholder="blue_text_1"
            className="w-full rounded-md border border-white/15 bg-[#121212] px-3 py-2 text-sm"
          />
          <input
            value={form.blue_text_2}
            onChange={(e) => setForm((p) => ({ ...p, blue_text_2: e.target.value }))}
            placeholder="blue_text_2"
            className="w-full rounded-md border border-white/15 bg-[#121212] px-3 py-2 text-sm"
          />
        </div>
        <input
          value={form.last_text}
          onChange={(e) => setForm((p) => ({ ...p, last_text: e.target.value }))}
          placeholder="last_text"
          className="w-full rounded-md border border-white/15 bg-[#121212] px-3 py-2 text-sm"
        />
        <textarea
          rows={3}
          value={form.description}
          onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
          placeholder="description"
          className="w-full rounded-md border border-white/15 bg-[#121212] px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-[#8ED6D7] px-4 py-2 text-sm font-medium text-black disabled:opacity-60"
        >
          {saving ? "Đang lưu..." : "Lưu Collaborator Content"}
        </button>
      </form>


      {error ? <p className="mt-3 text-sm text-red-400">{error}</p> : null}
      {message ? <p className="mt-3 text-sm text-emerald-400">{message}</p> : null}
    </section>
  );
}

