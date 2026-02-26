import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getUserBySessionToken } from "@/lib/server/auth";
import { ADMIN_COOKIE } from "@/lib/auth/constants";

export async function requireAdminPage() {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  const user = await getUserBySessionToken(token);

  if (!user) redirect("/admin/login");
  return user;
}
