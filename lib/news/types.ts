export type NewsTag = "HS" | "EFAF" | "EFAI" | "INFANTIL" | "TI";

export type NewsItem = {
  id: number;
  tag: NewsTag;
  title: string;
  image_url: string;
  content: string;
  published_at: string;
  redirect_enabled: boolean;
  redirect_label: string;
  redirect_url: string;
};

export type NewsInput = Omit<NewsItem, "id">;

export type PublicNewsPage = {
  featured: NewsItem | null;
  page: number;
  pages: number;
  items: NewsItem[];
};

export type AdminMe = {
  id: number;
  email: string;
};
