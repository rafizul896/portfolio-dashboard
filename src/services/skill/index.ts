"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

// get all skills
export const getAllSkills = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/skill`, {
      next: {
        tags: ["SKILL"],
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

// delete skil
export const deleteSkill = async (skillId: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/skill/${skillId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: (await cookies()).get("accessToken")!.value,
        },
      }
    );

    revalidateTag("SKILL");
    return res.json();
  } catch (err) {
    return new Error(String(err));
  }
};

// add skill
export const addSkill = async (skillData: FormData) => {
  console.log(skillData);
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/skill`, {
      method: "POST",
      body: skillData,
      headers: {
        Authorization: (await cookies()).get("accessToken")!.value,
      },
    });

    revalidateTag("SKILL");
    return res.json();
  } catch (err) {
    return new Error(String(err));
  }
};

// update skill
export const updateSkill = async (id: string, skillData: FormData) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/skill/${id}`, {
      method: "PATCH",
      body: skillData,
      headers: {
        Authorization: (await cookies()).get("accessToken")!.value,
      },
    });
    revalidateTag("SKILL");
    return res.json();
  } catch (err) {
    return new Error(String(err));
  }
};
