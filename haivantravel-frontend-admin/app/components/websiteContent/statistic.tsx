"use client";

import { useEffect, useState } from "react";
import { fetchStatistic, saveStatistic } from "./api";

type StatisticFormState = {
  small_text: string;
  big_text: string;
  number_1: string;
  name_1: string;
  number_2: string;
  name_2: string;
  number_3: string;
  name_3: string;
  number_4: string;
  name_4: string;
};

const statisticFieldConfigs: {
  label: string;
  numberKey: keyof StatisticFormState;
  nameKey: keyof StatisticFormState;
}[] = [
  { label: "1", numberKey: "number_1", nameKey: "name_1" },
  { label: "2", numberKey: "number_2", nameKey: "name_2" },
  { label: "3", numberKey: "number_3", nameKey: "name_3" },
  { label: "4", numberKey: "number_4", nameKey: "name_4" },
];

function countWords(text: string): number {
  const value = text.trim();
  if (!value) return 0;
  return value.split(/\s+/).length;
}

export default function StatisticSection() {
  const [form, setForm] = useState<StatisticFormState>({
    small_text: "Khách hàng đã tin tưởng",
    big_text: "Chúng tôi",
    number_1: "0",
    name_1: "",
    number_2: "0",
    name_2: "",
    number_3: "0",
    name_3: "",
    number_4: "0",
    name_4: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchStatistic();
        if (!data) return;
        setForm({
          small_text: data.small_text ?? "Khách hàng đã tin tưởng",
          big_text: data.big_text ?? "Chúng tôi",
          number_1: data.number_1 ?? "0",
          name_1: data.name_1 ?? "",
          number_2: data.number_2 ?? "0",
          name_2: data.name_2 ?? "",
          number_3: data.number_3 ?? "0",
          name_3: data.name_3 ?? "",
          number_4: data.number_4 ?? "0",
          name_4: data.name_4 ?? "",
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Không tải được dữ liệu Statistic.");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const updateField = <K extends keyof StatisticFormState>(key: K, value: StatisticFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (countWords(form.name_1) > 10) return setError("name_1 tối đa 10 từ.");
    if (countWords(form.name_2) > 10) return setError("name_2 tối đa 10 từ.");
    if (countWords(form.name_3) > 10) return setError("name_3 tối đa 10 từ.");
    if (countWords(form.name_4) > 10) return setError("name_4 tối đa 10 từ.");

    try {
      setIsSaving(true);
      await saveStatistic(form);
      setMessage("Đã lưu Statistic thành công.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lưu Statistic thất bại.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="rounded-xl border border-white/10 bg-[#1a1a1a] p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Statistic</h2>
        {isLoading ? <span className="text-sm text-white/60">Đang tải...</span> : null}
      </div>

      <form className="space-y-4" onSubmit={onSubmit}>
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

        {statisticFieldConfigs.map(({ label, numberKey, nameKey }) => (
          <div key={label} className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <label className="block">
              <p className="mb-2 text-sm text-white/80">number_{label}</p>
              <input
                type="text"
                value={String(form[numberKey] ?? "")}
                onChange={(e) => updateField(numberKey, e.target.value as never)}
                className="w-full rounded-md border border-white/15 bg-[#121212] px-3 py-2 text-sm outline-none focus:border-[#8ED6D7]"
              />
            </label>

            <label className="block">
              <p className="mb-2 text-sm text-white/80">
                name_{label} ({countWords(String(form[nameKey] ?? ""))}/10 từ)
              </p>
              <input
                type="text"
                value={String(form[nameKey] ?? "")}
                onChange={(e) => updateField(nameKey, e.target.value as never)}
                className="w-full rounded-md border border-white/15 bg-[#121212] px-3 py-2 text-sm outline-none focus:border-[#8ED6D7]"
              />
            </label>
          </div>
        ))}

        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        {message ? <p className="text-sm text-emerald-400">{message}</p> : null}

        <button
          type="submit"
          disabled={isSaving}
          className="rounded-md bg-[#8ED6D7] px-4 py-2 text-sm font-medium text-black disabled:opacity-60"
        >
          {isSaving ? "Đang lưu..." : "Lưu Statistic"}
        </button>
      </form>
    </section>
  );
}
