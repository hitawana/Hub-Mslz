import { notFound } from "next/navigation";
import { getPublicNewsById } from "@/lib/news/service";
import { TagBadge } from "@/components/news/TagBadge";
import { formatPtBrDateStable } from "@/lib/format/date";

export default async function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numericId = Number(id);
  const item = await getPublicNewsById(numericId);

  if (!item) notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <a href="/#whats-new" className="text-sm font-semibold text-text">Voltar</a>
      <div className="mt-6 surface rounded-2xl p-6">
        <div className="flex items-center gap-3">
          <TagBadge tag={item.tag} />
          <span className="text-xs text-muted">{formatPtBrDateStable(item.published_at)}</span>
        </div>
        <h1 className="mt-4 font-title heading-2 font-black text-text">{item.title}</h1>
        <p className="mt-4 whitespace-pre-wrap text-body text-muted">{item.content}</p>
      </div>
    </main>
  );
}
