import { Navbar } from "@/components/header/Navbar";
import { HeroSection } from "@/components/hero/HeroSection";
import { WhatsNewSection } from "@/components/news/WhatsNewSection";
import { ToolsSection } from "@/components/tools/ToolsSection";
import { TutorialsSection } from "@/components/tutorials/TutorialsSection";
import { tools } from "@/lib/content/tools";
import { isSearchQueryActive, normalizeSearchQuery } from "@/lib/search/query";
import { searchContent } from "@/lib/server/search";
import { getAllPlatforms, getPublicTutorials } from "@/lib/server/tutorials";

type SearchParamsShape = {
  q?: string | string[];
};

type HomePageProps = {
  searchParams?: Promise<SearchParamsShape>;
};

function readRawQuery(searchParams: SearchParamsShape | undefined): string {
  const raw = searchParams?.q;
  if (Array.isArray(raw)) return raw[0] ?? "";
  if (typeof raw === "string") return raw;
  return "";
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const query = normalizeSearchQuery(readRawQuery(resolvedSearchParams));
  const hasActiveQuery = isSearchQueryActive(query);

  const [tutorials, platforms, searchResults] = await Promise.all([
    getPublicTutorials(),
    getAllPlatforms(),
    hasActiveQuery ? searchContent(query) : Promise.resolve(null)
  ]);

  const tutorialsToRender = searchResults ? searchResults.tutorials : tutorials;
  const newsToRender = searchResults ? searchResults.news : undefined;

  return (
    <div>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 pb-24 md:pb-10">
        <HeroSection initialQuery={query} searchResults={searchResults} platforms={platforms} />
        <ToolsSection items={tools} />
        <WhatsNewSection initialItems={newsToRender} />
        <TutorialsSection tutorials={tutorialsToRender} platforms={platforms} />
      </main>
    </div>
  );
}
