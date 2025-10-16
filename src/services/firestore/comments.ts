import { db } from "../firebase/config";
import { collection, addDoc } from "firebase/firestore";
import type { Comment } from "../../types/comment";

export function getTaskCommentsCollection(projectId: string, taskId: string) {
  return collection(db, `projects/${projectId}/tasks/${taskId}/comments`);
}

export async function addCommentToTask(
  projectId: string,
  taskId: string,
  comment: Omit<Comment, "id" | "createdAt">
) {
  const commentsCollection = getTaskCommentsCollection(projectId, taskId);
  const docRef = await addDoc(commentsCollection, {
    ...comment,
    createdAt: new Date(),
  });
  return docRef.id;
}
