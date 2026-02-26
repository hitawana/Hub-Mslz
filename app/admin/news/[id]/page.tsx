import { notFound } from "next/navigation";
import { AdminNewsForm } from "@/components/admin/AdminNewsForm";
import { getNewsById } from "@/lib/server/news";
import { requireAdminPage } from "@/lib/server/requireAdminPage";

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminPage();

  const { id } = await params;
  const numericId = Number(id);
  const item = await getNewsById(numericId);

  if (!item) notFound();

  return (
    <div className="min-h-screen bg-bg">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <a href="/admin/dashboard" className="text-sm font-semibold text-text">Voltar para dashboard</a>
        <h1 className="mt-4 heading-2 font-semibold text-text">Editar noticia</h1>
        <div className="mt-6">
          <AdminNewsForm initial={item} />
        </div>
      </div>
    </div>
  );
}
