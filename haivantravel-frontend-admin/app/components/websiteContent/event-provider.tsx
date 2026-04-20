"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchEventProvider, saveEventProvider, type EventProviderCardPayload } from "./api";

type EventProviderFormState = {
  small_text: string;
  big_text: string;
  right_text: string;
  cards: EventProviderCardPayload[];
};

const defaultCards: EventProviderCardPayload[] = [
  { type: "Corporate Event", title: "", description: "", is_active: true },
  { type: "Team building", title: "", description: "", is_active: true },
  { type: "Conference", title: "", description: "", is_active: true },
  { type: "Gala Dinner", title: "", description: "", is_active: true },
  { type: "Media", title: "", description: "", is_active: true },
  { type: "MICE Travel", title: "", description: "", is_active: true },
];

function normalizeCards(cards: EventProviderCardPayload[] | null | undefined): EventProviderCardPayload[] {
  if (!Array.isArray(cards) || cards.length !== 6) return defaultCards.map((c) => ({ ...c }));
  return cards.map((c, idx) => ({
    type: c?.type ?? defaultCards[idx]?.type ?? null,
    title: c?.title ?? "",
    description: c?.description ?? "",
    is_active: c?.is_active ?? true,
  }));
}

export default function EventProviderSection() {
  const [form, setForm] = useState<EventProviderFormState>({
    small_text: "Chúng tôi cung cấp",
    big_text: "Dịch vụ sự kiện",
    right_text:
      "Từ ý tưởng đến thực thi, chúng tôi cung cấp đầy đủ các giải pháp sự kiện toàn diện cho doanh nghiệp của bạn.",
    cards: defaultCards.map((c) => ({ ...c })),
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchEventProvider();
        if (!data) return;
        setForm({
          small_text: data.small_text ?? "Chúng tôi cung cấp",
          big_text: data.big_text ?? "Dịch vụ sự kiện",
          right_text:
            data.right_text ??
            "Từ ý tưởng đến thực thi, chúng tôi cung cấp đầy đủ các giải pháp sự kiện toàn diện cho doanh nghiệp của bạn.",
          cards: normalizeCards(data.cards),
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Không tải được dữ liệu Event Provider.");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const cards = useMemo(() => normalizeCards(form.cards), [form.cards]);

  const updateField = <K extends keyof EventProviderFormState>(key: K, value: EventProviderFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateCard = (index: number, patch: Partial<EventProviderCardPayload>) => {
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
      await saveEventProvider({
        small_text: form.small_text,
        big_text: form.big_text,
        right_text: form.right_text,
        cards,
      });
      setMessage("Đã lưu Event Provider thành công.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lưu Event Provider thất bại.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="rounded-xl border border-white/10 bg-[#1a1a1a] p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Event Provider</h2>
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
            value={form.right_text}
            onChange={(e) => updateField("right_text", e.target.value)}
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
                  <p className="mb-2 text-sm text-white/80">type (badge)</p>
                  <input
                    type="text"
                    value={card.type ?? ""}
                    onChange={(e) => updateCard(idx, { type: e.target.value || null })}
                    className="w-full rounded-md border border-white/15 bg-[#121212] px-3 py-2 text-sm outline-none focus:border-[#8ED6D7]"
                  />
                </label>
              </div>

              <label className="block">
                <p className="mb-2 text-sm text-white/80">title</p>
                <input
                  type="text"
                  value={card.title ?? ""}
                  onChange={(e) => updateCard(idx, { title: e.target.value || null })}
                  className="w-full rounded-md border border-white/15 bg-[#121212] px-3 py-2 text-sm outline-none focus:border-[#8ED6D7]"
                />
              </label>

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
          {isSaving ? "Đang lưu..." : "Lưu Event Provider"}
        </button>
      </form>
    </section>
  );
}

