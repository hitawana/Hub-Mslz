const MAX_QUERY_WORDS = 5;
const MIN_SEARCH_CHARS = 5;

export function normalizeSearchQuery(value: string): string {
  const compact = String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();

  if (!compact) return "";

  return compact.split(" ").slice(0, MAX_QUERY_WORDS).join(" ");
}

export function isSearchQueryActive(query: string): boolean {
  return normalizeSearchQuery(query).length >= MIN_SEARCH_CHARS;
}
