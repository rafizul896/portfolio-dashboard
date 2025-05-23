"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export const getAllExperience = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/experience`, {
      next: {
        tags: ["EXPERIENCE"],
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

export const deleteExperience = async (id: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/experience/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: (await cookies()).get("accessToken")!.value,
        },
      }
    );

    revalidateTag("EXPERIENCE");
    return res.json();
  } catch (err) {
    return new Error(String(err));
  }
};

export const addExperience = async (experienceData: FormData) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/experience`, {
      method: "POST",
      body: experienceData,
      headers: {
        Authorization: (await cookies()).get("accessToken")!.value,
      },
    });

    revalidateTag("EXPERIENCE");
    return res.json();
  } catch (err) {
    return new Error(String(err));
  }
};

export const updateExperience = async (
  id: string,
  experienceData: FormData
) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/experience/${id}`,
      {
        method: "PATCH",
        body: experienceData,
        headers: {
          Authorization: (await cookies()).get("accessToken")!.value,
        },
      }
    );
    revalidateTag("EXPERIENCE");
    return res.json();
  } catch (err) {
    return new Error(String(err));
  }
};
