"use client";

import { useMemo, useState } from "react";
import type { Tutorial, TutorialInput, TutorialPlatform, TutorialStatus } from "@/lib/tutorials/types";
import {
  createAdminTutorial,
  createAdminTutorialPlatform,
  updateAdminTutorial
} from "@/lib/tutorials/api";

const NEW_PLATFORM_OPTION = "__new_platform__";

type Props = {
  platforms: TutorialPlatform[];
  initial?: Tutorial | null;
  onCancel: () => void;
  onSaved: (item: Tutorial) => void;
  onPlatformsChange: (items: TutorialPlatform[]) => void;
};

export function AdminTutorialForm({
  platforms,
  initial,
  onCancel,
  onSaved,
  onPlatformsChange
}: Props) {
  const isEdit = Boolean(initial?.id);

  const [title, setTitle] = useState(initial?.title || "");
  const [url, setUrl] = useState(initial?.url || "");
  const [status, setStatus] = useState<TutorialStatus>(initial?.status || "active");
  const [platformId, setPlatformId] = useState(initial?.platformId || "");
  const [newPlatformName, setNewPlatformName] = useState("");
  const [localPlatforms, setLocalPlatforms] = useState<TutorialPlatform[]>(platforms);
  const [savingPlatform, setSavingPlatform] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const showNewPlatformField = platformId === NEW_PLATFORM_OPTION;

  const payload = useMemo<TutorialInput | null>(() => {
    const selectedPlatformId = showNewPlatformField ? "" : platformId;
    if (!title || !url || !selectedPlatformId) return null;
    return {
      title: title.trim(),
      url: url.trim(),
      platformId: selectedPlatformId,
      status
    };
  }, [title, url, platformId, status, showNewPlatformField]);

  const onCreatePlatform = async () => {
    const name = newPlatformName.trim();
    if (!name) {
      setError("Informe o nome da nova plataforma.");
      return;
    }

    setSavingPlatform(true);
    setError(null);
    try {
      const created = await createAdminTutorialPlatform(name);
      const next = [...localPlatforms, created].sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
      setLocalPlatforms(next);
      onPlatformsChange(next);
      setPlatformId(created.id);
      setNewPlatformName("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao criar plataforma.");
    } finally {
      setSavingPlatform(false);
    }
  };

  const onSave = async () => {
    if (!payload) {
      setError("Preencha titulo, URL e plataforma.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const saved = isEdit && initial
        ? await updateAdminTutorial(initial.id, payload)
        : await createAdminTutorial(payload);

      onSaved(saved);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao salvar tutorial.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="surface rounded-2xl p-6">
      <div className="heading-4 font-semibold text-text">
        {isEdit ? "Editar Tutorial" : "Novo Tutorial"}
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-text">Título</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none"
            placeholder="Digite o título"
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-medium text-text">URL</label>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none"
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="text-sm font-medium text-text">Plataforma</label>
          <select
            value={platformId || ""}
            onChange={(e) => setPlatformId(e.target.value)}
            className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none"
          >
            <option value="">Selecione</option>
            {localPlatforms.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
            <option value={NEW_PLATFORM_OPTION}>+ Nova plataforma</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-text">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as TutorialStatus)}
            className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none"
          >
            <option value="active">active</option>
            <option value="inactive">inactive</option>
          </select>
        </div>

        {showNewPlatformField ? (
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-text">Nova plataforma</label>
            <div className="mt-2 flex flex-col gap-2 md:flex-row">
              <input
                value={newPlatformName}
                onChange={(e) => setNewPlatformName(e.target.value)}
                className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none"
                placeholder="Ex.: YouTube"
              />
              <button
                type="button"
                onClick={onCreatePlatform}
                disabled={savingPlatform}
                className="rounded-xl border border-border bg-white px-4 py-3 text-sm font-semibold text-text disabled:opacity-60"
              >
                {savingPlatform ? "Salvando..." : "Salvar plataforma"}
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {error ? <div className="mt-4 text-sm text-accent">{error}</div> : null}

      <div className="mt-6 flex items-center gap-3">
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {saving ? "Salvando..." : "Salvar"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-border bg-white px-5 py-3 text-sm font-semibold text-text"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
