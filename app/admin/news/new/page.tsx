import { AdminNewsForm } from "@/components/admin/AdminNewsForm";
import { requireAdminPage } from "@/lib/server/requireAdminPage";

export default async function NewNewsPage() {
  await requireAdminPage();

  return (
    <div className="min-h-screen bg-bg">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <a href="/admin/dashboard" className="text-sm font-semibold text-text">Voltar para dashboard</a>
        <h1 className="mt-4 heading-2 font-semibold text-text">Nova noticia</h1>
        <div className="mt-6">
          <AdminNewsForm />
        </div>
      </div>
    </div>
  );
}
