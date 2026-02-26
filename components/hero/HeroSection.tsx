"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { SearchResultsPanel } from "@/components/search/SearchResultsPanel";
import type { NewsItem } from "@/lib/news/types";
import { isSearchQueryActive, normalizeSearchQuery } from "@/lib/search/query";
import type { SearchToolResult } from "@/lib/server/search";
import type { Tutorial, TutorialPlatform } from "@/lib/tutorials/types";

function useTypewriter(text: string, speedMs = 45) {
  const [i, setI] = useState(0);

  useEffect(() => {
    setI(0);
    const t = setInterval(() => {
      setI((cur) => {
        if (cur >= text.length) {
          clearInterval(t);
          return cur;
        }
        return cur + 1;
      });
    }, speedMs);

    return () => clearInterval(t);
  }, [text, speedMs]);

  return text.slice(0, i);
}

type Props = {
  initialQuery?: string;
  searchResults?: {
    news: NewsItem[];
    tools: SearchToolResult[];
    tutorials: Tutorial[];
  } | null;
  platforms?: TutorialPlatform[];
};

type PanelPosition = {
  top: number;
  left: number;
  width: number;
};

export function HeroSection({ initialQuery = "", searchResults = null, platforms = [] }: Props) {
  const router = useRouter();
  const phrases = useMemo(
    () => [
      "No que podemos ajudar hoje?",
      "Encontre ferramentas e tutoriais em um so lugar.",
      "Acompanhe as novidades do NIT."
    ],
    []
  );

  const [p, setP] = useState(0);
  const [searchTerm, setSearchTerm] = useState(() => normalizeSearchQuery(initialQuery));
  const [panelDismissed, setPanelDismissed] = useState(false);
  const [panelPosition, setPanelPosition] = useState<PanelPosition | null>(null);
  const lastPushedRef = useRef(normalizeSearchQuery(initialQuery));
  const searchWrapperRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const typed = useTypewriter(phrases[p]!, 38);

  const normalizedInputQuery = normalizeSearchQuery(searchTerm);
  const normalizedServerQuery = normalizeSearchQuery(initialQuery);
  const hasActiveQuery = isSearchQueryActive(normalizedInputQuery);
  const resultsAreSynced = normalizedInputQuery === normalizedServerQuery;
  const showResultsPanel = hasActiveQuery && !panelDismissed;

  const platformById = useMemo(() => {
    const map = new Map<string, TutorialPlatform>();
    for (let i = 0; i < platforms.length; i += 1) {
      const platform = platforms[i]!;
      map.set(platform.id, platform);
    }
    return map;
  }, [platforms]);

  const panelNews = useMemo(() => {
    if (!searchResults || !resultsAreSynced) return [];
    return searchResults.news.slice(0, 4);
  }, [searchResults, resultsAreSynced]);

  const panelTutorials = useMemo(() => {
    if (!searchResults || !resultsAreSynced) return [];
    return searchResults.tutorials.slice(0, 4).map((item) => ({
      id: item.id,
      title: item.title,
      url: item.url,
      platformName: platformById.get(item.platformId)?.name || "Plataforma"
    }));
  }, [searchResults, platformById, resultsAreSynced]);

  const panelTools = useMemo(() => {
    if (!searchResults || !resultsAreSynced) return [];
    return searchResults.tools.slice(0, 4);
  }, [searchResults, resultsAreSynced]);

  useEffect(() => {
    if (typed.length !== phrases[p]!.length) return;
    const t = setTimeout(() => setP((cur) => (cur + 1) % phrases.length), 1800);
    return () => clearTimeout(t);
  }, [typed, p, phrases]);

  useEffect(() => {
    const normalized = normalizeSearchQuery(initialQuery);
    setSearchTerm(normalized);
    lastPushedRef.current = normalized;
    setPanelDismissed(false);
  }, [initialQuery]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const q = normalizeSearchQuery(searchTerm);

      if (!q) {
        if (lastPushedRef.current !== "") {
          router.replace("/", { scroll: false });
          lastPushedRef.current = "";
        }
        return;
      }

      if (!isSearchQueryActive(q)) {
        if (lastPushedRef.current !== "") {
          router.replace("/", { scroll: false });
          lastPushedRef.current = "";
        }
        return;
      }
      if (lastPushedRef.current === q) return;

      router.replace(`/?q=${encodeURIComponent(q)}`, { scroll: false });
      lastPushedRef.current = q;
    }, 250);

    return () => window.clearTimeout(timer);
  }, [router, searchTerm]);

  useEffect(() => {
    if (!showResultsPanel) return;

    const onMouseDown = (event: MouseEvent) => {
      if (!searchWrapperRef.current) return;
      if (searchWrapperRef.current.contains(event.target as Node)) return;
      if (event.target instanceof Element && event.target.closest('[data-search-panel="hero"]')) return;
      setPanelDismissed(true);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setPanelDismissed(true);
      }
    };

    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [showResultsPanel]);

  useEffect(() => {
    if (!showResultsPanel) {
      setPanelPosition(null);
      return;
    }

    let rafId = 0;

    const updatePanelPosition = () => {
      const input = searchInputRef.current;
      if (!input) {
        setPanelPosition(null);
        return;
      }

      const rect = input.getBoundingClientRect();
      setPanelPosition({
        top: rect.bottom + 8,
        left: rect.left,
        width: rect.width
      });
    };

    const scheduleUpdate = () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      rafId = window.requestAnimationFrame(updatePanelPosition);
    };

    scheduleUpdate();
    window.addEventListener("resize", scheduleUpdate, { passive: true });
    window.addEventListener("scroll", scheduleUpdate, { passive: true, capture: true });

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("scroll", scheduleUpdate, true);
    };
  }, [showResultsPanel, normalizedInputQuery]);

  return (
    <section className="section-space pt-5 md:pt-7 pb-5 md:pb-6" aria-label="Hero">
      <div className="relative surface rounded-2xl overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(168,168,173,0.65) 1px, transparent 1px)",
            backgroundSize: "18px 18px"
          }}
        />

        <div className="relative px-5 md:px-10 py-10 md:py-12 min-h-[220px] md:min-h-[280px]">
          <div className="flex min-h-[140px] md:min-h-[180px] items-center justify-center">
            <div className="flex w-full flex-col items-center">
              <div className="text-center">
                <div className="inline-flex items-center gap-3">
                  <div
                    className="font-title font-black text-3xl md:text-4xl leading-none tracking-tight text-accent"
                    data-leaf-block="hero-title"
                  >
                    NIT
                  </div>
                  <div className="relative h-9 w-9 md:h-10 md:w-10 animate-float">
                    <Image src="/bear-mark.svg" alt="" fill priority />
                  </div>
                </div>

                <div className="mt-2 text-sm md:text-base leading-relaxed text-text" data-leaf-block="hero-paragraph">
                  <span className="font-medium">{typed}</span>
                  <span className="ml-0.5 inline-block w-[10px] h-[18px] align-middle bg-[rgb(var(--accent))] animate-caret" aria-hidden />
                </div>
              </div>

              <div ref={searchWrapperRef} className="mt-6 w-full max-w-[612px] mx-auto">
                <div className="relative w-full min-w-0">
                  <label htmlFor="hero-search" className="sr-only">
                    Buscar por palavra-chave
                  </label>
                  <input
                    ref={searchInputRef}
                    id="hero-search"
                    type="text"
                    value={searchTerm}
                    onChange={(event) => {
                      setSearchTerm(normalizeSearchQuery(event.target.value));
                      setPanelDismissed(false);
                    }}
                    onFocus={() => {
                      if (hasActiveQuery) setPanelDismissed(false);
                    }}
                    placeholder="Buscar por palavra-chave"
                    className="block w-full h-12 rounded-2xl border border-border bg-white/95 px-5 text-sm text-text placeholder:text-muted outline-none shadow-[0_8px_24px_rgba(15,23,42,0.10)] focus:border-accent focus:ring-2 focus:ring-[rgba(207,33,43,0.18)]"
                  />

                  {showResultsPanel ? (
                    <SearchResultsPanel
                      news={panelNews}
                      tools={panelTools}
                      tutorials={panelTutorials}
                      loading={!resultsAreSynced}
                      position={panelPosition}
                      onItemSelect={() => setPanelDismissed(true)}
                    />
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
