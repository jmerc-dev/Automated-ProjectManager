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
    <div className="h-full">
      <div
        className="group flex flex-col justify-between h-full w-full border border-gray-200 bg-white rounded-2xl px-7 py-6 transition-all duration-150 cursor-pointer hover:border-[#0f6cbd] hover:bg-[#f7fafd] focus-within:border-[#0f6cbd]"
        tabIndex={0}
        onClick={onCardClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onCardClick();
        }}
        role="button"
        aria-label={`Open project ${project.name}`}
      >
        <div className="flex flex-col gap-2 flex-1">
          <div className="text-lg font-semibold text-gray-900 truncate group-hover:text-[#0f6cbd]">
            {project.name}
          </div>
          <div className="text-xs text-gray-500 mb-2">
            Created: {project.createdAt.toLocaleDateString()}
          </div>
        </div>
        <div
          className="flex justify-end mt-2"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <DropdownMenu />
        </div>
      </div>
    </div>
  );
}
