import ManageExperience from "@/components/modules/experience";
import { getAllExperience } from "@/services/experience";
import React from "react";

const ExperiencePage = async () => {
  const { data } = await getAllExperience();

  return (
    <div>
      <ManageExperience experiences={data} />
    </div>
  );
};

export default ExperiencePage;
