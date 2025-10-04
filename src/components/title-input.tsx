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
      className="font-bold text-base w-auto h-11 px-4 py-2 rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-[#0f6cbd] focus:ring-2 focus:ring-[#0f6cbd]/20 transition placeholder:text-gray-400 hover:bg-gray-100 hover:cursor-pointer focus:cursor-text"
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
