import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { hashPassword } from "@/lib/server/password";
import { DEFAULT_NEWS_ITEMS } from "@/lib/news/data";
import type { NewsItem } from "@/lib/news/types";
import type { Tutorial, TutorialPlatform } from "@/lib/tutorials/types";

export type AdminUser = {
  id: number;
  email: string;
  password_hash: string;
  created_at: string;
};

export type AdminSession = {
  token: string;
  user_id: number;
  created_at: string;
  expires_at: string;
};

type DbShape = {
  users: AdminUser[];
  sessions: AdminSession[];
  news: NewsItem[];
  tutorials: Tutorial[];
  tutorialPlatforms: TutorialPlatform[];
};

const DEFAULT_TUTORIAL_PLATFORMS: TutorialPlatform[] = [
  {
    id: "classroom",
    name: "Google Classroom",
    slug: "google-classroom",
    createdAt: "2026-02-21T09:00:00.000Z",
    updatedAt: "2026-02-21T09:00:00.000Z"
  },
  {
    id: "drive",
    name: "Google Drive",
    slug: "google-drive",
    createdAt: "2026-02-21T09:00:00.000Z",
    updatedAt: "2026-02-21T09:00:00.000Z"
  },
  {
    id: "admin",
    name: "Google Admin",
    slug: "google-admin",
    createdAt: "2026-02-21T09:00:00.000Z",
    updatedAt: "2026-02-21T09:00:00.000Z"
  },
  {
    id: "chromeos",
    name: "ChromeOS",
    slug: "chromeos",
    createdAt: "2026-02-21T09:00:00.000Z",
    updatedAt: "2026-02-21T09:00:00.000Z"
  }
];

const DEFAULT_TUTORIALS: Tutorial[] = [
  {
    id: "tutorial-classroom-01",
    title: "Criar atividade com rubrica no Classroom",
    url: "https://support.google.com/edu/classroom/answer/9335069",
    platformId: "classroom",
    status: "active",
    createdAt: "2026-02-21T09:10:00.000Z",
    updatedAt: "2026-02-21T09:10:00.000Z"
  },
  {
    id: "tutorial-classroom-02",
    title: "Publicar materiais para turmas no Classroom",
    url: "https://support.google.com/edu/classroom/answer/6020293",
    platformId: "classroom",
    status: "active",
    createdAt: "2026-02-21T09:15:00.000Z",
    updatedAt: "2026-02-21T09:15:00.000Z"
  },
  {
    id: "tutorial-drive-01",
    title: "Organizar pastas compartilhadas no Drive",
    url: "https://support.google.com/drive/answer/2375091",
    platformId: "drive",
    status: "active",
    createdAt: "2026-02-21T09:20:00.000Z",
    updatedAt: "2026-02-21T09:20:00.000Z"
  },
  {
    id: "tutorial-drive-02",
    title: "Controlar permissoes de arquivos no Drive",
    url: "https://support.google.com/drive/answer/2494822",
    platformId: "drive",
    status: "active",
    createdAt: "2026-02-21T09:25:00.000Z",
    updatedAt: "2026-02-21T09:25:00.000Z"
  },
  {
    id: "tutorial-admin-01",
    title: "Gerenciar usuarios no Google Admin",
    url: "https://support.google.com/a/answer/33310",
    platformId: "admin",
    status: "active",
    createdAt: "2026-02-21T09:30:00.000Z",
    updatedAt: "2026-02-21T09:30:00.000Z"
  },
  {
    id: "tutorial-admin-02",
    title: "Aplicar politicas de seguranca no Admin",
    url: "https://support.google.com/a/answer/7587183",
    platformId: "admin",
    status: "active",
    createdAt: "2026-02-21T09:35:00.000Z",
    updatedAt: "2026-02-21T09:35:00.000Z"
  }
];

function resolveDbFilePath() {
  const configured = process.env.APP_DB_FILE?.trim();
  if (configured) {
    return path.isAbsolute(configured)
      ? configured
      : path.join(process.cwd(), configured);
  }

  if (process.env.VERCEL) {
    return path.join("/tmp", "app-db.json");
  }

  return path.join(process.cwd(), "data", "app-db.json");
}

const DB_FILE = resolveDbFilePath();
const DATA_DIR = path.dirname(DB_FILE);

let initPromise: Promise<void> | null = null;

function normalizeDbShape(parsed: Partial<DbShape>): DbShape {
  return {
    users: parsed.users || [],
    sessions: parsed.sessions || [],
    news: parsed.news || [],
    tutorials: parsed.tutorials || [],
    tutorialPlatforms: parsed.tutorialPlatforms || []
  };
}

function mergeSeedPlatforms(currentPlatforms: TutorialPlatform[]): TutorialPlatform[] {
  const known = new Map(currentPlatforms.map((platform) => [platform.id, platform]));
  const merged = [...currentPlatforms];

  for (const platform of DEFAULT_TUTORIAL_PLATFORMS) {
    if (known.has(platform.id)) continue;
    known.set(platform.id, platform);
    merged.push(platform);
  }

  return merged;
}

function withTutorialSeed(current: DbShape): { db: DbShape; changed: boolean } {
  if (current.tutorials.length > 0) {
    return { db: current, changed: false };
  }

  const nextPlatforms = mergeSeedPlatforms(current.tutorialPlatforms);
  const changed =
    current.tutorials.length !== DEFAULT_TUTORIALS.length ||
    nextPlatforms.length !== current.tutorialPlatforms.length;

  if (!changed) {
    return { db: current, changed: false };
  }

  return {
    changed: true,
    db: {
      ...current,
      tutorialPlatforms: nextPlatforms,
      tutorials: DEFAULT_TUTORIALS
    }
  };
}

async function ensureDbFile() {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    await mkdir(DATA_DIR, { recursive: true });

    try {
      const raw = await readFile(DB_FILE, "utf-8");
      const parsed = normalizeDbShape(JSON.parse(raw) as Partial<DbShape>);
      const { db: next, changed } = withTutorialSeed(parsed);
      if (changed) {
        await writeFile(DB_FILE, JSON.stringify(next, null, 2), "utf-8");
      }
      return;
    } catch {
      const adminEmail = (process.env.ADMIN_EMAIL || "admin@maplebear.com.br").trim().toLowerCase();
      const adminPassword = process.env.ADMIN_PASSWORD || "ChangeMe123!";
      const passwordHash = await hashPassword(adminPassword);

      const now = new Date().toISOString();
      const baseSeed: DbShape = {
        users: [
          {
            id: 1,
            email: adminEmail,
            password_hash: passwordHash,
            created_at: now
          }
        ],
        sessions: [],
        news: DEFAULT_NEWS_ITEMS,
        tutorials: [],
        tutorialPlatforms: []
      };

      const { db: seed } = withTutorialSeed(baseSeed);
      await writeFile(DB_FILE, JSON.stringify(seed, null, 2), "utf-8");
    }
  })();

  return initPromise;
}

export async function readDb(): Promise<DbShape> {
  await ensureDbFile();
  const raw = await readFile(DB_FILE, "utf-8");
  const parsed = JSON.parse(raw) as Partial<DbShape>;
  return normalizeDbShape(parsed);
}

export async function writeDb(next: DbShape): Promise<void> {
  await ensureDbFile();
  await writeFile(DB_FILE, JSON.stringify(next, null, 2), "utf-8");
}

export async function mutateDb(mutator: (current: DbShape) => DbShape | Promise<DbShape>) {
  const current = await readDb();
  const next = await mutator(current);
  await writeDb(next);
  return next;
}
