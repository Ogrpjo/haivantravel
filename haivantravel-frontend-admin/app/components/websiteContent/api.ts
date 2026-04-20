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
  small_text: string | null;
  big_text: string | null;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
} | null> {
  const res = await fetch(`${getApiBaseUrl()}/about-us`);
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  return data;
}

/** About Us: upload ảnh và lưu vào bảng about_us (POST /about-us) */
export async function saveAboutUs(payload: {
  small_text?: string;
  big_text?: string;
  description?: string;
  image?: File | null;
  is_active?: boolean;
}): Promise<{
  id: number;
  small_text: string | null;
  big_text: string | null;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}> {
  const form = new FormData();
  if (payload.small_text !== undefined) form.append("small_text", payload.small_text);
  if (payload.big_text !== undefined) form.append("big_text", payload.big_text);
  if (payload.description !== undefined) form.append("description", payload.description);
  if (payload.image) form.append("image", payload.image);
  if (payload.is_active !== undefined) form.append("is_active", String(payload.is_active));
  const res = await fetch(`${getApiBaseUrl()}/about-us`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function fetchAboutUsStatistic(): Promise<{
  id: number;
  number_1: number;
  name_1: string | null;
  number_2: number;
  name_2: string | null;
  number_3: number;
  name_3: string | null;
  number_4: number;
  name_4: string | null;
  updated_at: string;
} | null> {
  const res = await fetch(`${getApiBaseUrl()}/about-us-statistic`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function saveAboutUsStatistic(payload: {
  number_1?: number;
  name_1?: string;
  number_2?: number;
  name_2?: string;
  number_3?: number;
  name_3?: string;
  number_4?: number;
  name_4?: string;
}): Promise<{
  id: number;
  number_1: number;
  name_1: string | null;
  number_2: number;
  name_2: string | null;
  number_3: number;
  name_3: string | null;
  number_4: number;
  name_4: string | null;
  updated_at: string;
}> {
  const res = await fetch(`${getApiBaseUrl()}/about-us-statistic`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function fetchStatistic(): Promise<{
  id: number;
  small_text: string | null;
  big_text: string | null;
  number_1: string | null;
  name_1: string | null;
  number_2: string | null;
  name_2: string | null;
  number_3: string | null;
  name_3: string | null;
  number_4: string | null;
  name_4: string | null;
  updated_at: string;
} | null> {
  const res = await fetch(`${getApiBaseUrl()}/statistic`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function saveStatistic(payload: {
  small_text?: string;
  big_text?: string;
  number_1?: string;
  name_1?: string;
  number_2?: string;
  name_2?: string;
  number_3?: string;
  name_3?: string;
  number_4?: string;
  name_4?: string;
}): Promise<{
  id: number;
  small_text: string | null;
  big_text: string | null;
  number_1: string | null;
  name_1: string | null;
  number_2: string | null;
  name_2: string | null;
  number_3: string | null;
  name_3: string | null;
  number_4: string | null;
  name_4: string | null;
  updated_at: string;
}> {
  const res = await fetch(`${getApiBaseUrl()}/statistic`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function fetchCollaboratorContent(): Promise<{
  id: number;
  first_text: string | null;
  blue_text_1: string | null;
  blue_text_2: string | null;
  last_text: string | null;
  description: string | null;
  updated_at: string;
} | null> {
  const res = await fetch(`${getApiBaseUrl()}/collaborator-content`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function saveCollaboratorContent(payload: {
  first_text?: string;
  blue_text_1?: string;
  blue_text_2?: string;
  last_text?: string;
  description?: string;
}) {
  const res = await fetch(`${getApiBaseUrl()}/collaborator-content`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export type EventProviderCardPayload = {
  type: string | null;
  title: string | null;
  description: string | null;
  is_active?: boolean | null;
};

export async function fetchEventProvider(): Promise<{
  id: number;
  small_text: string | null;
  big_text: string | null;
  right_text: string | null;
  cards: EventProviderCardPayload[] | null;
  updated_at: string;
} | null> {
  const res = await fetch(`${getApiBaseUrl()}/event-provider`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function saveEventProvider(payload: {
  small_text?: string;
  big_text?: string;
  right_text?: string;
  cards?: EventProviderCardPayload[];
}): Promise<{
  id: number;
  small_text: string | null;
  big_text: string | null;
  right_text: string | null;
  cards: EventProviderCardPayload[] | null;
  updated_at: string;
}> {
  const res = await fetch(`${getApiBaseUrl()}/event-provider`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function fetchWhyChooseUs(): Promise<{
  id: number;
  image_url: string | null;
  small_text: string | null;
  big_text: string | null;
  description: string | null;
  tick_1: string | null;
  tick_2: string | null;
  tick_3: string | null;
  tick_4: string | null;
  updated_at: string;
} | null> {
  const res = await fetch(`${getApiBaseUrl()}/why-choose-us`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function saveWhyChooseUs(payload: {
  image?: File | null;
  small_text?: string;
  big_text?: string;
  description?: string;
  tick_1?: string;
  tick_2?: string;
  tick_3?: string;
  tick_4?: string;
}): Promise<{
  id: number;
  image_url: string | null;
  small_text: string | null;
  big_text: string | null;
  description: string | null;
  tick_1: string | null;
  tick_2: string | null;
  tick_3: string | null;
  tick_4: string | null;
  updated_at: string;
}> {
  const form = new FormData();
  if (payload.small_text !== undefined) form.append("small_text", payload.small_text);
  if (payload.big_text !== undefined) form.append("big_text", payload.big_text);
  if (payload.description !== undefined) form.append("description", payload.description);
  if (payload.tick_1 !== undefined) form.append("tick_1", payload.tick_1);
  if (payload.tick_2 !== undefined) form.append("tick_2", payload.tick_2);
  if (payload.tick_3 !== undefined) form.append("tick_3", payload.tick_3);
  if (payload.tick_4 !== undefined) form.append("tick_4", payload.tick_4);
  if (payload.image) form.append("image", payload.image);

  const res = await fetch(`${getApiBaseUrl()}/why-choose-us`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function fetchExperienceContent(): Promise<{
  id: number;
  small_text: string | null;
  big_text: string | null;
  description: string | null;
  big_image_url: string | null;
  small_image_1_url: string | null;
  small_image_1_name: string | null;
  small_image_2_url: string | null;
  small_image_2_name: string | null;
  small_image_3_url: string | null;
  small_image_3_name: string | null;
  small_image_4_url: string | null;
  small_image_4_name: string | null;
  updated_at: string;
} | null> {
  const res = await fetch(`${getApiBaseUrl()}/experience-content`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function saveExperienceContent(payload: {
  small_text?: string;
  big_text?: string;
  description?: string;
  small_image_1_name?: string;
  small_image_2_name?: string;
  small_image_3_name?: string;
  small_image_4_name?: string;
  big_image?: File | null;
  small_image_1?: File | null;
  small_image_2?: File | null;
  small_image_3?: File | null;
  small_image_4?: File | null;
}) {
  const form = new FormData();
  if (payload.small_text !== undefined) form.append("small_text", payload.small_text);
  if (payload.big_text !== undefined) form.append("big_text", payload.big_text);
  if (payload.description !== undefined) form.append("description", payload.description);
  if (payload.small_image_1_name !== undefined) form.append("small_image_1_name", payload.small_image_1_name);
  if (payload.small_image_2_name !== undefined) form.append("small_image_2_name", payload.small_image_2_name);
  if (payload.small_image_3_name !== undefined) form.append("small_image_3_name", payload.small_image_3_name);
  if (payload.small_image_4_name !== undefined) form.append("small_image_4_name", payload.small_image_4_name);
  if (payload.big_image) form.append("big_image", payload.big_image);
  if (payload.small_image_1) form.append("small_image_1", payload.small_image_1);
  if (payload.small_image_2) form.append("small_image_2", payload.small_image_2);
  if (payload.small_image_3) form.append("small_image_3", payload.small_image_3);
  if (payload.small_image_4) form.append("small_image_4", payload.small_image_4);
  const res = await fetch(`${getApiBaseUrl()}/experience-content`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export type WorkingProcessCardPayload = {
  number: string | null;
  title: string | null;
  description: string | null;
  is_active?: boolean | null;
};

export async function fetchWorkingProcessContent(): Promise<{
  id: number;
  small_text: string | null;
  big_text: string | null;
  description: string | null;
  cards: WorkingProcessCardPayload[] | null;
  updated_at: string;
} | null> {
  const res = await fetch(`${getApiBaseUrl()}/working-process-content`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function saveWorkingProcessContent(payload: {
  small_text?: string;
  big_text?: string;
  description?: string;
  cards?: WorkingProcessCardPayload[];
}) {
  const res = await fetch(`${getApiBaseUrl()}/working-process-content`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function fetchPartners(): Promise<
  {
    id: number;
    business_type: string;
    icon: string;
    is_active: boolean;
  }[]
> {
  const res = await fetch(`${getApiBaseUrl()}/partners`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function createPartner(payload: {
  business_type: string;
  icon: File;
}) {
  const form = new FormData();
  form.append("business_type", payload.business_type);
  form.append("icon", payload.icon);
  const res = await fetch(`${getApiBaseUrl()}/partners`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updatePartner(
  id: number,
  payload: {
    business_type?: string;
    icon?: File | null;
  },
) {
  const form = new FormData();
  if (payload.business_type !== undefined) form.append("business_type", payload.business_type);
  if (payload.icon) form.append("icon", payload.icon);
  const res = await fetch(`${getApiBaseUrl()}/partners/${id}`, {
    method: "PATCH",
    body: form,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function togglePartnerStatus(id: number) {
  const res = await fetch(`${getApiBaseUrl()}/partners/${id}/toggle-status`, {
    method: "PATCH",
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deletePartner(id: number) {
  const res = await fetch(`${getApiBaseUrl()}/partners/${id}`, {
    method: "DELETE",
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
