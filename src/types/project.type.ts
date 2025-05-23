export type TProject = {
  _id: string;
  title: string;
  description: string;
  liveUrl?: string;
  githubRepoUrl: {
    frontend?: string;
    backend?: string;
  };
  features: string[];
  improvements?: string[];
  challenges?: string[];
  technologies: string[];
  category?: string;
  thumbnail?: string;
  order?: number;
  createdAt: Date;
  updatedAt: Date;
};
