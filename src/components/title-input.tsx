import { useEffect, useState } from "react";
import type { Project } from "../types/project";
import { updateProject } from "../services/firestore/projects";

interface TitleInputProps {
  project: Project;
  setProject: React.Dispatch<React.SetStateAction<Project | null>>;
}

export default function TitleInput({ project, setProject }: TitleInputProps) {
  const [draftName, setDraftName] = useState<string>("");

  useEffect(() => {
    setDraftName(project.name);
  }, [project]);

  return (
    <input
      type="text"
      placeholder="Project Name"
      className="font-bold outline-0 text-base h-10 border border-transparent rounded-lg p-1 hover:bg-gray-300 hover:cursor-pointer focus:hover:bg-transparent focus:hover:cursor-auto ring-1 ring-transparent focus:ring-blue-400"
      value={draftName ?? ""}
      onChange={(e) => setDraftName(e.target.value)}
      onClick={() => console.log(project.name)}
      onBlur={() => {
        setProject((prev) =>
          prev
            ? ({ ...prev, name: draftName } as Project)
            : ({ name: draftName } as Project)
        );
        updateProject({ ...project, name: draftName }, "name");
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          (e.target as HTMLInputElement).blur();
        }
      }}
    />
  );
}
