"use client";

import { useEffect, useState } from "react";
import { fetchStatisticsList, saveStatistics } from "./api";
import type { StatisticsItem } from "./types";

const defaultItem: StatisticsItem = {
  title: "",
  number: "",
};

export default function StatisticsSection() {
  const [stats, setStats] = useState<StatisticsItem[]>([{ ...defaultItem }]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchStatisticsList();
        setStats(
          data.length
            ? data.map((i) => ({ title: i.title, number: i.number }))
            : [{ ...defaultItem }]
        );
      } catch (e) {
        setMessage(e instanceof Error ? e.message : "Lỗi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const updateItem = (index: number, field: keyof StatisticsItem, value: string) => {
    setStats((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const addItem = () => setStats((prev) => [...prev, { ...defaultItem }]);
  const removeItem = (index: number) => {
    if (stats.length <= 1) return;
    setStats((prev) => prev.filter((_, i) => i !== index));
  };

  const save = async () => {
    setMessage("");
    setSaving(true);
    try {
      const items = stats
        .map((s) => ({ title: s.title.trim(), number: s.number.trim() }))
        .filter((s) => s.title !== "" || s.number !== "");
      if (items.length === 0) {
        setMessage("Thêm ít nhất một item (title hoặc number).");
        setSaving(false);
        return;
      }
      await saveStatistics(items);
      setMessage("Đã lưu.");
      const data = await fetchStatisticsList();
      setStats(
        data.length
          ? data.map((i) => ({ title: i.title, number: i.number }))
          : [{ ...defaultItem }]
      );
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Lỗi lưu");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-lg border border-white/10 bg-[#1a1a1a] p-4">
        <h3 className="font-semibold text-white mb-2">Statistics</h3>
        <p className="text-white/70">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-white/10 bg-[#1a1a1a] p-4">
      <h3 className="font-semibold text-white mb-3">Statistics</h3>
      <p className="text-sm text-white/70 mb-3">
        Thêm nhiều item (title, number). Dữ liệu lưu vào bảng statistics.
      </p>
      <div className="space-y-4">
        {stats.map((item, index) => (
          <div key={index} className="p-3 border border-white/10 rounded bg-[#202020]">
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Title"
                value={item.title}
                onChange={(e) => updateItem(index, "title", e.target.value)}
                className="border border-white/15 bg-[#121212] text-white rounded px-2 py-1.5 text-sm"
              />
              <input
                type="text"
                placeholder="Number"
                value={item.number}
                onChange={(e) => updateItem(index, "number", e.target.value)}
                className="border border-white/15 bg-[#121212] text-white rounded px-2 py-1.5 text-sm"
              />
            </div>
            <button
              type="button"
              className="mt-2 text-sm text-red-400 hover:underline disabled:text-white/40"
              onClick={() => removeItem(index)}
              disabled={stats.length <= 1}
            >
              Xóa item
            </button>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2 mt-3">
        <button
          type="button"
          className="px-3 py-1.5 border border-white/20 text-white rounded text-sm hover:bg-white/10"
          onClick={addItem}
        >
          + Thêm item
        </button>
        <button
          type="button"
          className="px-4 py-2 bg-[#05B9BA] text-white rounded hover:bg-[#049a9b] disabled:opacity-50"
          onClick={save}
          disabled={saving}
        >
          {saving ? "Đang lưu..." : "Lưu Statistics"}
        </button>
        {message && (
          <span
            className={
              message.startsWith("Lỗi") || message.startsWith("Thêm")
                ? "text-amber-400"
                : "text-green-400"
            }
          >
            {message}
          </span>
        )}
      </div>
    </div>
  );
}
