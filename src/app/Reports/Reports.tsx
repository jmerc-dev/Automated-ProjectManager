// import React from "react";

import { doc, DocumentReference, getDoc } from "firebase/firestore";
import { getProjectById } from "../../services/firestore/projects";
import {
  getCriticalPath,
  getCriticalTasks,
  getProjectEnd,
  getProjectStart,
} from "../../services/firestore/tasks";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import React, { useEffect, useState } from "react";
// import { CriticalPath } from "@syncfusion/ej2-gantt/src/gantt/actions/critical-path";

// import handleGetCriticalTasks from "../Project/Tasks/page";
// import Task from "../../components/task";
// import { getProjectById } from "../../services/firestore/projects";
// import TasksView  from "../Project/Tasks/page";
// import type { Gantt } from "@syncfusion/ej2-react-gantt";
// import GanttChart from "../../components/gantt-chart";

// interface Task {
//   id: string;
//   name: string;
//   startDate: string;
//   endDate: string;
//   isCritical: boolean;
// }

const ProgressBar: React.FC<{ value: number }> = ({ value }) => (
  <div className="w-full bg-gray-200 rounded-full h-2">
    <div
      className="bg-blue-500 h-2 rounded-full"
      style={{ width: `${value}%` }}
    ></div>
  </div>
);

interface ReportsManagementProps {
  projectId: string;
  //   tasks: Task[];
}

export default function Reports({ projectId }: ReportsManagementProps) {
  const [getCriticalTasks, setCriticalTasks] = useState(0);
  const [get_ProjectStart, setProjectStart] = useState<Date>();
  const [get_ProjectEnd, setProjectEnd] = useState<Date>();

  useEffect(() => {
    // Subscribe to Firestore updates
    const unsubscribe = getCriticalPath(projectId, (tasks) => {
      setCriticalTasks(tasks);
      console.log("Live critical tasks:", tasks);
    });
    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [projectId]);

  useEffect(() => {
    const unsubProjectStart = getProjectStart(projectId, (startDate) => {
      setProjectStart(startDate);
      console.log("Live project start date:", startDate);
    });

    return () => unsubProjectStart();
  }, [projectId]);

  useEffect(() => {
    const unsubProjectEnd = getProjectEnd(projectId, (startDate) => {
      setProjectEnd(startDate);
      console.log("Live project start date:", startDate);
    });

    return () => unsubProjectEnd();
  }, [projectId]);

  // export default function Reports() {
  //  const criticalPath = new CriticalPath();
  //  const criticalTasks = criticalPath.getCriticalTasks();

  //  console.log("Critical Tasks:", TasksView);
  // console.log(Task.toString());

  const kpis = [
    { title: "Overall Progress", value: 82, unit: "%" },
    { title: "Completed Tasks", value: 46, unit: "of 56" },
    { title: "Active Tasks", value: 7, unit: "in progress" },
    { title: "Critical Path Length", value: getCriticalTasks, unit: "days" },
  ];

  const milestoneData = [
    { name: "Planning", date: "Sep 25, 2025", progress: 100 },
    { name: "Design", date: "Oct 15, 2025", progress: 100 },
    { name: "Development", date: "Oct 28, 2025", progress: 70 },
    { name: "Testing", date: "Nov 10, 2025", progress: 45 },
    { name: "Deployment", date: "Nov 20, 2025", progress: 0 },
  ];

  const chartData = [
    { name: "Week 1", tasks: 8 },
    { name: "Week 2", tasks: 10 },
    { name: "Week 3", tasks: 13 },
    { name: "Week 4", tasks: 9 },
    { name: "Week 5", tasks: 6 },
  ];

  return (
    <div className="w-full px-8 py-6 space-y-8 bg-white rounded-2xl shadow-lg border border-gray-100">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#0f6cbd] mb-1 tracking-tight">
          Project Reports
        </h2>
        <p className="text-gray-500 mb-4">Detailed report for your project:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-gradient-to-r from-[#e6f0fa] via-white to-[#f7fafd] rounded-xl p-4 border border-[#b3d1f7]">
          <div>
            <span className="text-sm text-gray-500">Project Name</span>
            <div className="font-bold text-[#0f6cbd] text-lg">
              Example Project
            </div>
          </div>
          <div>
            <span className="text-sm text-gray-500">Start Date</span>
            <div className="font-bold text-gray-700 text-lg">
              {get_ProjectStart?.toLocaleDateString()}
            </div>
          </div>
          <div>
            <span className="text-sm text-gray-500">End Date</span>
            <div className="font-bold text-gray-700 text-lg">
              {get_ProjectEnd?.toLocaleDateString()}
            </div>
          </div>
          <div>
            <span className="text-sm text-gray-500">Status</span>
            <div className="font-bold text-green-600 text-lg">On Track</div>
          </div>
          <div>
            <span className="text-sm text-gray-500">Tasks Completed</span>
            <div className="font-bold text-blue-600 text-lg">75%</div>
          </div>
        </div>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-[#e6f0fa] to-white rounded-xl shadow border border-[#b3d1f7] p-5 flex flex-col items-start"
          >
            <span className="text-xs text-gray-500 mb-1 font-medium tracking-wide">
              {kpi.title}
            </span>
            <span className="text-3xl font-bold text-[#0f6cbd] mb-2">
              {kpi.value}
              <span className="text-base text-gray-500 ml-1">{kpi.unit}</span>
            </span>
            {kpi.title === "Overall Progress" && (
              <ProgressBar value={kpi.value} />
            )}
          </div>
        ))}
      </div>

      {/* Task Completion Trend Chart */}
      <div className="bg-gradient-to-br from-[#e6f0fa] to-white rounded-xl shadow border border-[#b3d1f7] p-6">
        <h3 className="text-lg font-bold text-[#0f6cbd] mb-4">
          Task Completion Trend
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="tasks" fill="#0f6cbd" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Milestone Summary */}
      <div className="bg-gradient-to-br from-[#e6f0fa] to-white rounded-xl shadow border border-[#b3d1f7] p-6">
        <h3 className="text-lg font-bold text-[#0f6cbd] mb-4">
          Project Milestones Summary
        </h3>
        <div className="space-y-4">
          {milestoneData.map((milestone, index) => (
            <div key={index} className="border-b border-gray-200 pb-3">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-gray-700">
                  {milestone.name}
                </span>
                <span className="text-xs text-gray-500">{milestone.date}</span>
              </div>
              <ProgressBar value={milestone.progress} />
              <span className="text-xs text-gray-500 mt-1 block">
                {milestone.progress}% complete
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// export default Reports;
