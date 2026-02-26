import type { Tutorial, TutorialInput, TutorialPlatform } from "@/lib/tutorials/types";

async function parseJson<T>(res: Response): Promise<T> {
  if (res.ok) return res.json();
  const body = await res.json().catch(() => ({}));
  const message = body?.error || "Falha na requisicao";
  throw new Error(message);
}

export async function fetchPublicTutorials(): Promise<Tutorial[]> {
  const res = await fetch("/api/public/tutorials", { cache: "no-store" });
  return parseJson<Tutorial[]>(res);
}

export async function fetchPublicTutorialPlatforms(): Promise<TutorialPlatform[]> {
  const res = await fetch("/api/public/tutorials/platforms", { cache: "no-store" });
  return parseJson<TutorialPlatform[]>(res);
}

export async function fetchAdminTutorials(): Promise<Tutorial[]> {
  const res = await fetch("/api/admin/tutorials", { cache: "no-store" });
  return parseJson<Tutorial[]>(res);
}

export async function fetchAdminTutorialById(id: string): Promise<Tutorial> {
  const res = await fetch(`/api/admin/tutorials/${id}`, { cache: "no-store" });
  return parseJson<Tutorial>(res);
}

export async function createAdminTutorial(payload: TutorialInput): Promise<Tutorial> {
  const res = await fetch("/api/admin/tutorials", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return parseJson<Tutorial>(res);
}

export async function updateAdminTutorial(id: string, payload: TutorialInput): Promise<Tutorial> {
  const res = await fetch(`/api/admin/tutorials/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return parseJson<Tutorial>(res);
}

export async function deleteAdminTutorial(id: string): Promise<{ ok: boolean }> {
  const res = await fetch(`/api/admin/tutorials/${id}`, { method: "DELETE" });
  return parseJson<{ ok: boolean }>(res);
}

export async function createAdminTutorialPlatform(name: string): Promise<TutorialPlatform> {
  const res = await fetch("/api/admin/tutorials/platforms", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name })
  });
  return parseJson<TutorialPlatform>(res);
}
