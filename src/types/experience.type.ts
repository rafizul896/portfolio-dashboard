export type TExperience = {
  _id: string;
  title: string;
  company: string;
  location?: string;
  from: Date;
  to?: Date;
  current?: boolean;
  description?: string;
  companyLogo?: string;
  order?: number;
  createdAt?: Date;
  updatedAt?: Date;
};
