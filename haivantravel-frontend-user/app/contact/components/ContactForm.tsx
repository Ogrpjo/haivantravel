"use client";

import { FormEvent, useState } from "react";

type ContactFormState = {
  full_name: string;
  phone: string;
  email: string;
  location: string;
  description: string;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:2031";

const INITIAL_FORM: ContactFormState = {
  full_name: "",
  phone: "",
  email: "",
  location: "",
  description: "",
};

export default function ContactForm() {
  const [form, setForm] = useState<ContactFormState>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/contact-data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("Gửi thông tin thất bại");
      }

      setMessage("Gửi thông tin thành công. Chúng tôi sẽ liên hệ sớm nhất.");
      setForm(INITIAL_FORM);
    } catch {
      setError("Không thể gửi thông tin. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full text-white rounded-2xl border border-white/10 overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.45)]">
      <div className="bg-gradient-to-b from-[#3F9293] to-[#8E4590] px-6 py-4">
        <h2 className="text-lg md:text-xl font-bold uppercase tracking-wide">
          Gửi thông tin đến chúng tôi
        </h2>
      </div>

      <form className="p-6 md:p-8 space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-3">
          <div>
            <label htmlFor="contact-name" className="sr-only">
              Họ tên
            </label>
            <input
              id="contact-name"
              name="full_name"
              type="text"
              placeholder="Họ tên *"
              value={form.full_name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, full_name: e.target.value }))
              }
              className="w-full rounded-lg bg-white/5 border border-white/20 px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#d90429] focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="contact-phone" className="sr-only">
              Điện thoại
            </label>
            <input
              id="contact-phone"
              name="phone"
              type="tel"
              placeholder="Điện thoại *"
              value={form.phone}
              onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
              className="w-full rounded-lg bg-white/5 border border-white/20 px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#d90429] focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="contact-email" className="sr-only">
              Email
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              placeholder="Email *"
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              className="w-full rounded-lg bg-white/5 border border-white/20 px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#d90429] focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="contact-address" className="sr-only">
              Địa chỉ
            </label>
            <input
              id="contact-address"
              name="location"
              type="text"
              placeholder="Địa chỉ"
              value={form.location}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, location: e.target.value }))
              }
              className="w-full rounded-lg bg-white/5 border border-white/20 px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#d90429] focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="contact-note" className="sr-only">
              Ghi chú thêm
            </label>
            <textarea
              id="contact-note"
              name="description"
              rows={4}
              placeholder="Ghi chú thêm"
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
              className="w-full rounded-lg bg-white/5 border border-white/20 px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#d90429] focus:border-transparent resize-none"
            />
          </div>
        </div>

        {message && <p className="text-sm text-[#8ED6D7]">{message}</p>}
        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-gradient-to-b from-[#3F9293] to-[#8E4590] px-6 py-3 font-semibold text-white transition-all hover:brightness-110 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Đang gửi..." : "Gửi"}
        </button>
      </form>
    </section>
  );
}
