export type QuickLink = {
  title: string;
  description: string;
  href: string;
  icon:
    | "Presentation"
    | "PhoneCall"
    | "ClipboardList"
    | "BookOpen"
    | "Calendar"
    | "Video"
    | "ChartColumn"
    | "FolderOpen";
};

export const tools: QuickLink[] = [
  {
    title: "Google Classroom",
    description: "Acesse suas turmas e materiais didaticos",
    href: "https://classroom.google.com/",
    icon: "Presentation"
  },
  {
    title: "Sistema Academico",
    description: "Gestao de notas, frequencias e historico",
    href: "https://www.maplebear.com.br/",
    icon: "BookOpen"
  },
  {
    title: "Chamados de TI",
    description: "Abra solicitacoes de suporte tecnico",
    href: "/#whats-new",
    icon: "PhoneCall"
  },
  {
    title: "Sistema de Reserva",
    description: "Reserve salas, equipamentos e recursos",
    href: "https://www.maplebear.com.br/",
    icon: "Calendar"
  },
  {
    title: "Requisicoes",
    description: "Solicite materiais e servicos internos",
    href: "/#whats-new",
    icon: "ClipboardList"
  },
  {
    title: "Google Meet",
    description: "Realize videoconferencias e reunioes",
    href: "https://meet.google.com/",
    icon: "Video"
  },
  {
    title: "BI Dashboard",
    description: "Visualize relatorios e indicadores",
    href: "https://www.maplebear.com.br/",
    icon: "ChartColumn"
  },
  {
    title: "Document Repository",
    description: "Acesse formularios e documentos institucionais",
    href: "https://www.maplebear.com.br/",
    icon: "FolderOpen"
  }
];
