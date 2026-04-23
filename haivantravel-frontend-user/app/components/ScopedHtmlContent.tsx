"use client";

import { useEffect, useRef } from "react";

type ScopedHtmlContentProps = {
  html: string;
  className?: string;
};

function normalizeHtmlForShadow(inputHtml: string): string {
  const trimmed = inputHtml.trim().toLowerCase();
  const isFullDocument =
    trimmed.startsWith("<!doctype html") ||
    trimmed.startsWith("<html") ||
    /<html[\s>]/i.test(inputHtml);

  if (!isFullDocument) return inputHtml;

  const parser = new DOMParser();
  const doc = parser.parseFromString(inputHtml, "text/html");

  const headStyleAndLinks = Array.from(
    doc.querySelectorAll("head style, head link[rel='stylesheet']"),
  )
    .map((node) => node.outerHTML)
    .join("");

  const bodyClass = doc.body.getAttribute("class")?.trim() || "";
  const mergedBodyClass = `${bodyClass} ui-block-body`.trim();
  const bodyContent = doc.body.innerHTML;

  return `${headStyleAndLinks}<div class="${mergedBodyClass}">${bodyContent}</div>`;
}

function isFullDocumentHtml(inputHtml: string): boolean {
  const trimmed = inputHtml.trim().toLowerCase();
  return (
    trimmed.startsWith("<!doctype html") ||
    trimmed.startsWith("<html") ||
    /<html[\s>]/i.test(inputHtml)
  );
}

export default function ScopedHtmlContent({ html, className }: ScopedHtmlContentProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const shadowRef = useRef<ShadowRoot | null>(null);
  const isFullDocument = isFullDocumentHtml(html);

  useEffect(() => {
    if (isFullDocument) return;
    const host = hostRef.current;
    if (!host) return;

    if (!shadowRef.current) {
      shadowRef.current = host.attachShadow({ mode: "open" });
    }

    shadowRef.current.innerHTML = normalizeHtmlForShadow(html);
  }, [html, isFullDocument]);

  if (isFullDocument) {
    return (
      <iframe
        title="ui-block-content"
        className={className}
        srcDoc={html}
        style={{ width: "100%", minHeight: "100vh", border: "none" }}
      />
    );
  }

  return <div ref={hostRef} className={className} />;
}

