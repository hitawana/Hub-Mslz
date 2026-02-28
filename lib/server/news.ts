import { mutateDb, readDb } from "@/lib/server/db";
import type { NewsItem, NewsTag, PublicNewsPage } from "@/lib/news/types";

export type NewsPayload = {
  tag: NewsTag;
  title: string;
  image_url: string;
  content: string;
  published_at: string;
  redirect_enabled: boolean;
  redirect_label: string;
  redirect_url: string;
};

const TAGS: NewsTag[] = ["HS", "EFAF", "EFAI", "INFANTIL", "TI"];

function normalizeText(v: unknown) {
  return String(v ?? "").trim();
}

export function validateNewsPayload(input: unknown): { ok: true; value: NewsPayload } | { ok: false; error: string } {
  const src = (input || {}) as Record<string, unknown>;
  const tag = normalizeText(src.tag) as NewsTag;

  if (!TAGS.includes(tag)) return { ok: false, error: "Tag invalida." };

  const title = normalizeText(src.title);
  if (!title) return { ok: false, error: "Titulo e obrigatorio." };

  const content = normalizeText(src.content);
  if (!content) return { ok: false, error: "Conteudo e obrigatorio." };

  const image_url = normalizeText(src.image_url);
  const redirect_enabled = Boolean(src.redirect_enabled);
  const redirect_label = normalizeText(src.redirect_label);
  const redirect_url = normalizeText(src.redirect_url);

  const dateRaw = normalizeText(src.published_at);
  const dt = new Date(dateRaw);
  if (Number.isNaN(dt.getTime())) return { ok: false, error: "Data de publicacao invalida." };

  if (redirect_enabled && !redirect_url) {
    return { ok: false, error: "Informe a URL de destino." };
  }

  return {
    ok: true,
    value: {
      tag,
      title,
      image_url,
      content,
      published_at: dt.toISOString(),
      redirect_enabled,
      redirect_label: redirect_enabled ? (redirect_label || "Clique aqui") : "",
      redirect_url: redirect_enabled ? redirect_url : ""
    }
  };
}

function sortNews(items: NewsItem[]): NewsItem[] {
  return [...items].sort((a, b) => {
    const byDate = new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
    if (byDate !== 0) return byDate;
    return b.id - a.id;
  });
}

function clampPage(page: number, totalPages: number): number {
  if (totalPages <= 0) return 1;
  if (page < 1) return 1;
  if (page > totalPages) return totalPages;
  return page;
}

export async function listAllNews(): Promise<NewsItem[]> {
  const db = await readDb();
  return sortNews(db.news);
}

export async function getNewsById(id: number): Promise<NewsItem | null> {
  const db = await readDb();
  const item = db.news.find((n) => n.id === id);
  return item ?? null;
}

export async function createNews(payload: NewsPayload): Promise<NewsItem> {
  let created: NewsItem | null = null;

  await mutateDb((curr) => {
    const maxId = curr.news.reduce((acc, n) => Math.max(acc, n.id), 0);
    const item: NewsItem = { id: maxId + 1, ...payload };
    created = item;
    return { ...curr, news: [...curr.news, item] };
  });

  return created!;
}

export async function updateNews(id: number, payload: NewsPayload): Promise<NewsItem | null> {
  let updated: NewsItem | null = null;

  await mutateDb((curr) => {
    const exists = curr.news.some((n) => n.id === id);
    if (!exists) return curr;

    const news = curr.news.map((n) => {
      if (n.id !== id) return n;
      updated = { id, ...payload };
      return updated;
    });

    return { ...curr, news };
  });

  return updated;
}

export async function deleteNews(id: number): Promise<boolean> {
  let deleted = false;

  await mutateDb((curr) => {
    const news = curr.news.filter((n) => n.id !== id);
    deleted = news.length !== curr.news.length;
    return { ...curr, news };
  });

  return deleted;
}

export async function getPublicNewsPage(page = 1, pageSize = 3): Promise<PublicNewsPage> {
  const sorted = await listAllNews();
  const firstFeatured = sorted[0] ?? null;

  if (!firstFeatured) {
    return { featured: null, page: 1, pages: 1, items: [] };
  }

  const rest = sorted.slice(1);
  const pages = Math.max(1, Math.ceil(rest.length / pageSize));
  const current = clampPage(page, pages);
  const start = (current - 1) * pageSize;
  const featured = current === 1 ? firstFeatured : null;

  return {
    featured,
    page: current,
    pages,
    items: rest.slice(start, start + pageSize)
  };
}
