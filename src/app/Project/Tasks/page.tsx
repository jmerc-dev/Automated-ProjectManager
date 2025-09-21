import "../../../styles/frappe-gantt.css";
import {
  GanttComponent,
  ContextMenu,
  Inject,
  Selection,
  DayMarkers,
  Edit,
  Filter,
  Toolbar,
  CriticalPath,
  RowDD,
} from "@syncfusion/ej2-react-gantt";
import type { EditSettingsModel } from "@syncfusion/ej2-react-gantt";
import { useEffect, useState, useRef } from "react";
import type { Task } from "../../../types/task";
import {
  getTaskIndex,
  updateTaskIndex,
} from "../../../services/firestore/projects";
import { createTask } from "../../../services/firestore/tasks";

interface TasksViewProps {
  projectId: string;
}

function TasksView({ projectId }: TasksViewProps) {
  const [tasks, setTasks] = useState<Task[]>([]);

  const editOptions: EditSettingsModel = {
    allowAdding: true,
    allowEditing: true,
    allowDeleting: true,
    mode: "Dialog",
    allowTaskbarEditing: true,
  };

  const taskFields: any = {
    id: "id",
    name: "name",
    startDate: "startDate",
    duration: "duration",
    progress: "progress",
    parentID: "parentId",
    dependency: "dependency",
    notes: "notes",
  };

  const toolbarOptions = [
    "PrevTimeSpan",
    "NextTimeSpan",
    "ExpandAll",
    "CollapseAll",
    "Search",
    "Indent",
    "Outdent",
  ];

  return (
    <div className="w-full h-[700px] max-h-[500px] min-w-[500px] border-gray-300">
      {projectId && (
        <GanttComponent
          key={projectId}
          workWeek={[
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ]}
          columns={[
            { field: "id", headerText: "ID", width: 60 },
            { field: "name", headerText: "Task Name", width: 200 },
            { field: "startDate", headerText: "Start Date", width: 100 },
            { field: "duration", headerText: "Duration", width: 100 },
          ]}
          taskFields={taskFields}
          dataSource={tasks}
          height="800px"
          width="1820px"
          gridLines={"Both"}
          allowSelection={true}
          editSettings={editOptions}
          toolbar={toolbarOptions}
          enableCriticalPath={true}
          allowRowDragAndDrop={true}
          enableContextMenu={true}
          actionComplete={(args) => {
            if (args.requestType === "add") {
              getTaskIndex(projectId).then((taskIndex: number) => {
                const newTask = args.data as any;
                const formattedTask: Task = {
                  ...newTask.taskData,
                  createdAt: new Date(),
                  assignedMembers: [],
                  updatedAt: new Date(),
                } as Task;

                updateTaskIndex(projectId, taskIndex);
                createTask(projectId, formattedTask);
              });
            } else if (args.requestType === "save") {
              console.log("updated");
            } else if (args.requestType === "delete") {
              console.log("deleted");
            }
          }}
        >
          <Inject
            services={[
              Edit,
              CriticalPath,
              Selection,
              DayMarkers,
              Toolbar,
              Filter,
              RowDD,
              ContextMenu,
            ]}
          />
        </GanttComponent>
      )}
    </div>
  );
}

export default TasksView;
