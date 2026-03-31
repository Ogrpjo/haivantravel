import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

type RecruitmentContent = {
  content: string | null;
  updatedAt?: string | null;
  createdAt?: string | null;
};

const getApiBaseUrl = () =>
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:2031";

async function getRecruitmentContent(): Promise<RecruitmentContent | null> {
  try {
    const url = `${getApiBaseUrl()}/recruitment`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      return null;
    }
    return (await res.json()) as RecruitmentContent;
  } catch {
    return null;
  }
}

export default async function Recruitment() {
  const data = await getRecruitmentContent();
  const content = data?.content ?? "";
  const updatedAt = data?.updatedAt ?? data?.createdAt ?? null;

  return (
    <main className="w-screen min-h-screen bg-[#111111] flex flex-col gap-y-20 relative pt-[136px]">
      <Navbar />
      <section className="w-full max-w-[1200px] mx-auto px-6 max-sm:px-4 py-10 text-white">
        {!content ? (
          <div className="rounded-2xl p-8 text-center">
            <h1 className="text-2xl font-semibold mb-2">Chưa có nội dung tuyển dụng</h1>
            <p className="text-white/60">Vui lòng quay lại sau.</p>
          </div>
        ) : (
          <div className="rounded-2xl p-8 max-sm:p-6">
            <div className="mb-6">
              <p className="text-sm text-white/60">
                {updatedAt
                  ? new Date(updatedAt).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : ""}
              </p> 
            </div>
            <article
              className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-white/90 prose-a:text-[#05B9BA]"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        )}
      </section>
      <Footer />
    </main>
  );
}
