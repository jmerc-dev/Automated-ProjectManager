import type { Task } from "../../types/task";
import { db } from "../firebase/config";
import {
  addDoc,
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
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

export async function deleteTask(projectId: string, taskId: string) {
  const docRef = doc(db, "projects", projectId, "tasks", String(taskId));
  await deleteDoc(docRef);
}

export async function updateTaskOrder(
  projectId: string,
  taskId: string,
  taskOrder: number
) {
  try {
    // await updateDoc(doc(db, "projects", projectId, "tasks", taskId), {
    //   order: taskOrder,
    // });
  } catch (e) {
    console.error("Failed to update task order:", e);
  }
}
