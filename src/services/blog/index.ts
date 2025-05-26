"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export const getAllBlogs = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/blog`, {
      next: {
        tags: ["BLOG"],
      },
      headers: {
        Authorization: (await cookies()).get("accessToken")!.value,
      },
    });
    const data = await res.json();
    return data;
  } catch (err) {
    return new Error(String(err));
  }
};

export const getBlogById = async (id:string) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/blog/${id}`, {
      next: {
        tags: ["BLOG"],
      },
      headers: {
        Authorization: (await cookies()).get("accessToken")!.value,
      },
    });
    const data = await res.json();
    return data;
  } catch (err) {
    return new Error(String(err));
  }
};

export const deleteBlog = async (blogId: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/blog/${blogId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: (await cookies()).get("accessToken")!.value,
        },
      }
    );

    revalidateTag("BLOG");
    return res.json();
  } catch (err) {
    return new Error(String(err));
  }
};

export const addBlog = async (blogData: FormData) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/blog`, {
      method: "POST",
      body: blogData,
      headers: {
        Authorization: (await cookies()).get("accessToken")!.value,
      },
    });

    revalidateTag("BLOG");
    return res.json();
  } catch (err) {
    return new Error(String(err));
  }
};

export const updateBlog = async (id: string, blogData: FormData) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/blog/${id}`, {
      method: "PATCH",
      body: blogData,
      headers: {
        Authorization: (await cookies()).get("accessToken")!.value,
      },
    });
    revalidateTag("BLOG");
    return res.json();
  } catch (err) {
    return new Error(String(err));
  }
};
