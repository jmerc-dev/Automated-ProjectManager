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

export interface ProjectsProps {
  user: User | null;
}

export default function Projects({ user }: ProjectsProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>();
  const [projects, setProjects] = useState<Project[] | undefined>([]);
  const [projectName, setProjectName] = useState<string>("");
  const [projectDescription, setprojectDescription] = useState<string>("");
  const [projectStartDate, setprojectStartDate] = useState<string>("");

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
      name: projectName,
      description: projectDescription,
      ownerID: "",
      members: [],
      progress: 0,
      status: "active",
      startDate: new Date(projectStartDate),
      expectedEndDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Project;

    console.log(newProject);

    createProject(newProject);
  };

  const navigate = useNavigate();

  return (
    <div>
      {" "}
      {/*<<<< project design template*/}
      <div className="grid grid-cols-2">
        <h1 className="text-2xl font-semibold">My Projects</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-cyan-700 text-white rounded-xl w-3/5 ml-auto hover:bg-cyan-600"
        >
          New Project
        </button>
      </div>
      <div className="flex flex-row pt-5 flex-wrap">
        {" "}
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
          <p>No projects found.</p>
        )}
      </div>
      <Modal
        open={isModalOpen ?? false}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleCreateProject}
        title={"New Project"}
      >
        <form>
          <div className="flex flex-col">
            <input
              type="text"
              id="first_name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5 m-1"
              placeholder="Project Name"
              required
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
            <textarea
              id="message"
              rows={4}
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-cyan-600 focus:border-cyan-600 m-1"
              placeholder="Project Description"
              value={projectDescription}
              onChange={(e) => setprojectDescription(e.target.value)}
            ></textarea>
            <div className="m-1 w-full">
              <label>Start Date</label>
              <input
                className="p-2.5 w-55"
                type="datetime-local"
                value={projectStartDate}
                onChange={(e) => setprojectStartDate(e.target.value)}
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
