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
  Dependency,
} from "@syncfusion/ej2-react-gantt";
import type { EditSettingsModel } from "@syncfusion/ej2-react-gantt";
import { useEffect, useState, useRef } from "react";
import type { Task } from "../../../types/task";
import {
  getTaskIndex,
  incTaskIndex,
} from "../../../services/firestore/projects";
import {
  createTask,
  deleteTask,
  getAllTasks,
  updateTaskOrder,
} from "../../../services/firestore/tasks";

interface TasksViewProps {
  projectId: string;
}

function TasksView({ projectId }: TasksViewProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const ganttRef = useRef<GanttComponent>(null);
  const editOptions: EditSettingsModel = {
    allowAdding: true,
    allowEditing: true,
    allowDeleting: true,
    mode: "Dialog",
    allowTaskbarEditing: true,
  };

  useEffect(() => {
    const loadTasks = async () => {
      const rawTasks = await getAllTasks(projectId);
      rawTasks.sort((a, b) => {
        return a.order - b.order;
      });
      setTasks(rawTasks);
    };

    loadTasks();
  }, []);

  async function updateRowsOnAdd(
    parentId: string | null,
    referenceTaskId: string | null,
    position: "above" | "below"
  ) {
    const siblings = tasks.filter((t) => t.parentId === parentId);
    const refIndex = referenceTaskId
      ? siblings.findIndex((t) => t.id === referenceTaskId)
      : siblings.length;

    const insertIndex = position === "above" ? refIndex : refIndex + 1;

    // Increment order of siblings at/after insertIndex
    for (let i = insertIndex; i < siblings.length; i++) {
      siblings[i].order += 1;

      console.log(siblings[i].id, "|Order: ", siblings[i].order);
      await updateTaskOrder(
        projectId,
        String(siblings[i].docId),
        siblings[i].order
      );
    }

    setTasks((prevTasks) =>
      prevTasks.map((t) => {
        const updated = siblings.find((s) => s.id === t.id);
        return updated ? updated : t;
      })
    );
  }

  const taskFields: any = {
    id: "id",
    name: "name",
    startDate: "startDate",
    duration: "duration",
    progress: "progress",
    parentID: "parentId",
    dependency: "dependency",
    notes: "notes",
    order: "order",
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

  // const onRowDragStop = async (args: any) => {
  //   const movedTask = args.data;
  //   const siblings = ganttRef
  //     .current!.flatData.filter((t) => t.parentId === movedTask.parentId)
  //     .sort((a, b) => a.ganttProperties?.index - b.ganttProperties?.index);

  //   // Recalculate order
  //   for (let i = 0; i < siblings.length; i++) {
  //     siblings[i].order = i;
  //     // Update Firestore
  //     await updateDoc(doc(db, "projects", projectId, "tasks", siblings[i].id), {
  //       order: i,
  //     });
  //   }
  // };

  return (
    <div className="w-full h-[700px] max-h-[500px] min-w-[500px] border-gray-300">
      {projectId && (
        <GanttComponent
          ref={ganttRef}
          key={projectId}
          enablePersistence={true}
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
            { field: "order", headerText: "Order", width: 100 },
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
                // TODO:
                //    Get added task & Get The whole task
                const newTask: Task = {
                  ...args.data.taskData,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  docId: taskIndex,
                  assignedMembers: [],
                } as Task;
                //const oldAllTasks = ganttRef.current?.flatData;

                // For ordering purposes only
                const allTasks: Task[] =
                  ganttRef.current?.flatData.map((t: any) => ({
                    id: t.taskData.id,
                    name: t.taskData.name,
                    order: t.taskData.order ?? 0,
                    startDate: t.taskData.startDate || new Date(),
                    duration: t.taskData?.duration || 1,
                    progress: t.taskData?.progress ?? 0,
                    dependency: t.taskData?.dependency ?? null,
                    parentId: t.taskData?.parentId ?? null,
                    notes: t.taskData?.notes ?? "",
                    docId: t.taskData?.docId ?? "",
                  })) || [];
                if (!allTasks) return;
                const newTaskIndex = allTasks.findIndex(
                  (task) => task.id == newTask.id
                );
                allTasks[newTaskIndex].docId = String(taskIndex);

                setTasks(allTasks);

                createTask(projectId, allTasks[newTaskIndex]);
              });
            } else if (args.requestType === "save") {
              console.log("updated");
            } else if (args.requestType === "delete") {
              const deletedTasks: any = args.data;
              deletedTasks.forEach((task: any) =>
                deleteTask(projectId, task.taskData.docId)
              );
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
