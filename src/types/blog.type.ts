export type TBlog = {
  _id: string;
  title: string;
  slug: string;
  content: string;
  thumbnail: string;
  author: string;
  category: string;
  tags: string[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
};
