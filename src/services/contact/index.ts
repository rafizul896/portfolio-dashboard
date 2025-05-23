"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export const getAllContacts = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/contact`, {
      next: {
        tags: ["CONTACT"],
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

export const deleteContact = async (id: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/contact/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: (await cookies()).get("accessToken")!.value,
        },
      }
    );

    revalidateTag("CONTACT");
    return res.json();
  } catch (err) {
    return new Error(String(err));
  }
};