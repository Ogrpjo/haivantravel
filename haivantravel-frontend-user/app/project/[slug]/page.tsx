import { redirect } from "next/navigation";

/** Đường dẫn cũ /project/... → /case-study/... */
export default async function LegacyProjectSlugRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/case-study/${slug}`);
}
