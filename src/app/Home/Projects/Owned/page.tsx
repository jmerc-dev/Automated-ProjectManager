import type { Project } from "../../../../types/project";
import { useNavigate } from "react-router-dom";
import ProjectCard from "../../../../components/project-card";

interface OwnedProjectsProps {
  projects: Project[];
}

export default function OwnedProjects({ projects }: OwnedProjectsProps) {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {/*<<<<< for each project renderer */}
      {projects != undefined && projects?.length > 0 ? (
        projects?.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onCardClick={() => navigate(`/project/${project.id}`)}
          />
        ))
      ) : (
        <p className="col-span-full text-center text-gray-400 py-10">
          Haven't you started any projects yet?
        </p>
      )}
    </div>
  );
}
