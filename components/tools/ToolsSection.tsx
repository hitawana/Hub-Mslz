import type React from "react";
import type { QuickLink } from "@/lib/content/tools";
import {
  BookOpen,
  Calendar,
  ChartColumn,
  ClipboardList,
  FolderOpen,
  PhoneCall,
  Presentation,
  Video
} from "lucide-react";

const iconMap: Record<QuickLink["icon"], React.ComponentType<{ className?: string }>> = {
  Presentation,
  PhoneCall,
  ClipboardList,
  BookOpen,
  Calendar,
  Video,
  ChartColumn,
  FolderOpen
};

function pairRows(items: QuickLink[]) {
  const rows: Array<[QuickLink, QuickLink | null]> = [];
  for (let i = 0; i < items.length; i += 2) rows.push([items[i]!, items[i + 1] ?? null]);
  return rows;
}

function ToolCell({ it }: { it: QuickLink }) {
  const Icon = iconMap[it.icon];
  const isExternal = it.href.startsWith("http");
  return (
    <a
      href={it.href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noreferrer" : undefined}
      className={
        "group relative flex items-center justify-between gap-3 px-4 py-4 md:py-5 transition-colors hover:bg-black/5 focus-visible:bg-black/5 outline-none"
      }
    >
      <span
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 h-full w-[3px] bg-accent opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
      />

      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-[rgba(255,255,255,0.6)] ring-1 ring-border flex items-center justify-center">
          <Icon className="h-4 w-4 text-accent" />
        </div>
        <div>
          <div className="card-title text-sm">{it.title}</div>
          <div className="mt-0.5 card-body text-xs leading-snug">{it.description}</div>
        </div>
      </div>

      <span
        className="text-muted transition-transform duration-200 group-hover:translate-x-1 group-focus-visible:translate-x-1 group-hover:text-accent group-focus-visible:text-accent"
        aria-hidden
      >
        &rarr;
      </span>
    </a>
  );
}

export function ToolsSection({ items }: { items: QuickLink[] }) {
  const rows = pairRows(items);
  return (
    <section id="tools" className="section-space pt-4 md:pt-5" aria-label="Tools">
      <div className="max-w-2xl mx-auto text-center">
        <h2
          className="section-title inline-flex items-center rounded-lg bg-white/40 px-2 py-0.5 backdrop-blur-[2px]"
          data-leaf-block="section-title"
        >
          Tools
        </h2>
        <p className="mt-2 section-subtitle" data-leaf-block="section-subtitle">Central de ferramentas e sistemas internos</p>
      </div>

      <div className="mt-5 surface rounded-2xl overflow-hidden">
        {rows.map(([left, right], rowIdx) => (
          <div
            key={left.title}
            className={
              "grid grid-cols-1 md:grid-cols-2" +
              (rowIdx < rows.length - 1 ? " border-b border-border" : "")
            }
          >
            <div className="md:border-r border-border">
              <ToolCell it={left} />
            </div>
            {right ? (
              <div>
                <ToolCell it={right} />
              </div>
            ) : (
              <div className="hidden md:block" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
