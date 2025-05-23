import ManageProjects from "@/components/modules/project";
import { getAllProjects } from "@/services/project";
import React from "react";

const ProjectPage = async () => {
  const { data } = await getAllProjects();

  return (
    <div>
      <ManageProjects projects={data} />
    </div>
  );
};

export default ProjectPage;
