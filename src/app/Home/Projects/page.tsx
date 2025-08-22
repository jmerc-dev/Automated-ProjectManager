import ProjectCard from "../../../components/project-card";
import Modal from "../../../components/modal";
import { useState } from "react";

export default function Projects() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>();

  return (
    <div>
      <div className="grid grid-cols-2">
        <h1 className="text-2xl font-semibold">My Projects</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-cyan-700 text-white rounded-xl w-3/5 ml-auto hover:bg-cyan-600"
        >
          New Project
        </button>
      </div>
      <div className="flex flex-row pt-5 *:m-2 flex-wrap">
        <ProjectCard />
        <ProjectCard />
        <ProjectCard />
        <ProjectCard />
        <ProjectCard />
        <ProjectCard />
        <ProjectCard />
        <ProjectCard />
      </div>
      <Modal open={isModalOpen ?? false} onClose={() => setIsModalOpen(false)}>
        asd
      </Modal>
    </div>
  );
}
