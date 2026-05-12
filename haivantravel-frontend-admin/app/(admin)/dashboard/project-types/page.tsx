"use client";

import { useEffect, useMemo, useState } from "react";
import Sidebar from "@/app/components/SideBar";
import { getApiBaseUrl } from "@/app/lib/apiBaseUrl";

type ProjectTypeItem = {
  id: number;
  name: string;
  sort_order: number;
};

const MAX_TYPES = 7;

export default function ProjectTypesPage() {
  const [items, setItems] = useState<ProjectTypeItem[]>([]);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const apiBaseUrl = getApiBaseUrl();

  const canAdd = useMemo(
    () => items.length < MAX_TYPES && newName.trim().length > 0,
    [items.length, newName],
  );

  const loadItems = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiBaseUrl}/project-types`, { cache: "no-store" });
      const data = (await res.json()) as ProjectTypeItem[];
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setError("Không tải được danh sách loại dự án.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadItems();
  }, []);

  const submitCreate = async () => {
    setError("");
    if (!canAdd) return;
    const res = await fetch(`${apiBaseUrl}/project-types`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName.trim() }),
    });
    if (!res.ok) {
      setError((await res.text()) || "Không thể thêm loại dự án.");
      return;
    }
    setNewName("");
    await loadItems();
  };

  const submitUpdate = async () => {
    if (editingId == null || !editingName.trim()) return;
    const res = await fetch(`${apiBaseUrl}/project-types/${editingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editingName.trim() }),
    });
    if (!res.ok) {
      setError((await res.text()) || "Không thể cập nhật loại dự án.");
      return;
    }
    setEditingId(null);
    setEditingName("");
    await loadItems();
  };

  const removeItem = async (id: number) => {
    if (!confirm("Xoá loại dự án này?")) return;
    const res = await fetch(`${apiBaseUrl}/project-types/${id}`, { method: "DELETE" });
    if (!res.ok) {
      setError((await res.text()) || "Không thể xoá loại dự án.");
      return;
    }
    await loadItems();
  };

  return (
    <main className="flex min-h-screen bg-[#121212] text-white">
      <Sidebar />
      <section className="flex-1 px-[18px] py-[14px]">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[16px] font-semibold">&gt; Loại dự án</p>
          <div className="text-xs text-white/50">{items.length}/{MAX_TYPES}</div>
        </div>

        <div className="rounded-[10px] border border-white/10 bg-[#1a1a1a] p-3">
          <div className="flex gap-2">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Tên loại dự án"
              className="h-10 flex-1 rounded-[8px] border border-white/10 bg-black/20 px-3 text-sm outline-none"
            />
            <button
              onClick={submitCreate}
              disabled={!canAdd || loading}
              className="h-10 rounded-[8px] bg-[#05B9BA] px-3 text-sm font-medium disabled:opacity-50"
            >
              + Thêm loại dự án
            </button>
          </div>
          {error ? <p className="mt-2 text-xs text-red-400">{error}</p> : null}

          <div className="mt-4 grid gap-2">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-2 rounded-[10px] border border-white/10 bg-black/20 p-3">
                {editingId === item.id ? (
                  <input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="h-9 flex-1 rounded-[8px] border border-white/10 bg-[#121212] px-3 text-sm outline-none"
                  />
                ) : (
                  <div className="flex-1 text-sm font-medium">{item.name}</div>
                )}
                <div className="flex gap-2">
                  {editingId === item.id ? (
                    <button onClick={submitUpdate} className="rounded-[8px] bg-white px-3 py-1.5 text-sm text-black">Lưu</button>
                  ) : (
                    <button onClick={() => { setEditingId(item.id); setEditingName(item.name); }} className="rounded-[8px] border border-white/15 px-3 py-1.5 text-sm">Sửa</button>
                  )}
                  {editingId === item.id ? (
                    <button onClick={() => { setEditingId(null); setEditingName(""); }} className="rounded-[8px] border border-white/15 px-3 py-1.5 text-sm">Huỷ</button>
                  ) : (
                    <button onClick={() => removeItem(item.id)} className="rounded-[8px] border border-red-400/30 px-3 py-1.5 text-sm text-red-300">Xoá</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
