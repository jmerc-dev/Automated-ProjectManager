import { db } from "../firebase/config";
import type { Project } from "../../types/project";
import {
  Timestamp,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { useAuth } from "../firebase/auth-context";

import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import type { User } from "firebase/auth";
import { onSnapshot } from "firebase/firestore";

const projectsRef = collection(db, "projects");

/* Create a project */
export async function createProject(project: Project, user: any) {
  //const { user } = useAuth();
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
// export async function updateProject(project: Project, key: string) {
//   switch (key) {
//     case "name":
//       updateProjectName(project);
//   }
// }

export async function updateProject(
  projectId: string,
  updates: Partial<Project>
) {
  if (projectId) {
    updateDoc(doc(db, "projects", projectId), {
      ...updates,
      updatedAt: new Date(),
    });
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
      expectedEndDate: (data.expectedEndDate as Timestamp).toDate(),
      createdAt: (data.createdAt as Timestamp).toDate(),
      updatedAt: (data.updatedAt as Timestamp).toDate(),
      taskIndex: data.taskIndex,
    } as Project;
  });
}

// Delete Project
export async function deleteProject(projectId: string) {
  const projectRef = doc(db, "projects", projectId);
  await deleteDoc(projectRef);
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

export async function getProjectsByMemberEmail(userEmail: string) {
  const projectsRef = collection(db, "projects");
  const projectsSnap = await getDocs(projectsRef);
  const associatedProjects: any[] = [];

  for (const projectDoc of projectsSnap.docs) {
    const membersRef = collection(db, `projects/${projectDoc.id}/members`);
    const q = query(membersRef, where("emailAddress", "==", userEmail));
    const membersSnap = await getDocs(q);

    if (!membersSnap.empty) {
      associatedProjects.push({
        id: projectDoc.id,
        ...projectDoc.data(),
      });
    }
  }

  return associatedProjects;
}

export function onProjectSnapshot(
  projectId: string,
  callback: (project: Project | null) => void
) {
  const specificProjectRef = doc(db, "projects", projectId);
  return onSnapshot(specificProjectRef, (projectSnap) => {
    const data = projectSnap.data();
    if (projectSnap.exists() && data) {
      callback({
        id: projectSnap.id,
        name: data.name,
        description: data.description,
        ownerID: data.ownerID,
        members: data.members ?? [],
        progress: data.progress,
        status: data.status,
        expectedEndDate: data.expectedEndDate
          ? (data.expectedEndDate as Timestamp).toDate()
          : undefined,
        createdAt: data.createdAt
          ? (data.createdAt as Timestamp).toDate()
          : undefined,
        updatedAt: data.updatedAt
          ? (data.updatedAt as Timestamp).toDate()
          : undefined,
      } as Project);
    } else {
      callback(null);
    }
  });
}
