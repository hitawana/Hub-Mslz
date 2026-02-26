"use client";

import Image from "next/image";
import { useEffect } from "react";
import type { NewsItem } from "@/lib/news/types";
import { TagBadge } from "@/components/news/TagBadge";
import { formatPtBrDateStable } from "@/lib/format/date";

export function NewsModal({
  open,
  news,
  onClose
}: {
  open: boolean;
  news: NewsItem | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open || !news) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <button type="button" className="absolute inset-0 bg-black/45" onClick={onClose} aria-label="Fechar" />
      <div className="relative z-10 surface flex w-full max-w-3xl max-h-[90vh] flex-col overflow-hidden rounded-2xl">
        <div className="relative h-48 md:h-64 w-full bg-[rgb(var(--bg))]">
          {news.image_url ? (
            <Image
              src={news.image_url}
              alt={news.title}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              unoptimized
            />
          ) : null}
        </div>

        <div className="flex items-center justify-between gap-4 border-b border-border px-6 py-4 md:px-7">
          <div className="flex min-w-0 items-center gap-3">
            <TagBadge tag={news.tag} />
            <span className="meta-text">{formatPtBrDateStable(news.published_at)}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-border px-3 py-1.5 text-sm text-muted hover:text-text"
          >
            Fechar
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-5 md:px-7">
          <h3 className="font-title heading-3 font-black text-text">{news.title}</h3>
          <p className="mt-4 whitespace-pre-wrap card-body">{news.content}</p>

          {news.redirect_enabled && news.redirect_url ? (
            <a
              href={news.redirect_url}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white"
            >
              {news.redirect_label || "Acessar"}
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
