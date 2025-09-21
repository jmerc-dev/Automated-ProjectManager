import type { Task } from "../../types/task";
import { db } from "../firebase/config";
import { addDoc, collection } from "firebase/firestore";
import { getDocs } from "firebase/firestore";

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

export async function getAllTasks(projectId: string) {
  const tasksCol = collection(db, "projects", projectId, "tasks");
  const tasksSnapshot = await getDocs(tasksCol);
  const tasks = tasksSnapshot.docs.map((doc) => {
    const docData = doc.data();

    return {
      id: doc.id,
      ...docData,
      createdAt: docData.createdAt.toDate(),
      startDate: docData.startDate.toDate(),
      updatedAt: docData.updatedAt.toDate(),
    };
  });
  return tasks as Task[];
}
