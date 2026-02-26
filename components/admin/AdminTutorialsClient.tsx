"use client";

import { useMemo, useState } from "react";
import { formatPtBrDateStable } from "@/lib/format/date";
import { deleteAdminTutorial } from "@/lib/tutorials/api";
import type { Tutorial, TutorialPlatform } from "@/lib/tutorials/types";
import { AdminTutorialForm } from "@/components/admin/AdminTutorialForm";

type Props = {
  initialTutorials: Tutorial[];
  initialPlatforms: TutorialPlatform[];
};

export function AdminTutorialsClient({ initialTutorials, initialPlatforms }: Props) {
  const [tutorials, setTutorials] = useState<Tutorial[]>(initialTutorials);
  const [platforms, setPlatforms] = useState<TutorialPlatform[]>(initialPlatforms);
  const [editing, setEditing] = useState<Tutorial | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const platformById = useMemo(() => {
    const map = new Map<string, TutorialPlatform>();
    for (let i = 0; i < platforms.length; i += 1) {
      const p = platforms[i]!;
      map.set(p.id, p);
    }
    return map;
  }, [platforms]);

  const openCreate = () => {
    setEditing(null);
    setCreating(true);
    setError(null);
  };

  const openEdit = (item: Tutorial) => {
    setCreating(false);
    setEditing(item);
    setError(null);
  };

  const closeForm = () => {
    setEditing(null);
    setCreating(false);
  };

  const upsertTutorial = (item: Tutorial) => {
    setTutorials((curr) => {
      const exists = curr.some((t) => t.id === item.id);
      const next = exists
        ? curr.map((t) => (t.id === item.id ? item : t))
        : [item, ...curr];
      return next.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    });
    closeForm();
  };

  const onDelete = async (id: string) => {
    if (!confirm("Excluir este tutorial?")) return;
    setError(null);
    try {
      await deleteAdminTutorial(id);
      setTutorials((curr) => curr.filter((t) => t.id !== id));
      if (editing?.id === id) closeForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao excluir tutorial.");
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <a href="/admin/dashboard" className="text-sm font-semibold text-text">Voltar para dashboard</a>
            <h1 className="mt-4 heading-2 font-semibold text-text">Tutorials (Admin)</h1>
            <p className="mt-1 text-body text-muted">Gerencie tutoriais e plataformas.</p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white"
          >
            Novo Tutorial
          </button>
        </div>

        {creating || editing ? (
          <div className="mt-6">
            <AdminTutorialForm
              platforms={platforms}
              initial={editing}
              onCancel={closeForm}
              onSaved={upsertTutorial}
              onPlatformsChange={setPlatforms}
            />
          </div>
        ) : null}

        <div className="mt-8 surface rounded-2xl p-4 md:p-6">
          {error ? <div className="mb-4 text-sm text-accent">{error}</div> : null}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="text-left text-muted border-b border-border">
                  <th className="pb-3 pr-4 font-semibold">Título</th>
                  <th className="pb-3 pr-4 font-semibold">Plataforma</th>
                  <th className="pb-3 pr-4 font-semibold">Status</th>
                  <th className="pb-3 pr-4 font-semibold">Atualizado em</th>
                  <th className="pb-3 pr-4 font-semibold">Editar</th>
                  <th className="pb-3 font-semibold">Excluir</th>
                </tr>
              </thead>
              <tbody>
                {tutorials.map((t) => (
                  <tr key={t.id} className="border-b border-border">
                    <td className="py-3 pr-4 text-text">{t.title}</td>
                    <td className="py-3 pr-4 text-text">{platformById.get(t.platformId)?.name || "-"}</td>
                    <td className="py-3 pr-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          t.status === "active" ? "bg-[rgb(var(--accent))]/10 text-accent" : "bg-black/5 text-muted"
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-muted">{formatPtBrDateStable(t.updatedAt)}</td>
                    <td className="py-3 pr-4">
                      <button
                        type="button"
                        onClick={() => openEdit(t)}
                        className="rounded-full border border-border bg-white px-4 py-1.5 text-xs font-semibold text-text"
                      >
                        Editar
                      </button>
                    </td>
                    <td className="py-3">
                      <button
                        type="button"
                        onClick={() => onDelete(t.id)}
                        className="rounded-full border border-accent/30 bg-white px-4 py-1.5 text-xs font-semibold text-accent"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
                {tutorials.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-5 text-muted">Nenhum tutorial cadastrado.</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
