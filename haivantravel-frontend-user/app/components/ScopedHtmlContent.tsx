type ScopedHtmlContentProps = {
  html: string;
  className?: string;
};

function isFullDocumentHtml(content: string): boolean {
  return /<!doctype html/i.test(content) || /<html[\s>]/i.test(content);
}

export default function ScopedHtmlContent({ html, className }: ScopedHtmlContentProps) {
  const content = html?.trim() ?? "";
  if (!content) return null;

  if (isFullDocumentHtml(content)) {
    return (
      <iframe
        title="Scoped HTML content"
        className={className ?? "w-full min-h-screen border-0 bg-transparent"}
        srcDoc={content}
      />
    );
  }

  return (
    <div
      className={className ?? "w-full"}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
