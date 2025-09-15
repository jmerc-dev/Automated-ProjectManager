import { db } from "../firebase/config";
import type { Project } from "../../types/project";
import { Timestamp, doc, getDoc } from "firebase/firestore";
import { useAuth } from "../firebase/auth-context";
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
    });

    console.log("created project successfuly: ", docRef.id);
  } catch (e) {
    console.error("Error adding project");
  }
}

/* Get a specific project document  TODO::::*/
export async function getProjectById(
  projectId: string,
  userId: string | undefined
) {
  const specificProjectRef = doc(db, "projects", projectId);
  const projectSnap = await getDoc(specificProjectRef);

  if (projectSnap.exists()) {
    console.log(projectSnap);
  } else {
    console.log("Error getting project");
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
