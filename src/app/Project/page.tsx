// import { ReactComponent as TaskIcon } from "../../assets/svg/task.svg";
import taskIcon from "../../assets/images/tasks.png";
import membersIcon from "../../assets/images/members.png";
import reportsIcon from "../../assets/images/reports.png";
import { useState } from "react";

function Page() {
  const [activeTab, setActiveTab] = useState("tasks-tab");

  const renderContent = () => {
    if (activeTab === "tasks-tab") {
      return <>tasks</>;
    } else if (activeTab === "members-tab") {
      return <>members</>;
    } else if (activeTab === "reports-tab") {
      return <>reports</>;
    }
  };

  return (
    <div className="grid [grid-template-rows:auto_1fr] [grid-template-columns:70px_1fr] h-screen font-display">
      <nav className="bg-cyan-900 col-span-2">
        <div className="grid [grid-template-columns:70px_auto_1fr] m-3 text-amber-50">
          <div>logo</div>
          <h1 className="font-semibold">Project Name</h1>
          <div className="flex justify-end space-x-8">
            <div>b1</div>
            <div>b2</div>
            <div>b3</div>
          </div>
        </div>
      </nav>
      <aside
        className={
          "border-r-1 border-r-gray-400 flex flex-col text-center *:hover:bg-gray-300 *:cursor-pointer"
        }
      >
        {/* Task Tab Button */}
        <button
          className={
            activeTab === "tasks-tab"
              ? "flex justify-center border-1"
              : "flex justify-center border-transparent-1"
          }
          onClick={() => setActiveTab("tasks-tab")}
        >
          <img src={taskIcon} className="h-10 w-10 p-1 my-3" />
        </button>

        {/* Members Tab Button */}
        <button
          className={
            activeTab === "members-tab"
              ? "flex justify-center border-1"
              : "flex justify-center border-transparent-1"
          }
          onClick={() => setActiveTab("members-tab")}
        >
          <img src={membersIcon} className="h-10 w-10 p-1 my-3" />
        </button>
        {/* Reports Tab Button */}
        <button
          className={
            activeTab === "reports-tab"
              ? "flex justify-center border-1"
              : "flex justify-center border-transparent-1"
          }
          onClick={() => setActiveTab("reports-tab")}
        >
          <img src={reportsIcon} className="h-10 w-10 p-1 my-3" />
        </button>
      </aside>
      <main className="m-3">{renderContent()}</main>
    </div>
  );
}

export default Page;
