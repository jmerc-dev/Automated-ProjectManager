import type { Task } from "../../types/task";
import { db } from "../firebase/config";
import { CoreTaskFields } from "../../types/task";
import type { CoreTaskFieldsType } from "../../types/task";
import {
  addDoc,
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
  onSnapshot,
} from "firebase/firestore";
import { getTaskIndex, incTaskIndex } from "./projects";

export async function createTask(projectId: string, newTask: Task) {
  try {
    // use project taskindex here
    const newTaskId = await getTaskIndex(projectId);

    const tasksRef = doc(db, "projects", projectId, "tasks", String(newTaskId));
    await setDoc(tasksRef, {
      ...newTask,
      docId: newTaskId,
    });

    // increment project taskindex
    incTaskIndex(projectId, newTaskId);
  } catch (e) {
    console.log(e);
  }
}

export async function getAllTasks(projectId: string) {
  const tasksCol = collection(db, "projects", projectId, "tasks");
  const tasksSnapshot = await getDocs(tasksCol);
  const tasks = tasksSnapshot.docs.map((doc) => {
    const docData = doc.data();
    return {
      id: doc.id,
      docId: doc.id,
      ...docData,
      startDate: docData.startDate.toDate(),
    };
  });
  return tasks as Task[];
}

export function listenToTasks(
  projectId: string,
  callback: (tasks: Task[]) => void,
  loadedCallback?: (loaded: boolean) => void
) {
  const tasksCol = collection(db, "projects", projectId, "tasks");
  return onSnapshot(tasksCol, (snapshot) => {
    const tasks = snapshot.docs.map((doc) => {
      const docData = doc.data();
      return {
        id: doc.id,
        docId: doc.id,
        ...docData,
        startDate: docData.startDate?.toDate?.() || new Date(),
      } as Task;
    });
    tasks.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    callback(tasks as Task[]);

    if (loadedCallback) loadedCallback(true);
  });
}

export function listenToTasksByAssignedMember(
  projectId: string,
  memberId: string,
  callback: (tasks: Task[]) => void,
  loadedCallback?: (loaded: boolean) => void
) {
  const tasksCol = collection(db, "projects", projectId, "tasks");
  return onSnapshot(tasksCol, (snapshot) => {
    const tasks = snapshot.docs
      .map((doc) => {
        const docData = doc.data();
        //console.log("Assigned Members:", docData.assignedMembers);
        return {
          id: doc.id,
          docId: doc.id,
          ...docData,
          startDate: docData.startDate?.toDate?.() || new Date(),
          assignedMembers: docData.assignedMembers.map((id: string) => ({
            id,
          })),
        } as Task;
      })
      .filter((task) => {
        //console.log("Checking task:", task.assignedMembers?.[0].id.id);
        return task.assignedMembers?.some((member) => {
          //console.log("Comparing member:", member.id.id, "with", memberId);
          // make sure to fix this in the future with proper typing
          const memberNow: any = member;
          return memberNow.id.id === memberId;
        });
      });
    //console.log("All tasks:", tasks);
    callback(tasks as Task[]);

    if (loadedCallback) loadedCallback(true);
  });
}

export async function deleteTask(projectId: string, taskId: string) {
  const docRef = doc(db, "projects", projectId, "tasks", String(taskId));
  await deleteDoc(docRef);
}

// Update task properties
export async function updateTask(
  projectId: string,
  taskId: string,
  field: CoreTaskFieldsType,
  value: any
) {
  switch (field) {
    case CoreTaskFields.name:
      await updateTaskName(projectId, taskId, value);
      break;
    case CoreTaskFields.duration:
      await updateTaskDuration(projectId, taskId, value);
      break;
    case CoreTaskFields.startDate:
      await updateTaskStartDate(projectId, taskId, value);
      break;
    case CoreTaskFields.dependency:
      await updateTaskDependency(projectId, taskId, value);
      break;
    case CoreTaskFields.progress:
      await updateTaskProgress(projectId, taskId, value);
      break;
    case CoreTaskFields.order:
      await updateTaskOrder(projectId, taskId, value);
      break;
    case CoreTaskFields.notes:
      await updateTaskNotes(projectId, taskId, value);
      break;
    case CoreTaskFields.parentId:
      await updateTaskParentId(projectId, taskId, value);
      break;
    case CoreTaskFields.assignedMembers:
      await updateTaskMembers(projectId, taskId, value);
      break;
    default:
      console.log("Unknown field received:", field);
  }
}

export async function updateTaskName(
  projectId: string,
  taskId: string,
  newName: string
) {
  const docRef = doc(db, "projects", projectId, "tasks", String(taskId));
  await updateDoc(docRef, {
    name: newName,
  });
}

export async function updateTaskDuration(
  projectId: string,
  taskId: string,
  newDuration: number
) {
  const docRef = doc(db, "projects", projectId, "tasks", String(taskId));
  await updateDoc(docRef, {
    duration: newDuration,
  });
}

export async function updateTaskStartDate(
  projectId: string,
  taskId: string,
  newStartDate: Date
) {
  const docRef = doc(db, "projects", projectId, "tasks", String(taskId));
  await updateDoc(docRef, {
    startDate: newStartDate,
  });
}

export async function updateTaskProgress(
  projectId: string,
  taskId: string,
  newProgress: number
) {
  const docRef = doc(db, "projects", projectId, "tasks", String(taskId));
  await updateDoc(docRef, {
    progress: newProgress,
  });
}

export async function updateTaskDependency(
  projectId: string,
  taskId: string,
  newDependency: string
) {
  const docRef = doc(db, "projects", projectId, "tasks", String(taskId));
  await updateDoc(docRef, {
    dependency: newDependency,
  });
}

export async function updateTaskParentId(
  projectId: string,
  taskId: string,
  newParentId: number
) {
  const docRef = doc(db, "projects", projectId, "tasks", String(taskId));
  await updateDoc(docRef, {
    parentId: newParentId,
  });
}

export async function updateTaskNotes(
  projectId: string,
  taskId: string,
  newNotes: string
) {
  const docRef = doc(db, "projects", projectId, "tasks", String(taskId));
  await updateDoc(docRef, {
    notes: newNotes,
  });
}

export async function updateTaskOrder(
  projectId: string,
  taskId: string,
  order: number
) {
  const docRef = doc(db, "projects", projectId, "tasks", String(taskId));
  await updateDoc(docRef, {
    order: order,
  });

  console.log("Updated order to:", order);
}

export async function updateTaskMembers(
  projectId: string,
  taskId: string,
  assignedMembers: string[]
) {
  const docRef = doc(db, "projects", projectId, "tasks", String(taskId));
  await updateDoc(docRef, {
    assignedMembers: assignedMembers,
  });
}

// To fix
// export async function updateTaskParentId(
//   projectId: string,
//   taskId: string,
//   parentId: number
// ) {
//   const docRef = doc(db, "projects", projectId, "tasks", String(taskId));
//   await updateDoc(docRef, {
//     notes: order,
//   });
// }
