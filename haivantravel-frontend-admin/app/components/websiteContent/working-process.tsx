"use client";

import { useEffect, useMemo, useState } from "react";
import {
  fetchWorkingProcessContent,
  saveWorkingProcessContent,
  type WorkingProcessCardPayload,
} from "./api";

type WorkingProcessFormState = {
  small_text: string;
  big_text: string;
  description: string;
  cards: WorkingProcessCardPayload[];
};

const defaultCards: WorkingProcessCardPayload[] = [
  { number: "01", title: "Tiếp nhận Brief", description: "", is_active: true },
  { number: "02", title: "Lên kế hoạch & Concept", description: "", is_active: true },
  { number: "03", title: "Báo giá & Ký hợp đồng", description: "", is_active: true },
  { number: "04", title: "Chuẩn bị & Setup", description: "", is_active: true },
  { number: "05", title: "Thực thi sự kiện", description: "", is_active: true },
  { number: "06", title: "Báo cáo & Đánh giá", description: "", is_active: true },
];

function normalizeCards(cards: WorkingProcessCardPayload[] | null | undefined): WorkingProcessCardPayload[] {
  if (!Array.isArray(cards) || cards.length !== 6) return defaultCards.map((c) => ({ ...c }));
  return cards.map((c, idx) => ({
    number: c?.number ?? defaultCards[idx]?.number ?? null,
    title: c?.title ?? "",
    description: c?.description ?? "",
    is_active: c?.is_active ?? true,
  }));
}

export default function WorkingProcessSection() {
  const [form, setForm] = useState<WorkingProcessFormState>({
    small_text: "Cách chúng tôi làm việc",
    big_text: "Quy trình 6 bước chuẩn",
    description: "Quy trình được chuẩn hoá giúp đảm bảo mọi sự kiện đều đạt chất lượng cao nhất và đúng tiến độ",
    cards: defaultCards.map((c) => ({ ...c })),
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchWorkingProcessContent();
        if (!data) return;
        setForm({
          small_text: data.small_text ?? "Cách chúng tôi làm việc",
          big_text: data.big_text ?? "Quy trình 6 bước chuẩn",
          description:
            data.description ??
            "Quy trình được chuẩn hoá giúp đảm bảo mọi sự kiện đều đạt chất lượng cao nhất và đúng tiến độ",
          cards: normalizeCards(data.cards),
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Không tải được dữ liệu Working Process.");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const cards = useMemo(() => normalizeCards(form.cards), [form.cards]);

  const updateField = <K extends keyof WorkingProcessFormState>(key: K, value: WorkingProcessFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateCard = (index: number, patch: Partial<WorkingProcessCardPayload>) => {
    updateField(
      "cards",
      cards.map((c, i) => (i === index ? { ...c, ...patch } : c)),
    );
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      setIsSaving(true);
      await saveWorkingProcessContent({
        small_text: form.small_text,
        big_text: form.big_text,
        description: form.description,
        cards,
      });
      setMessage("Đã lưu Working Process thành công.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lưu Working Process thất bại.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="rounded-xl border border-white/10 bg-[#1a1a1a] p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Working Process</h2>
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
          <p className="mb-2 text-sm text-white/80">description</p>
          <textarea
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            rows={3}
            className="w-full resize-y rounded-md border border-white/15 bg-[#121212] px-3 py-2 text-sm outline-none focus:border-[#8ED6D7]"
          />
        </label>

        <div className="space-y-3">
          <p className="text-sm font-medium text-white/80">Cards (6)</p>

          {cards.map((card, idx) => (
            <div key={idx} className="rounded-lg border border-white/10 bg-[#121212] p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-semibold text-white/80">Card {idx + 1}</p>
                <label className="flex items-center gap-2 text-sm text-white/70">
                  <input
                    type="checkbox"
                    checked={Boolean(card.is_active ?? true)}
                    onChange={(e) => updateCard(idx, { is_active: e.target.checked })}
                  />
                  Active
                </label>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <label className="block">
                  <p className="mb-2 text-sm text-white/80">number</p>
                  <input
                    type="text"
                    value={card.number ?? ""}
                    onChange={(e) => updateCard(idx, { number: e.target.value || null })}
                    className="w-full rounded-md border border-white/15 bg-[#121212] px-3 py-2 text-sm outline-none focus:border-[#8ED6D7]"
                  />
                </label>
                <label className="block">
                  <p className="mb-2 text-sm text-white/80">title</p>
                  <input
                    type="text"
                    value={card.title ?? ""}
                    onChange={(e) => updateCard(idx, { title: e.target.value || null })}
                    className="w-full rounded-md border border-white/15 bg-[#121212] px-3 py-2 text-sm outline-none focus:border-[#8ED6D7]"
                  />
                </label>
              </div>

              <label className="block">
                <p className="mb-2 text-sm text-white/80">description</p>
                <textarea
                  value={card.description ?? ""}
                  onChange={(e) => updateCard(idx, { description: e.target.value || null })}
                  rows={3}
                  className="w-full resize-y rounded-md border border-white/15 bg-[#121212] px-3 py-2 text-sm outline-none focus:border-[#8ED6D7]"
                />
              </label>
            </div>
          ))}
        </div>

        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        {message ? <p className="text-sm text-emerald-400">{message}</p> : null}

        <button
          type="submit"
          disabled={isSaving}
          className="rounded-md bg-[#8ED6D7] px-4 py-2 text-sm font-medium text-black disabled:opacity-60"
        >
          {isSaving ? "Đang lưu..." : "Lưu Working Process"}
        </button>
      </form>
    </section>
  );
}

