import type { Project } from "../types/project";

interface TitleInputProps {
  project: Project;
  setProject: React.Dispatch<React.SetStateAction<Project | null>>;
}

export default function TitleInput({ project, setProject }: TitleInputProps) {
  return (
    <input
      type="text"
      placeholder="Project Name"
      className="font-bold outline-0 text-base h-10 border border-transparent rounded-lg p-1 hover:bg-gray-300 hover:cursor-pointer focus:hover:bg-transparent focus:hover:cursor-auto ring-1 ring-transparent focus:ring-blue-400"
      value={project?.name ?? ""}
      onChange={(e) => {
        setProject((prev) => {
          return prev
            ? ({ ...prev, name: e.target.value } as Project)
            : ({ name: e.target.value } as Project);
        });
      }}
    />
  );
}
