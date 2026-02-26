import type { NewsTag } from "@/lib/news/types";

const tagClass: Record<NewsTag, string> = {
  HS: "bg-[rgb(var(--accent))]/10 text-accent",
  EFAF: "bg-black/5 text-text",
  EFAI: "bg-black/5 text-text",
  INFANTIL: "bg-[rgb(var(--mustard))]/20 text-text",
  TI: "bg-[rgb(var(--accent2))]/10 text-accent2"
};

export function TagBadge({ tag }: { tag: NewsTag }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${tagClass[tag]}`}>
      {tag}
    </span>
  );
}
