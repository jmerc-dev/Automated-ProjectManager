import ProjectCard from "../../../components/project-card";
import {
  getProjectsByOwner,
  createProject,
  onProjectsByMemberEmailSnapshot,
  onProjectByOwnerSnapshot,
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
import OwnedProjects from "./Owned/page";
import AssociatedProjects from "./Associated/page";

export default function Projects() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [projects, setProjects] = useState<Project[] | undefined>([]);
  const [projectName, setProjectName] = useState<string>("");
  const [projectDescription, setprojectDescription] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"owned" | "associated">("owned");
  const [associatedProjects, setAssociatedProjects] = useState<Project[]>([]);
  const navigate = useNavigate();
  // Load Projects
  useEffect(() => {
    async function load() {
      const results = await getProjectsByOwner(user?.uid);
      setProjects(results);
    }

    if (user?.uid) load();

    const unsubscribeProjectsByOwner = onProjectByOwnerSnapshot(
      user?.uid,
      setProjects
    );
    const unsubscribeProjectsbyMemberEmail = onProjectsByMemberEmailSnapshot(
      user?.email ?? "",
      setAssociatedProjects
    );

    return () => {
      unsubscribeProjectsbyMemberEmail();
      //unsubscribeProjectsByOwner();
    };
  }, [user?.uid, user?.email]);

  useEffect(() => {
    console.log("Associated Projects:", associatedProjects);
  }, [associatedProjects]);

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
      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          className={`px-4 py-2 rounded-xl font-semibold text-sm transition ${
            activeTab === "owned"
              ? "bg-[#e6f0fa] text-[#0f6cbd] border border-[#b3d1f7]"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-[#f7fafd]"
          }`}
          onClick={() => setActiveTab("owned")}
        >
          Owned
        </button>
        <button
          className={`px-4 py-2 rounded-xl font-semibold text-sm transition ${
            activeTab === "associated"
              ? "bg-[#e6f0fa] text-[#0f6cbd] border border-[#b3d1f7]"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-[#f7fafd]"
          }`}
          onClick={() => setActiveTab("associated")}
        >
          Associated
        </button>
      </div>
      <div>
        {activeTab === "owned" ? (
          <OwnedProjects projects={projects ?? []} />
        ) : (
          <AssociatedProjects projectsAssociated={associatedProjects ?? []} />
        )}
      </div>
      <Modal
        open={isModalOpen ?? false}
        setIsOpen={setIsModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleCreateProject}
        title={"New Project"}
        isViewOnly={false}
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
