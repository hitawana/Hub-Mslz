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

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "app-db.json");

let initPromise: Promise<void> | null = null;

async function ensureDbFile() {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    await mkdir(DATA_DIR, { recursive: true });

    try {
      await readFile(DB_FILE, "utf-8");
      return;
    } catch {
      const adminEmail = (process.env.ADMIN_EMAIL || "admin@maplebear.com.br").trim().toLowerCase();
      const adminPassword = process.env.ADMIN_PASSWORD || "ChangeMe123!";
      const passwordHash = await hashPassword(adminPassword);

      const now = new Date().toISOString();
      const seed: DbShape = {
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

      await writeFile(DB_FILE, JSON.stringify(seed, null, 2), "utf-8");
    }
  })();

  return initPromise;
}

export async function readDb(): Promise<DbShape> {
  await ensureDbFile();
  const raw = await readFile(DB_FILE, "utf-8");
  const parsed = JSON.parse(raw) as Partial<DbShape>;
  return {
    users: parsed.users || [],
    sessions: parsed.sessions || [],
    news: parsed.news || [],
    tutorials: parsed.tutorials || [],
    tutorialPlatforms: parsed.tutorialPlatforms || []
  };
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
