"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Tutorial, TutorialPlatform } from "@/lib/tutorials/types";

type Props = {
  tutorials: Tutorial[];
  platforms: TutorialPlatform[];
};

const COLLAPSED_COUNT = 4;

export function TutorialsSection({ tutorials, platforms }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [selectedPlatformIds, setSelectedPlatformIds] = useState<string[]>([]);
  const filterRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!openFilter) return;
      if (!filterRef.current) return;
      if (filterRef.current.contains(e.target as Node)) return;
      setOpenFilter(false);
    };

    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [openFilter]);

  const platformById = useMemo(() => {
    const map = new Map<string, TutorialPlatform>();
    for (let i = 0; i < platforms.length; i += 1) {
      const p = platforms[i]!;
      map.set(p.id, p);
    }
    return map;
  }, [platforms]);

  const filtered = useMemo(() => {
    if (selectedPlatformIds.length === 0) return tutorials;
    const selected = new Set(selectedPlatformIds);
    return tutorials.filter((t) => selected.has(t.platformId));
  }, [tutorials, selectedPlatformIds]);

  const totalFiltered = filtered.length;
  const canExpand = totalFiltered > COLLAPSED_COUNT;
  const visible = expanded ? filtered : filtered.slice(0, COLLAPSED_COUNT);

  const togglePlatform = (id: string) => {
    setSelectedPlatformIds((curr) => {
      if (curr.includes(id)) return curr.filter((x) => x !== id);
      return [...curr, id];
    });
    setExpanded(false);
  };

  const onClearFilters = () => {
    setSelectedPlatformIds([]);
    setExpanded(false);
  };

  return (
    <section id="tutorials" className="section-space pt-4 md:pt-5" aria-label="Tutorials">
      <div className="max-w-2xl mx-auto text-center">
        <h2
          className="section-title inline-flex items-center rounded-lg bg-white/40 px-2 py-0.5 backdrop-blur-[2px]"
          data-leaf-block="section-title"
        >
          Tutorials
        </h2>
        <p className="mt-2 section-subtitle" data-leaf-block="section-subtitle">
          Materiais e guias para apoiar o uso das plataformas
        </p>
      </div>

      <div className="mt-4 flex justify-center md:justify-end">
        <div className="relative" ref={filterRef}>
          <button
            type="button"
            onClick={() => setOpenFilter((v) => !v)}
            className="rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-text hover:text-accent"
          >
            Filtrar
          </button>

          {openFilter ? (
            <div className="absolute right-0 mt-2 w-64 surface rounded-2xl p-3 z-30">
              <div className="text-xs font-semibold text-muted">Plataformas</div>
              <div className="mt-2 max-h-48 overflow-auto space-y-2">
                {platforms.map((p) => (
                  <label key={p.id} className="flex items-center gap-2 text-sm text-text">
                    <input
                      type="checkbox"
                      checked={selectedPlatformIds.includes(p.id)}
                      onChange={() => togglePlatform(p.id)}
                    />
                    {p.name}
                  </label>
                ))}
                {platforms.length === 0 ? (
                  <div className="text-xs text-muted">Nenhuma plataforma cadastrada.</div>
                ) : null}
              </div>

              <button
                type="button"
                onClick={onClearFilters}
                className="mt-3 text-xs font-semibold text-muted hover:text-accent"
              >
                Limpar filtros
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-5">
        {tutorials.length === 0 ? (
          <div className="surface rounded-2xl p-5 text-sm text-muted">
            Nenhum tutorial disponível no momento.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {visible.map((tutorial) => {
                const platform = platformById.get(tutorial.platformId);
                return (
                  <article key={tutorial.id} className="surface rounded-2xl p-5">
                    <div className="inline-flex rounded-full bg-black/5 px-2.5 py-1 text-xs font-semibold text-text">
                      {platform?.name || "Plataforma"}
                    </div>
                    <h3 className="mt-3 card-title">{tutorial.title}</h3>
                    <Link
                      href={tutorial.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex text-sm font-semibold text-accent hover:text-accent2"
                    >
                      Ver tutorial &rarr;
                    </Link>
                  </article>
                );
              })}
            </div>

            {canExpand ? (
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={() => setExpanded((v) => !v)}
                  className="rounded-xl border border-border bg-surface px-4 py-2 text-sm font-semibold text-text hover:text-accent"
                >
                  {expanded ? "Ver menos" : "More"}
                </button>
              </div>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
}
