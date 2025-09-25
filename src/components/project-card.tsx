import type { Project } from "../types/project";
import DropdownMenu from "./dropdown";

interface ProjectCardProps {
  project: Project;
  onCardClick: () => void | Promise<void>;
}

export default function ProjectCard({
  project,
  onCardClick,
}: ProjectCardProps) {
  return (
    <div className="w-1/3 p-1">
      <div className="grid grid-cols-2 border-1 border-transparent rounded-md p-3 hover:border-gray-500 cursor-pointer shadow-md bg-white">
        <div>
          <div className="text-lg">{project.name}</div>
          <div className="text-sm font-extralight">
            Date Created: {project.createdAt.toLocaleDateString()}
          </div>
          <DropdownMenu />
        </div>
        <div onClick={onCardClick}></div>
      </div>
    </div>
  );
}
