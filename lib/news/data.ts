import type { NewsItem } from "@/lib/news/types";

export const DEFAULT_NEWS_ITEMS: NewsItem[] = [
  {
    id: 6,
    tag: "TI",
    title: "Atualização do portal institucional",
    image_url: "/news/news-1.png",
    content: "Comunicado técnico sobre ajustes recentes no ambiente digital institucional.",
    published_at: "2026-02-26T09:00:00.000Z",
    redirect_enabled: false,
    redirect_label: "",
    redirect_url: ""
  },
  {
    id: 5,
    tag: "EFAF",
    title: "Cronograma de suporte pedagógico",
    image_url: "/news/news-2.png",
    content: "Atualização de calendário para atendimentos e suporte em atividades pedagógicas.",
    published_at: "2026-02-25T14:30:00.000Z",
    redirect_enabled: false,
    redirect_label: "",
    redirect_url: ""
  },
  {
    id: 4,
    tag: "EFAI",
    title: "Novas orientações para laboratório",
    image_url: "/news/news-3.png",
    content: "Orientações práticas para uso seguro e organizado dos laboratórios da escola.",
    published_at: "2026-02-24T11:15:00.000Z",
    redirect_enabled: false,
    redirect_label: "",
    redirect_url: ""
  },
  {
    id: 3,
    tag: "HS",
    title: "Melhorias em conectividade de salas",
    image_url: "/news/news-4.png",
    content: "Foram aplicadas melhorias de estabilidade e cobertura nas salas de uso intensivo.",
    published_at: "2026-02-23T08:45:00.000Z",
    redirect_enabled: false,
    redirect_label: "",
    redirect_url: ""
  },
  {
    id: 2,
    tag: "INFANTIL",
    title: "Atualização de recursos multimídia",
    image_url: "/news/news-1.png",
    content: "Novos recursos de apoio audiovisual foram disponibilizados para uso em sala.",
    published_at: "2026-02-22T16:05:00.000Z",
    redirect_enabled: false,
    redirect_label: "",
    redirect_url: ""
  },
  {
    id: 1,
    tag: "TI",
    title: "Boletim semanal de infraestrutura",
    image_url: "/news/news-2.png",
    content: "Resumo semanal das ações técnicas e indicadores de infraestrutura institucional.",
    published_at: "2026-02-21T10:20:00.000Z",
    redirect_enabled: true,
    redirect_label: "Ler boletim",
    redirect_url: "https://example.com/boletim-ti"
  }
];
