"use client";

import Link from "next/link";
import { createPortal } from "react-dom";
import type { NewsItem } from "@/lib/news/types";
import type { SearchToolResult } from "@/lib/server/search";

export type TutorialSearchResult = {
  id: string;
  title: string;
  url: string;
  platformName: string;
};

type PanelPosition = {
  top: number;
  left: number;
  width: number;
};

type Props = {
  news: NewsItem[];
  tools: SearchToolResult[];
  tutorials: TutorialSearchResult[];
  loading?: boolean;
  position: PanelPosition | null;
  onItemSelect: () => void;
};

type SearchItem = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  external: boolean;
};

export function SearchResultsPanel({
  news,
  tools,
  tutorials,
  loading = false,
  position,
  onItemSelect
}: Props) {
  if (!position || typeof document === "undefined") return null;

  const items: SearchItem[] = [
    ...news.map((item) => ({
      id: `news-${item.id}`,
      title: item.title,
      subtitle: "Noticia",
      href: `/news/${item.id}`,
      external: false
    })),
    ...tools.map((item) => ({
      id: `tool-${item.title}-${item.href}`,
      title: item.title,
      subtitle: "Ferramenta",
      href: item.href,
      external: item.href.startsWith("http")
    })),
    ...tutorials.map((item) => ({
      id: `tutorial-${item.id}`,
      title: item.title,
      subtitle: item.platformName || "Tutorial",
      href: item.url,
      external: true
    }))
  ];

  const panel = (
    <div
      data-search-panel="hero"
      className="z-[100] overflow-hidden rounded-2xl border border-border/60 bg-white/60 shadow-[0_14px_40px_rgba(15,23,42,0.14)] backdrop-blur-md"
      style={{
        position: "fixed",
        top: position.top,
        left: position.left,
        width: position.width
      }}
    >
      {loading ? (
        <div className="px-4 py-3 text-sm text-muted">Buscando...</div>
      ) : items.length === 0 ? (
        <div className="px-4 py-3 text-sm text-muted">Sem resultados, busque outra palavra-chave</div>
      ) : (
        <div className="max-h-[60vh] overflow-auto py-1">
          <ul className="space-y-0.5">
            {items.map((item) => (
              <li key={item.id}>
                {item.external ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onItemSelect}
                    className="block cursor-pointer px-4 py-2.5 text-text transition-colors hover:bg-accent/10 hover:text-accent"
                  >
                    <div className="text-sm font-medium line-clamp-1">{item.title}</div>
                    <div className="mt-0.5 text-xs text-muted line-clamp-1">{item.subtitle}</div>
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    onClick={onItemSelect}
                    className="block cursor-pointer px-4 py-2.5 text-text transition-colors hover:bg-accent/10 hover:text-accent"
                  >
                    <div className="text-sm font-medium line-clamp-1">{item.title}</div>
                    <div className="mt-0.5 text-xs text-muted line-clamp-1">{item.subtitle}</div>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  return createPortal(panel, document.body);
}

