import { db } from "../firebase/config";
import type { Project } from "../../types/project";
import { Timestamp, doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "../firebase/auth-context";

import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";

const projectsRef = collection(db, "projects");

/* Create a project */
export async function createProject(project: Project) {
  const { user } = useAuth();
  if (!user) {
    throw new Error("Invalid Owner of Project");
  }

  try {
    const docRef = await addDoc(collection(db, "projects"), {
      ...project,
      ownerID: user.uid,
      createdAt: new Date(),
      updatedAt: new Date(),
      taskIndex: 0,
    });

    console.log("created project successfuly: ", docRef.id);
  } catch (e) {
    console.error("Error adding project");
  }
}

//Generic function to update project
export async function updateProject(project: Project, key: string) {
  switch (key) {
    case "name":
      updateProjectName(project);
  }
}

async function updateProjectName(project: Project) {
  if (project) {
    updateDoc(doc(db, "projects", project.id), {
      name: project.name,
      updatedAt: new Date(),
    });
  }
}

/* Get a specific project document*/
export async function getProjectById(projectId: string) {
  const specificProjectRef = doc(db, "projects", projectId);
  const projectSnap = await getDoc(specificProjectRef);
  const data = projectSnap.data();
  if (projectSnap.exists() && data) {
    return {
      id: projectSnap.id,
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
  } else {
    return null;
  }
}

/* Get all projects of a specified user */
export async function getProjectsByOwner(userId: string | undefined) {
  if (!userId) {
    console.log("Error: User is not logged in");
    return;
  }

  const q = query(projectsRef, where("ownerID", "==", userId));
  const snapshot = await getDocs(q);

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
      taskIndex: data.taskIndex,
    } as Project;
  });
}

// Last task ID
export async function getTaskIndex(projectId: string) {
  const projectRef = doc(db, "projects", projectId);
  const snap = await getDoc(projectRef);

  if (snap.exists()) {
    return snap.get("taskIndex");
  } else {
    return null;
  }
}

export async function incTaskIndex(projectId: string, lastTaskId: number) {
  if (projectId) {
    updateDoc(doc(db, "projects", projectId), {
      taskIndex: lastTaskId + 1,
      updatedAt: new Date(),
    });
  }
}
