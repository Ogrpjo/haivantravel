"use client";

import dynamic from "next/dynamic";
import { useCallback, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
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
  pages: [{ name: "Trang", component: "<h1>Chao mung</h1><p></p>" }],
};

function fromLegacyHtml(content: string): ProjectData {
  return {
    pages: [{ name: "Trang", component: content }],
  };
}

type ServiceContentGrapesBuilderProps = {
  endpoint: string;
  saveSuccessMessage: string;
};

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

export default function ServiceContentGrapesBuilder({
  endpoint,
  saveSuccessMessage,
}: ServiceContentGrapesBuilderProps) {
  const router = useRouter();
  const apiBaseUrl = getApiBaseUrl();
  const editorRef = useRef<Editor | null>(null);
  const [editorReady, setEditorReady] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const options: CreateEditorOptions = useMemo(
    () => ({
      licenseKey: process.env.NEXT_PUBLIC_GRAPES_STUDIO_LICENSE_KEY ?? "",
      theme: "dark",
      project: {
        type: "web",
        default: defaultProject,
      },
      storage: {
        type: "self",
        onLoad: async () => {
          try {
            const res = await fetch(`${apiBaseUrl}/${endpoint}`, { cache: "no-store" });
            if (!res.ok) return { project: defaultProject };
            const data = await res.json();
            const raw = data?.content != null ? String(data.content).trim() : "";
            if (raw) {
              try {
                return { project: JSON.parse(raw) as ProjectData };
              } catch {
                return { project: fromLegacyHtml(raw) };
              }
            }
            const rawHtml = data?.html_content != null ? String(data.html_content).trim() : "";
            if (rawHtml) {
              return { project: fromLegacyHtml(rawHtml) };
            }
            return { project: defaultProject };
          } catch {
            return { project: defaultProject };
          }
        },
        onSave: async ({ project }) => {
          const res = await fetch(`${apiBaseUrl}/${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: JSON.stringify(project) }),
          });
          if (!res.ok) {
            const err = await res.text();
            throw new Error(err || "Khong the luu noi dung.");
          }
        },
      },
      i18n: {
        locales: {
          vi: viLabels,
        },
      },
    }),
    [apiBaseUrl, endpoint],
  );

  const handleEditor = useCallback((editor: Editor) => {
    editorRef.current = editor;
    setEditorReady(true);
    disableNativeFullscreen(editor);
    try {
      editor.I18n?.addMessages({ vi: viLabels });
      editor.I18n?.setLocale("vi");
    } catch {
      /* I18n may not be ready yet */
    }
  }, []);

  const handleReady = useCallback((editor: Editor) => {
    try {
      editor.I18n?.setLocale("vi");
    } catch {
      /* noop */
    }
  }, []);

  const handleSave = async () => {
    const editor = editorRef.current;
    if (!editor) return;
    setIsSaving(true);
    setMessage(null);
    try {
      const project = editor.getProjectData();
      const htmlContent = editor.getHtml();
      const cssContent = editor.getCss();
      const res = await fetch(`${apiBaseUrl}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: JSON.stringify(project),
          html_content: htmlContent,
          css_content: cssContent,
        }),
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Khong the luu noi dung.");
      }
      setMessage(saveSuccessMessage);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Co loi xay ra khi luu.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="w-screen h-screen bg-white relative overflow-hidden">
      <StudioEditor
        className="w-full h-full"
        options={options}
        onEditor={handleEditor}
        onReady={handleReady}
      />

      <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
        {message ? (
          <div className="px-3 py-2 rounded-md text-sm bg-black/80 text-white">
            {message}
          </div>
        ) : null}
        <button
          type="button"
          onClick={() => router.back()}
          className="px-3 py-2 rounded-md bg-black text-white text-sm hover:opacity-90"
        >
          Quay lại
        </button>
        <button
          type="button"
          className="px-3 py-2 rounded-md bg-[#05B9BA] text-white text-sm hover:opacity-90 disabled:opacity-60"
          onClick={handleSave}
          disabled={isSaving || !editorReady}
        >
          {isSaving ? "Dang luu..." : "Luu noi dung"}
        </button>
      </div>
    </main>
  );
}
