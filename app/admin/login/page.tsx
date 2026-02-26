import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { getUserBySessionToken } from "@/lib/server/auth";
import { ADMIN_COOKIE } from "@/lib/auth/constants";

export default async function AdminLoginPage() {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  const user = await getUserBySessionToken(token);
  if (user) redirect("/admin/dashboard");

  return (
    <div className="min-h-screen bg-bg">
      <div className="mx-auto flex max-w-md flex-col px-6 py-14">
        <a href="/" className="text-sm font-semibold text-text">Voltar ao portal</a>

        <h1 className="mt-8 heading-2 font-semibold text-text">Area Administrativa</h1>
        <p className="mt-1 text-body text-muted">Acesso restrito para gerenciamento de noticias.</p>

        <AdminLoginForm />
      </div>
    </div>
  );
}
