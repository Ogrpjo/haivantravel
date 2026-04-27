"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import Sidebar from "@/app/components/SideBar";
import { getApiBaseUrl } from "@/app/lib/apiBaseUrl";

type EmailTemplate = {
  id: number;
  key: string;
  name: string;
  subject_template: string;
  html_template: string;
  is_active: boolean;
  updated_at: string;
};

type ApiListResponse = {
  message: string;
  data: EmailTemplate[];
};

export default function EmailTemplatesPage() {
  const apiBaseUrl = getApiBaseUrl();
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [subject, setSubject] = useState("");
  const [htmlBody, setHtmlBody] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [testEmail, setTestEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const selectedTemplate = useMemo(
    () => templates.find((item) => item.id === selectedId) ?? null,
    [templates, selectedId]
  );

  const loadTemplates = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`${apiBaseUrl}/email-templates`);
      if (!response.ok) {
        throw new Error(await response.text());
      }
      const result = (await response.json()) as ApiListResponse;
      const data = Array.isArray(result.data) ? result.data : [];
      setTemplates(data);
      if (data.length > 0) {
        const first = data[0];
        setSelectedId(first.id);
        setSubject(first.subject_template);
        setHtmlBody(first.html_template);
        setIsActive(first.is_active);
      }
    } catch (fetchError) {
      setError(
        fetchError instanceof Error ? fetchError.message : "Không thể tải templates."
      );
    } finally {
      setLoading(false);
    }
  }, [apiBaseUrl]);

  useEffect(() => {
    void loadTemplates();
  }, [loadTemplates]);

  useEffect(() => {
    if (!selectedTemplate) return;
    setSubject(selectedTemplate.subject_template);
    setHtmlBody(selectedTemplate.html_template);
    setIsActive(selectedTemplate.is_active);
  }, [selectedTemplate]);

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();
    if (!selectedTemplate) return;
    try {
      setSaving(true);
      setMessage("");
      setError("");
      const response = await fetch(`${apiBaseUrl}/email-templates/${selectedTemplate.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject_template: subject,
          html_template: htmlBody,
          is_active: isActive,
        }),
      });
      if (!response.ok) {
        throw new Error(await response.text());
      }
      setMessage("Lưu template thành công.");
      await loadTemplates();
      setSelectedId(selectedTemplate.id);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Lưu template thất bại.");
    } finally {
      setSaving(false);
    }
  };

  const handleSendTest = async () => {
    if (!selectedTemplate) return;
    if (!testEmail.trim()) {
      setError("Vui lòng nhập email test.");
      return;
    }
    try {
      setMessage("");
      setError("");
      const response = await fetch(`${apiBaseUrl}/mail/test-template`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          template_key: selectedTemplate.key,
          to: testEmail.trim(),
        }),
      });
      if (!response.ok) {
        throw new Error(await response.text());
      }
      setMessage("Đã gửi email test thành công.");
    } catch (sendError) {
      setError(
        sendError instanceof Error ? sendError.message : "Gửi email test thất bại."
      );
    }
  };

  return (
    <main className="flex">
      <Sidebar />
      <section className="bg-[#121212] text-white flex-8 px-[20px] w-full py-[10px]">
        <div className="py-[10px]">
          <p className="text-xl font-semibold text-white/75">{">"} Email templates</p>
        </div>
        <div className="grid grid-cols-12 gap-4">
          <aside className="col-span-12 lg:col-span-4 bg-[#1a1a1a] border border-white/10 rounded-[8px]">
            <div className="px-4 py-3 border-b border-white/10 font-medium">
              Danh sách template
            </div>
            <div className="p-2">
              {loading ? (
                <p className="text-white/60 px-2 py-2">Đang tải...</p>
              ) : (
                templates.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => setSelectedId(template.id)}
                    className={`w-full text-left px-3 py-3 rounded-md mb-2 border transition ${
                      selectedId === template.id
                        ? "bg-[#8ED6D7]/20 border-[#8ED6D7]/50"
                        : "bg-transparent border-white/10 hover:border-white/30"
                    }`}
                  >
                    <p className="font-medium">{template.name}</p>
                    <p className="text-sm text-white/60 mt-1">{template.key}</p>
                  </button>
                ))
              )}
            </div>
          </aside>

          <div className="col-span-12 lg:col-span-8 bg-[#1a1a1a] border border-white/10 rounded-[8px] p-4">
            {!selectedTemplate ? (
              <p className="text-white/60">Chưa có template để chỉnh sửa.</p>
            ) : (
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <p className="text-sm text-white/60">Template key</p>
                  <p className="font-medium">{selectedTemplate.key}</p>
                </div>

                <label className="block">
                  <span className="text-sm text-white/70">Subject</span>
                  <input
                    value={subject}
                    onChange={(event) => setSubject(event.target.value)}
                    className="mt-1 w-full rounded-md bg-[#121212] border border-white/20 px-3 py-2 outline-none focus:border-[#8ED6D7]"
                  />
                </label>

                <label className="block">
                  <span className="text-sm text-white/70">HTML body</span>
                  <textarea
                    value={htmlBody}
                    onChange={(event) => setHtmlBody(event.target.value)}
                    rows={14}
                    className="mt-1 w-full rounded-md bg-[#121212] border border-white/20 px-3 py-2 outline-none focus:border-[#8ED6D7]"
                  />
                </label>

                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(event) => setIsActive(event.target.checked)}
                  />
                  <span>Kích hoạt template</span>
                </label>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 rounded-md bg-[#8ED6D7] text-black font-medium disabled:opacity-60"
                  >
                    {saving ? "Đang lưu..." : "Lưu template"}
                  </button>
                </div>
              </form>
            )}

            <div className="mt-6 pt-4 border-t border-white/10">
              <p className="font-medium mb-2">Gửi email test</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  value={testEmail}
                  onChange={(event) => setTestEmail(event.target.value)}
                  placeholder="example@email.com"
                  className="flex-1 rounded-md bg-[#121212] border border-white/20 px-3 py-2 outline-none focus:border-[#8ED6D7]"
                />
                <button
                  type="button"
                  onClick={handleSendTest}
                  className="px-4 py-2 rounded-md bg-white/10 border border-white/20 hover:bg-white/20"
                >
                  Gửi test
                </button>
              </div>
            </div>

            {message ? <p className="text-green-400 mt-3">{message}</p> : null}
            {error ? <p className="text-red-400 mt-3 break-all">{error}</p> : null}
            <p className="text-xs text-white/50 mt-4">
              Biến hỗ trợ: {"{{full_name}}"}, {"{{company_name}}"}, {"{{phone}}"}, {"{{email}}"}, {"{{event_type}}"}, {"{{attendee_scale}}"}, {"{{budget}}"}, {"{{expected_time}}"}, {"{{requirements}}"}, {"{{created_at}}"}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
