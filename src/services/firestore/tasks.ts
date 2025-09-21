import type { Task } from "../../types/task";
import { db } from "../firebase/config";
import { addDoc, collection } from "firebase/firestore";

export async function createTask(projectId: string, newTask: Task) {
  try {
    const tasksRef = collection(db, `projects/${projectId}/tasks`);
    await addDoc(tasksRef, {
      ...newTask,
    });
  } catch (e) {
    console.log(e);
  }
}
