import { randomUUID } from "crypto";
import { mutateDb, readDb } from "@/lib/server/db";
import type { Tutorial, TutorialInput, TutorialPlatform, TutorialStatus } from "@/lib/tutorials/types";

function nowIso() {
  return new Date().toISOString();
}

function normalizeText(v: unknown) {
  return String(v ?? "").trim();
}

function normalizeSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function isValidStatus(v: unknown): v is TutorialStatus {
  return v === "active" || v === "inactive";
}

function sortByUpdatedAtDesc<T extends { updatedAt: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const byDate = new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    if (byDate !== 0) return byDate;
    return 0;
  });
}

export function validatePlatformName(input: unknown): { ok: true; value: string } | { ok: false; error: string } {
  const name = normalizeText(input);
  if (!name) return { ok: false, error: "Nome da plataforma e obrigatorio." };
  return { ok: true, value: name };
}

export async function validateTutorialPayload(
  input: unknown
): Promise<{ ok: true; value: TutorialInput } | { ok: false; error: string }> {
  const src = (input || {}) as Record<string, unknown>;
  const title = normalizeText(src.title);
  const url = normalizeText(src.url);
  const platformId = normalizeText(src.platformId);
  const status = src.status;

  if (!title) return { ok: false, error: "Titulo e obrigatorio." };
  if (!url) return { ok: false, error: "URL e obrigatoria." };
  if (!platformId) return { ok: false, error: "Plataforma e obrigatoria." };
  if (!isValidStatus(status)) return { ok: false, error: "Status invalido." };

  const db = await readDb();
  const platformExists = db.tutorialPlatforms.some((p) => p.id === platformId);
  if (!platformExists) return { ok: false, error: "Plataforma nao encontrada." };

  return {
    ok: true,
    value: {
      title,
      url,
      platformId,
      status
    }
  };
}

export async function getPublicTutorials(): Promise<Tutorial[]> {
  const db = await readDb();
  const active = db.tutorials.filter((t) => t.status === "active");
  return sortByUpdatedAtDesc(active);
}

export async function getAllPlatforms(): Promise<TutorialPlatform[]> {
  const db = await readDb();
  return [...db.tutorialPlatforms].sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
}

export async function createPlatform(nameRaw: string): Promise<TutorialPlatform> {
  const name = normalizeText(nameRaw);
  const slug = normalizeSlug(name);

  if (!name || !slug) {
    throw new Error("Nome de plataforma invalido.");
  }

  let created: TutorialPlatform | null = null;

  await mutateDb((curr) => {
    const existing = curr.tutorialPlatforms.find((p) => p.slug === slug);
    if (existing) {
      created = existing;
      return curr;
    }

    const now = nowIso();
    const next: TutorialPlatform = {
      id: randomUUID(),
      name,
      slug,
      createdAt: now,
      updatedAt: now
    };

    created = next;
    return {
      ...curr,
      tutorialPlatforms: [...curr.tutorialPlatforms, next]
    };
  });

  return created!;
}

export async function getAllTutorialsAdmin(): Promise<Tutorial[]> {
  const db = await readDb();
  return sortByUpdatedAtDesc(db.tutorials);
}

export async function getTutorialById(id: string): Promise<Tutorial | null> {
  const db = await readDb();
  return db.tutorials.find((t) => t.id === id) ?? null;
}

export async function createTutorial(data: TutorialInput): Promise<Tutorial> {
  let created: Tutorial | null = null;

  await mutateDb((curr) => {
    const now = nowIso();
    created = {
      id: randomUUID(),
      title: data.title,
      url: data.url,
      platformId: data.platformId,
      status: data.status,
      createdAt: now,
      updatedAt: now
    };

    return {
      ...curr,
      tutorials: [...curr.tutorials, created!]
    };
  });

  return created!;
}

export async function updateTutorial(id: string, data: TutorialInput): Promise<Tutorial | null> {
  let updated: Tutorial | null = null;

  await mutateDb((curr) => {
    const next = curr.tutorials.map((t) => {
      if (t.id !== id) return t;
      updated = {
        ...t,
        title: data.title,
        url: data.url,
        platformId: data.platformId,
        status: data.status,
        updatedAt: nowIso()
      };
      return updated!;
    });

    return {
      ...curr,
      tutorials: next
    };
  });

  return updated;
}

export async function deleteTutorial(id: string): Promise<boolean> {
  let deleted = false;

  await mutateDb((curr) => {
    const next = curr.tutorials.filter((t) => t.id !== id);
    deleted = next.length !== curr.tutorials.length;
    return {
      ...curr,
      tutorials: next
    };
  });

  return deleted;
}
