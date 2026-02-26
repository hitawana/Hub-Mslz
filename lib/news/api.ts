import type { AdminMe, NewsInput, NewsItem, PublicNewsPage } from "@/lib/news/types";

async function parseJson<T>(res: Response): Promise<T> {
  if (res.ok) return res.json();
  const body = await res.json().catch(() => ({}));
  const message = body?.error || "Falha na requisicao";
  throw new Error(message);
}

export async function fetchPublicNews(page = 1): Promise<PublicNewsPage> {
  const res = await fetch(`/api/public/news?page=${page}`, { cache: "no-store" });
  return parseJson<PublicNewsPage>(res);
}

export async function fetchPublicNewsById(id: number): Promise<NewsItem> {
  const res = await fetch(`/api/public/news/${id}`, { cache: "no-store" });
  return parseJson<NewsItem>(res);
}

export async function adminLogin(email: string, password: string): Promise<{ email: string }> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  return parseJson<{ email: string }>(res);
}

export async function adminLogout(): Promise<{ ok: boolean }> {
  const res = await fetch("/api/auth/logout", { method: "POST" });
  return parseJson<{ ok: boolean }>(res);
}

export async function fetchAdminMe(): Promise<AdminMe> {
  const res = await fetch("/api/auth/me", { cache: "no-store" });
  return parseJson<AdminMe>(res);
}

export async function fetchAdminNews(): Promise<NewsItem[]> {
  const res = await fetch("/api/admin/news", { cache: "no-store" });
  return parseJson<NewsItem[]>(res);
}

export async function fetchAdminNewsById(id: number): Promise<NewsItem> {
  const res = await fetch(`/api/admin/news/${id}`, { cache: "no-store" });
  return parseJson<NewsItem>(res);
}

export async function createAdminNews(payload: NewsInput): Promise<NewsItem> {
  const res = await fetch("/api/admin/news", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return parseJson<NewsItem>(res);
}

export async function updateAdminNews(id: number, payload: NewsInput): Promise<NewsItem> {
  const res = await fetch(`/api/admin/news/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return parseJson<NewsItem>(res);
}

export async function deleteAdminNews(id: number): Promise<{ ok: boolean }> {
  const res = await fetch(`/api/admin/news/${id}`, { method: "DELETE" });
  return parseJson<{ ok: boolean }>(res);
}
