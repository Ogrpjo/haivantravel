"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import type { Editor } from "grapesjs";
import type { CreateEditorOptions, ProjectData } from "@grapesjs/studio-sdk";
import "@grapesjs/studio-sdk/style";
import { viLabels } from "@/app/i18n/locale/vi";
import { getApiBaseUrl } from "@/app/lib/apiBaseUrl";

const StudioEditor = dynamic(
  () => import("@grapesjs/studio-sdk/react").then((m) => m.StudioEditor),
  { ssr: false },
);

const defaultProject: ProjectData = {
  pages: [{ name: "Trang", component: "<h1>Nội dung chi tiết dự án</h1><p></p>" }],
};

function safeParseProjectData(rawContent: string): ProjectData {
  const trimmed = rawContent.trim();
  if (!trimmed) return defaultProject;
  try {
    return JSON.parse(trimmed) as ProjectData;
  } catch {
    return { pages: [{ name: "Trang", component: trimmed }] };
  }
}

function disableNativeFullscreen(editor: Editor): void {
  try {
    const candidates = ["fullscreen", "open-fullscreen", "full-screen"];
    candidates.forEach((id) => {
      editor.Panels?.removeButton("options", id);
      editor.Panels?.removeButton("views", id);
      (editor.Commands as unknown as { remove?: (name: string) => void })?.remove?.(id);
    });
    (editor.Commands as unknown as { remove?: (name: string) => void })?.remove?.("core:fullscreen");
  } catch {
    // noop
  }
}

export default function ProjectDetailContentEditorPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const apiBaseUrl = getApiBaseUrl();
  const projectId = useMemo(() => Number(params?.id), [params?.id]);

  const editorRef = useRef<Editor | null>(null);
  const [editorReady, setEditorReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [initialProjectData, setInitialProjectData] = useState<ProjectData>(defaultProject);

  useEffect(() => {
    if (!projectId || Number.isNaN(projectId)) {
      setIsLoading(false);
      setMessage("ID dự án không hợp lệ.");
      return;
    }

    let cancelled = false;
    const fetchProject = async () => {
      try {
        setIsLoading(true);
        setMessage(null);
        const res = await fetch(`${apiBaseUrl}/projects/${projectId}`, { cache: "no-store" });
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText || "Không thể tải nội dung dự án.");
        }
        const data = (await res.json()) as {
          content?: string | null;
          html_content?: string | null;
        };
        const fallbackContent =
          typeof data.html_content === "string" && data.html_content.trim()
            ? data.html_content
            : "";
        if (!cancelled) {
          setInitialProjectData(safeParseProjectData(data.content ?? fallbackContent));
        }
      } catch (error) {
        if (!cancelled) {
          setMessage(error instanceof Error ? error.message : "Có lỗi khi tải nội dung.");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void fetchProject();
    return () => {
      cancelled = true;
    };
  }, [apiBaseUrl, projectId]);

  const options: CreateEditorOptions = useMemo(
    () => ({
      licenseKey: process.env.NEXT_PUBLIC_GRAPES_STUDIO_LICENSE_KEY ?? "",
      project: {
        type: "web",
        default: initialProjectData,
      },
      storage: {
        type: "self",
        onLoad: async () => ({ project: initialProjectData }),
      },
      i18n: {
        locales: {
          vi: viLabels,
        },
      },
    }),
    [initialProjectData],
  );

  const handleEditor = useCallback((editor: Editor) => {
    editorRef.current = editor;
    setEditorReady(true);
    disableNativeFullscreen(editor);
    try {
      editor.I18n?.addMessages({ vi: viLabels });
      editor.I18n?.setLocale("vi");
    } catch {
      // noop
    }
  }, []);

  const handleSave = async () => {
    if (!projectId || Number.isNaN(projectId)) return;
    const editor = editorRef.current;
    if (!editor) return;

    setIsSaving(true);
    setMessage(null);
    try {
      const content = JSON.stringify(editor.getProjectData() as ProjectData);
      const htmlContent = editor.getHtml();
      const cssContent = editor.getCss();
      const payload = new FormData();
      payload.append("content", content);
      payload.append("html_content", htmlContent);
      payload.append("css_content", cssContent);
      const res = await fetch(`${apiBaseUrl}/projects/${projectId}`, {
        method: "PATCH",
        body: payload,
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Không thể lưu nội dung chi tiết.");
      }
      setMessage("Đã lưu nội dung chi tiết.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Có lỗi xảy ra khi lưu.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="w-screen h-screen bg-white relative overflow-hidden">
      <StudioEditor
        key={`${projectId}-${isLoading ? "loading" : "ready"}`}
        className="w-full h-full"
        options={options}
        onEditor={handleEditor}
      />

      <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
        {message ? (
          <div className="px-3 py-2 rounded-md text-sm bg-black/80 text-white">
            {message}
          </div>
        ) : null}
        <button
          type="button"
          onClick={() => router.push(`/dashboard/project-detail/${projectId}`)}
          className="px-3 py-2 rounded-md bg-black text-white text-sm hover:opacity-90"
        >
          Quay lại
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={isLoading || isSaving || !editorReady}
          className="px-3 py-2 rounded-md bg-[#05B9BA] text-white text-sm hover:opacity-90 disabled:opacity-60"
        >
          {isSaving ? "Đang lưu..." : "Lưu"}
        </button>
      </div>
    </main>
  );
}
