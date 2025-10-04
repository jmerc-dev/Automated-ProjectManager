import ProjectCard from "../../../components/project-card";
import {
  getProjectsByOwner,
  createProject,
} from "../../../services/firestore/projects";
import Modal from "../../../components/modal";
import { useState, useEffect } from "react";
import type { User } from "firebase/auth";
import type { Project } from "../../../types/project";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { useAuth } from "../../../services/firebase/auth-context";

export default function Projects() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [projects, setProjects] = useState<Project[] | undefined>([]);
  const [projectName, setProjectName] = useState<string>("");
  const [projectDescription, setprojectDescription] = useState<string>("");
  const navigate = useNavigate();
  // Load Projects
  useEffect(() => {
    async function load() {
      const results = await getProjectsByOwner(user?.uid);
      setProjects(results);
      console.log(results);
    }
    if (user?.uid) load();
  }, [user?.uid]);

  const handleCreateProject = () => {
    const newProject = {
      id: "",
      name: projectName,
      description: projectDescription,
      ownerID: "",
      members: [],
      progress: 0,
      status: "active",
      expectedEndDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      taskIndex: 0,
    } as Project;

    createProject(newProject, user);
    navigate("/");
  };

  return (
    <div>
      {" "}
      {/*<<<< project design template*/}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 mt-2">
        <h1 className="text-2xl font-bold text-[#0f6cbd] tracking-tight">
          My Projects
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#0f6cbd] text-white font-semibold rounded-xl px-6 py-2 shadow hover:bg-[#155a8a] transition w-full md:w-auto"
        >
          + New Project
        </button>
      </div>
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
            No projects found.
          </p>
        )}
      </div>
      <Modal
        open={isModalOpen ?? false}
        setIsOpen={setIsModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleCreateProject}
        title={"New Project"}
      >
        <form>
          <div className="flex flex-col">
            <input
              type="text"
              id="first_name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary block w-full p-2.5 m-1"
              placeholder="Project Name"
              required
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
            <textarea
              id="message"
              rows={4}
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary m-1"
              placeholder="Project Description"
              value={projectDescription}
              onChange={(e) => setprojectDescription(e.target.value)}
            ></textarea>
          </div>
        </form>
      </Modal>
    </div>
  );
}
