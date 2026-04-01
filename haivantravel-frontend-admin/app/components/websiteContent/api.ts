import { getApiBaseUrl as getNormalizedApiBaseUrl } from "@/app/lib/apiBaseUrl";

const getApiBaseUrl = () => getNormalizedApiBaseUrl();

export async function fetchContentByPage(
  page: string
): Promise<import("./types").WebsiteContentItem[]> {
  const res = await fetch(`${getApiBaseUrl()}/website-content/page/${page}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function createContent(body: {
  page: string;
  section: string;
  title?: string;
  description?: string;
  image_url?: string;
  extra_data?: Record<string, unknown>;
}) {
  const res = await fetch(`${getApiBaseUrl()}/website-content`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateContent(
  id: number,
  body: Partial<{
    page: string;
    section: string;
    title: string;
    description: string;
    image_url: string;
    extra_data: Record<string, unknown>;
  }>
) {
  const res = await fetch(`${getApiBaseUrl()}/website-content/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function uploadImage(file: File): Promise<{ url: string }> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${getApiBaseUrl()}/website-content/upload`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function uploadMultipleImages(
  files: File[]
): Promise<{ urls: string[] }> {
  const form = new FormData();
  files.forEach((f) => form.append("files", f));
  const res = await fetch(`${getApiBaseUrl()}/website-content/upload-multiple`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

/** Danh sách statistics từ bảng statistics (GET /statistics) */
export async function fetchStatisticsList(): Promise<{ id: number; title: string; number: string }[]> {
  const res = await fetch(`${getApiBaseUrl()}/statistics`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

/** Lưu danh sách statistics (POST /statistics). Mỗi item = 1 record. */
export async function saveStatistics(
  items: { title: string; number: string }[]
): Promise<{ id: number; title: string; number: string }[]> {
  const res = await fetch(`${getApiBaseUrl()}/statistics`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

/** Emotion Creator: lấy bản ghi từ bảng emotion_creator (GET /emotion-creator) */
export async function fetchEmotionCreator(): Promise<{
  id: number;
  center_image_url: string | null;
  left_image_url: string | null;
  right_image_url: string | null;
  title: string | null;
  description: string | null;
  description_detail: string | null;
} | null> {
  const res = await fetch(`${getApiBaseUrl()}/emotion-creator`);
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  return data;
}

/** Emotion Creator: upload ảnh vào /uploads và lưu URL + text vào bảng emotion_creator (POST /emotion-creator) */
export async function saveEmotionCreator(payload: {
  title?: string;
  description?: string;
  description_detail?: string;
  center_image?: File | null;
  left_image?: File | null;
  right_image?: File | null;
}): Promise<{
  id: number;
  center_image_url: string | null;
  left_image_url: string | null;
  right_image_url: string | null;
  title: string | null;
  description: string | null;
  description_detail: string | null;
}> {
  const form = new FormData();
  if (payload.title !== undefined) form.append("title", payload.title);
  if (payload.description !== undefined) form.append("description", payload.description);
  if (payload.description_detail !== undefined) {
    form.append("description_detail", payload.description_detail);
  }
  if (payload.center_image) form.append("center_image", payload.center_image);
  if (payload.left_image) form.append("left_image", payload.left_image);
  if (payload.right_image) form.append("right_image", payload.right_image);
  const res = await fetch(`${getApiBaseUrl()}/emotion-creator`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

/** Company Overview: lấy bản ghi từ bảng company_overview (GET /company-overview) */
export async function fetchCompanyOverview(): Promise<{
  id: number;
  title: string | null;
  description1: string | null;
  description2: string | null;
  big_image_url: string | null;
  small_image_url: string | null;
} | null> {
  const res = await fetch(`${getApiBaseUrl()}/company-overview`);
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  return data;
}

/** Company Overview: upload ảnh vào /uploads và lưu vào bảng company_overview (POST /company-overview) */
export async function saveCompanyOverview(payload: {
  title?: string;
  description1?: string;
  description2?: string;
  big_image?: File | null;
  small_image?: File | null;
}): Promise<{
  id: number;
  title: string | null;
  description1: string | null;
  description2: string | null;
  big_image_url: string | null;
  small_image_url: string | null;
}> {
  const form = new FormData();
  if (payload.title !== undefined) form.append("title", payload.title);
  if (payload.description1 !== undefined) form.append("description1", payload.description1);
  if (payload.description2 !== undefined) form.append("description2", payload.description2);
  if (payload.big_image) form.append("big_image", payload.big_image);
  if (payload.small_image) form.append("small_image", payload.small_image);
  const res = await fetch(`${getApiBaseUrl()}/company-overview`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

/** Danh sách ảnh từ bảng galleries (GET /gallery) */
export async function fetchGalleryList(): Promise<{ id: number; image_url: string }[]> {
  const res = await fetch(`${getApiBaseUrl()}/gallery`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

/** Upload nhiều ảnh vào /uploads và lưu đường dẫn vào bảng galleries (POST /gallery/upload) */
/** About Us: lấy bản ghi từ bảng about_us (GET /about-us) */
export async function fetchAboutUs(): Promise<{
  id: number;
  description: string | null;
  image_url: string | null;
} | null> {
  const res = await fetch(`${getApiBaseUrl()}/about-us`);
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  return data;
}

/** About Us: upload ảnh và lưu vào bảng about_us (POST /about-us) */
export async function saveAboutUs(payload: {
  description?: string;
  image?: File | null;
}): Promise<{
  id: number;
  description: string | null;
  image_url: string | null;
}> {
  const form = new FormData();
  if (payload.description !== undefined) form.append("description", payload.description);
  if (payload.image) form.append("image", payload.image);
  const res = await fetch(`${getApiBaseUrl()}/about-us`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function uploadGalleryFiles(
  files: File[]
): Promise<{ id: number; image_url: string }[]> {
  const form = new FormData();
  files.forEach((f) => form.append("files", f));
  const res = await fetch(`${getApiBaseUrl()}/gallery/upload`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteGalleryItem(id: number): Promise<{ message: string }> {
  const res = await fetch(`${getApiBaseUrl()}/gallery/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export { getApiBaseUrl };
