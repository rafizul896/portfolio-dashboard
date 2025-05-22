import ManageBlogs from "@/components/modules/blog";
import { getAllBlogs } from "@/services/blog";
import React from "react";

const BlogPage = async () => {
  const { data } = await getAllBlogs();

  return (
    <div>
      <ManageBlogs blogs={data} />
    </div>
  );
};

export default BlogPage;
