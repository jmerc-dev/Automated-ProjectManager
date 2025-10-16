import { db } from "../firebase/config";
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  doc,
  query,
  getDocs,
  limit,
} from "firebase/firestore";
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

export function listenToTaskComments(
  projectId: string,
  taskId: string,
  callback: (comments: Comment[]) => void
) {
  const commentsCollection = getTaskCommentsCollection(projectId, taskId);
  // Implement real-time listener logic here if needed
  return onSnapshot(commentsCollection, (snapshot) => {
    const comments: Comment[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Comment, "id">),
      createdAt: doc.data().createdAt.toDate(),
    }));
    comments.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    callback(comments);
  });
}

export async function getRecentComment(
  projectId: string,
  taskId: string
): Promise<Comment | null> {
  const q = query(
    getTaskCommentsCollection(projectId, taskId),
    orderBy("createdAt", "desc"),
    limit(1)
  );
  const snapshot = await getDocs(q);
  const comments = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Comment, "id">),
    createdAt: doc.data().createdAt.toDate(),
  }));
  return comments.length > 0 ? comments[0] : null;
}
