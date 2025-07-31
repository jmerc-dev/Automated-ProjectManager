// import { ReactComponent as TaskIcon } from "../../assets/svg/task.svg";
import taskIcon from "../../assets/images/tasks.png";
import membersIcon from "../../assets/images/members.png";
import reportsIcon from "../../assets/images/reports.png";
import notifIcon from "../../assets/images/notification.png";
import helpIcon from "../../assets/images/help.png";
import { useState } from "react";

function Project() {
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
        <div className="grid [grid-template-columns:70px_auto_1fr] m-3 text-amber-50 bg-amber-400">
          <div>logo</div>
          <input
            type="text"
            className="font-semibold flex justify-center align-middle bg-blue-400"
            value="asd"
          />
          <div className="flex justify-end space-x-5 [&>div]:bg-cyan-800 [&>div]:rounded-full [&>div]:cursor-pointer [&>div]:hover:bg-cyan-700 [&>div]:p-1 [&>div>img]:w-6">
            <div>
              <img src={notifIcon} />
            </div>
            <div>
              <img src={helpIcon} />
            </div>
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
              : "flex justify-center border border-transparent"
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
              : "flex justify-center border border-transparent"
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
              : "flex justify-center border border-transparent"
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

export default Project;
