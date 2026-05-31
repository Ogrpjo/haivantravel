"use client";

import { useEffect, useMemo, useState } from "react";
import {
  fetchAboutUs,
  fetchAboutUsStatistic,
  getApiBaseUrl,
  saveAboutUs,
  saveAboutUsStatistic,
} from "./api";

type FormState = {
  small_text: string;
  big_text: string;
  description: string;
  is_active: boolean;
};

type StatisticFormState = {
  number_1: number;
  name_1: string;
  number_2: number;
  name_2: string;
  number_3: number;
  name_3: string;
  number_4: number;
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

function resolveImageUrl(pathOrUrl: string | null | undefined): string {
  if (!pathOrUrl) return "";
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const apiBaseUrl = getApiBaseUrl().replace(/\/+$/, "");
  return `${apiBaseUrl}/${pathOrUrl.replace(/^\/+/, "")}`;
}

export default function AboutUs() {
  const [form, setForm] = useState<FormState>({
    small_text: "",
    big_text: "",
    description: "",
    is_active: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingStatistics, setIsSavingStatistics] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingStatistics, setLoadingStatistics] = useState(true);
  const [message, setMessage] = useState<string>("");
  const [statisticMessage, setStatisticMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [statisticError, setStatisticError] = useState<string>("");
  const [statisticsForm, setStatisticsForm] = useState<StatisticFormState>({
    number_1: 0,
    name_1: "",
    number_2: 0,
    name_2: "",
    number_3: 0,
    name_3: "",
    number_4: 0,
    name_4: "",
  });

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchAboutUs();
        if (!data) return;
        setForm({
          small_text: data.small_text ?? "",
          big_text: data.big_text ?? "",
          description: data.description ?? "",
          is_active: data.is_active ?? true,
        });
        setImagePreview(resolveImageUrl(data.image_url));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Không tải được dữ liệu About Us.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const loadStatistics = async () => {
      try {
        const data = await fetchAboutUsStatistic();
        if (!data) return;
        setStatisticsForm({
          number_1: data.number_1 ?? 0,
          name_1: data.name_1 ?? "",
          number_2: data.number_2 ?? 0,
          name_2: data.name_2 ?? "",
          number_3: data.number_3 ?? 0,
          name_3: data.name_3 ?? "",
          number_4: data.number_4 ?? 0,
          name_4: data.name_4 ?? "",
        });
      } catch (err) {
        setStatisticError(
          err instanceof Error ? err.message : "Không tải được dữ liệu About Us Statistic.",
        );
      } finally {
        setLoadingStatistics(false);
      }
    };
    loadStatistics();
  }, []);

  const wordCount = useMemo(
    () => ({
      smallText: countWords(form.small_text),
      bigText: countWords(form.big_text),
      description: countWords(form.description),
    }),
    [form],
  );

  const updateForm = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateStatisticForm = <K extends keyof StatisticFormState>(
    key: K,
    value: StatisticFormState[K],
  ) => {
    setStatisticsForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (wordCount.smallText > 15) return setError("small_text tối đa 15 từ.");
    if (wordCount.bigText > 8) return setError("big_text tối đa 8 từ.");
    if (wordCount.description > 150) return setError("description tối đa 150 từ.");

    try {
      setIsSaving(true);
      const result = await saveAboutUs({
        small_text: form.small_text,
        big_text: form.big_text,
        description: form.description,
        is_active: form.is_active,
        image: imageFile,
      });
      setImageFile(null);
      if (result.image_url) {
        setImagePreview(resolveImageUrl(result.image_url));
      }
      setMessage("Đã lưu About Us thành công.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lưu thất bại.");
    } finally {
      setIsSaving(false);
    }
  };

  const onSubmitStatistics = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatisticError("");
    setStatisticMessage("");

    if (countWords(statisticsForm.name_1) > 5) return setStatisticError("name_1 tối đa 5 từ.");
    if (countWords(statisticsForm.name_2) > 5) return setStatisticError("name_2 tối đa 5 từ.");
    if (countWords(statisticsForm.name_3) > 5) return setStatisticError("name_3 tối đa 5 từ.");
    if (countWords(statisticsForm.name_4) > 5) return setStatisticError("name_4 tối đa 5 từ.");

    try {
      setIsSavingStatistics(true);
      await saveAboutUsStatistic({
        number_1: statisticsForm.number_1,
        name_1: statisticsForm.name_1,
        number_2: statisticsForm.number_2,
        name_2: statisticsForm.name_2,
        number_3: statisticsForm.number_3,
        name_3: statisticsForm.name_3,
        number_4: statisticsForm.number_4,
        name_4: statisticsForm.name_4,
      });
      setStatisticMessage("Đã lưu About Us Statistic thành công.");
    } catch (err) {
      setStatisticError(err instanceof Error ? err.message : "Lưu statistic thất bại.");
    } finally {
      setIsSavingStatistics(false);
    }
  };

  return (
    <section className="rounded-xl border border-white/10 bg-[#1a1a1a] p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">About Us</h2>
        {loading ? <span className="text-sm text-white/60">Đang tải...</span> : null}
      </div>

      <form className="space-y-4" onSubmit={onSubmit}>
        <label className="block">
          <p className="mb-2 text-sm text-white/80">
            Small text ({wordCount.smallText}/15 từ)
          </p>
          <input
            type="text"
            value={form.small_text}
            onChange={(e) => updateForm("small_text", e.target.value)}
            className="w-full rounded-md border border-white/15 bg-[#121212] px-3 py-2 text-sm outline-none focus:border-[#8ED6D7]"
            placeholder="Nhập small text"
          />
        </label>

        <label className="block">
          <p className="mb-2 text-sm text-white/80">Big text ({wordCount.bigText}/8 từ)</p>
          <input
            type="text"
            value={form.big_text}
            onChange={(e) => updateForm("big_text", e.target.value)}
            className="w-full rounded-md border border-white/15 bg-[#121212] px-3 py-2 text-sm outline-none focus:border-[#8ED6D7]"
            placeholder="Nhập big text"
          />
        </label>

        <label className="block">
          <p className="mb-2 text-sm text-white/80">
            Description ({wordCount.description}/150 từ)
          </p>
          <textarea
            value={form.description}
            onChange={(e) => updateForm("description", e.target.value)}
            rows={6}
            className="w-full rounded-md border border-white/15 bg-[#121212] px-3 py-2 text-sm outline-none focus:border-[#8ED6D7]"
            placeholder="Nhập nội dung description"
          />
        </label>

        <label className="inline-flex items-center gap-2 text-sm text-white/80">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) => updateForm("is_active", e.target.checked)}
          />
          Hiển thị section này ở website
        </label>

        <label className="block">
          <p className="mb-2 text-sm text-white/80">Ảnh đại diện</p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            className="block w-full text-sm text-white/80 file:mr-3 file:rounded-md file:border-0 file:bg-[#8ED6D7] file:px-3 file:py-2 file:text-black"
          />
          <p className="mt-1 text-xs text-white/60">Chỉ được upload ảnh có dung lượng tối đa là 2MB / 1 ảnh.</p>
        </label>

        {imagePreview ? (
          <img
            src={imagePreview}
            alt="about-us preview"
            className="max-h-52 w-auto rounded-lg border border-white/10 object-cover"
          />
        ) : null}

        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        {message ? <p className="text-sm text-emerald-400">{message}</p> : null}

        <button
          type="submit"
          disabled={isSaving}
          className="rounded-md bg-[#8ED6D7] px-4 py-2 text-sm font-medium text-black disabled:opacity-60"
        >
          {isSaving ? "Đang lưu..." : "Lưu About Us"}
        </button>
      </form>

      <hr className="my-6 border-white/10" />

      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold">About Us Statistics</h3>
        {loadingStatistics ? (
          <span className="text-sm text-white/60">Đang tải...</span>
        ) : null}
      </div>

      <form className="space-y-4" onSubmit={onSubmitStatistics}>
        {statisticFieldConfigs.map(({ label, numberKey, nameKey }) => {
          return (
            <div key={label} className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <label className="block">
                <p className="mb-2 text-sm text-white/80">number_{label}</p>
                <input
                  type="number"
                  min={0}
                  value={Number(statisticsForm[numberKey])}
                  onChange={(e) =>
                    updateStatisticForm(numberKey, Math.max(0, Number(e.target.value || 0)) as never)
                  }
                  className="w-full rounded-md border border-white/15 bg-[#121212] px-3 py-2 text-sm outline-none focus:border-[#8ED6D7]"
                />
              </label>
              <label className="block">
                <p className="mb-2 text-sm text-white/80">
                  name_{label} ({countWords(String(statisticsForm[nameKey] ?? ""))}/5 từ)
                </p>
                <input
                  type="text"
                  value={String(statisticsForm[nameKey] ?? "")}
                  onChange={(e) => updateStatisticForm(nameKey, e.target.value as never)}
                  className="w-full rounded-md border border-white/15 bg-[#121212] px-3 py-2 text-sm outline-none focus:border-[#8ED6D7]"
                />
              </label>
            </div>
          );
        })}

        {statisticError ? <p className="text-sm text-red-400">{statisticError}</p> : null}
        {statisticMessage ? <p className="text-sm text-emerald-400">{statisticMessage}</p> : null}

        <button
          type="submit"
          disabled={isSavingStatistics}
          className="rounded-md bg-[#8ED6D7] px-4 py-2 text-sm font-medium text-black disabled:opacity-60"
        >
          {isSavingStatistics ? "Đang lưu..." : "Lưu About Us Statistics"}
        </button>
      </form>
    </section>
  );
}