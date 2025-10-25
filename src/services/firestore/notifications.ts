import { db } from "../firebase/config";
import {
  collection,
  doc,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
  QuerySnapshot,
  arrayUnion,
} from "firebase/firestore";
import type { Notification } from "../../types/notification";

const notificationsCollection = (projectId: string) =>
  collection(db, "projects", projectId, "notifications");

export async function addNotification(
  projectId: string,
  notification: Omit<Notification, "id" | "createdAt" | "readBy">
) {
  const docRef = await addDoc(notificationsCollection(projectId), {
    ...notification,
    createdAt: new Date(),
    readBy: [],
  });
  return docRef.id;
}

export function listenToNotifications(
  projectId: string,
  userEmail: string,
  callback: (notifications: Notification[]) => void
) {
  const unsubscribe = onSnapshot(
    notificationsCollection(projectId),
    (snapshot) => {
      const notifications = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
      })) as Notification[];
      notifications.filter((notification) => {
        if (notification.isMemberSpecific) {
          return notification.targetMembers?.includes(userEmail);
        } else {
          alert("This is still on development.");
          return true;
        }
      });
      notifications.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      );
      callback(notifications);
    }
  );

  return unsubscribe;
}

export async function markNotificationAsRead(
  projectId: string,
  notificationId: string,
  userEmail: string
) {
  const notificationRef = doc(
    notificationsCollection(projectId),
    notificationId
  );
  return updateDoc(notificationRef, {
    readBy: arrayUnion(userEmail),
  });
}
