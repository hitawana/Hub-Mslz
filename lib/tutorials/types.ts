export type TutorialStatus = "active" | "inactive";

export type TutorialPlatform = {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
};

export type Tutorial = {
  id: string;
  title: string;
  url: string;
  platformId: string;
  status: TutorialStatus;
  createdAt: string;
  updatedAt: string;
};

export type TutorialInput = Omit<Tutorial, "id" | "createdAt" | "updatedAt">;
