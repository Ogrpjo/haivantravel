"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type ProjectContentFrameProps = {
  title: string;
  srcDoc: string;
};

export default function ProjectContentFrame({ title, srcDoc }: ProjectContentFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [height, setHeight] = useState(800);

  const syncHeight = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const doc = iframe.contentDocument;
    if (!doc) return;

    const body = doc.body;
    const html = doc.documentElement;
    if (!body || !html) return;

    const nextHeight = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight,
    );

    if (Number.isFinite(nextHeight) && nextHeight > 0) {
      setHeight(nextHeight);
    }
  }, []);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    let observer: ResizeObserver | null = null;
    let rafId = 0;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const onLoad = () => {
      syncHeight();
      const doc = iframe.contentDocument;
      if (!doc) return;

      const recalc = () => {
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(syncHeight);
      };

      observer = new ResizeObserver(recalc);
      observer.observe(doc.documentElement);
      if (doc.body) observer.observe(doc.body);

      doc.querySelectorAll("img").forEach((img) => {
        img.addEventListener("load", recalc, { passive: true });
      });

      intervalId = setInterval(syncHeight, 800);
    };

    iframe.addEventListener("load", onLoad);
    return () => {
      iframe.removeEventListener("load", onLoad);
      observer?.disconnect();
      if (intervalId) clearInterval(intervalId);
      cancelAnimationFrame(rafId);
    };
  }, [syncHeight, srcDoc]);

  return (
    <iframe
      ref={iframeRef}
      title={title}
      className="w-full border-0 bg-transparent"
      style={{ height: `${height}px` }}
      srcDoc={srcDoc}
    />
  );
}
