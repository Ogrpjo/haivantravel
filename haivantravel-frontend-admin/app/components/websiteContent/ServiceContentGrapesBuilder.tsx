"use client";

import dynamic from "next/dynamic";
import { useCallback, useMemo, useRef, useState } from "react";
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

export default function ServiceContentGrapesBuilder({
  endpoint,
  saveSuccessMessage,
}: ServiceContentGrapesBuilderProps) {
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
      const res = await fetch(`${apiBaseUrl}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: JSON.stringify(project) }),
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
    <div className="rounded-lg bg-[#1a1a1a] p-6 flex flex-col gap-4 border border-white/10">
      <div className="rounded-lg border border-white/15 overflow-hidden min-h-[72vh] h-[calc(100vh-10rem)] max-h-[900px]">
        <StudioEditor
          className="h-full min-h-[72vh]"
          options={options}
          onEditor={handleEditor}
          onReady={handleReady}
        />
      </div>

      {message ? (
        <div
          className={`text-sm border rounded-lg px-3 py-2 ${
            message.startsWith("Da luu")
              ? "text-[#2E7D32] bg-[#E8F5E9] border-[#C8E6C9]"
              : "text-[#C62828] bg-[#FFEBEE] border-[#FFCDD2]"
          }`}
        >
          {message}
        </div>
      ) : null}

      <div className="flex justify-end">
        <button
          type="button"
          className="px-4 py-2 rounded-lg bg-[#05B9BA] text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
          onClick={handleSave}
          disabled={isSaving || !editorReady}
        >
          {isSaving ? "Dang luu..." : "Luu noi dung"}
        </button>
      </div>
    </div>
  );
}
