"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatPtBrDateStable } from "@/lib/format/date";
import type { NewsItem } from "@/lib/news/types";
import { adminLogout, fetchAdminNews } from "@/lib/news/api";

export function AdminDashboardClient({ email }: { email: string }) {
  const router = useRouter();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAdminNews()
      .then((items) => setNews(items))
      .catch((err) => setError(err instanceof Error ? err.message : "Falha ao carregar noticias."))
      .finally(() => setLoading(false));
  }, []);

  const onLogout = async () => {
    await adminLogout();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-bg">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <a href="/" className="text-sm font-semibold text-text">Voltar ao portal</a>
            <h1 className="mt-4 heading-2 font-semibold text-text">Dashboard (Admin)</h1>
            <p className="mt-1 text-body text-muted">Logado como {email}</p>
          </div>
          <div className="flex items-center gap-3">
            <a href="/admin/news/new" className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white">Nova noticia</a>
            <a href="/admin/tutorials" className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-text">Tutorials</a>
            <button onClick={onLogout} className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-text">Sair</button>
          </div>
        </div>

        <div className="mt-8 surface rounded-2xl p-6">
          <div className="heading-4 font-semibold text-text">Noticias</div>
          {error ? <div className="mt-4 text-sm text-accent">{error}</div> : null}
          {loading ? (
            <div className="mt-4 text-sm text-muted">Carregando...</div>
          ) : (
            <div className="mt-4 divide-y divide-border">
              {news.map((n) => (
                <div key={n.id} className="flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="heading-4 font-semibold text-text">{n.title}</div>
                    <div className="mt-1 text-xs text-muted">{n.tag} - {formatPtBrDateStable(n.published_at)}</div>
                  </div>
                  <a href={`/admin/news/${n.id}`} className="rounded-full border border-border bg-white px-4 py-2 text-xs font-semibold text-text">Editar</a>
                </div>
              ))}
              {news.length === 0 ? <div className="py-4 text-sm text-muted">Nenhuma noticia cadastrada.</div> : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
