"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminLogin } from "@/lib/news/api";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await adminLogin(email, password);
      router.push("/admin/dashboard");
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Falha ao realizar login.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="mt-8 surface rounded-2xl p-6">
      <label className="text-sm font-medium text-text">E-mail</label>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none"
        placeholder="admin@maplebear.com.br"
      />

      <label className="mt-5 block text-sm font-medium text-text">Senha</label>
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none"
        placeholder="********"
      />

      {error ? <div className="mt-4 text-sm text-accent">{error}</div> : null}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        {loading ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
