import type { NewsItem } from "@/lib/news/types";

export const DEFAULT_NEWS_ITEMS: NewsItem[] = [
  {
    id: 8,
    tag: "TI",
    title: "Atualizacao de infraestrutura Wi-Fi",
    image_url: "/news/news-1.png",
    content: "Melhorias de cobertura e estabilidade foram aplicadas nos blocos principais.",
    published_at: "2026-02-21T14:00:00.000Z",
    redirect_enabled: false,
    redirect_label: "",
    redirect_url: ""
  },
  {
    id: 7,
    tag: "EFAF",
    title: "Novo fluxo para chamados internos",
    image_url: "/news/news-2.png",
    content: "Chamados agora seguem triagem inicial antes do encaminhamento tecnico.",
    published_at: "2026-02-20T13:30:00.000Z",
    redirect_enabled: true,
    redirect_label: "Ver orientacoes",
    redirect_url: "https://www.maplebear.com.br/"
  },
  {
    id: 6,
    tag: "HS",
    title: "Calendario de manutencao preventiva",
    image_url: "/news/news-3.png",
    content: "Confira as janelas programadas para equipamentos de laboratorios.",
    published_at: "2026-02-18T15:00:00.000Z",
    redirect_enabled: false,
    redirect_label: "",
    redirect_url: ""
  },
  {
    id: 5,
    tag: "INFANTIL",
    title: "Disponibilidade de projetores moveis",
    image_url: "/news/news-4.png",
    content: "Projetores moveis foram redistribuidos para atender maior demanda.",
    published_at: "2026-02-16T12:00:00.000Z",
    redirect_enabled: false,
    redirect_label: "",
    redirect_url: ""
  },
  {
    id: 4,
    tag: "EFAI",
    title: "Atualizacao de acessos em salas compartilhadas",
    image_url: "/news/news-1.png",
    content: "Perfis de acesso foram revisados para melhorar seguranca e rastreio.",
    published_at: "2026-02-12T10:20:00.000Z",
    redirect_enabled: false,
    redirect_label: "",
    redirect_url: ""
  },
  {
    id: 3,
    tag: "TI",
    title: "Padrao para abertura de requisicoes",
    image_url: "/news/news-2.png",
    content: "As requisicoes devem incluir prioridade e data-alvo para atendimento.",
    published_at: "2026-02-10T11:10:00.000Z",
    redirect_enabled: false,
    redirect_label: "",
    redirect_url: ""
  },
  {
    id: 2,
    tag: "EFAF",
    title: "Guia rapido de uso do Google Meet",
    image_url: "/news/news-3.png",
    content: "Novo guia com boas praticas para reunioes e aulas hibridas.",
    published_at: "2026-02-07T09:00:00.000Z",
    redirect_enabled: true,
    redirect_label: "Abrir guia",
    redirect_url: "https://meet.google.com/"
  },
  {
    id: 1,
    tag: "HS",
    title: "Inventario de devices atualizado",
    image_url: "/news/news-4.png",
    content: "Base de inventario recebeu atualizacao de status e localizacao.",
    published_at: "2026-02-03T16:30:00.000Z",
    redirect_enabled: false,
    redirect_label: "",
    redirect_url: ""
  }
];
