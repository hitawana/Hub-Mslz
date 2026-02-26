"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { NewsInput, NewsItem, NewsTag } from "@/lib/news/types";
import { createAdminNews, deleteAdminNews, updateAdminNews } from "@/lib/news/api";

const TAGS: NewsTag[] = ["HS", "EFAF", "EFAI", "INFANTIL", "TI"];

function toInputDatetime(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function AdminNewsForm({ initial }: { initial?: NewsItem }) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);

  const [tag, setTag] = useState<NewsTag>(initial?.tag || "TI");
  const [title, setTitle] = useState(initial?.title || "");
  const [imageUrl, setImageUrl] = useState(initial?.image_url || "");
  const [content, setContent] = useState(initial?.content || "");
  const [publishedAt, setPublishedAt] = useState(initial?.published_at ? toInputDatetime(initial.published_at) : toInputDatetime(new Date().toISOString()));
  const [redirectEnabled, setRedirectEnabled] = useState(Boolean(initial?.redirect_enabled));
  const [redirectLabel, setRedirectLabel] = useState(initial?.redirect_label || "");
  const [redirectUrl, setRedirectUrl] = useState(initial?.redirect_url || "");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const payload = useMemo<NewsInput>(
    () => ({
      tag,
      title,
      image_url: imageUrl,
      content,
      published_at: new Date(publishedAt).toISOString(),
      redirect_enabled: redirectEnabled,
      redirect_label: redirectLabel,
      redirect_url: redirectUrl
    }),
    [tag, title, imageUrl, content, publishedAt, redirectEnabled, redirectLabel, redirectUrl]
  );

  const onSave = async () => {
    setSaving(true);
    setError(null);

    try {
      if (isEdit && initial) {
        await updateAdminNews(initial.id, payload);
      } else {
        await createAdminNews(payload);
      }
      router.push("/admin/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao salvar noticia.");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!isEdit || !initial) return;
    if (!confirm("Excluir esta noticia?")) return;

    setSaving(true);
    setError(null);

    try {
      await deleteAdminNews(initial.id);
      router.push("/admin/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao excluir noticia.");
      setSaving(false);
    }
  };

  return (
    <div className="surface rounded-2xl p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="heading-4 font-semibold text-text">{isEdit ? "Editar noticia" : "Nova noticia"}</div>
          <div className="mt-1 text-body text-muted">A noticia mais recente vira destaque automaticamente.</div>
        </div>
        {isEdit ? (
          <button onClick={onDelete} disabled={saving} className="rounded-full border border-accent/30 bg-white px-4 py-2 text-xs font-semibold text-accent disabled:opacity-60">
            Excluir
          </button>
        ) : null}
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-text">Tag</label>
          <select value={tag} onChange={(e) => setTag(e.target.value as NewsTag)} className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none">
            {TAGS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-text">Data de publicacao</label>
          <input type="datetime-local" value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)} className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none" />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-medium text-text">Titulo</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none" placeholder="Digite o titulo" />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-medium text-text">Imagem (URL ou caminho local)</label>
          <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none" placeholder="/hero/hero-1.png" />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-medium text-text">Conteudo</label>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={6} className="mt-2 w-full resize-none rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none" placeholder="Digite o conteudo" />
        </div>

        <div className="md:col-span-2">
          <label className="flex items-center gap-3 text-sm font-medium text-text">
            <input type="checkbox" checked={redirectEnabled} onChange={(e) => setRedirectEnabled(e.target.checked)} />
            Ativar botao de redirecionamento
          </label>
        </div>

        {redirectEnabled ? (
          <>
            <div>
              <label className="text-sm font-medium text-text">Texto do botao</label>
              <input value={redirectLabel} onChange={(e) => setRedirectLabel(e.target.value)} className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none" placeholder="Clique aqui" />
            </div>
            <div>
              <label className="text-sm font-medium text-text">URL de destino</label>
              <input value={redirectUrl} onChange={(e) => setRedirectUrl(e.target.value)} className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none" placeholder="https://..." />
            </div>
          </>
        ) : null}
      </div>

      {error ? <div className="mt-5 text-sm text-accent">{error}</div> : null}

      <div className="mt-6 flex items-center gap-3">
        <button disabled={saving} onClick={onSave} className="rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">
          {saving ? "Salvando..." : "Salvar"}
        </button>
        <a href="/admin/dashboard" className="rounded-xl border border-border bg-white px-5 py-3 text-sm font-semibold text-text">Cancelar</a>
      </div>
    </div>
  );
}
