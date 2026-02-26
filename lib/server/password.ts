import { randomBytes, scrypt as _scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scrypt = promisify(_scrypt);

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scrypt(password, salt, 64)) as Buffer;
  return `${salt}:${buf.toString("hex")}`;
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const [salt, stored] = hash.split(":");
  if (!salt || !stored) return false;

  const derived = (await scrypt(password, salt, 64)) as Buffer;
  const storedBuf = Buffer.from(stored, "hex");

  if (derived.length !== storedBuf.length) return false;
  return timingSafeEqual(derived, storedBuf);
}
