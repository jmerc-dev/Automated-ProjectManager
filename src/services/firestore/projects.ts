import { db } from "../../config/firebase/config";
import type { Project } from "../../types/project";
import { Timestamp } from "firebase/firestore";
import { auth } from "../../config/firebase/config";

import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";

const projectsRef = collection(db, "projects");

export async function createProject(project: Project) {
  if (!auth.currentUser) {
    throw new Error("Invalid Owner of Project");
  }

  try {
    const docRef = await addDoc(collection(db, "projects"), {
      ...project,
      ownerID: auth.currentUser?.uid,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log("created project successfuly: ", docRef.id);
  } catch (e) {
    console.error("Error adding project");
  }
}

export async function getProjectsByOwner(userId: string | undefined) {
  if (!userId) {
    console.log("Error: User is not logged in");
    return;
  }

  const q = query(projectsRef, where("ownerID", "==", userId));
  const snapshot = await getDocs(q);
  console.log(snapshot.docs);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      description: data.description,
      ownerID: data.ownerID,
      members: data.members ?? [],
      progress: data.progress,
      status: data.status,
      startDate: (data.startDate as Timestamp).toDate(),
      expectedEndDate: (data.expectedEndDate as Timestamp).toDate(),
      createdAt: (data.createdAt as Timestamp).toDate(),
      updatedAt: (data.updatedAt as Timestamp).toDate(),
    } as Project;
  });
  //   return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}
