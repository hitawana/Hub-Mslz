import type { Tutorial, TutorialPlatform } from "@/lib/tutorials/types";

export const DEFAULT_TUTORIAL_PLATFORMS: TutorialPlatform[] = [
  {
    id: "5d02e3f6-d8de-4878-9206-54b74143af93",
    name: "Toodle",
    slug: "toodle",
    createdAt: "2026-02-26T12:00:00.000Z",
    updatedAt: "2026-02-26T12:00:00.000Z"
  }
];

export const DEFAULT_TUTORIALS: Tutorial[] = [
  {
    id: "tutorial-toodle-01",
    title: "Painel docente",
    url: "https://example.com/tutorial-painel-docente",
    platformId: "5d02e3f6-d8de-4878-9206-54b74143af93",
    status: "active",
    createdAt: "2026-02-26T12:00:00.000Z",
    updatedAt: "2026-02-26T12:00:00.000Z"
  },
  {
    id: "tutorial-toodle-02",
    title: "Chamados TI",
    url: "https://example.com/tutorial-chamados-ti",
    platformId: "5d02e3f6-d8de-4878-9206-54b74143af93",
    status: "active",
    createdAt: "2026-02-26T12:05:00.000Z",
    updatedAt: "2026-02-26T12:05:00.000Z"
  },
  {
    id: "tutorial-toodle-03",
    title: "Google Meet",
    url: "https://meet.google.com/",
    platformId: "5d02e3f6-d8de-4878-9206-54b74143af93",
    status: "active",
    createdAt: "2026-02-26T12:10:00.000Z",
    updatedAt: "2026-02-26T12:10:00.000Z"
  },
  {
    id: "tutorial-toodle-04",
    title: "Google Classroom",
    url: "https://classroom.google.com/",
    platformId: "5d02e3f6-d8de-4878-9206-54b74143af93",
    status: "active",
    createdAt: "2026-02-26T12:15:00.000Z",
    updatedAt: "2026-02-26T12:15:00.000Z"
  }
];
