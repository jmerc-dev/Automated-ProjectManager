import taskIcon from "../../assets/images/tasks.png";
import membersIcon from "../../assets/images/members.png";
import reportsIcon from "../../assets/images/reports.png";
import notifIcon from "../../assets/images/notification.png";
import helpIcon from "../../assets/images/help.png";
import TasksView from "./Tasks/page";
import homeIcon from "../../assets/images/home.png";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Project } from "../../types/project";
import { useAuth } from "../../services/firebase/auth-context";
import NavDropdown from "../../components/nav-dropdown";
import { getProjectById } from "../../services/firestore/projects";
import TitleInput from "../../components/title-input";

function Project() {
  const [activeTab, setActiveTab] = useState("tasks-tab");
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);

  const handleHomeClick = () => {
    navigate("/home");
  };

  useEffect(() => {
    async function loadProject(id: string) {
      const result = await getProjectById(id);
      setProject(result ?? null);
    }
    loadProject(String(id));
  }, [id]);

  const renderContent = () => {
    if (activeTab === "tasks-tab") {
      return <TasksView />;
    } else if (activeTab === "members-tab") {
      return <>members</>;
    } else if (activeTab === "reports-tab") {
      return <>reports</>;
    }
  };

  return (
    <div className="grid bg-white [grid-template-rows:auto_1fr] overflow-hidden [grid-template-columns:50px_1fr] h-screen font-display">
      <nav className=" col-span-2">
        <div className="grid [grid-template-columns:50px_1fr_auto]  text-black">
          <div className="bg-white border-r-1 border-gray-400">
            <button className="hover:bg-gray-300" onClick={handleHomeClick}>
              <img src={homeIcon} className="p-3" />
            </button>
          </div>
          <div className="font-semibold flex align-middle pl-2">
            <div className="text-sm mt-auto mb-auto font-bold text-cyan-600">
              <div>AutoProject</div>
            </div>
            <div className="w-full flex align-middle mt-auto mb-auto ml-[100px]">
              {project ? (
                <TitleInput project={project} setProject={setProject} />
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </div>
          <div className="flex justify-end space-x-5 m-3 [&>div]:bg-transparent [&>div]:hover:bg-gray-300  [&>div]:rounded-full [&>div]:cursor-pointer [&>div]:p-1 [&>div>img]:w-6">
            <div>
              <img src={notifIcon} />
            </div>
            <div>
              <img src={helpIcon} />
            </div>
            <NavDropdown
              actions={{
                Logout: () => {
                  logout();
                  navigate("/");
                },
              }}
            >
              <img src={user?.photoURL || ""} className="rounded-xl h-6" />
            </NavDropdown>
          </div>
        </div>
      </nav>
      <aside
        className={
          "border-r-1 h-full border-r-gray-400 flex flex-col bg-white text-center *:hover:bg-gray-300 *:cursor-pointer"
        }
      >
        {/* Task Tab Button */}
        <button
          className={
            activeTab === "tasks-tab"
              ? "flex justify-center border-1"
              : "flex justify-center border border-transparent"
          }
          onClick={() => setActiveTab("tasks-tab")}
        >
          <img src={taskIcon} className="h-8 w-8 p-1 my-2" />
        </button>

        {/* Members Tab Button */}
        <button
          className={
            activeTab === "members-tab"
              ? "flex justify-center border-1"
              : "flex justify-center border border-transparent"
          }
          onClick={() => setActiveTab("members-tab")}
        >
          <img src={membersIcon} className="h-8 w-8 p-1 my-2" />
        </button>
        {/* Reports Tab Button */}
        <button
          className={
            activeTab === "reports-tab"
              ? "flex justify-center border-1"
              : "flex justify-center border border-transparent"
          }
          onClick={() => setActiveTab("reports-tab")}
        >
          <img src={reportsIcon} className="h-8 w-8 p-1 my-2" />
        </button>
      </aside>
      <main className="p-3 border-1 border-gray-200">{renderContent()}</main>
    </div>
  );
}

export default Project;
