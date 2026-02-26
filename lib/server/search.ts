import { tools } from "@/lib/content/tools";
import type { NewsItem } from "@/lib/news/types";
import { isSearchQueryActive, normalizeSearchQuery } from "@/lib/search/query";
import { listAllNews } from "@/lib/server/news";
import { getAllPlatforms, getPublicTutorials } from "@/lib/server/tutorials";
import type { Tutorial } from "@/lib/tutorials/types";

export type SearchToolResult = {
  title: string;
  description: string;
  href: string;
};

export type SearchContentResult = {
  news: NewsItem[];
  tools: SearchToolResult[];
  tutorials: Tutorial[];
};

function includesQuery(fields: Array<string | undefined>, queryLower: string): boolean {
  const haystack = fields
    .map((field) => String(field ?? "").trim())
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(queryLower);
}

export async function searchContent(query: string): Promise<SearchContentResult> {
  const normalized = normalizeSearchQuery(query);
  if (!isSearchQueryActive(normalized)) {
    return { news: [], tools: [], tutorials: [] };
  }

  const queryLower = normalized.toLowerCase();

  const [news, tutorials, platforms] = await Promise.all([
    listAllNews(),
    getPublicTutorials(),
    getAllPlatforms()
  ]);

  const platformById = new Map(platforms.map((platform) => [platform.id, platform]));

  const newsMatches = news.filter((item) =>
    includesQuery([item.title, item.content, item.tag], queryLower)
  );

  const tutorialMatches = tutorials.filter((item) => {
    const platform = platformById.get(item.platformId);
    return includesQuery([item.title, platform?.name, platform?.slug], queryLower);
  });

  const toolMatches = tools.filter((item) =>
    includesQuery([item.title, item.description], queryLower)
  );

  return {
    news: newsMatches,
    tools: toolMatches,
    tutorials: tutorialMatches
  };
}
