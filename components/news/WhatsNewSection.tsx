"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { NewsModal } from "@/components/news/NewsModal";
import { TagBadge } from "@/components/news/TagBadge";
import { formatPtBrDateStable } from "@/lib/format/date";
import { fetchPublicNews } from "@/lib/news/api";
import type { NewsItem, PublicNewsPage } from "@/lib/news/types";

type Props = {
  initialItems?: NewsItem[];
};

function emptyPage(): PublicNewsPage {
  return { featured: null, page: 1, pages: 1, items: [] };
}

function fromItems(items: NewsItem[]): PublicNewsPage {
  if (items.length === 0) return emptyPage();
  return {
    featured: items[0] ?? null,
    page: 1,
    pages: 1,
    items: items.slice(1)
  };
}

function NewsCard({ item, onClick }: { item: NewsItem; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group surface flex h-full w-full flex-col overflow-hidden rounded-2xl text-left transition hover:border-[rgb(var(--accent))]/40"
    >
      <div className="relative h-44 md:h-48 w-full bg-[rgb(var(--surface))]">
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
            unoptimized
          />
        ) : null}
      </div>
      <div className="p-5">
        <div className="flex items-center gap-3">
          <TagBadge tag={item.tag} />
          <span className="meta-text">{formatPtBrDateStable(item.published_at)}</span>
        </div>
        <div className="mt-3 card-title line-clamp-2">{item.title}</div>
        <p className="mt-2 card-body line-clamp-3">{item.content}</p>
      </div>
    </button>
  );
}

export function WhatsNewSection({ initialItems }: Props) {
  const staticMode = initialItems !== undefined;

  const [data, setData] = useState<PublicNewsPage>(() => {
    if (staticMode) return fromItems(initialItems ?? []);
    return emptyPage();
  });
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<NewsItem | null>(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dots = useMemo(() => Array.from({ length: data.pages }, (_, i) => i + 1), [data.pages]);

  const loadPage = async (p: number) => {
    const next = await fetchPublicNews(p);
    setData(next);
    setPage(next.page);
  };

  useEffect(() => {
    if (!staticMode) return;
    setData(fromItems(initialItems ?? []));
    setPage(1);
    setError(null);
  }, [staticMode, initialItems]);

  useEffect(() => {
    if (staticMode) return;
    loadPage(1).catch(() => setError("Nao foi possivel carregar as noticias."));
  }, [staticMode]);

  useEffect(() => {
    if (staticMode || data.pages <= 1) return;
    const t = setInterval(() => {
      const next = page >= data.pages ? 1 : page + 1;
      loadPage(next).catch(() => {});
    }, 6500);
    return () => clearInterval(t);
  }, [staticMode, page, data.pages]);

  const featured = data.featured;

  return (
    <section id="whats-new" className="py-10" aria-label="What's New">
      <div className="max-w-2xl mx-auto text-center">
        <h2
          className="section-title inline-flex items-center rounded-lg bg-white/40 px-2 py-0.5 backdrop-blur-[2px]"
          data-leaf-block="section-title"
        >
          What&apos;s New?
        </h2>
        <p className="mt-2 section-subtitle" data-leaf-block="section-subtitle">Atualizacoes e comunicados recentes do NIT</p>
      </div>

      <div className="mt-7 grid gap-6">
        {error ? <div className="surface rounded-2xl p-5 text-sm text-accent">{error}</div> : null}

        {featured ? (
          <button
            type="button"
            onClick={() => {
              setSelected(featured);
              setOpen(true);
            }}
            className="surface overflow-hidden rounded-2xl text-left transition hover:border-[rgb(var(--accent))]/40"
          >
            <div className="grid gap-0 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
              <div className="relative h-52 md:h-full min-h-[220px] bg-[rgb(var(--surface))]">
                {featured.image_url ? (
                  <Image
                    src={featured.image_url}
                    alt={featured.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 45vw"
                    className="object-cover"
                    unoptimized
                  />
                ) : null}
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3">
                  <TagBadge tag={featured.tag} />
                  <span className="meta-text">{formatPtBrDateStable(featured.published_at)}</span>
                </div>
                <h3 className="mt-3 card-title">{featured.title}</h3>
                <p className="mt-3 line-clamp-4 card-body">{featured.content}</p>
              </div>
            </div>
          </button>
        ) : (
          <div className="surface rounded-2xl p-5 text-sm text-muted">Nenhuma noticia cadastrada.</div>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          {data.items.slice(0, 3).map((item) => (
            <NewsCard
              key={`${page}-${item.id}`}
              item={item}
              onClick={() => {
                setSelected(item);
                setOpen(true);
              }}
            />
          ))}
        </div>

        {!staticMode && data.pages > 1 ? (
          <div className="flex items-center justify-center gap-2">
            {dots.map((p) => (
              <button
                key={p}
                type="button"
                aria-label={`Ir para pagina ${p}`}
                onClick={() => loadPage(p)}
                className={`h-2 w-2 rounded-full ${p === page ? "bg-accent" : "bg-border"}`}
              />
            ))}
          </div>
        ) : null}
      </div>

      <NewsModal open={open} news={selected} onClose={() => setOpen(false)} />
    </section>
  );
}
