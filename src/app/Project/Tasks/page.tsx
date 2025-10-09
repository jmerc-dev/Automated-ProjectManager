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
  updateTask,
  updateTaskOrder,
} from "../../../services/firestore/tasks";

import { changedTaskFields } from "../../../util/task-processing";
import { onMembersSnapshot } from "../../../services/firestore/members";
import type { Member } from "../../../types/member";

interface TasksViewProps {
  projectId?: string;
}

function TasksView({ projectId }: TasksViewProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const ganttRef = useRef<GanttComponent>(null);
  const currentTaskToEdit = useRef<any>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const editOptions: EditSettingsModel = {
    allowAdding: true,
    allowEditing: true,
    allowDeleting: true,
    mode: "Dialog",
    allowTaskbarEditing: true,
  };

  useEffect(() => {
    const loadTasks = async () => {
      if (!projectId) return;

      const rawTasks = await getAllTasks(projectId);
      rawTasks.sort((a, b) => {
        return a.order - b.order;
      });
      setTasks(rawTasks);
    };

    loadTasks();
    if (!projectId) return;
    const unsubscribe = onMembersSnapshot(projectId, setMembers);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    //console.log("Tasks updated: ", tasks);
  }, [tasks]);

  async function updateRowsOnAdd(
    parentId: string | null,
    referenceTaskId: string | null,
    position: "above" | "below"
  ) {
    if (!projectId) return;
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
    resourceInfo: "assignedMembers",
  };

  const resourceFields = {
    id: "id",
    name: "name",
    group: "role",
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
          ref={ganttRef}
          key={projectId}
          enablePersistence={false}
          resources={members}
          resourceFields={resourceFields}
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
          taskbarEditing={(args) => {
            currentTaskToEdit.current = {
              ...args.data,
            };
          }}
          taskbarEdited={(args) => {
            console.log("old data: ", currentTaskToEdit.current);
          }}
          actionBegin={(args) => {
            if (args.requestType === "beforeOpenEditDialog") {
              currentTaskToEdit.current = {
                ...args.rowData,
              };
            }
          }}
          actionComplete={(args) => {
            //console.log("taskbar edited: ", String(args.requestType));
            if (args.requestType === "add") {
              getTaskIndex(projectId).then((taskIndex: number) => {
                const newTask: Task = {
                  ...args.data.taskData,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  docId: taskIndex,
                  assignedMembers: [],
                } as Task;

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
              if (!currentTaskToEdit?.current) {
                return;
              }

              const rawNewTaskData = args.data.taskData;

              const newTask = {
                ...args.data.taskData,
                assignedMembers:
                  rawNewTaskData.assignedMembers?.map(
                    (member: any) => member.id
                  ) || [],
              } as Task;

              console.log("Current Task to edit: ", currentTaskToEdit.current);

              const previousTaskState = {
                docId: currentTaskToEdit?.current?.taskData.docId,
                id: currentTaskToEdit?.current?.id,
                dependency: currentTaskToEdit?.current?.dependency || "",
                notes: currentTaskToEdit?.current?.notes,
                progress: currentTaskToEdit?.current?.progress,
                startDate: currentTaskToEdit?.current?.startDate,
                name: currentTaskToEdit?.current?.name,
                duration: currentTaskToEdit?.current?.duration,
                assignedMembers:
                  currentTaskToEdit?.current?.assignedMembers?.map(
                    (member: any) => member.id
                  ) ?? [],
                //parentId: currentTaskToEdit?.current?.parentId,
                //order: currentTaskToEdit?.current?.order,
              } as Task;

              // console.log("Previous Task: ", previousTaskState);
              // console.log("New Task: ", newTask);

              const changes = changedTaskFields(previousTaskState, newTask);
              const docId = newTask.docId;

              if (!changes) return;
              Object.entries(changes).forEach(([key, value]) => {
                updateTask(projectId, docId, key, value);
              });
            } else if (args.requestType === "delete") {
              const deletedTasks: any = args.data;
              deletedTasks.forEach((task: any) =>
                deleteTask(projectId, task.taskData.docId)
              );
            } else if (
              args.requestType === "rowDropped" ||
              args.requestType === "indented" ||
              args.requestType === "outdented"
            ) {
              // Change parent id here depending on where it was dropped
              const droppedRow = args.data;
              const droppedTaskDocId = droppedRow[0].taskData.docId;
              const droppedTaskParentId = droppedRow[0].taskData.parentId;

              updateTask(
                projectId,
                String(droppedTaskDocId),
                "parentId",
                droppedTaskParentId
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
