"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export const getAllProjects = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/project`, {
      next: {
        tags: ["PROJECT"],
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

export const deleteProject = async (projectId: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/project/${projectId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: (await cookies()).get("accessToken")!.value,
        },
      }
    );

    revalidateTag("PROJECT");
    return res.json();
  } catch (err) {
    return new Error(String(err));
  }
};

export const addProject = async (projectData: FormData) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/project`, {
      method: "POST",
      body: projectData,
      headers: {
        Authorization: (await cookies()).get("accessToken")!.value,
      },
    });

    revalidateTag("PROJECT");
    return res.json();
  } catch (err) {
    return new Error(String(err));
  }
};

export const updateProject = async (id: string, projectData: FormData) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/project/${id}`,
      {
        method: "PATCH",
        body: projectData,
        headers: {
          Authorization: (await cookies()).get("accessToken")!.value,
        },
      }
    );
    revalidateTag("PROJECT");
    return res.json();
  } catch (err) {
    return new Error(String(err));
  }
};
