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
    // getCriticalPath(projectId),
    <div
      className="w-full p-6 space-y-8"
      style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}
    >
      <h2>Project Reports</h2>
      <p>Here is the detailed report for the project:</p>
      <ul>
        <li>
          <strong>Project Name:</strong> Example Project
        </li>
        <li>
          <strong>Start Date:</strong> {get_ProjectStart?.toLocaleDateString()}
        </li>
        <li>
          <strong>End Date:</strong> {get_ProjectEnd?.toLocaleDateString()}
        </li>
        <li>
          <strong>Status:</strong> On Track
        </li>
        <li>
          <strong>Tasks Completed:</strong> 75%
        </li>
      </ul>
      {/* </div>, */}

      <div className="w-full p-6 space-y-8">
        {/* KPI Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-4">
              <p className="text-sm text-gray-500">{kpi.title}</p>
              <p className="text-2xl font-semibold mt-1">
                {kpi.value}
                <span className="text-base text-gray-500 ml-1">{kpi.unit}</span>
              </p>
              {kpi.title === "Overall Progress" && (
                <ProgressBar value={kpi.value} />
              )}
            </div>
          ))}
        </div>

        {/* Gantt / Progress Overview */}
        <div className="bg-white rounded-xl shadow-md p-4">
          <h3 className="text-lg font-semibold mb-4">Task Completion Trend</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="tasks" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Milestone Summary */}
        <div className="bg-white rounded-xl shadow-md p-4">
          <h3 className="text-lg font-semibold mb-4">
            Project Milestones Summary
          </h3>
          <div className="space-y-4">
            {milestoneData.map((milestone, index) => (
              <div key={index} className="border-b pb-2">
                <div className="flex justify-between">
                  <p className="font-medium">{milestone.name}</p>
                  <p className="text-sm text-gray-500">{milestone.date}</p>
                </div>
                <ProgressBar value={milestone.progress} />
                <p className="text-xs text-gray-500 mt-1">
                  {milestone.progress}% complete
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// export default Reports;
