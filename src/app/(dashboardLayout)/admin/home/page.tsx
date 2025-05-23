import DashboardHome from "@/components/modules/dashboard/DashboardHome";
import { getDashboardData } from "@/services/dashboard";
import React from "react";

const page = async () => {
  const { data } = await getDashboardData();
  
  return (
    <div>
      <DashboardHome data={data} />
    </div>
  );
};

export default page;
