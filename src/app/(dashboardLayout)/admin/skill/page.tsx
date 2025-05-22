import ManageSkills from "@/components/modules/skill";
import { getAllSkills } from "@/services/skill";
import React from "react";

const SkillPage = async () => {
  const { data } = await getAllSkills();

  return (
    <div>
      <ManageSkills skills={data} />
    </div>
  );
};

export default SkillPage;
