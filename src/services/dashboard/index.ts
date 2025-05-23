"use server";

import { cookies } from "next/headers";

export const getDashboardData = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/dashboard-info`,
      {
        headers: {
          Authorization: (await cookies()).get("accessToken")!.value,
        },
      }
    );
    const data = await res.json();
    return data;
  } catch (err) {
    return new Error(String(err));
  }
};
