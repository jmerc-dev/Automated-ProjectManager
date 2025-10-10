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
import type {
  EditDialogFieldSettingsModel,
  EditSettingsModel,
} from "@syncfusion/ej2-react-gantt";
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
  listenToTasks,
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
  const [tasksLoaded, setTasksLoaded] = useState(false);
  const [membersLoaded, setMembersLoaded] = useState(false);
  const editOptions: EditSettingsModel = {
    allowAdding: true,
    allowEditing: true,
    allowDeleting: true,
    mode: "Dialog",
    allowTaskbarEditing: true,
  };

  useEffect(() => {
    // const loadTasks = async () => {
    //   if (!projectId) return;

    //   const rawTasks = await getAllTasks(projectId);
    //   rawTasks.sort((a, b) => {
    //     return a.order - b.order;
    //   });
    //   setTasks(rawTasks);
    // };

    //loadTasks();
    if (!projectId) return;
    const unsubscribeTasks = listenToTasks(projectId, setTasks, setTasksLoaded);
    const unsubscribeMembers = onMembersSnapshot(
      projectId,
      setMembers,
      setMembersLoaded
    );

    return () => {
      unsubscribeMembers();
      unsubscribeTasks();
    };
  }, [projectId]);

  useEffect(() => {
    console.log("Members loaded:", members);
  }, [members]);

  // useEffect(() => {
  //   if (tasksLoaded && membersLoaded) {
  //     // Both are loaded, process here
  //     // Example: bind assignedMembers to member objects
  //     const processedTasks = tasks.map((task) => ({
  //       ...task,
  //       assignedMembers: Array.isArray(task.assignedMembers)
  //         ? task.assignedMembers
  //             .map((id) => members.find((m) => m.id === id))
  //             .filter(Boolean)
  //         : [],
  //     }));
  //     setTasks(processedTasks);
  //     // You can now safely work with processedTasks
  //   }
  // }, [tasksLoaded, membersLoaded, tasks, members]);

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
    unit: "unit",
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

  const editDialogFields: EditDialogFieldSettingsModel[] = [
    { type: "General" },
    { type: "Dependency" },
    { type: "Resources" },
    { type: "Notes" },
  ];

  return (
    <div className="w-full h-[700px] max-h-[500px] min-w-[500px] max-w-[1820px] border-gray-300">
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
          taskType="FixedDuration"
          height="800px"
          editDialogFields={editDialogFields}
          width="1820px"
          gridLines={"Horizontal"}
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

            if (args.requestType === "beforeOpenEditDialog") {
              // Find the progress input and disable it
              setTimeout(() => {
                const progressInput = document.querySelector(
                  'input.e-numerictextbox[title="progress"]'
                );
                console.log("Progress input field: ", progressInput);
                if (progressInput) {
                  progressInput.setAttribute("disabled", "true");
                }

                const spinDown = document.querySelector(
                  'span.e-input-group-icon.e-spin-down[title="Decrement value"]'
                );
                const spinUp = document.querySelector(
                  'span.e-input-group-icon.e-spin-up[title="Increment value"]'
                );
                [spinDown, spinUp].forEach((el) => {
                  if (el) {
                    el.style.pointerEvents = "none";
                    el.style.opacity = "0.5";
                  }
                });
              }, 0);
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
              console.log("Saving task edits...");
              if (!currentTaskToEdit?.current) {
                return;
              }

              const rawNewTaskData = args.data.taskData;

              const newTask = {
                ...args.data.taskData,
              } as Task;

              // console.log("Current Task to edit: ", currentTaskToEdit.current);

              const previousTaskState = {
                docId: currentTaskToEdit?.current?.taskData.docId,
                id: currentTaskToEdit?.current?.id,
                dependency: currentTaskToEdit?.current?.dependency || "",
                notes: currentTaskToEdit?.current?.notes,
                progress: currentTaskToEdit?.current?.progress,
                startDate: currentTaskToEdit?.current?.startDate,
                name: currentTaskToEdit?.current?.name,
                duration: currentTaskToEdit?.current?.duration,
                //parentId: currentTaskToEdit?.current?.parentId,
                //order: currentTaskToEdit?.current?.order,
              } as Task;

              console.log("Previous Task: ", previousTaskState);
              console.log("New Task: ", newTask);

              const changes = changedTaskFields(previousTaskState, newTask);
              const docId = newTask.docId;

              if (!changes) return;
              Object.entries(changes).forEach(([key, value]) => {
                updateTask(projectId, docId, key, value);
              });

              // members changed in here
              updateTask(
                projectId,
                String(newTask.docId),
                "assignedMembers",
                newTask.assignedMembers?.map((m: any) => ({ id: m.id })) || []
              );
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

              // Find all siblings (including the dropped task)
              const siblings = ganttRef.current?.flatData
                .filter((t: any) => t.taskData.parentId === droppedTaskParentId)
                .map((t: any) => t.taskData);

              // Sort siblings by their position in the Gantt chart
              siblings?.sort((a, b) => a.index - b.index);

              // Update order for each sibling
              siblings?.forEach((task: any, idx: number) => {
                if (task.order !== idx) {
                  updateTask(projectId, String(task.docId), "order", idx);
                  console.log(
                    "Updated order for task ",
                    task.docId,
                    " to ",
                    idx
                  );
                }
              });

              // console.log(siblings?.sort((a, b) => a.index - b.index));

              // console.log("Row dropped: ", args);
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
